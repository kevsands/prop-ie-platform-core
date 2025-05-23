'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Removed import for build testing;

// Simplified component definitions for build testing

// Mock auth context with complete User type
const useAuth = () => {
  return {
    user: { 
      id: 'mock-user-id', 
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'BUYER',
      name: 'John Doe',
      status: 'ACTIVE',
      onboardingComplete: true,
      mfaEnabled: false,
      emailVerified: true
    },
    isAuthenticated: true,
    login: async () => ({ success: true }),
    logout: async () => ({ success: true }),
    mfaEnabled: false
  };
};

/**
 * Dashboard sidebar navigation component
 * 
 * This is the default component for the @sidebar slot in the dashboard layout
 */
export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Define navigation items with paths and access control
  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: 'HomeIcon' },
    { label: 'Properties', path: '/dashboard/properties', icon: 'BuildingOfficeIcon' },
    { label: 'Documents', path: '/dashboard/documents', icon: 'DocumentTextIcon' },
    { label: 'Purchases', path: '/dashboard/purchases', icon: 'ShoppingCartIcon' },
    { label: 'Profile', path: '/dashboard/profile', icon: 'UserIcon' },
    { label: 'Security', path: '/dashboard/security', icon: 'ShieldCheckIcon' },
    { label: 'Settings', path: '/dashboard/settings', icon: 'CogIcon' },
  ];
  
  // Add role-specific items
  if (user?.role === 'developer') {
    navItems.push(
      { label: 'Projects', path: '/dashboard/projects', icon: 'BuildingLibraryIcon' },
      { label: 'Analytics', path: '/dashboard/analytics', icon: 'ChartBarIcon' }
    );
  }
  
  if (user?.role === 'admin') {
    navItems.push(
      { label: 'Users', path: '/dashboard/users', icon: 'UsersIcon' },
      { label: 'System', path: '/dashboard/system', icon: 'ServerIcon' }
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500">
          {user?.firstName ? `Welcome, ${user.firstName}` : 'Welcome'}
        </p>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center px-4 py-2 text-sm ${
                  pathname === item.path
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="inline-block w-5 h-5 mr-3">{/* Icon would go here */}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-3">
            {/* User avatar would go here */}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email || 'User'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role || 'User'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}