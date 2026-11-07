package com.ukservices.booking.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class TimeSlotAvailabilityResponse {

    private Long serviceId;
    private String serviceName;
    private LocalDate date;
    private List<TimeSlotInfo> timeSlots;

    public TimeSlotAvailabilityResponse() {
    }

    public TimeSlotAvailabilityResponse(Long serviceId, String serviceName, LocalDate date, List<TimeSlotInfo> timeSlots) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.date = date;
        this.timeSlots = timeSlots;
    }

    public static class TimeSlotInfo {
        private LocalTime startTime;
        private LocalTime endTime;
        private boolean available;
        private String conflictReason;

        public TimeSlotInfo() {
        }

        public TimeSlotInfo(LocalTime startTime, LocalTime endTime, boolean available, String conflictReason) {
            this.startTime = startTime;
            this.endTime = endTime;
            this.available = available;
            this.conflictReason = conflictReason;
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

        public boolean isAvailable() {
            return available;
        }

        public void setAvailable(boolean available) {
            this.available = available;
        }

        public String getConflictReason() {
            return conflictReason;
        }

        public void setConflictReason(String conflictReason) {
            this.conflictReason = conflictReason;
        }
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<TimeSlotInfo> getTimeSlots() {
        return timeSlots;
    }

    public void setTimeSlots(List<TimeSlotInfo> timeSlots) {
        this.timeSlots = timeSlots;
    }
}
