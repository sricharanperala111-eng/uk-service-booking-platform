package com.ukservices.booking.repository;

import com.ukservices.booking.entity.Booking;
import com.ukservices.booking.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByBookingDateDescStartTimeDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findTop10ByOrderByCreatedAtDesc();

    List<Booking> findByServiceIdAndBookingDateAndStatusNot(
        Long serviceId,
        LocalDate bookingDate,
        BookingStatus status
    );

    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.service.id = :serviceId
        AND b.bookingDate = :bookingDate
        AND b.status != com.ukservices.booking.entity.enums.BookingStatus.CANCELLED
        AND (b.startTime < :endTime AND b.endTime > :startTime)
    """)
    boolean existsOverlappingBooking(
        @Param("serviceId") Long serviceId,
        @Param("bookingDate") LocalDate bookingDate,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );

    long countByStatus(BookingStatus status);

    @Query("""
        SELECT COALESCE(SUM(b.totalPrice), 0)
        FROM Booking b
        WHERE b.status = :status
    """)
    BigDecimal sumTotalPriceByStatus(@Param("status") BookingStatus status);

    @Query("""
        SELECT COALESCE(SUM(b.totalPrice), 0)
        FROM Booking b
        WHERE b.status IN (com.ukservices.booking.entity.enums.BookingStatus.CONFIRMED,
                           com.ukservices.booking.entity.enums.BookingStatus.IN_PROGRESS,
                           com.ukservices.booking.entity.enums.BookingStatus.COMPLETED)
    """)
    BigDecimal sumTotalConfirmedRevenue();
}
