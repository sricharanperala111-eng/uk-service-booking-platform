# UK Service Booking & Order Management Platform - Database Design

## 1. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "places (1:N)"
    USERS ||--o{ REVIEWS : "writes (1:N)"
    SERVICES ||--o{ BOOKINGS : "booked for (1:N)"
    SERVICES ||--o{ REVIEWS : "receives (1:N)"
    BOOKINGS ||--|| PAYMENTS : "paid via (1:1)"
    BOOKINGS ||--o| REVIEWS : "reviewed in (1:1)"

    USERS {
        bigserial id PK
        varchar(60) first_name
        varchar(60) last_name
        varchar(120) email UK
        varchar(255) password
        varchar(20) phone
        varchar(150) address
        varchar(10) postcode
        varchar(20) role
        timestamp created_at
        timestamp updated_at
    }

    SERVICES {
        bigserial id PK
        varchar(120) name
        varchar(1000) description
        varchar(30) category
        numeric(10,2) price
        int duration_minutes
        boolean available
        varchar(300) image_url
        timestamp created_at
    }

    BOOKINGS {
        bigserial id PK
        bigint user_id FK
        bigint service_id FK
        date booking_date
        time start_time
        time end_time
        varchar(20) status
        numeric(10,2) total_price
        varchar(150) service_address
        varchar(10) service_postcode
        varchar(500) notes
        timestamp created_at
        timestamp updated_at
    }

    PAYMENTS {
        bigserial id PK
        bigint booking_id FK,UK
        numeric(10,2) amount
        varchar(20) payment_status
        varchar(60) payment_reference UK
        varchar(30) payment_method
        timestamp created_at
    }

    REVIEWS {
        bigserial id PK
        bigint user_id FK
        bigint service_id FK
        bigint booking_id FK,UK
        int rating
        varchar(1000) comment
        timestamp created_at
    }
```

---

## 2. Table Specifications & Constraints

### 2.1 `users` Table
- Stores platform customers and administrators.
- `email`: UNIQUE constraint, indexed for fast authentication lookup.
- `role`: Check constraint `('ROLE_CUSTOMER', 'ROLE_ADMIN')`.
- `password`: BCrypt hash (60 characters).

### 2.2 `services` Table
- Stores home trade offerings.
- `category`: Check constraint `('PLUMBING', 'ELECTRICAL', 'HEATING', 'CLEANING', 'GARDENING', 'APPLIANCE_REPAIR')`.
- `price`: Numeric(10, 2) in British Pounds (£).
- `duration_minutes`: Typical job duration used by the scheduling engine to compute end time.

### 2.3 `bookings` Table
- Core transactional order table.
- `status`: Check constraint `('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`.
- `service_postcode`: Stores UK postcode format (e.g. `M1 1AE`, `SW1A 2HD`).
- Foreign Keys: `user_id` (`ON DELETE CASCADE`), `service_id` (`ON DELETE RESTRICT` to preserve historical booking records).

### 2.4 `payments` Table
- Tracks transactions and financial audit references.
- `booking_id`: Unique foreign key ensuring 1:1 relationship with orders.
- `payment_reference`: e.g. `UKPAY-XXXXXXXX`.

### 2.5 `reviews` Table
- Customer feedback for completed services.
- `rating`: Check constraint `(rating >= 1 AND rating <= 5)`.
- `booking_id`: Unique foreign key ensuring only one review per completed booking.

---

## 3. Indexing Strategy

1. `idx_users_email` ON `users(email)`: Speeds up Spring Security `loadUserByUsername` queries.
2. `idx_services_category` ON `services(category)`: Accelerates catalog filtering by trade.
3. `idx_bookings_service_date` ON `bookings(service_id, booking_date)`: Composite index powering the real-time double-booking conflict check.
4. `idx_bookings_user` ON `bookings(user_id)`: Accelerates customer order history queries.
5. `idx_reviews_service` ON `reviews(service_id)`: Powers average rating and review aggregation.
