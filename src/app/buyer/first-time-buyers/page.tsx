/**
 * First-Time Buyers Main Page
 * 
 * This is the main landing page for first-time buyers linked from the homepage.
 * It redirects to the welcome page which has the comprehensive onboarding experience.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FirstTimeBuyersPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the comprehensive welcome page for first-time buyers
    router.replace('/buyer/first-time-buyers/welcome');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B5273] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your first-time buyer journey...</p>
      </div>
    </div>
  );
}