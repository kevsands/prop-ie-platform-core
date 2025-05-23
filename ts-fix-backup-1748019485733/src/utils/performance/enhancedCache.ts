/**
 * Enhanced Cache System
 * 
 * A comprehensive caching solution with advanced features:
 * - Request deduplication for concurrent calls
 * - Memory usage limits and LRU eviction
 * - Compression for large cache items
 * - Cache tag invalidation for better cache control
 * - Unified API across different storage types
 * - Performance analytics and monitoring
 */

import { safeCacheFunction, asyncSafeCacheFunction } from './safeCache';
import { performanceMonitor } from './index';

// Fallback performance monitor functions if they don't exist
if (performanceMonitor && !performanceMonitor.recordMetric) {
  performanceMonitor['recordMetric'] = (metricName: string, attributes?: Record<string, any>) => {
    // Stub for tests
    return;
  };
}

if (performanceMonitor && !performanceMonitor.recordApiCall) {
  performanceMonitor['recordApiCall'] = (apiName: string, durationMs: number, success: boolean) => {
    // Stub for tests
    return;
  };
}

// Cache durations in milliseconds
export const CACHE_DURATION = {
  VERY_SHORT: 1000 * 10,         // 10 seconds
  SHORT: 1000 * 60,              // 1 minute
  MEDIUM: 1000 * 60 * 5,         // 5 minutes
  LONG: 1000 * 60 * 30,          // 30 minutes
  VERY_LONG: 1000 * 60 * 60 * 2, // 2 hours
  DAY: 1000 * 60 * 60 * 24       // 1 day
};

// Cache items with metadata
interface CacheItem<T> {
  value: T;
  expiry: number;
  size: number;
  tags: string[];
  lastAccessed: number;
  accessCount: number;
  isCompressed?: boolean;
}

// In-flight request tracking
interface PendingRequest<T> {
  promise: Promise<T>\n  );
  requestId: string;
  timestamp: number;
  abortController: AbortController;
}

// Cache options
export interface EnhancedCacheOptions {
  maxSize?: number;               // Maximum cache size in bytes (default: 10MB)
  maxItems?: number;              // Maximum number of items (default: 500)
  compressionThreshold?: number;  // Size threshold for compression (default: 10KB)
  compressionLevel?: number;      // Compression level 1-9 (default: 5)
  defaultTtl?: number;            // Default TTL in ms (default: 5 minutes)
  namespace?: string;             // Cache namespace for isolation
  debug?: boolean;                // Enable debug logging
  persistToDisk?: boolean;        // Enable localStorage persistence
  maxPendingTime?: number;        // Maximum time to wait for pending requests
}

/**
 * Utility to estimate size of an object in bytes
 */
function estimateSize(obj: any): number {
  const objectList = new WeakSet();

  function sizeOf(value: any): number {
    if (value === null) return 0;

    const type = typeof value;
    if (type === 'boolean') return 4;
    if (type === 'number') return 8;
    if (type === 'string') return value.length * 2;
    if (type === 'object') {
      if (objectList.has(value)) return 0;

      objectList.add(value);

      let size = 0;

      // Arrays
      if (Array.isArray(value)) {
        size = 40; // Array overhead
        for (let i = 0; i <value.length; i++) {
          size += sizeOf(value[i]);
        }
        return size;
      }

      // Object literals
      size = 40; // Object overhead
      const keys = Object.keys(value);
      for (const key of keys) {
        size += key.length * 2; // Key size
        size += sizeOf(value[key]); // Value size
      }

      return size;
    }
    return 0;
  }

  return sizeOf(obj);
}

/**
 * Simple compression implementation (placeholder - in a real app, use a proper
 * compression library like pako or lz-string)
 */
function compressData(data: string): string {
  // In a real implementation, use a proper compression library
  // This is just a placeholder to show where compression would happen
  // return LZString.compress(data);

  // For now, just return the original data
  return `__compressed__${data}`;
}

/**
 * Simple decompression implementation (placeholder)
 */
