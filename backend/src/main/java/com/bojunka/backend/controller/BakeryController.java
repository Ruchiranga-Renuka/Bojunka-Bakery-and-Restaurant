package com.bojunka.backend.controller;

import com.bojunka.backend.dto.OrderRequest;
import com.bojunka.backend.model.Food;
import com.bojunka.backend.model.Order;
import com.bojunka.backend.repository.FoodRepository;
import com.bojunka.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/bakery")
public class BakeryController {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/foods")
    public ResponseEntity<List<Food>> getFoods() {
        return ResponseEntity.ok(foodRepository.findByCategory("bakery"));
    }

    @PostMapping("/foods")
    public ResponseEntity<Food> addFood(@RequestBody Food food) {
        food.setCategory("bakery");
        return ResponseEntity.ok(foodRepository.save(food));
    }

    @PostMapping("/orders")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        Food food = foodRepository.findById(request.getItemId()).orElse(null);
        if (food == null) return ResponseEntity.badRequest().body("{\"error\": \"Food not found\"}");
        
        if (food.getQuantity() < request.getQuantity()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Not enough stock\"}");
        }

        food.setQuantity(food.getQuantity() - request.getQuantity());
        foodRepository.save(food);

        Order order = new Order();
        order.setItem(food);
        order.setQuantity(request.getQuantity());
        order.setCustomer(request.getCustomer());
        order.setDate(new Date());
        
        orderRepository.save(order);
        
        return ResponseEntity.ok("{\"message\": \"Order placed successfully\"}");
    }
}
