/**
 * Rate Limiting and Abuse Detection System
 * 
 * This module provides client-side rate limiting and abuse detection
 * to enhance security and protect against brute force and DoS attacks.
 */

/**
 * Rate limit configuration by endpoint type
 */
interface RateLimitConfig {
  windowMs: number;   // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the window
  blockDuration: number; // Duration to block if limit exceeded (in ms)
}

/**
 * Rate limit tracking entry
 */
interface RateLimitEntry {
  endpoint: string;
  count: number;
  resetAt: number;
  blocked: boolean;
  blockedUntil: number;
}

/**
 * Default rate limit configurations by endpoint category
 */
const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Authentication endpoints - stricter limits to prevent brute force
  'auth': {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 5,          // 5 requests per 5 minutes
    blockDuration: 15 * 60 * 1000 // 15 minute block
  },
  
  // API endpoints - general limits
  'api': {
    windowMs: 60 * 1000,     // 1 minute
    maxRequests: 30,         // 30 requests per minute
    blockDuration: 5 * 60 * 1000 // 5 minute block
  },
  
  // Mutation endpoints - moderately strict
  'mutation': {
    windowMs: 60 * 1000,     // 1 minute
    maxRequests: 10,         // 10 requests per minute
    blockDuration: 5 * 60 * 1000 // 5 minute block
  },
  
  // Query endpoints - more lenient
  'query': {
    windowMs: 60 * 1000,     // 1 minute
    maxRequests: 60,         // 60 requests per minute (1 per second)
    blockDuration: 2 * 60 * 1000 // 2 minute block
  },
  
  // Default fallback
  'default': {
    windowMs: 60 * 1000,     // 1 minute
    maxRequests: 20,         // 20 requests per minute
    blockDuration: 5 * 60 * 1000 // 5 minute block
  }
};

/**
 * Suspicious patterns configuration for abuse detection
 */
interface SuspiciousPattern {
  name: string;
  condition: (requests: RequestInfo[]) => boolean;
  action: 'flag' | 'block';
  blockDuration?: number;
}

/**
 * Request tracking information
 */
interface RequestInfo {
  endpoint: string;
  method: string;
  timestamp: number;
  statusCode?: number;
  responseTime?: number;
}

/**
 * Suspicious patterns to detect
 */
const SUSPICIOUS_PATTERNS: SuspiciousPattern[] = [
  {
    name: 'rapid-auth-failures',
    condition: (requests) => {
      // Count auth failures in the last 5 minutes
      const authRequests = requests.filter(r => 
        r.endpoint.includes('/auth') && 
        r.timestamp > Date.now() - 5 * 60 * 1000 &&
        r.statusCode && r.statusCode >= 400
      );
      return authRequests.length >= 3;
    },
    action: 'block',
    blockDuration: 30 * 60 * 1000 // 30 minutes
  },
  {
    name: 'api-flooding',
    condition: (requests) => {
      // Detect very rapid API calls (more than 20 in 10 seconds)
      const recentRequests = requests.filter(r => 
        r.timestamp > Date.now() - 10 * 1000
      );
      return recentRequests.length > 20;
    },
    action: 'block',
    blockDuration: 5 * 60 * 1000 // 5 minutes
  },
  {
    name: 'endpoint-scanning',
    condition: (requests) => {
      // Detect access to many different endpoints in a short time
      const recentRequests = requests.filter(r => 
        r.timestamp > Date.now() - 30 * 1000
      );
      
      // Count unique endpoints
      const uniqueEndpoints = new Set(recentRequests.map(r => r.endpoint));
      return uniqueEndpoints.size > 15;
    },
    action: 'flag'
  },
  {
    name: 'sequential-errors',
    condition: (requests) => {
      // Detect sequential error responses
      const recentRequests = requests.filter(r => 
        r.timestamp > Date.now() - 60 * 1000 &&
        r.statusCode && r.statusCode >= 400
      );
      return recentRequests.length >= 5;
    },
    action: 'flag'
  }
];

