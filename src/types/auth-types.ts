/**
 * Authentication Type Definitions
 * 
 * Type definitions for authentication system with proper roles array handling
 */

import { UserRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[]; // Array of roles, not single role
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  kycStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  organization?: string;
  position?: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  roles: UserRole[]; // Array of roles in JWT payload
}

export interface AuthPermissions {
  [resource: string]: string[];
}

export interface UserPermissionsResponse {
  roles: UserRole[];
  permissions: AuthPermissions;
}

export interface PermissionCheckRequest {
  resource: string;
  action: string;
}

export interface PermissionCheckResponse {
  hasPermission: boolean;
  userId: string;
  resource: string;
  action: string;
}