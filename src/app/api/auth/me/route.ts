import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-2025';

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authorization token required'
        }
      }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (jwtError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      }, { status: 401 });
    }

    console.log('🔍 /api/auth/me: Token decoded for user:', decoded.email);

    // Get user from PostgreSQL database using direct query
    const userResult = await client.query(
      'SELECT id, email, first_name, last_name, roles, status FROM users WHERE id = $1 AND deleted_at IS NULL',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Parse role data - PostgreSQL returns array as string like "{admin}" or "{buyer,developer}"
    let roles = [];
    if (user.roles) {
      if (Array.isArray(user.roles)) {
        // Already an array
        roles = user.roles;
      } else if (typeof user.roles === 'string') {
        // PostgreSQL array format: "{admin}" or "{buyer,developer}"
        if (user.roles.startsWith('{') && user.roles.endsWith('}')) {
          const roleString = user.roles.slice(1, -1); // Remove { and }
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

    console.log('✅ /api/auth/me: User found:', user.email);

    // Return user data
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: roles[0] || 'buyer',
        roles: roles,
        status: user.status
      }
    });

  } catch (error) {
    console.error('❌ /api/auth/me error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An internal error occurred'
      }
    }, { status: 500 });
  } finally {
    client.release();
  }
}