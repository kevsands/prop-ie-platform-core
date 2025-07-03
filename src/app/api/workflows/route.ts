import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withSimpleAuth } from '@/lib/middleware/simple-auth';
import { documentWorkflowEngine } from '@/lib/services/document-workflow-engine';

// Validation schemas
const createWorkflowTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.string(),
  stages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['approval', 'task', 'condition', 'notification', 'automation']),
    sequence: z.number(),
    requiredRoles: z.array(z.string()),
    conditions: z.array(z.any()).optional(),
    actions: z.array(z.any()),
    timeoutHours: z.number().optional(),
    autoApprove: z.boolean().optional(),
    notifications: z.array(z.any())
  })),
  globalVariables: z.record(z.any()).optional()
});

const startWorkflowSchema = z.object({
  templateId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string().optional(),
  documentId: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  variables: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional()
});

/**
 * GET /api/workflows
 * Get workflows by project or status
 */
export const GET = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const action = searchParams.get('action');

    // Dynamic import to avoid webpack async issues
    const { documentWorkflowEngine } = await import('@/lib/services/document-workflow-engine');

    if (action === 'analytics') {
      // Get workflow analytics
      const analytics = await documentWorkflowEngine.getWorkflowAnalytics(projectId || undefined);
      
      return NextResponse.json({
        data: analytics,
        message: 'Workflow analytics retrieved successfully'
      });
    }

    // Get workflows by project
    const statusFilter = status ? status.split(',') as any[] : undefined;
    const workflows = await documentWorkflowEngine.getWorkflowsByProject(
      projectId || '',
      statusFilter
    );

    return NextResponse.json({
      data: workflows,
      message: 'Workflows retrieved successfully'
    });

  } catch (error: any) {
    console.error('Workflows GET error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve workflows',
        message: error.message
      },
      { status: 500 }
    );
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ARCHITECT', 'ADMIN']
});

/**
 * POST /api/workflows
 * Create workflow template or start workflow instance
 */
export const POST = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const action = body.action;

    // Dynamic import to avoid webpack async issues
    const { documentWorkflowEngine } = await import('@/lib/services/document-workflow-engine');

    if (action === 'create_template') {
      // Create workflow template
      const validationResult = createWorkflowTemplateSchema.safeParse(body.templateData);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Validation error',
            details: validationResult.error.format()
          },
          { status: 400 }
        );
      }

      const template = await documentWorkflowEngine.createWorkflowTemplate({
        ...validationResult.data,
        createdBy: user.id
      });

      return NextResponse.json({
        data: template,
        message: 'Workflow template created successfully'
      });

    } else if (action === 'start_workflow') {
      // Start workflow instance
      const validationResult = startWorkflowSchema.safeParse(body.workflowData);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Validation error',
            details: validationResult.error.format()
          },
          { status: 400 }
        );
      }

      const workflowData = validationResult.data;
      const parsedDueDate = workflowData.dueDate ? new Date(workflowData.dueDate) : undefined;

      const workflowInstance = await documentWorkflowEngine.startWorkflow(
        workflowData.templateId,
        {
          ...workflowData,
          dueDate: parsedDueDate
        },
        user.id
      );

      return NextResponse.json({
        data: workflowInstance,
        message: 'Workflow started successfully'
      });

    } else {
      return NextResponse.json(
        {
          error: 'Invalid action',
          message: 'Action must be either "create_template" or "start_workflow"'
        },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Workflows POST error:', error);
    return NextResponse.json(
      {
        error: 'Workflow operation failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ARCHITECT', 'ADMIN']
});

/**
 * PUT /api/workflows
 * Update workflow (advance stage, approve, reject)
 */
export const PUT = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { workflowId, action, stageId, approvalData } = body;

    if (!workflowId || !action) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'workflowId and action are required'
        },
        { status: 400 }
      );
    }

    // Dynamic import to avoid webpack async issues
    const { documentWorkflowEngine } = await import('@/lib/services/document-workflow-engine');

    let result;

    switch (action) {
      case 'advance':
        if (!stageId) {
          return NextResponse.json(
            { error: 'stageId is required for advance action' },
            { status: 400 }
          );
        }
        result = await documentWorkflowEngine.advanceWorkflow(
          workflowId,
          stageId,
          user.id,
          approvalData
        );
        break;

      case 'approve':
        if (!stageId) {
          return NextResponse.json(
            { error: 'stageId is required for approve action' },
            { status: 400 }
          );
        }
        result = await documentWorkflowEngine.approveStage(
          workflowId,
          stageId,
          user.id,
          { approved: true, ...approvalData }
        );
        break;

      case 'reject':
        if (!stageId) {
          return NextResponse.json(
            { error: 'stageId is required for reject action' },
            { status: 400 }
          );
        }
        result = await documentWorkflowEngine.approveStage(
          workflowId,
          stageId,
          user.id,
          { approved: false, ...approvalData }
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action', message: 'Action must be advance, approve, or reject' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      data: result,
      message: `Workflow ${action} completed successfully`
    });

  } catch (error: any) {
    console.error('Workflows PUT error:', error);
    return NextResponse.json(
      {
        error: 'Workflow update failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ARCHITECT', 'ADMIN']
});