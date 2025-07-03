import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-2025';

/**
 * Test endpoint to generate JWT token for testing
 * Only available in development
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { userId = 'test-user-001', roles = ['DEVELOPER', 'ADMIN'] } = body;

    // Generate test JWT token
    const token = jwt.sign(
      {
        userId,
        email: 'test@prop.ie',
        roles
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      token,
      user: {
        id: userId,
        email: 'test@prop.ie',
        firstName: 'Test',
        lastName: 'User',
        roles,
        status: 'ACTIVE'
      },
      message: 'Test token generated successfully'
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to generate test token',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Generate default test token
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    );
  }

  const token = jwt.sign(
    {
      userId: 'test-user-001',
      email: 'test@prop.ie',
      roles: ['DEVELOPER', 'ADMIN', 'PROJECT_MANAGER']
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return NextResponse.json({
    token,
    instructions: {
      usage: 'Add this as Authorization header: Bearer [token]',
      example: `curl -H "Authorization: Bearer ${token}" http://localhost:3003/api/documents/templates`
    }
  });
}