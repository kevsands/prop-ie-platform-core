/**
 * ================================================================================
 * PRODUCTION PAYMENTS SERVICE - POSTGRESQL
 * Enterprise-grade payment processing and transaction management
 * Integrates with Stripe for secure payment processing
 * ================================================================================
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type PaymentType = 'booking_deposit' | 'contractual_deposit' | 'completion_payment' | 'stage_payment' | 'upgrade_payment';

export interface CreatePaymentRequest {
  stripePaymentIntentId: string;
  propertyId: string;
  buyerId: string;
  agentId?: string;
  developerId?: string;
  paymentType: PaymentType;
  amount: number; // Amount in cents
  currency: string;
  status: PaymentStatus;
  platformFee: number;
  agentCommission: number;
  netAmount: number;
  stripeChargeId?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

export interface UpdatePaymentRequest {
  status?: PaymentStatus;
  stripeChargeId?: string;
  failureReason?: string;
  refundAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
}

export interface PaymentFilter {
  propertyId?: string;
  buyerId?: string;
  agentId?: string;
  paymentType?: PaymentType;
  status?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
}

class PaymentsService {
  /**
   * Create a new payment record
   */
  async createPayment(data: CreatePaymentRequest) {
    try {
      const payment = await prisma.payment.create({
        data: {
          stripePaymentIntentId: data.stripePaymentIntentId,
          propertyId: data.propertyId,
          buyerId: data.buyerId,
          agentId: data.agentId,
          developerId: data.developerId,
          paymentType: data.paymentType,
          amount: data.amount,
          currency: data.currency,
          status: data.status,
          platformFee: data.platformFee,
          agentCommission: data.agentCommission,
          netAmount: data.netAmount,
          stripeChargeId: data.stripeChargeId,
          failureReason: data.failureReason,
          metadata: data.metadata as Prisma.JsonObject,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`💳 Payment created: ${payment.id} for property ${data.propertyId}`);
      return payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error(`Failed to create payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing payment
   */
  async updatePayment(paymentId: string, data: UpdatePaymentRequest) {
    try {
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          ...data,
          metadata: data.metadata as Prisma.JsonObject,
          updatedAt: new Date(),
        },
      });

      console.log(`💳 Payment updated: ${payment.id} - Status: ${payment.status}`);
      return payment;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw new Error(`Failed to update payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get payment by Stripe Payment Intent ID
   */
  async getPaymentByStripeId(stripePaymentIntentId: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { stripePaymentIntentId },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
            }
          }
        }
      });

      return payment;
    } catch (error) {
      console.error('Error fetching payment by Stripe ID:', error);
      throw new Error(`Failed to fetch payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
            }
          }
        }
      });

      return payment;
    } catch (error) {
      console.error('Error fetching payment by ID:', error);
      throw new Error(`Failed to fetch payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get payments for a property
   */
  async getPaymentsByProperty(propertyId: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: { propertyId },
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
            }
          }
        }
      });

      return payments;
    } catch (error) {
      console.error('Error fetching payments for property:', error);
      throw new Error(`Failed to fetch payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get payments for a buyer
   */
  async getPaymentsByBuyer(buyerId: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: { buyerId },
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
            }
          }
        }
      });

      return payments;
    } catch (error) {
      console.error('Error fetching payments for buyer:', error);
      throw new Error(`Failed to fetch payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get payments with filters
   */
  async getPayments(filter: PaymentFilter = {}, limit: number = 50, offset: number = 0) {
    try {
      const where: Prisma.PaymentWhereInput = {};

      if (filter.propertyId) where.propertyId = filter.propertyId;
      if (filter.buyerId) where.buyerId = filter.buyerId;
      if (filter.agentId) where.agentId = filter.agentId;
      if (filter.paymentType) where.paymentType = filter.paymentType;
      if (filter.status) where.status = filter.status;
      
      if (filter.dateFrom || filter.dateTo) {
        where.createdAt = {};
        if (filter.dateFrom) where.createdAt.gte = filter.dateFrom;
        if (filter.dateTo) where.createdAt.lte = filter.dateTo;
      }

      if (filter.amountMin || filter.amountMax) {
        where.amount = {};
        if (filter.amountMin) where.amount.gte = filter.amountMin;
        if (filter.amountMax) where.amount.lte = filter.amountMax;
      }

      const payments = await prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
            }
          }
        }
      });

      const total = await prisma.payment.count({ where });

      return {
        payments,
        total,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      console.error('Error fetching payments with filters:', error);
      throw new Error(`Failed to fetch payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate payment analytics for a property
   */
  async getPropertyPaymentAnalytics(propertyId: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: { propertyId },
      });

      const analytics = {
        totalPayments: payments.length,
        totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
        completedPayments: payments.filter(p => p.status === 'completed').length,
        failedPayments: payments.filter(p => p.status === 'failed').length,
        pendingPayments: payments.filter(p => p.status === 'pending' || p.status === 'processing').length,
        totalPlatformFees: payments.reduce((sum, p) => sum + p.platformFee, 0),
        totalAgentCommissions: payments.reduce((sum, p) => sum + p.agentCommission, 0),
        paymentsByType: {
          booking_deposit: payments.filter(p => p.paymentType === 'booking_deposit').length,
          contractual_deposit: payments.filter(p => p.paymentType === 'contractual_deposit').length,
          completion_payment: payments.filter(p => p.paymentType === 'completion_payment').length,
          stage_payment: payments.filter(p => p.paymentType === 'stage_payment').length,
          upgrade_payment: payments.filter(p => p.paymentType === 'upgrade_payment').length,
        },
        lastPaymentDate: payments.length > 0 ? Math.max(...payments.map(p => p.createdAt.getTime())) : null,
      };

      return analytics;
    } catch (error) {
      console.error('Error calculating payment analytics:', error);
      throw new Error(`Failed to calculate analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process refund for a payment
   */
  async processRefund(paymentId: string, refundAmount: number, reason: string) {
    try {
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'refunded',
          metadata: {
            ...(payment.metadata as any || {}),
            refundAmount,
            refundReason: reason,
            refundedAt: new Date().toISOString(),
          } as Prisma.JsonObject,
          updatedAt: new Date(),
        },
      });

      console.log(`💸 Refund processed: ${payment.id} - Amount: €${refundAmount / 100}`);
      return payment;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error(`Failed to process refund: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get payment summary for dashboard
   */
  async getPaymentSummary(dateFrom?: Date, dateTo?: Date) {
    try {
      const where: Prisma.PaymentWhereInput = {};
      
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = dateFrom;
        if (dateTo) where.createdAt.lte = dateTo;
      }

      const [
        totalPayments,
        completedPayments,
        totalAmount,
        completedAmount,
        platformFees,
        agentCommissions
      ] = await Promise.all([
        prisma.payment.count({ where }),
        prisma.payment.count({ where: { ...where, status: 'completed' } }),
        prisma.payment.aggregate({ where, _sum: { amount: true } }),
        prisma.payment.aggregate({ where: { ...where, status: 'completed' }, _sum: { amount: true } }),
        prisma.payment.aggregate({ where: { ...where, status: 'completed' }, _sum: { platformFee: true } }),
        prisma.payment.aggregate({ where: { ...where, status: 'completed' }, _sum: { agentCommission: true } }),
      ]);

      return {
        totalPayments,
        completedPayments,
        failedPayments: totalPayments - completedPayments,
        totalAmount: totalAmount._sum.amount || 0,
        completedAmount: completedAmount._sum.amount || 0,
        totalPlatformFees: platformFees._sum.platformFee || 0,
        totalAgentCommissions: agentCommissions._sum.agentCommission || 0,
        conversionRate: totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0,
      };
    } catch (error) {
      console.error('Error getting payment summary:', error);
      throw new Error(`Failed to get payment summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const paymentsService = new PaymentsService();

// Export types
export type { CreatePaymentRequest, UpdatePaymentRequest, PaymentFilter };