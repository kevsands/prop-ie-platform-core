/**
 * PropIE Core Data Model - Document Management
 * Extends the base document types with workflow, templates, and approvals
 */

import { Document as BaseDocument, DocumentCategory, DocumentStatus, DocumentType, DocumentWorkflow as BaseDocumentWorkflow } from '../document';
import { Development } from './development';
import { Unit } from './unit';
import { User } from './user';
import { Sale } from './sales';

// Extend the base Document type with additional properties
export interface Document extends BaseDocument {
  workflow: BaseDocumentWorkflow;
  lastModified: Date;
  isNewVersion?: boolean;
  url?: string;
}

// Extend the base DocumentWorkflow with additional properties
export interface DocumentWorkflow extends Omit<BaseDocumentWorkflow, 'createdBy'> {
  documentTypes: DocumentType[];
  isDefault: boolean;
  created: Date;
  updated: Date;
  createdBy: User;
}

/**
 * Document Workflow Stage interface
 * A stage in a document approval workflow
 */
export interface DocumentWorkflowStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  approvers: ApproverConfig[];
  isOptional: boolean;
  timeoutDays?: number;
  notifyOnEntry: boolean;
  notifyOnExit: boolean;
  customFields?: DocumentCustomField[];
}

/**
 * Approver Configuration interface
 * Defines who can approve at a workflow stage
 */
export interface ApproverConfig {
  approverType: 'user' | 'role' | 'team';
  approverId: string;
  approverName?: string;
  requirementType: 'any' | 'all';
  canDelegate: boolean;
}

/**
 * Document Custom Field interface
 * Additional metadata fields for documents
 */
export interface DocumentCustomField {
  id: string;
  name: string;
  description?: string;
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  isRequired: boolean;
  options?: string[];
  defaultValue?: any;
  validationRegex?: string;
  validationMessage?: string;
}

/**
 * Document Workflow Instance interface
 * Active instance of a document going through workflow
 */
export interface DocumentWorkflowInstance {
  id: string;
  document: Document;
  workflow: DocumentWorkflow;
  currentStage: DocumentWorkflowStage;
  history: DocumentWorkflowHistory[];
  status: 'in_progress' | 'approved' | 'rejected' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  dueDate?: Date;
  customFieldValues: Record<string, any>;
  notes?: string;
}

/**
 * Document Workflow History interface
 * History of a document moving through workflow stages
 */
export interface DocumentWorkflowHistory {
  id: string;
  stage: DocumentWorkflowStage;
  enteredDate: Date;
  exitDate?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  approvals: DocumentApproval[];
  notes?: string;
}

/**
 * Document Approval interface
 * Approval action by an approver
 */
export interface DocumentApproval {
  id: string;
  approver: User;
  decision: 'approved' | 'rejected' | 'delegated';
  timestamp: Date;
  notes?: string;
  delegatedTo?: User;
}

/**
 * Document Template interface
 * Templates for generating standardized documents
 */
export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  documentType: DocumentType;
  category: DocumentCategory;
  templateUrl: string;
  thumbnailUrl?: string;
  variableFields: TemplateVariable[];
  createdBy: User;
  created: Date;
  updated: Date;
  version: string;
  isActive: boolean;
  workflow?: DocumentWorkflow;
  sampleDocument?: Document;
}

/**
 * Template Variable interface
 * Variables that can be replaced in a document template
 */
export interface TemplateVariable {
  id: string;
  name: string;
  description?: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'address' | 'person' | 'image';
  isRequired: boolean;
  defaultValue?: any;
  placeholder?: string;
  validationRegex?: string;
  validationMessage?: string;
  options?: string[];
  maxLength?: number;
}

/**
 * Document Generation interface
 * Request to generate a document from a template
 */
export interface DocumentGeneration {
  id: string;
  template: DocumentTemplate;
  variables: Record<string, any>;
  generatedDocument?: Document;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  requestedBy: User;
  requestedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  relatedTo?: DocumentRelatedEntity;
}

/**
 * Document Related Entity interface
 * Entity that a document relates to
 */
export interface DocumentRelatedEntity {
  entityType: 'development' | 'unit' | 'sale' | 'user' | 'professional';
  entityId: string;
  entityName?: string;
}

/**
 * Document Package interface
 * Collection of related documents
 */
export interface DocumentPackage {
  id: string;
  name: string;
  description?: string;
  documents: Document[];
  status: DocumentPackageStatus;
  createdBy: User;
  created: Date;
  updated: Date;
  deadline?: Date;
  recipientType: 'internal' | 'buyer' | 'investor' | 'authority' | 'professional';
  recipient?: User;
  accessCode?: string;
  expiryDate?: Date;
  isArchived: boolean;
  relatedTo?: DocumentRelatedEntity;
}

/**
 * Document Package Status enum
 * Status of a document package
 */
