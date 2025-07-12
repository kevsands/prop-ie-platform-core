/**
 * Contractor Portal Layout
 * 
 * Navigation and layout for contractor portal pages
 */

import React from 'react';
import Link from 'next/link';
import { Building2, FileText, Receipt, Settings, User } from 'lucide-react';

interface ContractorLayoutProps {
  children: React.ReactNode;
}

export default function ContractorLayout({ children }: ContractorLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/contractor" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Contractor Portal</span>
              </Link>
              
              <div className="flex items-center gap-6">
                <Link 
                  href="/contractor" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/contractor/valuations" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Valuations
                </Link>
                <Link 
                  href="/contractor/payments" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Payments
                </Link>
                <Link 
                  href="/contractor/documents" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Documents
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Murphy Construction Ltd</span>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}