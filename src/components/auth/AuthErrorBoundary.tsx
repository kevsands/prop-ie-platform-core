'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface AuthErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * AuthErrorBoundary - Specialized error boundary for auth-related components
 * 
 * Provides detailed error information and recovery options specific to 
 * authentication issues like token expiration, network failure, etc.
 */
class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Store errorInfo for better debugging
    this.setState({ errorInfo });

    // Log the error to console and potentially to monitoring service

    // You could also log to an error monitoring service like Sentry here
    // If configured - e.g. Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset(): void {
    // Clear any stored tokens that might be causing issues
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_state');
    }

    // Reset the error state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });

    // Call the parent-provided reset handler if available
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  /**
   * Analyze the error to provide a more user-friendly message
   */
  getErrorMessage(): string {
    const error = this.state.error;

    if (!error) return 'An unknown authentication error occurred';

    if (error.message.includes('token') && error.message.includes('expired')) {
      return 'Your session has expired. Please sign in again.';
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your internet connection.';
    }

    if (error.message.includes('permission') || error.message.includes('access')) {
      return 'Access denied. You may not have permission to view this content.';
    }

    return `Authentication error: ${error.message}`;
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto my-8 shadow-md">
          <div className="flex items-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-red-500 mr-3"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="text-lg font-semibold text-red-800">Authentication Error</h2>
          </div>

          <p className="mb-4 text-red-600">
            {this.getErrorMessage()}
          </p>

          <div className="flex flex-col space-y-2">
            <button
              onClick={this.handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>

            <a 
              href="/login"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-center transition-colors"
            >
              Return to Login
            </a>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-4 p-2 bg-gray-100 rounded">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Technical Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-800 text-white rounded">
                {this.state.error?.toString()}
                <br/>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;