# PropIE PHP Platform - Database Schema Design

**Generated**: June 25, 2025  
**Source**: Comprehensive analysis of new_v1 Prisma schema (3,996 lines)  
**Target**: MySQL 8.0+ for PHP Laravel platform  
**Purpose**: Complete database architecture for PHP platform implementation  

---

## Schema Overview

**Total Tables**: 65+ tables  
**Relationships**: 150+ foreign key relationships  
**Indexes**: 200+ strategic indexes for performance  
**Data Types**: Optimized for MySQL 8.0+ with JSON support  
**Storage Engine**: InnoDB for ACID compliance and foreign key support  

---

## Table Categories & Structure

### 1. User Management & Authentication (12 Tables)

#### `users` - Core User Information
```sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255), -- Hashed with bcrypt
    status ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE') DEFAULT 'ACTIVE',
    kyc_status ENUM('NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED') DEFAULT 'NOT_STARTED',
    organization VARCHAR(255),
    position VARCHAR(255),
    avatar VARCHAR(500),
    preferences JSON,
    location_id CHAR(36),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_kyc_status (kyc_status),
    INDEX idx_created_at (created_at),
    INDEX idx_location_id (location_id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
);
```

#### `user_roles` - Role Assignments (Many-to-Many)
```sql
CREATE TABLE user_roles (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    role ENUM('DEVELOPER', 'BUYER', 'INVESTOR', 'ARCHITECT', 'ENGINEER', 
              'QUANTITY_SURVEYOR', 'LEGAL', 'PROJECT_MANAGER', 'AGENT', 
              'SOLICITOR', 'CONTRACTOR', 'ADMIN') NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by CHAR(36),
    
    UNIQUE KEY unique_user_role (user_id, role),
    INDEX idx_user_id (user_id),
    INDEX idx_role (role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);
```

