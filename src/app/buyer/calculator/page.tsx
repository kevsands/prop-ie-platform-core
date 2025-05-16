'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, Euro, Home, PiggyBank, Info, ArrowRight } from 'lucide-react';

export default function BuyerCalculatorPage() {
  const router = useRouter();
  const [income, setIncome] = useState(50000);
  const [deposit, setDeposit] = useState(30000);
  const [expenses, setExpenses] = useState(1000);
  const [htbAmount, setHtbAmount] = useState(0);

  const calculateAffordability = () => {
    const monthlyIncome = income / 12;
    const maxMonthlyPayment = (monthlyIncome - expenses) * 0.35; // 35% of disposable income
    const loanAmount = maxMonthlyPayment * 12 * 30 / 1.04; // Rough mortgage calculation
    return Math.round(loanAmount + deposit + htbAmount);
  };

  const affordablePrice = calculateAffordability();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Affordability Calculator</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income (€)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saved Deposit (€)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Expenses (€)
              </label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTB Benefit (€)
              </label>
              <input
                type="number"
                value={htbAmount}
                onChange={(e) => setHtbAmount(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                onClick={() => router.push('/buyer/calculator/htb')}
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                Calculate HTB benefit →
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Buying Power</h2>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              €{affordablePrice.toLocaleString()}
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-medium">€{(affordablePrice - deposit - htbAmount).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Your Deposit:</span>
                <span className="font-medium">€{deposit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">HTB Benefit:</span>
                <span className="font-medium">€{htbAmount.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  This is an estimate. Your actual buying power depends on your credit score, 
                  debt obligations, and lender criteria.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push('/properties')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Properties in Budget
          </button>
          <button
            onClick={() => router.push('/buyer/mortgage-providers')}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50"
          >
            Find Mortgage Provider
          </button>
        </div>
      </div>
    </div>
  );
}