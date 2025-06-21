import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/authService';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { isValid: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = await authService.verifyToken(token);
    
    // Get current user data
    const user = await authService.getUserById(payload.userId);
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { isValid: false, error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      isValid: true,
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
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { isValid: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}