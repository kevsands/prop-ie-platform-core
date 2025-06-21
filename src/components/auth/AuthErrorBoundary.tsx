'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AuthError, AuthErrorCode } from '@/types/auth';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export default class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `auth_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for monitoring
    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      errorId: this.state.errorId
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Authentication Error Boundary caught an error:', errorDetails);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(error, { extra: errorDetails });
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: ''
    });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private getErrorMessage(error: Error): string {
    // Check if it's an AuthError
    if (error.name === 'AuthError' || (error as any).code) {
      const authError = error as any as AuthError;
      switch (authError.code) {
        case AuthErrorCode.NETWORK_ERROR:
          return 'Unable to connect to authentication server. Please check your internet connection.';
        case AuthErrorCode.SESSION_EXPIRED:
          return 'Your session has expired. Please sign in again.';
        case AuthErrorCode.USER_SUSPENDED:
          return 'Your account has been suspended. Please contact support.';
        case AuthErrorCode.INVALID_CREDENTIALS:
          return 'Authentication failed. Please verify your credentials.';
        default:
          return authError.message || 'An authentication error occurred.';
      }
    }

    // Generic error messages
    if (error.message.includes('fetch')) {
      return 'Network connection error. Please check your internet connection and try again.';
    }

    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication Error
              </h2>
              <p className="text-gray-600 mb-6">
                {this.getErrorMessage(this.state.error!)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-4">
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-[#2B5273] text-white py-3 px-4 rounded-lg hover:bg-[#1a3a52] transition-colors font-medium"
                >
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Reload Page
                </button>

                <div className="text-center">
                  <a
                    href="/auth/enterprise/login"
                    className="text-sm text-[#2B5273] hover:text-[#1a3a52] transition-colors"
                  >
                    Return to Login
                  </a>
                </div>
              </div>

              {/* Error details for development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 text-xs text-gray-600">
                    <p><strong>Error ID:</strong> {this.state.errorId}</p>
                    <p><strong>Name:</strong> {this.state.error.name}</p>
                    <p><strong>Message:</strong> {this.state.error.message}</p>
                    {this.state.error.stack && (
                      <pre className="mt-2 whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Support contact */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 mb-2">
                  Need help? Contact our support team
                </p>
                <div className="flex justify-center space-x-4 text-xs">
                  <a
                    href="mailto:support@prop.ie"
                    className="text-[#2B5273] hover:text-[#1a3a52] transition-colors"
                  >
                    support@prop.ie
                  </a>
                  <a
                    href="/support"
                    className="text-[#2B5273] hover:text-[#1a3a52] transition-colors"
                  >
                    Help Center
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}