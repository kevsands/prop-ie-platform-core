// import { PrismaClient, TransactionStatus, MilestoneStatus, ParticipantRole } from '@prisma/slp-client';
import { prisma } from '@/lib/prisma';
import { Logger } from '@/utils/logger';
import { EventEmitter } from 'events';
import { slpService } from './slpService';

// Transaction enums for now
enum TransactionStatus {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

enum ParticipantRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  AGENT = 'AGENT',
  SOLICITOR = 'SOLICITOR'
}
const logger = new Logger('TransactionCoordinator');
const eventBus = new EventEmitter();

export interface TransactionInput {
  projectId: string;
  buyerId: string;
}

export interface MilestoneInput {
  name: string;
  description: string;
  dueDate?: Date;
}

export class TransactionCoordinator {
  /**
   * Initiate a new property purchase transaction
   */
  async initiatePropertyPurchase(
    buyerId: string, 
    projectId: string
  ): Promise<any> {
    try {
      // Create the transaction
      const transaction = await prisma.transaction.create({
        data: {
          projectId,
          buyerId,
          status: TransactionStatus.INITIATED
        }
      });

      // Add default milestones
      const defaultMilestones: MilestoneInput[] = [
        {
          name: 'Initial Deposit',
          description: 'Pay initial deposit to secure property',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        },
        {
          name: 'Document Submission',
          description: 'Submit all required documents',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
        },
        {
          name: 'Legal Review',
          description: 'Solicitor reviews contracts',
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days
        },
        {
          name: 'Exchange Contracts',
          description: 'Exchange contracts with seller',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        },
        {
          name: 'Completion',
          description: 'Complete property purchase',
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
        }
      ];

      await prisma.milestone.createMany({
        data: defaultMilestones.map(milestone => ({
          ...milestone,
          transactionId: transaction.id
        }))
      });

      // Add participants
      await prisma.participant.create({
        data: {
          transactionId: transaction.id,
          userId: buyerId,
          role: ParticipantRole.BUYER
        }
      });

      // Notify relevant parties
      await this.notifyParties(transaction.id, 'transaction.initiated');

      // Emit event
      eventBus.emit('transaction.initiated', transaction);
      logger.info('Property purchase transaction initiated', { 
        transactionId: transaction.id,
        projectId,
        buyerId 
      });

      return transaction;
    } catch (error) {
      logger.error('Failed to initiate property purchase', { 
        projectId, 
        buyerId, 
        error 
      });
      throw new Error('Unable to initiate property purchase');
    }
  }

  /**
   * Handle transaction state changes
   */
  async handleStateChange(
    transactionId: string, 
    newStatus: TransactionStatus,
    performedBy: string
  ): Promise<any> {
    try {
      const currentTransaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: { milestones: true }
      });

      if (!currentTransaction) {
        throw new Error('Transaction not found');
      }

      // Validate state transition
      if (!this.isValidTransition(currentTransaction.status, newStatus)) {
        throw new Error(`Invalid state transition from ${currentTransaction.status} to ${newStatus}`);
      }

