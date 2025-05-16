/**
 * PropIE Core Data Model - Project Management
 * Defines project management structures for real estate development
 */

import { Document } from '../document';
import { Development, ConstructionStage } from './development';
import { Unit } from './unit';
import { User } from './user';
import { Professional, ProfessionalRole } from './professional';

/**
 * Project interface
 * Represents a construction project for a development
 */
export interface Project {
  id: string;
  development: Development;
  name: string;
  description: string;
  status: ProjectStatus;
  
  // Timeline
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  timeline: ProjectTimeline;
  
  // Teams and management
  projectManager: User;
  assignedCertifier?: Professional;
  teams: ProjectTeam[];
  
  // Structure and tracking
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];
  currentPhase?: ProjectPhase;
  risks: ProjectRisk[];
  issues: ProjectIssue[];
  
  // Tasks and progress
  tasks: ProjectTask[];
  completionPercentage: number;
  
  // Construction tracking
  constructionStage: ConstructionStage;
  constructionLogs: ConstructionLog[];
  inspections: Inspection[];
  
  // Communication and updates
  updates: ProjectUpdate[];
  meetings: Meeting[];
  
  // Compliance and documentation
  compliance: ComplianceChecklist;
  documents: Document[];
  healthAndSafety: HealthAndSafetyPlan;
  
  // History and meta
  createdBy: User;
  created: Date;
  updated: Date;
  isArchived: boolean;
}

/**
 * Project Status enum
 * Current status of a project
 */
export enum ProjectStatus {
  PLANNING = 'planning',
  APPROVED = 'approved',
  MOBILIZING = 'mobilizing',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POST_COMPLETION = 'post_completion'
}

/**
 * Project Timeline interface
 * Schedule and timeline for a project
 */
export interface ProjectTimeline {
  id: string;
  planningPhase: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  designPhase: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  preconstruction: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  sitePreparation: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  foundations: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  superstructure: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  exteriorEnvelope: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  interiorRoughIn: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  interiorFinishes: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  landscaping: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  finalInspections: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  handover: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  defectsPeriod: {
    start: Date;
    end: Date;
  };
  criticalPath: ProjectTask[];
  lastUpdated: Date;
}

/**
 * Project Team interface
 * Group of professionals working on a project
 */
export interface ProjectTeam {
  id: string;
  name: string;
  description?: string;
  lead: User;
  members: {
    user: User;
    role: ProfessionalRole;
    joinDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive';
  }[];
  responsibilities: string[];
  phaseAssignment?: ProjectPhase[];
}

/**
 * Project Phase interface
 * Major phase of a project
 */
export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  status: PhaseStatus;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  completionPercentage: number;
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
  dependencies: {
    phaseId: string;
    type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  }[];
  documents: Document[];
}

/**
 * Phase Status enum
 * Current status of a project phase
 */
export enum PhaseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Project Milestone interface
 * Significant event in a project's timeline
 */
export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  phase: ProjectPhase;
  plannedDate: Date;
  actualDate?: Date;
  status: MilestoneStatus;
  isKeyMilestone: boolean;
  notifyStakeholders: boolean;
  dependsOn: ProjectMilestone[];
  responsibleParty: User;
  verificationMethod: string;
  completionCriteria: string[];
  documents: Document[];
}

/**
 * Milestone Status enum
 * Current status of a project milestone
 */
export enum MilestoneStatus {
  PENDING = 'pending',
  APPROACHING = 'approaching',
  DELAYED = 'delayed',
  ACHIEVED = 'achieved',
  AT_RISK = 'at_risk',
  CANCELLED = 'cancelled'
}

/**
 * Project Task interface
 * Actionable task within a project
 */
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  phase?: ProjectPhase;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: User;
  createdBy: User;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  estimatedHours: number;
  actualHours?: number;
  progressPercentage: number;
  dependencies: ProjectTask[];
  subtasks: ProjectTask[];
  parentTask?: ProjectTask;
  relatedTo?: { type: 'unit' | 'issue' | 'risk'; id: string };
  comments: TaskComment[];
  attachments: Document[];
  tags: string[];
  created: Date;
  updated: Date;
  isOnCriticalPath: boolean;
}

