package com.bojunka.backend.service;

import com.bojunka.backend.dto.BillResponse;
import com.bojunka.backend.dto.OrderRequest;
import com.bojunka.backend.dto.OrderResponse;
import com.bojunka.backend.dto.ReceiptResponse;
import com.bojunka.backend.model.Food;
import com.bojunka.backend.model.Order;
import com.bojunka.backend.model.User;
import com.bojunka.backend.repository.FoodRepository;
import com.bojunka.backend.repository.OrderRepository;
import com.bojunka.backend.repository.UserRepository;
import com.bojunka.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class OrderService {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> placeOrder(OrderRequest request) {
        Food food = foodRepository.findById(request.getItemId()).orElse(null);
        if (food == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Food not found\"}");
        }

        if (food.getQuantity() < request.getQuantity()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Not enough stock\"}");
        }

        food.setQuantity(food.getQuantity() - request.getQuantity());
        foodRepository.save(food);

        Order order = new Order();
        order.setItem(food);
        order.setQuantity(request.getQuantity());
        order.setCustomer(resolveCustomerUsername());
        order.setDate(new Date());

        orderRepository.save(order);

        return ResponseEntity.ok("{\"message\": \"Order placed successfully\"}");
    }

    private static final String BUSINESS_NAME = "Bojunka Bakery and Restaurant";

    public List<OrderResponse> getOrdersForCurrentUser() {
        List<Order> orders = orderRepository.findByCustomerInOrderByDateDesc(customerLookupKeys());
        return orders.stream().map(this::toResponse).toList();
    }

    public BillResponse getBillForCurrentUser() {
        List<OrderResponse> items = getPendingBillItems();
        return new BillResponse(items, sumTotals(items), items.size());
    }

    public ReceiptResponse issueReceiptForCurrentUser() {
        List<String> keys = customerLookupKeys();
        List<Order> pending = orderRepository.findByCustomerInAndReceiptNumberIsNullOrderByDateDesc(keys);
        if (pending.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No items on the bill to receipt");
        }

        String receiptNumber = generateReceiptNumber();
        Date issuedAt = new Date();
        for (Order order : pending) {
            order.setReceiptNumber(receiptNumber);
            order.setReceiptIssuedAt(issuedAt);
        }
        orderRepository.saveAll(pending);

        User user = userRepository.findByUsername(resolveCustomerUsername()).orElseThrow();
        List<OrderResponse> items = pending.stream().map(this::toResponse).toList();
        return new ReceiptResponse(
                receiptNumber,
                issuedAt,
                user.getName() != null && !user.getName().isBlank() ? user.getName() : user.getUsername(),
                BUSINESS_NAME,
                items,
                sumTotals(items)
        );
    }

    public ReceiptResponse getReceiptForCurrentUser(String receiptNumber) {
        List<Order> orders = orderRepository.findByCustomerInAndReceiptNumberOrderByDateDesc(
                customerLookupKeys(),
                receiptNumber
        );
        if (orders.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Receipt not found");
        }

        User user = userRepository.findByUsername(resolveCustomerUsername()).orElseThrow();
        List<OrderResponse> items = orders.stream().map(this::toResponse).toList();
        return new ReceiptResponse(
                receiptNumber,
                orders.get(0).getReceiptIssuedAt(),
                user.getName() != null && !user.getName().isBlank() ? user.getName() : user.getUsername(),
                BUSINESS_NAME,
                items,
                sumTotals(items)
        );
    }

    private List<OrderResponse> getPendingBillItems() {
        return orderRepository.findByCustomerInAndReceiptNumberIsNullOrderByDateDesc(customerLookupKeys())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private double sumTotals(List<OrderResponse> items) {
        return items.stream().mapToDouble(item -> item.getTotal() != null ? item.getTotal() : 0).sum();
    }

    private String generateReceiptNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "RCP-" + timestamp;
    }

    private OrderResponse toResponse(Order order) {
        Food item = order.getItem();
        double price = item.getPrice() != null ? item.getPrice() : 0;
        int qty = order.getQuantity() != null ? order.getQuantity() : 0;

        return new OrderResponse(
                order.getId(),
                item.getName(),
                item.getPrice(),
                qty,
                item.getCategory(),
                order.getDate(),
                price * qty,
                order.getReceiptNumber()
        );
    }

    private String resolveCustomerUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails details) {
            return details.getUsername();
        }
        throw new IllegalStateException("Not authenticated");
    }

    private List<String> customerLookupKeys() {
        String username = resolveCustomerUsername();
        User user = userRepository.findByUsername(username).orElseThrow();

        Set<String> keys = new LinkedHashSet<>();
        keys.add(username);
        if (user.getName() != null && !user.getName().isBlank()) {
            keys.add(user.getName().trim());
        }
        return new ArrayList<>(keys);
    }
}
