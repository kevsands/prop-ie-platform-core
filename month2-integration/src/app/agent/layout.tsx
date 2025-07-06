'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainNavigation from '@/components/navigation/MainNavigation';
import { 
  Home, 
  Building2, 
  Users, 
  Calendar,
  MessageSquare,
  User,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  Settings,
  Bell,
  LogOut,
  BarChart3,
  DollarSign,
  Eye,
  Phone,
  Mail,
  Camera,
  FileText,
  Target,
  Award,
  Briefcase
} from 'lucide-react';

/**
 * Agent Portal Layout
 * Estate agent CRM for developer-appointed agents
 */
export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/agent', icon: Home },
    { name: 'Overview', href: '/agent/overview', icon: TrendingUp },
    
    // Property Management
    {
      name: 'Properties',
      icon: Building2,
      isDropdown: true,
      subItems: [
        { name: 'Assigned Properties', href: '/agent/properties', icon: Building2 },
        { name: 'Active Listings', href: '/agent/properties/active', icon: Eye },
        { name: 'Property Assignment', href: '/agent/properties/assign', icon: Target },
        { name: 'Performance', href: '/agent/properties/performance', icon: BarChart3 },
      ]
    },

    // Client Management
    {
      name: 'Clients',
      icon: Users,
      isDropdown: true,
      subItems: [
        { name: 'All Clients', href: '/agent/clients', icon: Users },
        { name: 'Lead Management', href: '/agent/leads', icon: Target },
        { name: 'Active Leads', href: '/agent/clients/leads', icon: Target },
        { name: 'New Client', href: '/agent/clients/new', icon: User },
        { name: 'Follow-ups', href: '/agent/clients/followups', icon: Phone },
      ]
    },

    { name: 'Viewings', href: '/agent/viewings', icon: Calendar },
    { name: 'Marketing', href: '/agent/marketing', icon: Camera },
    { name: 'Commission', href: '/agent/commission', icon: DollarSign },
    { name: 'Developer Chat', href: '/agent/developer-chat', icon: Building2 },
    { name: 'Analytics', href: '/agent/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/agent/reports', icon: BarChart3 },
    { name: 'Messages', href: '/agent/messages', icon: MessageSquare },
  ];

  const accountSection = [
    { name: 'Profile Settings', href: '/agent/profile', icon: User },
    { name: 'Agent Settings', href: '/agent/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/agent') return pathname === '/agent';
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
            <h2 className="text-lg font-bold text-gray-900">Agent Portal</h2>
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

        {/* Agent Sidebar */}
        <div className={`
          fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-80 bg-white border-r transform transition-transform duration-200 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <h2 className="text-xl font-bold">Agent Portal</h2>
            <p className="text-green-100 text-sm mt-1">Developer-Appointed Estate Agent</p>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 pb-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                if (item.isDropdown) {
                  const isExpanded = item.name === 'Properties' ? propertiesOpen :
                                   item.name === 'Clients' ? clientsOpen : false;
                  const setExpanded = item.name === 'Properties' ? setPropertiesOpen :
                                     item.name === 'Clients' ? setClientsOpen : () => {};
                  
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => setExpanded(!isExpanded)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          isDropdownActive(item.subItems || [])
                            ? 'bg-green-50 text-green-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon 
                            className={`mr-3 ${isDropdownActive(item.subItems || []) ? 'text-green-700' : 'text-gray-500'}`} 
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
                                      ? 'bg-green-50 text-green-700 font-medium' 
                                      : 'text-gray-600 hover:bg-gray-100'
                                    }
                                  `}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <subItem.icon 
                                    className={`mr-2 ${subActive ? 'text-green-700' : 'text-gray-400'}`} 
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
                          ? 'bg-green-50 text-green-700 font-medium shadow-sm border border-green-100' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon 
                        className={`mr-3 ${active ? 'text-green-700' : 'text-gray-500'}`} 
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
                            ? 'bg-green-50 text-green-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon 
                          className={`mr-3 ${active ? 'text-green-700' : 'text-gray-500'}`} 
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

          {/* Agent CRM Banner */}
          <div className="mt-8 mx-4 p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
            <div className="flex items-center mb-2">
              <Briefcase className="text-green-600 mr-2" size={20} />
              <span className="font-semibold text-green-900">Prop.ie Agent</span>
            </div>
            <p className="text-sm text-green-700 mb-3">
              Specialized CRM for developer properties
            </p>
            <div className="text-xs text-green-600 font-medium">
              Properties • Clients • Viewings • Commission
            </div>
          </div>
        </div>
        
        {/* Main content area with proper spacing */}
        <div className="md:ml-80">
          {/* User Profile Banner */}
          <div className="bg-white border-b shadow-sm px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                  <Briefcase size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Agent Portal</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Estate Agent CRM</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                </button>
                <Link 
                  href="/agent/settings"
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