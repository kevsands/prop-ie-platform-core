'use server';

/**
 * Server-side caching utilities for Next.js
 * These are meant to be used in server components and API routes
 */

import { cache } from 'react';

/**
 * Creates a server-side cached function using React's cache
 * 
 * @param fn The function to cache
 * @returns A cached version of the function
 */
export async function serverCache<T extends (...args: any[]) => Promise<any>>(fn: T): Promise<T> {
  // Use React's cache function to memoize the result
  return cache(fn) as T;
}

export default serverCache;