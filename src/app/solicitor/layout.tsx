'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Scale, 
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
  Shield,
  CheckCircle,
  Clock,
  Award,
  BookOpen,
  Archive,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

/**
 * Solicitor Portal Layout
 * Legal practice management with compliance and case tracking
 */
export default function SolicitorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/solicitor', icon: Home },
    { name: 'Overview', href: '/solicitor/overview', icon: TrendingUp },
    
    // Case Management
    {
      name: 'Cases',
      icon: Scale,
      isDropdown: true,
      subItems: [
        { name: 'All Cases', href: '/solicitor/cases', icon: Scale },
        { name: 'Active Cases', href: '/solicitor/cases/active', icon: Clock },
        { name: 'Completed', href: '/solicitor/cases/completed', icon: CheckCircle },
        { name: 'New Case', href: '/solicitor/cases/new', icon: FileText },
      ]
    },

    // Compliance & KYC
    {
      name: 'Compliance',
      icon: Shield,
      isDropdown: true,
      subItems: [
        { name: 'KYC Management', href: '/solicitor/kyc', icon: UserCheck },
        { name: 'AML Compliance', href: '/solicitor/aml', icon: Shield },
        { name: 'Audit Trail', href: '/solicitor/audit', icon: Archive },
        { name: 'Alerts', href: '/solicitor/alerts', icon: AlertTriangle },
      ]
    },

    { name: 'Documents', href: '/solicitor/documents', icon: FileText },
    { name: 'Clients', href: '/solicitor/clients', icon: Users },
    { name: 'Calendar', href: '/solicitor/calendar', icon: Calendar },
    { name: 'Reports', href: '/solicitor/reports', icon: BarChart3 },
    { name: 'Resources', href: '/solicitor/resources', icon: BookOpen },
    { name: 'Messages', href: '/solicitor/messages', icon: MessageSquare },
  ];

  const accountSection = [
    { name: 'Profile Settings', href: '/solicitor/profile', icon: User },
    { name: 'Security', href: '/solicitor/security', icon: Shield },
    { name: 'Practice Settings', href: '/solicitor/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/solicitor') return pathname === '/solicitor';
    return pathname.startsWith(href);
  };

  const isDropdownActive = (subItems: any[]) => {
    return subItems.some(item => isActive(item.href));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content wrapper - no main navigation needed */}
      <div>
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b md:hidden">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold text-gray-900">Solicitor Portal</h2>
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

        {/* Solicitor Sidebar */}
        <div className={`
          fixed top-0 left-0 z-30 h-screen w-80 bg-white border-r transform transition-transform duration-200 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <h2 className="text-xl font-bold">Solicitor Portal</h2>
            <p className="text-purple-100 text-sm mt-1">Legal Practice Management</p>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 pb-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                if (item.isDropdown) {
                  const isExpanded = item.name === 'Cases' ? casesOpen :
                                   item.name === 'Compliance' ? complianceOpen : false;
                  const setExpanded = item.name === 'Cases' ? setCasesOpen :
                                     item.name === 'Compliance' ? setComplianceOpen : () => {};
                  
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => setExpanded(!isExpanded)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          isDropdownActive(item.subItems || [])
                            ? 'bg-purple-50 text-purple-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon 
                            className={`mr-3 ${isDropdownActive(item.subItems || []) ? 'text-purple-700' : 'text-gray-500'}`} 
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
                                      ? 'bg-purple-50 text-purple-700 font-medium' 
                                      : 'text-gray-600 hover:bg-gray-100'
                                    }
                                  `}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <subItem.icon 
                                    className={`mr-2 ${subActive ? 'text-purple-700' : 'text-gray-400'}`} 
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
                          ? 'bg-purple-50 text-purple-700 font-medium shadow-sm border border-purple-100' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon 
                        className={`mr-3 ${active ? 'text-purple-700' : 'text-gray-500'}`} 
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
                            ? 'bg-purple-50 text-purple-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon 
                          className={`mr-3 ${active ? 'text-purple-700' : 'text-gray-500'}`} 
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

          {/* Legal Practice Banner */}
          <div className="mt-8 mx-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div className="flex items-center mb-2">
              <Scale className="text-purple-600 mr-2" size={20} />
              <span className="font-semibold text-purple-900">Legal Practice</span>
            </div>
            <p className="text-sm text-purple-700 mb-3">
              Professional legal management platform
            </p>
            <div className="text-xs text-purple-600 font-medium">
              Cases • Compliance • KYC • Documents
            </div>
          </div>
        </div>
        
        {/* Main content area with proper spacing */}
        <div className="md:ml-80">
          {/* User Profile Banner */}
          <div className="bg-white border-b shadow-sm px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                  <Scale size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Solicitor Portal</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Legal Practice Management</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Professional
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
                  href="/solicitor/settings"
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