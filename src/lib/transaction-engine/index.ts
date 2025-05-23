/**
 * Enterprise Transaction Engine - Core Architecture
 * Manages complete property purchase lifecycle from search to post-sale
 */

import { EventEmitter } from 'events';
import { prisma } from '@/lib/prisma';
import type { PaymentType, PaymentStatus, PaymentMethod, Payment } from './types';

// Re-export types and enums from types module
export { PaymentType, PaymentStatus, PaymentMethod } from './types';
export type { Payment } from './types';

// Transaction States
export enum TransactionState {
  INITIATED = 'INITIATED',
  KYC_PENDING = 'KYC_PENDING', 
  KYC_VERIFIED = 'KYC_VERIFIED',
  BOOKING_DEPOSIT_PENDING = 'BOOKING_DEPOSIT_PENDING',
  BOOKING_DEPOSIT_PAID = 'BOOKING_DEPOSIT_PAID',
  HTB_APPLICATION_SUBMITTED = 'HTB_APPLICATION_SUBMITTED',
  HTB_APPROVED = 'HTB_APPROVED',
  PROPERTY_SELECTED = 'PROPERTY_SELECTED',
  CUSTOMIZATION_IN_PROGRESS = 'CUSTOMIZATION_IN_PROGRESS',
  CUSTOMIZATION_FINALIZED = 'CUSTOMIZATION_FINALIZED',
  CONTRACTUAL_DEPOSIT_PENDING = 'CONTRACTUAL_DEPOSIT_PENDING',
  CONTRACTUAL_DEPOSIT_PAID = 'CONTRACTUAL_DEPOSIT_PAID',
  CONTRACTS_ISSUED = 'CONTRACTS_ISSUED',
  CONTRACTS_SIGNED = 'CONTRACTS_SIGNED',
  CONSTRUCTION_IN_PROGRESS = 'CONSTRUCTION_IN_PROGRESS',
  SNAGGING_SCHEDULED = 'SNAGGING_SCHEDULED',
  SNAGGING_COMPLETED = 'SNAGGING_COMPLETED',
  MORTGAGE_DRAWDOWN_PENDING = 'MORTGAGE_DRAWDOWN_PENDING',
  MORTGAGE_DRAWDOWN_COMPLETE = 'MORTGAGE_DRAWDOWN_COMPLETE',
  HANDOVER_SCHEDULED = 'HANDOVER_SCHEDULED',
  HANDOVER_COMPLETE = 'HANDOVER_COMPLETE',
  POST_SALE_ACTIVE = 'POST_SALE_ACTIVE',
  TRANSACTION_COMPLETE = 'TRANSACTION_COMPLETE',
  CANCELLED = 'CANCELLED'
}

// Transaction Events
export enum TransactionEvent {
  STATE_CHANGED = 'state_changed',
  PAYMENT_RECEIVED = 'payment_received',
  DOCUMENT_UPLOADED = 'document_uploaded',
  KYC_VERIFIED = 'kyc_verified',
  HTB_STATUS_UPDATED = 'htb_status_updated',
  PROPERTY_SELECTED = 'property_selected',
  CUSTOMIZATION_UPDATED = 'customization_updated',
  CONTRACT_SIGNED = 'contract_signed',
  SNAG_REPORTED = 'snag_reported',
  SNAG_RESOLVED = 'snag_resolved',
  MILESTONE_REACHED = 'milestone_reached',
  NOTIFICATION_SENT = 'notification_sent',
  ERROR_OCCURRED = 'error_occurred'
}

// Core Transaction Data
export interface Transaction {
  id: string;
  buyerId: string;
  propertyId: string;
  developerId: string;
  agentId?: string;
  solicitorId?: string;
  state: TransactionState;
  metadata: Record<string, any>\n  );
  timeline: TimelineEntry[];
  documents: Document[];
  payments: Payment[];
  stakeholders: Stakeholder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEntry {
  id: string;
  timestamp: Date;
  event: string;
  description: string;
  actor: string;
  metadata?: Record<string, any>\n  );
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  verified: boolean;
  metadata?: Record<string, any>\n  );
}

export interface Stakeholder {
  id: string;
  type: StakeholderType;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  notificationPreferences: NotificationPreference[];
}

// Enums
export enum DocumentType {
  IDENTITY = 'IDENTITY',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  BANK_STATEMENT = 'BANK_STATEMENT',
  EMPLOYMENT_LETTER = 'EMPLOYMENT_LETTER',
  HTB_APPLICATION = 'HTB_APPLICATION',
  HTB_APPROVAL = 'HTB_APPROVAL',
  CONTRACT = 'CONTRACT',
  SIGNED_CONTRACT = 'SIGNED_CONTRACT',
  SNAG_LIST = 'SNAG_LIST',
  COMPLETION_CERT = 'COMPLETION_CERT',
  WARRANTY = 'WARRANTY'
}

