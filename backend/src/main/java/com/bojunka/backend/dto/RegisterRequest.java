package com.bojunka.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "is required")
    private String username;

    @NotBlank(message = "is required")
    @Size(min = 6, message = "must be at least 6 characters")
    private String password;

    private String role;

    @NotBlank(message = "is required")
    private String name;

    @NotBlank(message = "is required")
    private String idNumber;

    @NotBlank(message = "is required")
    private String phoneNumber;
}
