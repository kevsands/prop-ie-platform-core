import React from 'react';
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import Footer from '@/components/layout/Footer/Footer';

export default function StampDutyCalculatorPage() {
  const [purchasePricesetPurchasePrice] = useState('');
  const [buyerTypesetBuyerType] = useState<'first-time' | 'other'>('first-time');
  const [resultssetResults] = useState<any>(null);

  const calculateStampDuty = () => {
    const price = parseFloat(purchasePrice);

    // Irish stamp duty rates as of 2024
    // First-time buyers: 0% up to €500,000, 10% on balance
    // Other buyers: 1% up to €1,000,000, 2% on balance

    let stampDuty = 0;

    if (buyerType === 'first-time') {
      if (price> 500000) {
        stampDuty = (price - 500000) * 0.10; // 10% on amount over €500,000
      }
    } else {
      if (price <= 1000000) {
        stampDuty = price * 0.01; // 1% up to €1,000,000
      } else {
        stampDuty = 10000 + ((price - 1000000) * 0.02); // €10,000 + 2% on balance
      }
    }

    const effectiveRate = (stampDuty / price) * 100;

    // Calculate total purchase cost
    const legalFees = 2500; // Approximate legal fees
    const registryFees = 800; // Property Registration Authority fees
    const valuationFee = 150; // Property valuation fee
    const totalCosts = price + stampDuty + legalFees + registryFees + valuationFee;

    setResults({
      purchasePrice: price,
      stampDuty,
      effectiveRate,
      legalFees,
      registryFees,
      valuationFee,
      totalOtherCosts: legalFees + registryFees + valuationFee,
      totalCosts,
      depositRequired: price * 0.1, // Standard 10% deposit
      cashRequired: (price * 0.1) + stampDuty + legalFees + registryFees + valuationFee
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0}).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-teal-800 py-6">
        <div className="container mx-auto px-4">
          <Link href="/calculators" className="inline-flex items-center text-white hover:text-teal-200 mb-4">
            <FiArrowLeft className="mr-2" />
            Back to Calculators
          </Link>
          <h1 className="text-3xl font-bold text-white">Stamp Duty Calculator</h1>
          <p className="text-teal-100 mt-2">Calculate stamp duty and total purchase costs</p>
        </div>
      </header>

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Property Details</h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Buyer Type
                    </label>
                    <select
                      value={buyerType}
                      onChange={(e: any) => setBuyerType(e.target.value as 'first-time' | 'other')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="first-time">First-Time Buyer</option>
                      <option value="other">Other Buyer</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Purchase Price (€)
                    </label>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e: any) => setPurchasePrice(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600"
                      placeholder="450000"
                    />
                  </div>

                  <button
                    onClick={calculateStampDuty}
                    disabled={!purchasePrice}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calculate Stamp Duty
                  </button>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold text-blue-900 mb-2">Current Rates (2024)</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">First-Time Buyers:</p>
                        <ul className="ml-4 mt-1">
                          <li>• 0% up to €500,000</li>
                          <li>• 10% on balance above €500,000</li>
                        </ul>
                      </div>
                      <div className="mt-3">
                        <p className="font-medium">Other Buyers:</p>
                        <ul className="ml-4 mt-1">
                          <li>• 1% up to €1,000,000</li>
                          <li>• 2% on balance above €1,000,000</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {results && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Cost Breakdown</h2>

                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Purchase Price</span>
                        <span className="font-medium">{formatCurrency(results.purchasePrice)}</span>
                      </div>

                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Stamp Duty</span>
                        <span className="font-medium text-red-600">{formatCurrency(results.stampDuty)}</span>
                      </div>

                      <div className="flex justify-between py-2 border-b text-sm">
                        <span className="text-gray-500">Effective Rate</span>
                        <span className="text-gray-500">{results.effectiveRate.toFixed(2)}%</span>
                      </div>

                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Legal Fees (est.)</span>
                        <span className="font-medium">{formatCurrency(results.legalFees)}</span>
                      </div>

                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Registry Fees</span>
                        <span className="font-medium">{formatCurrency(results.registryFees)}</span>
                      </div>

                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Valuation Fee</span>
                        <span className="font-medium">{formatCurrency(results.valuationFee)}</span>
                      </div>

                      <div className="flex justify-between py-3 border-b-2 border-gray-300">
                        <span className="font-bold">Total Purchase Cost</span>
                        <span className="font-bold text-lg">{formatCurrency(results.totalCosts)}</span>
                      </div>

                      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-bold text-yellow-900 mb-2">Cash Required at Closing</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>10% Deposit</span>
                            <span>{formatCurrency(results.depositRequired)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stamp Duty</span>
                            <span>{formatCurrency(results.stampDuty)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Other Costs</span>
                            <span>{formatCurrency(results.totalOtherCosts)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-yellow-300 font-bold">
                            <span>Total Cash Required</span>
                            <span>{formatCurrency(results.cashRequired)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-sm text-gray-600">
                      <p>* Estimates only. Actual costs may vary.</p>
                      <p>* Legal fees and other costs are indicative.</p>
                      <p>* Consult a solicitor for precise figures.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}