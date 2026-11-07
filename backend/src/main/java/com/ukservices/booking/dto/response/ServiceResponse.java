package com.ukservices.booking.dto.response;

import com.ukservices.booking.entity.ServiceEntity;
import com.ukservices.booking.entity.enums.ServiceCategory;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceResponse {

    private Long id;
    private String name;
    private String description;
    private ServiceCategory category;
    private BigDecimal price; // In GBP (£)
    private Integer durationMinutes;
    private boolean available;
    private String imageUrl;
    private Double averageRating;
    private long reviewCount;
    private LocalDateTime createdAt;

    public ServiceResponse() {
    }

    public ServiceResponse(Long id, String name, String description, ServiceCategory category,
                           BigDecimal price, Integer durationMinutes, boolean available,
                           String imageUrl, Double averageRating, long reviewCount, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.durationMinutes = durationMinutes;
        this.available = available;
        this.imageUrl = imageUrl;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
        this.createdAt = createdAt;
    }

    public static ServiceResponse fromEntity(ServiceEntity s, Double avgRating, long reviewCount) {
        return new ServiceResponse(
            s.getId(),
            s.getName(),
            s.getDescription(),
            s.getCategory(),
            s.getPrice(),
            s.getDurationMinutes(),
            s.isAvailable(),
            s.getImageUrl(),
            avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0,
            reviewCount,
            s.getCreatedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ServiceCategory getCategory() {
        return category;
    }

    public void setCategory(ServiceCategory category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
