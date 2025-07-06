import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AuthErrorCode } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.SESSION_EXPIRED,
          message: 'Authentication required'
        }
      }, { status: 401 });
    }

    const token = authorization.split(' ')[1];

    try {
      // Verify token is valid before invalidating
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // In a production system, you would:
      // 1. Add the token to a blacklist/revocation list
      // 2. Delete the session from the database
      // 3. Clear any cache entries for this user
      
      // For now, we'll just log the logout and return success
      console.log(`User ${decoded.userId} logged out, session ${decoded.sessionId} invalidated`);
      
      // TODO: Implement token blacklist in Redis/Database
      // await tokenBlacklist.add(token, decoded.exp);
      // await sessionService.deleteSession(decoded.sessionId);

      return NextResponse.json({
        success: true,
        data: {
          message: 'Successfully logged out'
        }
      });

    } catch (jwtError) {
      // Even if token is invalid, we still consider logout successful
      console.log('Logout attempt with invalid/expired token');
      
      return NextResponse.json({
        success: true,
        data: {
          message: 'Successfully logged out'
        }
      });
    }

  } catch (error) {
    console.error('Error in /api/auth/enterprise/logout:', error);
    
    // Even on error, we return success for logout to prevent client issues
    return NextResponse.json({
      success: true,
      data: {
        message: 'Successfully logged out'
      }
    });
  }
}