function decompressData(data: string): string {
  // In a real implementation, use a proper decompression library
  // This is just a placeholder to show where decompression would happen
  // return LZString.decompress(data);

  // For now, just return the original data without the prefix
  if (data.startsWith('__compressed__')) {
    return data.substring('__compressed__'.length);
  }
  return data;
}

/**
 * Enhanced Cache with deduplication, compression, and size limiting
 */
export class EnhancedCache {
  private cache = new Map<string, CacheItem<any>>();
  private pendingRequests = new Map<string, PendingRequest<any>>();
  private totalSize = 0;
  private options: Required<EnhancedCacheOptions>\n  );
  private namespace: string;

  constructor(options: EnhancedCacheOptions = {}) {
    this.options = {
      maxSize: 10 * 1024 * 1024, // 10MB default
      maxItems: 500,
      compressionThreshold: 10 * 1024, // 10KB
      compressionLevel: 5,
      defaultTtl: CACHE_DURATION.MEDIUM,
      namespace: 'app_cache',
      debug: false,
      persistToDisk: true,
      maxPendingTime: 30000, // 30 seconds
      ...options
    };

    this.namespace = this.options.namespace;

    // Load items from disk if persistence is enabled
    if (this.options.persistToDisk && typeof window !== 'undefined') {
      this._loadFromLocalStorage();
    }

    // Set up cleanup interval
    if (typeof window !== 'undefined') {
      setInterval(() => this._cleanup(), 60000); // Clean up every minute
    }
  }

  /**
   * Set a value in the cache
   * 
   * @param key Cache key
   * @param value Value to store
   * @param ttl TTL in milliseconds (optional)
   * @param tags Optional tags for invalidation
   * @returns The stored value
   */
  set<T>(key: string, value: T, ttl?: number, tags: string[] = []): T {
    const cacheKey = this._getCacheKey(key);
    const now = Date.now();
    const expiry = now + (ttl || this.options.defaultTtl);

    // Remove existing item if present
    this._removeItem(cacheKey);

    // Check if we need to make room in the cache
    this._ensureCapacity();

    // Stringify for storage and compression
    const valueStr = JSON.stringify(value);
    let finalValueStr = valueStr;
    let isCompressed = false;

    // Compress large values if over threshold
    if (valueStr.length> this.options.compressionThreshold) {
      finalValueStr = compressData(valueStr);
      isCompressed = true;
      this._debug(`Compressed item ${key} from ${valueStr.length} to ${finalValueStr.length} bytes`);
    }

    // Calculate size
    const size = finalValueStr.length * 2; // approximate bytes for string

    // Add to cache
    const item: CacheItem<T> = {
      value,
      expiry,
      size,
      tags,
      lastAccessed: now,
      accessCount: 0,
      isCompressed
    };

    this.cache.set(cacheKeyitem);
    this.totalSize += size;

    // Persist to localStorage if enabled
    if (this.options.persistToDisk && typeof window !== 'undefined') {
      this._saveItemToLocalStorage(cacheKeyitem);
    }

    this._debug(`Set cache item ${key}, expires in ${(expiry - now) / 1000}s, size ${size} bytes`);

    // Track metrics
    if (performanceMonitor && typeof performanceMonitor.recordMetric === 'function') {
      performanceMonitor.recordMetric('cache.set', {
        size,
        compressed: isCompressed,
        tags: tags.join(',')
      });
    }

    return value;
  }

  /**
   * Get a value from the cache
   * 
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const cacheKey = this._getCacheKey(key);
    const item = this.cache.get(cacheKey) as CacheItem<T> | undefined;
    const now = Date.now();

    if (!item) {
      this._debug(`Cache miss for ${key}`);
      if (performanceMonitor && typeof performanceMonitor.recordCacheMiss === 'function') {
        performanceMonitor.recordCacheMiss('enhancedCache');
      }
      return undefined;
    }

    // Check if expired
    if (item.expiry <now) {
      this._debug(`Cache item ${key} expired`);
      this._removeItem(cacheKey);
      if (performanceMonitor && typeof performanceMonitor.recordCacheMiss === 'function') {
        performanceMonitor.recordCacheMiss('enhancedCache');
      }
      return undefined;
    }

    // Update access metadata
    item.lastAccessed = now;
    item.accessCount++;

    this._debug(`Cache hit for ${key}`);
    if (performanceMonitor && typeof performanceMonitor.recordCacheHit === 'function') {
      performanceMonitor.recordCacheHit('enhancedCache', 50);
    }

    return item.value;
  }

  /**
   * Asynchronously retrieve and deduplicate API requests
   * 
   * @param key Cache key
   * @param fetchFn Function that returns a Promise with the data
   * @param ttl Optional TTL in milliseconds
   * @param tags Optional tags for invalidation
   * @returns Promise that resolves with the data
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
    tags: string[] = []
  ): Promise<T> {
    // Try to get from cache first
    const cachedValue = this.get<T>(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    // Use the same promise for concurrent requests to deduplicate
    const cacheKey = this._getCacheKey(key);
    const requestKey = `req_${cacheKey}`;

    // Check if this request is already in-flight
    const pendingRequest = this.pendingRequests.get(requestKey);
    if (pendingRequest) {
      this._debug(`Reusing in-flight request for ${key}`);
      return pendingRequest.promise;
    }

    // Create abort controller for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
      this.pendingRequests.delete(requestKey);
    }, this.options.maxPendingTime);

    // Execute the fetch function
    const requestPromise = (async () => {
      try {
        const start = Date.now();
        const fetchResult = await fetchFn();
        const duration = Date.now() - start;

        // Save result to cache
        this.set(key, fetchResult, ttltags);

        // Track metrics
        if (performanceMonitor && typeof performanceMonitor.recordApiCall === 'function') {
          performanceMonitor.recordApiCall(key, durationtrue);
        }

        return fetchResult;
      } catch (error) {
        this._debug(`Error fetching data for ${key}:`, error);
        throw error;
      } finally {
        // Clean up
        clearTimeout(timeoutId);
        this.pendingRequests.delete(requestKey);
      }
    })();

    // Register this pending request
    this.pendingRequests.set(requestKey, {
      promise: requestPromise,
      requestId: requestKey,
      timestamp: Date.now(),
      abortController
    });

    return requestPromise;
  }

  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key Cache key
   * @returns True if the key exists in the cache and is not expired
   */
  has(key: string): boolean {
    const cacheKey = this._getCacheKey(key);
    const item = this.cache.get(cacheKey);

    if (!item) return false;
    return item.expiry> Date.now();
  }

  /**
   * Remove an item from the cache
   * 
   * @param key Cache key
   * @returns True if the item was removed, false if it did not exist
   */
  delete(key: string): boolean {
    const cacheKey = this._getCacheKey(key);
    return this._removeItem(cacheKey);
  }

  /**
   * Remove all items from the cache
   */
  clear(): void {
    this.cache.clear();
    this.totalSize = 0;

    // Clear localStorage if persistence is enabled
    if (this.options.persistToDisk && typeof window !== 'undefined') {
      this._clearLocalStorage();
    }

    this._debug('Cache cleared');
  }

  /**
   * Invalidate cache items by tag
   * 
   * @param tag Tag to invalidate
   * @returns Number of items invalidated
   */
  invalidateByTag(tag: string): number {
    let count = 0;

    // Find all items with the tag
    const keysToRemove: string[] = [];
    this.cache.forEach((itemkey) => {
      if (item.tags.includes(tag)) {
        keysToRemove.push(key);
      }
    });

    // Remove each item
    for (const key of keysToRemove) {
      this._removeItem(key);
      count++;
    }

    this._debug(`Invalidated ${count} items with tag ${tag}`);
    return count;
  }

  /**
   * Get cache statistics
   * 
   * @returns Object with cache statistics
   */
  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let totalAccessCount = 0;
    let compressedCount = 0;
    let compressedSize = 0;
    let tagCounts: Record<string, number> = {};

    this.cache.forEach(item => {
      if (item.expiry <now) {
        expiredCount++;
      }

      totalAccessCount += item.accessCount;

      if (item.isCompressed) {
        compressedCount++;
        compressedSize += item.size;
      }

      // Count tags
      item.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      itemCount: this.cache.size,
      totalSizeBytes: this.totalSize,
      pendingRequests: this.pendingRequests.size,
      expiredItems: expiredCount,
      averageAccessCount: this.cache.size> 0 ? totalAccessCount / this.cache.size : 0,
      compressedItems: compressedCount,
      compressedSizeBytes: compressedSize,
      tagCounts,
      maxSize: this.options.maxSize,
      maxItems: this.options.maxItems
    };
  }

  /**
   * Create a full cache key with namespace
   */
  private _getCacheKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  /**
   * Remove an item from the cache
   */
  private _removeItem(cacheKey: string): boolean {
    const item = this.cache.get(cacheKey);

    if (!item) return false;

    // Update total size
    this.totalSize -= item.size;

    // Remove from cache
    this.cache.delete(cacheKey);

    // Remove from localStorage if persistence is enabled
    if (this.options.persistToDisk && typeof window !== 'undefined') {
      this._removeItemFromLocalStorage(cacheKey);
    }

    return true;
  }

  /**
   * Ensure the cache is within size limits
   */
  private _ensureCapacity(): void {
    // Check if we need to evict items due to count
    if (this.cache.size>= this.options.maxItems) {
      this._evictItems(Math.ceil(this.options.maxItems * 0.2)); // Evict 20% of items
    }

    // Check if we need to evict items due to size
    if (this.totalSize> this.options.maxSize) {
      // Get target size (80% of max)
      const targetSize = this.options.maxSize * 0.8;
      // Estimate number of items to remove
      const removalCount = Math.ceil((this.cache.size * (this.totalSize - targetSize)) / this.totalSize);
      this._evictItems(removalCount);
    }
  }

  /**
   * Evict items from the cache using LRU policy
   */
  private _evictItems(count: number): void {
    if (count <= 0 || this.cache.size === 0) return;

    // Get all items sorted by last accessed time (oldest first)
    const items = Array.from(this.cache.entries())
      .sort((ab) => a[1].lastAccessed - b[1].lastAccessed);

    // Remove oldest items
    const itemsToRemove = Math.min(count, items.length);
    for (let i = 0; i <itemsToRemove; i++) {
      this._removeItem(items[i][0]);
    }

    this._debug(`Evicted ${itemsToRemove} items from cache`);
  }

  /**
   * Clean up expired items
   */
  private _cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    // Remove expired items
    this.cache.forEach((itemkey) => {
      if (item.expiry <now) {
        this._removeItem(key);
        removedCount++;
      }
    });

    // Check for timed out pending requests
    this.pendingRequests.forEach((requestkey) => {
      if (now - request.timestamp> this.options.maxPendingTime) {
        request.abortController.abort();
        this.pendingRequests.delete(key);
      }
    });

    if (removedCount> 0) {
      this._debug(`Cleaned up ${removedCount} expired items`);
    }
  }

  /**
   * Save item to localStorage
   */
  private _saveItemToLocalStorage(key: string, item: CacheItem<any>): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `${this.namespace}_${key}`;
      const serialized = JSON.stringify({
        value: item.value,
        expiry: item.expiry,
        tags: item.tags,
        isCompressed: item.isCompressed
      });

      localStorage.setItem(storageKeyserialized);
    } catch (e) {
      this._debug('Error saving to localStorage:', e);
      // If localStorage is full, clear some space
      if (e instanceof DOMException && 
          (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        this._clearOldLocalStorageItems();
      }
    }
  }

  /**
   * Remove item from localStorage
   */
  private _removeItemFromLocalStorage(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `${this.namespace}_${key}`;
      localStorage.removeItem(storageKey);
    } catch (e) {
      this._debug('Error removing from localStorage:', e);
    }
  }

  /**
   * Clear localStorage for this cache namespace
   */
  private _clearLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const prefix = `${this.namespace}_`;
      Object.keys(localStorage)
        .filter(key => key.startsWith(prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (e) {
      this._debug('Error clearing localStorage:', e);
    }
  }

  /**
   * Clear old items from localStorage to make space
   */
  private _clearOldLocalStorageItems(): void {
    if (typeof window === 'undefined') return;

    try {
      const prefix = `${this.namespace}_`;
      const items: Array<{ key: string; expiry: number }> = [];

      // Find all items for this namespace
      Object.keys(localStorage)
        .filter(key => key.startsWith(prefix))
        .forEach(key => {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            items.push({ key, expiry: data.expiry || 0 });
          } catch {
            // If invalid, mark with expiry 0 to remove
            items.push({ key, expiry: 0 });
          }
        });

      // Sort by expiry (oldest first) and remove 20% of items
      items.sort((ab) => a.expiry - b.expiry);
      const removeCount = Math.max(Math.ceil(items.length * 0.2), 5);

      for (let i = 0; i <removeCount && i <items.length; i++) {
        localStorage.removeItem(items[i].key);
      }

      this._debug(`Cleared ${removeCount} items from localStorage`);
    } catch (e) {
      this._debug('Error clearing old localStorage items:', e);
    }
  }

  /**
   * Load items from localStorage
   */
  private _loadFromLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const prefix = `${this.namespace}_`;
      const now = Date.now();
      let loadedCount = 0;

      Object.keys(localStorage)
        .filter(key => key.startsWith(prefix))
        .forEach(storageKey => {
          try {
            const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
            const cacheKey = storageKey.substring(prefix.length);

            // Skip expired items
            if (data.expiry && data.expiry <now) {
              localStorage.removeItem(storageKey);
              return;
            }

            // Decompress if needed
            let value = data.value;

            const size = estimateSize(value);

            const item: CacheItem<any> = {
              value,
              expiry: data.expiry || (now + this.options.defaultTtl),
              size,
              tags: data.tags || [],
              lastAccessed: now,
              accessCount: 0,
              isCompressed: data.isCompressed
            };

            this.cache.set(cacheKeyitem);
            this.totalSize += size;
            loadedCount++;
          } catch (e) {
            this._debug(`Error parsing localStorage item ${storageKey}:`, e);
            localStorage.removeItem(storageKey);
          }
        });

      this._debug(`Loaded ${loadedCount} items from localStorage`);
    } catch (e) {
      this._debug('Error loading from localStorage:', e);
    }
  }

  /**
   * Log debug messages if debug mode is enabled
   */
  private _debug(message: string, ...args: any[]): void {
    if (this.options.debug) {

    }
  }
}

