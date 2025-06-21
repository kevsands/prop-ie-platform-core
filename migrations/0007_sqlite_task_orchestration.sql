-- Migration: 0007_sqlite_task_orchestration.sql
-- Purpose: Create comprehensive task orchestration system for 3,329+ tasks across 49 professional roles (SQLite)
-- Phase 1 Week 2: Complete Task Management Infrastructure
-- Date: June 21, 2025

-- Build comprehensive task management system that coordinates all 49 professional roles
-- SQLite compatible with JSON fields for complex data structures

BEGIN TRANSACTION;

-- Create comprehensive task templates table (3,329+ predefined tasks)
CREATE TABLE IF NOT EXISTS task_templates (
    id TEXT NOT NULL PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    task_code TEXT UNIQUE NOT NULL, -- BUY-001, DEV-034, SOL-156, ARCH-045, etc.
    title TEXT NOT NULL,
    description TEXT,
    detailed_instructions TEXT,
    
    -- Professional assignment and categorization
    primary_professional_role TEXT NOT NULL CHECK (primary_professional_role IN (
        -- All 49 professional roles
        'DEVELOPER', 'BUYER', 'INVESTOR', 'ARCHITECT', 'ENGINEER', 'QUANTITY_SURVEYOR', 
        'LEGAL', 'PROJECT_MANAGER', 'AGENT', 'SOLICITOR', 'CONTRACTOR', 'ADMIN',
        'BUYER_SOLICITOR', 'BUYER_MORTGAGE_BROKER', 'BUYER_SURVEYOR', 
        'BUYER_FINANCIAL_ADVISOR', 'BUYER_INSURANCE_BROKER',
        'DEVELOPER_SOLICITOR', 'DEVELOPMENT_SALES_AGENT', 'DEVELOPMENT_PROJECT_MANAGER',
        'DEVELOPMENT_MARKETING_MANAGER', 'DEVELOPMENT_FINANCIAL_CONTROLLER',
        'ESTATE_AGENT', 'ESTATE_AGENT_MANAGER', 'MORTGAGE_LENDER', 'MORTGAGE_UNDERWRITER',
        'PROPERTY_VALUER', 'BUILDING_SURVEYOR', 'INSURANCE_UNDERWRITER', 'PROPERTY_MANAGER',
        'LAND_REGISTRY_OFFICER', 'REVENUE_OFFICER', 'LOCAL_AUTHORITY_OFFICER', 'BUILDING_CONTROL_OFFICER',
        'LEAD_ARCHITECT', 'DESIGN_ARCHITECT', 'TECHNICAL_ARCHITECT', 'LANDSCAPE_ARCHITECT',
        'STRUCTURAL_ENGINEER', 'CIVIL_ENGINEER', 'MEP_ENGINEER', 'ENVIRONMENTAL_ENGINEER',
        'MAIN_CONTRACTOR', 'PROJECT_MANAGER_CONSTRUCTION', 'SITE_FOREMAN', 'HEALTH_SAFETY_OFFICER',
        'BER_ASSESSOR', 'NZEB_CONSULTANT', 'SUSTAINABILITY_CONSULTANT',
        'BCAR_CERTIFIER', 'FIRE_SAFETY_CONSULTANT', 'ACCESSIBILITY_CONSULTANT',
        'HOMEBOND_ADMINISTRATOR', 'STRUCTURAL_WARRANTY_INSPECTOR', 'QUALITY_ASSURANCE_INSPECTOR',
        'TAX_ADVISOR', 'PLANNING_CONSULTANT', 'CONVEYANCING_SPECIALIST'
    )),
    secondary_professional_roles TEXT DEFAULT '[]', -- JSON array of roles that can assist
    requires_professional_certification TEXT DEFAULT '[]', -- JSON array of required certifications
    requires_professional_association TEXT DEFAULT '[]', -- JSON array of required professional body membership
    
    -- Task categorization
    category TEXT NOT NULL, -- financial, legal, construction, compliance, marketing, design
    subcategory TEXT,
    persona TEXT NOT NULL, -- buyer, developer, agent, solicitor, architect, engineer, etc.
    discipline TEXT, -- Architecture, Engineering, Legal, Financial, Construction, etc.
    
    -- Task characteristics
    task_type TEXT NOT NULL, -- form, document, approval, communication, inspection, design, calculation
    complexity_level TEXT DEFAULT 'medium' CHECK (complexity_level IN ('simple', 'medium', 'complex', 'expert')),
    estimated_duration_hours DECIMAL(6,2) DEFAULT 1.0,
    estimated_duration_range_min DECIMAL(6,2),
    estimated_duration_range_max DECIMAL(6,2),
    typical_cost_range_min DECIMAL(10,2), -- Typical cost for this task
    typical_cost_range_max DECIMAL(10,2),
    
    -- Automation and processing capabilities
    automation_level TEXT DEFAULT 'manual' CHECK (automation_level IN ('manual', 'semi_automated', 'fully_automated')),
    automation_triggers TEXT DEFAULT '[]', -- JSON array: Events that can auto-trigger this task
    automation_actions TEXT DEFAULT '[]', -- JSON array: Actions that can be automated
    ai_assistance_available BOOLEAN DEFAULT FALSE, -- Can AI help with this task
    template_available BOOLEAN DEFAULT FALSE, -- Standardized templates available
    
    -- Compliance and regulatory requirements
    compliance_required BOOLEAN DEFAULT FALSE,
    regulatory_body TEXT, -- SEAI, NSAI, Law_Society, Engineers_Ireland, etc.
    regulatory_reference TEXT, -- Specific regulation or standard
    certification_required BOOLEAN DEFAULT FALSE,
    approval_required BOOLEAN DEFAULT FALSE,
    witness_required BOOLEAN DEFAULT FALSE,
    professional_indemnity_coverage BOOLEAN DEFAULT FALSE, -- Requires PI insurance
    
    -- Dependencies and sequencing
    dependencies TEXT DEFAULT '[]', -- JSON array of dependent task codes
    soft_dependencies TEXT DEFAULT '[]', -- JSON array: Preferred but not blocking dependencies
    triggers TEXT DEFAULT '[]', -- JSON array: Events that trigger this task
    prerequisites TEXT DEFAULT '[]', -- JSON array: Must be completed first
    milestone_dependencies TEXT DEFAULT '[]', -- JSON array: Project milestone dependencies
    
    -- Documentation and deliverables
    required_documents TEXT DEFAULT '[]', -- JSON array: Required input document types
    output_documents TEXT DEFAULT '[]', -- JSON array: Documents this task produces
    deliverable_types TEXT DEFAULT '[]', -- JSON array: Types of deliverables expected
    evidence_required TEXT DEFAULT '[]', -- JSON array: Evidence of completion needed
    quality_criteria TEXT, -- Quality standards for completion
    
    -- Timing and escalation
    typical_start_offset_days INTEGER DEFAULT 0, -- Days from transaction/project start
    deadline_offset_days INTEGER, -- Days from start/trigger for deadline
    critical_path BOOLEAN DEFAULT FALSE, -- Is this task on the critical path
    escalation_hours INTEGER DEFAULT 48, -- Hours before escalation
    reminder_schedule TEXT DEFAULT '[72,24,4]', -- JSON array: Reminder hours before due
    seasonal_constraints TEXT DEFAULT '[]', -- JSON array: Seasonal limitations (weather, etc.)
    
    -- Professional coordination requirements
    coordination_required TEXT DEFAULT '[]', -- JSON array: Other roles that must coordinate
    consultation_required TEXT DEFAULT '[]', -- JSON array: Roles that must be consulted
    approval_chain TEXT DEFAULT '[]', -- JSON array: Approval sequence by role
    sign_off_required TEXT DEFAULT '[]', -- JSON array: Professional sign-off requirements
    
    -- Quality and performance tracking
    success_criteria TEXT,
    common_issues TEXT,
    best_practices TEXT,
    risk_factors TEXT DEFAULT '[]', -- JSON array: Common risk factors
    mitigation_strategies TEXT,
    
    -- Cost and commercial aspects
    typical_fee_basis TEXT, -- Fixed, hourly, percentage, lump_sum
    fee_calculation_method TEXT, -- How fees are typically calculated
    materials_required BOOLEAN DEFAULT FALSE,
    site_visit_required BOOLEAN DEFAULT FALSE,
    remote_completion_possible BOOLEAN DEFAULT TRUE,
    
    -- Integration and system aspects
    external_system_integration TEXT DEFAULT '[]', -- JSON array: External systems involved
    api_endpoints_available TEXT DEFAULT '[]', -- JSON array: Available API integrations
    data_sources TEXT DEFAULT '[]', -- JSON array: Required data sources
    notification_triggers TEXT DEFAULT '[]', -- JSON array: When to send notifications
    
    -- Versioning and maintenance
    template_version TEXT DEFAULT '1.0',
    is_active BOOLEAN DEFAULT TRUE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    applicable_development_types TEXT DEFAULT '[]', -- JSON array: Residential, Commercial, etc.
    applicable_transaction_types TEXT DEFAULT '[]', -- JSON array: Purchase, Sale, Rental, etc.
    applicable_buyer_types TEXT DEFAULT '[]', -- JSON array: First_time, Investment, etc.
    geographic_scope TEXT DEFAULT '[]', -- JSON array: Where this task applies
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create ecosystem tasks table (actual task instances for each transaction/development)
CREATE TABLE IF NOT EXISTS ecosystem_tasks (
    id TEXT NOT NULL PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    transaction_id TEXT,
    development_id TEXT,
    task_template_id TEXT NOT NULL,
    task_code TEXT NOT NULL, -- Inherited from template
    
    -- Professional assignment and ownership
    assigned_to TEXT, -- Primary professional responsible
    assigned_by TEXT, -- Who assigned this task
    delegated_to TEXT, -- If delegated to another professional
    responsible_organization TEXT, -- Company/organization responsible
    backup_professional TEXT, -- Backup professional if primary unavailable
    
    -- Team coordination
    coordinating_professionals TEXT DEFAULT '[]', -- JSON array of user IDs coordinating
    consulting_professionals TEXT DEFAULT '[]', -- JSON array of user IDs providing consultation
    approving_professionals TEXT DEFAULT '[]', -- JSON array of user IDs who must approve
    
    -- Status and progress tracking
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'ready', 'assigned', 'in_progress', 'waiting_approval', 
        'blocked', 'completed', 'cancelled', 'failed', 'on_hold'
    )),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'critical')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    quality_status TEXT DEFAULT 'not_assessed' CHECK (quality_status IN (
        'not_assessed', 'acceptable', 'good', 'excellent', 'needs_rework'
    )),
    
    -- Timing and scheduling
    scheduled_start DATETIME,
    due_date DATETIME,
    reminder_dates TEXT DEFAULT '[]', -- JSON array of reminder timestamps
    started_at DATETIME,
    completed_at DATETIME,
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    buffer_time_minutes INTEGER, -- Additional time buffer for risks
    
    -- Effort and cost tracking
    estimated_effort_hours DECIMAL(8,2),
    actual_effort_hours DECIMAL(8,2),
    billable_hours DECIMAL(8,2),
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    cost_center TEXT,
    invoice_reference TEXT,
    
    -- Task customization and context
    custom_title TEXT, -- Override template title if needed
    custom_description TEXT, -- Additional context for this instance
    site_specific_requirements TEXT, -- Site-specific considerations
    client_specific_requirements TEXT, -- Client-specific requirements
    notes TEXT, -- Working notes and updates
    completion_notes TEXT, -- Notes on completion
    lessons_learned TEXT, -- What was learned during execution
    
    -- Results and deliverables
    result_status TEXT CHECK (result_status IN ('success', 'partial_success', 'failed', 'needs_review', 'rework_required')),
    deliverables_submitted TEXT DEFAULT '[]', -- JSON array: Deliverables actually submitted
    output_data TEXT DEFAULT '{}', -- JSON: Task-specific output data
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 5),
    client_satisfaction_score INTEGER CHECK (client_satisfaction_score BETWEEN 1 AND 5),
    
    -- Approval and sign-off workflow
    requires_approval BOOLEAN DEFAULT FALSE,
    approval_workflow_stage INTEGER DEFAULT 0, -- Current stage in approval process
    approved_by TEXT DEFAULT '[]', -- JSON array of users who have approved
    approval_timestamps TEXT DEFAULT '[]', -- JSON array: When each approval was given
    approval_notes TEXT DEFAULT '[]', -- JSON array: Notes from each approver
    final_sign_off_by TEXT, -- Final professional sign-off
    final_sign_off_at DATETIME,
    
    -- Risk and issue management
    risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    identified_risks TEXT DEFAULT '[]', -- JSON array: Known risks for this task instance
    mitigation_actions_taken TEXT DEFAULT '[]', -- JSON array: Risk mitigation steps taken
    issues_encountered TEXT DEFAULT '[]', -- JSON array: Issues that arose during execution
    escalation_level INTEGER DEFAULT 0, -- How many times this has been escalated
    escalated_to TEXT, -- Who this task was escalated to
    escalation_reason TEXT,
    
    -- Integration and system tracking
    external_references TEXT DEFAULT '{}', -- JSON: References to external systems
    api_integration_status TEXT, -- Status of external system integrations
    automation_applied TEXT DEFAULT '[]', -- JSON array: What automation was used
    ai_assistance_used BOOLEAN DEFAULT FALSE, -- Whether AI assistance was utilized
    
    -- Communication and collaboration
    communication_log TEXT DEFAULT '[]', -- JSON array: Log of communications about this task
    collaboration_rating DECIMAL(3,2), -- How well did collaboration work (1.00-5.00)
    feedback_for_improvement TEXT, -- Feedback for process improvement
    
    -- Metadata and flexibility
    metadata TEXT DEFAULT '{}', -- JSON for additional data
    tags TEXT DEFAULT '[]', -- JSON array of tags
    custom_fields TEXT DEFAULT '{}', -- JSON: Client-configurable fields
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (task_template_id) REFERENCES task_templates(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    FOREIGN KEY (delegated_to) REFERENCES users(id),
    FOREIGN KEY (backup_professional) REFERENCES users(id),
    FOREIGN KEY (escalated_to) REFERENCES users(id),
    FOREIGN KEY (final_sign_off_by) REFERENCES users(id)
);

