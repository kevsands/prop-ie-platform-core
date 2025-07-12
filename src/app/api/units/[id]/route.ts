import { NextRequest, NextResponse } from "next/server";
import { projectDataService } from '@/services/ProjectDataService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
  params: {
    id: string;
  };
}

/**
 * GET handler for retrieving a specific unit by ID
 */
export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Unit ID is required" },
        { status: 400 }
      );
    }

    console.log(`🔍 [UNITS API] Looking for unit: ${id}`);

    // Enhanced ID normalization for better unit lookup
    const normalizeUnitId = (inputId: string): string[] => {
      const possibleIds: string[] = [inputId];
      
      // Convert numeric strings to different formats
      if (/^\d+$/.test(inputId)) {
        const numericId = parseInt(inputId, 10);
        possibleIds.push(`unit-${numericId}`);
        possibleIds.push(`Unit ${numericId}`);
        possibleIds.push(numericId.toString());
        possibleIds.push(numericId.toString().padStart(3, '0'));
      }
      
      // Convert padded numbers (e.g., "002" -> "2", "unit-2")
      if (/^\d{3}$/.test(inputId)) {
        const numericId = parseInt(inputId, 10);
        possibleIds.push(`unit-${numericId}`);
        possibleIds.push(`Unit ${numericId}`);
        possibleIds.push(numericId.toString());
      }
      
      // Convert unit-prefixed IDs
      if (inputId.startsWith('unit-')) {
        const numericPart = inputId.replace('unit-', '');
        possibleIds.push(numericPart);
        possibleIds.push(numericPart.padStart(3, '0'));
        possibleIds.push(`Unit ${numericPart}`);
      }
      
      // Convert "Unit X" format
      if (inputId.startsWith('Unit ')) {
        const numericPart = inputId.replace('Unit ', '');
        possibleIds.push(numericPart);
        possibleIds.push(numericPart.padStart(3, '0'));
        possibleIds.push(`unit-${numericPart}`);
      }
      
      return [...new Set(possibleIds)]; // Remove duplicates
    };

    const possibleUnitIds = normalizeUnitId(id);
    console.log(`🔍 [UNITS API] Searching for unit with possible IDs: ${possibleUnitIds.join(', ')}`);

    // Use UnifiedProjectService as the single source of truth for enterprise data consistency
    const { unifiedProjectService } = await import('@/services/UnifiedProjectService');
    
    console.log('🏗️ [UNITS API] Loading from UnifiedProjectService for enterprise consistency...');
    const project = await unifiedProjectService.getProject('fitzgerald-gardens');

    if (project) {
      // Find unit in live data using enhanced lookup
      const unit = project.units.find(u => 
        possibleUnitIds.includes(u.id) || 
        possibleUnitIds.includes(u.number) ||
        possibleUnitIds.some(pid => u.id === pid || u.number === pid)
      );

      if (unit) {
        console.log(`✅ [UNITS API] Found unit in live data: ${unit.number}`);
        
        // Return unit in expected format
        return NextResponse.json({
          success: true,
          data: {
            id: unit.id,
            unitNumber: unit.number,
            name: `Unit ${unit.number}`,
            type: unit.type,
            bedrooms: unit.physical?.bedrooms || unit.features?.bedrooms,
            bathrooms: unit.physical?.bathrooms || unit.features?.bathrooms,
            size: unit.physical?.sqft || unit.features?.sqft,
            sqm: unit.physical?.sqm || unit.features?.sqm || Math.round((unit.physical?.sqft || unit.features?.sqft || 0) / 10.764),
            price: unit.pricing.currentPrice,
            basePrice: unit.pricing.basePrice,
            status: unit.status,
            floor: unit.physical?.floor || unit.features?.floor,
            building: unit.physical?.building || unit.features?.building,
            features: unit.unitFeatures || unit.features.features || [],
            amenities: unit.features.amenities || [],
            images: [],
            floorPlan: unit.floorPlan || null,
            Development: {
              id: 'fitzgerald-gardens',
              name: 'Fitzgerald Gardens',
              slug: 'fitzgerald-gardens',
              Location: {
                address: 'Ballymakenny Road, Drogheda, Co. Louth',
                city: 'Drogheda',
                county: 'Louth',
                country: 'Ireland'
              }
            },
            // Buyer information if available
            buyer: unit.buyer,
            // Legal pack information
            legalPack: unit.legalPack,
            // Timestamps
            createdAt: unit.createdAt,
            lastUpdated: unit.lastUpdated,
            // Data source indicator
            dataSource: 'live'
          }
        });
      }
    }

    console.log(`📄 [UNITS API] Falling back to database for unit: ${id}`);

    // Fallback to database with enhanced ID lookup
    let unit = await prisma.unit.findUnique({
      where: { id },
      include: {
        Development: {
          include: {
            Location: true
          }
        },
      },
    });

    // If not found by exact ID, try all possible ID variations
    if (!unit) {
      console.log(`🔍 [UNITS API] Trying database lookup with possible IDs: ${possibleUnitIds.join(', ')}`);
      
      unit = await prisma.unit.findFirst({
        where: { 
          OR: [
            ...possibleUnitIds.map(pid => ({ id: pid })),
            ...possibleUnitIds.map(pid => ({ unitNumber: pid })),
            ...possibleUnitIds.map(pid => ({ name: pid })),
          ]
        },
        include: {
          Development: {
            include: {
              Location: true
            }
          },
        },
      });
    }

    if (!unit) {
      return NextResponse.json(
        { success: false, error: "Unit not found" },
        { status: 404 }
      );
    }

    // Map to expected format with proper field names
    const mappedUnit = {
      id: unit.id,
      unitNumber: unit.unitNumber,
      name: unit.name,
      type: unit.type,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      size: unit.size,
      floorArea: unit.size, // Map size to floorArea for compatibility
      basePrice: unit.basePrice,
      price: unit.basePrice, // Map basePrice to price for compatibility
      status: unit.status,
      berRating: unit.berRating,
      features: unit.features,
      images: unit.images,
      primaryImage: unit.primaryImage,
      floorplans: unit.floorplans,
      floor: unit.floor,
      aspect: unit.aspect,
      viewCount: unit.viewCount,
      parkingSpaces: unit.parkingSpaces,
      updatedAt: unit.updatedAt,
      developmentId: unit.developmentId,
      development: unit.Development ? {
        id: unit.Development.id,
        name: unit.Development.name,
        description: unit.Development.description,
        location: unit.Development.Location ? 
          `${unit.Development.Location.address}, ${unit.Development.Location.city}, ${unit.Development.Location.county}` : 
          'Location not specified',
        mainImage: unit.Development.mainImage
      } : null
    };

    return NextResponse.json({
      success: true,
      data: mappedUnit,
    });

  } catch (error) {
    console.error("Error fetching unit:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

/**
 * PUT handler for updating a unit
 */
export const PUT = async (request: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const updateData = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Unit ID is required" },
        { status: 400 }
      );
    }

    // Check if unit exists
    const existingUnit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!existingUnit) {
      return NextResponse.json(
        { success: false, error: "Unit not found" },
        { status: 404 }
      );
    }

    // Update the unit
    const updatedUnit = await prisma.unit.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        Development: {
          include: {
            Location: true
          }
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUnit,
      message: "Unit updated successfully",
    });

  } catch (error) {
    console.error("Error updating unit:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

/**
 * DELETE handler for deleting a unit
 */
export const DELETE = async (request: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Unit ID is required" },
        { status: 400 }
      );
    }

    // Check if unit exists
    const existingUnit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!existingUnit) {
      return NextResponse.json(
        { success: false, error: "Unit not found" },
        { status: 404 }
      );
    }

    // Delete the unit
    await prisma.unit.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Unit deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting unit:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};