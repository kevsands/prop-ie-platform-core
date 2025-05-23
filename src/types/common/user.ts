/**
 * User Type Definitions
 * 
 * This file defines user-related types that are used across the application.
 */

import { BaseEntity, ID } from './index';
import { UserStatus } from './status';

/**
 * User roles in the application
 */
export type UserRole = 
  | 'ADMIN'
  | 'DEVELOPER'
  | 'BUYER'
  | 'SOLICITOR'
  | 'AGENT'
  | 'CONTRACTOR'
  | 'INVESTOR'
  | 'STAFF';

/**
 * User permissions in the application
 * These are granular permissions that can be assigned to roles
 */
export type Permission =
  | 'CREATE_USER'
  | 'READ_USER'
  | 'UPDATE_USER'
  | 'DELETE_USER'
  | 'MANAGE_USERS'
  | 'CREATE_PROPERTY'
  | 'READ_PROPERTY'
  | 'UPDATE_PROPERTY'
  | 'DELETE_PROPERTY'
  | 'MANAGE_PROPERTIES'
  | 'CREATE_DOCUMENT'
  | 'READ_DOCUMENT'
  | 'UPDATE_DOCUMENT'
  | 'DELETE_DOCUMENT'
  | 'MANAGE_DOCUMENTS'
  | 'CREATE_PROJECT'
  | 'READ_PROJECT'
  | 'UPDATE_PROJECT'
  | 'DELETE_PROJECT'
  | 'MANAGE_PROJECTS'
  | 'CREATE_CUSTOMIZATION'
  | 'READ_CUSTOMIZATION'
  | 'UPDATE_CUSTOMIZATION'
  | 'DELETE_CUSTOMIZATION'
  | 'MANAGE_CUSTOMIZATIONS'
  | 'ACCESS_FINANCIAL_DATA'
  | 'PROCESS_HTB_CLAIMS'
  | 'VIEW_ANALYTICS'
  | 'ACCESS_ADMIN_PANEL'
  | 'MANAGE_SECURITY_SETTINGS';

/**
 * Base User interface
 */
export interface User extends BaseEntity {
  /** User's email address */
  email: string;
  /** User's display name */
  name: string;
  /** User's username/login */
  username?: string;
  /** User's first name */
  firstName?: string;
  /** User's last name */
  lastName?: string;
  /** User's status */
  status: UserStatus;
  /** User's profile picture URL */
  avatar?: string;
  /** User's role */
  role: UserRole;
  /** User's permissions */
  permissions?: Permission[];
  /** Whether the user has completed onboarding */
  onboardingComplete: boolean;
  /** Date when the user was last active */
  lastActive?: string;
  /** Whether the user has MFA enabled */
  mfaEnabled: boolean;
  /** Whether the user's email is verified */
  emailVerified: boolean;
  /** User's preferred communication method */
  preferredCommunication?: 'email' | 'sms' | 'push';
  /** User's phone number */
  phoneNumber?: string;
  /** Whether the user's phone is verified */
  phoneVerified?: boolean;
  /** AWS Cognito-specific attributes */
  cognitoAttributes?: Record<string, any>\n  );
}

/**
 * Buyer-specific user information
 */
export interface BuyerProfile extends BaseEntity {
  /** Reference to the user ID */
  userId: ID;
  /** Buyer's full address */
  address?: string;
  /** Buyer's date of birth */
  dateOfBirth?: string;
  /** Buyer's occupation */
  occupation?: string;
  /** Whether the buyer has completed KYC verification */
  kycVerified: boolean;
  /** Buyer's property preferences */
  preferences?: {
    /** Preferred property types */
    propertyTypes?: string[];
    /** Preferred number of bedrooms */
    bedrooms?: number[];
    /** Preferred price range */
    priceRange?: {
      min: number;
      max: number;
    };
    /** Preferred locations */
    locations?: string[];
    /** Other preferences */
    other?: string;
  };
  /** Properties the buyer has favorited */
  favorites?: ID[];
  /** Properties the buyer has viewed */
  recentViews?: ID[];
  /** Buyer's current purchase stage */
  purchaseStage?: 'BROWSING' | 'VIEWING' | 'RESERVED' | 'PURCHASING' | 'COMPLETED';
}

/**
 * Developer-specific user information
 */
export interface DeveloperProfile extends BaseEntity {
  /** Reference to the user ID */
  userId: ID;
  /** Developer's company name */
  companyName: string;
  /** Developer's company registration number */
  registrationNumber?: string;
  /** Developer's company VAT number */
  vatNumber?: string;
  /** Developer's company website */
  website?: string;
  /** Developer's company logo URL */
  logo?: string;
  /** Developer's company address */
  address?: string;
  /** Developer's company phone number */
  companyPhone?: string;
  /** Whether the developer's account is verified */
  verified: boolean;
  /** Developer's bank account details */
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    sortCode: string;
    accountName: string;
  };
  /** Developer's subscription plan */
  subscriptionPlan?: string;
  /** Developer's subscription status */
  subscriptionStatus?: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
  /** Developer's subscription expiry date */
  subscriptionExpiry?: string;
}