/**
 * Storage keys for rate limiting data
 */
const RATE_LIMIT_STORAGE_KEY = 'rate_limit_entries';
const REQUEST_HISTORY_KEY = 'request_history';

/**
 * Rate limiting and abuse detection service
 */
export class RateLimiter {
  private static rateLimitEntries: RateLimitEntry[] = [];
  private static requestHistory: RequestInfo[] = [];
  private static isInitialized = false;
  
  /**
   * Initialize the rate limiter
   */
  static initialize(): void {
    if (this.isInitialized) return;
    
    // Load stored rate limit entries
    if (typeof window !== 'undefined') {
      try {
        const storedEntries = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
        if (storedEntries) {
          this.rateLimitEntries = JSON.parse(storedEntries);
        }
        
        const storedHistory = localStorage.getItem(REQUEST_HISTORY_KEY);
        if (storedHistory) {
          this.requestHistory = JSON.parse(storedHistory);
          
          // Clean up old history (older than 1 hour)
          const cutoff = Date.now() - 60 * 60 * 1000;
          this.requestHistory = this.requestHistory.filter(r => r.timestamp >= cutoff);
        }
      } catch (error) {
        console.error('Error loading rate limit data:', error);
        // Reset if there's an error
        this.rateLimitEntries = [];
        this.requestHistory = [];
      }
    }
    
    this.isInitialized = true;
  }
  
  /**
   * Check if a request should be allowed based on rate limits
   * 
   * @param endpoint - API endpoint 
   * @param category - Endpoint category (auth, api, mutation, query)
   * @returns Object with allowed status and info
   */
  static checkRateLimit(
    endpoint: string, 
    category: 'auth' | 'api' | 'mutation' | 'query' | 'default' = 'default'
  ): { allowed: boolean; reason?: string; retryAfter?: number } {
    if (!this.isInitialized) {
      this.initialize();
    }
    
    // Get rate limit config for this category
    const config = DEFAULT_RATE_LIMITS[category] || DEFAULT_RATE_LIMITS.default;
    
    // Find or create entry for this endpoint
    let entry = this.rateLimitEntries.find(e => e.endpoint === endpoint);
    
    if (!entry) {
      entry = {
        endpoint,
        count: 0,
        resetAt: Date.now() + config.windowMs,
        blocked: false,
        blockedUntil: 0
      };
      this.rateLimitEntries.push(entry);
    }
    
    // Check if endpoint is blocked
    if (entry.blocked) {
      if (Date.now() < entry.blockedUntil) {
        const retryAfter = Math.ceil((entry.blockedUntil - Date.now()) / 1000);
        return { 
          allowed: false, 
          reason: 'blocked', 
          retryAfter 
        };
      } else {
        // Unblock if block period has passed
        entry.blocked = false;
        entry.count = 0;
        entry.resetAt = Date.now() + config.windowMs;
      }
    }
    
    // Reset counter if window has passed
    if (Date.now() > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = Date.now() + config.windowMs;
    }
    
    // Increment counter
    entry.count++;
    
    // Check if rate limit exceeded
    if (entry.count > config.maxRequests) {
      entry.blocked = true;
      entry.blockedUntil = Date.now() + config.blockDuration;
      
      // Persist updated entries
      this.saveEntries();
      
      const retryAfter = Math.ceil(config.blockDuration / 1000);
      return { 
        allowed: false, 
        reason: 'rate_limit_exceeded', 
        retryAfter 
      };
    }
    
    // Persist updated entries
    this.saveEntries();
    
    return { allowed: true };
  }
  
