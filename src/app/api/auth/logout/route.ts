import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/authService';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      // Verify the token to get user ID
      try {
        const payload = await authService.verifyToken(token);
        await authService.logout(payload.userId);
      } catch (error) {
        // Token might be invalid, but we'll still clear the cookies
        console.warn('Token verification failed during logout:', error);
      }
    }

    // Clear auth cookies
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    
    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, clear the cookies
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('auth-token', '', { maxAge: 0 });
    response.cookies.set('refresh-token', '', { maxAge: 0 });
    
    return response;
  }
}