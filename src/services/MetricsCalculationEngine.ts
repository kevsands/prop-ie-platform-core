/**
 * Enterprise Metrics Calculation Engine
 * Single source of truth for all financial and unit calculations
 * 
 * @fileoverview Unified calculation engine ensuring data consistency across all developer portal routes
 * @version 1.0.0
 * @author Property Development Platform Team
 */

import { Unit, Invoice, TeamMember, UnitStatus } from '@/types/project';

// =============================================================================
// CALCULATION INTERFACES
// =============================================================================

export interface FinancialMetrics {
  totalRevenue: number;
  projectedRevenue: number;
  completedRevenue: number;
  pendingRevenue: number;
  remainingRevenue: number;
  totalCosts: number;
  pendingInvoices: number;
  paidInvoices: number;
  grossProfit: number;
  profitMargin: number;
  cashInflow: number;
  cashOutflow: number;
  netCashFlow: number;
}

export interface UnitMetrics {
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  heldUnits: number;
  withdrawnUnits: number;
  averageUnitPrice: number;
  salesVelocity: number;
  conversionRate: number;
}

export interface ProjectMetrics extends UnitMetrics, FinancialMetrics {
  lastCalculated: Date;
}

// =============================================================================
// ENTERPRISE METRICS CALCULATION ENGINE
// =============================================================================

export class MetricsCalculationEngine {
  private static instance: MetricsCalculationEngine;

  private constructor() {
    // Singleton pattern for consistency
  }

  public static getInstance(): MetricsCalculationEngine {
    if (!MetricsCalculationEngine.instance) {
      MetricsCalculationEngine.instance = new MetricsCalculationEngine();
    }
    return MetricsCalculationEngine.instance;
  }

  // =============================================================================
  // UNIT METRICS CALCULATIONS
  // =============================================================================

  /**
   * Calculate comprehensive unit metrics from unit array
   */
  public calculateUnitMetrics(units: ReadonlyArray<Unit>): UnitMetrics {
    const soldUnits = units.filter(u => u.status === 'sold').length;
    const reservedUnits = units.filter(u => u.status === 'reserved').length;
    const availableUnits = units.filter(u => u.status === 'available').length;
    const heldUnits = units.filter(u => u.status === 'held').length;
    const withdrawnUnits = units.filter(u => u.status === 'withdrawn').length;
    
    const totalRevenue = units
      .filter(u => u.status === 'sold')
      .reduce((sum, u) => sum + u.pricing.currentPrice, 0);
    
    const averageUnitPrice = units.length > 0 ? 
      units.reduce((sum, u) => sum + u.pricing.currentPrice, 0) / units.length : 0;

    // Calculate sales velocity (units per week) - based on historical data
    const salesVelocity = this.calculateSalesVelocity(units);
    
    // Calculate conversion rate (sold units / total units * 100)
    const conversionRate = units.length > 0 ? (soldUnits / units.length) * 100 : 0;

    return {
      totalUnits: units.length,
      soldUnits,
      reservedUnits,
      availableUnits,
      heldUnits,
      withdrawnUnits,
      averageUnitPrice,
      salesVelocity,
      conversionRate
    };
  }

  // =============================================================================
  // FINANCIAL METRICS CALCULATIONS
  // =============================================================================

  /**
   * Calculate comprehensive financial metrics
   */
  public calculateFinancialMetrics(
    units: ReadonlyArray<Unit>, 
    invoices: ReadonlyArray<Invoice>
  ): FinancialMetrics {
    // Revenue calculations
    const completedRevenue = units
      .filter(u => u.status === 'sold')
      .reduce((sum, u) => sum + u.pricing.currentPrice, 0);
    
    const pendingRevenue = units
      .filter(u => u.status === 'reserved')
      .reduce((sum, u) => sum + u.pricing.currentPrice, 0);
    
    const remainingRevenue = units
      .filter(u => u.status === 'available')
      .reduce((sum, u) => sum + u.pricing.currentPrice, 0);
    
    const projectedRevenue = units
      .reduce((sum, u) => sum + u.pricing.currentPrice, 0);

    // Cost calculations
    const totalCosts = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const pendingInvoices = invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const paidInvoices = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    
    // Profit calculations
    const grossProfit = completedRevenue - paidInvoices;
    const profitMargin = completedRevenue > 0 ? (grossProfit / completedRevenue) * 100 : 0;
    
    // Cash flow calculations (using standard industry assumptions)
    const cashInflow = this.calculateCashInflow(units);
    const cashOutflow = paidInvoices;
    const netCashFlow = cashInflow - cashOutflow;

    return {
      totalRevenue: completedRevenue,
      projectedRevenue,
      completedRevenue,
      pendingRevenue,
      remainingRevenue,
      totalCosts,
      pendingInvoices,
      paidInvoices,
      grossProfit,
      profitMargin,
      cashInflow,
      cashOutflow,
      netCashFlow
    };
  }

