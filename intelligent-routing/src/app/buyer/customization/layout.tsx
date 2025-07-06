'use client';

// src/app/buyer/customization/layout.tsx
import React from 'react';
import { CustomizationProvider } from '../../../context/CustomizationContext';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Toaster } from "sonner";
import { AlertTriangle } from 'lucide-react';

// Create a client inside the component to avoid shared state issues
// This avoids React hydration errors with "ReactCurrentOwner"

// Error fallback component with proper typing
const ErrorFallback = ({ error }: FallbackProps) => (
  <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[50vh]">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full">
      <div className="flex items-center mb-4">
        <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
        <h2 className="text-xl font-semibold text-red-800">Something went wrong</h2>
      </div>
      <p className="text-red-600 mb-4">
        We encountered an error loading the customization interface.
      </p>
      <div className="bg-red-100 p-3 rounded text-sm font-mono text-red-800 mb-4 overflow-auto max-h-32">
        {error.message}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Reload Page
      </button>
    </div>
  </div>
);

import { FallbackCustomizationLayout } from './fallback-layout';

export default function CustomizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only wrap with CustomizationProvider, ErrorBoundary, and Toaster
  try {
    return (
      <CustomizationProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {children}
        </ErrorBoundary>
        <Toaster position="top-right" />
      </CustomizationProvider>
    );
  } catch (renderError) {
    console.error("Fatal render error in layout:", renderError);
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border border-red-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-2">Critical Error</h2>
          <p className="mb-4">Unable to load the customization interface due to a critical error.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}