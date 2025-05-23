'use client';

import React from 'react';
import Link from 'next/link';
import { Calculator, Euro, Home, Receipt, TrendingUp } from 'lucide-react';

const calculators = [
  {
    title: 'Mortgage Calculator',
    description: 'Calculate your monthly payments and check affordability',
    icon: Home,
    href: '/calculators/mortgage',
    color: 'bg-blue-500'},
  {
    title: 'Help-to-Buy Calculator',
    description: 'Check your eligibility and calculate your HTB benefit',
    icon: Euro,
    href: '/calculators/htb',
    color: 'bg-green-500'},
  {
    title: 'Stamp Duty Calculator',
    description: 'Calculate stamp duty costs for your property purchase',
    icon: Receipt,
    href: '/calculators/stamp-duty',
    color: 'bg-purple-500'},
  {
    title: 'Affordability Calculator',
    description: 'Find out how much you can afford to borrow',
    icon: TrendingUp,
    href: '/calculators/affordability',
    color: 'bg-orange-500'}];

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Calculators
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use our suite of calculators to plan your property purchase. Get accurate estimates for mortgages, stamp duty, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {calculators.map((calculator: any) => (
            <Link
              key={calculator.href}
              href={calculator.href}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="p-8">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${calculator.color} text-white`}>
                    <calculator.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {calculator.title}
                    </h2>
                    <p className="text-gray-600">
                      {calculator.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8">
                <span className="text-blue-600 font-medium group-hover:underline">
                  Use Calculator →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Understanding Your Results?
          </h2>
          <p className="text-gray-700 mb-6">
            Our financial advisors are here to help you understand your calculations and guide you through the property buying process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact an Advisor
            </Link>
            <Link
              href="/resources/buying-guide"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Read Buying Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}