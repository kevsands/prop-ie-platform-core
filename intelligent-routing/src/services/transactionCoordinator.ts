import { PrismaClient, SaleStatus, MilestoneStatus } from '@prisma/client';
import { Logger } from '@/utils/logger';
import { EventEmitter } from 'events';
import { slpService } from './slpService';

const prisma = new PrismaClient();
const logger = new Logger('TransactionCoordinator');
const eventBus = new EventEmitter();

export interface SaleInput {
  unitId: string;
  buyerId: string;
  sellingAgentId?: string;
}

export interface MilestoneInput {
  name: string;
  description: string;
  dueDate?: Date;
}

export class TransactionCoordinator {
  /**
   * Initiate a new property purchase sale
   */
  async initiatePropertyPurchase(
    buyerId: string, 
    unitId: string,
    sellingAgentId?: string
  ): Promise<any> {
    try {
      // Get unit details for pricing
      const unit = await prisma.unit.findUnique({
        where: { id: unitId },
        include: { development: true }
      });

      if (!unit) {
        throw new Error('Unit not found');
      }

      // Create the sale
      const sale = await prisma.sale.create({
        data: {
          unitId,
          buyerId,
          sellingAgentId,
          status: SaleStatus.ENQUIRY,
          contractStatus: "Draft",
          basePrice: unit.basePrice,
          customizationCost: 0,
          totalPrice: unit.basePrice,
          referenceNumber: `${unit.development.name.replace(/\s+/g, '').toUpperCase()}-${Date.now()}`,
          developmentId: unit.developmentId
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

      // Create sale tasks instead of milestones
      const defaultTasks = [
        {
          title: 'Initial Deposit',
          description: 'Pay initial deposit to secure property',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'PENDING',
          priority: 'HIGH',
          assignedToId: buyerId,
          createdById: sellingAgentId || buyerId,
          plannedStartDate: new Date(),
          plannedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          estimatedHours: 2
        },
        {
          title: 'Document Submission',
          description: 'Submit all required documents',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: 'PENDING',
          priority: 'HIGH',
          assignedToId: buyerId,
          createdById: sellingAgentId || buyerId,
          plannedStartDate: new Date(),
          plannedEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          estimatedHours: 4
        }
      ];

      for (const task of defaultTasks) {
        await prisma.saleTask.create({
          data: {
            ...task,
            saleId: sale.id
          }
        });
      }

      // Create sale timeline
      await prisma.saleTimeline.create({
        data: {
          saleId: sale.id,
          initialEnquiryDate: new Date()
        }
      });

      // Notify relevant parties
      await this.notifyParties(sale.id, 'sale.initiated');

      // Emit event
      eventBus.emit('sale.initiated', sale);
      logger.info('Property purchase sale initiated', { 
        saleId: sale.id,
        unitId,
        buyerId 
      });

      return sale;
    } catch (error) {
      logger.error('Failed to initiate property purchase', { 
        unitId, 
        buyerId, 
        error 
      });
      throw new Error('Unable to initiate property purchase');
    }
  }

  /**
   * Handle sale state changes
   */
  async handleStateChange(
    saleId: string, 
    newStatus: SaleStatus,
    performedBy: string
  ): Promise<any> {
    try {
      const currentSale = await prisma.sale.findUnique({
        where: { id: saleId },
        include: { tasks: true }
      });

      if (!currentSale) {
        throw new Error('Sale not found');
      }

      // Validate state transition
      if (!this.isValidTransition(currentSale.status, newStatus)) {
        throw new Error(`Invalid state transition from ${currentSale.status} to ${newStatus}`);
      }

      // Update sale status
      const updatedSale = await prisma.sale.update({
        where: { id: saleId },
        data: { status: newStatus }
      });

      // Create status history record
      await prisma.saleStatusHistory.create({
        data: {
          saleId,
          status: newStatus,
          previousStatus: currentSale.status,
          updatedById: performedBy
        }
      });

      // Handle status-specific actions
      switch (newStatus) {
        case SaleStatus.RESERVATION:
          await this.handleReservation(saleId);
          break;
        case SaleStatus.CONTRACT_SIGNED:
          await this.handleContractSigned(saleId);
          break;
        case SaleStatus.COMPLETED:
          await this.handleCompletion(saleId);
          break;
      }

      // Notify all participants
      await this.notifyParties(saleId, 'sale.status.changed', {
        previousStatus: currentSale.status,
        newStatus
      });

      // Emit event
      eventBus.emit('sale.status.changed', {
        saleId,
        previousStatus: currentSale.status,
        newStatus
      });

      logger.info('Sale status changed', { 
        saleId, 
        previousStatus: currentSale.status,
        newStatus 
      });

      return updatedSale;
    } catch (error) {
      logger.error('Failed to handle state change', { 
        saleId, 
        newStatus, 
        error 
      });
      throw error;
    }
  }

  /**
   * Add a note to the sale
   */
  async addSaleNote(
    saleId: string,
    authorId: string,
    content: string,
    category?: string,
    isPrivate: boolean = false
  ): Promise<any> {
    try {
      const note = await prisma.saleNote.create({
        data: {
          saleId,
          authorId,
          content,
          category,
          isPrivate
        }
      });

      // Notify relevant parties if not private
      if (!isPrivate) {
        await this.notifyParties(saleId, 'sale.note.added', {
          authorId,
          content: content.substring(0, 100) + (content.length > 100 ? '...' : '')
        });
      }

      logger.info('Sale note added', { 
        saleId, 
        authorId,
        isPrivate 
      });

      return note;
    } catch (error) {
      logger.error('Failed to add sale note', { 
        saleId, 
        authorId, 
        error 
      });
      throw new Error('Unable to add sale note');
    }
  }

  /**
   * Update sale task status
   */
  async updateTaskStatus(
    taskId: string,
    status: string,
    completedBy?: string
  ): Promise<any> {
    try {
      const task = await prisma.saleTask.update({
        where: { id: taskId },
        data: {
          status,
          completedAt: status === 'COMPLETED' ? new Date() : undefined,
          completedById: status === 'COMPLETED' ? completedBy : undefined
        }
      });

      // Check if all tasks are completed
      const sale = await prisma.sale.findUnique({
        where: { id: task.saleId },
        include: { tasks: true }
      });

      if (sale) {
        const allCompleted = sale.tasks.every(
          t => t.status === 'COMPLETED'
        );

        if (allCompleted && sale.status !== SaleStatus.COMPLETED) {
          await this.handleStateChange(
            sale.id,
            SaleStatus.COMPLETED,
            completedBy || 'system'
          );
        }
      }

      logger.info('Sale task status updated', { 
        taskId, 
        status 
      });

      return task;
    } catch (error) {
      logger.error('Failed to update task status', { 
        taskId, 
        status, 
        error 
      });
      throw new Error('Unable to update task status');
    }
  }

  /**
   * Private: Handle reservation status
   */
  private async handleReservation(saleId: string): Promise<void> {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { unit: true }
    });

    if (sale) {
      // Update unit status to reserved
      await prisma.unit.update({
        where: { id: sale.unitId },
        data: { status: "RESERVED" }
      });

      // Update sale timeline
      await prisma.saleTimeline.update({
        where: { saleId },
        data: { reservationDate: new Date() }
      });

      logger.info('Sale reservation handled', { saleId });
    }
  }

  /**
   * Private: Handle contract signed status
   */
  private async handleContractSigned(saleId: string): Promise<void> {
    // Update sale timeline
    await prisma.saleTimeline.update({
      where: { saleId },
      data: { 
        contractIssuedDate: new Date(),
        contractReturnedDate: new Date()
      }
    });

    // Schedule completion date
    // Set up payment milestones
    logger.info('Contract signed handled', { saleId });
  }

  /**
   * Private: Handle sale completion
   */
  private async handleCompletion(saleId: string): Promise<void> {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId }
    });

    if (sale) {
      // Update sale timeline
      await prisma.saleTimeline.update({
        where: { saleId },
        data: { 
          saleCompletedDate: new Date(),
          handoverDate: new Date()
        }
      });

      // Update unit status to sold
      await prisma.unit.update({
        where: { id: sale.unitId },
        data: { status: "SOLD" }
      });

      // Update sale completion date
      await prisma.sale.update({
        where: { id: saleId },
        data: { 
          completionDate: new Date(),
          handoverDate: new Date()
        }
      });

      logger.info('Sale completion handled', { saleId });
    }
  }

  /**
   * Private: Validate state transitions
   */
  private isValidTransition(
    currentStatus: SaleStatus,
    newStatus: SaleStatus
  ): boolean {
    const validTransitions: Record<SaleStatus, SaleStatus[]> = {
      [SaleStatus.ENQUIRY]: [SaleStatus.VIEWING_SCHEDULED, SaleStatus.CANCELLED],
      [SaleStatus.VIEWING_SCHEDULED]: [SaleStatus.VIEWED, SaleStatus.CANCELLED],
      [SaleStatus.VIEWED]: [SaleStatus.INTERESTED, SaleStatus.CANCELLED],
      [SaleStatus.INTERESTED]: [SaleStatus.RESERVATION, SaleStatus.CANCELLED],
      [SaleStatus.RESERVATION]: [SaleStatus.PENDING_APPROVAL, SaleStatus.CANCELLED],
      [SaleStatus.PENDING_APPROVAL]: [SaleStatus.RESERVATION_APPROVED, SaleStatus.CANCELLED],
      [SaleStatus.RESERVATION_APPROVED]: [SaleStatus.CONTRACT_ISSUED, SaleStatus.CANCELLED],
      [SaleStatus.CONTRACT_ISSUED]: [SaleStatus.CONTRACT_SIGNED, SaleStatus.CANCELLED],
      [SaleStatus.CONTRACT_SIGNED]: [SaleStatus.DEPOSIT_PAID, SaleStatus.CANCELLED],
      [SaleStatus.DEPOSIT_PAID]: [SaleStatus.MORTGAGE_APPROVED, SaleStatus.CANCELLED],
      [SaleStatus.MORTGAGE_APPROVED]: [SaleStatus.CLOSING, SaleStatus.CANCELLED],
      [SaleStatus.CLOSING]: [SaleStatus.COMPLETED, SaleStatus.CANCELLED],
      [SaleStatus.COMPLETED]: [SaleStatus.HANDED_OVER],
      [SaleStatus.HANDED_OVER]: [],
      [SaleStatus.CANCELLED]: [],
      [SaleStatus.EXPIRED]: []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Private: Notify all sale participants
   */
  private async notifyParties(
    saleId: string,
    event: string,
    data?: any
  ): Promise<void> {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { unit: { include: { development: true } } }
    });

    if (sale) {
      // Notify buyer
      await this.notifyUser(sale.buyerId, event, {
        saleId,
        role: 'buyer',
        ...data
      });

      // Notify selling agent if present
      if (sale.sellingAgentId) {
        await this.notifyUser(sale.sellingAgentId, event, {
          saleId,
          role: 'agent',
          ...data
        });
      }

      // Notify developer
      if (sale.unit?.development?.developerId) {
        await this.notifyUser(sale.unit.development.developerId, event, {
          saleId,
          role: 'developer',
          ...data
        });
      }
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
   * Get event bus for subscribing to sale events
   */
  getEventBus(): EventEmitter {
    return eventBus;
  }
}

// Export singleton instance
export const transactionCoordinator = new TransactionCoordinator();
