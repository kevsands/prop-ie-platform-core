-- Migration: 0006_complete_professional_ecosystem.sql
-- Purpose: Implement complete 49-role professional ecosystem
-- Phase 1 Week 2: Complete Professional Role System
-- Date: June 21, 2025

-- CRITICAL: This migration extends the existing UserRole enum to support
-- the complete professional ecosystem as specified in COMPLETE_PROFESSIONAL_ECOSYSTEM.md

BEGIN;

-- Extend the existing UserRole enum with all 49 professional roles
-- Current enum has: DEVELOPER, BUYER, INVESTOR, ARCHITECT, ENGINEER, QUANTITY_SURVEYOR, LEGAL, PROJECT_MANAGER, AGENT, SOLICITOR, CONTRACTOR, ADMIN

-- Add Primary Transaction Roles (Buyer Ecosystem)
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BUYER_SOLICITOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BUYER_MORTGAGE_BROKER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BUYER_SURVEYOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BUYER_FINANCIAL_ADVISOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BUYER_INSURANCE_BROKER';

-- Add Developer Ecosystem Roles
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'DEVELOPER_SOLICITOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'DEVELOPMENT_SALES_AGENT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'DEVELOPMENT_PROJECT_MANAGER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'DEVELOPMENT_MARKETING_MANAGER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'DEVELOPMENT_FINANCIAL_CONTROLLER';

-- Add Professional Services Roles
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ESTATE_AGENT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ESTATE_AGENT_MANAGER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MORTGAGE_LENDER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MORTGAGE_UNDERWRITER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PROPERTY_VALUER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BUILDING_SURVEYOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'INSURANCE_UNDERWRITER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PROPERTY_MANAGER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LAND_REGISTRY_OFFICER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'REVENUE_OFFICER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LOCAL_AUTHORITY_OFFICER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BUILDING_CONTROL_OFFICER';

-- Add Design and Construction Professionals
-- Architectural Team
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LEAD_ARCHITECT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'DESIGN_ARCHITECT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'TECHNICAL_ARCHITECT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'LANDSCAPE_ARCHITECT';

-- Engineering Team
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'STRUCTURAL_ENGINEER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'CIVIL_ENGINEER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MEP_ENGINEER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ENVIRONMENTAL_ENGINEER';

-- Construction Team
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MAIN_CONTRACTOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PROJECT_MANAGER_CONSTRUCTION';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SITE_FOREMAN';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'HEALTH_SAFETY_OFFICER';

-- Add Compliance and Certification Specialists
-- Energy and Sustainability
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BER_ASSESSOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'NZEB_CONSULTANT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SUSTAINABILITY_CONSULTANT';

-- Building Compliance
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BCAR_CERTIFIER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'FIRE_SAFETY_CONSULTANT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ACCESSIBILITY_CONSULTANT';

-- Warranty and Insurance
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'HOMEBOND_ADMINISTRATOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'STRUCTURAL_WARRANTY_INSPECTOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'QUALITY_ASSURANCE_INSPECTOR';

-- Add Specialized Advisory Roles
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'TAX_ADVISOR';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PLANNING_CONSULTANT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'CONVEYANCING_SPECIALIST';

-- Add comprehensive professional ecosystem columns to existing users table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "professional_role_primary" "UserRole";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "professional_roles_secondary" "UserRole"[] DEFAULT '{}';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "professional_specializations" VARCHAR[] DEFAULT '{}';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "professional_certifications" JSONB DEFAULT '[]';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "professional_status" VARCHAR(50) DEFAULT 'active';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "license_number" VARCHAR(100);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "professional_body_primary" VARCHAR(100);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "professional_bodies" VARCHAR[] DEFAULT '{}';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "contact_preferences" JSONB DEFAULT '{}';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "availability_status" VARCHAR(50) DEFAULT 'available';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "hourly_rate" DECIMAL(10,2);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "location_preferences" VARCHAR[] DEFAULT '{}';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "project_capacity" INTEGER DEFAULT 5;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "experience_years" INTEGER;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "portfolio_url" VARCHAR(500);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "professional_bio" TEXT;

-- Create professional associations table for detailed certification tracking
CREATE TABLE IF NOT EXISTS "professional_associations" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "association_type" VARCHAR(100) NOT NULL, 
    -- RIAI, Engineers_Ireland, Law_Society, SCSI, RICS, CIF, SEAI, NSAI
    "membership_number" VARCHAR(100),
    "membership_status" VARCHAR(50) DEFAULT 'active', 
    -- active, suspended, expired, pending, lapsed
    "membership_grade" VARCHAR(100), -- Fellow, Member, Associate, Student, etc.
    "verified_at" TIMESTAMPTZ,
    "verified_by" TEXT,
    "issue_date" DATE,
    "expiry_date" DATE,
    "renewal_date" DATE,
    "continuing_education_hours" INTEGER DEFAULT 0,
    "annual_cpe_requirement" INTEGER, -- Required CPE hours per year
    "professional_indemnity_amount" DECIMAL(12,2), -- PI insurance coverage
    "professional_indemnity_expiry" DATE,
    "metadata" JSONB DEFAULT '{}', -- Association-specific data
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT "fk_professional_associations_user" 
        FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_professional_associations_verifier" 
        FOREIGN KEY ("verified_by") REFERENCES "User"("id")
);

