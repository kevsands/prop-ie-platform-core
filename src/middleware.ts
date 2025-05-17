import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

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
    return NextResponse.redirect(signInUrl);
  }

  // Check role-based access control
  if (token) {
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(token.role as string)) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) except protected ones
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth).*)',
  ],
};