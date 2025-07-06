// src/app/api/payments/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';
import ReservationService from '@/lib/services/reservation-service';

interface PaymentConfirmationRequest {
  paymentIntentId: string;
  paymentMethodId?: string;
  returnUrl?: string;
  reservationId?: string;
}

/**
 * Payment Confirmation API
 * Confirms and processes payment intents
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PaymentConfirmationRequest;
    const { paymentIntentId, paymentMethodId, returnUrl } = body;

    // Validate required fields
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
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

    // In development mode, simulate payment confirmation
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Confirming payment intent ${paymentIntentId} for user ${currentUser.id}`);
      
      // Simulate different outcomes based on payment intent ID
      const simulateFailure = paymentIntentId.includes('fail');
      const simulateProcessing = paymentIntentId.includes('processing');
      
      if (simulateFailure) {
        return NextResponse.json({
          success: false,
          error: 'payment_failed',
          paymentIntent: {
            id: paymentIntentId,
            status: 'requires_payment_method',
            lastPaymentError: {
              type: 'card_error',
              code: 'card_declined',
              message: 'Your card was declined. Please try a different payment method.'
            }
          },
          message: '[DEV MODE] Simulated payment failure'
        });
      }

      if (simulateProcessing) {
        return NextResponse.json({
          success: true,
          paymentIntent: {
            id: paymentIntentId,
            status: 'processing',
            amount: 500000, // €5000 in cents
            currency: 'eur',
            created: Math.floor(Date.now() / 1000),
            metadata: {
              propertyId: 'prop_001',
              paymentType: 'reservation'
            }
          },
          requiresAction: false,
          message: '[DEV MODE] Payment is processing. This may take a few minutes.'
        });
      }

      // Simulate successful payment
      const mockConfirmedPayment = {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 500000, // €5000 in cents
        currency: 'eur',
        created: Math.floor(Date.now() / 1000),
        paymentMethod: {
          id: paymentMethodId || 'pm_mock_card',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2027
          }
        },
        charges: {
          data: [{
            id: `ch_${Date.now()}`,
            amount: 500000,
            currency: 'eur',
            status: 'succeeded',
            receiptUrl: `/receipts/${paymentIntentId}.pdf`,
            created: Math.floor(Date.now() / 1000)
          }]
        },
        metadata: {
          propertyId: 'prop_001',
          userId: currentUser.id,
          paymentType: 'reservation'
        }
      };

      // Create transaction record and get transaction reference
      const transactionReference = mockConfirmedPayment.charges.data[0].id;

      // Integrate with reservation system if reservationId provided
      let updatedReservation = null;
      if (reservationId) {
        try {
          updatedReservation = await ReservationService.confirmReservationPayment(
            reservationId,
            paymentIntentId,
            `${mockConfirmedPayment.paymentMethod.type}:${mockConfirmedPayment.paymentMethod.card?.brand}:****${mockConfirmedPayment.paymentMethod.card?.last4}`,
            transactionReference
          );
          console.log(`[DEV] Reservation ${reservationId} payment confirmed`);
        } catch (reservationError) {
          console.error('Reservation confirmation failed:', reservationError);
          // Continue with payment confirmation even if reservation update fails
        }
      }

      // Trigger task automation for payment completion
      const automationPayload = {
        paymentType: mockConfirmedPayment.metadata.paymentType,
        amount: mockConfirmedPayment.amount / 100,
        propertyId: mockConfirmedPayment.metadata.propertyId,
        userId: mockConfirmedPayment.metadata.userId
      };

      try {
        await fetch(`${request.nextUrl.origin}/api/tasks/automation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || ''
          },
          body: JSON.stringify({
            event: 'payment_completed',
            payload: automationPayload
          })
        });
      } catch (automationError) {
        console.error('Task automation trigger failed:', automationError);
        // Don't fail the payment if automation fails
      }

      // In production, this would also:
      // 1. Update property status
      // 2. Send confirmation emails
      // 3. Create transaction records
      // 4. Trigger webhooks for other systems

      return NextResponse.json({
        success: true,
        paymentIntent: mockConfirmedPayment,
        reservation: updatedReservation ? {
          id: updatedReservation.id,
          reservationNumber: updatedReservation.reservationNumber,
          status: updatedReservation.status,
          expiresAt: updatedReservation.expiresAt,
          amountPaid: updatedReservation.amountPaid,
          outstandingAmount: updatedReservation.outstandingAmount
        } : null,
        transaction: {
          id: transactionReference,
          amount: mockConfirmedPayment.amount / 100,
          currency: mockConfirmedPayment.currency,
          status: 'completed',
          paymentMethod: `${mockConfirmedPayment.paymentMethod.card?.brand} ****${mockConfirmedPayment.paymentMethod.card?.last4}`
        },
        requiresAction: false,
        message: '[DEV MODE] Payment confirmed successfully. Task automation triggered.'
      });
    }

    // Production: Confirm actual Stripe payment intent
    try {
      // This would use actual Stripe SDK in production
      // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      // const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      //   payment_method: paymentMethodId,
      //   return_url: returnUrl
      // });

      // Mock production response
      const confirmedPayment = {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 500000,
        currency: 'eur',
        created: Math.floor(Date.now() / 1000),
        metadata: {
          propertyId: 'prop_001',
          userId: currentUser.id,
          paymentType: 'reservation'
        }
      };

      return NextResponse.json({
        success: true,
        paymentIntent: confirmedPayment,
        requiresAction: confirmedPayment.status === 'requires_action'
      });
    } catch (stripeError: any) {
      console.error('Stripe payment confirmation error:', stripeError);
      
      return NextResponse.json({
        success: false,
        error: 'payment_confirmation_failed',
        message: stripeError.message || 'Failed to confirm payment'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Payment confirmation error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}