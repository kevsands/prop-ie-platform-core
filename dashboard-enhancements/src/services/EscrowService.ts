/**
 * ================================================================================
 * ESCROW MANAGEMENT SERVICE
 * Handles secure fund management for multi-party property transactions
 * Ensures funds are held safely until all conditions are met
 * ================================================================================
 */

import { EventEmitter } from 'events';

// Core Types
export interface EscrowAccount {
  id: string;
  transactionId: string;
  propertyId: string;
  status: EscrowStatus;
  balance: number;
  currency: string;
  participants: EscrowParticipant[];
  conditions: EscrowCondition[];
  milestones: EscrowMilestone[];
  funds: EscrowFund[];
  releases: EscrowRelease[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  metadata: Record<string, any>;
}

export interface EscrowParticipant {
  id: string;
  type: 'buyer' | 'seller' | 'developer' | 'agent' | 'solicitor' | 'lender' | 'platform';
  name: string;
  email: string;
  userId?: string;
  organizationId?: string;
  role: ParticipantRole;
  permissions: EscrowPermission[];
  signatureRequired: boolean;
  hasApproved: boolean;
  approvedAt?: Date;
  metadata?: Record<string, any>;
}

export interface EscrowCondition {
  id: string;
  type: ConditionType;
  title: string;
  description: string;
  status: 'pending' | 'met' | 'failed' | 'waived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiredBy?: string[]; // Participant IDs who must approve
  dueDate?: Date;
  documents?: string[]; // Document IDs required
  verifiedBy?: string; // User ID who verified
  verifiedAt?: Date;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface EscrowMilestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  order: number;
  dueDate?: Date;
  completedAt?: Date;
  releaseAmount?: number;
  releasePercentage?: number;
  conditions: string[]; // Condition IDs that must be met
  dependencies: string[]; // Other milestone IDs that must be completed first
  participants: string[]; // Participant IDs involved in this milestone
  metadata?: Record<string, any>;
}

export interface EscrowFund {
  id: string;
  amount: number;
  currency: string;
  source: FundSource;
  depositedBy: string; // Participant ID
  depositedAt: Date;
  status: 'deposited' | 'held' | 'released' | 'returned' | 'disputed';
  paymentMethod: string;
  paymentReference?: string;
  stripePaymentIntentId?: string;
  purpose: string;
  restrictions?: string[];
  releaseConditions: string[]; // Condition IDs
  metadata?: Record<string, any>;
}

export interface EscrowRelease {
  id: string;
  amount: number;
  currency: string;
  recipient: string; // Participant ID
  releasedBy: string; // User ID who authorized release
  releasedAt: Date;
  reason: string;
  milestoneId?: string;
  fundIds: string[]; // Specific funds being released
  approvals: ReleaseApproval[];
  status: 'pending' | 'approved' | 'released' | 'failed';
  paymentReference?: string;
  metadata?: Record<string, any>;
}

export interface ReleaseApproval {
  participantId: string;
  approvedBy: string; // User ID
  approvedAt: Date;
  notes?: string;
  signature?: string;
}

// Enums
export enum EscrowStatus {
  CREATED = 'created',
  FUNDED = 'funded',
  ACTIVE = 'active',
  CONDITIONS_MET = 'conditions_met',
  READY_FOR_RELEASE = 'ready_for_release',
  PARTIALLY_RELEASED = 'partially_released',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export enum ParticipantRole {
  DEPOSITOR = 'depositor',
  BENEFICIARY = 'beneficiary',
  AGENT = 'agent',
  APPROVER = 'approver',
  OBSERVER = 'observer',
  ADMINISTRATOR = 'administrator'
}

export enum EscrowPermission {
  VIEW_BALANCE = 'view_balance',
  DEPOSIT_FUNDS = 'deposit_funds',
  REQUEST_RELEASE = 'request_release',
  APPROVE_RELEASE = 'approve_release',
  ADD_CONDITIONS = 'add_conditions',
  VERIFY_CONDITIONS = 'verify_conditions',
  DISPUTE_TRANSACTION = 'dispute_transaction',
  CANCEL_ESCROW = 'cancel_escrow',
  VIEW_DOCUMENTS = 'view_documents',
  UPLOAD_DOCUMENTS = 'upload_documents'
}

export enum ConditionType {
  DOCUMENT_UPLOAD = 'document_upload',
  SIGNATURE_REQUIRED = 'signature_required',
  PAYMENT_CONFIRMATION = 'payment_confirmation',
  LEGAL_APPROVAL = 'legal_approval',
  INSPECTION_COMPLETION = 'inspection_completion',
  TITLE_VERIFICATION = 'title_verification',
  INSURANCE_PROOF = 'insurance_proof',
  MORTGAGE_APPROVAL = 'mortgage_approval',
  HTB_APPROVAL = 'htb_approval',
  CONSTRUCTION_MILESTONE = 'construction_milestone',
  THIRD_PARTY_APPROVAL = 'third_party_approval',
  TIME_DELAY = 'time_delay',
  CUSTOM = 'custom'
}

export enum FundSource {
  BUYER_DEPOSIT = 'buyer_deposit',
  CONTRACTUAL_DEPOSIT = 'contractual_deposit',
  STAGE_PAYMENT = 'stage_payment',
  COMPLETION_PAYMENT = 'completion_payment',
  HTB_BENEFIT = 'htb_benefit',
  AGENT_COMMISSION = 'agent_commission',
  LEGAL_FEES = 'legal_fees',
  PLATFORM_FEES = 'platform_fees',
  CONTINGENCY_FUND = 'contingency_fund',
  OTHER = 'other'
}

// Events
export const ESCROW_EVENTS = {
  ACCOUNT_CREATED: 'escrow:account_created',
  FUNDS_DEPOSITED: 'escrow:funds_deposited',
  CONDITION_MET: 'escrow:condition_met',
  MILESTONE_COMPLETED: 'escrow:milestone_completed',
  RELEASE_REQUESTED: 'escrow:release_requested',
  RELEASE_APPROVED: 'escrow:release_approved',
  FUNDS_RELEASED: 'escrow:funds_released',
  DISPUTE_RAISED: 'escrow:dispute_raised',
  ESCROW_COMPLETED: 'escrow:escrow_completed',
  ESCROW_CANCELLED: 'escrow:escrow_cancelled'
} as const;

/**
 * Escrow Service Class
 * Manages secure fund holding and conditional releases for property transactions
 */
export class EscrowService extends EventEmitter {
  private accounts: Map<string, EscrowAccount> = new Map();
  private transactions: Map<string, EscrowAccount[]> = new Map();

