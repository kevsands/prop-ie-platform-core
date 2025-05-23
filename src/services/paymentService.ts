import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import crypto from 'crypto';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'});

export interface PaymentRequest {
  transactionId: string;
  amount: number;
  type: PaymentType;
  description?: string;
  userId: string;
  paymentMethod: PaymentMethod;
  currency?: string;
}

export interface BankTransferDetails {
  bankName: string;
  accountNumber: string;
  iban: string;
  bic: string;
  reference: string;
}

export enum PaymentType {
  BOOKING_DEPOSIT = 'BOOKING_DEPOSIT',
  CONTRACT_DEPOSIT = 'CONTRACT_DEPOSIT',
  STAGE_PAYMENT = 'STAGE_PAYMENT',
  FINAL_PAYMENT = 'FINAL_PAYMENT',
  CUSTOMIZATION_PAYMENT = 'CUSTOMIZATION_PAYMENT',
  LEGAL_FEE = 'LEGAL_FEE',
  STAMP_DUTY = 'STAMP_DUTY',
  OTHER_FEE = 'OTHER_FEE',
  REFUND = 'REFUND'}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CHEQUE = 'CHEQUE',
  CASH = 'CASH',
  MORTGAGE_DRAWDOWN = 'MORTGAGE_DRAWDOWN',
  OTHER = 'OTHER'}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'}

class PaymentService {
  /**
   * Create a new payment record and process payment based on method
   */
  async createPayment(paymentRequest: PaymentRequest) {
    const payment = await prisma.$transaction(async (tx: any) => {
      // Create payment record
      const newPayment = await tx.payment.create({
        data: {
          transactionId: paymentRequest.transactionId,
          type: paymentRequest.type,
          amount: paymentRequest.amount,
          currency: paymentRequest.currency || 'EUR',
          status: PaymentStatus.PENDING,
          method: paymentRequest.paymentMethod,
          reference: this.generatePaymentReference(),
          description: paymentRequest.description,
          dueDate: this.calculateDueDate(paymentRequest.type)});

      // Process payment based on method
      let processedPayment = newPayment;

      switch (paymentRequest.paymentMethod) {
        case PaymentMethod.CREDIT_CARD:
        case PaymentMethod.DEBIT_CARD:
          processedPayment = await this.processCardPayment(newPaymentpaymentRequest);
          break;
        case PaymentMethod.BANK_TRANSFER:
          processedPayment = await this.processBankTransfer(newPaymentpaymentRequest);
          break;
        case PaymentMethod.MORTGAGE_DRAWDOWN:
          processedPayment = await this.processMortgageDrawdown(newPaymentpaymentRequest);
          break;
        default:
          // For cash, cheque, etc., just update status
          processedPayment = await tx.payment.update({
            where: { id: newPayment.id },
            data: { status: PaymentStatus.PROCESSING });
      }

      // Create transaction event
      await tx.transactionEvent.create({
        data: {
          transactionId: paymentRequest.transactionId,
          eventType: 'PAYMENT_RECEIVED',
          description: `Payment of €${paymentRequest.amount} initiated for ${paymentRequest.type}`,
          metadata: {
            paymentId: processedPayment.id,
            amount: paymentRequest.amount,
            method: paymentRequest.paymentMethod},
          performedBy: paymentRequest.userId});

      // Create notification
      const transaction = await tx.transaction.findUnique({
        where: { id: paymentRequest.transactionId },
        include: { buyer: true });

      if (transaction) {
        await tx.notification.create({
          data: {
            userId: transaction.buyerId,
            type: 'PAYMENT_REMINDER',
            category: 'PAYMENT',
            priority: 'NORMAL',
            title: 'Payment Processing',
            message: `Your payment of €${paymentRequest.amount} for ${paymentRequest.type} is being processed.`,
            actionUrl: `/transactions/${paymentRequest.transactionId}/payments`});
      }

      return processedPayment;
    });

    return payment;
  }

  /**
   * Process card payment using Stripe
   */
  private async processCardPayment(payment: any, request: PaymentRequest) {
    try {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(payment.amount * 100), // Convert to cents
        currency: payment.currency.toLowerCase(),
        metadata: {
          paymentId: payment.id,
          transactionId: payment.transactionId,
          type: payment.type});

      // Update payment with Stripe reference
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PROCESSING,
          bankReference: paymentIntent.id});

      return updatedPayment;
    } catch (error) {

      // Update payment status to failed
      const failedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED});

      throw error;
    }
  }

