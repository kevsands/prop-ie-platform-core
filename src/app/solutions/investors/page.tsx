'use client';

import React from 'react';

export default function InvestorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Investor Solutions</h1>
      <p className="text-lg text-gray-700 mb-8">
        Maximize your property portfolio with our data-driven insights and exclusive 
        investment opportunities designed for serious investors.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Professional Investors</h2>
          <p className="text-gray-600 mb-4">
            Access advanced analytics, market trends, and exclusive property deals 
            to optimize your investment strategy.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Institutional Investors</h2>
          <p className="text-gray-600 mb-4">
            Large-scale property investment solutions for funds, REITs, and institutional 
            investors seeking portfolio expansion.
          </p>
        </div>
      </div>
    </div>
  );
} 