  constructor() {
    super();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Automatic processing when conditions are met
    this.on(ESCROW_EVENTS.CONDITION_MET, this.checkMilestoneCompletion.bind(this));
    this.on(ESCROW_EVENTS.MILESTONE_COMPLETED, this.checkReleaseEligibility.bind(this));
    this.on(ESCROW_EVENTS.FUNDS_RELEASED, this.updateAccountStatus.bind(this));
  }

  /**
   * Create a new escrow account for a property transaction
   */
  async createEscrowAccount(params: {
    transactionId: string;
    propertyId: string;
    participants: Omit<EscrowParticipant, 'id' | 'hasApproved'>[];
    conditions: Omit<EscrowCondition, 'id' | 'status'>[];
    milestones: Omit<EscrowMilestone, 'id' | 'status'>[];
    metadata?: Record<string, any>;
  }): Promise<EscrowAccount> {
    const escrowId = this.generateId();
    
    const escrowAccount: EscrowAccount = {
      id: escrowId,
      transactionId: params.transactionId,
      propertyId: params.propertyId,
      status: EscrowStatus.CREATED,
      balance: 0,
      currency: 'EUR',
      participants: params.participants.map(p => ({
        ...p,
        id: this.generateId(),
        hasApproved: false
      })),
      conditions: params.conditions.map(c => ({
        ...c,
        id: this.generateId(),
        status: 'pending' as const
      })),
      milestones: params.milestones.map(m => ({
        ...m,
        id: this.generateId(),
        status: 'pending' as const
      })),
      funds: [],
      releases: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: params.metadata || {}
    };

    this.accounts.set(escrowId, escrowAccount);
    
    // Index by transaction ID
    const transactionAccounts = this.transactions.get(params.transactionId) || [];
    transactionAccounts.push(escrowAccount);
    this.transactions.set(params.transactionId, transactionAccounts);

    this.emit(ESCROW_EVENTS.ACCOUNT_CREATED, escrowAccount);
    
    return escrowAccount;
  }

  /**
   * Deposit funds into escrow account
   */
  async depositFunds(params: {
    escrowId: string;
    amount: number;
    currency: string;
    source: FundSource;
    depositedBy: string;
    paymentMethod: string;
    paymentReference?: string;
    stripePaymentIntentId?: string;
    purpose: string;
    releaseConditions?: string[];
    metadata?: Record<string, any>;
  }): Promise<EscrowFund> {
    const account = this.accounts.get(params.escrowId);
    if (!account) {
      throw new Error('Escrow account not found');
    }

    const fund: EscrowFund = {
      id: this.generateId(),
      amount: params.amount,
      currency: params.currency,
      source: params.source,
      depositedBy: params.depositedBy,
      depositedAt: new Date(),
      status: 'deposited',
      paymentMethod: params.paymentMethod,
      paymentReference: params.paymentReference,
      stripePaymentIntentId: params.stripePaymentIntentId,
      purpose: params.purpose,
      releaseConditions: params.releaseConditions || [],
      metadata: params.metadata || {}
    };

    account.funds.push(fund);
    account.balance += params.amount;
    account.updatedAt = new Date();

    // Update status to funded if this is the first deposit
    if (account.status === EscrowStatus.CREATED) {
      account.status = EscrowStatus.FUNDED;
    }

    this.emit(ESCROW_EVENTS.FUNDS_DEPOSITED, { account, fund });
    
    return fund;
  }

