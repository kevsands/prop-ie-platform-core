'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface AffordabilityResult {
  maxLoanAmount: number;
  maxPropertyPrice: number;
  monthlyRepayment: number;
  depositAmount: number;
  affordabilityRatio: number;
  htbAmount: number;
}

interface AffordabilityCalculatorProps {
  onCalculate?: (result: AffordabilityResult) => void;
  onResultsChange?: (result: AffordabilityResult) => void;
  journeyId?: string;
  initialValues?: {
    grossAnnualIncome: number;
    partnerIncome?: number;
    monthlyDebts: number;
    depositAmount: number;
    htbAmount?: number;
  };
}

export default function AffordabilityCalculator({ 
  onCalculate, 
  onResultsChange,
  journeyId,
  initialValues 
}: AffordabilityCalculatorProps) {
  // Just a stub implementation for build purposes
  
  const handleCalculate = () => {
    const defaultResult: AffordabilityResult = {
      maxLoanAmount: 280000,
      maxPropertyPrice: 350000,
      monthlyRepayment: 1200,
      depositAmount: 40000,
      affordabilityRatio: 28,
      htbAmount: 30000
    };
    
    if (onCalculate) {
      onCalculate(defaultResult);
    }
    
    if (onResultsChange) {
      onResultsChange(defaultResult);
    }
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold">Affordability Calculator</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          Enter your financial details to calculate how much you could borrow and what
          properties you can afford.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Standard Mortgage Guidelines</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Banks typically lend up to 3.5x your annual income</li>
              <li>• First-time buyers need a minimum 10% deposit</li>
              <li>• Help to Buy scheme can provide up to €30,000</li>
              <li>• Your monthly repayment should be below 35% of net income</li>
            </ul>
          </div>
          
          <div className="text-center p-6 border rounded-lg flex flex-col items-center justify-center">
            <p className="mb-4 text-gray-700">
              Complete your financial profile to get personalized affordability results
            </p>
            
            <Button onClick={handleCalculate}>
              Calculate Affordability
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}