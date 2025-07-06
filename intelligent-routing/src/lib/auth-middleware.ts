import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Logger } from '@/utils/logger';

const logger = new Logger('AuthMiddleware');

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  exp: number;
  iat: number;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload = jwt.verify(token, secret) as JWTPayload;
    return payload;
  } catch (error) {
    logger.error('Token verification failed', { error });
    return null;
  }
}

export async function extractToken(request: NextRequest): Promise<string | null> {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return null;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<JWTPayload | null> {
  const token = await extractToken(request);
  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

export function requireAuth(
  handler: (request: NextRequest, context: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: any) => {
    const user = await authenticateRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Add user to request for handler to use
    (request as any).user = user;
    
    return handler(request, context);
  };
}

export function requireRole(
  role: string,
  handler: (request: NextRequest, context: any) => Promise<NextResponse>
) {
  return requireAuth(async (request: NextRequest, context: any) => {
    const user = (request as any).user as JWTPayload;
    
    if (user.role !== role && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return handler(request, context);
  });
}

export function requirePermission(
  permission: string,
  handler: (request: NextRequest, context: any) => Promise<NextResponse>
) {
  return requireAuth(async (request: NextRequest, context: any) => {
    const user = (request as any).user as JWTPayload;
    
    if (!user.permissions.includes(permission) && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return handler(request, context);
  });
}