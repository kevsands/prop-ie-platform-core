/**
 * API Route: /api/customizations
 * Handles unit customization endpoints with transaction support
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth-helpers";
// Import from Prisma client directly instead of our wrapper
import { PrismaClient, CustomizationStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Create Prisma client
const prisma = new PrismaClient();

// Logger implementation
const logger = {
  error: (message: string, data?: any) => {

  }
};

// Define a session with user ID and role properties
interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

interface Session {
  user: SessionUser;
}

// Helper async function togetServerSession();
  if (!session?.user) return null;

  return {
    user: {
      id: session.user.id || '',
      name: session.user.name || undefined,
      email: session.user.email || undefined,
      image: session.user.image || undefined,
      role: 'USER' // Default role, should be set by your auth system
    }
  };
}

/**
 * GET customizations for a unit
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const unitId = url.searchParams.get('unitId');
    const saleId = url.searchParams.get('saleId');
    const userId = url.searchParams.get('userId');

    if (!unitId && !saleId && !userId) {
      return NextResponse.json(
        { error: 'At least one filter parameter is required: unitId, saleId, or userId' },
        { status: 400 }
      );
    }

    let customizations;

    // Use direct Prisma queries instead of repositories
    if (unitId) {
      // Get customization options for unit
      customizations = await prisma.unitCustomizationOption.findMany({
        where: { unitId }
      });
    } else if (saleId) {
      // Get applied customizations for a sale
      customizations = await prisma.customizationSelection.findMany({
        where: { 
          unit: {
            sales: {
              some: {
                id: saleId
              }
            }
          }
        },
        include: {
          selections: true
        }
      });
    } else if (userId) {
      // Get all customizations for a user
      customizations = await prisma.customizationSelection.findMany({
        where: {
          buyer: userId
        },
        include: {
          selections: true
        }
      });
    }

    return NextResponse.json({ data: customizations });
  } catch (error: any) {
    logger.error('Error fetching customizations:', { 
      error: error.message,
      stack: error.stack 
    });

    return NextResponse.json(
      { error: 'Failed to fetch customizations' },
      { status: 500 }
    );
  }
}

/**
 * POST to create customization selections for a sale
 * Uses transaction support to create and link multiple entities
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    // Check authorization
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json() as {
      saleId: string;
      unitId: string;
      selections: Array<{
        customizationOptionId: string;
        color?: string;
        material?: string;
        notes?: string;
        quantity?: number;
        additionalCost?: number;
      }>\n  );
    };

    // Validate required fields
    if (!body.saleId || !body.unitId || !body.selections || !Array.isArray(body.selections)) {
      return NextResponse.json(
        { error: 'Missing required fields: saleId, unitId, and selections array' },
        { status: 400 }
      );
    }

    // Validate that the selections array has items
    if (body.selections.length === 0) {
      return NextResponse.json(
        { error: 'Selections array cannot be empty' },
        { status: 400 }
      );
    }

    // Execute in a transaction
    try {
      // Use a Prisma transaction
      return await prisma.$transaction(async (prismaClient: any) => {
        // First, verify the sale exists and belongs to the user
        const sale = await prismaClient.sale.findUnique({
          where: { id: body.saleId }
        });

        if (!sale) {
          return NextResponse.json(
            { error: 'Sale not found' },
            { status: 404 }
          );
        }

        // Verify the user has permission (buyer or agent for the sale)
        if (sale.buyerId !== session.user.id && 
            sale.sellingAgentId !== session.user.id && 
            session.user.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'You do not have permission to customize this unit' },
            { status: 403 }
          );
        }

        // Verify the unit exists
        const unit = await prismaClient.unit.findUnique({
          where: { id: body.unitId }
        });

        if (!unit) {
          return NextResponse.json(
            { error: 'Unit not found' },
            { status: 404 }
          );
        }

        // Verify the unit is associated with the sale
        if (sale.unitId !== body.unitId) {
          return NextResponse.json(
            { error: 'Unit does not match the unit in the sale' },
            { status: 400 }
          );
        }

        // Create a customization selection to group all selections
        const customizationSelection = await prismaClient.customizationSelection.create({
          data: {
            id: uuidv4(),
            unitId: body.unitId,
            buyer: session.user.id,
            status: CustomizationStatus.DRAFT,
            totalCost: 0, // Will be updated after processing selections
            notes: null,
            submittedDate: null,
            approvedDate: null,
            deadlineDate: null,
            meetingBooked: false,
            meetingDate: null
          }
        });

        // Process each selection and calculate total cost
        let totalCost = 0;
        const createdSelections = [];

        for (const selection of body.selections) {
          // Verify the customization option exists
          const option = await prismaClient.unitCustomizationOption.findUnique({
            where: { id: selection.customizationOptionId }
          });

          if (!option) {
            throw new Error(`Customization option not found: ${selection.customizationOptionId}`);
          }

          // Calculate additional cost
          const additionalCost = selection.additionalCost || 
                              (option.additionalCost * (selection.quantity || 1));

          totalCost += additionalCost;

          // Create the selection record
          const createdSelection = await prismaClient.selectedOption.create({
            data: {
              id: uuidv4(),
              selectionId: customizationSelection.id,
              optionId: selection.customizationOptionId,
              color: selection.color || null,
              finish: selection.material || null,
              notes: selection.notes || null,
              quantity: selection.quantity || 1
            }
          });

          createdSelections.push(createdSelection);
        }

        // Update the total cost of the selection
        const updatedSelection = await prismaClient.customizationSelection.update({
          where: { id: customizationSelection.id },
          data: {
            totalCost,
            status: CustomizationStatus.SUBMITTED
          }
        });

        // Create a document record for the customization
        const document = await prismaClient.document.create({
          data: {
            id: uuidv4(),
            name: `Customization Selection ${customizationSelection.id}`,
            type: 'CUSTOMIZATION_SELECTION',
            status: 'ACTIVE',
            category: 'CUSTOMIZATION',
            fileUrl: "", // Will be generated later, using empty string instead of null
            fileType: 'application/pdf',
            fileSize: 0, // Will be updated when file is generated
            uploadedById: session.user.id,
            uploadedByName: session.user.name || null,
            tags: ['customization', 'selection'],
            version: 1,
            relatedTo: {
              type: 'CustomizationSelection',
              id: customizationSelection.id
            },
            metadata: {
              selectionId: customizationSelection.id,
              unitId: body.unitId
            }
          }
        });

        // Return the created package with selections
        return NextResponse.json({
          data: {
            customizationSelection: {
              ...updatedSelection
            },
            selections: createdSelections,
            document
          }
        }, { status: 201 });
      });
    } catch (error: any) {
      logger.error('Transaction failed when creating customizations:', { 
        error: error.message,
        stack: error.stack,
        saleId: body.saleId,
        unitId: body.unitId
      });

      return NextResponse.json(
        { error: `Failed to create customizations: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logger.error('Error creating customizations:', { 
      error: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { error: 'Failed to create customizations' },
      { status: 500 }
    );
  }
}

/**
 * PUT to update customization selections
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json() as {
      id: string;
      status?: CustomizationStatus;
      notes?: string;
      selections?: Array<{
        id: string;
        color?: string;
        material?: string;
        quantity?: number;
        notes?: string;
      }>\n  );
    };

    // Find the customization selection
    const selection = await prisma.customizationSelection.findUnique({
      where: { id: body.id },
      include: {
        selections: true
      }
    });

    if (!selection) {
      return NextResponse.json(
        { error: 'Customization selection not found' },
        { status: 404 }
      );
    }

    // Update the selection
    const updatedSelection = await prisma.customizationSelection.update({
      where: { id: body.id },
      data: {
        status: body.status,
        notes: body.notes,
        totalCost: selection.totalCost // Keep existing total cost
      }
    });

    // Update individual selections if provided
    if (body.selections) {
      for (const sel of body.selections) {
        await prisma.selectedOption.update({
          where: { id: sel.id },
          data: {
            color: sel.color,
            finish: sel.material,
            quantity: sel.quantity,
            notes: sel.notes
          }
        });
      }
    }

    return NextResponse.json({
      data: {
        selection: updatedSelection
      }
    });
  } catch (error: any) {
    logger.error('Error updating customization selection:', error);
    return NextResponse.json(
      { error: 'Failed to update customization selection' },
      { status: 500 }
    );
  }
}