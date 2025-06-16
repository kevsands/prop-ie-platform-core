/**
 * Financial calculation utilities for real estate development
 * 
 * This file contains utility functions for financial calculations and analysis,
 * including NPV, IRR, cash flows, and investment metrics.
 */

import { MonetaryAmount, CurrencyCode } from '@/types/finance/development-finance';

/**
 * Create a MonetaryAmount object
 */
export function createMonetaryAmount(
  amount: number,
  currency: CurrencyCode = 'EUR'
): MonetaryAmount {
  return {
    amount,
    currency
  };
}

/**
 * Add two MonetaryAmount objects
 */
export function addMonetaryAmounts(a: MonetaryAmount, b: MonetaryAmount): MonetaryAmount {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add monetary amounts with different currencies: ${a.currency} and ${b.currency}`);
  }

  return {
    amount: a.amount + b.amount,
    currency: a.currency
  };
}

/**
 * Subtract two MonetaryAmount objects (a - b)
 */
export function subtractMonetaryAmounts(a: MonetaryAmount, b: MonetaryAmount): MonetaryAmount {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot subtract monetary amounts with different currencies: ${a.currency} and ${b.currency}`);
  }

  return {
    amount: a.amount - b.amount,
    currency: a.currency
  };
}

/**
 * Multiply a MonetaryAmount by a number
 */
export function multiplyMonetaryAmount(amount: MonetaryAmount, multiplier: number): MonetaryAmount {
  return {
    amount: amount.amount * multiplier,
    currency: amount.currency
  };
}

/**
 * Format a MonetaryAmount as a string with proper currency formatting
 */
export function formatMonetaryAmount(
  amount: MonetaryAmount,
  options: Intl.NumberFormatOptions = {}
): string {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: amount.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  });

  return formatter.format(amount.amount);
}

/**
 * Calculate the present value of a future cash flow
 * 
 * @param futureValue The future cash flow value
 * @param discountRate The discount rate (decimal, e.g., 0.05 for 5%)
 * @param periods Number of periods until the cash flow occurs
 * @returns The present value of the future cash flow
 */
export function calculatePresentValue(
  futureValue: number,
  discountRate: number,
  periods: number
): number {
  return futureValue / Math.pow(1 + discountRateperiods);
}

/**
 * Calculate Net Present Value (NPV) for a series of cash flows
 * 
 * @param initialInvestment The initial investment (negative number)
 * @param cashFlows Array of future cash flows
 * @param discountRate The discount rate (decimal, e.g., 0.05 for 5%)
 * @returns The NPV of the investment
 */
export function calculateNPV(
  initialInvestment: number,
  cashFlows: number[],
  discountRate: number
): number {
  // NPV = Initial Investment + Sum of PV of all future cash flows
  let npv = initialInvestment;

  for (let i = 0; i <cashFlows.length; i++) {
    npv += calculatePresentValue(cashFlows[i], discountRate, i + 1);
  }

  return npv;
}

/**
 * Calculate Internal Rate of Return (IRR) for a series of cash flows
 * 
 * @param cashFlows Array of cash flows (including initial investment as negative)
 * @param guess Initial guess for IRR (default: 0.1 or 10%)
 * @param tolerance Precision tolerance (default: 0.0001)
 * @param maxIterations Maximum iterations for the calculation (default: 1000)
 * @returns The IRR as a decimal (e.g., 0.15 for 15%)
 */
