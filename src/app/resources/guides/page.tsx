'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResourcesGuidesRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the actual property guides page
    router.replace('/resources/property-guides');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B5273] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading property guides...</p>
      </div>
    </div>
  );
}