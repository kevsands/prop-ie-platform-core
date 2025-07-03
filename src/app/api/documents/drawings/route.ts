import { NextRequest, NextResponse } from "next/server";
import { enterpriseDocumentServices } from "@/lib/services/enterprise-document-service";
import { DocumentCategory } from "@prisma/client";
import { z } from "zod";

// Validation schemas
const createDrawingSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  drawingNumber: z.string().min(1, "Drawing number is required"),
  title: z.string().min(1, "Drawing title is required"),
  category: z.nativeEnum(DocumentCategory),
  subcategory: z.string().optional(),
  drawingFile: z.string().optional(),
  createdBy: z.string().min(1, "Creator ID is required"),
  metadata: z.any().optional()
});

const createRevisionSchema = z.object({
  drawingId: z.string().min(1, "Drawing ID is required"),
  revision: z.string().min(1, "Revision is required"),
  description: z.string().min(1, "Description is required"),
  revisedBy: z.string().min(1, "Reviser ID is required"),
  fileUrl: z.string().optional()
});

/**
 * GET /api/documents/drawings
 * Query parameters:
 * - projectId: string (required)
 * - category: DocumentCategory (optional)
 * - action: 'list' | 'coordination'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const category = searchParams.get("category") as DocumentCategory;
    const action = searchParams.get("action") || "list";

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    if (action === "coordination") {
      const coordinationMatrix = await enterpriseDocumentServices.drawings.getCoordinationMatrix(projectId);

      return NextResponse.json({
        data: coordinationMatrix,
        message: "Drawing coordination matrix retrieved successfully"
      });
    }

    const drawings = await enterpriseDocumentServices.drawings.getDrawingsByProject(
      projectId,
      category || undefined
    );

    return NextResponse.json({
      data: drawings,
      message: "Drawings retrieved successfully"
    });

  } catch (error: any) {
    console.error("Error fetching drawings:", error);
    return NextResponse.json({
      error: "Failed to fetch drawings",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

/**
 * POST /api/documents/drawings
 * Create drawing or create revision
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "createRevision") {
      // Validate revision data
      const validationResult = createRevisionSchema.safeParse(data);
      if (!validationResult.success) {
        return NextResponse.json(
          { 
            error: "Validation error", 
            details: validationResult.error.format() 
          },
          { status: 400 }
        );
      }

      const revision = await enterpriseDocumentServices.drawings.createRevision(
        validationResult.data
      );

      return NextResponse.json({
        data: revision,
        message: "Drawing revision created successfully"
      });
    }

    // Default action: create drawing
    const validationResult = createDrawingSchema.safeParse(body);
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

    const drawing = await enterpriseDocumentServices.drawings.createDrawing(validatedData);

    return NextResponse.json({
      data: drawing,
      message: "Drawing created successfully"
    });

  } catch (error: any) {
    console.error("Error creating drawing:", error);
    return NextResponse.json({
      error: "Failed to create drawing",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}