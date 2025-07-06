/**
 * Enhanced Safe Cache Utilities
 * 
 * This module provides performance-optimized caching utilities for the application
 * with robust error handling and TypeScript type safety.
 */

/**
 * A cache utility with a long TTL for items that don't change frequently
 * Uses localStorage for persistence across page refreshes.
 */
const _longTTLCache = {
  /**
   * Store value in cache with a long TTL
   * @param key Cache key
   * @param value Value to store
   * @param ttl TTL in milliseconds (default: 1 hour)
   */
  set: <T>(key: string, value: T, ttl = 3600000) => {
    if (typeof window === 'undefined') return; // Skip in SSR

    try {
      const item = {
        value,
        expiry: Date.now() + ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to store item in longTTLCache', error);
    }
  },

  /**
   * Get value from cache if not expired
   * @param key Cache key
   * @returns The cached value or null if not found or expired
   */
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null; // Skip in SSR

    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const item = JSON.parse(cached);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('Failed to retrieve item from longTTLCache', error);
      return null;
    }
  },

  /**
   * Invalidate a cached item
   * @param key Cache key
   */
  invalidate: (key: string) => {
    if (typeof window === 'undefined') return; // Skip in SSR

    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Failed to invalidate item in longTTLCache', error);
    }
  },

  /**
   * Clear all cache entries
   */
  clear: () => {
    if (typeof window === 'undefined') return; // Skip in SSR

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear longTTLCache', error);
    }
  }
};

/**
 * Caches the results of a function with a specified TTL
 * 
 * @param fn The function to cache
 * @param ttlMs Time-to-live in milliseconds (default: 30000ms / 30 seconds)
 * @returns A wrapped function that caches results
 */
function _safeCache<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ttlMs: number = 30000
): T {
  // Validate input
  if (typeof fn !== 'function') {
    console.error('safeCache requires a function as its first argument');
    // Return a pass-through function that does nothing but prevent crashes
    return ((...args: unknown[]) => args[0]) as unknown as T;
  }

  const cache = new Map<string, { value: ReturnType<T>; expiry: number }>();

  const wrappedFn = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    try {
      // Create a cache key from the function arguments
      const key = JSON.stringify(args);
      const now = Date.now();
      const cached = cache.get(key);

      // Return cached value if it exists and hasn't expired
      if (cached && cached.expiry > now) {
        return cached.value;
      }

      // Safely call the original function with either provided context or null
      const result = fn.apply(this || null, args);

      // Cache the result with expiry
      cache.set(key, {
        value: result as ReturnType<T>,
        expiry: now + ttlMs
      });

      return result as ReturnType<T>;
    } catch (error) {
      // If serialization fails or any error occurs, fall back to direct call
      console.warn('Safe cache operation failed, falling back to uncached call', error);
      try {
        return fn.apply(this || null, args) as ReturnType<T>;
      } catch (innerError) {
        console.error('Function execution failed even without caching', innerError);
        throw innerError; // Re-throw to preserve original error behavior
      }
    }
  };

  return wrappedFn as T;
}

/**
 * Creates a simple TTL cache for functions (alias for safeCache for backward compatibility)
 */
function _ttlCache<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ttlMs: number = 30000
): T {
  return _safeCache(fn, ttlMs);
}

/**
 * Creates a cache for async functions with TTL support
 */
function _asyncSafeCache<T extends (...args: unknown[]) => Promise<any>>(
  fn: T,
  options: { cacheTTL?: number } = {}
): T {
  // Validate input
  if (typeof fn !== 'function') {
    console.error('asyncSafeCache requires a function as its first argument');
    // Return a pass-through function that returns a resolved promise
    return (async (...args: unknown[]) => args[0]) as unknown as T;
  }

  const { cacheTTL = 300000 } = options; // Default 5 minutes
  const cache = new Map<string, { value: Promise<unknown>; expiry: number }>();

  const wrappedFn = async function (this: unknown, ...args: Parameters<T>): Promise<ReturnType<T>> {
    try {
      // Create a cache key from the function arguments
      const key = JSON.stringify(args);
      const now = Date.now();
      const cached = cache.get(key);

      // Return cached value if it exists and hasn't expired
      if (cached && cached.expiry > now) {
        try {
          const result = await cached.value;
          return result as ReturnType<T>;
        } catch (error) {
          // If the cached promise rejected, remove it from cache and retry
          cache.delete(key);
        }
      }

      // Execute the function with proper context
      const resultPromise = fn.apply(this || null, args);

      // Ensure we have a promise
      if (!(resultPromise instanceof Promise)) {
        console.warn('Function passed to asyncSafeCache did not return a Promise');
        // Convert to promise if necessary
        const wrappedPromise = Promise.resolve(resultPromise);

        // Cache the promise with expiry
        cache.set(key, {
          value: wrappedPromise,
          expiry: now + cacheTTL
        });

        return wrappedPromise as ReturnType<T>;
      }

      // Cache the promise with expiry
      cache.set(key, {
        value: resultPromise,
        expiry: now + cacheTTL
      });

      return resultPromise as ReturnType<T>;
    } catch (error) {
      // If serialization fails or any error occurs, fall back to direct call
      console.warn('Async cache operation failed, falling back to uncached call', error);
      try {
        const result = await fn.apply(this || null, args);
        return result as ReturnType<T>;
      } catch (innerError) {
        console.error('Async function execution failed even without caching', innerError);
        throw innerError; // Re-throw to preserve original error behavior
      }
    }
  };

  return wrappedFn as T;
}

/**
 * Utility to check if a value is a function
 */
function checkIsFunction(value: unknown): boolean {
  return value !== null && typeof value === 'function';
}

// Export all utilities with their public names
export const longTTLCache = _longTTLCache;
export const longTTLCacheFunction = _longTTLCache;
export const safeCache = _safeCache;
export const safeCacheFunction = _safeCache;
export const ttlCache = _ttlCache;
export const ttlCacheFunction = _ttlCache;
export const asyncSafeCache = _asyncSafeCache;
export const asyncSafeCacheFunction = _asyncSafeCache;
export const isFunction = checkIsFunction;

/**
 * Cache utilities bundle for default import usage
 */
const cacheUtilities = {
  safeCache: _safeCache,
  safeCacheFunction: _safeCache,
  ttlCache: _ttlCache,
  ttlCacheFunction: _ttlCache,
  asyncSafeCache: _asyncSafeCache,
  asyncSafeCacheFunction: _asyncSafeCache,
  longTTLCache: _longTTLCache,
  longTTLCacheFunction: _longTTLCache,
  isFunction: checkIsFunction
};

// Export default (for "import safeCache from ...")
export default _safeCache;

// Export the utilities object for named import
export { cacheUtilities };