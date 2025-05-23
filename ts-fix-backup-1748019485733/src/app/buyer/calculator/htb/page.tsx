'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, ChevronRight, Info, Home, Building2, PiggyBank, TrendingUp } from 'lucide-react';

export default function HTBCalculatorPage() {
  const router = useRouter();

  // Form state
  const [propertyPricesetPropertyPrice] = useState('');
  const [depositsetDeposit] = useState('');
  const [incomesetIncome] = useState('');
  const [isFirstTimeBuyersetIsFirstTimeBuyer] = useState(true);

  // Calculation results
  const [resultssetResults] = useState(null);

  const calculateHTB = () => {
    const price = parseFloat(propertyPrice) || 0;
    const depositAmount = parseFloat(deposit) || 0;
    const annualIncome = parseFloat(income) || 0;

    // HTB equity loan calculation
    const htbPercentage = isFirstTimeBuyer ? 0.3 : 0.2; // 30% for FTB, 20% for others
    const maxHTB = 30000; // €30,000 cap
    const htbAmount = Math.min(price * htbPercentagemaxHTB);

    // Mortgage calculation
    const loanToValue = ((price - depositAmount - htbAmount) / price) * 100;
    const mortgageAmount = price - depositAmount - htbAmount;
    const monthlyPayment = (mortgageAmount * 0.04) / 12; // Assuming 4% interest rate

    // Affordability check
    const maxAffordableMonthly = (annualIncome / 12) * 0.35; // 35% of monthly income
    const isAffordable = monthlyPayment <= maxAffordableMonthly;

    setResults({
      propertyPrice: price,
      deposit: depositAmount,
      htbLoan: htbAmount,
      htbPercentage: htbPercentage * 100,
      mortgageRequired: mortgageAmount,
      loanToValue,
      monthlyPayment,
      totalBorrowing: mortgageAmount + htbAmount,
      isAffordable,
      maxAffordableMonthly,
      savingsRequired: price * 0.1 // 10% minimum deposit
    });
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help to Buy Calculator</h1>
          <p className="text-gray-600">Calculate your Help to Buy equity loan and understand your financing options</p>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">About Help to Buy</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• First-time buyers can borrow up to 30% of the purchase price</li>
                <li>• Other buyers can borrow up to 20% of the purchase price</li>
                <li>• Maximum HTB loan is €30,000</li>
                <li>• Available on new build properties only</li>
                <li>• Interest-free for the first 5 years</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Property Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="400,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Deposit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="40,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="60,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buyer Type
              </label>
              <select
                value={isFirstTimeBuyer ? 'first-time' : 'other'}
                onChange={(e) => setIsFirstTimeBuyer(e.target.value === 'first-time')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="first-time">First-time Buyer</option>
                <option value="other">Other Buyer</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateHTB}
            className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Calculate HTB Loan
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">HTB Equity Loan</h3>
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  €{results.htbLoan.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">{results.htbPercentage}% of property price</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Mortgage Required</h3>
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  €{results.mortgageRequired.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">{results.loanToValue.toFixed(1)}% LTV</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Payment</h3>
                  <PiggyBank className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  €{Math.round(results.monthlyPayment).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {results.isAffordable ? (
                    <span className="text-green-600">Within budget</span>
                  ) : (
                    <span className="text-red-600">Exceeds budget</span>
                  )}
                </p>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financing Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Property Price</span>
                  <span className="font-medium">€{results.propertyPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Your Deposit</span>
                  <span className="font-medium">€{results.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">HTB Equity Loan</span>
                  <span className="font-medium text-blue-600">€{results.htbLoan.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Mortgage Amount</span>
                  <span className="font-medium">€{results.mortgageRequired.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 font-semibold">
                  <span>Total Borrowing</span>
                  <span>€{results.totalBorrowing.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Affordability Check */}
            <div className={`rounded-xl p-6 ${results.isAffordable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start">
                <TrendingUp className={`h-5 w-5 ${results.isAffordable ? 'text-green-600' : 'text-red-600'} mt-0.5 mr-3 flex-shrink-0`} />
                <div>
                  <h3 className={`text-lg font-semibold ${results.isAffordable ? 'text-green-900' : 'text-red-900'} mb-2`}>
                    Affordability Assessment
                  </h3>
                  <p className={results.isAffordable ? 'text-green-800' : 'text-red-800'}>
                    Monthly payment of €{Math.round(results.monthlyPayment).toLocaleString()} is {' '}
                    {results.isAffordable ? 'within' : 'above'} your recommended budget of €{Math.round(results.maxAffordableMonthly).toLocaleString()}
                  </p>
                  {!results.isAffordable && (
                    <p className="text-red-800 mt-2">
                      Consider a lower-priced property or increasing your deposit to improve affordability.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/buyer/calculator')}
                  className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calculator className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Full Affordability Calculator</span>
                </button>
                <button
                  onClick={() => router.push('/buyer/advisor')}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="font-medium">Speak to an Advisor</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}