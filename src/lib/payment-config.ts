/**
 * Unified Payment Configuration System
 * Standardizes payment types, calculations, and flows across the platform
 */

export enum PaymentType {
  RESERVATION_FEE = 'reservation_fee',
  BOOKING_DEPOSIT = 'booking_deposit', 
  CONTRACTUAL_DEPOSIT = 'contractual_deposit',
  STAGE_PAYMENT = 'stage_payment',
  COMPLETION_PAYMENT = 'completion_payment',
  HTB_BENEFIT = 'htb_benefit',
  UPGRADE_PAYMENT = 'upgrade_payment'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  SEPA_DEBIT = 'sepa_debit',
  ESCROW = 'escrow'
}

export interface PaymentConfiguration {
  reservationFee: {
    percentage: number;
    minimumAmount: number;
    maximumAmount: number;
  };
  bookingDeposit: {
    percentage: number;
    minimumAmount: number;
  };
  contractualDeposit: {
    percentage: number;
    htbDeductible: boolean;
  };
  htbBenefit: {
    maximumAmount: number;
    eligibilityThreshold: number;
  };
}

export const DEFAULT_PAYMENT_CONFIG: PaymentConfiguration = {
  reservationFee: {
    percentage: 0.01, // 1%
    minimumAmount: 500, // €500
    maximumAmount: 5000 // €5,000
  },
  bookingDeposit: {
    percentage: 0.05, // 5%
    minimumAmount: 1000 // €1,000
  },
  contractualDeposit: {
    percentage: 0.10, // 10%
    htbDeductible: true
  },
  htbBenefit: {
    maximumAmount: 30000, // €30,000
    eligibilityThreshold: 500000 // €500,000
  }
};

export interface PaymentBreakdown {
  propertyPrice: number;
  reservationFee: number;
  bookingDeposit: number;
  contractualDeposit: number;
  htbBenefit: number;
  netDepositRequired: number;
  completionAmount: number;
  totalPaid: number;
  estimatedMortgage: number;
}

export interface PaymentCalculationOptions {
  propertyPrice: number;
  htbEligible: boolean;
  mortgageAmount?: number;
  customDepositPercentage?: number;
  config?: Partial<PaymentConfiguration>;
}

/**
 * Calculate standardized payment breakdown for any property
 */
export function calculatePaymentBreakdown(options: PaymentCalculationOptions): PaymentBreakdown {
  const {
    propertyPrice,
    htbEligible,
    mortgageAmount,
    customDepositPercentage,
    config = {}
  } = options;

  const paymentConfig = { ...DEFAULT_PAYMENT_CONFIG, ...config };

  // Calculate reservation fee (1% with min/max limits)
  const reservationFee = Math.max(
    paymentConfig.reservationFee.minimumAmount,
    Math.min(
      paymentConfig.reservationFee.maximumAmount,
      propertyPrice * paymentConfig.reservationFee.percentage
    )
  );

  // Calculate booking deposit (5% minimum)
  const bookingDepositPercentage = customDepositPercentage || paymentConfig.bookingDeposit.percentage;
  const bookingDeposit = Math.max(
    paymentConfig.bookingDeposit.minimumAmount,
    propertyPrice * bookingDepositPercentage
  );

  // Calculate contractual deposit (10% standard)
  const contractualDeposit = propertyPrice * paymentConfig.contractualDeposit.percentage;

  // Calculate HTB benefit if eligible
  const htbBenefit = htbEligible && propertyPrice <= paymentConfig.htbBenefit.eligibilityThreshold
    ? Math.min(paymentConfig.htbBenefit.maximumAmount, propertyPrice * 0.10)
    : 0;

  // Calculate net deposit required (contractual deposit minus HTB benefit)
  const netDepositRequired = paymentConfig.contractualDeposit.htbDeductible
    ? contractualDeposit - htbBenefit
    : contractualDeposit;

  // Calculate completion amount (property price minus deposits and HTB)
  const completionAmount = propertyPrice - contractualDeposit;

  // Calculate total paid by buyer (excluding HTB benefit)
  const totalPaid = propertyPrice - htbBenefit;

  // Estimate mortgage amount
  const estimatedMortgage = mortgageAmount || (propertyPrice - netDepositRequired - htbBenefit);

  return {
    propertyPrice,
    reservationFee,
    bookingDeposit,
    contractualDeposit,
    htbBenefit,
    netDepositRequired,
    completionAmount,
    totalPaid,
    estimatedMortgage
  };
}

/**
 * Get payment type display information
 */
