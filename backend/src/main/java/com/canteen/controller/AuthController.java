package com.canteen.controller;

import com.canteen.dto.ApiResponse;
import com.canteen.dto.AuthResponse;
import com.canteen.dto.LoginRequest;
import com.canteen.dto.RegisterRequest;
import com.canteen.dto.UserDto;
import com.canteen.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.ok("Registration successful! Welcome to College Canteen.", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful!", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(ApiResponse.error("Not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        UserDto user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved successfully", user));
    }
}
