/**
 * ================================================================================
 * ESCROW MANAGEMENT API
 * Handles escrow account creation, fund management, and conditional releases
 * ================================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { escrowService, EscrowAccount, ConditionType, FundSource, ParticipantRole, EscrowPermission } from '@/services/EscrowService';

interface CreateEscrowRequest {
  transactionId: string;
  propertyId: string;
  propertyPrice: number;
  participants: {
    type: 'buyer' | 'seller' | 'developer' | 'agent' | 'solicitor' | 'lender' | 'platform';
    name: string;
    email: string;
    userId?: string;
    organizationId?: string;
    role: ParticipantRole;
    permissions: EscrowPermission[];
    signatureRequired: boolean;
  }[];
  conditions?: {
    type: ConditionType;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    requiredBy?: string[];
    dueDate?: string;
    documents?: string[];
  }[];
  milestones?: {
    title: string;
    description: string;
    order: number;
    dueDate?: string;
    releaseAmount?: number;
    releasePercentage?: number;
    conditions: string[];
    dependencies?: string[];
    participants?: string[];
  }[];
  metadata?: Record<string, any>;
}

/**
 * GET /api/escrow - Get escrow accounts or specific account details
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const escrowId = searchParams.get('escrow_id');
    const transactionId = searchParams.get('transaction_id');
    const propertyId = searchParams.get('property_id');

    if (escrowId) {
      // Get specific escrow account
      const account = escrowService.getEscrowAccount(escrowId);
      if (!account) {
        return NextResponse.json({
          error: 'Escrow account not found'
        }, { status: 404 });
      }

      const summary = escrowService.getEscrowSummary(escrowId);

      return NextResponse.json({
        account,
        summary,
        message: 'Escrow account retrieved successfully'
      });
    }

    if (transactionId) {
      // Get escrow accounts for a transaction
      const accounts = escrowService.getTransactionEscrows(transactionId);
      
      const accountsWithSummary = accounts.map(account => ({
        account,
        summary: escrowService.getEscrowSummary(account.id)
      }));

      return NextResponse.json({
        accounts: accountsWithSummary,
        count: accounts.length,
        message: 'Transaction escrow accounts retrieved successfully'
      });
    }

    return NextResponse.json({
      error: 'Missing required parameters',
      message: 'Please provide either escrow_id or transaction_id'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Error retrieving escrow data:', error);
    return NextResponse.json({
      error: 'Failed to retrieve escrow data',
      message: error.message
    }, { status: 500 });
  }
}

/**
 * POST /api/escrow - Create new escrow account
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateEscrowRequest = await request.json();

    // Validate required fields
    if (!body.transactionId || !body.propertyId || !body.participants?.length) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'transactionId, propertyId, and participants are required'
      }, { status: 400 });
    }

    // Set up default conditions for property transactions
    const defaultConditions = [
      {
        type: ConditionType.DOCUMENT_UPLOAD,
        title: 'Contract Execution',
        description: 'Signed purchase contract uploaded and verified',
        priority: 'critical' as const,
        requiredBy: ['buyer', 'seller']
      },
      {
        type: ConditionType.TITLE_VERIFICATION,
        title: 'Title Verification',
        description: 'Property title verified by solicitor',
        priority: 'high' as const,
        requiredBy: ['solicitor']
      },
      {
        type: ConditionType.LEGAL_APPROVAL,
        title: 'Legal Clearance',
        description: 'All legal requirements satisfied',
        priority: 'critical' as const,
        requiredBy: ['solicitor']
      }
    ];

    // Set up default milestones
    const defaultMilestones = [
      {
        title: 'Contract Exchange',
        description: 'Legal contracts exchanged between parties',
        order: 1,
        releasePercentage: 0, // No release at this stage
        conditions: [], // Will be populated with condition IDs
        dependencies: [],
        participants: []
      },
      {
        title: 'Pre-Completion Checks',
        description: 'All pre-completion requirements satisfied',
        order: 2,
        releasePercentage: 0,
        conditions: [],
        dependencies: [],
        participants: []
      },
      {
        title: 'Property Completion',
        description: 'Property transaction completed and keys handed over',
        order: 3,
        releasePercentage: 100, // Release all remaining funds
        conditions: [],
        dependencies: [],
        participants: []
      }
    ];

    // Create the escrow account
    const escrowAccount = await escrowService.createEscrowAccount({
      transactionId: body.transactionId,
      propertyId: body.propertyId,
      participants: body.participants,
      conditions: body.conditions || defaultConditions,
      milestones: body.milestones || defaultMilestones,
      metadata: {
        ...body.metadata,
        propertyPrice: body.propertyPrice,
        createdVia: 'api'
      }
    });

    // Generate escrow summary
    const summary = escrowService.getEscrowSummary(escrowAccount.id);

    return NextResponse.json({
      escrowAccount,
      summary,
      message: 'Escrow account created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating escrow account:', error);
    return NextResponse.json({
      error: 'Failed to create escrow account',
      message: error.message
    }, { status: 500 });
  }
}

/**
 * PUT /api/escrow - Update escrow account (conditions, milestones, etc.)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { escrowId, action, ...params } = body;

    if (!escrowId || !action) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'escrowId and action are required'
      }, { status: 400 });
    }

    const account = escrowService.getEscrowAccount(escrowId);
    if (!account) {
      return NextResponse.json({
        error: 'Escrow account not found'
      }, { status: 404 });
    }

    let result;

    switch (action) {
      case 'mark_condition_met':
        if (!params.conditionId || !params.verifiedBy) {
          return NextResponse.json({
            error: 'Missing required fields for condition verification',
            message: 'conditionId and verifiedBy are required'
          }, { status: 400 });
        }
        
        result = await escrowService.markConditionMet({
          escrowId,
          conditionId: params.conditionId,
          verifiedBy: params.verifiedBy,
          documents: params.documents,
          notes: params.notes
        });
        break;

      case 'request_release':
        if (!params.amount || !params.recipient || !params.reason || !params.requestedBy) {
          return NextResponse.json({
            error: 'Missing required fields for release request',
            message: 'amount, recipient, reason, and requestedBy are required'
          }, { status: 400 });
        }
        
        result = await escrowService.requestRelease({
          escrowId,
          amount: params.amount,
          recipient: params.recipient,
          reason: params.reason,
          milestoneId: params.milestoneId,
          fundIds: params.fundIds,
          requestedBy: params.requestedBy
        });
        break;

      case 'approve_release':
        if (!params.releaseId || !params.approvedBy || !params.participantId) {
          return NextResponse.json({
            error: 'Missing required fields for release approval',
            message: 'releaseId, approvedBy, and participantId are required'
          }, { status: 400 });
        }
        
        result = await escrowService.approveRelease({
          escrowId,
          releaseId: params.releaseId,
          approvedBy: params.approvedBy,
          participantId: params.participantId,
          notes: params.notes,
          signature: params.signature
        });
        break;

      default:
        return NextResponse.json({
          error: 'Invalid action',
          message: 'Action must be one of: mark_condition_met, request_release, approve_release'
        }, { status: 400 });
    }

    // Get updated account and summary
    const updatedAccount = escrowService.getEscrowAccount(escrowId);
    const summary = escrowService.getEscrowSummary(escrowId);

    return NextResponse.json({
      result,
      account: updatedAccount,
      summary,
      message: `Escrow ${action.replace('_', ' ')} completed successfully`
    });

  } catch (error: any) {
    console.error(`Error updating escrow account:`, error);
    return NextResponse.json({
      error: `Failed to update escrow account`,
      message: error.message
    }, { status: 500 });
  }
}