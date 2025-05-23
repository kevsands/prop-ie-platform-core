// Payment Service Tests
import paymentService from '@/services/paymentService';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock dependencies
jest.mock('@prisma/client');
jest.mock('stripe');

const mockPrisma = {
  payment: {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn()
  },
  transaction: {
    findUnique: jest.fn(),
    update: jest.fn()
  },
  transactionEvent: {
    create: jest.fn()
  },
  notification: {
    create: jest.fn()
  },
  bankTransferInstructions: {
    create: jest.fn()
  },
  $transaction: jest.fn()
};

const mockStripe = {
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn(),
    update: jest.fn()
  },
  refunds: {
    create: jest.fn()
  },
  customers: {
    create: jest.fn()
  }
};

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as any);
    (Stripe as jest.MockedClass<typeof Stripe>).mockImplementation(() => mockStripe as any);
  });

  describe('createPayment', () => {
    it('should create a card payment successfully', async () => {
      const paymentRequest = {
        transactionId: 'tx-123',
        amount: 50000,
        type: 'DEPOSIT' as const,
        method: 'CARD' as const,
        payerId: 'user-123',
        description: 'Deposit payment for Unit 101'
      };

      const mockTransaction = {
        id: 'tx-123',
        buyerId: 'user-123',
        buyer: { email: 'buyer@example.com' },
        referenceNumber: 'TX-001',
        unit: { unitNumber: '101' }
      };

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return callback(mockPrisma);
      });

      mockPrisma.transaction.findUnique.mockResolvedValue(mockTransaction);
      
      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'secret_123',
        status: 'pending',
        amount: 50000,
        currency: 'eur'
      });

      mockPrisma.payment.create.mockResolvedValue({
        id: 'payment-123',
        transactionId: 'tx-123',
        amount: 50000,
        type: 'DEPOSIT',
        method: 'CARD',
        status: 'PENDING',
        stripePaymentIntentId: 'pi_123'
      });

      const result = await paymentService.createPayment(paymentRequest);

      expect(result.id).toBe('payment-123');
      expect(result.clientSecret).toBe('secret_123');
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 50000,
        currency: 'eur',
        payment_method_types: ['card'],
        metadata: {
          transactionId: 'tx-123',
          paymentType: 'DEPOSIT',
          payerId: 'user-123'
        },
        description: 'Deposit payment for Unit 101'
      });
    });

    it('should create bank transfer instructions', async () => {
      const paymentRequest = {
        transactionId: 'tx-123',
        amount: 50000,
        type: 'DEPOSIT' as const,
        method: 'BANK_TRANSFER' as const,
        payerId: 'user-123',
        description: 'Deposit payment for Unit 101'
      };

      const mockTransaction = {
        id: 'tx-123',
        referenceNumber: 'TX-001'
      };

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return callback(mockPrisma);
      });

      mockPrisma.transaction.findUnique.mockResolvedValue(mockTransaction);
      
      mockPrisma.payment.create.mockResolvedValue({
        id: 'payment-123',
        transactionId: 'tx-123',
        amount: 50000,
        type: 'DEPOSIT',
        method: 'BANK_TRANSFER',
        status: 'PENDING'
      });

      mockPrisma.bankTransferInstructions.create.mockResolvedValue({
        id: 'bti-123',
        paymentId: 'payment-123',
        accountName: 'Prop Platform Escrow',
        accountNumber: '12345678',
        sortCode: '123456',
        reference: 'TX-001-DEPOSIT'
      });

      const result = await paymentService.createPayment(paymentRequest);

      expect(result.id).toBe('payment-123');
      expect(result.bankTransferInstructions).toBeDefined();
      expect(result.bankTransferInstructions.reference).toBe('TX-001-DEPOSIT');
    });

    it('should validate deposit amount against agreed price', async () => {
      const paymentRequest = {
        transactionId: 'tx-123',
        amount: 150000, // 30% of agreed price
        type: 'DEPOSIT' as const,
        method: 'CARD' as const,
        payerId: 'user-123'
      };

      const mockTransaction = {
        id: 'tx-123',
        agreedPrice: 500000,
        buyer: { email: 'buyer@example.com' }
      };

      mockPrisma.transaction.findUnique.mockResolvedValue(mockTransaction);

      await expect(paymentService.createPayment(paymentRequest))
        .rejects.toThrow('Deposit amount exceeds 20% of agreed price');
    });
  });

  describe('processRefund', () => {
    it('should process refund for card payment', async () => {
      const mockPayment = {
        id: 'payment-123',
        amount: 50000,
        status: 'COMPLETED',
        method: 'CARD',
        stripePaymentIntentId: 'pi_123',
        transaction: {
          id: 'tx-123',
          buyerId: 'user-123'
        }
      };

      mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);
      
      mockStripe.refunds.create.mockResolvedValue({
        id: 'refund-123',
        status: 'succeeded',
        amount: 50000
      });

      mockPrisma.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'REFUNDED',
        refundedAmount: 50000,
        refundReason: 'Transaction cancelled'
      });

      const result = await paymentService.processRefund({
        paymentId: 'payment-123',
        amount: 50000,
        reason: 'Transaction cancelled'
      });

      expect(result.status).toBe('REFUNDED');
      expect(result.refundedAmount).toBe(50000);
      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: 'pi_123',
        amount: 50000,
        reason: 'requested_by_customer',
        metadata: {
          paymentId: 'payment-123',
          refundReason: 'Transaction cancelled'
        }
      });
    });

    it('should process partial refund', async () => {
      const mockPayment = {
        id: 'payment-123',
        amount: 50000,
        status: 'COMPLETED',
        method: 'CARD',
        stripePaymentIntentId: 'pi_123',
        refundedAmount: 0
      };

      mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);
      
      mockStripe.refunds.create.mockResolvedValue({
        id: 'refund-123',
        status: 'succeeded',
        amount: 20000
      });

      mockPrisma.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'PARTIALLY_REFUNDED',
        refundedAmount: 20000
      });

      const result = await paymentService.processRefund({
        paymentId: 'payment-123',
        amount: 20000,
        reason: 'Partial refund'
      });

      expect(result.status).toBe('PARTIALLY_REFUNDED');
      expect(result.refundedAmount).toBe(20000);
    });

    it('should process refund for bank transfer', async () => {
      const mockPayment = {
        id: 'payment-123',
        amount: 50000,
        status: 'COMPLETED',
        method: 'BANK_TRANSFER'
      };

      mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);
      
      mockPrisma.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'REFUND_PENDING',
        refundRequestedAt: new Date(),
        refundReason: 'Bank transfer refund'
      });

      const result = await paymentService.processRefund({
        paymentId: 'payment-123',
        amount: 50000,
        reason: 'Bank transfer refund'
      });

      expect(result.status).toBe('REFUND_PENDING');
      expect(result.refundRequestedAt).toBeDefined();
    });

    it('should prevent refund if amount exceeds payment', async () => {
      const mockPayment = {
        id: 'payment-123',
        amount: 50000,
        status: 'COMPLETED',
        refundedAmount: 10000
      };

      mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);

      await expect(paymentService.processRefund({
        paymentId: 'payment-123',
        amount: 45000, // Total would be 55000, exceeds 50000
        reason: 'Over refund'
      })).rejects.toThrow('Refund amount exceeds available amount');
    });
  });

  describe('createPaymentSchedule', () => {
    it('should create payment schedule with milestones', async () => {
      const schedule = {
        transactionId: 'tx-123',
        totalAmount: 500000,
        milestones: [
          {
            name: 'Deposit',
            amount: 50000,
            dueDate: new Date('2024-01-15'),
            type: 'DEPOSIT' as const
          },
          {
            name: 'Contract Signing',
            amount: 200000,
            dueDate: new Date('2024-02-15'),
            type: 'MILESTONE' as const
          },
          {
            name: 'Final Payment',
            amount: 250000,
            dueDate: new Date('2024-03-15'),
            type: 'FINAL' as const
          }
        ]
      };

      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: 'tx-123',
        agreedPrice: 500000
      });

      const mockCreatedPayments = schedule.milestones.map((milestoneindex: any) => ({
        id: `scheduled-${index}`,
        transactionId: 'tx-123',
        amount: milestone.amount,
        type: milestone.type,
        status: 'SCHEDULED',
        scheduledDate: milestone.dueDate,
        description: milestone.name
      }));

      mockPrisma.payment.create.mockResolvedValueOnce(mockCreatedPayments[0]);
      mockPrisma.payment.create.mockResolvedValueOnce(mockCreatedPayments[1]);
      mockPrisma.payment.create.mockResolvedValueOnce(mockCreatedPayments[2]);

      const result = await paymentService.createPaymentSchedule(schedule);

      expect(result).toHaveLength(3);
      expect(result[0].type).toBe('DEPOSIT');
      expect(result[1].type).toBe('MILESTONE');
      expect(result[2].type).toBe('FINAL');
      expect(result.reduce((sumpayment: any) => sum + payment.amount0)).toBe(500000);
    });

    it('should validate milestone amounts match total', async () => {
      const schedule = {
        transactionId: 'tx-123',
        totalAmount: 500000,
        milestones: [
          {
            name: 'Deposit',
            amount: 50000,
            dueDate: new Date('2024-01-15'),
            type: 'DEPOSIT' as const
          },
          {
            name: 'Final Payment',
            amount: 400000, // Total would be 450000, not 500000
            dueDate: new Date('2024-03-15'),
            type: 'FINAL' as const
          }
        ]
      };

      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: 'tx-123',
        agreedPrice: 500000
      });

      await expect(paymentService.createPaymentSchedule(schedule))
        .rejects.toThrow('Milestone amounts do not match total amount');
    });
  });

  describe('getPaymentStatus', () => {
    it('should retrieve payment status from Stripe', async () => {
      const mockPayment = {
        id: 'payment-123',
        stripePaymentIntentId: 'pi_123',
        status: 'PENDING'
      };

      mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);
      
      mockStripe.paymentIntents.retrieve.mockResolvedValue({
        id: 'pi_123',
        status: 'succeeded',
        amount_received: 50000
      });

      mockPrisma.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'COMPLETED'
      });

      const result = await paymentService.getPaymentStatus('payment-123');

      expect(result.status).toBe('COMPLETED');
      expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_123');
    });

    it('should handle bank transfer confirmation', async () => {
      const mockPayment = {
        id: 'payment-123',
        method: 'BANK_TRANSFER',
        status: 'PENDING'
      };

      mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);
      mockPrisma.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'COMPLETED',
        confirmedAt: new Date(),
        confirmedBy: 'admin-123'
      });

      const result = await paymentService.confirmBankTransfer('payment-123', {
        confirmedBy: 'admin-123',
        bankReference: 'REF-123456'
      });

      expect(result.status).toBe('COMPLETED');
      expect(result.confirmedAt).toBeDefined();
    });
  });
});