// src/app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';
import { PaymentType, PaymentMethod, validatePaymentAmount } from '@/lib/payment-config';

interface PaymentIntentRequest {
  propertyId: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod?: PaymentMethod;
  currency?: string;
  metadata?: Record<string, any>;
  personalDetails?: {
    fullName: string;
    email: string;
    phone: string;
  };
  journeyId?: string;
  appointmentDate?: string;
  escrowRequired?: boolean;
}

/**
 * Create Payment Intent API
 * Handles property transaction payment processing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PaymentIntentRequest;
    const { 
      propertyId, 
      amount, 
      paymentType, 
      paymentMethod,
      currency = 'EUR', 
      metadata = {},
      personalDetails,
      journeyId,
      appointmentDate,
      escrowRequired = false
    } = body;

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

    // Validate payment type is a valid enum value
    if (!Object.values(PaymentType).includes(paymentType)) {
      return NextResponse.json(
        { error: `Invalid payment type. Must be one of: ${Object.values(PaymentType).join(', ')}` },
        { status: 400 }
      );
    }

    // Get property details for validation (assuming property price is available)
    const propertyPrice = metadata.propertyPrice || amount;
    const paymentValidation = validatePaymentAmount(paymentType, amount, propertyPrice);
    
    if (!paymentValidation.isValid) {
      return NextResponse.json(
        { error: `Payment validation failed: ${paymentValidation.error}` },
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
          paymentMethod: paymentMethod || 'not_specified',
          personalDetails: personalDetails ? JSON.stringify(personalDetails) : null,
          journeyId,
          appointmentDate,
          escrowRequired: escrowRequired.toString(),
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