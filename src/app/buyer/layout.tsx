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
  Heart
} from 'lucide-react';

/**
 * Buyer Dashboard Layout with main navigation and fixed section navigation
 */
export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpensetSidebarOpen] = useState(false);
  const [toolkitOpensetToolkitOpen] = useState(false);

  const navigation = [
    { name: 'Welcome', href: '/buyer/first-time-buyers/welcome', icon: Sparkles, isNew: true },
    { name: 'Overview', href: '/buyer', icon: Home },
    { name: 'My Journey', href: '/buyer/journey', icon: TrendingUp },
    { name: 'Documents', href: '/buyer/documents', icon: FileText },
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
        { name: 'Checklists', href: '/buyer/checklists', icon: FileText }]
    },
    { name: 'Profile', href: '/buyer/profile', icon: User }];

  const profileSection = [
    { name: 'Verification', href: '/buyer/verification', icon: Shield },
    { name: 'Payment Methods', href: '/buyer/payment-methods', icon: CreditCard },
    { name: 'Settings', href: '/buyer/settings', icon: Settings }];

  const isActive = (href: string) => {
    if (href === '/buyer') return pathname === '/buyer';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Main Navigation */}
      <MainNavigation />
      
      {/* Layout Container - accounts for fixed nav */}
      <div className="pt-16 flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Buyer Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your property journey</p>
            
            {/* User Profile */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">First-time Buyer</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <LogOut size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-1">
              {navigation.map((item: any) => {
                if (item.isDropdown) {
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => setToolkitOpen(!toolkitOpen)}
                        className="w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 text-gray-500" size={20} />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown className={`transition-transform ${toolkitOpen ? 'rotate-180' : ''}`} size={16} />
                      </button>
                      {toolkitOpen && (
                        <ul className="mt-2 ml-8 space-y-1">
                          {item.subItems?.map((subItem: any) => {
                            const subActive = pathname === subItem.href;
                            return (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className={`flex items-center p-2 rounded-lg transition-colors text-sm ${
                                    subActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <subItem.icon className={`mr-2 ${subActive ? 'text-blue-700' : 'text-gray-400'}`} size={16} />
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
                      className={`flex items-center p-3 rounded-lg transition-colors relative ${
                        active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className={`mr-3 ${active ? 'text-blue-700' : 'text-gray-500'}`} size={20} />
                      <span>{item.name}</span>
                      {item.isNew && (
                        <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                      )}
                      {active && <ChevronRight className="ml-auto" size={16} />}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Account Section */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
              <ul className="space-y-1">
                {profileSection.map((item: any) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                          active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className={`mr-3 ${active ? 'text-blue-700' : 'text-gray-500'}`} size={20} />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Help Section */}
          <div className="p-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <HelpCircle className="text-blue-600 mr-2" size={20} />
                <span className="font-medium text-blue-900">Need Help?</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">Contact our buyer support team</p>
              <Link
                href="/buyer/support"
                className="block w-full text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
              >
                Get Support
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b">
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

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`md:hidden fixed top-32 left-0 z-30 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4">
            <nav className="space-y-2">
              {navigation.map((item: any) => {
                const active = item.href && isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href || '#'}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`mr-3 ${active ? 'text-blue-700' : 'text-gray-500'}`} size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}