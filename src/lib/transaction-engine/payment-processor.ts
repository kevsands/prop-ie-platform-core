/**
 * Payment Processing System
 * Handles all payment operations for property transactions
 */

import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { EventEmitter } from 'events';
import { transactionEngine } from './index';
import type { PaymentType, PaymentStatus, PaymentMethod, Payment } from './types';

// Re-export the types and enums we need
export { PaymentType, PaymentStatus, PaymentMethod } from './types';
export type { Payment } from './types';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

export enum PaymentEvent {
  PAYMENT_INTENT_CREATED = 'payment_intent_created',
  PAYMENT_PROCESSING = 'payment_processing',
  PAYMENT_SUCCEEDED = 'payment_succeeded',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_REFUNDED = 'payment_refunded',
  WEBHOOK_RECEIVED = 'webhook_received'
}

export interface PaymentIntent {
  id: string;
  transactionId: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  metadata: Record<string, any>\n  );
}

export interface PaymentRequest {
  transactionId: string;
  paymentType: PaymentType;
  amount: number;
  currency?: string;
  paymentMethod?: PaymentMethod;
  description?: string;
  metadata?: Record<string, any>\n  );
}

export interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
}

export class PaymentProcessor extends EventEmitter {
  private static instance: PaymentProcessor;

  private constructor() {
    super();
  }

  static getInstance(): PaymentProcessor {
    if (!PaymentProcessor.instance) {
      PaymentProcessor.instance = new PaymentProcessor();
    }
    return PaymentProcessor.instance;
  }

