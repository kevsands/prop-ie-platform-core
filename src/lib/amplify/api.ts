/**
 * AWS Amplify API Module
 * 
 * This module provides a standardized interface for making GraphQL and REST API requests
 * using AWS Amplify's API client. Compatible with Amplify v6 and includes improved error
 * handling, request/response interceptors, and automatic token refresh.
 */

import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { ensureAmplifyInitialized } from './index';
import { Auth } from './auth';
import { createClientCache } from './cache';

/**
 * GraphQL operation options
 */
interface GraphQLOptions {
  query: string;
  variables?: Record<string, any>;
  operationName?: string | null;
  authMode?: 'apiKey' | 'userPool' | 'iam';
  cacheOptions?: {
    ttl?: number;
    disableCache?: boolean;
  };
}

/**
 * REST API request options
 */
interface RestOptions {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
  cacheOptions?: {
    ttl?: number;
    disableCache?: boolean;
  };
}

/**
 * API error with enhanced information
 */
export class ApiError extends Error {
  path?: string;
  method?: string;
  statusCode?: number;
  originalError?: any;
  cached?: boolean;
  cacheStatus?: 'hit' | 'miss' | 'bypass';

  constructor(message: string, options?: {
    path?: string;
    method?: string;
    statusCode?: number;
    originalError?: any;
    cached?: boolean;
    cacheStatus?: 'hit' | 'miss' | 'bypass';
  }) {
    super(message);
    this.name = 'ApiError';
    this.path = options?.path;
    this.method = options?.method;
    this.statusCode = options?.statusCode;
    this.originalError = options?.originalError;
    this.cached = options?.cached;
    this.cacheStatus = options?.cacheStatus;
  }
}

/**
 * API service for handling GraphQL and REST requests
 */
export class API {
  private static client: ReturnType<typeof generateClient> | null = null;
  private static cacheEnabled = true;

  // Cache for frequently executed queries
  private static queryCache = createClientCache(
    async (cacheKey: string, queryFn: () => Promise<any>, ttl = 60000) => {
      if (!API.cacheEnabled) {
        return await queryFn();
      }

      // Simple in-memory cache implementation
      const cacheStore = API.getCacheStore();
      const cachedData = cacheStore.get(cacheKey);

      // Try to get performance monitor for tracking
      let performanceMonitor;
      try {
        performanceMonitor = require('../../utils/performance').performanceMonitor;
      } catch (e) {
        // Performance monitor not available, continue without it
      }

      // Get the cache name from the key
      const cacheName = cacheKey.split(':')[0] || 'api';

      if (cachedData && cachedData.expires> Date.now()) {
        // Cache hit
        if (performanceMonitor) {
          // Estimate time saved based on prior operations
          const timeSaved = 100; // Default estimate of 100ms saved
          performanceMonitor.recordCacheHit(cacheNametimeSaved);
        }

        return cachedData.data;
      }

      // Cache miss
      if (performanceMonitor) {
        performanceMonitor.recordCacheMiss(cacheName);
      }

      // Record operation time to help improve future time saved estimates
      const startTime = performance.now();
      const data = await queryFn();
      const endTime = performance.now();

      // Record the operation time for future estimates
      if (performanceMonitor) {
        performanceMonitor.recordOperationTime(cacheName, endTime - startTime);
      }

      cacheStore.set(cacheKey, {
        data,
        expires: Date.now() + ttl
      });

      return data;
    }
  );

  /**
   * Configure API caching behavior
   */
  static configureCaching(options: { enabled: boolean }) {
    this.cacheEnabled = options.enabled;
  }

  /**
   * Get the in-memory cache store
   */
  private static getCacheStore(): Map<string, { data: any, expires: number }> {
    if (typeof window === 'undefined') {
      return new Map();
    }

    if (!(window as any).__API_CACHE) {
      (window as any).__API_CACHE = new Map();
    }

    return (window as any).__API_CACHE;
  }

  /**
   * Get the Amplify API client (creates if doesn't exist)
   */
  static getClient() {
    ensureAmplifyInitialized();
    if (!this.client) {
      // Create client with optimized configuration for Next.js 15.3.1
      this.client = generateClient({
        config: {
          API: {
            GraphQL: {
              // Enable response caching for improved performance
              responseInvalidation: {
                expressionFunctions: {
                  // Define custom expression functions for fine-grained cache control
                  cacheWithTTL: (seconds = 300) => {
                    return {
                      ttl: seconds
                    };
                  }
                }
              }
            }
          },
          // Enable optimistic responses for improved UX
          optimisticResponse: true
        }
      });
    }
    return this.client;
  }

