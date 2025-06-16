'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainNavigation from '@/components/navigation/MainNavigation';
import { 
  Home, 
  FileText, 
  Users,
  MessageSquare,
  User,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  Calendar,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Sparkles,
  Calculator,
  BookOpen,
  Shield,
  CreditCard,
  Heart,
  Receipt,
  Activity,
  Clock
} from 'lucide-react';

/**
 * Buyer Dashboard Layout with main navigation and fixed section navigation
 */
export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toolkitOpen, setToolkitOpen] = useState(false);

  const navigation = [
    { name: 'Welcome', href: '/buyer/first-time-buyers/welcome', icon: Sparkles, isNew: true },
    { name: 'Overview', href: '/buyer/overview', icon: Home },
    { name: 'My Journey', href: '/buyer/journey', icon: TrendingUp },
    { name: 'Documents', href: '/buyer/documents', icon: FileText },
    { name: 'Transaction Status', href: '/buyer/transaction', icon: Activity },
    { name: 'Payments', href: '/buyer/payments', icon: Receipt },
    { name: 'Messages', href: '/buyer/messages', icon: MessageSquare },
    { name: 'Appointments', href: '/buyer/appointments', icon: Calendar },
    {
      name: 'My Toolkit',
      icon: Calculator,
      isDropdown: true,
      subItems: [
        { name: 'Affordability Calculator', href: '/buyer/calculator', icon: Calculator },
        { name: 'HTB Calculator', href: '/buyer/calculator/htb', icon: Heart },
        { name: 'Guides & Resources', href: '/buyer/guides', icon: BookOpen },
        { name: 'Checklists', href: '/buyer/checklists', icon: FileText },
      ]
    },
    { name: 'Profile', href: '/buyer/profile', icon: User },
  ];

  const profileSection = [
    { name: 'Verification', href: '/buyer/verification', icon: Shield },
    { name: 'Payment Methods', href: '/buyer/payment-methods', icon: CreditCard },
    { name: 'Settings', href: '/buyer/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/buyer') return pathname === '/buyer';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navigation - Always on top */}
      <MainNavigation />
      
      {/* User Profile Banner - Full width below navigation */}
      <div className="bg-white border-b shadow-sm px-6 py-5 mt-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <User size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-900">John Doe</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">First-time Buyer</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link 
              href="/buyer/settings"
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings size={20} className="text-gray-600" />
            </Link>
            <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative">
        {/* Mobile header with proper spacing to avoid overlap */}
        <div className="fixed top-28 left-0 right-0 z-40 bg-white border-b md:hidden">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold text-gray-900">Buyer Dashboard</h2>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed top-28 left-0 z-30 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:fixed md:transform-none
        `}>
          {/* Desktop header */}
          <div className="hidden md:block p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Buyer Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your property journey</p>
          </div>

          {/* Mobile sidebar top spacing */}
          <div className="h-16 md:hidden" />

          {/* Navigation */}
          <nav className="mt-6 px-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                if (item.isDropdown) {
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => setToolkitOpen(!toolkitOpen)}
                        className="w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <item.icon 
                            className="mr-3 text-gray-500" 
                            size={20} 
                          />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown 
                          className={`transition-transform ${toolkitOpen ? 'rotate-180' : ''}`} 
                          size={16} 
                        />
                      </button>
                      {toolkitOpen && (
                        <ul className="mt-2 ml-8 space-y-1">
                          {item.subItems?.map((subItem) => {
                            const subActive = pathname === subItem.href;
                            return (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className={`
                                    flex items-center p-2 rounded-lg transition-colors text-sm
                                    ${subActive 
                                      ? 'bg-blue-50 text-blue-700 font-medium' 
                                      : 'text-gray-600 hover:bg-gray-100'
                                    }
                                  `}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <subItem.icon 
                                    className={`mr-2 ${subActive ? 'text-blue-700' : 'text-gray-400'}`} 
                                    size={16} 
                                  />
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                const active = item.href && isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href || '#'}
                      className={`
                        flex items-center p-3 rounded-lg transition-all duration-200 relative
                        ${active 
                          ? 'bg-blue-50 text-blue-700 font-medium shadow-sm border border-blue-100' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon 
                        className={`mr-3 ${active ? 'text-blue-700' : 'text-gray-500'}`} 
                        size={20} 
                      />
                      <span>{item.name}</span>
                      {item.isNew && (
                        <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                      {active && <ChevronRight className="ml-auto" size={16} />}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Profile Section */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
              <ul className="space-y-2">
                {profileSection.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center p-3 rounded-lg transition-colors
                          ${active 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon 
                          className={`mr-3 ${active ? 'text-blue-700' : 'text-gray-500'}`} 
                          size={20} 
                        />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Help section */}
          <div className="mt-8 mx-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center mb-2">
              <HelpCircle className="text-blue-600 mr-2" size={20} />
              <span className="font-semibold text-blue-900">Need Help?</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Contact our buyer support team
            </p>
            <Link 
              href="/buyer/support"
              className="block w-full text-center py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-sm"
            >
              Get Support
            </Link>
          </div>

        </div>
        
        {/* Main content with proper spacing */}
        <div className="flex-1 md:ml-64">
          {/* Page content with mobile top padding */}
          <main className="p-4 md:p-6 pt-24 md:pt-6">
            <div className="flex gap-6">
              {/* Primary content area */}
              <div className="flex-1">
                {children}
              </div>
              
              {/* Right side panel placeholder - empty for now */}
              <div className="hidden xl:block w-80">
                {/* Future side panel content goes here */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}