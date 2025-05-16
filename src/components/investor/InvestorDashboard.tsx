'use client';

import React from 'react';
import PropertyInvestmentMetrics from './PropertyInvestmentMetrics';
import MarketTrends from './MarketTrends';

const InvestorDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <PropertyInvestmentMetrics />
      <MarketTrends />
    </div>
  );
};

export default InvestorDashboard;