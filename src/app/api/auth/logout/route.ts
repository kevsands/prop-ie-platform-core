// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Auth } from '@/lib/auth';

/**
 * Logout API endpoint
 * Handles user logout and clears authentication cookies
 */
export async function POST(request: NextRequest) {
  try {
    // In development mode with mock auth, just clear cookies
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log('[DEV] Logout request');
      
      const response = NextResponse.json({
        success: true,
        message: '[DEV MODE] Logout successful'
      });

      // Clear auth cookies
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 0 // Expire immediately
      });

      return response;
    }

    // Production: Use AWS Cognito signOut
    try {
      await Auth.signOut();
      
      const response = NextResponse.json({
        success: true,
        message: 'Logout successful'
      });

      // Clear auth cookies
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0 // Expire immediately
      });

      response.cookies.set('refresh-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0 // Expire immediately
      });

      return response;
    } catch (cognitoError: any) {
      console.error('Cognito logout error:', cognitoError);
      
      // Even if Cognito logout fails, clear local cookies
      const response = NextResponse.json({
        success: true,
        message: 'Local logout successful'
      });

      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0
      });

      return response;
    }
  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

// Support GET requests for logout links
export async function GET(request: NextRequest) {
  return POST(request);
}