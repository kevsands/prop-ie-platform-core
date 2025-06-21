import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-real';
import { AuthErrorCode, UserRole, UserStatus } from '@/types/auth';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      journeyContext, 
      userRole = 'buyer' 
    } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: 'All fields are required',
          field: !email ? 'email' : !password ? 'password' : !firstName ? 'firstName' : 'lastName'
        }
      }, { status: 400 });
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: 'Invalid email format',
          field: 'email'
        }
      }, { status: 400 });
    }

    // Check if user already exists
    try {
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json({
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND, // Reusing error code for user exists
            message: 'An account with this email already exists',
            field: 'email'
          }
        }, { status: 409 });
      }
    } catch (error) {
      // User doesn't exist, which is what we want for registration
    }

    // Generate user ID and session
    const userId = uuidv4();
    const sessionId = uuidv4();
    
    // Create user in database
    const newUser = {
      id: userId,
      email,
      firstName,
      lastName,
      phone: '', // Will be filled in profile completion
      roleData: JSON.stringify([userRole]),
      status: 'ACTIVE',
      emailVerified: false,
      organisationId: 'fitzgeraldgardens', // Default organization
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      journeyContext: JSON.stringify(journeyContext || {}),
      registrationSource: journeyContext?.source || 'direct',
      completionScore: 30 // Basic info complete
    };

    // In development, we'll skip password hashing for simplicity
    // In production, you'd hash the password here
    // const hashedPassword = await bcrypt.hash(password, 12);
    
    try {
      await userService.createEnterpriseUser(newUser);
    } catch (error) {
      console.error('User creation failed:', error);
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'Registration failed. Please try again.'
        }
      }, { status: 500 });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { 
        userId, 
        email, 
        role: userRole.toUpperCase(),
        sessionId 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { 
        userId, 
        sessionId,
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Get user role and permissions
    const role = userRole.toUpperCase() as UserRole;
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
    }

    const userData = {
      id: userId,
      email,
      firstName,
      lastName,
      phone: '',
      role,
      status: 'ACTIVE' as UserStatus,
      organisationId: 'fitzgeraldgardens',
      permissions,
      emailVerified: false,
      mfaEnabled: false,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: {
        success: true,
        user: userData,
        accessToken,
        refreshToken,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
        sessionId,
        journeyContext,
        message: 'Registration successful'
      }
    });

  } catch (error) {
    console.error('Enterprise registration error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: AuthErrorCode.UNKNOWN_ERROR,
        message: 'Registration failed. Please try again.'
      }
    }, { status: 500 });
  }
}