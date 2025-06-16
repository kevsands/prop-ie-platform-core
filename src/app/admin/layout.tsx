'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainNavigation from '@/components/navigation/MainNavigation';
import { 
  Home, 
  Shield, 
  Users, 
  Settings,
  User,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  Bell,
  LogOut,
  BarChart3,
  Database,
  Monitor,
  Server,
  AlertTriangle,
  UserCheck,
  FileText,
  Activity,
  Globe,
  Lock,
  Archive,
  Zap,
  Award,
  Clock
} from 'lucide-react';

/**
 * Admin Portal Layout
 * Platform administration and system monitoring
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Overview', href: '/admin/overview', icon: TrendingUp },
    
    // User Management
    {
      name: 'Users',
      icon: Users,
      isDropdown: true,
      subItems: [
        { name: 'All Users', href: '/admin/users', icon: Users },
        { name: 'User Roles', href: '/admin/users/roles', icon: UserCheck },
        { name: 'Pending Approvals', href: '/admin/users/pending', icon: Clock },
        { name: 'New User', href: '/admin/users/new', icon: User },
      ]
    },

    // Security Management
    {
      name: 'Security',
      icon: Shield,
      isDropdown: true,
      subItems: [
        { name: 'Security Center', href: '/admin/security', icon: Shield },
        { name: 'Alert Management', href: '/admin/security/alerts', icon: AlertTriangle },
        { name: 'Access Control', href: '/admin/security/access', icon: Lock },
        { name: 'Audit Logs', href: '/admin/security/audit', icon: Archive },
      ]
    },

    // System Management
    {
      name: 'System',
      icon: Server,
      isDropdown: true,
      subItems: [
        { name: 'System Health', href: '/admin/system', icon: Monitor },
        { name: 'Database', href: '/admin/system/database', icon: Database },
        { name: 'Performance', href: '/admin/system/performance', icon: Activity },
        { name: 'Maintenance', href: '/admin/system/maintenance', icon: Settings },
      ]
    },

    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Documents', href: '/admin/documents', icon: FileText },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  const accountSection = [
    { name: 'Admin Profile', href: '/admin/profile', icon: User },
    { name: 'Security Settings', href: '/admin/account/security', icon: Shield },
    { name: 'Preferences', href: '/admin/account/preferences', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
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
            <h2 className="text-lg font-bold text-gray-900">Admin Portal</h2>
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

        {/* Admin Sidebar */}
        <div className={`
          fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-80 bg-white border-r transform transition-transform duration-200 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h2 className="text-xl font-bold">Admin Portal</h2>
            <p className="text-indigo-100 text-sm mt-1">Platform Administration</p>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 pb-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                if (item.isDropdown) {
                  const isExpanded = item.name === 'Users' ? usersOpen :
                                   item.name === 'Security' ? securityOpen :
                                   item.name === 'System' ? systemOpen : false;
                  const setExpanded = item.name === 'Users' ? setUsersOpen :
                                     item.name === 'Security' ? setSecurityOpen :
                                     item.name === 'System' ? setSystemOpen : () => {};
                  
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => setExpanded(!isExpanded)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          isDropdownActive(item.subItems || [])
                            ? 'bg-indigo-50 text-indigo-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon 
                            className={`mr-3 ${isDropdownActive(item.subItems || []) ? 'text-indigo-700' : 'text-gray-500'}`} 
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
                                      ? 'bg-indigo-50 text-indigo-700 font-medium' 
                                      : 'text-gray-600 hover:bg-gray-100'
                                    }
                                  `}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <subItem.icon 
                                    className={`mr-2 ${subActive ? 'text-indigo-700' : 'text-gray-400'}`} 
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
                          ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm border border-indigo-100' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon 
                        className={`mr-3 ${active ? 'text-indigo-700' : 'text-gray-500'}`} 
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
                            ? 'bg-indigo-50 text-indigo-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon 
                          className={`mr-3 ${active ? 'text-indigo-700' : 'text-gray-500'}`} 
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

          {/* Admin Access Banner */}
          <div className="mt-8 mx-4 p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
            <div className="flex items-center mb-2">
              <Shield className="text-red-600 mr-2" size={20} />
              <span className="font-semibold text-red-900">Admin Access</span>
            </div>
            <p className="text-sm text-red-700 mb-3">
              Enterprise platform administration
            </p>
            <div className="text-xs text-red-600 font-medium">
              Users • Security • System • Analytics
            </div>
          </div>
        </div>
        
        {/* Main content area with proper spacing */}
        <div className="md:ml-80">
          {/* User Profile Banner */}
          <div className="bg-white border-b shadow-sm px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                  <Shield size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Admin Portal</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Platform Administration</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Admin
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
                  href="/admin/settings"
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