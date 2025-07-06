import { NextRequest, NextResponse } from 'next/server';
import { taskAssignmentService } from '@/services/TaskAssignmentService';
import { userService } from '@/lib/services/users-production';

/**
 * Task Assignment Notification API
 * Handles notifications triggered by task assignment events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      taskId, 
      assignmentId, 
      assignedTo, 
      assignedBy, 
      message, 
      priority = 'medium',
      channels = ['in_app', 'email'] 
    } = body;

    // Validate required fields
    if (!type || !taskId || !assignmentId || !assignedTo) {
      return NextResponse.json(
        { error: 'type, taskId, assignmentId, and assignedTo are required' },
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

    // Create notification based on assignment event type
    let notificationTitle = '';
    let notificationMessage = '';
    let actionUrl = '';

    switch (type) {
      case 'task_assigned':
        notificationTitle = 'New Task Assigned';
        notificationMessage = `You have been assigned a new task: ${taskId}`;
        actionUrl = `/assignments/${assignmentId}`;
        break;

      case 'task_delegated':
        notificationTitle = 'Task Delegated to You';
        notificationMessage = `A task has been delegated to you by ${assignedBy}`;
        actionUrl = `/assignments/${assignmentId}`;
        break;

      case 'task_overdue':
        notificationTitle = 'Task Overdue';
        notificationMessage = `Your assigned task ${taskId} is now overdue`;
        actionUrl = `/assignments/${assignmentId}`;
        break;

      case 'task_due_soon':
        notificationTitle = 'Task Due Soon';
        notificationMessage = `Your task ${taskId} is due within 24 hours`;
        actionUrl = `/assignments/${assignmentId}`;
        break;

      case 'task_completed':
        notificationTitle = 'Task Completed';
        notificationMessage = `Task ${taskId} has been marked as completed`;
        actionUrl = `/assignments/${assignmentId}`;
        break;

      case 'delegation_request':
        notificationTitle = 'Delegation Request';
        notificationMessage = `${assignedBy} has delegated task ${taskId} to you. Please accept or decline.`;
        actionUrl = `/assignments/${assignmentId}`;
        break;

      default:
        notificationTitle = 'Task Assignment Update';
        notificationMessage = message || `Update for task ${taskId}`;
        actionUrl = `/assignments/${assignmentId}`;
    }

    // Create notification record (in a real app, this would be stored in the database)
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'SYSTEM' as const,
      severity: priority === 'high' || priority === 'critical' ? 'warning' as const : 'info' as const,
      title: notificationTitle,
      description: notificationMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
      actionUrl,
      userId: assignedTo,
      metadata: {
        taskId,
        assignmentId,
        assignedBy,
        assignmentType: type,
        priority
      }
    };

    console.log(`[NOTIFICATION] ${type.toUpperCase()}:`, {
      recipient: assignedTo,
      title: notificationTitle,
      message: notificationMessage,
      channels,
      priority
    });

    // In a real implementation, you would:
    // 1. Store the notification in the database
    // 2. Send real-time notification via WebSocket/SSE
    // 3. Send email notification if enabled
    // 4. Send SMS notification if enabled
    // 5. Send push notification if enabled

    // Simulate notification delivery
    const deliveryResults = {
      in_app: { status: 'delivered', timestamp: new Date().toISOString() },
      email: channels.includes('email') ? { 
        status: 'delivered', 
        timestamp: new Date().toISOString(),
        emailAddress: `${assignedTo}@example.com`
      } : null,
      sms: channels.includes('sms') ? { 
        status: 'delivered', 
        timestamp: new Date().toISOString() 
      } : null,
      push: channels.includes('push') ? { 
        status: 'delivered', 
        timestamp: new Date().toISOString() 
      } : null
    };

    return NextResponse.json({
      success: true,
      notification,
      deliveryResults,
      message: `Assignment notification sent successfully for ${type}`
    });

  } catch (error: any) {
    console.error('Assignment notification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send assignment notification' },
      { status: 500 }
    );
  }
}

/**
 * Get assignment-related notifications for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const assignmentId = searchParams.get('assignment_id');
    const type = searchParams.get('type');

    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userIdFromToken = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userIdFromToken);
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

    // In a real implementation, this would query the database for assignment notifications
    // For now, return mock notifications
    const mockNotifications = [
      {
        id: 'notif_assign_001',
        type: 'SYSTEM',
        severity: 'info',
        title: 'Task Assigned',
        description: 'You have been assigned to complete identity verification',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        actionUrl: '/assignments/assign_001',
        userId: currentUser.id,
        metadata: {
          taskId: 'task_001',
          assignmentId: 'assign_001',
          assignedBy: 'system',
          assignmentType: 'task_assigned',
          priority: 'high'
        }
      },
      {
        id: 'notif_assign_002',
        type: 'SYSTEM',
        severity: 'warning',
        title: 'Task Due Soon',
        description: 'Your mortgage application task is due in 6 hours',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        actionUrl: '/assignments/assign_002',
        userId: currentUser.id,
        metadata: {
          taskId: 'task_005',
          assignmentId: 'assign_002',
          assignedBy: 'system',
          assignmentType: 'task_due_soon',
          priority: 'high'
        }
      }
    ];

    // Apply filters
    let filteredNotifications = mockNotifications;

    if (userId) {
      filteredNotifications = filteredNotifications.filter(n => n.userId === userId);
    }

    if (assignmentId) {
      filteredNotifications = filteredNotifications.filter(n => 
        n.metadata.assignmentId === assignmentId
      );
    }

    if (type) {
      filteredNotifications = filteredNotifications.filter(n => 
        n.metadata.assignmentType === type
      );
    }

    return NextResponse.json({
      success: true,
      notifications: filteredNotifications,
      count: filteredNotifications.length
    });

  } catch (error: any) {
    console.error('Get assignment notifications error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get assignment notifications' },
      { status: 500 }
    );
  }
}