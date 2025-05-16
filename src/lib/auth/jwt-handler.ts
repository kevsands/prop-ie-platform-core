import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || crypto.randomBytes(32).toString('hex');
const JWT_ACCESS_EXPIRY = '15m';
const JWT_REFRESH_EXPIRY = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  sessionId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Token generation
export function generateTokenPair(payload: JWTPayload): TokenPair {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
    audience: 'prop-ie',
    issuer: 'prop-ie-auth',
    subject: payload.userId,
  });
  
  const refreshToken = jwt.sign(
    { userId: payload.userId, sessionId: payload.sessionId },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRY,
      audience: 'prop-ie',
      issuer: 'prop-ie-auth',
      subject: payload.userId,
    }
  );
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60, // 15 minutes in seconds
  };
}

// Token verification
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      audience: 'prop-ie',
      issuer: 'prop-ie-auth',
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

export function verifyRefreshToken(token: string): { userId: string; sessionId: string } {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      audience: 'prop-ie',
      issuer: 'prop-ie-auth',
    }) as { userId: string; sessionId: string };
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

// Token refresh
export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  const { userId, sessionId } = verifyRefreshToken(refreshToken);
  
  // Here you would typically:
  // 1. Verify the session is still valid
  // 2. Get the latest user data
  // 3. Check if the user is still active
  
  // For now, we'll create a new token pair
  const payload: JWTPayload = {
    userId,
    email: '', // You'd fetch this from database
    roles: [], // You'd fetch this from database
    sessionId,
  };
  
  return generateTokenPair(payload);
}

// Session management
const activeSessions = new Map<string, { userId: string; createdAt: Date }>();

export function createSession(userId: string): string {
  const sessionId = crypto.randomBytes(32).toString('hex');
  activeSessions.set(sessionId, { userId, createdAt: new Date() });
  return sessionId;
}

export function validateSession(sessionId: string): boolean {
  return activeSessions.has(sessionId);
}

export function revokeSession(sessionId: string): void {
  activeSessions.delete(sessionId);
}

// Token blacklisting
const blacklistedTokens = new Set<string>();

export function blacklistToken(token: string): void {
  blacklistedTokens.add(token);
}

export function isTokenBlacklisted(token: string): boolean {
  return blacklistedTokens.has(token);
}

// Cleanup expired sessions (run periodically)
export function cleanupExpiredSessions(): void {
  const now = new Date();
  for (const [sessionId, session] of activeSessions.entries()) {
    const sessionAge = now.getTime() - session.createdAt.getTime();
    if (sessionAge > 7 * 24 * 60 * 60 * 1000) { // 7 days
      activeSessions.delete(sessionId);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);