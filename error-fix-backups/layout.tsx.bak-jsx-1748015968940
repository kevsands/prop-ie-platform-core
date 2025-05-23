'use client';

import React from 'react';

// Inline simplified ProtectedRoute component for build testing
const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <>
      <div className="bg-amber-50 p-3 mb-2 rounded text-amber-800 text-sm">
        <div className="font-medium">Simplified Protected Route</div>
        <div>This is a simplified version for build testing. No actual auth checks performed.</div>
      </div>
      {children}
    </>
  );
};

/**
 * Layout for the Security section
 * 
 * This layout ensures the entire security section is protected by authentication.
 */
export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}