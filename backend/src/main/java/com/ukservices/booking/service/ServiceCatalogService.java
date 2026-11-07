package com.ukservices.booking.service;

import com.ukservices.booking.dto.request.CreateServiceRequest;
import com.ukservices.booking.dto.response.ServiceResponse;
import com.ukservices.booking.dto.response.TimeSlotAvailabilityResponse;
import com.ukservices.booking.entity.Booking;
import com.ukservices.booking.entity.ServiceEntity;
import com.ukservices.booking.entity.enums.BookingStatus;
import com.ukservices.booking.entity.enums.ServiceCategory;
import com.ukservices.booking.exception.BadRequestException;
import com.ukservices.booking.exception.ResourceNotFoundException;
import com.ukservices.booking.repository.BookingRepository;
import com.ukservices.booking.repository.ReviewRepository;
import com.ukservices.booking.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceCatalogService {

    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    public ServiceCatalogService(ServiceRepository serviceRepository,
                                 ReviewRepository reviewRepository,
                                 BookingRepository bookingRepository) {
        this.serviceRepository = serviceRepository;
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> searchServices(ServiceCategory category, String search,
                                               BigDecimal minPrice, BigDecimal maxPrice,
                                               boolean availableOnly) {
        String categoryStr = category != null ? category.name() : null;
        List<ServiceEntity> services = serviceRepository.searchServices(categoryStr, search, minPrice, maxPrice, availableOnly);
        return services.stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));
        return mapToResponse(service);
    }

    @Transactional
    public ServiceResponse createService(CreateServiceRequest req) {
        ServiceEntity service = new ServiceEntity();
        service.setName(req.getName().trim());
        service.setDescription(req.getDescription().trim());
        service.setCategory(req.getCategory());
        service.setPrice(req.getPrice());
        service.setDurationMinutes(req.getDurationMinutes());
        service.setAvailable(req.isAvailable());
        service.setImageUrl(req.getImageUrl());

        ServiceEntity saved = serviceRepository.save(service);
        return mapToResponse(saved);
    }

    @Transactional
    public ServiceResponse updateService(Long id, CreateServiceRequest req) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));

        service.setName(req.getName().trim());
        service.setDescription(req.getDescription().trim());
        service.setCategory(req.getCategory());
        service.setPrice(req.getPrice());
        service.setDurationMinutes(req.getDurationMinutes());
        service.setAvailable(req.isAvailable());
        if (req.getImageUrl() != null && !req.getImageUrl().isBlank()) {
            service.setImageUrl(req.getImageUrl());
        }

        ServiceEntity updated = serviceRepository.save(service);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Service not found with ID: " + id);
        }
        serviceRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public TimeSlotAvailabilityResponse checkAvailability(Long serviceId, LocalDate date) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + serviceId));

        if (date.isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot check availability for a past date: " + date);
        }

        // Active bookings on this day for the service
        List<Booking> bookings = bookingRepository.findByServiceIdAndBookingDateAndStatusNot(
                serviceId, date, BookingStatus.CANCELLED
        );

        // Standard UK technician time slots
        List<LocalTime> candidateStartTimes = List.of(
                LocalTime.of(8, 0),
                LocalTime.of(10, 0),
                LocalTime.of(12, 0),
                LocalTime.of(14, 0),
                LocalTime.of(16, 0),
                LocalTime.of(18, 0)
        );

        int duration = service.getDurationMinutes() != null ? service.getDurationMinutes() : 90;
        List<TimeSlotAvailabilityResponse.TimeSlotInfo> slotInfos = new ArrayList<>();

        for (LocalTime start : candidateStartTimes) {
            LocalTime end = start.plusMinutes(duration);

            // If date is today, check if start time has already passed
            if (date.isEqual(LocalDate.now()) && start.isBefore(LocalTime.now())) {
                slotInfos.add(new TimeSlotAvailabilityResponse.TimeSlotInfo(
                        start, end, false, "Time slot has already passed"
                ));
                continue;
            }

            // Check if overlapping with any existing active booking
            boolean conflict = bookings.stream().anyMatch(b ->
                    b.getStartTime().isBefore(end) && b.getEndTime().isAfter(start)
            );

            if (conflict) {
                slotInfos.add(new TimeSlotAvailabilityResponse.TimeSlotInfo(
                        start, end, false, "Booked by another customer"
                ));
            } else {
                slotInfos.add(new TimeSlotAvailabilityResponse.TimeSlotInfo(
                        start, end, true, null
                ));
            }
        }

        return new TimeSlotAvailabilityResponse(service.getId(), service.getName(), date, slotInfos);
    }

    private ServiceResponse mapToResponse(ServiceEntity entity) {
        Double avgRating = reviewRepository.getAverageRatingForService(entity.getId());
        long reviewCount = reviewRepository.countByServiceId(entity.getId());
        return ServiceResponse.fromEntity(entity, avgRating, reviewCount);
    }
}