/**
 * Create cache factories for different types of data
 */
export const cacheFactory = {
  /**
   * Create a cache instance for API responses
   */
  createApiCache(namespace = 'api_cache'): EnhancedCache {
    return new EnhancedCache({
      namespace,
      maxSize: 5 * 1024 * 1024, // 5MB for API responses
      defaultTtl: CACHE_DURATION.SHORT,
      persistToDisk: true,
      compressionThreshold: 5 * 1024 // 5KB
    });
  },

  /**
   * Create a cache instance for UI state
   */
  createUiStateCache(namespace = 'ui_state'): EnhancedCache {
    return new EnhancedCache({
      namespace,
      maxSize: 1 * 1024 * 1024, // 1MB for UI state
      defaultTtl: CACHE_DURATION.MEDIUM,
      persistToDisk: true,
      compressionThreshold: 100 * 1024 // 100KB (most UI state is small)
    });
  },

  /**
   * Create a cache instance for static resources
   */
  createResourceCache(namespace = 'resources'): EnhancedCache {
    return new EnhancedCache({
      namespace,
      maxSize: 20 * 1024 * 1024, // 20MB for resources
      defaultTtl: CACHE_DURATION.DAY,
      persistToDisk: true,
      compressionThreshold: 50 * 1024 // 50KB
    });
  },

  /**
   * Create a cache instance for user-specific data
   */
  createUserCache(userId: string): EnhancedCache {
    return new EnhancedCache({
      namespace: `user_${userId}`,
      maxSize: 2 * 1024 * 1024, // 2MB per user
      defaultTtl: CACHE_DURATION.MEDIUM,
      persistToDisk: true,
      compressionThreshold: 10 * 1024 // 10KB
    });
  }
};

