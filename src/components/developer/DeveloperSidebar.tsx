'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building, 
  FileText, 
  Users, 
  Settings, 
  Home,
  MessageSquare
} from 'lucide-react';

/**
 * Simplified DeveloperSidebar component for build testing
 */
interface DeveloperSidebarProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function DeveloperSidebar({ isOpen, onCloseAction }: DeveloperSidebarProps) {
  const pathname = usePathname() || '/';

  // Main navigation items
  const navItems = [
    {
      name: 'Dashboard',
      href: '/developer',
      icon: LayoutDashboard,
      active: pathname === '/developer'
    },
    {
      name: 'Messages',
      href: '/developer/messages',
      icon: MessageSquare,
      active: pathname.startsWith('/developer/messages'),
      badge: 5 // Unread count
    },
    {
      name: 'Developments',
      href: '/developer/developments',
      icon: Building,
      active: pathname.startsWith('/developer/developments')
    },
    {
      name: 'Documents',
      href: '/developer/documents',
      icon: FileText,
      active: pathname.startsWith('/developer/documents')
    },
    {
      name: 'Help-to-Buy',
      href: '/developer/htb',
      icon: Home,
      active: pathname.startsWith('/developer/htb')
    },
    {
      name: 'Users',
      href: '/developer/users',
      icon: Users,
      active: pathname.startsWith('/developer/users')
    },
    {
      name: 'Settings',
      href: '/developer/settings',
      icon: Settings,
      active: pathname === '/developer/settings'
    }
  ];

  // If sidebar is closed on mobile, don't render content
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
        onClick={onCloseAction}
        aria-hidden="true"
      />
      
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto">
        <div className="flex flex-col h-full">
          {/* Logo and close button for mobile */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/developer" className="flex items-center space-x-2">
              <span className="text-xl font-semibold">Developer Portal</span>
            </Link>
            <button 
              className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
              onClick={onCloseAction}
              aria-label="Close sidebar"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                    item.active 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon 
                      className={`mr-3 h-5 w-5 ${item.active ? 'text-blue-700' : 'text-gray-500'}`} 
                    />
                    {item.name}
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}