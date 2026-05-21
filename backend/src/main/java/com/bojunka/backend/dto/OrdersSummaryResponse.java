package com.bojunka.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrdersSummaryResponse {
    private List<OrderResponse> orders;
    private BillResponse bill;
}
