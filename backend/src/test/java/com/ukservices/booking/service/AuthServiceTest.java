package com.ukservices.booking.service;

import com.ukservices.booking.config.JwtTokenProvider;
import com.ukservices.booking.dto.request.LoginRequest;
import com.ukservices.booking.dto.request.RegisterRequest;
import com.ukservices.booking.dto.response.AuthResponse;
import com.ukservices.booking.entity.User;
import com.ukservices.booking.entity.enums.Role;
import com.ukservices.booking.exception.BadRequestException;
import com.ukservices.booking.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private JwtTokenProvider tokenProvider;
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        String testSecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
        tokenProvider = new JwtTokenProvider(testSecret, 86400000L);
        authService = new AuthService(userRepository, passwordEncoder, tokenProvider);

        sampleUser = new User(1L, "Alice", "Brown", "alice.brown@example.co.uk",
                "encodedPassword", "+447700900999", "12 Piccadilly", "M1 1AA", Role.ROLE_CUSTOMER);
    }

    @Test
    @DisplayName("Should successfully register a new user with hashed password and return genuine JWT")
    void shouldRegisterNewUser() {
        RegisterRequest request = new RegisterRequest("Alice", "Brown", "alice.brown@example.co.uk",
                "RawPassword123!", "+447700900999", "12 Piccadilly", "M1 1AA");

        when(userRepository.existsByEmail("alice.brown@example.co.uk")).thenReturn(false);
        when(passwordEncoder.encode("RawPassword123!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(tokenProvider.validateToken(response.getToken()));
        assertEquals("alice.brown@example.co.uk", response.getUser().getEmail());
        verify(passwordEncoder, times(1)).encode("RawPassword123!");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration when email is already registered")
    void shouldRejectDuplicateEmailRegistration() {
        RegisterRequest request = new RegisterRequest("Alice", "Brown", "alice.brown@example.co.uk",
                "RawPassword123!", "+447700900999", "12 Piccadilly", "M1 1AA");

        when(userRepository.existsByEmail("alice.brown@example.co.uk")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should authenticate user and return token when credentials match")
    void shouldLoginSuccessfully() {
        LoginRequest request = new LoginRequest("alice.brown@example.co.uk", "RawPassword123!");

        when(userRepository.findByEmail("alice.brown@example.co.uk")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("RawPassword123!", "encodedPassword")).thenReturn(true);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(tokenProvider.validateToken(response.getToken()));
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when password does not match")
    void shouldFailLoginWithWrongPassword() {
        LoginRequest request = new LoginRequest("alice.brown@example.co.uk", "WrongPassword");

        when(userRepository.findByEmail("alice.brown@example.co.uk")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }
}
