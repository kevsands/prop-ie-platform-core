'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToAnalytics() {
  const router = useRouter();

  useEffect(() => {
    router.push('/developer/analytics');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Redirecting...</h1>
        <p>Please wait while we redirect you to the developer analytics page.</p>
      </div>
    </div>
  );
}