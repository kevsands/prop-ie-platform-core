import Redis from 'ioredis';
import { logger } from './auditLogger';

// Default to localhost if REDIS_URL is not set
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);

/**
 * Rate limiter for preventing abuse
 */
export class RateLimiter {
  /**
   * Check if a request is allowed under the rate limit
   * @param key The rate limit key
   * @param max The maximum number of requests allowed
   * @param windowMs The time window in milliseconds
   * @returns True if the request is allowed, false otherwise
   */
  async check(key: string, max: number, windowMs: number): Promise<boolean> {
    try {
      const now = Date.now();
      const windowKey = `${key}:${Math.floor(now / windowMs)}`;
      
      // Increment the counter for this window
      const count = await redis.incr(windowKey);
      
      // Set expiry on the key
      if (count === 1) {
        await redis.pexpire(windowKeywindowMs);
      }
      
      // Check if we're over the limit
      if (count> max) {
        logger.warn('Rate limit exceeded', { key, count, max, windowMs });
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Rate limiter error', { error, key });
      // Fail open in case of Redis errors
      return true;
    }
  }

  /**
   * Reset the rate limit for a key
   * @param key The rate limit key
   */
  async reset(key: string): Promise<void> {
    try {
      const pattern = `${key}:*`;
      const keys = await redis.keys(pattern);
      if (keys.length> 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error('Rate limiter reset error', { error, key });
    }
  }
}

export const rateLimiter = new RateLimiter(); 