  /**
   * Mark a condition as met
   */
  async markConditionMet(params: {
    escrowId: string;
    conditionId: string;
    verifiedBy: string;
    documents?: string[];
    notes?: string;
  }): Promise<EscrowCondition> {
    const account = this.accounts.get(params.escrowId);
    if (!account) {
      throw new Error('Escrow account not found');
    }

    const condition = account.conditions.find(c => c.id === params.conditionId);
    if (!condition) {
      throw new Error('Condition not found');
    }

    condition.status = 'met';
    condition.verifiedBy = params.verifiedBy;
    condition.verifiedAt = new Date();
    condition.documents = params.documents;
    condition.notes = params.notes;

    account.updatedAt = new Date();

    this.emit(ESCROW_EVENTS.CONDITION_MET, { account, condition });
    
    return condition;
  }

  /**
   * Request fund release
   */
  async requestRelease(params: {
    escrowId: string;
    amount: number;
    recipient: string;
    reason: string;
    milestoneId?: string;
    fundIds?: string[];
    requestedBy: string;
  }): Promise<EscrowRelease> {
    const account = this.accounts.get(params.escrowId);
    if (!account) {
      throw new Error('Escrow account not found');
    }

    // Validate release eligibility
    await this.validateReleaseEligibility(account, params.amount, params.milestoneId);

    const release: EscrowRelease = {
      id: this.generateId(),
      amount: params.amount,
      currency: account.currency,
      recipient: params.recipient,
      releasedBy: params.requestedBy,
      releasedAt: new Date(),
      reason: params.reason,
      milestoneId: params.milestoneId,
      fundIds: params.fundIds || [],
      approvals: [],
      status: 'pending'
    };

    account.releases.push(release);
    account.updatedAt = new Date();

    this.emit(ESCROW_EVENTS.RELEASE_REQUESTED, { account, release });
    
    return release;
  }

  /**
   * Approve a fund release
   */
  async approveRelease(params: {
    escrowId: string;
    releaseId: string;
    approvedBy: string;
    participantId: string;
    notes?: string;
    signature?: string;
  }): Promise<ReleaseApproval> {
    const account = this.accounts.get(params.escrowId);
    if (!account) {
      throw new Error('Escrow account not found');
    }

    const release = account.releases.find(r => r.id === params.releaseId);
    if (!release) {
      throw new Error('Release not found');
    }

    const approval: ReleaseApproval = {
      participantId: params.participantId,
      approvedBy: params.approvedBy,
      approvedAt: new Date(),
      notes: params.notes,
      signature: params.signature
    };

    release.approvals.push(approval);
    account.updatedAt = new Date();

    // Check if all required approvals are received
    const allApproved = await this.checkAllApprovalsReceived(account, release);
    if (allApproved) {
      release.status = 'approved';
      this.emit(ESCROW_EVENTS.RELEASE_APPROVED, { account, release });
      
      // Execute the release
      await this.executeRelease(params.escrowId, params.releaseId);
    }

    return approval;
  }

  /**
   * Execute approved fund release
   */
  private async executeRelease(escrowId: string, releaseId: string): Promise<void> {
    const account = this.accounts.get(escrowId);
    if (!account) return;

    const release = account.releases.find(r => r.id === releaseId);
    if (!release || release.status !== 'approved') return;

    try {
      // In production, this would integrate with payment processor
      // For now, we simulate the release
      await this.processPaymentRelease(release);

      release.status = 'released';
      account.balance -= release.amount;
      
      // Update fund statuses
      const releasedFunds = account.funds.filter(f => 
        release.fundIds.includes(f.id) || release.fundIds.length === 0
      );
      
      let remainingAmount = release.amount;
      for (const fund of releasedFunds) {
        if (remainingAmount <= 0) break;
        
        const releaseFromThisFund = Math.min(fund.amount, remainingAmount);
        fund.status = releaseFromThisFund === fund.amount ? 'released' : 'held';
        remainingAmount -= releaseFromThisFund;
      }

      account.updatedAt = new Date();

      this.emit(ESCROW_EVENTS.FUNDS_RELEASED, { account, release });
      
      // Check if escrow is completed
      if (account.balance === 0 && this.allMilestonesCompleted(account)) {
        account.status = EscrowStatus.COMPLETED;
        account.closedAt = new Date();
        this.emit(ESCROW_EVENTS.ESCROW_COMPLETED, account);
      }

    } catch (error) {
      release.status = 'failed';
      release.metadata = { error: error.message };
      throw error;
    }
  }

