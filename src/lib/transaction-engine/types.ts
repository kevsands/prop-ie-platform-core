// Enums
export enum PaymentType {
  BOOKING_DEPOSIT = 'BOOKING_DEPOSIT',
  CONTRACTUAL_DEPOSIT = 'CONTRACTUAL_DEPOSIT',
  CUSTOMIZATION_PAYMENT = 'CUSTOMIZATION_PAYMENT',
  STAGE_PAYMENT = 'STAGE_PAYMENT',
  FINAL_PAYMENT = 'FINAL_PAYMENT',
  MORTGAGE_DRAWDOWN = 'MORTGAGE_DRAWDOWN'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
  CRYPTO = 'CRYPTO'
}

// Payment interface
export interface Payment {
  id: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string;
  processedAt?: Date;
  metadata?: Record<string, any>
  );
}