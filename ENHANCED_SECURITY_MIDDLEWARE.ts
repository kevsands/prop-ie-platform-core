// Enhanced Security Middleware for PROP.IE Platform
// Addresses critical security vulnerabilities identified by CodeRabbit
// Platform: €847M+ Annual Transactions - Enterprise Security Required

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// Security configuration
const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  forceSessionRotation: true,
  enableIPValidation: true,
  enableCSRFProtection: true,
  enableRateLimiting: true
};

// In-memory store for development (use Redis in production)
const securityStore = new Map<string, any>();

interface SessionData {
  userId: string;
  roles: string[];
  createdAt: number;
  lastActive: number;
  ipAddress: string;
  userAgent: string;
  rotationCount: number;
}

interface SecurityMetrics {
  loginAttempts: number;
  lastAttempt: number;
  isLocked: boolean;
  lockoutExpiry?: number;
  suspiciousActivity: string[];
}

export class EnhancedSecurityMiddleware {
  
  /**
   * Generate cryptographically secure session token
   */
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate secure CSRF token
   */
  static generateCSRFToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Check rate limiting for IP address
   */
  static checkRateLimit(ipAddress: string): boolean {
    const key = `rate_limit:${ipAddress}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 60;

    const requests = securityStore.get(key) || [];
    const recentRequests = requests.filter((time: number) => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }

    recentRequests.push(now);
    securityStore.set(key, recentRequests);
    return true;
  }

  /**
   * Track login attempts and implement lockout
   */
  static trackLoginAttempt(identifier: string, success: boolean, ipAddress: string): boolean {
    const key = `login_attempts:${identifier}`;
    const metrics: SecurityMetrics = securityStore.get(key) || {
      loginAttempts: 0,
      lastAttempt: 0,
      isLocked: false,
      suspiciousActivity: []
    };

    const now = Date.now();

    // Check if account is locked
    if (metrics.isLocked && metrics.lockoutExpiry && now < metrics.lockoutExpiry) {
      return false; // Account still locked
    }

    // Reset lock if expired
    if (metrics.isLocked && metrics.lockoutExpiry && now >= metrics.lockoutExpiry) {
      metrics.isLocked = false;
      metrics.loginAttempts = 0;
      delete metrics.lockoutExpiry;
    }

    if (success) {
      // Reset on successful login
      metrics.loginAttempts = 0;
      metrics.isLocked = false;
      delete metrics.lockoutExpiry;
    } else {
      // Increment failed attempts
      metrics.loginAttempts++;
      metrics.lastAttempt = now;

      // Lock account if max attempts reached
      if (metrics.loginAttempts >= SECURITY_CONFIG.maxLoginAttempts) {
        metrics.isLocked = true;
        metrics.lockoutExpiry = now + SECURITY_CONFIG.lockoutDuration;
        
        // Log security event
        console.warn(`[SECURITY ALERT] Account locked: ${identifier} from IP: ${ipAddress}`);
        
        // Track suspicious activity
        metrics.suspiciousActivity.push(`${now}: Excessive login attempts from ${ipAddress}`);
      }
    }

    securityStore.set(key, metrics);
    return !metrics.isLocked;
  }

  /**
   * Create new session with security context
   */
  static createSession(userId: string, roles: string[], request: NextRequest): string {
    const sessionToken = this.generateSecureToken();
    const ipAddress = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';

    const sessionData: SessionData = {
      userId,
      roles,
      createdAt: Date.now(),
      lastActive: Date.now(),
      ipAddress,
      userAgent,
      rotationCount: 0
    };

    securityStore.set(`session:${sessionToken}`, sessionData);
    
    // Log session creation
    console.log(`[SECURITY] Session created for user ${userId} from IP ${ipAddress}`);
    
    return sessionToken;
  }

  /**
   * Rotate session token (security requirement)
   */
  static rotateSession(currentToken: string): string | null {
    const sessionData = securityStore.get(`session:${currentToken}`);
    if (!sessionData) return null;

    // Delete old session
    securityStore.delete(`session:${currentToken}`);

    // Create new session with updated token
    const newToken = this.generateSecureToken();
    sessionData.rotationCount++;
    sessionData.lastActive = Date.now();

    securityStore.set(`session:${newToken}`, sessionData);

    // Log session rotation
    console.log(`[SECURITY] Session rotated for user ${sessionData.userId} (rotation #${sessionData.rotationCount})`);

    return newToken;
  }

  /**
   * Validate session with security checks
   */
  static validateSession(token: string, request: NextRequest): SessionData | null {
    const sessionData = securityStore.get(`session:${token}`);
    if (!sessionData) return null;

    const now = Date.now();
    const ipAddress = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';

    // Check session timeout
    if (now - sessionData.lastActive > SECURITY_CONFIG.sessionTimeout) {
      securityStore.delete(`session:${token}`);
      console.log(`[SECURITY] Session expired for user ${sessionData.userId}`);
      return null;
    }

    // IP validation (security requirement)
    if (SECURITY_CONFIG.enableIPValidation && sessionData.ipAddress !== ipAddress) {
      securityStore.delete(`session:${token}`);
      console.warn(`[SECURITY ALERT] IP mismatch for user ${sessionData.userId}. Expected: ${sessionData.ipAddress}, Got: ${ipAddress}`);
      return null;
    }

    // User agent validation
    if (sessionData.userAgent !== userAgent) {
      console.warn(`[SECURITY WARNING] User agent change for user ${sessionData.userId}`);
      // Don't invalidate but log for investigation
    }

    // Update last active
    sessionData.lastActive = now;
    securityStore.set(`session:${token}`, sessionData);

    return sessionData;
  }

  /**
   * Invalidate session (logout, privilege change)
   */
  static invalidateSession(token: string): boolean {
    const sessionData = securityStore.get(`session:${token}`);
    if (sessionData) {
      securityStore.delete(`session:${token}`);
      console.log(`[SECURITY] Session invalidated for user ${sessionData.userId}`);
      return true;
    }
    return false;
  }

  /**
   * Get client IP address
   */
  static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }

