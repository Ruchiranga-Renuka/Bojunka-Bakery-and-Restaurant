package com.bojunka.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String name;
    private String idNumber;
    private String phoneNumber;
    
    private String username;
    private String passwordHash;
    private String role; // 'customer' or 'admin'
}
