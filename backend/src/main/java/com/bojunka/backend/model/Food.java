package com.bojunka.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "foods")
public class Food {
    @Id
    private String id;
    private String name;
    private Double price;
    private String category; // 'restaurant' or 'bakery'
    private Integer quantity;
}