/**
 * Task Status enum
 * Current status of a task
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
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
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

/**
 * Task Comment interface
 * Comment on a task
 */
export interface TaskComment {
  id: string;
  task: ProjectTask;
  user: User;
  content: string;
  timestamp: Date;
  attachments?: Document[];
  mentions?: User[];
  edited: boolean;
  editedAt?: Date;
}

/**
 * Project Risk interface
 * Identified risk to a project
 */
export interface ProjectRisk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  probability: RiskProbability;
  impact: RiskImpact;
  severity: number; // Calculated from probability and impact
  status: RiskStatus;
  owner: User;
  identifiedDate: Date;
  identifiedBy: User;
  lastUpdated: Date;
  updatedBy: User;
  mitigationStrategy: string;
  mitigationTasks: ProjectTask[];
  contingencyPlan: string;
  contingencyBudget?: number;
  earlyWarningIndicators: string[];
  affectedAreas: string[];
  riskRegisterRanking: number;
  isArchived: boolean;
}

/**
 * Risk Category enum
 * Types of project risks
 */
export enum RiskCategory {
  FINANCIAL = 'financial',
  SCHEDULE = 'schedule',
  TECHNICAL = 'technical',
  QUALITY = 'quality',
  SAFETY = 'safety',
  ENVIRONMENTAL = 'environmental',
  ORGANIZATIONAL = 'organizational',
  EXTERNAL = 'external',
  LEGAL = 'legal',
  OPERATIONAL = 'operational'
}

/**
 * Risk Probability enum
 * Likelihood of a risk occurring
 */
export enum RiskProbability {
  VERY_LOW = 'very_low', // 1-20%
  LOW = 'low', // 21-40%
  MEDIUM = 'medium', // 41-60%
  HIGH = 'high', // 61-80%
  VERY_HIGH = 'very_high' // 81-100%
}

/**
 * Risk Impact enum
 * Severity of impact if a risk occurs
 */
export enum RiskImpact {
  NEGLIGIBLE = 'negligible',
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  SEVERE = 'severe'
}

/**
 * Risk Status enum
 * Current status of a risk
 */
export enum RiskStatus {
  IDENTIFIED = 'identified',
  ANALYZED = 'analyzed',
  MITIGATING = 'mitigating',
  MONITORING = 'monitoring',
  OCCURRED = 'occurred',
  CLOSED = 'closed',
  TRANSFERRED = 'transferred'
}

/**
 * Project Issue interface
 * Problem that has already occurred
 */
export interface ProjectIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  priority: TaskPriority;
  reportedDate: Date;
  reportedBy: User;
  assignedTo: User;
  dueDate?: Date;
  resolvedDate?: Date;
  resolutionDetails?: string;
  impact: string;
  rootCause?: string;
  preventativeMeasures?: string;
  relatedRisks: ProjectRisk[];
  resolutionTasks: ProjectTask[];
  affectedUnits?: Unit[];
  documents: Document[];
  comments: IssueComment[];
  isEscalated: boolean;
  escalationLevel?: number;
  escalatedTo?: User;
}

/**
 * Issue Category enum
 * Types of project issues
 */
export enum IssueCategory {
  DESIGN = 'design',
  CONSTRUCTION = 'construction',
  MATERIAL = 'material',
  LABOR = 'labor',
  EQUIPMENT = 'equipment',
  WEATHER = 'weather',
  SITE_CONDITION = 'site_condition',
  REGULATORY = 'regulatory',
  FINANCIAL = 'financial',
  QUALITY = 'quality',
  SAFETY = 'safety',
  COMMUNICATION = 'communication',
  OTHER = 'other'
}

/**
 * Issue Severity enum
 * Severity level of an issue
 */
export enum IssueSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Issue Status enum
 * Current status of an issue
 */
export enum IssueStatus {
  REPORTED = 'reported',
  ACKNOWLEDGED = 'acknowledged',
  INVESTIGATING = 'investigating',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REOPENED = 'reopened'
}

/**
 * Issue Comment interface
 * Comment on an issue
 */
export interface IssueComment {
  id: string;
  issue: ProjectIssue;
  user: User;
  content: string;
  timestamp: Date;
  attachments?: Document[];
  isInternal: boolean;
  edited: boolean;
  editedAt?: Date;
}

