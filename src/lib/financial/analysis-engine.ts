// Financial Analysis Engine
// Advanced financial calculations and reporting for property development

import db from '../database/enhanced-client'
import { Decimal } from 'decimal.js'

export interface CashFlowProjection {
  period: number
  startDate: Date
  endDate: Date
  inflows: {
    salesRevenue: number
    rentalIncome: number
    fundingDrawdowns: number
    otherInflows: number
    total: number
  }
  outflows: {
    landCosts: number
    constructionCosts: number
    professionalFees: number
    marketingCosts: number
    financeCosts: number
    legalFees: number
    contingencyCosts: number
    taxPayments: number
    otherOutflows: number
    total: number
  }
  netCashFlow: number
  cumulativeCashFlow: number
}

export interface FinancialMetrics {
  totalProjectCost: number
  totalProjectRevenue: number
  grossProfit: number
  grossMargin: number
  netProfit: number
  netMargin: number
  roi: number // Return on Investment
  irr: number // Internal Rate of Return
  npv: number // Net Present Value
  paybackPeriod: number // In months
  profitOnCost: number
  breakEvenPoint: {
    unitsSold: number
    revenueAmount: number
    timeToBreakEven: number // months
  }
}

export interface SensitivityAnalysis {
  baseCase: FinancialMetrics
  scenarios: {
    optimistic: FinancialMetrics & { assumptions: any }
    pessimistic: FinancialMetrics & { assumptions: any }
    marketDownturn: FinancialMetrics & { assumptions: any }
    costOverrun: FinancialMetrics & { assumptions: any }
  }
}

export interface InvestmentAnalysis {
  requiredFunding: number
  fundingStructure: {
    equity: number
    debt: number
    mezzanine?: number
    grants?: number
  }
  debtServiceCoverage: number
  loanToValue: number
  loanToCost: number
  expectedReturns: {
    equityIRR: number
    totalReturn: number
    annualizedReturn: number
  }
  riskMetrics: {
    volatility: number
    valueAtRisk: number
    stressTestResults: any
  }
}

export class FinancialAnalysisEngine {
  
