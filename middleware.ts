import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/company',
  '/contact',
  '/solutions',
  '/developments',
  '/units',
  '/properties',
  '/api/developments',
  '/api/units',
  '/api/properties',
  '/login',
  '/register',
  '/test-development',
  '/resources',
  '/_next',
  '/favicon',
  '/icon-',
  '/apple-touch-icon',
  '/manifest.json',
  '/sw.js'
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (pathname === route) return true;
    if (pathname.startsWith(route + '/')) return true;
    if (route.startsWith('/icon-') && pathname.startsWith(route)) return true;
    if (route === '/apple-touch-icon' && pathname.startsWith(route)) return true;
    return false;
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow all public routes
  if (isPublicRoute(pathname)) {
    console.log(`✅ Public route allowed: ${pathname}`);
    return NextResponse.next();
  }
  
  // For protected routes, you could add authentication checks here
  // For now, allow all during development
  console.log(`🔓 Protected route allowed (dev mode): ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};