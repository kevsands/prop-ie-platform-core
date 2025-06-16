// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/authService';
import { Logger } from '@/utils/logger';

const logger = new Logger('AuthAPI');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // In development mode, allow mock login
    if (process.env.NODE_ENV === 'development' && email.includes('@example.com')) {
      // Development mock login
      const mockRole = email.includes('admin') ? 'admin' :
                      email.includes('developer') ? 'developer' :
                      email.includes('solicitor') ? 'solicitor' :
                      email.includes('agent') ? 'agent' : 'buyer';
      
      const mockUser = {
        id: `dev-user-${Math.random().toString(36).substring(2, 9)}`,
        email,
        firstName: email.split('@')[0],
        lastName: 'User',
        role: mockRole,
        permissions: ['read', 'write']
      };

      const response = NextResponse.json({
        user: mockUser,
        token: 'dev-mode-dummy-token'
      });

      response.cookies.set('auth-token', 'dev-mode-dummy-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }

    // Production login with real authentication
    const authResponse = await authService.login({ email, password });

    // Create response with token in header and cookie
    const response = NextResponse.json({
      user: authResponse.user,
      token: authResponse.token
    });

    // Set auth cookie (httpOnly for security)
    response.cookies.set('auth-token', authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Set refresh token cookie
    response.cookies.set('refresh-token', authResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (error: any) {
    logger.error('Login failed', { error });
    
    // Don't reveal specific errors for security
    if (error.message === 'Invalid credentials') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}