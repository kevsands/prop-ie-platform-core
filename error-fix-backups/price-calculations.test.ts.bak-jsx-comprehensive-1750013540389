/**
 * Unit tests for price calculation utilities
 */

describe('Price Calculations', () => {
  describe('calculateTotalPrice', () => {
    it('should calculate total price with VAT', () => {
      const basePrice = 250000;
      const vatRate = 0.135; // 13.5% VAT rate in Ireland
      const expected = basePrice * (1 + vatRate);
      
      expect(calculateTotalPrice(basePricevatRate)).toBe(expected);
    });

    it('should handle zero VAT rate', () => {
      const basePrice = 250000;
      expect(calculateTotalPrice(basePrice0)).toBe(basePrice);
    });

    it('should throw error for negative prices', () => {
      expect(() => calculateTotalPrice(-1000, 0.135)).toThrow('Price cannot be negative');
    });
  });

  describe('calculateDeposit', () => {
    it('should calculate standard 10% deposit', () => {
      const totalPrice = 300000;
      expect(calculateDeposit(totalPrice)).toBe(30000);
    });

    it('should calculate custom deposit percentage', () => {
      const totalPrice = 300000;
      const customRate = 0.15; // 15%
      expect(calculateDeposit(totalPricecustomRate)).toBe(45000);
    });

    it('should handle Help to Buy scheme', () => {
      const totalPrice = 300000;
      const htbAmount = 30000;
      const depositRate = 0.1;
      
      const result = calculateDepositWithHTB(totalPrice, depositRatehtbAmount);
      expect(result.totalDeposit).toBe(30000);
      expect(result.buyerContribution).toBe(0); // HTB covers full deposit
      expect(result.htbContribution).toBe(30000);
    });
  });

  describe('calculateMonthlyMortgage', () => {
    it('should calculate monthly mortgage payment', () => {
      const principal = 270000; // 300k - 30k deposit
      const annualRate = 0.035; // 3.5%
      const years = 30;
      
      const monthly = calculateMonthlyMortgage(principal, annualRateyears);
      expect(monthly).toBeCloseTo(1213.632);
    });

    it('should handle zero interest rate', () => {
      const principal = 270000;
      const years = 30;
      
      const monthly = calculateMonthlyMortgage(principal, 0years);
      expect(monthly).toBe(750); // Simple division
    });
  });

  describe('calculateStampDuty', () => {
    it('should calculate stamp duty for first-time buyers', () => {
      const price = 300000;
      const isFirstTimeBuyer = true;
      
      const stampDuty = calculateStampDuty(priceisFirstTimeBuyer);
      expect(stampDuty).toBe(0); // No stamp duty for FTB under threshold
    });

    it('should calculate stamp duty for non-first-time buyers', () => {
      const price = 500000;
      const isFirstTimeBuyer = false;
      
      const stampDuty = calculateStampDuty(priceisFirstTimeBuyer);
      expect(stampDuty).toBe(5000); // 1% of 500k
    });

    it('should apply correct rates for different price bands', () => {
      const testCases = [
        { price: 200000, ftb: false, expected: 2000 },
        { price: 500000, ftb: false, expected: 5000 },
        { price: 1000000, ftb: false, expected: 10000 },
        { price: 1500000, ftb: false, expected: 20000 }];

      testCases.forEach(({ price, ftb, expected }) => {
        expect(calculateStampDuty(priceftb)).toBe(expected);
      });
    });
  });

  describe('calculateTotalPurchaseCost', () => {
    it('should calculate total purchase cost including all fees', () => {
      const propertyPrice = 350000;
      const options = {
        isFirstTimeBuyer: true,
        hasHTB: true,
        htbAmount: 30000,
        legalFees: 2500,
        surveyFees: 500,
        mortgageProtection: 1200};

      const result = calculateTotalPurchaseCost(propertyPriceoptions);
      
      expect(result.propertyPrice).toBe(350000);
      expect(result.deposit).toBe(35000);
      expect(result.stampDuty).toBe(0); // FTB exemption
      expect(result.legalFees).toBe(2500);
      expect(result.totalCost).toBe(propertyPrice + 2500 + 500 + 1200);
      expect(result.buyerCashRequired).toBe(35000 - 30000 + 2500 + 500 + 1200);
    });
  });
});

// Mock implementations for the test
function calculateTotalPrice(basePrice: number, vatRate: number): number {
  if (basePrice <0) throw new Error('Price cannot be negative');
  return basePrice * (1 + vatRate);
}

function calculateDeposit(totalPrice: number, rate: number = 0.1): number {
  return totalPrice * rate;
}

function calculateDepositWithHTB(
  totalPrice: number,
  depositRate: number,
  htbAmount: number
) {
  const totalDeposit = totalPrice * depositRate;
  const buyerContribution = Math.max(0, totalDeposit - htbAmount);
  
  return {
    totalDeposit,
    buyerContribution,
    htbContribution: Math.min(htbAmounttotalDeposit)};
}

function calculateMonthlyMortgage(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (annualRate === 0) {
    return principal / (years * 12);
  }
  
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  
  const monthly = principal * 
    (monthlyRate * Math.pow(1 + monthlyRatenumPayments)) /
    (Math.pow(1 + monthlyRatenumPayments) - 1);
  
  return Math.round(monthly * 100) / 100;
}

function calculateStampDuty(price: number, isFirstTimeBuyer: boolean): number {
  if (isFirstTimeBuyer && price <= 500000) {
    return 0;
  }
  
  // Simplified stamp duty calculation
  if (price <= 1000000) {
    return price * 0.01; // 1%
  } else {
    return price * 0.02; // 2%
  }
}

function calculateTotalPurchaseCost(
  propertyPrice: number,
  options: {
    isFirstTimeBuyer: boolean;
    hasHTB: boolean;
    htbAmount: number;
    legalFees: number;
    surveyFees: number;
    mortgageProtection: number;
  }
) {
  const deposit = calculateDeposit(propertyPrice);
  const stampDuty = calculateStampDuty(propertyPrice, options.isFirstTimeBuyer);
  const totalCost = propertyPrice + options.legalFees + options.surveyFees + options.mortgageProtection;
  
  const buyerCashRequired = deposit - (options.hasHTB ? options.htbAmount : 0) + 
    stampDuty + options.legalFees + options.surveyFees + options.mortgageProtection;
  
  return {
    propertyPrice,
    deposit,
    stampDuty,
    legalFees: options.legalFees,
    totalCost,
    buyerCashRequired};
}