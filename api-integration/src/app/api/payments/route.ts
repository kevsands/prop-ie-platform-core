/**
 * ================================================================================
 * PRODUCTION STRIPE PAYMENT API
 * Handles real money transactions for property purchases
 * Replaces test payment endpoint with production-ready implementation
 * ================================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize Stripe with production configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Payment types and their configurations
const PAYMENT_CONFIGS = {
  booking_deposit: {
    amount: 500000, // €5,000 in cents
    description: 'Property Booking Deposit',
    captureMethod: 'automatic' as const,
  },
  contractual_deposit: {
    percentage: 10, // 10% of property value
    description: 'Contractual Deposit',
    captureMethod: 'automatic' as const,
  },
  completion_payment: {
    description: 'Property Completion Payment',
    captureMethod: 'manual' as const, // Requires manual capture after legal completion
  },
  stage_payment: {
    description: 'Property Stage Payment',
    captureMethod: 'automatic' as const,
  },
  upgrade_payment: {
    description: 'Property Upgrade/Customization Payment',
    captureMethod: 'automatic' as const,
  },
};

interface PaymentIntentRequest {
  amount?: number; // Amount in cents
  propertyId: string;
  propertyPrice?: number; // For contractual deposits
  paymentType: keyof typeof PAYMENT_CONFIGS;
  description?: string;
  currency?: string;
  buyerId?: string;
  agentId?: string;
  developerId?: string;
  metadata?: Record<string, string>;
}

/**
 * Calculate platform fee and agent commission
 */
function calculateFees(amount: number, paymentType: string, agentId?: string) {
  const platformFeeRate = parseFloat(process.env.STRIPE_PLATFORM_FEE_PERCENTAGE || '2.5') / 100;
  const agentCommissionRate = parseFloat(process.env.AGENT_COMMISSION_PERCENTAGE || '1.5') / 100;
  
  const platformFee = Math.round(amount * platformFeeRate);
  const agentCommission = agentId ? Math.round(amount * agentCommissionRate) : 0;
  
  return {
    platformFee,
    agentCommission,
    netAmount: amount - platformFee - agentCommission,
  };
}

/**
 * GET /api/payments - Get payment status or list payments
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent_id');
    const propertyId = searchParams.get('property_id');

    if (paymentIntentId) {
      // Get specific payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return NextResponse.json({
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          clientSecret: paymentIntent.client_secret,
          metadata: paymentIntent.metadata,
        },
      });
    }

    if (propertyId) {
      // Get payments for a specific property
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 10,
        expand: ['data.latest_charge'],
      });

      const propertyPayments = paymentIntents.data.filter(
        pi => pi.metadata.propertyId === propertyId
      );

      return NextResponse.json({
        payments: propertyPayments.map(pi => ({
          id: pi.id,
          status: pi.status,
          amount: pi.amount,
          currency: pi.currency,
          paymentType: pi.metadata.paymentType,
          created: pi.created,
          description: pi.description,
        })),
      });
    }

    return NextResponse.json({
      error: 'Missing required parameters',
      message: 'Please provide either payment_intent_id or property_id',
    }, { status: 400 });

  } catch (error: any) {
    console.error('Error retrieving payment:', error);
    return NextResponse.json({
      error: 'Failed to retrieve payment',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/payments - Create payment intent for property transactions
 */
