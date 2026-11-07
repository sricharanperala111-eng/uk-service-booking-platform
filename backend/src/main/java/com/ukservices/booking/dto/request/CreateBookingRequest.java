package com.ukservices.booking.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class CreateBookingRequest {

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date must be today or a future date")
    private LocalDate bookingDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotBlank(message = "Service address is required")
    private String serviceAddress;

    @NotBlank(message = "UK Postcode is required")
    private String servicePostcode;

    private String notes;

    private String paymentMethod = "DEBIT_CARD";

    public CreateBookingRequest() {
    }

    public CreateBookingRequest(Long serviceId, LocalDate bookingDate, LocalTime startTime,
                                String serviceAddress, String servicePostcode, String notes,
                                String paymentMethod) {
        this.serviceId = serviceId;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.serviceAddress = serviceAddress;
        this.servicePostcode = servicePostcode;
        this.notes = notes;
        this.paymentMethod = paymentMethod;
    }

    // Getters and Setters
    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public String getServiceAddress() {
        return serviceAddress;
    }

    public void setServiceAddress(String serviceAddress) {
        this.serviceAddress = serviceAddress;
    }

    public String getServicePostcode() {
        return servicePostcode;
    }

    public void setServicePostcode(String servicePostcode) {
        this.servicePostcode = servicePostcode;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
