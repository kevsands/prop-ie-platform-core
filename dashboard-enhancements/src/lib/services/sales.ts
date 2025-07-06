import { PrismaClient, SaleStatus, UnitStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service for managing property sales, reservations, and transaction tracking
 */
export class SalesService {
  /**
   * Get all sales with optional filters
   */
  async getAllSales(filters?: {
    status?: SaleStatus;
    developmentId?: string;
    buyerId?: string;
    sellingAgentId?: string;
  }) {
    try {
      return await prisma.sale.findMany({
        where: {
          ...(filters?.status && { status: filters.status }),
          ...(filters?.developmentId && { developmentId: filters.developmentId }),
          ...(filters?.buyerId && { buyerId: filters.buyerId }),
          ...(filters?.sellingAgentId && { sellingAgentId: filters.sellingAgentId }),
        },
        include: {
          unit: true,
          development: true,
          depositInfo: true,
          timeline: true,
          documents: true,
          statusHistory: {
            orderBy: {
              timestamp: 'desc',
            },
            include: {
              updatedBy: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw new Error('Failed to fetch sales data');
    }
  }

  /**
   * Get a sale by ID
   */
  async getSaleById(id: string) {
    try {
      return await prisma.sale.findUnique({
        where: { id },
        include: {
          unit: true,
          development: true,
          depositInfo: true,
          mortgageDetails: true,
          htbDetails: true,
          timeline: true,
          documents: true,
          statusHistory: {
            orderBy: {
              timestamp: 'desc',
            },
            include: {
              updatedBy: true,
            },
          },
          notes: {
            orderBy: {
              timestamp: 'desc',
            },
          },
          tasks: {
            orderBy: {
              dueDate: 'asc',
            },
          },
          snagList: true,
          sellingAgent: true,
        },
      });
    } catch (error) {
      console.error(`Error fetching sale with ID ${id}:`, error);
      throw new Error('Failed to fetch sale data');
    }
  }

  /**
   * Create a new sale/reservation
   */
  async createSale(data: {
    unitId: string;
    buyerId: string;
    sellingAgentId?: string;
    developmentId: string;
    basePrice: number;
    customizationCost?: number;
    totalPrice: number;
    referenceNumber: string;
    status: SaleStatus;
    contractStatus: string;
  }) {
    try {
      // Start a transaction to ensure all related records are created consistently
      return await prisma.$transaction(async (tx) => {
        // Create the sale record
        const sale = await tx.sale.create({
          data: {
            unitId: data.unitId,
            buyerId: data.buyerId,
            sellingAgentId: data.sellingAgentId,
            developmentId: data.developmentId,
            basePrice: data.basePrice,
            customizationCost: data.customizationCost || 0,
            totalPrice: data.totalPrice,
            referenceNumber: data.referenceNumber,
            status: data.status,
            contractStatus: data.contractStatus,
          },
        });

        // Create initial status history record
        await tx.saleStatusHistory.create({
          data: {
            saleId: sale.id,
            status: data.status,
            updatedById: data.sellingAgentId || data.buyerId, // Use seller or buyer as updater
            notes: 'Initial sale/reservation created',
          },
        });

        // Create initial timeline
        await tx.saleTimeline.create({
          data: {
            saleId: sale.id,
            initialEnquiryDate: new Date(),
            reservationDate: data.status === 'RESERVATION' ? new Date() : undefined,
          },
        });

        // Update unit status
        await tx.unit.update({
          where: { id: data.unitId },
          data: {
            status: data.status === 'RESERVATION' ? 'RESERVED' : 'AVAILABLE',
          },
        });

        // Return the created sale with related data
        return await tx.sale.findUnique({
          where: { id: sale.id },
          include: {
            unit: true,
            development: true,
            timeline: true,
            statusHistory: true,
          },
        });
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      throw new Error('Failed to create sale record');
    }
  }

  /**
   * Update a sale's status and other related information
   */
  async updateSaleStatus(id: string, data: {
    status: SaleStatus;
    previousStatus?: SaleStatus;
    updatedById: string;
    notes?: string;
    timelineUpdates?: Record<string, Date>;
  }) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Get current sale to determine previous status if not provided
        if (!data.previousStatus) {
          const currentSale = await tx.sale.findUnique({
            where: { id },
            select: { status: true },
          });

          if (!currentSale) {
            throw new Error('Sale not found');
          }

          data.previousStatus = currentSale.status;
        }

        // Update the sale status
        const updatedSale = await tx.sale.update({
          where: { id },
          data: { status: data.status },
        });

        // Create status history record
        await tx.saleStatusHistory.create({
          data: {
            saleId: id,
            status: data.status,
            previousStatus: data.previousStatus,
            updatedById: data.updatedById,
            notes: data.notes,
          },
        });

        // Update unit status based on sale status
        // Update unit status based on sale status
        let unitStatus: UnitStatus | undefined;
        switch (data.status) {
          case 'PENDING_APPROVAL':
          case 'RESERVATION_APPROVED':
            unitStatus = 'RESERVED';
            break;
          case 'CONTRACT_ISSUED':
          case 'CONTRACT_SIGNED':
          case 'DEPOSIT_PAID':
          case 'MORTGAGE_APPROVED':
          case 'CLOSING':
            unitStatus = 'SALE_AGREED';
            break;
          case 'COMPLETED':
            unitStatus = 'SOLD';
            break;
          case 'HANDED_OVER':
            unitStatus = 'OCCUPIED';
            break;
          case 'CANCELLED':
          case 'EXPIRED':
            unitStatus = 'AVAILABLE';
            break;
          default:
            unitStatus = undefined;
        }

        if (unitStatus) {
          await tx.unit.update({
            where: { id: updatedSale.unitId },
            data: { status: unitStatus },
          });
        }

        // Update timeline if needed
        if (data.timelineUpdates && Object.keys(data.timelineUpdates).length > 0) {
          await tx.saleTimeline.update({
            where: { saleId: id },
            data: data.timelineUpdates,
          });
        } else {
          // Set appropriate timeline fields based on status change
          const timelineData: Record<string, Date> = {};

          switch (data.status) {
            case 'RESERVATION':
              timelineData.reservationDate = new Date();
              timelineData.reservationExpiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
              break;
            case 'CONTRACT_ISSUED':
              timelineData.contractIssuedDate = new Date();
              timelineData.contractReturnDeadline = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000); // 21 days
              break;
            case 'CONTRACT_SIGNED':
              timelineData.contractReturnedDate = new Date();
              break;
            case 'DEPOSIT_PAID':
              timelineData.depositPaidDate = new Date();
              break;
            case 'MORTGAGE_APPROVED':
              timelineData.mortgageApprovalDate = new Date();
              break;
            case 'COMPLETED':
              timelineData.saleCompletedDate = new Date();
              break;
            case 'HANDED_OVER':
              timelineData.handoverDate = new Date();
              timelineData.keyCollectionDate = new Date();
              timelineData.warrantyStartDate = new Date();
              // Set 10 year warranty end date
              const warrantyEndDate = new Date();
              warrantyEndDate.setFullYear(warrantyEndDate.getFullYear() + 10);
              timelineData.warrantyEndDate = warrantyEndDate;
              break;
          }

          if (Object.keys(timelineData).length > 0) {
            await tx.saleTimeline.update({
              where: { saleId: id },
              data: timelineData,
            });
          }
        }

        return updatedSale;
      });
    } catch (error) {
      console.error(`Error updating sale status for ID ${id}:`, error);
      throw new Error('Failed to update sale status');
    }
  }

  /**
   * Add or update deposit information for a sale
   */
  async updateDeposit(saleId: string, data: {
    initialAmount: number;
    initialAmountPercentage: number;
    initialPaidDate?: Date;
    balanceAmount: number;
    balanceDueDate?: Date;
    balancePaidDate?: Date;
    totalPaid: number;
    status: string;
    paymentMethod?: string;
    receiptDocumentIds?: string[];
  }) {
    try {
      // Check if deposit info already exists
      const existingDeposit = await prisma.deposit.findUnique({
        where: { saleId },
      });

      if (existingDeposit) {
        // Update existing deposit
        return await prisma.deposit.update({
          where: { saleId },
          data,
        });
      } else {
        // Create new deposit record
        return await prisma.deposit.create({
          data: {
            saleId,
            ...data,
          },
        });
      }
    } catch (error) {
      console.error(`Error updating deposit for sale ID ${saleId}:`, error);
      throw new Error('Failed to update deposit information');
    }
  }

  /**
   * Add a note to a sale
   */
  async addNote(data: {
    saleId: string;
    authorId: string;
    content: string;
    isPrivate?: boolean;
    category?: string;
  }) {
    try {
      return await prisma.saleNote.create({
        data: {
          saleId: data.saleId,
          authorId: data.authorId,
          content: data.content,
          isPrivate: data.isPrivate || false,
          category: data.category,
        },
      });
    } catch (error) {
      console.error('Error adding note to sale:', error);
      throw new Error('Failed to add note');
    }
  }

  /**
   * Add or update task for a sale
   */
  async upsertTask(data: {
    id?: string;
    saleId: string;
    title: string;
    description: string;
    dueDate: Date;
    status: string;
    priority: string;
    assignedToId: string;
    createdById: string;
    notifyBeforeDays?: number;
  }) {
    try {
      if (data.id) {
        // Update existing task
        return await prisma.saleTask.update({
          where: { id: data.id },
          data: {
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            status: data.status,
            priority: data.priority,
            assignedToId: data.assignedToId,
            notifyBeforeDays: data.notifyBeforeDays,
            // Don't update createdById
          },
        });
      } else {
        // Create new task
        return await prisma.saleTask.create({
          data: {
            saleId: data.saleId,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            status: data.status,
            priority: data.priority,
            assignedToId: data.assignedToId,
            createdById: data.createdById,
            notifyBeforeDays: data.notifyBeforeDays,
          },
        });
      }
    } catch (error) {
      console.error('Error upserting task for sale:', error);
      throw new Error('Failed to create or update task');
    }
  }

  /**
   * Delete a sale (soft delete by setting status to CANCELLED)
   */
  async deleteSale(id: string, updatedById: string, reason: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Update the sale status to CANCELLED
        const updatedSale = await tx.sale.update({
          where: { id },
          data: { status: 'CANCELLED' },
        });

        // Create status history record
        await tx.saleStatusHistory.create({
          data: {
            saleId: id,
            status: 'CANCELLED',
            updatedById: updatedById,
            notes: `Sale cancelled: ${reason}`,
          },
        });

        // Update unit status to available
        await tx.unit.update({
          where: { id: updatedSale.unitId },
          data: { status: 'AVAILABLE' },
        });

        return updatedSale;
      });
    } catch (error) {
      console.error(`Error deleting sale with ID ${id}:`, error);
      throw new Error('Failed to delete sale');
    }
  }

  /**
   * Get sales statistics for dashboard
   */
  async getSalesStats(developmentId?: string) {
    try {
      // Get counts of sales by status
      const statusCounts = await prisma.sale.groupBy({
        by: ['status'],
        where: developmentId ? { developmentId } : undefined,
        _count: true,
      });

      // Calculate total sales value
      const salesValue = await prisma.sale.aggregate({
        where: {
          status: {
            in: ['COMPLETED', 'HANDED_OVER']
          },
          ...(developmentId && { developmentId }),
        },
        _sum: {
          totalPrice: true,
        },
      });

      // Calculate reserved value
      const reservedValue = await prisma.sale.aggregate({
        where: {
          status: {
            in: ['RESERVATION', 'PENDING_APPROVAL', 'RESERVATION_APPROVED', 'CONTRACT_ISSUED']
          },
          ...(developmentId && { developmentId }),
        },
        _sum: {
          totalPrice: true,
        },
      });

      // Get recent sales activity
      const recentActivity = await prisma.saleStatusHistory.findMany({
        take: 10,
        orderBy: {
          timestamp: 'desc',
        },
        where: developmentId ? {
          sale: {
            developmentId
          }
        } : undefined,
        include: {
          sale: {
            select: {
              id: true,
              referenceNumber: true,
              unit: {
                select: {
                  name: true,
                  type: true,
                }
              },
              development: {
                select: {
                  name: true,
                  id: true,
                }
              }
            }
          },
          updatedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      });

      // Format and return all statistics
      return {
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
        totalSalesValue: salesValue._sum.totalPrice || 0,
        totalReservedValue: reservedValue._sum.totalPrice || 0,
        recentActivity,
      };
    } catch (error) {
      console.error('Error fetching sales statistics:', error);
      throw new Error('Failed to fetch sales statistics');
    }
  }
}

export const salesService = new SalesService();