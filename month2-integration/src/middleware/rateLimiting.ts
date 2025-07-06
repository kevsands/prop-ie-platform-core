/**
 * ================================================================================
 * PRODUCTION RATE LIMITING MIDDLEWARE
 * Advanced rate limiting with multiple strategies and Redis backend
 * ================================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { productionCacheService } from '@/services/ProductionCacheService';

// Rate limiting configurations
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  onLimitReached?: (req: NextRequest, identifier: string) => void;
  message?: string;
  headers?: boolean;
}

// Rate limit entry structure
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

// Rate limiting strategies
export enum RateLimitStrategy {
  FIXED_WINDOW = 'fixed_window',
  SLIDING_WINDOW = 'sliding_window',
  TOKEN_BUCKET = 'token_bucket'
}

/**
 * Advanced Rate Limiting Service
 */
export class RateLimitingService {
  private strategy: RateLimitStrategy;
  private defaultConfig: RateLimitConfig;

  constructor(strategy: RateLimitStrategy = RateLimitStrategy.SLIDING_WINDOW) {
    this.strategy = strategy;
    this.defaultConfig = {
      windowMs: 60000, // 1 minute
      maxRequests: 100,
      headers: true,
      message: 'Too many requests, please try again later.'
    };
  }

  /**
   * Create rate limiter middleware
   */
  createLimiter(config: Partial<RateLimitConfig> = {}) {
    const finalConfig = { ...this.defaultConfig, ...config };

    return async (req: NextRequest): Promise<NextResponse | null> => {
      const identifier = this.getIdentifier(req, finalConfig);
      const cacheKey = `rate_limit:${identifier}`;

      try {
        const isLimited = await this.checkRateLimit(cacheKey, finalConfig);
        
        if (isLimited.limited) {
          // Log rate limit hit
          console.warn(`Rate limit exceeded for ${identifier}`, {
            path: req.nextUrl.pathname,
            userAgent: req.headers.get('user-agent'),
            timestamp: new Date().toISOString()
          });

          if (finalConfig.onLimitReached) {
            finalConfig.onLimitReached(req, identifier);
          }

          return this.createLimitResponse(finalConfig, isLimited);
        }

        // Add rate limit headers to successful requests
        if (finalConfig.headers) {
          return this.addRateLimitHeaders(null, isLimited);
        }

        return null; // Allow request to continue

      } catch (error) {
        console.error('Rate limiting error:', error);
        // Fail open - allow request if rate limiting fails
        return null;
      }
    };
  }

  /**
   * Check if request should be rate limited
   */
  private async checkRateLimit(
    cacheKey: string, 
    config: RateLimitConfig
  ): Promise<{
    limited: boolean;
    remaining: number;
    resetTime: number;
    totalHits: number;
  }> {
    const now = Date.now();
    
    switch (this.strategy) {
      case RateLimitStrategy.SLIDING_WINDOW:
        return this.slidingWindowCheck(cacheKey, config, now);
      case RateLimitStrategy.TOKEN_BUCKET:
        return this.tokenBucketCheck(cacheKey, config, now);
      default:
        return this.fixedWindowCheck(cacheKey, config, now);
    }
  }

  /**
   * Fixed window rate limiting
   */
  private async fixedWindowCheck(
    cacheKey: string,
    config: RateLimitConfig,
    now: number
  ) {
    const windowStart = Math.floor(now / config.windowMs) * config.windowMs;
    const windowKey = `${cacheKey}:${windowStart}`;
    
    let entry = await productionCacheService.get<RateLimitEntry>(windowKey);
    
    if (!entry) {
      entry = {
        count: 1,
        resetTime: windowStart + config.windowMs,
        blocked: false
      };
      await productionCacheService.set(windowKey, entry, Math.ceil(config.windowMs / 1000));
      
      return {
        limited: false,
        remaining: config.maxRequests - 1,
        resetTime: entry.resetTime,
        totalHits: 1
      };
    }

    entry.count++;
    await productionCacheService.set(windowKey, entry, Math.ceil(config.windowMs / 1000));

    const limited = entry.count > config.maxRequests;
    
    return {
      limited,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      totalHits: entry.count
    };
  }