export enum DocumentPackageStatus {
  IN_PREPARATION = 'in_preparation',
  AWAITING_APPROVAL = 'awaiting_approval',
  APPROVED = 'approved',
  READY_FOR_RECIPIENT = 'ready_for_recipient',
  DELIVERED = 'delivered',
  VIEWED = 'viewed',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

/**
 * Document Activity interface
 * Tracking of document activity
 */
export interface DocumentActivity {
  id: string;
  document: Document;
  user: User;
  activityType: DocumentActivityType;
  timestamp: Date;
  details?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

/**
 * Document Activity Type enum
 * Types of activity on documents
 */
export enum DocumentActivityType {
  CREATED = 'created',
  VIEWED = 'viewed',
  DOWNLOADED = 'downloaded',
  EDITED = 'edited',
  VERSIONED = 'versioned',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SHARED = 'shared',
  ARCHIVED = 'archived',
  RESTORED = 'restored',
  SIGNED = 'signed',
  COMMENT_ADDED = 'comment_added',
  STATUS_CHANGED = 'status_changed'
}

/**
 * Document Retention Policy interface
 * Policies for document retention and archiving
 */
export interface DocumentRetentionPolicy {
  id: string;
  name: string;
  description?: string;
  documentTypes: DocumentType[];
  retentionPeriod: number; // in months
  archiveAfterPeriod?: number; // in months
  deleteAfterPeriod?: number; // in months
  notifyBeforeDeletion: boolean;
  notificationPeriod?: number; // in days
  isActive: boolean;
  created: Date;
  updated: Date;
  createdBy: User;
}

/**
 * Document Signature interface
 * Digital signature for a document
 */
export interface DocumentSignature {
  id: string;
  document: Document;
  signer: User;
  signatureDate: Date;
  signatureImageUrl?: string;
  signaturePosition?: SignaturePosition;
  signatureMethod: 'click_to_sign' | 'draw' | 'certificate' | 'third_party';
  ipAddress?: string;
  verified: boolean;
  verificationMethod?: string;
  certificateUrl?: string;
}

/**
 * Signature Position interface
 * Position of a signature on a document
 */
export interface SignaturePosition {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Document Version interface
 * Version history of a document
 */
export interface DocumentVersion {
  id: string;
  document: Document;
  versionNumber: number;
  fileUrl: string;
  createdBy: User;
  created: Date;
  notes?: string;
  changes?: string;
  size: number;
  checksum?: string;
}

/**
 * Document Category Type mapping
 * Maps document categories to allowed document types
 */
export const DocumentCategoryTypeMapping: Record<DocumentCategory, DocumentType[]> = {
  [DocumentCategory.DEVELOPMENT]: [
    DocumentType.PLANNING,
    DocumentType.LEGAL,
    DocumentType.CONSTRUCTION,
    DocumentType.MARKETING,
    DocumentType.COMPLIANCE,
    DocumentType.REPORT,
    DocumentType.CERTIFICATE
  ],
  [DocumentCategory.PROPERTY]: [
    DocumentType.LEGAL,
    DocumentType.CERTIFICATE,
    DocumentType.MARKETING
  ],
  [DocumentCategory.USER]: [
    DocumentType.IDENTITY,
    DocumentType.LEGAL,
    DocumentType.FINANCIAL
  ],
  [DocumentCategory.SALE]: [
    DocumentType.CONTRACT,
    DocumentType.AGREEMENT,
    DocumentType.FINANCIAL,
    DocumentType.LEGAL
  ],
  [DocumentCategory.PROJECT]: [
    DocumentType.REPORT,
    DocumentType.CONSTRUCTION,
    DocumentType.COMPLIANCE
  ],
  [DocumentCategory.ADMINISTRATIVE]: [
    DocumentType.LEGAL,
    DocumentType.FINANCIAL,
    DocumentType.OTHER
  ],
  [DocumentCategory.HTB]: [
    DocumentType.FINANCIAL,
    DocumentType.AGREEMENT,
    DocumentType.CERTIFICATE
  ],
  [DocumentCategory.PLANNING_PERMISSION]: [
    DocumentType.PLANNING,
    DocumentType.LEGAL,
    DocumentType.COMPLIANCE
  ]
};

/**
 * Helper to get document workflow stages based on document type
 */
export function getDefaultWorkflow(
  documentType: DocumentType,
  documentCategory: DocumentCategory
): DocumentWorkflow | null {
  // In a real implementation, this would fetch from a database
  // This is just a placeholder implementation
  return null;
}

/**
 * Helper to create a document package for a sale
 */
export function createSaleDocumentPackage(
  sale: Sale,
  user: User,
  documents: Document[]
): DocumentPackage {
  return {
    id: generateId(),
    name: `Sale Documents for ${sale.unit.name}`,
    description: `Document package for the sale of ${sale.unit.name}`,
    documents,
    status: DocumentPackageStatus.IN_PREPARATION,
    createdBy: user,
    created: new Date(),
    updated: new Date(),
    recipientType: 'buyer',
    recipient: sale.buyer,
    isArchived: false,
    relatedTo: {
      entityType: 'sale',
      entityId: sale.id,
      entityName: `Sale of ${sale.unit.name}`
    }
  };
}

/**
 * Helper to create a document for a development
 */
export function createDevelopmentDocument(
  development: Development,
  user: User,
  type: DocumentType,
  name: string,
  fileUrl: string,
  fileType: string,
  fileSize: number
): Document {
  return {
    id: generateId(),
    name,
    type,
    status: DocumentStatus.DRAFT,
    category: DocumentCategory.DEVELOPMENT,
    fileUrl,
    fileType,
    fileSize,
    uploadedBy: user.id,
    uploadedByName: `${user.firstName} ${user.lastName}`,
    uploadDate: new Date(),
    version: 1,
    lastModified: new Date(), // Add required property
    workflow: { // Add required property
      id: generateId(),
      name: 'Default Workflow',
      stages: [],
      status: 'in_progress',
      documentTypes: [type],
      isDefault: true,
      created: new Date(),
      updated: new Date(),
      createdBy: user.id
    },
    relatedTo: {
      type: 'development',
      id: development.id,
      name: development.name,
      url: `/developments/${development.id}`
    }
  };
}

// Helper to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}