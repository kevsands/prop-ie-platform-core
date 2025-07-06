/**
 * Cache manager for GraphQL responses
 * Provides simple in-memory caching with invalidation
 */
export class CacheManager {
  private cache: Map<string, any> = new Map();
  private keysByOperation: Map<string, Set<string>> = new Map();
  private expiryTimes: Map<string, number> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get a value from the cache
   */
  public async get(key: string): Promise<any> {
    // Check if key exists and hasn't expired
    if (this.cache.has(key)) {
      const expiryTime = this.expiryTimes.get(key);
      if (expiryTime && expiryTime > Date.now()) {
        return this.cache.get(key);
      } else {
        // Remove expired item
        this.delete(key);
      }
    }
    return null;
  }

  /**
   * Set a value in the cache with optional TTL
   */
  public async set(key: string, value: any, ttl = this.defaultTTL): Promise<void> {
    this.cache.set(key, value);
    this.expiryTimes.set(key, Date.now() + ttl);
    
    // Extract operation from GraphQL result if available
    if (value && value.context && value.context.operationName) {
      const operation = value.context.operationName;
      if (!this.keysByOperation.has(operation)) {
        this.keysByOperation.set(operation, new Set());
      }
      this.keysByOperation.get(operation)?.add(key);
    }
  }

  /**
   * Delete a specific key from the cache
   */
  public async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.expiryTimes.delete(key);
    
    // Remove from operation tracking
    for (const [operation, keys] of this.keysByOperation.entries()) {
      if (keys.has(key)) {
        keys.delete(key);
        if (keys.size === 0) {
          this.keysByOperation.delete(operation);
        }
      }
    }
  }

  /**
   * Invalidate all cache entries related to a specific operation
   */
  public async invalidateRelated(operation: string): Promise<void> {
    // Extract operation name from GraphQL operation
    const operationName = operation.split('{')[0].trim();
    
    // Find all keys related to this operation
    const keys = this.keysByOperation.get(operationName);
    if (keys) {
      // Delete all related cache entries
      for (const key of keys) {
        this.cache.delete(key);
        this.expiryTimes.delete(key);
      }
      // Clear the operation keys
      this.keysByOperation.delete(operationName);
    }
  }

  /**
   * Clear the entire cache
   */
  public async clear(): Promise<void> {
    this.cache.clear();
    this.keysByOperation.clear();
    this.expiryTimes.clear();
  }
}

// Export a default instance for backwards compatibility
export default new CacheManager();