-- Migration: 0007_ecosystem_task_orchestration.sql
-- Purpose: Create comprehensive task orchestration system for 3,329+ tasks across 49 professional roles
-- Phase 1 Week 2: Complete Task Management Infrastructure
-- Date: June 21, 2025

-- Build comprehensive task management system that coordinates all 49 professional roles
-- Links to existing Development and Transaction tables while extending capabilities

BEGIN;

-- Create comprehensive task templates table (3,329+ predefined tasks)
CREATE TABLE IF NOT EXISTS "task_templates" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "task_code" VARCHAR(50) UNIQUE NOT NULL, -- BUY-001, DEV-034, SOL-156, ARCH-045, etc.
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "detailed_instructions" TEXT,
    
    -- Professional assignment and categorization
    "primary_professional_role" "UserRole" NOT NULL, -- Who primarily owns this task
    "secondary_professional_roles" "UserRole"[] DEFAULT '{}', -- Who can assist or approve
    "requires_professional_certification" VARCHAR[] DEFAULT '{}', -- Required certifications
    "requires_professional_association" VARCHAR[] DEFAULT '{}', -- Required professional body membership
    
    -- Task categorization
    "category" VARCHAR(100) NOT NULL, -- financial, legal, construction, compliance, marketing, design
    "subcategory" VARCHAR(100),
    "persona" VARCHAR(50) NOT NULL, -- buyer, developer, agent, solicitor, architect, engineer, etc.
    "discipline" VARCHAR(100), -- Architecture, Engineering, Legal, Financial, Construction, etc.
    
    -- Task characteristics
    "task_type" VARCHAR(50) NOT NULL, -- form, document, approval, communication, inspection, design, calculation
    "complexity_level" VARCHAR(20) DEFAULT 'medium', -- simple, medium, complex, expert
    "estimated_duration_hours" DECIMAL(6,2) DEFAULT 1.0,
    "estimated_duration_range_min" DECIMAL(6,2),
    "estimated_duration_range_max" DECIMAL(6,2),
    "typical_cost_range_min" DECIMAL(10,2), -- Typical cost for this task
    "typical_cost_range_max" DECIMAL(10,2),
    
    -- Automation and processing capabilities
    "automation_level" VARCHAR(20) DEFAULT 'manual', -- manual, semi_automated, fully_automated
    "automation_triggers" VARCHAR[] DEFAULT '{}', -- Events that can auto-trigger this task
    "automation_actions" VARCHAR[] DEFAULT '{}', -- Actions that can be automated
    "ai_assistance_available" BOOLEAN DEFAULT false, -- Can AI help with this task
    "template_available" BOOLEAN DEFAULT false, -- Standardized templates available
    
    -- Compliance and regulatory requirements
    "compliance_required" BOOLEAN DEFAULT false,
    "regulatory_body" VARCHAR(100), -- SEAI, NSAI, Law_Society, Engineers_Ireland, etc.
    "regulatory_reference" VARCHAR(200), -- Specific regulation or standard
    "certification_required" BOOLEAN DEFAULT false,
    "approval_required" BOOLEAN DEFAULT false,
    "witness_required" BOOLEAN DEFAULT false,
    "professional_indemnity_coverage" BOOLEAN DEFAULT false, -- Requires PI insurance
    
    -- Dependencies and sequencing
    "dependencies" VARCHAR[] DEFAULT '{}', -- Array of dependent task codes
    "soft_dependencies" VARCHAR[] DEFAULT '{}', -- Preferred but not blocking dependencies
    "triggers" VARCHAR[] DEFAULT '{}', -- Events that trigger this task
    "prerequisites" VARCHAR[] DEFAULT '{}', -- Must be completed first
    "milestone_dependencies" VARCHAR[] DEFAULT '{}', -- Project milestone dependencies
    
    -- Documentation and deliverables
    "required_documents" VARCHAR[] DEFAULT '{}', -- Required input document types
    "output_documents" VARCHAR[] DEFAULT '{}', -- Documents this task produces
    "deliverable_types" VARCHAR[] DEFAULT '{}', -- Types of deliverables expected
    "evidence_required" VARCHAR[] DEFAULT '{}', -- Evidence of completion needed
    "quality_criteria" TEXT, -- Quality standards for completion
    
    -- Timing and escalation
    "typical_start_offset_days" INTEGER DEFAULT 0, -- Days from transaction/project start
    "deadline_offset_days" INTEGER, -- Days from start/trigger for deadline
    "critical_path" BOOLEAN DEFAULT false, -- Is this task on the critical path
    "escalation_hours" INTEGER DEFAULT 48, -- Hours before escalation
    "reminder_schedule" INTEGER[] DEFAULT '{72,24,4}', -- Reminder hours before due
    "seasonal_constraints" VARCHAR[] DEFAULT '{}', -- Seasonal limitations (weather, etc.)
    
    -- Professional coordination requirements
    "coordination_required" VARCHAR[] DEFAULT '{}', -- Other roles that must coordinate
    "consultation_required" VARCHAR[] DEFAULT '{}', -- Roles that must be consulted
    "approval_chain" VARCHAR[] DEFAULT '{}', -- Approval sequence by role
    "sign_off_required" "UserRole"[], -- Professional sign-off requirements
    
    -- Quality and performance tracking
    "success_criteria" TEXT,
    "common_issues" TEXT,
    "best_practices" TEXT,
    "risk_factors" VARCHAR[] DEFAULT '{}', -- Common risk factors
    "mitigation_strategies" TEXT,
    
    -- Cost and commercial aspects
    "typical_fee_basis" VARCHAR(50), -- Fixed, hourly, percentage, lump_sum
    "fee_calculation_method" TEXT, -- How fees are typically calculated
    "materials_required" BOOLEAN DEFAULT false,
    "site_visit_required" BOOLEAN DEFAULT false,
    "remote_completion_possible" BOOLEAN DEFAULT true,
    
    -- Integration and system aspects
    "external_system_integration" VARCHAR[] DEFAULT '{}', -- External systems involved
    "api_endpoints_available" VARCHAR[] DEFAULT '{}', -- Available API integrations
    "data_sources" VARCHAR[] DEFAULT '{}', -- Required data sources
    "notification_triggers" VARCHAR[] DEFAULT '{}', -- When to send notifications
    
    -- Versioning and maintenance
    "template_version" VARCHAR(20) DEFAULT '1.0',
    "is_active" BOOLEAN DEFAULT true,
    "is_mandatory" BOOLEAN DEFAULT true,
    "applicable_development_types" VARCHAR[] DEFAULT '{}', -- Residential, Commercial, etc.
    "applicable_transaction_types" VARCHAR[] DEFAULT '{}', -- Purchase, Sale, Rental, etc.
    "applicable_buyer_types" VARCHAR[] DEFAULT '{}', -- First_time, Investment, etc.
    "geographic_scope" VARCHAR[] DEFAULT '{}', -- Where this task applies
    
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create ecosystem tasks table (actual task instances for each transaction/development)
CREATE TABLE IF NOT EXISTS "ecosystem_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "transaction_id" TEXT,
    "development_id" TEXT,
    "task_template_id" TEXT NOT NULL,
    "task_code" VARCHAR(50) NOT NULL, -- Inherited from template
    
    -- Professional assignment and ownership
    "assigned_to" TEXT, -- Primary professional responsible
    "assigned_by" TEXT, -- Who assigned this task
    "delegated_to" TEXT, -- If delegated to another professional
    "responsible_organization" VARCHAR(200), -- Company/organization responsible
    "backup_professional" TEXT, -- Backup professional if primary unavailable
    
    -- Team coordination
    "coordinating_professionals" TEXT[] DEFAULT '{}', -- Array of user IDs coordinating
    "consulting_professionals" TEXT[] DEFAULT '{}', -- Array of user IDs providing consultation
    "approving_professionals" TEXT[] DEFAULT '{}', -- Array of user IDs who must approve
    
    -- Status and progress tracking
    "status" VARCHAR(50) DEFAULT 'pending', 
    -- pending, ready, assigned, in_progress, waiting_approval, blocked, completed, cancelled, failed, on_hold
    "priority" VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent, critical
    "completion_percentage" INTEGER DEFAULT 0 CHECK ("completion_percentage" BETWEEN 0 AND 100),
    "quality_status" VARCHAR(50) DEFAULT 'not_assessed', -- not_assessed, acceptable, good, excellent, needs_rework
    
    -- Timing and scheduling
    "scheduled_start" TIMESTAMPTZ,
    "due_date" TIMESTAMPTZ,
    "reminder_dates" TIMESTAMPTZ[],
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "estimated_duration" INTERVAL,
    "actual_duration" INTERVAL,
    "buffer_time" INTERVAL, -- Additional time buffer for risks
    
    -- Effort and cost tracking
    "estimated_effort_hours" DECIMAL(8,2),
    "actual_effort_hours" DECIMAL(8,2),
    "billable_hours" DECIMAL(8,2),
    "estimated_cost" DECIMAL(12,2),
    "actual_cost" DECIMAL(12,2),
    "cost_center" VARCHAR(100),
    "invoice_reference" VARCHAR(100),
    
    -- Task customization and context
    "custom_title" VARCHAR(500), -- Override template title if needed
    "custom_description" TEXT, -- Additional context for this instance
    "site_specific_requirements" TEXT, -- Site-specific considerations
    "client_specific_requirements" TEXT, -- Client-specific requirements
    "notes" TEXT, -- Working notes and updates
    "completion_notes" TEXT, -- Notes on completion
    "lessons_learned" TEXT, -- What was learned during execution
    
    -- Results and deliverables
    "result_status" VARCHAR(50), -- success, partial_success, failed, needs_review, rework_required
    "deliverables_submitted" VARCHAR[] DEFAULT '{}', -- Deliverables actually submitted
    "output_data" JSONB DEFAULT '{}', -- Task-specific output data
    "quality_score" INTEGER CHECK ("quality_score" BETWEEN 1 AND 5),
    "client_satisfaction_score" INTEGER CHECK ("client_satisfaction_score" BETWEEN 1 AND 5),
    
    -- Approval and sign-off workflow
    "requires_approval" BOOLEAN DEFAULT false,
    "approval_workflow_stage" INTEGER DEFAULT 0, -- Current stage in approval process
    "approved_by" TEXT[] DEFAULT '{}', -- Array of users who have approved
    "approval_timestamps" TIMESTAMPTZ[] DEFAULT '{}', -- When each approval was given
    "approval_notes" TEXT[] DEFAULT '{}', -- Notes from each approver
    "final_sign_off_by" TEXT, -- Final professional sign-off
    "final_sign_off_at" TIMESTAMPTZ,
    
    -- Risk and issue management
    "risk_level" VARCHAR(20) DEFAULT 'low', -- low, medium, high, critical
    "identified_risks" TEXT[] DEFAULT '{}', -- Known risks for this task instance
    "mitigation_actions_taken" TEXT[] DEFAULT '{}', -- Risk mitigation steps taken
    "issues_encountered" TEXT[] DEFAULT '{}', -- Issues that arose during execution
    "escalation_level" INTEGER DEFAULT 0, -- How many times this has been escalated
    "escalated_to" TEXT, -- Who this task was escalated to
    "escalation_reason" TEXT,
    
    -- Integration and system tracking
    "external_references" JSONB DEFAULT '{}', -- References to external systems
    "api_integration_status" VARCHAR(50), -- Status of external system integrations
    "automation_applied" VARCHAR[] DEFAULT '{}', -- What automation was used
    "ai_assistance_used" BOOLEAN DEFAULT false, -- Whether AI assistance was utilized
    
    -- Communication and collaboration
    "communication_log" JSONB DEFAULT '[]', -- Log of communications about this task
    "collaboration_rating" DECIMAL(3,2), -- How well did collaboration work (1.00-5.00)
    "feedback_for_improvement" TEXT, -- Feedback for process improvement
    
    -- Metadata and flexibility
    "metadata" JSONB DEFAULT '{}',
    "tags" VARCHAR[] DEFAULT '{}',
    "custom_fields" JSONB DEFAULT '{}', -- Client-configurable fields
    
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT "fk_ecosystem_tasks_transaction" 
        FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ecosystem_tasks_development" 
        FOREIGN KEY ("development_id") REFERENCES "Development"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ecosystem_tasks_template" 
        FOREIGN KEY ("task_template_id") REFERENCES "task_templates"("id"),
    CONSTRAINT "fk_ecosystem_tasks_assigned_to" 
        FOREIGN KEY ("assigned_to") REFERENCES "User"("id"),
    CONSTRAINT "fk_ecosystem_tasks_assigned_by" 
        FOREIGN KEY ("assigned_by") REFERENCES "User"("id"),
    CONSTRAINT "fk_ecosystem_tasks_delegated_to" 
        FOREIGN KEY ("delegated_to") REFERENCES "User"("id"),
    CONSTRAINT "fk_ecosystem_tasks_backup" 
        FOREIGN KEY ("backup_professional") REFERENCES "User"("id"),
    CONSTRAINT "fk_ecosystem_tasks_escalated_to" 
        FOREIGN KEY ("escalated_to") REFERENCES "User"("id"),
    CONSTRAINT "fk_ecosystem_tasks_final_sign_off" 
        FOREIGN KEY ("final_sign_off_by") REFERENCES "User"("id")
);

