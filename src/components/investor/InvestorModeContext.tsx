'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InvestorModeContextType {
  investorMode: boolean;
  isInvestorMode: boolean; // Add this for compatibility
  toggleInvestorMode: () => void;
}

// Create the context with default values
const InvestorModeContext = createContext<InvestorModeContextType>({
  investorMode: false,
  isInvestorMode: false,
  toggleInvestorMode: () => {}
});

// Simplified InvestorModeProvider for development
export const InvestorModeProvider = ({ children }: { children: ReactNode }) => {
  const [investorModesetInvestorMode] = useState(false);

  const toggleInvestorMode = () => {
    setInvestorMode(prev => !prev);
  };

  const value = {
    investorMode,
    isInvestorMode: investorMode, // For compatibility
    toggleInvestorMode
  };

  return (
    <InvestorModeContext.Provider value={value}>
      {children}
    </InvestorModeContext.Provider>
  );
};

// Hook for using the context
export const useInvestorMode = (): InvestorModeContextType => {
  const context = useContext(InvestorModeContext);
  if (context === undefined) {
    throw new Error('useInvestorMode must be used within an InvestorModeProvider');
  }
  return context;
};

export default InvestorModeContext;