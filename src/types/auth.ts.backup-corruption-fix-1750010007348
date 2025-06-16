import { UserRole, UserStatus, KYCStatus } from '@prisma/client';

// NextAuth session types
declare module 'next-auth' {
  interface Session {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    error?: string;
  }
  
  interface User {
    id: string;
    email: string;
    name: string;
    roles: UserRole[];
    mfaEnabled?: boolean;
    mfaSecret?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    roles: UserRole[];
    role: UserRole;
    mfaEnabled: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    provider?: string;
    error?: string;
  }
}

// Auth user types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  roles: UserRole[];
  role: UserRole; // Primary role
  mfaEnabled: boolean;
  organization?: string;
  position?: string;
  avatar?: string;
  status?: UserStatus;
  kycStatus?: KYCStatus;
}

// Auth session
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
}

// Token types
export interface AccessTokenPayload {
  id: string;
  email: string;
  roles: UserRole[];
  type: 'access';
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  id: string;
  type: 'refresh';
  iat: number;
  exp: number;
}

// Auth context types
export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  signIn: (credentials: SignInCredentials) => Promise<SignInResult>\n  );
  signUp: (data: SignUpData) => Promise<SignUpResult>\n  );
  signOut: () => Promise<void>\n  );
  updateSession: () => Promise<void>\n  );
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
}

// Sign in types
export interface SignInCredentials {
  email: string;
  password: string;
  mfaCode?: string;
  rememberMe?: boolean;
}

export interface SignInResult {
  success: boolean;
  error?: string;
  requireMfa?: boolean;
  redirectUrl?: string;
}

// Sign up types
export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  organization?: string;
  position?: string;
  agreeToTerms: boolean;
  agreeToMarketing?: boolean;
}

export interface SignUpResult {
  success: boolean;
  error?: string;
  user?: Partial<AuthUser>\n  );
}

// MFA types
export interface MfaSetupData {
  method: 'TOTP' | 'SMS' | 'EMAIL';
  phoneNumber?: string; // For SMS
}

export interface MfaSetupResult {
  success: boolean;
  error?: string;
  qrCode?: string; // For TOTP
  secret?: string; // For TOTP
  backupCodes?: string[];
}

export interface MfaVerificationData {
  code: string;
  isBackupCode?: boolean;
}

export interface MfaVerificationResult {
  success: boolean;
  error?: string;
}

// Permission types
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface RolePermissions {
  [UserRole.ADMIN]: string[];
  [UserRole.DEVELOPER]: string[];
  [UserRole.BUYER]: string[];
  [UserRole.SOLICITOR]: string[];
  [UserRole.AGENT]: string[];
  [UserRole.INVESTOR]: string[];
  [UserRole.ARCHITECT]: string[];
  [UserRole.CONTRACTOR]: string[];
  [UserRole.ENGINEER]: string[];
  [UserRole.QUANTITY_SURVEYOR]: string[];
  [UserRole.LEGAL]: string[];
  [UserRole.PROJECT_MANAGER]: string[];
}

// Auth event types
export type AuthEventType = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'REGISTRATION'
  | 'TOKEN_REFRESH'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGED'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED'
  | 'MFA_CHALLENGE'
  | 'MFA_SUCCESS'
  | 'MFA_FAILED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'PERMISSION_DENIED';

export interface AuthEvent {
  id: string;
  eventType: AuthEventType;
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>\n  );
  timestamp: Date;
}

// Route protection types
export interface ProtectedRouteConfig {
  requireAuth: boolean;
  requireRoles?: UserRole[];
  requirePermissions?: string[];
  requireMfa?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

// OAuth provider types
export type OAuthProvider = 'google' | 'azure-ad' | 'github';

export interface OAuthSignInOptions {
  provider: OAuthProvider;
  callbackUrl?: string;
  scopes?: string[];
}

// Password policy
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number; // Number of previous passwords to check
  expiryDays?: number;
}

// Security settings
export interface SecuritySettings {
  mfaEnabled: boolean;
  mfaMethod?: 'TOTP' | 'SMS' | 'EMAIL';
  sessionTimeout: number; // Minutes
  passwordPolicy: PasswordPolicy;
  allowedIpAddresses?: string[];
  trustedDevices?: string[];
}

// Helper type guards
export function isAuthUser(user: any): user is AuthUser {
  return (
    user &&
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    Array.isArray(user.roles)
  );
}

export function hasRequiredRole(user: AuthUser | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false;
  return requiredRoles.some(role => user.roles.includes(role));
}

export function hasAllRequiredRoles(user: AuthUser | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false;
  return requiredRoles.every(role => user.roles.includes(role));
}

// Default password policy
export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventReuse: 5,
  expiryDays: 90};

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.DEVELOPER]: 'Property Developer',
  [UserRole.BUYER]: 'Property Buyer',
  [UserRole.SOLICITOR]: 'Solicitor',
  [UserRole.AGENT]: 'Estate Agent',
  [UserRole.INVESTOR]: 'Property Investor',
  [UserRole.ARCHITECT]: 'Architect',
  [UserRole.CONTRACTOR]: 'Contractor',
  [UserRole.ENGINEER]: 'Engineer',
  [UserRole.QUANTITY_SURVEYOR]: 'Quantity Surveyor',
  [UserRole.LEGAL]: 'Legal Professional',
  [UserRole.PROJECT_MANAGER]: 'Project Manager'};

// Permission definitions
export const PERMISSIONS = {
  // Property permissions
  PROPERTY_VIEW: 'property:view',
  PROPERTY_CREATE: 'property:create',
  PROPERTY_EDIT: 'property:edit',
  PROPERTY_DELETE: 'property:delete',
  PROPERTY_PUBLISH: 'property:publish',
  
  // Transaction permissions
  TRANSACTION_VIEW: 'transaction:view',
  TRANSACTION_CREATE: 'transaction:create',
  TRANSACTION_APPROVE: 'transaction:approve',
  TRANSACTION_CANCEL: 'transaction:cancel',
  
  // Document permissions
  DOCUMENT_VIEW: 'document:view',
  DOCUMENT_UPLOAD: 'document:upload',
  DOCUMENT_DELETE: 'document:delete',
  DOCUMENT_APPROVE: 'document:approve',
  
  // User management permissions
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_SUSPEND: 'user:suspend',
  
  // Financial permissions
  FINANCE_VIEW: 'finance:view',
  FINANCE_MANAGE: 'finance:manage',
  FINANCE_APPROVE: 'finance:approve',
  
  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // System permissions
  SYSTEM_ADMIN: 'system:admin',
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_AUDIT: 'system:audit'} as const;

// Default role permissions
export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.ADMIN]: Object.values(PERMISSIONS),
  
  [UserRole.DEVELOPER]: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.PROPERTY_CREATE,
    PERMISSIONS.PROPERTY_EDIT,
    PERMISSIONS.PROPERTY_PUBLISH,
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.TRANSACTION_CREATE,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.FINANCE_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW],
  
  [UserRole.BUYER]: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.TRANSACTION_CREATE,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_UPLOAD],
  
  [UserRole.SOLICITOR]: [
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.TRANSACTION_APPROVE,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.DOCUMENT_APPROVE],
  
  [UserRole.AGENT]: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.PROPERTY_CREATE,
    PERMISSIONS.PROPERTY_EDIT,
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.TRANSACTION_CREATE,
    PERMISSIONS.DOCUMENT_VIEW],
  
  [UserRole.INVESTOR]: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.ANALYTICS_VIEW],
  
  [UserRole.ARCHITECT]: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_UPLOAD],
  
  [UserRole.CONTRACTOR]: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_UPLOAD],
  
  [UserRole.ENGINEER]: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_UPLOAD],
  
  [UserRole.QUANTITY_SURVEYOR]: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.FINANCE_VIEW],
  
  [UserRole.LEGAL]: [
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_APPROVE],
  
  [UserRole.PROJECT_MANAGER]: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.PROPERTY_EDIT,
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_UPLOAD]};