-- Create task dependencies with enhanced relationship tracking
CREATE TABLE IF NOT EXISTS "task_dependencies" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "parent_task_id" TEXT NOT NULL,
    "dependent_task_id" TEXT NOT NULL,
    "dependency_type" VARCHAR(50) DEFAULT 'blocking', 
    -- blocking, soft, resource, temporal, approval, information, quality_gate, milestone
    "dependency_strength" VARCHAR(20) DEFAULT 'mandatory', -- mandatory, preferred, optional
    "dependency_reason" TEXT,
    "lag_time" INTERVAL, -- Minimum time between parent completion and dependent start
    "overlap_allowed" INTERVAL, -- How much overlap is acceptable
    "coordination_required" BOOLEAN DEFAULT false, -- Whether active coordination is needed
    "automatic_trigger" BOOLEAN DEFAULT false, -- Auto-trigger dependent when parent completes
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT "fk_task_dependencies_parent" 
        FOREIGN KEY ("parent_task_id") REFERENCES "ecosystem_tasks"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_task_dependencies_dependent" 
        FOREIGN KEY ("dependent_task_id") REFERENCES "ecosystem_tasks"("id") ON DELETE CASCADE,
    CONSTRAINT "no_self_dependency" CHECK ("parent_task_id" != "dependent_task_id"),
    CONSTRAINT "unique_dependency" UNIQUE("parent_task_id", "dependent_task_id")
);

