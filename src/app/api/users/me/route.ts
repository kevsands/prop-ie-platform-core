// src/app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-real';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('Authorization') || request.headers.get('authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract token and get user ID from it
    const token = authorization.split(' ')[1];
    
    // In dev mode, token format is "dev-token-{userId}"
    if (token.startsWith('dev-token-')) {
      const userId = token.replace('dev-token-', '');
      
      // Fetch user from database
      const user = await userService.getUserById(userId);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Return user data in expected format
      const role = (JSON.parse(user.roleData || '["buyer"]')[0] || 'buyer').toUpperCase();
      
      return NextResponse.json({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: role,
        organisationId: 'fitzgeraldgardens',
        permissions: [
          { resource: 'projects', action: 'read' },
          { resource: 'units', action: 'read' }
        ]
      });
    }

    // If not a dev token, return unauthorized
    return NextResponse.json(
      { error: 'Invalid token format' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Error in /api/users/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}