package com.bojunka.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String name;
    private String idNumber;
    private String phoneNumber;
    
    private String username;
    private String passwordHash;
    private String role; // 'restaurant', 'bakery', 'admin'
}
