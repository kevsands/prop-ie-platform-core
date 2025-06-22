/**
 * Universal Task Interface for PropIE Platform
 * 
 * Comprehensive task management system supporting 3,329+ granular tasks
 * across all personas with progressive disclosure and intelligent orchestration.
 * 
 * Integrates with existing TaskOrchestrationEngine and enterprise infrastructure.
 */

import { UserRole } from '@prisma/client';

/**
 * Core task status with expanded states for enterprise workflows
 */
export enum UniversalTaskStatus {
  // Basic states
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  
  // Advanced workflow states
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  BLOCKED = 'BLOCKED',
  REVIEW_REQUIRED = 'REVIEW_REQUIRED',
  ESCALATED = 'ESCALATED',
  DEFERRED = 'DEFERRED',
  
  // Regulatory and compliance states
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
  LEGAL_REVIEW = 'LEGAL_REVIEW',
  REGULATORY_APPROVAL = 'REGULATORY_APPROVAL',
  
  // Error states
  FAILED = 'FAILED',
  RETRY_REQUIRED = 'RETRY_REQUIRED'
}

/**
 * Task priority with enterprise-grade criticality levels
 */
export enum UniversalTaskPriority {
  CRITICAL = 'CRITICAL',        // Legal deadlines, regulatory requirements
  HIGH = 'HIGH',               // Transaction blocking, time-sensitive
  MEDIUM = 'MEDIUM',           // Important but flexible timing
  LOW = 'LOW',                 // Non-blocking, convenience tasks
  DEFERRED = 'DEFERRED'        // Future consideration
}

/**
 * Task complexity levels for progressive disclosure
 */
export enum TaskComplexityLevel {
  SIMPLE = 'SIMPLE',           // Single-step, clear outcome
  MODERATE = 'MODERATE',       // Multi-step, some dependencies
  COMPLEX = 'COMPLEX',         // Multiple dependencies, expert knowledge
  EXPERT = 'EXPERT'           // Highly technical, professional only
}

/**
 * Task categories mapping to the 3,329+ task ecosystem
 */
export enum TaskCategory {
  // Buyer persona tasks (641 tasks)
  BUYER_PLANNING = 'BUYER_PLANNING',
  BUYER_FINANCING = 'BUYER_FINANCING',
  BUYER_SEARCHING = 'BUYER_SEARCHING',
  BUYER_LEGAL = 'BUYER_LEGAL',
  BUYER_COMPLETION = 'BUYER_COMPLETION',
  
  // Developer persona tasks (1,037 tasks)
  DEVELOPER_PLANNING = 'DEVELOPER_PLANNING',
  DEVELOPER_CONSTRUCTION = 'DEVELOPER_CONSTRUCTION',
  DEVELOPER_SALES = 'DEVELOPER_SALES',
  DEVELOPER_LEGAL = 'DEVELOPER_LEGAL',
  DEVELOPER_FINANCIAL = 'DEVELOPER_FINANCIAL',
  
  // Estate Agent persona tasks (643 tasks)
  AGENT_MARKETING = 'AGENT_MARKETING',
  AGENT_CLIENT_MANAGEMENT = 'AGENT_CLIENT_MANAGEMENT',
  AGENT_VIEWINGS = 'AGENT_VIEWINGS',
  AGENT_NEGOTIATIONS = 'AGENT_NEGOTIATIONS',
  AGENT_COMPLETION = 'AGENT_COMPLETION',
  
  // Solicitor persona tasks (1,008 tasks)
  SOLICITOR_DUE_DILIGENCE = 'SOLICITOR_DUE_DILIGENCE',
  SOLICITOR_CONTRACTS = 'SOLICITOR_CONTRACTS',
  SOLICITOR_SEARCHES = 'SOLICITOR_SEARCHES',
  SOLICITOR_COMPLIANCE = 'SOLICITOR_COMPLIANCE',
  SOLICITOR_COMPLETION = 'SOLICITOR_COMPLETION',
  
  // Cross-persona categories
  REGULATORY = 'REGULATORY',
  FINANCIAL = 'FINANCIAL',
  DOCUMENTATION = 'DOCUMENTATION',
  COMMUNICATION = 'COMMUNICATION',
  QUALITY_ASSURANCE = 'QUALITY_ASSURANCE'
}

