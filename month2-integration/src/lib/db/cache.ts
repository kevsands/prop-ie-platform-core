import { logger } from '../security/auditLogger';

/**
 * Database caching system for the PropIE AWS platform
 * Implements caching strategies for database queries to improve performance
 */

// Cache configuration
interface CacheConfig {
  ttl: number;          // Time to live in milliseconds
  maxSize: number;      // Maximum number of entries in the cache
  namespace: string;    // Cache namespace for grouping related entries
}

// Cache entry with expiration
interface CacheEntry<T> {
  value: T;
  expires: number;      // Expiration timestamp
  key: string;
}

// Default cache configuration
const DEFAULT_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000,   // 5 minutes default TTL
  maxSize: 1000,        // 1000 entries max
  namespace: 'default'
};

/**
 * QueryCache class for database layer
 * Provides a caching layer for database queries to reduce database load
 */
export class QueryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;
  
  /**
   * Create a new query cache
   * @param config Cache configuration options
   */
  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Start cache cleanup interval
    setInterval(() => this.cleanup(), 60 * 1000); // Run cleanup every minute
  }
  
  /**
   * Generate cache key from query and parameters
   * @param query SQL query or query identifier
   * @param params Query parameters
   * @returns Cache key
   */
  private generateKey(query: string, params: any[] = []): string {
    const paramsString = JSON.stringify(params);
    return `${this.config.namespace}:${query}:${paramsString}`;
  }
  
  /**
   * Get value from cache if available and not expired
   * @param query SQL query or query identifier
   * @param params Query parameters
   * @returns Cached value or undefined if not in cache or expired
   */
  get<T>(query: string, params: any[] = []): T | undefined {
    const key = this.generateKey(query, params);
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }
    
    // Check if entry has expired
    if (entry.expires < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value as T;
  }
  
  /**
   * Store value in cache
   * @param query SQL query or query identifier
   * @param params Query parameters
   * @param value Value to cache
   * @param ttl Optional TTL override (in ms)
   */
  set<T>(query: string, params: any[] = [], value: T, ttl?: number): void {
    // Enforce cache size limit
    if (this.cache.size >= this.config.maxSize) {
      this.removeOldest();
    }
    
    const key = this.generateKey(query, params);
    const expiration = Date.now() + (ttl || this.config.ttl);
    
    this.cache.set(key, {
      value,
      expires: expiration,
      key
    });
  }
  
  /**
   * Remove entry from cache
   * @param query SQL query or query identifier
   * @param params Query parameters
   */
  invalidate(query: string, params: any[] = []): void {
    const key = this.generateKey(query, params);
    this.cache.delete(key);
  }
  
  /**
   * Invalidate all cache entries matching a pattern
   * @param pattern Query pattern to match (will be used as substring)
   */
  invalidatePattern(pattern: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Invalidate all cache entries in namespace
   */
  invalidateNamespace(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith(`${this.config.namespace}:`)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Invalidate all cache entries
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Remove oldest cache entry
   */
  private removeOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires < oldestTime) {
        oldestTime = entry.expires;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
  
  /**
   * Remove expired cache entries
   */
  private cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires < now) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      logger.debug(`Cache cleanup: removed ${expiredCount} expired entries. Cache size: ${this.cache.size}`);
    }
  }
  
  /**
   * Get cache stats
   * @returns Cache statistics
   */
  getStats(): { size: number, maxSize: number, namespace: string } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      namespace: this.config.namespace
    };
  }
}

// Create singleton cache instances for different domains
export const userCache = new QueryCache({ namespace: 'users', ttl: 10 * 60 * 1000 }); // 10 minutes
export const developmentCache = new QueryCache({ namespace: 'developments', ttl: 30 * 60 * 1000 }); // 30 minutes
export const unitCache = new QueryCache({ namespace: 'units', ttl: 15 * 60 * 1000 }); // 15 minutes
export const salesCache = new QueryCache({ namespace: 'sales', ttl: 5 * 60 * 1000 }); // 5 minutes
export const documentCache = new QueryCache({ namespace: 'documents', ttl: 20 * 60 * 1000 }); // 20 minutes
export const financeCache = new QueryCache({ namespace: 'finance', ttl: 15 * 60 * 1000 }); // 15 minutes

// Helper function to create a cached function
export function cached<T, A extends any[]>(
  cacheName: string,
  fn: (...args: A) => Promise<T>,
  keyGenerator: (...args: A) => { query: string, params: any[] }
): (...args: A) => Promise<T> {
  // Determine which cache to use
  let cache: QueryCache;
  switch (cacheName) {
    case 'users': cache = userCache; break;
    case 'developments': cache = developmentCache; break;
    case 'units': cache = unitCache; break;
    case 'sales': cache = salesCache; break;
    case 'documents': cache = documentCache; break;
    case 'finance': cache = financeCache; break;
    default: cache = new QueryCache({ namespace: cacheName });
  }
  
  // Return cached function
  return async (...args: A): Promise<T> => {
    const { query, params } = keyGenerator(...args);
    
    // Check cache first
    const cachedResult = cache.get<T>(query, params);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    // Execute function if not in cache
    const result = await fn(...args);
    
    // Cache result
    cache.set(query, params, result);
    
    return result;
  };
}

// Export cache interface
export default {
  userCache,
  developmentCache,
  unitCache,
  salesCache,
  documentCache,
  financeCache,
  cached
};