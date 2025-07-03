'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
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
  const { user, isAuthenticated, isLoading, signOut } = useEnterpriseAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toolkitOpen, setToolkitOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [htbStatus, setHtbStatus] = useState<any>(null);

  // Load user notifications and HTB status
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
      loadHTBStatus();

      // Set up real-time polling for updates
      const notificationInterval = setInterval(loadNotifications, 30000); // Every 30 seconds
      const htbInterval = setInterval(loadHTBStatus, 60000); // Every minute

      return () => {
        clearInterval(notificationInterval);
        clearInterval(htbInterval);
      };
    }
  }, [isAuthenticated, user]);

  const loadNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/user/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadHTBStatus = async () => {
    try {
      const response = await fetch(`/api/htb/status/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setHtbStatus(data);
      }
    } catch (error) {
      console.error('Failed to load HTB status:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading state while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/login?redirect=/buyer';
    return null;
  }

  // Dynamic navigation based on user status and HTB eligibility
  const navigation = [
    { name: 'Welcome', href: '/buyer/first-time-buyers/welcome', icon: Sparkles, isNew: true },
    { name: 'Overview', href: '/buyer/overview', icon: Home },
    { name: 'My Journey', href: '/buyer/journey', icon: TrendingUp },
    { name: 'Live Availability', href: '/buyer/properties/availability', icon: Clock, isNew: true },
    { name: 'Prop Choice', href: '/buyer/prop-choice', icon: Sparkles },
    { name: 'Documents', href: '/buyer/documents', icon: FileText },
    { 
      name: 'Transaction Status', 
      href: '/buyer/transaction', 
      icon: Activity,
      badge: htbStatus?.pendingCompletion ? 'Completion Pending' : undefined
    },
    { name: 'Payments', href: '/buyer/payments', icon: Receipt },
    { name: 'Messages', href: '/buyer/messages', icon: MessageSquare },
    { name: 'Appointments', href: '/buyer/appointments', icon: Calendar },
    {
      name: 'My Toolkit',
      icon: Calculator,
      isDropdown: true,
      subItems: [
        { name: 'Affordability Calculator', href: '/buyer/calculator', icon: Calculator },
        { 
          name: 'HTB Calculator', 
          href: '/buyer/calculator/htb', 
          icon: Heart,
          badge: htbStatus?.eligible ? 'Eligible' : undefined
        },
        { name: 'Guides & Resources', href: '/buyer/guides', icon: BookOpen },
        { name: 'Checklists', href: '/buyer/checklists', icon: FileText },
      ]
    },
    { name: 'Profile', href: '/buyer/profile', icon: User },
  ];

  // Add HTB-specific navigation if user has active HTB claims
  if (htbStatus?.active) {
    navigation.splice(4, 0, {
      name: 'HTB Status',
      href: '/buyer/htb/status',
      icon: Heart,
      badge: htbStatus.status || 'Active'
    });
  }

  const profileSection = [
    { name: 'Verification', href: '/buyer/verification', icon: Shield },
    { name: 'Payment Methods', href: '/buyer/payment-methods', icon: CreditCard },
    { name: 'System Status', href: '/developer/system/integration-test', icon: Activity },
    { name: 'Settings', href: '/buyer/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/buyer') return pathname === '/buyer';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Profile Banner - Fixed position at top */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm px-6 py-5 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <User size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-900">
                {user?.name || user?.username || 'Buyer'}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">
                  {user?.role === 'buyer' ? 'First-time Buyer' : 'Property Buyer'}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  user?.emailVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user?.emailVerified ? 'Verified' : 'Pending Verification'}
                </span>
                {htbStatus?.active && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    HTB Active
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={loadNotifications}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell size={20} className="text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>
            <Link 
              href="/buyer/settings"
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings size={20} className="text-gray-600" />
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative">
        {/* Mobile header with proper spacing to avoid overlap */}
        <div className="fixed top-20 left-0 right-0 z-30 bg-white border-b md:hidden">
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
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed top-20 left-0 z-30 h-[calc(100vh-5rem)] w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
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
                                  {subItem.badge && (
                                    <span className="ml-auto bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                      {subItem.badge}
                                    </span>
                                  )}
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
                      {item.badge && !item.isNew && (
                        <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {active && !item.isNew && !item.badge && <ChevronRight className="ml-auto" size={16} />}
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

          {/* HTB Status Widget */}
          {htbStatus?.active && (
            <div className="mt-6 mx-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center mb-2">
                <Heart className="text-green-600 mr-2" size={18} />
                <span className="font-semibold text-green-900">HTB Status</span>
              </div>
              <p className="text-sm text-green-700 mb-2">
                Claim: {htbStatus.claimCode || 'Processing'}
              </p>
              <div className="text-xs text-green-600">
                Status: {htbStatus.status || 'Active'}
              </div>
              {htbStatus.nextAction && (
                <p className="text-xs text-green-600 mt-1">
                  Next: {htbStatus.nextAction}
                </p>
              )}
            </div>
          )}

          {/* Recent Notifications */}
          {notifications.length > 0 && (
            <div className="mt-6 mx-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
              <div className="flex items-center mb-2">
                <Bell className="text-amber-600 mr-2" size={18} />
                <span className="font-semibold text-amber-900">Updates</span>
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 2).map((notification, index) => (
                  <div key={index} className="text-xs text-amber-700 p-2 bg-amber-50 rounded border-l-2 border-amber-300">
                    {notification.title || notification.message}
                  </div>
                ))}
                {notifications.length > 2 && (
                  <div className="text-xs text-amber-600 font-medium">
                    +{notifications.length - 2} more updates
                  </div>
                )}
              </div>
            </div>
          )}

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
          {/* Page content with proper top padding for fixed banner */}
          <main className="p-4 md:p-6 pt-28 md:pt-24">
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