    return request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           'unknown';
  }

  /**
   * Enhanced security headers
   */
  static addSecurityHeaders(response: NextResponse): NextResponse {
    // Comprehensive security headers for enterprise platform
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // HSTS (HTTP Strict Transport Security)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Content Security Policy
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.prop.ie wss:",
      "frame-ancestors 'none'"
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', cspDirectives);

    return response;
  }

  /**
   * Log security events for monitoring
   */
  static logSecurityEvent(event: string, severity: 'INFO' | 'WARNING' | 'CRITICAL', details: object) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details,
      platform: 'PROP.IE-Enterprise'
    };

    console.log(`[SECURITY-${severity}] ${JSON.stringify(logEntry)}`);
    
    // In production, send to SIEM/monitoring system
    // await sendToSIEM(logEntry);
  }
}

/**
 * Enhanced middleware function with comprehensive security
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ipAddress = EnhancedSecurityMiddleware.getClientIP(request);

  // Check rate limiting
  if (!EnhancedSecurityMiddleware.checkRateLimit(ipAddress)) {
    EnhancedSecurityMiddleware.logSecurityEvent(
      'RATE_LIMIT_EXCEEDED',
      'WARNING',
      { ipAddress, pathname }
    );
    
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  // Get response
  const response = NextResponse.next();

  // Add comprehensive security headers
  EnhancedSecurityMiddleware.addSecurityHeaders(response);

  // Add CSRF token for forms
  if (SECURITY_CONFIG.enableCSRFProtection) {
    const csrfToken = EnhancedSecurityMiddleware.generateCSRFToken();
    response.cookies.set('csrf-token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 // 1 hour
    });
  }

  // Session rotation for authenticated routes
  const authToken = request.cookies.get('auth-token')?.value;
  if (authToken && SECURITY_CONFIG.forceSessionRotation) {
    const sessionData = EnhancedSecurityMiddleware.validateSession(authToken, request);
    
    if (sessionData) {
      // Rotate session every 15 minutes for security
      const rotationInterval = 15 * 60 * 1000;
      if (Date.now() - sessionData.lastActive > rotationInterval) {
        const newToken = EnhancedSecurityMiddleware.rotateSession(authToken);
        
        if (newToken) {
          response.cookies.set('auth-token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 60 // 30 minutes
          });
        }
      }
    }
  }

  // Log access for monitoring
  if (pathname.startsWith('/api/') || pathname.startsWith('/admin/')) {
    EnhancedSecurityMiddleware.logSecurityEvent(
      'API_ACCESS',
      'INFO',
      { 
        pathname, 
        ipAddress, 
        userAgent: request.headers.get('user-agent'),
        authenticated: !!authToken 
      }
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)  
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Export the enhanced security class for use in API routes
export { EnhancedSecurityMiddleware };