/**
 * Construction Log interface
 * Daily log of construction activities
 */
export interface ConstructionLog {
  id: string;
  date: Date;
  author: User;
  weather: {
    conditions: string;
    temperature: number;
    precipitation: number;
    windSpeed: number;
    notes?: string;
  };
  crews: {
    company: string;
    tradeType: string;
    personnelCount: number;
    hoursWorked: number;
    workAreas: string[];
  }[];
  equipment: {
    type: string;
    count: number;
    hoursUsed: number;
    notes?: string;
  }[];
  workCompleted: {
    description: string;
    location: string;
    quantity?: number;
    unit?: string;
  }[];
  materials: {
    type: string;
    quantity: number;
    unit: string;
    supplier?: string;
    deliveryNote?: string;
  }[];
  delays: {
    cause: string;
    duration: number; // in hours
    impact: string;
  }[];
  visitors: {
    name: string;
    company: string;
    purpose: string;
    timeIn: string;
    timeOut: string;
  }[];
  safetyIncidents?: {
    type: string;
    description: string;
    severity: 'minor' | 'moderate' | 'serious' | 'critical';
    reportFiled: boolean;
    reportNumber?: string;
  }[];
  qualityIssues?: {
    item: string;
    location: string;
    description: string;
    action: string;
  }[];
  notes: string;
  photos: Document[];
  nextDayPlan: string;
  issues: string[];
  submittedTimestamp: Date;
  approvedBy?: User;
  approvedTimestamp?: Date;
}

/**
 * Inspection interface
 * Formal inspection during construction
 */
export interface Inspection {
  id: string;
  type: InspectionType;
  inspector: User;
  inspectorRole: string;
  scheduled: Date;
  completed?: Date;
  location: string;
  unit?: Unit;
  status: InspectionStatus;
  result?: InspectionResult;
  findings: InspectionFinding[];
  notes: string;
  photos: Document[];
  documents: Document[];
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpInspection?: Inspection;
  isReinspection: boolean;
  previousInspection?: Inspection;
  created: Date;
  createdBy: User;
  updated: Date;
  updatedBy: User;
}

/**
 * Inspection Type enum
 * Types of construction inspections
 */
export enum InspectionType {
  FOUNDATION = 'foundation',
  FRAMING = 'framing',
  MECHANICAL = 'mechanical',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  INSULATION = 'insulation',
  DRYWALL = 'drywall',
  FINAL = 'final',
  SPECIAL = 'special',
  WARRANTY = 'warranty',
  PRE_DRYWALL = 'pre_drywall',
  SUBSTANTIAL_COMPLETION = 'substantial_completion',
  BUILDING_CONTROL = 'building_control',
  HOMEBOND = 'homebond',
  INTERNAL_QA = 'internal_qa',
  ASSIGNED_CERTIFIER = 'assigned_certifier'
}

/**
 * Inspection Status enum
 * Current status of an inspection
 */
export enum InspectionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  PENDING_REINSPECTION = 'pending_reinspection'
}

/**
 * Inspection Result enum
 * Outcome of an inspection
 */
export enum InspectionResult {
  PASS = 'pass',
  PASS_WITH_CONDITIONS = 'pass_with_conditions',
  FAIL = 'fail',
  INCOMPLETE = 'incomplete'
}

/**
 * Inspection Finding interface
 * Item noted during an inspection
 */
export interface InspectionFinding {
  id: string;
  category: string;
  description: string;
  location: string;
  severity: 'minor' | 'major' | 'critical';
  action: 'none' | 'monitor' | 'repair' | 'replace';
  photos?: Document[];
  assignedTo?: User;
  dueDate?: Date;
  status: 'open' | 'in_progress' | 'closed';
  closedDate?: Date;
  closedBy?: User;
  verificationRequired: boolean;
  verifiedBy?: User;
  verifiedDate?: Date;
}

/**
 * Project Update interface
 * Formal update on project status
 */
export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  author: User;
  timestamp: Date;
  type: UpdateType;
  visibleTo: ('project_team' | 'management' | 'client' | 'sales' | 'public')[];
  attachments: Document[];
  affectedPhases?: ProjectPhase[];
  affectedMilestones?: ProjectMilestone[];
  tags: string[];
  acknowledgments?: {
    user: User;
    timestamp: Date;
  }[];
}

