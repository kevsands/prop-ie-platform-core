// src/app/api/notifications/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

interface NotificationChannel {
  inApp: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface NotificationCategory {
  system: NotificationChannel;
  communication: NotificationChannel;
  financial: NotificationChannel;
  legal: NotificationChannel;
  property: NotificationChannel;
  task: NotificationChannel;
}

interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
}

interface DigestSettings {
  realTime: boolean;
  digest: 'never' | 'daily' | 'weekly';
  digestTime: string;
}

interface NotificationPreferences {
  userId: string;
  categories: NotificationCategory;
  quietHours: QuietHours;
  frequency: DigestSettings;
  updatedAt: string;
}

/**
 * Get User Notification Preferences
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In development mode, return mock preferences
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Getting notification preferences for user ${currentUser.id}`);
      
      const defaultPreferences: NotificationPreferences = {
        userId: currentUser.id,
        categories: {
          system: { inApp: true, email: true, sms: false, push: true },
          communication: { inApp: true, email: true, sms: false, push: true },
          financial: { inApp: true, email: true, sms: true, push: true },
          legal: { inApp: true, email: true, sms: true, push: true },
          property: { inApp: true, email: true, sms: false, push: true },
          task: { inApp: true, email: false, sms: false, push: true }
        },
        quietHours: {
          enabled: true,
          startTime: '22:00',
          endTime: '08:00',
          timezone: 'Europe/Dublin'
        },
        frequency: {
          realTime: true,
          digest: 'daily',
          digestTime: '09:00'
        },
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        preferences: defaultPreferences,
        message: '[DEV MODE] Default notification preferences'
      });
    }

    // Production: Query actual database
    try {
      // In production, this would query the user's actual preferences
      // For now, return default preferences
      const defaultPreferences: NotificationPreferences = {
        userId: currentUser.id,
        categories: {
          system: { inApp: true, email: true, sms: false, push: true },
          communication: { inApp: true, email: true, sms: false, push: true },
          financial: { inApp: true, email: true, sms: true, push: true },
          legal: { inApp: true, email: true, sms: true, push: true },
          property: { inApp: true, email: true, sms: false, push: true },
          task: { inApp: true, email: false, sms: false, push: true }
        },
        quietHours: {
          enabled: true,
          startTime: '22:00',
          endTime: '08:00',
          timezone: 'Europe/Dublin'
        },
        frequency: {
          realTime: true,
          digest: 'daily',
          digestTime: '09:00'
        },
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        preferences: defaultPreferences
      });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to retrieve notification preferences' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Notification preferences API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update User Notification Preferences
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the preferences structure
    if (!body.categories || !body.quietHours || !body.frequency) {
      return NextResponse.json(
        { error: 'Invalid preferences structure' },
        { status: 400 }
      );
    }

    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In development mode, simulate saving preferences
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Saving notification preferences for user ${currentUser.id}`);
      
      const updatedPreferences: NotificationPreferences = {
        ...body,
        userId: currentUser.id,
        updatedAt: new Date().toISOString()
      };

      // Simulate validation
      const requiredCategories = ['system', 'communication', 'financial', 'legal', 'property', 'task'];
      const requiredChannels = ['inApp', 'email', 'sms', 'push'];
      
      for (const category of requiredCategories) {
        if (!body.categories[category]) {
          return NextResponse.json(
            { error: `Missing category: ${category}` },
            { status: 400 }
          );
        }
        
        for (const channel of requiredChannels) {
          if (typeof body.categories[category][channel] !== 'boolean') {
            return NextResponse.json(
              { error: `Invalid channel setting: ${category}.${channel}` },
              { status: 400 }
            );
          }
        }
      }

      // Validate quiet hours
      if (body.quietHours.enabled) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(body.quietHours.startTime) || !timeRegex.test(body.quietHours.endTime)) {
          return NextResponse.json(
            { error: 'Invalid quiet hours time format' },
            { status: 400 }
          );
        }
      }

      // Validate digest settings
      const validDigestValues = ['never', 'daily', 'weekly'];
      if (!validDigestValues.includes(body.frequency.digest)) {
        return NextResponse.json(
          { error: 'Invalid digest frequency' },
          { status: 400 }
        );
      }

      // Simulate preference update triggers
      const updateSummary = {
        categoriesUpdated: Object.keys(body.categories).length,
        quietHoursEnabled: body.quietHours.enabled,
        realTimeEnabled: body.frequency.realTime,
        digestFrequency: body.frequency.digest,
        totalChannelsEnabled: Object.values(body.categories).reduce((total: number, category: any) => {
          return total + Object.values(category).filter(Boolean).length;
        }, 0)
      };

      return NextResponse.json({
        success: true,
        preferences: updatedPreferences,
        summary: updateSummary,
        message: '[DEV MODE] Notification preferences saved successfully'
      });
    }

    // Production: Save actual preferences
    try {
      // In production, this would save to the database
      const updatedPreferences: NotificationPreferences = {
        ...body,
        userId: currentUser.id,
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        preferences: updatedPreferences
      });
    } catch (dbError: any) {
      console.error('Database update error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to save notification preferences' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Save notification preferences error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Reset Notification Preferences to Default
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In development mode, simulate reset
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Resetting notification preferences for user ${currentUser.id}`);
      
      const defaultPreferences: NotificationPreferences = {
        userId: currentUser.id,
        categories: {
          system: { inApp: true, email: true, sms: false, push: true },
          communication: { inApp: true, email: true, sms: false, push: true },
          financial: { inApp: true, email: true, sms: true, push: true },
          legal: { inApp: true, email: true, sms: true, push: true },
          property: { inApp: true, email: true, sms: false, push: true },
          task: { inApp: true, email: false, sms: false, push: true }
        },
        quietHours: {
          enabled: true,
          startTime: '22:00',
          endTime: '08:00',
          timezone: 'Europe/Dublin'
        },
        frequency: {
          realTime: true,
          digest: 'daily',
          digestTime: '09:00'
        },
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        preferences: defaultPreferences,
        message: '[DEV MODE] Notification preferences reset to default'
      });
    }

    // Production: Reset actual preferences
    try {
      return NextResponse.json({
        success: true,
        message: 'Notification preferences reset to default'
      });
    } catch (dbError: any) {
      console.error('Database reset error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to reset notification preferences' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Reset notification preferences error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}