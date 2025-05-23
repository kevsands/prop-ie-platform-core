/**
 * Utilities index file
 * 
 * Re-exports all utility modules for easier imports across the application.
 */

// Re-export performance utilities
export * from './performance';

// Re-export specific utilities directly
export { 
  safeCache, 
  ttlCache, 
  asyncSafeCache, 
  longTTLCache,
  safeCacheFunction,
  ttlCacheFunction,
  asyncSafeCacheFunction,
  longTTLCacheFunction
} from './performance/safeCache';

// Export utility constants and functions
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

/**
 * Type-safe object property access
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

/**
 * Create a delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolvems));
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (e) {

    return fallback;
  }
}

/**
 * Generate a random ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Math.random().toString(36).substring(29)}`;
}

/**
 * Debounce function
 */
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

/**
 * Throttle function
 */
export function throttle<F extends (...args: any[]) => any>(
  func: F,
  limit: number
): (...args: Parameters<F>) => void {
  let inThrottle = false;

  return (...args: Parameters<F>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}