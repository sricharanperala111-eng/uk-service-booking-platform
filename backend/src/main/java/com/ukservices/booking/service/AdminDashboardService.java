package com.ukservices.booking.service;

import com.ukservices.booking.dto.response.BookingResponse;
import com.ukservices.booking.dto.response.DashboardStatsResponse;
import com.ukservices.booking.dto.response.UserProfileResponse;
import com.ukservices.booking.entity.enums.BookingStatus;
import com.ukservices.booking.entity.enums.Role;
import com.ukservices.booking.repository.BookingRepository;
import com.ukservices.booking.repository.ServiceRepository;
import com.ukservices.booking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminDashboardService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public AdminDashboardService(BookingRepository bookingRepository,
                                 UserRepository userRepository,
                                 ServiceRepository serviceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        BigDecimal revenue = bookingRepository.sumTotalConfirmedRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        stats.setTotalBookings(bookingRepository.count());
        stats.setPendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING));
        stats.setConfirmedBookings(bookingRepository.countByStatus(BookingStatus.CONFIRMED));
        stats.setInProgressBookings(bookingRepository.countByStatus(BookingStatus.IN_PROGRESS));
        stats.setCompletedBookings(bookingRepository.countByStatus(BookingStatus.COMPLETED));
        stats.setCancelledBookings(bookingRepository.countByStatus(BookingStatus.CANCELLED));

        stats.setTotalCustomers(userRepository.countByRole(Role.ROLE_CUSTOMER));
        stats.setTotalServices(serviceRepository.count());

        List<BookingResponse> recentBookings = bookingRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
        stats.setRecentBookings(recentBookings);

        Map<String, Long> categoryCount = new HashMap<>();
        serviceRepository.findAll().forEach(svc -> {
            String cat = svc.getCategory().name();
            categoryCount.put(cat, categoryCount.getOrDefault(cat, 0L) + 1L);
        });
        stats.setCategoryDistribution(categoryCount);

        return stats;
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllCustomers() {
        return userRepository.findByRoleOrderByCreatedAtDesc(Role.ROLE_CUSTOMER)
                .stream()
                .map(UserProfileResponse::fromEntity)
                .toList();
    }
}
