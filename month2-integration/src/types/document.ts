/**
 * Document types and interfaces for the document management system
 */

/**
 * Document status enum representing the lifecycle of a document
 */
export enum DocumentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  ARCHIVED = 'archived'
}

/**
 * Document type enum categorizing documents by their purpose
 */
export enum DocumentType {
  PLANNING = 'planning',
  LEGAL = 'legal',
  FINANCIAL = 'financial',
  CONSTRUCTION = 'construction',
  MARKETING = 'marketing',
  COMPLIANCE = 'compliance',
  IDENTITY = 'identity',
  CONTRACT = 'contract',
  AGREEMENT = 'agreement',
  REPORT = 'report',
  CERTIFICATE = 'certificate',
  OTHER = 'other'
}

/**
 * Document category enum for organizational purposes
 */
export enum DocumentCategory {
  DEVELOPMENT = 'development',
  PROPERTY = 'property',
  USER = 'user',
  SALE = 'sale',
  PROJECT = 'project',
  ADMINISTRATIVE = 'administrative',
  HTB = 'help_to_buy',
  PLANNING_PERMISSION = 'planning_permission'
}

/**
 * Interface for related entity references
 */
export interface RelatedEntity {
  type: 'development' | 'unit' | 'user' | 'sale' | 'project';
  id: string;
  name?: string;
  url: string;
}

/**
 * Main Document interface
 */
export interface Document {
  id: string;
  name: string;
  description?: string;
  type: DocumentType;
  status: DocumentStatus;
  category: DocumentCategory;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string; // User ID
  uploadedByName?: string; // User display name
  uploadDate: Date;
  lastModified: Date;
  expiryDate?: Date;
  tags?: string[];
  version: number;
  previousVersions?: string[]; // Document IDs
  relatedTo?: RelatedEntity;
  metadata?: Record<string, any>; // Additional metadata
  permissions?: DocumentPermissions;
  signatureRequired?: boolean;
  signedBy?: string[];
  signatureStatus?: 'unsigned' | 'partially_signed' | 'fully_signed';
  organizationId?: string; // For multi-tenancy support
  workflow?: DocumentWorkflow;
  isNewVersion?: boolean;
  url?: string;
}

/**
 * Document permissions
 */
export interface DocumentPermissions {
  canView: string[]; // Array of user IDs or roles
  canEdit: string[];
  canDelete: string[];
  canShare: string[];
  canSign: string[];
  isPublic: boolean;
  sensitivity: 'low' | 'standard' | 'confidential';
}

/**
 * Document filter parameters for querying
 */
export interface DocumentFilter {
  types?: DocumentType[];
  statuses?: DocumentStatus[];
  categories?: DocumentCategory[];
  uploadedBy?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  relatedTo?: {
    type: string;
    id: string;
  };
  tags?: string[];
  search?: string; // Search term for name/description
  version?: number;
  signatureStatus?: 'unsigned' | 'partially_signed' | 'fully_signed';
}

/**
 * Document request interface for API validation
 */
export interface DocumentRequest {
  id?: string;
  title: string;
  type: string;
  fileUrl?: string;
  url?: string;
  entityType: string;
  entityId: string;
  category?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  isPublic?: boolean;
  uploadedBy?: string;
}

/**
 * Type guard to check if an unknown object is a Document
 */
export function isDocument(obj: unknown): obj is Document {
  if (!obj || typeof obj !== 'object') return false;
  
  const doc = obj as Partial<Document>;
  
  return typeof doc.name === 'string' &&
         typeof doc.fileUrl === 'string' &&
         typeof doc.type === 'string';
}

/**
 * Type guard to check if an unknown object is a DocumentRequest
 */
export function isDocumentRequest(obj: unknown): obj is DocumentRequest {
  if (!obj || typeof obj !== 'object') return false;
  
  const req = obj as Partial<DocumentRequest>;
  
  return typeof req.title === 'string' &&
         typeof req.type === 'string' &&
         typeof req.entityType === 'string' &&
         typeof req.entityId === 'string';
}

/**
 * Document sort options
 */
export enum DocumentSortField {
  NAME = 'name',
  UPLOAD_DATE = 'uploadDate',
  EXPIRY_DATE = 'expiryDate',
  TYPE = 'type',
  STATUS = 'status',
  CATEGORY = 'category',
  VERSION = 'version'
}

/**
 * Document file upload response
 */
export interface DocumentUploadResponse {
  document: Document;
  uploadUrl?: string; // Pre-signed URL for direct uploads
  success: boolean;
  message?: string;
}

/**
 * Document template for generating documents from templates
 */
export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  fileUrl: string;
  variables: string[]; // Variables that can be replaced in the template
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  version: number;
}

/**
 * Document workflow interface
 */
export interface DocumentWorkflow {
  id: string;
  name: string;
  description?: string;
  stages: DocumentWorkflowStage[];
  currentStage?: DocumentWorkflowStage;
  startDate?: Date;
  endDate?: Date;
  dueDate?: Date;
  status: 'in_progress' | 'approved' | 'rejected' | 'cancelled';
  documentTypes: DocumentType[];
  isDefault: boolean;
  created: Date;
  updated: Date;
  createdBy: string; // User ID
}

/**
 * Document workflow stage interface
 */
export interface DocumentWorkflowStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  approvers: string[]; // Array of user IDs
  isOptional: boolean;
  timeoutDays?: number;
  notifyOnEntry: boolean;
  notifyOnExit: boolean;
}