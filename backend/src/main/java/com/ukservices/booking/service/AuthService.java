package com.ukservices.booking.service;

import com.ukservices.booking.config.JwtTokenProvider;
import com.ukservices.booking.dto.request.LoginRequest;
import com.ukservices.booking.dto.request.RegisterRequest;
import com.ukservices.booking.dto.response.AuthResponse;
import com.ukservices.booking.dto.response.UserProfileResponse;
import com.ukservices.booking.entity.User;
import com.ukservices.booking.entity.enums.Role;
import com.ukservices.booking.exception.BadRequestException;
import com.ukservices.booking.exception.ResourceNotFoundException;
import com.ukservices.booking.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with email " + normalizedEmail + " already exists.");
        }

        User user = new User();
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone().trim());
        user.setAddress(request.getAddress().trim());
        user.setPostcode(request.getPostcode().trim().toUpperCase());
        user.setRole(Role.ROLE_CUSTOMER);

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser);

        return new AuthResponse(token, UserProfileResponse.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user);
        return new AuthResponse(token, UserProfileResponse.fromEntity(user));
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserProfileResponse.fromEntity(user);
    }
}