/**
 * Progressive disclosure view types for different user experiences
 */
export enum TaskViewType {
  MILESTONE = 'MILESTONE',     // High-level progress for buyers
  DETAILED = 'DETAILED',       // Step-by-step for engaged users
  PROFESSIONAL = 'PROFESSIONAL', // Full complexity for experts
  COLLABORATIVE = 'COLLABORATIVE', // Cross-persona coordination
  GANTT = 'GANTT'             // Enterprise timeline with dependencies
}

/**
 * Task automation capabilities
 */
export enum TaskAutomationLevel {
  MANUAL = 'MANUAL',           // Requires human action
  SEMI_AUTOMATED = 'SEMI_AUTOMATED', // Partial automation with human approval
  AUTOMATED = 'AUTOMATED',     // Fully automated with monitoring
  AI_OPTIMIZED = 'AI_OPTIMIZED' // AI-driven optimization and routing
}

/**
 * Core Universal Task Interface
 * Extends existing TaskOrchestrationEngine capabilities
 */
export interface UniversalTask {
  // Core identification
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  
  // Progressive disclosure properties
  complexityLevel: TaskComplexityLevel;
  viewType: TaskViewType;
  parentTaskId?: string;        // For hierarchical task grouping
  childTaskIds?: string[];      // Sub-tasks for progressive disclosure
  milestoneId?: string;         // Associated milestone for high-level tracking
  
  // Enterprise Gantt chart properties
  estimatedDuration?: number;   // Days
  actualDuration?: number;      // Days  
  dependencies?: TaskDependency[];
  successors?: string[];
  
  // Status and priority
  status: UniversalTaskStatus;
  priority: UniversalTaskPriority;
  
  // Persona and role management
  targetPersonas: UserRole[];   // Who can see/interact with this task
  assignedTo?: string;          // Current assignee user ID
  assignedRole?: UserRole;      // Professional role responsible
  requiresApprovalFrom?: UserRole[]; // Who needs to approve completion
  
  // Timeline and scheduling
  createdAt: Date;
  updatedAt: Date;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  dueDate?: Date;
  
  // Dependencies and relationships
  dependencies?: TaskDependency[];
  blockedBy?: string[];         // Task IDs that block this task
  blocks?: string[];           // Task IDs blocked by this task
  
  // Progress and estimation
  estimatedDuration?: number;   // Hours
  actualDuration?: number;      // Hours
  progressPercentage: number;   // 0-100
  
  // Context and metadata
  transactionId?: string;       // Associated property transaction
  propertyId?: string;         // Associated property
  projectId?: string;          // Associated development project
  
  // AI and automation
  automationLevel: TaskAutomationLevel;
  aiRoutingScore?: number;      // AI confidence in routing/assignment
  predictedCompletion?: Date;   // AI prediction
  riskScore?: number;          // Risk assessment 0-100
  
  // Communication and collaboration
  lastCommentAt?: Date;
  commentCount: number;
  attachmentCount: number;
  collaborators?: string[];     // User IDs involved
  
  // Business rules and compliance
  isRegulatory: boolean;        // Requires regulatory compliance
  isLegalRequirement: boolean;  // Legal obligation
  isTimeDependent: boolean;     // Time-sensitive with hard deadlines
  complianceChecked: boolean;   // Compliance verification complete
  
  // User experience customization
  isVisible: boolean;           // Shown in current view
  isExpanded: boolean;          // Showing detailed view
  userNotes?: string;          // Personal notes
  tags?: string[];             // User-defined tags
  
  // Integration points
  externalSystemId?: string;    // External system reference
  integrationStatus?: 'synced' | 'pending' | 'error';
  
  // Metadata for extensibility
  metadata?: Record<string, any>;
}

/**
 * Task dependency with intelligent relationship management
 */
export interface TaskDependency {
  dependentTaskId: string;
  dependencyType: 'start_to_start' | 'start_to_finish' | 'finish_to_start' | 'finish_to_finish';
  lagTime?: number;             // Hours delay after dependency completion
  isCritical: boolean;          // On critical path
  isOptional: boolean;          // Soft dependency
}

