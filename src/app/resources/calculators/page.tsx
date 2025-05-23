'use client';

import React from 'react';
import Link from 'next/link';
import { Calculator, Home, TrendingUp, BarChart2, FileText, Settings, DollarSign, PieChart, PlusCircle } from 'lucide-react';

// Icon components
const HomeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const EuroIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileTextIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const HelpCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const PiggyBankIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const Building2Icon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ChartBarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ShieldIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LandmarkIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const CrownIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const calculators = [
  {
    title: 'Mortgage Calculator',
    href: '/resources/calculators/mortgage-calculator',
    icon: <Calculator size={32} className="text-blue-600" />, 
    description: 'Estimate your monthly payments and borrowing power.'
  },
  {
    title: 'Affordability Calculator',
    href: '/resources/calculators/affordability',
    icon: <Home size={32} className="text-green-600" />,
    description: 'See what you can afford based on your income and deposit.'
  },
  {
    title: 'Stamp Duty Calculator',
    href: '/resources/calculators/stamp-duty',
    icon: <FileText size={32} className="text-purple-600" />,
    description: 'Calculate stamp duty costs for your property purchase.'
  },
  {
    title: 'Rental Yield Calculator',
    href: '/resources/calculators/rental-yield',
    icon: <TrendingUp size={32} className="text-yellow-600" />,
    description: 'Work out gross and net rental yields for investments.'
  },
  {
    title: 'Investment ROI Calculator',
    href: '/resources/calculators/investment-roi',
    icon: <BarChart2 size={32} className="text-pink-600" />,
    description: 'Analyse return on investment for buy-to-let or resale.'
  },
  {
    title: 'Portfolio Tracker',
    href: '/resources/calculators/portfolio-tracker',
    icon: <PieChart size={32} className="text-indigo-600" />,
    description: 'Track performance and value of your property portfolio.'
  },
  {
    title: 'Customisation Cost Estimator',
    href: '/resources/calculators/customisation',
    icon: <Settings size={32} className="text-teal-600" />,
    description: 'Estimate the cost of upgrades and extras for your new home.'
  }];

const comingSoon = [
  {
    title: 'Tax Benefit Calculator',
    icon: <DollarSign size={32} className="text-orange-500" />,
    description: 'See how government schemes and tax reliefs affect your purchase.'
  },
  {
    title: 'Multi-Unit Investment Tool',
    icon: <PlusCircle size={32} className="text-gray-500" />,
    description: 'Analyse returns for multi-unit or bulk property investments.'
  }];

function CalculatorCard({ calculator }: { calculator: any }) {
  const CardContent = (
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 p-3 rounded-lg`}>
        {calculator.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {calculator.title}
        </h3>
        <p className="text-gray-600 text-sm">
          {calculator.description}
        </p>
      </div>
    </div>
  );
  return (
    <div className={`relative bg-white rounded-lg shadow-md overflow-hidden`}>
      {calculator.href ? (
        <Link href={calculator.href} className="block p-6 hover:shadow-lg transition-shadow">
          {CardContent}
        </Link>
      ) : (
        <div className="block p-6 opacity-70 cursor-not-allowed">
          {CardContent}
          <span className="mt-4 inline-block bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">Coming Soon</span>
        </div>
      )}
    </div>
  );
}

export default function CalculatorsHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">Property Calculators & Tools</h1>
        <p className="text-lg text-gray-700 mb-12 text-center max-w-2xl mx-auto">Explore our suite of calculators and digital tools to help you plan, buy, invest, and manage property smarter. All tools are free to use and designed for Irish buyers, investors, and developers.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
          {calculators.map(calc => (
            <CalculatorCard key={calc.title} calculator={calc} />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Coming Soon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {comingSoon.map(tool => (
            <CalculatorCard key={tool.title} calculator={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}