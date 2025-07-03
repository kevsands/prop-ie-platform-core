// Test endpoint for authentication integration
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth-middleware';
import { getUserContext } from '@/lib/utils/auth-utils';

// GET /api/auth/test - Test authentication integration
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const userContext = getUserContext(user);
    
    return NextResponse.json({
      success: true,
      message: 'Authentication working correctly',
      user: userContext,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Auth test error:', error);
    
    return NextResponse.json(
      { error: 'Authentication test failed' },
      { status: 500 }
    );
  }
}, {
  // No specific permissions required - just basic authentication
});

// POST /api/auth/test - Test with specific roles
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const userContext = getUserContext(user);
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'Role-based authentication working correctly',
      user: userContext,
      requestBody: body,
      hasMessagingAccess: user.roles.some(role => 
        ['DEVELOPER', 'ARCHITECT', 'ENGINEER', 'BUYER', 'ADMIN'].includes(role)
      ),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Auth role test error:', error);
    
    return NextResponse.json(
      { error: 'Role authentication test failed' },
      { status: 500 }
    );
  }
}, {
  roles: ['DEVELOPER', 'ARCHITECT', 'ENGINEER', 'BUYER', 'ADMIN']
});