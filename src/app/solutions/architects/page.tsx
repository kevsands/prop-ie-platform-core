import React from 'react';
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArchitectsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new property professionals page
    router.replace('/solutions/property-professionals');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
        <p className="text-gray-600">Taking you to our Property Professionals solutions page</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5273] mx-auto"></div>
        </div>
      </div>
    </div>
  );
}