// Authentication Service
import { PrismaClient, User, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;
const SALT_ROUNDS = 10;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  companyName?: string;
  licenseNumber?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  roles: UserRole[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  token: string;
  newPassword: string;
}

export interface VerifyMFARequest {
  userId: string;
  code: string;
}

class AuthService {
  // Register new user
  async register(request: RegisterRequest): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: request.email }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(request.passwordSALT_ROUNDS);

      // Parse name into firstName and lastName
      const nameParts = request.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // Use same as firstName if no lastName

      // Create user
      const user = await prisma.user.create({
        data: {
          email: request.email,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          roles: [request.role], // Convert single role to array
          phone: request.phoneNumber,
          organization: request.companyName,
          position: request.licenseNumber,
          status: 'ACTIVE' as any
        }
      });

      // Generate verification token
      await this.createVerificationToken(user.id);

      // Send verification email (implemented in notification service)
      // await notificationService.sendVerificationEmail(user);

      return user;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user
  async login(request: LoginRequest): Promise<AuthTokens> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: request.email }
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(request.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      return tokens;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Generate JWT tokens
  async generateTokens(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      roles: user.roles
    };

    // Generate access token
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY
    });

    // Generate refresh token
    const refreshToken = randomBytes(40).toString('hex');
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    // Save refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiry
      }
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 24 * 60 * 60 // 24 hours in seconds
    };
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const payload = jwt.verify(tokenJWT_SECRET) as TokenPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Find refresh token in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }
      });

      if (!storedToken || storedToken.expiresAt <new Date()) {
        throw new Error('Invalid refresh token');
      }

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });

      // Generate new tokens
      const tokens = await this.generateTokens(storedToken.user);

      return tokens;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  // Logout user
  async logout(userId: string): Promise<void> {
    try {
      // Delete all refresh tokens for user
      await prisma.refreshToken.deleteMany({
        where: { userId }
      });
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  // Request password reset
  async requestPasswordReset(request: PasswordResetRequest): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: request.email }
      });

      if (!user) {
        // Don't reveal if user exists
        return;
      }

      // Generate reset token
      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpiry = addMinutes(new Date(), 60);

      await prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt: resetTokenExpiry
        }
      });

      // Send reset email (implemented in notification service)
      // await notificationService.sendPasswordResetEmail(userresetToken);
    } catch (error) {
      throw new Error(`Password reset request failed: ${error.message}`);
    }
  }

  // Update password with reset token
  async updatePasswordWithToken(request: PasswordUpdateRequest): Promise<void> {
    try {
      // Find reset token
      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token: request.token },
        include: { user: true }
      });

      if (!resetToken || resetToken.expiresAt <new Date()) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(request.newPasswordSALT_ROUNDS);

      // Update user password
      await prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword }
      });

      // Delete reset token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      });
    } catch (error) {
      throw new Error(`Password update failed: ${error.message}`);
    }
  }

  // Enable two-factor authentication
  async enableTwoFactor(userId: string): Promise<string> {
    try {
      // Generate secret
      const secret = randomBytes(32).toString('hex');

      // Get current user to preserve existing metadata
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const currentMetadata = user.metadata as Record<string, any> || {};

      await prisma.user.update({
        where: { id: userId },
        data: {
          metadata: {
            ...currentMetadata,
            twoFactorEnabled: true,
            twoFactorSecret: secret
          }
        }
      });

      return secret;
    } catch (error) {
      throw new Error(`Two-factor setup failed: ${error.message}`);
    }
  }

  // Verify MFA code
  async verifyMFACode(request: VerifyMFARequest): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.userId }
      });

      if (!user) {
        return false;
      }

      const metadata = user.metadata as Record<string, any> || {};

      if (!metadata.twoFactorEnabled || !metadata.twoFactorSecret) {
        return false;
      }

      // Here you would implement TOTP verification
      // For now, we'll just check if the code matches a test value
      const isValid = request.code === '123456'; // Replace with actual TOTP verification

      return isValid;
    } catch (error) {
      throw new Error(`MFA verification failed: ${error.message}`);
    }
  }

  // Check permissions for a user
  async checkPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return false;
      }

      // Define role-based permissions
      const permissions: Record<UserRole, Record<string, string[]>> = {
        ADMIN: {
          '*': ['*'] // Admin has all permissions
        },
        DEVELOPER: {
          developments: ['create', 'read', 'update', 'delete'],
          units: ['create', 'read', 'update', 'delete'],
          transactions: ['read', 'update'],
          analytics: ['read']
        },
        BUYER: {
          transactions: ['create', 'read'],
          documents: ['read', 'sign'],
          payments: ['create', 'read']
        },
        SOLICITOR: {
          transactions: ['read', 'update'],
          documents: ['create', 'read', 'update', 'sign'],
          kyc: ['create', 'read', 'update']
        },
        AGENT: {
          developments: ['read'],
          units: ['read'],
          transactions: ['create', 'read'],
          analytics: ['read']
        },
        ARCHITECT: {
          developments: ['read', 'update'],
          documents: ['create', 'read', 'upload'],
          tasks: ['create', 'update']
        },
        CONTRACTOR: {
          developments: ['read'],
          tasks: ['read', 'update'],
          documents: ['upload']
        },
        INVESTOR: {
          developments: ['read'],
          units: ['read'],
          transactions: ['read'],
          analytics: ['read'],
          payments: ['read'],
          documents: ['read'],
          investments: ['create', 'read', 'update']
        },
        ENGINEER: {
          developments: ['read', 'update'],
          units: ['read', 'update'],
          documents: ['create', 'read', 'update', 'upload'],
          tasks: ['create', 'read', 'update'],
          analytics: ['read'],
          inspections: ['create', 'read', 'update']
        },
        QUANTITY_SURVEYOR: {
          developments: ['read'],
          units: ['read'],
          documents: ['create', 'read', 'update', 'upload'],
          analytics: ['read'],
          costEstimates: ['create', 'read', 'update'],
          boq: ['create', 'read', 'update']
        },
        LEGAL: {
          documents: ['create', 'read', 'update', 'sign'],
          transactions: ['read', 'update'],
          compliance: ['create', 'read', 'update'],
          contracts: ['create', 'read', 'update', 'sign'],
          kyc: ['read'],
          analytics: ['read']
        },
        PROJECT_MANAGER: {
          developments: ['create', 'read', 'update'],
          units: ['create', 'read', 'update'],
          tasks: ['create', 'read', 'update', 'delete'],
          documents: ['create', 'read', 'update', 'upload'],
          analytics: ['read'],
          tenders: ['create', 'read', 'update'],
          transactions: ['read']
        }
      } as any;

      // Check permissions for each role the user has
      for (const role of user.roles) {
        const rolePermissions = permissions[role];

        if (!rolePermissions) {
          continue;
        }

        // Check if role has wildcard permission
        if (rolePermissions['*'] && rolePermissions['*'].includes('*')) {
          return true;
        }

        // Check specific resource permission
        const resourcePermissions = rolePermissions[resource];
        if (resourcePermissions && (resourcePermissions.includes(action) || resourcePermissions.includes('*'))) {
          return true;
        }
      }

      return false;
    } catch (error) {
      throw new Error(`Permission check failed: ${error.message}`);
    }
  }

  // Create email verification token
  private async createVerificationToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = addMinutes(new Date(), 60);

    await prisma.verificationToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });

    return token;
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<void> {
    try {
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
        include: { user: true }
      });

      if (!verificationToken || verificationToken.expiresAt <new Date()) {
        throw new Error('Invalid or expired verification token');
      }

      // Update user as verified
      await prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true }
      });

      // Delete verification token
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id }
      });
    } catch (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      return user;
    } catch (error) {
      throw new Error(`User fetch failed: ${error.message}`);
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      return user;
    } catch (error) {
      throw new Error(`User fetch failed: ${error.message}`);
    }
  }

  // Update user profile
  async updateProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: updates
      });

      return user;
    } catch (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  // Deactivate user account
  async deactivateAccount(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false }
      });

      // Also logout the user
      await this.logout(userId);
    } catch (error) {
      throw new Error(`Account deactivation failed: ${error.message}`);
    }
  }
}

export default new AuthService();

export const authService = new AuthService();

{/* Auto-added closing tags */}
</User></User></User></User></User>

{/* Auto-added closing tags */}
</AuthTokens></AuthTokens></AuthTokens>

{/* Auto-added closing tags */}
</TokenPayload>

{/* Auto-added closing tags */}
</UserRole>