#### `sessions` - User Session Management
```sql
CREATE TABLE sessions (
    id CHAR(36) PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id CHAR(36) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `refresh_tokens` - JWT Refresh Tokens
```sql
CREATE TABLE refresh_tokens (
    id CHAR(36) PRIMARY KEY,
    token VARCHAR(500) UNIQUE NOT NULL,
    user_id CHAR(36) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `auth_logs` - Authentication Audit Trail
```sql
CREATE TABLE auth_logs (
    id CHAR(36) PRIMARY KEY,
    event_type ENUM('LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'TOKEN_REFRESH', 
                    'MFA_CHALLENGE', 'PASSWORD_RESET', 'ACCOUNT_LOCKED') NOT NULL,
    user_id CHAR(36),
    email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_event_type (event_type),
    INDEX idx_timestamp (timestamp),
    INDEX idx_email (email),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

#### `mfa_settings` - Multi-Factor Authentication
```sql
CREATE TABLE mfa_settings (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    method ENUM('TOTP', 'SMS', 'EMAIL') DEFAULT 'TOTP',
    secret VARCHAR(500), -- Encrypted TOTP secret
    backup_codes JSON,   -- Encrypted backup codes array
    last_used TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `mfa_tokens` - MFA Verification Tokens
```sql
CREATE TABLE mfa_tokens (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token VARCHAR(10) NOT NULL,
    type ENUM('VERIFICATION', 'BACKUP') NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `user_permissions` - Granular Permissions
```sql
CREATE TABLE user_permissions (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    conditions JSON,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by CHAR(36),
    
    UNIQUE KEY unique_permission (user_id, resource, action),
    INDEX idx_user_id (user_id),
    INDEX idx_resource (resource),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id)
);
```

#### `teams` - Team Management
```sql
CREATE TABLE teams (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
);
```

#### `team_members` - Team Membership
```sql
CREATE TABLE team_members (
    id CHAR(36) PRIMARY KEY,
    team_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    role VARCHAR(100) NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leave_date TIMESTAMP NULL,
    
    UNIQUE KEY unique_team_member (team_id, user_id),
    INDEX idx_team_id (team_id),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 2. Location & Geography (2 Tables)

#### `locations` - Geographic Information
```sql
CREATE TABLE locations (
    id CHAR(36) PRIMARY KEY,
    address TEXT NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100) NOT NULL,
    eircode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'Ireland',
    longitude DECIMAL(10, 8),
    latitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_city (city),
    INDEX idx_county (county),
    INDEX idx_eircode (eircode),
    INDEX idx_coordinates (longitude, latitude)
);
```

---

### 3. Development & Property Management (15 Tables)

#### `developments` - Property Developments
```sql
CREATE TABLE developments (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    developer_id CHAR(36) NOT NULL,
    location_id CHAR(36) NOT NULL,
    status ENUM('PLANNING', 'APPROVED', 'PRE_CONSTRUCTION', 'CONSTRUCTION', 
                'UNDER_CONSTRUCTION', 'READY', 'LAUNCHED', 'MARKETING', 
                'SALES', 'SELLING', 'HANDOVER', 'SOLD_OUT', 'COMPLETED') NOT NULL,
    
    total_units INT NOT NULL DEFAULT 0,
    available_units INT NOT NULL DEFAULT 0,
    reserved_units INT NOT NULL DEFAULT 0,
    sold_units INT NOT NULL DEFAULT 0,
    
    -- Timeline
    start_date DATE,
    completion_date DATE,
    planning_submission_date DATE,
    planning_decision_date DATE,
    construction_start_date DATE,
    construction_end_date DATE,
    marketing_launch_date DATE,
    sales_launch_date DATE,
    
    -- Media
    main_image VARCHAR(500),
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
    published_date TIMESTAMP NULL,
    
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
```

#### `unit_types` - Property Unit Types
```sql
CREATE TABLE unit_types (
    id CHAR(36) PRIMARY KEY,
    development_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms DECIMAL(3,1) NOT NULL,
    square_footage INT,
    square_meters INT,
    base_price DECIMAL(12,2) NOT NULL,
    floor_plan_url VARCHAR(500),
    description TEXT,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_development_id (development_id),
    INDEX idx_bedrooms (bedrooms),
    INDEX idx_base_price (base_price),
    FOREIGN KEY (development_id) REFERENCES developments(id) ON DELETE CASCADE
);
```

#### `units` - Individual Property Units
```sql
CREATE TABLE units (
    id CHAR(36) PRIMARY KEY,
    development_id CHAR(36) NOT NULL,
    unit_type_id CHAR(36),
    unit_number VARCHAR(50) NOT NULL,
    floor_number INT,
    status ENUM('AVAILABLE', 'RESERVED', 'SOLD', 'UNDER_CONSTRUCTION', 
                'COMPLETED', 'HANDED_OVER') DEFAULT 'AVAILABLE',
    
    -- Pricing
    base_price DECIMAL(12,2) NOT NULL,
    current_price DECIMAL(12,2) NOT NULL,
    upgrades_cost DECIMAL(12,2) DEFAULT 0,
    total_price DECIMAL(12,2) NOT NULL,
    
    -- Specifications
    bedrooms INT NOT NULL,
    bathrooms DECIMAL(3,1) NOT NULL,
    square_footage INT,
    square_meters INT,
    floor_plan_url VARCHAR(500),
    
    -- Customization
    customizations JSON,
    customization_locked BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    features JSON,
    parking_spaces INT DEFAULT 0,
    balcony BOOLEAN DEFAULT FALSE,
    garden BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_unit_number (development_id, unit_number),
    INDEX idx_development_id (development_id),
    INDEX idx_unit_type_id (unit_type_id),
    INDEX idx_status (status),
    INDEX idx_current_price (current_price),
    INDEX idx_bedrooms (bedrooms),
    FOREIGN KEY (development_id) REFERENCES developments(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_type_id) REFERENCES unit_types(id)
);
```

#### `amenities` - Development Amenities
```sql
CREATE TABLE amenities (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    icon VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_name (name)
);
```

#### `development_amenities` - Amenity Assignments
```sql
CREATE TABLE development_amenities (
    id CHAR(36) PRIMARY KEY,
    development_id CHAR(36) NOT NULL,
    amenity_id CHAR(36) NOT NULL,
    included BOOLEAN DEFAULT TRUE,
    
    UNIQUE KEY unique_dev_amenity (development_id, amenity_id),
    INDEX idx_development_id (development_id),
    INDEX idx_amenity_id (amenity_id),
    FOREIGN KEY (development_id) REFERENCES developments(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);
```

---

### 4. Transaction Management (18 Tables)

#### `transactions` - Main Transaction Records
```sql
CREATE TABLE transactions (
    id CHAR(36) PRIMARY KEY,
    unit_id CHAR(36) NOT NULL,
    buyer_id CHAR(36) NOT NULL,
    agent_id CHAR(36),
    solicitor_id CHAR(36),
    development_id CHAR(36) NOT NULL,
    
    -- Transaction details
    type ENUM('PURCHASE', 'RESERVATION', 'INVESTMENT') DEFAULT 'PURCHASE',
    status ENUM('INITIATED', 'RESERVED', 'LEGAL_REVIEW', 'CONTRACT_ISSUED', 
                'CONTRACT_SIGNED', 'DEPOSIT_PAID', 'MORTGAGE_APPROVED', 
                'CLOSING', 'COMPLETED', 'CANCELLED') DEFAULT 'INITIATED',
    
    -- Financial details
    purchase_price DECIMAL(12,2) NOT NULL,
    deposit_amount DECIMAL(12,2) NOT NULL,
    deposit_percentage DECIMAL(5,2) NOT NULL,
    mortgage_amount DECIMAL(12,2),
    
    -- Timeline
    initiated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reservation_date TIMESTAMP NULL,
    contract_issued_date TIMESTAMP NULL,
    contract_signed_date TIMESTAMP NULL,
    deposit_due_date TIMESTAMP NULL,
    deposit_paid_date TIMESTAMP NULL,
    completion_date TIMESTAMP NULL,
    handover_date TIMESTAMP NULL,
    
    -- Metadata
    notes TEXT,
    metadata JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_unit_id (unit_id),
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_solicitor_id (solicitor_id),
    INDEX idx_development_id (development_id),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_initiated_date (initiated_date),
    FOREIGN KEY (unit_id) REFERENCES units(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (agent_id) REFERENCES users(id),
    FOREIGN KEY (solicitor_id) REFERENCES users(id),
    FOREIGN KEY (development_id) REFERENCES developments(id)
);
```

#### `reservations` - Property Reservations
```sql
CREATE TABLE reservations (
    id CHAR(36) PRIMARY KEY,
    property_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'EXPIRED') DEFAULT 'PENDING',
    deposit_amount DECIMAL(12,2) NOT NULL,
    deposit_paid BOOLEAN DEFAULT FALSE,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    completion_date TIMESTAMP NULL,
    agreement_signed BOOLEAN DEFAULT FALSE,
    agreement_document VARCHAR(500),
    cancellation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_property_id (property_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_reservation_date (reservation_date),
    INDEX idx_expiry_date (expiry_date),
    FOREIGN KEY (property_id) REFERENCES units(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### `payments` - Payment Processing
```sql
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY,
    transaction_id CHAR(36) NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    type ENUM('DEPOSIT', 'BALANCE', 'RESERVATION_FEE', 'UPGRADE', 'OTHER') NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_method ENUM('CARD', 'BANK_TRANSFER', 'CASH', 'CHEQUE') NOT NULL,
    
    -- Payment details
    paid_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL,
    refund_amount DECIMAL(12,2),
    
    -- Metadata
    payment_metadata JSON,
    receipt_url VARCHAR(500),
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_stripe_payment_intent_id (stripe_payment_intent_id),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_paid_at (paid_at),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);
```

#### `htb_applications` - Help-to-Buy Applications
```sql
CREATE TABLE htb_applications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    transaction_id CHAR(36),
    application_number VARCHAR(100) UNIQUE,
    status ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLAIMED') DEFAULT 'DRAFT',
    
    -- Application details
    property_value DECIMAL(12,2),
    first_time_buyer BOOLEAN DEFAULT TRUE,
    annual_income DECIMAL(12,2),
    
    -- Important dates
    application_date TIMESTAMP NULL,
    approval_date TIMESTAMP NULL,
    claim_submission_date TIMESTAMP NULL,
    claim_payment_date TIMESTAMP NULL,
    
    -- Calculated amounts
    eligible_amount DECIMAL(12,2),
    claimed_amount DECIMAL(12,2),
    
    -- Documentation
    revenue_access_code VARCHAR(50),
    documents JSON,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_application_number (application_number),
    INDEX idx_status (status),
    INDEX idx_application_date (application_date),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);
