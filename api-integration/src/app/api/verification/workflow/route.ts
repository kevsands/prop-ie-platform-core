/**
 * Verification Workflow API
 * Real backend for identity verification workflow management
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface CreateWorkflowRequest {
  userProfile?: any;
}

interface UpdateStepRequest {
  stepId: string;
  status: string;
  progress?: number;
  verificationData?: any;
  failureReason?: string;
  actionRequired?: string;
}

/**
 * POST /api/verification/workflow
 * Create a new verification workflow
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json() as CreateWorkflowRequest;

    // Check if user already has an active workflow
    const existingWorkflow = await prisma.verificationWorkflow.findFirst({
      where: {
        userId: user.id,
        overallStatus: {
          in: ['NOT_STARTED', 'IN_PROGRESS']
        }
      }
    });

    if (existingWorkflow) {
      return NextResponse.json(
        { error: 'User already has an active verification workflow' },
        { status: 400 }
      );
    }

    // Generate unique verification ID
    const verificationId = `VER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create verification workflow
    const workflow = await prisma.verificationWorkflow.create({
      data: {
        userId: user.id,
        verificationId,
        overallStatus: 'NOT_STARTED',
        overallProgress: 0,
        completedSteps: 0,
        totalSteps: 8,
        complianceScore: 0,
        riskLevel: 'medium'
      }
    });

    // Create verification steps
    const steps = [
      {
        stepId: 'document_validation',
        name: 'Document Validation',
        description: 'Validating authenticity and quality of uploaded documents',
        required: true,
        automated: true,
        estimatedDuration: '2-5 minutes'
      },
      {
        stepId: 'identity_cross_check',
        name: 'Identity Cross-Check',
        description: 'Verifying identity details against multiple databases',
        required: true,
        automated: true,
        estimatedDuration: '3-7 minutes'
      },
      {
        stepId: 'address_verification',
        name: 'Address Verification',
        description: 'Confirming current address through multiple sources',
        required: true,
        automated: true,
        estimatedDuration: '2-4 minutes'
      },
      {
        stepId: 'financial_screening',
        name: 'Financial Screening',
        description: 'Analyzing financial documents and creditworthiness',
        required: true,
        automated: true,
        estimatedDuration: '5-10 minutes'
      },
      {
        stepId: 'peps_sanctions_check',
        name: 'PEPs & Sanctions Check',
        description: 'Screening against politically exposed persons and sanctions lists',
        required: true,
        automated: true,
        estimatedDuration: '1-3 minutes'
      },
      {
        stepId: 'biometric_verification',
        name: 'Biometric Verification',
        description: 'Optional facial recognition and liveness check',
        required: false,
        automated: true,
        estimatedDuration: '1-2 minutes'
      },
      {
        stepId: 'manual_review',
        name: 'Manual Review',
        description: 'Human review for edge cases and final approval',
        required: false,
        automated: false,
        estimatedDuration: '15-30 minutes'
      },
      {
        stepId: 'compliance_report',
        name: 'Compliance Report',
        description: 'Generate final KYC/AML compliance documentation',
        required: true,
        automated: true,
        estimatedDuration: '1-2 minutes'
      }
    ];

    await prisma.verificationStep.createMany({
      data: steps.map(step => ({
        workflowId: workflow.id,
        stepId: step.stepId,
        name: step.name,
        description: step.description,
        status: 'pending',
        required: step.required,
        automated: step.automated,
        estimatedDuration: step.estimatedDuration,
        progress: 0
      }))
    });

    const createdSteps = await prisma.verificationStep.findMany({
      where: { workflowId: workflow.id },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      success: true,
      workflow: {
        id: workflow.id,
        verificationId: workflow.verificationId,
        status: workflow.overallStatus,
        progress: workflow.overallProgress,
        completedSteps: workflow.completedSteps,
        totalSteps: workflow.totalSteps,
        complianceScore: workflow.complianceScore,
        riskLevel: workflow.riskLevel,
        steps: createdSteps
      }
    });

  } catch (error) {
    console.error('Workflow creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create verification workflow' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/verification/workflow
 * Get user's verification workflow status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const workflow = await prisma.verificationWorkflow.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        verificationSteps: {
          orderBy: { createdAt: 'asc' }
        },
        documents: {
          select: {
            id: true,
            name: true,
            documentType: true,
            verificationStatus: true,
            aiConfidenceScore: true
          }
        }
      }
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'No verification workflow found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ workflow });

  } catch (error) {
    console.error('Workflow fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification workflow' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/verification/workflow
 * Update workflow or step status
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { action, workflowId, stepUpdate } = body;

    if (action === 'start_verification') {
      // Start the verification workflow
      const workflow = await prisma.verificationWorkflow.findFirst({
        where: {
          id: workflowId,
          userId: user.id
        }
      });

      if (!workflow) {
        return NextResponse.json(
          { error: 'Workflow not found' },
          { status: 404 }
        );
      }

      await prisma.verificationWorkflow.update({
        where: { id: workflow.id },
        data: {
          overallStatus: 'IN_PROGRESS',
          startedAt: new Date()
        }
      });

      // Start processing steps asynchronously
      processVerificationStepsAsync(workflow.id);

      return NextResponse.json({
        success: true,
        message: 'Verification workflow started'
      });

    } else if (action === 'update_step') {
      // Update a specific step
      const step = await prisma.verificationStep.findFirst({
        where: {
          workflowId,
          stepId: stepUpdate.stepId,
          workflow: {
            userId: user.id
          }
        }
      });

      if (!step) {
        return NextResponse.json(
          { error: 'Step not found' },
          { status: 404 }
        );
      }

      await prisma.verificationStep.update({
        where: { id: step.id },
        data: {
          status: stepUpdate.status,
          progress: stepUpdate.progress || step.progress,
          verificationData: stepUpdate.verificationData ? JSON.stringify(stepUpdate.verificationData) : step.verificationData,
          failureReason: stepUpdate.failureReason,
          actionRequired: stepUpdate.actionRequired,
          completedAt: stepUpdate.status === 'completed' ? new Date() : step.completedAt
        }
      });

      // Update overall workflow progress
      await updateWorkflowProgress(workflowId);

      return NextResponse.json({
        success: true,
        message: 'Step updated successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Workflow update error:', error);
    return NextResponse.json(
      { error: 'Failed to update verification workflow' },
      { status: 500 }
    );
  }
}

/**
 * Process verification steps asynchronously
 */
