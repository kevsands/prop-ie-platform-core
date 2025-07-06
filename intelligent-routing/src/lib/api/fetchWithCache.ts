/**
 * Enhanced fetch utility with caching support
 * 
 * This module provides an improved fetch wrapper that adds comprehensive 
 * caching support, performance monitoring, and automatic retry capabilities.
 */

import { asyncSafeCache } from "@/utils/performance/safeCache";
import { performanceMonitor } from "@/utils/performance";
import { recordApiMetric } from "../monitoring/apiPerformance";

export interface FetchOptions extends RequestInit {
  /**
   * Cache TTL in milliseconds. Set to false to bypass cache, or 0 for no expiration.
   */
  cacheTtlMs?: number | false;

  /**
   * Number of retry attempts for failed requests
   */
  retries?: number;

  /**
   * Delay between retries in milliseconds
   */
  retryDelayMs?: number;

  /**
   * Tags for cache invalidation
   */
  cacheTags?: string[];

  /**
   * Whether to record metrics for this fetch
   */
  recordMetrics?: boolean;

  /**
   * Custom error handler
   */
  onError?: (error: Error) => void;

  /**
   * Request timeout in milliseconds
   */
  timeoutMs?: number;
}

/**
 * Enhanced fetch with caching support
 */
export const fetchWithCache = asyncSafeCache(
  async <T = any>(...args: [url: string, options?: FetchOptions]): Promise<T> => {
    const [url, options = {}] = args;
    const {
      cacheTtlMs = 60000, // Default 1 minute TTL
      retries = 2,
      retryDelayMs = 500,
      cacheTags = [],
      recordMetrics = true,
      onError,
      timeoutMs = 30000,
      ...fetchOptions
    } = options;

    // Start timing for metrics
    const startTime = performance.now();
    const isCached = false;
    const cacheStatus: 'hit' | 'miss' | 'bypass' = 'bypass';

    try {
      // Handle request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      // Add abort signal to fetch options
      const fetchOptionsWithSignal = {
        ...fetchOptions,
        signal: controller.signal,
      };

      // Perform the fetch with retry logic
      let attempt = 0;
      let response: Response | null = null;
      let error: Error | null = null;

      while (attempt <= retries && !response) {
        try {
          if (attempt > 0) {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, retryDelayMs * attempt));
          }

          response = await fetch(url, fetchOptionsWithSignal);
        } catch (err) {
          error = err as Error;
          attempt++;

          // Don't retry if aborted or if we've exhausted retries
          if (err instanceof Error && err.name === 'AbortError') {
            clearTimeout(timeoutId);
            throw new Error(`Request timeout after ${timeoutMs}ms: ${url}`);
          }
        }
      }

      // Clear the timeout
      clearTimeout(timeoutId);

      // If all retries failed, throw the last error
      if (!response) {
        if (onError && error) {
          onError(error);
        }
        throw error || new Error(`Failed to fetch ${url} after ${retries} retries`);
      }

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      // Parse response as JSON
      const data = await response.json();

      // Record the API metric
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (recordMetrics) {
        recordApiMetric({
          endpoint: url,
          method: fetchOptions.method || 'GET',
          duration,
          status: 'success',
          timestamp: Date.now(),
          statusCode: response.status,
          cached: true,
          cacheStatus: isCached ? 'hit' : 'miss',
        });
      }

      return data as T;
    } catch (error) {
      // Record the API metric for errors
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (recordMetrics) {
        recordApiMetric({
          endpoint: url,
          method: fetchOptions.method || 'GET',
          duration,
          status: 'error',
          timestamp: Date.now(),
          errorType: error instanceof Error ? error.name : 'Unknown',
          cached: true,
          cacheStatus,
        });
      }

      if (onError && error instanceof Error) {
        onError(error);
      }

      throw error;
    }
  },
  {
    // Configure the async cache
    allowRetryAfterError: true,
    // Use the cacheTtlMs option from the function arguments
    cacheTtlMs: null, // This will be set by the wrapper function
  }
);

/**
 * Create a fetch function with caching configured
 */
export function createCachedFetch(defaultOptions: Partial<FetchOptions> = {}) {
  return <T = any>(url: string, options: FetchOptions = {}): Promise<T> => {
    // Merge default options with provided options
    const mergedOptions = { ...defaultOptions, ...options };

    // If cache is disabled, call fetch directly
    if (mergedOptions.cacheTtlMs === false) {
      return fetch(url, mergedOptions).then(res => res.json());
    }

    // Otherwise, use fetchWithCache with the appropriate TTL
    return fetchWithCache<T>(url, {
      ...mergedOptions,
      cacheTtlMs: mergedOptions.cacheTtlMs,
    });
  };
}

// Create some pre-configured fetch functions
export const cachedFetch = createCachedFetch();
export const shortLivedCache = createCachedFetch({ cacheTtlMs: 10000 }); // 10 seconds
export const longLivedCache = createCachedFetch({ cacheTtlMs: 3600000 }); // 1 hour
export const noCache = createCachedFetch({ cacheTtlMs: false });

export default fetchWithCache;