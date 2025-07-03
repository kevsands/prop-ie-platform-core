import { NextRequest, NextResponse } from "next/server";
import { enterpriseDocumentServices } from "@/lib/services/enterprise-document-service";
import { WorkflowStatus } from "@prisma/client";
import { z } from "zod";

// Validation schemas
const createWorkflowSchema = z.object({
  workflowTemplateId: z.string().min(1, "Workflow template ID is required"),
  title: z.string().min(1, "Workflow title is required"),
  description: z.string().optional(),
  projectId: z.string().optional(),
  documentId: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string().min(1, "Creator ID is required"),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  budget: z.number().optional(),
  tags: z.array(z.string()).optional()
});

const updateWorkflowSchema = z.object({
  workflowId: z.string().min(1, "Workflow ID is required"),
  status: z.nativeEnum(WorkflowStatus).optional(),
  currentStage: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  assignedTo: z.string().optional()
});

const recordStageSchema = z.object({
  workflowInstanceId: z.string().min(1, "Workflow instance ID is required"),
  stageId: z.string().min(1, "Stage ID is required"),
  stageName: z.string().min(1, "Stage name is required"),
  status: z.string().min(1, "Status is required"),
  assignedUsers: z.array(z.string()),
  notes: z.string().optional(),
  approvals: z.any().optional()
});

/**
 * GET /api/documents/workflows
 * Query parameters:
 * - projectId: string (optional)
 * - status: WorkflowStatus (optional)
 * - action: 'list' | 'active'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const action = searchParams.get("action") || "active";

    if (action === "active") {
      const workflows = await enterpriseDocumentServices.workflows.getActiveWorkflows(
        projectId || undefined
      );

      return NextResponse.json({
        data: workflows,
        message: "Active workflows retrieved successfully"
      });
    }

    // Default to active workflows if no specific action
    const workflows = await enterpriseDocumentServices.workflows.getActiveWorkflows(
      projectId || undefined
    );

    return NextResponse.json({
      data: workflows,
      message: "Workflows retrieved successfully"
    });

  } catch (error: any) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json({
      error: "Failed to fetch workflows",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

/**
 * POST /api/documents/workflows
 * Create workflow instance or record stage progress
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "recordStage") {
      // Validate stage recording data
      const validationResult = recordStageSchema.safeParse(data);
      if (!validationResult.success) {
        return NextResponse.json(
          { 
            error: "Validation error", 
            details: validationResult.error.format() 
          },
          { status: 400 }
        );
      }

      const stageHistory = await enterpriseDocumentServices.workflows.recordStageProgress(
        validationResult.data
      );

      return NextResponse.json({
        data: stageHistory,
        message: "Stage progress recorded successfully"
      });
    }

    // Default action: create workflow
    const validationResult = createWorkflowSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    const workflow = await enterpriseDocumentServices.workflows.createWorkflow(validatedData);

    return NextResponse.json({
      data: workflow,
      message: "Workflow created successfully"
    });

  } catch (error: any) {
    console.error("Error creating workflow:", error);
    return NextResponse.json({
      error: "Failed to create workflow",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

/**
 * PUT /api/documents/workflows
 * Update workflow progress
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = updateWorkflowSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const { workflowId, ...updateData } = validationResult.data;

    const workflow = await enterpriseDocumentServices.workflows.updateWorkflowProgress(
      workflowId,
      updateData
    );

    return NextResponse.json({
      data: workflow,
      message: "Workflow updated successfully"
    });

  } catch (error: any) {
    console.error("Error updating workflow:", error);
    return NextResponse.json({
      error: "Failed to update workflow",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}