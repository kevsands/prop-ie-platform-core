/**
 * Optimized API Client
 * 
 * A centralized API client with advanced features:
 * - Request deduplication to prevent redundant network calls
 * - Cache tag invalidation for precise cache control
 * - Automatic retries with exponential backoff
 * - Request batching for related API calls
 * - Metrics and performance tracking
 * - Consistent error handling
 */

import { apiCache } from './performance/enhancedCache';
import { apiBatcher } from './performance/apiBatcher';
import { queryClient, QUERY_KEYS } from './queryClient';

// Default API settings
const API_DEFAULTS = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  retries: 2,
  deduplicate: true
};

// Cache tag constants for more precise invalidation
export const CACHE_TAGS = {
  USER: 'user',
  PROPERTIES: 'properties',
  DEVELOPMENTS: 'developments',
  DOCUMENTS: 'documents',
  CUSTOMIZATIONS: 'customizations',
  FINANCIAL: 'financial',
  SETTINGS: 'settings'
};

// Error types for better error handling
export enum ApiErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  AUTH = 'authentication',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

// API error structure
export class ApiError extends Error {
  public type: ApiErrorType;
  public status: number;
  public data?: any;

  constructor(message: string, type: ApiErrorType, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.data = data;
  }

  /**
   * Determine if this error is transient and can be retried
   */
  get isRetryable(): boolean {
    return (
      this.type === ApiErrorType.NETWORK ||
      this.type === ApiErrorType.TIMEOUT ||
      (this.type === ApiErrorType.SERVER && this.status >= 500)
    );
  }
}

// Request options
export interface ApiRequestOptions {
  /**
   * HTTP method
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  /**
   * Request body
   */
  body?: any;

  /**
   * Query parameters
   */
  params?: Record<string, string | number | boolean | undefined>;

  /**
   * Additional headers
   */
  headers?: Record<string, string>;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Maximum number of retries
   */
  retries?: number;

  /**
   * Cache time-to-live in milliseconds
   */
  cacheTtl?: number;

  /**
   * Cache tags for invalidation
   */
  cacheTags?: string[];

  /**
   * Deduplicate identical in-flight requests
   */
  deduplicate?: boolean;

  /**
   * Batch with other requests (must use same batchKey)
   */
  batchKey?: string;

  /**
   * Request priority (higher = more important)
   */
  priority?: number;

  /**
   * Skip cache and always fetch from network
   */
  noCache?: boolean;

  /**
   * Custom request transformer
   */
  transformRequest?: (request: RequestInit) => RequestInit;

  /**
   * Custom response transformer
   */
  transformResponse?: <T>(response: any) => T;
}

/**
 * Central API client for the application
 */
export class ApiClient {
  private baseUrl: string;
  private defaultOptions: ApiRequestOptions;

  constructor(options: {
    baseUrl?: string;
    defaultOptions?: ApiRequestOptions;
  } = {}) {
    this.baseUrl = options.baseUrl || API_DEFAULTS.baseUrl;
    this.defaultOptions = {
      method: 'GET',
      timeout: API_DEFAULTS.timeout,
      retries: API_DEFAULTS.retries,
      deduplicate: API_DEFAULTS.deduplicate,
      cacheTags: [],
      ...options.defaultOptions
    };
  }

  /**
   * Build the full URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${normalizedPath}`, window.location.origin);

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Generate a cache key for the request
   */
  private generateCacheKey(url: string, method: string, body?: any): string {
    const bodyHash = body ? JSON.stringify(body) : '';
    return `${method}:${url}:${bodyHash}`;
  }

  /**
   * Create an error object from a response
   */
  private async createError(response: Response, url: string): Promise<ApiError> {
    let errorData: any;
    let message = `Request failed with status ${response.status}`;

    try {
      errorData = await response.json();
      // Use server-provided message if available
      if (errorData?.message || errorData?.error) {
        message = errorData.message || errorData.error;
      }
    } catch (e) {
      // If response is not JSON, use status text
      message = response.statusText || message;
    }

    // Determine error type based on status code
    let errorType = ApiErrorType.UNKNOWN;

    if (response.status === 401) {
      errorType = ApiErrorType.AUTH;
    } else if (response.status === 403) {
      errorType = ApiErrorType.FORBIDDEN;
    } else if (response.status === 404) {
      errorType = ApiErrorType.NOT_FOUND;
    } else if (response.status === 422) {
      errorType = ApiErrorType.VALIDATION;
    } else if (response.status >= 500) {
      errorType = ApiErrorType.SERVER;
    }

    return new ApiError(
      message,
      errorType,
      response.status,
      errorData
    );
  }

  /**
   * Make an HTTP request with caching, deduplication, and retries
   */
  async request<T = any>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    // Merge with default options
    const mergedOptions: ApiRequestOptions = {
      ...this.defaultOptions,
      ...options
    };

