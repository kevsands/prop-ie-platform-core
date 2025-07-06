import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-real';
import { AuthErrorCode, UserRole, UserStatus } from '@/types/auth';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key';

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
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      
      if (decoded.type !== 'refresh') {
        return NextResponse.json({
          success: false,
          error: {
            code: AuthErrorCode.SESSION_EXPIRED,
            message: 'Invalid token type'
          }
        }, { status: 401 });
      }

      // Get user from database
      const user = await userService.getUserById(decoded.userId);
      
      if (!user) {
        return NextResponse.json({
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND,
            message: 'User not found'
          }
        }, { status: 404 });
      }

      // Check if user is suspended
      if (user.status === 'SUSPENDED') {
        return NextResponse.json({
          success: false,
          error: {
            code: AuthErrorCode.USER_SUSPENDED,
            message: 'Account suspended'
          }
        }, { status: 403 });
      }

      // Generate new session ID
      const sessionId = uuidv4();
      
      // Generate new tokens
      const newAccessToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.roleData ? JSON.parse(user.roleData)[0]?.toUpperCase() : 'BUYER',
          sessionId 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const newRefreshToken = jwt.sign(
        { 
          userId: user.id, 
          sessionId,
          type: 'refresh'
        },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Get user role and permissions
      const role = user.roleData ? JSON.parse(user.roleData)[0]?.toUpperCase() : 'BUYER';
      const permissions = [
        { resource: 'projects', action: 'read' },
        { resource: 'units', action: 'read' }
      ];

      // Add role-specific permissions
      if (role === 'ADMIN') {
        permissions.push(
          { resource: 'users', action: 'read' },
          { resource: 'users', action: 'write' },
          { resource: 'system', action: 'admin' }
        );
      } else if (role === 'DEVELOPER') {
        permissions.push(
          { resource: 'projects', action: 'write' },
          { resource: 'analytics', action: 'read' },
          { resource: 'sales', action: 'read' }
        );
      } else if (role === 'AGENT') {
        permissions.push(
          { resource: 'clients', action: 'read' },
          { resource: 'clients', action: 'write' },
          { resource: 'commissions', action: 'read' }
        );
      }

      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || undefined,
        role: role as UserRole,
        status: (user.status || 'ACTIVE') as UserStatus,
        organisationId: user.organisationId || 'fitzgeraldgardens',
        permissions,
        emailVerified: user.emailVerified || false,
        mfaEnabled: false,
        lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      };

      return NextResponse.json({
        success: true,
        data: {
          success: true,
          user: userData,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: 24 * 60 * 60, // 24 hours in seconds
          sessionId
        }
      });

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