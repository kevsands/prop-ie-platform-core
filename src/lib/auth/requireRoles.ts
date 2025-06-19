import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/core/user';

/**
 * Middleware to check if user has required roles
 * Returns null if access granted, NextResponse if access denied
 */
export async function requireRoles(
  request: NextRequest, 
  requiredRoles: UserRole[]
): Promise<NextResponse | null> {
  // Check for auth token
  const authToken = request.cookies.get('auth-token')?.value;
  
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // In development mode with mock auth
  if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
    // Extract user ID from dev token and verify user has required roles
    if (authToken.startsWith('dev-token-')) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
          headers: {
            Cookie: request.headers.get('cookie') || ''
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            const userRoles = data.user.roles || [];
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
            
            if (!hasRequiredRole) {
              return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
            
            return null; // Access granted
          }
        }
      } catch (error) {
        console.error('Role check error:', error);
      }
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Production: Validate with AWS Cognito and check user roles
  try {
    // Verify session and get user data
    const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      headers: {
        Cookie: request.headers.get('cookie') || ''
      }
    });
    
    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const data = await response.json();
    if (!data.authenticated || !data.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const userRoles = data.user.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    return null; // Access granted
  } catch (error) {
    console.error('Role verification error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}