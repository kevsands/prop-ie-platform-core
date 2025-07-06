'use client';

// src/components/htb/HTBErrorWrapper.tsx
"use client";

import React, { useState, useEffect } from "react";

type HTBErrorWrapperProps = {
  children: React.ReactNode;
};

/**
 * A functional wrapper that provides error handling for HTB components
 * This avoids TypeScript issues with class components
 */
export function HTBErrorWrapper({ children }: HTBErrorWrapperProps) {
  const [hasError, setHasError] = useState(false);
  
  // Reset error state on component mount
  useEffect(() => {
    setHasError(false);
  }, []);
  
  // Handle errors in a way that doesn't break the page
  if (hasError) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md my-4">
        <h3 className="text-lg font-medium text-yellow-800">Help-to-Buy functionality issue</h3>
        <p className="mt-2 text-sm text-yellow-700">
          There was an issue loading the Help-to-Buy functionality. This is likely due to a missing configuration.
          Please try refreshing the page or contact support if the issue persists.
        </p>
      </div>
    );
  }
  
  // Wrap children in error handling
  return (
    <React.Fragment>
      {/* Use error event handling on window as a fallback */}
      <ErrorEventHandler onError={() => setHasError(true)} />
      {children}
    </React.Fragment>
  );
}

// Helper component to listen for error events
function ErrorEventHandler({ onError }: { onError: () => void }) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error && 
          (String(event.error).includes('HTBContext') || 
           String(event.error).includes('useHTB'))) {
        onError();
        // Prevent the error from propagating further
        event.preventDefault();
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [onError]);
  
  return null;
}