/**
 * Unit tests for authentication login endpoint
 */

import { POST } from '../../login/route';
import { testApiRoute, expectApiSuccess, expectApiError, createMockJWT } from '@/test-utils/api-test-helpers';
import { createMockUser } from '@/test-utils/test-factories';
import { prismaMock } from '@/test-utils/test-db';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  prisma: prismaMock}));

jest.mock('bcryptjs');
jest.mock('speakeasy');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload) => createMockJWT(payload))}));

describe('Login API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = createMockUser({
        email: 'test@example.com',
        password: 'hashedPassword',
        emailVerified: new Date()});

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const response = await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'correctPassword'});

      expectApiSuccess(response);
      expect(response.data).toMatchObject({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          roles: mockUser.roles},
        token: expect.any(String)});

      // Verify audit log created
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          action: 'LOGIN',
          resource: 'AUTH',
          details: { email: mockUser.email }});
    });

    it('should fail with invalid email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: 'nonexistent@example.com',
          password: 'anyPassword'});

      expectApiError(response, 401, 'Invalid credentials');
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should fail with invalid password', async () => {
      const mockUser = createMockUser();
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: mockUser.email,
          password: 'wrongPassword'});

      expectApiError(response, 401, 'Invalid credentials');

      // Verify failed login audit log
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          action: 'LOGIN_FAILED',
          resource: 'AUTH',
          details: { email: mockUser.email, reason: 'Invalid password' }});
    });

    it('should require email verification', async () => {
      const mockUser = createMockUser({
        emailVerified: null, // Not verified
      });

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const response = await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: mockUser.email,
          password: 'correctPassword'});

      expectApiError(response, 403, 'Please verify your email');
    });

    it('should handle two-factor authentication', async () => {
      const mockUser = createMockUser({
        twoFactorEnabled: true,
        twoFactorSecret: 'secret'});

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // First request without 2FA code
      const response1 = await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: mockUser.email,
          password: 'correctPassword'});

      expect(response1.status).toBe(200);
      expect(response1.data).toMatchObject({
        requiresTwoFactor: true,
        message: 'Two-factor authentication required'});

      // Second request with valid 2FA code
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);

      const response2 = await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: mockUser.email,
          password: 'correctPassword',
          twoFactorCode: '123456'});

      expectApiSuccess(response2);
      expect(response2.data.user).toBeDefined();
      expect(response2.data.token).toBeDefined();
    });

    it('should fail with invalid 2FA code', async () => {
      const mockUser = createMockUser({
        twoFactorEnabled: true,
        twoFactorSecret: 'secret'});

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(false);

      const response = await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: mockUser.email,
          password: 'correctPassword',
          twoFactorCode: '999999'});

      expectApiError(response, 401, 'Invalid two-factor code');
    });

    it('should handle account lockout after failed attempts', async () => {
      const mockUser = createMockUser({
        failedLoginAttempts: 5,
        lockedUntil: new Date(Date.now() + 3600000), // Locked for 1 hour
      });

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const response = await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: mockUser.email,
          password: 'anyPassword'});

      expectApiError(response, 429, 'Account locked due to too many failed attempts');
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should increment failed login attempts', async () => {
      const mockUser = createMockUser({
        failedLoginAttempts: 2});

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: mockUser.email,
          password: 'wrongPassword'});

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          failedLoginAttempts: 3,
          lastFailedLogin: expect.any(Date)});
    });

    it('should reset failed attempts on successful login', async () => {
      const mockUser = createMockUser({
        failedLoginAttempts: 3,
        emailVerified: new Date()});

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: mockUser.email,
          password: 'correctPassword'});

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          failedLoginAttempts: 0,
          lastLogin: expect.any(Date)});
    });

    it('should validate input fields', async () => {
      const invalidInputs = [
        { email: '', password: 'password' },
        { email: 'notanemail', password: 'password' },
        { email: 'test@example.com', password: '' },
        { email: 'test@example.com' }, // Missing password
        { password: 'password' }, // Missing email
      ];

      for (const input of invalidInputs) {
        const response = await testApiRoute(POST, {
          method: 'POST',
          body: input});

        expectApiError(response400);
      }
    });

    it('should handle database errors gracefully', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database connection failed'));

      const response = await testApiRoute(POST, {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password'});

      expectApiError(response, 500, 'Authentication service unavailable');
    });
  });
});