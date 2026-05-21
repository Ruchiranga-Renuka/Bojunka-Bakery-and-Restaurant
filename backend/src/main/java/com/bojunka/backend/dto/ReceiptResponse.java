package com.bojunka.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiptResponse {
    private String receiptNumber;
    private Date issuedAt;
    private String customerName;
    private String businessName;
    private List<OrderResponse> items;
    private Double totalAmount;
}
