/**
 * Document Domain Model Types
 * 
 * This file defines the core Document domain models and related types
 * that are used throughout the application.
 */

import { UserSummary } from './user';

/**
 * Document status enum
 */
export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED'
}

/**
 * Document type enum
 */
export enum DocumentType {
  BROCHURE = 'BROCHURE',
  CONTRACT = 'CONTRACT',
  RESERVATION = 'RESERVATION',
  FLOORPLAN = 'FLOORPLAN',
  SITE_PLAN = 'SITE_PLAN',
  LEGAL = 'LEGAL',
  FINANCIAL = 'FINANCIAL',
  IDENTITY = 'IDENTITY',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
  MORTGAGE = 'MORTGAGE',
  SURVEY = 'SURVEY',
  PLANNING = 'PLANNING',
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  OTHER = 'OTHER'
}

/**
 * Document category enum
 */
export enum DocumentCategory {
  PROPERTY = 'PROPERTY',
  DEVELOPMENT = 'DEVELOPMENT',
  USER = 'USER',
  SALES = 'SALES',
  LEGAL = 'LEGAL',
  MARKETING = 'MARKETING',
  FINANCIAL = 'FINANCIAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  OTHER = 'OTHER'
}

/**
 * Document permission role enum
 */
export enum DocumentPermissionRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
  NONE = 'NONE'
}

/**
 * Document permission interface
 */
export interface DocumentPermission {
  userId: string;
  user?: UserSummary;
  role: DocumentPermissionRole;
  addedAt: Date;
  addedBy: string;
}

/**
 * Document version interface
 */
export interface DocumentVersion {
  id: string;
  versionNumber: number;
  url: string;
  createdAt: Date;
  createdBy: string;
  creator?: UserSummary;
  comment?: string;
  size: number;
  metadata?: Record<string, any>
  );
}

/**
 * Document signature interface
 */
export interface DocumentSignature {
  id: string;
  userId: string;
  user?: UserSummary;
  signedAt: Date;
  ipAddress?: string;
  method: 'ELECTRONIC' | 'DIGITAL' | 'HANDWRITTEN';
  status: 'PENDING' | 'SIGNED' | 'REJECTED';
  position?: Record<string, number>
  );
  metadata?: Record<string, any>
  );
}

/**
 * Document tag interface
 */
export interface DocumentTag {
  id: string;
  name: string;
  color?: string;
}

/**
 * Core Document interface
 */
export interface Document {
  id: string;
  title: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  status: DocumentStatus;
  url: string;
  fileType: string;
  size: number;
  versions: DocumentVersion[];
  currentVersion: number;
  permissions: DocumentPermission[];
  signatures?: DocumentSignature[];
  tags?: DocumentTag[];
  expiryDate?: Date;
  relatedEntityId?: string;
  relatedEntityType?: string;
  ownerId: string;
  owner?: UserSummary;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>
  );
  isTemplate: boolean;
  templateVariables?: string[];
}

/**
 * Document summary for listing views
 */
export interface DocumentSummary {
  id: string;
  title: string;
  type: DocumentType;
  category: DocumentCategory;
  status: DocumentStatus;
  fileType: string;
  size: number;
  currentVersion: number;
  updatedAt: Date;
  owner: {
    id: string;
    fullName: string;
  };
}

/**
 * Document creation request
 */
export interface CreateDocumentRequest {
  title: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  file: File; // For client uploads
  url?: string; // For server-side creation
  relatedEntityId?: string;
  relatedEntityType?: string;
  permissions?: Array<{
    userId: string;
    role: DocumentPermissionRole;
  }>
  );
  tags?: string[];
  expiryDate?: Date;
  isTemplate?: boolean;
  templateVariables?: string[];
  metadata?: Record<string, any>
  );
}

/**
 * Document update request
 */
export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  type?: DocumentType;
  category?: DocumentCategory;
  status?: DocumentStatus;
  permissions?: Array<{
    userId: string;
    role: DocumentPermissionRole;
  }>
  );
  tags?: string[];
  expiryDate?: Date;
  metadata?: Record<string, any>
  );
}

/**
 * Document version upload request
 */
export interface DocumentVersionUploadRequest {
  file: File;
  comment?: string;
  metadata?: Record<string, any>
  );
}

/**
 * Document search parameters
 */
export interface DocumentSearchParams {
  keyword?: string;
  types?: DocumentType[];
  categories?: DocumentCategory[];
  statuses?: DocumentStatus[];
  createdBy?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  expiryAfter?: Date;
  expiryBefore?: Date;
  tags?: string[];
  relatedEntityId?: string;
  relatedEntityType?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'size' | 'expiryDate';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Type guard to check if a value is a valid Document
 */
export function isDocument(value: any): value is Document {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.type === 'string' &&
    typeof value.category === 'string' &&
    typeof value.status === 'string' &&
    typeof value.url === 'string' &&
    typeof value.fileType === 'string' &&
    typeof value.size === 'number' &&
    Array.isArray(value.versions) &&
    typeof value.currentVersion === 'number' &&
    Array.isArray(value.permissions) &&
    typeof value.ownerId === 'string'
  );
}

/**
 * Type assertion function to ensure a value is a Document
 * @throws {Error} If the value is not a valid Document
 */
export function assertDocument(value: any): asserts value is Document {
  if (!isDocument(value)) {
    throw new Error('Value is not a valid Document');
  }
}