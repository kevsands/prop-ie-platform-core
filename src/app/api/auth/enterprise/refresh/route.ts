import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { AuthErrorCode, UserRole, UserStatus } from '@/types/auth';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-2025';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-2025';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.SESSION_EXPIRED,
          message: 'Refresh token is required'
        }
      }, { status: 400 });
    }

    try {
      // Verify refresh token (no type check needed - login endpoint doesn't set type)
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

      const client = await pool.connect();
      try {
        // Get user from PostgreSQL database
        const userResult = await client.query(
          'SELECT id, email, first_name, last_name, status, roles FROM users WHERE id = $1 AND deleted_at IS NULL',
          [decoded.userId]
        );

        if (userResult.rows.length === 0) {
          return NextResponse.json({
            success: false,
            error: {
              code: AuthErrorCode.USER_NOT_FOUND,
              message: 'User not found'
            }
          }, { status: 404 });
        }

        // Check if user is active
        if (user.status !== 'active') {
          return NextResponse.json({
            success: false,
            error: {
              code: AuthErrorCode.USER_SUSPENDED,
              message: 'Account is not active'
            }
          }, { status: 403 });
        }

        // Parse role data - PostgreSQL returns array as string like "{admin}" or "{buyer,developer}"
        let roles = [];
        if (user.roles) {
          if (Array.isArray(user.roles)) {
            roles = user.roles;
          } else if (typeof user.roles === 'string') {
            if (user.roles.startsWith('{') && user.roles.endsWith('}')) {
              const roleString = user.roles.slice(1, -1);
              roles = roleString.split(',').map(role => role.trim());
            } else {
              roles = [user.roles];
            }
          } else {
            roles = ['buyer'];
          }
        } else {
          roles = ['buyer'];
        }

        const primaryRole = roles[0] || 'buyer';
        const jwtRole = primaryRole.toUpperCase();

        // Generate new session ID
        const sessionId = randomUUID();
        
        // Generate new tokens (match login endpoint format)
        const newAccessToken = jwt.sign(
          { 
            userId: user.id, 
            email: user.email, 
            role: jwtRole,
            sessionId 
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        const newRefreshToken = jwt.sign(
          { 
            userId: user.id, 
            sessionId
          },
          JWT_REFRESH_SECRET,
          { expiresIn: '7d' }
        );

        const userData = {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: primaryRole,
          roles: roles,
          status: user.status
        };

        return NextResponse.json({
          success: true,
          data: {
            user: userData,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            sessionId,
            expiresIn: 3600 // 1 hour
          }
        });
      } finally {
        client.release();
      }

    } catch (jwtError) {
      console.error('Refresh token verification failed:', jwtError);
      
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.SESSION_EXPIRED,
          message: 'Invalid or expired refresh token'
        }
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Error in /api/auth/enterprise/refresh:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: AuthErrorCode.UNKNOWN_ERROR,
        message: 'Token refresh failed'
      }
    }, { status: 500 });
  }
}