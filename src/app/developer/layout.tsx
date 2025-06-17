'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainNavigation from '@/components/navigation/MainNavigation';
import { 
  Home, 
  Building2, 
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
  BarChart3,
  DollarSign,
  Calculator,
  BookOpen,
  Shield,
  CreditCard,
  Heart,
  Target,
  Briefcase,
  Globe,
  Zap,
  Award
} from 'lucide-react';

/**
 * Advanced Enterprise Developer Portal Layout
 * Complete feature set with 19+ routes and advanced analytics
 */
export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [htbOpen, setHtbOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/developer', icon: Home },
    { name: 'Overview', href: '/developer/overview', icon: TrendingUp },
    
    // Project Management
    {
      name: 'Projects',
      icon: Building2,
      isDropdown: true,
      subItems: [
        { name: 'All Projects', href: '/developer/projects', icon: Building2 },
        { name: 'Fitzgerald Gardens', href: '/developer/projects/fitzgerald-gardens', icon: Target },
        { name: 'Ellwood', href: '/developer/projects/ellwood', icon: Target },
        { name: 'Ballymakenny View', href: '/developer/projects/ballymakenny-view', icon: Target },
        { name: 'Timeline Management', href: '/developer/timeline', icon: Calendar },
        { name: 'Tender Management', href: '/developer/tenders', icon: Briefcase },
        { name: 'Planning Compliance', href: '/developer/planning-compliance', icon: Shield },
      ]
    },

    // Analytics & Reporting
    {
      name: 'Analytics',
      icon: BarChart3,
      isDropdown: true,
      subItems: [
        { name: 'Property Analytics', href: '/developer/analytics', icon: BarChart3 },
        { name: 'Sales Performance', href: '/developer/sales', icon: TrendingUp },
        { name: 'Market Intelligence', href: '/developer/market', icon: Globe },
        { name: 'Revenue Reports', href: '/developer/revenue', icon: DollarSign },
      ]
    },

    // Sales Management & Unit Control
    {
      name: 'Sales',
      icon: TrendingUp,
      isDropdown: true,
      subItems: [
        { name: 'Sales Overview', href: '/developer/sales', icon: BarChart3 },
        { name: 'Fitzgerald Gardens', href: '/developer/sales/fitzgerald-gardens', icon: Building2 },
        { name: 'Ellwood', href: '/developer/sales/ellwood', icon: Building2 },
        { name: 'Ballymakenny View', href: '/developer/sales/ballymakenny-view', icon: Building2 },
        { name: 'All Properties', href: '/developer/properties', icon: Target },
      ]
    },

    // Financial Management
    {
      name: 'Finance',
      icon: DollarSign,
      isDropdown: true,
      subItems: [
        { name: 'Financial Dashboard', href: '/developer/finance', icon: DollarSign },
        { name: 'Financial Control', href: '/developer/financial-control', icon: CreditCard },
        { name: 'Invoices', href: '/developer/invoices', icon: FileText },
        { name: 'Budget Management', href: '/developer/budget', icon: Calculator },
        { name: 'Cost Analysis', href: '/developer/costs', icon: BarChart3 },
        { name: 'ROI Tracking', href: '/developer/roi', icon: TrendingUp },
      ]
    },

    // Help-to-Buy Management
    {
      name: 'Help-to-Buy',
      icon: Heart,
      isDropdown: true,
      subItems: [
        { name: 'HTB Dashboard', href: '/developer/htb', icon: Heart },
        { name: 'Claims Management', href: '/developer/htb/claims', icon: FileText },
        { name: 'HTB Analytics', href: '/developer/htb/analytics', icon: BarChart3 },
        { name: 'Revenue Impact', href: '/developer/htb/revenue', icon: DollarSign },
      ]
    },

    { name: 'Documents', href: '/developer/documents', icon: FileText },
    { name: 'Agent Communications', href: '/developer/agent-communications', icon: Users },
    { name: 'Collaboration Hub', href: '/developer/collaboration', icon: MessageSquare },
    
    // Team Management
    {
      name: 'Team',
      icon: Users,
      isDropdown: true,
      subItems: [
        { name: 'Team Overview', href: '/developer/team', icon: Users },
        { name: 'Team Members', href: '/developer/team/members', icon: User },
        { name: 'Contractors', href: '/developer/team/contractors', icon: Briefcase },
        { name: 'Compliance Tracking', href: '/developer/team/compliance', icon: Shield },
      ]
    },
    
    { name: 'Messages', href: '/developer/messages', icon: MessageSquare },
  ];

  const accountSection = [
    { name: 'Profile Settings', href: '/developer/profile', icon: User },
    { name: 'Security', href: '/developer/security', icon: Shield },
    { name: 'Billing', href: '/developer/billing', icon: CreditCard },
    { name: 'Platform Settings', href: '/developer/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/developer') return pathname === '/developer';
    return pathname.startsWith(href);
  };

  const isDropdownActive = (subItems: any[]) => {
    return subItems.some(item => isActive(item.href));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navigation - Always on top */}
      <MainNavigation />
      
      {/* Content wrapper with top padding */}
      <div className="pt-16">
        {/* Mobile header */}
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b md:hidden">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold text-gray-900">Developer Portal</h2>
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

        {/* Enterprise Sidebar */}
        <div className={`
          fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-80 bg-white border-r transform transition-transform duration-200 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h2 className="text-xl font-bold">Developer Portal</h2>
            <p className="text-blue-100 text-sm mt-1">Enterprise Property Management</p>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 pb-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                if (item.isDropdown) {
                  const isExpanded = item.name === 'Projects' ? projectsOpen :
                                   item.name === 'Analytics' ? analyticsOpen : 
                                   item.name === 'Sales' ? salesOpen :
                                   item.name === 'Finance' ? financeOpen :
                                   item.name === 'Help-to-Buy' ? htbOpen :
                                   item.name === 'Team' ? teamOpen : false;
                  const setExpanded = item.name === 'Projects' ? setProjectsOpen :
                                     item.name === 'Analytics' ? setAnalyticsOpen : 
                                     item.name === 'Sales' ? setSalesOpen :
                                     item.name === 'Finance' ? setFinanceOpen :
                                     item.name === 'Help-to-Buy' ? setHtbOpen :
                                     item.name === 'Team' ? setTeamOpen : () => {};
                  
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => setExpanded(!isExpanded)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          isDropdownActive(item.subItems || [])
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon 
                            className={`mr-3 ${isDropdownActive(item.subItems || []) ? 'text-blue-700' : 'text-gray-500'}`} 
                            size={20} 
                          />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown 
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          size={16} 
                        />
                      </button>
                      {isExpanded && (
                        <ul className="mt-2 ml-8 space-y-1">
                          {item.subItems?.map((subItem) => {
                            const subActive = isActive(subItem.href);
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

                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
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
                      {active && <ChevronRight className="ml-auto" size={16} />}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Account Section */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
              <ul className="space-y-1">
                {accountSection.map((item) => {
                  const active = isActive(item.href);
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

          {/* Success Banner */}
          <div className="mt-8 mx-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center mb-2">
              <Award className="text-green-600 mr-2" size={20} />
              <span className="font-semibold text-green-900">Enterprise Active</span>
            </div>
            <p className="text-sm text-green-700 mb-3">
              Full developer portal with advanced analytics
            </p>
            <div className="text-xs text-green-600 font-medium">
              19 Routes • Analytics • Finance • HTB
            </div>
          </div>
        </div>
        
        {/* Main content area with proper spacing */}
        <div className="md:ml-80">
          {/* User Profile Banner */}
          <div className="bg-white border-b shadow-sm px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <User size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Developer Portal</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Enterprise Management</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Advanced
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
                </button>
                <Link 
                  href="/developer/settings"
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
          
          {/* Main content */}
          <main className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}