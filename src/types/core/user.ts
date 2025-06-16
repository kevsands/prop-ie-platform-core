/**
 * PropIE Core Data Model - User Management
 * Defines the core user interfaces and enums
 */

import { Document } from '../document';

/**
 * Main User interface
 * Represents a user in the PropIE system with all properties
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: UserRole[];
  status: UserStatus;
  kycStatus: KYCStatus;
  kycDocuments?: Document[];
  organization?: string;
  position?: string;
  avatar?: string;
  preferences?: UserPreferences;
  created: Date;
  lastActive: Date;
  lastLogin?: Date;
  metadata?: Record<string, any>
  );
}

/**
 * User Roles enum
 * Defines all possible roles a user can have in the system
 */
export enum UserRole {
  DEVELOPER = 'developer',
  BUYER = 'buyer',
  INVESTOR = 'investor',
  ARCHITECT = 'architect',
  ENGINEER = 'engineer',
  QUANTITY_SURVEYOR = 'quantity_surveyor',
  LEGAL = 'legal',
  PROJECT_MANAGER = 'project_manager',
  AGENT = 'agent',
  SOLICITOR = 'solicitor',
  CONTRACTOR = 'contractor',
  ADMIN = 'admin'
}

/**
 * User Status enum
 * Represents current status of user account
 */
export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive'
}

/**
 * KYC Status enum
 * Know Your Customer status tracking
 */
export enum KYCStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

/**
 * User Permissions interface
 * Defines granular permissions for a user
 */
export interface UserPermission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  conditions?: Record<string, any>
  );
}

/**
 * User Preferences interface
 * User-specific preferences for the platform
 */
export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dashboardLayout?: Record<string, any>
  );
}

/**
 * Simplified User interface for list views and dropdowns
 */
export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatar?: string;
  roles: UserRole[];
}

/**
 * Type guard to check if a user has a specific role
 */
export function hasRole(user: User, role: UserRole): boolean {
  return user.roles.includes(role);
}

/**
 * Helper to get full name of user
 */
export function getFullName(user: User | UserSummary): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

/**
 * Helper to check if a user is active
 */
export function isActiveUser(user: User): boolean {
  return user.status === UserStatus.ACTIVE;
}

/**
 * KYC Document Requirements
 */
export interface KYCRequirement {
  documentType: string;
  description: string;
  isRequired: boolean;
  userRoles: UserRole[];
}