  /**
   * Get escrow account by ID
   */
  getEscrowAccount(escrowId: string): EscrowAccount | null {
    return this.accounts.get(escrowId) || null;
  }

  /**
   * Get escrow accounts for a transaction
   */
  getTransactionEscrows(transactionId: string): EscrowAccount[] {
    return this.transactions.get(transactionId) || [];
  }

  /**
   * Get escrow status summary
   */
  getEscrowSummary(escrowId: string): {
    totalDeposited: number;
    totalReleased: number;
    pendingReleases: number;
    conditionsMet: number;
    totalConditions: number;
    milestonesCompleted: number;
    totalMilestones: number;
  } | null {
    const account = this.getEscrowAccount(escrowId);
    if (!account) return null;

    const totalDeposited = account.funds.reduce((sum, fund) => sum + fund.amount, 0);
    const totalReleased = account.releases
      .filter(r => r.status === 'released')
      .reduce((sum, release) => sum + release.amount, 0);
    const pendingReleases = account.releases
      .filter(r => r.status === 'pending')
      .reduce((sum, release) => sum + release.amount, 0);

    return {
      totalDeposited,
      totalReleased,
      pendingReleases,
      conditionsMet: account.conditions.filter(c => c.status === 'met').length,
      totalConditions: account.conditions.length,
      milestonesCompleted: account.milestones.filter(m => m.status === 'completed').length,
      totalMilestones: account.milestones.length
    };
  }

  // Private helper methods
  private async checkMilestoneCompletion(data: { account: EscrowAccount; condition: EscrowCondition }) {
    const { account } = data;
    
    for (const milestone of account.milestones) {
      if (milestone.status !== 'pending') continue;
      
      const requiredConditions = milestone.conditions;
      const metConditions = account.conditions
        .filter(c => requiredConditions.includes(c.id) && c.status === 'met')
        .length;
      
      if (metConditions === requiredConditions.length) {
        milestone.status = 'completed';
        milestone.completedAt = new Date();
        account.updatedAt = new Date();
        
        this.emit(ESCROW_EVENTS.MILESTONE_COMPLETED, { account, milestone });
      }
    }
  }

  private async checkReleaseEligibility(data: { account: EscrowAccount; milestone: EscrowMilestone }) {
    const { account, milestone } = data;
    
    if (milestone.releaseAmount && milestone.releaseAmount > 0) {
      // Auto-trigger release for this milestone
      const participant = account.participants.find(p => p.type === 'seller' || p.type === 'developer');
      if (participant) {
        await this.requestRelease({
          escrowId: account.id,
          amount: milestone.releaseAmount,
          recipient: participant.id,
          reason: `Automatic release for milestone: ${milestone.title}`,
          milestoneId: milestone.id,
          requestedBy: 'system'
        });
      }
    }
  }

  private async updateAccountStatus(data: { account: EscrowAccount; release: EscrowRelease }) {
    const { account } = data;
    
    const totalReleased = account.releases
      .filter(r => r.status === 'released')
      .reduce((sum, r) => sum + r.amount, 0);
    
    if (totalReleased > 0 && account.balance > 0) {
      account.status = EscrowStatus.PARTIALLY_RELEASED;
    } else if (account.balance === 0) {
      account.status = EscrowStatus.COMPLETED;
      account.closedAt = new Date();
    }
    
    account.updatedAt = new Date();
  }

  private async validateReleaseEligibility(account: EscrowAccount, amount: number, milestoneId?: string): Promise<void> {
    if (amount > account.balance) {
      throw new Error('Insufficient balance for release');
    }

    if (milestoneId) {
      const milestone = account.milestones.find(m => m.id === milestoneId);
      if (!milestone) {
        throw new Error('Milestone not found');
      }
      if (milestone.status !== 'completed') {
        throw new Error('Milestone not completed');
      }
    }
  }

  private async checkAllApprovalsReceived(account: EscrowAccount, release: EscrowRelease): Promise<boolean> {
    const requiredApprovers = account.participants.filter(p => 
      p.permissions.includes(EscrowPermission.APPROVE_RELEASE)
    );
    
    const receivedApprovals = release.approvals.map(a => a.participantId);
    
    return requiredApprovers.every(approver => 
      receivedApprovals.includes(approver.id)
    );
  }

  private async processPaymentRelease(release: EscrowRelease): Promise<void> {
    // In production, this would integrate with Stripe Connect or similar
    // to transfer funds to the recipient
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
  }

  private allMilestonesCompleted(account: EscrowAccount): boolean {
    return account.milestones.every(m => m.status === 'completed');
  }

  private generateId(): string {
    return `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const escrowService = new EscrowService();