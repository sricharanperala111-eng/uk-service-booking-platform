# UK Service Booking Platform - REST API Reference

Swagger UI is available interactively at `http://localhost:8080/swagger-ui.html` when running the backend.

---

## 1. Authentication Endpoints

### Register Customer
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.co.uk",
  "password": "CustomerPass123!",
  "phone": "+44 7700 900123",
  "address": "45 Deansgate",
  "postcode": "M1 1AE"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Registration successful. Welcome to UK Services!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "tokenType": "Bearer",
    "user": {
      "id": 2,
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.co.uk",
      "role": "ROLE_CUSTOMER"
    }
  }
}
```

### Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@ukservices.co.uk",
  "password": "AdminPass123!"
}
```

### Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Access**: Authenticated (`ROLE_CUSTOMER` or `ROLE_ADMIN`)
- **Headers**: `Authorization: Bearer <token>`

---

## 2. Services Catalog Endpoints

### List / Search Services
- **Endpoint**: `GET /api/services`
- **Access**: Public
- **Query Parameters**:
  - `category`: `PLUMBING`, `HEATING`, `ELECTRICAL`, `CLEANING`, `GARDENING`, `APPLIANCE_REPAIR`
  - `search`: Keyword string
  - `minPrice`: Decimal
  - `maxPrice`: Decimal
  - `availableOnly`: Boolean (`true` by default)

### Single Service Details
- **Endpoint**: `GET /api/services/{id}`
- **Access**: Public

### Check Slot Availability (Anti Double-Booking)
- **Endpoint**: `GET /api/services/{id}/availability?date=YYYY-MM-DD`
- **Access**: Public
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "serviceId": 1,
    "serviceName": "Emergency Plumbing & Burst Pipe Repair",
    "date": "2026-10-14",
    "timeSlots": [
      { "startTime": "08:00:00", "endTime": "09:00:00", "available": true, "conflictReason": null },
      { "startTime": "10:00:00", "endTime": "11:00:00", "available": false, "conflictReason": "Booked by another customer" },
      { "startTime": "12:00:00", "endTime": "13:00:00", "available": true, "conflictReason": null }
    ]
  }
}
```

### Create / Update / Delete Service
- **Endpoints**: `POST /api/services`, `PUT /api/services/{id}`, `DELETE /api/services/{id}`
- **Access**: Administrator (`ROLE_ADMIN`)

---

## 3. Booking Management Endpoints

### Create Booking
- **Endpoint**: `POST /api/bookings`
- **Access**: Authenticated Customer (`ROLE_CUSTOMER`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "serviceId": 1,
  "bookingDate": "2026-10-15",
  "startTime": "14:00:00",
  "serviceAddress": "45 High Street",
  "servicePostcode": "SW1A 1AA",
  "notes": "Rear kitchen door access",
  "paymentMethod": "DEBIT_CARD"
}
```
- **Conflict Handling**: Returns `409 Conflict` if the requested slot overlaps with an existing booking.

### Get My Bookings
- **Endpoint**: `GET /api/bookings`
- **Access**: Authenticated Customer (`ROLE_CUSTOMER`)

### Get Booking by ID
- **Endpoint**: `GET /api/bookings/{id}`
- **Access**: Owner of the booking or Administrator

### Update Booking Status
- **Endpoint**: `PUT /api/bookings/{id}/status`
- **Access**: Administrator (`ROLE_ADMIN`)
- **Body**: `{ "status": "IN_PROGRESS" }`
- **State Validation**: Returns `422 Unprocessable Entity` if the transition violates the lifecycle state machine.

### Cancel Booking
- **Endpoint**: `POST /api/bookings/{id}/cancel`
- **Access**: Owner of the booking or Administrator

---

## 4. Reviews Endpoints

### Submit Verified Review
- **Endpoint**: `POST /api/reviews`
- **Access**: Authenticated Customer
- **Body**:
```json
{
  "bookingId": 2,
  "rating": 5,
  "comment": "Quick and professional service."
}
```
- **Rules**: Only bookings in `COMPLETED` status can be reviewed. Duplicate reviews for the same booking are rejected (`400 Bad Request`).

### Get Reviews for Service
- **Endpoint**: `GET /api/services/{id}/reviews`
- **Access**: Public

---

## 5. Admin Dashboard Endpoints

### Get Platform Statistics
- **Endpoint**: `GET /api/admin/dashboard`
- **Access**: Administrator (`ROLE_ADMIN`)
- **Returns**: Total revenue (£), order counts by status, customer counts, service breakdown.

### Get All Platform Bookings
- **Endpoint**: `GET /api/admin/bookings`
- **Access**: Administrator (`ROLE_ADMIN`)

### Get All Customers
- **Endpoint**: `GET /api/admin/customers`
- **Access**: Administrator (`ROLE_ADMIN`)
