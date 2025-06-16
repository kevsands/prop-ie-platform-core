'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BuyerRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new overview page
    router.replace('/buyer/overview');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
}