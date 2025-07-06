import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base-repository';
import { prisma } from '../index';
import { DevelopmentFinance } from '../types';

// Import types from Prisma
type FinanceCreateInput = Prisma.DevelopmentCreateInput;
type FinanceUpdateInput = Prisma.DevelopmentUpdateInput;

/**
 * Repository for managing financial records
 */
export class FinancialRepository extends BaseRepository<DevelopmentFinance, FinanceCreateInput, FinanceUpdateInput> {
  protected model: any;

  constructor(prismaClient: PrismaClient = prisma) {
    super(prismaClient);
    this.model = this.prisma.development;
  }

  /**
   * Find finance by development ID
   */
  async findByDevelopmentId(developmentId: string): Promise<DevelopmentFinance | null> {
    const development = await this.prisma.development.findUnique({
      where: { id: developmentId },
      include: {
        finances: true
      }
    });
    
    if (!development || !development.finances) {
      return null;
    }
    
    return development.finances as unknown as DevelopmentFinance;
  }

  /**
   * Find finance with full details
   */
  async findWithFullDetails(id: string): Promise<DevelopmentFinance | null> {
    const development = await this.prisma.development.findUnique({
      where: { id },
      include: {
        finances: {
          include: {
            budget: true,
            cashflow: true,
            transactions: true
          }
        }
      }
    });
    
    if (!development || !development.finances) {
      return null;
    }
    
    return development.finances as unknown as DevelopmentFinance;
  }

  /**
   * Create a transaction
   */
  async createTransaction(data: Prisma.TransactionCreateInput): Promise<any> {
    return this.prisma.transaction.create({
      data,
    });
  }

  /**
   * Find transactions by finance ID
   */
  async findTransactionsByFinanceId(financeId: string): Promise<any[]> {
    return this.prisma.transaction.findMany({
      where: { developmentId: financeId },
    });
  }

  /**
   * Find transactions by date range
   */
  async findTransactionsByDateRange(
    financeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    return this.prisma.transaction.findMany({
      where: { 
        developmentId: financeId,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  /**
   * Create a funding source
   */
  async createFundingSource(data: any): Promise<any> {
    // Implement based on your Prisma schema
    return this.prisma.development.update({
      where: { id: data.developmentId },
      data: {
        finances: {
          update: {
            fundingSources: {
              create: data
            }
          }
        }
      }
    });
  }

  /**
   * Create a drawdown record
   */
  async createDrawdown(data: any): Promise<any> {
    // Implement based on your Prisma schema
    return this.prisma.transaction.create({
      data: {
        ...data,
        type: 'DRAWDOWN'
      }
    });
  }

  /**
   * Create a repayment record
   */
  async createRepayment(data: any): Promise<any> {
    // Implement based on your Prisma schema
    return this.prisma.transaction.create({
      data: {
        ...data,
        type: 'REPAYMENT'
      }
    });
  }

  /**
   * Update the budget
   */
  async updateBudget(budgetId: string, data: any): Promise<any> {
    // Implement based on your Prisma schema
    return this.prisma.budget.update({
      where: { id: budgetId },
      data,
    });
  }

  /**
   * Calculate financial summary
   * This would typically involve complex calculations based on transactions,
   * cash flows, etc.
   */
  async calculateFinancialSummary(financeId: string): Promise<any> {
    // This would be a complex implementation based on business requirements
    // Placeholder for now
    const finance = await this.findWithFullDetails(financeId);
    
    // Calculate totals, revenues, costs, etc.
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    
    // Get transactions for calculations
    const transactions = await this.findTransactionsByFinanceId(financeId);
    
    // Example basic calculation
    for (const transaction of transactions) {
      if (transaction.type === 'INCOME') {
        totalRevenue += Number(transaction.amount);
      } else if (transaction.type === 'EXPENSE') {
        totalCost += Number(transaction.amount);
      }
    }
    
    totalProfit = totalRevenue - totalCost;
    
    // Update the finance record with calculated values
    return this.prisma.development.update({
      where: { id: financeId },
      data: {
        finances: {
          update: {
            totalRevenue,
            totalCost,
            profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
            lastCalculated: new Date(),
          }
        }
      }
    });
  }
}