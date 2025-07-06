import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GetHandler, PatchHandler, IdParam } from '@/types/next-route-handlers';

/**
 * GET /api/projects/[id]/alerts
 * Fetch alerts for a specific project
 */
export const GET: GetHandler<IdParam> = async (request, { params }) => {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const projectId = params.id as string;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Mock alerts data for demonstration
    const alertsData = [
      {
        id: 'alert-1',
        type: 'warning',
        title: 'Budget Threshold Exceeded',
        description: 'The project is currently 15% over budget for electrical work',
        date: '2023-10-30T14:30:00Z',
        category: 'financial',
        isRead: false,
        severity: 'high',
        projectId
      },
      {
        id: 'alert-2',
        type: 'info',
        title: 'New Document Uploaded',
        description: 'Updated planning permission documents have been uploaded',
        date: '2023-10-29T09:15:00Z',
        category: 'documents',
        isRead: true,
        severity: 'medium',
        projectId
      },
      {
        id: 'alert-3',
        type: 'error',
        title: 'Timeline Milestone Delayed',
        description: 'Phase 1 handover is delayed by 14 days',
        date: '2023-10-28T16:45:00Z',
        category: 'timeline',
        isRead: false,
        severity: 'critical',
        projectId
      }
    ];

    return NextResponse.json(alertsData);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]/alerts
 * Update alert status (e.g., mark as read)
 */
export const PATCH: PatchHandler<IdParam> = async (request, { params }) => {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const projectId = params.id as string;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    if (!body.alertId) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    // In production, this would update the alert in database
    // For now, just return success response
    return NextResponse.json({
      success: true,
      message: 'Alert updated successfully',
      alertId: body.alertId,
      projectId,
      updatedFields: Object.keys(body).filter(key => key !== 'alertId')
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}