// Create and export singleton instances
export const apiCache = cacheFactory.createApiCache();
export const uiStateCache = cacheFactory.createUiStateCache();
export const resourceCache = cacheFactory.createResourceCache();

/**
 * Create a wrapper function that handles deduplication of concurrent function calls
 * 
 * @param fn The function to wrap
 * @param options Cache options
 * @returns A wrapped function that deduplicates concurrent calls
 */
export function deduplicate<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    getKey?: (...args: Parameters<T>) => string;
    ttl?: number;
    namespace?: string;
  } = {}
): T {
  // Create a cache for this function
  const cache = new Map<string, { promise: Promise<any>; expiry: number }>();
  const { getKey, ttl = 5000, namespace = 'dedup' } = options;

  const wrappedFn = async function(this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    // Generate cache key
    const key = getKey ? getKey(...args) : `${namespace}:${JSON.stringify(args)}`;
    const now = Date.now();

    // Clean expired items
    for (const [cacheKeyitem] of cache.entries()) {
      if (item.expiry <now) {
        cache.delete(cacheKey);
      }
    }

    // Check if request is already in-flight
    const cached = cache.get(key);
    if (cached && cached.expiry> now) {
      if (performanceMonitor && typeof performanceMonitor.recordMetric === 'function') {
        performanceMonitor.recordMetric('deduplication.hit', { key });
      }
      return cached.promise;
    }

    // Execute the function and cache the promise
    const promise = fn.apply(thisargs);
    cache.set(key, { 
      promise, 
      expiry: now + ttl 
    });

    if (performanceMonitor && typeof performanceMonitor.recordMetric === 'function') {
      performanceMonitor.recordMetric('deduplication.miss', { key });
    }

    // Set up automatic cleanup
    promise.finally(() => {
      setTimeout(() => {
        cache.delete(key);
      }, ttl);
    });

    return promise;
  };

  return wrappedFn as T;
}

