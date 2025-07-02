'use client';

import React, { ReactNode } from 'react';
import { Wifi, WifiOff, Server, ShieldAlert, Clock } from 'lucide-react';
import { 
  BaseErrorBoundary, 
  ErrorType, 
  ErrorSeverity, 
  ErrorBoundaryConfig,
  RecoveryAction,
  ErrorFallbackProps 
} from './BaseErrorBoundary';

/**
 * API Error types for specific handling
 */
export enum APIErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_API_ERROR = 'UNKNOWN_API_ERROR'
}

/**
 * HTTP status code ranges
 */
const HTTP_STATUS = {
  CLIENT_ERROR: { min: 400, max: 499 },
  SERVER_ERROR: { min: 500, max: 599 },
  TIMEOUT: 408,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429
} as const;

/**
 * Configuration for API Error Boundary
 */
interface APIErrorBoundaryConfig {
  name?: string;
  endpoint?: string;
  retryEnabled?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  showTechnicalDetails?: boolean;
  onNetworkError?: () => void;
  onAuthError?: () => void;
  onServerError?: () => void;
  customErrorMessages?: Record<APIErrorType, string>;
}

interface APIErrorBoundaryProps {
  children: ReactNode;
  config?: APIErrorBoundaryConfig;
}

/**
 * API Error Boundary Component
 * 
 * Specialized error boundary for handling API-related errors with
 * intelligent retry mechanisms and user-friendly messaging
 */
