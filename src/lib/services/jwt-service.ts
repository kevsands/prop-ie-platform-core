import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    status: string;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'prop-ie-platform',
    audience: 'prop-ie-users'
  });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'prop-ie-platform',
    audience: 'prop-ie-users'
  });
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'prop-ie-platform',
      audience: 'prop-ie-users'
    }) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify JWT refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'prop-ie-platform',
      audience: 'prop-ie-users'
    }) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthTokens> {
  const { email, password } = credentials;
  
  // Find user with roles
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      UserPermission: true
    }
  });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  if (user.status !== 'ACTIVE') {
    throw new Error('Account is not active');
  }
  
  if (!user.password) {
    throw new Error('Password authentication not available');
  }
  
  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }
  
  // Get user roles
  const roleMappings = await prisma.userRoleMapping.findMany({
    where: { userId: user.id }
  });
  
  const roles = roleMappings.map(mapping => mapping.role);
  
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    roles
  };
  
  // Generate tokens
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);
  
  // Calculate expiration time
  const decoded = jwt.decode(accessToken) as any;
  const expiresIn = decoded.exp - decoded.iat;
  
  // Store refresh token in database
  await prisma.$executeRaw`
    INSERT INTO "Session" (id, "userId", token, "refreshToken", "expiresAt", "ipAddress", "userAgent")
    VALUES (gen_random_uuid(), ${user.id}, ${accessToken}, ${refreshToken}, 
            NOW() + INTERVAL '${JWT_REFRESH_EXPIRES_IN}', '', '')
    ON CONFLICT ("refreshToken") DO UPDATE SET
      token = EXCLUDED.token,
      "expiresAt" = EXCLUDED."expiresAt",
      "lastActivityAt" = NOW()
  `;
  
  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });
  
  return {
    accessToken,
    refreshToken,
    expiresIn,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      status: user.status
    }
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  try {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    
    // Check if refresh token exists in database
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true }
    });
    
    if (!session || session.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }
    
    const user = session.user;
    
    if (user.status !== 'ACTIVE') {
      throw new Error('Account is not active');
    }
    
    // Get current user roles
    const roleMappings = await prisma.userRoleMapping.findMany({
      where: { userId: user.id }
    });
    
    const roles = roleMappings.map(mapping => mapping.role);
    
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      roles
    };
    
    // Generate new access token
    const newAccessToken = generateAccessToken(tokenPayload);
    
    // Update session with new access token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: newAccessToken,
        lastActivityAt: new Date()
      }
    });
    
    const decoded = jwt.decode(newAccessToken) as any;
    const expiresIn = decoded.exp - decoded.iat;
    
    return {
      accessToken: newAccessToken,
      refreshToken,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        status: user.status
      }
    };
  } catch (error) {
    throw new Error('Failed to refresh token: ' + (error as Error).message);
  }
}

/**
 * Logout user by invalidating refresh token
 */
export async function logoutUser(refreshToken: string): Promise<void> {
  try {
    await prisma.session.deleteMany({
      where: { refreshToken }
    });
  } catch (error) {
    // Log error but don't throw - logout should always succeed
    console.error('Error during logout:', error);
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
}

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashPassword,
  verifyPassword,
  authenticateUser,
  refreshAccessToken,
  logoutUser,
  cleanupExpiredSessions
};