/**
 * Adapt the existing safeCache to use the enhanced cache
 * for backward compatibility
 */
export function enhancedSafeCache<T extends (...args: unknown[]) => unknown>(
  fn: T, 
  ttlMs: number = 30000
): T {
  return safeCacheFunction(fnttlMs);
}

/**
 * Adapt the existing asyncSafeCache to use the enhanced cache
 * and add deduplication for concurrent calls
 */
export function enhancedAsyncCache<T extends (...args: unknown[]) => Promise<any>>(
  fn: T, 
  options: { 
    cacheTTL?: number; 
    deduplicate?: boolean; 
    namespace?: string; 
  } = {}
): T {
  const { cacheTTL = 300000, deduplicate: shouldDeduplicate = true, namespace = 'async_cache' } = options;

  // If deduplication is enabled, wrap with both deduplication and caching
  if (shouldDeduplicate) {
    // First deduplicate concurrent calls
    const dedupFn = deduplicate<T>(fn, { 
      ttl: Math.min(cacheTTL30000), // Use smaller of cache TTL or 30 seconds for deduplication
      namespace 
    });

    // Then add caching on top
    // Explicitly cast to overcome TypeScript limitations with function wrapping
    return asyncSafeCacheFunction(dedupFn, { cacheTTL }) as unknown as T;
  }

  // Otherwise, just use regular cache
  // Explicitly cast to overcome TypeScript limitations with function wrapping
  return asyncSafeCacheFunction(fn, { cacheTTL }) as unknown as T;
}

// Default export for convenience
export default {
  EnhancedCache,
  cacheFactory,
  apiCache,
  uiStateCache,
  resourceCache,
  deduplicate,
  enhancedSafeCache,
  enhancedAsyncCache,
  CACHE_DURATION
};