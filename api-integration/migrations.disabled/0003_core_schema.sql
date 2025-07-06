-- Core database schema for PropIE AWS Platform
-- PostgreSQL 13+ compatible

BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Audit timestamp function
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

---------------------------
-- USERS AND PERMISSIONS --
---------------------------

-- User roles enum
CREATE TYPE user_role AS ENUM (
    'ADMIN', 
    'DEVELOPER', 
    'BUYER', 
    'INVESTOR', 
    'AGENT', 
    'SOLICITOR', 
    'CONTRACTOR', 
    'STAFF'
);

-- User status enum
CREATE TYPE user_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING_VERIFICATION',
    'SUSPENDED',
    'DELETED'
);

-- KYC status enum
CREATE TYPE kyc_status AS ENUM (
    'NOT_STARTED',
    'PENDING',
    'ADDITIONAL_INFO_REQUIRED',
    'VERIFIED',
    'REJECTED'
);

-- Users table
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "cognito_id" VARCHAR(100) UNIQUE,
    "email" CITEXT UNIQUE NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "profile_image_url" TEXT,
    "role" user_role NOT NULL DEFAULT 'BUYER',
    "status" user_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "kyc_status" kyc_status NOT NULL DEFAULT 'NOT_STARTED',
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "last_login" TIMESTAMP WITH TIME ZONE,
    "login_count" INTEGER NOT NULL DEFAULT 0,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "password_last_changed" TIMESTAMP WITH TIME ZONE,
    "terms_accepted" BOOLEAN NOT NULL DEFAULT FALSE,
    "terms_accepted_at" TIMESTAMP WITH TIME ZONE,
    "marketing_consent" BOOLEAN NOT NULL DEFAULT FALSE,
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User authentication details
CREATE TABLE "user_auth" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "recovery_email" CITEXT,
    "security_questions" JSONB,
    "mfa_secret" TEXT,
    "password_reset_token" TEXT,
    "password_reset_expires" TIMESTAMP WITH TIME ZONE,
    "email_verification_token" TEXT,
    "email_verification_expires" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User trusted devices
CREATE TABLE "user_devices" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "device_id" VARCHAR(100) NOT NULL,
    "device_name" VARCHAR(100),
    "device_type" VARCHAR(50),
    "device_os" VARCHAR(50),
    "browser" VARCHAR(50),
    "ip_address" VARCHAR(45),
    "location" JSONB,
    "is_trusted" BOOLEAN NOT NULL DEFAULT FALSE,
    "last_used" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("user_id", "device_id")
);

-- Permissions table
CREATE TABLE "permissions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) UNIQUE NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Role permissions mapping
CREATE TABLE "role_permissions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "role" user_role NOT NULL,
    "permission_id" UUID NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("role", "permission_id")
);

-- User-specific permissions (overrides)
CREATE TABLE "user_permissions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "permission_id" UUID NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
    "granted" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("user_id", "permission_id")
);

-- User sessions for JWT management
CREATE TABLE "user_sessions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "token_id" VARCHAR(100) UNIQUE NOT NULL,
    "device_id" VARCHAR(100),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT FALSE,
    "revoked_reason" VARCHAR(100),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Audit logs
CREATE TABLE "audit_logs" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Security events
CREATE TABLE "security_events" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "severity" VARCHAR(20) NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

----------------------
-- LOCATIONS MODULE --
----------------------

-- Location table for addresses
CREATE TABLE "locations" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "address_line_1" VARCHAR(255) NOT NULL,
    "address_line_2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "county" VARCHAR(100),
    "state" VARCHAR(100),
    "postal_code" VARCHAR(20) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "latitude" DECIMAL(10, 8),
    "longitude" DECIMAL(11, 8),
    "geocoded" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Geographic regions
CREATE TABLE "regions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "type" VARCHAR(50) NOT NULL, -- e.g., county, state, postal_district
    "geometry" JSONB, -- GeoJSON for region boundaries
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("name", "type")
);

---------------------------
-- DEVELOPMENTS MODULE --
---------------------------

-- Development status enum
CREATE TYPE development_status AS ENUM (
    'PLANNING',
    'PRE_CONSTRUCTION',
    'UNDER_CONSTRUCTION',
    'COMPLETED',
    'SELLING',
    'SOLD_OUT',
    'ON_HOLD',
    'CANCELLED'
);

