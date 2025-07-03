import { NextRequest, NextResponse } from "next/server";
import { enterpriseDocumentServices } from "@/lib/services/enterprise-document-service";
import { z } from "zod";
import { withSimpleAuth } from "@/lib/middleware/simple-auth";

// Validation schemas
const createApplicationSchema = z.object({
  providerName: z.string().min(1, "Provider name is required"),
  applicationType: z.string().min(1, "Application type is required"),
  projectId: z.string().optional(),
  formData: z.any(),
  estimatedCost: z.string().optional(),
  estimatedTime: z.string().optional()
});

/**
 * GET /api/documents/automation
 * Query parameters:
 * - providerName: string (required)
 * - projectId: string (optional)
 * - action: 'list' | 'statistics'
 */
export const GET = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const providerName = searchParams.get("providerName");
    const projectId = searchParams.get("projectId");
    const action = searchParams.get("action") || "list";

    if (action === "statistics") {
      const statistics = await enterpriseDocumentServices.automation.getProviderStatistics();
      
      return NextResponse.json({
        data: statistics,
        message: "Provider statistics retrieved successfully"
      });
    }

    if (!providerName) {
      return NextResponse.json(
        { error: "Provider name is required" },
        { status: 400 }
      );
    }

    const applications = await enterpriseDocumentServices.automation.getApplicationsByProvider(
      providerName,
      projectId || undefined
    );

    return NextResponse.json({
      data: applications,
      message: "Applications retrieved successfully"
    });

  } catch (error: any) {
    console.error("Error fetching automation data:", error);
    return NextResponse.json({
      error: "Failed to fetch automation data",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ADMIN']
});

/**
 * POST /api/documents/automation
 * Create automatic document filler application
 */
export const POST = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = createApplicationSchema.safeParse(body);
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

    const application = await enterpriseDocumentServices.automation.createApplication(validatedData);

    return NextResponse.json({
      data: application,
      message: "Application created successfully"
    });

  } catch (error: any) {
    console.error("Error creating application:", error);
    return NextResponse.json({
      error: "Failed to create application",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ADMIN']
});

/**
 * PUT /api/documents/automation
 * Submit application
 */
export const PUT = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { applicationId, action } = body;

    if (action !== "submit") {
      return NextResponse.json(
        { error: "Invalid action specified" },
        { status: 400 }
      );
    }

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const application = await enterpriseDocumentServices.automation.submitApplication(applicationId);

    return NextResponse.json({
      data: application,
      message: "Application submitted successfully"
    });

  } catch (error: any) {
    console.error("Error submitting application:", error);
    return NextResponse.json({
      error: "Failed to submit application",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ADMIN']
});