  // =============================================================================
  // COMBINED PROJECT METRICS
  // =============================================================================

  /**
   * Calculate all project metrics in one consistent calculation
   */
  public calculateProjectMetrics(
    units: ReadonlyArray<Unit>, 
    invoices: ReadonlyArray<Invoice>
  ): ProjectMetrics {
    const unitMetrics = this.calculateUnitMetrics(units);
    const financialMetrics = this.calculateFinancialMetrics(units, invoices);

    return {
      ...unitMetrics,
      ...financialMetrics,
      lastCalculated: new Date()
    };
  }

  // =============================================================================
  // UTILITY CALCULATIONS
  // =============================================================================

  /**
   * Calculate sales velocity based on historical unit sales
   */
  private calculateSalesVelocity(units: ReadonlyArray<Unit>): number {
    const soldUnits = units.filter(u => u.status === 'sold');
    
    if (soldUnits.length === 0) return 0;

    // Get the earliest and latest sale dates
    const saleDates = soldUnits
      .filter(u => u.saleDate)
      .map(u => u.saleDate!.getTime())
      .sort((a, b) => a - b);

    if (saleDates.length < 2) return 0;

    // Calculate weeks between first and last sale
    const weeksBetween = (saleDates[saleDates.length - 1] - saleDates[0]) / (1000 * 60 * 60 * 24 * 7);
    
    // Return units per week
    return weeksBetween > 0 ? soldUnits.length / weeksBetween : 0;
  }

  /**
   * Calculate cash inflow based on industry-standard deposit structures
   */
  private calculateCashInflow(units: ReadonlyArray<Unit>): number {
    const soldUnits = units.filter(u => u.status === 'sold');
    const reservedUnits = units.filter(u => u.status === 'reserved');
    
    // Standard deposit assumptions:
    // - Sold units: 30% deposit received
    // - Reserved units: 10% deposit received
    const soldDeposits = soldUnits.reduce((sum, u) => sum + (u.pricing.currentPrice * 0.30), 0);
    const reservedDeposits = reservedUnits.reduce((sum, u) => sum + (u.pricing.currentPrice * 0.10), 0);
    
    return soldDeposits + reservedDeposits;
  }

  // =============================================================================
  // REVENUE BREAKDOWN CALCULATIONS
  // =============================================================================

  /**
   * Calculate revenue breakdown by status for display components
   */
  public calculateRevenueBreakdown(units: ReadonlyArray<Unit>) {
    return {
      completed: {
        revenue: units.filter(u => u.status === 'sold').reduce((sum, u) => sum + u.pricing.currentPrice, 0),
        count: units.filter(u => u.status === 'sold').length
      },
      pending: {
        revenue: units.filter(u => u.status === 'reserved').reduce((sum, u) => sum + u.pricing.currentPrice, 0),
        count: units.filter(u => u.status === 'reserved').length
      },
      remaining: {
        revenue: units.filter(u => u.status === 'available').reduce((sum, u) => sum + u.pricing.currentPrice, 0),
        count: units.filter(u => u.status === 'available').length
      }
    };
  }

  // =============================================================================
  // VALIDATION AND CONSISTENCY CHECKS
  // =============================================================================

  /**
   * Validate metric calculations for consistency
   */
  public validateMetrics(metrics: ProjectMetrics): boolean {
    // Check that unit counts add up
    const totalUnitsCheck = metrics.soldUnits + metrics.reservedUnits + 
                           metrics.availableUnits + metrics.heldUnits + 
                           metrics.withdrawnUnits === metrics.totalUnits;

    // Check that revenue calculations are consistent
    const revenueCheck = metrics.completedRevenue + metrics.pendingRevenue + 
                        metrics.remainingRevenue === metrics.projectedRevenue;

    // Check that profit margin calculation is correct
    const profitMarginCheck = metrics.completedRevenue > 0 ? 
      Math.abs(metrics.profitMargin - ((metrics.grossProfit / metrics.completedRevenue) * 100)) < 0.01 : 
      metrics.profitMargin === 0;

    return totalUnitsCheck && revenueCheck && profitMarginCheck;
  }

  /**
   * Format currency consistently across all components
   */
  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format compact currency for dashboard displays
   */
  public formatCompactCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return this.formatCurrency(amount);
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const metricsEngine = MetricsCalculationEngine.getInstance();