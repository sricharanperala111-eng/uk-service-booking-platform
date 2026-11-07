package com.ukservices.booking.service;

import com.ukservices.booking.dto.request.CreateBookingRequest;
import com.ukservices.booking.dto.response.BookingResponse;
import com.ukservices.booking.entity.Booking;
import com.ukservices.booking.entity.Payment;
import com.ukservices.booking.entity.ServiceEntity;
import com.ukservices.booking.entity.User;
import com.ukservices.booking.entity.enums.BookingStatus;
import com.ukservices.booking.entity.enums.PaymentStatus;
import com.ukservices.booking.entity.enums.Role;
import com.ukservices.booking.entity.enums.ServiceCategory;
import com.ukservices.booking.exception.BadRequestException;
import com.ukservices.booking.exception.BookingConflictException;
import com.ukservices.booking.exception.InvalidStatusTransitionException;
import com.ukservices.booking.repository.BookingRepository;
import com.ukservices.booking.repository.PaymentRepository;
import com.ukservices.booking.repository.ServiceRepository;
import com.ukservices.booking.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private BookingService bookingService;

    private User testCustomer;
    private ServiceEntity testService;

    @BeforeEach
    void setUp() {
        testCustomer = new User(1L, "John", "Smith", "john.smith@example.co.uk",
                "hashedPass", "+447700900123", "10 Downing St", "SW1A 2AA", Role.ROLE_CUSTOMER);

        testService = new ServiceEntity(10L, "Boiler Service", "Annual boiler check",
                ServiceCategory.HEATING, new BigDecimal("95.00"), 60, true, "http://img.png");
    }

    @Test
    @DisplayName("Should prevent double-booking and throw BookingConflictException when overlapping slot exists")
    void shouldThrowConflictWhenSlotOverlaps() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalTime startTime = LocalTime.of(10, 0);

        CreateBookingRequest req = new CreateBookingRequest(
                10L, tomorrow, startTime, "10 Downing St", "SW1A 2AA", "Leaking pipe", "CARD"
        );

        when(userRepository.findByEmail("john.smith@example.co.uk")).thenReturn(Optional.of(testCustomer));
        when(serviceRepository.findById(10L)).thenReturn(Optional.of(testService));
        when(bookingRepository.existsOverlappingBooking(eq(10L), eq(tomorrow), eq(startTime), any(LocalTime.class)))
                .thenReturn(true);

        BookingConflictException ex = assertThrows(BookingConflictException.class, () ->
                bookingService.createBooking("john.smith@example.co.uk", req)
        );

        assertTrue(ex.getMessage().contains("Scheduling conflict"));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should reject booking creation if service is unavailable")
    void shouldRejectWhenServiceUnavailable() {
        testService.setAvailable(false);
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        CreateBookingRequest req = new CreateBookingRequest(
                10L, tomorrow, LocalTime.of(10, 0), "10 Downing St", "SW1A 2AA", null, "CARD"
        );

        when(userRepository.findByEmail("john.smith@example.co.uk")).thenReturn(Optional.of(testCustomer));
        when(serviceRepository.findById(10L)).thenReturn(Optional.of(testService));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                bookingService.createBooking("john.smith@example.co.uk", req)
        );

        assertTrue(ex.getMessage().contains("currently marked as unavailable"));
    }

    @Test
    @DisplayName("Should successfully create booking and payment when slot is free")
    void shouldCreateBookingSuccessfully() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalTime startTime = LocalTime.of(14, 0);

        CreateBookingRequest req = new CreateBookingRequest(
                10L, tomorrow, startTime, "45 High Street", "M1 1AE", "No notes", "DEBIT_CARD"
        );

        when(userRepository.findByEmail("john.smith@example.co.uk")).thenReturn(Optional.of(testCustomer));
        when(serviceRepository.findById(10L)).thenReturn(Optional.of(testService));
        when(bookingRepository.existsOverlappingBooking(eq(10L), eq(tomorrow), eq(startTime), any(LocalTime.class)))
                .thenReturn(false);

        Booking savedBooking = new Booking(100L, testCustomer, testService, tomorrow, startTime,
                startTime.plusMinutes(60), BookingStatus.CONFIRMED, testService.getPrice(),
                "45 High Street", "M1 1AE", "No notes");

        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        BookingResponse response = bookingService.createBooking("john.smith@example.co.uk", req);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(BookingStatus.CONFIRMED, response.getStatus());
        assertEquals(new BigDecimal("95.00"), response.getTotalPrice());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    @DisplayName("Should enforce ownership and throw AccessDeniedException if non-admin views other customer booking")
    void shouldEnforceCustomerOwnership() {
        Booking booking = new Booking(50L, testCustomer, testService, LocalDate.now().plusDays(2),
                LocalTime.of(9, 0), LocalTime.of(10, 0), BookingStatus.CONFIRMED, testService.getPrice(),
                "45 High Street", "M1 1AE", null);

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));

        assertThrows(AccessDeniedException.class, () ->
                bookingService.getBookingById(50L, "hacker@example.com", false)
        );
    }

    @Test
    @DisplayName("Should reject invalid state transition from COMPLETED to CANCELLED")
    void shouldEnforceInvalidStateTransitionRules() {
        Booking booking = new Booking(50L, testCustomer, testService, LocalDate.now().minusDays(1),
                LocalTime.of(9, 0), LocalTime.of(10, 0), BookingStatus.COMPLETED, testService.getPrice(),
                "45 High St", "M1 1AE", null);

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));

        assertThrows(InvalidStatusTransitionException.class, () ->
                bookingService.updateBookingStatus(50L, BookingStatus.CANCELLED)
        );
    }

    @Test
    @DisplayName("Should permit valid state transition from PENDING to CONFIRMED")
    void shouldPermitValidStateTransition() {
        Booking booking = new Booking(50L, testCustomer, testService, LocalDate.now().plusDays(3),
                LocalTime.of(9, 0), LocalTime.of(10, 0), BookingStatus.PENDING, testService.getPrice(),
                "45 High St", "M1 1AE", null);

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingResponse updated = bookingService.updateBookingStatus(50L, BookingStatus.CONFIRMED);

        assertEquals(BookingStatus.CONFIRMED, updated.getStatus());
    }
}
