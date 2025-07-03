import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/security/auditLogger';

/**
 * Unified Buyer Experience Synchronization API
 * Ensures data consistency across /journey, /documents, /verification, and /overview
 */

interface BuyerSyncData {
  // Journey Progress
  journeyStage: string;
  journeyProgress: number;
  completedTasks: string[];
  nextTasks: string[];
  
  // Document Status  
  documentsUploaded: number;
  documentsVerified: number;
  documentsPending: number;
  totalDocuments: number;
  
  // Verification Status
  verificationStage: 'pending' | 'in_progress' | 'completed' | 'rejected';
  identityVerified: boolean;
  financialVerified: boolean;
  addressVerified: boolean;
  
  // Buyer Overview Metrics
  budget: number;
  preApprovalAmount: number;
  htbBenefit: number;
  savedProperties: number;
  
  // Cross-platform integrations
  propChoiceSelections: number;
  propChoiceValue: number;
  
  // System metadata
  lastSyncedAt: string;
  syncVersion: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const buyerId = session.user.email;
    
    // Log the sync request
    logger.info('Buyer sync data requested', {
      buyerId,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // In a real implementation, this would query the database
    // For now, we'll return consistent mock data across all buyer pages
    const syncData: BuyerSyncData = {
      // Journey Progress
      journeyStage: 'document_verification',
      journeyProgress: 65,
      completedTasks: [
        'budget-calculation',
        'htb-eligibility',
        'pre-approval-application',
        'identity-upload',
        'income-documentation'
      ],
      nextTasks: [
        'address-verification',
        'bank-statements',
        'property-search'
      ],
      
      // Document Status
      documentsUploaded: 8,
      documentsVerified: 5,
      documentsPending: 3,
      totalDocuments: 12,
      
      // Verification Status  
      verificationStage: 'in_progress',
      identityVerified: true,
      financialVerified: false,
      addressVerified: false,
      
      // Buyer Overview Metrics
      budget: 425000,
      preApprovalAmount: 350000,
      htbBenefit: 42500,
      savedProperties: 12,
      
      // Cross-platform integrations
      propChoiceSelections: 3,
      propChoiceValue: 8750,
      
      // System metadata
      lastSyncedAt: new Date().toISOString(),
      syncVersion: '2.1.0'
    };

    // Log successful sync
    logger.info('Buyer sync data provided', {
      buyerId,
      journeyProgress: syncData.journeyProgress,
      documentsVerified: syncData.documentsVerified,
      verificationStage: syncData.verificationStage
    });

    return NextResponse.json({
      success: true,
      data: syncData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Buyer sync API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to sync buyer data'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const buyerId = session.user.email;
    const updateData = await request.json();
    
    // Log the sync update
    logger.info('Buyer sync data update', {
      buyerId,
      updateFields: Object.keys(updateData),
      timestamp: new Date().toISOString()
    });

    // In a real implementation, this would update the database
    // and trigger real-time updates across all buyer pages
    
    // Validate update data
    const allowedFields = [
      'journeyStage',
      'journeyProgress', 
      'completedTasks',
      'documentsUploaded',
      'documentsVerified',
      'verificationStage',
      'identityVerified',
      'financialVerified',
      'addressVerified',
      'budget',
      'preApprovalAmount',
      'savedProperties',
      'propChoiceSelections',
      'propChoiceValue'
    ];

    const updates = Object.keys(updateData).filter(key => 
      allowedFields.includes(key)
    );

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Simulate successful update
    const updatedData = {
      ...updateData,
      lastSyncedAt: new Date().toISOString(),
      syncVersion: '2.1.0'
    };

    logger.info('Buyer sync data updated successfully', {
      buyerId,
      updatedFields: updates
    });

    return NextResponse.json({
      success: true,
      message: 'Buyer data synchronized successfully',
      updatedFields: updates,
      data: updatedData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Buyer sync update error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to update buyer sync data'
      },
      { status: 500 }
    );
  }
}

// Real-time sync endpoint for live updates
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { field, value } = await request.json();
    const buyerId = session.user.email;

    // Log the real-time update
    logger.info('Real-time buyer sync update', {
      buyerId,
      field,
      value,
      timestamp: new Date().toISOString()
    });

    // In a real implementation, this would:
    // 1. Update the specific field in the database
    // 2. Trigger WebSocket updates to all open buyer pages
    // 3. Update related systems (notifications, analytics, etc.)

    return NextResponse.json({
      success: true,
      message: `${field} updated successfully`,
      field,
      value,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Real-time buyer sync error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Failed to process real-time update' },
      { status: 500 }
    );
  }
}