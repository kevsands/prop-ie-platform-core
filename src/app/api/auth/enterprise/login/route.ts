import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-real';
import { AuthErrorCode, UserRole, UserStatus } from '@/types/auth';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: 'Email and password are required',
          field: !email ? 'email' : 'password'
        }
      }, { status: 400 });
    }

    // Find user in database
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.USER_NOT_FOUND,
          message: 'Invalid email or password'
        }
      }, { status: 401 });
    }

    // Check user status
    if (user.status === 'SUSPENDED') {
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.USER_SUSPENDED,
          message: 'Your account has been suspended. Please contact support.'
        }
      }, { status: 403 });
    }

    // In development, skip password validation
    if (process.env.NODE_ENV !== 'development') {
      // TODO: Add password verification in production
      // const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      // if (!isValidPassword) {
      //   return NextResponse.json({
      //     success: false,
      //     error: {
      //       code: AuthErrorCode.INVALID_CREDENTIALS,
      //       message: 'Invalid email or password'
      //     }
      //   }, { status: 401 });
      // }
    }

    // Generate session ID
    const sessionId = uuidv4();
    
    // Generate tokens
    const tokenExpiry = rememberMe ? '30d' : '24h';
    const refreshTokenExpiry = rememberMe ? '90d' : '7d';
    
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.roleData ? JSON.parse(user.roleData)[0]?.toUpperCase() : 'BUYER',
        sessionId 
      },
      JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user.id, 
        sessionId,
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: refreshTokenExpiry }
    );

    // Update last login
    await userService.updateLastLogin(user.id);

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
      lastLoginAt: new Date(),
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    };

    return NextResponse.json({
      success: true,
      data: {
        success: true,
        user: userData,
        accessToken,
        refreshToken,
        expiresIn: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // seconds
        sessionId
      }
    });

  } catch (error) {
    console.error('Enterprise login error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: AuthErrorCode.UNKNOWN_ERROR,
        message: 'Login failed. Please try again.'
      }
    }, { status: 500 });
  }
}