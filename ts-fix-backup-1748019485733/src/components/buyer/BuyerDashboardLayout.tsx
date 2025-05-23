'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BuyerDashboardSidebar from './BuyerDashboardSidebar';
import { Toaster } from 'sonner';
import { 
  Home, FileText, CreditCard, MessageSquare, 
  User, HelpCircle, Settings, 
  BarChart4, Calendar, Clock, ArrowRight, 
  CheckCircle2, CircleDot 
} from 'lucide-react';

interface BuyerDashboardLayoutProps {
  children: React.ReactNode;
}

export function BuyerDashboardLayout({ children }: BuyerDashboardLayoutProps) {
  const pathname = usePathname();
  const [activeTabsetActiveTab] = useState(getActiveTabFromPath(pathname));

  function getActiveTabFromPath(path: string): string {
    if (path === '/buyer') return 'overview';
    if (path.includes('/buyer/properties')) return 'properties';
    if (path.includes('/buyer/documents')) return 'documents';
    if (path.includes('/buyer/payments')) return 'payments';
    if (path.includes('/buyer/messages')) return 'messages';
    if (path.includes('/buyer/profile')) return 'profile';
    if (path.includes('/buyer/htb')) return 'htb';
    if (path.includes('/buyer/customization')) return 'customization';
    if (path.includes('/buyer/journey')) return 'journey';
    return 'overview';
  }

  // Define the journey phases for the FTB experience
  const journeyPhases = [
    { id: 'planning', name: 'Planning', path: '/buyer/journey/planning', status: 'complete' },
    { id: 'financing', name: 'Financing', path: '/buyer/journey/financing', status: 'active' },
    { id: 'reservation', name: 'Reservation', path: '/buyer/journey/reservation', status: 'pending' },
    { id: 'transaction', name: 'Transaction', path: '/buyer/journey/transaction', status: 'pending' },
    { id: 'closing', name: 'Closing & Moving', path: '/buyer/journey/closing', status: 'pending' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-5 h-16">
          <Link 
            href="/buyer"
            className={`flex flex-col items-center justify-center text-xs ${
              activeTab === 'overview' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home size={20} />
            <span className="mt-1">Dashboard</span>
          </Link>
          <Link 
            href="/buyer/journey"
            className={`flex flex-col items-center justify-center text-xs ${
              activeTab === 'journey' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <BarChart4 size={20} />
            <span className="mt-1">My Journey</span>
          </Link>
          <Link 
            href="/buyer/documents"
            className={`flex flex-col items-center justify-center text-xs ${
              activeTab === 'documents' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <FileText size={20} />
            <span className="mt-1">Documents</span>
          </Link>
          <Link 
            href="/buyer/messages"
            className={`flex flex-col items-center justify-center text-xs ${
              activeTab === 'messages' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <MessageSquare size={20} />
            <span className="mt-1">Messages</span>
          </Link>
          <Link 
            href="/buyer/profile"
            className={`flex flex-col items-center justify-center text-xs ${
              activeTab === 'profile' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <User size={20} />
            <span className="mt-1">Profile</span>
          </Link>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:w-64 fixed inset-y-0">
        <BuyerDashboardSidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => setActiveTab(tab)} 
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex-1">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
          {/* Journey Tracker - visible on all pages for FTB */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Your Home Buying Journey</h2>
              <Link href="/buyer/journey" className="text-blue-600 text-sm flex items-center">
                View Details <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="flex items-center">
              {journeyPhases.map((phaseindex) => (
                <React.Fragment key={phase.id}>
                  <Link href={phase.path} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        phase.status === 'complete' ? 'bg-green-100 text-green-600' : 
                        phase.status === 'active' ? 'bg-blue-100 text-blue-600' : 
                        'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {phase.status === 'complete' ? (
                        <CheckCircle2 size={18} />
                      ) : phase.status === 'active' ? (
                        <CircleDot size={18} /> 
                      ) : (
                        <Clock size={18} />
                      )}
                    </div>
                    <span 
                      className={`text-xs mt-1 ${
                        phase.status === 'complete' ? 'text-green-600' : 
                        phase.status === 'active' ? 'text-blue-600' : 
                        'text-gray-400'
                      }`}
                    >
                      {phase.name}
                    </span>
                  </Link>
                  {index <journeyPhases.length - 1 && (
                    <div 
                      className={`flex-1 h-1 mx-2 ${
                        phase.status === 'complete' ? 'bg-green-200' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Page content */}
          {children}
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}

export default BuyerDashboardLayout;