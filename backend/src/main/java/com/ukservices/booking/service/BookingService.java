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
import com.ukservices.booking.exception.BadRequestException;
import com.ukservices.booking.exception.BookingConflictException;
import com.ukservices.booking.exception.InvalidStatusTransitionException;
import com.ukservices.booking.exception.ResourceNotFoundException;
import com.ukservices.booking.repository.BookingRepository;
import com.ukservices.booking.repository.PaymentRepository;
import com.ukservices.booking.repository.ServiceRepository;
import com.ukservices.booking.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    public BookingService(BookingRepository bookingRepository,
                          ServiceRepository serviceRepository,
                          UserRepository userRepository,
                          PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public BookingResponse createBooking(String userEmail, CreateBookingRequest req) {
        // 1. Validate customer exists
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        // 2. Validate booking date
        LocalDate today = LocalDate.now();
        if (req.getBookingDate().isBefore(today)) {
            throw new BadRequestException("Booking date cannot be in the past: " + req.getBookingDate());
        }

        // If booking for today, validate start time has not passed
        if (req.getBookingDate().isEqual(today) && req.getStartTime().isBefore(LocalTime.now())) {
            throw new BadRequestException("Booking start time has already passed for today: " + req.getStartTime());
        }

        // 3. Validate service exists & is currently available
        ServiceEntity service = serviceRepository.findById(req.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + req.getServiceId()));

        if (!service.isAvailable()) {
            throw new BadRequestException("The service '" + service.getName() + "' is currently marked as unavailable for new bookings.");
        }

        // 4. Calculate end time based on service duration
        int durationMinutes = service.getDurationMinutes() != null ? service.getDurationMinutes() : 60;
        LocalTime endTime = req.getStartTime().plusMinutes(durationMinutes);

        // 5. Critical Business Rule: Prevent double-booking
        boolean hasConflict = bookingRepository.existsOverlappingBooking(
                service.getId(),
                req.getBookingDate(),
                req.getStartTime(),
                endTime
        );

        if (hasConflict) {
            throw new BookingConflictException(
                    "Scheduling conflict: The service '" + service.getName() + "' is already booked on "
                            + req.getBookingDate() + " between " + req.getStartTime() + " and " + endTime + ". "
                            + "Please select another time slot."
            );
        }

        // 6. Consistent price calculation (flat rate in GBP)
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setService(service);
        booking.setBookingDate(req.getBookingDate());
        booking.setStartTime(req.getStartTime());
        booking.setEndTime(endTime);
        booking.setStatus(BookingStatus.CONFIRMED); // Auto-confirmed on creation
        booking.setTotalPrice(service.getPrice());
        booking.setServiceAddress(req.getServiceAddress().trim());
        booking.setServicePostcode(req.getServicePostcode().trim().toUpperCase());
        booking.setNotes(req.getNotes() != null ? req.getNotes().trim() : null);

        Booking savedBooking = bookingRepository.save(booking);

        // 7. Create payment record
        Payment payment = new Payment();
        payment.setBooking(savedBooking);
        payment.setAmount(savedBooking.getTotalPrice());
        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        payment.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "DEBIT_CARD");
        payment.setPaymentReference("UKPAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        paymentRepository.save(payment);
        savedBooking.setPayment(payment);

        return BookingResponse.fromEntity(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return bookingRepository.findByUserIdOrderByBookingDateDescStartTimeDesc(user.getId())
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, String requesterEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        // Ownership enforcement: Only the owner or an admin can view the booking
        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(requesterEmail)) {
            throw new AccessDeniedException("You do not have permission to view this booking.");
        }

        return BookingResponse.fromEntity(booking);
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long id, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        // State-machine transition validation
        if (!booking.getStatus().canTransitionTo(newStatus)) {
            throw new InvalidStatusTransitionException(
                    "Invalid status transition from " + booking.getStatus() + " to " + newStatus + "."
            );
        }

        booking.setStatus(newStatus);

        // If cancelled, adjust payment status
        if (newStatus == BookingStatus.CANCELLED && booking.getPayment() != null) {
            booking.getPayment().setPaymentStatus(PaymentStatus.REFUNDED);
        }

        Booking updated = bookingRepository.save(booking);
        return BookingResponse.fromEntity(updated);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, String requesterEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        // Ownership check
        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(requesterEmail)) {
            throw new AccessDeniedException("You do not have permission to cancel this booking.");
        }

        // Cancellation rules: cannot cancel if already COMPLETED or CANCELLED
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new InvalidStatusTransitionException("Completed bookings cannot be cancelled.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        if (booking.getPayment() != null) {
            booking.getPayment().setPaymentStatus(PaymentStatus.REFUNDED);
        }

        Booking saved = bookingRepository.save(booking);
        return BookingResponse.fromEntity(saved);
    }
}
