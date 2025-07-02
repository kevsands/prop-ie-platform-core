/**
 * Authentication Type Definitions
 * 
 * Comprehensive TypeScript interfaces for authentication, JWT tokens,
 * and user management to replace 'any' types in auth-related code
 */

import { UserRole, Permission } from '@/lib/permissions/ProfessionalPermissionMatrix';

// Re-export UserRole and Permission for convenience
export { UserRole, Permission } from '@/lib/permissions/ProfessionalPermissionMatrix';

/**
 * JWT token payload structure
 * Standard JWT claims plus custom application claims
 */
export interface JWTPayload {
  // Standard JWT claims
  sub: string;              // Subject (user ID)
  iat: number;              // Issued at timestamp
  exp: number;              // Expiration timestamp
  iss?: string;             // Issuer
  aud?: string;             // Audience
  
  // Custom application claims
  email: string;
  user_id?: string;         // Alternative user ID field
  role: UserRole;
  permissions: Permission[];
  given_name?: string;
  family_name?: string;
  
  // Cognito-specific claims
  'cognito:groups'?: string[];
  'cognito:username'?: string;
  token_use?: 'access' | 'id';
  
  // Custom fields
  organization_id?: string;
  tenant_id?: string;
}

/**
 * Authenticated user object
 * Represents a validated user with their permissions
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  tenantId?: string;
}

/**
 * Route protection configuration
 */
export interface RouteProtection {
  requiredRoles: UserRole[];
  permissions: Permission[];
}

/**
 * Route access check result
 */
export interface RouteAccessResult {
  allowed: boolean;
  reason?: string;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
}

/**
 * Authentication error codes
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  ACCOUNT_SETUP_REQUIRED = 'ACCOUNT_SETUP_REQUIRED',
  USER_SUSPENDED = 'USER_SUSPENDED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PASSWORD_RESET_REQUIRED = 'PASSWORD_RESET_REQUIRED',
  MFA_REQUIRED = 'MFA_REQUIRED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * User status enumeration
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

/**
 * Cognito user attributes from sign-up/profile
 */
export interface CognitoUserAttributes {
  email?: string;
  given_name?: string;
  family_name?: string;
  phone_number?: string;
  'custom:role'?: string;
  'custom:organization_id'?: string;
  'custom:tenant_id'?: string;
  'cognito:groups'?: string[];
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * User object as returned by our API
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roles: string[];
  status: string;
  permissions?: Permission[];
}

/**
 * Login response from our API
 */
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  dashboardRoute: string;
  expiresIn: number;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AuthError;
}

/**
 * Authentication error object
 */
export interface AuthError {
  code: AuthErrorCode | string;
  message: string;
  field?: string;
  details?: any;
}

/**
 * Authentication state for context
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  sessionId: string | null;
}

/**
 * Session information
 */
export interface Session {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  isActive: boolean;
}