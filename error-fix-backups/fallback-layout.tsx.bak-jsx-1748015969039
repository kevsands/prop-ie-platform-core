'use client';

import React from 'react';
import { Toaster } from "sonner";

/**
 * FallbackCustomizationLayout
 * 
 * A simplified layout that provides basic styling and structure
 * when the main layout encounters errors. This avoids complete UI breakdown.
 */
export function FallbackCustomizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-amber-700 text-sm">
            Warning: Using fallback layout due to an error in the customization interface.
            Some features may be limited.
          </p>
        </div>
        
        {children}
        
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default FallbackCustomizationLayout;