'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Euro, 
  Info, 
  TrendingUp, 
  PiggyBank,
  Home,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Building,
  Percent,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

// Irish mortgage and property cost calculations
interface CalculationResults {
  monthlyPayment: number;
  totalLoanAmount: number;
  totalInterestPaid: number;
  totalRepayment: number;
  stampDuty: number;
  legalFees: number;
  valuationFee: number;
  registrationFee: number;
  totalCashRequired: number;
  minDeposit: number;
  maxLoanAmount: number;
  affordablePropertyPrice: number;
  loanToValue: number;
  loanToIncome: number;
  htbAmount: number;
  netDeposit: number;
  totalDeposit: number;
}

// Irish tax bands and rates (2025)
const STAMP_DUTY_RATES = {
  STANDARD: 0.01, // 1% for properties up to €1 million
  ABOVE_MILLION: 0.02, // 2% for portion above €1 million
  THRESHOLD: 1000000
};

// Central Bank lending rules
const LENDING_RULES = {
  FTB_LTV_LIMIT: 0.90, // 90% LTV for first-time buyers
  NON_FTB_LTV_LIMIT: 0.80, // 80% LTV for non-first-time buyers
  LTI_LIMIT: 4.0, // 4x income limit
  LTI_EXCEPTION_LIMIT: 4.5, // Some exceptions up to 4.5x
  MIN_DEPOSIT_FTB: 0.10, // 10% minimum for FTB
  MIN_DEPOSIT_NON_FTB: 0.20 // 20% minimum for non-FTB
};

// Cost estimates
const COST_ESTIMATES = {
  LEGAL_FEES_MIN: 1500,
  LEGAL_FEES_MAX: 3000,
  VALUATION_FEE: 185,
  REGISTRATION_FEE: 625,
  VAT_RATE: 0.23 // 23% VAT on services
};

