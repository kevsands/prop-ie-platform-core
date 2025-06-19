import { NextRequest, NextResponse } from "next/server";
import sanitize from "@/lib/security/sanitize";
import { verifyCSRFToken } from "@/components/security/CSRFToken";
import { 
  Document, 
  DocumentRequest, 
  isDocument, 
  isDocumentRequest,
  DocumentStatus
} from "@/types/document";
import { z } from "zod";
import { safeJsonParse, parseWithSchema } from "@/utils/safeJsonParser";
import { documentsService } from "@/lib/services/documents-real";
// Removed React imports and component definitions as they're not needed in a route handler

// Define Zod schema for document requests
const documentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  url: z.string().url("Invalid URL format"),
  propertyId: z.string().optional(),
  uploadedBy: z.string().min(1, "Uploader ID is required"),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED']).optional().default('PENDING'),
  metadata: z.record(z.unknown()).optional().default({}),
  category: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  description: z.string().optional()
});

type DocumentCreateInput = z.infer<typeof documentSchema>;

/**
 * GET /api/documents
 * Query parameters:
 * - id: Get a specific document by ID
 * - propertyId: Filter by property ID
 * - userId: Filter by user ID
 * - type: Filter by document type
 * - status: Filter by status
 * - searchTerm: Search in document titles
 * - limit: Pagination limit
 * - offset: Pagination offset
 * - entityType: Filter by entity type
 * - entityId: Filter by entity ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = sanitize.stripHtml(searchParams.get("id") || "");
    
    // Implement pagination limits to prevent DoS
    const maxLimit = 100;
    const defaultLimit = 20;
    
    // Extract parameter values
    const ownerId = searchParams.get("ownerId") || searchParams.get("propertyId") || searchParams.get("userId");
    const ownerType = searchParams.get("ownerType") || searchParams.get("entityType");
    const docType = searchParams.get("type");
    const uploadedBy = searchParams.get("uploadedBy");
    const isPublic = searchParams.get("isPublic");
    const searchTerm = searchParams.get("searchTerm") || searchParams.get("search");
    
    // If ID is provided, get specific document
    if (id) {
      const document = await documentsService.getDocumentById(id);
      
      if (!document) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(document);
    }

    // Parse pagination parameters
    const limit = searchParams.get("limit") 
      ? Math.min(parseInt(searchParams.get("limit") || ""), maxLimit) || defaultLimit 
      : defaultLimit;
    const offset = searchParams.get("offset") 
      ? parseInt(sanitize.stripHtml(searchParams.get("offset") || "")) || 0 
      : 0;

    // Build filters for real database service
    const filters: any = {
      limit,
      offset
    };
    
    if (ownerId) {
      filters.ownerId = sanitize.stripHtml(ownerId);
    }
    if (ownerType) {
      filters.ownerType = sanitize.stripHtml(ownerType);
    }
    if (docType) {
      filters.type = sanitize.stripHtml(docType);
    }
    if (uploadedBy) {
      filters.uploadedBy = sanitize.stripHtml(uploadedBy);
    }
    if (isPublic !== null && isPublic !== undefined) {
      filters.isPublic = isPublic === 'true';
    }
    if (searchTerm) {
      filters.search = sanitize.stripHtml(searchTerm);
    }

    // Get documents from real database
    const result = await documentsService.getDocuments(filters);

    return NextResponse.json({
      data: result.documents,
      pagination: {
        total: result.total,
        page: Math.floor(offset / limit) + 1,
        limit,
        pages: Math.ceil(result.total / limit)
      },
      message: "Documents retrieved successfully"
    });
    
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({
      error: "Failed to fetch documents",
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

/**
 * POST /api/documents
 * Create a new document
 * Required fields:
 * - title: Document title
 * - type: Document type (legal, certification, warranty, etc.)
 * - url: Document URL or path
 * - uploadedBy: User ID who uploaded the document
 * Optional fields:
 * - propertyId: Associated property ID
 * - status: Document status (default: pending)
 * - metadata: Additional metadata (JSON)
 * - category: Document category
 * - entityType: Associated entity type
 * - entityId: Associated entity ID
 */
export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token in the request headers
    const csrfToken = request.headers.get('x-csrf-token');
    if (!csrfToken || !verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token" },
        { status: 403 }
      );
    }

    // Parse request body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Sanitize inputs to prevent XSS
    const sanitizedBody = typeof rawBody === 'object' && rawBody !== null 
      ? sanitize.sanitizeObject(rawBody) 
      : {};

    // Validate using Zod schema
    const validationResult = documentSchema.safeParse(sanitizedBody);
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

    // URL validation - double check it's a safe URL
    const safeUrl = sanitize.sanitizeUrl(validatedData.url);
    if (safeUrl !== validatedData.url) {
      return NextResponse.json(
        { error: "Invalid URL format detected during security check" },
        { status: 400 }
      );
    }

    // Create document with real database service
    const document = await documentsService.createDocument({
      title: validatedData.title,
      description: validatedData.description,
      type: validatedData.type,
      url: safeUrl,
      uploadedBy: validatedData.uploadedBy,
      ownerId: validatedData.propertyId || validatedData.entityId,
      ownerType: validatedData.entityType || (validatedData.propertyId ? 'property' : undefined),
      tags: validatedData.metadata ? Object.keys(validatedData.metadata) : undefined,
      isPublic: false, // Default to private for security
      mimeType: undefined, // Could be extracted from file upload
      size: undefined // Could be extracted from file upload
    });

    return NextResponse.json({ 
      data: document,
      message: "Document created successfully"
    });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/documents
 * Update a document
 * Required field:
 * - id: Document ID to update
 * Optional fields (at least one required):
 * - title: New document title
 * - type: New document type
 * - url: New document URL
 * - propertyId: New associated property ID
 * - uploadedBy: New user ID
 * - status: New document status
 * - metadata: New metadata
 * - category: New category
 * - entityType: New entity type
 * - entityId: New entity ID
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify CSRF token
    const csrfToken = request.headers.get('x-csrf-token');
    if (!csrfToken || !verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token" },
        { status: 403 }
      );
    }

    // Parse request body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedBody = typeof rawBody === 'object' && rawBody !== null 
      ? sanitize.sanitizeObject(rawBody) 
      : {};

    // Validate using Zod schema
    const validationResult = documentSchema.safeParse(sanitizedBody);
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

    if (!validatedData.id) {
      return NextResponse.json(
        { error: "Document ID is required for update" },
        { status: 400 }
      );
    }

    // URL validation
    const safeUrl = sanitize.sanitizeUrl(validatedData.url);
    if (safeUrl !== validatedData.url) {
      return NextResponse.json(
        { error: "Invalid URL format detected during security check" },
        { status: 400 }
      );
    }

    // Update document using documentsService
    const document = await documentsService.updateDocument(validatedData.id!, {
      title: validatedData.title,
      type: validatedData.type,
      description: validatedData.description
    });

    return NextResponse.json({ data: document });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/documents
 * Delete a document (hard delete) or mark as inactive (soft delete)
 * Query parameters:
 * - id: Document ID to delete
 * - soft: If "true", perform soft delete
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify CSRF token
    const csrfToken = request.headers.get('x-csrf-token');
    if (!csrfToken || !verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = sanitize.stripHtml(searchParams.get("id") || "");

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Delete document using documentsService
    const success = await documentsService.deleteDocument(id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Document not found or could not be deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-csrf-token',
      'Access-Control-Max-Age': '86400',
    },
  });
}