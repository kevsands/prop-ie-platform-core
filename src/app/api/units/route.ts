import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { UnitStatus, UnitType, PrismaClient, Prisma, Document } from "@prisma/client";
// Temporarily comment out circular dependency
// import { unitRepository } from "@/lib/db/repositories";
import { logger } from "@/lib/security/auditLogger";

// Import auth helpers specific for server-side use
import { getServerAuthSession } from "../auth/[...nextauth]/auth-server";

// Create Prisma client instance
const prisma = new PrismaClient();

// Temporary local repository
const unitRepository = {
  findMany: (where: any) => prisma.unit.findMany({ where }),
  create: (data: any) => prisma.unit.create({ data }),
  update: (id: string, data: any) => prisma.unit.update({ where: { id }, data }),
  delete: (id: string) => prisma.unit.delete({ where: { id } }),
  findById: (id: string) => prisma.unit.findUnique({ where: { id } })};

// Define the unit input type
interface UnitInput {
  name: string;
  developmentId: string;
  type: UnitType;
  size: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  parkingSpaces: number;
  basePrice: number;
  status: UnitStatus;
  berRating: string;
  features: string[];
  primaryImage: string;
  documents?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

/**
 * GET handler for retrieving units with filtering options
 */
export const GET = async (request: NextRequest) => {
  try {
    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const developmentId = searchParams.get("developmentId");
    const status = searchParams.get("status") as UnitStatus | null;
    const type = searchParams.get("type") as UnitType | null;
    const minBedrooms = searchParams.get("minBedrooms") ? parseInt(searchParams.get("minBedrooms")!) : undefined;
    const maxBedrooms = searchParams.get("maxBedrooms") ? parseInt(searchParams.get("maxBedrooms")!) : undefined;
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const minSize = searchParams.get("minSize") ? parseFloat(searchParams.get("minSize")!) : undefined;
    const maxSize = searchParams.get("maxSize") ? parseFloat(searchParams.get("maxSize")!) : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const id = searchParams.get("id");

    // If specific unit ID is requested, return with full details
    if (id) {
      const unit = await unitRepository.findById(id);

      if (!unit) {
        return NextResponse.json(
          { error: "Unit not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(unit);
    }

    // Build filter object for repository query
    const filterParams: Prisma.UnitWhereInput = {
      developmentId: developmentId || undefined,
      type: type || undefined,
      status: status || undefined,
      bedrooms: {
        ...(minBedrooms !== undefined ? { gte: minBedrooms } : {}),
        ...(maxBedrooms !== undefined ? { lte: maxBedrooms } : {})
      },
      basePrice: {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {})
      },
      size: {
        ...(minSize !== undefined ? { gte: minSize } : {}),
        ...(maxSize !== undefined ? { lte: maxSize } : {})
      }
    };

    // Find units with filters and include related data to avoid N+1 queries
    const units = await prisma.unit.findMany({
      where: filterParams,
      skip: offset,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        development: {
          select: {
            id: true,
            name: true,
            location: true,
            developer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                organization: true
              }
            }
          }
        },
        unitType: true,
        customizationOptions: {
          include: {
            alternatives: true
          }
        },
        _count: {
          select: {
            transactions: true,
            propertyViews: true,
            inquiries: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.unit.count({
      where: filterParams
    });

    return NextResponse.json({
      units,
      pagination: {
        total: totalCount,
        offset,
        limit
      }
    });
  } catch (error: any) {
    logger.error("Error fetching units:", { 
      error: error.message, 
      stack: error.stack
    });

    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new unit with associated documents
 * Uses transaction support to ensure all operations succeed or fail together
 */
export const POST = async (request: NextRequest) => {
  try {
    // Get auth session
    const session = await getServerAuthSession();

    // Check authorization (e.g., DEVELOPER or ADMIN role required)
    if (!session || !["DEVELOPER", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized - Developer or Admin role required" },
        { status: 403 }
      );
    }

    // Parse request body with type assertion
    const data = await request.json() as UnitInput;

    // Validate required fields
    const requiredFields = [
      "name", "developmentId", "type", "size", "bedrooms", 
      "bathrooms", "floors", "parkingSpaces", "basePrice", 
      "status", "berRating", "features", "primaryImage"
    ] as const;

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Extract documents data if present
    const { documents, ...unitData } = data;

    // Generate a new ID if not provided
    const unitId = uuidv4();

    // Use transaction to create unit and documents
    try {
      const result = await prisma.$transaction(async (tx: any) => {
        // Create the unit
        const unit = await tx.unit.create({
          data: {
            id: unitId,
            ...unitData,
            viewCount: 0
          }
        });

        // Create any associated documents if provided
        const createdDocuments: Document[] = [];
        if (documents && Array.isArray(documents) && documents.length> 0) {
          for (const doc of documents) {
            const document = await tx.document.create({
              data: {
                id: uuidv4(),
                name: doc.name,
                type: doc.type,
                status: 'PENDING',
                category: 'UNIT_DOCUMENT',
                fileUrl: doc.url,
                fileType: doc.url.split('.').pop() || 'pdf',
                fileSize: 0, // This should be calculated from the actual file
                uploadedById: session.user.id,
                uploadedByName: session.user.name || undefined,
                tags: [],
                unitId: unit.id
              }
            });
            createdDocuments.push(document);
          }
        }

        return { unit, DevelopmentDocument: createdDocuments };
      });

      // Return the created unit with its documents
      return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
      logger.error("Transaction failed when creating unit with DevelopmentDocument:", { 
        error: error.message, 
        stack: error.stack,
        developmentId: unitData.developmentId,
        unitName: unitData.name
      });

      return NextResponse.json(
        { error: "Failed to create unit with documents" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logger.error("Error in POST /api/units:", { 
      error: error.message, 
      stack: error.stack
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating an existing unit
 */
export const PUT = async (request: NextRequest) => {
  try {
    // Get auth session
    const session = await getServerAuthSession();

    // Check authorization (e.g., DEVELOPER or ADMIN role required)
    if (!session || !["DEVELOPER", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized - Developer or Admin role required" },
        { status: 403 }
      );
    }

    // Parse request body and URL parameters
    const { documents, ...unitData } = await request.json() as Partial<UnitInput>;
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Unit ID is required" },
        { status: 400 }
      );
    }

    // Check if unit exists
    const existingUnit = await unitRepository.findById(id);

    if (!existingUnit) {
      return NextResponse.json(
        { error: "Unit not found" },
        { status: 404 }
      );
    }

    // Update unit with typed data
    const updateData = {
      ...unitData,
      updatedAt: new Date()
    };

    const updatedUnit = await unitRepository.update(idupdateData);

    // Handle document updates if provided
    if (documents && Array.isArray(documents)) {
      await prisma.$transaction(async (tx: any) => {
        // Delete existing documents
        await tx.document.deleteMany({
          where: { unitId: id }
        });

        // Create new documents
        for (const doc of documents) {
          await tx.document.create({
            data: {
              id: uuidv4(),
              name: doc.name,
              type: doc.type,
              status: 'PENDING',
              category: 'UNIT_DOCUMENT',
              fileUrl: doc.url,
              fileType: doc.url.split('.').pop() || 'pdf',
              fileSize: 0,
              uploadedById: session.user.id,
              uploadedByName: session.user.name || undefined,
              tags: [],
              unitId: id
            }
          });
        }
      });
    }

    return NextResponse.json(updatedUnit);
  } catch (error: any) {
    logger.error("Error updating unit:", { 
      error: error.message, 
      stack: error.stack
    });

    return NextResponse.json(
      { error: "Failed to update unit" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a unit
 */
export const DELETE = async (request: NextRequest) => {
  try {
    // Get auth session
    const session = await getServerAuthSession();

    // Check authorization (e.g., DEVELOPER or ADMIN role required)
    if (!session || !["DEVELOPER", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized - Developer or Admin role required" },
        { status: 403 }
      );
    }

    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Unit ID is required" },
        { status: 400 }
      );
    }

    // Check if unit exists
    const existingUnit = await unitRepository.findById(id);

    if (!existingUnit) {
      return NextResponse.json(
        { error: "Unit not found" },
        { status: 404 }
      );
    }

    // Check for associated sales before deletion
    // This is done in a transaction to ensure consistency
    try {
      const result = await prisma.$transaction(async (tx: any) => {
        // Check for associated sales
        const sales = await tx.sale.findMany({
          where: {
            unitId: id
          }
        });

        if (sales.length> 0) {
          throw new Error("Cannot delete unit with associated sales");
        }

        // Delete associated documents first
        await tx.document.deleteMany({
          where: {
            unitId: id
          }
        });

        // Delete the unit
        return tx.unit.delete({
          where: {
            id
          }
        });
      });

      return NextResponse.json({ 
        message: "Unit deleted successfully",
        unit: result
      });
    } catch (error: any) {
      if (error.message === "Cannot delete unit with associated sales") {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }

      throw error; // Let the outer catch handle other errors
    }
  } catch (error: any) {
    logger.error("Error deleting unit:", { 
      error: error.message, 
      stack: error.stack
    });

    return NextResponse.json(
      { error: "Failed to delete unit" },
      { status: 500 }
    );
  }
}