'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Input field component
const InputField = ({ 
  label, 
  id, 
  type, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  prefix, 
  suffix,
  helpText
}: { 
  label: string; 
  id: string; 
  type: string; 
  value: number | string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  min?: number; 
  max?: number; 
  step?: number;
  prefix?: string;
  suffix?: string;
  helpText?: string;
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative mt-1 rounded-md shadow-sm">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5273] focus:ring-[#2B5273] sm:text-sm ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
    {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
  </div>
);

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function MortgageCalculatorPage() {
  // Calculator state
  const [housePrice, setHousePrice] = useState(300000);
  const [deposit, setDeposit] = useState(30000);
  const [depositPercent, setDepositPercent] = useState(10);
  const [term, setTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(3.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  
  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [interestType, setInterestType] = useState('fixed');
  const [extraPayments, setExtraPayments] = useState(0);
  
  // Amortization table state
  const [amortizationTable, setAmortizationTable] = useState<any[]>([]);
  const [showFullTable, setShowFullTable] = useState(false);
  
  // Handle deposit percentage change
  useEffect(() => {
    const newDepositPercent = Math.round((deposit / housePrice) * 100);
    setDepositPercent(newDepositPercent);
  }, [deposit, housePrice]);
  
  // Handle deposit amount change when percentage changes
  const handleDepositPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = Number(e.target.value);
    setDepositPercent(newPercent);
    setDeposit(Math.round((housePrice * newPercent) / 100));
  };
  
  // Calculate mortgage
  useEffect(() => {
    // Principal loan amount
    const principal = housePrice - deposit;
    
    // Convert annual interest rate to monthly
    const monthlyRate = interestRate / 100 / 12;
    
    // Convert years to months
    const numberOfPayments = term * 12;
    
    // Calculate monthly payment
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthly = (principal * x * monthlyRate) / (x - 1);
    
    // Calculate total payment over term
    const total = monthly * numberOfPayments;
    
    // Calculate total interest paid
    const interest = total - principal;
    
    setMonthlyPayment(monthly);
    setTotalRepayment(total);
    setTotalInterest(interest);
    
    // Generate amortization table
    generateAmortizationTable(principal, monthlyRate, numberOfPayments, monthly);
    
  }, [housePrice, deposit, term, interestRate, extraPayments]);
  
  // Generate amortization schedule
  const generateAmortizationTable = (principal: number, monthlyRate: number, numberOfPayments: number, monthlyPayment: number) => {
    let balance = principal;
    const table = [];
    
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      // Only store data for years 1, 5, 10, 15, 20, 25, 30 to reduce memory usage
      if (i % 12 === 0 && (i === 12 || i % 60 === 0 || i === numberOfPayments)) {
        table.push({
          period: i / 12, // Year
          payment: monthlyPayment,
          principalPayment: principalPayment,
          interestPayment: interestPayment,
          remainingBalance: balance > 0 ? balance : 0,
          totalPrincipalPaid: principal - balance
        });
      }
    }
    
    setAmortizationTable(table);
  };
  
  // Prepare chart data
  const pieChartData = {
    labels: ['Principal', 'Total Interest'],
    datasets: [
      {
        data: [housePrice - deposit, totalInterest],
        backgroundColor: ['#2B5273', '#FF6B6B'],
        hoverBackgroundColor: ['#1E3142', '#FF5252'],
        borderWidth: 0,
      },
    ],
  };
  
  const barChartData = {
    labels: amortizationTable.map(row => `Year ${row.period}`),
    datasets: [
      {
        label: 'Principal',
        data: amortizationTable.map(row => row.principalPayment),
        backgroundColor: '#2B5273',
      },
      {
        label: 'Interest',
        data: amortizationTable.map(row => row.interestPayment),
        backgroundColor: '#FF6B6B',
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/resources" className="text-gray-500 hover:text-gray-700">
              Resources
            </Link>
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link href="/resources/calculators" className="text-gray-500 hover:text-gray-700">
              Calculators
            </Link>
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <span className="text-gray-900 font-medium">Mortgage Calculator</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Mortgage Calculator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Calculate your estimated mortgage payments and see a detailed breakdown of your repayment schedule.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Calculator inputs */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Mortgage Details</h2>
            
            <InputField
              label="Property Price"
              id="house-price"
              type="number"
              value={housePrice}
              onChange={(e) => setHousePrice(Number(e.target.value))}
              min={50000}
              max={10000000}
              step={1000}
              prefix="€"
              helpText="The purchase price of the property"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Deposit"
                id="deposit"
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                min={0}
                max={housePrice}
                step={1000}
                prefix="€"
                helpText="Minimum 10% for first-time buyers"
              />
              
              <InputField
                label="Deposit Percentage"
                id="deposit-percent"
                type="number"
                value={depositPercent}
                onChange={handleDepositPercentChange}
                min={0}
                max={100}
                step={1}
                suffix="%"
              />
            </div>
            
            <InputField
              label="Mortgage Term"
              id="term"
              type="number"
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              min={5}
              max={35}
              step={1}
              suffix="years"
              helpText="Typical terms range from 20-35 years"
            />
            
            <InputField
              label="Interest Rate"
              id="interest-rate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min={0.1}
              max={20}
              step={0.1}
              suffix="%"
              helpText="Current mortgage rates in Ireland range from 2.5-5%"
            />
            
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[#2B5273] text-sm font-medium flex items-center"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                <svg className={`ml-1 w-4 h-4 transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Frequency
                  </label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5273] focus:ring-[#2B5273] sm:text-sm"
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Type
                  </label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5273] focus:ring-[#2B5273] sm:text-sm"
                    value={interestType}
                    onChange={(e) => setInterestType(e.target.value)}
                  >
                    <option value="fixed">Fixed Rate</option>
                    <option value="variable">Variable Rate</option>
                  </select>
                </div>
                
                <InputField
                  label="Extra Payments (Monthly)"
                  id="extra-payments"
                  type="number"
                  value={extraPayments}
                  onChange={(e) => setExtraPayments(Number(e.target.value))}
                  min={0}
                  max={10000}
                  step={50}
                  prefix="€"
                  helpText="Additional monthly payments to reduce term"
                />
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-4">
              Our mortgage advisors can help you find the best rates and guide you through the application process.
            </p>
            <Link 
              href="/contact"
              className="block w-full bg-[#2B5273] text-white text-center px-4 py-2 rounded-md font-medium hover:bg-[#1E3142] transition-colors"
            >
              Book a Free Consultation
            </Link>
          </div>
        </div>
        
        {/* Results section */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Mortgage Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Monthly Payment</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyPayment)}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Repayment</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalRepayment)}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Interest</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalInterest)}</div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
              <div className="h-64">
                <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amortization Chart</h3>
              <div className="h-64">
                <Bar 
                  data={barChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                      }
                    }
                  }} 
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amortization Schedule</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {amortizationTable.slice(0, showFullTable ? amortizationTable.length : 5).map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.period}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.payment * 12)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.principalPayment * 12)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.interestPayment * 12)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {amortizationTable.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowFullTable(!showFullTable)}
                  className="mt-4 text-[#2B5273] text-sm font-medium flex items-center"
                >
                  {showFullTable ? 'Show Less' : 'Show Full Schedule'}
                  <svg className={`ml-1 w-4 h-4 transform ${showFullTable ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Calculator Disclaimer</h3>
            <p className="text-sm text-gray-600">
              This calculator provides an estimate only and is based on the information you have provided. 
              Actual mortgage rates, terms, and conditions may vary. Please consult with a mortgage advisor 
              for personalized advice tailored to your circumstances.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources/property-guides/first-time-buyer-guide" className="text-[#2B5273] hover:underline">
                  Complete Guide for First-Time Buyers in Ireland
                </Link>
              </li>
              <li>
                <Link href="/resources/property-guides/help-to-buy-explained" className="text-[#2B5273] hover:underline">
                  Help-to-Buy Scheme: A Comprehensive Explanation
                </Link>
              </li>
              <li>
                <Link href="/resources/calculators/stamp-duty-calculator" className="text-[#2B5273] hover:underline">
                  Stamp Duty Calculator
                </Link>
              </li>
              <li>
                <Link href="/resources/calculators/affordability-calculator" className="text-[#2B5273] hover:underline">
                  Mortgage Affordability Calculator
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 