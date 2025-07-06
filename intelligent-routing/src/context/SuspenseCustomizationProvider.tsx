'use client';

import React, { Suspense } from 'react';
import { CustomizationProvider } from './CustomizationContext';

// Loading component for customization context
function CustomizationLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-xl font-semibold text-gray-700">
        Loading customization options...
      </div>
    </div>
  );
}

// Wrapper component that adds Suspense boundary
export function SuspenseCustomizationProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<CustomizationLoading />}>
      <CustomizationProvider>
        {children}
      </CustomizationProvider>
    </Suspense>
  );
}