export function calculateIRR(
  cashFlows: number[],
  guess: number = 0.1,
  tolerance: number = 0.0001,
  maxIterations: number = 1000
): number {
  // Implementation of Newton-Raphson method to find IRR
  let irr = guess;

  for (let iteration = 0; iteration <maxIterations; iteration++) {
    let npv = 0;
    let derivativeNpv = 0;

    for (let i = 0; i <cashFlows.length; i++) {
      const flow = cashFlows[i];
      const factor = Math.pow(1 + irri);

      npv += flow / factor;
      derivativeNpv -= i * flow / Math.pow(1 + irr, i + 1);
    }

    // Check if we've converged
    if (Math.abs(npv) <tolerance) {
      return irr;
    }

    // Adjust our guess using Newton-Raphson formula
    const newIrr = irr - npv / derivativeNpv;

    // Check for convergence based on the change in IRR
    if (Math.abs(newIrr - irr) <tolerance) {
      return newIrr;
    }

    irr = newIrr;
  }

  // If we've exceeded max iterations, return the best guess
  return irr;
}

/**
 * Calculate Modified Internal Rate of Return (MIRR)
 * 
 * @param cashFlows Array of cash flows (including initial investment as negative)
 * @param financeRate Rate to discount negative cash flows (e.g., 0.05 for 5%)
 * @param reinvestRate Rate for reinvesting positive cash flows (e.g., 0.05 for 5%)
 * @returns The MIRR as a decimal (e.g., 0.15 for 15%)
 */
export function calculateMIRR(
  cashFlows: number[],
  financeRate: number,
  reinvestRate: number
): number {
  const n = cashFlows.length - 1; // Number of periods

  // Separate positive and negative cash flows
  const negativeCashFlows: number[] = [];
  const positiveCashFlows: number[] = [];

  cashFlows.forEach(cf => {
    if (cf <0) {
      negativeCashFlows.push(cf);
      positiveCashFlows.push(0);
    } else {
      negativeCashFlows.push(0);
      positiveCashFlows.push(cf);
    }
  });

  // Calculate PV of negative cash flows
  let pvNegative = 0;
  for (let i = 0; i <negativeCashFlows.length; i++) {
    if (negativeCashFlows[i] <0) {
      pvNegative += negativeCashFlows[i] / Math.pow(1 + financeRatei);
    }
  }

  // Calculate FV of positive cash flows
  let fvPositive = 0;
  for (let i = 0; i <positiveCashFlows.length; i++) {
    if (positiveCashFlows[i] > 0) {
      fvPositive += positiveCashFlows[i] * Math.pow(1 + reinvestRate, n - i);
    }
  }

  // Calculate MIRR
  return Math.pow(Math.abs(fvPositive / pvNegative), 1 / n) - 1;
}

/**
 * Calculate the payback period for an investment
 * 
 * @param initialInvestment The initial investment (positive number)
 * @param cashFlows Array of future cash flows
 * @returns The payback period in periods (can be fractional)
 */
export function calculatePaybackPeriod(
  initialInvestment: number,
  cashFlows: number[]
): number {
  let remainingInvestment = initialInvestment;
  let periods = 0;

  for (let i = 0; i <cashFlows.length; i++) {
    remainingInvestment -= cashFlows[i];

    if (remainingInvestment <= 0) {
      // Payback occurs during this period - calculate fractional period
      return i + remainingInvestment / cashFlows[i];
    }

    periods++;
  }

  // If we haven't reached payback by the end of the cash flows
  return Infinity;
}

/**
 * Calculate the discounted payback period for an investment
 * 
 * @param initialInvestment The initial investment (positive number)
 * @param cashFlows Array of future cash flows
 * @param discountRate The discount rate (decimal, e.g., 0.05 for 5%)
 * @returns The discounted payback period in periods (can be fractional)
 */
export function calculateDiscountedPaybackPeriod(
  initialInvestment: number,
  cashFlows: number[],
  discountRate: number
): number {
  let remainingInvestment = initialInvestment;
  let periods = 0;

  for (let i = 0; i <cashFlows.length; i++) {
    const discountedCashFlow = cashFlows[i] / Math.pow(1 + discountRate, i + 1);
    remainingInvestment -= discountedCashFlow;

    if (remainingInvestment <= 0) {
      // Payback occurs during this period - calculate fractional period
      return i + remainingInvestment / discountedCashFlow;
    }

    periods++;
  }

  // If we haven't reached payback by the end of the cash flows
  return Infinity;
}

