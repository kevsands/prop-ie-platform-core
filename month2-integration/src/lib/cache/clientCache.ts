// src/lib/cache/dataCache.ts

interface CacheEntry<T> {
    data: T;
    expires: number | null;
  }
  
  // Cache options
  interface CacheOptions {
    /** Time-to-live in milliseconds. null = no expiration */
    ttl?: number | null;
    /** Whether to bypass the cache and force a fresh fetch */
    bypassCache?: boolean;
  }
  
  /**
   * A generic data cache that can be used to cache any type of data.
   * Uses in-memory storage with optional TTL.
   */
  class DataCache {
    private cache: Map<string, CacheEntry<any>> = new Map();
    
    /**
     * Get an item from the cache
     * @param key Cache key
     * @returns The cached value or null if not found or expired
     */
    get<T>(key: string): T | null {
      const entry = this.cache.get(key);
      
      if (!entry) {
        return null;
      }
      
      // Check if entry has expired
      if (entry.expires !== null && entry.expires < Date.now()) {
        this.cache.delete(key);
        return null;
      }
      
      return entry.data as T;
    }
    
    /**
     * Set an item in the cache
     * @param key Cache key
     * @param data Data to cache
     * @param ttl Time-to-live in milliseconds (optional)
     */
    set<T>(key: string, data: T, ttl: number | null = null): void {
      const expires = ttl !== null ? Date.now() + ttl : null;
      
      this.cache.set(key, {
        data,
        expires
      });
    }
    
    /**
     * Check if an item exists in the cache and is not expired
     * @param key Cache key
     * @returns True if item exists and is not expired
     */
    has(key: string): boolean {
      const entry = this.cache.get(key);
      
      if (!entry) {
        return false;
      }
      
      // Check if entry has expired
      if (entry.expires !== null && entry.expires < Date.now()) {
        this.cache.delete(key);
        return false;
      }
      
      return true;
    }
    
    /**
     * Remove an item from the cache
     * @param key Cache key
     */
    delete(key: string): void {
      this.cache.delete(key);
    }
    
    /**
     * Remove all items from the cache
     */
    clear(): void {
      this.cache.clear();
    }
    
    /**
     * Get all cache keys
     * @returns Array of cache keys
     */
    keys(): string[] {
      return Array.from(this.cache.keys());
    }
    
    /**
     * Get cache stats
     * @returns Object with cache statistics
     */
    stats(): { size: number; activeTTL: number; expired: number } {
      let activeTTL = 0;
      let expired = 0;
      
      this.cache.forEach((entry) => {
        if (entry.expires !== null) {
          if (entry.expires < Date.now()) {
            expired++;
          } else {
            activeTTL++;
          }
        }
      });
      
      return {
        size: this.cache.size,
        activeTTL,
        expired
      };
    }
    
    /**
     * Remove expired items from the cache
     * @returns Number of items removed
     */
    cleanup(): number {
      let removed = 0;
      
      this.cache.forEach((entry, key) => {
        if (entry.expires !== null && entry.expires < Date.now()) {
          this.cache.delete(key);
          removed++;
        }
      });
      
      return removed;
    }
  }
  
  // Create a singleton instance
  export const dataCache = new DataCache();
  
  /**
   * Wrap an async function with caching
   * @param fn Function to cache
   * @param keyFn Function to generate cache key
   * @param options Cache options
   * @returns Cached function result
   */
  export async function withCache<T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>,
    keyFn: (...args: Args) => string,
    options: CacheOptions = {}
  ): Promise<T> {
    const args = Array.from(arguments).slice(3) as Args;
    const key = keyFn(...args);
    
    // Return from cache if available and not bypassing
    if (!options.bypassCache) {
      const cached = dataCache.get<T>(key);
      if (cached !== null) {
        return cached;
      }
    }
    
    // Execute the function
    const result = await fn(...args);
    
    // Cache the result if TTL is set
    if (options.ttl !== undefined) {
      dataCache.set(key, result, options.ttl);
    }
    
    return result;
  }
  
  export default dataCache;