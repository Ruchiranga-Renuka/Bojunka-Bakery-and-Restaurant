package com.bojunka.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String role;
    private String name;
    private String idNumber;
    private String phoneNumber;
}
