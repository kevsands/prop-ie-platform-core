// Edge Runtime compatible security middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in-memory)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const SECURITY_CONFIG = {
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // per window
    message: 'Too many requests, please try again later.',
  },
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://*.amazonaws.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://*.amazonaws.com', 'wss://*.amazonaws.com'],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
    },
  },
  securityHeaders: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },
};

// Generate nonce for CSP using Edge-compatible method
function generateNonce(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
}

// Rate limiting function
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.rateLimit.windowMs,
    });
    return true;
  }

  if (record.count >= SECURITY_CONFIG.rateLimit.maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Build CSP header without nonce for Edge Runtime
function buildCSPHeader(): string {
  const { directives } = SECURITY_CONFIG.csp;
  const cspParts: string[] = [];

  Object.entries(directives).forEach(([key, values]) => {
    const directive = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cspParts.push(`${directive} ${values.join(' ')}`);
  });

  return cspParts.join('; ');
}

// Clean expired sessions
function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Security middleware for Edge Runtime
export function securityMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Occasional cleanup
  if (Math.random() < 0.05) { // 5% chance
    cleanupExpiredSessions();
  }
  
  // Add security headers
  Object.entries(SECURITY_CONFIG.securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add CSP header (without nonce for Edge compatibility)
  response.headers.set('Content-Security-Policy', buildCSPHeader());
  
  // Rate limiting
  const identifier = request.headers.get('x-real-ip') || 
                   request.headers.get('x-forwarded-for') || 
                   'anonymous';
  
  if (!checkRateLimit(identifier)) {
    return new NextResponse(
      JSON.stringify({ 
        error: SECURITY_CONFIG.rateLimit.message,
        retryAfter: SECURITY_CONFIG.rateLimit.windowMs / 1000,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(SECURITY_CONFIG.rateLimit.windowMs / 1000),
        },
      }
    );
  }
  
  // Basic CSRF protection for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    // Skip CSRF for API routes that expect JSON
    if (!request.url.includes('/api/') || !contentType?.includes('application/json')) {
      const csrfToken = request.headers.get('x-csrf-token');
      if (!csrfToken) {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF token required' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }
  }
  
  return response;
}

// Simplified input sanitization for Edge Runtime
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}