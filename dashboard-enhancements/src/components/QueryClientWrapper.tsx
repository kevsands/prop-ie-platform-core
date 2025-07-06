'use client';

import React from 'react';

// Mock implementation for build testing
interface QueryClientWrapperProps {
  children: React.ReactNode;
}

export function QueryClientWrapper({ children }: QueryClientWrapperProps) {
  return (
    <>
      <div className="bg-amber-50 p-3 mb-2 rounded text-amber-800 text-sm">
        <div className="font-medium">Simplified QueryClientWrapper</div>
        <div>This is a simplified version for build testing. No actual query client is provided.</div>
      </div>
      {children}
    </>
  );
}

export default QueryClientWrapper;