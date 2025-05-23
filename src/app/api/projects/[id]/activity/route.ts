type Props = {
  params: Promise<{ id: string }>
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/projects/[id]/activity
 * Fetch activity feed for a specific project
 */
export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    // Try to get session from NextAuth
    const session = await getServerSession(authOptions);

    // If session doesn't exist, try Amplify auth
    if (!session || !session.user) {
      // Amplify auth is disabled - returning 401
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

    // Mock activity data for demonstration
    const activityData = [
      {
        id: '1',
        type: 'milestone',
        date: '2023-10-31T14:30:00Z',
        user: {
          name: 'Sarah Johnson',
          avatar: '',
          initials: 'SJ'
        },
        content: 'Completed foundation work for Block B',
        projectId
      },
      {
        id: '2',
        type: 'document',
        date: '2023-10-29T09:15:00Z',
        user: {
          name: 'Michael Chen',
          avatar: '',
          initials: 'MC'
        },
        content: 'Uploaded revised planning documents',
        documentId: 'doc-123',
        documentName: 'Revised Site Plan.pdf',
        projectId
      },
      {
        id: '3',
        type: 'sale',
        date: '2023-10-28T16:45:00Z',
        user: {
          name: 'Emma Wilson',
          avatar: '',
          initials: 'EW'
        },
        content: 'Confirmed sale of Unit 15',
        unitId: 'unit-15',
        unitName: 'Apartment 15, Block A',
        projectId
      }
    ];

    return NextResponse.json(activityData);
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/activity
 * Add new activity to a project's feed
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    // Try to get session from NextAuth
    const session = await getServerSession(authOptions);
    let userName = '';
    let userImage = '';

    // If session doesn't exist, try Amplify auth
    if (!session || !session.user) {
      // Amplify auth is disabled - returning 401
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    } else {
      // Set user info from session
      userName = session.user.name || '';
      userImage = session.user.image || '';
    }

    const projectId = params.id as string;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body: any = await request.json();

    if (!body.type || !body.content) {
      return NextResponse.json(
        { error: 'Activity type and content are required' },
        { status: 400 }
      );
    }

    // In production, this would add the activity to database
    // For now, just return success response with mock data
    return NextResponse.json({
      success: true,
      activity: {
        id: `activity-${Date.now()}`,
        type: body.type,
        date: new Date().toISOString(),
        user: {
          name: userName || 'Anonymous User',
          avatar: userImage || '',
          initials: userName ? userName.substring(02).toUpperCase() : 'AU'
        },
        content: body.content,
        projectId
      }
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to add activity' },
      { status: 500 }
    );
  }
}