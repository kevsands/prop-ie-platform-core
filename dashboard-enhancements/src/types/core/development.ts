/**
 * PropIE Core Data Model - Development
 * Defines development projects and their properties
 */

import { Location } from './location';
import { Unit } from './unit';
import { User, UserRole } from './user';
import { Document, DocumentType } from '../document';

/**
 * Main Development interface
 * Represents a real estate development project
 */
export interface Development {
  id: string;
  name: string;
  slug?: string;
  developer: User;
  location: Location;
  status: DevelopmentStatus;
  
  // Units and accommodation
  scheduleOfAccommodation: Unit[];
  totalUnits: number;
  
  // Team and documentation
  professionalTeam: ProfessionalTeamMember[];
  documents: Document[];
  
  // Status tracking
  marketingStatus: MarketingStatus;
  salesStatus: SalesStatus;
  constructionStatus: ConstructionStatus;
  complianceStatus: ComplianceStatus;
  
  // Timeline and financials
  timeline: ProjectTimeline;
  financials: DevelopmentFinancials;
  
  // Media and marketing
  mainImage: string;
  images: string[];
  videos?: string[];
  sitePlanUrl?: string;
  brochureUrl?: string;
  virtualTourUrl?: string;
  websiteUrl?: string;
  
  // Descriptions
  description: string;
  shortDescription?: string;
  features: string[];
  amenities: string[];
  buildingSpecs?: BuildingSpecifications;
  
  // Additional metadata
  buildingType?: string;
  completionDate?: Date;
  startDate?: Date;
  created: Date;
  updated: Date;
  publishedDate?: Date;
  isPublished: boolean;
  tags?: string[];
  awards?: string[];
}

/**
 * Development Status enum
 * Represents the current phase of a development project
 */
export enum DevelopmentStatus {
  PLANNING = 'planning',
  PRE_CONSTRUCTION = 'pre_construction',
  CONSTRUCTION = 'construction',
  MARKETING = 'marketing',
  SALES = 'sales',
  HANDOVER = 'handover',
  COMPLETED = 'completed'
}

/**
 * Professional Team Member
 * Represents a professional appointed to the development
 */
export interface ProfessionalTeamMember {
  id: string;
  user: User;
  role: ProfessionalRole;
  company: string;
  appointmentDocument?: Document;
  status: AppointmentStatus;
  tasks?: Task[];
  startDate?: Date;
  endDate?: Date;
  notes?: string;
}

/**
 * Professional Role enum
 * Roles that can be appointed to a development
 */
export enum ProfessionalRole {
  ARCHITECT = 'architect',
  STRUCTURAL_ENGINEER = 'structural_engineer',
  MECHANICAL_ENGINEER = 'mechanical_engineer',
  ELECTRICAL_ENGINEER = 'electrical_engineer',
  QUANTITY_SURVEYOR = 'quantity_surveyor',
  SOLICITOR = 'solicitor',
  PROJECT_MANAGER = 'project_manager',
  ENERGY_ASSESSOR = 'energy_assessor',
  ASSIGNED_CERTIFIER = 'assigned_certifier',
  CONTRACTOR = 'contractor',
  ESTATE_AGENT = 'estate_agent'
}

/**
 * Appointment Status enum
 * Status of a professional's appointment to the development
 */
export enum AppointmentStatus {
  APPOINTED = 'appointed',
  PENDING = 'pending',
  TERMINATED = 'terminated',
  COMPLETED = 'completed'
}

/**
 * Project Timeline
 * Key dates and milestones for development
 */
export interface ProjectTimeline {
  id: string;
  planningSubmissionDate: Date;
  planningDecisionDate?: Date;
  constructionStartDate?: Date;
  constructionEndDate?: Date;
  marketingLaunchDate?: Date;
  salesLaunchDate?: Date;
  milestones: ProjectMilestone[];
}

/**
 * Project Milestone
 * Specific milestone within a development timeline
 */
export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  plannedDate: Date;
  actualDate?: Date;
  status: MilestoneStatus;
  dependencies: ProjectMilestone[];
  documents: Document[];
}

