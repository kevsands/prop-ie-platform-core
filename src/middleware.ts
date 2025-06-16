import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simplified middleware for development - no Redis required
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
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
  
  // In development, allow access to all routes
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }
  
  // Add basic security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)'
  ]
};