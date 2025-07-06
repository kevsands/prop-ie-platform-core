import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { cache } from 'react';

// JWT secret - in production this should come from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface AuthToken {
  token: string;
  payload: JWTPayload;
}

export class JWTAuth {
  /**
   * Create a JWT token
   */
  static createToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 7 days
    });
  }

  /**
   * Verify a JWT token
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Get token from cookies
   */
  static getTokenFromCookies(): string | null {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');
    return token?.value || null;
  }

  /**
   * Set token in cookies
   */
  static setTokenInCookies(token: string): void {
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  }

  /**
   * Remove token from cookies
   */
  static removeTokenFromCookies(): void {
    const cookieStore = cookies();
    cookieStore.delete('auth-token');
  }

  /**
   * Get current user from token
   */
  static getCurrentUser(): JWTPayload | null {
    const token = this.getTokenFromCookies();
    if (!token) return null;
    return this.verifyToken(token);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Check if user has a specific role
   */
  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) return false;
    return roles.some(role => user.roles.includes(role));
  }
}

// Export a cached version of getCurrentUser for use in React Server Components
export const getCachedUser = cache(() => JWTAuth.getCurrentUser());