import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with proper error handling
let stripe: Stripe | null = null;

try {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && stripeKey !== 'your_stripe_secret_key_here') {
    stripe = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }
} catch (error) {
  console.warn('Stripe initialization failed:', error);
}

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // Check if Stripe is properly initialized
  if (!stripe) {
    return NextResponse.json({
      error: 'Payment service not configured. Please set STRIPE_SECRET_KEY environment variable.',
      code: 'STRIPE_NOT_CONFIGURED'
    }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !endpointSecret) {
    console.error('Missing stripe signature or webhook secret');
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  console.log(`🔔 Webhook received: ${event.type}`);
  
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;
        
      case 'payment_intent.created':
        const createdPayment = event.data.object as Stripe.PaymentIntent;
        console.log(`💳 Payment intent created: ${createdPayment.id}`);
        break;
        
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { metadata } = paymentIntent;
  
  console.log('✅ Payment succeeded:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    propertyId: metadata.propertyId,
    paymentType: metadata.paymentType,
  });

  // Here you would typically:
  // 1. Update your database with payment status
  // 2. Send confirmation emails
  // 3. Update property reservation status
  // 4. Trigger next steps in your workflow
  
  // Example: Log payment for property
  if (metadata.propertyId && metadata.paymentType) {
    console.log(`🏠 Property ${metadata.propertyId}: ${metadata.paymentType} payment of €${paymentIntent.amount / 100} completed`);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { metadata } = paymentIntent;
  
  console.log('❌ Payment failed:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    propertyId: metadata.propertyId,
    paymentType: metadata.paymentType,
    lastPaymentError: paymentIntent.last_payment_error?.message,
  });

  // Here you would typically:
  // 1. Log the failure
  // 2. Send notification to customer
  // 3. Release any held reservations
  // 4. Update payment status in database
}

export async function GET() {
  return NextResponse.json({
    message: 'Stripe webhook endpoint is active',
    webhook_configured: !!endpointSecret,
    supported_events: [
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'payment_intent.created'
    ]
  });
}