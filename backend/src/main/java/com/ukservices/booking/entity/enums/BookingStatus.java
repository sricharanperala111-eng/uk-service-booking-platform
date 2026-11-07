package com.ukservices.booking.entity.enums;

import java.util.EnumSet;
import java.util.Set;

public enum BookingStatus {
    PENDING,
    CONFIRMED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED;

    public boolean canTransitionTo(BookingStatus nextStatus) {
        if (this == nextStatus) {
            return true;
        }
        return switch (this) {
            case PENDING -> Set.of(CONFIRMED, CANCELLED).contains(nextStatus);
            case CONFIRMED -> Set.of(IN_PROGRESS, CANCELLED).contains(nextStatus);
            case IN_PROGRESS -> Set.of(COMPLETED, CANCELLED).contains(nextStatus);
            case COMPLETED, CANCELLED -> false;
        };
    }
}
