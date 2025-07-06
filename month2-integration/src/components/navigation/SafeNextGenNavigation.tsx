"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with error handling
const NextGenNavigation = dynamic(
  () => import('./NextGenNavigation').then(mod => mod.NextGenNavigation || mod.default),
  {
    loading: () => (
      <div className="h-20 bg-white shadow-sm flex items-center justify-center">
        <p className="text-gray-500">Loading navigation...</p>
      </div>
    ),
    ssr: false // Disable SSR for now to avoid hydration issues
  }
);

export default function SafeNextGenNavigation() {
  return (
    <React.Suspense fallback={
      <div className="h-20 bg-white shadow-sm flex items-center justify-center">
        <p className="text-gray-500">Loading navigation...</p>
      </div>
    }>
      <NextGenNavigation />
    </React.Suspense>
  );
}