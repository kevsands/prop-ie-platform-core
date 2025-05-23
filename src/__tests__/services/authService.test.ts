// Authentication Service Tests
import authService from '@/services/authService';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('@prisma/client');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn()
  },
  verificationToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn()
  },
  passwordResetToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn()
  }
};

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'BUYER' as const
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: '123',
        email: registerData.email,
        name: registerData.name,
        role: registerData.role,
        password: 'hashedpassword',
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const result = await authService.register(registerData);

      expect(result).toBeDefined();
      expect(result.email).toBe(registerData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password10);
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
        role: 'BUYER' as const
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: '123',
        email: registerData.email
      });

      await expect(authService.register(registerData)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '123',
        email: loginData.email,
        password: 'hashedpassword',
        role: 'BUYER',
        isActive: true
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, lastLoginAt: new Date() });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('accesstoken');

      const result = await authService.login(loginData);

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('accesstoken');
      expect(result.refreshToken).toBeDefined();
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('should throw error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: '123',
        email: loginData.email,
        password: 'hashedpassword',
        isActive: true
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for inactive user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '123',
        email: loginData.email,
        password: 'hashedpassword',
        isActive: false
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const mockPayload = {
        userId: '123',
        email: 'test@example.com',
        role: 'BUYER'
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = await authService.verifyToken('validtoken');

      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith('validtoken', expect.any(String));
    });

    it('should throw error for invalid token', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.verifyToken('invalidtoken')).rejects.toThrow('Invalid token');
    });
  });

  describe('checkPermission', () => {
    it('should allow admin access to all resources', async () => {
      const mockAdmin = {
        id: '123',
        role: 'ADMIN'
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockAdmin);

      const result = await authService.checkPermission('123', 'transactions', 'delete');

      expect(result).toBe(true);
    });

    it('should allow developer to create developments', async () => {
      const mockDeveloper = {
        id: '123',
        role: 'DEVELOPER'
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockDeveloper);

      const result = await authService.checkPermission('123', 'developments', 'create');

      expect(result).toBe(true);
    });

    it('should deny developer from deleting payments', async () => {
      const mockDeveloper = {
        id: '123',
        role: 'DEVELOPER'
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockDeveloper);

      const result = await authService.checkPermission('123', 'payments', 'delete');

      expect(result).toBe(false);
    });

    it('should return false for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await authService.checkPermission('999', 'transactions', 'read');

      expect(result).toBe(false);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      const mockRefreshToken = {
        id: '456',
        token: 'refreshtoken',
        userId: '123',
        expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'BUYER'
        }
      };

      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockRefreshToken);
      mockPrisma.refreshToken.delete.mockResolvedValue(mockRefreshToken);
      (jwt.sign as jest.Mock).mockReturnValue('newaccesstoken');

      const result = await authService.refreshAccessToken('refreshtoken');

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('newaccesstoken');
      expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: mockRefreshToken.id }
      });
    });

    it('should throw error for expired refresh token', async () => {
      const mockRefreshToken = {
        id: '456',
        token: 'expiredtoken',
        userId: '123',
        expiresAt: new Date(Date.now() - 86400000), // 24 hours ago
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'BUYER'
        }
      };

      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockRefreshToken);

      await expect(authService.refreshAccessToken('expiredtoken')).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should delete all refresh tokens for user', async () => {
      await authService.logout('123');

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: '123' }
      });
    });
  });

  describe('requestPasswordReset', () => {
    it('should create password reset token for existing user', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com'
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.passwordResetToken.create.mockResolvedValue({
        id: '789',
        token: 'resettoken',
        userId: '123',
        expiresAt: new Date()
      });

      await authService.requestPasswordReset({ email: 'test@example.com' });

      expect(mockPrisma.passwordResetToken.create).toHaveBeenCalled();
    });

    it('should not throw error for non-existent user (security)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.requestPasswordReset({ email: 'nonexistent@example.com' }))
        .resolves.not.toThrow();
    });
  });

  describe('updatePasswordWithToken', () => {
    it('should update password with valid reset token', async () => {
      const mockResetToken = {
        id: '789',
        token: 'resettoken',
        userId: '123',
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        user: { id: '123' }
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(mockResetToken);
      mockPrisma.user.update.mockResolvedValue({ id: '123', password: 'newhashed' });
      mockPrisma.passwordResetToken.delete.mockResolvedValue(mockResetToken);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');

      await authService.updatePasswordWithToken({
        token: 'resettoken',
        newPassword: 'newpassword123'
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { password: 'newhashed' }
      });
      expect(mockPrisma.passwordResetToken.delete).toHaveBeenCalled();
    });

    it('should throw error for invalid reset token', async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(null);

      await expect(authService.updatePasswordWithToken({
        token: 'invalidtoken',
        newPassword: 'newpassword123'
      })).rejects.toThrow('Invalid or expired reset token');
    });
  });
});