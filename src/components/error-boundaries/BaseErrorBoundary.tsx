'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';

/**
 * Error types for categorization and handling
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  AUTHENTICATION = 'AUTHENTICATION',
  PAYMENT = 'PAYMENT',
  FORM_VALIDATION = 'FORM_VALIDATION',
  REAL_TIME = 'REAL_TIME',
  THIRD_PARTY = 'THIRD_PARTY',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Recovery action configuration
 */
export interface RecoveryAction {
  id: string;
  label: string;
  action: () => void;
  icon?: React.ComponentType<any>;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  enabled: boolean;
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
}

/**
 * Error reporting configuration
 */
export interface ReportingConfig {
  enabled: boolean;
  includeUserContext: boolean;
  includeErrorStack: boolean;
  customTags?: Record<string, string>;
}

/**
 * Error boundary configuration
 */
export interface ErrorBoundaryConfig {
  name: string;
  errorTypes: ErrorType[];
  severity: ErrorSeverity;
  fallbackTitle?: string;
  fallbackMessage?: string;
  showDetails?: boolean;
  retryConfig?: RetryConfig;
  reportingConfig?: ReportingConfig;
  recoveryActions?: RecoveryAction[];
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  errorId: string;
}

/**
 * Enhanced error information
 */
interface EnhancedError {
  originalError: Error;
  errorType: ErrorType;
  severity: ErrorSeverity;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
}

/**
 * Props for the BaseErrorBoundary component
 */
interface BaseErrorBoundaryProps {
  children: ReactNode;
  config: ErrorBoundaryConfig;
  fallbackComponent?: React.ComponentType<ErrorFallbackProps>;
}

/**
 * Props for error fallback components
 */
export interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  config: ErrorBoundaryConfig;
  retryCount: number;
  onRetry: () => void;
  onReset: () => void;
  recoveryActions: RecoveryAction[];
}

/**
 * Base Error Boundary Component
 * 
 * Comprehensive error boundary with configurable error handling,
 * retry mechanisms, and error reporting capabilities
 */
