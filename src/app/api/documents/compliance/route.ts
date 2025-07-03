import { NextRequest, NextResponse } from "next/server";
import { enterpriseDocumentServices } from "@/lib/services/enterprise-document-service";
import { ComplianceStatus } from "@prisma/client";
import { z } from "zod";

// Validation schemas
const createComplianceSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  complianceCategory: z.string().min(1, "Compliance category is required"),
  requirementName: z.string().min(1, "Requirement name is required"),
  description: z.string().optional(),
  authority: z.string().min(1, "Authority is required"),
  legislation: z.string().optional(),
  deadlineDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  responsiblePerson: z.string().optional()
});

const updateComplianceSchema = z.object({
  complianceId: z.string().min(1, "Compliance ID is required"),
  status: z.nativeEnum(ComplianceStatus).optional(),
  score: z.number().min(0).max(100).optional(),
  completionDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  notes: z.string().optional()
});

const generateReportSchema = z.object({
  complianceId: z.string().min(1, "Compliance ID is required"),
  reportType: z.string().min(1, "Report type is required"),
  generatedBy: z.string().min(1, "Generator ID is required")
});

/**
 * GET /api/documents/compliance
 * Query parameters:
 * - projectId: string (required)
 * - action: 'list' | 'dashboard'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const action = searchParams.get("action") || "dashboard";

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    if (action === "dashboard") {
      const complianceData = await enterpriseDocumentServices.compliance.getProjectCompliance(projectId);

      return NextResponse.json({
        data: complianceData,
        message: "Compliance dashboard data retrieved successfully"
      });
    }

    // Default to dashboard data
    const complianceData = await enterpriseDocumentServices.compliance.getProjectCompliance(projectId);

    return NextResponse.json({
      data: complianceData,
      message: "Compliance data retrieved successfully"
    });

  } catch (error: any) {
    console.error("Error fetching compliance data:", error);
    return NextResponse.json({
      error: "Failed to fetch compliance data",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

/**
 * POST /api/documents/compliance
 * Create compliance requirement or generate report
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "generateReport") {
      // Validate report generation data
      const validationResult = generateReportSchema.safeParse(data);
      if (!validationResult.success) {
        return NextResponse.json(
          { 
            error: "Validation error", 
            details: validationResult.error.format() 
          },
          { status: 400 }
        );
      }

      const report = await enterpriseDocumentServices.compliance.generateComplianceReport(
        validationResult.data.complianceId,
        validationResult.data.reportType,
        validationResult.data.generatedBy
      );

      return NextResponse.json({
        data: report,
        message: "Compliance report generated successfully"
      });
    }

    // Default action: create compliance requirement
    const validationResult = createComplianceSchema.safeParse(body);
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

    const compliance = await enterpriseDocumentServices.compliance.createCompliance(validatedData);

    return NextResponse.json({
      data: compliance,
      message: "Compliance requirement created successfully"
    });

  } catch (error: any) {
    console.error("Error creating compliance:", error);
    return NextResponse.json({
      error: "Failed to create compliance",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

/**
 * PUT /api/documents/compliance
 * Update compliance status and score
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = updateComplianceSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const { complianceId, ...updateData } = validationResult.data;

    const compliance = await enterpriseDocumentServices.compliance.updateCompliance(
      complianceId,
      updateData
    );

    return NextResponse.json({
      data: compliance,
      message: "Compliance updated successfully"
    });

  } catch (error: any) {
    console.error("Error updating compliance:", error);
    return NextResponse.json({
      error: "Failed to update compliance",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}