-- Create comprehensive task history and audit trail
CREATE TABLE IF NOT EXISTS "task_history" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "task_id" TEXT NOT NULL,
    "changed_by" TEXT,
    "change_type" VARCHAR(50) NOT NULL, 
    -- created, assigned, started, updated, completed, cancelled, escalated, approved, etc.
    "previous_status" VARCHAR(50),
    "new_status" VARCHAR(50),
    "previous_assigned_to" TEXT,
    "new_assigned_to" TEXT,
    "previous_due_date" TIMESTAMPTZ,
    "new_due_date" TIMESTAMPTZ,
    "change_reason" TEXT,
    "change_notes" TEXT,
    "impact_assessment" TEXT, -- Assessment of change impact
    "system_generated" BOOLEAN DEFAULT false,
    "notification_sent" BOOLEAN DEFAULT false,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT "fk_task_history_task" 
        FOREIGN KEY ("task_id") REFERENCES "ecosystem_tasks"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_task_history_changed_by" 
        FOREIGN KEY ("changed_by") REFERENCES "User"("id"),
    CONSTRAINT "fk_task_history_previous_assigned" 
        FOREIGN KEY ("previous_assigned_to") REFERENCES "User"("id"),
    CONSTRAINT "fk_task_history_new_assigned" 
        FOREIGN KEY ("new_assigned_to") REFERENCES "User"("id")
);

