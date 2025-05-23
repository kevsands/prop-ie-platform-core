'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import Footer from '@/components/layout/Footer/Footer';

export default function HTBCalculatorPage() {
  const [housePrice, setHousePrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [helpToBuy, setHelpToBuy] = useState('');
  const [location, setLocation] = useState('dublin');
  const [firstTimeBuyer, setFirstTimeBuyer] = useState(true);
  const [results, setResults] = useState<any>(null);

  const htbLimits = {
    dublin: { firstTime: 30000, other: 20000 },
    otherUrban: { firstTime: 30000, other: 20000 },
    rural: { firstTime: 30000, other: 20000 }
  };

  const priceLimits = {
    dublin: { firstTime: 500000, other: 600000 },
    otherUrban: { firstTime: 450000, other: 550000 },
    rural: { firstTime: 450000, other: 450000 }
  };

  const calculateHTB = () => {
    const price = parseFloat(housePrice);
    const depositAmount = parseFloat(deposit);
    const htbAmount = parseFloat(helpToBuy) || 0;

    // Get limits based on location and buyer type
    const priceLimit = priceLimits[location as keyof typeof priceLimits];
    const htbLimit = htbLimits[location as keyof typeof htbLimits];
    const maxPrice = firstTimeBuyer ? priceLimit.firstTime : priceLimit.other;
    const maxHTB = firstTimeBuyer ? htbLimit.firstTime : htbLimit.other;

    // Calculate eligible HTB amount
    const eligibleHTB = Math.min(
      htbAmount,
      maxHTB,
      price * 0.1, // Max 10% of purchase price
      price - depositAmount // Can't exceed the gap between price and deposit
    );

    const totalDeposit = depositAmount + eligibleHTB;
    const mortgageRequired = price - totalDeposit;
    const ltvRatio = (mortgageRequired / price) * 100;

    // Check eligibility
    const isEligible = price <= maxPrice && htbAmount <= maxHTB;

    setResults({
      housePrice: price,
      deposit: depositAmount,
      htbEligible: eligibleHTB,
      htbRequested: htbAmount,
      totalDeposit,
      mortgageRequired,
      ltvRatio,
      isEligible,
      maxPrice,
      maxHTB,
      incomeTaxRefund: eligibleHTB * 0.3, // Approximate tax refund
      netHTBCost: eligibleHTB * 0.7
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-teal-800 py-6">
        <div className="container mx-auto px-4">
          <Link href="/calculators" className="inline-flex items-center text-white hover:text-teal-200 mb-4">
            <FiArrowLeft className="mr-2" />
            Back to Calculators
          </Link>
          <h1 className="text-3xl font-bold text-white">Help-to-Buy (HTB) Calculator</h1>
          <p className="text-teal-100 mt-2">Calculate your HTB eligibility and benefit</p>
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
                      I am a
                    </label>
                    <select
                      value={firstTimeBuyer ? 'first' : 'other'}
                      onChange={(e) => setFirstTimeBuyer(e.target.value === 'first')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="first">First-Time Buyer</option>
                      <option value="other">Non First-Time Buyer</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Property Location
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="dublin">Dublin</option>
                      <option value="otherUrban">Other Urban Areas</option>
                      <option value="rural">Rest of Ireland</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      House Price (€)
                    </label>
                    <input
                      type="number"
                      value={housePrice}
                      onChange={(e) => setHousePrice(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600"
                      placeholder="450000"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Your Deposit (€)
                    </label>
                    <input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600"
                      placeholder="45000"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      HTB Amount Requested (€)
                    </label>
                    <input
                      type="number"
                      value={helpToBuy}
                      onChange={(e) => setHelpToBuy(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600"
                      placeholder="30000"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Max €{htbLimits[location as keyof typeof htbLimits][firstTimeBuyer ? 'firstTime' : 'other'].toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={calculateHTB}
                    disabled={!housePrice || !deposit}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calculate HTB Benefit
                  </button>
                </div>

                {results && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Your HTB Results</h2>
                    
                    <div className={`p-4 rounded-lg mb-6 ${results.isEligible ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className={`font-bold ${results.isEligible ? 'text-green-800' : 'text-red-800'}`}>
                        {results.isEligible ? '✓ Eligible for HTB' : '✗ Not Eligible for HTB'}
                      </p>
                      {!results.isEligible && (
                        <p className="text-sm mt-2">
                          {results.housePrice > results.maxPrice 
                            ? `Property price exceeds limit of €${results.maxPrice.toLocaleString()}`
                            : `HTB amount exceeds limit of €${results.maxHTB.toLocaleString()}`}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">House Price</span>
                        <span className="font-medium">€{results.housePrice.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Your Deposit</span>
                        <span className="font-medium">€{results.deposit.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">HTB Eligible Amount</span>
                        <span className="font-medium text-teal-600">€{results.htbEligible.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Total Deposit (incl. HTB)</span>
                        <span className="font-bold">€{results.totalDeposit.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Mortgage Required</span>
                        <span className="font-medium">€{results.mortgageRequired.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Loan-to-Value Ratio</span>
                        <span className="font-medium">{results.ltvRatio.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-bold text-blue-900 mb-2">Tax Benefit Estimate</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Approx. Income Tax Refund</span>
                          <span>€{results.incomeTaxRefund.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Net HTB Cost</span>
                          <span>€{results.netHTBCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">About Help-to-Buy</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>HTB provides a refund of income tax paid over the previous 4 years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>Maximum benefit is 10% of purchase price or €30,000 (whichever is lower)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>Available for new builds only (not second-hand properties)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>Property price limits apply based on location and buyer status</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>Must be owner-occupied as your primary residence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}