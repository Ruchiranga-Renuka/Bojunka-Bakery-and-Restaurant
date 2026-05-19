package com.bojunka.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
    @NotBlank(message = "is required")
    private String username;

    @NotBlank(message = "is required")
    private String password;
}