  /**
   * Create a payment intent for card payments
   */
  async createPaymentIntent(request: PaymentRequest): Promise<PaymentIntent> {
    const transaction = await transactionEngine.getTransaction(request.transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Create Stripe payment intent
    const stripeIntent = await stripe.paymentIntents.create({
      amount: Math.round(request.amount * 100), // Convert to cents
      currency: request.currency || 'EUR',
      metadata: {
        transactionId: request.transactionId,
        paymentType: request.paymentType,
        ...request.metadata
      },
      description: request.description || `${request.paymentType} for property transaction`
    });

    // Save payment intent to database
    const paymentIntent = await prisma.paymentIntent.create({
      data: {
        transactionId: request.transactionId,
        paymentType: request.paymentType,
        amount: request.amount,
        currency: request.currency || 'EUR',
        status: PaymentStatus.PENDING,
        stripePaymentIntentId: stripeIntent.id,
        metadata: request.metadata || {}
      }
    });

    this.emit(PaymentEvent.PAYMENT_INTENT_CREATED, {
      transactionId: request.transactionId,
      paymentIntent
    });

    return paymentIntent as any;
  }

  /**
   * Process a card payment
   */
  async processCardPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<Payment> {
    const paymentIntent = await prisma.paymentIntent.findUnique({
      where: { id: paymentIntentId }
    });

    if (!paymentIntent) {
      throw new Error('Payment intent not found');
    }

    this.emit(PaymentEvent.PAYMENT_PROCESSING, {
      transactionId: paymentIntent.transactionId,
      paymentIntentId
    });

    try {
      // Confirm payment with Stripe
      const stripePayment = await stripe.paymentIntents.confirm(
        paymentIntent.stripePaymentIntentId!,
        { payment_method: paymentMethodId }
      );

      if (stripePayment.status === 'succeeded') {
        // Create payment record
        const payment = await transactionEngine.addPayment(paymentIntent.transactionId, {
          type: paymentIntent.paymentType,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: PaymentStatus.COMPLETED,
          method: PaymentMethod.CARD,
          reference: stripePayment.id,
          metadata: {
            stripePaymentIntentId: stripePayment.id,
            ...paymentIntent.metadata
          }
        });

        // Update payment intent status
        await prisma.paymentIntent.update({
          where: { id: paymentIntentId },
          data: { status: PaymentStatus.COMPLETED }
        });

        this.emit(PaymentEvent.PAYMENT_SUCCEEDED, {
          transactionId: paymentIntent.transactionId,
          payment
        });

        // Update transaction state based on payment type
        await this.updateTransactionStateForPayment(
          paymentIntent.transactionId,
          paymentIntent.paymentType
        );

        return payment;
      } else {
        throw new Error(`Payment failed with status: ${stripePayment.status}`);
      }
    } catch (error: any) {
      this.emit(PaymentEvent.PAYMENT_FAILED, {
        transactionId: paymentIntent.transactionId,
        error: error.message
      });

      // Update payment intent status
      await prisma.paymentIntent.update({
        where: { id: paymentIntentId },
        data: { status: PaymentStatus.FAILED }
      });

      throw error;
    }
  }

  /**
   * Process bank transfer payment
   */
  async processBankTransfer(request: PaymentRequest): Promise<Payment> {
    const payment = await transactionEngine.addPayment(request.transactionId, {
      type: request.paymentType,
      amount: request.amount,
      currency: request.currency || 'EUR',
      status: PaymentStatus.PENDING,
      method: PaymentMethod.BANK_TRANSFER,
      reference: this.generateBankTransferReference(request.transactionId),
      metadata: request.metadata || {}
    });

    // Send bank transfer instructions
    await this.sendBankTransferInstructions(request.transactionIdpayment);

    return payment;
  }

  /**
   * Confirm bank transfer receipt
   */
  async confirmBankTransfer(paymentId: string): Promise<Payment> {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.COMPLETED,
        processedAt: new Date()
      }
    });

    // Get transaction details
    const transaction = await transactionEngine.getTransaction(payment.transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    this.emit(PaymentEvent.PAYMENT_SUCCEEDED, {
      transactionId: payment.transactionId,
      payment
    });

    // Update transaction state
    await this.updateTransactionStateForPayment(
      payment.transactionId,
      payment.type as PaymentType
    );

    return payment as any;
  }

  /**
   * Process refund
   */
  async processRefund(request: RefundRequest): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id: request.paymentId }
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new Error('Can only refund completed payments');
    }

    const refundAmount = request.amount || payment.amount;

    if (payment.method === PaymentMethod.CARD && payment.metadata?.stripePaymentIntentId) {
      // Process Stripe refund
      const refund = await stripe.refunds.create({
        payment_intent: payment.metadata.stripePaymentIntentId,
        amount: Math.round(refundAmount * 100),
        reason: request.reason as any
      });

      // Update payment status
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.REFUNDED,
          metadata: {
            ...payment.metadata,
            refundId: refund.id,
            refundAmount,
            refundReason: request.reason
          }
        }
      });

      this.emit(PaymentEvent.PAYMENT_REFUNDED, {
        transactionId: payment.transactionId,
        payment: updatedPayment
      });

      return updatedPayment as any;
    } else {
      // Manual refund for bank transfers
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.REFUNDED,
          metadata: {
            ...payment.metadata,
            refundAmount,
            refundReason: request.reason,
            refundMethod: 'MANUAL'
          }
        }
      });

      return updatedPayment as any;
    }
  }

  /**
   * Handle Stripe webhooks
   */
  async handleStripeWebhook(event: Stripe.Event): Promise<void> {
    this.emit(PaymentEvent.WEBHOOK_RECEIVED, { event });

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
    }
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const transactionId = paymentIntent.metadata.transactionId;
    const paymentType = paymentIntent.metadata.paymentType as PaymentType;

    if (!transactionId || !paymentType) {

      return;
    }

    // Find existing payment or create new one
    const existingPayment = await prisma.payment.findFirst({
      where: {
        reference: paymentIntent.id,
        transactionId
      }
    });

    if (!existingPayment) {
      await transactionEngine.addPayment(transactionId, {
        type: paymentType,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: PaymentStatus.COMPLETED,
        method: PaymentMethod.CARD,
        reference: paymentIntent.id,
        metadata: paymentIntent.metadata
      });

      await this.updateTransactionStateForPayment(transactionIdpaymentType);
    }
  }

  /**
   * Handle failed payment intent
   */
  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const transactionId = paymentIntent.metadata.transactionId;

    if (!transactionId) {

      return;
    }

    this.emit(PaymentEvent.PAYMENT_FAILED, {
      transactionId,
      error: paymentIntent.last_payment_error?.message
    });
  }

  /**
   * Handle charge refunded
   */
  private async handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
    const payment = await prisma.payment.findFirst({
      where: {
        reference: charge.payment_intent as string
      }
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.REFUNDED,
          metadata: {
            ...payment.metadata,
            refundedAt: new Date().toISOString()
          }
        }
      });
    }
  }

  /**
   * Update transaction state after payment
   */
  private async updateTransactionStateForPayment(
    transactionId: string,
    paymentType: PaymentType
  ): Promise<void> {
    const transaction = await transactionEngine.getTransaction(transactionId);
    if (!transaction) return;

    const stateUpdates: Record<PaymentType, any> = {
      [PaymentType.BOOKING_DEPOSIT]: {
        fromState: 'BOOKING_DEPOSIT_PENDING',
        toState: 'BOOKING_DEPOSIT_PAID'
      },
      [PaymentType.CONTRACTUAL_DEPOSIT]: {
        fromState: 'CONTRACTUAL_DEPOSIT_PENDING',
        toState: 'CONTRACTUAL_DEPOSIT_PAID'
      },
      [PaymentType.CUSTOMIZATION_PAYMENT]: null,
      [PaymentType.STAGE_PAYMENT]: null,
      [PaymentType.FINAL_PAYMENT]: {
        fromState: 'MORTGAGE_DRAWDOWN_COMPLETE',
        toState: 'HANDOVER_SCHEDULED'
      },
      [PaymentType.MORTGAGE_DRAWDOWN]: {
        fromState: 'MORTGAGE_DRAWDOWN_PENDING',
        toState: 'MORTGAGE_DRAWDOWN_COMPLETE'
      }
    };

    const update = stateUpdates[paymentType];
    if (update && transaction.state === update.fromState) {
      await transactionEngine.updateState(
        transactionId,
        update.toState,
        'system',
        { paymentType }
      );
    }
  }

  /**
   * Generate bank transfer reference
   */
  private generateBankTransferReference(transactionId: string): string {
    return `PROP${transactionId.substring(08).toUpperCase()}`;
  }

  /**
   * Send bank transfer instructions
   */
  private async sendBankTransferInstructions(
    transactionId: string,
    payment: Payment
  ): Promise<void> {
    // This would integrate with email service

  }

  /**
   * Calculate payment amounts
   */
  async calculatePaymentAmounts(transactionId: string): Promise<{
    bookingDeposit: number;
    contractualDeposit: number;
    finalBalance: number;
    customizationCosts: number;
    totalAmount: number;
  }> {
    const transaction = await transactionEngine.getTransaction(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Get property details
    const property = await prisma.property.findUnique({
      where: { id: transaction.propertyId }
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const basePrice = property.price;
    const bookingDeposit = 5000; // Fixed booking deposit
    const contractualDeposit = basePrice * 0.1; // 10% contractual deposit

    // Calculate customization costs
    const customizations = await prisma.customization.findMany({
      where: { transactionId }
    });

    const customizationCosts = customizations.reduce(
      (totalcustom: any) => total + custom.price,
      0
    );

    const totalAmount = basePrice + customizationCosts;
    const finalBalance = totalAmount - bookingDeposit - contractualDeposit;

    return {
      bookingDeposit,
      contractualDeposit,
      finalBalance,
      customizationCosts,
      totalAmount
    };
  }

  /**
   * Get payment history for transaction
   */
  async getPaymentHistory(transactionId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { transactionId },
      orderBy: { processedAt: 'desc' }
    }) as any;
  }

  /**
   * Get payment summary
   */
  async getPaymentSummary(transactionId: string): Promise<{
    totalPaid: number;
    totalDue: number;
    nextPayment: { type: PaymentType; amount: number; dueDate?: Date } | null;
    payments: Payment[];
  }> {
    const payments = await this.getPaymentHistory(transactionId);
    const amounts = await this.calculatePaymentAmounts(transactionId);

    const totalPaid = payments
      .filter(p => p.status === PaymentStatus.COMPLETED)
      .reduce((sump: any) => sum + p.amount0);

    const totalDue = amounts.totalAmount - totalPaid;

    // Determine next payment
    let nextPayment = null;
    const transaction = await transactionEngine.getTransaction(transactionId);

    if (transaction) {
      if (transaction.state === 'BOOKING_DEPOSIT_PENDING') {
        nextPayment = {
          type: PaymentType.BOOKING_DEPOSIT,
          amount: amounts.bookingDeposit
        };
      } else if (transaction.state === 'CONTRACTUAL_DEPOSIT_PENDING') {
        nextPayment = {
          type: PaymentType.CONTRACTUAL_DEPOSIT,
          amount: amounts.contractualDeposit
        };
      } else if (transaction.state === 'MORTGAGE_DRAWDOWN_COMPLETE') {
        nextPayment = {
          type: PaymentType.FINAL_PAYMENT,
          amount: amounts.finalBalance
        };
      }
    }

    return {
      totalPaid,
      totalDue,
      nextPayment,
      payments
    };
  }
}

// Export singleton instance
export const paymentProcessor = PaymentProcessor.getInstance();