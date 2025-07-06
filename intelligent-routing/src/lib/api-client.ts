/**
 * Unified API Client
 * 
 * This provides a standardized way to interact with both REST APIs and Amplify APIs.
 * - Uses our dedicated Amplify modules for authentication and API requests
 * - Includes automatic token refresh and caching
 * - Provides consistent error handling with useful debugging information
 * - Includes CSRF protection for non-GET requests
 */

import { API as AmplifyAPI, ApiError as AmplifyApiError } from '@/lib/amplify/api';
import { Auth } from '@/lib/amplify/auth';
import { ensureAmplifyInitialized } from '@/lib/amplify/index';

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.prop-ie.com';
const API_NAME = 'PropAPI';

/**
 * API error class for structured error handling
 */
export class ApiError extends Error {
  statusCode: number;
  errorType: string;
  errorData?: any;
  path?: string;
  method?: string;

  constructor(
    message: string, 
    statusCode = 500, 
    errorType = 'ApiError', 
    errorData?: any,
    path?: string,
    method?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.errorData = errorData;
    this.path = path;
    this.method = method;
  }
}

/**
 * Request options for the API client
 */
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
  searchParams?: Record<string, any>;
  parseResponse?: boolean; // Whether to parse the response as JSON
  cacheOptions?: {
    ttl?: number;
    disableCache?: boolean;
  };
}

/**
 * Gets the current CSRF token from session storage
 */
function getCSRFToken(): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const token = sessionStorage.getItem('csrf_token');
    const expiry = sessionStorage.getItem('csrf_token_expiry');
    
    if (token && expiry && parseInt(expiry) > Date.now()) {
      return token;
    }
  } catch (error) {
    console.error('Error retrieving CSRF token:', error);
  }
  
  return '';
}

/**
 * Core API request function using our Amplify API module
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  // Ensure Amplify is initialized
  ensureAmplifyInitialized();
  
  const { 
    method = "GET", 
    body, 
    requiresAuth = true, 
    searchParams = {},
    headers = {},
    cacheOptions
  } = options;
  
  // Prepare headers with CSRF protection for non-GET requests
  const requestHeaders = { ...headers };
  
  // Add CSRF token for mutations
  const isStateChangingMethod = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
  if (isStateChangingMethod && typeof window !== 'undefined') {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      requestHeaders['X-CSRF-Token'] = csrfToken;
    }
  }

  try {
    // Use the underlying Amplify API module
    switch (method) {
      case 'GET':
        return await AmplifyAPI.get<T>(
          endpoint, 
          searchParams as Record<string, any>, 
          { 
            headers: requestHeaders,
            cacheOptions
          }
        );
        
      case 'POST':
        return await AmplifyAPI.post<T>(
          endpoint, 
          body, 
          { 
            headers: requestHeaders,
            queryParams: searchParams,
            cacheOptions
          }
        );
        
      case 'PUT':
        return await AmplifyAPI.put<T>(
          endpoint, 
          body, 
          { 
            headers: requestHeaders,
            queryParams: searchParams,
            cacheOptions
          }
        );
        
      case 'DELETE':
        return await AmplifyAPI.delete<T>(
          endpoint, 
          { 
            headers: requestHeaders,
            queryParams: searchParams,
            cacheOptions
          }
        );
        
      case 'PATCH':
        return await AmplifyAPI.patch<T>(
          endpoint, 
          body, 
          { 
            headers: requestHeaders,
            queryParams: searchParams,
            cacheOptions
          }
        );
        
      default:
        throw new ApiError(`Unsupported method: ${method}`, 400, 'InvalidMethod');
    }
  } catch (error) {
    // Convert AmplifyApiError to our ApiError format
    if (error instanceof AmplifyApiError) {
      throw new ApiError(
        error.message,
        error.statusCode || 500,
        'ApiError',
        error.originalError,
        error.path,
        error.method
      );
    }
    
    // Handle CSRF errors specially
    if (error instanceof Error && 
        error.message.includes('CSRF') && 
        isStateChangingMethod) {
      // Report security incident
      try {
        api.post('/api/security/report', {
          violation: {
            type: 'csrf',
            severity: 'high',
            description: 'CSRF validation failed',
            timestamp: Date.now(),
            url: typeof window !== 'undefined' ? window.location.href : '',
            endpoint
          }
        }, { requiresAuth: false }).catch(() => {});
      } catch (reportError) {
        // Silent fail for security reporting
      }
      
      throw new ApiError(
        'CSRF validation failed',
        403,
        'CSRFError',
        { originalError: error },
        endpoint,
        method
      );
    }
    
    // Handle other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown API error',
      500,
      'UnknownApiError',
      { originalError: error },
      endpoint,
      method
    );
  }
}

/**
 * Main API client object with method-specific functions
 */