/**
 * Milestone Status enum
 * Status of a project milestone
 */
export enum MilestoneStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Task
 * Task assigned to a team member
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: User;
  createdBy: User;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  relatedTo: any; // Can be Development, Unit, Sale, etc.
  documents: Document[];
  comments: TaskComment[];
}

/**
 * Task Status enum
 * Current status of a task
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  COMPLETE = 'complete',
  CANCELLED = 'cancelled'
}

/**
 * Task Priority enum
 * Priority level of a task
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Task Comment
 * Comment on a task
 */
export interface TaskComment {
  id: string;
  task: Task;
  user: User;
  content: string;
  timestamp: Date;
}

/**
 * Marketing Status
 * Marketing status and activities for the development
 */
export interface MarketingStatus {
  website: boolean;
  brochuresReady: boolean;
  showUnitReady: boolean;
  launchDate?: Date;
  campaigns: MarketingCampaign[];
}

/**
 * Marketing Campaign
 * Marketing campaign details
 */
export interface MarketingCampaign {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  budget: number;
  channels: string[];
  performance: CampaignPerformance;
}

/**
 * Campaign Performance
 * Performance metrics for a marketing campaign
 */
export interface CampaignPerformance {
  impressions: number;
  clicks: number;
  enquiries: number;
  viewings: number;
  reservations: number;
  conversionRate: number;
  costPerEnquiry: number;
}

/**
 * Sales Status
 * Sales statistics and metrics
 */
export interface SalesStatus {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  saleAgreedUnits: number;
  soldUnits: number;
  salesVelocity: number; // units per month
  targetPriceAverage: number;
  actualPriceAverage: number;
  projectedSelloutDate: Date;
}

/**
 * Construction Status
 * Construction progress and tracking
 */
export interface ConstructionStatus {
  currentStage: ConstructionStage;
  percentageComplete: number;
  inspections: Inspection[];
  certifications: Document[];
}

/**
 * Construction Stage enum
 * Stages of construction
 */
export enum ConstructionStage {
  NOT_STARTED = 'not_started',
  SITE_PREPARATION = 'site_preparation',
  FOUNDATIONS = 'foundations',
  SUPERSTRUCTURE = 'superstructure',
  EXTERIOR_ENVELOPE = 'exterior_envelope',
  INTERIOR_ROUGH = 'interior_rough',
  INTERIOR_FINISH = 'interior_finish',
  LANDSCAPING = 'landscaping',
  FINAL_INSPECTIONS = 'final_inspections',
  COMPLETED = 'completed'
}

/**
 * Inspection
 * Construction inspection records
 */
export interface Inspection {
  id: string;
  type: InspectionType;
  inspector: User;
  date: Date;
  status: InspectionStatus;
  notes: string;
  documents: Document[];
  followUpRequired: boolean;
  followUpDate?: Date;
}

/**
 * Inspection Type enum
 * Types of construction inspections
 */
export enum InspectionType {
  FOUNDATION = 'foundation',
  FRAMING = 'framing',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  INSULATION = 'insulation',
  FINAL = 'final',
  HOMEBOND = 'homebond',
  ASSIGNED_CERTIFIER = 'assigned_certifier',
  OTHER = 'other'
}

/**
 * Inspection Status enum
 * Outcome of an inspection
 */
export enum InspectionStatus {
  SCHEDULED = 'scheduled',
  COMPLETED_PASS = 'completed_pass',
  COMPLETED_FAIL = 'completed_fail',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled'
}

/**
 * Compliance Status
 * Compliance tracking for regulations
 */
export interface ComplianceStatus {
  planningConditions: ComplianceItem[];
  buildingRegulations: ComplianceItem[];
  environmentalRequirements: ComplianceItem[];
  bonds: Bond[];
  levies: Levy[];
}

/**
 * Compliance Item
 * Individual compliance requirement
 */
export interface ComplianceItem {
  id: string;
  description: string;
  status: ComplianceItemStatus;
  dueDate?: Date;
  completedDate?: Date;
  documents: Document[];
  assignedTo?: User;
  notes: string;
}

