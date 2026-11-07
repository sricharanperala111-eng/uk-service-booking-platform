package com.ukservices.booking.dto.request;

import com.ukservices.booking.entity.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateBookingStatusRequest {

    @NotNull(message = "New status is required")
    private BookingStatus status;

    public UpdateBookingStatusRequest() {
    }

    public UpdateBookingStatusRequest(BookingStatus status) {
        this.status = status;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}
