/**
 * Error Boundary Components Export Index
 * 
 * Centralized exports for all error boundary components
 * and related types for easy importing throughout the application
 */

// Base Error Boundary
export { 
  BaseErrorBoundary,
  ErrorType,
  ErrorSeverity,
  type ErrorBoundaryConfig,
  type RecoveryAction,
  type RetryConfig,
  type ReportingConfig,
  type ErrorFallbackProps
} from './BaseErrorBoundary';

// Specialized Error Boundaries
export { 
  APIErrorBoundary,
  APIErrorType,
  type APIErrorBoundaryConfig
} from './APIErrorBoundary';

export { 
  FormErrorBoundary,
  FormErrorType,
  type FormErrorBoundaryConfig
} from './FormErrorBoundary';

export { 
  PaymentErrorBoundary,
  PaymentErrorType,
  type PaymentErrorBoundaryConfig
} from './PaymentErrorBoundary';

// Re-export types for convenience
export type {
  ErrorBoundaryConfig as BaseErrorBoundaryConfig,
  RecoveryAction as ErrorRecoveryAction,
  RetryConfig as ErrorRetryConfig,
  ReportingConfig as ErrorReportingConfig
} from './BaseErrorBoundary';

/**
 * Error Boundary Configuration Presets
 * 
 * Pre-configured settings for common error boundary use cases
 */

// API Error Boundary configuration preset
export const createAPIErrorBoundaryConfig = (endpoint?: string, customConfig?: any) => ({
  endpoint,
  retryEnabled: true,
  maxRetries: 3,
  showTechnicalDetails: process.env.NODE_ENV === 'development',
  ...customConfig
});

// Form Error Boundary configuration preset
export const createFormErrorBoundaryConfig = (formName: string, formId?: string) => ({
  name: `Form Error Boundary - ${formName}`,
  formContext: {
    formName,
    formId: formId || formName.toLowerCase().replace(/\s+/g, '_')
  },
  enableAutoSave: true,
  retryEnabled: true,
  maxRetries: 2
});

// Payment Error Boundary configuration preset
export const createPaymentErrorBoundaryConfig = (transactionId?: string) => ({
  name: 'Payment Error Boundary',
  paymentContext: {
    transactionId
  },
  enableRetry: false, // Payments should not auto-retry
  supportContact: {
    phone: '+353-1-XXX-XXXX',
    email: 'support@prop.ie'
  }
});

/**
 * Error Boundary Utility Functions
 */

/**
 * Check if an error should be caught by a specific boundary type
 */
export const shouldCatchError = (error: Error, boundaryType: ErrorType): boolean => {
  const message = error.message.toLowerCase();
  
  switch (boundaryType) {
    case ErrorType.API:
    case ErrorType.NETWORK:
      return message.includes('fetch') || 
             message.includes('network') || 
             message.includes('api') ||
             message.includes('timeout');
    
    case ErrorType.PAYMENT:
      return message.includes('payment') ||
             message.includes('transaction') ||
             message.includes('card') ||
             message.includes('billing');
    
    case ErrorType.FORM_VALIDATION:
      return message.includes('validation') ||
             message.includes('form') ||
             message.includes('input') ||
             message.includes('required');
    
    case ErrorType.AUTHENTICATION:
      return message.includes('auth') ||
             message.includes('login') ||
             message.includes('unauthorized') ||
             message.includes('session');
    
    default:
      return true;
  }
};

/**
 * Generate error report for monitoring services
 */
export const generateErrorReport = (
  error: Error, 
  boundaryName: string, 
  context?: Record<string, any>
) => {
  return {
    errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message: error.message,
    stack: error.stack,
    boundaryName,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
    context: context || {}
  };
};

/**
 * Default error boundary configurations for common use cases
 */
export const defaultConfigs = {
  api: {
    retryEnabled: true,
    maxRetries: 3,
    retryDelay: 1000,
    showTechnicalDetails: false
  },
  
  form: {
    enableAutoSave: true,
    retryEnabled: true,
    maxRetries: 2,
    autoSaveInterval: 30000
  },
  
  payment: {
    enableRetry: false,
    maxRetries: 0,
    showTechnicalDetails: false,
    supportContact: {
      phone: '+353-1-XXX-XXXX',
      email: 'support@prop.ie'
    }
  },
  
  general: {
    retryEnabled: true,
    maxRetries: 1,
    retryDelay: 2000,
    showTechnicalDetails: process.env.NODE_ENV === 'development'
  }
} as const;