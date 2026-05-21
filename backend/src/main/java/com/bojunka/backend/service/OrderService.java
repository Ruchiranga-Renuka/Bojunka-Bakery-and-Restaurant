package com.bojunka.backend.service;

import com.bojunka.backend.dto.OrderRequest;
import com.bojunka.backend.dto.OrderResponse;
import com.bojunka.backend.model.Food;
import com.bojunka.backend.model.Order;
import com.bojunka.backend.model.User;
import com.bojunka.backend.repository.FoodRepository;
import com.bojunka.backend.repository.OrderRepository;
import com.bojunka.backend.repository.UserRepository;
import com.bojunka.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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

    public List<OrderResponse> getOrdersForCurrentUser() {
        List<Order> orders = orderRepository.findByCustomerInOrderByDateDesc(customerLookupKeys());
        return orders.stream().map(this::toResponse).toList();
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
                price * qty
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
