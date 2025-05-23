'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Home, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SimpleWorkingNav() {
  const [activeDropdownsetActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#2B5273]">
              PropIE
            </Link>

            <div className="hidden md:flex ml-8 space-x-6">
              {/* Properties Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveDropdown('properties')}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900"
                >
                  Properties
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {activeDropdown === 'properties' && (
                  <div 
                    onMouseEnter={() => setActiveDropdown('properties')}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg p-4"
                  >
                    <Link href="/properties/search" className="block py-2 hover:text-blue-600">Search Properties</Link>
                    <Link href="/properties/buying-guide" className="block py-2 hover:text-blue-600">Buying Guide</Link>
                    <Link href="/developments/fitzgerald-gardens" className="block py-2 hover:text-blue-600">Fitzgerald Gardens</Link>
                  </div>
                )}
              </div>

              {/* Solutions Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveDropdown('solutions')}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900"
                >
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {activeDropdown === 'solutions' && (
                  <div 
                    onMouseEnter={() => setActiveDropdown('solutions')}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg p-4"
                  >
                    <Link href="/solutions/first-time-buyers" className="block py-2 hover:text-blue-600">First-Time Buyers</Link>
                    <Link href="/solutions/developers" className="block py-2 hover:text-blue-600">Developers</Link>
                    <Link href="/solutions/estate-agents" className="block py-2 hover:text-blue-600">Estate Agents</Link>
                  </div>
                )}
              </div>

              <Link href="/resources" className="px-3 py-2 text-gray-700 hover:text-gray-900">
                Resources
              </Link>

              <Link href="/contact" className="px-3 py-2 text-gray-700 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142]">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}