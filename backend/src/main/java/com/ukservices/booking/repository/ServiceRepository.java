package com.ukservices.booking.repository;

import com.ukservices.booking.entity.ServiceEntity;
import com.ukservices.booking.entity.enums.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    List<ServiceEntity> findByAvailableTrue();

    List<ServiceEntity> findByCategoryAndAvailableTrue(ServiceCategory category);

    @Query(value = """
        SELECT id, available, category, created_at, description, duration_minutes, image_url, name, price
        FROM services
        WHERE (:category IS NULL OR category = CAST(:category AS VARCHAR))
        AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || :search || '%') OR LOWER(description) LIKE LOWER('%' || :search || '%'))
        AND (:minPrice IS NULL OR price >= :minPrice)
        AND (:maxPrice IS NULL OR price <= :maxPrice)
        AND (:availableOnly = false OR available = true)
        ORDER BY price ASC
        """, nativeQuery = true)
    List<ServiceEntity> searchServices(
        @Param("category") String category,
        @Param("search") String search,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("availableOnly") boolean availableOnly
    );
}
