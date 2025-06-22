/**
 * Financial Calculations Library
 * Production-ready calculations for mortgage, HTB, and deposit calculations
 */

// Mortgage calculation constants (Irish market standards)
export const MORTGAGE_CONSTANTS = {
  maxLTV: 0.90, // 90% max Loan-to-Value for first-time buyers
  maxLTVNonFTB: 0.80, // 80% max for non-first-time buyers
  maxAffordabilityRatio: 0.35, // 35% of net monthly income max
  maxIncomeMultiple: 4.5, // 4.5x annual income maximum
  stressTestRate: 0.055, // 5.5% stress test rate (2% above typical rate)
  typicalRate: 0.035, // 3.5% typical mortgage rate
  mortgageTermYears: 30, // 30-year term standard
  htbMaxPropertyPrice: 500000, // €500k HTB eligibility limit
  htbMaxGrant: 30000, // €30k maximum HTB grant
  htbMinGrant: 10000, // €10k minimum HTB grant
  htbFirstThreshold: 320000, // €320k threshold for HTB calculation
  htbFirstRate: 0.05, // 5% for first €320k
  htbSecondRate: 0.10 // 10% for amount over €320k
};

/**
 * Calculate monthly mortgage payment using standard amortization formula
 */
export function calculateMonthlyPayment(
  loanAmount: number, 
  annualRate: number, 
  termYears: number = MORTGAGE_CONSTANTS.mortgageTermYears
): number {
  if (loanAmount <= 0 || annualRate <= 0) return 0;
  
  const monthlyRate = annualRate / 12;
  const totalPayments = termYears * 12;
  
  const monthlyPayment = loanAmount * (
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)
  );
  
  return Math.round(monthlyPayment * 100) / 100; // Round to cents
}

/**
 * Calculate mortgage affordability based on income and expenses
 */
export function calculateMortgageAffordability(
  annualIncome: number,
  monthlyExpenses: number = 0,
  isFirstTimeBuyer: boolean = true,
  propertyPrice: number
): {
  maxLoanAmount: number;
  maxPropertyPrice: number;
  monthlyPaymentCapacity: number;
  affordabilityPassed: boolean;
  maxAffordablePrice: number;
  stressTestPassed: boolean;
} {
  const monthlyIncome = annualIncome / 12;
  const netMonthlyIncome = monthlyIncome - monthlyExpenses;
  
  // Calculate maximum monthly payment (35% of net income)
  const maxMonthlyPayment = netMonthlyIncome * MORTGAGE_CONSTANTS.maxAffordabilityRatio;
  
  // Calculate maximum loan based on income multiple
  const maxLoanByIncome = annualIncome * MORTGAGE_CONSTANTS.maxIncomeMultiple;
  
  // Calculate maximum loan based on payment capacity
  const maxLoanByPayment = maxMonthlyPayment / 
    (MORTGAGE_CONSTANTS.typicalRate / 12) * 
    (1 - Math.pow(1 + MORTGAGE_CONSTANTS.typicalRate / 12, -MORTGAGE_CONSTANTS.mortgageTermYears * 12));
  
  // Take the lower of the two maximums
  const maxLoanAmount = Math.min(maxLoanByIncome, maxLoanByPayment);
  
  // Calculate LTV-based maximum
  const maxLTV = isFirstTimeBuyer ? MORTGAGE_CONSTANTS.maxLTV : MORTGAGE_CONSTANTS.maxLTVNonFTB;
  const maxPropertyPrice = maxLoanAmount / maxLTV;
  
  // For the specific property, calculate affordability
  const requiredLoan = propertyPrice * maxLTV;
  const monthlyPayment = calculateMonthlyPayment(requiredLoan, MORTGAGE_CONSTANTS.typicalRate);
  const affordabilityRatio = monthlyPayment / netMonthlyIncome;
  
  // Stress test at higher rate
  const stressTestPayment = calculateMonthlyPayment(requiredLoan, MORTGAGE_CONSTANTS.stressTestRate);
  const stressTestRatio = stressTestPayment / netMonthlyIncome;
  
  return {
    maxLoanAmount: Math.round(maxLoanAmount),
    maxPropertyPrice: Math.round(maxPropertyPrice),
    monthlyPaymentCapacity: Math.round(maxMonthlyPayment),
    affordabilityPassed: affordabilityRatio <= MORTGAGE_CONSTANTS.maxAffordabilityRatio,
    maxAffordablePrice: Math.round(maxPropertyPrice),
    stressTestPassed: stressTestRatio <= (MORTGAGE_CONSTANTS.maxAffordabilityRatio * 1.1) // 10% buffer for stress test
  };
}

/**
 * Calculate Help to Buy (HTB) grant amount
 */
export function calculateHTBGrant(propertyPrice: number): number {
  // Check eligibility
  if (propertyPrice > MORTGAGE_CONSTANTS.htbMaxPropertyPrice) {
    return 0;
  }
  
  let grantAmount = 0;
  
  if (propertyPrice <= MORTGAGE_CONSTANTS.htbFirstThreshold) {
    // 5% of full amount if under €320k
    grantAmount = propertyPrice * MORTGAGE_CONSTANTS.htbFirstRate;
  } else {
    // 5% of first €320k + 10% of remainder
    grantAmount = (MORTGAGE_CONSTANTS.htbFirstThreshold * MORTGAGE_CONSTANTS.htbFirstRate) + 
                  ((propertyPrice - MORTGAGE_CONSTANTS.htbFirstThreshold) * MORTGAGE_CONSTANTS.htbSecondRate);
  }
  
  // Apply min/max limits
  grantAmount = Math.max(
    MORTGAGE_CONSTANTS.htbMinGrant, 
    Math.min(MORTGAGE_CONSTANTS.htbMaxGrant, grantAmount)
  );
  
  return Math.round(grantAmount);
}

