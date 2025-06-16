'use client';

import { useState, useCallback } from 'react';
import { useBuyerJourney } from '@/context/BuyerJourneyContext';
import { useToast } from '@/hooks/useToast';
import { AffordabilityResult } from '@/components/buyer/planning/AffordabilityCalculator';

export interface AffordabilityInputs {
  grossAnnualIncome: number;
  partnerIncome?: number;
  monthlyDebts: number;
  depositAmount: number;
  htbAmount?: number;
  interestRate?: number;
  loanTerm?: number;
}

export default function useAffordabilityCalculator() {
  const { journey, addAffordabilityCheck } = useBuyerJourney();
  const [resultsetResult] = useState<AffordabilityResult | null>(null);
  const [loadingsetLoading] = useState(false);
  const { toast } = useToast();

  const calculate = useCallback(async (inputs: AffordabilityInputs) => {
    setLoading(true);
    try {
      // Default values
      const interestRate = inputs.interestRate || 3.5;
      const loanTerm = inputs.loanTerm || 30;

      // Basic calculations
      const totalIncome = inputs.grossAnnualIncome + (inputs.partnerIncome || 0);
      const maxLoanAmount = totalIncome * 3.5; // Standard Irish Central Bank rules

      // Calculate maximum property price based on deposit
      const depositAmount = inputs.depositAmount;
      const htbAmount = inputs.htbAmount || 0;
      const maxPropertyPrice = maxLoanAmount + depositAmount + htbAmount;

      // Calculate monthly repayment
      const monthlyInterestRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      // Monthly mortgage repayment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
      const monthlyRepayment =
        (maxLoanAmount * 
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRatenumberOfPayments))) /
        (Math.pow(1 + monthlyInterestRatenumberOfPayments) - 1);

      // Affordability ratio (monthly repayment as % of monthly income)
      const monthlyIncome = totalIncome / 12;
      const affordabilityRatio = (monthlyRepayment / monthlyIncome) * 100;

      // Loan to value ratio
      const loanToValue = (maxLoanAmount / maxPropertyPrice) * 100;

      // Debt to income ratio
      const debtToIncomeRatio = ((inputs.monthlyDebts + monthlyRepayment) / monthlyIncome) * 100;

      const calculationResult: AffordabilityResult = {
        maxLoanAmount: Math.round(maxLoanAmount),
        maxPropertyPrice: Math.round(maxPropertyPrice),
        monthlyRepayment: Math.round(monthlyRepayment),
        depositAmount: Math.round(depositAmount),
        affordabilityRatio: Math.round(affordabilityRatio),
        htbAmount: Math.round(htbAmount)
      };

      setResult(calculationResult);

      // Save to journey if available
      if (journey) {
        await addAffordabilityCheck({
          journeyId: journey.id,
          grossAnnualIncome: inputs.grossAnnualIncome,
          partnerIncome: inputs.partnerIncome,
          monthlyDebts: inputs.monthlyDebts,
          depositAmount: inputs.depositAmount,
          htbAmount: inputs.htbAmount,
          maxMortgage: maxLoanAmount,
          maxPropertyPrice,
          monthlyRepayment,
          loanToValue,
          debtToIncomeRatio
        });

        toast({
          title: "Affordability Check Saved",
          description: "Your affordability calculation has been saved to your journey."
        });
      }

      return calculationResult;
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "There was a problem calculating your affordability. Please check your inputs.",
        variant: "destructive");
      return null;
    } finally {
      setLoading(false);
    }
  }, [journey, addAffordabilityChecktoast]);

  return {
    calculate,
    result,
    loading
  };
}