  /**
   * Execute a GraphQL operation
   */
  static async graphql<T>({ 
    query, 
    variables = {}, 
    operationName = null, 
    authMode,
    cacheOptions
  }: GraphQLOptions): Promise<T> {
    const client = this.getClient();
    const operationLabel = operationName || query.split('{')[0].trim();

    // Generate a cache key if caching is enabled
    const shouldCache = cacheOptions?.disableCache !== true && this.cacheEnabled;
    const cacheKey = shouldCache ? 
      `graphql:${operationLabel}:${JSON.stringify(variables)}` : '';

    const executeQuery = async (): Promise<T> => {
      try {
        // Add authorization header for user pool auth mode
        let headers = {};
        if (authMode === 'userPool' || !authMode) {
          try {
            const token = await Auth.getAccessToken();
            if (token) {
              headers = {
                ...headers,
                Authorization: `Bearer ${token}`
              };
            }
          } catch (authError) {

          }
        }

        const response = await client.graphql<GraphQLResult<T>>({
          query,
          variables,
          authMode: authMode || 'userPool',
          headers
        });

        if (response.errors) {
          const errorMessage = response.errors[0].message;
          throw new ApiError(`GraphQL operation failed: ${errorMessage}`, {
            originalError: response.errors
          });
        }

        if (!response.data) {
          throw new ApiError("GraphQL response missing data");
        }

        return response.data as T;
      } catch (error: any) {

        // Process specific error types
        if (error instanceof ApiError) {
          throw error;
        }

        // Handle authentication errors
        if (error.message?.includes('not authorized') || error.statusCode === 401) {
          // Try token refresh if authentication error
          try {
            await Auth.getCurrentUser(); // This will refresh the token if needed
            // Retry the operation once after token refresh
            return await client.graphql<GraphQLResult<T>>({
              query,
              variables,
              authMode: authMode || 'userPool'}).then(response => {
              if (response.errors) {
                throw new ApiError(`GraphQL operation failed after token refresh: ${response.errors[0].message}`);
              }
              return response.data as T;
            });
          } catch (refreshError) {
            throw new ApiError(`Authentication error: You are not authorized to perform this operation.`, {
              statusCode: 401,
              originalError: error
            });
          }
        }

        // Network errors
        if (error.message?.includes('Network error')) {
          throw new ApiError(`Network error while executing ${operationLabel}. Please check your connection.`, {
            originalError: error
          });
        }

        // Wrap other errors
        throw new ApiError(
          error.message || `GraphQL operation '${operationLabel}' failed`,
          { 
            originalError: error,
            cached: shouldCache,
            cacheStatus: shouldCache ? 'miss' : 'bypass'
          }
        );
      }
    };

    // Execute with or without caching
    if (shouldCache) {
      return await this.queryCache(
        cacheKey, 
        executeQuery, 
        cacheOptions?.ttl || 60000
      );
    } else {
      return await executeQuery();
    }
  }

  /**
   * Execute a REST API request
   */
  static async rest<T>(options: RestOptions): Promise<T> {
    const client = this.getClient();
    const { 
      path, 
      method = 'GET', 
      body, 
      headers = {},
      queryParams,
      cacheOptions
    } = options;

    // Generate a cache key if caching is enabled for GET requests
    const isGetRequest = method === 'GET';
    const shouldCache = isGetRequest && cacheOptions?.disableCache !== true && this.cacheEnabled;
    const cacheKey = shouldCache ? 
      `rest:${method}:${path}:${JSON.stringify(queryParams)}` : '';

    const executeRequest = async (): Promise<T> => {
      try {
        // Add authorization header
        let requestHeaders = { ...headers };
        try {
          const token = await Auth.getAccessToken();
          if (token) {
            requestHeaders = {
              ...requestHeaders,
              Authorization: `Bearer ${token}`
            };
          }
        } catch (authError) {

        }

        // Prepare the request configuration
        const requestConfig = {
          body,
          headers: requestHeaders,
          queryParams};

        let response;
        switch (method) {
          case 'GET':
            response = await client.get({ path, ...requestConfig });
            break;
          case 'POST':
            response = await client.post({ path, ...requestConfig });
            break;
          case 'PUT':
            response = await client.put({ path, ...requestConfig });
            break;
          case 'DELETE':
            response = await client.delete({ path, ...requestConfig });
            break;
          case 'PATCH':
            // Custom implementation for PATCH
            response = await this.executePatchRequest(pathrequestConfig);
            break;
          default:
            throw new ApiError(`Unsupported HTTP method: ${method}`);
        }

        return response as T;
      } catch (error: any) {

        // Process API errors
        if (error instanceof ApiError) {
          throw error;
        }

        // Handle authentication errors and try to refresh
        if (error.status === 401 || error.statusCode === 401) {
          try {
            await Auth.getCurrentUser(); // This will refresh the token if needed

            // Retry the operation once with the new token
            const token = await Auth.getAccessToken();
            if (token) {
              // Update headers with new token
              const retryHeaders = {
                ...headers,
                Authorization: `Bearer ${token}`
              };

              // Retry the request
              const retryConfig = {
                body,
                headers: retryHeaders,
                queryParams};

              let retryResponse;
              switch (method) {
                case 'GET':
                  retryResponse = await client.get({ path, ...retryConfig });
                  break;
                case 'POST':
                  retryResponse = await client.post({ path, ...retryConfig });
                  break;
                case 'PUT':
                  retryResponse = await client.put({ path, ...retryConfig });
                  break;
                case 'DELETE':
                  retryResponse = await client.delete({ path, ...retryConfig });
                  break;
                case 'PATCH':
                  retryResponse = await this.executePatchRequest(pathretryConfig);
                  break;
              }

              return retryResponse as T;
            }
          } catch (refreshError) {
            // If refresh fails, throw the original error
          }
        }

        // Wrap the error with more context
        throw new ApiError(
          error.message || `REST API request to ${path} failed`,
          {
            path,
            method,
            statusCode: error.status || error.statusCode,
            originalError: error,
            cached: shouldCache,
            cacheStatus: shouldCache ? 'miss' : 'bypass'
          }
        );
      }
    };

    // Execute with or without caching
    if (shouldCache) {
      return await this.queryCache(
        cacheKey, 
        executeRequest, 
        cacheOptions?.ttl || 60000
      );
    } else {
      return await executeRequest();
    }
  }

