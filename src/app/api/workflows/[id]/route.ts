import { NextRequest, NextResponse } from 'next/server';
import { withSimpleAuth } from '@/lib/middleware/simple-auth';
import { documentWorkflowEngine } from '@/lib/services/document-workflow-engine';

/**
 * GET /api/workflows/[id]
 * Get detailed workflow instance information
 */
export const GET = withSimpleAuth(async (request: NextRequest, user, { params }) => {
  try {
    const workflowId = params.id as string;

    if (!workflowId) {
      return NextResponse.json(
        {
          error: 'Missing workflow ID',
          message: 'Workflow ID is required'
        },
        { status: 400 }
      );
    }

    // Get workflow instance with full details
    const workflowDetails = await documentWorkflowEngine.getWorkflowInstanceDetails(workflowId);

    return NextResponse.json({
      data: workflowDetails,
      message: 'Workflow details retrieved successfully'
    });

  } catch (error: any) {
    console.error('Workflow details GET error:', error);
    
    if (error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Workflow not found',
          message: error.message
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to retrieve workflow details',
        message: error.message
      },
      { status: 500 }
    );
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ARCHITECT', 'ADMIN']
});