/**
 * Update Type enum
 * Types of project updates
 */
export enum UpdateType {
  GENERAL = 'general',
  PROGRESS = 'progress',
  ISSUE = 'issue',
  MILESTONE = 'milestone',
  SCHEDULE_CHANGE = 'schedule_change',
  RISK = 'risk',
  FINANCIAL = 'financial',
  QUALITY = 'quality',
  SAFETY = 'safety',
  REGULATORY = 'regulatory'
}

/**
 * Meeting interface
 * Project meeting information
 */
export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  virtualMeetingLink?: string;
  organizer: User;
  attendees: {
    user: User;
    required: boolean;
    attended?: boolean;
  }[];
  agenda: AgendaItem[];
  minutes?: MeetingMinutes;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    endAfter?: number;
    endDate?: Date;
  };
  documents: Document[];
  created: Date;
  updated: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

/**
 * Meeting Type enum
 * Types of project meetings
 */
export enum MeetingType {
  KICKOFF = 'kickoff',
  STATUS = 'status',
  DESIGN = 'design',
  TECHNICAL = 'technical',
  COORDINATION = 'coordination',
  RISK = 'risk',
  ISSUE = 'issue',
  QUALITY = 'quality',
  SAFETY = 'safety',
  CLIENT = 'client',
  STAKEHOLDER = 'stakeholder',
  HANDOVER = 'handover'
}

/**
 * Agenda Item interface
 * Item on a meeting agenda
 */
export interface AgendaItem {
  id: string;
  topic: string;
  description?: string;
  presenter: User;
  duration: number; // in minutes
  order: number;
  documents?: Document[];
  status: 'pending' | 'in_progress' | 'completed' | 'deferred';
}

/**
 * Meeting Minutes interface
 * Record of a meeting
 */
export interface MeetingMinutes {
  attendees: User[];
  absentees: User[];
  discussions: {
    topic: string;
    notes: string;
    decisions: string[];
    actionItems: MeetingActionItem[];
  }[];
  approvedBy?: User;
  approvedDate?: Date;
  distributedOn?: Date;
  distributedTo: User[];
}

/**
 * Meeting Action Item interface
 * Action assigned during a meeting
 */
export interface MeetingActionItem {
  id: string;
  description: string;
  assignedTo: User;
  dueDate: Date;
  priority: TaskPriority;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  completedDate?: Date;
  notes?: string;
  relatedTask?: ProjectTask;
}

/**
 * Compliance Checklist interface
 * Regulatory and contractual compliance items
 */
export interface ComplianceChecklist {
  id: string;
  categories: {
    name: string;
    items: ComplianceItem[];
  }[];
  lastUpdated: Date;
  updatedBy: User;
  completionPercentage: number;
}

/**
 * Compliance Item interface
 * Individual compliance requirement
 */
