import { NextRequest, NextResponse } from 'next/server';
import { getRepository } from '@/lib/db/repositories/index';
import { logger } from '@/lib/security/auditLogger';
import { Prisma } from '@prisma/client';
import { GetHandler, PatchHandler, IdParam } from '@/types/next-route-handlers';
// Service layer integration
import { projectDataService } from '@/services/ProjectDataService';
import { realTimeDataSyncService } from '@/services/RealTimeDataSyncService';
// Enterprise Authentication
import { Auth } from '@/lib/auth';
import { UserRole } from '@/types/core/user';

/**
 * Enterprise Authentication Function
 * Proper authentication with role-based access control
 */
async function authenticateRequest(
  request: NextRequest, 
  requiredRoles: UserRole[]
): Promise<{
  user?: any;
  error?: boolean;
  response?: NextResponse;
}> {
  try {
    // Extract JWT token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    // In development, allow requests without auth for ease of testing
    // But this should be removed in production
    if (process.env.NODE_ENV === 'development' && !authHeader) {
      console.log('📝 [DEV] No auth header provided, using development user');
      return {
        user: {
          id: 'dev-user-' + Date.now(),
          email: 'developer@prop.ie',
          username: 'developer@prop.ie',
          firstName: 'Development',
          lastName: 'User',
          roles: ['DEVELOPER', 'ADMIN']
        }
      };
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        error: true,
        response: NextResponse.json(
          { error: 'Missing or invalid authorization header. Please include Bearer token.' },
          { status: 401 }
        )
      };
    }
    
    // Verify JWT token and get user
    const token = authHeader.substring(7);
    
    try {
      // Get authenticated user from AWS Amplify Auth
      const user = await Auth.currentAuthenticatedUser();
      
      // Check if user has required roles
      const hasValidRole = requiredRoles.some(role => user.roles.includes(role));
      if (!hasValidRole) {
        return {
          error: true,
          response: NextResponse.json(
            { 
              error: 'Insufficient permissions. Required roles: ' + requiredRoles.join(', '),
              userRoles: user.roles
            },
            { status: 403 }
          )
        };
      }
      
      return { user };
    } catch (authError) {
      return {
        error: true,
        response: NextResponse.json(
          { error: 'Invalid or expired authentication token' },
          { status: 401 }
        )
      };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Authentication verification failed' },
        { status: 500 }
      )
    };
  }
}

/**
 * GET /api/projects/[id]
 * Fetch details for a specific project
 */
export const GET: GetHandler<IdParam> = async (request, { params }) => {
  try {
    // Check authentication with development mode support
    let session = null;
    
    // Development mode bypass
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      session = {
        user: {
          id: 'dev-user-id',
          email: 'dev@prop.ie',
          name: 'Development User'
        }
      };
    } else {
      session = await getServerSession(authOptions);
    }
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // Development mode: Use UnifiedProjectService for enterprise data consistency
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 [DEV] Fetching project via UnifiedProjectService:', id);
      
      // Import UnifiedProjectService dynamically to ensure fresh instance
      const { unifiedProjectService } = await import('@/services/UnifiedProjectService');
      const project = await unifiedProjectService.getProject(id);
      
      if (!project) {
        return NextResponse.json(
          { error: 'Development not found' },
          { status: 404 }
        );
      }
      
      console.log('✅ Project found via UnifiedProjectService:', project.name, `(${project.units?.length || 0} units)`);
      return NextResponse.json({ success: true, data: project });
    }
    
    // Production mode: Use database repository
    try {
      const developmentRepository = getRepository('development');
      
      // Get development with related data
      const development = await developmentRepository.findWithFullDetails(id);
      
      if (!development) {
        return NextResponse.json(
          { error: 'Development not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: development });
    } catch (dbError) {
      console.log('Database fetch failed, falling back to UnifiedProjectService');
      
      // Import UnifiedProjectService dynamically
      const { unifiedProjectService } = await import('@/services/UnifiedProjectService');
      const project = await unifiedProjectService.getProject(id);
      
      if (!project) {
        return NextResponse.json(
          { error: 'Development not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: project });
    }
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
    // Check authentication with development mode support
    let session = null;
    
    // Development mode bypass
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      session = {
        user: {
          id: 'dev-user-id',
          email: 'dev@prop.ie',
          name: 'Development User'
        }
      };
      console.log('🔧 [DEV] Using mock authentication for API route');
    } else {
      session = await getServerSession(authOptions);
    }
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
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
    
    // Development mode: Use service layer as primary, database as backup
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 [DEV] Processing unit update via service layer', { unitId, updates });
      
      // Get current unit from service
      const currentUnit = projectDataService.getUnitById(projectId, unitId);
      if (!currentUnit) {
        return NextResponse.json(
          { error: 'Unit not found' },
          { status: 404 }
        );
      }
      
      // Build comprehensive update data
      const updateData = {
        // Preserve existing ID and basic structure
        id: currentUnit.id,
        number: updates.number || currentUnit.number,
        type: updates.type || currentUnit.type,
        status: updates.status || currentUnit.status,
        
        // Update features
        features: {
          ...currentUnit.features,
          bedrooms: updates.features?.bedrooms ?? currentUnit.features?.bedrooms,
          bathrooms: updates.features?.bathrooms ?? currentUnit.features?.bathrooms,
          sqft: updates.features?.sqft ?? currentUnit.features?.sqft,
          building: updates.features?.building ?? currentUnit.features?.building,
          floor: currentUnit.features?.floor
        },
        
        // Update pricing
        pricing: {
          ...currentUnit.pricing,
          basePrice: updates.pricing?.basePrice ?? currentUnit.pricing?.basePrice,
          currentPrice: updates.pricing?.currentPrice ?? currentUnit.pricing?.currentPrice
        },
        
        // Update buyer information if provided
        buyer: updates.buyer ? {
          name: updates.buyer.name,
          email: updates.buyer.email,
          phone: updates.buyer.phone,
          solicitor: updates.buyer.solicitor
        } : currentUnit.buyer,
        
        // Preserve other existing data
        reservationDate: currentUnit.reservationDate,
        saleDate: currentUnit.saleDate,
        images: currentUnit.images,
        floorPlan: currentUnit.floorPlan
      };
      
      // Update via service layer
      const success = projectDataService.updateUnit(projectId, unitId, updateData);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update unit in service layer' },
          { status: 500 }
        );
      }
      
      // Get updated unit
      const updatedUnit = projectDataService.getUnitById(projectId, unitId);
      
      // Enterprise audit logging
      logger.info('Unit updated via API', {
        projectId,
        unitId,
        updates: Object.keys(updates),
        updatedBy: session.user?.email || 'development-user',
        timestamp: new Date().toISOString()
      });
      
      // Real-time sync broadcast
      realTimeDataSyncService.broadcastUnitUpdate(
        projectId,
        unitId,
        updateData,
        session.user?.email || 'development-user'
      );
      
      console.log('✅ Unit updated successfully via service layer:', updatedUnit?.number);
      
      return NextResponse.json({ 
        success: true, 
        data: updatedUnit,
        message: `Unit ${updatedUnit?.number} updated successfully`
      });
    }
    
    // Production mode: Use database repository
    try {
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
    } catch (dbError) {
      console.log('Database update failed, falling back to service layer');
      // Fallback to service layer implementation above
      return handleUnitUpdate(projectId, body, session);
    }
    
  } catch (error) {
    logger.error('Error updating unit:', { error: error instanceof Error ? error.message : error });
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