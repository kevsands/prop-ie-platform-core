// Email Verification API Routes
import { NextRequest, NextResponse } from 'next/server';
import authService from '@/services/authService';
import { z } from 'zod';

// Validation schema
const verifyEmailSchema = z.object({
  token: z.string()
});

// POST /api/auth/verify-email - Verify email with token
export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();

    // Validate request
    const validatedData = verifyEmailSchema.parse(body);

    // Verify email
    await authService.verifyEmail(validatedData.token);

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully. You can now log in to your account.'
    });
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Email verification failed' },
      { status: 500 }
    );
  }
}

// GET /api/auth/verify-email - Get verification status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token required' },
        { status: 400 }
      );
    }

    // Here you would check if the token exists and is valid
    // For now, return success if token is provided
    return NextResponse.json({ 
      success: true, 
      message: 'Valid verification token'
    });
  } catch (error) {

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
}