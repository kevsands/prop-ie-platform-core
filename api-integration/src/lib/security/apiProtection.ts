/**
 * API Protection Suite
 * 
 * Provides comprehensive protection for API requests including:
 * - Rate limiting with configurable thresholds
 * - Request throttling for high-volume endpoints
 * - Progressive backoff for failed attempts
 * - Automatic retry with exponential backoff
 * - Request validation and sanitization
 * - CSRF protection middleware
 * - Integration with audit logging
 */

import { Auth } from '@/lib/amplify/auth';
import { AuditLogger, AuditCategory, AuditSeverity } from './auditLogger';
import { RateLimiter } from './rateLimit';
import { API as AmplifyAPI, ApiError } from '@/lib/amplify/api';
import { Hub } from 'aws-amplify/utils';

// Types
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiProtectionOptions {
  // Global options
  enableRateLimiting?: boolean;
  enableBackoff?: boolean;
  enableAuditLogging?: boolean;
  enableRequestValidation?: boolean;
  enableResponseValidation?: boolean;
  
  // Rate limiting options
  rateLimitCategory?: 'auth' | 'api' | 'mutation' | 'query' | 'default';
  customRateLimit?: {
    windowMs: number;
    maxRequests: number;
    blockDuration: number;
  };
  
  // Backoff options
  maxRetries?: number;
  initialBackoffMs?: number;
  maxBackoffMs?: number;
  backoffFactor?: number;
  
  // CSRF protection
  csrfProtection?: boolean;
  
  // Validation callbacks
  validateRequest?: (request: ApiRequest) => boolean | Promise<boolean>;
  validateResponse?: (response: any) => boolean | Promise<boolean>;
  
  // Callbacks
  onRateLimited?: (endpoint: string, retryAfter: number) => void;
  onRequestRejected?: (request: ApiRequest, reason: string) => void;
  onResponseRejected?: (response: any, reason: string) => void;
  onRetry?: (attempt: number, delay: number, error: Error) => void;
}

export interface ApiRequest {
  endpoint: string;
  method: ApiMethod;
  body?: any;
  headers?: Record<string, string>;
  queryParams?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  headers?: Record<string, string>;
}

// Default configuration
const DEFAULT_OPTIONS: ApiProtectionOptions = {
  enableRateLimiting: true,
  enableBackoff: true,
  enableAuditLogging: true,
  enableRequestValidation: true,
  enableResponseValidation: true,
  rateLimitCategory: 'default',
  maxRetries: 3,
  initialBackoffMs: 1000,
  maxBackoffMs: 30000,
  backoffFactor: 2,
  csrfProtection: true
};

/**
 * API Protection middleware
 */
export class ApiProtection {
  private static options: ApiProtectionOptions = DEFAULT_OPTIONS;
  private static rateLimitedEndpoints = new Set<string>();
  private static pendingRetries = new Map<string, { count: number, timeout: any }>();
  private static isInitialized = false;

