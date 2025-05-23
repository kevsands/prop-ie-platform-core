/**
 * User Domain Model Types
 * 
 * This file defines the core User domain models and related types
 * that are used throughout the application.
 */

/**
 * User status enum
 */
export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE'
}

/**
 * User KYC status enum
 */
export enum KYCStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/**
 * User role enum
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  BUYER = 'BUYER',
  AGENT = 'AGENT',
  SOLICITOR = 'SOLICITOR',
  INVESTOR = 'INVESTOR'
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

/**
 * User preferences
 */
export interface UserPreferences {
  notifications: NotificationPreferences;
  theme: string;
  language: string;
  timezone: string;
  dashboardLayout?: Record<string, any>;
}

/**
 * User permission
 */
export interface UserPermission {
  id: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

/**
 * Core User interface
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  roles: UserRole[];
  status: UserStatus;
  kycStatus: KYCStatus;
  organization?: string;
  position?: string;
  avatar?: string;
  preferences?: UserPreferences;
  created: Date;
  lastActive: Date;
  lastLogin?: Date;
  metadata?: Record<string, any>;
  permissions?: UserPermission[];
}

/**
 * Simplified user representation for lists and references
 */
export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  roles: UserRole[];
  avatar?: string;
}

/**
 * User creation request
 */
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: UserRole[];
  organization?: string;
  position?: string;
  password?: string;
}

/**
 * User update request
 */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  roles?: UserRole[];
  status?: UserStatus;
  organization?: string;
  position?: string;
  avatar?: string;
  preferences?: UserPreferences;
}

/**
 * User for authentication contexts
 */
export interface AuthUser {
  id: string;
  email: string;
  roles: UserRole[];
  permissions?: UserPermission[];
  isAuthenticated: boolean;
}

/**
 * Type for user search/filter parameters
 */
export interface UserFilterParams {
  search?: string;
  roles?: UserRole[];
  status?: UserStatus;
  kycStatus?: KYCStatus;
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * Type for user pagination
 */
export interface UserPaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

/**
 * Type guard to check if a value is a valid User
 */
export function isUser(value: any): value is User {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    Array.isArray(value.roles) &&
    typeof value.status === 'string'
  );
}

/**
 * Type assertion function to ensure a value is a User
 * @throws {Error} If the value is not a valid User
 */
export function assertUser(value: any): asserts value is User {
  if (!isUser(value)) {
    throw new Error('Value is not a valid User');
  }
}