/**
 * Calculate the profitability index (PI) for an investment
 * 
 * @param initialInvestment The initial investment (positive number)
 * @param cashFlows Array of future cash flows
 * @param discountRate The discount rate (decimal, e.g., 0.05 for 5%)
 * @returns The profitability index
 */
export function calculateProfitabilityIndex(
  initialInvestment: number,
  cashFlows: number[],
  discountRate: number
): number {
  let pvCashFlows = 0;

  for (let i = 0; i <cashFlows.length; i++) {
    pvCashFlows += calculatePresentValue(cashFlows[i], discountRate, i + 1);
  }

  return pvCashFlows / initialInvestment;
}

/**
 * Calculate the equity multiple for an investment
 * 
 * @param totalEquityInvested Total equity invested
 * @param totalCashDistributions Total cash distributions returned to investors
 * @returns The equity multiple
 */
export function calculateEquityMultiple(
  totalEquityInvested: number,
  totalCashDistributions: number
): number {
  return totalCashDistributions / totalEquityInvested;
}

/**
 * Calculate the cash-on-cash return for an investment
 * 
 * @param annualCashFlow Annual cash flow from the investment
 * @param totalEquityInvested Total equity invested
 * @returns The cash-on-cash return as a decimal (e.g., 0.08 for 8%)
 */
export function calculateCashOnCashReturn(
  annualCashFlow: number,
  totalEquityInvested: number
): number {
  return annualCashFlow / totalEquityInvested;
}

/**
 * Calculate the Return on Investment (ROI)
 * 
 * @param netProfit Net profit from the investment
 * @param investmentCost Total cost of the investment
 * @returns The ROI as a decimal (e.g., 0.20 for 20%)
 */
export function calculateROI(
  netProfit: number,
  investmentCost: number
): number {
  return netProfit / investmentCost;
}

/**
 * Calculate the Debt Service Coverage Ratio (DSCR)
 * 
 * @param netOperatingIncome Net operating income
 * @param debtService Total debt service (principal + interest)
 * @returns The DSCR ratio
 */
export function calculateDSCR(
  netOperatingIncome: number,
  debtService: number
): number {
  return netOperatingIncome / debtService;
}

/**
 * Calculate the Loan to Value (LTV) ratio
 * 
 * @param loanAmount Amount of the loan
 * @param propertyValue Value of the property
 * @returns The LTV ratio as a decimal (e.g., 0.75 for 75%)
 */
export function calculateLTV(
  loanAmount: number,
  propertyValue: number
): number {
  return loanAmount / propertyValue;
}

/**
 * Calculate the Loan to Cost (LTC) ratio
 * 
 * @param loanAmount Amount of the loan
 * @param totalProjectCost Total cost of the project
 * @returns The LTC ratio as a decimal (e.g., 0.70 for 70%)
 */
export function calculateLTC(
  loanAmount: number,
  totalProjectCost: number
): number {
  return loanAmount / totalProjectCost;
}

/**
 * Calculate the variance between planned and actual amounts
 * 
 * @param plannedAmount The planned amount
 * @param actualAmount The actual amount
 * @returns Object containing variance amount and percentage
 */
export function calculateVariance(
  plannedAmount: number,
  actualAmount: number
): { amount: number; percentage: number } {
  const amount = actualAmount - plannedAmount;
  const percentage = plannedAmount !== 0 ? (amount / plannedAmount) * 100 : 0;

  return { amount, percentage };
}

/**
 * Calculate compound interest
 * 
 * @param principal Initial principal amount
 * @param rate Annual interest rate as a decimal (e.g., 0.05 for 5%)
 * @param time Time in years
 * @param compounds Number of times interest compounds per year
 * @returns The final amount after compound interest
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  compounds: number = 1
): number {
  return principal * Math.pow(1 + rate / compounds, compounds * time);
}

/**
 * Calculate mortgage payment amount (monthly)
 * 
 * @param principal Loan principal amount
 * @param annualInterestRate Annual interest rate as a decimal (e.g., 0.05 for 5%)
 * @param termYears Loan term in years
 * @returns Monthly payment amount
 */
