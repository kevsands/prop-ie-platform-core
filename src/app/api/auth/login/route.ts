import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-2025';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-2025';

// Role to dashboard mapping
const ROLE_DASHBOARDS = {
  'buyer': '/buyer',
  'developer': '/developer',
  'agent': '/agents',
  'solicitor': '/solicitor',
  'admin': '/admin',
  'investor': '/investor',
  'architect': '/architect',
  'engineer': '/engineer',
  'contractor': '/contractor',
  'project_manager': '/project-manager',
  'quantity_surveyor': '/quantity-surveyor',
  'mortgage_broker': '/financial',
  'financial_advisor': '/financial',
  'insurance_broker': '/financial',
  'surveyor': '/surveyor',
  'valuer': '/valuer',
  'property_manager': '/property-manager'
};

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email and password are required'
        }
      }, { status: 400 });
    }

    console.log('🔐 PostgreSQL Login attempt for:', email);

    // Find user in PostgreSQL database using direct query
    const userResult = await client.query(
      'SELECT id, email, first_name, last_name, password_hash, status, roles FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ User not found in PostgreSQL:', email);
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      }, { status: 401 });
    }

    const user = userResult.rows[0];
    console.log('✅ User found in PostgreSQL:', user.email);

    // Check if user is active
    if (user.status !== 'active') {
      console.log('❌ User not active:', user.status);
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Account is not active. Please contact support.'
        }
      }, { status: 401 });
    }

    // Verify password
    let isValidPassword = false;
    
    if (user.password_hash) {
      if (user.password_hash.startsWith('$2')) {
        // Properly hashed password with bcrypt
        isValidPassword = await bcrypt.compare(password, user.password_hash);
      } else {
        // Plain text or simple hash (for development)
        isValidPassword = user.password_hash === password || user.password_hash === `${password}_hashed`;
      }
    } else {
      // No password set - reject
      console.log('❌ No password set for user:', email);
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCOUNT_SETUP_REQUIRED',
          message: 'Account setup required. Please contact support.'
        }
      }, { status: 401 });
    }

    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      }, { status: 401 });
    }

    console.log('✅ Password valid for:', email);

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
    

    const primaryRole = roles[0] || 'buyer';
    // Convert role to uppercase for JWT token (middleware expects uppercase)
    const jwtRole = primaryRole.toUpperCase();

    // Generate tokens
    const sessionId = randomUUID();
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: jwtRole, // Use uppercase role for middleware compatibility
        sessionId
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        sessionId
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Update last login (Skip for now due to trigger issues)
    // await client.query(
    //   'UPDATE users SET last_login_at = NOW() WHERE id = $1',
    //   [user.id]
    // );

    // Get dashboard route
    const dashboardRoute = ROLE_DASHBOARDS[primaryRole] || '/dashboard';

    console.log('✅ PostgreSQL Login successful for:', email, 'Role:', primaryRole, 'Dashboard:', dashboardRoute);

    // Return successful login response
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: primaryRole,
          roles: roles,
          status: user.status
        },
        accessToken,
        refreshToken,
        sessionId,
        dashboardRoute,
        expiresIn: 3600 // 1 hour
      }
    });

  } catch (error) {
    console.error('❌ PostgreSQL Login error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An internal error occurred. Please try again.'
      }
    }, { status: 500 });
  } finally {
    client.release();
  }
}