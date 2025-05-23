import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { generatePDF } from '@/lib/pdf';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signaturewebhookSecret);
    } catch (err) {

      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:

    }

    return NextResponse.json({ received: true });

  } catch (error) {

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { transactionId, paymentType } = paymentIntent.metadata;

  // Update payment record
  const payment = await prisma.transactionPayment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'COMPLETED',
      paidAt: new Date(),
      receiptUrl: paymentIntent.charges?.data[0]?.receipt_url || undefined
    }
  });

  // Get transaction details
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      buyer: true,
      unit: {
        include: {
          development: true
        }
      },
      payments: true
    }
  });

  if (!transaction) {

    return;
  }

  // Calculate total paid
  const totalPaid = transaction.payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sump: any) => sum + p.amount0);

  // Update transaction
  const updateData: any = {
    depositPaid: totalPaid,
    totalPaid: totalPaid,
    outstandingBalance: (transaction.agreedPrice || 0) - totalPaid
  };

  // Update status based on payment type
  if (paymentType === 'deposit' && transaction.status === 'RESERVATION_PENDING') {
    updateData.status = 'RESERVED';
    updateData.stage = 'RESERVATION';
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: updateData
  });

  // Create transaction event
  await prisma.transactionEvent.create({
    data: {
      transactionId,
      eventType: 'PAYMENT_RECEIVED',
      description: `Payment of €${paymentIntent.amount / 100} received`,
      metadata: {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        type: paymentType
      },
      performedBy: transaction.buyerId
    }
  });

  // Generate receipt
  const receipt = await generatePDF('payment-receipt', {
    transaction,
    payment: {
      amount: paymentIntent.amount / 100,
      date: new Date(),
      description: paymentIntent.description,
      method: 'Credit/Debit Card',
      reference: paymentIntent.id
    }
  });

  // Create document record
  await prisma.transactionDocument.create({
    data: {
      transactionId,
      name: `Payment Receipt - ${new Date().toLocaleDateString()}`,
      type: 'RECEIPT',
      status: 'COMPLETED',
      uploadedBy: transaction.buyerId,
      fileUrl: receipt.url,
      fileSize: receipt.size,
      mimeType: 'application/pdf'
    }
  });

  // Send confirmation email
  await sendEmail({
    to: transaction.buyer.email,
    subject: `Payment Confirmation - ${transaction.unit.name}`,
    template: 'payment-confirmation',
    data: {
      buyerName: `${transaction.buyer.firstName} ${transaction.buyer.lastName}`,
      amount: paymentIntent.amount / 100,
      propertyName: transaction.unit.name,
      developmentName: transaction.unit.development.name,
      transactionRef: transaction.referenceNumber,
      receiptUrl: receipt.url,
      totalPaid,
      outstandingBalance: (transaction.agreedPrice || 0) - totalPaid
    }
  });

  // If this completes the reservation deposit, update unit status
  if (paymentType === 'deposit' && transaction.status === 'RESERVATION_PENDING') {
    await prisma.unit.update({
      where: { id: transaction.unitId },
      data: {
        status: 'RESERVED',
        reservedBy: transaction.buyerId,
        reservedDate: new Date()
      }
    });

    // Create follow-up tasks
    await prisma.transactionTask.create({
      data: {
        transactionId,
        title: 'Complete Property Customization',
        description: 'Select your finishes and customization options',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        assignedTo: transaction.buyerId
      }
    });
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { transactionId } = paymentIntent.metadata;

  // Update payment record
  await prisma.transactionPayment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'FAILED',
      failureReason: paymentIntent.last_payment_error?.message
    }
  });

  // Create transaction event
  await prisma.transactionEvent.create({
    data: {
      transactionId,
      eventType: 'PAYMENT_FAILED',
      description: `Payment of €${paymentIntent.amount / 100} failed`,
      metadata: {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message
      }
    }
  });

  // Get transaction for email
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      buyer: true,
      unit: true
    }
  });

  if (transaction) {
    // Send failure notification
    await sendEmail({
      to: transaction.buyer.email,
      subject: 'Payment Failed - Action Required',
      template: 'payment-failed',
      data: {
        buyerName: `${transaction.buyer.firstName} ${transaction.buyer.lastName}`,
        amount: paymentIntent.amount / 100,
        propertyName: transaction.unit.name,
        reason: paymentIntent.last_payment_error?.message || 'Unknown error',
        retryUrl: `${process.env.NEXT_PUBLIC_APP_URL}/buyer/transactions/${transactionId}/payment`
      }
    });
  }
}

async function handleRefund(charge: Stripe.Charge) {
  if (!charge.payment_intent || typeof charge.payment_intent !== 'string') {
    return;
  }

  // Find the payment
  const payment = await prisma.transactionPayment.findFirst({
    where: { stripePaymentIntentId: charge.payment_intent }
  });

  if (!payment) {

    return;
  }

  // Update payment status
  await prisma.transactionPayment.update({
    where: { id: payment.id },
    data: {
      status: 'REFUNDED',
      refundedAt: new Date(),
      refundAmount: charge.amount_refunded / 100
    }
  });

  // Update transaction totals
  const transaction = await prisma.transaction.findUnique({
    where: { id: payment.transactionId },
    include: {
      buyer: true,
      unit: true,
      payments: true
    }
  });

  if (transaction) {
    const totalPaid = transaction.payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sump: any) => sum + p.amount - (p.refundAmount || 0), 0);

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        totalPaid,
        outstandingBalance: (transaction.agreedPrice || 0) - totalPaid
      }
    });

    // Create transaction event
    await prisma.transactionEvent.create({
      data: {
        transactionId: transaction.id,
        eventType: 'PAYMENT_REFUNDED',
        description: `Refund of €${charge.amount_refunded / 100} processed`,
        metadata: {
          chargeId: charge.id,
          amount: charge.amount_refunded / 100
        }
      }
    });

    // Send refund notification
    await sendEmail({
      to: transaction.buyer.email,
      subject: 'Refund Processed',
      template: 'refund-confirmation',
      data: {
        buyerName: `${transaction.buyer.firstName} ${transaction.buyer.lastName}`,
        amount: charge.amount_refunded / 100,
        propertyName: transaction.unit.name,
        transactionRef: transaction.referenceNumber
      }
    });
  }
}