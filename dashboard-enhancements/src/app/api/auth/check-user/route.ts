import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        role: true,
        lastLogin: true,
        loginAttempts: true,
        lockedUntil: true,
        twoFactorEnabled: true,
        trustedDevices: true,
      }
    });

    if (!user) {
      // Don't reveal that the user doesn't exist for security
      // But internally we know this is a new user
      return NextResponse.json({
        exists: false,
        requiresRegistration: true,
      });
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remainingTime = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { 
          error: `Account is locked. Please try again in ${remainingTime} minutes.`,
          lockedUntil: user.lockedUntil,
        },
        { status: 423 } // Locked status
      );
    }

    // Check for suspicious activity
    const recentAttempts = await prisma.loginAttempt.count({
      where: {
        email: email.toLowerCase(),
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        },
        success: false
      }
    });

    if (recentAttempts > 5) {
      // Too many failed attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lockedUntil: new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
        }
      });

      return NextResponse.json(
        { 
          error: 'Too many failed attempts. Account has been locked for 30 minutes.',
          requiresSupport: true,
        },
        { status: 423 }
      );
    }

    // Get device fingerprint
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    
    const deviceFingerprint = crypto
      .createHash('sha256')
      .update(`${userAgent}${acceptLanguage}${acceptEncoding}`)
      .digest('hex');

    // Check if this is a trusted device
    const isTrustedDevice = user.trustedDevices?.includes(deviceFingerprint);

    // Determine authentication methods available
    const authMethods = {
      password: true,
      otp: true,
      biometric: isTrustedDevice && hasWebAuthnSupport(userAgent),
      socialLogin: ['BUYER', 'SELLER'].includes(user.role || ''),
    };

    // Risk assessment
    const riskScore = await calculateRiskScore({
      user,
      deviceFingerprint,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent,
      recentAttempts,
    });

    // Determine if we need enhanced authentication
    const requiresEnhancedAuth = riskScore > 50 || 
                               !isTrustedDevice || 
                               user.role === 'ADMIN' ||
                               user.role === 'DEVELOPER';

    return NextResponse.json({
      exists: true,
      userId: user.id,
      role: user.role,
      authMethods,
      requiresEnhancedAuth,
      requiresMFA: user.twoFactorEnabled,
      isTrustedDevice,
      riskScore,
      lastLogin: user.lastLogin,
    });

  } catch (error: any) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function hasWebAuthnSupport(userAgent: string): boolean {
  // Simple check for WebAuthn support based on user agent
  const supportedBrowsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  return supportedBrowsers.some(browser => userAgent.includes(browser));
}

async function calculateRiskScore(params: {
  user: any;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  recentAttempts: number;
}): Promise<number> {
  let score = 0;
  
  // New device
  if (!params.user.trustedDevices?.includes(params.deviceFingerprint)) {
    score += 25;
  }
  
  // Failed attempts
  score += params.recentAttempts * 10;
  
  // Time since last login
  if (params.user.lastLogin) {
    const daysSinceLastLogin = (Date.now() - new Date(params.user.lastLogin).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastLogin > 30) score += 15;
    if (daysSinceLastLogin > 90) score += 25;
  }
  
  // Check for VPN/Proxy (simplified)
  const suspiciousIPs = ['10.', '172.16.', '192.168.'];
  if (suspiciousIPs.some(prefix => params.ipAddress.startsWith(prefix))) {
    score += 20;
  }
  
  // Browser anomalies
  if (params.userAgent.includes('bot') || params.userAgent.includes('crawler')) {
    score += 50;
  }
  
  return Math.min(score, 100);
}