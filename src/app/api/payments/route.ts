import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { z } from 'zod';

// Webhook schema for payment gateway callbacks
const WebhookSchema = z.object({
  event: z.enum(['payment.succeeded', 'payment.failed', 'payment.refunded']),
  paymentId: z.string(),
  transactionId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  reference: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * GET /api/payments
 * Get payment history for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transactionId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Mock payment history
    let payments = [
      {
        id: 'pay_1',
        transactionId: 'tx_1',
        amount: 5000,
        currency: 'EUR',
        type: 'BOOKING_DEPOSIT',
        status: 'COMPLETED',
        paymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        reference: 'REF-001',
        propertyName: 'Unit A-102, Maple Heights',
        paymentMethod: 'bank_transfer',
      },
      {
        id: 'pay_2',
        transactionId: 'tx_2',
        amount: 35000,
        currency: 'EUR',
        type: 'CONTRACT_DEPOSIT',
        status: 'PROCESSING',
        paymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        reference: 'REF-002',
        propertyName: 'Unit B-205, Oak Gardens',
        paymentMethod: 'credit_card',
      },
    ];

    // Apply filters
    if (status) {
      payments = payments.filter(p => p.status === status);
    }
    if (transactionId) {
      payments = payments.filter(p => p.transactionId === transactionId);
    }

    // Calculate summary
    const summary = {
      totalPaid: payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: payments
        .filter(p => p.status === 'PENDING' || p.status === 'PROCESSING')
        .reduce((sum, p) => sum + p.amount, 0),
      transactionCount: new Set(payments.map(p => p.transactionId)).size,
    };

    return NextResponse.json({ payments, summary });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments/webhook
 * Handle payment gateway webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (implementation depends on payment provider)
    const signature = request.headers.get('x-webhook-signature');
    if (!verifyWebhookSignature(signature, await request.text())) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = WebhookSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      );
    }

    const webhookData = validationResult.data;

    // Process webhook based on event type
    switch (webhookData.event) {
      case 'payment.succeeded':
        await handlePaymentSuccess(webhookData);
        break;
      case 'payment.failed':
        await handlePaymentFailure(webhookData);
        break;
      case 'payment.refunded':
        await handlePaymentRefund(webhookData);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Helper functions

function verifyWebhookSignature(signature: string | null, body: string): boolean {
  // Mock verification - would implement actual signature verification
  return true;
}

async function handlePaymentSuccess(data: z.infer<typeof WebhookSchema>) {
  // Update payment status in database
  // Update transaction milestones
  // Send confirmation emails
  // Trigger any automated workflows
  console.log('Payment succeeded:', data);
}

async function handlePaymentFailure(data: z.infer<typeof WebhookSchema>) {
  // Update payment status
  // Notify user of failure
  // Create retry options
  console.log('Payment failed:', data);
}

async function handlePaymentRefund(data: z.infer<typeof WebhookSchema>) {
  // Update payment status
  // Update transaction status if needed
  // Send refund confirmation
  console.log('Payment refunded:', data);
}