  /**
   * Process bank transfer payment
   */
  private async processBankTransfer(payment: any, request: PaymentRequest) {
    // Generate bank transfer details
    const transferDetails: BankTransferDetails = {
      bankName: process.env.BANK_NAME || 'Allied Irish Banks',
      accountNumber: process.env.BANK_ACCOUNT || '12345678',
      iban: process.env.BANK_IBAN || 'IE29AIBK93115212345678',
      bic: process.env.BANK_BIC || 'AIBKIE2D',
      reference: payment.reference};

    // Update payment with bank details
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PENDING,
        toAccount: transferDetails.iban,
        bankReference: payment.reference});

    // Send bank transfer instructions notification
    const transaction = await prisma.transaction.findUnique({
      where: { id: payment.transactionId },
      include: { buyer: true });

    if (transaction) {
      await prisma.notification.create({
        data: {
          userId: transaction.buyerId,
          type: 'PAYMENT_REMINDER',
          category: 'PAYMENT',
          priority: 'HIGH',
          title: 'Bank Transfer Instructions',
          message: `Please transfer €${payment.amount} to complete your payment. Reference: ${payment.reference}`,
          actionUrl: `/transactions/${payment.transactionId}/payments/${payment.id}`,
          metadata: transferDetails});
    }

    return updatedPayment;
  }

  /**
   * Process mortgage drawdown
   */
  private async processMortgageDrawdown(payment: any, request: PaymentRequest) {
    // Update transaction mortgage details
    await prisma.transaction.update({
      where: { id: payment.transactionId },
      data: {
        mortgageAmount: payment.amount,
        mortgageReference: payment.reference});

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PROCESSING,
        method: PaymentMethod.MORTGAGE_DRAWDOWN});

    return updatedPayment;
  }

  /**
   * Confirm payment completion
   */
  async confirmPayment(paymentId: string, confirmationDetails?: any) {
    const payment = await prisma.$transaction(async (tx: any) => {
      // Get the payment
      const existingPayment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { transaction: true });

      if (!existingPayment) {
        throw new Error('Payment not found');
      }

      // Update payment status
      const confirmedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.COMPLETED,
          paidDate: new Date(),
          clearedDate: new Date(),
          ...confirmationDetails});

      // Update transaction totals
      const transaction = await tx.transaction.findUnique({
        where: { id: existingPayment.transactionId });

      if (transaction) {
        const newTotalPaid = transaction.totalPaid + existingPayment.amount;

        await tx.transaction.update({
          where: { id: existingPayment.transactionId },
          data: {
            totalPaid: newTotalPaid,
            depositPaid: existingPayment.type === PaymentType.BOOKING_DEPOSIT 
              ? existingPayment.amount 
              : transaction.depositPaid,
            outstandingBalance: (transaction.agreedPrice || 0) - newTotalPaid});
      }

      // Create transaction event
      await tx.transactionEvent.create({
        data: {
          transactionId: existingPayment.transactionId,
          eventType: 'PAYMENT_RECEIVED',
          description: `Payment of €${existingPayment.amount} confirmed for ${existingPayment.type}`,
          metadata: {
            paymentId: confirmedPayment.id,
            amount: existingPayment.amount}});

      // Send confirmation notification
      if (existingPayment.transaction?.buyer) {
        await tx.notification.create({
          data: {
            userId: existingPayment.transaction.buyerId,
            type: 'PAYMENT_REMINDER',
            category: 'PAYMENT',
            priority: 'NORMAL',
            title: 'Payment Confirmed',
            message: `Your payment of €${existingPayment.amount} has been confirmed.`,
            actionUrl: `/transactions/${existingPayment.transactionId}/payments`});
      }

      // Check if transaction should progress
      if (existingPayment.type === PaymentType.BOOKING_DEPOSIT) {
        await tx.transaction.update({
          where: { id: existingPayment.transactionId },
          data: {
            status: 'RESERVATION_PAID',
            stage: 'RESERVATION',
            reservationDate: new Date()});
      }

      return confirmedPayment;
    });

    return payment;
  }

  /**
   * Process refund
   */
  async processRefund(paymentId: string, amount: number, reason: string) {
    const refund = await prisma.$transaction(async (tx: any) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== PaymentStatus.COMPLETED) {
        throw new Error('Can only refund completed payments');
      }

      // Create refund payment record
      const refundPayment = await tx.payment.create({
        data: {
          transactionId: payment.transactionId,
          type: PaymentType.REFUND,
          amount: -amount, // Negative amount for refund
          currency: payment.currency,
          status: PaymentStatus.PROCESSING,
          method: payment.method,
          reference: this.generatePaymentReference(),
          description: `Refund for payment ${payment.reference}: ${reason}`});

      // Process refund based on payment method
      if (payment.method === PaymentMethod.CREDIT_CARD || payment.method === PaymentMethod.DEBIT_CARD) {
        // Process Stripe refund
        if (payment.bankReference) {
          const stripeRefund = await stripe.refunds.create({
            payment_intent: payment.bankReference,
            amount: Math.round(amount * 100), // Convert to cents
            reason: 'requested_by_customer'});

          await tx.payment.update({
            where: { id: refundPayment.id },
            data: {
              bankReference: stripeRefund.id,
              status: PaymentStatus.COMPLETED});
        }
      }

      // Update original payment status
      const isFullRefund = amount === payment.amount;
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: isFullRefund 
            ? PaymentStatus.REFUNDED 
            : PaymentStatus.PARTIALLY_REFUNDED});

      // Update transaction totals
      const transaction = await tx.transaction.findUnique({
        where: { id: payment.transactionId });

      if (transaction) {
        await tx.transaction.update({
          where: { id: payment.transactionId },
          data: {
            totalPaid: transaction.totalPaid - amount,
            outstandingBalance: (transaction.outstandingBalance || 0) + amount});
      }

      // Create transaction event
      await tx.transactionEvent.create({
        data: {
          transactionId: payment.transactionId,
          eventType: 'PAYMENT_RECEIVED',
          description: `Refund of €${amount} processed`,
          metadata: {
            originalPaymentId: paymentId,
            refundPaymentId: refundPayment.id,
            amount,
            reason}});

      return refundPayment;
    });

    return refund;
  }

  /**
   * Get payment schedule for a transaction
   */
  async getPaymentSchedule(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { 
        unit: true,
        payments: {
          orderBy: { createdAt: 'asc' }});

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const agreedPrice = transaction.agreedPrice || 0;
    const schedule = [
      {
        type: PaymentType.BOOKING_DEPOSIT,
        description: 'Booking Deposit',
        amount: 5000,
        dueDate: new Date(transaction.createdAt).setDate(new Date(transaction.createdAt).getDate() + 7),
        status: this.getPaymentStatus(transaction.payments, PaymentType.BOOKING_DEPOSIT)},
      {
        type: PaymentType.CONTRACT_DEPOSIT,
        description: 'Contract Deposit (10%)',
        amount: agreedPrice * 0.1,
        dueDate: transaction.contractDate 
          ? new Date(transaction.contractDate).setDate(new Date(transaction.contractDate).getDate() + 28)
          : null,
        status: this.getPaymentStatus(transaction.payments, PaymentType.CONTRACT_DEPOSIT)},
      {
        type: PaymentType.FINAL_PAYMENT,
        description: 'Final Payment',
        amount: agreedPrice - (5000 + agreedPrice * 0.1),
        dueDate: transaction.completionDate || null,
        status: this.getPaymentStatus(transaction.payments, PaymentType.FINAL_PAYMENT)}];

    // Add customization payments if any
    if (transaction.customizations?.length> 0) {
      const customizationTotal = transaction.customizations.reduce(
        (sum: number, c: any) => sum + c.totalPrice, 
        0
      );

      schedule.push({
        type: PaymentType.CUSTOMIZATION_PAYMENT,
        description: 'Customization Costs',
        amount: customizationTotal,
        dueDate: transaction.contractDate 
          ? new Date(transaction.contractDate).setDate(new Date(transaction.contractDate).getDate() + 60)
          : null,
        status: this.getPaymentStatus(transaction.payments, PaymentType.CUSTOMIZATION_PAYMENT)});
    }

    return schedule;
  }

  /**
   * Generate unique payment reference
   */
  private generatePaymentReference(): string {
    const prefix = 'PAY';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Calculate due date based on payment type
   */
  private calculateDueDate(type: PaymentType): Date {
    const now = new Date();

    switch (type) {
      case PaymentType.BOOKING_DEPOSIT:
        return new Date(now.setDate(now.getDate() + 7)); // 7 days
      case PaymentType.CONTRACT_DEPOSIT:
        return new Date(now.setDate(now.getDate() + 28)); // 28 days
      case PaymentType.FINAL_PAYMENT:
        return new Date(now.setDate(now.getDate() + 90)); // 90 days
      default:
        return new Date(now.setDate(now.getDate() + 30)); // 30 days default
    }
  }

  /**
   * Get payment status for a specific type
   */
  private getPaymentStatus(payments: any[], type: PaymentType): PaymentStatus | null {
    const payment = payments.find(p => p.type === type);
    return payment ? payment.status : null;
  }

  /**
   * Validate payment can be made
   */
  async validatePayment(transactionId: string, amount: number, type: PaymentType) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { payments: true });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Check if payment type already exists and is completed
    const existingPayment = transaction.payments.find(
      p => p.type === type && p.status === PaymentStatus.COMPLETED
    );

    if (existingPayment) {
      throw new Error(`Payment of type ${type} already completed`);
    }

    // Validate amount
    const outstandingBalance = (transaction.agreedPrice || 0) - transaction.totalPaid;

    if (amount> outstandingBalance) {
      throw new Error(`Payment amount (€${amount}) exceeds outstanding balance (€${outstandingBalance})`);
    }

    return true;
  }

  /**
   * Get payment summary for transaction
   */
  async getPaymentSummary(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }});

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const summary = {
      agreedPrice: transaction.agreedPrice || 0,
      totalPaid: transaction.totalPaid,
      outstandingBalance: (transaction.agreedPrice || 0) - transaction.totalPaid,
      depositPaid: transaction.depositPaid,
      payments: transaction.payments,
      completedPayments: transaction.payments.filter(p => p.status === PaymentStatus.COMPLETED),
      pendingPayments: transaction.payments.filter(p => p.status === PaymentStatus.PENDING),
      failedPayments: transaction.payments.filter(p => p.status === PaymentStatus.FAILED)};

    return summary;
  }
}

export const paymentService = new PaymentService();