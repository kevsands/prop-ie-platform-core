import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const SECURITY_CONFIG = {
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // per window
    message: 'Too many requests, please try again later.'},
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
      frameSrc: ["'self'"],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ["'self'", 'blob:'],
      frameAncestors: ["'self'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      manifestSrc: ["'self'"]},
  securityHeaders: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'};

// Generate nonce for CSP using Edge Runtime compatible method
function generateNonce(): string {
  // For Edge Runtime, use a simpler approach
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(215);
  return `${timestamp}-${random}`;
}

// Rate limiting function
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now> record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.rateLimit.windowMs});
    return true;
  }

  if (record.count>= SECURITY_CONFIG.rateLimit.maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Build CSP header
function buildCSPHeader(nonce: string): string {
  const { directives } = SECURITY_CONFIG.csp;
  const cspParts: string[] = [];

  Object.entries(directives).forEach(([keyvalues]) => {
    const directive = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (key === 'scriptSrc') {
      cspParts.push(`${directive} ${values.join(' ')} 'nonce-${nonce}'`);
    } else {
      cspParts.push(`${directive} ${values.join(' ')}`);
    }
  });

  return cspParts.join('; ');
}

// Security middleware
export function securityMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Cleanup expired sessions occasionally
  if (Math.random() <0.1) { // 10% chance on each request
    cleanupExpiredSessions();
  }
  
  // Generate nonce for this request
  const nonce = generateNonce();
  
  // Add security headers
  Object.entries(SECURITY_CONFIG.securityHeaders).forEach(([keyvalue]) => {
    response.headers.set(keyvalue);
  });
  
  // Add CSP header
  response.headers.set('Content-Security-Policy', buildCSPHeader(nonce));
  
  // Store nonce in response for use in scripts
  response.headers.set('X-Nonce', nonce);
  
  // Rate limiting (use IP or session ID)
  const identifier = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
  
  if (!checkRateLimit(identifier)) {
    return new NextResponse(
      JSON.stringify({ 
        error: SECURITY_CONFIG.rateLimit.message,
        retryAfter: SECURITY_CONFIG.rateLimit.windowMs / 1000}),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(SECURITY_CONFIG.rateLimit.windowMs / 1000)}
    );
  }
  
  // CSRF protection for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token');
    const sessionCsrf = request.cookies.get('csrf-token')?.value;
    
    if (!csrfToken || !sessionCsrf || csrfToken !== sessionCsrf) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
      );
    }
  }
  
  // XSS protection - validate input
  if (request.method === 'POST' || request.method === 'PUT') {
    try {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        // Additional validation would go here
      }
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
      );
    }
  }
  
  return response;
}

// Additional security utilities

export function sanitizeInput(input: string): string {
  // Basic HTML entity encoding
  return input
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, ''')
    .replace(/\//g, '&#x2F;');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length <8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors};
}

// SQL injection prevention (for raw queries)
export function escapeSQLString(str: string): string {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\%]/g, (char: any) => {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default:
        return char;
    }
  });
}

// Environment variable validation
export function validateEnvVars(): void {
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY'];
  
  const missing = requiredVars.filter((varName: any) => !process.env[varName]);
  
  if (missing.length> 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Clean session storage
export function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [keyvalue] of rateLimitStore.entries()) {
    if (now> value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Note: In Edge Runtime, we cannot use setInterval
// Cleanup happens on each request instead