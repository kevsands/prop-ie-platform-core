'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfessionalInvestorsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the comprehensive investor platform
    router.push('/investor/dashboard');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Redirecting to Investor Platform...</h2>
        <p className="text-gray-500">Please wait while we redirect you to the full investor dashboard.</p>
      </div>
    </div>
  );
}