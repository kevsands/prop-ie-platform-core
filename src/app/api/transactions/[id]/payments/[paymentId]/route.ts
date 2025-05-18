import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/auth.config';
import { z } from 'zod';

// Payment update schema
const PaymentUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  paidDate: z.string().datetime().optional(),
  reference: z.string().optional(),
  paymentMethod: z.enum(['bank_transfer', 'credit_card', 'debit_card', 'cash']).optional(),
  notes: z.string().optional(),
});

/**
 * GET /api/transactions/[id]/payments/[paymentId]
 * Get a specific payment
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Mock payment retrieval - would fetch from database
    const payment = {
      id: params.paymentId,
      transactionId: params.id,
      amount: 5000,
      currency: 'EUR',
      type: 'BOOKING_DEPOSIT',
      status: 'COMPLETED',
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      paidBy: session.user?.id,
      reference: 'REF-001',
      paymentMethod: 'bank_transfer',
      receiptUrl: '/api/transactions/payments/receipt/REF-001',
    };

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/transactions/[id]/payments/[paymentId]
 * Update a payment status or details
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = PaymentUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Mock payment update - would update in database
    const updatedPayment = {
      id: params.paymentId,
      transactionId: params.id,
      amount: 5000,
      currency: 'EUR',
      type: 'BOOKING_DEPOSIT',
      status: updateData.status || 'COMPLETED',
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: updateData.paidDate || new Date().toISOString(),
      paidBy: session.user?.id,
      reference: updateData.reference || 'REF-001',
      paymentMethod: updateData.paymentMethod || 'bank_transfer',
      updatedAt: new Date().toISOString(),
      updatedBy: session.user?.id,
    };

    // If payment is marked as completed, trigger notifications
    if (updateData.status === 'COMPLETED') {
      // TODO: Notify relevant parties
      // TODO: Update transaction milestones
      // TODO: Generate receipt
    }

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/transactions/[id]/payments/[paymentId]
 * Cancel a pending payment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if payment can be cancelled (only pending payments)
    // Mock implementation - would check in database
    const paymentStatus = 'PENDING';

    if (paymentStatus !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending payments can be cancelled' },
        { status: 400 }
      );
    }

    // Mock cancellation
    return NextResponse.json({
      message: 'Payment cancelled successfully',
      paymentId: params.paymentId,
    });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel payment' },
      { status: 500 }
    );
  }
}