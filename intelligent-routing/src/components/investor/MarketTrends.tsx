'use client';

import React from 'react';

const MarketTrends = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-[#2B5273]">Market Trends</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li>Drogheda Rental Growth: +8% YoY</li>
        <li>Vacancy Rate: 2.5%</li>
        <li>Average Days on Market: 21 days</li>
      </ul>
    </div>
  );
};

export default MarketTrends;