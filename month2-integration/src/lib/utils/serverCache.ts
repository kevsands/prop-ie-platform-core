/**
 * Server-side cache utility for use with Next.js Server Components
 * 
 * This version is specifically designed to work in server-side contexts
 * without the 'use client' directive.
 * 
 * This implementation integrates with the performance monitoring system
 * to track cache hit/miss rates.
 */

import { asyncSafeCache, safeCache } from '@/utils/performance/safeCache';

/**
 * Simple server-side cache function enhanced with performance tracking
 */
export function serverCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    tags?: string[];
    revalidate?: number | false;
    keyParts?: string[];
    next?: {
      revalidate?: number | false;
      tags?: string[];
    };
  } = {}
): T {
  // Convert revalidate to TTL in milliseconds for asyncSafeCache
  const ttlMs = options.revalidate === false
    ? undefined
    : (options.revalidate || options.next?.revalidate || 60) * 1000;

  return asyncSafeCache(fn, {
    cacheTTL: ttlMs
  });
}

/**
 * Create a simple server cache for any function
 */
export function createServerCache<T extends (...args: any[]) => any>(fn: T): T {
  // Use safeCache with performance tracking
  return safeCache(fn);
}

export default serverCache;