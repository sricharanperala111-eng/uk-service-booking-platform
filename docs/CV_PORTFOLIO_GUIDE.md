# UK Job-Market Portfolio & Technical Interview Guide
**Candidate: Sri Charan**  
**Role Targeting: UK Java Software Developer / Full-Stack Developer / Backend Developer**

---

## 1. CV Bullet Points (Ready to Copy to CV / LinkedIn)

- **Full-Stack UK Service Booking & Order Management Platform** *(Java 17, Spring Boot 3, React, PostgreSQL, Docker)*
  - Engineered a production-style home-services booking platform featuring JWT authentication, role-based access control (`ROLE_CUSTOMER`, `ROLE_ADMIN`), and relational data modeling with Spring Data JPA and Hibernate.
  - Implemented business logic for real-time scheduling conflict resolution, eliminating double-bookings across trade services through custom temporal JPQL queries and transactional integrity.
  - Designed an order status state machine enforcing valid transitions (`PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED` / `CANCELLED`) and automated payment refund tracking.
  - Developed a responsive React SPA with live time-slot availability checking, customer appointment management, and an administrative metrics dashboard.
  - Authored automated unit test suites using **JUnit 5** and **Mockito**, achieving high coverage across business logic, security constraints, and boundary edge cases.
  - Containerised the entire solution using multi-stage **Docker** builds and orchestrating services via **Docker Compose**; established automated CI/CD workflows using **GitHub Actions**.
  - Documented RESTful APIs and architecture specifications using **OpenAPI 3 / Swagger UI**.

---

## 2. Key UK Job Market Positioning Points

When presenting this project to UK tech hiring managers and recruiters:
1. **Emphasise Real-World Business Problems**:
   - Instead of a generic to-do list or basic CRUD app, explain that this solves the real-world UK home trade challenge (similar to Checkatrade, Bark, or TaskRabbit): double-booking prevention, UK postcode validation, upfront VAT-inclusive pricing in GBP (£), and verified review auditing.
2. **Demonstrate Layered Clean Architecture**:
   - Explain how Controller $\rightarrow$ Service $\rightarrow$ Repository separation keeps domain logic decoupled from HTTP transport and persistence concerns.
3. **Deep Understanding of Concurrency & Transactions**:
   - Explain how the scheduling overlap formula $(b.\text{startTime} < \text{newEndTime} \land b.\text{endTime} > \text{newStartTime})$ combined with Spring `@Transactional` ensures ACID guarantees.
4. **DevOps & Professional Engineering Discipline**:
   - Multi-stage Docker builds reduce image size and attack surface (non-root JRE container).
   - Automated GitHub Actions CI ensures zero regressions on pull requests.

---

## 3. High-Frequency UK Technical Interview Questions & Answers

### Q1: "How did you prevent double-booking in your platform?"
> **Answer**:  
> "I implemented a conflict-detection engine in the `BookingService` layer backed by an optimized JPQL query in `BookingRepository`. When a customer requests a booking, we calculate the end time based on the service's configured duration. We then query existing non-cancelled bookings for that specific service and date to check if any time intervals overlap: `b.startTime < requestedEndTime AND b.endTime > requestedStartTime`. If a conflict is found, the system throws a custom `BookingConflictException` mapped to HTTP `409 Conflict`. We also indexed `(service_id, booking_date)` in PostgreSQL to ensure these lookups are $O(\log N)$ even under high volume."

### Q2: "How is security handled across customer and admin endpoints?"
> **Answer**:  
> "I built a stateless authentication architecture using Spring Security and JJWT. During login or registration, the server issues an HMAC-SHA256 signed JWT containing the user ID, email, and authorities (`ROLE_CUSTOMER` or `ROLE_ADMIN`). A custom `JwtAuthenticationFilter` intercepts incoming requests, validates token integrity and expiration, and populates the `SecurityContext`. Protected routes are secured using method security (`@PreAuthorize`) and HTTP security matchers, while customer endpoints verify record ownership in the service layer to prevent horizontal privilege escalation."

### Q3: "Why did you choose a modular monolith instead of microservices?"
> **Answer**:  
> "For this domain and scale, a well-structured modular monolith is the most maintainable and cost-effective design. It avoids unnecessary distributed system complexity—such as network latency, distributed transactions (Saga pattern), and service mesh overhead—while maintaining clean boundaries between authentication, catalog, booking, and reviews. If traffic dictates, these modules can easily be extracted into independent microservices later."
