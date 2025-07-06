// src/app/api/auth/login-postgresql/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Auth } from '@/lib/auth';
import { userServicePostgreSQL } from '@/lib/services/users-postgresql';

/**
 * PostgreSQL-enabled Login API
 * 
 * This endpoint tests authentication against the migrated PostgreSQL database
 */
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

    console.log(`[PostgreSQL Auth] Login attempt - Email: ${email}`);

    // Test PostgreSQL connection first
    const connectionTest = await userServicePostgreSQL.testConnection();
    if (!connectionTest) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Try to find user in PostgreSQL database
    const user = await userServicePostgreSQL.getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found in PostgreSQL database' },
        { status: 401 }
      );
    }

    console.log(`[PostgreSQL Auth] User found:`, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      status: user.status
    });

    // In development mode with mock auth enabled, skip password validation
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      // Update last login timestamp in PostgreSQL
      await userServicePostgreSQL.updateLastLogin(user.id);

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          status: user.status,
          kycStatus: user.kycStatus,
          organization: user.organization,
          position: user.position
        },
        token: `postgresql-dev-token-${user.id}`,
        message: '[PostgreSQL DEV MODE] Login successful using migrated PostgreSQL database',
        databaseInfo: {
          type: 'PostgreSQL',
          userTable: 'users',
          idType: 'UUID',
          authMethod: 'mock-auth-enabled'
        }
      });

      // Set auth cookie with PostgreSQL user ID
      response.cookies.set('auth-token', `postgresql-dev-token-${user.id}`, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
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

      // Update last login timestamp in PostgreSQL
      await userServicePostgreSQL.updateLastLogin(user.id);

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          status: user.status,
          kycStatus: user.kycStatus,
          organization: user.organization,
          position: user.position
        },
        message: 'Login successful with PostgreSQL user profile',
        databaseInfo: {
          type: 'PostgreSQL',
          userTable: 'users',
          idType: 'UUID',
          authMethod: 'AWS-Cognito'
        }
      });

      // Set auth cookie with PostgreSQL user ID
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
    console.error('PostgreSQL Login error:', error);
    
    return NextResponse.json(
      { 
        error: 'Login failed', 
        details: error.message,
        databaseInfo: {
          type: 'PostgreSQL',
          status: 'error'
        }
      },
      { status: 500 }
    );
  }
}