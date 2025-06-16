/**
 * API Response Types
 * 
 * This file defines standardized response types used in API calls
 * throughout the application.
 */

import { PaginatedResponse, ValidationError } from '../utils';

/**
 * Base API response interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiErrorResponse;
  message?: string;
  timestamp: string | number;
  requestId?: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: string;
  validationErrors?: ValidationError[];
  stackTrace?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedResponse<T>> {}

/**
 * Generic list response
 */
export interface ListResponse<T> {
  items: T[];
  count: number;
}

/**
 * Authentication response
 */
export interface AuthResponse extends ApiResponse {
  data?: {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresIn: number;
    tokenType: string;
    userId: string;
    issuedAt: number;
    mfaRequired?: boolean;
    mfaSession?: string;
  };
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse extends ApiResponse {
  data?: {
    accessToken: string;
    idToken: string;
    expiresIn: number;
    tokenType: string;
    issuedAt: number;
  };
}

/**
 * MFA challenge response
 */
export interface MfaChallengeResponse extends ApiResponse {
  data?: {
    session: string;
    availableMethods: string[];
    deliveryDetails?: string;
    expiration: number;
  };
}

/**
 * GraphQL response
 */
export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: Record<string, any>
  );
}

/**
 * GraphQL error
 */
export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>
  );
  path?: string[];
  extensions?: Record<string, any>
  );
}

/**
 * File upload response
 */
export interface FileUploadResponse extends ApiResponse {
  data?: {
    key: string;
    url: string;
    contentType: string;
    size: number;
    etag?: string;
    versionId?: string;
    metadata?: Record<string, any>
  );
  };
}

/**
 * Health check response
 */
export interface HealthCheckResponse extends ApiResponse {
  data?: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    uptime: number;
    environment: string;
    services: Record<string, {
      status: 'up' | 'down' | 'degraded';
      latency?: number;
      message?: string;
    }>
  );
  };
}

/**
 * Webhook delivery response
 */
export interface WebhookDeliveryResponse extends ApiResponse {
  data?: {
    id: string;
    webhookId: string;
    event: string;
    url: string;
    requestHeaders: Record<string, string>
  );
    requestBody: string;
    responseStatus: number;
    responseHeaders?: Record<string, string>
  );
    responseBody?: string;
    duration: number;
    success: boolean;
    timestamp: string;
    attempts: number;
    nextRetry?: string;
  };
}

/**
 * API key response
 */
export interface ApiKeyResponse extends ApiResponse {
  data?: {
    id: string;
    key: string;
    name: string;
    permissions: string[];
    createdAt: string;
    expiresAt?: string;
    lastUsed?: string;
  };
}

/**
 * Batch operation response
 */
export interface BatchOperationResponse<T> extends ApiResponse {
  data?: {
    results: Array<{
      success: boolean;
      data?: T;
      error?: ApiErrorResponse;
      index: number;
    }>
  );
    summary: {
      total: number;
      succeeded: number;
      failed: number;
    };
  };
}

/**
 * Search response
 */
export interface SearchResponse<T> extends ApiResponse {
  data?: {
    hits: {
      total: number;
      items: T[];
    };
    facets?: Record<string, Array<{
      value: string;
      count: number;
    }>>
  );
    meta: {
      took: number;
      query: string;
    };
  };
}