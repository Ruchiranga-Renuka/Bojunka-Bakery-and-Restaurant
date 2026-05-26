package com.bojunka.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    @DBRef
    private Food item;
    
    private Integer quantity;
    private String customer;
    private Date date;
    private String receiptNumber;
    private Date receiptIssuedAt;
    private Boolean thankYouSmsSent;
}
