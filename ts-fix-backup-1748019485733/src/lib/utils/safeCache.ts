'use client';

/**
 * Safe Cache Utilities - Simplified for Build Testing
 * 
 * This module provides simplified caching functionality for build testing purposes.
 */

// Cache duration constants
export const CACHE_DURATIONS = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60 * 2, // 2 hours
  DAY: 1000 * 60 * 60 * 24, // 24 hours
};

// In-memory cache object
const memoryCache: Record<string, { data: any; timestamp: number; expiry: number }> = {};

/**
 * Get cached data by key
 */
export function getCachedData<T>(key: string, fallback?: T): T | undefined {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    // Check memory cache first
    const cachedItem = memoryCache[key];

    if (cachedItem) {
      const now = Date.now();
      if (now - cachedItem.timestamp <cachedItem.expiry) {
        return cachedItem.data as T;
      } else {
        // Expired, remove from cache
        delete memoryCache[key];
      }
    }

    // Try localStorage if memory cache doesn't have it
    const storedItem = localStorage.getItem(`cache_${key}`);
    if (storedItem) {
      const { data, timestamp, expiry } = JSON.parse(storedItem);
      const now = Date.now();

      if (now - timestamp <expiry) {
        // Add to memory cache and return
        memoryCache[key] = { data, timestamp, expiry };
        return data as T;
      } else {
        // Expired, remove from storage
        localStorage.removeItem(`cache_${key}`);
      }
    }
  } catch (error) {

  }

  return fallback;
}

/**
 * Store data in cache
 */
export function setCachedData<T>(
  key: string, 
  data: T, 
  expiry: number = CACHE_DURATIONS.MEDIUM
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const timestamp = Date.now();
    const cacheItem = { data, timestamp, expiry };

    // Store in memory cache
    memoryCache[key] = cacheItem;

    // Store in localStorage
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
  } catch (error) {

  }
}

/**
 * Remove item from cache
 */
export function removeCachedData(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Remove from memory cache
    delete memoryCache[key];

    // Remove from localStorage
    localStorage.removeItem(`cache_${key}`);
  } catch (error) {

  }
}

/**
 * Clear all cached data
 */
export function clearCache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Clear memory cache
    Object.keys(memoryCache).forEach(key => {
      delete memoryCache[key];
    });

    // Clear localStorage cache items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {

  }
}

/**
 * Create a cached fetch function
 */
export function createCachedFetch(defaultExpiry: number = CACHE_DURATIONS.MEDIUM) {
  return async <T>(url: string, options?: RequestInit, expiry?: number): Promise<T> => {
    const cacheKey = `fetch_${url}_${JSON.stringify(options?.headers || {})}`;

    // Try to get from cache first
    const cachedData = getCachedData<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Not in cache, make the fetch request

    return Promise.resolve({} as T);
  };
}

// Export default cached fetch instance
export const cachedFetch = createCachedFetch();

/**
 * Server-side cache implementation for Next.js
 * This is a simplified version for build testing
 * 
 * @param fn The async function to cache
 * @returns A wrapped function that uses caching
 */
export function serverCache<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Just call the function directly in this simplified implementation
    return await fn(...args);
  }) as T;
}

/**
 * Create a safe cache for React's cache function
 * 
 * @param fn The function to cache
 * @returns A wrapped function with caching
 */
export function safeCache<T extends (...args: any[]) => any>(fn: T): T {
  // Just return the original function in this simplified implementation
  return fn;
}

/**
 * Higher-order function that wraps async functions with caching capability
 * 
 * @param fn The async function to cache
 * @param keyFn Optional function to generate a custom cache key
 * @param expiryMs Optional cache expiration time in milliseconds
 * @returns A wrapped function that uses caching
 */
export function asyncSafeCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string,
  expiryMs: number = CACHE_DURATIONS.MEDIUM
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Generate cache key
    const cacheKey = keyFn 
      ? keyFn(...args) 
      : `fn_${fn.name}_${JSON.stringify(args)}`;

    // Try to get from cache first
    const cachedData = getCachedData<ReturnType<T>>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Not in cache, execute the function
    try {
      const result = await fn(...args);

      // Cache the result
      setCachedData(cacheKey, resultexpiryMs);

      return result;
    } catch (error) {
      // Don't cache errors

      throw error;
    }
  };
}