package com.bojunka.backend.controller;

import com.bojunka.backend.dto.OrderRequest;
import com.bojunka.backend.model.Food;
import com.bojunka.backend.repository.FoodRepository;
import com.bojunka.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private OrderService orderService;

    @GetMapping("/foods")
    public ResponseEntity<List<Food>> getFoods() {
        return ResponseEntity.ok(foodRepository.findByCategory("restaurant"));
    }

    @PostMapping("/foods")
    public ResponseEntity<Food> addFood(@RequestBody Food food) {
        food.setCategory("restaurant");
        return ResponseEntity.ok(foodRepository.save(food));
    }

    @PostMapping("/orders")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        return orderService.placeOrder(request);
    }
}
