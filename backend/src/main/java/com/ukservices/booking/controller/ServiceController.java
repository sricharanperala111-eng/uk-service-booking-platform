package com.ukservices.booking.controller;

import com.ukservices.booking.dto.request.CreateServiceRequest;
import com.ukservices.booking.dto.response.ApiResponse;
import com.ukservices.booking.dto.response.ServiceResponse;
import com.ukservices.booking.dto.response.TimeSlotAvailabilityResponse;
import com.ukservices.booking.entity.enums.ServiceCategory;
import com.ukservices.booking.service.ServiceCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@Tag(name = "Services Catalog", description = "Endpoints for exploring, filtering, and managing home services")
public class ServiceController {

    private final ServiceCatalogService catalogService;

    public ServiceController(ServiceCatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    @Operation(summary = "Search and filter UK home services")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getAllServices(
            @RequestParam(required = false) ServiceCategory category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "true") boolean availableOnly) {

        List<ServiceResponse> services = catalogService.searchServices(category, search, minPrice, maxPrice, availableOnly);
        return ResponseEntity.ok(ApiResponse.ok(services));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single service details by ID")
    public ResponseEntity<ApiResponse<ServiceResponse>> getServiceById(@PathVariable Long id) {
        ServiceResponse service = catalogService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.ok(service));
    }

    @GetMapping("/{id}/availability")
    @Operation(summary = "Get technician time-slot availability for a given date")
    public ResponseEntity<ApiResponse<TimeSlotAvailabilityResponse>> getAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        TimeSlotAvailabilityResponse availability = catalogService.checkAvailability(id, date);
        return ResponseEntity.ok(ApiResponse.ok(availability));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create a new service (Admin only)")
    public ResponseEntity<ApiResponse<ServiceResponse>> createService(@Valid @RequestBody CreateServiceRequest request) {
        ServiceResponse created = catalogService.createService(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Service created successfully.", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update an existing service (Admin only)")
    public ResponseEntity<ApiResponse<ServiceResponse>> updateService(
            @PathVariable Long id,
            @Valid @RequestBody CreateServiceRequest request) {

        ServiceResponse updated = catalogService.updateService(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Service updated successfully.", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete a service (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        catalogService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.ok("Service deleted successfully.", null));
    }
}
