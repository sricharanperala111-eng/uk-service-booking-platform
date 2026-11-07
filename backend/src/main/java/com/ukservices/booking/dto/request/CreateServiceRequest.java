package com.ukservices.booking.dto.request;

import com.ukservices.booking.entity.enums.ServiceCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CreateServiceRequest {

    @NotBlank(message = "Service name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private ServiceCategory category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "5.00", message = "Price must be at least £5.00")
    private BigDecimal price;

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    private Integer durationMinutes;

    private boolean available = true;

    private String imageUrl;

    public CreateServiceRequest() {
    }

    public CreateServiceRequest(String name, String description, ServiceCategory category,
                                BigDecimal price, Integer durationMinutes, boolean available, String imageUrl) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.durationMinutes = durationMinutes;
        this.available = available;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
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
}
