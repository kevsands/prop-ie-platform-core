'use client';

import React from 'react';
import Link from 'next/link';
import { useInvestorMode } from './InvestorModeContext';
import { FeatherIcon } from '../ui/feather-icon';

const InvestorModeToggle = () => {
  const { investorMode, toggleInvestorMode } = useInvestorMode();

  if (investorMode) {
    return (
      <button
        onClick={toggleInvestorMode}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors"
      >
        <FeatherIcon name="Briefcase" size={16} />
        <span>Switch to Buyer Mode</span>
      </button>
    );
  }
  
  return (
    <Link 
      href="/investor/dashboard"
      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors"
      onClick={() => toggleInvestorMode()}
    >
      <FeatherIcon name="Briefcase" size={16} />
      <span>Switch to Investor Mode</span>
    </Link>
  );
};

export default InvestorModeToggle;