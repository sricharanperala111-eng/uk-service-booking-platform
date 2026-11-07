package com.ukservices.booking.service;

import com.ukservices.booking.dto.request.CreateReviewRequest;
import com.ukservices.booking.dto.response.ReviewResponse;
import com.ukservices.booking.entity.Booking;
import com.ukservices.booking.entity.Review;
import com.ukservices.booking.entity.User;
import com.ukservices.booking.entity.enums.BookingStatus;
import com.ukservices.booking.exception.BadRequestException;
import com.ukservices.booking.exception.ResourceNotFoundException;
import com.ukservices.booking.repository.BookingRepository;
import com.ukservices.booking.repository.ReviewRepository;
import com.ukservices.booking.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         BookingRepository bookingRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReviewResponse createReview(String userEmail, CreateReviewRequest req) {
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + req.getBookingId()));

        // Check ownership
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only review services for bookings created by your account.");
        }

        // Check completion rule
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted after the service has been COMPLETED.");
        }

        // Check duplicate review
        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("A review has already been submitted for this booking.");
        }

        Review review = new Review();
        review.setUser(user);
        review.setService(booking.getService());
        review.setBooking(booking);
        review.setRating(req.getRating());
        review.setComment(req.getComment().trim());

        Review saved = reviewRepository.save(review);
        return ReviewResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForService(Long serviceId) {
        return reviewRepository.findByServiceIdOrderByCreatedAtDesc(serviceId)
                .stream()
                .map(ReviewResponse::fromEntity)
                .toList();
    }
}
