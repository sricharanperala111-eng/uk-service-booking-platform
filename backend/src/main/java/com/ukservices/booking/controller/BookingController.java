package com.ukservices.booking.controller;

import com.ukservices.booking.dto.request.CreateBookingRequest;
import com.ukservices.booking.dto.request.UpdateBookingStatusRequest;
import com.ukservices.booking.dto.response.ApiResponse;
import com.ukservices.booking.dto.response.BookingResponse;
import com.ukservices.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings", description = "Endpoints for creating, managing, and tracking service orders")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Create a new service booking with double-booking prevention")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {

        BookingResponse response = bookingService.createBooking(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking confirmed successfully.", response));
    }

    @GetMapping
    @Operation(summary = "Get bookings for the authenticated user")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<BookingResponse> bookings = bookingService.getBookingsForUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single booking by ID (Owner or Admin)")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        BookingResponse booking = bookingService.getBookingById(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update booking status with state transition checks (Admin only)")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {

        BookingResponse updated = bookingService.updateBookingStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated to " + request.getStatus(), updated));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an existing booking (Owner or Admin)")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        BookingResponse response = bookingService.cancelBooking(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully.", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete / cancel booking alias")
    public ResponseEntity<ApiResponse<BookingResponse>> deleteBooking(
            @PathVariable Long id,
            Authentication authentication) {
        return cancelBooking(id, authentication);
    }
}