export async function POST(request: NextRequest) {
  try {
    const body: PaymentIntentRequest = await request.json();
    
    const {
      amount: requestedAmount,
      propertyId,
      propertyPrice,
      paymentType,
      description,
      currency = 'eur',
      buyerId,
      agentId,
      developerId,
      metadata = {},
    } = body;

    // Validate required fields
    if (!propertyId || !paymentType) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'propertyId and paymentType are required',
      }, { status: 400 });
    }

    // Validate payment type
    if (!(paymentType in PAYMENT_CONFIGS)) {
      return NextResponse.json({
        error: 'Invalid payment type',
        message: `Payment type must be one of: ${Object.keys(PAYMENT_CONFIGS).join(', ')}`,
      }, { status: 400 });
    }

    const config = PAYMENT_CONFIGS[paymentType];
    
    // Calculate payment amount based on type
    let finalAmount: number;
    
    if (paymentType === 'booking_deposit') {
      finalAmount = config.amount;
    } else if (paymentType === 'contractual_deposit') {
      if (!propertyPrice) {
        return NextResponse.json({
          error: 'Property price required',
          message: 'propertyPrice is required for contractual deposits',
        }, { status: 400 });
      }
      finalAmount = Math.round((propertyPrice * config.percentage!) / 100 * 100); // Convert to cents
    } else {
      if (!requestedAmount) {
        return NextResponse.json({
          error: 'Amount required',
          message: 'amount is required for this payment type',
        }, { status: 400 });
      }
      finalAmount = requestedAmount;
    }

    // Validate amount limits
    const minAmount = 100; // €1.00 minimum
    const maxAmount = 200000000; // €2,000,000 maximum
    
    if (finalAmount < minAmount) {
      return NextResponse.json({
        error: 'Amount too small',
        message: `Minimum payment amount is €${minAmount / 100}`,
      }, { status: 400 });
    }
    
    if (finalAmount > maxAmount) {
      return NextResponse.json({
        error: 'Amount too large',
        message: `Maximum payment amount is €${maxAmount / 100}`,
      }, { status: 400 });
    }

    // Calculate fees and commissions
    const fees = calculateFees(finalAmount, paymentType, agentId);

    // Enhanced metadata for tracking
    const enhancedMetadata = {
      propertyId,
      paymentType,
      buyerId: buyerId || 'anonymous',
      agentId: agentId || 'direct',
      developerId: developerId || 'unknown',
      platformFee: fees.platformFee.toString(),
      agentCommission: fees.agentCommission.toString(),
      netAmount: fees.netAmount.toString(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      ...metadata,
    };

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: currency.toLowerCase(),
      description: description || config.description,
      capture_method: config.captureMethod,
      metadata: enhancedMetadata,
      
      // Enable automatic payment methods
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Keep payment on our site
      },
      
      // Setup for future payments (saves cards for repeat customers)
      setup_future_usage: paymentType === 'booking_deposit' ? 'on_session' : undefined,
      
      // Statement descriptor for bank statements
      statement_descriptor: `PROP.IE ${paymentType.toUpperCase()}`,
      statement_descriptor_suffix: `${propertyId.slice(-7)}`,
      
      // Application fee for Stripe Connect (if agent involved)
      ...(agentId && fees.agentCommission > 0 && {
        application_fee_amount: fees.platformFee + fees.agentCommission,
      }),
    });

    // Log successful payment intent creation
    console.log(`Payment intent created: ${paymentIntent.id}`, {
      propertyId,
      paymentType,
      amount: finalAmount,
      buyerId,
      agentId,
    });

    return NextResponse.json({
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paymentType,
        propertyId,
      },
      fees: {
        subtotal: finalAmount,
        platformFee: fees.platformFee,
        agentCommission: fees.agentCommission,
        total: finalAmount,
      },
      message: 'Payment intent created successfully',
    });

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json({
        error: 'Card error',
        message: error.message,
        code: error.code,
      }, { status: 400 });
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({
        error: 'Invalid request',
        message: error.message,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Payment processing error',
      message: 'Unable to process payment. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * PUT /api/payments - Update payment intent (capture, cancel, etc.)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, action, metadata } = body;

    if (!paymentIntentId || !action) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'paymentIntentId and action are required',
      }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'capture':
        // Capture a manually captured payment (e.g., completion payments)
        result = await stripe.paymentIntents.capture(paymentIntentId);
        break;
        
      case 'cancel':
        // Cancel a payment intent
        result = await stripe.paymentIntents.cancel(paymentIntentId);
        break;
        
      case 'update_metadata':
        // Update payment metadata
        result = await stripe.paymentIntents.update(paymentIntentId, {
          metadata: metadata || {},
        });
        break;
        
      default:
        return NextResponse.json({
          error: 'Invalid action',
          message: 'Action must be one of: capture, cancel, update_metadata',
        }, { status: 400 });
    }

    return NextResponse.json({
      paymentIntent: {
        id: result.id,
        status: result.status,
        amount: result.amount,
        currency: result.currency,
        metadata: result.metadata,
      },
      message: `Payment ${action} completed successfully`,
    });

  } catch (error: any) {
    console.error(`Error ${body.action} payment:`, error);
    return NextResponse.json({
      error: `Failed to ${body.action} payment`,
      message: error.message,
    }, { status: 500 });
  }
}