      // Update transaction status
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: newStatus }
      });

      // Handle status-specific actions
      switch (newStatus) {
        case TransactionStatus.OFFER_ACCEPTED:
          await this.handleOfferAccepted(transactionId);
          break;
        case TransactionStatus.CONTRACTS_EXCHANGED:
          await this.handleContractsExchanged(transactionId);
          break;
        case TransactionStatus.COMPLETED:
          await this.handleCompletion(transactionId);
          break;
      }

      // Notify all participants
      await this.notifyParties(transactionId, 'transaction.status.changed', {
        previousStatus: currentTransaction.status,
        newStatus
      });

      // Emit event
      eventBus.emit('transaction.status.changed', {
        transactionId,
        previousStatus: currentTransaction.status,
        newStatus
      });

      logger.info('Transaction status changed', { 
        transactionId, 
        previousStatus: currentTransaction.status,
        newStatus 
      });

      return updatedTransaction;
    } catch (error) {
      logger.error('Failed to handle state change', { 
        transactionId, 
        newStatus, 
        error 
      });
      throw error;
    }
  }

  /**
   * Add a participant to the transaction
   */
  async addParticipant(
    transactionId: string,
    userId: string,
    role: ParticipantRole
  ): Promise<any> {
    try {
      const participant = await prisma.participant.create({
        data: {
          transactionId,
          userId,
          role
        }
      });

      // Notify new participant
      await this.notifyUser(userId, 'participant.added', {
        transactionId,
        role
      });

      // Notify existing participants
      await this.notifyParties(transactionId, 'participant.added', {
        userId,
        role
      });

      logger.info('Participant added to transaction', { 
        transactionId, 
        userId, 
        role 
      });

      return participant;
    } catch (error) {
      logger.error('Failed to add participant', { 
        transactionId, 
        userId, 
        role, 
        error 
      });
      throw new Error('Unable to add participant');
    }
  }

  /**
   * Update milestone status
   */
  async updateMilestoneStatus(
    milestoneId: string,
    status: MilestoneStatus,
    completedBy?: string
  ): Promise<any> {
    try {
      const milestone = await prisma.milestone.update({
        where: { id: milestoneId },
        data: {
          status,
          completedAt: status === MilestoneStatus.COMPLETED ? new Date() : undefined
        }
      });

      // Check if all milestones are completed
      const transaction = await prisma.transaction.findUnique({
        where: { id: milestone.transactionId },
        include: { milestones: true }
      });

      if (transaction) {
        const allCompleted = transaction.milestones.every(
          m => m.status === MilestoneStatus.COMPLETED
        );

        if (allCompleted) {
          await this.handleStateChange(
            transaction.id,
            TransactionStatus.COMPLETED,
            completedBy || 'system'
          );
        }
      }

      logger.info('Milestone status updated', { 
        milestoneId, 
        status 
      });

      return milestone;
    } catch (error) {
      logger.error('Failed to update milestone status', { 
        milestoneId, 
        status, 
        error 
      });
      throw new Error('Unable to update milestone status');
    }
  }

  /**
   * Private: Handle offer accepted status
   */
  private async handleOfferAccepted(transactionId: string): Promise<void> {
    // Trigger SLP review
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (transaction) {
      const slpProgress = await slpService.getProjectProgress(transaction.projectId);
      
      if (slpProgress.progressPercentage < 100) {
        logger.warn('SLP not complete for accepted offer', { 
          transactionId, 
          progress: slpProgress.progressPercentage 
        });
      }
    }

    // Create legal review tasks
    // Notify solicitors
  }

  /**
   * Private: Handle contracts exchanged status
   */
  private async handleContractsExchanged(transactionId: string): Promise<void> {
    // Schedule completion date
    // Set up payment milestones
    // Notify all parties of exchange
  }

  /**
   * Private: Handle transaction completion
   */
  private async handleCompletion(transactionId: string): Promise<void> {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { completedAt: new Date() }
    });

    // Transfer ownership
    // Release funds
    // Generate completion documents
  }

  /**
   * Private: Validate state transitions
   */
  private isValidTransition(
    currentStatus: TransactionStatus,
    newStatus: TransactionStatus
  ): boolean {
    const validTransitions: Record<TransactionStatus, TransactionStatus[]> = {
      [TransactionStatus.INITIATED]: [TransactionStatus.OFFER_MADE, TransactionStatus.CANCELLED],
      [TransactionStatus.OFFER_MADE]: [TransactionStatus.OFFER_ACCEPTED, TransactionStatus.CANCELLED],
      [TransactionStatus.OFFER_ACCEPTED]: [TransactionStatus.CONTRACTS_EXCHANGED, TransactionStatus.CANCELLED],
      [TransactionStatus.CONTRACTS_EXCHANGED]: [TransactionStatus.COMPLETED, TransactionStatus.CANCELLED],
      [TransactionStatus.COMPLETED]: [],
      [TransactionStatus.CANCELLED]: []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Private: Notify all transaction participants
   */
  private async notifyParties(
    transactionId: string,
    event: string,
    data?: any
  ): Promise<void> {
    const participants = await prisma.participant.findMany({
      where: { transactionId }
    });

    for (const participant of participants) {
      await this.notifyUser(participant.userId, event, {
        transactionId,
        role: participant.role,
        ...data
      });
    }
  }

  /**
   * Private: Notify a specific user
   */
  private async notifyUser(
    userId: string,
    event: string,
    data: any
  ): Promise<void> {
    // This would integrate with your notification service
    // For now, just emit an event
    eventBus.emit('user.notification', {
      userId,
      event,
      data
    });
  }

  /**
   * Get event bus for subscribing to transaction events
   */
  getEventBus(): EventEmitter {
    return eventBus;
  }
}

// Export singleton instance
export const transactionCoordinator = new TransactionCoordinator();
