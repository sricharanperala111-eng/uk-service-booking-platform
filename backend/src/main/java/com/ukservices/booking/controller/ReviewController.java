package com.ukservices.booking.controller;

import com.ukservices.booking.dto.request.CreateReviewRequest;
import com.ukservices.booking.dto.response.ApiResponse;
import com.ukservices.booking.dto.response.ReviewResponse;
import com.ukservices.booking.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@Tag(name = "Reviews", description = "Endpoints for customer ratings and reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/api/reviews")
    @Operation(summary = "Submit a review for a completed service booking")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateReviewRequest request) {

        ReviewResponse response = reviewService.createReview(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Review submitted successfully. Thank you for your feedback!", response));
    }

    @GetMapping("/api/services/{id}/reviews")
    @Operation(summary = "Get all customer reviews for a specific service")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getServiceReviews(@PathVariable Long id) {
        List<ReviewResponse> reviews = reviewService.getReviewsForService(id);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }
}
