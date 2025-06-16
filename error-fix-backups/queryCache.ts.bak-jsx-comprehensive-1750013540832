import { redis } from '@/lib/redis';
import { logger } from '@/lib/security/auditLogger';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key: string;
  tags?: string[]; // Cache tags for invalidation
}

/**
 * Cache wrapper for expensive database queries
 */
export class QueryCache {
  private static instance: QueryCache;

  private constructor() {}

  static getInstance(): QueryCache {
    if (!QueryCache.instance) {
      QueryCache.instance = new QueryCache();
    }
    return QueryCache.instance;
  }

  /**
   * Get cached data or execute query and cache result
   */
  async getOrSet<T>(
    options: CacheOptions,
    queryFn: () => Promise<T>
  ): Promise<T> {
    // If Redis is not available, execute query directly
    if (!redis) {
      return queryFn();
    }

    try {
      // Try to get from cache
      const cached = await redis.get(options.key);
      if (cached) {
        logger.info('Cache hit', { key: options.key });
        return JSON.parse(cached);
      }

      // Execute query
      logger.info('Cache miss', { key: options.key });
      const result = await queryFn();

      // Store in cache
      const ttl = options.ttl || 300; // Default 5 minutes
      await redis.setex(options.key, ttl, JSON.stringify(result));

      // Store tags for invalidation
      if (options.tags && options.tags.length > 0) {
        for (const tag of options.tags) {
          await redis.sadd(`tag:${tag}`, options.key);
          await redis.expire(`tag:${tag}`, ttl);
        }
      }

      return result;
    } catch (error) {
      logger.error('Cache error', { error, key: options.key });
      // Fallback to query execution
      return queryFn();
    }
  }

  /**
   * Invalidate cache by key
   */
  async invalidate(key: string): Promise<void> {
    if (!redis) return;

    try {
      await redis.del(key);
      logger.info('Cache invalidated', { key });
    } catch (error) {
      logger.error('Cache invalidation error', { error, key });
    }
  }

  /**
   * Invalidate cache by tag
   */
  async invalidateByTag(tag: string): Promise<void> {
    if (!redis) return;

    try {
      // Get all keys with this tag
      const keys = await redis.smembers(`tag:${tag}`);
      
      if (keys.length > 0) {
        // Delete all keys
        await redis.del(...keys);
        // Delete the tag set
        await redis.del(`tag:${tag}`);
        
        logger.info('Cache invalidated by tag', { tag, count: keys.length });
      }
    } catch (error) {
      logger.error('Cache tag invalidation error', { error, tag });
    }
  }

  /**
   * Clear all cache
   */
  async flush(): Promise<void> {
    if (!redis) return;

    try {
      await redis.flushdb();
      logger.info('Cache flushed');
    } catch (error) {
      logger.error('Cache flush error', { error });
    }
  }
}

export const queryCache = QueryCache.getInstance();

/**
 * Cache decorator for class methods
 */
export function Cacheable(options: Omit<CacheOptions, 'key'>) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Generate cache key from method name and arguments
      const key = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      
      return queryCache.getOrSet(
        { ...options, key },
        () => originalMethod.apply(this, args)
      );
    };

    return descriptor;
  };
}