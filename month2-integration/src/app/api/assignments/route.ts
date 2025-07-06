import { NextRequest, NextResponse } from 'next/server';
import { taskAssignmentService } from '@/services/TaskAssignmentService';
import { userService } from '@/lib/services/users-production';

/**
 * Task Assignment API
 * Handles task assignment, delegation, and notification operations
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || currentUser.id;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    switch (type) {
      case 'user_assignments':
        // Get assignments for a specific user
        const userAssignments = taskAssignmentService.getUserAssignments(userId);
        let filteredAssignments = userAssignments;
        
        if (status) {
          filteredAssignments = userAssignments.filter(a => a.status === status);
        }

        return NextResponse.json({
          success: true,
          assignments: filteredAssignments,
          summary: {
            total: userAssignments.length,
            byStatus: {
              assigned: userAssignments.filter(a => a.status === 'assigned').length,
              accepted: userAssignments.filter(a => a.status === 'accepted').length,
              in_progress: userAssignments.filter(a => a.status === 'in_progress').length,
              completed: userAssignments.filter(a => a.status === 'completed').length,
              delegated: userAssignments.filter(a => a.status === 'delegated').length,
              overdue: userAssignments.filter(a => a.status === 'overdue').length
            }
          }
        });

      case 'overdue':
        // Get overdue assignments
        const overdueAssignments = taskAssignmentService.getOverdueAssignments();
        return NextResponse.json({
          success: true,
          assignments: overdueAssignments,
          count: overdueAssignments.length
        });

      case 'assignment_details':
        // Get specific assignment details
        const assignmentId = searchParams.get('assignment_id');
        if (!assignmentId) {
          return NextResponse.json(
            { error: 'Assignment ID is required' },
            { status: 400 }
          );
        }

        const assignment = taskAssignmentService.getAssignment(assignmentId);
        if (!assignment) {
          return NextResponse.json(
            { error: 'Assignment not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          assignment
        });

      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Assignments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create new task assignment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, assignedTo, assignedBy, dueDate, priority, autoAssign, taskData } = body;

    // Validate required fields
    if (!taskId || !assignedBy) {
      return NextResponse.json(
        { error: 'Task ID and assignedBy are required' },
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

    // In development mode, register mock users if they don't exist
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      // Register current user if not already registered
      taskAssignmentService.registerUser({
        id: currentUser.id,
        type: currentUser.role?.toLowerCase() as any || 'buyer',
        name: currentUser.name || 'User',
        email: currentUser.email,
        role: 'primary',
        expertise: [],
        workload: 0,
        availability: 'available'
      });

      // Register assigned user if specified
      if (assignedTo && assignedTo !== currentUser.id) {
        taskAssignmentService.registerUser({
          id: assignedTo,
          type: 'solicitor', // Default type for assigned users
          name: 'Assigned User',
          email: `${assignedTo}@example.com`,
          role: 'primary',
          expertise: ['legal', 'property'],
          workload: 2,
          availability: 'available'
        });
      }
    }

    // Create assignment
    const assignment = await taskAssignmentService.assignTask({
      taskId,
      assignedTo,
      assignedBy,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || 'medium',
      autoAssign: autoAssign || false,
      taskData
    });

    return NextResponse.json({
      success: true,
      assignment,
      message: 'Task assigned successfully'
    });

  } catch (error: any) {
    console.error('Assignment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create assignment' },
      { status: 500 }
    );
  }
}

/**
 * Update assignment status or delegate task
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { assignmentId, action, ...params } = body;

    if (!assignmentId || !action) {
      return NextResponse.json(
        { error: 'Assignment ID and action are required' },
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

    let result;

    switch (action) {
      case 'complete':
        await taskAssignmentService.completeTask(assignmentId, currentUser.id);
        result = { message: 'Task completed successfully' };
        break;

      case 'delegate':
        const { toUserId, reason, newDueDate } = params;
        if (!toUserId || !reason) {
          return NextResponse.json(
            { error: 'toUserId and reason are required for delegation' },
            { status: 400 }
          );
        }

        // Register target user in development mode
        if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
          taskAssignmentService.registerUser({
            id: toUserId,
            type: 'agent',
            name: 'Delegated User',
            email: `${toUserId}@example.com`,
            role: 'secondary',
            expertise: ['coordination'],
            workload: 1,
            availability: 'available'
          });
        }

        const delegation = await taskAssignmentService.delegateTask({
          assignmentId,
          fromUserId: currentUser.id,
          toUserId,
          reason,
          newDueDate: newDueDate ? new Date(newDueDate) : undefined
        });
        result = { delegation, message: 'Task delegated successfully' };
        break;

      case 'accept_delegation':
        const { delegationId } = params;
        if (!delegationId) {
          return NextResponse.json(
            { error: 'delegationId is required for accepting delegation' },
            { status: 400 }
          );
        }

        await taskAssignmentService.acceptDelegation({
          assignmentId,
          delegationId,
          userId: currentUser.id
        });
        result = { message: 'Delegation accepted successfully' };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error: any) {
    console.error('Assignment update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update assignment' },
      { status: 500 }
    );
  }
}