/**
 * Calculate complete purchase breakdown for a property
 */
export function calculatePurchaseBreakdown(
  propertyPrice: number,
  annualIncome: number,
  isFirstTimeBuyer: boolean = true,
  hasHTBApproval: boolean = false,
  monthlyExpenses: number = 0
): {
  propertyPrice: number;
  depositRequired: number;
  loanAmount: number;
  htbGrant: number;
  netDeposit: number;
  monthlyPayment: number;
  totalCost: number;
  affordabilityCheck: {
    passed: boolean;
    affordabilityRatio: number;
    stressTestPassed: boolean;
    maxAffordablePrice: number;
  };
  htbEligible: boolean;
  stampDuty: number;
  legalFees: number;
  estimatedClosingCosts: number;
} {
  // Calculate HTB grant
  const htbEligible = isFirstTimeBuyer && propertyPrice <= MORTGAGE_CONSTANTS.htbMaxPropertyPrice;
  const htbGrant = hasHTBApproval && htbEligible ? calculateHTBGrant(propertyPrice) : 0;
  
  // Calculate deposit (10% standard)
  const depositRequired = Math.round(propertyPrice * 0.1);
  const netDeposit = Math.max(0, depositRequired - htbGrant);
  
  // Calculate loan amount
  const maxLTV = isFirstTimeBuyer ? MORTGAGE_CONSTANTS.maxLTV : MORTGAGE_CONSTANTS.maxLTVNonFTB;
  const loanAmount = Math.round(propertyPrice * maxLTV);
  
  // Calculate monthly payment
  const monthlyPayment = calculateMonthlyPayment(loanAmount, MORTGAGE_CONSTANTS.typicalRate);
  
  // Calculate affordability
  const affordability = calculateMortgageAffordability(annualIncome, monthlyExpenses, isFirstTimeBuyer, propertyPrice);
  const monthlyIncome = (annualIncome / 12) - monthlyExpenses;
  const affordabilityRatio = monthlyPayment / monthlyIncome;
  
  // Calculate additional costs
  const stampDuty = calculateStampDuty(propertyPrice, isFirstTimeBuyer);
  const legalFees = Math.max(2000, propertyPrice * 0.005); // Min €2k or 0.5%
  const estimatedClosingCosts = stampDuty + legalFees + 1500; // +€1.5k for surveys, etc.
  
  const totalCost = netDeposit + estimatedClosingCosts;
  
  return {
    propertyPrice,
    depositRequired,
    loanAmount,
    htbGrant,
    netDeposit,
    monthlyPayment: Math.round(monthlyPayment),
    totalCost: Math.round(totalCost),
    affordabilityCheck: {
      passed: affordability.affordabilityPassed && affordability.stressTestPassed,
      affordabilityRatio: Math.round(affordabilityRatio * 100) / 100,
      stressTestPassed: affordability.stressTestPassed,
      maxAffordablePrice: affordability.maxAffordablePrice
    },
    htbEligible,
    stampDuty: Math.round(stampDuty),
    legalFees: Math.round(legalFees),
    estimatedClosingCosts: Math.round(estimatedClosingCosts)
  };
}

/**
 * Calculate stamp duty for Irish property purchase
 */
function calculateStampDuty(propertyPrice: number, isFirstTimeBuyer: boolean): number {
  if (isFirstTimeBuyer && propertyPrice <= 500000) {
    return 0; // First-time buyer exemption up to €500k
  }
  
  // Standard stamp duty rates
  if (propertyPrice <= 1000000) {
    return propertyPrice * 0.01; // 1% up to €1M
  } else {
    return 10000 + ((propertyPrice - 1000000) * 0.02); // 1% first €1M + 2% above
  }
}

/**
 * Calculate estate agent commission
 */
export function calculateEstateAgentCommission(
  propertyPrice: number,
  commissionRate: number = 0.015 // 1.5% standard rate
): {
  commissionAmount: number;
  vatAmount: number;
  totalCommission: number;
} {
  const commissionAmount = propertyPrice * commissionRate;
  const vatAmount = commissionAmount * 0.23; // 23% VAT in Ireland
  const totalCommission = commissionAmount + vatAmount;
  
  return {
    commissionAmount: Math.round(commissionAmount),
    vatAmount: Math.round(vatAmount),
    totalCommission: Math.round(totalCommission)
  };
}

/**
 * Calculate developer profit margins and costs
 */
export function calculateDeveloperFinancials(
  unitPrice: number,
  buildCost: number = unitPrice * 0.6, // Typical 60% build cost ratio
  landCost: number = unitPrice * 0.15,  // Typical 15% land cost
  marketingCost: number = unitPrice * 0.02, // 2% marketing
  legalCosts: number = unitPrice * 0.01, // 1% legal/professional
  financeCharges: number = unitPrice * 0.03 // 3% finance charges
): {
  totalCosts: number;
  grossProfit: number;
  profitMargin: number;
  breakdownCosts: {
    buildCost: number;
    landCost: number;
    marketingCost: number;
    legalCosts: number;
    financeCharges: number;
  };
} {
  const totalCosts = buildCost + landCost + marketingCost + legalCosts + financeCharges;
  const grossProfit = unitPrice - totalCosts;
  const profitMargin = grossProfit / unitPrice;
  
  return {
    totalCosts: Math.round(totalCosts),
    grossProfit: Math.round(grossProfit),
    profitMargin: Math.round(profitMargin * 100) / 100,
    breakdownCosts: {
      buildCost: Math.round(buildCost),
      landCost: Math.round(landCost),
      marketingCost: Math.round(marketingCost),
      legalCosts: Math.round(legalCosts),
      financeCharges: Math.round(financeCharges)
    }
  };
}