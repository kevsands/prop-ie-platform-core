import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withSimpleAuth } from '@/lib/middleware/simple-auth';
import { documentGenerationEngine } from '@/lib/services/document-generation-service';

// Validation schemas
const generateDocumentSchema = z.object({
  templateId: z.string().min(1),
  outputFormat: z.enum(['pdf', 'word', 'html', 'excel']),
  data: z.record(z.any()),
  options: z.object({
    watermark: z.object({
      text: z.string(),
      opacity: z.number().min(0).max(1),
      position: z.enum(['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right']),
      rotation: z.number().optional(),
      fontSize: z.number().optional(),
      color: z.string().optional()
    }).optional(),
    password: z.string().optional(),
    permissions: z.object({
      allowPrint: z.boolean(),
      allowCopy: z.boolean(),
      allowEdit: z.boolean(),
      allowAnnotations: z.boolean()
    }).optional(),
    compression: z.boolean().optional(),
    quality: z.enum(['low', 'medium', 'high']).optional(),
    includeMetadata: z.boolean().optional()
  }).optional(),
  projectId: z.string().optional(),
  workflowId: z.string().optional()
});

/**
 * POST /api/documents/generate
 * Generate document from template
 */
export const POST = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = generateDocumentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    const { templateId, outputFormat, data, options, projectId, workflowId } = validationResult.data;

    // Create generation request
    const generationRequest = {
      templateId,
      outputFormat,
      data,
      options: options || {},
      metadata: {
        requestId: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        projectId,
        workflowId,
        timestamp: new Date(),
        source: 'api'
      }
    };

    // Generate document
    const result = await documentGenerationEngine.generateDocument(generationRequest);

    return NextResponse.json({
      data: result,
      message: 'Document generated successfully',
      requestId: generationRequest.metadata.requestId
    });

  } catch (error: any) {
    console.error('Document generation error:', error);
    
    // Handle specific error types
    if (error.message.includes('Template not found')) {
      return NextResponse.json(
        {
          error: 'Template not found',
          message: error.message
        },
        { status: 404 }
      );
    }
    
    if (error.message.includes('Required placeholder missing') || 
        error.message.includes('format is invalid')) {
      return NextResponse.json(
        {
          error: 'Data validation error',
          message: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Document generation failed',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ARCHITECT', 'ADMIN']
});

/**
 * GET /api/documents/generate
 * Get generation status or analytics
 */
export const GET = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const requestId = searchParams.get('requestId');
    const projectId = searchParams.get('projectId');

    if (action === 'status' && requestId) {
      // Get generation status
      const status = documentGenerationEngine.getGenerationStatus(requestId);
      
      return NextResponse.json({
        data: {
          requestId,
          ...status
        },
        message: 'Generation status retrieved successfully'
      });
    }

    if (action === 'analytics') {
      // Get generation analytics
      const analytics = await documentGenerationEngine.getGenerationAnalytics(
        user.id,
        projectId || undefined
      );

      return NextResponse.json({
        data: analytics,
        message: 'Generation analytics retrieved successfully'
      });
    }

    return NextResponse.json(
      {
        error: 'Invalid action',
        message: 'Action must be "status" or "analytics"'
      },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Document generation GET error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve generation data',
        message: error.message
      },
      { status: 500 }
    );
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ARCHITECT', 'ADMIN']
});