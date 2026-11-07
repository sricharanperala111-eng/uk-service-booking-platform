package com.ukservices.booking.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String adminPass = "AdminPass123!";
        String customerPass = "CustomerPass123!";
        
        String adminHash = encoder.encode(adminPass);
        String customerHash = encoder.encode(customerPass);
        
        System.out.println("Admin Password Hash:");
        System.out.println("Password: " + adminPass);
        System.out.println("Hash: " + adminHash);
        System.out.println();
        
        System.out.println("Customer Password Hash:");
        System.out.println("Password: " + customerPass);
        System.out.println("Hash: " + customerHash);
    }
}
