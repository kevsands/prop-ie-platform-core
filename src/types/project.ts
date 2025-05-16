/**
 * Project related types for development and construction management
 */
import { Location } from './location';
import { Document, DocumentType } from './document';
import { DevelopmentStatus } from './graphql';

/**
 * Project team member interface
 */
export interface ProjectTeamMember {
  id: string;
  userId?: string;
  name: string;
  role: ProjectRole;
  organization: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  profileImage?: string;
  documents?: Document[];
  notes?: string;
  isActive: boolean;
  joinedAt: Date;
}

/**
 * Project team roles
 */
export enum ProjectRole {
  DEVELOPER = 'developer',
  ARCHITECT = 'architect',
  ENGINEER = 'engineer',
  CONSTRUCTION_MANAGER = 'construction_manager',
  CONTRACTOR = 'contractor',
  SOLICITOR = 'solicitor',
  ESTATE_AGENT = 'estate_agent',
  SALES_AGENT = 'sales_agent',
  FINANCIAL_ADVISOR = 'financial_advisor',
  SURVEYOR = 'surveyor',
  INTERIOR_DESIGNER = 'interior_designer',
  LANDSCAPE_ARCHITECT = 'landscape_architect',
  QUANTITY_SURVEYOR = 'quantity_surveyor',
  PLANNING_CONSULTANT = 'planning_consultant'
}

/**
 * Project timeline interface
 */
export interface ProjectTimeline {
  id: string;
  projectId: string;
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project phase
 */
export interface ProjectPhase {
  id: string;
  name: string;
  description?: string;
  status: ProjectPhaseStatus;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  tasks?: ProjectTask[];
  dependencies?: string[]; // IDs of phases that must be completed first
  milestones?: ProjectMilestone[];
  documents?: Document[];
}

/**
 * Project phase status enum
 */
export enum ProjectPhaseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled'
}

/**
 * Project milestone
 */
export interface ProjectMilestone {
  id: string;
  name: string;
  description?: string;
  date: Date;
  isCompleted: boolean;
  completedAt?: Date;
  phaseId?: string;
  type: MilestoneType;
  documents?: Document[];
  notifications?: boolean; // Whether to send notifications for this milestone
}

/**
 * Milestone type enum
 */
export enum MilestoneType {
  PLANNING_PERMISSION = 'planning_permission',
  CONSTRUCTION_START = 'construction_start',
  FOUNDATION_COMPLETE = 'foundation_complete',
  STRUCTURE_COMPLETE = 'structure_complete',
  INTERIOR_START = 'interior_start',
  UTILITIES_CONNECTION = 'utilities_connection',
  HANDOVER = 'handover',
  SALES_LAUNCH = 'sales_launch',
  PHASE_COMPLETION = 'phase_completion',
  PROJECT_COMPLETION = 'project_completion',
  MARKETING_START = 'marketing_start',
  FINANCIAL_MILESTONE = 'financial_milestone',
  LEGAL_MILESTONE = 'legal_milestone',
  CUSTOM = 'custom'
}

/**
 * Project task
 */
export interface ProjectTask {
  id: string;
  name: string;
  description?: string;
  status: ProjectTaskStatus;
  priority: TaskPriority;
  assignedTo?: string[]; // User IDs
  phaseId?: string;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  progress: number; // 0-100
  dependencies?: string[]; // IDs of tasks that must be completed first
  subtasks?: ProjectSubtask[];
  notes?: string;
  tags?: string[];
  attachments?: Document[];
}

/**
 * Project task status enum
 */
export enum ProjectTaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled'
}

/**
 * Task priority enum
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Project subtask
 */
export interface ProjectSubtask {
  id: string;
  taskId: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  assignedTo?: string; // User ID
  dueDate?: Date;
  completedAt?: Date;
}

/**
 * Project budget
 */
export interface ProjectBudget {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  totalAmount: number;
  currency: string;
  categories: BudgetCategory[];
  actualSpent: number;
  projectedSpent: number;
  variance: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Budget category
 */
export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  amount: number;
  actualSpent: number;
  projectedSpent: number;
  variance: number;
  items?: BudgetItem[];
}

/**
 * Budget item
 */
export interface BudgetItem {
  id: string;
  name: string;
  description?: string;
  estimatedAmount: number;
  actualAmount?: number;
  quantity?: number;
  unit?: string;
  source?: string;
  notes?: string;
  invoices?: Document[];
}

/**
 * Project risk
 */
export interface ProjectRisk {
  id: string;
  projectId: string;
  name: string;
  description: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  status: RiskStatus;
  mitigationPlan?: string;
  contingencyPlan?: string;
  assignedTo?: string; // User ID
  category: RiskCategory;
  identifiedAt: Date;
  resolvedAt?: Date;
  documents?: Document[];
}

/**
 * Risk level enum
 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  SEVERE = 'severe'
}

/**
 * Risk status enum
 */
export enum RiskStatus {
  IDENTIFIED = 'identified',
  MONITORING = 'monitoring',
  MITIGATED = 'mitigated',
  RESOLVED = 'resolved',
  ACCEPTED = 'accepted'
}

/**
 * Risk category enum
 */
export enum RiskCategory {
  FINANCIAL = 'financial',
  LEGAL = 'legal',
  REGULATORY = 'regulatory',
  CONSTRUCTION = 'construction',
  ENVIRONMENTAL = 'environmental',
  SCHEDULE = 'schedule',
  RESOURCE = 'resource',
  HEALTH_SAFETY = 'health_safety',
  QUALITY = 'quality',
  STAKEHOLDER = 'stakeholder',
  TECHNICAL = 'technical'
}

/**
 * Main project interface
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  developerId: string; // Organization ID
  location: Location;
  status: DevelopmentStatus;
  startDate: Date;
  estimatedCompletionDate: Date;
  actualCompletionDate?: Date;
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];
  team: ProjectTeamMember[];
  budget?: ProjectBudget;
  risks?: ProjectRisk[];
  documents: Document[];
  planningPermissionRef?: string;
  planningPermissionStatus?: string;
  planningPermissionDate?: Date;
  sitePlanUrl?: string;
  salesInfo?: {
    launchDate?: Date;
    salesTarget?: number;
    reservationsCount?: number;
    salesCount?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}