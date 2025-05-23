import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting map to track requests
const rateLimitMap = new Map();

// CSRF token validation
function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('X-CSRF-Token');
  const sessionToken = request.cookies.get('csrf-token')?.value;
  
  return token === sessionToken && token !== null;
}

// Rate limiting implementation
function checkRateLimit(ip: string, limit: number = 100, window: number = 60000): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter((timestamp: number) => now - timestamp < window);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return true;
}

// Security headers
function addSecurityHeaders(response: NextResponse): void {
  // Prevent XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Enable HSTS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cognito-idp.eu-west-1.amazonaws.com https://*.amazonaws.com"
  );
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}

export function securityMiddleware(request: NextRequest) {
  // Get client IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // Check rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // For API routes, check CSRF token
  if (request.nextUrl.pathname.startsWith('/api/') && 
      request.method !== 'GET' && 
      request.method !== 'HEAD') {
    if (!validateCSRFToken(request)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }
  
  // Create response
  const response = NextResponse.next();
  
  // Add security headers
  addSecurityHeaders(response);
  
  // Set CSRF token for new sessions
  if (!request.cookies.get('csrf-token')) {
    const csrfToken = generateCSRFToken();
    response.cookies.set('csrf-token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });
  }
  
  return response;
}

// Generate CSRF token
function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  const window = 60000; // 1 minute
  
  for (const [ip, requests] of rateLimitMap.entries()) {
    const recentRequests = requests.filter((timestamp: number) => now - timestamp < window);
    if (recentRequests.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recentRequests);
    }
  }
}, 60000); // Run every minute