package com.ukservices.booking.service;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHashTest {
    
    @Test
    public void generateBCryptHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "AdminPass123!";
        String hash = encoder.encode(password);
        System.out.println("Password: " + password);
        System.out.println("Hash: " + hash);
        System.out.println("Matches: " + encoder.matches(password, hash));
    }
}