-- Create professional certifications table for specific qualifications
CREATE TABLE IF NOT EXISTS "professional_certifications" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "certification_type" VARCHAR(100) NOT NULL,
    -- BER_Assessor, BCAR_Inspector, NZEB_Advisor, Fire_Safety_Engineer, etc.
    "certification_level" VARCHAR(50), -- Basic, Advanced, Expert, etc.
    "issuing_authority" VARCHAR(100), -- SEAI, NSAI, Engineers_Ireland, etc.
    "certification_number" VARCHAR(100),
    "certification_status" VARCHAR(50) DEFAULT 'active',
    -- active, expired, suspended, pending_renewal, withdrawn
    "issue_date" DATE,
    "expiry_date" DATE,
    "renewal_requirements" TEXT,
    "scope_of_certification" TEXT, -- What this certification covers
    "verified_at" TIMESTAMPTZ,
    "verified_by" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT "fk_professional_certifications_user" 
        FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_professional_certifications_verifier" 
        FOREIGN KEY ("verified_by") REFERENCES "User"("id")
);

-- Create professional skills and specializations table
CREATE TABLE IF NOT EXISTS "professional_specializations" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "specialization_category" VARCHAR(100) NOT NULL, 
    -- Property_Type, Project_Type, Technology, Geographic, Industry_Sector
    "specialization_name" VARCHAR(200) NOT NULL,
    -- Residential, Commercial, Conservation, BIM, Passive_House, Dublin, Cork, etc.
    "proficiency_level" INTEGER CHECK ("proficiency_level" BETWEEN 1 AND 5),
    "years_experience" INTEGER,
    "project_count" INTEGER, -- Number of projects completed in this specialization
    "verified" BOOLEAN DEFAULT false,
    "verified_by" TEXT,
    "verified_at" TIMESTAMPTZ,
    "portfolio_examples" TEXT[], -- Array of project references/descriptions
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT "fk_professional_specializations_user" 
        FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_professional_specializations_verifier" 
        FOREIGN KEY ("verified_by") REFERENCES "User"("id")
);

-- Create comprehensive indexes for professional role queries
CREATE INDEX IF NOT EXISTS "idx_users_professional_role_primary" ON "User"("professional_role_primary") 
WHERE "professional_role_primary" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_users_professional_roles_secondary" ON "User" USING gin("professional_roles_secondary")
WHERE array_length("professional_roles_secondary", 1) > 0;
CREATE INDEX IF NOT EXISTS "idx_users_professional_specializations" ON "User" USING gin("professional_specializations")
WHERE array_length("professional_specializations", 1) > 0;
CREATE INDEX IF NOT EXISTS "idx_users_professional_status" ON "User"("professional_status");
CREATE INDEX IF NOT EXISTS "idx_users_availability" ON "User"("availability_status", "professional_role_primary")
WHERE "availability_status" = 'available' AND "professional_role_primary" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_users_location_preferences" ON "User" USING gin("location_preferences")
WHERE array_length("location_preferences", 1) > 0;
CREATE INDEX IF NOT EXISTS "idx_users_hourly_rate" ON "User"("hourly_rate") WHERE "hourly_rate" IS NOT NULL;

-- Indexes for professional associations
CREATE INDEX IF NOT EXISTS "idx_professional_associations_user" 
ON "professional_associations"("user_id");
CREATE INDEX IF NOT EXISTS "idx_professional_associations_type_status" 
ON "professional_associations"("association_type", "membership_status");
CREATE INDEX IF NOT EXISTS "idx_professional_associations_expiry" 
ON "professional_associations"("expiry_date") 
WHERE "expiry_date" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_professional_associations_pi_expiry" 
ON "professional_associations"("professional_indemnity_expiry") 
WHERE "professional_indemnity_expiry" IS NOT NULL;

-- Indexes for professional certifications
CREATE INDEX IF NOT EXISTS "idx_professional_certifications_user" 
ON "professional_certifications"("user_id");
CREATE INDEX IF NOT EXISTS "idx_professional_certifications_type_status" 
ON "professional_certifications"("certification_type", "certification_status");
CREATE INDEX IF NOT EXISTS "idx_professional_certifications_expiry" 
ON "professional_certifications"("expiry_date") 
WHERE "expiry_date" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_professional_certifications_authority" 
ON "professional_certifications"("issuing_authority");

-- Indexes for professional specializations
CREATE INDEX IF NOT EXISTS "idx_professional_specializations_user" 
ON "professional_specializations"("user_id");
CREATE INDEX IF NOT EXISTS "idx_professional_specializations_category" 
ON "professional_specializations"("specialization_category", "proficiency_level");
CREATE INDEX IF NOT EXISTS "idx_professional_specializations_verified" 
ON "professional_specializations"("specialization_name", "verified") WHERE "verified" = true;

-- Add comments for comprehensive documentation
COMMENT ON COLUMN "User"."professional_role_primary" IS 'Primary professional role (from 49 available roles)';
COMMENT ON COLUMN "User"."professional_roles_secondary" IS 'Additional professional roles this user can perform';
COMMENT ON COLUMN "User"."professional_specializations" IS 'Array of professional specialization areas';
COMMENT ON COLUMN "User"."professional_certifications" IS 'JSONB array of professional certifications and qualifications';
COMMENT ON COLUMN "User"."professional_status" IS 'Current professional practice status (active, inactive, suspended)';
COMMENT ON COLUMN "User"."professional_bodies" IS 'Array of professional bodies this user is member of';
COMMENT ON COLUMN "User"."project_capacity" IS 'Maximum number of concurrent projects this professional can handle';

COMMENT ON TABLE "professional_associations" IS 'Professional body memberships with detailed tracking (RIAI, Engineers Ireland, Law Society, etc.)';
COMMENT ON TABLE "professional_certifications" IS 'Specific professional certifications (BER, BCAR, etc.) with expiry tracking';
COMMENT ON TABLE "professional_specializations" IS 'Detailed professional specializations and expertise areas';

COMMIT;

-- Note: This migration implements the complete 49-role professional ecosystem
-- as documented in COMPLETE_PROFESSIONAL_ECOSYSTEM.md, extending the existing
-- 12-role enum to support comprehensive Irish property development coordination