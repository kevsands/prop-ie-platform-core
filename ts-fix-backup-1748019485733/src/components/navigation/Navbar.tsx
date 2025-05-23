"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useInvestorMode } from '@/components/investor/InvestorModeContext';
import { FiHome, FiUsers, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi';
import { FeatherIcon } from '@/components/ui/feather-icon';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { investorMode, toggleInvestorMode } = useInvestorMode();

  return (
    <nav className={`bg-white shadow-md ${className || ''}`}>
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="transition-opacity duration-300 hover:opacity-80">
          <Image 
            src="/images/Prop Branding/Prop Master_Logo- White.png" 
            alt="Prop.ie" 
            width={120} 
            height={40}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link 
                href={user?.role === 'developer' ? '/developer' : 
                      user?.role === 'buyer' ? '/buyer' : 
                      user?.role === 'solicitor' ? '/solicitor' : 
                      '/buyer'}
                className="text-gray-600 hover:text-[#2B5273]"
              >
                Dashboard
              </Link>

              {user?.role === 'buyer' && (
                <Link 
                  href="/buyer/first-time-buyer"
                  className="text-gray-600 hover:text-[#2B5273]"
                >
                  First-Time Buyer
                </Link>
              )}

              {investorMode && (
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                  Investor Mode
                </span>
              )}
              {investorMode ? (
                <button 
                  onClick={toggleInvestorMode}
                  className="text-gray-600 hover:text-[#2B5273] text-sm"
                >
                  Developer View
                </button>
              ) : (
                <Link
                  href="/investor/dashboard"
                  className="text-gray-600 hover:text-[#2B5273] text-sm"
                  onClick={(e) => {
                    toggleInvestorMode();
                    // Let the link navigation happen naturally
                  }
                >
                  Investor View
                </Link>
              )}
              <button 
                onClick={signOut}
                className="text-gray-600 hover:text-[#2B5273]"
              >
                <FeatherIcon icon={FiLogOut} className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-[#2B5273]">
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-[#2B5273] text-white px-4 py-2 rounded hover:bg-[#1e3a50]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;