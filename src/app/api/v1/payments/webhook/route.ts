/**
 * Stripe Webhook Handler
 * /api/v1/payments/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { paymentProcessor } from '@/lib/transaction-engine/payment-processor';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    // Get the webhook signature from headers
    const sig = request.headers.get('stripe-signature');
    if (!sig) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    // Get raw body
    const body = await request.text();

    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

  } catch (error: any) {

    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    // Handle the event
    await paymentProcessor.handleStripeWebhook(event);

    return NextResponse.json({ received: true });

  } catch (error: any) {

    return NextResponse.json(
      { error: 'Failed to handle webhook event' },
      { status: 500 }
    );
  }
}