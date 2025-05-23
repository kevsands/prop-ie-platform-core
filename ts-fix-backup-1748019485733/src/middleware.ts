import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rate limiting store
const requestCounts = new Map<string, { count: number; resetTime: number }>();

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

// Get client identifier for rate limiting
function getClientIdentifier(request: NextRequest, token: any): string {
  if (token?.id) return `user:${token.id}`;
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

// Check rate limit
function checkRateLimit(identifier: string, path: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const limit = Object.entries(RATE_LIMITS).find(([route]) => path.startsWith(route))?.[1] || 60;
  
  const key = `${identifier}:${path}`;
  const record = requestCounts.get(key);
  
  if (!record || now> record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + 60000 }); // Reset after 1 minute
    return { allowed: true };
  }
  
  if (record.count>= limit) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  record.count++;
  return { allowed: true };
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
  
  // Get token
  const token = await getToken({ req: request });
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api')) {
    const identifier = getClientIdentifier(requesttoken);
    const { allowed, retryAfter } = checkRateLimit(identifierpathname);
    
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
            'X-RateLimit-Limit': String(RATE_LIMITS[pathname] || 60),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Date.now() + (retryAfter || 60) * 1000)
          }
        }
      );
    }
  }
  
  // For public paths, allow access without authentication
  if (isPublicPath) {
    return NextResponse.next();
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
    .sort((ab) => b[0].length - a[0].length)[0]?.[1];
  
  if (requiredRoles && !hasRequiredRole(userRolesrequiredRoles)) {
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