export const api = {
  get: <T>(endpoint: string, options?: Partial<RequestOptions>) =>
    apiRequest<T>(endpoint, { method: "GET", ...options }),
  
  post: <T>(endpoint: string, body: any, options?: Partial<RequestOptions>) =>
    apiRequest<T>(endpoint, { method: "POST", body, ...options }),
  
  put: <T>(endpoint: string, body: any, options?: Partial<RequestOptions>) =>
    apiRequest<T>(endpoint, { method: "PUT", body, ...options }),
  
  delete: <T>(endpoint: string, options?: Partial<RequestOptions>) =>
    apiRequest<T>(endpoint, { method: "DELETE", ...options }),
  
  patch: <T>(endpoint: string, body: any, options?: Partial<RequestOptions>) =>
    apiRequest<T>(endpoint, { method: "PATCH", body, ...options }),

  // GraphQL query using Amplify API
  graphql: async <T>(
    query: string, 
    variables?: Record<string, any>, 
    options?: { 
      authMode?: 'apiKey' | 'userPool' | 'iam',
      cacheOptions?: {
        ttl?: number;
        disableCache?: boolean;
      }
    }
  ) => {
    try {
      return await AmplifyAPI.graphql<T>({
        query,
        variables,
        authMode: options?.authMode || 'userPool',
        cacheOptions: options?.cacheOptions
      });
    } catch (error) {
      if (error instanceof AmplifyApiError) {
        throw new ApiError(
          error.message,
          error.statusCode || 400,
          'GraphQLError',
          error.originalError
        );
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'GraphQL query failed',
        400,
        'GraphQLError',
        { originalError: error }
      );
    }
  },
  
  /**
   * Clear the API cache
   */
  clearCache: (pattern?: string) => {
    AmplifyAPI.clearCache(pattern);
  },
  
  /**
   * Configure API caching behavior
   */
  configureCaching: (options: { enabled: boolean }) => {
    AmplifyAPI.configureCaching(options);
  }
};

/**
 * Compatibility layer for code that expects apiClient
 */
export const apiClient = {
  get: <T>(endpoint: string, config?: any) => api.get<T>(endpoint, config),
  post: <T>(endpoint: string, data?: any, config?: any) => api.post<T>(endpoint, data, config),
  put: <T>(endpoint: string, data?: any, config?: any) => api.put<T>(endpoint, data, config),
  delete: <T>(endpoint: string, config?: any) => api.delete<T>(endpoint, config),
  patch: <T>(endpoint: string, data?: any, config?: any) => api.patch<T>(endpoint, data, config),
  graphql: <T>(query: string, variables?: any, config?: any) => api.graphql<T>(query, variables, config),
};

// Export a monitored version of the API if performance monitoring is enabled
let exportedApi = api;

// Performance monitoring will be lazy-loaded to avoid circular dependencies
// This function will be called the first time the monitored API is used
const getMonitoredApi = async () => {
  try {
    // Dynamically import to avoid circular dependencies
    if (process.env.NODE_ENV === 'production') {
      const { monitoredApi } = await import('./monitoring/apiPerformance');
      return monitoredApi;
    }
  } catch (error) {
    console.error('Failed to initialize API performance monitoring:', error);
  }
  return api;
};

// Initialize monitoring in production
if (process.env.NODE_ENV === 'production') {
  getMonitoredApi().then(result => {
    exportedApi = result;
  }).catch(console.error);
}

export default exportedApi;