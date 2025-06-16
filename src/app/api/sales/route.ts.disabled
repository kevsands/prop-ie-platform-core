import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { SaleStatus } from '@prisma/client';
import { z } from 'zod';
import { salesService } from '@/lib/services/sales';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET handler for sales endpoint
 * Supports query parameters for filtering:
 * - status: filter by sale status
 * - developmentId: filter by development
 * - buyerId: filter by buyer
 * - sellingAgentId: filter by selling agent
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const filters: Record<string, string> = {};

    // Collect all query parameters
    for (const [key, value] of searchParams.entries()) {
      if (value) {
        filters[key] = value;
      }
    }

    // Get ID parameter if it exists (for single sale retrieval)
    const id = searchParams.get('id');
    
    if (id) {
      // Get a specific sale by ID
      const sale = await salesService.getSaleById(id);
      
      if (!sale) {
        return NextResponse.json(
          { error: 'Sale not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(sale);
    } else {
      // Get all sales with optional filters
      const sales = await salesService.getAllSales({
        status: filters.status as any,
        developmentId: filters.developmentId,
        buyerId: filters.buyerId,
        sellingAgentId: filters.sellingAgentId,
      });
      
      return NextResponse.json(sales);
    }
  } catch (error) {
    console.error('Error in sales GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new sale
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body with type assertion
    const data = await request.json() as {
      unitId: string;
      buyerId: string;
      sellingAgentId?: string;
      developmentId: string;
      basePrice: number;
      customizationCost?: number;
      totalPrice: number;
      referenceNumber: string;
      status: SaleStatus;
      contractStatus: string;
    };

    // Validate required fields
    if (!data.unitId || !data.buyerId || !data.developmentId || !data.referenceNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the sale
    const sale = await salesService.createSale(data);
    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Error in sales POST handler:', error);
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a sale
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body with type assertion
    const body = await request.json() as { id: string; [key: string]: unknown };

    // Extract the ID from the request body
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Sale ID is required' },
        { status: 400 }
      );
    }

    // Check if this is a status update
    if (updateData.status) {
      // Validate status update data
      const StatusUpdateSchema = z.object({
        status: z.nativeEnum(SaleStatus),
        previousStatus: z.nativeEnum(SaleStatus).optional(),
        updatedById: z.string(),
        notes: z.string().optional(),
        timelineUpdates: z.record(z.string(), z.coerce.date()).optional(),
      });

      const validationResult = StatusUpdateSchema.safeParse(updateData);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid status update data', details: validationResult.error.format() },
          { status: 400 }
        );
      }

      const updatedSale = await salesService.updateSaleStatus(id, validationResult.data);
      return NextResponse.json(updatedSale);
    } 
    // Check if this is a deposit update
    else if (updateData.initialAmount !== undefined) {
      // Validate deposit update data
      const DepositSchema = z.object({
        initialAmount: z.number().nonnegative(),
        initialAmountPercentage: z.number().min(0).max(100),
        initialPaidDate: z.coerce.date().optional(),
        balanceAmount: z.number().nonnegative(),
        balanceDueDate: z.coerce.date().optional(),
        balancePaidDate: z.coerce.date().optional(),
        totalPaid: z.number().nonnegative(),
        status: z.nativeEnum(SaleStatus),
        paymentMethod: z.string().optional(),
        receiptDocumentIds: z.array(z.string()).optional(),
      });

      const validationResult = DepositSchema.safeParse(updateData);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid deposit data', details: validationResult.error.format() },
          { status: 400 }
        );
      }

      const updatedDeposit = await salesService.updateDeposit(id, validationResult.data);
      return NextResponse.json(updatedDeposit);
    }
    // Check if this is a note addition
    else if (updateData.content && updateData.authorId) {
      // Validate note data
      const NoteSchema = z.object({
        authorId: z.string(),
        content: z.string(),
        isPrivate: z.boolean().optional(),
        category: z.string().optional(),
      });

      const validationResult = NoteSchema.safeParse(updateData);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid note data', details: validationResult.error.format() },
          { status: 400 }
        );
      }

      const newNote = await salesService.addNote({
        saleId: id,
        ...validationResult.data,
      });
      return NextResponse.json(newNote);
    }
    // Check if this is a task update
    else if (updateData.title && updateData.dueDate) {
      // Validate task data
      const TaskSchema = z.object({
        taskId: z.string().optional(),
        title: z.string(),
        description: z.string(),
        dueDate: z.coerce.date(),
        status: z.string(),
        priority: z.string(),
        assignedToId: z.string(),
        createdById: z.string(),
        notifyBeforeDays: z.number().optional(),
      });

      const validationResult = TaskSchema.safeParse(updateData);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid task data', details: validationResult.error.format() },
          { status: 400 }
        );
      }

      const { taskId, ...taskData } = validationResult.data;
      const task = await salesService.upsertTask({
        id: taskId,
        saleId: id,
        ...taskData,
      });
      return NextResponse.json(task);
    }

    // If we get here, the update type wasn't recognized
    return NextResponse.json(
      { error: 'Unknown update type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in sales PUT handler:', error);
    return NextResponse.json(
      { error: 'Failed to update sale' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for deleting a sale (soft delete)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get ID and reason from the request
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const reason = searchParams.get('reason') || 'No reason provided';
    const updatedById = session.user?.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Sale ID is required' },
        { status: 400 }
      );
    }

    if (!updatedById) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Soft delete the sale
    const result = await salesService.deleteSale(id, updatedById, reason);
    
    return NextResponse.json({
      message: 'Sale cancelled successfully',
      id: result.id,
    });
  } catch (error) {
    console.error('Error in sales DELETE handler:', error);
    return NextResponse.json(
      { error: 'Failed to delete sale' },
      { status: 500 }
    );
  }
}