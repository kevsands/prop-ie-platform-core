import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-real';
import { AuthErrorCode, UserRole, UserStatus } from '@/types/auth';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { securityMonitor } from '@/lib/security/security-monitor';
import { auditLogger, logAuthSuccess, logAuthFailure } from '@/lib/security/audit-logger';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    request.ip || 
                    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      // Log failed attempt for missing credentials
      logAuthFailure(email || 'unknown', { ipAddress, userAgent }, 'Missing credentials');
      
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: 'Email and password are required',
          field: !email ? 'email' : 'password'
        }
      }, { status: 400 });
    }

    // Check security monitoring before proceeding
    const securityCheck = securityMonitor.monitorAuthAttempt(
      email, 
      ipAddress, 
      false, // We don't know if it's successful yet
      userAgent,
      { requestId: uuidv4() }
    );

    if (!securityCheck.allowed) {
      logAuthFailure(email, { ipAddress, userAgent }, securityCheck.reason || 'Security check failed');
      
      return NextResponse.json({
        success: false,
        error: {
          code: AuthErrorCode.ACCESS_DENIED,
          message: securityCheck.reason || 'Access denied for security reasons'
        }
      }, { status: 429 });
    }

    // Find user in database
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      // Log failed attempt for non-existent user
      securityMonitor.monitorAuthAttempt(email, ipAddress, false, userAgent);
      logAuthFailure(email, { ipAddress, userAgent }, 'User not found');
      
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

    // Verify password (required in production, optional in development)
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_PASSWORD_VERIFICATION === 'true') {
      // Check if user has a password hash (support both 'password' and 'passwordHash' fields)
      const passwordField = (user as any).passwordHash || (user as any).password;
      if (!passwordField) {
        console.error(`User ${email} has no password hash - account may need password reset`);
        return NextResponse.json({
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'Account needs password setup. Please contact support.'
          }
        }, { status: 401 });
      }

      try {
        // For development, accept simple comparison if it's a simple hash
        let isValidPassword = false;
        if (passwordField.endsWith('_hashed') && process.env.NODE_ENV !== 'production') {
          // Simple development password check: password123_hashed matches any password
          isValidPassword = true;
        } else {
          // Use bcrypt for proper password verification
          isValidPassword = await bcrypt.compare(password, passwordField);
        }
        
        if (!isValidPassword) {
          // Log failed authentication attempt
          securityMonitor.monitorAuthAttempt(email, ipAddress, false, userAgent);
          logAuthFailure(email, { ipAddress, userAgent }, 'Invalid password');
          
          console.warn(`Failed login attempt for user: ${email}`);
          return NextResponse.json({
            success: false,
            error: {
              code: AuthErrorCode.INVALID_CREDENTIALS,
              message: 'Invalid email or password'
            }
          }, { status: 401 });
        }
      } catch (error) {
        // Log authentication system error
        securityMonitor.monitorAuthAttempt(email, ipAddress, false, userAgent);
        logAuthFailure(email, { ipAddress, userAgent }, 'Password verification error');
        
        console.error('Password verification error:', error);
        return NextResponse.json({
          success: false,
          error: {
            code: AuthErrorCode.UNKNOWN_ERROR,
            message: 'Authentication error. Please try again.'
          }
        }, { status: 500 });
      }
    } else {
      // Development mode warning
      console.warn('⚠️  Password verification is DISABLED in development mode');
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

    // Log successful authentication
    securityMonitor.monitorAuthAttempt(email, ipAddress, true, userAgent);
    logAuthSuccess(email, { ipAddress, userAgent });

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