  // Core financial calculations
  static calculateIRR(cashFlows: number[], dates: Date[]): number {
    if (cashFlows.length !== dates.length || cashFlows.length < 2) {
      throw new Error('Invalid cash flow data')
    }

    // Convert dates to periods (in years from start date)
    const periods = dates.map(date => 
      (date.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    )

    // Newton-Raphson method for IRR calculation
    let irr = 0.1 // Initial guess: 10%
    const tolerance = 0.0001
    const maxIterations = 100

    for (let i = 0; i < maxIterations; i++) {
      let npv = 0
      let derivative = 0

      for (let j = 0; j < cashFlows.length; j++) {
        const periodFactor = Math.pow(1 + irr, periods[j])
        npv += cashFlows[j] / periodFactor
        derivative -= periods[j] * cashFlows[j] / (periodFactor * (1 + irr))
      }

      if (Math.abs(npv) < tolerance) {
        return irr * 100 // Return as percentage
      }

      if (derivative === 0) break
      irr = irr - npv / derivative
    }

    return irr * 100
  }

  static calculateNPV(cashFlows: number[], discountRate: number, dates: Date[]): number {
    const periods = dates.map(date => 
      (date.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    )

    return cashFlows.reduce((npv, cashFlow, index) => {
      return npv + cashFlow / Math.pow(1 + discountRate / 100, periods[index])
    }, 0)
  }

  static calculatePaybackPeriod(cashFlows: number[]): number {
    let cumulativeCashFlow = 0
    
    for (let i = 0; i < cashFlows.length; i++) {
      cumulativeCashFlow += cashFlows[i]
      if (cumulativeCashFlow >= 0) {
        // Linear interpolation for more precise payback period
        if (i === 0) return 0
        const previousCumulative = cumulativeCashFlow - cashFlows[i]
        const interpolation = Math.abs(previousCumulative) / cashFlows[i]
        return i - 1 + interpolation
      }
    }
    
    return -1 // Payback period not achieved
  }

  // Development financial analysis
  static async analyzeDevelopmentFinancials(developmentId: string): Promise<FinancialMetrics> {
    // Get development data
    const development = await db.prisma.development.findUnique({
      where: { id: developmentId },
      include: {
        units: true,
        developer: true,
        location: true
      }
    })

    if (!development) {
      throw new Error('Development not found')
    }

    // Calculate basic metrics using available fields
    const totalUnits = development.units.length
    const soldUnits = development.units.filter(unit => unit.status === 'SOLD')
    const availableUnits = development.units.filter(unit => unit.status === 'AVAILABLE')
    
    const totalProjectRevenue = development.units.reduce((sum, unit) => {
      return sum + (unit.price || 0)
    }, 0)

    const actualSalesRevenue = soldUnits.reduce((sum, unit) => {
      return sum + (unit.price || 0)
    }, 0)

    // Estimate project cost (would be better to have this in schema)
    const totalProjectCost = totalProjectRevenue * 0.7 // Assume 30% margin

    const grossProfit = totalProjectRevenue - totalProjectCost
    const grossMargin = totalProjectRevenue > 0 ? (grossProfit / totalProjectRevenue) * 100 : 0

    // Simplified cash flow analysis (would be enhanced with actual cash flow data)
    let irr = 0
    let npv = 0
    let paybackPeriod = 0

    // Generate simple cash flow for demonstration
    const projectMonths = 36
    const monthlyCashFlows = []
    const monthlyRevenue = totalProjectRevenue / projectMonths
    const monthlyCost = totalProjectCost / projectMonths
    
    for (let i = 0; i < projectMonths; i++) {
      monthlyCashFlows.push(monthlyRevenue - monthlyCost)
    }
    
    if (monthlyCashFlows.length > 1) {
      try {
        const dates = monthlyCashFlows.map((_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() + i)
          return date
        })
        irr = this.calculateIRR(monthlyCashFlows, dates)
        npv = this.calculateNPV(monthlyCashFlows, 8, dates)
        paybackPeriod = this.calculatePaybackPeriod(monthlyCashFlows)
      } catch (error) {
        console.warn('Error calculating IRR/NPV:', error)
      }
    }

    const roi = totalProjectCost > 0 ? (grossProfit / totalProjectCost) * 100 : 0
    const profitOnCost = grossMargin

    // Calculate break-even point
    const avgUnitPrice = totalProjectRevenue / totalUnits
    const breakEvenUnits = totalProjectCost > 0 ? Math.ceil(totalProjectCost / avgUnitPrice) : 0
    const breakEvenRevenue = breakEvenUnits * avgUnitPrice

    return {
      totalProjectCost,
      totalProjectRevenue,
      grossProfit,
      grossMargin,
      netProfit: grossProfit, // Simplified - would include operating expenses
      netMargin: grossMargin,
      roi,
      irr,
      npv,
      paybackPeriod,
      profitOnCost,
      breakEvenPoint: {
        unitsSold: breakEvenUnits,
        revenueAmount: breakEvenRevenue,
        timeToBreakEven: paybackPeriod
      }
    }
  }

  // Cash flow projection
  static async generateCashFlowProjection(
    developmentId: string, 
    startDate: Date, 
    endDate: Date, 
    frequency: 'monthly' | 'quarterly' = 'monthly'
  ): Promise<CashFlowProjection[]> {
    const development = await db.prisma.development.findUnique({
      where: { id: developmentId },
      include: {
        units: true,
        developer: true,
        location: true
      }
    })

    if (!development) {
      throw new Error('Development not found')
    }

    const projections: CashFlowProjection[] = []
    const periodLength = frequency === 'monthly' ? 1 : 3 // months
    
    let currentDate = new Date(startDate)
    let period = 1
    let cumulativeCashFlow = 0

    while (currentDate < endDate) {
      const periodEndDate = new Date(currentDate)
      periodEndDate.setMonth(periodEndDate.getMonth() + periodLength)
      
      if (periodEndDate > endDate) {
        periodEndDate.setTime(endDate.getTime())
      }

      // Calculate inflows for this period
      const salesRevenue = this.estimateSalesRevenue(development, currentDate, periodEndDate)
      const rentalIncome = 0 // To be implemented based on rental properties
      const fundingDrawdowns = this.estimateFundingDrawdowns(development, currentDate, periodEndDate)
      const otherInflows = 0

      const totalInflows = salesRevenue + rentalIncome + fundingDrawdowns + otherInflows

      // Calculate outflows for this period
      const landCosts = this.estimateLandCosts(development, currentDate, periodEndDate)
      const constructionCosts = this.estimateConstructionCosts(development, currentDate, periodEndDate)
      const professionalFees = this.estimateProfessionalFees(development, currentDate, periodEndDate)
      const marketingCosts = this.estimateMarketingCosts(development, currentDate, periodEndDate)
      const financeCosts = this.estimateFinanceCosts(development, currentDate, periodEndDate)
      const legalFees = this.estimateLegalFees(development, currentDate, periodEndDate)
      const contingencyCosts = this.estimateContingencyCosts(development, currentDate, periodEndDate)
      const taxPayments = this.estimateTaxPayments(development, currentDate, periodEndDate)
      const otherOutflows = 0

      const totalOutflows = landCosts + constructionCosts + professionalFees + 
                           marketingCosts + financeCosts + legalFees + 
                           contingencyCosts + taxPayments + otherOutflows

      const netCashFlow = totalInflows - totalOutflows
      cumulativeCashFlow += netCashFlow

      projections.push({
        period,
        startDate: new Date(currentDate),
        endDate: new Date(periodEndDate),
        inflows: {
          salesRevenue,
          rentalIncome,
          fundingDrawdowns,
          otherInflows,
          total: totalInflows
        },
        outflows: {
          landCosts,
          constructionCosts,
          professionalFees,
          marketingCosts,
          financeCosts,
          legalFees,
          contingencyCosts,
          taxPayments,
          otherOutflows,
          total: totalOutflows
        },
        netCashFlow,
        cumulativeCashFlow
      })

      currentDate.setTime(periodEndDate.getTime())
      period++
    }

    return projections
  }

  // Sensitivity analysis
  static async performSensitivityAnalysis(developmentId: string): Promise<SensitivityAnalysis> {
    const baseCase = await this.analyzeDevelopmentFinancials(developmentId)
    
    // Define scenarios
    const scenarios = {
      optimistic: {
        assumptions: {
          salesPriceIncrease: 15, // 15% higher prices
          salesSpeedIncrease: 25, // 25% faster sales
          costReduction: 5, // 5% cost reduction
        }
      },
      pessimistic: {
        assumptions: {
          salesPriceDecrease: 10, // 10% lower prices
          salesSpeedDecrease: 30, // 30% slower sales
          costIncrease: 15, // 15% cost increase
        }
      },
      marketDownturn: {
        assumptions: {
          salesPriceDecrease: 20, // 20% lower prices
          salesSpeedDecrease: 50, // 50% slower sales
          costIncrease: 10, // 10% cost increase due to extended timeline
        }
      },
      costOverrun: {
        assumptions: {
          salesPriceIncrease: 0, // No price change
          salesSpeedDecrease: 0, // No speed change
          costIncrease: 25, // 25% cost overrun
        }
      }
    }

    // Calculate each scenario (simplified - in practice would re-run full analysis)
    const optimistic = {
      ...baseCase,
      totalProjectRevenue: baseCase.totalProjectRevenue * 1.15,
      totalProjectCost: baseCase.totalProjectCost * 0.95,
      assumptions: scenarios.optimistic.assumptions
    }
    optimistic.grossProfit = optimistic.totalProjectRevenue - optimistic.totalProjectCost
    optimistic.grossMargin = (optimistic.grossProfit / optimistic.totalProjectRevenue) * 100
    optimistic.roi = (optimistic.grossProfit / optimistic.totalProjectCost) * 100

    const pessimistic = {
      ...baseCase,
      totalProjectRevenue: baseCase.totalProjectRevenue * 0.9,
      totalProjectCost: baseCase.totalProjectCost * 1.15,
      assumptions: scenarios.pessimistic.assumptions
    }
    pessimistic.grossProfit = pessimistic.totalProjectRevenue - pessimistic.totalProjectCost
    pessimistic.grossMargin = (pessimistic.grossProfit / pessimistic.totalProjectRevenue) * 100
    pessimistic.roi = (pessimistic.grossProfit / pessimistic.totalProjectCost) * 100

    const marketDownturn = {
      ...baseCase,
      totalProjectRevenue: baseCase.totalProjectRevenue * 0.8,
      totalProjectCost: baseCase.totalProjectCost * 1.1,
      assumptions: scenarios.marketDownturn.assumptions
    }
    marketDownturn.grossProfit = marketDownturn.totalProjectRevenue - marketDownturn.totalProjectCost
    marketDownturn.grossMargin = (marketDownturn.grossProfit / marketDownturn.totalProjectRevenue) * 100
    marketDownturn.roi = (marketDownturn.grossProfit / marketDownturn.totalProjectCost) * 100

    const costOverrun = {
      ...baseCase,
      totalProjectCost: baseCase.totalProjectCost * 1.25,
      assumptions: scenarios.costOverrun.assumptions
    }
    costOverrun.grossProfit = costOverrun.totalProjectRevenue - costOverrun.totalProjectCost
    costOverrun.grossMargin = (costOverrun.grossProfit / costOverrun.totalProjectRevenue) * 100
    costOverrun.roi = (costOverrun.grossProfit / costOverrun.totalProjectCost) * 100

    return {
      baseCase,
      scenarios: {
        optimistic,
        pessimistic,
        marketDownturn,
        costOverrun
      }
    }
  }

  // Investment analysis
  static async performInvestmentAnalysis(developmentId: string): Promise<InvestmentAnalysis> {
    const metrics = await this.analyzeDevelopmentFinancials(developmentId)
    
    // Simplified funding analysis (would be enhanced with actual funding data)
    const totalFunding = metrics.totalProjectCost
    const equity = totalFunding * 0.3 // Assume 30% equity
    const debt = totalFunding * 0.7 // Assume 70% debt

    const loanToValue = debt > 0 ? (debt / metrics.totalProjectRevenue) * 100 : 0
    const loanToCost = debt > 0 ? (debt / metrics.totalProjectCost) * 100 : 0
    
    // Simplified debt service coverage (would need actual debt terms)
    const annualDebtService = debt * 0.08 // Assuming 8% annual interest
    const annualNetIncome = metrics.grossProfit / 3 // Assuming 3-year project
    const debtServiceCoverage = annualNetIncome / annualDebtService

    return {
      requiredFunding: totalFunding,
      fundingStructure: {
        equity,
        debt
      },
      debtServiceCoverage,
      loanToValue,
      loanToCost,
      expectedReturns: {
        equityIRR: metrics.irr,
        totalReturn: equity > 0 ? (metrics.grossProfit / equity) * 100 : 0,
        annualizedReturn: equity > 0 ? ((metrics.grossProfit / equity) / 3) * 100 : 0 // Assuming 3-year project
      },
      riskMetrics: {
        volatility: 15, // Placeholder - would calculate from historical data
        valueAtRisk: metrics.grossProfit * 0.1, // 10% VaR
        stressTestResults: {} // Placeholder for stress test results
      }
    }
  }

  // Private helper methods for cash flow estimation
  private static estimateSalesRevenue(development: any, startDate: Date, endDate: Date): number {
    // Simplified sales curve - would use more sophisticated modeling in practice
    const totalRevenue = development.units.reduce((sum: number, unit: any) => 
      sum + (unit.price?.toNumber() || 0), 0
    )
    
    const projectDuration = 36 // months
    const currentMonth = this.getMonthsDifference(development.created, startDate)
    const periodMonths = this.getMonthsDifference(startDate, endDate)
    
    // S-curve for sales: slow start, accelerate, then taper off
    const salesProgress = this.getSalesCurveProgress(currentMonth, projectDuration)
    const nextSalesProgress = this.getSalesCurveProgress(currentMonth + periodMonths, projectDuration)
    
    return totalRevenue * (nextSalesProgress - salesProgress)
  }

  private static estimateConstructionCosts(development: any, startDate: Date, endDate: Date): number {
    const totalConstructionCost = development.totalProjectCost?.toNumber() * 0.7 || 0 // 70% of total cost
    const constructionStart = development.constructionStartDate || development.created
    const constructionDuration = 24 // months
    
    const currentMonth = this.getMonthsDifference(constructionStart, startDate)
    const periodMonths = this.getMonthsDifference(startDate, endDate)
    
    if (currentMonth < 0) return 0 // Construction hasn't started
    if (currentMonth > constructionDuration) return 0 // Construction finished
    
    // Linear construction cost distribution
    const monthlyConstructionCost = totalConstructionCost / constructionDuration
    const remainingMonths = Math.min(periodMonths, constructionDuration - currentMonth)
    
    return monthlyConstructionCost * remainingMonths
  }

  private static estimateFundingDrawdowns(development: any, startDate: Date, endDate: Date): number {
    // Match funding drawdowns with construction progress
    return this.estimateConstructionCosts(development, startDate, endDate) * 1.1 // 10% buffer
  }

  private static estimateLandCosts(development: any, startDate: Date, endDate: Date): number {
    // Land costs typically paid at project start
    const projectStart = development.created
    const monthsSinceStart = this.getMonthsDifference(projectStart, startDate)
    
    if (monthsSinceStart <= 1) {
      return development.totalProjectCost?.toNumber() * 0.2 || 0 // 20% of total cost
    }
    return 0
  }

  private static estimateProfessionalFees(development: any, startDate: Date, endDate: Date): number {
    const totalFees = development.totalProjectCost?.toNumber() * 0.05 || 0 // 5% of total cost
    const projectDuration = 36 // months
    const periodMonths = this.getMonthsDifference(startDate, endDate)
    
    return (totalFees / projectDuration) * periodMonths
  }

  private static estimateMarketingCosts(development: any, startDate: Date, endDate: Date): number {
    const totalMarketing = development.totalProjectCost?.toNumber() * 0.02 || 0 // 2% of total cost
    const marketingStart = development.marketingStartDate || development.created
    const marketingDuration = 18 // months
    
    const currentMonth = this.getMonthsDifference(marketingStart, startDate)
    const periodMonths = this.getMonthsDifference(startDate, endDate)
    
    if (currentMonth < 0 || currentMonth > marketingDuration) return 0
    
    return (totalMarketing / marketingDuration) * Math.min(periodMonths, marketingDuration - currentMonth)
  }

  private static estimateFinanceCosts(development: any, startDate: Date, endDate: Date): number {
    // Interest on development loan
    const totalDebt = development.totalProjectCost?.toNumber() * 0.7 || 0 // 70% debt financing
    const annualInterestRate = 0.08 // 8%
    const periodMonths = this.getMonthsDifference(startDate, endDate)
    
    return (totalDebt * annualInterestRate * periodMonths) / 12
  }

  private static estimateLegalFees(development: any, startDate: Date, endDate: Date): number {
    const totalLegal = development.totalProjectCost?.toNumber() * 0.01 || 0 // 1% of total cost
    const projectDuration = 36 // months
    const periodMonths = this.getMonthsDifference(startDate, endDate)
    
    return (totalLegal / projectDuration) * periodMonths
  }

  private static estimateContingencyCosts(development: any, startDate: Date, endDate: Date): number {
    // Contingency is typically 5-10% of construction costs
    const constructionCosts = this.estimateConstructionCosts(development, startDate, endDate)
    return constructionCosts * 0.05 // 5% contingency
  }

  private static estimateTaxPayments(development: any, startDate: Date, endDate: Date): number {
    // VAT on construction costs
    const constructionCosts = this.estimateConstructionCosts(development, startDate, endDate)
    return constructionCosts * 0.135 // 13.5% VAT in Ireland
  }

  // Utility methods
  private static getMonthsDifference(startDate: Date, endDate: Date): number {
    return (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
           (endDate.getMonth() - startDate.getMonth())
  }

  private static getSalesCurveProgress(month: number, totalDuration: number): number {
    if (month <= 0) return 0
    if (month >= totalDuration) return 1
    
    // S-curve formula: 1 / (1 + e^(-k(x - midpoint)))
    const midpoint = totalDuration * 0.6 // Sales peak at 60% through project
    const k = 8 / totalDuration // Steepness factor
    const x = month / totalDuration
    
    return 1 / (1 + Math.exp(-k * (x - 0.6)))
  }
}

// Export main analysis functions
export const analyzeDevelopmentFinancials = FinancialAnalysisEngine.analyzeDevelopmentFinancials.bind(FinancialAnalysisEngine)
export const generateCashFlowProjection = FinancialAnalysisEngine.generateCashFlowProjection.bind(FinancialAnalysisEngine)
export const performSensitivityAnalysis = FinancialAnalysisEngine.performSensitivityAnalysis.bind(FinancialAnalysisEngine)
export const performInvestmentAnalysis = FinancialAnalysisEngine.performInvestmentAnalysis.bind(FinancialAnalysisEngine)