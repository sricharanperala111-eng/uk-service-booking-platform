-- ============================================================================
-- UK Service Booking & Order Management Platform - PostgreSQL Database Schema
-- Author: Sri Charan
-- ============================================================================

-- Create database if executed manually in psql
-- CREATE DATABASE uk_service_db;
-- \c uk_service_db;

-- Drop tables if exist in reverse dependency order
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(150),
    postcode VARCHAR(10),
    role VARCHAR(20) NOT NULL CHECK (role IN ('ROLE_CUSTOMER', 'ROLE_ADMIN')),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Services Table
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('PLUMBING', 'ELECTRICAL', 'HEATING', 'CLEANING', 'GARDENING', 'APPLIANCE_REPAIR')),
    price NUMERIC(10, 2) NOT NULL,
    duration_minutes INT NOT NULL,
    available BOOLEAN DEFAULT TRUE NOT NULL,
    image_url VARCHAR(300),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Bookings Table
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    booking_date DATE NOT NULL,
    start_time TIME WITHOUT TIME ZONE NOT NULL,
    end_time TIME WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    total_price NUMERIC(10, 2) NOT NULL,
    service_address VARCHAR(150) NOT NULL,
    service_postcode VARCHAR(10) NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Payments Table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    payment_reference VARCHAR(60) NOT NULL UNIQUE,
    payment_method VARCHAR(30) DEFAULT 'DEBIT_CARD',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Reviews Table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    booking_id BIGINT UNIQUE REFERENCES bookings(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for performance & quick schedule lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_bookings_service_date ON bookings(service_id, booking_date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_reviews_service ON reviews(service_id);

-- ============================================================================
-- Seed Initial UK Marketplace Data
-- Passwords below are hashed using BCrypt:
-- AdminPass123!   -> $2a$10$wO3P3g6W4P9kFmF6W.QYv.5m3T8L1zK2v/6S7B6c7P3h6L1zK2v/6
-- CustomerPass123! -> $2a$10$zS7W4P9kFmF6W.QYv.5m3TwO3P3g6W4P9kFmF6W.QYv.5m3T8L1zK
-- ============================================================================

INSERT INTO users (first_name, last_name, email, password, phone, address, postcode, role) VALUES
('Eleanor', 'Vance', 'admin@ukservices.co.uk', '$2a$10$tZ1dCeqj7HjVz4fE4VJnveE7b9N.h8O6E5Y.a1nK.5T3DqF7X6F8u', '+44 20 7946 0912', '10 Whitehall Place, Westminster', 'SW1A 2HD', 'ROLE_ADMIN'),
('John', 'Smith', 'john.smith@example.co.uk', '$2a$10$tZ1dCeqj7HjVz4fE4VJnveE7b9N.h8O6E5Y.a1nK.5T3DqF7X6F8u', '+44 7700 900123', '45 Deansgate, City Centre', 'M1 1AE', 'ROLE_CUSTOMER'),
('Emily', 'Davies', 'emily.davies@example.co.uk', '$2a$10$tZ1dCeqj7HjVz4fE4VJnveE7b9N.h8O6E5Y.a1nK.5T3DqF7X6F8u', '+44 7700 900456', '12 Colmore Row', 'B1 1HQ', 'ROLE_CUSTOMER');

INSERT INTO services (name, description, category, price, duration_minutes, available, image_url) VALUES
('Emergency Plumbing & Burst Pipe Repair', 'Rapid response for burst pipes, unblocking stubborn drains, and tap replacements by Gas Safe & City and Guilds certified plumbers.', 'PLUMBING', 85.00, 60, true, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'),
('Electrical Safety Certificate (EICR)', 'Full periodic inspection report for domestic landlords and home buyers by NICEIC registered engineers.', 'ELECTRICAL', 140.00, 90, true, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'),
('Annual Gas Boiler Service & CP12 Certificate', 'Comprehensive 30-point boiler health check, flue gas analysis, and Gas Safety record issuance.', 'HEATING', 95.00, 60, true, 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'),
('End-of-Tenancy Deep Cleaning', 'Guaranteed deposit-return cleaning covering oven deep-clean, descaling bathrooms, internal windows, and carpet shampoo.', 'CLEANING', 160.00, 180, true, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'),
('Garden Clearance & Seasonal Lawn Care', 'Lawn mowing, hedge trimming, weed removal, edging, and green waste disposal across gardens up to 150m².', 'GARDENING', 75.00, 120, true, 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=800&q=80'),
('Washing Machine & Domestic Appliance Repair', 'Diagnostics and fixed-labour repairs for dishwashers, washing machines, dryers, and electric ovens.', 'APPLIANCE_REPAIR', 65.00, 60, true, 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80'),
('Smart Home EV Charger Installation (7kW)', 'Full supply and installation of smart 7kW tethered charger with OZEV grant compliance and NICEIC notification.', 'ELECTRICAL', 275.00, 150, true, 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80'),
('Central Heating Radiator Power Flush', 'Chemical power flushing to remove black sludge (magnetite), restore heat distribution, and lower energy bills.', 'HEATING', 120.00, 90, true, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');

INSERT INTO bookings (user_id, service_id, booking_date, start_time, end_time, status, total_price, service_address, service_postcode, notes) VALUES
(2, 1, CURRENT_DATE + INTERVAL '1 day', '10:00:00', '11:00:00', 'CONFIRMED', 85.00, '45 Deansgate, Flat 4B', 'M1 1AE', 'Kitchen sink pipe is dripping into cupboard under sink.'),
(2, 3, CURRENT_DATE - INTERVAL '3 days', '14:00:00', '15:00:00', 'COMPLETED', 95.00, '45 Deansgate, Flat 4B', 'M1 1AE', 'Annual Worcester Bosch service before winter.'),
(3, 2, CURRENT_DATE + INTERVAL '5 days', '12:00:00', '13:30:00', 'CONFIRMED', 140.00, '12 Colmore Row', 'B1 1HQ', 'Need certificate ahead of new tenancy agreement.');

INSERT INTO payments (booking_id, amount, payment_status, payment_reference, payment_method) VALUES
(1, 85.00, 'COMPLETED', 'UKPAY-D8B32194', 'DEBIT_CARD'),
(2, 95.00, 'COMPLETED', 'UKPAY-77E5F90B', 'APPLE_PAY'),
(3, 140.00, 'COMPLETED', 'UKPAY-992C8014', 'DEBIT_CARD');

INSERT INTO reviews (user_id, service_id, booking_id, rating, comment) VALUES
(2, 3, 2, 5, 'Prompt, courteous engineer. Provided the Gas Safety CP12 certificate within 10 minutes of completing the check. Highly recommended!');
