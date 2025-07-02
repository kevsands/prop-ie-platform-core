import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AuthErrorCode } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Simple in-memory token blacklist (upgrade to Redis in production)
const tokenBlacklist = new Map<string, number>(); // token -> expiration timestamp

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now() / 1000;
  for (const [token, expiration] of tokenBlacklist.entries()) {
    if (expiration < now) {
      tokenBlacklist.delete(token);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

export function isTokenBlacklisted(token: string): boolean {
  const expiration = tokenBlacklist.get(token);
  if (!expiration) return false;
  
  const now = Date.now() / 1000;
  if (expiration < now) {
    tokenBlacklist.delete(token);
    return false;
  }
  
  return true;
}

export function blacklistToken(token: string, expiration: number): void {
  tokenBlacklist.set(token, expiration);
}

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
      
      // Add token to blacklist to prevent reuse
      blacklistToken(token, decoded.exp);
      
      // Log successful logout for security monitoring
      console.log(`✅ User ${decoded.userId} logged out successfully, session ${decoded.sessionId} invalidated`);
      
      // TODO: In production, consider:
      // - Storing blacklist in Redis for multi-instance deployments
      // - Notifying other user sessions of logout
      // - Clearing user-specific caches
      // - Logging logout event for audit trail

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