/**
 * Milestone for high-level progress tracking
 */
export interface TaskMilestone {
  id: string;
  title: string;
  description: string;
  targetPersonas: UserRole[];
  associatedTasks: string[];    // Task IDs in this milestone
  completionCriteria: string[];
  scheduledDate?: Date;
  actualDate?: Date;
  progressPercentage: number;
  isVisible: boolean;
  order: number;                // Display order
}

/**
 * Task template for standardized task creation
 */
export interface UniversalTaskTemplate {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  complexityLevel: TaskComplexityLevel;
  estimatedDuration: number;
  targetPersonas: UserRole[];
  isRegulatory: boolean;
  isLegalRequirement: boolean;
  defaultPriority: UniversalTaskPriority;
  automationLevel: TaskAutomationLevel;
  dependencyTemplates?: TaskDependencyTemplate[];
  checklistItems?: string[];    // Sub-tasks or verification items
  requiredDocuments?: string[]; // Document types needed
  approvalWorkflow?: ApprovalStep[];
  metadata?: Record<string, any>;
}

/**
 * Task dependency template for consistent relationships
 */
export interface TaskDependencyTemplate {
  dependsOnTemplateId: string;
  dependencyType: 'start_to_start' | 'start_to_finish' | 'finish_to_start' | 'finish_to_finish';
  lagTime?: number;
  isCritical: boolean;
  isOptional: boolean;
}

/**
 * Approval workflow step
 */
export interface ApprovalStep {
  stepNumber: number;
  approverRole: UserRole;
  isRequired: boolean;
  parallelApproval: boolean;    // Can approve in parallel with other steps
  autoApprove?: boolean;        // Automatic approval under certain conditions
  conditions?: string[];        // Conditions for auto-approval
}

/**
 * Task dependency relationship for Gantt chart and critical path
 */
export interface TaskDependency {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  lag: number; // Days
  isOnCriticalPath: boolean;
  isMandatory: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task milestone for grouping and progress tracking
 */
export interface TaskMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completionDate?: Date;
  progressPercentage: number;
  tasks: string[]; // Task IDs
  persona: UserRole;
  isRequired: boolean;
  dependencies: string[]; // Milestone IDs this depends on
}

/**
 * Progressive disclosure configuration for different personas
 */
export interface ProgressiveDisclosureConfig {
  persona: UserRole;
  defaultViewType: TaskViewType;
  maxVisibleTasks: number;
  groupingStrategy: 'milestone' | 'category' | 'priority' | 'timeline';
  showComplexityIndicators: boolean;
  autoHideCompleted: boolean;
  expandOnHover: boolean;
  showDependencies: boolean;
  showAiInsights: boolean;
}

/**
 * Task orchestration context for AI routing and optimization
 */
export interface TaskOrchestrationContext {
  userId: string;
  userRole: UserRole;
  transactionStage: string;
  workloadCapacity: number;     // Current capacity 0-100
  skillLevel: 'beginner' | 'intermediate' | 'expert';
  availableHours: number;       // Hours available this week
  preferredComplexity: TaskComplexityLevel;
  currentFocus?: TaskCategory;  // What they're currently working on
  collaborationPreference: 'independent' | 'collaborative' | 'guided';
}

/**
 * Task analytics and performance metrics
 */
export interface TaskAnalytics {
  taskId: string;
  viewCount: number;
  timeSpent: number;            // Total time spent viewing/working
  interactionCount: number;     // Clicks, edits, comments
  completionAccuracy: number;   // How well predicted vs actual
  userSatisfaction?: number;    // Rating 1-5
  bottleneckScore: number;      // How often this task causes delays
  collaborationScore: number;   // How well it facilitates collaboration
  automationSuccess: number;    // Automation success rate
}

/**
 * Export all types for use across the platform
 */
export type {
  UniversalTask as Task,
  UniversalTaskTemplate as TaskTemplate,
  TaskDependency,
  TaskMilestone,
  ProgressiveDisclosureConfig,
  TaskOrchestrationContext,
  TaskAnalytics
};

