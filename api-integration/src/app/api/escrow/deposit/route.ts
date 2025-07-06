/**
 * ================================================================================
 * ESCROW DEPOSIT API
 * Handles fund deposits into escrow accounts with payment processing integration
 * ================================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { escrowService, FundSource } from '@/services/EscrowService';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

interface DepositRequest {
  escrowId: string;
  amount: number;
  currency?: string;
  source: FundSource;
  depositedBy: string;
  paymentMethod: string;
  purpose: string;
  releaseConditions?: string[];
  stripePaymentIntentId?: string;
  metadata?: Record<string, any>;
}

/**
 * POST /api/escrow/deposit - Deposit funds into escrow account
 */
export async function POST(request: NextRequest) {
  try {
    const body: DepositRequest = await request.json();

    // Validate required fields
    if (!body.escrowId || !body.amount || !body.source || !body.depositedBy || !body.purpose) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'escrowId, amount, source, depositedBy, and purpose are required'
      }, { status: 400 });
    }

    // Validate escrow account exists
    const escrowAccount = escrowService.getEscrowAccount(body.escrowId);
    if (!escrowAccount) {
      return NextResponse.json({
        error: 'Escrow account not found'
      }, { status: 404 });
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json({
        error: 'Invalid amount',
        message: 'Amount must be greater than 0'
      }, { status: 400 });
    }

    // If Stripe payment intent is provided, verify it
    let paymentReference = body.stripePaymentIntentId;
    if (body.stripePaymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(body.stripePaymentIntentId);
        
        // Verify payment is successful
        if (paymentIntent.status !== 'succeeded') {
          return NextResponse.json({
            error: 'Payment not completed',
            message: `Payment status is ${paymentIntent.status}. Please complete payment first.`
          }, { status: 400 });
        }

        // Verify amount matches
        if (paymentIntent.amount !== body.amount) {
          return NextResponse.json({
            error: 'Amount mismatch',
            message: 'Payment amount does not match deposit amount'
          }, { status: 400 });
        }

        paymentReference = paymentIntent.id;
      } catch (stripeError: any) {
        return NextResponse.json({
          error: 'Payment verification failed',
          message: stripeError.message
        }, { status: 400 });
      }
    }

    // Deposit funds into escrow
    const deposit = await escrowService.depositFunds({
      escrowId: body.escrowId,
      amount: body.amount,
      currency: body.currency || 'EUR',
      source: body.source,
      depositedBy: body.depositedBy,
      paymentMethod: body.paymentMethod,
      paymentReference,
      stripePaymentIntentId: body.stripePaymentIntentId,
      purpose: body.purpose,
      releaseConditions: body.releaseConditions,
      metadata: {
        ...body.metadata,
        depositedVia: 'api',
        timestamp: new Date().toISOString()
      }
    });

    // Get updated escrow account and summary
    const updatedAccount = escrowService.getEscrowAccount(body.escrowId);
    const summary = escrowService.getEscrowSummary(body.escrowId);

    // Log the deposit for audit trail
    console.log(`Escrow deposit completed:`, {
      escrowId: body.escrowId,
      amount: body.amount,
      source: body.source,
      depositedBy: body.depositedBy,
      paymentReference
    });

    return NextResponse.json({
      deposit,
      account: updatedAccount,
      summary,
      message: 'Funds deposited successfully into escrow'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error depositing funds into escrow:', error);
    return NextResponse.json({
      error: 'Failed to deposit funds',
      message: error.message
    }, { status: 500 });
  }
}

/**
 * GET /api/escrow/deposit - Get deposit history for an escrow account
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const escrowId = searchParams.get('escrow_id');

    if (!escrowId) {
      return NextResponse.json({
        error: 'Missing required parameter',
        message: 'escrow_id is required'
      }, { status: 400 });
    }

    const escrowAccount = escrowService.getEscrowAccount(escrowId);
    if (!escrowAccount) {
      return NextResponse.json({
        error: 'Escrow account not found'
      }, { status: 404 });
    }

    // Get all deposits (funds) for this escrow account
    const deposits = escrowAccount.funds.map(fund => ({
      id: fund.id,
      amount: fund.amount,
      currency: fund.currency,
      source: fund.source,
      depositedBy: fund.depositedBy,
      depositedAt: fund.depositedAt,
      status: fund.status,
      paymentMethod: fund.paymentMethod,
      paymentReference: fund.paymentReference,
      purpose: fund.purpose,
      metadata: fund.metadata
    }));

    // Calculate deposit statistics
    const stats = {
      totalDeposited: deposits.reduce((sum, d) => sum + d.amount, 0),
      totalDeposits: deposits.length,
      depositsBySource: deposits.reduce((acc, d) => {
        acc[d.source] = (acc[d.source] || 0) + d.amount;
        return acc;
      }, {} as Record<string, number>),
      depositsByStatus: deposits.reduce((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      deposits,
      stats,
      escrowId,
      message: 'Deposit history retrieved successfully'
    });

  } catch (error: any) {
    console.error('Error retrieving deposit history:', error);
    return NextResponse.json({
      error: 'Failed to retrieve deposit history',
      message: error.message
    }, { status: 500 });
  }
}