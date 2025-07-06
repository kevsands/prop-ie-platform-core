// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

/**
 * Session verification API endpoint
 * Checks if user is authenticated and returns current user info
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookie
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // In development mode with mock auth
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log('[DEV] Session check with token:', authToken);
      
      // Extract user ID from token (dev-token-{userId})
      if (authToken.startsWith('dev-token-')) {
        const userId = authToken.replace('dev-token-', '');
        const user = await userService.getUserById(userId);
        
        if (user) {
          return NextResponse.json({
            authenticated: true,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              roles: user.roles,
              status: user.status,
              lastActive: user.lastActive
            }
          });
        }
      }
      
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Production: Verify with AWS Cognito
    try {
      // Use getCurrentUser to verify session
      const currentUser = await userService.getCurrentUser();
      
      if (!currentUser) {
        return NextResponse.json(
          { error: 'Session expired' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: currentUser.id,
          email: currentUser.email,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          roles: currentUser.roles,
          status: currentUser.status,
          lastActive: currentUser.lastActive
        }
      });
    } catch (error) {
      console.error('Session verification error:', error);
      
      return NextResponse.json(
        { error: 'Session verification failed' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Session check error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}