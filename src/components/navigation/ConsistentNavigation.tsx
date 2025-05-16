'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * ConsistentNavigation Component
 * 
 * A unified navigation component that provides consistent navigation across all pages.
 * Features:
 * - Fixed dark blue background
 * - Consistent branding
 * - Same menu items
 * - Login/register buttons
 * - Active page highlighting
 * - Mobile responsiveness
 */
export default function ConsistentNavigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  // Navigation links with their paths and labels
  const mainNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'Properties', path: '/properties' },
    { label: 'Developments', path: '/developments' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // Check if a link is active based on the current path
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="fixed w-full z-50 bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* Logo text or image */}
              <span className="text-xl font-bold">Prop</span>
            </Link>
            
            {/* Desktop menu */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-800 text-white'
                      : 'text-gray-200 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Authentication buttons */}
          <div className="flex items-center">
            {isLoading ? (
              <div className="h-4 w-20 bg-blue-800 rounded animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center">
                {/* User menu for authenticated users */}
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <Link
                      href="/dashboard"
                      className="mr-4 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-blue-800 hover:text-white rounded-md"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-blue-800 hover:text-white"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-blue-800 hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="ml-3 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}