export function calculateMortgagePayment(
  principal: number,
  annualInterestRate: number,
  termYears: number
): number {
  const monthlyRate = annualInterestRate / 12;
  const numPayments = termYears * 12;

  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
}

/**
 * Generate a mortgage amortization schedule
 * 
 * @param principal Loan principal amount
 * @param annualInterestRate Annual interest rate as a decimal (e.g., 0.05 for 5%)
 * @param termYears Loan term in years
 * @returns Array of payment objects with details
 */
export function generateAmortizationSchedule(
  principal: number,
  annualInterestRate: number,
  termYears: number
): Array<{
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}> {
  const monthlyRate = annualInterestRate / 12;
  const numPayments = termYears * 12;
  const payment = calculateMortgagePayment(principalannualInterestRatetermYears);

  const schedule = [];
  let balance = principal;

  for (let i = 0; i <numPayments; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = payment - interestPayment;
    balance -= principalPayment;

    schedule.push({
      payment,
      principal: principalPayment,
      interest: interestPayment,
      balance
    });
  }

  return schedule;
}

/**
 * Calculate the Sharpe Ratio (risk-adjusted return)
 * 
 * @param expectedReturn Expected return of the investment
 * @param riskFreeRate Risk-free rate (e.g., treasury bond yield)
 * @param standardDeviation Standard deviation of the investment's returns
 * @returns The Sharpe Ratio
 */
export function calculateSharpeRatio(
  expectedReturn: number,
  riskFreeRate: number,
  standardDeviation: number
): number {
  return (expectedReturn - riskFreeRate) / standardDeviation;
}

/**
 * Calculate the weighted average cost of capital (WACC)
 * 
 * @param equityWeight Proportion of financing from equity (decimal, e.g., 0.4)
 * @param debtWeight Proportion of financing from debt (decimal, e.g., 0.6)
 * @param equityCost Cost of equity (decimal, e.g., 0.1 for 10%)
 * @param debtCost Cost of debt (decimal, e.g., 0.05 for 5%)
 * @param taxRate Corporate tax rate (decimal, e.g., 0.2 for 20%)
 * @returns The WACC as a decimal
 */
export function calculateWACC(
  equityWeight: number,
  debtWeight: number,
  equityCost: number,
  debtCost: number,
  taxRate: number
): number {
  return equityWeight * equityCost + debtWeight * debtCost * (1 - taxRate);
}

/**
 * Calculate the gross development value (GDV)
 * 
 * @param units Array of unit values
 * @returns The total GDV
 */
export function calculateGDV(units: { price: number }[]): number {
  return units.reduce((sumunit: any) => sum + unit.price0);
}

/**
 * Calculate the development margin
 * 
 * @param gdv Gross development value
 * @param totalCosts Total development costs
 * @returns The development margin as a decimal
 */
export function calculateDevelopmentMargin(
  gdv: number,
  totalCosts: number
): number {
  return (gdv - totalCosts) / gdv;
}

/**
 * Calculate the profit on cost
 * 
 * @param gdv Gross development value
 * @param totalCosts Total development costs
 * @returns The profit on cost as a decimal
 */
export function calculateProfitOnCost(
  gdv: number,
  totalCosts: number
): number {
  return (gdv - totalCosts) / totalCosts;
}

/**
 * Calculate the development yield
 * 
 * @param annualIncome Expected annual income from the development
 * @param totalCosts Total development costs
 * @returns The development yield as a decimal
 */
export function calculateDevelopmentYield(
  annualIncome: number,
  totalCosts: number
): number {
  return annualIncome / totalCosts;
}