  /**
   * Sliding window rate limiting (more accurate)
   */
  private async slidingWindowCheck(
    cacheKey: string,
    config: RateLimitConfig,
    now: number
  ) {
    const windowStart = now - config.windowMs;
    const currentWindow = Math.floor(now / config.windowMs) * config.windowMs;
    const previousWindow = currentWindow - config.windowMs;
    
    const currentKey = `${cacheKey}:${currentWindow}`;
    const previousKey = `${cacheKey}:${previousWindow}`;
    
    const [currentCount, previousCount] = await Promise.all([
      productionCacheService.get<number>(currentKey) || 0,
      productionCacheService.get<number>(previousKey) || 0
    ]);

    // Calculate sliding window count
    const timeInCurrentWindow = now - currentWindow;
    const percentageOfCurrentWindow = timeInCurrentWindow / config.windowMs;
    const percentageOfPreviousWindow = 1 - percentageOfCurrentWindow;
    
    const estimatedCount = Math.floor(
      (currentCount * percentageOfCurrentWindow) + 
      (previousCount * percentageOfPreviousWindow)
    );

    // Increment current window count
    const newCurrentCount = currentCount + 1;
    await productionCacheService.set(
      currentKey, 
      newCurrentCount, 
      Math.ceil(config.windowMs / 1000)
    );

    const limited = estimatedCount >= config.maxRequests;
    
    return {
      limited,
      remaining: Math.max(0, config.maxRequests - estimatedCount - 1),
      resetTime: currentWindow + config.windowMs,
      totalHits: estimatedCount + 1
    };
  }

  /**
   * Token bucket rate limiting (burst handling)
   */
  private async tokenBucketCheck(
    cacheKey: string,
    config: RateLimitConfig,
    now: number
  ) {
    const bucketKey = `${cacheKey}:bucket`;
    
    interface TokenBucket {
      tokens: number;
      lastRefill: number;
    }
    
    let bucket = await productionCacheService.get<TokenBucket>(bucketKey);
    
    if (!bucket) {
      bucket = {
        tokens: config.maxRequests - 1, // Consume one token for this request
        lastRefill: now
      };
    } else {
      // Refill tokens based on elapsed time
      const timePassed = now - bucket.lastRefill;
      const tokensToAdd = Math.floor(timePassed / config.windowMs * config.maxRequests);
      
      bucket.tokens = Math.min(config.maxRequests, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
      
      // Consume one token
      bucket.tokens = Math.max(0, bucket.tokens - 1);
    }
    
    await productionCacheService.set(
      bucketKey, 
      bucket, 
      Math.ceil(config.windowMs / 1000) * 2
    );
    
    const limited = bucket.tokens < 0;
    
    return {
      limited,
      remaining: Math.max(0, bucket.tokens),
      resetTime: now + config.windowMs,
      totalHits: config.maxRequests - bucket.tokens
    };
  }

  /**
   * Generate unique identifier for rate limiting
   */
  private getIdentifier(req: NextRequest, config: RateLimitConfig): string {
    if (config.keyGenerator) {
      return config.keyGenerator(req);
    }

    // Try multiple methods to get client identifier
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwarded?.split(',')[0] || realIp || req.ip || 'unknown';
    
    // For authenticated requests, also consider user ID
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      try {
        // Extract user info from JWT (simplified)
        const token = authHeader.replace('Bearer ', '');
        const payload = JSON.parse(atob(token.split('.')[1]));
        return `user:${payload.userId}:${clientIp}`;
      } catch {
        // Fall back to IP-based limiting
      }
    }
    
    return `ip:${clientIp}`;
  }

  /**
   * Create rate limit exceeded response
   */
  private createLimitResponse(
    config: RateLimitConfig,
    limitInfo: { remaining: number; resetTime: number; totalHits: number }
  ): NextResponse {
    const response = NextResponse.json(
      { 
        error: config.message,
        retryAfter: Math.ceil((limitInfo.resetTime - Date.now()) / 1000)
      },
      { status: 429 }
    );

    if (config.headers) {
      this.addRateLimitHeaders(response, limitInfo);
    }

    return response;
  }

  /**
   * Add rate limit headers to response
   */
  private addRateLimitHeaders(
    response: NextResponse | null,
    limitInfo: { remaining: number; resetTime: number; totalHits: number }
  ): NextResponse {
    const headers = {
      'X-RateLimit-Limit': limitInfo.totalHits.toString(),
      'X-RateLimit-Remaining': limitInfo.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(limitInfo.resetTime / 1000).toString(),
      'X-RateLimit-Reset-Time': new Date(limitInfo.resetTime).toISOString()
    };

    if (response) {
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Create new response with headers for successful requests
    const newResponse = NextResponse.next();
    Object.entries(headers).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });
    return newResponse;
  }
}

