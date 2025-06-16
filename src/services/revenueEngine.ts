/**
 * PROP Revenue Engine - Captures fees at every transaction point
 * Designed to maximize platform profitability while providing value
 */

import { EventEmitter } from 'events';

export enum SubscriptionTier {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL', 
  ENTERPRISE = 'ENTERPRISE'
}

export enum FeeType {
  TRANSACTION_FEE = 'TRANSACTION_FEE',
  PROCESSING_FEE = 'PROCESSING_FEE',
  PROP_CHOICE_COMMISSION = 'PROP_CHOICE_COMMISSION',
  TENDER_SUBMISSION_FEE = 'TENDER_SUBMISSION_FEE',
  SUBSCRIPTION_FEE = 'SUBSCRIPTION_FEE',
  PREMIUM_LISTING_FEE = 'PREMIUM_LISTING_FEE',
  AI_ANALYSIS_FEE = 'AI_ANALYSIS_FEE'
}

interface FeeCalculation {
  feeType: FeeType;
  baseAmount: number;
  feeAmount: number;
  feePercentage?: number;
  description: string;
  metadata?: Record<string, any>;
}

interface RevenueEvent {
  id: string;
  transactionId?: string;
  developerId: string;
  feeType: FeeType;
  amount: number;
  currency: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export class RevenueEngine {
  private eventBus = new EventEmitter();
  
  // Subscription tier pricing
  private subscriptionPricing = {
    [SubscriptionTier.STARTER]: {
      monthly: 99,
      annual: 990, // 2 months free
      features: ['1 development', '5 users', '10GB storage', '1K API calls'],
      limits: { developments: 1, users: 5, storage: 10, apiCalls: 1000 }
    },
    [SubscriptionTier.PROFESSIONAL]: {
      monthly: 499,
      annual: 4990, // 2 months free
      features: ['5 developments', '25 users', '100GB storage', '10K API calls', 'Priority support'],
      limits: { developments: 5, users: 25, storage: 100, apiCalls: 10000 }
    },
    [SubscriptionTier.ENTERPRISE]: {
      monthly: 2499,
      annual: 24990, // 2 months free
      features: ['Unlimited developments', 'Unlimited users', '1TB storage', '100K API calls', 'White-label', 'Custom integrations'],
      limits: { developments: -1, users: -1, storage: 1024, apiCalls: 100000 }
    }
  };

  // Fee rate configuration - designed to maximize revenue while staying competitive
  private feeRates = {
    // Transaction fees as percentage of transaction value
    initialDeposit: 0.025, // 2.5% on €500 = €12.50
    fullDeposit: 0.02, // 2% on €4,500 = €90
    finalTransaction: 0.015, // 1.5% on property price
    
    // PROP Choice commission rates
    propChoiceFurniture: 0.15, // 15% commission on furniture sales
    propChoiceCustomization: 0.12, // 12% commission on customizations
    
    // Tender system fees
    tenderSubmissionFee: 25, // €25 per tender submission
    premiumListingFee: 100, // €100/month for premium contractor listing
    aiAnalysisFee: 50, // €50 per AI tender analysis
    
    // Processing fees
    cardProcessingFee: 0.029, // 2.9% + €0.30 per card transaction
    bankTransferFee: 2.50 // Flat €2.50 per bank transfer
  };

  /**
   * Calculate transaction fees for property purchases
   */
  async calculateTransactionFees(
    transactionType: 'initial_deposit' | 'full_deposit' | 'final_purchase',
    amount: number,
    paymentMethod: 'card' | 'bank_transfer' = 'card'
  ): Promise<FeeCalculation[]> {
    const fees: FeeCalculation[] = [];

    // Base transaction fee
    let transactionFeeRate = 0;
    switch (transactionType) {
      case 'initial_deposit':
        transactionFeeRate = this.feeRates.initialDeposit;
        break;
      case 'full_deposit':
        transactionFeeRate = this.feeRates.fullDeposit;
        break;
      case 'final_purchase':
        transactionFeeRate = this.feeRates.finalTransaction;
        break;
    }

    const transactionFee = amount * transactionFeeRate;
    fees.push({
      feeType: FeeType.TRANSACTION_FEE,
      baseAmount: amount,
      feeAmount: transactionFee,
      feePercentage: transactionFeeRate * 100,
      description: `PROP platform transaction fee (${(transactionFeeRate * 100).toFixed(1)}%)`,
      metadata: { transactionType, paymentMethod }
    });

    // Payment processing fee
    let processingFee = 0;
    if (paymentMethod === 'card') {
      processingFee = (amount * this.feeRates.cardProcessingFee) + 0.30;
    } else {
      processingFee = this.feeRates.bankTransferFee;
    }

    fees.push({
      feeType: FeeType.PROCESSING_FEE,
      baseAmount: amount,
      feeAmount: processingFee,
      description: `Payment processing fee (${paymentMethod})`,
      metadata: { paymentMethod }
    });

    return fees;
  }

  /**
   * Calculate PROP Choice commission fees
   */
  async calculatePropChoiceCommission(
    itemType: 'furniture' | 'customization',
    itemPrice: number,
    buyerId: string,
    developmentId: string
  ): Promise<FeeCalculation> {
    const commissionRate = itemType === 'furniture' 
      ? this.feeRates.propChoiceFurniture 
      : this.feeRates.propChoiceCustomization;

    const commissionAmount = itemPrice * commissionRate;

    return {
      feeType: FeeType.PROP_CHOICE_COMMISSION,
      baseAmount: itemPrice,
      feeAmount: commissionAmount,
      feePercentage: commissionRate * 100,
      description: `PROP Choice ${itemType} commission (${(commissionRate * 100).toFixed(0)}%)`,
      metadata: { itemType, buyerId, developmentId }
    };
  }

  /**
   * Calculate tender system fees
   */
  async calculateTenderFees(
    feeType: 'submission' | 'premium_listing' | 'ai_analysis',
    contractorId: string,
    tenderValue?: number
  ): Promise<FeeCalculation> {
    let feeAmount = 0;
    let description = '';

    switch (feeType) {
      case 'submission':
        feeAmount = this.feeRates.tenderSubmissionFee;
        description = 'Tender submission fee';
        break;
      case 'premium_listing':
        feeAmount = this.feeRates.premiumListingFee;
        description = 'Premium contractor listing (monthly)';
        break;
      case 'ai_analysis':
        feeAmount = this.feeRates.aiAnalysisFee;
        description = 'AI tender analysis and ranking';
        break;
    }

    return {
      feeType: feeType === 'submission' ? FeeType.TENDER_SUBMISSION_FEE : 
               feeType === 'premium_listing' ? FeeType.PREMIUM_LISTING_FEE : 
               FeeType.AI_ANALYSIS_FEE,
      baseAmount: tenderValue || 0,
      feeAmount,
      description,
      metadata: { contractorId, tenderValue }
    };
  }

  /**
   * Process fee collection - integrates with payment systems
   */
  async collectFees(
    fees: FeeCalculation[],
    transactionId: string,
    developerId: string,
    metadata: Record<string, any> = {}
  ): Promise<RevenueEvent[]> {
    const revenueEvents: RevenueEvent[] = [];

    for (const fee of fees) {
      try {
        // In production, this would integrate with Stripe, payment processors, etc.
        const revenueEvent: RevenueEvent = {
          id: `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          transactionId,
          developerId,
          feeType: fee.feeType,
          amount: fee.feeAmount,
          currency: 'EUR',
          timestamp: new Date(),
          metadata: { ...fee.metadata, ...metadata }
        };

        // Store revenue event (in production: database)
        revenueEvents.push(revenueEvent);

        // Emit revenue event for analytics
        this.eventBus.emit('revenue.collected', revenueEvent);

        console.log(`Revenue collected: ${fee.description} - €${fee.feeAmount.toFixed(2)}`, {
          revenueEventId: revenueEvent.id,
          transactionId,
          developerId
        });

      } catch (error) {
        console.error('Failed to collect fee', { fee, error });
        // In production: implement retry logic, alerting, etc.
      }
    }

    return revenueEvents;
  }

  /**
   * Check subscription limits and usage
   */
  async checkSubscriptionLimits(
    developerId: string,
    tier: SubscriptionTier,
    usageType: 'developments' | 'users' | 'storage' | 'apiCalls',
    currentUsage: number
  ): Promise<{ allowed: boolean; limit: number; usage: number; upgradeRequired?: boolean }> {
    const limits = this.subscriptionPricing[tier].limits;
    const limit = limits[usageType];

    if (limit === -1) { // Unlimited
      return { allowed: true, limit: -1, usage: currentUsage };
    }

    const allowed = currentUsage < limit;
    const upgradeRequired = !allowed;

    return {
      allowed,
      limit,
      usage: currentUsage,
      upgradeRequired
    };
  }

  /**
   * Calculate subscription upgrade pricing
   */
  async calculateUpgradePrice(
    currentTier: SubscriptionTier,
    targetTier: SubscriptionTier,
    billingPeriod: 'monthly' | 'annual' = 'monthly'
  ): Promise<{ priceDifference: number; newPrice: number; savings?: number }> {
    const currentPrice = this.subscriptionPricing[currentTier][billingPeriod];
    const newPrice = this.subscriptionPricing[targetTier][billingPeriod];
    const priceDifference = newPrice - currentPrice;

    let savings = 0;
    if (billingPeriod === 'annual') {
      const monthlyEquivalent = this.subscriptionPricing[targetTier].monthly * 12;
      savings = monthlyEquivalent - newPrice;
    }

    return {
      priceDifference,
      newPrice,
      savings: billingPeriod === 'annual' ? savings : undefined
    };
  }

  /**
   * Get subscription pricing for display
   */
  getSubscriptionPricing() {
    return this.subscriptionPricing;
  }

  /**
   * Get fee rates for transparency/display
   */
  getFeeRates() {
    return this.feeRates;
  }

  /**
   * Subscribe to revenue events for analytics
   */
  onRevenueEvent(callback: (event: RevenueEvent) => void) {
    this.eventBus.on('revenue.collected', callback);
  }

  /**
   * Get daily/monthly/yearly revenue analytics
   */
  async getRevenueAnalytics(
    developerId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<{
    totalRevenue: number;
    revenueByType: Record<FeeType, number>;
    transactionCount: number;
    averageTransactionValue: number;
  }> {
    // In production: query actual revenue data from database
    // For now, return mock analytics
    return {
      totalRevenue: 25430.50,
      revenueByType: {
        [FeeType.TRANSACTION_FEE]: 15200.00,
        [FeeType.PROCESSING_FEE]: 3450.25,
        [FeeType.PROP_CHOICE_COMMISSION]: 4200.75,
        [FeeType.SUBSCRIPTION_FEE]: 2499.00,
        [FeeType.TENDER_SUBMISSION_FEE]: 80.50,
        [FeeType.PREMIUM_LISTING_FEE]: 0,
        [FeeType.AI_ANALYSIS_FEE]: 0
      },
      transactionCount: 147,
      averageTransactionValue: 173.07
    };
  }
}

// Export singleton instance
export const revenueEngine = new RevenueEngine();