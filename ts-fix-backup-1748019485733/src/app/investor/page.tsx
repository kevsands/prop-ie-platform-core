'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InvestorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to investor dashboard
    router.push('/investor/dashboard');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Redirecting to Investor Dashboard...</h2>
        <p className="text-gray-500">Please wait while we redirect you to the investor dashboard.</p>
      </div>
    </div>
  );
}