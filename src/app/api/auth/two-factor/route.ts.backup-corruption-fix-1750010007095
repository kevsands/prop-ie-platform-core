// Two-Factor Authentication API Routes
import { NextRequest, NextResponse } from 'next/server';
import authService, { TokenPayload } from '@/services/authService';
import { z } from 'zod';

// Request body schema
const requestBodySchema = z.object({
  action: z.enum(['enable', 'verify', 'disable']).optional(),
  userId: z.string().optional(),
  code: z.string().length(6).optional()
});

// Validation schemas
const enableTwoFactorSchema = z.object({
  userId: z.string()
});

const verifyMFASchema = z.object({
  userId: z.string(),
  code: z.string().length(6)
});

// Type for the request body
type RequestBody = z.infer<typeof requestBodySchema>\n  );
// POST /api/auth/two-factor - Manage two-factor authentication
export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);
    const body: unknown = await request.json();
    const validatedBody = requestBodySchema.parse(body);
    const action = validatedBody.action || 'enable';

    try {
      const payload: TokenPayload = await authService.verifyToken(token);

      if (action === 'enable') {
        // Enable two-factor for current user
        const secret = await authService.enableTwoFactor(payload.userId);

        // In production, you would generate a QR code URL
        const qrCodeUrl = `otpauth://totp/PropPlatform:${payload.email}?secret=${secret}&issuer=PropPlatform`;

        return NextResponse.json({ 
          success: true, 
          data: {
            secret,
            qrCodeUrl,
            message: 'Two-factor authentication enabled. Please scan the QR code with your authenticator app.'
          }
        });
      } else if (action === 'verify') {
        // Validate request
        const validatedData = verifyMFASchema.parse(validatedBody);

        // Verify that the user is verifying their own MFA
        if (validatedData.userId !== payload.userId) {
          return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 403 }
          );
        }

        // Verify MFA code
        const isValid = await authService.verifyMFACode(validatedData);

        return NextResponse.json({ 
          success: true, 
          data: { 
            valid: isValid,
            message: isValid ? 'MFA code verified successfully' : 'Invalid MFA code'
          }
        });
      } else if (action === 'disable') {
        // Disable two-factor for current user - update metadata
        const user = await authService.getUserById(payload.userId);
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'User not found' },
            { status: 404 }
          );
        }

        const currentMetadata = (user.metadata as Record<string, any>) || {};
        await authService.updateProfile(payload.userId, {
          metadata: {
            ...currentMetadata,
            twoFactorEnabled: false,
            twoFactorSecret: null
          }
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Two-factor authentication disabled'
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Two-factor operation failed';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// GET /api/auth/two-factor - Get two-factor status
export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);

    try {
      const payload: TokenPayload = await authService.verifyToken(token);
      const user = await authService.getUserById(payload.userId);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      const metadata = (user.metadata as Record<string, any>) || {};

      return NextResponse.json({ 
        success: true, 
        data: {
          enabled: metadata.twoFactorEnabled || false,
          verified: metadata.twoFactorSecret !== null
        }
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get two-factor status';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}