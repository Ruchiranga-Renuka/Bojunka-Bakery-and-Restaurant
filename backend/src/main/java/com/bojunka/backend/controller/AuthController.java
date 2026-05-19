package com.bojunka.backend.controller;

import com.bojunka.backend.dto.AuthRequest;
import com.bojunka.backend.dto.AuthResponse;
import com.bojunka.backend.dto.RegisterRequest;
import com.bojunka.backend.dto.UserProfileResponse;
import com.bojunka.backend.model.User;
import com.bojunka.backend.repository.UserRepository;
import com.bojunka.backend.security.CustomUserDetails;
import com.bojunka.backend.security.JwtTokenProvider;
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
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest request) {
        if (request.getUsername() == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"username required\"}");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateToken(authentication);

            User user = userRepository.findByUsername(request.getUsername()).get();
            return ResponseEntity.ok(new AuthResponse(jwt, user.getRole()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("{\"error\": \"invalid credentials\"}");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"username and password required\"}");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Username is already taken!\"}");
        }

        String role = request.getRole() != null ? request.getRole().trim().toLowerCase() : "customer";
        if ("admin".equals(role)) {
            return ResponseEntity.badRequest().body("{\"error\": \"Admin accounts cannot be registered publicly\"}");
        }
        if (!"customer".equals(role)) {
            role = "customer";
        }

        User user = new User();
        user.setName(request.getName());
        user.setIdNumber(request.getIdNumber());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setUsername(request.getUsername());
        user.setRole(role);
        user.setPasswordHash(encoder.encode(request.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok("{\"message\": \"User registered successfully!\"}");
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails details)) {
            return ResponseEntity.status(401).body("{\"error\": \"Not authenticated\"}");
        }
        User user = userRepository.findByUsername(details.getUsername())
                .orElseThrow();
        return ResponseEntity.ok(new UserProfileResponse(
                user.getUsername(),
                user.getName(),
                user.getRole()
        ));
    }
}