-- Developments (housing projects)
CREATE TABLE "developments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) UNIQUE NOT NULL,
    "description" TEXT,
    "status" development_status NOT NULL DEFAULT 'PLANNING',
    "developer_id" UUID NOT NULL REFERENCES "users"("id"), -- Developer who owns this development
    "location_id" UUID REFERENCES "locations"("id"),
    "total_units" INTEGER NOT NULL DEFAULT 0,
    "available_units" INTEGER NOT NULL DEFAULT 0,
    "reserved_units" INTEGER NOT NULL DEFAULT 0,
    "sold_units" INTEGER NOT NULL DEFAULT 0,
    "build_start_date" DATE,
    "build_end_date" DATE,
    "sales_start_date" DATE,
    "estimated_completion_date" DATE,
    "brochure_url" TEXT,
    "website_url" TEXT,
    "featured_image_url" TEXT,
    "gallery_images" JSONB, -- Array of image URLs
    "site_plan_url" TEXT,
    "virtual_tour_url" TEXT,
    "floorplans" JSONB, -- Array of floorplan objects
    "amenities" JSONB, -- Array of amenities
    "features" JSONB, -- Array of features
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Project timeline
CREATE TABLE "development_timelines" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_id" UUID NOT NULL REFERENCES "developments"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "completed" BOOLEAN NOT NULL DEFAULT FALSE,
    "completion_date" DATE,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Development updates (news/status updates)
CREATE TABLE "development_updates" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_id" UUID NOT NULL REFERENCES "developments"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID REFERENCES "users"("id"),
    "image_url" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT FALSE,
    "published_at" TIMESTAMP WITH TIME ZONE,
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Development team members
CREATE TABLE "development_team" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_id" UUID NOT NULL REFERENCES "developments"("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "role" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_id", "user_id", "role")
);

-------------------
-- UNITS MODULE --
-------------------

-- Unit status enum
CREATE TYPE unit_status AS ENUM (
    'AVAILABLE',
    'RESERVED',
    'SOLD',
    'UNDER_CONSTRUCTION',
    'COMPLETED',
    'TENANT_OCCUPIED',
    'NOT_RELEASED',
    'COMING_SOON',
    'WITHDRAWN'
);

-- Unit types
CREATE TYPE unit_type AS ENUM (
    'APARTMENT',
    'HOUSE',
    'DUPLEX',
    'PENTHOUSE',
    'STUDIO',
    'TOWNHOUSE'
);

-- Units (individual properties)
CREATE TABLE "units" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_id" UUID NOT NULL REFERENCES "developments"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "unit_number" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "type" unit_type NOT NULL,
    "status" unit_status NOT NULL DEFAULT 'UNDER_CONSTRUCTION',
    "location_id" UUID REFERENCES "locations"("id"),
    "floor_number" INTEGER,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "total_area" DECIMAL(10, 2), -- in square meters
    "indoor_area" DECIMAL(10, 2), -- in square meters
    "outdoor_area" DECIMAL(10, 2), -- in square meters
    "parking_spaces" INTEGER NOT NULL DEFAULT 0,
    "base_price" DECIMAL(12, 2) NOT NULL,
    "current_price" DECIMAL(12, 2) NOT NULL,
    "deposit_amount" DECIMAL(12, 2),
    "deposit_percentage" DECIMAL(5, 2),
    "completion_percentage" INTEGER NOT NULL DEFAULT 0,
    "estimated_completion_date" DATE,
    "actual_completion_date" DATE,
    "floor_plan_url" TEXT,
    "virtual_tour_url" TEXT,
    "main_image_url" TEXT,
    "gallery_images" JSONB, -- Array of image URLs
    "features" JSONB, -- Array of features
    "energy_rating" VARCHAR(5),
    "is_featured" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_customizable" BOOLEAN NOT NULL DEFAULT TRUE,
    "customization_deadline" DATE,
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_id", "unit_number")
);

