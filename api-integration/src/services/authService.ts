import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Logger } from '@/utils/logger';

const prisma = new PrismaClient();
const logger = new Logger('AuthService');

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
  };
}

export class AuthService {
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private jwtExpiresIn: string;
  private refreshExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    if (this.jwtSecret === 'default-secret') {
      logger.warn('Using default JWT secret - not secure for production');
    }
  }

  /**
   * Login a user
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: {
          role: {
            include: { permissions: true }
          }
        }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Generate tokens
      const { token, refreshToken } = this.generateTokens(user);

      logger.info('User logged in', { userId: user.id, email: user.email });

      return {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.name,
          permissions: user.role.permissions.map(p => p.name)
        }
      };
    } catch (error) {
      logger.error('Login failed', { email: input.email, error });
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 10);

      // Get default role
      const defaultRole = await prisma.role.findUnique({
        where: { name: input.role || 'buyer' },
        include: { permissions: true }
      });

      if (!defaultRole) {
        throw new Error('Default role not found');
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          roleId: defaultRole.id
        },
        include: {
          role: {
            include: { permissions: true }
          }
        }
      });

      // Generate tokens
      const { token, refreshToken } = this.generateTokens(user);

      logger.info('User registered', { userId: user.id, email: user.email });

      return {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.name,
          permissions: user.role.permissions.map(p => p.name)
        }
      };
    } catch (error) {
      logger.error('Registration failed', { email: input.email, error });
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const payload = jwt.verify(refreshToken, this.jwtRefreshSecret) as any;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          role: {
            include: { permissions: true }
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      return {
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.name,
          permissions: user.role.permissions.map(p => p.name)
        }
      };
    } catch (error) {
      logger.error('Token refresh failed', { error });
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Verify a JWT token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      logger.error('Token verification failed', { error });
      throw new Error('Invalid token');
    }
  }

  /**
   * Generate JWT and refresh tokens
   */
  private generateTokens(user: any): { token: string; refreshToken: string } {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions.map((p: any) => p.name)
    };

    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      this.jwtRefreshSecret,
      { expiresIn: this.refreshExpiresIn }
    );

    return { token, refreshToken };
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: newPasswordHash,
          passwordChangedAt: new Date()
        }
      });

      logger.info('Password changed', { userId });
    } catch (error) {
      logger.error('Password change failed', { userId, error });
      throw error;
    }
  }

  /**
   * Reset user password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Don't reveal if user exists
        logger.warn('Password reset requested for non-existent user', { email });
        return;
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id, purpose: 'password-reset' },
        this.jwtSecret,
        { expiresIn: '1h' }
      );

      // In a real application, you would:
      // 1. Store the reset token in the database
      // 2. Send an email with the reset link
      // 3. Have a separate endpoint to handle the reset

      logger.info('Password reset requested', { userId: user.id, email });

      // For now, just log the token
      logger.debug('Reset token generated', { resetToken });
    } catch (error) {
      logger.error('Password reset failed', { email, error });
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();