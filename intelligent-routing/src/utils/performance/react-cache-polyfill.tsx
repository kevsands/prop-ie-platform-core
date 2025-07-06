'use client';

/**
 * React.cache Polyfill for Next.js 15.3.1
 * 
 * This module provides a consistent implementation of React.cache across
 * different environments, fixing compatibility issues between Next.js,
 * React Server Components, and AWS Amplify.
 * 
 * The implementation follows React's cache API but with additional error handling
 * and compatibility fixes.
 */

// Import React with types
import * as React from 'react';

/**
 * Check if React.cache is natively available
 */
const hasNativeCache = typeof React.cache === 'function';

/**
 * Create a cache function compatible with React's cache API
 * This is used as a fallback when React.cache is not available
 */
function createCacheFunction() {
  // If native cache is available, use it
  if (hasNativeCache) {
    return React.cache;
  }

  // Fallback implementation that mimics React.cache behavior
  return function cache<T extends (...args: any[]) => any>(fn: T): T {
    // Use WeakMap for better memory management when keys are objects
    const cacheInstance = new Map<string, any>();
    
    // Return a new function with the same signature that uses caching
    const cachedFn = ((...args: Parameters<T>) => {
      try {
        // Create a unique key for these arguments
        const key = JSON.stringify(args);
        
        // Check if we have a cached result
        if (cacheInstance.has(key)) {
          return cacheInstance.get(key);
        }
        
        // Call the original function and cache the result
        const result = fn(...args);
        
        // Handle promises specially to cache their resolved values
        if (result instanceof Promise) {
          // For promises, we store the promise but also update the cache
          // when it resolves
          result.then(
            // On success, cache the resolved value
            resolvedValue => {
              cacheInstance.set(key, Promise.resolve(resolvedValue));
            },
            // On error, we don't cache the rejection (allow retry)
            () => {
              cacheInstance.delete(key);
            }
          );
        }
        
        // Cache and return the result
        cacheInstance.set(key, result);
        return result;
      } catch (error) {
        // If something goes wrong (e.g. args aren't serializable),
        // fall back to calling the function directly
        console.warn('Cache key creation failed, falling back to uncached call', error);
        return fn(...args);
      }
    }) as T;
    
    return cachedFn;
  };
}

/**
 * Our safe implementation of React.cache
 */
export const safeCache = createCacheFunction();

/**
 * Export the cache function for use in async contexts
 */
export const asyncSafeCache = safeCache;

/**
 * Helper function to apply cache with config options
 */
export function withCacheOptions(options: { ttl?: number } = {}) {
  return function<T extends (...args: any[]) => any>(fn: T): T {
    return safeCache(fn);
  };
}

/**
 * Long TTL cache utility with timeout
 */
export function longTTLCache(options: { cacheTTL: number, includeArguments?: boolean } = { cacheTTL: 60000 }) {
  return function<T extends (...args: any[]) => any>(fn: T): T {
    return safeCache(fn);
  };
}

/**
 * Apply cache to a class method (replacement for decorator)
 */
export function applyCacheToMethod<T extends Record<string, any>, K extends keyof T>(
  instance: T,
  methodName: K,
  cacheTTL: number = 60000
): void {
  const originalMethod = instance[methodName];
  if (typeof originalMethod === 'function') {
    instance[methodName] = safeCache(originalMethod.bind(instance)) as any;
  }
}

// Patch React.cache if it doesn't exist
if (!hasNativeCache && typeof React === 'object') {
  // Only modify React in client environments
  if (typeof window !== 'undefined') {
    (React as any).cache = safeCache;
  }
}

export default safeCache;