-- Create comprehensive indexes for high-performance queries

-- Task templates indexes
CREATE INDEX IF NOT EXISTS "idx_task_templates_code" ON "task_templates"("task_code");
CREATE INDEX IF NOT EXISTS "idx_task_templates_primary_role" ON "task_templates"("primary_professional_role", "is_active");
CREATE INDEX IF NOT EXISTS "idx_task_templates_secondary_roles" ON "task_templates" USING gin("secondary_professional_roles");
CREATE INDEX IF NOT EXISTS "idx_task_templates_category" ON "task_templates"("category", "subcategory");
CREATE INDEX IF NOT EXISTS "idx_task_templates_discipline" ON "task_templates"("discipline", "complexity_level");
CREATE INDEX IF NOT EXISTS "idx_task_templates_compliance" ON "task_templates"("compliance_required", "regulatory_body") 
WHERE "compliance_required" = true;
CREATE INDEX IF NOT EXISTS "idx_task_templates_automation" ON "task_templates"("automation_level") 
WHERE "automation_level" != 'manual';

-- Full-text search index for comprehensive task template search
CREATE INDEX IF NOT EXISTS "idx_task_templates_search" ON "task_templates" 
USING gin(to_tsvector('english', "title" || ' ' || COALESCE("description", '') || ' ' || COALESCE("detailed_instructions", '')));

