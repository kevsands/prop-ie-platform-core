import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/enterprise-data";

interface Params {
  params: {
    id: string;
  };
}

/**
 * PUT handler for incrementing unit view count
 */
export const PUT = async (request: NextRequest, { params }: Params) => {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Unit ID is required" },
        { status: 400 }
      );
    }

    // Check if unit exists and increment view count
    const unit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      // Try finding by unitNumber
      const unitByNumber = await prisma.unit.findFirst({
        where: { 
          OR: [
            { unitNumber: id },
            { name: id }
          ]
        },
      });

      if (!unitByNumber) {
        return NextResponse.json(
          { success: false, error: "Unit not found" },
          { status: 404 }
        );
      }

      // Increment view count for unit found by number
      const updatedUnit = await prisma.unit.update({
        where: { id: unitByNumber.id },
        data: {
          viewCount: (unitByNumber.viewCount || 0) + 1,
          lastViewed: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedUnit,
        message: "View count incremented",
      });
    }

    // Increment view count for unit found by ID
    const updatedUnit = await prisma.unit.update({
      where: { id },
      data: {
        viewCount: (unit.viewCount || 0) + 1,
        lastViewed: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUnit,
      message: "View count incremented",
    });

  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

/**
 * POST handler (alias for PUT to support different HTTP methods)
 */
export const POST = PUT;