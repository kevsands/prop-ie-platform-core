/**
 * Response Type Definitions
 * 
 * This file defines API response-related types that are used across the application.
 */

import { AppError, PaginationMetadata } from './index';

/**
 * Basic API response interface
 */
export interface ApiResponse<T = any> {
  /** Success flag */
  success: boolean;
  /** Response data */
  data?: T;
  /** Error information if success is false */
  error?: AppError;
  /** Message for the response */
  message?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  /** Pagination metadata */
  pagination: PaginationMetadata;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult<T = any> {
  /** Success flag */
  success: boolean;
  /** Number of successful operations */
  successCount: number;
  /** Number of failed operations */
  failureCount: number;
  /** Results for each operation */
  results: Array<{
    /** Success flag for this operation */
    success: boolean;
    /** Item ID */
    id: string;
    /** Result data */
    data?: T;
    /** Error information if success is false */
    error?: AppError;
  }>
  );
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  /** Uploaded file ID */
  fileId: string;
  /** Original file name */
  fileName: string;
  /** File size in bytes */
  size: number;
  /** File mime type */
  mimeType: string;
  /** File URL */
  url: string;
  /** File path in storage */
  path: string;
  /** Upload timestamp */
  uploadedAt: string;
  /** File metadata */
  metadata?: Record<string, any>
  );
}

/**
 * Status update response
 */
export interface StatusUpdateResponse<T = string> {
  /** Previous status */
  previousStatus: T;
  /** New status */
  newStatus: T;
  /** Update timestamp */
  updatedAt: string;
  /** Who performed the update */
  updatedBy?: string;
}

/**
 * Search result response
 */
export interface SearchResponse<T = any> extends PaginatedApiResponse<T> {
  /** Search query that was executed */
  query: string;
  /** Filters that were applied */
  filters?: Record<string, any>
  );
  /** Total time taken for the search in ms */
  timeTaken?: number;
  /** Suggested queries if any */
  suggestions?: string[];
  /** Whether there are more results available */
  hasMore: boolean;
}

/**
 * Analytics response
 */
export interface AnalyticsResponse<T = any> {
  /** Success flag */
  success: boolean;
  /** Time period for the analytics */
  period: {
    /** Start date */
    from: string;
    /** End date */
    to: string;
  };
  /** Data points */
  data: T[];
  /** Any aggregations or summaries */
  aggregations?: Record<string, any>
  );
  /** Previous period comparison */
  previousPeriod?: {
    /** Change percentage */
    changePercentage: number;
    /** Change direction */
    direction: 'up' | 'down' | 'same';
    /** Data points from previous period */
    data?: T[];
  };
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse extends ApiResponse {
  /** Validation errors */
  validationErrors: Array<{
    /** Field path that has an error */
    field: string;
    /** Error message */
    message: string;
    /** Error code */
    code?: string;
    /** Value that was rejected */
    value?: any;
  }>
  );
}

/**
 * Authentication response
 */
export interface AuthResponse {
  /** Success flag */
  success: boolean;
  /** User ID */
  userId?: string;
  /** Authentication token (JWT) */
  token?: string;
  /** Refresh token */
  refreshToken?: string;
  /** Token expiration time */
  expiresAt?: string;
  /** User information */
  user?: any;
  /** Required next step if any */
  nextStep?: 'MFA_REQUIRED' | 'NEW_PASSWORD_REQUIRED' | 'EMAIL_VERIFICATION_REQUIRED' | 'COMPLETE_PROFILE';
  /** Challenge details if nextStep is set */
  challengeDetails?: any;
  /** Error information if success is false */
  error?: AppError;
}

/**
 * Streaming response chunk
 */
export interface StreamChunk<T = any> {
  /** Chunk ID */
  id: string;
  /** Chunk sequence number */
  sequence: number;
  /** Chunk data */
  data: T;
  /** Whether this is the last chunk */
  done: boolean;
  /** Error information if there was an error */
  error?: AppError;
}

/**
 * Export response
 */
export interface ExportResponse {
  /** Export job ID */
  jobId: string;
  /** Export file format */
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  /** Status of the export */
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  /** URL to download the file (only available when status is COMPLETED) */
  downloadUrl?: string;
  /** Export file name */
  fileName?: string;
  /** Number of records exported */
  recordCount?: number;
  /** Export creation time */
  createdAt: string;
  /** Export completion time */
  completedAt?: string;
  /** Size of the export file in bytes */
  fileSize?: number;
  /** Error information if status is FAILED */
  error?: AppError;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  /** Status of the service */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Uptime in seconds */
  uptime: number;
  /** Server time */
  serverTime: string;
  /** Version of the API */
  version: string;
  /** Environment */
  environment: 'development' | 'staging' | 'production';
  /** Dependencies status */
  dependencies: Record<string, {
    /** Status of this dependency */
    status: 'up' | 'down' | 'degraded';
    /** Response time in ms */
    responseTime?: number;
    /** Last checked time */
    lastChecked: string;
    /** Error message if status is down or degraded */
    message?: string;
  }>
  );
}

/**
 * Action confirmation response
 */
export interface ConfirmationResponse {
  /** Success flag */
  success: boolean;
  /** Confirmation message */
  message: string;
  /** Confirmation code (for reference) */
  confirmationCode?: string;
  /** Timestamp */
  timestamp: string;
  /** Details about the action */
  details?: Record<string, any>
  );
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  /** Error status code */
  statusCode: number;
  /** Error message */
  message: string;
  /** Error code */
  errorCode?: string;
  /** Request ID for troubleshooting */
  requestId?: string;
  /** More detailed error information */
  details?: Record<string, any>
  );
  /** Stack trace (only in development) */
  stack?: string;
  /** Timestamp when the error occurred */
  timestamp: string;
  /** Path that caused the error */
  path?: string;
}