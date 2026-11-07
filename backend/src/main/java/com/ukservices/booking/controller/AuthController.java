package com.ukservices.booking.controller;

import com.ukservices.booking.dto.request.LoginRequest;
import com.ukservices.booking.dto.request.RegisterRequest;
import com.ukservices.booking.dto.response.ApiResponse;
import com.ukservices.booking.dto.response.AuthResponse;
import com.ukservices.booking.dto.response.UserProfileResponse;
import com.ukservices.booking.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for customer registration, authentication, and profile")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful. Welcome to UK Services!", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate customer or admin and obtain JWT")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful.", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileResponse profile = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
