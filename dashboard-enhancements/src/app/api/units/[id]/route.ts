import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/enterprise-data";

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
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Unit ID is required" },
        { status: 400 }
      );
    }

    // Try to find unit by ID first, then by unit number
    let unit = await prisma.unit.findUnique({
      where: { id },
      include: {
        development: true,
      },
    });

    // If not found by ID, try to find by unitNumber
    if (!unit) {
      unit = await prisma.unit.findFirst({
        where: { 
          OR: [
            { unitNumber: id },
            { name: id }
          ]
        },
        include: {
          development: true,
        },
      });
    }

    if (!unit) {
      return NextResponse.json(
        { success: false, error: "Unit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: unit,
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
    const { id } = params;
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
        development: true,
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
    const { id } = params;

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