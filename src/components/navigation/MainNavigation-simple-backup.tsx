"use client";

import React from 'react';
import Link from 'next/link';
import ProfessionalBanner from './ProfessionalBanner';

interface MainNavigationProps {
  className?: string;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ className = '' }) => {
  return (
    <>
      <ProfessionalBanner />
      <nav className={`bg-white shadow-md ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">PROP.ie</span>
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/developments" className="text-gray-700 hover:text-blue-600">
                Developments
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainNavigation;