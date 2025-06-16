/**
 * Security Domain Model Types
 * 
 * This file defines security-related domain models and types
 * that are used throughout the application.
 */

import { User } from './user';

/**
 * Security event severity enum
 */
export enum SecurityEventSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Security event type enum
 */
export enum SecurityEventType {
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  AUTH_LOCKOUT = 'AUTH_LOCKOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MFA_CHANGE = 'MFA_CHANGE',
  MFA_CHALLENGE = 'MFA_CHALLENGE',
  ACCESS_DENIED = 'ACCESS_DENIED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  ACCOUNT_CHANGE = 'ACCOUNT_CHANGE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_EXPORT = 'DATA_EXPORT',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  ADMIN_ACTION = 'ADMIN_ACTION',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  SYSTEM_WARNING = 'SYSTEM_WARNING',
  SYSTEM_INFO = 'SYSTEM_INFO',
  API_ABUSE = 'API_ABUSE',
  BRUTE_FORCE = 'BRUTE_FORCE',
  IP_BLOCKED = 'IP_BLOCKED'
}

/**
 * Security event interface
 */
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  timestamp: Date;
  userId?: string;
  user?: User;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  resourceType?: string;
  resourceId?: string;
  action?: string;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED' | 'WARNING';
  description: string;
  metadata?: Record<string, any>
  );
  relatedEvents?: string[];
}

/**
 * MFA option interface
 */
export interface MFAOption {
  id: string;
  type: 'SMS' | 'EMAIL' | 'TOTP' | 'FIDO' | 'RECOVERY_CODE';
  status: 'ENABLED' | 'DISABLED' | 'PENDING';
  lastUsed?: Date;
  enrolledAt: Date;
  verifiedAt?: Date;
  metadata?: Record<string, any>
  );
}

/**
 * Session interface
 */
export interface UserSession {
  id: string;
  userId: string;
  user?: User;
  ipAddress: string;
  userAgent: string;
  deviceId?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  startedAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  mfaCompleted: boolean;
  trustLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  isCurrentSession: boolean;
}

/**
 * Device interface
 */
export interface TrustedDevice {
  id: string;
  userId: string;
  name: string;
  type: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'OTHER';
  osName?: string;
  osVersion?: string;
  browserName?: string;
  browserVersion?: string;
  deviceId: string;
  isTrusted: boolean;
  firstSeenAt: Date;
  lastSeenAt: Date;
}

/**
 * Security alert interface
 */
export interface SecurityAlert {
  id: string;
  type: string;
  severity: SecurityEventSeverity;
  title: string;
  description: string;
  userId?: string;
  user?: User;
  createdAt: Date;
  status: 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  relatedEvents?: SecurityEvent[];
  metadata?: Record<string, any>
  );
}

/**
 * Security metric interface
 */
export interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  category: string;
  unit: string;
  trend?: 'INCREASING' | 'DECREASING' | 'STABLE' | 'FLUCTUATING';
  threshold?: {
    warning: number;
    critical: number;
  };
  status?: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

/**
 * Security preference interface
 */
export interface SecurityPreferences {
  mfaRequired: boolean;
  loginNotifications: boolean;
  securityAlerts: boolean;
  activityLogRetention: number;
  sessionTimeout: number;
  passwordExpiryDays: number;
  trustNewDevices: boolean;
  allowMultipleSessions: boolean;
  ipRestrictions?: string[];
  enforceStrongPassword: boolean;
  passwordMinLength: number;
}

/**
 * Security dashboard data interface
 */
export interface SecurityDashboardData {
  date: Date;
  metrics: SecurityMetric[];
  activeAlerts: SecurityAlert[];
  recentEvents: SecurityEvent[];
  userSessions: number;
  failedLoginAttempts: number;
  mfaCompletionRate: number;
  securityScore: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
}

/**
 * Security event search parameters
 */
export interface SecurityEventSearchParams {
  userId?: string;
  types?: SecurityEventType[];
  severities?: SecurityEventSeverity[];
  startDate?: Date;
  endDate?: Date;
  resourceType?: string;
  resourceId?: string;
  status?: string;
  ipAddress?: string;
}

/**
 * Type guard to check if a value is a valid SecurityEvent
 */
export function isSecurityEvent(value: any): value is SecurityEvent {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.type === 'string' &&
    typeof value.severity === 'string' &&
    value.timestamp instanceof Date &&
    typeof value.status === 'string' &&
    typeof value.description === 'string'
  );
}

/**
 * Type assertion function to ensure a value is a SecurityEvent
 * @throws {Error} If the value is not a valid SecurityEvent
 */
export function assertSecurityEvent(value: any): asserts value is SecurityEvent {
  if (!isSecurityEvent(value)) {
    throw new Error('Value is not a valid SecurityEvent');
  }
}