-- Create task dependencies with enhanced relationship tracking
CREATE TABLE IF NOT EXISTS task_dependencies (
    id TEXT NOT NULL PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    parent_task_id TEXT NOT NULL,
    dependent_task_id TEXT NOT NULL,
    dependency_type TEXT DEFAULT 'blocking' CHECK (dependency_type IN (
        'blocking', 'soft', 'resource', 'temporal', 'approval', 'information', 'quality_gate', 'milestone'
    )),
    dependency_strength TEXT DEFAULT 'mandatory' CHECK (dependency_strength IN ('mandatory', 'preferred', 'optional')),
    dependency_reason TEXT,
    lag_time_minutes INTEGER, -- Minimum time between parent completion and dependent start
    overlap_allowed_minutes INTEGER, -- How much overlap is acceptable
    coordination_required BOOLEAN DEFAULT FALSE, -- Whether active coordination is needed
    automatic_trigger BOOLEAN DEFAULT FALSE, -- Auto-trigger dependent when parent completes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_task_id) REFERENCES ecosystem_tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (dependent_task_id) REFERENCES ecosystem_tasks(id) ON DELETE CASCADE,
    CHECK (parent_task_id != dependent_task_id),
    UNIQUE(parent_task_id, dependent_task_id)
);

-- Create comprehensive task history and audit trail
CREATE TABLE IF NOT EXISTS task_history (
    id TEXT NOT NULL PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    task_id TEXT NOT NULL,
    changed_by TEXT,
    change_type TEXT NOT NULL CHECK (change_type IN (
        'created', 'assigned', 'started', 'updated', 'completed', 'cancelled', 'escalated', 'approved'
    )),
    previous_status TEXT,
    new_status TEXT,
    previous_assigned_to TEXT,
    new_assigned_to TEXT,
    previous_due_date DATETIME,
    new_due_date DATETIME,
    change_reason TEXT,
    change_notes TEXT,
    impact_assessment TEXT, -- Assessment of change impact
    system_generated BOOLEAN DEFAULT FALSE,
    notification_sent BOOLEAN DEFAULT FALSE,
    metadata TEXT DEFAULT '{}', -- JSON for additional change data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (task_id) REFERENCES ecosystem_tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id),
    FOREIGN KEY (previous_assigned_to) REFERENCES users(id),
    FOREIGN KEY (new_assigned_to) REFERENCES users(id)
);

