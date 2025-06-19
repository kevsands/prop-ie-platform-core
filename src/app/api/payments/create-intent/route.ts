// src/app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

interface PaymentIntentRequest {
  propertyId: string;
  amount: number;
  paymentType: 'reservation' | 'deposit' | 'completion' | 'htb_benefit';
  currency?: string;
  metadata?: Record<string, any>;
}

/**
 * Create Payment Intent API
 * Handles property transaction payment processing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PaymentIntentRequest;
    const { propertyId, amount, paymentType, currency = 'EUR', metadata = {} } = body;

    // Validate required fields
    if (!propertyId || !amount || !paymentType) {
      return NextResponse.json(
        { error: 'Property ID, amount, and payment type are required' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Generate payment intent ID
    const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In development mode, create mock payment intent
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Creating payment intent for property ${propertyId}, amount: €${amount}, type: ${paymentType}`);
      
      const mockPaymentIntent = {
        id: paymentIntentId,
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        status: 'requires_payment_method',
        paymentType,
        propertyId,
        userId: currentUser.id,
        metadata: {
          ...metadata,
          propertyId,
          userId: currentUser.id,
          userEmail: currentUser.email,
          paymentType,
          createdAt: new Date().toISOString()
        },
        clientSecret: `${paymentIntentId}_secret_mock`,
        created: Math.floor(Date.now() / 1000),
        description: `Property ${paymentType} payment for ${propertyId}`,
        nextAction: null,
        paymentMethodTypes: ['card', 'sepa_debit', 'bank_transfer'],
        receiptEmail: currentUser.email,
        setupFutureUsage: paymentType === 'completion' ? 'off_session' : null
      };

      // Store payment intent in development storage (would be database in production)
      // For now, just return the mock intent
      
      return NextResponse.json({
        success: true,
        paymentIntent: mockPaymentIntent,
        clientSecret: mockPaymentIntent.clientSecret,
        message: '[DEV MODE] Mock payment intent created. In production, this would use Stripe.'
      });
    }

    // Production: Create actual Stripe payment intent
    try {
      // This would use actual Stripe SDK in production
      // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: amount * 100, // Convert to cents
      //   currency: currency.toLowerCase(),
      //   metadata: {
      //     propertyId,
      //     userId: currentUser.id,
      //     paymentType,
      //     ...metadata
      //   },
      //   receipt_email: currentUser.email,
      //   description: `Property ${paymentType} payment`,
      //   payment_method_types: ['card', 'sepa_debit'],
      //   setup_future_usage: paymentType === 'completion' ? 'off_session' : undefined
      // });

      // Mock production response for now
      const productionPaymentIntent = {
        id: paymentIntentId,
        amount: amount * 100,
        currency: currency.toLowerCase(),
        status: 'requires_payment_method',
        clientSecret: `${paymentIntentId}_secret_prod`,
        created: Math.floor(Date.now() / 1000),
        description: `Property ${paymentType} payment`,
        metadata: {
          propertyId,
          userId: currentUser.id,
          paymentType,
          ...metadata
        }
      };

      return NextResponse.json({
        success: true,
        paymentIntent: productionPaymentIntent,
        clientSecret: productionPaymentIntent.clientSecret
      });
    } catch (stripeError: any) {
      console.error('Stripe payment intent creation error:', stripeError);
      
      return NextResponse.json(
        { error: 'Failed to create payment intent' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}