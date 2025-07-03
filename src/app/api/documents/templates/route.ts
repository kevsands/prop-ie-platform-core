import { NextRequest, NextResponse } from "next/server";
import { enterpriseDocumentServices } from "@/lib/services/enterprise-document-service";
import { DocumentCategory, TemplateStatus } from "@prisma/client";
import { z } from "zod";
import { withSimpleAuth } from "@/lib/middleware/simple-auth";

// Validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  category: z.nativeEnum(DocumentCategory),
  templateData: z.any(),
  projectTypes: z.array(z.string()),
  createdBy: z.string().min(1, "Creator ID is required"),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional()
});

const generateFromTemplateSchema = z.object({
  templateId: z.string().min(1, "Template ID is required"),
  projectId: z.string().optional(),
  generatedData: z.any(),
  generatedBy: z.string().min(1, "Generator ID is required")
});

/**
 * GET /api/documents/templates
 * Query parameters:
 * - category: DocumentCategory
 * - status: TemplateStatus
 * - projectType: string
 * - limit: number
 * - offset: number
 */
export const GET = withSimpleAuth(async (request: NextRequest, user) => {
  // Development bypass for testing
  if (process.env.NODE_ENV === 'development' && !user) {
    user = { id: 'dev-user', email: 'dev@prop.ie', role: 'ADMIN' } as any;
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as DocumentCategory;
    const status = searchParams.get("status") as TemplateStatus;
    const projectType = searchParams.get("projectType");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const templates = await enterpriseDocumentServices.templates.getTemplatesByCategory(
      category,
      {
        status,
        projectType: projectType || undefined,
        limit,
        offset
      }
    );

    return NextResponse.json({
      data: templates,
      message: "Templates retrieved successfully",
      user: { id: user.id, roles: user.roles } // Include user context
    });

  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({
      error: "Failed to fetch templates",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ARCHITECT', 'ADMIN']
});

/**
 * POST /api/documents/templates
 * Create a new document template
 */
export const POST = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = createTemplateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const validatedData = {
      ...validationResult.data,
      createdBy: user.id // Set creator from authenticated user
    };

    const template = await enterpriseDocumentServices.templates.createTemplate(validatedData);

    return NextResponse.json({
      data: template,
      message: "Template created successfully"
    });

  } catch (error: any) {
    console.error("Error creating template:", error);
    return NextResponse.json({
      error: "Failed to create template",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ADMIN']
});

/**
 * PUT /api/documents/templates
 * Update template status or generate from template
 */
export const PUT = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { action, templateId, status, ...generateData } = body;

    if (action === "updateStatus") {
      if (!templateId || !status) {
        return NextResponse.json(
          { error: "Template ID and status are required" },
          { status: 400 }
        );
      }

      const template = await enterpriseDocumentServices.templates.updateTemplateStatus(
        templateId,
        status as TemplateStatus
      );

      return NextResponse.json({
        data: template,
        message: "Template status updated successfully"
      });
    }

    if (action === "generate") {
      // Validate generation data
      const validationResult = generateFromTemplateSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { 
            error: "Validation error", 
            details: validationResult.error.format() 
          },
          { status: 400 }
        );
      }

      const generation = await enterpriseDocumentServices.templates.generateFromTemplate(
        validationResult.data
      );

      return NextResponse.json({
        data: generation,
        message: "Document generated from template successfully"
      });
    }

    return NextResponse.json(
      { error: "Invalid action specified" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Error updating template:", error);
    return NextResponse.json({
      error: "Failed to update template",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ADMIN']
});