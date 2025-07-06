/**
 * Professional Workflows API
 * 
 * Provides endpoints for orchestrating the 3,329+ task ecosystem
 * Week 3 Implementation: Professional Role Integration
 */

import { NextRequest, NextResponse } from 'next/server';
import ProfessionalWorkflowService from '@/services/ProfessionalWorkflowService';

const workflowService = new ProfessionalWorkflowService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');
    const workflowId = searchParams.get('workflowId');

    switch (action) {
      case 'templates':
        // Get all workflow templates or templates for specific role
        const templates = role 
          ? workflowService.getWorkflowTemplatesForRole(role as any)
          : workflowService.getWorkflowTemplates();
        
        return NextResponse.json({
          success: true,
          data: templates,
          meta: {
            count: templates.length,
            role: role || 'all'
          }
        });

      case 'active-tasks':
        // Get active tasks for a user
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'userId is required for active tasks' },
            { status: 400 }
          );
        }
        
        const activeTasks = await workflowService.getActiveTasks(userId, role as any);
        return NextResponse.json({
          success: true,
          data: activeTasks,
          meta: {
            count: activeTasks.length,
            userId,
            role: role || 'all'
          }
        });

      case 'template-details':
        // Get specific workflow template details
        if (!workflowId) {
          return NextResponse.json(
            { success: false, error: 'workflowId is required' },
            { status: 400 }
          );
        }
        
        const templates_all = workflowService.getWorkflowTemplates();
        const template = templates_all.find(t => t.id === workflowId);
        
        if (!template) {
          return NextResponse.json(
            { success: false, error: 'Workflow template not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: template
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Workflows API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'orchestrate':
        // Orchestrate a workflow from template
        const result = await workflowService.orchestrateWorkflow(data.request, data.options);
        return NextResponse.json({
          success: result.success,
          data: {
            workflowInstanceId: result.workflowInstanceId,
            orchestratedTasks: result.orchestratedTasks,
            estimatedCompletion: result.estimatedCompletion
          },
          warnings: result.warnings,
          errors: result.errors
        }, { status: result.success ? 200 : 400 });

      case 'update-task':
        // Update task status
        const { taskId, status, userId, notes } = data;
        if (!taskId || !status || !userId) {
          return NextResponse.json(
            { success: false, error: 'taskId, status, and userId are required' },
            { status: 400 }
          );
        }
        
        const updateResult = await workflowService.updateTaskStatus(taskId, status, userId, notes);
        return NextResponse.json({
          success: updateResult.success,
          data: {
            triggeredTasks: updateResult.triggeredTasks
          },
          warnings: updateResult.warnings
        }, { status: updateResult.success ? 200 : 400 });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Workflows API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}