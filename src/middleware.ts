import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { recordMetric } from './app/api/metrics/route';
import { trackError } from './lib/error-tracking';
import { Metrics } from './lib/cloudwatch';
import { trackSession, updateSessionMetrics } from './utils/monitoring';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const method = request.method;
  const path = request.nextUrl.pathname;
  
  let response: NextResponse;
  let statusCode = 200;
  let errorOccurred = false;
  
  try {
    // Add request ID to headers for tracing
    response = NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers.entries()),
          'x-request-id': requestId,
        }),
      },
    });
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Request-ID', requestId);
    
    // Track session
    const sessionId = request.cookies.get('sessionId')?.value || generateSessionId();
    const token = await getToken({ req: request });
    const userId = token?.sub;
    
    if (!request.cookies.has('sessionId')) {
      response.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 60 * 1000 // 30 minutes
      });
    }
    
    trackSession(sessionId, userId);
    
    // Authentication and authorization logic
    const pathname = request.nextUrl.pathname;
    
    // Skip monitoring for static assets
    if (isStaticAsset(pathname)) {
      return response;
    }
    
    // Update session metrics
    if (pathname.startsWith('/api/')) {
      updateSessionMetrics(sessionId, { apiCalls: 1 });
    } else {
      updateSessionMetrics(sessionId, { pageViews: 1 });
    }
    
    // Protected routes configuration
    const protectedRoutes = {
      '/dashboard': ['BUYER', 'INVESTOR', 'DEVELOPER', 'SOLICITOR', 'AGENT', 'ADMIN'],
      '/buyer': ['BUYER'],
      '/investor': ['INVESTOR'],
      '/developer': ['DEVELOPER'],
      '/solicitor': ['SOLICITOR'],
      '/agent': ['AGENT'],
      '/admin': ['ADMIN'],
    };
    
    // Check if the route is protected
    const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
      pathname.startsWith(route)
    );
    
    if (isProtectedRoute && !token) {
      const signInUrl = new URL('/auth/login', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      response = NextResponse.redirect(signInUrl);
      statusCode = 302;
    }
    
    // Check role-based access control
    if (token) {
      for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(route)) {
          if (!allowedRoles.includes(token.role as string)) {
            response = NextResponse.redirect(new URL('/unauthorized', request.url));
            statusCode = 302;
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Middleware error:', error);
    errorOccurred = true;
    statusCode = 500;
    
    // Track the error
    trackError(error as Error, {
      path,
      method,
      requestId,
      userId: token?.sub
    });
    
    updateSessionMetrics(sessionId, { errors: 1 });
    
    response = NextResponse.json(
      { error: 'Internal Server Error', requestId },
      { status: 500 }
    );
  } finally {
    const responseTime = Date.now() - startTime;
    
    // Record metrics
    try {
      // Only record metrics for non-static assets
      if (!isStaticAsset(path)) {
        recordMetric(method, path, statusCode, responseTime);
        
        // Send to CloudWatch
        await Metrics.trackRequest(path, method, statusCode, responseTime);
      }
      
      // Add performance headers
      response.headers.set('X-Response-Time', `${responseTime}ms`);
      response.headers.set('X-Request-ID', requestId);
      
      // Add server timing header for performance monitoring
      response.headers.set('Server-Timing', `total;dur=${responseTime}`);
      
    } catch (metricsError) {
      console.error('Failed to record metrics:', metricsError);
    }
  }
  
  return response;
}

// Helper functions
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function isStaticAsset(path: string): boolean {
  const staticPatterns = [
    '/_next',
    '/static',
    '.ico',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.css',
    '.js',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot'
  ];
  
  return staticPatterns.some(pattern => path.includes(pattern));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/health (health check endpoint should bypass middleware)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/health|_next/static|_next/image|favicon.ico).*)',
  ],
};