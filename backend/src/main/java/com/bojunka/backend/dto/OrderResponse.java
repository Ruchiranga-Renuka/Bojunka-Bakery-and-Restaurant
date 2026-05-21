package com.bojunka.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private String id;
    private String itemName;
    private Double itemPrice;
    private Integer quantity;
    private String category;
    private Date date;
    private Double total;
}
