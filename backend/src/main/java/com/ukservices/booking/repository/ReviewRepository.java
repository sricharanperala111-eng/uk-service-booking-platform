package com.ukservices.booking.repository;

import com.ukservices.booking.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByServiceIdOrderByCreatedAtDesc(Long serviceId);

    Optional<Review> findByBookingId(Long bookingId);

    boolean existsByBookingId(Long bookingId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.service.id = :serviceId")
    Double getAverageRatingForService(@Param("serviceId") Long serviceId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.service.id = :serviceId")
    long countByServiceId(@Param("serviceId") Long serviceId);
}
