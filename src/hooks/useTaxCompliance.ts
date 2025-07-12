/**
 * Irish Tax Compliance Hook
 * 
 * Custom React hook for managing RCT and VAT calculations
 * Provides real-time tax compliance functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface IrishTaxRates {
  vat: {
    standard: number;    // 23% for professional services
    reduced: number;     // 13.5% for construction
    zero: number;        // 0% for certain services
  };
  rct: {
    standardRate: number; // 20% for non-C2 contractors
    c2Rate: number;       // 0% for C2 certificate holders
    threshold: number;    // €10,000 threshold
  };
}

export interface TaxCalculationInput {
  grossAmount: number;
  contractorType: 'c2_certificate' | 'standard' | 'subcontractor';
  serviceType: 'construction' | 'professional' | 'consultancy';
  vatRegistered: boolean;
  isResident: boolean;
}

export interface TaxCalculationResult {
  grossAmount: number;
  vatCalculation: {
    rate: number;
    amount: number;
    applicable: boolean;
  };
  rctCalculation: {
    rate: number;
    amount: number;
    applicable: boolean;
    certificateType: string;
  };
  netAmount: number;
  finalPaymentAmount: number;
  taxesDeducted: number;
  breakdown: {
    originalAmount: number;
    vatDeducted: number;
    rctDeducted: number;
    netPayable: number;
  };
  complianceFlags: {
    vatRegistrationRequired: boolean;
    rctCertificateRequired: boolean;
    monthlyReturnsRequired: boolean;
    quarterlyReturnsRequired: boolean;
  };
}

export interface RCTStatus {
  contractorId: string;
  taxNumber: string;
  rctStatus: {
    certificateType: string;
    status: string;
    validUntil?: string;
    rctRate: number;
  };
  lastChecked: string;
  dataSource: string;
}

export interface ProjectTaxSummary {
  projectId: string;
  taxYear: number;
  summary: {
    totalGrossPayments: number;
    totalNetPayments: number;
    totalVATLiable: number;
    totalRCTDeducted: number;
    totalTaxesDeducted: number;
  };
  complianceStatus: {
    vatCompliant: boolean;
    rctCompliant: boolean;
    lastVATReturn: string;
    lastRCTReturn: string;
    nextActions: string[];
  };
}

const IRISH_TAX_RATES: IrishTaxRates = {
  vat: {
    standard: 23.0,
    reduced: 13.5,
    zero: 0.0
  },
  rct: {
    standardRate: 20.0,
    c2Rate: 0.0,
    threshold: 10000
  }
};

export function useTaxCompliance() {
  const [loading, setLoading] = useState(false);
  const [taxSummary, setTaxSummary] = useState<ProjectTaxSummary | null>(null);
  const [lastCalculation, setLastCalculation] = useState<TaxCalculationResult | null>(null);
  const { toast } = useToast();

  // Calculate Irish taxes locally for immediate feedback
  const calculateLocalTaxes = useCallback((input: TaxCalculationInput): TaxCalculationResult => {
    const { grossAmount, contractorType, serviceType, vatRegistered, isResident } = input;
    
    // VAT Calculation
    let vatRate = 0;
    let vatAmount = 0;
    let netAmount = grossAmount;

    if (vatRegistered) {
      if (serviceType === 'construction') {
        vatRate = IRISH_TAX_RATES.vat.reduced; // 13.5% for construction
      } else {
        vatRate = IRISH_TAX_RATES.vat.standard; // 23% for professional services
      }
      vatAmount = (grossAmount * vatRate) / (100 + vatRate);
      netAmount = grossAmount - vatAmount;
    }

    // RCT Calculation
    let rctRate = 0;
    let rctAmount = 0;
    let rctApplicable = false;

    if (serviceType === 'construction' && grossAmount >= IRISH_TAX_RATES.rct.threshold) {
      rctApplicable = true;
      
      if (contractorType === 'c2_certificate') {
        rctRate = IRISH_TAX_RATES.rct.c2Rate; // 0% for C2 holders
      } else {
        rctRate = IRISH_TAX_RATES.rct.standardRate; // 20% for others
      }
      
      rctAmount = (netAmount * rctRate) / 100;
    }

    // Final payment calculation
    const finalPaymentAmount = netAmount - rctAmount;
    const taxesDeducted = vatAmount + rctAmount;

    return {
      grossAmount,
      vatCalculation: {
        rate: vatRate,
        amount: Math.round(vatAmount * 100) / 100,
        applicable: vatRegistered
      },
      rctCalculation: {
        rate: rctRate,
        amount: Math.round(rctAmount * 100) / 100,
        applicable: rctApplicable,
        certificateType: contractorType
      },
      netAmount: Math.round(netAmount * 100) / 100,
      finalPaymentAmount: Math.round(finalPaymentAmount * 100) / 100,
      taxesDeducted: Math.round(taxesDeducted * 100) / 100,
      breakdown: {
        originalAmount: grossAmount,
        vatDeducted: Math.round(vatAmount * 100) / 100,
        rctDeducted: Math.round(rctAmount * 100) / 100,
        netPayable: Math.round(finalPaymentAmount * 100) / 100
      },
      complianceFlags: {
        vatRegistrationRequired: grossAmount > 37500, // VAT registration threshold
        rctCertificateRequired: serviceType === 'construction' && grossAmount >= IRISH_TAX_RATES.rct.threshold,
        monthlyReturnsRequired: vatRegistered && grossAmount > 2000000, // €2M turnover
        quarterlyReturnsRequired: vatRegistered && grossAmount <= 2000000
      }
    };
  }, []);

  // Calculate taxes via API for server-side validation
  const calculateTaxes = useCallback(async (input: TaxCalculationInput): Promise<TaxCalculationResult | null> => {
    setLoading(true);
    try {
      const response = await fetch('/api/finance/tax-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate_taxes',
          data: {
            contractorId: 'calc-contractor',
            ...input
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setLastCalculation(result.data);
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error calculating taxes:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate taxes via API, using local calculation",
        variant: "destructive",
      });
      
      // Fallback to local calculation
      const localResult = calculateLocalTaxes(input);
      setLastCalculation(localResult);
      return localResult;
    } finally {
      setLoading(false);
    }
  }, [calculateLocalTaxes, toast]);

  // Check RCT status for a contractor
  const checkRCTStatus = useCallback(async (contractorId: string, taxNumber: string): Promise<RCTStatus | null> => {
    setLoading(true);
    try {
      const response = await fetch('/api/finance/tax-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_rct_status',
          contractorId,
          taxNumber
        })
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error checking RCT status:', error);
      toast({
        title: "RCT Check Failed",
        description: "Unable to verify RCT status",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load project tax summary
  const loadProjectTaxSummary = useCallback(async (projectId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/finance/tax-compliance?projectId=${projectId}`);
      const result = await response.json();
      
      if (result.success) {
        setTaxSummary(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading tax summary:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load tax compliance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Generate tax compliance report
  const generateTaxReport = useCallback(async (projectId: string, periodStart: string, periodEnd: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/finance/tax-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_tax_report',
          projectId,
          periodStart,
          periodEnd
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Trigger download or show report
        toast({
          title: "Report Generated",
          description: "Tax compliance report has been generated successfully",
        });
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error generating tax report:', error);
      toast({
        title: "Report Error",
        description: "Failed to generate tax compliance report",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Validate contractor tax information
  const validateContractorTax = useCallback((
    taxNumber: string, 
    contractorType: string
  ): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Irish tax number validation
    if (!taxNumber || taxNumber.length < 8) {
      errors.push('Valid Irish tax number is required');
    }
    
    if (!taxNumber.startsWith('IE')) {
      errors.push('Irish tax number must start with IE');
    }
    
    // C2 certificate validation
    if (contractorType === 'c2_certificate') {
      // Would validate C2 certificate number format
      if (!taxNumber.includes('C2')) {
        // This is simplified - real validation would be more complex
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }, []);

  // Format currency for Irish locale
  const formatIrishCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Get next tax return due dates
  const getNextReturnDates = useCallback(() => {
    const now = new Date();
    const vatDue = new Date(now.getFullYear(), now.getMonth() + 1, 23);
    const rctDue = new Date(now.getFullYear(), now.getMonth() + 1, 14);
    
    return {
      vatReturn: vatDue.toISOString().split('T')[0],
      rctReturn: rctDue.toISOString().split('T')[0]
    };
  }, []);

  return {
    // State
    loading,
    taxSummary,
    lastCalculation,
    
    // Tax calculation functions
    calculateTaxes,
    calculateLocalTaxes,
    
    // RCT management
    checkRCTStatus,
    
    // Project management
    loadProjectTaxSummary,
    generateTaxReport,
    
    // Validation and formatting
    validateContractorTax,
    formatIrishCurrency,
    getNextReturnDates,
    
    // Constants
    taxRates: IRISH_TAX_RATES
  };
}