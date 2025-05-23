'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * MainNavigation - Shared navigation component to be used across all pages
 * 
 * @param {Object} props - Component props
 * @param {string} props.theme - 'light' for light background pages, 'dark' for dark background pages (like hero sections)
 * @param {boolean} props.isTransparent - Whether the navigation should be transparent (typically for hero sections)
 */
export default function MainNavigation({ theme = 'light', isTransparent = false }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine background styles based on theme, transparency, and scroll state
  const getNavBackgroundStyles = () => {
    if (isScrolled) {
      return 'bg-white shadow-md';
    }

    if (isTransparent) {
      return 'bg-transparent';
    }

    return theme === 'light' ? 'bg-white' : 'bg-gray-900';
  };

  // Determine text color based on theme, transparency, and scroll state
  const getTextColorStyles = () => {
    if (isScrolled) {
      return 'text-gray-900';
    }

    return theme === 'light' || !isTransparent ? 'text-gray-900' : 'text-white';
  };

  // Determine button styles based on theme
  const getButtonStyles = () => {
    if (isScrolled) {
      return 'bg-[#2B5273] text-white hover:bg-[#1E3142]';
    }

    if (theme === 'light' || !isTransparent) {
      return 'bg-[#2B5273] text-white hover:bg-[#1E3142]';
    }

    return 'bg-white text-[#2B5273] hover:bg-gray-100';
  };

  // Determine whether a nav item is active
  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${getNavBackgroundStyles()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex items-center">
            <Link 
              href="/" 
              className={`font-bold text-2xl ${getTextColorStyles()}`}
              aria-label="Prop.ie Home"
            >
              Prop.ie
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            <Link 
              href="/properties" 
              className={`${getTextColorStyles()} hover:text-[#2B5273] transition-colors ${isActive('/properties') ? 'font-semibold' : ''}`}
            >
              Properties
            </Link>
            <Link 
              href="/developments" 
              className={`${getTextColorStyles()} hover:text-[#2B5273] transition-colors ${isActive('/developments') ? 'font-semibold' : ''}`}
            >
              Developments
            </Link>
            <Link 
              href="/about" 
              className={`${getTextColorStyles()} hover:text-[#2B5273] transition-colors ${isActive('/about') ? 'font-semibold' : ''}`}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className={`${getTextColorStyles()} hover:text-[#2B5273] transition-colors ${isActive('/contact') ? 'font-semibold' : ''}`}
            >
              Contact
            </Link>
            <Link 
              href="/login" 
              className={`${getTextColorStyles()} hover:text-[#2B5273] transition-colors ${isActive('/login') ? 'font-semibold' : ''}`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`${getButtonStyles()} px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]`}
            >
              Register
            </Link>
          </nav>

          {/* Mobile Navigation Button */}
          <button
            type="button"
            className={`md:hidden ${getTextColorStyles()}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg overflow-hidden">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3" aria-label="Mobile Navigation">
            <Link
              href="/properties"
              className={`block px-3 py-2 rounded-md ${isActive('/properties') ? 'bg-gray-100 font-medium' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Properties
            </Link>
            <Link
              href="/developments"
              className={`block px-3 py-2 rounded-md ${isActive('/developments') ? 'bg-gray-100 font-medium' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Developments
            </Link>
            <Link
              href="/about"
              className={`block px-3 py-2 rounded-md ${isActive('/about') ? 'bg-gray-100 font-medium' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`block px-3 py-2 rounded-md ${isActive('/contact') ? 'bg-gray-100 font-medium' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/login"
              className={`block px-3 py-2 rounded-md ${isActive('/login') ? 'bg-gray-100 font-medium' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block px-3 py-2 bg-[#2B5273] text-white rounded-md transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}