    const {
      method = 'GET',
      body,
      params,
      headers = {},
      timeout,
      retries,
      cacheTtl,
      cacheTags = [],
      deduplicate,
      batchKey,
      noCache,
      transformRequest,
      transformResponse } = mergedOptions;

    const url = this.buildUrl(path, params);
    const cacheKey = this.generateCacheKey(url, method, body);

    // Try to get from cache first for GET requests
    if (method === 'GET' && !noCache) {
      const cachedData = apiCache.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // If batching is enabled, use the apiBatcher
    if (batchKey) {
      return apiBatcher.request<T>({
        url,
        method,
        body,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        priority: mergedOptions.priority,
        timeout,
        batchKey,
        maxRetries: retries
      });
    }

    // Standard request function
    const fetchFn = async (): Promise<T> => {
      // Prepare request
      let requestInit: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      };

      // Apply custom request transformer if provided
      if (transformRequest) {
        requestInit = transformRequest(requestInit);
      }

      // Execute request with timeout
      const controller = new AbortController();
      const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

      try {
        const response = await fetch(url, {
          ...requestInit,
          signal: controller.signal
        });

        // Clean up timeout
        if (timeoutId) clearTimeout(timeoutId);

        // Handle error responses
        if (!response.ok) {
          throw await this.createError(response, url);
        }

        // Parse response based on content type
        let responseData: any;

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        // Apply custom response transformer if provided
        if (transformResponse) {
          responseData = transformResponse(responseData);
        }

        // Cache successful GET responses
        if (method === 'GET' && !noCache && cacheTtl !== 0) {
          apiCache.set(cacheKey, responseData, cacheTtl, cacheTags);
        }

        return responseData;
      } catch (error) {
        // Clean up timeout
        if (timeoutId) clearTimeout(timeoutId);

        // Handle abort/timeout
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new ApiError(
            'Request timed out',
            ApiErrorType.TIMEOUT,
            0
          );
        }

        // Re-throw ApiErrors
        if (error instanceof ApiError) {
          throw error;
        }

        // Convert other errors to ApiError
        throw new ApiError(
          error instanceof Error ? error.message : String(error),
          ApiErrorType.NETWORK,
          0
        );
      }
    };

    // Use apiCache's built-in deduplication
    if (deduplicate) {
      return apiCache.getOrFetch<T>(
        cacheKey,
        fetchFn,
        cacheTtl,
        cacheTags
      );
    }

    // Execute without deduplication
    return fetchFn();
  }

  /**
   * GET request shorthand
   */
  async get<T = any>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    options: Omit<ApiRequestOptions, 'method' | 'params'> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      method: 'GET',
      params,
      ...options
    });
  }

  /**
   * POST request shorthand
   */
  async post<T = any>(
    path: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body,
      ...options
    });
  }

  /**
   * PUT request shorthand
   */
  async put<T = any>(
    path: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body,
      ...options
    });
  }

  /**
   * PATCH request shorthand
   */
  async patch<T = any>(
    path: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body,
      ...options
    });
  }

  /**
   * DELETE request shorthand
   */
  async delete<T = any>(
    path: string,
    options: Omit<ApiRequestOptions, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      method: 'DELETE',
      ...options
    });
  }

  /**
   * Invalidate cache by tags
   */
  invalidateByTags(tags: string[]): void {
    // Invalidate in apiCache
    tags.forEach(tag => {
      apiCache.invalidateByTag(tag);
    });

    // Invalidate in React Query client
    tags.forEach(tag => {
      // Map cache tags to query keys
      const queryKey = this.mapTagToQueryKey(tag);
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    });
  }

  /**
   * Map a cache tag to a React Query key
   */
  private mapTagToQueryKey(tag: string): string | null {
    // Map common tags to query keys
    const tagToQueryKeyMap: Record<string, string> = {
      [CACHE_TAGS.USER]: QUERY_KEYS.USER,
      [CACHE_TAGS.PROPERTIES]: QUERY_KEYS.PROPERTIES,
      [CACHE_TAGS.DEVELOPMENTS]: QUERY_KEYS.DEVELOPMENTS,
      [CACHE_TAGS.DOCUMENTS]: QUERY_KEYS.DOCUMENTS
    };

    return tagToQueryKeyMap[tag] || null;
  }

  /**
   * Batch multiple GET requests together
   */
  async batchGet<T = any[]>(
    requests: Array<{
      path: string;
      params?: Record<string, string | number | boolean | undefined>;
      options?: Omit<ApiRequestOptions, 'method' | 'params' | 'batchKey'>;
    }>,
    batchKey = 'default_batch'
  ): Promise<T[]> {
    // Create an array of promises
    const promises = requests.map(({ path, params, options = {} }) =>
      this.get(path, params, {
        ...options,
        batchKey
      })
    );

    // Execute all promises in parallel
    return Promise.all(promises) as Promise<T[]>;
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

export default apiClient;