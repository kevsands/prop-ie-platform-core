import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Enterprise monitoring middleware
export function middleware(request: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  
  // Add request tracking headers
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);
  response.headers.set('x-response-time', `${Date.now() - start}ms`);
  
  // Log request details
  console.log({
    timestamp: new Date().toISOString(),
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    responseTime: `${Date.now() - start}ms`
  });
  
  return response;
}

// Only run on specific routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
