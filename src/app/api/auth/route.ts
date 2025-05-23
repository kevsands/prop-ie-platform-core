// Authentication API Routes
import { NextRequest, NextResponse } from 'next/server';
import authService from '@/services/authService';
import { z } from 'zod';

// Type definitions for request body
interface AuthRequestBody {
  action?: string;
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  phoneNumber?: string;
  companyName?: string;
  licenseNumber?: string;
  refreshToken?: string;
}

interface ProfileUpdateBody {
  name?: string;
  phoneNumber?: string;
  companyName?: string;
  pushNotifications?: boolean;
  transactionAlerts?: boolean;
  paymentReminders?: boolean;
  documentUpdates?: boolean;
  marketingCommunications?: boolean;
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['ADMIN', 'DEVELOPER', 'BUYER', 'SOLICITOR', 'AGENT', 'ARCHITECT', 'CONTRACTOR']),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  licenseNumber: z.string().optional()
});

const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

// POST /api/auth - Login
export async function POST(request: NextRequest) {
  try {
    const body: AuthRequestBody = await request.json();
    const action = body.action || 'login';

    if (action === 'login') {
      // Validate login request
      const validatedData = loginSchema.parse(body);

      // Perform login
      const tokens = await authService.login(validatedData);

      // Set cookies
      const response = NextResponse.json({ 
        success: true, 
        data: {
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn
        }
      });

      // Set refresh token as HTTP-only cookie
      response.cookies.set('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      return response;
    } else if (action === 'register') {
      // Validate registration request
      const validatedData = registerSchema.parse(body);

      // Register user
      const user = await authService.register(validatedData);

      return NextResponse.json({ 
        success: true, 
        data: { 
          userId: user.id,
          message: 'Registration successful. Please check your email to verify your account.'
        } 
      });
    } else if (action === 'refresh') {
      // Get refresh token from cookie or body
      const refreshToken = request.cookies.get('refreshToken')?.value || body.refreshToken;

      if (!refreshToken) {
        return NextResponse.json(
          { success: false, error: 'Refresh token required' },
          { status: 401 }
        );
      }

      // Refresh tokens
      const tokens = await authService.refreshAccessToken(refreshToken);

      // Set cookies
      const response = NextResponse.json({ 
        success: true, 
        data: {
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn
        }
      });

      // Update refresh token cookie
      response.cookies.set('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      return response;
    } else if (action === 'logout') {
      // Get user ID from token or session
      const authorization = request.headers.get('authorization');

      if (!authorization || !authorization.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      const token = authorization.substring(7);

      try {
        const payload = await authService.verifyToken(token);
        await authService.logout(payload.userId);

        // Clear cookies
        const response = NextResponse.json({ 
          success: true, 
          message: 'Logged out successfully' 
        });

        response.cookies.delete('refreshToken');

        return response;
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid token' },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 500 }
    );
  }
}

// GET /api/auth - Get current user info
export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);

    try {
      const payload = await authService.verifyToken(token);
      const user = await authService.getUserById(payload.userId);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Remove sensitive fields
      const { password, ...safeUser } = user;

      return NextResponse.json({ 
        success: true, 
        data: safeUser
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to get user info' },
      { status: 500 }
    );
  }
}

// PATCH /api/auth - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);
    const body: ProfileUpdateBody = await request.json();

    try {
      const payload = await authService.verifyToken(token);

      // Extract and transform the ProfileUpdateBody into User fields
      const userUpdates: any = {};

      // Map name to firstName and lastName
      if (body.name !== undefined) {
        const nameParts = body.name.split(' ');
        userUpdates.firstName = nameParts[0];
        userUpdates.lastName = nameParts.slice(1).join(' ') || nameParts[0];
      }

      // Map phoneNumber to phone
      if (body.phoneNumber !== undefined) {
        userUpdates.phone = body.phoneNumber;
      }

      // Map companyName to organization
      if (body.companyName !== undefined) {
        userUpdates.organization = body.companyName;
      }

      // Map notification preferences to the preferences JSON field
      const notificationPreferences = {
        pushNotifications: body.pushNotifications,
        transactionAlerts: body.transactionAlerts,
        paymentReminders: body.paymentReminders,
        documentUpdates: body.documentUpdates,
        marketingCommunications: body.marketingCommunications
      };

      // Remove undefined notification values
      Object.keys(notificationPreferences).forEach(key => {
        if (notificationPreferences[key as keyof typeof notificationPreferences] === undefined) {
          delete notificationPreferences[key as keyof typeof notificationPreferences];
        }
      });

      // If there are notification preferences to update, merge them with existing preferences
      if (Object.keys(notificationPreferences).length> 0) {
        const currentUser = await authService.getUserById(payload.userId);
        const currentPreferences = currentUser?.preferences || {};

        // Safely handle the Prisma Json type
        const preferences = typeof currentPreferences === 'object' && currentPreferences !== null
          ? currentPreferences as Record<string, any>
          : {};

        const currentNotifications = preferences.notifications || {};

        userUpdates.preferences = {
          ...preferences,
          notifications: {
            ...currentNotifications,
            ...notificationPreferences
          }
        };
      }

      const updatedUser = await authService.updateProfile(payload.userIduserUpdates);

      // Remove sensitive fields
      const { password, ...safeUser } = updatedUser;

      return NextResponse.json({ 
        success: true, 
        data: safeUser
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 500 }
    );
  }
}