'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EstateAgentsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the comprehensive agents platform
    router.push('/agents');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Redirecting to Agent Portal...</h2>
        <p className="text-gray-500">Please wait while we redirect you to the full agent platform.</p>
      </div>
    </div>
  );
}