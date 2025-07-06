/**
 * Payment Orchestration Service
 * Synchronized payment processing across all stakeholders
 * Handles deposits, HTB payments, mortgage coordination, and completion payments
 */

import { EventEmitter } from 'events';

// Types for payment orchestration
export interface PaymentTransaction {
  id: string;
  transactionNumber: string;
  propertyId: string;
  developmentId: string;
  unitNumber: string;
  buyerId: string;
  
  // Payment details
  type: 'deposit' | 'htb_contribution' | 'mortgage_drawdown' | 'completion' | 'booking_fee' | 'stage_payment';
  amount: number;
  currency: 'EUR';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'disputed';
  
  // Payment method
  paymentMethod: {
    type: 'bank_transfer' | 'card' | 'direct_debit' | 'cheque' | 'solicitor_client_account';
    details: any;
    provider?: string;
  };
  
  // Stakeholder information
  stakeholders: {
    buyer: PaymentParty;
    seller: PaymentParty;
    agent?: PaymentParty;
    solicitor?: PaymentParty;
    lender?: PaymentParty;
    htbOffice?: PaymentParty;
  };
  
  // Timing and deadlines
  dueDate: Date;
  processedAt?: Date;
  completedAt?: Date;
  
  // Related transactions
  parentTransactionId?: string;
  childTransactionIds: string[];
  
  // Compliance and tracking
  compliance: {
    antiMoneyLaundering: boolean;
    sourceOfFunds: string;
    verificationStatus: 'pending' | 'verified' | 'failed';
    riskScore: number; // 0-100
  };
  
  // Automation rules
  automation: {
    autoProcess: boolean;
    triggers: PaymentTrigger[];
    notifications: PaymentNotification[];
  };
  
  metadata: {
    referenceNumber: string;
    description: string;
    tags: string[];
    notes: string;
  };
}

export interface PaymentParty {
  id: string;
  name: string;
  type: 'individual' | 'company' | 'institution';
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    sortCode: string;
    iban: string;
    bic: string;
  };
  email: string;
  phone?: string;
}

export interface PaymentTrigger {
  id: string;
  event: 'contract_signed' | 'mortgage_approved' | 'htb_approved' | 'completion_date' | 'milestone_reached';
  conditions: any[];
  action: 'initiate_payment' | 'request_payment' | 'notify_parties' | 'update_status';
  delay?: number; // hours
}

export interface PaymentNotification {
  id: string;
  recipient: string;
  type: 'email' | 'sms' | 'system';
  template: string;
  trigger: 'payment_due' | 'payment_received' | 'payment_failed' | 'payment_overdue';
  timing: 'immediate' | 'scheduled';
  scheduledFor?: Date;
}

