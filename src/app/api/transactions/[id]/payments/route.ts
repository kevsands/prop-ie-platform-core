import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth.config';
import { z } from 'zod';

// Payment schema
const PaymentSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['BOOKING_DEPOSIT', 'CONTRACT_DEPOSIT', 'STAGE_PAYMENT', 'FINAL_PAYMENT']),
  dueDate: z.string().datetime(),
  paymentMethod: z.enum(['bank_transfer', 'credit_card', 'debit_card', 'cash']).optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * GET /api/transactions/[id]/payments
 * Get all payments for a transaction
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Mock payment data - would be fetched from payment service/database
    const payments = [
      {
        id: 'pay_1',
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
      },
      {
        id: 'pay_2',
        transactionId: params.id,
        amount: 35000,
        currency: 'EUR',
        type: 'CONTRACT_DEPOSIT',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'pay_3',
        transactionId: params.id,
        amount: 120000,
        currency: 'EUR',
        type: 'STAGE_PAYMENT',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'pay_4',
        transactionId: params.id,
        amount: 190000,
        currency: 'EUR',
        type: 'FINAL_PAYMENT',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions/[id]/payments
 * Create a new payment for a transaction
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const validationResult = PaymentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const paymentData = validationResult.data;

    // Mock payment creation - would integrate with payment service
    const newPayment = {
      id: `pay_${Date.now()}`,
      transactionId: params.id,
      ...paymentData,
      currency: 'EUR',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      createdBy: session.user?.id,
    };

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}