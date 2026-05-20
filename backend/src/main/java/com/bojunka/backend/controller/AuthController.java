package com.bojunka.backend.controller;

import com.bojunka.backend.dto.AuthRequest;
import com.bojunka.backend.dto.AuthResponse;
import com.bojunka.backend.dto.ErrorResponse;
import com.bojunka.backend.dto.MessageResponse;
import com.bojunka.backend.dto.RegisterRequest;
import com.bojunka.backend.dto.UserProfileResponse;
import com.bojunka.backend.model.User;
import com.bojunka.backend.repository.UserRepository;
import com.bojunka.backend.security.CustomUserDetails;
import com.bojunka.backend.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtTokenProvider jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername().trim(),
                            request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateToken(authentication);

            User user = userRepository.findByUsername(request.getUsername().trim()).orElseThrow();
            return ResponseEntity.ok(new AuthResponse(jwt, user.getRole().toLowerCase()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid username or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        String username = request.getUsername().trim();

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Username is already taken"));
        }

        String role = request.getRole() != null ? request.getRole().trim().toLowerCase() : "customer";
        if ("admin".equals(role)) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Admin accounts cannot be registered publicly"));
        }
        if (!"customer".equals(role)) {
            role = "customer";
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setIdNumber(request.getIdNumber().trim());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        user.setUsername(username);
        user.setRole(role);
        user.setPasswordHash(encoder.encode(request.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails details)) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }
        User user = userRepository.findByUsername(details.getUsername()).orElseThrow();
        return ResponseEntity.ok(new UserProfileResponse(
                user.getUsername(),
                user.getName(),
                user.getRole().toLowerCase()
        ));
    }
}
