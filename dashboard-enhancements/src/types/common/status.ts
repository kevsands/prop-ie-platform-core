/**
 * Status Type Definitions
 * 
 * This file defines status-related types that are used across the application.
 */

/**
 * Application-wide status types for various entities
 */

/**
 * Generic status values for application entities
 */
export type GenericStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING'
  | 'ARCHIVED'
  | 'DELETED';

/**
 * User status values
 */
export type UserStatus = 
  | 'ACTIVE'
  | 'PENDING'
  | 'SUSPENDED'
  | 'INACTIVE'
  | 'UNCONFIRMED';

/**
 * Property/Development status values
 */
export type PropertyStatus = 
  | 'AVAILABLE'
  | 'RESERVED'
  | 'SOLD'
  | 'PENDING'
  | 'UNDER_CONSTRUCTION'
  | 'PRE_LAUNCH';

/**
 * Document status values
 */
export type DocumentStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED';

/**
 * Payment status values
 */
export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

/**
 * Booking status values
 */
export type BookingStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

/**
 * Process status values
 */
export type ProcessStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'ON_HOLD';

/**
 * Approval status values
 */
export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REQUIRES_CHANGES';

/**
 * Help to Buy claim status values
 */
export type HTBClaimStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FUNDS_RECEIVED'
  | 'COMPLETED'
  | 'EXPIRED';

/**
 * Priority levels for various entities
 */
export type PriorityLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT'
  | 'CRITICAL';

/**
 * Status color mapping for UI representation
 */
export interface StatusColorMapping {
  /** The status value */
  status: string;
  /** Tailwind CSS color class */
  color: string;
  /** Background color class */
  bgColor: string;
  /** Text color class */
  textColor: string;
  /** Border color class */
  borderColor: string;
  /** Icon to display with the status */
  icon?: string;
}

/**
 * Status with additional context data
 */
export interface StatusWithContext<T = string> {
  /** The status value */
  value: T;
  /** Display label for the status */
  label: string;
  /** Color information for UI rendering */
  color: {
    /** Primary color */
    primary: string;
    /** Background color */
    background: string;
    /** Text color */
    text: string;
  };
  /** Timestamp when the status was set */
  timestamp?: string;
  /** User who set the status */
  updatedBy?: string;
  /** Additional context or reason for the status */
  reason?: string;
}