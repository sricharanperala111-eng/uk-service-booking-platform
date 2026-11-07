package com.ukservices.booking.config;

import com.ukservices.booking.entity.Booking;
import com.ukservices.booking.entity.Payment;
import com.ukservices.booking.entity.Review;
import com.ukservices.booking.entity.ServiceEntity;
import com.ukservices.booking.entity.User;
import com.ukservices.booking.entity.enums.BookingStatus;
import com.ukservices.booking.entity.enums.PaymentStatus;
import com.ukservices.booking.entity.enums.Role;
import com.ukservices.booking.entity.enums.ServiceCategory;
import com.ukservices.booking.repository.BookingRepository;
import com.ukservices.booking.repository.PaymentRepository;
import com.ukservices.booking.repository.ReviewRepository;
import com.ukservices.booking.repository.ServiceRepository;
import com.ukservices.booking.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ServiceRepository serviceRepository,
                           BookingRepository bookingRepository,
                           PaymentRepository paymentRepository,
                           ReviewRepository reviewRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized with data. Skipping seed.");
            return;
        }

        log.info("Starting UK Service Booking data seeding...");

        // 1. Seed Users
        User admin = new User(
                null, "Eleanor", "Vance", "admin@ukservices.co.uk",
                passwordEncoder.encode("AdminPass123!"), "+44 20 7946 0912",
                "10 Whitehall Place, Westminster", "SW1A 2HD", Role.ROLE_ADMIN
        );

        User customer1 = new User(
                null, "John", "Smith", "john.smith@example.co.uk",
                passwordEncoder.encode("CustomerPass123!"), "+44 7700 900123",
                "45 Deansgate, City Centre", "M1 1AE", Role.ROLE_CUSTOMER
        );

        User customer2 = new User(
                null, "Emily", "Davies", "emily.davies@example.co.uk",
                passwordEncoder.encode("CustomerPass123!"), "+44 7700 900456",
                "12 Colmore Row", "B1 1HQ", Role.ROLE_CUSTOMER
        );

        userRepository.saveAll(List.of(admin, customer1, customer2));

        // 2. Seed Services
        ServiceEntity s1 = new ServiceEntity(
                null, "Emergency Plumbing & Burst Pipe Repair",
                "Rapid response for burst pipes, unblocking stubborn drains, and tap replacements by Gas Safe & City and Guilds certified plumbers.",
                ServiceCategory.PLUMBING, new BigDecimal("85.00"), 60, true,
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
        );

        ServiceEntity s2 = new ServiceEntity(
                null, "Electrical Safety Certificate (EICR)",
                "Full periodic inspection report for domestic landlords and home buyers by NICEIC registered engineers.",
                ServiceCategory.ELECTRICAL, new BigDecimal("140.00"), 90, true,
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
        );

        ServiceEntity s3 = new ServiceEntity(
                null, "Annual Gas Boiler Service & CP12 Certificate",
                "Comprehensive 30-point boiler health check, flue gas analysis, and Gas Safety record issuance.",
                ServiceCategory.HEATING, new BigDecimal("95.00"), 60, true,
                "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
        );

        ServiceEntity s4 = new ServiceEntity(
                null, "End-of-Tenancy Deep Cleaning",
                "Guaranteed deposit-return cleaning covering oven deep-clean, descaling bathrooms, internal windows, and carpet shampoo.",
                ServiceCategory.CLEANING, new BigDecimal("160.00"), 180, true,
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
        );

        ServiceEntity s5 = new ServiceEntity(
                null, "Garden Clearance & Seasonal Lawn Care",
                "Lawn mowing, hedge trimming, weed removal, edging, and green waste disposal across gardens up to 150m².",
                ServiceCategory.GARDENING, new BigDecimal("75.00"), 120, true,
                "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=800&q=80"
        );

        ServiceEntity s6 = new ServiceEntity(
                null, "Washing Machine & Domestic Appliance Repair",
                "Diagnostics and fixed-labour repairs for dishwashers, washing machines, dryers, and electric ovens.",
                ServiceCategory.APPLIANCE_REPAIR, new BigDecimal("65.00"), 60, true,
                "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80"
        );

        ServiceEntity s7 = new ServiceEntity(
                null, "Smart Home EV Charger Installation (7kW)",
                "Full supply and installation of smart 7kW tethered charger with OZEV grant compliance and NICEIC notification.",
                ServiceCategory.ELECTRICAL, new BigDecimal("275.00"), 150, true,
                "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80"
        );

        ServiceEntity s8 = new ServiceEntity(
                null, "Central Heating Radiator Power Flush",
                "Chemical power flushing to remove black sludge (magnetite), restore heat distribution, and lower energy bills.",
                ServiceCategory.HEATING, new BigDecimal("120.00"), 90, true,
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
        );

        serviceRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6, s7, s8));

        // 3. Seed Sample Bookings
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate nextWeek = LocalDate.now().plusDays(5);
        LocalDate pastDate = LocalDate.now().minusDays(3);

        // Booking 1: Upcoming confirmed booking for John Smith
        Booking b1 = new Booking(
                null, customer1, s1, tomorrow,
                LocalTime.of(10, 0), LocalTime.of(11, 0),
                BookingStatus.CONFIRMED, s1.getPrice(),
                "45 Deansgate, Flat 4B", "M1 1AE",
                "Kitchen sink pipe is dripping into cupboard under sink."
        );
        Booking savedB1 = bookingRepository.save(b1);
        Payment p1 = new Payment(null, savedB1, s1.getPrice(), PaymentStatus.COMPLETED,
                "UKPAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(), "DEBIT_CARD");
        paymentRepository.save(p1);

        // Booking 2: Completed booking with Review
        Booking b2 = new Booking(
                null, customer1, s3, pastDate,
                LocalTime.of(14, 0), LocalTime.of(15, 0),
                BookingStatus.COMPLETED, s3.getPrice(),
                "45 Deansgate, Flat 4B", "M1 1AE",
                "Annual Worcester Bosch service before winter."
        );
        Booking savedB2 = bookingRepository.save(b2);
        Payment p2 = new Payment(null, savedB2, s3.getPrice(), PaymentStatus.COMPLETED,
                "UKPAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(), "APPLE_PAY");
        paymentRepository.save(p2);

        Review r1 = new Review(
                null, customer1, s3, savedB2, 5,
                "Prompt, courteous engineer. Provided the Gas Safety CP12 certificate within 10 minutes of completing the check. Highly recommended!"
        );
        reviewRepository.save(r1);

        // Booking 3: Upcoming booking for Emily Davies
        Booking b3 = new Booking(
                null, customer2, s2, nextWeek,
                LocalTime.of(12, 0), LocalTime.of(13, 30),
                BookingStatus.CONFIRMED, s2.getPrice(),
                "12 Colmore Row", "B1 1HQ",
                "Need certificate ahead of new tenancy agreement."
        );
        Booking savedB3 = bookingRepository.save(b3);
        Payment p3 = new Payment(null, savedB3, s2.getPrice(), PaymentStatus.COMPLETED,
                "UKPAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(), "DEBIT_CARD");
        paymentRepository.save(p3);

        log.info("Database initialized successfully with 3 users, 8 services, 3 bookings, and 1 review.");
    }
}
