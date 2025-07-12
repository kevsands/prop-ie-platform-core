/**
 * Quantity Surveyor Layout
 * 
 * Provides navigation and layout for all QS dashboard pages
 */

import React from 'react';
import Link from 'next/link';
import { Calculator, FileText, CheckCircle, Home, Euro, BarChart3, Award } from 'lucide-react';

interface QSLayoutProps {
  children: React.ReactNode;
}

export default function QuantitySurveyorLayout({ children }: QSLayoutProps) {
  const navigationItems = [
    {
      href: '/quantity-surveyor/cost-management',
      label: 'Cost Management',
      icon: <Calculator className="h-4 w-4" />,
      description: 'BOQ, cost analysis, and project financials'
    },
    {
      href: '/quantity-surveyor/valuation-review',
      label: 'Valuation Review',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Review and approve contractor valuations'
    },
    {
      href: '/developer/team/quantity-surveyors',
      label: 'Developer Dashboard',
      icon: <Home className="h-4 w-4" />,
      description: 'Return to developer team management'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Quantity Surveyor</h1>
                  <p className="text-sm text-gray-600">Professional Cost Management</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Sarah Mitchell</p>
                <p className="text-xs text-gray-600">MSCSI, Chartered QS</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 rounded-md whitespace-nowrap"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Quick Stats Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">€9.8M</p>
              <p className="text-xs text-gray-600">Project Value</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">€6.5M</p>
              <p className="text-xs text-gray-600">Certified to Date</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">1</p>
              <p className="text-xs text-gray-600">Pending Reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">97.2%</p>
              <p className="text-xs text-gray-600">Cost Performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}