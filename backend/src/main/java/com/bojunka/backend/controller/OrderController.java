package com.bojunka.backend.controller;

import com.bojunka.backend.dto.OrderResponse;
import com.bojunka.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(orderService.getOrdersForCurrentUser());
    }
}
