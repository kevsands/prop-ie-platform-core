// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * DEVELOPMENT VERSION - API route for user registration
 * 
 * This is a simplified version that accepts any valid registration data
 * for development and testing purposes only.
 * 
 * DO NOT USE IN PRODUCTION
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as { 
      username: string; 
      password: string;
      email: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
    };
    const { username, password, email, firstName, lastName, phoneNumber } = data;

    // Validate required fields - keep basic validation for good practice
    if (!username || !password || !email) {
      return NextResponse.json(
        { error: 'Username, password, and email are required' },
        { status: 400 }
      );
    }

    // Basic password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    console.log(`[DEV] Registration attempt - Username: ${username}, Email: ${email}`);
    
    // In development, always succeed with registration
    const userId = `dev-user-${Math.random().toString(36).substring(2, 9)}`;
    
    return NextResponse.json({
      success: true,
      isSignUpComplete: true,
      userId: userId,
      nextSteps: { signUpStep: 'CONFIRM_SIGN_UP' },
      message: '[DEV MODE] User registered successfully. In production, you would need to check your email to confirm your account.'
    });
  } catch (error: any) {
    console.error('[DEV] Registration error:', error);
    
    // Return a generic error
    return NextResponse.json(
      { error: error.message || 'Failed to register user' },
      { status: 500 }
    );
  }
}