export interface ComplianceItem {
  id: string;
  description: string;
  requirement: string;
  status: 'not_started' | 'in_progress' | 'compliant' | 'non_compliant' | 'not_applicable';
  dueDate?: Date;
  completedDate?: Date;
  completedBy?: User;
  verifiedBy?: User;
  verificationDate?: Date;
  documents: Document[];
  notes?: string;
  isRecurring: boolean;
  recurrenceInterval?: number; // in days
  importance: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Health and Safety Plan interface
 * Project health and safety management
 */
export interface HealthAndSafetyPlan {
  id: string;
  documentUrl: string;
  version: string;
  approvedBy: User;
  approvedDate: Date;
  lastReviewDate: Date;
  nextReviewDate: Date;
  responsiblePerson: User;
  emergencyContacts: EmergencyContact[];
  riskAssessments: Document[];
  safetyInspections: SafetyInspection[];
  incidents: SafetyIncident[];
  trainingRecords: TrainingRecord[];
  toolboxTalks: ToolboxTalk[];
}

/**
 * Emergency Contact interface
 * Contact information for emergencies
 */
export interface EmergencyContact {
  name: string;
  role: string;
  phoneNumber: string;
  email: string;
  company?: string;
  isOnSite: boolean;
}

/**
 * Safety Inspection interface
 * Health and safety inspection
 */
export interface SafetyInspection {
  id: string;
  date: Date;
  inspector: User;
  location: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  items: {
    category: string;
    item: string;
    status: 'compliant' | 'non_compliant' | 'not_applicable';
    notes?: string;
    photos?: Document[];
  }[];
  issues: {
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    actionRequired: string;
    assignedTo: User;
    dueDate: Date;
    status: 'open' | 'in_progress' | 'closed';
    closedDate?: Date;
  }[];
  score?: number;
  notes: string;
  signature: string;
  documents: Document[];
}

/**
 * Safety Incident interface
 * Workplace safety incident
 */
export interface SafetyIncident {
  id: string;
  date: Date;
  time: string;
  location: string;
  type: 'near_miss' | 'first_aid' | 'medical_treatment' | 'lost_time' | 'fatality';
  description: string;
  involved: User[];
  witnesses: User[];
  injuries: {
    person: User;
    description: string;
    bodyPart: string;
    severity: 'minor' | 'moderate' | 'severe' | 'critical';
    treatmentProvided: string;
    medicalAttention: boolean;
  }[];
  immediateActions: string;
  rootCause?: string;
  preventativeMeasures?: string;
  reportedBy: User;
  reportedDate: Date;
  reportNumber: string;
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  investigationFindings?: string;
  correctiveActions: {
    description: string;
    assignedTo: User;
    dueDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  documents: Document[];
  reportedToAuthorities: boolean;
  reportedToAuthoritiesDate?: Date;
  authorityReference?: string;
}

/**
 * Training Record interface
 * Safety training documentation
 */
export interface TrainingRecord {
  id: string;
  trainingType: string;
  description: string;
  trainer: string;
  trainingDate: Date;
  expiryDate?: Date;
  attendees: {
    user: User;
    status: 'attended' | 'partially_attended' | 'absent';
    certified: boolean;
    certificationNumber?: string;
  }[];
  documents: Document[];
  notes?: string;
}

/**
 * Toolbox Talk interface
 * Brief safety meeting record
 */
export interface ToolboxTalk {
  id: string;
  topic: string;
  presenter: User;
  date: Date;
  duration: number; // in minutes
  location: string;
  content: string;
  attendees: User[];
  signatures: string[];
  documents: Document[];
  notes?: string;
}

/**
 * Helper to calculate schedule variance
 */
export function calculateScheduleVariance(
  task: ProjectTask
): { days: number; percentage: number } {
  if (!task.actualEndDate || !task.plannedEndDate) {
    return { days: 0, percentage: 0 };
  }
  
  const plannedDuration = Math.ceil(
    (task.plannedEndDate.getTime() - task.plannedStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const actualDuration = Math.ceil(
    (task.actualEndDate.getTime() - (task.actualStartDate || task.plannedStartDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const variance = plannedDuration - actualDuration;
  const percentage = plannedDuration > 0 ? (variance / plannedDuration) * 100 : 0;
  
  return { days: variance, percentage };
}

/**
 * Helper to calculate risk score
 */
export function calculateRiskScore(
  probability: RiskProbability,
  impact: RiskImpact
): number {
  const probabilityScore = {
    [RiskProbability.VERY_LOW]: 1,
    [RiskProbability.LOW]: 2,
    [RiskProbability.MEDIUM]: 3,
    [RiskProbability.HIGH]: 4,
    [RiskProbability.VERY_HIGH]: 5
  };
  
  const impactScore = {
    [RiskImpact.NEGLIGIBLE]: 1,
    [RiskImpact.MINOR]: 2,
    [RiskImpact.MODERATE]: 3,
    [RiskImpact.MAJOR]: 4,
    [RiskImpact.SEVERE]: 5
  };
  
  return probabilityScore[probability] * impactScore[impact];
}

/**
 * Helper to get critical path tasks
 */
export function identifyCriticalPath(tasks: ProjectTask[]): ProjectTask[] {
  // This is a simplified placeholder - in real implementation would use
  // critical path method (CPM) algorithm to calculate
  return tasks.filter(task => task.isOnCriticalPath);
}