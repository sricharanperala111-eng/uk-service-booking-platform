package com.ukservices.booking.dto.response;

import com.ukservices.booking.entity.Booking;
import com.ukservices.booking.entity.enums.BookingStatus;
import com.ukservices.booking.entity.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingResponse {

    private Long id;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long serviceId;
    private String serviceName;
    private String serviceCategory;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BookingStatus status;
    private BigDecimal totalPrice;
    private String serviceAddress;
    private String servicePostcode;
    private String notes;
    private PaymentStatus paymentStatus;
    private String paymentReference;
    private LocalDateTime createdAt;

    public BookingResponse() {
    }

    public static BookingResponse fromEntity(Booking b) {
        BookingResponse res = new BookingResponse();
        res.setId(b.getId());
        if (b.getUser() != null) {
            res.setUserId(b.getUser().getId());
            res.setCustomerName(b.getUser().getFullName());
            res.setCustomerEmail(b.getUser().getEmail());
            res.setCustomerPhone(b.getUser().getPhone());
        }
        if (b.getService() != null) {
            res.setServiceId(b.getService().getId());
            res.setServiceName(b.getService().getName());
            res.setServiceCategory(b.getService().getCategory().name());
        }
        res.setBookingDate(b.getBookingDate());
        res.setStartTime(b.getStartTime());
        res.setEndTime(b.getEndTime());
        res.setStatus(b.getStatus());
        res.setTotalPrice(b.getTotalPrice());
        res.setServiceAddress(b.getServiceAddress());
        res.setServicePostcode(b.getServicePostcode());
        res.setNotes(b.getNotes());
        if (b.getPayment() != null) {
            res.setPaymentStatus(b.getPayment().getPaymentStatus());
            res.setPaymentReference(b.getPayment().getPaymentReference());
        }
        res.setCreatedAt(b.getCreatedAt());
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

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
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

    public String getServiceCategory() {
        return serviceCategory;
    }

    public void setServiceCategory(String serviceCategory) {
        this.serviceCategory = serviceCategory;
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

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
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

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