  /**
   * Custom implementation for PATCH requests
   * Until Amplify fully supports PATCH in the client
   */
  private static async executePatchRequest(path: string, config: any): Promise<any> {
    const { body, headers = {}, queryParams } = config;

    // Build the URL
    let url = path.startsWith('http') ? path : process.env.NEXT_PUBLIC_API_URL;
    if (!url) {
      // Try to get from the main config
      try {
        const mainApiEndpoint = process.env.NEXT_PUBLIC_API_URL;
        if (mainApiEndpoint) {
          url = mainApiEndpoint;
        }
      } catch (e) {

      }
    }

    // Ensure path starts with a slash
    const apiPath = path.startsWith('/') ? path : `/${path}`;
    url = `${url}${apiPath}`;

    // Add query parameters
    if (queryParams && Object.keys(queryParams).length> 0) {
      const queryString = Object.entries(queryParams)
        .map(([keyvalue]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      url += `?${queryString}`;
    }

    // Make the fetch request
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers},
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'});

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Error text unavailable');
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }

      throw new ApiError(
        errorData.message || `PATCH request failed with status ${response.status}`,
        {
          path,
          method: 'PATCH',
          statusCode: response.status,
          originalError: errorData
        }
      );
    }

    // Parse the response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  }

  /**
   * Clear the API cache
   */
  static clearCache(pattern?: string): void {
    const cacheStore = this.getCacheStore();

    if (pattern) {
      // Clear items matching pattern
      const regex = new RegExp(pattern);
      Array.from(cacheStore.keys())
        .filter(key => regex.test(key))
        .forEach(key => cacheStore.delete(key));
    } else {
      // Clear entire cache
      cacheStore.clear();
    }
  }

  /**
   * Get with simple parameters for common use cases
   */
  static async get<T>(path: string, queryParams?: Record<string, any>, options?: Partial<RestOptions>): Promise<T> {
    return this.rest<T>({
      path,
      method: 'GET',
      queryParams,
      ...options
    });
  }

  /**
   * Post with simple parameters for common use cases
   */
  static async post<T>(path: string, body: any, options?: Partial<RestOptions>): Promise<T> {
    return this.rest<T>({
      path,
      method: 'POST',
      body,
      ...options
    });
  }

  /**
   * Put with simple parameters for common use cases
   */
  static async put<T>(path: string, body: any, options?: Partial<RestOptions>): Promise<T> {
    return this.rest<T>({
      path,
      method: 'PUT',
      body,
      ...options
    });
  }

  /**
   * Delete with simple parameters for common use cases
   */
  static async delete<T>(path: string, options?: Partial<RestOptions>): Promise<T> {
    return this.rest<T>({
      path,
      method: 'DELETE',
      ...options
    });
  }

  /**
   * Patch with simple parameters for common use cases
   */
  static async patch<T>(path: string, body: any, options?: Partial<RestOptions>): Promise<T> {
    return this.rest<T>({
      path,
      method: 'PATCH',
      body,
      ...options
    });
  }
}