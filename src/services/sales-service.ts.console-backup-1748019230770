/**
 * Sales Service
 * Business logic and data access for sales and reservations
 */

import salesDb, { unitDb } from '@/lib/db';
import { mapPrismaSaleToSale } from '@/lib/db/mappers';
import { Sale, SaleStatus, SaleTask, SaleTaskStatus, SaleTaskPriority } from '@/types/core/sales';
import { UnitStatus } from '@/types/core/unit';

export class SalesService {
  /**
   * Get a sale by ID
   * @param id Sale ID
   * @returns The sale or null if not found
   */
  async getSaleById(id: string): Promise<Sale | null> {
    const prismaSale = await salesDb.getById(id);
    if (!prismaSale) return null;
    return mapPrismaSaleToSale(prismaSale);
  }

  /**
   * Get a sale by reference number
   * @param referenceNumber Sale reference number
   * @returns The sale or null if not found
   */
  async getSaleByReferenceNumber(referenceNumber: string): Promise<Sale | null> {
    const prismaSale = await salesDb.getByReferenceNumber(referenceNumber);
    if (!prismaSale) return null;
    return mapPrismaSaleToSale(prismaSale);
  }

  /**
   * List sales with filtering
   * @param options Filter options
   * @returns List of sales with pagination info
   */
  async listSales(options?: {
    developmentId?: string;
    unitId?: string;
    buyerId?: string;
    sellingAgentId?: string;
    status?: SaleStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    sales: Sale[];
    totalCount: number;
    page: number;
    totalPages: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, ...filterOptions } = options || {};
    const offset = (page - 1) * limit;

    // Convert enum values to strings for the database
    const dbOptions = {
      ...filterOptions,
      status: filterOptions.status?.toString(),
      limit,
      offset
    };

    const result = await salesDb.list(dbOptions);

    return {
      sales: result.sales.map(mapPrismaSaleToSale),
      totalCount: result.totalCount,
      page,
      totalPages: Math.ceil(result.totalCount / limit),
      limit
    };
  }

  /**
   * Create a new sale (reservation)
   * @param data Sale creation data
   * @returns The created sale
   */
  async createSale(data: {
    unitId: string;
    developmentId: string;
    buyerId: string;
    sellingAgentId?: string;
    basePrice?: number;
    customizationCost?: number;
  }): Promise<Sale> {
    const prismaSale = await salesDb.create(data);
    return mapPrismaSaleToSale(prismaSale);
  }

  /**
   * Update sale status
   * @param id Sale ID
   * @param status New status
   * @param userId User making the change
   * @param notes Optional notes about the status change
   * @returns The updated sale
   */
  async updateSaleStatus(
    id: string,
    status: SaleStatus,
    userId: string,
    notes?: string
  ): Promise<Sale> {
    const sale = await this.getSaleById(id);
    if (!sale) {
      throw new Error(`Sale with ID ${id} not found`);
    }

    // In a real implementation, this would update the database
    // This is a placeholder for demonstration purposes
    sale.status = status;

    // Handle side effects of status changes
    await this.handleStatusChangeEffects(sale, status);

    return sale;
  }

  /**
   * Handle side effects when a sale status changes
   * @param sale The sale that was updated
   * @param newStatus The new status
   */
  private async handleStatusChangeEffects(sale: Sale, newStatus: SaleStatus): Promise<void> {
    // These would be actual database operations in a real implementation

    switch (newStatus) {
      case SaleStatus.RESERVATION:
        // Update unit status to reserved
        await this.updateUnitStatus(sale.unit.id, UnitStatus.RESERVED);
        break;

      case SaleStatus.CONTRACT_SIGNED:
        // Create contract milestone tasks
        await this.createContractSignedTasks(sale);
        break;

      case SaleStatus.COMPLETED:
        // Update unit status to sold
        await this.updateUnitStatus(sale.unit.id, UnitStatus.SOLD);
        break;

      case SaleStatus.CANCELLED:
        // Update unit status back to available
        await this.updateUnitStatus(sale.unit.id, UnitStatus.AVAILABLE);
        break;
    }
  }

