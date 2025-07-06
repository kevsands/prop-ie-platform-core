import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getRepository } from '@/lib/db/repositories/index';
import { logger } from '@/lib/security/auditLogger';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { GetHandler, PatchHandler, IdParam } from '@/types/next-route-handlers';

/**
 * GET /api/projects/[id]
 * Fetch details for a specific project
 */
export const GET: GetHandler<IdParam> = async (request, { params }) => {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = params.id;
    
    // Get repository
    const developmentRepository = getRepository('development');
    
    // Get development with related data
    const development = await developmentRepository.findWithFullDetails(id);
    
    if (!development) {
      return NextResponse.json(
        { error: 'Development not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: development });
  } catch (error) {
    logger.error('Error fetching development details:', { error });
    return NextResponse.json(
      { error: 'Failed to fetch development details' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]
 * Update details for a specific project or handle unit-specific operations
 */
export const PATCH: PatchHandler<IdParam> = async (request, { params }) => {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = params.id;
    const body = await request.json();
    
    // Handle different types of updates based on the request body
    if (body.type === 'unit_status_update') {
      return handleUnitStatusUpdate(id, body, session);
    } else if (body.type === 'unit_price_update') {
      return handleUnitPriceUpdate(id, body, session);
    } else if (body.type === 'unit_update') {
      return handleUnitUpdate(id, body, session);
    } else if (body.type === 'bulk_unit_update') {
      return handleBulkUnitUpdate(id, body, session);
    } else if (body.type === 'buyer_assignment') {
      return handleBuyerAssignment(id, body, session);
    } else {
      // Default project update
      const updates = body as Prisma.DevelopmentUpdateInput;
      const developmentRepository = getRepository('development');
      const updatedDevelopment = await developmentRepository.update(id, updates);
      
      if (!updatedDevelopment) {
        return NextResponse.json(
          { error: 'Development not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: updatedDevelopment });
    }
  } catch (error) {
    logger.error('Error updating development:', { error });
    return NextResponse.json(
      { error: 'Failed to update development' },
      { status: 500 }
    );
  }
}

/**
 * Handle unit status updates
 */
async function handleUnitStatusUpdate(projectId: string, body: any, session: any) {
  try {
    const { unitId, status, reason } = body;
    const unitRepository = getRepository('unit');
    
    // Update unit status
    const updatedUnit = await unitRepository.updateStatus(unitId, status, {
      reason,
      updatedBy: session.user.id,
      updatedAt: new Date()
    });
    
    if (!updatedUnit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }
    
    // Log the update
    logger.info('Unit status updated', {
      projectId,
      unitId,
      oldStatus: updatedUnit.previousStatus,
      newStatus: status,
      updatedBy: session.user.email,
      reason
    });
    
    return NextResponse.json({ 
      success: true, 
      data: updatedUnit,
      message: `Unit ${updatedUnit.number} status updated to ${status}`
    });
  } catch (error) {
    logger.error('Error updating unit status:', { error });
    return NextResponse.json(
      { error: 'Failed to update unit status' },
      { status: 500 }
    );
  }
}

/**
 * Handle unit price updates
 */
async function handleUnitPriceUpdate(projectId: string, body: any, session: any) {
  try {
    const { unitId, newPrice, reason } = body;
    const unitRepository = getRepository('unit');
    
    // Update unit price
    const updatedUnit = await unitRepository.updatePrice(unitId, newPrice, {
      reason,
      updatedBy: session.user.id,
      updatedAt: new Date()
    });
    
    if (!updatedUnit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }
    
    // Log the update
    logger.info('Unit price updated', {
      projectId,
      unitId,
      oldPrice: updatedUnit.previousPrice,
      newPrice,
      updatedBy: session.user.email,
      reason
    });
    
    return NextResponse.json({ 
      success: true, 
      data: updatedUnit,
      message: `Unit ${updatedUnit.number} price updated to €${newPrice.toLocaleString()}`
    });
  } catch (error) {
    logger.error('Error updating unit price:', { error });
    return NextResponse.json(
      { error: 'Failed to update unit price' },
      { status: 500 }
    );
  }
}

/**
 * Handle comprehensive unit updates
 */
async function handleUnitUpdate(projectId: string, body: any, session: any) {
  try {
    const { unitId, updates } = body;
    const unitRepository = getRepository('unit');
    
    // Update unit with all provided data
    const updatedUnit = await unitRepository.update(unitId, {
      ...updates,
      updatedBy: session.user.id,
      updatedAt: new Date()
    });
    
    if (!updatedUnit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }
    
    // Log the update
    logger.info('Unit updated', {
      projectId,
      unitId,
      updates: Object.keys(updates),
      updatedBy: session.user.email
    });
    
    return NextResponse.json({ 
      success: true, 
      data: updatedUnit,
      message: `Unit ${updatedUnit.number} updated successfully`
    });
  } catch (error) {
    logger.error('Error updating unit:', { error });
    return NextResponse.json(
      { error: 'Failed to update unit' },
      { status: 500 }
    );
  }
}

/**
 * Handle bulk unit updates
 */
async function handleBulkUnitUpdate(projectId: string, body: any, session: any) {
  try {
    const { unitIds, operation, value, reason } = body;
    const unitRepository = getRepository('unit');
    
    let updatedUnits = [];
    
    if (operation === 'status_update') {
      updatedUnits = await unitRepository.bulkUpdateStatus(unitIds, value, {
        reason,
        updatedBy: session.user.id,
        updatedAt: new Date()
      });
    } else if (operation === 'price_update') {
      updatedUnits = await unitRepository.bulkUpdatePrice(unitIds, value, {
        reason,
        updatedBy: session.user.id,
        updatedAt: new Date()
      });
    }
    
    // Log the bulk update
    logger.info('Bulk unit update', {
      projectId,
      unitCount: unitIds.length,
      operation,
      value,
      updatedBy: session.user.email,
      reason
    });
    
    return NextResponse.json({ 
      success: true, 
      data: updatedUnits,
      message: `${updatedUnits.length} units updated successfully`
    });
  } catch (error) {
    logger.error('Error in bulk unit update:', { error });
    return NextResponse.json(
      { error: 'Failed to update units' },
      { status: 500 }
    );
  }
}

/**
 * Handle buyer assignment to units
 */
async function handleBuyerAssignment(projectId: string, body: any, session: any) {
  try {
    const { unitId, buyerData } = body;
    const unitRepository = getRepository('unit');
    
    // Assign buyer to unit
    const updatedUnit = await unitRepository.assignBuyer(unitId, buyerData, {
      assignedBy: session.user.id,
      assignedAt: new Date()
    });
    
    if (!updatedUnit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }
    
    // Log the assignment
    logger.info('Buyer assigned to unit', {
      projectId,
      unitId,
      buyerName: buyerData.name,
      buyerEmail: buyerData.email,
      assignedBy: session.user.email
    });
    
    return NextResponse.json({ 
      success: true, 
      data: updatedUnit,
      message: `Buyer ${buyerData.name} assigned to unit ${updatedUnit.number}`
    });
  } catch (error) {
    logger.error('Error assigning buyer:', { error });
    return NextResponse.json(
      { error: 'Failed to assign buyer' },
      { status: 500 }
    );
  }
}