// src/app/buyer/htb/HTBErrorBoundary.tsx
"use client";

import React from "react";

interface HTBErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface HTBErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * A specialized error boundary for HTB-related errors.
 */
export class HTBErrorBoundary extends React.Component<HTBErrorBoundaryProps, HTBErrorBoundaryState> {
  // We only need to define state explicitly - props is handled by React.Component
  readonly state: HTBErrorBoundaryState = { hasError: false };

  constructor(props: HTBErrorBoundaryProps) {
    super(props);
    // State is now initialized directly in the property declaration above
  }

  static getDerivedStateFromError(error: Error): HTBErrorBoundaryState {
    // Check if error is related to HTB context
    if (error.message.includes("useHTB") || error.message.includes("HTBContext")) {
      return { hasError: true, error };
    }
    // Otherwise, let the error propagate to parent error boundaries
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log only HTB-related errors
    if (error.message.includes("useHTB") || error.message.includes("HTBContext")) {

    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Either use the provided fallback or a default one
      return this.props.fallback || (
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md my-4">
          <h3 className="text-lg font-medium text-yellow-800">Help-to-Buy functionality issue</h3>
          <p className="mt-2 text-sm text-yellow-700">
            There was an issue loading the Help-to-Buy functionality. This is likely due to a missing configuration.
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
