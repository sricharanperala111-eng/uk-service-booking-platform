package com.ukservices.booking.dto.response;

import com.ukservices.booking.entity.Review;
import java.time.LocalDateTime;

public class ReviewResponse {

    private Long id;
    private Long userId;
    private String customerName;
    private Long serviceId;
    private String serviceName;
    private Long bookingId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewResponse() {
    }

    public static ReviewResponse fromEntity(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        if (r.getUser() != null) {
            res.setUserId(r.getUser().getId());
            res.setCustomerName(r.getUser().getFullName());
        }
        if (r.getService() != null) {
            res.setServiceId(r.getService().getId());
            res.setServiceName(r.getService().getName());
        }
        if (r.getBooking() != null) {
            res.setBookingId(r.getBooking().getId());
        }
        res.setRating(r.getRating());
        res.setComment(r.getComment());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