  /**
   * Track a completed request
   */
  static trackRequest(info: RequestInfo): void {
    if (!this.isInitialized) {
      this.initialize();
    }
    
    // Add to history
    this.requestHistory.push(info);
    
    // Limit history size to prevent excessive storage
    if (this.requestHistory.length > 1000) {
      this.requestHistory = this.requestHistory.slice(-1000);
    }
    
    // Check for suspicious patterns
    this.detectSuspiciousActivity();
    
    // Save history
    this.saveHistory();
  }
  
  /**
   * Check if an endpoint is currently blocked
   */
  static isBlocked(endpoint: string): boolean {
    if (!this.isInitialized) {
      this.initialize();
    }
    
    const entry = this.rateLimitEntries.find(e => e.endpoint === endpoint);
    if (!entry) return false;
    
    return entry.blocked && Date.now() < entry.blockedUntil;
  }
  
  /**
   * Get block information for an endpoint
   */
  static getBlockInfo(endpoint: string): { blocked: boolean; remainingMs: number } | null {
    if (!this.isInitialized) {
      this.initialize();
    }
    
    const entry = this.rateLimitEntries.find(e => e.endpoint === endpoint);
    if (!entry || !entry.blocked) {
      return null;
    }
    
    const remainingMs = Math.max(0, entry.blockedUntil - Date.now());
    
    return {
      blocked: entry.blocked && remainingMs > 0,
      remainingMs
    };
  }
  
  /**
   * Manually block an endpoint
   */
  static block(endpoint: string, durationMs: number, reason?: string): void {
    if (!this.isInitialized) {
      this.initialize();
    }
    
    let entry = this.rateLimitEntries.find(e => e.endpoint === endpoint);
    
    if (!entry) {
      entry = {
        endpoint,
        count: 0,
        resetAt: Date.now(),
        blocked: true,
        blockedUntil: Date.now() + durationMs
      };
      this.rateLimitEntries.push(entry);
    } else {
      entry.blocked = true;
      entry.blockedUntil = Date.now() + durationMs;
    }
    
    // Log the block
    console.warn(`Endpoint ${endpoint} blocked for ${durationMs / 1000} seconds. Reason: ${reason || 'Manual block'}`);
    
    // Persist updated entries
    this.saveEntries();
  }
  
  /**
   * Clear rate limit data
   */
  static reset(): void {
    this.rateLimitEntries = [];
    this.requestHistory = [];
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
      localStorage.removeItem(REQUEST_HISTORY_KEY);
    }
  }
  
  /**
   * Save rate limit entries to localStorage
   */
  private static saveEntries(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(this.rateLimitEntries));
    } catch (error) {
      console.error('Error saving rate limit entries:', error);
    }
  }
  
  /**
   * Save request history to localStorage
   */
  private static saveHistory(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(REQUEST_HISTORY_KEY, JSON.stringify(this.requestHistory));
    } catch (error) {
      console.error('Error saving request history:', error);
    }
  }
  
  /**
   * Detect suspicious activity patterns
   */
  private static detectSuspiciousActivity(): void {
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.condition(this.requestHistory)) {
        console.warn(`Suspicious activity detected: ${pattern.name}`);
        
        if (pattern.action === 'block') {
          // Block all API endpoints
          this.block(
            'all', 
            pattern.blockDuration || 30 * 60 * 1000,
            `Suspicious activity: ${pattern.name}`
          );
        }
        
        // Log the suspicious activity
        // In a real implementation, you would send this to your security monitoring system
        if (typeof window !== 'undefined') {
          const securityEvent = {
            type: 'suspicious_activity',
            pattern: pattern.name,
            timestamp: Date.now(),
            action: pattern.action,
            requestHistory: this.requestHistory.slice(-20) // Include last 20 requests
          };
          
          // Store security events for review
          try {
            const events = JSON.parse(localStorage.getItem('security_events') || '[]');
            events.push(securityEvent);
            localStorage.setItem('security_events', JSON.stringify(events.slice(-50)));
          } catch (error) {
            console.error('Error storing security event:', error);
          }
        }
      }
    }
  }
}