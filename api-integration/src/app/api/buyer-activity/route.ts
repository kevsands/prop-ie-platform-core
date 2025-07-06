/**
 * Buyer Activity Tracking API
 * Real-time buyer behavior tracking and lead scoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { buyerActivityTracker } from '@/lib/services/buyer-activity-tracker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      buyerId,
      sessionId,
      activityType,
      data = {},
      engagement = {
        intensity: 'medium',
        timeSpent: 0,
        pageDepth: 1,
        interactionCount: 1
      }
    } = body;

    if (!buyerId || !sessionId || !activityType) {
      return NextResponse.json(
        { error: 'Missing required fields: buyerId, sessionId, activityType' },
        { status: 400 }
      );
    }

    // Track the activity
    const success = await buyerActivityTracker.trackActivity({
      buyerId,
      sessionId,
      timestamp: new Date(),
      activityType,
      data,
      engagement
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to track activity' },
        { status: 500 }
      );
    }

    // Get updated buyer profile
    const profile = buyerActivityTracker.getBuyerProfile(buyerId);

    return NextResponse.json({
      success: true,
      message: 'Activity tracked successfully',
      profile: profile ? {
        leadScore: profile.leadScore,
        engagementScore: profile.engagementScore,
        buyerStage: profile.buyerStage,
        totalActivities: profile.activities.length,
        assignedAgent: profile.assignedAgent
      } : null
    });

  } catch (error) {
    console.error('Error tracking buyer activity:', error);
    return NextResponse.json(
      { error: 'Failed to track buyer activity' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');
    const agentId = searchParams.get('agentId');
    const getLeads = searchParams.get('getLeads') === 'true';
    const getNotifications = searchParams.get('getNotifications') === 'true';

    // Get buyer profile
    if (buyerId) {
      const profile = buyerActivityTracker.getBuyerProfile(buyerId);
      
      if (!profile) {
        return NextResponse.json(
          { error: 'Buyer profile not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        profile
      });
    }

    // Get high-value leads for agent
    if (getLeads) {
      const leads = buyerActivityTracker.getHighValueLeads(agentId || undefined, 20);
      
      return NextResponse.json({
        success: true,
        leads,
        count: leads.length
      });
    }

    // Get agent notifications
    if (getNotifications && agentId) {
      const unreadOnly = searchParams.get('unreadOnly') === 'true';
      const notifications = buyerActivityTracker.getAgentNotifications(agentId, unreadOnly);
      
      return NextResponse.json({
        success: true,
        notifications,
        count: notifications.length
      });
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error retrieving buyer data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve buyer data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, buyerId, agentId, notificationId } = body;

    switch (action) {
      case 'assign_buyer':
        if (!buyerId || !agentId) {
          return NextResponse.json(
            { error: 'Missing buyerId or agentId for assignment' },
            { status: 400 }
          );
        }

        const assignSuccess = buyerActivityTracker.assignBuyerToAgent(buyerId, agentId);
        
        if (!assignSuccess) {
          return NextResponse.json(
            { error: 'Failed to assign buyer to agent' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Buyer assigned to agent successfully'
        });

      case 'mark_notification_read':
        if (!notificationId || !agentId) {
          return NextResponse.json(
            { error: 'Missing notificationId or agentId' },
            { status: 400 }
          );
        }

        const markSuccess = buyerActivityTracker.markNotificationActedUpon(notificationId, agentId);
        
        if (!markSuccess) {
          return NextResponse.json(
            { error: 'Failed to mark notification as read' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Notification marked as read'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error updating buyer data:', error);
    return NextResponse.json(
      { error: 'Failed to update buyer data' },
      { status: 500 }
    );
  }
}