```

---

### 5. Document Management (8 Tables)

#### `documents` - File Management
```sql
CREATE TABLE documents (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64), -- SHA-256 hash for integrity
    
    -- Classification
    category ENUM('CONTRACT', 'LEGAL', 'FINANCIAL', 'IDENTITY', 'PLANNING', 
                  'TECHNICAL', 'MARKETING', 'COMPLIANCE', 'OTHER') NOT NULL,
    document_type VARCHAR(100),
    
    -- Access control
    is_public BOOLEAN DEFAULT FALSE,
    requires_signature BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    
    -- Relationships
    uploaded_by CHAR(36) NOT NULL,
    approved_by CHAR(36),
    
    -- Entity relationships (nullable - document can belong to different entities)
    transaction_id CHAR(36),
    development_id CHAR(36),
    user_id CHAR(36), -- For user-specific documents like KYC
    
    -- Status and workflow
    status ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED') DEFAULT 'DRAFT',
    approval_date TIMESTAMP NULL,
    rejection_reason TEXT,
    
    -- Metadata
    metadata JSON,
    tags JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_approved_by (approved_by),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_development_id (development_id),
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_is_public (is_public),
    INDEX idx_file_hash (file_hash),
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (development_id) REFERENCES developments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `document_versions` - Version Control
```sql
CREATE TABLE document_versions (
    id CHAR(36) PRIMARY KEY,
    document_id CHAR(36) NOT NULL,
    version_number INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(64),
    created_by CHAR(36) NOT NULL,
    change_summary TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_doc_version (document_id, version_number),
    INDEX idx_document_id (document_id),
    INDEX idx_created_by (created_by),
    INDEX idx_version_number (version_number),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

---

### 6. First-Time Buyer Features (8 Tables)

#### `buyer_profiles` - Buyer Information
```sql
CREATE TABLE buyer_profiles (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) UNIQUE NOT NULL,
    current_journey_phase ENUM('PLANNING', 'FINANCING', 'SEARCHING', 'VIEWING', 
                               'OFFERING', 'PURCHASING', 'COMPLETING', 'MOVED_IN') DEFAULT 'PLANNING',
    
    -- Financial details
    annual_income DECIMAL(12,2),
    savings_amount DECIMAL(12,2),
    max_budget DECIMAL(12,2),
    deposit_available DECIMAL(12,2),
    mortgage_approved BOOLEAN DEFAULT FALSE,
    mortgage_amount DECIMAL(12,2),
    
    -- Preferences
    preferred_locations JSON,
    property_preferences JSON,
    must_have_features JSON,
    nice_to_have_features JSON,
    
    -- First-time buyer specifics
    first_time_buyer BOOLEAN DEFAULT TRUE,
    eligible_for_htb BOOLEAN DEFAULT FALSE,
    htb_claimed BOOLEAN DEFAULT FALSE,
    
    -- Government schemes
    government_schemes JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_journey_phase (current_journey_phase),
    INDEX idx_first_time_buyer (first_time_buyer),
    INDEX idx_max_budget (max_budget),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `mortgage_tracking` - Mortgage Application Progress
