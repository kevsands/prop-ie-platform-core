import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { randomBytes } from 'crypto';

// Initialize Redis client
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  enableOfflineQueue: false,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Configure rate limiters
const rateLimiters = {
  login: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login',
    points: 5, // Number of requests
    duration: 60, // Per minute
    blockDuration: 60 * 15 // Block for 15 minutes if limit exceeded
  }),
  api: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'api',
    points: 60,
    duration: 60,
    blockDuration: 60 * 5
  }),
  default: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'default',
    points: 30,
    duration: 60,
    blockDuration: 60 * 5
  })
};

// Route access configuration
const ROUTE_ACCESS: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/developer': ['DEVELOPER', 'ADMIN'],
  '/solicitor': ['SOLICITOR', 'ADMIN'],
  '/buyer': ['BUYER', 'ADMIN'],
  '/agent': ['AGENT', 'ADMIN'],
  '/architect': ['ARCHITECT', 'ADMIN'],
  '/contractor': ['CONTRACTOR', 'ADMIN'],
  '/investor': ['INVESTOR', 'ADMIN'],
  '/api/admin': ['ADMIN'],
  '/api/developer': ['DEVELOPER', 'ADMIN'],
  '/api/solicitor': ['SOLICITOR', 'ADMIN'],
  '/api/transactions': ['BUYER', 'DEVELOPER', 'SOLICITOR', 'AGENT', 'ADMIN'],
  '/api/properties': ['BUYER', 'DEVELOPER', 'AGENT', 'ADMIN'],
  '/api/documents': ['BUYER', 'DEVELOPER', 'SOLICITOR', 'AGENT', 'ADMIN'],
  '/api/finance': ['DEVELOPER', 'INVESTOR', 'ADMIN'],
  '/api/compliance': ['DEVELOPER', 'SOLICITOR', 'ADMIN'],
  '/api/kyc': ['SOLICITOR', 'ADMIN'],
  '/api/analytics': ['DEVELOPER', 'ADMIN'],
  '/api/projects': ['DEVELOPER', 'ARCHITECT', 'CONTRACTOR', 'ADMIN']};

// API rate limits (requests per minute)
const RATE_LIMITS: Record<string, number> = {
  '/api/auth/login': 5,
  '/api/auth/register': 3,
  '/api/auth/password-reset': 3,
  '/api': 60, // Default API rate limit
};

// CSRF token validation
const CSRF_TOKEN_HEADER = 'X-CSRF-Token';
const CSRF_COOKIE_NAME = 'csrf_token';

function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get(CSRF_TOKEN_HEADER);
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  if (!token || !cookieToken) {
    return false;
  }

  return token === cookieToken;
}

// Get client identifier for rate limiting
function getClientIdentifier(request: NextRequest, token: any): string {
  if (token?.id) return `user:${token.id}`;
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

// Check rate limit
async function checkRateLimit(identifier: string, path: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    let limiter = rateLimiters.default;
    
    if (path.startsWith('/api/auth/login')) {
      limiter = rateLimiters.login;
    } else if (path.startsWith('/api')) {
      limiter = rateLimiters.api;
    }

    await limiter.consume(identifier);
    return { allowed: true };
  } catch (error) {
    if (error instanceof Error) {
      const retryAfter = Math.ceil(error.message.split(':')[1] || 60);
      return { allowed: false, retryAfter };
    }
    return { allowed: false, retryAfter: 60 };
  }
}

// Check if user has required role
function hasRequiredRole(userRoles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some(role => userRoles.includes(role));
}

// Log authentication events
async function logAuthEvent(
  eventType: string,
  request: NextRequest,
  metadata: Record<string, any> = {}
) {
  const event = {
    timestamp: new Date().toISOString(),
    eventType,
    path: request.nextUrl.pathname,
    method: request.method,
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    userAgent: request.headers.get('user-agent'),
    ...metadata
  };
  
  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to CloudWatch or other logging service
  } else {
    console.log('[AUTH_EVENT]', JSON.stringify(event));
  }
}

/**
 * Enhanced authentication and authorization middleware
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/auth',
    '/login',
    '/register',
    '/forgot-password',
    '/api/auth',
    '/api/health',
    '/test',
    '/',
    '/about',
    '/contact',
    '/properties/search', // Allow public property search
    '/developments', // Allow public development browsing
  ];
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname.includes('/images/') ||
    pathname.includes('/icons/') ||
    pathname.includes('.svg') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.ico') ||
    pathname.includes('.js') ||
    pathname.includes('.css') ||
    pathname.includes('manifest.json') ||
    pathname.includes('/monitoring')
  ) {
    return NextResponse.next();
  }
  
  // CSRF protection for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    if (!validateCSRFToken(request)) {
      await logAuthEvent('CSRF_ATTEMPT', request, {
        method: request.method,
        path: pathname
      });
      
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // Get token
  const token = await getToken({ req: request });
  
  // Rate limiting for all routes
  const identifier = getClientIdentifier(request, token);
  const { allowed, retryAfter } = await checkRateLimit(identifier, pathname);
  
  if (!allowed) {
    await logAuthEvent('RATE_LIMIT_EXCEEDED', request, {
      identifier,
      retryAfter
    });
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many requests',
        retryAfter 
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(rateLimiters.default.points),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + (retryAfter || 60) * 1000)
        }
      }
    );
  }
  
  // For public paths, allow access without authentication
  if (isPublicPath) {
    const response = NextResponse.next();
    
    // Set CSRF token for public paths that might need it
    if (['/login', '/register'].includes(pathname)) {
      const csrfToken = generateCSRFToken();
      response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    }
    
    return response;
  }
  
  // Check authentication
  if (!token) {
    await logAuthEvent('UNAUTHORIZED_ACCESS', request, { reason: 'No token' });
    
    // API routes return 401
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { 
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Bearer'
          }
        }
      );
    }
    
    // UI routes redirect to login
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Check if token has error (e.g., refresh failed)
  if (token.error === "RefreshAccessTokenError") {
    await logAuthEvent('TOKEN_REFRESH_FAILED', request, { userId: token.id });
    
    // Force re-authentication
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    url.searchParams.set('error', 'SessionExpired');
    return NextResponse.redirect(url);
  }
  
  // Check role-based access
  const userRoles = (token.roles as string[]) || [];
  
  // Find the most specific route that matches
  const requiredRoles = Object.entries(ROUTE_ACCESS)
    .filter(([route]) => pathname.startsWith(route))
    .sort((ab: any) => b[0].length - a[0].length)[0]?.[1];
  
  if (requiredRoles && !hasRequiredRole(userRoles, requiredRoles)) {
    await logAuthEvent('FORBIDDEN_ACCESS', request, {
      userId: token.id,
      userRoles,
      requiredRoles,
      path: pathname
    });
    
    // API routes return 403
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Insufficient permissions',
          required: requiredRoles,
          current: userRoles
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // UI routes redirect to access denied page
    return NextResponse.redirect(new URL('/auth/access-denied', request.url));
  }
  
  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Add user info to request headers for downstream use
  response.headers.set('X-User-Id', token.id as string);
  response.headers.set('X-User-Roles', userRoles.join(','));
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)']};