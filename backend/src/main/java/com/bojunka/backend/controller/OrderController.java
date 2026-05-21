package com.bojunka.backend.controller;

import com.bojunka.backend.dto.BillResponse;
import com.bojunka.backend.dto.OrderResponse;
import com.bojunka.backend.dto.ReceiptResponse;
import com.bojunka.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping("/bill")
    public ResponseEntity<BillResponse> getBill() {
        return ResponseEntity.ok(orderService.getBillForCurrentUser());
    }

    @PostMapping("/receipt")
    public ResponseEntity<ReceiptResponse> issueReceipt() {
        return ResponseEntity.ok(orderService.issueReceiptForCurrentUser());
    }

    @GetMapping("/receipt/{receiptNumber}")
    public ResponseEntity<ReceiptResponse> getReceipt(@PathVariable String receiptNumber) {
        return ResponseEntity.ok(orderService.getReceiptForCurrentUser(receiptNumber));
    }
}