// Pre-configured rate limiters for different use cases
export const rateLimitingService = new RateLimitingService(RateLimitStrategy.SLIDING_WINDOW);

// API rate limiter - general API endpoints
export const apiRateLimiter = rateLimitingService.createLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'API rate limit exceeded. Please slow down your requests.'
});

// Authentication rate limiter - login attempts
export const authRateLimiter = rateLimitingService.createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts. Please try again later.',
  keyGenerator: (req) => {
    const body = req.body as any;
    const email = body?.email || 'unknown';
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    return `auth:${email}:${ip}`;
  }
});

// Search rate limiter - property search endpoints
export const searchRateLimiter = rateLimitingService.createLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 50, // 50 searches per minute
  message: 'Search rate limit exceeded. Please wait before searching again.'
});

// Upload rate limiter - file upload endpoints
export const uploadRateLimiter = rateLimitingService.createLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 10, // 10 uploads per minute
  message: 'Upload rate limit exceeded. Please wait before uploading again.'
});

// Payment rate limiter - payment processing
export const paymentRateLimiter = rateLimitingService.createLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 3, // 3 payment attempts per minute
  message: 'Payment rate limit exceeded. Please wait before retrying payment.'
});

// WebSocket connection rate limiter
export const websocketRateLimiter = rateLimitingService.createLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 10, // 10 connection attempts per minute
  message: 'WebSocket connection limit exceeded.'
});

// Admin endpoints rate limiter
export const adminRateLimiter = rateLimitingService.createLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 200, // Higher limit for admin users
  message: 'Admin API rate limit exceeded.'
});

// Public endpoints rate limiter (more restrictive)
export const publicRateLimiter = rateLimitingService.createLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 30, // 30 requests per minute for unauthenticated users
  message: 'Public API rate limit exceeded. Please consider registering for higher limits.'
});

// Rate limiting utility functions
export const RateLimitUtils = {
  /**
   * Apply rate limiting to API route
   */
  async applyRateLimit(
    req: NextRequest,
    limiter: (req: NextRequest) => Promise<NextResponse | null>
  ): Promise<NextResponse | null> {
    return await limiter(req);
  },

  /**
   * Get rate limiting configuration for endpoint
   */
  getConfigForEndpoint(path: string): (req: NextRequest) => Promise<NextResponse | null> {
    if (path.startsWith('/api/auth')) {
      return authRateLimiter;
    }
    if (path.startsWith('/api/admin')) {
      return adminRateLimiter;
    }
    if (path.startsWith('/api/properties/search')) {
      return searchRateLimiter;
    }
    if (path.startsWith('/api/upload')) {
      return uploadRateLimiter;
    }
    if (path.startsWith('/api/payments')) {
      return paymentRateLimiter;
    }
    if (path.startsWith('/api/realtime')) {
      return websocketRateLimiter;
    }
    if (path.startsWith('/api/')) {
      return apiRateLimiter;
    }
    
    return publicRateLimiter;
  },

  /**
   * Create IP-based whitelist checker
   */
  createWhitelistChecker(whitelistedIPs: string[]) {
    return (req: NextRequest): boolean => {
      const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                       req.headers.get('x-real-ip') || 
                       req.ip || 
                       'unknown';
      
      return whitelistedIPs.includes(clientIp);
    };
  },

  /**
   * Create user-based rate limiting
   */
  createUserBasedLimiter(limitsPerRole: { [role: string]: Partial<RateLimitConfig> }) {
    return async (req: NextRequest): Promise<NextResponse | null> => {
      try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
          return publicRateLimiter(req);
        }

        const token = authHeader.replace('Bearer ', '');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role || 'user';

        const roleConfig = limitsPerRole[userRole] || limitsPerRole.default;
        if (!roleConfig) {
          return apiRateLimiter(req);
        }

        const roleLimiter = rateLimitingService.createLimiter(roleConfig);
        return roleLimiter(req);

      } catch {
        return publicRateLimiter(req);
      }
    };
  }
};