/**
 * Compliance Item Status enum
 * Status of compliance item
 */
export enum ComplianceItemStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

/**
 * Bond
 * Financial bond for development
 */
export interface Bond {
  id: string;
  type: BondType;
  amount: number;
  provider: string;
  issueDate: Date;
  expiryDate?: Date;
  status: BondStatus;
  document: Document;
}

/**
 * Bond Type enum
 * Types of development bonds
 */
export enum BondType {
  PLANNING = 'planning',
  PERFORMANCE = 'performance',
  ROAD = 'road',
  WATER = 'water',
  SEWER = 'sewer',
  OTHER = 'other'
}

/**
 * Bond Status enum
 * Status of a bond
 */
export enum BondStatus {
  REQUIRED = 'required',
  SUBMITTED = 'submitted',
  ACTIVE = 'active',
  RELEASED = 'released',
  EXPIRED = 'expired'
}

/**
 * Levy
 * Development levy paid to authorities
 */
export interface Levy {
  id: string;
  type: LevyType;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: LevyStatus;
  receipt?: Document;
}

/**
 * Levy Type enum
 * Types of development levies
 */
export enum LevyType {
  DEVELOPMENT = 'development',
  INFRASTRUCTURE = 'infrastructure',
  COMMUNITY = 'community',
  OTHER = 'other'
}

/**
 * Levy Status enum
 * Status of a levy
 */
export enum LevyStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  DISPUTED = 'disputed',
  WAIVED = 'waived'
}

/**
 * Building Specifications
 * Detailed specifications for the development
 */
export interface BuildingSpecifications {
  structure: string;
  foundation: string;
  exteriorWalls: string;
  roofing: string;
  windows: string;
  doors: string;
  interiorFinishes: string;
  heatingSystem: string;
  coolingSystem?: string;
  electricalSystem: string;
  plumbingSystem: string;
  insulation: string;
  energyFeatures: string[];
  smartHomeFeatures?: string[];
  securityFeatures?: string[];
  accessibilityFeatures?: string[];
  sustainabilityFeatures?: string[];
}

/**
 * Development Financials
 * Financial details for development
 */
export interface DevelopmentFinancials {
  id: string;
  landCost: number;
  constructionCosts: ConstructionCosts;
  professionalFees: ProfessionalFees;
  marketingCosts: number;
  salesCosts: number;
  financeCosts: number;
  bondsCosts: number;
  leviesCosts: number;
  vatLiability: number;
  contingency: number;
  projectedRevenue: number;
  projectedProfit: number;
  cashFlowForecast: CashFlowItem[];
  actualRevenue: number;
  actualCosts: number;
  actualProfit: number;
}

/**
 * Construction Costs
 * Breakdown of construction costs
 */
export interface ConstructionCosts {
  preliminaries: number;
  substructure: number;
  superstructure: number;
  internal_finishes: number;
  services: number;
  external_works: number;
  totalPerSqM: number;
  total: number;
}

/**
 * Professional Fees
 * Breakdown of professional fees
 */
export interface ProfessionalFees {
  architect: number;
  engineer: number;
  quantitySurveyor: number;
  projectManager: number;
  legal: number;
  other: number;
  total: number;
}

/**
 * Cash Flow Item
 * Cash flow projection item
 */
export interface CashFlowItem {
  period: Date;
  inflows: number;
  outflows: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

/**
 * Helper to calculate development profit margin
 */
export function calculateProfitMargin(financials: DevelopmentFinancials): number {
  const revenue = financials.actualRevenue || financials.projectedRevenue;
  const costs = financials.actualCosts || 
    (financials.landCost + 
     financials.constructionCosts.total + 
     financials.professionalFees.total + 
     financials.marketingCosts + 
     financials.salesCosts + 
     financials.financeCosts + 
     financials.bondsCosts + 
     financials.leviesCosts + 
     financials.vatLiability + 
     financials.contingency);
  
  return (revenue - costs) / revenue;
}