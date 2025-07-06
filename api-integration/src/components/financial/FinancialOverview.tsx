'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Calculator } from 'lucide-react';

interface FinancialOverviewProps {
  budget?: {
    min: number;
    max: number;
  };
  preApproval?: {
    amount: number;
    validUntil: Date;
    lender: string;
  };
  monthlyPayment?: number;
  downPayment?: number;
}

export default function FinancialOverview({
  budget = { min: 300000, max: 450000 },
  preApproval,
  monthlyPayment = 1850,
  downPayment = 45000,
}: FinancialOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Budget Range</p>
            <p className="font-semibold">
              {formatCurrency(budget.min)} - {formatCurrency(budget.max)}
            </p>
          </div>
          
          {preApproval && (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Pre-Approval</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(preApproval.amount)}
              </p>
              <p className="text-xs text-gray-500">
                Valid until {preApproval.validUntil.toLocaleDateString()}
              </p>
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Est. Monthly Payment</p>
            <p className="font-semibold">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Down Payment</p>
            <p className="font-semibold">
              {formatCurrency(downPayment)}
            </p>
            <p className="text-xs text-gray-500">10% of property value</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-sm text-blue-900">Affordability Tip</h4>
          </div>
          <p className="text-sm text-blue-800">
            Based on your current budget, you can afford properties up to {formatCurrency(budget.max)}.
            Consider properties around {formatCurrency(budget.max * 0.85)} for more negotiation room.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}