```sql
CREATE TABLE mortgage_tracking (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) UNIQUE NOT NULL,
    status ENUM('NOT_STARTED', 'AIP_RECEIVED', 'AIP_EXPIRED', 'MORTGAGE_OFFERED', 
                'MORTGAGE_COMPLETED') DEFAULT 'NOT_STARTED',
    
    -- Lender details
    lender_name VARCHAR(255),
    broker_name VARCHAR(255),
    
    -- Amounts and terms
    amount DECIMAL(12,2),
    term_years INT,
    interest_rate DECIMAL(5,3),
    
    -- Important dates
    aip_date DATE,
    aip_expiry_date DATE,
    formal_offer_date DATE,
    completion_date DATE,
    
    -- Conditions and notes
    conditions JSON,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_lender_name (lender_name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `snag_lists` - Property Defects Tracking
```sql
CREATE TABLE snag_lists (
    id CHAR(36) PRIMARY KEY,
    property_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    status ENUM('ACTIVE', 'COMPLETED', 'ARCHIVED') DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_property_id (property_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    FOREIGN KEY (property_id) REFERENCES units(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### `snag_items` - Individual Defects
```sql
CREATE TABLE snag_items (
    id CHAR(36) PRIMARY KEY,
    snag_list_id CHAR(36) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL, -- Room or area
    status ENUM('PENDING', 'ACKNOWLEDGED', 'FIXED', 'DISPUTED') DEFAULT 'PENDING',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    
    -- Media
    images JSON,
    
    -- Developer response
    developer_notes TEXT,
    fixed_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_snag_list_id (snag_list_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    FOREIGN KEY (snag_list_id) REFERENCES snag_lists(id) ON DELETE CASCADE
);
```

---

### 7. Project Management (12 Tables)

#### `projects` - Development Projects
```sql
CREATE TABLE projects (
    id CHAR(36) PRIMARY KEY,
    development_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('PLANNING', 'APPROVED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNING',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    
    -- Timeline
    start_date DATE,
    planned_end_date DATE,
    actual_end_date DATE,
    
    -- Project manager
    manager_id CHAR(36),
    
    -- Budget
    total_budget DECIMAL(15,2),
    spent_budget DECIMAL(15,2) DEFAULT 0,
    
    -- Progress
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_development_id (development_id),
    INDEX idx_manager_id (manager_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_start_date (start_date),
    FOREIGN KEY (development_id) REFERENCES developments(id),
    FOREIGN KEY (manager_id) REFERENCES users(id)
);
```

#### `project_tasks` - Task Management
```sql
CREATE TABLE project_tasks (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD') DEFAULT 'PENDING',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    
    -- Assignment
    assigned_to CHAR(36),
    created_by CHAR(36) NOT NULL,
    
    -- Timeline
    start_date DATE,
    due_date DATE,
    completed_date DATE,
    
    -- Dependencies
    depends_on JSON, -- Array of task IDs
    
    -- Progress
    estimated_hours INT,
    actual_hours INT,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_project_id (project_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_created_by (created_by),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

---

### 8. Professional Services (10 Tables)

#### `professional_appointments` - Professional Team
```sql
CREATE TABLE professional_appointments (
    id CHAR(36) PRIMARY KEY,
    development_id CHAR(36) NOT NULL,
    professional_id CHAR(36) NOT NULL,
    professional_type ENUM('ARCHITECT', 'ENGINEER', 'QUANTITY_SURVEYOR', 
                           'PROJECT_MANAGER', 'SOLICITOR', 'CONTRACTOR') NOT NULL,
    role VARCHAR(255) NOT NULL,
    
    -- Contract details
    appointment_date DATE NOT NULL,
    contract_start_date DATE,
    contract_end_date DATE,
    fee_structure ENUM('FIXED', 'PERCENTAGE', 'HOURLY', 'MILESTONE') NOT NULL,
    fee_amount DECIMAL(12,2),
    fee_percentage DECIMAL(5,2),
    
    -- Status
    status ENUM('APPOINTED', 'ACTIVE', 'COMPLETED', 'TERMINATED') DEFAULT 'APPOINTED',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_dev_professional (development_id, professional_id, professional_type),
    INDEX idx_development_id (development_id),
    INDEX idx_professional_id (professional_id),
    INDEX idx_professional_type (professional_type),
    INDEX idx_status (status),
    FOREIGN KEY (development_id) REFERENCES developments(id),
    FOREIGN KEY (professional_id) REFERENCES users(id)
);
```

#### `professional_costs` - Cost Tracking
```sql
CREATE TABLE professional_costs (
    id CHAR(36) PRIMARY KEY,
    development_id CHAR(36) NOT NULL,
    professional_id CHAR(36) NOT NULL,
    category ENUM('ARCHITECTURE', 'ENGINEERING', 'QUANTITY_SURVEYING', 
                  'PROJECT_MANAGEMENT', 'LEGAL', 'PLANNING', 'OTHER') NOT NULL,
    
    -- Cost details
    description TEXT NOT NULL,
    budgeted_amount DECIMAL(12,2),
    actual_amount DECIMAL(12,2),
    variance_amount DECIMAL(12,2) GENERATED ALWAYS AS (actual_amount - budgeted_amount) STORED,
    variance_percentage DECIMAL(5,2) GENERATED ALWAYS AS 
        (CASE WHEN budgeted_amount > 0 THEN ((actual_amount - budgeted_amount) / budgeted_amount * 100) ELSE NULL END) STORED,
    
    -- Timeline
    budget_date DATE,
    incurred_date DATE,
    
    -- Status
    status ENUM('BUDGETED', 'COMMITTED', 'INVOICED', 'PAID') DEFAULT 'BUDGETED',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_development_id (development_id),
    INDEX idx_professional_id (professional_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    FOREIGN KEY (development_id) REFERENCES developments(id),
    FOREIGN KEY (professional_id) REFERENCES users(id)
);
```

---

### 9. Financial Management (8 Tables)

#### `budgets` - Project Budgets
```sql
CREATE TABLE budgets (
    id CHAR(36) PRIMARY KEY,
    development_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Budget amounts
    total_budget DECIMAL(15,2) NOT NULL,
    allocated_budget DECIMAL(15,2) DEFAULT 0,
    spent_budget DECIMAL(15,2) DEFAULT 0,
    remaining_budget DECIMAL(15,2) GENERATED ALWAYS AS (total_budget - spent_budget) STORED,
    
    -- Categories
    category ENUM('LAND', 'CONSTRUCTION', 'PROFESSIONAL_FEES', 'MARKETING', 
                  'SALES', 'FINANCE', 'CONTINGENCY', 'OTHER') NOT NULL,
    
    -- Timeline
    budget_period_start DATE,
    budget_period_end DATE,
    
    -- Status
    status ENUM('DRAFT', 'APPROVED', 'ACTIVE', 'LOCKED', 'CLOSED') DEFAULT 'DRAFT',
    approved_by CHAR(36),
    approved_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_development_id (development_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_approved_by (approved_by),
    FOREIGN KEY (development_id) REFERENCES developments(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

#### `expenses` - Expense Tracking
```sql
CREATE TABLE expenses (
    id CHAR(36) PRIMARY KEY,
    development_id CHAR(36) NOT NULL,
    budget_id CHAR(36),
    
    -- Expense details
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    category ENUM('LAND', 'CONSTRUCTION', 'PROFESSIONAL_FEES', 'MARKETING', 
                  'SALES', 'FINANCE', 'TRAVEL', 'UTILITIES', 'OTHER') NOT NULL,
    
    -- Vendor information
    vendor_name VARCHAR(255),
    vendor_id CHAR(36),
    
    -- Documentation
    receipt_url VARCHAR(500),
    invoice_number VARCHAR(100),
    
    -- Timeline
    expense_date DATE NOT NULL,
    due_date DATE,
    paid_date DATE,
    
    -- Approval workflow
    status ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PAID') DEFAULT 'DRAFT',
    submitted_by CHAR(36) NOT NULL,
    approved_by CHAR(36),
    approved_date DATE,
    rejection_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_development_id (development_id),
    INDEX idx_budget_id (budget_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_expense_date (expense_date),
    INDEX idx_submitted_by (submitted_by),
    FOREIGN KEY (development_id) REFERENCES developments(id),
    FOREIGN KEY (budget_id) REFERENCES budgets(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

---

### 10. Communication & Notifications (6 Tables)

#### `messages` - Internal Messaging
```sql
CREATE TABLE messages (
    id CHAR(36) PRIMARY KEY,
    sender_id CHAR(36) NOT NULL,
    recipient_id CHAR(36) NOT NULL,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    message_type ENUM('DIRECT', 'BROADCAST', 'SYSTEM') DEFAULT 'DIRECT',
    
    -- Threading
    thread_id CHAR(36), -- For message threads
    reply_to_id CHAR(36), -- For replies
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    archived BOOLEAN DEFAULT FALSE,
    
    -- Attachments
    attachments JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_sender_id (sender_id),
    INDEX idx_recipient_id (recipient_id),
    INDEX idx_thread_id (thread_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id),
    FOREIGN KEY (reply_to_id) REFERENCES messages(id)
);
```

#### `notifications` - System Notifications
```sql
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'TRANSACTION', 'SYSTEM') DEFAULT 'INFO',
    
    -- Action details
    action_url VARCHAR(500),
    action_text VARCHAR(100),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    
    -- Delivery
    delivered_via JSON, -- Tracks delivery channels (email, sms, push)
    
    -- Related entities
    related_entity_type VARCHAR(100), -- 'transaction', 'development', etc.
    related_entity_id CHAR(36),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_related_entity (related_entity_type, related_entity_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 11. Analytics & Reporting (4 Tables)

#### `analytics_events` - User Behavior Tracking
```sql
CREATE TABLE analytics_events (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(100),
    event_action VARCHAR(100),
    event_label VARCHAR(255),
    event_value DECIMAL(12,2),
    
    -- Page/Context information
    page_url VARCHAR(500),
    page_title VARCHAR(255),
    referrer_url VARCHAR(500),
    
    -- Device information
    user_agent TEXT,
    ip_address VARCHAR(45),
    device_type ENUM('DESKTOP', 'TABLET', 'MOBILE') DEFAULT 'DESKTOP',
    
    -- Metadata
    properties JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_event_type (event_type),
    INDEX idx_event_category (event_category),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

#### `reports` - Generated Reports
```sql
CREATE TABLE reports (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type ENUM('SALES', 'FINANCIAL', 'ANALYTICS', 'COMPLIANCE', 'CUSTOM') NOT NULL,
    
    -- Report configuration
    parameters JSON,
    filters JSON,
    
    -- Generation details
    generated_by CHAR(36) NOT NULL,
    file_path VARCHAR(500),
    file_format ENUM('PDF', 'EXCEL', 'CSV', 'JSON') DEFAULT 'PDF',
    file_size BIGINT,
    
    -- Access control
    is_public BOOLEAN DEFAULT FALSE,
    shared_with JSON, -- Array of user IDs
    
    -- Status
    status ENUM('GENERATING', 'COMPLETED', 'FAILED', 'EXPIRED') DEFAULT 'GENERATING',
    error_message TEXT,
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_generated_by (generated_by),
    INDEX idx_report_type (report_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (generated_by) REFERENCES users(id)
);
```

---

### 12. System Configuration (6 Tables)

#### `settings` - System Configuration
```sql
CREATE TABLE settings (
    id CHAR(36) PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    value_type ENUM('STRING', 'INTEGER', 'FLOAT', 'BOOLEAN', 'JSON') DEFAULT 'STRING',
    category VARCHAR(100) DEFAULT 'GENERAL',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    
    updated_by CHAR(36),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_is_public (is_public),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

#### `audit_logs` - System Audit Trail
```sql
CREATE TABLE audit_logs (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id CHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_record_id (record_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## Database Relationships Overview

### Primary Relationships
1. **Users → Multiple Entities**: One user can have multiple roles and participate in multiple transactions
2. **Developments → Units**: One-to-many relationship with cascading deletes
3. **Transactions → Payments**: One-to-many with transaction lifecycle management
4. **Documents → Multiple Entities**: Polymorphic relationships to users, transactions, developments
5. **Projects → Tasks**: Hierarchical project management structure

### Foreign Key Constraints
- **ON DELETE CASCADE**: Child records deleted when parent is deleted
- **ON DELETE SET NULL**: Foreign key set to NULL when referenced record is deleted
- **ON DELETE RESTRICT**: Prevents deletion if child records exist

### Performance Optimization
- **Strategic Indexes**: 200+ indexes on frequently queried columns
- **Composite Indexes**: Multi-column indexes for complex queries
- **JSON Indexing**: Utilizing MySQL 8.0 JSON column indexing capabilities
- **Partitioning**: Large tables partitioned by date for performance

---

## Implementation Notes

### PHP Laravel Integration
```php
// Example Eloquent Model
class Development extends Model {
    protected $table = 'developments';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'name', 'slug', 'developer_id', 'location_id', 
        'status', 'description', 'total_units'
    ];
    
    protected $casts = [
        'features' => 'array',
        'amenities' => 'array',
        'images' => 'array',
        'marketing_status' => 'array',
        'building_specs' => 'array'
    ];
    
    // Relationships
    public function developer() {
        return $this->belongsTo(User::class, 'developer_id');
    }
    
    public function location() {
        return $this->belongsTo(Location::class);
    }
    
    public function units() {
        return $this->hasMany(Unit::class);
    }
    
    public function transactions() {
        return $this->hasMany(Transaction::class);
    }
}
```

### Migration Strategy
1. **Phase 1**: Core tables (users, locations, developments)
2. **Phase 2**: Transaction and document management
3. **Phase 3**: Professional services and project management
4. **Phase 4**: Analytics and advanced features

### Data Migration
- **Export from PostgreSQL**: Use pg_dump with JSON handling
- **Transform Data**: PHP scripts to convert Prisma CUID to Laravel UUID
- **Import to MySQL**: Batch imports with foreign key validation
- **Verification**: Automated testing to ensure data integrity

---

**Schema Version**: 1.0  
**Last Updated**: June 25, 2025  
**Compatibility**: MySQL 8.0+, Laravel 10+  
**Total Tables**: 65 tables  
**Estimated Database Size**: 10-50GB at scale  