export default function FirstTimeBuyerCalculatorPage() {
  // Form inputs
  const [grossIncomesetGrossIncome] = useState(50000);
  const [partnerIncomesetPartnerIncome] = useState(0);
  const [hasPartnersetHasPartner] = useState(false);
  const [propertyPricesetPropertyPrice] = useState(350000);
  const [depositsetDeposit] = useState(35000);
  const [interestRatesetInterestRate] = useState(3.5);
  const [loanTermsetLoanTerm] = useState(30);
  const [isFirstTimeBuyersetIsFirstTimeBuyer] = useState(true);
  const [hasHTBsetHasHTB] = useState(true);
  const [htbApprovalsetHTBApproval] = useState(25000);
  const [monthlyExpensessetMonthlyExpenses] = useState(1500);
  const [existingLoanssetExistingLoans] = useState(0);

  // UI state
  const [activeSectionsetActiveSection] = useState('affordability');
  const [showAdvancedsetShowAdvanced] = useState(false);

  // Calculation results
  const [resultssetResults] = useState<CalculationResults | null>(null);

  // Calculate monthly payment using amortization formula
  const calculateMonthlyPayment = (principal: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;

    if (monthlyRate === 0) {
      return principal / numPayments;
    }

    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRatenumPayments)) / 
      (Math.pow(1 + monthlyRatenumPayments) - 1);

    return monthlyPayment;
  };

  // Calculate stamp duty based on Irish rules
  const calculateStampDuty = (price: number): number => {
    if (price <= STAMP_DUTY_RATES.THRESHOLD) {
      return price * STAMP_DUTY_RATES.STANDARD;
    } else {
      const belowThreshold = STAMP_DUTY_RATES.THRESHOLD * STAMP_DUTY_RATES.STANDARD;
      const aboveThreshold = (price - STAMP_DUTY_RATES.THRESHOLD) * STAMP_DUTY_RATES.ABOVE_MILLION;
      return belowThreshold + aboveThreshold;
    }
  };

  // Calculate legal fees (with VAT)
  const calculateLegalFees = (price: number): number => {
    let baseFee = COST_ESTIMATES.LEGAL_FEES_MIN;
    if (price> 500000) {
      baseFee = COST_ESTIMATES.LEGAL_FEES_MAX;
    } else if (price> 300000) {
      baseFee = (COST_ESTIMATES.LEGAL_FEES_MIN + COST_ESTIMATES.LEGAL_FEES_MAX) / 2;
    }
    return baseFee * (1 + COST_ESTIMATES.VAT_RATE);
  };

  // Main calculation function
  useEffect(() => {
    const totalIncome = grossIncome + (hasPartner ? partnerIncome : 0);
    const maxLoanLTI = totalIncome * LENDING_RULES.LTI_LIMIT;

    // Get applicable HTB amount
    const effectiveHTB = hasHTB && isFirstTimeBuyer ? Math.min(htbApproval, propertyPrice * 0.130000) : 0;

    // Calculate total deposit including HTB
    const totalDepositAmount = deposit + effectiveHTB;
    const loanAmount = propertyPrice - totalDepositAmount;

    // LTV calculation
    const ltv = loanAmount / propertyPrice;
    const maxLTV = isFirstTimeBuyer ? LENDING_RULES.FTB_LTV_LIMIT : LENDING_RULES.NON_FTB_LTV_LIMIT;

    // Check if loan meets criteria
    const meetsLTV = ltv <= maxLTV;
    const meetsLTI = loanAmount <= maxLoanLTI;

    // Calculate maximum affordable property
    const maxLoanAmount = Math.min(maxLoanLTI, propertyPrice * maxLTV);
    const minDepositRequired = propertyPrice * (1 - maxLTV);
    const affordablePropertyPrice = maxLoanLTI / maxLTV;

    // Calculate monthly payment
    const monthlyPayment = calculateMonthlyPayment(loanAmountinterestRateloanTerm);
    const totalRepayment = monthlyPayment * loanTerm * 12;
    const totalInterest = totalRepayment - loanAmount;

    // Calculate costs
    const stampDuty = calculateStampDuty(propertyPrice);
    const legalFees = calculateLegalFees(propertyPrice);
    const valuationFee = COST_ESTIMATES.VALUATION_FEE;
    const registrationFee = COST_ESTIMATES.REGISTRATION_FEE;

    // Total cash required (excluding mortgage)
    const totalCashRequired = deposit + stampDuty + legalFees + valuationFee + registrationFee;

    setResults({
      monthlyPayment: Math.round(monthlyPayment),
      totalLoanAmount: Math.round(loanAmount),
      totalInterestPaid: Math.round(totalInterest),
      totalRepayment: Math.round(totalRepayment),
      stampDuty: Math.round(stampDuty),
      legalFees: Math.round(legalFees),
      valuationFee,
      registrationFee,
      totalCashRequired: Math.round(totalCashRequired),
      minDeposit: Math.round(minDepositRequired),
      maxLoanAmount: Math.round(maxLoanAmount),
      affordablePropertyPrice: Math.round(affordablePropertyPrice),
      loanToValue: ltv,
      loanToIncome: loanAmount / totalIncome,
      htbAmount: effectiveHTB,
      netDeposit: deposit,
      totalDeposit: totalDepositAmount
    });
  }, [grossIncome, partnerIncome, hasPartner, propertyPrice, deposit, interestRate, 
      loanTermisFirstTimeBuyerhasHTBhtbApproval]);

  const formatCurrency = (amount: number): string => {
    return `€${amount.toLocaleString('en-IE')}`;
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">First-Time Buyer Calculator</h1>
              <p className="text-gray-600 mt-1">Calculate your mortgage affordability and costs</p>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Irish lending rules applied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection('affordability')}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition ${
                activeSection === 'affordability' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Affordability
            </button>
            <button
              onClick={() => setActiveSection('mortgage')}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition ${
                activeSection === 'mortgage' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Mortgage Calculator
            </button>
            <button
              onClick={() => setActiveSection('costs')}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition ${
                activeSection === 'costs' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Total Costs
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h2>

              <div className="space-y-4">
                {/* Income Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Gross Annual Income
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={grossIncome}
                      onChange={(e: any) => setGrossIncome(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      step="1000"
                    />
                  </div>
                </div>

                {/* Partner Income */}
                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={hasPartner}
                      onChange={(e: any) => setHasPartner(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Include partner income?
                    </span>
                  </label>
                  {hasPartner && (
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={partnerIncome}
                        onChange={(e: any) => setPartnerIncome(Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        step="1000"
                      />
                    </div>
                  )}
                </div>

                {/* Property Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Price
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={propertyPrice}
                      onChange={(e: any) => setPropertyPrice(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      step="5000"
                    />
                  </div>
                </div>

                {/* Deposit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cash Deposit (excluding HTB)
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={deposit}
                      onChange={(e: any) => setDeposit(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      step="1000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {results && `${formatPercent(deposit / propertyPrice)} of property price`}
                  </p>
                </div>

                {/* First Time Buyer */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isFirstTimeBuyer}
                      onChange={(e: any) => setIsFirstTimeBuyer(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      First-time buyer
                    </span>
                  </label>
                </div>

                {/* HTB */}
                {isFirstTimeBuyer && (
                  <div>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={hasHTB}
                        onChange={(e: any) => setHasHTB(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Have HTB approval?
                      </span>
                    </label>
                    {hasHTB && (
                      <div className="relative">
                        <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={htbApproval}
                          onChange={(e: any) => setHTBApproval(Number(e.target.value))}
                          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="1000"
                          max="30000"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Advanced Options */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Advanced Options
                  {showAdvanced ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>

                {showAdvanced && (
                  <>
                    {/* Interest Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interest Rate (%)
                      </label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={interestRate}
                          onChange={(e: any) => setInterestRate(Number(e.target.value))}
                          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="0.1"
                          min="0"
                          max="10"
                        />
                      </div>
                    </div>

                    {/* Loan Term */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Term (years)
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={loanTerm}
                          onChange={(e: any) => setLoanTerm(Number(e.target.value))}
                          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="1"
                          min="5"
                          max="35"
                        />
                      </div>
                    </div>

                    {/* Monthly Expenses */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Expenses
                      </label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={monthlyExpenses}
                          onChange={(e: any) => setMonthlyExpenses(Number(e.target.value))}
                          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="100"
                        />
                      </div>
                    </div>

                    {/* Existing Loans */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Loan Repayments
                      </label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={existingLoans}
                          onChange={(e: any) => setExistingLoans(Number(e.target.value))}
                          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="100"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {results && (
              <>
                {/* Affordability Section */}
                {activeSection === 'affordability' && (
                  <div className="space-y-6">
                    {/* Lending Rules Check */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Central Bank Lending Rules</h3>

                      <div className="space-y-4">
                        {/* LTV Check */}
                        <div className={`p-4 rounded-lg ${
                          results.loanToValue <= (isFirstTimeBuyer ? 0.9 : 0.8) 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-start">
                            {results.loanToValue <= (isFirstTimeBuyer ? 0.9 : 0.8) ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">Loan-to-Value (LTV)</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Your LTV: <span className="font-bold">{formatPercent(results.loanToValue)}</span>
                                {' '}(Maximum allowed: {isFirstTimeBuyer ? '90%' : '80%'})
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* LTI Check */}
                        <div className={`p-4 rounded-lg ${
                          results.loanToIncome <= 4.0 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-start">
                            {results.loanToIncome <= 4.0 ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">Loan-to-Income (LTI)</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Your LTI: <span className="font-bold">{results.loanToIncome.toFixed(1)}x</span>
                                {' '}(Maximum allowed: 4.0x)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Affordability Check */}
                        <div className={`p-4 rounded-lg ${
                          results.monthlyPayment <= (grossIncome + partnerIncome) / 12 * 0.35
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                          <div className="flex items-start">
                            {results.monthlyPayment <= (grossIncome + partnerIncome) / 12 * 0.35 ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">Monthly Affordability</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Monthly payment: <span className="font-bold">{formatCurrency(results.monthlyPayment)}</span>
                                {' '}({formatPercent(results.monthlyPayment / ((grossIncome + (hasPartner ? partnerIncome : 0)) / 12))} of monthly income)
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Lenders typically look for payments below 35% of gross monthly income
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Maximum Borrowing */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Borrowing Capacity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Maximum Loan Amount</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(results.maxLoanAmount)}
                          </p>
                          <p className="text-xs text-gray-500">Based on income & LTV limits</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Maximum Property Price</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(results.affordablePropertyPrice)}
                          </p>
                          <p className="text-xs text-gray-500">With your current deposit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mortgage Calculator Section */}
                {activeSection === 'mortgage' && (
                  <div className="space-y-6">
                    {/* Monthly Payment Breakdown */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Payment Breakdown</h3>

                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">Monthly Payment</span>
                          <span className="text-3xl font-bold text-blue-600">
                            {formatCurrency(results.monthlyPayment)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 relative">
                          <div 
                            className="bg-blue-600 h-4 rounded-full"
                            style={ width: `${(results.totalLoanAmount / results.totalRepayment) * 100}%` }
                          />
                          <div 
                            className="absolute top-0 right-0 bg-green-600 h-4 rounded-r-full"
                            style={ width: `${(results.totalInterestPaid / results.totalRepayment) * 100}%` }
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>Principal: {formatCurrency(results.totalLoanAmount)}</span>
                          <span>Interest: {formatCurrency(results.totalInterestPaid)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Loan Amount</p>
                          <p className="text-lg font-semibold">{formatCurrency(results.totalLoanAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Repayment</p>
                          <p className="text-lg font-semibold">{formatCurrency(results.totalRepayment)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Interest</p>
                          <p className="text-lg font-semibold">{formatCurrency(results.totalInterestPaid)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Deposit Breakdown */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Deposit Breakdown</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cash Deposit</span>
                          <span className="font-semibold">{formatCurrency(results.netDeposit)}</span>
                        </div>
                        {results.htbAmount> 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">HTB Refund</span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(results.htbAmount)}
                            </span>
                          </div>
                        )}
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Total Deposit</span>
                            <span className="text-xl font-bold">
                              {formatCurrency(results.totalDeposit)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatPercent(results.totalDeposit / propertyPrice)} of property price
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Costs Section */}
                {activeSection === 'costs' && (
                  <div className="space-y-6">
                    {/* Purchase Costs */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Purchase Costs</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Property Price</span>
                          <span className="font-semibold">{formatCurrency(propertyPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Stamp Duty (1%)</span>
                          <span className="font-semibold">{formatCurrency(results.stampDuty)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Legal Fees (inc. VAT)</span>
                          <span className="font-semibold">{formatCurrency(results.legalFees)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Valuation Fee</span>
                          <span className="font-semibold">{formatCurrency(results.valuationFee)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Registration Fee</span>
                          <span className="font-semibold">{formatCurrency(results.registrationFee)}</span>
                        </div>
                        <div className="pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Total Cash Required</span>
                            <span className="text-xl font-bold text-blue-600">
                              {formatCurrency(results.totalCashRequired)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Excluding mortgage amount
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary Box */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Purchase Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-blue-700">Total Cash Needed Now</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatCurrency(results.totalCashRequired)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700">Monthly Mortgage Payment</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatCurrency(results.monthlyPayment)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* What's Next */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                            1
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Get Mortgage Approval in Principle</h4>
                            <p className="text-sm text-gray-600">Contact lenders to get your AIP sorted</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                            2
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Apply for Help-to-Buy</h4>
                            <p className="text-sm text-gray-600">Register with Revenue for your HTB refund</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                            3
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Choose a Solicitor</h4>
                            <p className="text-sm text-gray-600">Select a conveyancing solicitor early</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <Link
                          href="/first-time-buyers/journey"
                          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Start Your Journey
                          <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer Resources */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/first-time-buyers/help-to-buy"
              className="bg-white p-6 rounded-lg hover:shadow-lg transition"
            >
              <Home className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Help-to-Buy Calculator</h4>
              <p className="text-sm text-gray-600">Calculate your HTB refund amount</p>
            </Link>
            <Link
              href="/first-time-buyers/guides/costs"
              className="bg-white p-6 rounded-lg hover:shadow-lg transition"
            >
              <FileText className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Cost Breakdown Guide</h4>
              <p className="text-sm text-gray-600">Detailed guide to all purchase costs</p>
            </Link>
            <Link
              href="/first-time-buyers/guides/mortgage"
              className="bg-white p-6 rounded-lg hover:shadow-lg transition"
            >
              <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Mortgage Guide</h4>
              <p className="text-sm text-gray-600">Everything about Irish mortgages</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}