export class BaseErrorBoundary extends Component<BaseErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimer: NodeJS.Timeout | null = null;

  constructor(props: BaseErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorId: this.generateErrorId()
    };
  }

  /**
   * Generate unique error ID for tracking
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Determine error type from error object
   */
  private determineErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK;
    }
    
    if (message.includes('api') || message.includes('request')) {
      return ErrorType.API;
    }
    
    if (message.includes('auth') || message.includes('unauthorized')) {
      return ErrorType.AUTHENTICATION;
    }
    
    if (message.includes('payment') || message.includes('transaction')) {
      return ErrorType.PAYMENT;
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.FORM_VALIDATION;
    }
    
    if (message.includes('websocket') || message.includes('socket')) {
      return ErrorType.REAL_TIME;
    }
    
    return ErrorType.UNKNOWN;
  }

  /**
   * Create enhanced error object with additional context
   */
  private createEnhancedError(error: Error): EnhancedError {
    return {
      originalError: error,
      errorType: this.determineErrorType(error),
      severity: this.props.config.severity,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    };
  }

  /**
   * Get user ID from context or storage
   */
  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch {
      // Ignore parsing errors
    }
    
    return undefined;
  }

  /**
   * Get session ID from storage
   */
  private getSessionId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    try {
      return sessionStorage.getItem('sessionId') || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Report error to monitoring services
   */
  private reportError(enhancedError: EnhancedError, errorInfo: ErrorInfo): void {
    const { reportingConfig } = this.props.config;
    
    if (!reportingConfig?.enabled) {
      return;
    }

    const errorReport = {
      errorId: this.state.errorId,
      message: enhancedError.originalError.message,
      stack: reportingConfig.includeErrorStack ? enhancedError.originalError.stack : undefined,
      errorType: enhancedError.errorType,
      severity: enhancedError.severity,
      timestamp: enhancedError.timestamp,
      boundaryName: this.props.config.name,
      userContext: reportingConfig.includeUserContext ? {
        userId: enhancedError.userId,
        sessionId: enhancedError.sessionId,
        userAgent: enhancedError.userAgent,
        url: enhancedError.url
      } : undefined,
      componentStack: errorInfo.componentStack,
      customTags: reportingConfig.customTags
    };

    // Log to console for development
    console.error(`[${this.props.config.name}] Error caught:`, errorReport);

    // Report to external services (Sentry, etc.)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(enhancedError.originalError, {
        tags: {
          errorBoundary: this.props.config.name,
          errorType: enhancedError.errorType,
          severity: enhancedError.severity,
          ...reportingConfig.customTags
        },
        extra: errorReport
      });
    }
  }

  /**
   * Handle error caught by boundary
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Handle error after state update
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const enhancedError = this.createEnhancedError(error);
    
    this.setState({
      errorInfo
    });

    // Report error
    this.reportError(enhancedError, errorInfo);

    // Call custom error handler
    if (this.props.config.onError) {
      this.props.config.onError(error, errorInfo);
    }
  }

  /**
   * Retry the failed operation
   */
  private handleRetry = (): void => {
    const { retryConfig } = this.props.config;
    
    if (!retryConfig?.enabled) {
      return;
    }

    const { maxRetries, retryDelay, exponentialBackoff } = retryConfig;
    
    if (this.state.retryCount >= maxRetries) {
      console.warn(`Max retries (${maxRetries}) reached for ${this.props.config.name}`);
      return;
    }

    const delay = exponentialBackoff 
      ? retryDelay * Math.pow(2, this.state.retryCount)
      : retryDelay;

    this.retryTimer = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }, delay);
  };

  /**
   * Reset error boundary state
   */
  private handleReset = (): void => {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorId: this.generateErrorId()
    });
  };

  /**
   * Cleanup timers on unmount
   */
  componentWillUnmount(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  /**
   * Get default recovery actions
   */
  private getDefaultRecoveryActions(): RecoveryAction[] {
    const actions: RecoveryAction[] = [];

    // Retry action (if enabled)
    const { retryConfig } = this.props.config;
    if (retryConfig?.enabled && this.state.retryCount < retryConfig.maxRetries) {
      actions.push({
        id: 'retry',
        label: `Retry ${this.state.retryCount > 0 ? `(${this.state.retryCount}/${retryConfig.maxRetries})` : ''}`,
        action: this.handleRetry,
        icon: RefreshCw,
        variant: 'primary'
      });
    }

    // Reset action
    actions.push({
      id: 'reset',
      label: 'Reset',
      action: this.handleReset,
      icon: RefreshCw,
      variant: 'secondary'
    });

    // Go home action
    actions.push({
      id: 'home',
      label: 'Go Home',
      action: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
      icon: Home,
      variant: 'secondary'
    });

    return actions;
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const { config, fallbackComponent: FallbackComponent } = this.props;
      const { error, errorInfo, retryCount } = this.state;

      if (!error) {
        return null;
      }

      const recoveryActions = [
        ...(config.recoveryActions || []),
        ...this.getDefaultRecoveryActions()
      ];

      // Use custom fallback component if provided
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            config={config}
            retryCount={retryCount}
            onRetry={this.handleRetry}
            onReset={this.handleReset}
            recoveryActions={recoveryActions}
          />
        );
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          config={config}
          retryCount={retryCount}
          onRetry={this.handleRetry}
          onReset={this.handleReset}
          recoveryActions={recoveryActions}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  config,
  retryCount,
  recoveryActions
}) => {
  const getSeverityColor = (severity: ErrorSeverity): string => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'border-yellow-200 bg-yellow-50';
      case ErrorSeverity.MEDIUM:
        return 'border-orange-200 bg-orange-50';
      case ErrorSeverity.HIGH:
        return 'border-red-200 bg-red-50';
      case ErrorSeverity.CRITICAL:
        return 'border-red-500 bg-red-100';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityTextColor = (severity: ErrorSeverity): string => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'text-yellow-800';
      case ErrorSeverity.MEDIUM:
        return 'text-orange-800';
      case ErrorSeverity.HIGH:
        return 'text-red-800';
      case ErrorSeverity.CRITICAL:
        return 'text-red-900';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-6 m-4 ${getSeverityColor(config.severity)}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className={`h-6 w-6 ${getSeverityTextColor(config.severity)}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-lg font-medium ${getSeverityTextColor(config.severity)}`}>
            {config.fallbackTitle || 'Something went wrong'}
          </h3>
          <div className={`mt-2 text-sm ${getSeverityTextColor(config.severity)}`}>
            <p>
              {config.fallbackMessage || 
                'We encountered an unexpected error. Please try again or contact support if the problem persists.'}
            </p>
            {retryCount > 0 && (
              <p className="mt-1 text-xs opacity-75">
                Retry attempt: {retryCount}
              </p>
            )}
          </div>
          
          {config.showDetails && (
            <details className="mt-4">
              <summary className={`cursor-pointer text-sm font-medium ${getSeverityTextColor(config.severity)}`}>
                Technical Details
              </summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                {error.message}
              </pre>
            </details>
          )}

          {recoveryActions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {recoveryActions.map((action) => {
                const Icon = action.icon;
                const baseClasses = "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
                const variantClasses = {
                  primary: "bg-blue-600 text-white hover:bg-blue-700",
                  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
                  danger: "bg-red-600 text-white hover:bg-red-700"
                };

                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`${baseClasses} ${variantClasses[action.variant || 'secondary']}`}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseErrorBoundary;