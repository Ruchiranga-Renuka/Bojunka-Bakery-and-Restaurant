package com.bojunka.backend.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String itemId;
    private Integer quantity;
    private String customer;
}