export enum StakeholderType {
  BUYER = 'BUYER',
  DEVELOPER = 'DEVELOPER',
  AGENT = 'AGENT',
  SOLICITOR = 'SOLICITOR',
  CONTRACTOR = 'CONTRACTOR',
  LENDER = 'LENDER'
}

export interface NotificationPreference {
  channel: 'email' | 'sms' | 'push' | 'in_app';
  enabled: boolean;
  events: TransactionEvent[];
}

/**
 * Main Transaction Engine Class
 */
export class TransactionEngine extends EventEmitter {
  private static instance: TransactionEngine;

  private constructor() {
    super();
  }

  static getInstance(): TransactionEngine {
    if (!TransactionEngine.instance) {
      TransactionEngine.instance = new TransactionEngine();
    }
    return TransactionEngine.instance;
  }

  /**
   * Create a new transaction
   */
  async createTransaction(data: {
    buyerId: string;
    propertyId: string;
    developerId: string;
    agentId?: string;
    solicitorId?: string;
  }): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data: {
        buyerId: data.buyerId,
        propertyId: data.propertyId,
        developerId: data.developerId,
        agentId: data.agentId,
        solicitorId: data.solicitorId,
        state: TransactionState.INITIATED,
        metadata: {},
        timeline: {
          create: [{
            event: 'TRANSACTION_INITIATED',
            description: 'Property purchase journey started',
            actor: data.buyerId,
            timestamp: new Date()
          }]
        }
      },
      include: {
        timeline: true,
        documents: true,
        payments: true,
        stakeholders: true
      }
    });

    this.emit(TransactionEvent.STATE_CHANGED, {
      transactionId: transaction.id,
      oldState: null,
      newState: TransactionState.INITIATED,
      actor: data.buyerId
    });

    return transaction as any;
  }

  /**
   * Update transaction state
   */
  async updateState(
    transactionId: string, 
    newState: TransactionState,
    actor: string,
    metadata?: Record<string, any>
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const oldState = transaction.state as TransactionState;

    // Validate state transition
    if (!this.isValidTransition(oldStatenewState)) {
      throw new Error(`Invalid state transition from ${oldState} to ${newState}`);
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        state: newState,
        updatedAt: new Date(),
        timeline: {
          create: [{
            event: `STATE_CHANGED_TO_${newState}`,
            description: `Transaction state changed from ${oldState} to ${newState}`,
            actor,
            timestamp: new Date(),
            metadata
          }]
        }
      },
      include: {
        timeline: true,
        documents: true,
        payments: true,
        stakeholders: true
      }
    });

    this.emit(TransactionEvent.STATE_CHANGED, {
      transactionId,
      oldState,
      newState,
      actor,
      metadata
    });

    return updated as any;
  }

  /**
   * Check if state transition is valid
   */
  private isValidTransition(from: TransactionState, to: TransactionState): boolean {
    // Define valid state transitions
    const validTransitions: Record<TransactionState, TransactionState[]> = {
      [TransactionState.INITIATED]: [TransactionState.KYC_PENDING, TransactionState.CANCELLED],
      [TransactionState.KYC_PENDING]: [TransactionState.KYC_VERIFIED, TransactionState.CANCELLED],
      [TransactionState.KYC_VERIFIED]: [TransactionState.BOOKING_DEPOSIT_PENDING, TransactionState.CANCELLED],
      [TransactionState.BOOKING_DEPOSIT_PENDING]: [TransactionState.BOOKING_DEPOSIT_PAID, TransactionState.CANCELLED],
      [TransactionState.BOOKING_DEPOSIT_PAID]: [TransactionState.HTB_APPLICATION_SUBMITTED, TransactionState.PROPERTY_SELECTED, TransactionState.CANCELLED],
      [TransactionState.HTB_APPLICATION_SUBMITTED]: [TransactionState.HTB_APPROVED, TransactionState.PROPERTY_SELECTED, TransactionState.CANCELLED],
      [TransactionState.HTB_APPROVED]: [TransactionState.PROPERTY_SELECTED, TransactionState.CANCELLED],
      [TransactionState.PROPERTY_SELECTED]: [TransactionState.CUSTOMIZATION_IN_PROGRESS, TransactionState.CONTRACTUAL_DEPOSIT_PENDING, TransactionState.CANCELLED],
      [TransactionState.CUSTOMIZATION_IN_PROGRESS]: [TransactionState.CUSTOMIZATION_FINALIZED, TransactionState.CANCELLED],
      [TransactionState.CUSTOMIZATION_FINALIZED]: [TransactionState.CONTRACTUAL_DEPOSIT_PENDING, TransactionState.CANCELLED],
      [TransactionState.CONTRACTUAL_DEPOSIT_PENDING]: [TransactionState.CONTRACTUAL_DEPOSIT_PAID, TransactionState.CANCELLED],
      [TransactionState.CONTRACTUAL_DEPOSIT_PAID]: [TransactionState.CONTRACTS_ISSUED, TransactionState.CANCELLED],
      [TransactionState.CONTRACTS_ISSUED]: [TransactionState.CONTRACTS_SIGNED, TransactionState.CANCELLED],
      [TransactionState.CONTRACTS_SIGNED]: [TransactionState.CONSTRUCTION_IN_PROGRESS, TransactionState.CANCELLED],
      [TransactionState.CONSTRUCTION_IN_PROGRESS]: [TransactionState.SNAGGING_SCHEDULED, TransactionState.CANCELLED],
      [TransactionState.SNAGGING_SCHEDULED]: [TransactionState.SNAGGING_COMPLETED, TransactionState.CANCELLED],
      [TransactionState.SNAGGING_COMPLETED]: [TransactionState.MORTGAGE_DRAWDOWN_PENDING, TransactionState.CANCELLED],
      [TransactionState.MORTGAGE_DRAWDOWN_PENDING]: [TransactionState.MORTGAGE_DRAWDOWN_COMPLETE, TransactionState.CANCELLED],
      [TransactionState.MORTGAGE_DRAWDOWN_COMPLETE]: [TransactionState.HANDOVER_SCHEDULED, TransactionState.CANCELLED],
      [TransactionState.HANDOVER_SCHEDULED]: [TransactionState.HANDOVER_COMPLETE, TransactionState.CANCELLED],
      [TransactionState.HANDOVER_COMPLETE]: [TransactionState.POST_SALE_ACTIVE],
      [TransactionState.POST_SALE_ACTIVE]: [TransactionState.TRANSACTION_COMPLETE],
      [TransactionState.TRANSACTION_COMPLETE]: [],
      [TransactionState.CANCELLED]: []
    };

    return validTransitions[from]?.includes(to) || false;
  }

  /**
   * Add payment to transaction
   */
  async addPayment(transactionId: string, payment: Omit<Payment, 'id'>): Promise<Payment> {
    const savedPayment = await prisma.payment.create({
      data: {
        ...payment,
        transactionId,
        processedAt: payment.status === PaymentStatus.COMPLETED ? new Date() : undefined
      }
    });

    await this.addTimelineEntry(transactionId, {
      event: 'PAYMENT_ADDED',
      description: `${payment.type} payment of ${payment.amount} ${payment.currency} added`,
      actor: 'system',
      metadata: { paymentId: savedPayment.id }
    });

    this.emit(TransactionEvent.PAYMENT_RECEIVED, {
      transactionId,
      payment: savedPayment
    });

    return savedPayment as any;
  }

  /**
   * Upload document to transaction
   */
  async uploadDocument(
    transactionId: string,
    document: Omit<Document, 'id' | 'uploadedAt'>
  ): Promise<Document> {
    const savedDocument = await prisma.document.create({
      data: {
        ...document,
        transactionId,
        uploadedAt: new Date()
      }
    });

    await this.addTimelineEntry(transactionId, {
      event: 'DOCUMENT_UPLOADED',
      description: `${document.type} document uploaded: ${document.name}`,
      actor: document.uploadedBy,
      metadata: { documentId: savedDocument.id }
    });

    this.emit(TransactionEvent.DOCUMENT_UPLOADED, {
      transactionId,
      document: savedDocument
    });

    return savedDocument as any;
  }

  /**
   * Add timeline entry
   */
  private async addTimelineEntry(
    transactionId: string,
    entry: Omit<TimelineEntry, 'id'>
  ): Promise<TimelineEntry> {
    return prisma.timelineEntry.create({
      data: {
        ...entry,
        transactionId
      }
    }) as any;
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        timeline: {
          orderBy: { timestamp: 'desc' }
        },
        documents: true,
        payments: true,
        stakeholders: true
      }
    }) as any;
  }

  /**
   * Get transactions for a user
   */
  async getUserTransactions(userId: string, role: StakeholderType): Promise<Transaction[]> {
    const where: any = {};

    switch (role) {
      case StakeholderType.BUYER:
        where.buyerId = userId;
        break;
      case StakeholderType.DEVELOPER:
        where.developerId = userId;
        break;
      case StakeholderType.AGENT:
        where.agentId = userId;
        break;
      case StakeholderType.SOLICITOR:
        where.solicitorId = userId;
        break;
    }

    return prisma.transaction.findMany({
      where,
      include: {
        timeline: {
          orderBy: { timestamp: 'desc' },
          take: 5
        },
        documents: true,
        payments: true,
        stakeholders: true
      },
      orderBy: { updatedAt: 'desc' }
    }) as any;
  }
}

// Export singleton instance
export const transactionEngine = TransactionEngine.getInstance();
