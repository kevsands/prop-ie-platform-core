import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

/**
 * Get user's real-time sync preferences
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

    // Get stored preferences (in production, this would come from database)
    const preferences = await getUserSyncPreferences(currentUser.id, currentUser.role);

    return NextResponse.json(preferences);

  } catch (error: any) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to get preferences' },
      { status: 500 }
    );
  }
}

/**
 * Update user's real-time sync preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
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

    // Validate request body
    const { subscriptions, realTimeEnabled, pushNotifications, emailDigest } = body;

    if (!Array.isArray(subscriptions)) {
      return NextResponse.json(
        { error: 'subscriptions must be an array' },
        { status: 400 }
      );
    }

    // Update preferences (in production, this would update database)
    const updatedPreferences = await updateUserSyncPreferences(currentUser.id, {
      userId: currentUser.id,
      userRole: currentUser.role,
      subscriptions,
      realTimeEnabled: realTimeEnabled !== false, // Default to true
      pushNotifications: pushNotifications !== false, // Default to true
      emailDigest: emailDigest !== false // Default to true
    });

    return NextResponse.json({
      success: true,
      preferences: updatedPreferences
    });

  } catch (error: any) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

/**
 * Get user sync preferences (mock implementation)
 */
async function getUserSyncPreferences(userId: string, userRole: string) {
  // In production, this would query the database
  // For now, return default preferences based on user role
  
  const defaultSubscriptionsByRole = {
    buyer: [
      { eventType: 'property_update', enabled: true },
      { eventType: 'task_update', enabled: true },
      { eventType: 'payment_update', enabled: true },
      { eventType: 'message_received', enabled: true },
      { eventType: 'document_uploaded', enabled: true },
      { eventType: 'htb_status_change', enabled: true },
      { eventType: 'legal_milestone', enabled: true },
      { eventType: 'notification', enabled: true }
    ],
    developer: [
      { eventType: 'property_update', enabled: true },
      { eventType: 'task_update', enabled: true },
      { eventType: 'payment_update', enabled: true },
      { eventType: 'message_received', enabled: true },
      { eventType: 'document_uploaded', enabled: true },
      { eventType: 'htb_status_change', enabled: true },
      { eventType: 'legal_milestone', enabled: false },
      { eventType: 'notification', enabled: true }
    ],
    agent: [
      { eventType: 'property_update', enabled: true },
      { eventType: 'task_update', enabled: true },
      { eventType: 'payment_update', enabled: false },
      { eventType: 'message_received', enabled: true },
      { eventType: 'document_uploaded', enabled: true },
      { eventType: 'htb_status_change', enabled: false },
      { eventType: 'legal_milestone', enabled: false },
      { eventType: 'notification', enabled: true }
    ],
    solicitor: [
      { eventType: 'property_update', enabled: false },
      { eventType: 'task_update', enabled: true },
      { eventType: 'payment_update', enabled: true },
      { eventType: 'message_received', enabled: true },
      { eventType: 'document_uploaded', enabled: true },
      { eventType: 'htb_status_change', enabled: false },
      { eventType: 'legal_milestone', enabled: true },
      { eventType: 'notification', enabled: true }
    ],
    admin: [
      { eventType: 'property_update', enabled: true },
      { eventType: 'task_update', enabled: true },
      { eventType: 'payment_update', enabled: true },
      { eventType: 'message_received', enabled: true },
      { eventType: 'document_uploaded', enabled: true },
      { eventType: 'htb_status_change', enabled: true },
      { eventType: 'legal_milestone', enabled: true },
      { eventType: 'notification', enabled: true }
    ]
  };

  return {
    userId,
    userRole,
    subscriptions: defaultSubscriptionsByRole[userRole] || defaultSubscriptionsByRole.buyer,
    realTimeEnabled: true,
    pushNotifications: true,
    emailDigest: true
  };
}

/**
 * Update user sync preferences (mock implementation)
 */
async function updateUserSyncPreferences(userId: string, preferences: any) {
  // In production, this would update the database
  // For now, just return the updated preferences
  
  console.log(`Updated sync preferences for user ${userId}:`, preferences);
  
  return preferences;
}