export const APIErrorBoundary: React.FC<APIErrorBoundaryProps> = ({ 
  children, 
  config = {} 
}) => {
  /**
   * Determine API error type from error message/details
   */
  const determineAPIErrorType = (error: Error): APIErrorType => {
    const message = error.message.toLowerCase();
    
    // Check for specific error patterns
    if (message.includes('network') || message.includes('fetch failed')) {
      return APIErrorType.NETWORK_ERROR;
    }
    
    if (message.includes('timeout') || message.includes('abort')) {
      return APIErrorType.TIMEOUT_ERROR;
    }
    
    if (message.includes('unauthorized') || message.includes('401')) {
      return APIErrorType.AUTHENTICATION_ERROR;
    }
    
    if (message.includes('rate limit') || message.includes('429')) {
      return APIErrorType.RATE_LIMIT_ERROR;
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return APIErrorType.NOT_FOUND_ERROR;
    }
    
    if (message.includes('validation') || message.includes('400')) {
      return APIErrorType.VALIDATION_ERROR;
    }
    
    if (message.includes('server') || message.includes('5')) {
      return APIErrorType.SERVER_ERROR;
    }
    
    return APIErrorType.UNKNOWN_API_ERROR;
  };

  /**
   * Get user-friendly error message based on error type
   */
  const getErrorMessage = (errorType: APIErrorType): string => {
    const customMessages = config.customErrorMessages || {};
    
    if (customMessages[errorType]) {
      return customMessages[errorType];
    }
    
    switch (errorType) {
      case APIErrorType.NETWORK_ERROR:
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      
      case APIErrorType.TIMEOUT_ERROR:
        return 'The request took too long to complete. Please try again.';
      
      case APIErrorType.SERVER_ERROR:
        return 'We\'re experiencing technical difficulties. Our team has been notified and is working to resolve this.';
      
      case APIErrorType.AUTHENTICATION_ERROR:
        return 'Your session has expired. Please log in again to continue.';
      
      case APIErrorType.RATE_LIMIT_ERROR:
        return 'Too many requests. Please wait a moment and try again.';
      
      case APIErrorType.NOT_FOUND_ERROR:
        return 'The requested information could not be found. It may have been moved or deleted.';
      
      case APIErrorType.VALIDATION_ERROR:
        return 'There was an issue with the submitted data. Please check your input and try again.';
      
      default:
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }
  };

  /**
   * Get error severity based on error type
   */
  const getErrorSeverity = (errorType: APIErrorType): ErrorSeverity => {
    switch (errorType) {
      case APIErrorType.AUTHENTICATION_ERROR:
        return ErrorSeverity.HIGH;
      
      case APIErrorType.SERVER_ERROR:
        return ErrorSeverity.CRITICAL;
      
      case APIErrorType.NETWORK_ERROR:
      case APIErrorType.TIMEOUT_ERROR:
        return ErrorSeverity.MEDIUM;
      
      case APIErrorType.RATE_LIMIT_ERROR:
      case APIErrorType.VALIDATION_ERROR:
        return ErrorSeverity.LOW;
      
      default:
        return ErrorSeverity.MEDIUM;
    }
  };

  /**
   * Get recovery actions based on error type
   */
  const getRecoveryActions = (errorType: APIErrorType): RecoveryAction[] => {
    const actions: RecoveryAction[] = [];
    
    switch (errorType) {
      case APIErrorType.NETWORK_ERROR:
        actions.push({
          id: 'check-connection',
          label: 'Check Connection',
          action: () => {
            if (config.onNetworkError) {
              config.onNetworkError();
            } else {
              // Open network settings or reload page
              window.location.reload();
            }
          },
          icon: WifiOff,
          variant: 'primary'
        });
        break;
      
      case APIErrorType.AUTHENTICATION_ERROR:
        actions.push({
          id: 'login',
          label: 'Log In Again',
          action: () => {
            if (config.onAuthError) {
              config.onAuthError();
            } else {
              window.location.href = '/login';
            }
          },
          icon: ShieldAlert,
          variant: 'primary'
        });
        break;
      
      case APIErrorType.SERVER_ERROR:
        actions.push({
          id: 'contact-support',
          label: 'Contact Support',
          action: () => {
            if (config.onServerError) {
              config.onServerError();
            } else {
              window.open('mailto:support@prop.ie?subject=Server Error Report', '_blank');
            }
          },
          icon: Server,
          variant: 'secondary'
        });
        break;
      
      case APIErrorType.RATE_LIMIT_ERROR:
        actions.push({
          id: 'wait',
          label: 'Wait and Retry',
          action: () => {
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          },
          icon: Clock,
          variant: 'primary'
        });
        break;
    }
    
    return actions;
  };

  /**
   * Create error boundary configuration
   */
  const createConfig = (error: Error): ErrorBoundaryConfig => {
    const apiErrorType = determineAPIErrorType(error);
    const severity = getErrorSeverity(apiErrorType);
    const recoveryActions = getRecoveryActions(apiErrorType);
    
    return {
      name: config.name || 'API Error Boundary',
      errorTypes: [ErrorType.API, ErrorType.NETWORK],
      severity,
      fallbackTitle: 'Connection Issue',
      fallbackMessage: getErrorMessage(apiErrorType),
      showDetails: config.showTechnicalDetails || false,
      retryConfig: {
        enabled: config.retryEnabled ?? true,
        maxRetries: config.maxRetries ?? 3,
        retryDelay: config.retryDelay ?? 1000,
        exponentialBackoff: true
      },
      reportingConfig: {
        enabled: true,
        includeUserContext: true,
        includeErrorStack: true,
        customTags: {
          boundaryType: 'api',
          endpoint: config.endpoint || 'unknown',
          apiErrorType
        }
      },
      recoveryActions,
      onError: (error, errorInfo) => {
        // Log specific API error details
        console.error(`[API Error Boundary] ${config.endpoint || 'Unknown endpoint'} failed:`, {
          error: error.message,
          apiErrorType,
          severity,
          componentStack: errorInfo.componentStack
        });
      }
    };
  };

  /**
   * Custom fallback component for API errors
   */
  const APIErrorFallback: React.FC<ErrorFallbackProps> = (props) => {
    const { error, config: boundaryConfig, recoveryActions } = props;
    const apiErrorType = determineAPIErrorType(error);
    
    const getErrorIcon = () => {
      switch (apiErrorType) {
        case APIErrorType.NETWORK_ERROR:
          return WifiOff;
        case APIErrorType.AUTHENTICATION_ERROR:
          return ShieldAlert;
        case APIErrorType.SERVER_ERROR:
          return Server;
        case APIErrorType.TIMEOUT_ERROR:
          return Clock;
        default:
          return Wifi;
      }
    };
    
    const ErrorIcon = getErrorIcon();
    
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <ErrorIcon className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
          {boundaryConfig.fallbackTitle}
        </h3>
        
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {boundaryConfig.fallbackMessage}
        </p>
        
        {config.endpoint && (
          <p className="text-sm text-gray-500 mb-4">
            Endpoint: {config.endpoint}
          </p>
        )}
        
        {recoveryActions.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center">
            {recoveryActions.map((action) => {
              const Icon = action.icon;
              const baseClasses = "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
              const variantClasses = {
                primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
                secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
                danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
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
    );
  };

  return (
    <BaseErrorBoundary 
      config={createConfig(new Error('placeholder'))}
      fallbackComponent={APIErrorFallback}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default APIErrorBoundary;