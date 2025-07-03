-- Migration: 0006_sqlite_professional_ecosystem.sql
-- Purpose: Implement complete 49-role professional ecosystem for SQLite
-- Phase 1 Week 2: Complete Professional Role System
-- Date: June 21, 2025

-- CRITICAL: This migration creates the complete professional ecosystem
-- compatible with SQLite database features

BEGIN TRANSACTION;

-- Create comprehensive users table with professional role system
-- SQLite compatible with CHECK constraints for role validation
CREATE TABLE IF NOT EXISTS users (
    id TEXT NOT NULL PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Core user fields
    password_hash TEXT,
    phone TEXT,
    address TEXT,
    verified BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    
    -- Professional role system - supporting all 49 roles
    -- Primary professional role (one of 49 available roles)
    professional_role_primary TEXT CHECK (professional_role_primary IN (
        -- Original roles
        'DEVELOPER', 'BUYER', 'INVESTOR', 'ARCHITECT', 'ENGINEER', 'QUANTITY_SURVEYOR', 
        'LEGAL', 'PROJECT_MANAGER', 'AGENT', 'SOLICITOR', 'CONTRACTOR', 'ADMIN',
        
        -- Primary Transaction Roles (Buyer Ecosystem)
        'BUYER_SOLICITOR', 'BUYER_MORTGAGE_BROKER', 'BUYER_SURVEYOR', 
        'BUYER_FINANCIAL_ADVISOR', 'BUYER_INSURANCE_BROKER',
        
        -- Developer Ecosystem Roles
        'DEVELOPER_SOLICITOR', 'DEVELOPMENT_SALES_AGENT', 'DEVELOPMENT_PROJECT_MANAGER',
        'DEVELOPMENT_MARKETING_MANAGER', 'DEVELOPMENT_FINANCIAL_CONTROLLER',
        
        -- Professional Services Roles
        'ESTATE_AGENT', 'ESTATE_AGENT_MANAGER', 'MORTGAGE_LENDER', 'MORTGAGE_UNDERWRITER',
        'PROPERTY_VALUER', 'BUILDING_SURVEYOR', 'INSURANCE_UNDERWRITER', 'PROPERTY_MANAGER',
        'LAND_REGISTRY_OFFICER', 'REVENUE_OFFICER', 'LOCAL_AUTHORITY_OFFICER', 'BUILDING_CONTROL_OFFICER',
        
        -- Design and Construction Professionals
        'LEAD_ARCHITECT', 'DESIGN_ARCHITECT', 'TECHNICAL_ARCHITECT', 'LANDSCAPE_ARCHITECT',
        'STRUCTURAL_ENGINEER', 'CIVIL_ENGINEER', 'MEP_ENGINEER', 'ENVIRONMENTAL_ENGINEER',
        'MAIN_CONTRACTOR', 'PROJECT_MANAGER_CONSTRUCTION', 'SITE_FOREMAN', 'HEALTH_SAFETY_OFFICER',
        
        -- Compliance and Certification Specialists
        'BER_ASSESSOR', 'NZEB_CONSULTANT', 'SUSTAINABILITY_CONSULTANT',
        'BCAR_CERTIFIER', 'FIRE_SAFETY_CONSULTANT', 'ACCESSIBILITY_CONSULTANT',
        'HOMEBOND_ADMINISTRATOR', 'STRUCTURAL_WARRANTY_INSPECTOR', 'QUALITY_ASSURANCE_INSPECTOR',
        
        -- Specialized Advisory Roles
        'TAX_ADVISOR', 'PLANNING_CONSULTANT', 'CONVEYANCING_SPECIALIST'
    )),
    
    -- Additional professional roles (stored as JSON array)
    professional_roles_secondary TEXT DEFAULT '[]', -- JSON array of secondary roles
    professional_specializations TEXT DEFAULT '[]', -- JSON array of specialization areas
    professional_certifications TEXT DEFAULT '[]', -- JSON array of certifications
    
    -- Professional status and details
    professional_status TEXT DEFAULT 'active' CHECK (professional_status IN ('active', 'inactive', 'suspended', 'pending')),
    license_number TEXT,
    professional_body_primary TEXT,
    professional_bodies TEXT DEFAULT '[]', -- JSON array of professional body memberships
    
    -- Contact and availability preferences
    contact_preferences TEXT DEFAULT '{}', -- JSON object for contact preferences
    availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable', 'on_leave')),
    hourly_rate DECIMAL(10,2),
    location_preferences TEXT DEFAULT '[]', -- JSON array of preferred locations
    project_capacity INTEGER DEFAULT 5,
    experience_years INTEGER,
    portfolio_url TEXT,
    professional_bio TEXT
);