  /**
   * Initialize API protection with custom options
   */
  static initialize(options?: Partial<ApiProtectionOptions>): void {
    if (this.isInitialized) return;
    
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Initialize rate limiter if needed
    if (this.options.enableRateLimiting) {
      RateLimiter.initialize();
    }
    
    // Set up Hub listener for auth events to clear rate limits on sign out
    Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signOut') {
        this.rateLimitedEndpoints.clear();
        // Cancel any pending retries
        this.pendingRetries.forEach(retry => {
          clearTimeout(retry.timeout);
        });
        this.pendingRetries.clear();
      }
    });
    
    this.isInitialized = true;
  }
  
  /**
   * Update API protection configuration
   * @param options Updated configuration options
   * @returns True if configuration was updated successfully
   */
  static updateConfig(options: Partial<ApiProtectionOptions>): boolean {
    try {
      this.options = { ...this.options, ...options };
      
      // Re-initialize rate limiter if necessary
      if (options.enableRateLimiting !== undefined && this.options.enableRateLimiting) {
        RateLimiter.initialize();
      }
      
      return true;
    } catch (error) {
      console.error('Error updating API protection configuration:', error);
      return false;
    }
  }
  
  /**
   * Apply protection to an API endpoint or request
   * @param endpoint The API endpoint to protect
   * @param options Protection options specific to this endpoint
   * @returns A middleware function that can be used to protect the endpoint
   */
  static protect(endpoint: string, options?: Partial<ApiProtectionOptions>): any {
    // Initialize if not already done
    if (!this.isInitialized) {
      this.initialize();
    }
    
    const endpointOptions = { ...this.options, ...options };
    
    // Return a middleware function that can be used to protect the endpoint
    return async (req: any, res: any, next?: Function) => {
      try {
        // Check rate limiting
        if (endpointOptions.enableRateLimiting) {
          const rateLimitCheck = RateLimiter.checkRateLimit(
            endpoint,
            endpointOptions.rateLimitCategory
          );
          
          if (!rateLimitCheck.allowed) {
            if (next) {
              // Express-style middleware
              return res.status(429).json({
                error: 'Rate limit exceeded',
                retryAfter: rateLimitCheck.retryAfter
              });
            } else {
              // Return object for use in other contexts
              return {
                allowed: false,
                error: 'Rate limit exceeded',
                retryAfter: rateLimitCheck.retryAfter
              };
            }
          }
        }
        
        // If this is Express-style middleware, call next
        if (next) {
          return next();
        }
        
        // Otherwise return success object
        return {
          allowed: true
        };
      } catch (error) {
        console.error(`Error in API protection for endpoint ${endpoint}:`, error);
        
        if (next) {
          // Express-style middleware
          return res.status(500).json({
            error: 'API protection error'
          });
        } else {
          // Return object for use in other contexts
          return {
            allowed: false,
            error: 'API protection error'
          };
        }
      }
    };
  }

  /**
   * Protected API request with all security features
   */
  static async request<T>(
    request: ApiRequest,
    options?: Partial<ApiProtectionOptions>
  ): Promise<ApiResponse<T>> {
    // Initialize if not already done
    if (!this.isInitialized) {
      this.initialize();
    }
    
    // Merge default options with request-specific options
    const requestOptions: ApiProtectionOptions = {
      ...this.options,
      ...options
    };
    
    const { endpoint, method, body, headers = {}, queryParams } = request;
    
    try {
      // Check rate limiting
      if (requestOptions.enableRateLimiting) {
        const rateLimitCheck = RateLimiter.checkRateLimit(
          endpoint,
          requestOptions.rateLimitCategory
        );
        
        if (!rateLimitCheck.allowed) {
          this.rateLimitedEndpoints.add(endpoint);
          
          // Log the rate limit violation
          if (requestOptions.enableAuditLogging) {
            await AuditLogger.logApi(
              'rate_limited',
              endpoint,
              method,
              'failure',
              `Rate limit exceeded for ${endpoint}`,
              { retryAfter: rateLimitCheck.retryAfter }
            );
          }
          
          // Call onRateLimited callback if provided
          if (requestOptions.onRateLimited && rateLimitCheck.retryAfter) {
            requestOptions.onRateLimited(endpoint, rateLimitCheck.retryAfter);
          }
          
          throw new ApiError(
            `Rate limit exceeded for ${endpoint}. Try again in ${rateLimitCheck.retryAfter} seconds.`,
            {
              statusCode: 429,
              path: endpoint,
              method
            }
          );
        }
      }
      
      // Validate request
      if (requestOptions.enableRequestValidation && requestOptions.validateRequest) {
        const isValid = await requestOptions.validateRequest(request);
        if (!isValid) {
          // Call onRequestRejected callback if provided
          if (requestOptions.onRequestRejected) {
            requestOptions.onRequestRejected(request, 'Request validation failed');
          }
          
          throw new ApiError('Request validation failed', {
            statusCode: 400,
            path: endpoint,
            method
          });
        }
      }
      
      // Add CSRF protection for state-changing methods
      const requestHeaders = { ...headers };
      if (requestOptions.csrfProtection && 
          (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH')) {
        // Get CSRF token from storage
        if (typeof window !== 'undefined') {
          const csrfToken = sessionStorage.getItem('csrf_token');
          if (csrfToken) {
            requestHeaders['X-CSRF-Token'] = csrfToken;
          }
        }
      }
      
      // Add auth token if available
      try {
        const token = await Auth.getAccessToken();
        if (token) {
          requestHeaders['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        // Silent fail - the underlying API will handle auth errors
      }
      
      // Track request start time for performance monitoring
      const startTime = Date.now();
      
      // Make the API request
      const response = await this.makeRequest<T>({
        endpoint,
        method,
        body,
        headers: requestHeaders,
        queryParams
      }, requestOptions, 0);
      
      // Track request duration
      const duration = Date.now() - startTime;
      
      // Validate response
      if (requestOptions.enableResponseValidation && 
          requestOptions.validateResponse && 
          response.data) {
        const isValid = await requestOptions.validateResponse(response.data);
        if (!isValid) {
          // Call onResponseRejected callback if provided
          if (requestOptions.onResponseRejected) {
            requestOptions.onResponseRejected(response.data, 'Response validation failed');
          }
          
          throw new ApiError('Response validation failed', {
            statusCode: 400,
            path: endpoint,
            method
          });
        }
      }
      
      // Log successful API request
      if (requestOptions.enableAuditLogging) {
        AuditLogger.logApi(
          'api_request',
          endpoint,
          method,
          'success',
          `API request to ${endpoint} completed successfully`,
          { 
            duration,
            statusCode: response.statusCode
          }
        );
      }
      
      return response;
    } catch (error) {
      // Handle and transform errors
      let statusCode = 500;
      let errorMessage = 'API request failed';
      
      if (error instanceof ApiError) {
        statusCode = error.statusCode || 500;
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Log failed API request
      if (requestOptions.enableAuditLogging) {
        AuditLogger.logApi(
          'api_request',
          endpoint,
          method,
          'failure',
          errorMessage,
          { 
            errorType: error instanceof Error ? error.constructor.name : 'Unknown',
          },
          statusCode.toString(),
          errorMessage
        );
      }
      
      throw error;
    }
  }

  /**
   * Make API request with retry capability
   */
  private static async makeRequest<T>(
    request: ApiRequest,
    options: ApiProtectionOptions,
    attempt: number
  ): Promise<ApiResponse<T>> {
    const { endpoint, method, body, headers = {}, queryParams } = request;
    
    try {
      // Create a unique key for this request for retry tracking
      const requestKey = `${method}:${endpoint}:${JSON.stringify(body || {})}`;
      
      let response: any;
      
      // Make the request based on the method
      switch (method) {
        case 'GET':
          response = await AmplifyAPI.get(endpoint, queryParams, { headers });
          break;
        case 'POST':
          response = await AmplifyAPI.post(endpoint, body, { 
            headers,
            queryParams
          });
          break;
        case 'PUT':
          response = await AmplifyAPI.put(endpoint, body, { 
            headers,
            queryParams
          });
          break;
        case 'DELETE':
          response = await AmplifyAPI.delete(endpoint, { 
            headers,
            queryParams
          });
          break;
        case 'PATCH':
          response = await AmplifyAPI.patch(endpoint, body, { 
            headers,
            queryParams
          });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      // Clear any pending retries for this request
      if (this.pendingRetries.has(requestKey)) {
        clearTimeout(this.pendingRetries.get(requestKey)?.timeout);
        this.pendingRetries.delete(requestKey);
      }
      
      // We don't have direct access to the status code from AmplifyAPI,
      // so we'll assume 200 for successful responses
      return {
        data: response,
        statusCode: 200
      };
    } catch (error) {
      // Check if we should retry
      const maxRetries = options.maxRetries || DEFAULT_OPTIONS.maxRetries || 0;
      
      if (options.enableBackoff && attempt < maxRetries) {
        // Check if error is retryable
        const isRetryable = this.isRetryableError(error);
        
        if (isRetryable) {
          // Calculate backoff delay
          const initialBackoff = options.initialBackoffMs || DEFAULT_OPTIONS.initialBackoffMs || 1000;
          const maxBackoff = options.maxBackoffMs || DEFAULT_OPTIONS.maxBackoffMs || 30000;
          const factor = options.backoffFactor || DEFAULT_OPTIONS.backoffFactor || 2;
          
          const delay = Math.min(initialBackoff * Math.pow(factor, attempt), maxBackoff);
          
          // Invoke retry callback if provided
          if (options.onRetry) {
            options.onRetry(attempt + 1, delay, error instanceof Error ? error : new Error(String(error)));
          }
          
          // Log retry attempt
          if (options.enableAuditLogging) {
            AuditLogger.logApi(
              'api_retry',
              endpoint,
              method,
              'warning',
              `Retrying API request to ${endpoint} (attempt ${attempt + 1}/${maxRetries})`,
              { 
                attempt: attempt + 1,
                delay,
                errorMessage: error instanceof Error ? error.message : String(error)
              }
            );
          }
          
          // Create a unique key for this request
          const requestKey = `${method}:${endpoint}:${JSON.stringify(body || {})}`;
          
          // Return a promise that resolves after the backoff delay
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              // Remove from pending retries
              this.pendingRetries.delete(requestKey);
              
              // Retry the request
              this.makeRequest<T>(request, options, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
            
            // Store the timeout so we can cancel it if needed
            this.pendingRetries.set(requestKey, {
              count: attempt + 1,
              timeout
            });
          });
        }
      }
      
      // Rethrow the error
      throw error;
    }
  }

  /**
   * Determine if an error is retryable
   */
  private static isRetryableError(error: any): boolean {
    // Network errors and server errors (5xx) are generally retryable
    
    // Check if it's an ApiError with a status code
    if (error instanceof ApiError && error.statusCode) {
      // Only retry server errors (5xx)
      return error.statusCode >= 500 && error.statusCode < 600;
    }
    
    // Check for network errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    const networkErrorMessages = [
      'network error',
      'failed to fetch',
      'network request failed',
      'connection refused',
      'timeout',
      'socket hang up',
      'ECONNREFUSED',
      'ECONNRESET',
      'ETIMEDOUT'
    ];
    
    return networkErrorMessages.some(msg => errorMessage.toLowerCase().includes(msg.toLowerCase()));
  }

  /**
   * Clear rate limits for an endpoint
   */
  static clearRateLimit(endpoint: string): void {
    this.rateLimitedEndpoints.delete(endpoint);
    RateLimiter.reset();
  }
  
  /**
   * Reset API protection state
   * This is primarily used for testing
   */
  static reset(): void {
    this.rateLimitedEndpoints.clear();
    this.pendingRetries.forEach(retry => {
      clearTimeout(retry.timeout);
    });
    this.pendingRetries.clear();
    RateLimiter.reset();
    this.isInitialized = false;
  }

  /**
   * Create middleware for API client
   */
  static createMiddleware(options?: Partial<ApiProtectionOptions>) {
    // Initialize if not already done
    if (!this.isInitialized) {
      this.initialize(options);
    }
    
    return {
      beforeRequest: async (request: ApiRequest) => {
        // Implement pre-request checks here
        // This could include validation, rate limiting, etc.
        
        // Check rate limiting
        if (this.options.enableRateLimiting) {
          const rateLimitCheck = RateLimiter.checkRateLimit(
            request.endpoint,
            this.options.rateLimitCategory
          );
          
          if (!rateLimitCheck.allowed) {
            throw new ApiError(
              `Rate limit exceeded. Try again in ${rateLimitCheck.retryAfter} seconds.`,
              {
                statusCode: 429,
                path: request.endpoint,
                method: request.method
              }
            );
          }
        }
        
        return request;
      },
      
      afterResponse: async (response: any) => {
        // Implement post-response processing here
        return response;
      },
      
      onError: async (error: any) => {
        // Implement error handling here
        throw error;
      }
    };
  }
  
  /**
   * Create a protected API client that wraps the standard API client
   */
  static createProtectedApiClient(options?: Partial<ApiProtectionOptions>) {
    // Initialize if not already done
    if (!this.isInitialized) {
      this.initialize(options);
    }
    
    return {
      get: async <T>(endpoint: string, queryParams?: Record<string, any>, requestOptions?: Partial<ApiProtectionOptions>) => {
        return this.request<T>(
          { endpoint, method: 'GET', queryParams },
          { ...this.options, ...options, ...requestOptions }
        ).then(response => response.data);
      },
      
      post: async <T>(endpoint: string, body?: any, requestOptions?: Partial<ApiProtectionOptions>) => {
        return this.request<T>(
          { endpoint, method: 'POST', body },
          { ...this.options, ...options, ...requestOptions }
        ).then(response => response.data);
      },
      
      put: async <T>(endpoint: string, body?: any, requestOptions?: Partial<ApiProtectionOptions>) => {
        return this.request<T>(
          { endpoint, method: 'PUT', body },
          { ...this.options, ...options, ...requestOptions }
        ).then(response => response.data);
      },
      
      delete: async <T>(endpoint: string, requestOptions?: Partial<ApiProtectionOptions>) => {
        return this.request<T>(
          { endpoint, method: 'DELETE' },
          { ...this.options, ...options, ...requestOptions }
        ).then(response => response.data);
      },
      
      patch: async <T>(endpoint: string, body?: any, requestOptions?: Partial<ApiProtectionOptions>) => {
        return this.request<T>(
          { endpoint, method: 'PATCH', body },
          { ...this.options, ...options, ...requestOptions }
        ).then(response => response.data);
      },
      
      graphql: async <T>(
        query: string, 
        variables?: Record<string, any>, 
        requestOptions?: Partial<ApiProtectionOptions>
      ) => {
        // For GraphQL, we'll use a standardized endpoint
        return this.request<T>(
          { 
            endpoint: '/graphql', 
            method: 'POST', 
            body: { query, variables } 
          },
          { ...this.options, ...options, ...requestOptions }
        ).then(response => response.data);
      }
    };
  }
}

// Export a pre-initialized instance of the protected API client
export const protectedApi = ApiProtection.createProtectedApiClient();