-- Create comprehensive indexes for high-performance queries

-- Task templates indexes
CREATE INDEX IF NOT EXISTS idx_task_templates_code ON task_templates(task_code);
CREATE INDEX IF NOT EXISTS idx_task_templates_primary_role ON task_templates(primary_professional_role, is_active);
CREATE INDEX IF NOT EXISTS idx_task_templates_category ON task_templates(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_task_templates_discipline ON task_templates(discipline, complexity_level);
CREATE INDEX IF NOT EXISTS idx_task_templates_compliance ON task_templates(compliance_required, regulatory_body) 
WHERE compliance_required = TRUE;
CREATE INDEX IF NOT EXISTS idx_task_templates_automation ON task_templates(automation_level) 
WHERE automation_level != 'manual';

-- Ecosystem tasks indexes for high-performance queries
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_transaction ON ecosystem_tasks(transaction_id, status);
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_development ON ecosystem_tasks(development_id, status);
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_assigned ON ecosystem_tasks(assigned_to, status, due_date);
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_template ON ecosystem_tasks(task_template_id);
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_due_date ON ecosystem_tasks(due_date, status) 
WHERE due_date IS NOT NULL AND status NOT IN ('completed', 'cancelled');
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_priority ON ecosystem_tasks(priority, status);
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_completion ON ecosystem_tasks(completed_at) 
WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_risk_level ON ecosystem_tasks(risk_level) 
WHERE risk_level IN ('high', 'critical');

-- Composite indexes for common professional workflow queries
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_professional_active ON ecosystem_tasks(assigned_to, status, priority) 
WHERE status IN ('ready', 'assigned', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_development_timeline ON ecosystem_tasks(development_id, status, due_date) 
WHERE status NOT IN ('completed', 'cancelled');
CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_approval_workflow ON ecosystem_tasks(requires_approval, approval_workflow_stage) 
WHERE requires_approval = TRUE;

-- Task dependencies indexes
CREATE INDEX IF NOT EXISTS idx_task_dependencies_parent ON task_dependencies(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_dependent ON task_dependencies(dependent_task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_type ON task_dependencies(dependency_type, dependency_strength);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_auto_trigger ON task_dependencies(automatic_trigger) 
WHERE automatic_trigger = TRUE;

-- Task history indexes
CREATE INDEX IF NOT EXISTS idx_task_history_task ON task_history(task_id, created_at);
CREATE INDEX IF NOT EXISTS idx_task_history_user ON task_history(changed_by, created_at);
CREATE INDEX IF NOT EXISTS idx_task_history_type ON task_history(change_type, created_at);

COMMIT;

-- This migration creates the complete task orchestration system for the 49-role
-- professional ecosystem, enabling intelligent coordination of 3,329+ tasks across
-- all aspects of Irish property development and transactions