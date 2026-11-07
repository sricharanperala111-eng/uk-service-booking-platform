package com.ukservices.booking.controller;

import com.ukservices.booking.dto.response.ApiResponse;
import com.ukservices.booking.dto.response.BookingResponse;
import com.ukservices.booking.dto.response.DashboardStatsResponse;
import com.ukservices.booking.dto.response.UserProfileResponse;
import com.ukservices.booking.service.AdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Operations", description = "Endpoints for administrators to monitor operations and manage orders")
public class AdminController {

    private final AdminDashboardService adminDashboardService;

    public AdminController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform overview metrics, revenue, and order breakdown")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = adminDashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/bookings")
    @Operation(summary = "List all platform bookings across all customers")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> bookings = adminDashboardService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/customers")
    @Operation(summary = "List registered customers")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllCustomers() {
        List<UserProfileResponse> customers = adminDashboardService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.ok(customers));
    }
}
