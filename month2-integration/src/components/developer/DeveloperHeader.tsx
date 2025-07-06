'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Menu, 
  Bell, 
  Settings, 
  LogOut, 
  User
} from 'lucide-react';

/**
 * Simplified DeveloperHeader component for build testing
 */
interface DeveloperHeaderProps {
  onMenuClickAction: () => void;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
  };
}

export default function DeveloperHeader({ onMenuClickAction, user }: DeveloperHeaderProps) {
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : 'User';

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left section: Menu button and title */}
        <div className="flex items-center gap-4">
          <button 
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            onClick={onMenuClickAction}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </button>

          <div className="hidden sm:block">
            <span className="font-medium">Developer Dashboard</span>
          </div>
        </div>

        {/* Right section: User info and actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="p-2 rounded-md hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User className="h-5 w-5" />
              </div>
              <span className="hidden sm:block">{displayName}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-md shadow-md hidden group-hover:block p-1">
              <div className="p-2 border-b">
                <div className="font-medium">{displayName}</div>
                <div className="text-sm text-gray-500">{user?.email || 'user@example.com'}</div>
              </div>
              <Link href="/developer/settings" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-sm">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <Link href="/login" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-sm text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}