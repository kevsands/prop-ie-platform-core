/**
 * API Route: /api/transactions
 * Universal Transaction Service API for comprehensive transaction management
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';

interface TransactionRequest {
  type: 'sale' | 'reservation' | 'deposit' | 'completion' | 'customization';
  entityId: string;
  amount: number;
  currency: string;
  description: string;
  participants: string[];
  metadata?: Record<string, any>;
}

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

    const body: TransactionRequest = await request.json();
    
    // Validate required fields
    if (!body.type || !body.entityId || !body.amount || !body.currency) {
      return NextResponse.json(
        { error: 'Missing required fields: type, entityId, amount, currency' },
        { status: 400 }
      );
    }

    // Create comprehensive transaction record
    const transaction = {
      id: `txn_${Date.now()}`,
      type: body.type,
      entityId: body.entityId,
      amount: body.amount,
      currency: body.currency,
      description: body.description,
      status: 'pending',
      participants: body.participants || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      initiatedBy: session.user?.id,
      
      // Transaction workflow
      workflow: {
        currentStage: 'initiated',
        stages: [
          { name: 'initiated', completedAt: new Date().toISOString() },
          { name: 'validation', status: 'pending' },
          { name: 'approval', status: 'pending' },
          { name: 'execution', status: 'pending' },
          { name: 'completion', status: 'pending' }
        ]
      },
      
      // Financial details
      financial: {
        baseAmount: body.amount,
        fees: calculateFees(body.amount, body.type),
        taxes: calculateTaxes(body.amount, body.type),
        totalAmount: body.amount + calculateFees(body.amount, body.type) + calculateTaxes(body.amount, body.type)
      },
      
      // Legal compliance
      compliance: {
        amlChecked: false,
        kycVerified: false,
        sourceOfFunds: 'pending_verification',
        regulatoryApproval: 'pending'
      },
      
      // Document trail
      documents: [],
      
      // Integration points
      integrations: {
        banking: { status: 'pending', provider: null },
        legal: { status: 'pending', provider: null },
        crm: { status: 'synced', lastSync: new Date().toISOString() }
      },
      
      metadata: body.metadata || {}
    };

    return NextResponse.json({
      success: true,
      data: transaction,
      message: 'Transaction initiated successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');
    const entityId = searchParams.get('entityId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // If specific transaction ID requested
    if (transactionId) {
      const transaction = {
        id: transactionId,
        type: 'sale',
        entityId: 'unit_123',
        amount: 425000,
        currency: 'EUR',
        status: 'in_progress',
        workflow: {
          currentStage: 'approval',
          progress: 60,
          estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        financial: {
          baseAmount: 425000,
          fees: 8500,
          taxes: 12750,
          totalAmount: 446250
        },
        participants: ['buyer_456', 'seller_789', 'agent_101'],
        timeline: [
          { event: 'Transaction initiated', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { event: 'Documents submitted', timestamp: new Date(Date.now() - 43200000).toISOString() },
          { event: 'Initial approval received', timestamp: new Date().toISOString() }
        ]
      };

      return NextResponse.json({
        success: true,
        data: transaction
      });
    }

    // Filter transactions
    const transactions = [
      {
        id: 'txn_1',
        type: 'sale',
        entityId: 'unit_123',
        amount: 425000,
        currency: 'EUR',
        status: 'in_progress',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'txn_2',
        type: 'reservation',
        entityId: 'unit_456',
        amount: 25000,
        currency: 'EUR',
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'txn_3',
        type: 'customization',
        entityId: 'unit_123',
        amount: 15000,
        currency: 'EUR',
        status: 'pending',
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ];

    // Apply filters
    let filteredTransactions = transactions;
    if (entityId) {
      filteredTransactions = filteredTransactions.filter(t => t.entityId === entityId);
    }
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    if (status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filteredTransactions,
      count: filteredTransactions.length
    });

  } catch (error) {
    console.error('Error retrieving transactions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve transactions' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');
    
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Update transaction
    const updatedTransaction = {
      id: transactionId,
      ...body,
      updatedAt: new Date().toISOString(),
      version: (body.version || 0) + 1
    };

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully'
    });

  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateFees(amount: number, type: string): number {
  const feeRates = {
    sale: 0.02,      // 2%
    reservation: 0.01, // 1%
    deposit: 0.005,   // 0.5%
    completion: 0.01, // 1%
    customization: 0.015 // 1.5%
  };
  
  return Math.round(amount * (feeRates[type as keyof typeof feeRates] || 0.01));
}

function calculateTaxes(amount: number, type: string): number {
  // Simplified tax calculation - would be more complex in reality
  const taxRates = {
    sale: 0.03,      // 3%
    reservation: 0,   // 0%
    deposit: 0,      // 0%
    completion: 0.01, // 1%
    customization: 0.02 // 2%
  };
  
  return Math.round(amount * (taxRates[type as keyof typeof taxRates] || 0));
}