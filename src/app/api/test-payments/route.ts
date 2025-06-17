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

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      return NextResponse.json({
        success: false,
        error: 'Payment service not configured. Please set STRIPE_SECRET_KEY environment variable.',
        code: 'STRIPE_NOT_CONFIGURED'
      }, { status: 503 });
    }

    const { amount, currency = 'eur', description = 'Property payment', propertyId, paymentType } = await request.json();

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      description: description,
      metadata: {
        propertyId: propertyId || 'test-property',
        paymentType: paymentType || 'booking_deposit',
        platform: 'propie',
        environment: 'test'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata
    });

  } catch (error: any) {
    console.error('Payment intent creation failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          type: error.type || 'api_error',
          code: error.code
        }
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Stripe Payment Test API is running',
    stripe_configured: !!process.env.STRIPE_SECRET_KEY,
    test_mode: process.env.STRIPE_SECRET_KEY?.includes('sk_test_') || false
  });
}