-- Unit rooms
CREATE TABLE "unit_rooms" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "unit_id" UUID NOT NULL REFERENCES "units"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(50) NOT NULL, -- bedroom, bathroom, kitchen, living, etc.
    "area" DECIMAL(10, 2), -- in square meters
    "description" TEXT,
    "features" JSONB, -- Array of features
    "dimensions" JSONB, -- width, length, height
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Unit customization options
CREATE TABLE "unit_customization_options" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "unit_id" UUID NOT NULL REFERENCES "units"("id") ON DELETE CASCADE,
    "category" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10, 2) NOT NULL,
    "image_url" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_premium" BOOLEAN NOT NULL DEFAULT FALSE,
    "available_from" DATE,
    "available_until" DATE,
    "stock_limited" BOOLEAN NOT NULL DEFAULT FALSE,
    "stock_quantity" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-------------------
-- SALES MODULE --
-------------------

-- Sale status enum
CREATE TYPE sale_status AS ENUM (
    'INQUIRY',
    'RESERVATION',
    'RESERVATION_CONFIRMED',
    'CONTRACT_SENT',
    'CONTRACT_SIGNED',
    'DEPOSIT_PAID',
    'SALE_AGREED',
    'SALE_COMPLETED',
    'CANCELLED',
    'WITHDRAWN'
);

-- Sales table
CREATE TABLE "sales" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "unit_id" UUID NOT NULL REFERENCES "units"("id") ON DELETE CASCADE,
    "buyer_id" UUID NOT NULL REFERENCES "users"("id"),
    "agent_id" UUID REFERENCES "users"("id"),
    "solicitor_id" UUID REFERENCES "users"("id"),
    "status" sale_status NOT NULL DEFAULT 'INQUIRY',
    "inquiry_date" TIMESTAMP WITH TIME ZONE,
    "reservation_date" TIMESTAMP WITH TIME ZONE,
    "contract_sent_date" TIMESTAMP WITH TIME ZONE,
    "contract_signed_date" TIMESTAMP WITH TIME ZONE,
    "deposit_paid_date" TIMESTAMP WITH TIME ZONE,
    "completion_date" TIMESTAMP WITH TIME ZONE,
    "cancellation_date" TIMESTAMP WITH TIME ZONE,
    "cancellation_reason" TEXT,
    "sale_price" DECIMAL(12, 2) NOT NULL,
    "deposit_amount" DECIMAL(12, 2),
    "help_to_buy_amount" DECIMAL(12, 2),
    "mortgage_amount" DECIMAL(12, 2),
    "cash_amount" DECIMAL(12, 2),
    "customization_total" DECIMAL(12, 2),
    "has_mortgage" BOOLEAN NOT NULL DEFAULT FALSE,
    "has_help_to_buy" BOOLEAN NOT NULL DEFAULT FALSE,
    "notes" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("unit_id", "buyer_id")
);

-- Sale status history
CREATE TABLE "sale_status_history" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sale_id" UUID NOT NULL REFERENCES "sales"("id") ON DELETE CASCADE,
    "status" sale_status NOT NULL,
    "user_id" UUID REFERENCES "users"("id"),
    "notes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Mortgage details
CREATE TABLE "mortgage_details" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sale_id" UUID NOT NULL REFERENCES "sales"("id") ON DELETE CASCADE,
    "lender" VARCHAR(255),
    "product_type" VARCHAR(100),
    "amount" DECIMAL(12, 2) NOT NULL,
    "term_years" INTEGER,
    "interest_rate" DECIMAL(5, 2),
    "is_approved" BOOLEAN NOT NULL DEFAULT FALSE,
    "approval_date" TIMESTAMP WITH TIME ZONE,
    "notes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("sale_id")
);

-- Help to Buy details
CREATE TABLE "htb_details" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sale_id" UUID NOT NULL REFERENCES "sales"("id") ON DELETE CASCADE,
    "application_number" VARCHAR(100),
    "amount" DECIMAL(12, 2) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "application_date" TIMESTAMP WITH TIME ZONE,
    "approval_date" TIMESTAMP WITH TIME ZONE,
    "payment_date" TIMESTAMP WITH TIME ZONE,
    "notes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("sale_id")
);

-- Customization selections for sales
CREATE TABLE "customization_selections" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sale_id" UUID NOT NULL REFERENCES "sales"("id") ON DELETE CASCADE,
    "customization_option_id" UUID NOT NULL REFERENCES "unit_customization_options"("id") ON DELETE CASCADE,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price_at_selection" DECIMAL(10, 2) NOT NULL,
    "total_price" DECIMAL(10, 2) NOT NULL,
    "selected_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("sale_id", "customization_option_id")
);