-- Ecosystem tasks indexes for high-performance queries
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_transaction" ON "ecosystem_tasks"("transaction_id", "status");
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_development" ON "ecosystem_tasks"("development_id", "status");
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_assigned" ON "ecosystem_tasks"("assigned_to", "status", "due_date");
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_template" ON "ecosystem_tasks"("task_template_id");
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_due_date" ON "ecosystem_tasks"("due_date", "status") 
WHERE "due_date" IS NOT NULL AND "status" NOT IN ('completed', 'cancelled');
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_priority" ON "ecosystem_tasks"("priority", "status");
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_completion" ON "ecosystem_tasks"("completed_at") 
WHERE "completed_at" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_risk_level" ON "ecosystem_tasks"("risk_level") 
WHERE "risk_level" IN ('high', 'critical');

-- Composite indexes for common professional workflow queries
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_professional_active" ON "ecosystem_tasks"("assigned_to", "status", "priority") 
WHERE "status" IN ('ready', 'assigned', 'in_progress');
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_development_timeline" ON "ecosystem_tasks"("development_id", "status", "due_date") 
WHERE "status" NOT IN ('completed', 'cancelled');
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_coordination" ON "ecosystem_tasks" USING gin("coordinating_professionals");
CREATE INDEX IF NOT EXISTS "idx_ecosystem_tasks_approval_workflow" ON "ecosystem_tasks"("requires_approval", "approval_workflow_stage") 
WHERE "requires_approval" = true;

-- Task dependencies indexes
CREATE INDEX IF NOT EXISTS "idx_task_dependencies_parent" ON "task_dependencies"("parent_task_id");
CREATE INDEX IF NOT EXISTS "idx_task_dependencies_dependent" ON "task_dependencies"("dependent_task_id");
CREATE INDEX IF NOT EXISTS "idx_task_dependencies_type" ON "task_dependencies"("dependency_type", "dependency_strength");
CREATE INDEX IF NOT EXISTS "idx_task_dependencies_auto_trigger" ON "task_dependencies"("automatic_trigger") 
WHERE "automatic_trigger" = true;

-- Task history indexes
CREATE INDEX IF NOT EXISTS "idx_task_history_task" ON "task_history"("task_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_task_history_user" ON "task_history"("changed_by", "created_at");
CREATE INDEX IF NOT EXISTS "idx_task_history_type" ON "task_history"("change_type", "created_at");

-- Add comprehensive documentation comments
COMMENT ON TABLE "task_templates" IS 'Master task templates for 3,329+ predefined tasks across all 49 professional roles with comprehensive orchestration metadata';
COMMENT ON TABLE "ecosystem_tasks" IS 'Actual task instances for each transaction/development with full professional coordination and lifecycle tracking';
COMMENT ON TABLE "task_dependencies" IS 'Enhanced task dependencies and relationships for intelligent orchestration across professional disciplines';
COMMENT ON TABLE "task_history" IS 'Complete audit trail for all task changes with impact assessment and notification tracking';

COMMENT ON COLUMN "task_templates"."primary_professional_role" IS 'Primary professional role responsible for this task (from 49 available roles)';
COMMENT ON COLUMN "task_templates"."secondary_professional_roles" IS 'Additional professional roles that can assist or approve this task';
COMMENT ON COLUMN "ecosystem_tasks"."coordinating_professionals" IS 'Array of professionals who need to coordinate on this task';
COMMENT ON COLUMN "ecosystem_tasks"."quality_status" IS 'Professional assessment of task quality and completion standards';

COMMIT;

-- This migration creates the complete task orchestration system for the 49-role
-- professional ecosystem, enabling intelligent coordination of 3,329+ tasks across
-- all aspects of Irish property development and transactions