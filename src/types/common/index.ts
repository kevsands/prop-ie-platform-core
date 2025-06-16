/**
 * Common Type Definitions
 * 
 * This file provides common type definitions used across multiple components
 * and modules in the application.
 */

export * from './status';
export * from './user';
export * from './response';
export * from './components';
export * from './configuration';
export * from './security-performance';

/**
 * Common error type
 */
export interface AppError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Error details */
  details?: any;
  /** Error stack (in development only) */
  stack?: string;
  /** HTTP status code */
  status?: number;
  /** Whether the error is retryable */
  retryable?: boolean;
}

/**
 * Generic ID type
 */
export type ID = string;

/**
 * Common metadata for all entities
 */
export interface EntityMetadata {
  /** When the entity was created */
  createdAt: string;
  /** When the entity was last updated */
  updatedAt: string;
  /** Who created the entity */
  createdBy?: string;
  /** Who last updated the entity */
  updatedBy?: string;
  /** Version number for optimistic concurrency */
  version?: number;
}

/**
 * Base entity interface that all model entities extend
 */
export interface BaseEntity extends EntityMetadata {
  /** Unique identifier */
  id: ID;
}

/**
 * Pagination parameters for list operations
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Pagination metadata for list responses
 */
export interface PaginationMetadata {
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there's a next page */
  hasNextPage: boolean;
  /** Whether there's a previous page */
  hasPreviousPage: boolean;
}

/**
 * Common sort directions
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Common application theme options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * User preference settings
 */
export interface UserPreferences {
  /** Theme mode preference */
  theme: ThemeMode;
  /** Whether to enable notifications */
  notificationsEnabled: boolean;
  /** Whether to enable email notifications */
  emailNotificationsEnabled: boolean;
  /** Notification frequency */
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
  /** Date format preference */
  dateFormat: 'US' | 'EU' | 'ISO';
  /** Time format preference */
  timeFormat: '12h' | '24h';
}

/**
 * Filter operator for queries
 */
export type FilterOperator = 
  | 'eq' // Equal
  | 'ne' // Not equal
  | 'gt' // Greater than
  | 'gte' // Greater than or equal
  | 'lt' // Less than
  | 'lte' // Less than or equal
  | 'contains' // Contains substring
  | 'notContains' // Does not contain substring
  | 'beginsWith' // Begins with
  | 'in' // In array
  | 'notIn' // Not in array
  | 'between' // Between values
  | 'exists' // Field exists
  | 'notExists'; // Field does not exist

/**
 * Generic filter condition
 */
export interface FilterCondition<T = any> {
  /** Field name to filter on */
  field: string;
  /** Operator to apply */
  operator: FilterOperator;
  /** Value to compare against */
  value: T;
}

/**
 * Generic filter group with AND/OR logic
 */
export interface FilterGroup {
  /** Logical operator for filter conditions */
  logic: 'AND' | 'OR';
  /** Filter conditions */
  conditions: Array<FilterCondition | FilterGroup>
  );
}

/**
 * Environment information
 */
export interface Environment {
  /** Current environment (developmentstagingproduction) */
  type: 'development' | 'staging' | 'production';
  /** Environment variables available to the client */
  variables: Record<string, string>
  );
  /** Current application version */
  version: string;
  /** Whether debug mode is enabled */
  debug: boolean;
}