-- Create professional associations table for detailed certification tracking
CREATE TABLE IF NOT EXISTS professional_associations (
    id TEXT NOT NULL PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    association_type TEXT NOT NULL CHECK (association_type IN (
        'RIAI', 'Engineers_Ireland', 'Law_Society', 'SCSI', 'RICS', 'CIF', 
        'SEAI', 'NSAI', 'CIBSE', 'CIOB', 'ISTRUCTE', 'IEI', 'IPB'
    )),
    membership_number TEXT,
    membership_status TEXT DEFAULT 'active' CHECK (membership_status IN ('active', 'suspended', 'expired', 'pending', 'lapsed')),
    membership_grade TEXT, -- Fellow, Member, Associate, Student, etc.
    verified_at TIMESTAMP,
    verified_by TEXT,
    issue_date DATE,
    expiry_date DATE,
    renewal_date DATE,
    continuing_education_hours INTEGER DEFAULT 0,
    annual_cpe_requirement INTEGER, -- Required CPE hours per year
    professional_indemnity_amount DECIMAL(12,2), -- PI insurance coverage
    professional_indemnity_expiry DATE,
    metadata TEXT DEFAULT '{}', -- JSON for association-specific data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Create professional certifications table for specific qualifications
CREATE TABLE IF NOT EXISTS professional_certifications (
    id TEXT NOT NULL PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    certification_type TEXT NOT NULL,
    -- BER_Assessor, BCAR_Inspector, NZEB_Advisor, Fire_Safety_Engineer, etc.
    certification_level TEXT, -- Basic, Advanced, Expert, etc.
    issuing_authority TEXT, -- SEAI, NSAI, Engineers_Ireland, etc.
    certification_number TEXT,
    certification_status TEXT DEFAULT 'active' CHECK (certification_status IN ('active', 'expired', 'suspended', 'pending_renewal', 'withdrawn')),
    issue_date DATE,
    expiry_date DATE,
    renewal_requirements TEXT,
    scope_of_certification TEXT, -- What this certification covers
    verified_at TIMESTAMP,
    verified_by TEXT,
    metadata TEXT DEFAULT '{}', -- JSON for certification-specific data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Create professional skills and specializations table
CREATE TABLE IF NOT EXISTS professional_specializations (
    id TEXT NOT NULL PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    specialization_category TEXT NOT NULL CHECK (specialization_category IN (
        'Property_Type', 'Project_Type', 'Technology', 'Geographic', 'Industry_Sector'
    )),
    specialization_name TEXT NOT NULL,
    -- Residential, Commercial, Conservation, BIM, Passive_House, Dublin, Cork, etc.
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
    years_experience INTEGER,
    project_count INTEGER, -- Number of projects completed in this specialization
    verified BOOLEAN DEFAULT FALSE,
    verified_by TEXT,
    verified_at TIMESTAMP,
    portfolio_examples TEXT DEFAULT '[]', -- JSON array of project references/descriptions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Create comprehensive indexes for professional role queries
CREATE INDEX IF NOT EXISTS idx_users_professional_role_primary ON users(professional_role_primary) 
WHERE professional_role_primary IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_professional_status ON users(professional_status);

CREATE INDEX IF NOT EXISTS idx_users_availability ON users(availability_status, professional_role_primary)
WHERE availability_status = 'available' AND professional_role_primary IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_hourly_rate ON users(hourly_rate) 
WHERE hourly_rate IS NOT NULL;

-- Indexes for professional associations
CREATE INDEX IF NOT EXISTS idx_professional_associations_user ON professional_associations(user_id);

CREATE INDEX IF NOT EXISTS idx_professional_associations_type_status 
ON professional_associations(association_type, membership_status);

CREATE INDEX IF NOT EXISTS idx_professional_associations_expiry 
ON professional_associations(expiry_date) 
WHERE expiry_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_professional_associations_pi_expiry 
ON professional_associations(professional_indemnity_expiry) 
WHERE professional_indemnity_expiry IS NOT NULL;

-- Indexes for professional certifications
CREATE INDEX IF NOT EXISTS idx_professional_certifications_user 
ON professional_certifications(user_id);

CREATE INDEX IF NOT EXISTS idx_professional_certifications_type_status 
ON professional_certifications(certification_type, certification_status);

CREATE INDEX IF NOT EXISTS idx_professional_certifications_expiry 
ON professional_certifications(expiry_date) 
WHERE expiry_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_professional_certifications_authority 
ON professional_certifications(issuing_authority);

-- Indexes for professional specializations
CREATE INDEX IF NOT EXISTS idx_professional_specializations_user 
ON professional_specializations(user_id);

CREATE INDEX IF NOT EXISTS idx_professional_specializations_category 
ON professional_specializations(specialization_category, proficiency_level);

CREATE INDEX IF NOT EXISTS idx_professional_specializations_verified 
ON professional_specializations(specialization_name, verified) 
WHERE verified = TRUE;

COMMIT;

-- Note: This migration implements the complete 49-role professional ecosystem
-- for SQLite, supporting comprehensive Irish property development coordination