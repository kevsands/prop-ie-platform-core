'use client';

import React from 'react';
import Link from 'next/link';
import { LineChart } from 'lucide-react';

// Simplified components
const Button = ({ children, asChild, ...props }) => {
  if (asChild) {
    return children;
  }
  
  return (
    <button 
      className="inline-flex items-center justify-center rounded-md font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4" 
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export default function InvestorFinancialPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Analysis</h1>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Financial Analytics</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              This page will provide comprehensive financial analytics, ROI calculations, cash flow analysis, and investment projections.
            </p>
            <p className="text-blue-600 mb-6">This page is under development and will be available soon.</p>
            <Button asChild>
              <Link href="/investor/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}