export function getPaymentTypeInfo(paymentType: PaymentType): {
  label: string;
  description: string;
  isRefundable: boolean;
  maxDuration?: string;
} {
  switch (paymentType) {
    case PaymentType.RESERVATION_FEE:
      return {
        label: 'Reservation Fee',
        description: 'Secures your interest in the property for 14 days',
        isRefundable: true,
        maxDuration: '14 days'
      };
    case PaymentType.BOOKING_DEPOSIT:
      return {
        label: 'Booking Deposit',
        description: 'Initial deposit to secure the property',
        isRefundable: false
      };
    case PaymentType.CONTRACTUAL_DEPOSIT:
      return {
        label: 'Contractual Deposit',
        description: '10% deposit as per purchase contract',
        isRefundable: false
      };
    case PaymentType.STAGE_PAYMENT:
      return {
        label: 'Stage Payment',
        description: 'Payment tied to construction milestones',
        isRefundable: false
      };
    case PaymentType.COMPLETION_PAYMENT:
      return {
        label: 'Completion Payment',
        description: 'Final payment on property completion',
        isRefundable: false
      };
    case PaymentType.HTB_BENEFIT:
      return {
        label: 'Help to Buy Benefit',
        description: 'Government assistance for first-time buyers',
        isRefundable: false
      };
    case PaymentType.UPGRADE_PAYMENT:
      return {
        label: 'Upgrade Payment',
        description: 'Payment for property upgrades and customizations',
        isRefundable: false
      };
    default:
      return {
        label: 'Payment',
        description: 'Property payment',
        isRefundable: false
      };
  }
}

/**
 * Validate payment amount for given type
 */
export function validatePaymentAmount(
  paymentType: PaymentType,
  amount: number,
  propertyPrice: number,
  config: PaymentConfiguration = DEFAULT_PAYMENT_CONFIG
): { isValid: boolean; error?: string } {
  switch (paymentType) {
    case PaymentType.RESERVATION_FEE:
      const minReservation = config.reservationFee.minimumAmount;
      const maxReservation = config.reservationFee.maximumAmount;
      if (amount < minReservation) {
        return { isValid: false, error: `Minimum reservation fee is €${minReservation.toLocaleString()}` };
      }
      if (amount > maxReservation) {
        return { isValid: false, error: `Maximum reservation fee is €${maxReservation.toLocaleString()}` };
      }
      break;

    case PaymentType.BOOKING_DEPOSIT:
      const minBooking = config.bookingDeposit.minimumAmount;
      const recommendedBooking = propertyPrice * config.bookingDeposit.percentage;
      if (amount < minBooking) {
        return { isValid: false, error: `Minimum booking deposit is €${minBooking.toLocaleString()}` };
      }
      if (amount < recommendedBooking * 0.6) { // Allow 40% below recommended
        return { isValid: false, error: `Recommended minimum is €${recommendedBooking.toLocaleString()} (5% of property price)` };
      }
      break;

    case PaymentType.CONTRACTUAL_DEPOSIT:
      const expectedContractual = propertyPrice * config.contractualDeposit.percentage;
      if (Math.abs(amount - expectedContractual) > 1000) { // Allow €1k variance
        return { isValid: false, error: `Contractual deposit should be €${expectedContractual.toLocaleString()} (10% of property price)` };
      }
      break;

    case PaymentType.HTB_BENEFIT:
      if (amount > config.htbBenefit.maximumAmount) {
        return { isValid: false, error: `Maximum HTB benefit is €${config.htbBenefit.maximumAmount.toLocaleString()}` };
      }
      if (propertyPrice > config.htbBenefit.eligibilityThreshold) {
        return { isValid: false, error: `Property price exceeds HTB eligibility threshold of €${config.htbBenefit.eligibilityThreshold.toLocaleString()}` };
      }
      break;
  }

  return { isValid: true };
}

/**
 * Format payment amount for display
 */
export function formatPaymentAmount(amount: number, includeSymbol: boolean = true): string {
  const formatter = new Intl.NumberFormat('en-IE', {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: 'EUR',
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
}

/**
 * Get payment method display information
 */
export function getPaymentMethodInfo(method: PaymentMethod): {
  label: string;
  processingTime: string;
  fees: string;
  maxAmount?: number;
} {
  switch (method) {
    case PaymentMethod.CREDIT_CARD:
      return {
        label: 'Credit Card',
        processingTime: 'Instant',
        fees: '2.9% + €0.30',
        maxAmount: 50000
      };
    case PaymentMethod.DEBIT_CARD:
      return {
        label: 'Debit Card',
        processingTime: 'Instant',
        fees: '1.4% + €0.25',
        maxAmount: 25000
      };
    case PaymentMethod.BANK_TRANSFER:
      return {
        label: 'Bank Transfer',
        processingTime: '1-3 business days',
        fees: 'No fees'
      };
    case PaymentMethod.SEPA_DEBIT:
      return {
        label: 'SEPA Direct Debit',
        processingTime: '2-3 business days',
        fees: '€0.35'
      };
    case PaymentMethod.ESCROW:
      return {
        label: 'Escrow Account',
        processingTime: 'Instant to escrow',
        fees: '0.5% of amount'
      };
    default:
      return {
        label: 'Unknown',
        processingTime: 'Unknown',
        fees: 'Unknown'
      };
  }
}