package com.bojunka.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillResponse {
    private List<OrderResponse> items;
    private Double totalAmount;
    private Integer itemCount;
}
