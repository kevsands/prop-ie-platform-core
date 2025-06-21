import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/authService';

export async function GET(request: NextRequest) {
  try {
    // Try to get token from cookie or Authorization header
    const authToken = request.cookies.get('auth-token')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');

    if (!authToken) {
      return NextResponse.json({ user: null, isAuthenticated: false });
    }

    // Verify the token
    const payload = await authService.verifyToken(authToken);
    
    // Get current user data
    const user = await authService.getUserById(payload.userId);
    
    if (!user || !user.isActive) {
      return NextResponse.json({ user: null, isAuthenticated: false });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roles[0] || 'BUYER',
        permissions: [],
        onboardingComplete: true,
        emailVerified: user.emailVerified || false,
        mfaEnabled: false
      },
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null, isAuthenticated: false });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}