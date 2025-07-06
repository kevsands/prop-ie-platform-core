-- PropIE Platform v3 Database Schema
-- Pure PHP Property Investment Platform
-- Created: June 25, 2025

CREATE DATABASE IF NOT EXISTS propie_v3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE propie_v3;

-- 1. Locations Table
CREATE TABLE locations (
    id CHAR(36) PRIMARY KEY,
    address TEXT NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100) NOT NULL,
    eircode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'Ireland',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_city (city),
    INDEX idx_county (county),
    INDEX idx_eircode (eircode),
    INDEX idx_coordinates (latitude, longitude)
);

-- 2. Users Table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') DEFAULT 'ACTIVE',
    kyc_status ENUM('NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED') DEFAULT 'NOT_STARTED',
    organization VARCHAR(255),
    position VARCHAR(255),
    location_id CHAR(36),
    preferences JSON,
    metadata JSON,
    email_verified_at TIMESTAMP NULL,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    remember_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_kyc_status (kyc_status),
    INDEX idx_organization (organization),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- 3. User Roles Table
CREATE TABLE user_roles (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    role ENUM('ADMIN', 'DEVELOPER', 'BUYER', 'AGENT', 'SOLICITOR', 'INVESTOR', 'ARCHITECT', 'ENGINEER', 'PROJECT_MANAGER', 'QUANTITY_SURVEYOR') NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by CHAR(36),
    
    UNIQUE KEY unique_user_role (user_id, role),
    INDEX idx_user_id (user_id),
    INDEX idx_role (role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Developments Table
CREATE TABLE developments (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    developer_id CHAR(36) NOT NULL,
    location_id CHAR(36) NOT NULL,
    status ENUM('PLANNING', 'APPROVED', 'PRE_CONSTRUCTION', 'CONSTRUCTION', 'UNDER_CONSTRUCTION', 'READY', 'LAUNCHED', 'MARKETING', 'SALES', 'SELLING', 'HANDOVER', 'SOLD_OUT', 'COMPLETED') NOT NULL,
    
    -- Unit counts
    total_units INT DEFAULT 0,
    available_units INT DEFAULT 0,
    reserved_units INT DEFAULT 0,
    sold_units INT DEFAULT 0,
    
    -- Timeline dates
    start_date DATE,
    completion_date DATE,
    planning_submission_date DATE,
    planning_decision_date DATE,
    construction_start_date DATE,
    construction_end_date DATE,
    marketing_launch_date DATE,
    sales_launch_date DATE,
    
    -- Media
    main_image_url VARCHAR(500),
    images JSON,
    videos JSON,
    site_plan_url VARCHAR(500),
    brochure_url VARCHAR(500),
    virtual_tour_url VARCHAR(500),
    website_url VARCHAR(500),
    
    -- Content
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    features JSON,
    amenities JSON,
    building_specs JSON,
    
    -- Status tracking
    marketing_status JSON,
    sales_status JSON,
    construction_status JSON,
    compliance_status JSON,
    
    -- Metadata
    building_type VARCHAR(100),
    tags JSON,
    awards JSON,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    view_count INT DEFAULT 0,
    inquiry_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_developer_id (developer_id),
    INDEX idx_location_id (location_id),
    INDEX idx_status (status),
    INDEX idx_slug (slug),
    INDEX idx_is_published (is_published),
    INDEX idx_completion_date (completion_date),
    FOREIGN KEY (developer_id) REFERENCES users(id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- 5. Units Table
CREATE TABLE units (
    id CHAR(36) PRIMARY KEY,
    development_id CHAR(36) NOT NULL,
    unit_number VARCHAR(50) NOT NULL,
    unit_type VARCHAR(100) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    floor_area_sqm DECIMAL(8,2) NOT NULL,
    floor_area_sqft DECIMAL(8,2),
    floor_number INT,
    status ENUM('AVAILABLE', 'RESERVED', 'SOLD', 'UNDER_CONSTRUCTION', 'COMPLETED') DEFAULT 'AVAILABLE',
    base_price DECIMAL(12,2) NOT NULL,
    current_price DECIMAL(12,2) NOT NULL,
    customization_cost DECIMAL(12,2) DEFAULT 0,
    features JSON,
    customizations JSON,
    floor_plan_url VARCHAR(500),
    images JSON,
    virtual_tour_urls JSON,
    orientation ENUM('NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'),
    is_corner_unit BOOLEAN DEFAULT FALSE,
    has_balcony BOOLEAN DEFAULT FALSE,
    has_garden BOOLEAN DEFAULT FALSE,
    has_parking BOOLEAN DEFAULT FALSE,
    parking_spaces INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_development_id (development_id),
    INDEX idx_status (status),
    INDEX idx_unit_type (unit_type),
    INDEX idx_bedrooms (bedrooms),
    INDEX idx_current_price (current_price),
    FOREIGN KEY (development_id) REFERENCES developments(id) ON DELETE CASCADE
);

-- 6. Properties Table
CREATE TABLE properties (
    id CHAR(36) PRIMARY KEY,
    unit_id CHAR(36),
    development_id CHAR(36),
    location_id CHAR(36) NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    floor_area_sqm DECIMAL(8,2) NOT NULL,
    floor_area_sqft DECIMAL(8,2),
    price DECIMAL(12,2) NOT NULL,
    price_per_sqm DECIMAL(8,2),
    status ENUM('AVAILABLE', 'RESERVED', 'SOLD', 'UNDER_OFFER', 'WITHDRAWN') DEFAULT 'AVAILABLE',
    ber_rating VARCHAR(10),
    year_built INT,
    is_new_build BOOLEAN DEFAULT FALSE,
    features JSON,
    amenities JSON,
    main_image_url VARCHAR(500),
    images JSON,
    floor_plans JSON,
    virtual_tour_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    view_count INT DEFAULT 0,
    inquiry_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location_id (location_id),
    INDEX idx_property_type (property_type),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_bedrooms (bedrooms),
    INDEX idx_is_published (is_published),
    INDEX idx_is_featured (is_featured),
    INDEX idx_development_id (development_id),
    INDEX idx_slug (slug),
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
    FOREIGN KEY (development_id) REFERENCES developments(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- 7. Transactions Table
CREATE TABLE transactions (
    id CHAR(36) PRIMARY KEY,
    property_id CHAR(36) NOT NULL,
    buyer_id CHAR(36) NOT NULL,
    seller_id CHAR(36),
    agent_id CHAR(36),
    solicitor_id CHAR(36),
    status ENUM('ENQUIRY', 'VIEWING_SCHEDULED', 'VIEWED', 'OFFER_MADE', 'OFFER_ACCEPTED', 'RESERVED', 'CONTRACTS_EXCHANGED', 'MORTGAGE_APPROVED', 'COMPLETION', 'COMPLETED', 'CANCELLED') DEFAULT 'ENQUIRY',
    offer_amount DECIMAL(12,2),
    agreed_price DECIMAL(12,2),
    deposit_amount DECIMAL(12,2),
    mortgage_amount DECIMAL(12,2),
    timeline JSON,
    documents JSON,
    payments JSON,
    notes TEXT,
    target_completion_date DATE,
    actual_completion_date DATE,
    offer_made_at TIMESTAMP NULL,
    offer_accepted_at TIMESTAMP NULL,
    contracts_exchanged_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_property_id (property_id),
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (solicitor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Reservations Table
CREATE TABLE reservations (
    id CHAR(36) PRIMARY KEY,
    property_id CHAR(36) NOT NULL,
    buyer_id CHAR(36) NOT NULL,
    transaction_id CHAR(36),
    status ENUM('ACTIVE', 'EXPIRED', 'CONVERTED', 'CANCELLED') DEFAULT 'ACTIVE',
    reservation_fee DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(12,2),
    terms_conditions JSON,
    special_conditions TEXT,
    reservation_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    extension_date DATE,
    is_legally_binding BOOLEAN DEFAULT FALSE,
    contract_reference VARCHAR(100),
    documents JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_property_id (property_id),
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_status (status),
    INDEX idx_reservation_date (reservation_date),
    INDEX idx_expiry_date (expiry_date),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
);

-- 9. HTB Applications Table
CREATE TABLE htb_applications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    property_id CHAR(36),
    transaction_id CHAR(36),
    status ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'CLAIMED') DEFAULT 'DRAFT',
    application_reference VARCHAR(50) UNIQUE,
    property_purchase_price DECIMAL(12,2),
    htb_relief_amount DECIMAL(10,2),
    annual_income DECIMAL(10,2) NOT NULL,
    is_first_time_buyer BOOLEAN DEFAULT TRUE,
    is_owner_occupier BOOLEAN DEFAULT TRUE,
    applicant_details JSON NOT NULL,
    employment_details JSON NOT NULL,
    financial_details JSON NOT NULL,
    property_details JSON,
    supporting_documents JSON,
    revenue_responses JSON,
    notes TEXT,
    application_date DATE NOT NULL,
    decision_date DATE,
    claim_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_property_id (property_id),
    INDEX idx_status (status),
    INDEX idx_application_date (application_date),
    INDEX idx_application_reference (application_reference),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
);

-- 10. Sessions Table
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id CHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload TEXT NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_last_activity (last_activity),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Sample Data
INSERT INTO locations (id, address, address_line1, city, county, eircode, country, latitude, longitude) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Dublin City Centre, Dublin, Ireland', 'Dublin City Centre', 'Dublin', 'Dublin', 'D01 ABC1', 'Ireland', 53.3498, -6.2603),
('550e8400-e29b-41d4-a716-446655440002', 'Cork City Centre, Cork, Ireland', 'Cork City Centre', 'Cork', 'Cork', 'T12 XYZ2', 'Ireland', 51.8985, -8.4756),
('550e8400-e29b-41d4-a716-446655440003', 'Galway City Centre, Galway, Ireland', 'Galway City Centre', 'Galway', 'Galway', 'H91 ABC3', 'Ireland', 53.2707, -9.0568);

-- Insert Sample Users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, status, kyc_status, location_id, email_verified_at) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'admin@propie.ie', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '+353-1-234-5678', 'ACTIVE', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'developer@propie.ie', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Developer', '+353-1-234-5679', 'ACTIVE', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'buyer@propie.ie', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Buyer', '+353-1-234-5680', 'ACTIVE', 'APPROVED', '550e8400-e29b-41d4-a716-446655440001', NOW());

-- Insert User Roles
INSERT INTO user_roles (id, user_id, role) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 'ADMIN'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', 'DEVELOPER'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440012', 'BUYER');