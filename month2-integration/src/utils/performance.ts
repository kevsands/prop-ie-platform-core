/**
 * Performance utilities for the application
 * 
 * This file is a central export point for all performance-related utilities
 * to simplify imports and maintain consistent patterns across the codebase.
 */

'use client';

// Re-export all utilities from the performance subdirectory
export * from './performance/index';

// Add utility for warning on excessive operations
export function warnIfExcessive(
  operationCount: number, 
  operationType: string, 
  warningThreshold: number = 100
): void {
  if (process.env.NODE_ENV !== 'production' && operationCount > warningThreshold) {
    console.warn(
      `Performance warning: ${operationCount} ${operationType} operations detected. ` +
      `Consider optimizing to reduce overhead.`
    );
  }
}

/**
 * Safely execute a function with performance monitoring
 * @param fn Function to execute
 * @param label Label for performance tracking
 * @returns Result of the function
 */
export function withPerformanceTracking<T>(fn: () => T, label: string): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    const duration = performance.now() - start;
    if (duration > 50) { // Only log slow operations
      console.debug(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    }
  }
}