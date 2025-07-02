'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MortgageCalculatorRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the actual mortgage calculator page
    router.replace('/resources/calculators/mortgage-calculator');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B5273]"></div>
    </div>
  );
}