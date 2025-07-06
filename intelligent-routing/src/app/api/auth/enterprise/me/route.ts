import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-real';
import { AuthErrorCode, UserRole, UserStatus } from '@/types/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function GET(request: NextRequest) {
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
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
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
        data: userData
      });

    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.SESSION_EXPIRED,
          message: 'Invalid or expired token'
        }
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Error in /api/auth/enterprise/me:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: AuthErrorCode.UNKNOWN_ERROR,
        message: 'Internal server error'
      }
    }, { status: 500 });
  }
}