  /**
   * Update a unit's status
   * @param unitId Unit ID
   * @param status New status
   */
  private async updateUnitStatus(unitId: string, status: UnitStatus): Promise<void> {
    // In a real implementation, this would update the database
    console.log(`Updating unit ${unitId} status to ${status}`);
  }

  /**
   * Create tasks that should happen after contract signing
   * @param sale The sale with signed contract
   */
  private async createContractSignedTasks(sale: Sale): Promise<void> {
    // In a real implementation, this would create tasks in the database
    const tasks: Partial<SaleTask>[] = [
      {
        title: 'Verify deposit payment',
        description: 'Check that the deposit has been received and update the deposit status',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: SaleTaskStatus.PENDING,
        priority: SaleTaskPriority.HIGH
      },
      {
        title: 'Send welcome pack to buyer',
        description: 'Send the buyer welcome information including next steps',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: SaleTaskStatus.PENDING,
        priority: SaleTaskPriority.MEDIUM
      }
    ];

    console.log(`Creating ${tasks.length} tasks for sale ${sale.id}`);
  }

  /**
   * Record a deposit payment
   * @param saleId Sale ID
   * @param amount Payment amount
   * @param paymentMethod Payment method
   * @param paymentDate Payment date
   * @param isInitialDeposit Whether this is the initial deposit
   * @returns The updated sale
   */
  async recordDepositPayment(
    saleId: string,
    amount: number,
    paymentMethod: string,
    paymentDate: Date = new Date(),
    isInitialDeposit: boolean = true
  ): Promise<Sale> {
    const sale = await this.getSaleById(saleId);
    if (!sale) {
      throw new Error(`Sale with ID ${saleId} not found`);
    }

    // In a real implementation, this would update the database
    // This is a placeholder for demonstration purposes
    if (isInitialDeposit) {
      if (sale.deposit) {
        sale.deposit.initialPaidDate = paymentDate;
        sale.deposit.paymentMethod = paymentMethod;
        sale.deposit.totalPaid = amount;
      }
    } else {
      if (sale.deposit) {
        sale.deposit.balancePaidDate = paymentDate;
        sale.deposit.paymentMethod = paymentMethod;
        sale.deposit.totalPaid += amount;
      }
    }

    return sale;
  }

  /**
   * Record mortgage approval
   * @param saleId Sale ID
   * @param data Mortgage data
   * @returns The updated sale
   */
  async recordMortgageApproval(
    saleId: string,
    data: {
      lender: string;
      amount: number;
      term: number;
      interestRate: number;
      approvalDate: Date;
    }
  ): Promise<Sale> {
    const sale = await this.getSaleById(saleId);
    if (!sale) {
      throw new Error(`Sale with ID ${saleId} not found`);
    }

    // In a real implementation, this would update the database
    // This is a placeholder for demonstration purposes

    // Update the sale status to mortgage approved
    await this.updateSaleStatus(saleId, SaleStatus.MORTGAGE_APPROVED, 'system');

    return sale;
  }

  /**
   * Get sales dashboard metrics
   * @param developmentId Optional development ID to filter metrics
   * @returns Sales dashboard metrics
   */
  async getSalesDashboardMetrics(developmentId?: string): Promise<{
    totalSales: number;
    totalRevenue: number;
    salesByStatus: Record<string, number>;
    recentSales: Sale[];
  }> {
    // In a real implementation, this would query the database
    // This is a placeholder for demonstration purposes

    // Get recent sales
    const recentSalesResult = await salesDb.list({
      developmentId,
      limit: 5
    });

    return {
      totalSales: 0, // Placeholder
      totalRevenue: 0, // Placeholder
      salesByStatus: {
        [SaleStatus.RESERVATION]: 0,
        [SaleStatus.CONTRACT_SIGNED]: 0,
        [SaleStatus.DEPOSIT_PAID]: 0,
        [SaleStatus.MORTGAGE_APPROVED]: 0,
        [SaleStatus.COMPLETED]: 0
      },
      recentSales: recentSalesResult.sales.map(mapPrismaSaleToSale)
    };
  }
}

export default new SalesService();