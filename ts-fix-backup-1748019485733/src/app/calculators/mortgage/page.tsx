'use client';

import React, { useState, useEffect } from 'react';
import { Euro, Home, Calculator, TrendingUp, Info } from 'lucide-react';

interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  affordability: {
    monthlyIncome: number;
    percentageOfIncome: number;
    isAffordable: boolean;
  };
}

export default function MortgageCalculator() {
  // Input states
  const [propertyPricesetPropertyPrice] = useState(350000);
  const [depositsetDeposit] = useState(35000);
  const [interestRatesetInterestRate] = useState(3.5);
  const [loanTermsetLoanTerm] = useState(30);
  const [monthlyIncomesetMonthlyIncome] = useState(5000);

  // State for Help to Buy
  const [useHTBsetUseHTB] = useState(false);
  const [htbAmountsetHtbAmount] = useState(0);

  // Results
  const [resultsetResult] = useState<MortgageResult | null>(null);

  // Calculate loan amount
  const loanAmount = propertyPrice - deposit - (useHTB ? htbAmount : 0);

  // Calculate mortgage
  useEffect(() => {
    const calculateMortgage = () => {
      const principal = loanAmount;
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      // Monthly payment calculation
      const monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRatenumberOfPayments)) / 
        (Math.pow(1 + monthlyRatenumberOfPayments) - 1);

      const totalAmount = monthlyPayment * numberOfPayments;
      const totalInterest = totalAmount - principal;

      // Affordability calculation (typically 35% of income is the limit)
      const percentageOfIncome = (monthlyPayment / monthlyIncome) * 100;
      const isAffordable = percentageOfIncome <= 35;

      setResult({
        monthlyPayment,
        totalInterest,
        totalAmount,
        affordability: {
          monthlyIncome,
          percentageOfIncome,
          isAffordable
        }
      });
    };

    if (loanAmount> 0 && interestRate> 0 && loanTerm> 0) {
      calculateMortgage();
    }
  }, [propertyPrice, deposit, interestRate, loanTerm, monthlyIncome, useHTB, htbAmountloanAmount]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate max HTB benefit
  useEffect(() => {
    if (useHTB) {
      const maxHTB = Math.min(propertyPrice * 0.130000);
      setHtbAmount(maxHTB);
    } else {
      setHtbAmount(0);
    }
  }, [useHTBpropertyPrice]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mortgage Calculator</h1>
          <p className="text-gray-600">Calculate your monthly payments and check affordability</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Mortgage Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Property Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Home className="inline w-4 h-4 mr-1" />
                    Property Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Deposit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Euro className="inline w-4 h-4 mr-1" />
                    Deposit (10% min)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((deposit / propertyPrice) * 100).toFixed(1)}% of property price
                  </p>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calculator className="inline w-4 h-4 mr-1" />
                    Loan Term (years)
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={10}>10 years</option>
                    <option value={15}>15 years</option>
                    <option value={20}>20 years</option>
                    <option value={25}>25 years</option>
                    <option value={30}>30 years</option>
                    <option value={35}>35 years</option>
                  </select>
                </div>

                {/* Monthly Income */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Euro className="inline w-4 h-4 mr-1" />
                    Monthly Income (for affordability)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Help to Buy */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={useHTB}
                      onChange={(e) => setUseHTB(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Use Help-to-Buy Scheme
                    </span>
                  </label>
                  {useHTB && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        HTB Grant: {formatCurrency(htbAmount)}
                        <span className="block text-xs mt-1">
                          (10% of property price, max €30,000)
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Loan Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Loan Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Property Price:</span>
                    <span className="font-medium">{formatCurrency(propertyPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit:</span>
                    <span className="font-medium">-{formatCurrency(deposit)}</span>
                  </div>
                  {useHTB && (
                    <div className="flex justify-between text-blue-600">
                      <span>Help-to-Buy:</span>
                      <span className="font-medium">-{formatCurrency(htbAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-medium">Loan Amount:</span>
                    <span className="font-bold text-lg">{formatCurrency(loanAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div>
            {result && (
              <div className="space-y-6">
                {/* Monthly Payment */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Monthly Payment</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {formatCurrency(result.monthlyPayment)}
                  </p>
                  <p className="text-sm text-gray-600">per month for {loanTerm} years</p>
                </div>

                {/* Total Cost */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Total Cost</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal:</span>
                      <span className="font-medium">{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="font-medium">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold text-lg">{formatCurrency(result.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Affordability Check */}
                <div className={`rounded-xl shadow-sm p-6 ${
                  result.affordability.isAffordable ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <h3 className="text-lg font-semibold mb-4">Affordability Check</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Monthly Income:</span>
                      <span className="font-medium">{formatCurrency(result.affordability.monthlyIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Percentage of Income:</span>
                      <span className={`font-medium ${
                        result.affordability.isAffordable ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.affordability.percentageOfIncome.toFixed(1)}%
                      </span>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      result.affordability.isAffordable ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <p className={`text-sm font-medium ${
                        result.affordability.isAffordable ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.affordability.isAffordable 
                          ? '✓ This mortgage appears affordable based on your income'
                          : '✗ This mortgage may be unaffordable - consider a smaller loan'
                        }
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 mt-3">
                      <Info className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-xs text-gray-600">
                        Lenders typically recommend keeping mortgage payments below 35% of your monthly income
                      </p>
                    </div>
                  </div>
                </div>

                {/* Save Results */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Save Calculation
                  </button>
                  <button className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Export as PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}