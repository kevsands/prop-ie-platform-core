/**
 * ================================================================================
 * PRODUCTION STRIPE WEBHOOK HANDLER
 * Processes real payment events for property transactions
 * Handles payment confirmations, failures, and state updates
 * ================================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with production configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Handle incoming Stripe webhook events
 */
export async function POST(request: NextRequest) {

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

  try {
    // Import database services dynamically to avoid issues
    const { prisma } = await import('@/lib/prisma');
    const { paymentsService } = await import('@/lib/services/payments-postgresql');
    
    // 1. Create payment record in database
    const paymentRecord = await paymentsService.createPayment({
      stripePaymentIntentId: paymentIntent.id,
      propertyId: metadata.propertyId || '',
      buyerId: metadata.buyerId || '',
      agentId: metadata.agentId !== 'direct' ? metadata.agentId : undefined,
      paymentType: metadata.paymentType as any,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency.toUpperCase(),
      status: 'completed',
      platformFee: parseInt(metadata.platformFee || '0'),
      agentCommission: parseInt(metadata.agentCommission || '0'),
      netAmount: parseInt(metadata.netAmount || '0'),
      stripeChargeId: paymentIntent.latest_charge as string,
      metadata: {
        stripeEventId: paymentIntent.id,
        paymentMethod: 'card',
        processedAt: new Date().toISOString(),
      }
    });

    // 2. Update property reservation status based on payment type
    if (metadata.propertyId && metadata.paymentType) {
      const propertyId = metadata.propertyId;
      
      switch (metadata.paymentType) {
        case 'booking_deposit':
          // Mark property as reserved
          await prisma.property.updateMany({
            where: { id: propertyId },
            data: { 
              status: 'reserved',
              reservedAt: new Date(),
              reservedBy: metadata.buyerId || 'unknown'
            }
          });
          break;
          
        case 'contractual_deposit':
          // Mark property as under contract
          await prisma.property.updateMany({
            where: { id: propertyId },
            data: { 
              status: 'under_contract',
              contractSignedAt: new Date()
            }
          });
          break;
          
        case 'completion_payment':
          // Mark property as sold
          await prisma.property.updateMany({
            where: { id: propertyId },
            data: { 
              status: 'sold',
              soldAt: new Date(),
              soldTo: metadata.buyerId || 'unknown'
            }
          });
          break;
      }
    }

    // 3. Update HTB claim if this is an HTB-related payment
    if (metadata.buyerId) {
      try {
        const { htbService } = await import('@/lib/services/htb-postgresql');
        const claims = await htbService.getClaimsByBuyer(metadata.buyerId);
        
        if (claims.length > 0) {
          const activeClaim = claims.find(c => c.status === 'approved' || c.status === 'processing');
          if (activeClaim) {
            await htbService.updateClaim(activeClaim.id, {
              status: metadata.paymentType === 'completion_payment' ? 'claimed' : 'processing',
              paymentReceived: true,
              paymentAmount: paymentIntent.amount,
              notes: `Payment received: ${metadata.paymentType} - €${paymentIntent.amount / 100}`
            });
          }
        }
      } catch (htbError) {
        console.warn('HTB update failed (non-critical):', htbError);
      }
    }

    // 4. Log successful payment processing
    console.log(`🏠 Property ${metadata.propertyId}: ${metadata.paymentType} payment of €${paymentIntent.amount / 100} completed and recorded`);
    
    return paymentRecord;
    
  } catch (error) {
    console.error('Failed to process payment success:', error);
    // Don't throw - webhook should still return 200 to Stripe
    // But log the issue for manual follow-up
    console.error(`🚨 CRITICAL: Payment ${paymentIntent.id} succeeded but database update failed. Manual reconciliation required.`);
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

  try {
    // Import database services dynamically
    const { prisma } = await import('@/lib/prisma');
    const { paymentsService } = await import('@/lib/services/payments-postgresql');
    
    // 1. Record failed payment in database
    await paymentsService.createPayment({
      stripePaymentIntentId: paymentIntent.id,
      propertyId: metadata.propertyId || '',
      buyerId: metadata.buyerId || '',
      agentId: metadata.agentId !== 'direct' ? metadata.agentId : undefined,
      paymentType: metadata.paymentType as any,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency.toUpperCase(),
      status: 'failed',
      platformFee: parseInt(metadata.platformFee || '0'),
      agentCommission: parseInt(metadata.agentCommission || '0'),
      netAmount: parseInt(metadata.netAmount || '0'),
      failureReason: paymentIntent.last_payment_error?.message || 'Unknown error',
      metadata: {
        stripeEventId: paymentIntent.id,
        failureCode: paymentIntent.last_payment_error?.code,
        failureType: paymentIntent.last_payment_error?.type,
        failedAt: new Date().toISOString(),
      }
    });

    // 2. Release property reservations for booking deposits
    if (metadata.propertyId && metadata.paymentType === 'booking_deposit') {
      await prisma.property.updateMany({
        where: { 
          id: metadata.propertyId,
          status: 'reserved',
          reservedBy: metadata.buyerId || 'unknown'
        },
        data: { 
          status: 'available',
          reservedAt: null,
          reservedBy: null
        }
      });
      
      console.log(`🏠 Released reservation for property ${metadata.propertyId} due to payment failure`);
    }

    // 3. Update HTB claim status if applicable
    if (metadata.buyerId) {
      try {
        const { htbService } = await import('@/lib/services/htb-postgresql');
        const claims = await htbService.getClaimsByBuyer(metadata.buyerId);
        
        if (claims.length > 0) {
          const activeClaim = claims.find(c => c.status === 'processing');
          if (activeClaim) {
            await htbService.updateClaim(activeClaim.id, {
              status: 'approved', // Revert to previous status
              paymentReceived: false,
              notes: `Payment failed: ${metadata.paymentType} - ${paymentIntent.last_payment_error?.message || 'Unknown error'}`
            });
          }
        }
      } catch (htbError) {
        console.warn('HTB update failed (non-critical):', htbError);
      }
    }

    // 4. Log failure for manual follow-up
    console.log(`💸 Payment failure processed for property ${metadata.propertyId}: ${metadata.paymentType} - €${paymentIntent.amount / 100}`);
    
  } catch (error) {
    console.error('Failed to process payment failure:', error);
    // Still don't throw - webhook should return 200
    console.error(`🚨 CRITICAL: Payment ${paymentIntent.id} failed and database update also failed. Manual investigation required.`);
  }
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