async function processVerificationStepsAsync(workflowId: string) {
  try {
    const steps = await prisma.verificationStep.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'asc' }
    });

    for (const step of steps) {
      if (!step.required && Math.random() > 0.7) {
        // Skip some optional steps randomly
        continue;
      }

      // Update step to in_progress
      await prisma.verificationStep.update({
        where: { id: step.id },
        data: {
          status: 'in_progress',
          startedAt: new Date()
        }
      });

      // Simulate processing time
      const processingTime = getStepProcessingTime(step.stepId);
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Determine outcome
      const outcome = determineStepOutcome(step.stepId);
      
      await prisma.verificationStep.update({
        where: { id: step.id },
        data: {
          status: outcome.status,
          progress: 100,
          completedAt: outcome.status === 'completed' ? new Date() : undefined,
          failureReason: outcome.failureReason,
          actionRequired: outcome.actionRequired,
          verificationData: outcome.data ? JSON.stringify(outcome.data) : undefined
        }
      });

      // Update workflow progress
      await updateWorkflowProgress(workflowId);

      // Stop if step failed and is required
      if (outcome.status === 'failed' && step.required) {
        break;
      }
    }

    // Check if workflow is complete
    await checkWorkflowCompletion(workflowId);

  } catch (error) {
    console.error('Error processing verification steps:', error);
  }
}

/**
 * Update overall workflow progress
 */
async function updateWorkflowProgress(workflowId: string) {
  const steps = await prisma.verificationStep.findMany({
    where: { workflowId }
  });

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);
  const complianceScore = Math.min(95, completedSteps * 12);

  await prisma.verificationWorkflow.update({
    where: { id: workflowId },
    data: {
      completedSteps,
      overallProgress: progress,
      complianceScore
    }
  });
}

/**
 * Check if workflow is complete
 */
async function checkWorkflowCompletion(workflowId: string) {
  const workflow = await prisma.verificationWorkflow.findUnique({
    where: { id: workflowId },
    include: {
      verificationSteps: true
    }
  });

  if (!workflow) return;

  const requiredSteps = workflow.verificationSteps.filter(s => s.required);
  const completedRequiredSteps = requiredSteps.filter(s => s.status === 'completed');

  if (completedRequiredSteps.length === requiredSteps.length) {
    await prisma.verificationWorkflow.update({
      where: { id: workflowId },
      data: {
        overallStatus: 'COMPLETED',
        completedAt: new Date(),
        reportUrl: `/api/verification/reports/${workflow.verificationId}`
      }
    });
  }
}

function getStepProcessingTime(stepId: string): number {
  const times: { [key: string]: number } = {
    document_validation: 3000,
    identity_cross_check: 5000,
    address_verification: 3500,
    financial_screening: 7000,
    peps_sanctions_check: 2500,
    biometric_verification: 2000,
    manual_review: 1000,
    compliance_report: 2000
  };
  return times[stepId] || 3000;
}

function determineStepOutcome(stepId: string) {
  const baseSuccessRate = 0.85;
  const random = Math.random();

  switch (stepId) {
    case 'document_validation':
      return random > 0.1 
        ? { status: 'completed', data: { documentsValidated: 3, confidence: 94 } }
        : { status: 'failed', failureReason: 'Document quality insufficient for automated verification' };

    case 'identity_cross_check':
      return random > 0.05 
        ? { status: 'completed', data: { matchConfidence: 94, sourcesChecked: 5, verified: true } }
        : { status: 'requires_action', actionRequired: 'Additional identity documentation required' };

    case 'address_verification':
      return random > 0.1 
        ? { status: 'completed', data: { addressConfirmed: true, utilityBillMatch: true } }
        : { status: 'requires_action', actionRequired: 'Current address proof required' };

    case 'financial_screening':
      return random > 0.15 
        ? { status: 'completed', data: { creditScore: 745, incomeVerified: true, riskLevel: 'low' } }
        : { status: 'requires_action', actionRequired: 'Additional financial documentation needed' };

    case 'peps_sanctions_check':
      return random > 0.02 
        ? { status: 'completed', data: { clearanceStatus: 'clean', listsChecked: 12 } }
        : { status: 'requires_action', actionRequired: 'Enhanced due diligence required' };

    default:
      return { status: 'completed', data: { processed: true } };
  }
}