/**
 * Solicitor-specific user information
 */
export interface SolicitorProfile extends BaseEntity {
  /** Reference to the user ID */
  userId: ID;
  /** Solicitor's firm name */
  firmName: string;
  /** Solicitor's registration number */
  registrationNumber?: string;
  /** Solicitor's firm address */
  address?: string;
  /** Solicitor's firm phone number */
  firmPhone?: string;
  /** Solicitor's specializations */
  specializations?: string[];
  /** Solicitor's professional qualifications */
  qualifications?: string[];
  /** Whether the solicitor is available for new cases */
  availableForNewCases: boolean;
}

/**
 * Agent-specific user information
 */
export interface AgentProfile extends BaseEntity {
  /** Reference to the user ID */
  userId: ID;
  /** Agent's agency name */
  agencyName: string;
  /** Agent's license number */
  licenseNumber?: string;
  /** Agent's agency address */
  address?: string;
  /** Agent's agency phone number */
  agencyPhone?: string;
  /** Agent's years of experience */
  yearsOfExperience?: number;
  /** Agent's specializations */
  specializations?: string[];
  /** Whether the agent is available for viewings */
  availableForViewings: boolean;
}

/**
 * Authentication credentials for login
 */
export interface AuthCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Remember user flag */
  rememberMe?: boolean;
}

/**
 * MFA challenge response
 */
export interface MFAChallenge {
  /** Challenge type */
  challengeType: 'SMS' | 'TOTP' | 'EMAIL';
  /** Challenge session ID */
  sessionId: string;
  /** Destination (partially masked phone/email) */
  destination?: string;
  /** Challenge expiry time */
  expiresAt?: string;
}

/**
 * MFA verification data
 */
export interface MFAVerification {
  /** Challenge session ID */
  sessionId: string;
  /** Verification code */
  code: string;
}

/**
 * Device information for trusted devices feature
 */
export interface TrustedDevice {
  /** Device ID */
  id: ID;
  /** Device name */
  name: string;
  /** Device type */
  type: 'MOBILE' | 'TABLET' | 'DESKTOP' | 'OTHER';
  /** Operating system */
  os: string;
  /** Browser */
  browser: string;
  /** IP address last used */
  ipAddress: string;
  /** Last used date */
  lastUsed: string;
  /** Whether the device is currently being used */
  current: boolean;
  /** Whether the device is trusted */
  trusted: boolean;
  /** Device fingerprint */
  fingerprint: string;
}

/**
 * User session information
 */
export interface UserSession {
  /** Session ID */
  id: ID;
  /** User ID */
  userId: ID;
  /** Created at timestamp */
  createdAt: string;
  /** Expires at timestamp */
  expiresAt: string;
  /** Last active timestamp */
  lastActive?: string;
  /** Device information */
  device?: Partial<TrustedDevice>\n  );
  /** IP address */
  ipAddress?: string;
  /** Location information */
  location?: {
    city?: string;
    country?: string;
    countryCode?: string;
  };
  /** Whether the session is valid */
  valid: boolean;
  /** Refresh token (only included in initial auth response) */
  refreshToken?: string;
}

/**
 * User security audit event
 */
export interface SecurityAuditEvent {
  /** Event ID */
  id: ID;
  /** User ID */
  userId: ID;
  /** Event type */
  eventType: 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'MFA_ENABLED' | 'MFA_DISABLED' | 'ACCOUNT_UPDATE' | 'PERMISSION_CHANGE' | 'SUSPICIOUS_ACTIVITY';
  /** Event timestamp */
  timestamp: string;
  /** IP address */
  ipAddress?: string;
  /** Device information */
  device?: Partial<TrustedDevice>\n  );
  /** Event details */
  details?: Record<string, any>\n  );
  /** Risk level */
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  /** Whether the event requires attention */
  requiresAttention?: boolean;
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  /** Email notification settings */
  email: {
    /** General notifications */
    general: boolean;
    /** Marketing notifications */
    marketing: boolean;
    /** Security notifications */
    security: boolean;
    /** Transaction notifications */
    transactions: boolean;
    /** Document notifications */
    documents: boolean;
  };
  /** Push notification settings */
  push: {
    /** General notifications */
    general: boolean;
    /** Security notifications */
    security: boolean;
    /** Transaction notifications */
    transactions: boolean;
    /** Document notifications */
    documents: boolean;
  };
  /** SMS notification settings */
  sms: {
    /** General notifications */
    general: boolean;
    /** Security notifications */
    security: boolean;
    /** Transaction notifications */
    transactions: boolean;
  };
  /** Notification frequency */
  frequency: 'IMMEDIATELY' | 'DAILY' | 'WEEKLY';
}

/**
 * User account action logs
 */
export interface UserActionLog {
  /** Log ID */
  id: ID;
  /** User ID */
  userId: ID;
  /** Action type */
  actionType: string;
  /** Action details */
  details?: Record<string, any>\n  );
  /** Timestamp */
  timestamp: string;
  /** IP address */
  ipAddress?: string;
  /** User agent */
  userAgent?: string;
}