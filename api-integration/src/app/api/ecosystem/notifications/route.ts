/**
 * Ecosystem Notifications API
 * 
 * Week 4 Implementation: Core Service Enhancement
 * API endpoints for enhanced notification system across the 49-role ecosystem
 */

import { NextRequest, NextResponse } from 'next/server';
import EcosystemNotificationService from '@/services/EcosystemNotificationService';
import { UserRole } from '@prisma/client';

/**
 * POST /api/ecosystem/notifications
 * Send ecosystem notification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      type,
      targetRoles,
      variables,
      targetUsers,
      priority,
      channels,
      metadata,
      expiresAt
    } = body;

    // Validate required fields
    if (!type || !targetRoles || !variables) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, targetRoles, variables'
        },
        { status: 400 }
      );
    }

    const notification = await EcosystemNotificationService.sendEcosystemNotification(
      type,
      targetRoles as UserRole[],
      variables,
      {
        targetUsers,
        priority,
        channels,
        metadata,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        notificationId: notification.id,
        status: notification.status,
        timestamp: notification.timestamp,
        targetRoles: notification.targetRoles,
        priority: notification.priority
      },
      message: 'Notification sent successfully'
    });

  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send notification'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ecosystem/notifications?userId=xxx&role=xxx
 * Get active notifications for user or role
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role') as UserRole;

    const notifications = EcosystemNotificationService.getActiveNotifications(
      userId || undefined,
      role
    );

    return NextResponse.json({
      success: true,
      data: {
        notifications: notifications.map(notification => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          timestamp: notification.timestamp,
          status: notification.status,
          metadata: notification.metadata,
          actionRequired: notification.metadata.actionRequired
        })),
        count: notifications.length
      }
    });

  } catch (error) {
    console.error('Get notifications API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get notifications'
      },
      { status: 500 }
    );
  }
}