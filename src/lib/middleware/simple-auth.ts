import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-2025';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  status: string;
}

/**
 * Extract and verify JWT token from request
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // For test tokens, bypass database lookup
    if (decoded.userId === 'test-user-001' && process.env.NODE_ENV !== 'production') {
      return {
        id: decoded.userId,
        email: decoded.email,
        firstName: 'Test',
        lastName: 'User',
        roles: decoded.roles || ['DEVELOPER', 'ADMIN'],
        status: 'ACTIVE'
      };
    }
    
    const client = await pool.connect();
    try {
      // Get user details from database
      const userResult = await client.query(
        'SELECT id, email, "firstName", "lastName", status FROM "User" WHERE id = $1 AND status = $2',
        [decoded.userId, 'ACTIVE']
      );
      
      if (userResult.rows.length === 0) {
        return null;
      }
      
      const user = userResult.rows[0];
      
      // Get user roles
      const rolesResult = await client.query(
        'SELECT role FROM "UserRoleMapping" WHERE "userId" = $1',
        [user.id]
      );
      
      const roles = rolesResult.rows.map(row => row.role);
      
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        status: user.status
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthUser, requiredRoles: string[]): boolean {
  if (user.roles.includes('ADMIN')) return true;
  return requiredRoles.some(role => user.roles.includes(role));
}

/**
 * Simple auth wrapper for API routes
 */
export function withSimpleAuth(
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>,
  options: {
    requiredRoles?: string[];
    allowSelfAccess?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const user = await getAuthUser(request);
      
      if (!user) {
        return NextResponse.json(
          {
            error: 'Authentication required',
            message: 'Please login to access this resource'
          },
          { status: 401 }
        );
      }
      
      // Check role requirements
      if (options.requiredRoles && options.requiredRoles.length > 0) {
        if (!hasRole(user, options.requiredRoles)) {
          return NextResponse.json(
            {
              error: 'Insufficient permissions',
              message: `Required roles: ${options.requiredRoles.join(', ')}`
            },
            { status: 403 }
          );
        }
      }
      
      return await handler(request, user);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export default {
  getAuthUser,
  hasRole,
  withSimpleAuth
};