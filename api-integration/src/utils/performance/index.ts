/**
 * Performance Monitoring Utilities
 */

export interface PerformanceReport {
  timestamp: number;
  pageLoadTime?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
  apiTimings: Array<{
    url: string;
    method: string;
    status: number;
    duration: number;
    size?: number;
  }>;
  componentRenderTimes: Record<string, number>;
  securityMetrics?: {
    threatDetectionDuration?: number;
    securityCheckOverhead?: number;
    validationDuration?: number;
    csrfTokenValidationTime?: number;
    correlatedEvents?: number;
  };
}

export interface ComponentTiming {
  componentName: string;
  startTime: number;
  endTime?: number;
  duration: number;
}

export interface PerformanceMetric {
  value: number;
  timestamp: number;
  toFixed?: (digits: number) => string;
}

export interface WebVitalMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
  timestamp: number;
  status?: 'good' | 'warning' | 'critical';
}

export const performanceMonitor = {
  addObserver(callback: (report: PerformanceReport) => void) {
    // Empty implementation for now
  },
  recordCacheHit(cacheId: string, timeSaved: number) {
    // Empty implementation
  },
  recordCacheMiss(cacheId: string) {
    // Empty implementation
  },
  recordOperationTime(operationId: string, timeMs: number) {
    // Empty implementation
  },
  startTiming(operationId: string, autoEnd: boolean = false): number {
    // Empty implementation
    return -1;
  },
  endTiming(timingId: number) {
    // Empty implementation
  },
  // Add these methods for withMemo.tsx compatibility
  startRenderTiming(componentName: string): number {
    // Empty implementation, returns a timing ID
    return -1;
  },
  endRenderTiming(timingId: number) {
    // Empty implementation
  },
  getComponentTimings(): ComponentTiming[] {
    // Empty implementation
    return [];
  },
  clearTimings() {
    // Empty implementation
  },
  recordMetric(metricName: string, attributes?: Record<string, any>) {
    // Empty implementation for test compatibility
    // This method is used in enhancedCache.ts
  },
  recordApiCall(apiName: string, durationMs: number, success: boolean) {
    // Empty implementation for test compatibility
    // This method is used in enhancedCache.ts
  }
};

/**
 * Utility to warn if a value is excessively large
 * Used by analytics for performance optimization
 */
export function warnIfExcessive(value: any, name: string, limit: number = 1000): void {
  try {
    if (Array.isArray(value) && value.length > limit) {
      console.warn(`Warning: ${name} contains ${value.length} items, which exceeds recommended limit of ${limit}.`);
    } else if (typeof value === 'object' && value !== null) {
      const size = JSON.stringify(value).length;
      if (size > limit * 100) { // Using characters as proxy for size
        console.warn(`Warning: ${name} is ${(size / 1024).toFixed(2)}KB, which exceeds recommended size.`);
      }
    }
  } catch (e) {
    // Ignore errors in warning function to prevent crashes
  }
}

// Import and export all cache utilities with multiple patterns for compatibility
import cacheUtilities, {
  safeCache,
  safeCacheFunction,
  ttlCache,
  ttlCacheFunction,
  asyncSafeCache,
  asyncSafeCacheFunction,
  longTTLCache as longTTLCacheObj,
  longTTLCacheFunction,
  isFunction
} from './safeCache';

// Direct exports from safeCache
export {
  safeCache,
  safeCacheFunction,
  ttlCache,
  ttlCacheFunction,
  asyncSafeCache,
  asyncSafeCacheFunction,
  longTTLCacheObj as longTTLCacheObject,
  longTTLCacheFunction,
  isFunction
};

// Export the cacheUtilities as a named export for compatibility
export { cacheUtilities };

// Create a wrapper function that simulates the old API for longTTLCache
export function longTTLCache<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  const wrappedFn = async function(this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    try {
      // Create a cache key
      const key = `ltc:${fn.name || 'anonymous'}:${JSON.stringify(args)}`;
      
      // Check cache
      const cached = longTTLCacheObj.get(key);
      if (cached !== null) {
        return cached as ReturnType<T>;
      }
      
      // Call original function
      const result = await fn.apply(this || null, args);
      
      // Cache result with long TTL (30 minutes)
      longTTLCacheObj.set(key, result, 30 * 60 * 1000);
      
      return result as ReturnType<T>;
    } catch (error) {
      console.warn('longTTLCache wrapper error:', error);
      // Fall back to direct function call
      return fn.apply(this || null, args) as ReturnType<T>;
    }
  };
  
  return wrappedFn as T;
}

// Import and re-export usePerformanceMonitoring as usePerformance for compatibility
import { usePerformanceMonitoring } from './monitor';
export const usePerformance = usePerformanceMonitoring;
export { usePerformanceMonitoring };