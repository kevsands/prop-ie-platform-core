'use client';

import React from 'react';

const PropertyInvestmentMetrics = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-[#2B5273]">Investment Metrics</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li>Gross Yield: 7.2%</li>
        <li>Net Yield: 6.1%</li>
        <li>Projected Appreciation: 4% p.a.</li>
        <li>Rental Demand: High</li>
      </ul>
    </div>
  );
};

export default PropertyInvestmentMetrics;