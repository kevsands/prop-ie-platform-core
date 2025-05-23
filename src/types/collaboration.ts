// Collaboration Types

export interface Project {
  id: string;
  name: string;
  description?: string;
  propertyId: string;
  developmentId?: string;
  status: ProjectStatus;
  startDate: Date;
  targetCompletion?: Date;
  actualCompletion?: Date;
  budget?: number;
  
  // Team
  leadArchitectId: string;
  architectIds: string[];
  engineerIds: string[];
  contractorIds: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Drawing {
  id: string;
  projectId: string;
  type: DrawingType;
  title: string;
  description?: string;
  drawingNumber: string;
  scale?: string;
  
  // File details
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  
  // Version control
  version: number;
  status: DrawingStatus;
  currentRevisionId?: string;
  
  // Metadata
  createdById: string;
  lastModifiedById: string;
  tags: string[];
  discipline: DrawingDiscipline;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface DrawingRevision {
  id: string;
  drawingId: string;
  revisionNumber: string;
  description: string;
  fileUrl: string;
  
  // Changes
  changesMade: string[];
  reviewedBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
  
  status: RevisionStatus;
  
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DrawingMarkup {
  id: string;
  revisionId: string;
  
  // Markup details
  type: MarkupType;
  coordinates: any; // SVG or canvas coordinates
  content: string;
  color: string;
  authorId: string;
  
  resolved: boolean;
  resolvedById?: string;
  resolvedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildingModel {
  id: string;
  projectId: string;
  
  name: string;
  description?: string;
  type: ModelType;
  fileUrl: string;
  fileSize: number;
  
  // Model metadata
  format: string;
  modelVersion: string;
  softwareUsed: string;
  
  // Viewing
  viewerUrl?: string;
  thumbnailUrl?: string;
  
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  
  // Assignments
  assignedToId: string;
  assignedTeam?: string;
  
  // Timeline
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  
  // Dependencies
  dependentTaskIds: string[];
  blockingTaskIds: string[];
  
  // Related items
  relatedDrawingIds: string[];
  relatedDocumentIds: string[];
  
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  
  content: string;
  authorId: string;
  
  // What it relates to
  entityType: CommentEntityType;
  entityId: string;
  
  // Thread
  parentCommentId?: string;
  
  mentions: string[];
  resolved: boolean;
  resolvedById?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  
  orderNumber: string;
  title: string;
  description: string;
  requestedById: string;
  
  // Impact
  costImpact?: number;
  scheduleImpact?: number;
  
  status: ChangeOrderStatus;
  priority: ChangePriority;
  
  // Approval workflow
  currentStepId?: string;
  
  // Documentation
  affectedDrawings: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Specification {
  id: string;
  projectId: string;
  
  section: string;
  title: string;
  content: string;
  type: SpecificationType;
  
  // Related items
  relatedDrawingIds: string[];
  relatedProductIds: string[];
  
  version: number;
  status: SpecStatus;
  
  createdById: string;
  approvedById?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  
  title: string;
  description?: string;
  documentType: DocumentType;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  
  tags: string[];
  accessLevel: AccessLevel;
  
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  
  name: string;
  description?: string;
  targetDate: Date;
  actualDate?: Date;
  
  deliverables: string[];
  status: MilestoneStatus;
  
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export type ProjectStatus = 'PLANNING' | 'DESIGN' | 'APPROVAL' | 'CONSTRUCTION' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';

export type DrawingType = 'FLOOR_PLAN' | 'ELEVATION' | 'SECTION' | 'DETAIL' | 'SITE_PLAN' | 'LANDSCAPE' | 
                         'ELECTRICAL' | 'PLUMBING' | 'STRUCTURAL' | 'HVAC' | 'FURNITURE' | 'REFLECTED_CEILING';

export type DrawingStatus = 'DRAFT' | 'FOR_REVIEW' | 'APPROVED' | 'FOR_CONSTRUCTION' | 'AS_BUILT' | 'SUPERSEDED';

export type DrawingDiscipline = 'ARCHITECTURAL' | 'STRUCTURAL' | 'MECHANICAL' | 'ELECTRICAL' | 
                               'PLUMBING' | 'LANDSCAPE' | 'INTERIOR' | 'CIVIL';

export type RevisionStatus = 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';

export type MarkupType = 'COMMENT' | 'DIMENSION' | 'ARROW' | 'RECTANGLE' | 'CIRCLE' | 'FREEHAND' | 'TEXT';

export type ModelType = 'CONCEPT_3D' | 'BIM' | 'STRUCTURAL' | 'MEP' | 'FULL_BUILDING' | 'LANDSCAPE';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CommentEntityType = 'PROJECT' | 'DRAWING' | 'REVISION' | 'TASK' | 'CHANGE_ORDER' | 'SPECIFICATION';

export type ChangeOrderStatus = 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ChangePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type DocumentType = 'CONTRACT' | 'REPORT' | 'CERTIFICATE' | 'PERMIT' | 'SCHEDULE' | 
                          'BUDGET' | 'MEETING_MINUTES' | 'CORRESPONDENCE' | 'PHOTO' | 'OTHER';

export type SpecificationType = 'MATERIAL' | 'PRODUCT' | 'PERFORMANCE' | 'EXECUTION' | 'GENERAL';

export type SpecStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ISSUED' | 'SUPERSEDED';

export type AccessLevel = 'PUBLIC' | 'TEAM' | 'RESTRICTED' | 'CONFIDENTIAL';

export type MilestoneStatus = 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';

// View models for UI
export interface DrawingWithRevisions extends Drawing {
  revisions: DrawingRevision[];
  project?: Project;
}

export interface TaskWithDetails extends ProjectTask {
  project?: Project;
  assignedTo?: any; // User object
  attachments?: any[];
  comments?: any[];
}

export interface ProjectWithDetails extends Project {
  drawings: Drawing[];
  tasks: ProjectTask[];
  documents: ProjectDocument[];
  milestones: ProjectMilestone[];
  changeOrders: ChangeOrder[];
  team?: any[]; // User objects
}