// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Auth } from '@/lib/auth';
import { userService } from '@/lib/services/users-real';
import { UserRole } from '@/types/core/user';

/**
 * Production User Registration API
 * 
 * Handles user registration with AWS Cognito integration
 * and creates user profiles in the database
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as { 
      username: string; 
      password: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      userRole: UserRole;
      organization?: string;
      position?: string;
    };
    
    const { 
      username, 
      password, 
      email, 
      firstName, 
      lastName, 
      phoneNumber, 
      userRole,
      organization,
      position 
    } = data;

    // Validate required fields
    if (!username || !password || !email || !firstName || !lastName || !userRole) {
      return NextResponse.json(
        { error: 'Username, password, email, firstName, lastName, and userRole are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate user role
    if (!Object.values(UserRole).includes(userRole)) {
      return NextResponse.json(
        { error: 'Invalid user role' },
        { status: 400 }
      );
    }

    // Check if user already exists in our database
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // In development mode, skip Cognito and create user directly
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Registration attempt - Username: ${username}, Email: ${email}, Role: ${userRole}`);
      
      // Create user directly in database
      const newUser = await userService.createUser({
        cognitoUserId: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName,
        lastName,
        phone: phoneNumber,
        roles: [userRole],
        organization,
        position,
        preferences: {
          notifications: { email: true, sms: false, push: true },
          theme: 'light',
          language: 'en',
          timezone: 'Europe/Dublin'
        }
      });

      // Auto-login after successful registration
      const authToken = `dev-token-${newUser.id}`;
      
      // Create the response with auto-login
      const response = NextResponse.json({
        success: true,
        isSignUpComplete: true,
        userId: newUser.id,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          roles: newUser.roles
        },
        token: authToken,
        autoLogin: true,
        message: '[DEV MODE] User registered and automatically logged in.'
      });

      // Set session cookie for auto-login
      response.cookies.set('auth-token', authToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    }

    // Production: Use AWS Cognito
    try {
      // Register user with AWS Cognito
      const signUpResult = await Auth.signUp({
        username: email, // Use email as username
        password,
        email,
        firstName,
        lastName,
        userRole
      });

      // If Cognito signup is successful, create user profile in database
      if (signUpResult.userId) {
        const newUser = await userService.createUser({
          cognitoUserId: signUpResult.userId,
          email,
          firstName,
          lastName,
          phone: phoneNumber,
          roles: [userRole],
          organization,
          position,
          preferences: {
            notifications: { email: true, sms: false, push: true },
            theme: 'light',
            language: 'en',
            timezone: 'Europe/Dublin'
          }
        });

        return NextResponse.json({
          success: true,
          isSignUpComplete: signUpResult.isSignUpComplete,
          userId: newUser.id,
          cognitoUserId: signUpResult.userId,
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            roles: newUser.roles
          },
          nextStep: signUpResult.nextStep,
          message: 'Registration successful. Please check your email to verify your account.'
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to create user in authentication system' },
          { status: 500 }
        );
      }
    } catch (cognitoError: any) {
      console.error('Cognito registration error:', cognitoError);
      
      // Handle common Cognito errors
      if (cognitoError.name === 'UsernameExistsException') {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      } else if (cognitoError.name === 'InvalidPasswordException') {
        return NextResponse.json(
          { error: 'Password does not meet requirements' },
          { status: 400 }
        );
      } else if (cognitoError.name === 'InvalidParameterException') {
        return NextResponse.json(
          { error: 'Invalid registration parameters' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to register user. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}