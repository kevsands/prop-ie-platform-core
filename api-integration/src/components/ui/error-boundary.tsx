'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from '@/components/ui/toast';
import { AlertCircle, RotateCcw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  showReset?: boolean;
  showHomeLink?: boolean;
  errorComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Component that catches JavaScript errors in its child component tree
 * 
 * @example
 * <ErrorBoundary>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 * 
 * @example
 * <ErrorBoundary 
 *   fallback={<CustomErrorComponent />}
 *   onError={(error) => logErrorToService(error)}
 * >
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Store error info for better debugging
    this.setState({ errorInfo });
    
    // Notify with toast
    toast.error({
      title: 'An error occurred',
      description: 'The application encountered an error. Please try again or refresh the page.',
    });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log the error to console
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // You could also log to an error monitoring service like Sentry here
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state when props change, if configured to do so
    if (
      this.state.hasError &&
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary(): void {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { 
      children, 
      fallback, 
      errorComponent: ErrorComponent,
      showReset = true,
      showHomeLink = true,
    } = this.props;

    if (hasError && error) {
      // Use custom error component if provided
      if (ErrorComponent) {
        return <ErrorComponent error={error} resetErrorBoundary={this.resetErrorBoundary} />;
      }

      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="p-6 mx-auto my-8 max-w-lg bg-red-50 border border-red-100 rounded-lg shadow-md">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An unexpected error occurred.
            </AlertDescription>
          </Alert>
          
          <div className="mb-4">
            <p className="text-red-800 font-medium mb-2">
              {error.name}: {error.message}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            {showReset && (
              <Button 
                onClick={this.resetErrorBoundary}
                variant="outline"
                className="flex items-center justify-center"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            )}
            
            {showHomeLink && (
              <Button 
                asChild
                variant="default"
                className="flex items-center justify-center"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return to home
                </Link>
              </Button>
            )}
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 p-2 bg-gray-100 rounded">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 flex items-center">
                <Bug className="mr-2 h-4 w-4" />
                Technical Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-800 text-white rounded">
                {error.stack}
                {this.state.errorInfo && (
                  <>
                    <hr className="my-2 border-gray-600" />
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return children;
  }
}

/**
 * withErrorBoundary - HOC that wraps a component with an ErrorBoundary
 * 
 * @example
 * const SafeComponent = withErrorBoundary(UnsafeComponent, {
 *   fallback: <p>Something went wrong</p>,
 *   onError: (error) => logError(error),
 * });
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ErrorBoundaryProps, 'children'> = {}
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  // Set display name for easier debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
}

export default ErrorBoundary;