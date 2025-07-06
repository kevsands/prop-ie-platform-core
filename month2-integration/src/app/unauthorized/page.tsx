'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-2">
            Sorry, you don't have permission to access this page.
          </p>
          {user && (
            <p className="text-sm text-gray-500">
              Your current role is: <span className="font-medium">{user.role}</span>
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="block bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href="/dashboard"
            className="block border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          If you think this is a mistake, please{' '}
          <Link href="/contact" className="text-[#2B5273] hover:underline">
            contact support
          </Link>
        </p>
      </div>
    </div>
  );
}