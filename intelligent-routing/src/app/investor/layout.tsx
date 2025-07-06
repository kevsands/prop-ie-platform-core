'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, LineChart, Building, TrendingUp, Settings } from 'lucide-react';

// Simplified Card component
const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

// Mock investor mode context
const InvestorModeProvider = ({ children }) => {
  return <>{children}</>;
};

const InvestorMenu = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <div className="w-full lg:w-64 p-4 bg-white border-r border-gray-200">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Investor Portal</h2>
        <nav className="space-y-1">
          <Link href="/investor/overview" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/investor/overview')}`}>
            <Home className="mr-3 h-5 w-5" />
            Overview
          </Link>
          <Link href="/investor/dashboard" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/investor/dashboard')}`}>
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/investor/properties" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/investor/properties')}`}>
            <Building className="mr-3 h-5 w-5" />
            Properties
          </Link>
          <Link href="/investor/financial" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/investor/financial')}`}>
            <LineChart className="mr-3 h-5 w-5" />
            Financial
          </Link>
          <Link href="/investor/portfolio" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/investor/portfolio')}`}>
            <PieChart className="mr-3 h-5 w-5" />
            Portfolio
          </Link>
          <Link href="/investor/market" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/investor/market')}`}>
            <TrendingUp className="mr-3 h-5 w-5" />
            Market Analysis
          </Link>
          <Link href="/investor/settings" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/investor/settings')}`}>
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>
      
      <Card className="p-3 bg-blue-50 border-blue-200">
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Need help?</p>
          <p className="mb-2">Contact our investor relations team for personalized assistance.</p>
          <Link href="/contact" className="text-blue-700 hover:underline font-medium">
            Get Support
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  return (
    <InvestorModeProvider>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        <InvestorMenu />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </InvestorModeProvider>
  );
}