------------------------
-- DOCUMENTS MODULE --
------------------------

-- Document status enum
CREATE TYPE document_status AS ENUM (
    'DRAFT',
    'PENDING_REVIEW',
    'APPROVED',
    'REJECTED',
    'EXPIRED',
    'ARCHIVED'
);

-- Document types enum
CREATE TYPE document_type AS ENUM (
    'CONTRACT',
    'BROCHURE',
    'FLOOR_PLAN',
    'SPECIFICATION',
    'TERMS_AND_CONDITIONS',
    'LEGAL',
    'MORTGAGE',
    'HELP_TO_BUY',
    'INVOICE',
    'RECEIPT',
    'ID_VERIFICATION',
    'CUSTOMIZATION',
    'WARRANTY',
    'CERTIFICATE',
    'OTHER'
);

-- Documents table
CREATE TABLE "documents" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" document_type NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "file_type" VARCHAR(50),
    "version" VARCHAR(20) NOT NULL DEFAULT '1.0',
    "status" document_status NOT NULL DEFAULT 'DRAFT',
    "entity_type" VARCHAR(100) NOT NULL, -- 'development', 'unit', 'sale', 'user', etc.
    "entity_id" UUID NOT NULL,
    "uploaded_by" UUID REFERENCES "users"("id"),
    "approved_by" UUID REFERENCES "users"("id"),
    "approval_date" TIMESTAMP WITH TIME ZONE,
    "expiry_date" TIMESTAMP WITH TIME ZONE,
    "is_template" BOOLEAN NOT NULL DEFAULT FALSE,
    "template_variables" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Document versions
CREATE TABLE "document_versions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "document_id" UUID NOT NULL REFERENCES "documents"("id") ON DELETE CASCADE,
    "version" VARCHAR(20) NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "changes" TEXT,
    "created_by" UUID REFERENCES "users"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Document workflows
CREATE TABLE "document_workflows" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "entity_type" VARCHAR(100) NOT NULL, -- 'development', 'sale', etc.
    "required_documents" JSONB NOT NULL, -- Array of document types required
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Document workflow progress
CREATE TABLE "document_workflow_progress" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "workflow_id" UUID NOT NULL REFERENCES "document_workflows"("id") ON DELETE CASCADE,
    "entity_id" UUID NOT NULL, -- ID of the development, sale, etc.
    "status" VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    "completed_documents" JSONB, -- Array of document IDs that have been completed
    "percentage_complete" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("workflow_id", "entity_id")
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type_entity_id ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);
CREATE INDEX idx_developments_developer_id ON developments(developer_id);
CREATE INDEX idx_developments_status ON developments(status);
CREATE INDEX idx_units_development_id ON units(development_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_sales_unit_id ON sales(unit_id);
CREATE INDEX idx_sales_buyer_id ON sales(buyer_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_documents_entity_type_entity_id ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_type ON documents(type);

-- Create triggers
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_user_auth
BEFORE UPDATE ON user_auth
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_user_devices
BEFORE UPDATE ON user_devices
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_permissions
BEFORE UPDATE ON permissions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_role_permissions
BEFORE UPDATE ON role_permissions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_user_permissions
BEFORE UPDATE ON user_permissions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_user_sessions
BEFORE UPDATE ON user_sessions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_locations
BEFORE UPDATE ON locations
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_regions
BEFORE UPDATE ON regions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_developments
BEFORE UPDATE ON developments
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_development_timelines
BEFORE UPDATE ON development_timelines
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_development_updates
BEFORE UPDATE ON development_updates
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_development_team
BEFORE UPDATE ON development_team
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_units
BEFORE UPDATE ON units
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_unit_rooms
BEFORE UPDATE ON unit_rooms
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_unit_customization_options
BEFORE UPDATE ON unit_customization_options
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_sales
BEFORE UPDATE ON sales
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_mortgage_details
BEFORE UPDATE ON mortgage_details
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_htb_details
BEFORE UPDATE ON htb_details
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_customization_selections
BEFORE UPDATE ON customization_selections
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_documents
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_document_workflows
BEFORE UPDATE ON document_workflows
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_document_workflow_progress
BEFORE UPDATE ON document_workflow_progress
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

COMMIT;