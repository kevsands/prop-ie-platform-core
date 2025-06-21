// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Auth } from '@/lib/auth';
import { userService } from '@/lib/services/users-real';

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

    // In development mode with mock auth enabled, check database for user
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Login attempt - Email: ${email}`);
      
      // Try to find user in database
      console.log(`[DEV] Looking for user with email: ${email}`);
      const user = await userService.getUserByEmail(email);
      console.log(`[DEV] User found:`, user ? 'Yes' : 'No');
      
      if (!user) {
        console.log(`[DEV] User not found for email: ${email}`);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        );
      }

      // Update last login timestamp
      await userService.updateLastLogin(user.id);

      const role = (JSON.parse(user.roleData || '["buyer"]')[0] || 'buyer').toUpperCase();
      
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: role,
          organisationId: 'fitzgeraldgardens',
          permissions: [
            { resource: 'projects', action: 'read' },
            { resource: 'units', action: 'read' }
          ]
        },
        token: `dev-token-${user.id}`,
        message: '[DEV MODE] Login successful. In production, credentials would be validated.'
      });

      response.cookies.set('auth-token', `dev-token-${user.id}`, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }

    // Production: Use AWS Cognito authentication
    try {
      const signInResult = await Auth.signIn({ username: email, password });
      
      if (!signInResult.isSignedIn) {
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        );
      }

      // Get user profile from database
      const user = await userService.getUserByEmail(email);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }

      // Update last login timestamp
      await userService.updateLastLogin(user.id);

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          status: user.status
        },
        message: 'Login successful'
      });

      // Set auth cookie (httpOnly for security)
      response.cookies.set('auth-token', signInResult.userId || 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    } catch (cognitoError: any) {
      console.error('Cognito login error:', cognitoError);
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}