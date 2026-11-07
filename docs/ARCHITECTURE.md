# UK Service Booking & Order Management Platform - Architecture Documentation

## 1. System Architecture Overview

The platform is designed as a **production-grade modular monolith**, balancing clean architectural separation of concerns with operational simplicity. It follows the standard enterprise Java architectural layers:

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Browser / SPA)"]
        ReactApp["React 18 Single Page Application\n(Vite + React Router + Lucide Icons)"]
    end

    subgraph SecurityBoundary ["Spring Security 6 Boundary"]
        JwtFilter["JwtAuthenticationFilter\n(Bearer Token Inspection)"]
        SecFilterChain["SecurityFilterChain\n(CORS, CSRF Disabled, Stateless)"]
    end

    subgraph WebLayer ["REST API Layer"]
        AuthCtrl["AuthController"]
        ServiceCtrl["ServiceController"]
        BookingCtrl["BookingController"]
        ReviewCtrl["ReviewController"]
        AdminCtrl["AdminController"]
    end

    subgraph BusinessLayer ["Business Logic Service Layer"]
        AuthSvc["AuthService & CustomUserDetailsService"]
        CatalogSvc["ServiceCatalogService"]
        BookingSvc["BookingService\n(Double-Booking Engine & State Machine)"]
        ReviewSvc["ReviewService"]
        AdminSvc["AdminDashboardService"]
    end

    subgraph PersistenceLayer ["Data Access Layer (Spring Data JPA / Hibernate)"]
        UserRepo["UserRepository"]
        ServiceRepo["ServiceRepository"]
        BookingRepo["BookingRepository"]
        PaymentRepo["PaymentRepository"]
        ReviewRepo["ReviewRepository"]
    end

    subgraph StorageLayer ["Relational Storage"]
        PostgresDB[("PostgreSQL 16 Database\n(Indexes, Constraints, Relational Schema)")]
        H2DB[("H2 In-Memory DB\n(Zero-Config Local Dev Profile)")]
    end

    ReactApp -->|HTTP REST / JSON / JWT| JwtFilter
    JwtFilter --> SecFilterChain
    SecFilterChain --> WebLayer
    WebLayer --> BusinessLayer
    BusinessLayer --> PersistenceLayer
    PersistenceLayer --> PostgresDB
    PersistenceLayer -.-> H2DB
```

---

## 2. Request & Authentication Flow

1. **Authentication**: The user logs in via `POST /api/auth/login`. The server verifies credentials against BCrypt-hashed passwords in the database and generates a cryptographically signed HMAC-SHA256 JWT containing `userId`, `email`, and `role` (`ROLE_CUSTOMER` or `ROLE_ADMIN`).
2. **Authorization**: Subsequent requests supply the token via the `Authorization: Bearer <token>` header. `JwtAuthenticationFilter` validates the signature and populates the `SecurityContextHolder`.
3. **Role-Based Access Control**:
   - Public: `/api/auth/**`, `GET /api/services/**`, OpenAPI Docs (`/swagger-ui/**`).
   - Customer: `/api/bookings/**`, `/api/reviews/**`.
   - Admin: `/api/admin/**`, `POST/PUT/DELETE /api/services/**`.

---

## 3. Double-Booking Prevention & Concurrency Engine

The core scheduling conflict algorithm ensures technician slots cannot be reserved multiple times:

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Controller as BookingController
    participant Service as BookingService
    participant Repo as BookingRepository
    participant DB as PostgreSQL Database

    Customer->>Controller: POST /api/bookings (serviceId, date, startTime, address)
    Controller->>Service: createBooking(userEmail, request)
    Service->>Repo: findById(serviceId)
    Repo-->>Service: ServiceEntity (duration, price, available)
    Service->>Service: Calculate endTime = startTime + duration
    Service->>Repo: existsOverlappingBooking(serviceId, date, startTime, endTime)
    Repo->>DB: SQL Query with time-overlap predicate
    DB-->>Repo: true / false
    alt Slot is already occupied
        Service-->>Customer: 409 Conflict ("Scheduling conflict: slot is already booked")
    else Slot is available
        Service->>Repo: save(Booking)
        Service->>Repo: save(Payment)
        Service-->>Customer: 201 Created (BookingResponse)
    end
```

The overlap condition is evaluated as:
$$\text{Existing Booking} \cap \text{Requested Slot} \neq \emptyset \iff (b.\text{startTime} < \text{newEndTime}) \land (b.\text{endTime} > \text{newStartTime})$$
Bookings marked with `BookingStatus.CANCELLED` are excluded from the conflict evaluation.

---

## 4. Booking Lifecycle State Machine

Orders adhere to strict lifecycle transitions:

```mermaid
stateDiagram-v2
    [*] --> PENDING: Created (Unpaid/Pending)
    [*] --> CONFIRMED: Created & Paid
    PENDING --> CONFIRMED: Payment Cleared
    PENDING --> CANCELLED: Customer / Admin Cancel
    CONFIRMED --> IN_PROGRESS: Technician Dispatched
    CONFIRMED --> CANCELLED: Customer / Admin Cancel (Refunded)
    IN_PROGRESS --> COMPLETED: Service Finalised
    IN_PROGRESS --> CANCELLED: Emergency Cancellation
    COMPLETED --> [*]: Verified Review Eligible
    CANCELLED --> [*]: Terminal State
```