export interface PaymentSchedule {
  id: string;
  propertyId: string;
  totalAmount: number;
  payments: ScheduledPayment[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduledPayment {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  type: PaymentTransaction['type'];
  status: 'pending' | 'processing' | 'completed' | 'overdue' | 'failed';
  dependencies: string[]; // IDs of payments that must complete first
  autoTriggers: PaymentTrigger[];
}

export interface PaymentReconciliation {
  date: Date;
  expectedPayments: PaymentTransaction[];
  receivedPayments: PaymentTransaction[];
  discrepancies: PaymentDiscrepancy[];
  totalExpected: number;
  totalReceived: number;
  reconciliationStatus: 'balanced' | 'unbalanced' | 'pending_review';
}

export interface PaymentDiscrepancy {
  type: 'amount_mismatch' | 'missing_payment' | 'unexpected_payment' | 'timing_issue';
  description: string;
  expectedAmount?: number;
  actualAmount?: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  resolution: 'pending' | 'resolved' | 'escalated';
}

class PaymentOrchestrationService extends EventEmitter {
  private transactions: Map<string, PaymentTransaction> = new Map();
  private schedules: Map<string, PaymentSchedule> = new Map();
  private reconciliations: PaymentReconciliation[] = [];
  
  // Payment providers integration
  private paymentProviders = {
    stripe: { enabled: true, fees: 0.014 }, // 1.4% for card payments
    bankTransfer: { enabled: true, fees: 0.001 }, // 0.1% for bank transfers
    solicitorAccount: { enabled: true, fees: 0 } // No fees for solicitor client accounts
  };

  constructor() {
    super();
    this.initializePaymentTemplates();
    this.startPaymentMonitoring();
  }

  /**
   * Create comprehensive payment schedule for property purchase
   */
  async createPaymentSchedule(
    propertyId: string,
    developmentId: string,
    unitNumber: string,
    purchaseDetails: {
      buyerId: string;
      salePrice: number;
      htbAmount: number;
      mortgageAmount: number;
      depositAmount: number;
      completionDate: Date;
    }
  ): Promise<PaymentSchedule> {
    try {
      const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const payments: ScheduledPayment[] = [];
      
      // 1. Booking fee (immediate)
      payments.push({
        id: 'booking_fee',
        description: 'Booking fee to reserve unit',
        amount: 5000,
        dueDate: new Date(), // Immediate
        type: 'booking_fee',
        status: 'pending',
        dependencies: [],
        autoTriggers: [
          {
            id: 'booking_trigger',
            event: 'contract_signed',
            conditions: [],
            action: 'initiate_payment'
          }
        ]
      });

      // 2. Deposit (within 7 days of reservation)
      const depositDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      payments.push({
        id: 'deposit_payment',
        description: 'Property deposit payment',
        amount: purchaseDetails.depositAmount,
        dueDate: depositDue,
        type: 'deposit',
        status: 'pending',
        dependencies: ['booking_fee'],
        autoTriggers: [
          {
            id: 'deposit_trigger',
            event: 'contract_signed',
            conditions: [],
            action: 'request_payment',
            delay: 24 // 24 hours after contract signing
          }
        ]
      });

      // 3. HTB contribution (coordinated with government)
      if (purchaseDetails.htbAmount > 0) {
        const htbDue = new Date(purchaseDetails.completionDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        payments.push({
          id: 'htb_contribution',
          description: 'Help to Buy scheme contribution',
          amount: purchaseDetails.htbAmount,
          dueDate: htbDue,
          type: 'htb_contribution',
          status: 'pending',
          dependencies: ['deposit_payment'],
          autoTriggers: [
            {
              id: 'htb_trigger',
              event: 'htb_approved',
              conditions: [],
              action: 'initiate_payment'
            }
          ]
        });
      }

      // 4. Mortgage drawdown (on completion)
      if (purchaseDetails.mortgageAmount > 0) {
        payments.push({
          id: 'mortgage_drawdown',
          description: 'Mortgage funds drawdown',
          amount: purchaseDetails.mortgageAmount,
          dueDate: purchaseDetails.completionDate,
          type: 'mortgage_drawdown',
          status: 'pending',
          dependencies: ['deposit_payment'],
          autoTriggers: [
            {
              id: 'mortgage_trigger',
              event: 'completion_date',
              conditions: [],
              action: 'initiate_payment'
            }
          ]
        });
      }

      // 5. Completion payment (balance if any)
      const completionAmount = purchaseDetails.salePrice - 
                              purchaseDetails.depositAmount - 
                              purchaseDetails.htbAmount - 
                              purchaseDetails.mortgageAmount - 
                              5000; // booking fee

      if (completionAmount > 0) {
        payments.push({
          id: 'completion_payment',
          description: 'Final completion payment',
          amount: completionAmount,
          dueDate: purchaseDetails.completionDate,
          type: 'completion',
          status: 'pending',
          dependencies: ['deposit_payment'],
          autoTriggers: [
            {
              id: 'completion_trigger',
              event: 'completion_date',
              conditions: [],
              action: 'request_payment'
            }
          ]
        });
      }

      const schedule: PaymentSchedule = {
        id: scheduleId,
        propertyId,
        totalAmount: purchaseDetails.salePrice,
        payments,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.schedules.set(scheduleId, schedule);
      
      // Emit schedule creation event
      this.emit('schedule-created', schedule);
      
      // Create initial booking fee transaction
      await this.createTransaction({
        propertyId,
        developmentId,
        unitNumber,
        buyerId: purchaseDetails.buyerId,
        type: 'booking_fee',
        amount: 5000,
        dueDate: new Date(),
        description: 'Booking fee to reserve unit',
        autoProcess: false
      });

      console.log(`💳 Payment schedule created for ${unitNumber}: ${payments.length} payments totaling ${this.formatCurrency(purchaseDetails.salePrice)}`);
      
      return schedule;
      
    } catch (error) {
      console.error('Error creating payment schedule:', error);
      throw error;
    }
  }

  /**
   * Create and process individual payment transaction
   */
  async createTransaction(transactionData: {
    propertyId: string;
    developmentId: string;
    unitNumber: string;
    buyerId: string;
    type: PaymentTransaction['type'];
    amount: number;
    dueDate: Date;
    description: string;
    paymentMethod?: any;
    autoProcess?: boolean;
  }): Promise<PaymentTransaction> {
    try {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const transactionNumber = this.generateTransactionNumber(transactionData.developmentId, transactionData.unitNumber);
      
      // Get stakeholder information
      const stakeholders = await this.getStakeholders(transactionData.propertyId, transactionData.buyerId);
      
      const transaction: PaymentTransaction = {
        id: transactionId,
        transactionNumber,
        propertyId: transactionData.propertyId,
        developmentId: transactionData.developmentId,
        unitNumber: transactionData.unitNumber,
        buyerId: transactionData.buyerId,
        type: transactionData.type,
        amount: transactionData.amount,
        currency: 'EUR',
        status: 'pending',
        paymentMethod: transactionData.paymentMethod || {
          type: 'bank_transfer',
          details: {},
          provider: 'bank'
        },
        stakeholders,
        dueDate: transactionData.dueDate,
        childTransactionIds: [],
        compliance: {
          antiMoneyLaundering: false,
          sourceOfFunds: 'To be verified',
          verificationStatus: 'pending',
          riskScore: this.calculateRiskScore(transactionData.amount, transactionData.type)
        },
        automation: {
          autoProcess: transactionData.autoProcess || false,
          triggers: [],
          notifications: this.generateNotifications(transactionData.type, stakeholders)
        },
        metadata: {
          referenceNumber: transactionNumber,
          description: transactionData.description,
          tags: [transactionData.type, transactionData.developmentId],
          notes: ''
        }
      };

      this.transactions.set(transactionId, transaction);
      
      // Send payment request notifications
      await this.sendPaymentNotifications(transaction, 'payment_due');
      
      // Emit transaction created event
      this.emit('transaction-created', transaction);
      
      // Auto-process if enabled and conditions met
      if (transaction.automation.autoProcess) {
        await this.processTransaction(transactionId);
      }
      
      console.log(`💰 Payment transaction created: ${transactionNumber} for ${this.formatCurrency(transactionData.amount)}`);
      
      return transaction;
      
    } catch (error) {
      console.error('Error creating payment transaction:', error);
      throw error;
    }
  }

  /**
   * Process payment transaction
   */
  async processTransaction(transactionId: string): Promise<boolean> {
    try {
      const transaction = this.transactions.get(transactionId);
      if (!transaction) {
        throw new Error(`Transaction ${transactionId} not found`);
      }

      // Update status to processing
      transaction.status = 'processing';
      transaction.processedAt = new Date();
      
      // Simulate payment processing based on type and amount
      const processingResult = await this.simulatePaymentProcessing(transaction);
      
      if (processingResult.success) {
        transaction.status = 'completed';
        transaction.completedAt = new Date();
        
        // Send completion notifications
        await this.sendPaymentNotifications(transaction, 'payment_received');
        
        // Update related legal case
        await this.notifyLegalCase(transaction);
        
        // Update property reservation status
        await this.updatePropertyStatus(transaction);
        
        // Trigger dependent payments
        await this.triggerDependentPayments(transaction);
        
        // Emit completion event
        this.emit('transaction-completed', transaction);
        
        console.log(`✅ Payment completed: ${transaction.transactionNumber}`);
        
      } else {
        transaction.status = 'failed';
        await this.sendPaymentNotifications(transaction, 'payment_failed');
        
        console.log(`❌ Payment failed: ${transaction.transactionNumber} - ${processingResult.reason}`);
      }
      
      return processingResult.success;
      
    } catch (error) {
      console.error('Error processing payment transaction:', error);
      return false;
    }
  }

  /**
   * Get payment status for property
   */
  getPaymentStatus(propertyId: string): {
    totalDue: number;
    totalPaid: number;
    outstanding: PaymentTransaction[];
    completed: PaymentTransaction[];
    overdue: PaymentTransaction[];
  } {
    const propertyTransactions = Array.from(this.transactions.values())
      .filter(txn => txn.propertyId === propertyId);
    
    const totalDue = propertyTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalPaid = propertyTransactions
      .filter(txn => txn.status === 'completed')
      .reduce((sum, txn) => sum + txn.amount, 0);
    
    const outstanding = propertyTransactions.filter(txn => 
      txn.status === 'pending' || txn.status === 'processing'
    );
    
    const completed = propertyTransactions.filter(txn => txn.status === 'completed');
    
    const overdue = propertyTransactions.filter(txn => 
      txn.status === 'pending' && txn.dueDate < new Date()
    );
    
    return {
      totalDue,
      totalPaid,
      outstanding,
      completed,
      overdue
    };
  }

  /**
   * Generate daily payment reconciliation
   */
  async generateReconciliation(date: Date): Promise<PaymentReconciliation> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const expectedPayments = Array.from(this.transactions.values())
      .filter(txn => txn.dueDate >= startOfDay && txn.dueDate <= endOfDay);
    
    const receivedPayments = Array.from(this.transactions.values())
      .filter(txn => txn.completedAt && 
               txn.completedAt >= startOfDay && 
               txn.completedAt <= endOfDay);
    
    const totalExpected = expectedPayments.reduce((sum, txn) => sum + txn.amount, 0);
    const totalReceived = receivedPayments.reduce((sum, txn) => sum + txn.amount, 0);
    
    const discrepancies: PaymentDiscrepancy[] = [];
    
    // Check for missing payments
    expectedPayments.forEach(expected => {
      const received = receivedPayments.find(r => r.id === expected.id);
      if (!received && expected.status !== 'completed') {
        discrepancies.push({
          type: 'missing_payment',
          description: `Expected payment ${expected.transactionNumber} not received`,
          expectedAmount: expected.amount,
          impact: expected.amount > 50000 ? 'high' : 'medium',
          resolution: 'pending'
        });
      }
    });
    
    const reconciliation: PaymentReconciliation = {
      date,
      expectedPayments,
      receivedPayments,
      discrepancies,
      totalExpected,
      totalReceived,
      reconciliationStatus: discrepancies.length === 0 ? 'balanced' : 'unbalanced'
    };
    
    this.reconciliations.push(reconciliation);
    
    return reconciliation;
  }

  // Private helper methods

  private async getStakeholders(propertyId: string, buyerId: string): Promise<PaymentTransaction['stakeholders']> {
    // Mock stakeholder data - would integrate with actual user/company databases
    return {
      buyer: {
        id: buyerId,
        name: 'John & Jane Smith',
        type: 'individual',
        email: 'john.smith@email.com',
        phone: '+353 87 123 4567',
        bankDetails: {
          accountName: 'John Smith',
          accountNumber: '12345678',
          sortCode: '90-01-01',
          iban: 'IE12 BOFI 9000 0112 3456 78',
          bic: 'BOFIIE2D'
        }
      },
      seller: {
        id: 'developer-1',
        name: 'Premium Developments Ltd',
        type: 'company',
        email: 'payments@premiumdev.ie',
        phone: '+353 1 234 5678',
        bankDetails: {
          accountName: 'Premium Developments Ltd',
          accountNumber: '87654321',
          sortCode: '90-02-02',
          iban: 'IE12 BOFI 9000 0287 6543 21',
          bic: 'BOFIIE2D'
        }
      },
      solicitor: {
        id: 'solicitor-1',
        name: 'Murphy & Associates',
        type: 'company',
        email: 'clientaccount@murphylaw.ie',
        phone: '+353 1 234 5679'
      }
    };
  }

  private calculateRiskScore(amount: number, type: PaymentTransaction['type']): number {
    let score = 0;
    
    // Amount-based risk
    if (amount > 100000) score += 30;
    else if (amount > 50000) score += 20;
    else if (amount > 10000) score += 10;
    
    // Type-based risk
    switch (type) {
      case 'completion':
        score += 15;
        break;
      case 'deposit':
        score += 10;
        break;
      case 'booking_fee':
        score += 5;
        break;
    }
    
    return Math.min(100, score);
  }

  private generateNotifications(type: PaymentTransaction['type'], stakeholders: any): PaymentNotification[] {
    const notifications: PaymentNotification[] = [];
    
    // Buyer notification
    notifications.push({
      id: `notif_buyer_${Date.now()}`,
      recipient: stakeholders.buyer.email,
      type: 'email',
      template: `payment_due_${type}`,
      trigger: 'payment_due',
      timing: 'immediate'
    });
    
    // Solicitor notification
    if (stakeholders.solicitor) {
      notifications.push({
        id: `notif_solicitor_${Date.now()}`,
        recipient: stakeholders.solicitor.email,
        type: 'email',
        template: 'payment_status_update',
        trigger: 'payment_received',
        timing: 'immediate'
      });
    }
    
    return notifications;
  }

  private async simulatePaymentProcessing(transaction: PaymentTransaction): Promise<{success: boolean, reason?: string}> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success rate based on amount and payment method
    const successRate = transaction.paymentMethod.type === 'bank_transfer' ? 0.98 : 0.95;
    const random = Math.random();
    
    if (random < successRate) {
      return { success: true };
    } else {
      return { 
        success: false, 
        reason: random < 0.02 ? 'Insufficient funds' : 'Bank processing error' 
      };
    }
  }

  private async sendPaymentNotifications(
    transaction: PaymentTransaction, 
    trigger: 'payment_due' | 'payment_received' | 'payment_failed'
  ): Promise<void> {
    const relevantNotifications = transaction.automation.notifications
      .filter(notif => notif.trigger === trigger);
    
    for (const notification of relevantNotifications) {
      console.log(`📧 Payment notification sent: ${notification.template} to ${notification.recipient}`);
      
      // Would integrate with actual email/SMS providers here
      this.emit('payment-notification-sent', {
        transaction,
        notification,
        trigger
      });
    }
  }

  private async notifyLegalCase(transaction: PaymentTransaction): Promise<void> {
    // Notify legal automation service of payment completion
    try {
      await fetch('/api/legal-automation/payment-received', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: transaction.id,
          propertyId: transaction.propertyId,
          paymentType: transaction.type,
          amount: transaction.amount
        })
      });
    } catch (error) {
      console.error('Error notifying legal case:', error);
    }
  }

  private async updatePropertyStatus(transaction: PaymentTransaction): Promise<void> {
    // Update property availability status based on payment type
    if (transaction.type === 'booking_fee' || transaction.type === 'deposit') {
      try {
        await fetch('/api/properties/availability', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyId: transaction.propertyId,
            action: transaction.type === 'booking_fee' ? 'unit_reserved' : 'deposit_paid',
            buyerId: transaction.buyerId,
            amount: transaction.amount
          })
        });
      } catch (error) {
        console.error('Error updating property status:', error);
      }
    }
  }

  private async triggerDependentPayments(transaction: PaymentTransaction): Promise<void> {
    // Find and trigger any dependent payments
    const schedule = Array.from(this.schedules.values())
      .find(s => s.propertyId === transaction.propertyId);
    
    if (schedule) {
      const dependentPayments = schedule.payments.filter(payment => 
        payment.dependencies.includes(transaction.type) && 
        payment.status === 'pending'
      );
      
      for (const payment of dependentPayments) {
        // Check if all dependencies are met
        const allDependenciesMet = payment.dependencies.every(dep => {
          return Array.from(this.transactions.values()).some(txn => 
            txn.propertyId === transaction.propertyId && 
            txn.type === dep && 
            txn.status === 'completed'
          );
        });
        
        if (allDependenciesMet) {
          console.log(`🔄 Triggering dependent payment: ${payment.description}`);
          // Would trigger the next payment in the sequence
        }
      }
    }
  }

  private generateTransactionNumber(developmentId: string, unitNumber: string): string {
    const devCode = developmentId.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `PAY-${devCode}-${unitNumber}-${timestamp}`;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  private initializePaymentTemplates(): void {
    // Initialize payment notification templates
    console.log('💳 Payment templates initialized');
  }

  private startPaymentMonitoring(): void {
    // Monitor for overdue payments every hour
    setInterval(() => {
      this.checkOverduePayments();
    }, 60 * 60 * 1000);
    
    console.log('🔄 Payment monitoring service started');
  }

  private checkOverduePayments(): void {
    const now = new Date();
    const overdueTransactions = Array.from(this.transactions.values())
      .filter(txn => txn.status === 'pending' && txn.dueDate < now);
    
    overdueTransactions.forEach(async (transaction) => {
      await this.sendPaymentNotifications(transaction, 'payment_failed');
      this.emit('payment-overdue', transaction);
    });
    
    if (overdueTransactions.length > 0) {
      console.log(`⚠️ ${overdueTransactions.length} overdue payments detected`);
    }
  }
}

// Export global instance
export const paymentOrchestrationService = new PaymentOrchestrationService();
export default PaymentOrchestrationService;