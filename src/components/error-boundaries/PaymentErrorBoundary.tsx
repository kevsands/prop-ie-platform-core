'use client';

import React, { ReactNode } from 'react';
import { CreditCard, AlertTriangle, Shield, Clock, Phone, Mail } from 'lucide-react';
import { 
  BaseErrorBoundary, 
  ErrorType, 
  ErrorSeverity, 
  ErrorBoundaryConfig,
  RecoveryAction,
  ErrorFallbackProps 
} from './BaseErrorBoundary';

/**
 * Payment Error types for specific handling
 */
export enum PaymentErrorType {
  CARD_DECLINED = 'CARD_DECLINED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  EXPIRED_CARD = 'EXPIRED_CARD',
  INVALID_CARD = 'INVALID_CARD',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  PAYMENT_GATEWAY_ERROR = 'PAYMENT_GATEWAY_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  FRAUD_DETECTION = 'FRAUD_DETECTION',
  CURRENCY_ERROR = 'CURRENCY_ERROR',
  AMOUNT_ERROR = 'AMOUNT_ERROR',
  UNKNOWN_PAYMENT_ERROR = 'UNKNOWN_PAYMENT_ERROR'
}

/**
 * Payment context for error recovery
 */
interface PaymentContext {
  transactionId?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  propertyId?: string;
  developmentId?: string;
  buyerId?: string;
  attemptCount?: number;
  isDeposit?: boolean;
  isFinalPayment?: boolean;
}

/**
 * Configuration for Payment Error Boundary
 */
interface PaymentErrorBoundaryConfig {
  name?: string;
  paymentContext?: PaymentContext;
  enableRetry?: boolean;
  maxRetries?: number;
  supportContact?: {
    phone?: string;
    email?: string;
    chatUrl?: string;
  };
  onPaymentError?: (errorType: PaymentErrorType, context?: PaymentContext) => void;
  onTransactionFailure?: (transactionId: string, error: Error) => void;
  onFraudAlert?: (context: PaymentContext) => void;
  customErrorMessages?: Record<PaymentErrorType, string>;
}

interface PaymentErrorBoundaryProps {
  children: ReactNode;
  config?: PaymentErrorBoundaryConfig;
}

/**
 * Payment Error Boundary Component
 * 
 * Specialized error boundary for handling payment and transaction errors
 * with security-focused error handling and customer support integration
 */
export const PaymentErrorBoundary: React.FC<PaymentErrorBoundaryProps> = ({ 
  children, 
  config = {} 
}) => {
  /**
   * Determine payment error type from error message/details
   */
  const determinePaymentErrorType = (error: Error): PaymentErrorType => {
    const message = error.message.toLowerCase();
    
    // Check for specific error patterns
    if (message.includes('declined') || message.includes('card declined')) {
      return PaymentErrorType.CARD_DECLINED;
    }
    
    if (message.includes('insufficient') || message.includes('funds')) {
      return PaymentErrorType.INSUFFICIENT_FUNDS;
    }
    
    if (message.includes('expired') || message.includes('expiry')) {
      return PaymentErrorType.EXPIRED_CARD;
    }
    
    if (message.includes('invalid card') || message.includes('card number')) {
      return PaymentErrorType.INVALID_CARD;
    }
    
    if (message.includes('authentication') || message.includes('3d secure')) {
      return PaymentErrorType.AUTHENTICATION_FAILED;
    }
    
    if (message.includes('gateway') || message.includes('processor')) {
      return PaymentErrorType.PAYMENT_GATEWAY_ERROR;
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return PaymentErrorType.NETWORK_ERROR;
    }
    
    if (message.includes('timeout') || message.includes('time out')) {
      return PaymentErrorType.TIMEOUT_ERROR;
    }
    
    if (message.includes('fraud') || message.includes('security')) {
      return PaymentErrorType.FRAUD_DETECTION;
    }
    
    if (message.includes('currency') || message.includes('exchange')) {
      return PaymentErrorType.CURRENCY_ERROR;
    }
    
    if (message.includes('amount') || message.includes('value')) {
      return PaymentErrorType.AMOUNT_ERROR;
    }
    
    if (message.includes('processing') || message.includes('process')) {
      return PaymentErrorType.PROCESSING_ERROR;
    }
    
    return PaymentErrorType.UNKNOWN_PAYMENT_ERROR;
  };

  /**
   * Get user-friendly error message based on error type
   */
  const getErrorMessage = (errorType: PaymentErrorType): string => {
    const customMessages = config.customErrorMessages || {};
    
    if (customMessages[errorType]) {
      return customMessages[errorType];
    }
    
    switch (errorType) {
      case PaymentErrorType.CARD_DECLINED:
        return 'Your payment was declined by your bank. Please check your card details or try a different payment method.';
      
      case PaymentErrorType.INSUFFICIENT_FUNDS:
        return 'Your card has insufficient funds for this transaction. Please use a different card or contact your bank.';
      
      case PaymentErrorType.EXPIRED_CARD:
        return 'Your card has expired. Please use a different card or update your payment information.';
      
      case PaymentErrorType.INVALID_CARD:
        return 'The card information appears to be invalid. Please check your card number, expiry date, and security code.';
      
      case PaymentErrorType.AUTHENTICATION_FAILED:
        return 'Payment authentication failed. You may need to complete additional verification with your bank.';
      
      case PaymentErrorType.PAYMENT_GATEWAY_ERROR:
        return 'Our payment system is temporarily unavailable. Please try again in a few minutes or contact support.';
      
      case PaymentErrorType.NETWORK_ERROR:
        return 'Connection issue during payment processing. Your card has not been charged. Please try again.';
      
      case PaymentErrorType.TIMEOUT_ERROR:
        return 'Payment processing timed out. Please check with your bank if the payment went through before retrying.';
      
      case PaymentErrorType.FRAUD_DETECTION:
        return 'This transaction has been flagged for security review. Please contact our support team for assistance.';
      
      case PaymentErrorType.CURRENCY_ERROR:
        return 'There was an issue with the currency conversion. Please contact support for assistance.';
      
      case PaymentErrorType.AMOUNT_ERROR:
        return 'There was an issue with the payment amount. Please verify the total and try again.';
      
      case PaymentErrorType.PROCESSING_ERROR:
        return 'Payment processing encountered an error. Your card may not have been charged. Please contact support.';
      
      default:
        return 'An unexpected payment error occurred. Please try again or contact our support team for assistance.';
    }
  };

  /**
   * Get error severity based on error type
   */
  const getErrorSeverity = (errorType: PaymentErrorType): ErrorSeverity => {
    switch (errorType) {
      case PaymentErrorType.FRAUD_DETECTION:
        return ErrorSeverity.CRITICAL;
      
      case PaymentErrorType.PAYMENT_GATEWAY_ERROR:
      case PaymentErrorType.PROCESSING_ERROR:
        return ErrorSeverity.HIGH;
      
      case PaymentErrorType.AUTHENTICATION_FAILED:
      case PaymentErrorType.NETWORK_ERROR:
      case PaymentErrorType.TIMEOUT_ERROR:
        return ErrorSeverity.MEDIUM;
      
      case PaymentErrorType.CARD_DECLINED:
      case PaymentErrorType.INSUFFICIENT_FUNDS:
      case PaymentErrorType.EXPIRED_CARD:
      case PaymentErrorType.INVALID_CARD:
      case PaymentErrorType.CURRENCY_ERROR:
      case PaymentErrorType.AMOUNT_ERROR:
        return ErrorSeverity.LOW;
      
      default:
        return ErrorSeverity.MEDIUM;
    }
  };

  /**
   * Log security-sensitive payment error
   */
  const logSecurityError = (errorType: PaymentErrorType, context?: PaymentContext): void => {
    // Log security events for fraud detection and monitoring
    const securityLog = {
      eventType: 'payment_error',
      errorType,
      severity: getErrorSeverity(errorType),
      timestamp: new Date().toISOString(),
      transactionId: context?.transactionId,
      amount: context?.amount,
      currency: context?.currency,
      paymentMethod: context?.paymentMethod ? '****' + context.paymentMethod.slice(-4) : undefined,
      userId: context?.buyerId,
      propertyId: context?.propertyId,
      attemptCount: context?.attemptCount,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      ipAddress: 'client-side', // Would be set server-side in real implementation
    };

    console.warn('[Payment Security Log]', securityLog);

    // In production, this would be sent to a security monitoring service
    if (errorType === PaymentErrorType.FRAUD_DETECTION && config.onFraudAlert) {
      config.onFraudAlert(context || {});
    }
  };

  /**
   * Get recovery actions based on error type
   */
  const getRecoveryActions = (errorType: PaymentErrorType): RecoveryAction[] => {
    const actions: RecoveryAction[] = [];
    const { paymentContext, supportContact } = config;
    
    switch (errorType) {
      case PaymentErrorType.CARD_DECLINED:
      case PaymentErrorType.INSUFFICIENT_FUNDS:
      case PaymentErrorType.EXPIRED_CARD:
      case PaymentErrorType.INVALID_CARD:
        actions.push({
          id: 'try-different-card',
          label: 'Try Different Card',
          action: () => {
            // Trigger payment form reset or card selection
            window.dispatchEvent(new CustomEvent('paymentMethodChange'));
          },
          icon: CreditCard,
          variant: 'primary'
        });
        break;
      
      case PaymentErrorType.AUTHENTICATION_FAILED:
        actions.push({
          id: 'contact-bank',
          label: 'Contact Your Bank',
          action: () => {
            alert('Please contact your bank to enable online payments or resolve authentication issues.');
          },
          icon: Phone,
          variant: 'primary'
        });
        break;
      
      case PaymentErrorType.NETWORK_ERROR:
      case PaymentErrorType.TIMEOUT_ERROR:
        if (config.enableRetry) {
          actions.push({
            id: 'retry-payment',
            label: 'Retry Payment',
            action: () => {
              // Trigger payment retry
              window.dispatchEvent(new CustomEvent('retryPayment', { 
                detail: { transactionId: paymentContext?.transactionId }
              }));
            },
            icon: CreditCard,
            variant: 'primary'
          });
        }
        break;
      
      case PaymentErrorType.FRAUD_DETECTION:
        actions.push({
          id: 'verify-identity',
          label: 'Verify Identity',
          action: () => {
            if (supportContact?.phone) {
              window.open(`tel:${supportContact.phone}`);
            } else {
              alert('Please contact support to verify your identity: support@prop.ie');
            }
          },
          icon: Shield,
          variant: 'primary'
        });
        break;
      
      case PaymentErrorType.PAYMENT_GATEWAY_ERROR:
      case PaymentErrorType.PROCESSING_ERROR:
        actions.push({
          id: 'wait-and-retry',
          label: 'Wait and Retry',
          action: () => {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('retryPayment'));
            }, 60000); // Wait 1 minute
            alert('Will retry payment in 1 minute...');
          },
          icon: Clock,
          variant: 'secondary'
        });
        break;
    }

    // Always add support contact actions for payment issues
    if (supportContact?.phone) {
      actions.push({
        id: 'call-support',
        label: `Call ${supportContact.phone}`,
        action: () => {
          window.open(`tel:${supportContact.phone}`);
        },
        icon: Phone,
        variant: 'secondary'
      });
    }

    if (supportContact?.email) {
      actions.push({
        id: 'email-support',
        label: 'Email Support',
        action: () => {
          const subject = `Payment Error - Transaction ${paymentContext?.transactionId || 'Unknown'}`;
          const body = `I encountered a payment error (${errorType}) while trying to make a payment.`;
          window.open(`mailto:${supportContact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        },
        icon: Mail,
        variant: 'secondary'
      });
    }
    
    return actions;
  };

  /**
   * Create error boundary configuration
   */
  const createConfig = (error: Error): ErrorBoundaryConfig => {
    const paymentErrorType = determinePaymentErrorType(error);
    const severity = getErrorSeverity(paymentErrorType);
    const recoveryActions = getRecoveryActions(paymentErrorType);
    
    // Log security-sensitive errors
    logSecurityError(paymentErrorType, config.paymentContext);
    
    return {
      name: config.name || 'Payment Error Boundary',
      errorTypes: [ErrorType.PAYMENT],
      severity,
      fallbackTitle: 'Payment Issue',
      fallbackMessage: getErrorMessage(paymentErrorType),
      showDetails: false, // Never show technical details for payment errors
      retryConfig: {
        enabled: config.enableRetry ?? false, // Disabled by default for security
        maxRetries: config.maxRetries ?? 1,
        retryDelay: 5000,
        exponentialBackoff: false
      },
      reportingConfig: {
        enabled: true,
        includeUserContext: true,
        includeErrorStack: false, // Exclude stack traces for security
        customTags: {
          boundaryType: 'payment',
          transactionId: config.paymentContext?.transactionId || 'unknown',
          amount: config.paymentContext?.amount?.toString() || 'unknown',
          currency: config.paymentContext?.currency || 'unknown',
          paymentErrorType,
          isDeposit: config.paymentContext?.isDeposit?.toString(),
          isFinalPayment: config.paymentContext?.isFinalPayment?.toString(),
          attemptCount: config.paymentContext?.attemptCount?.toString()
        }
      },
      recoveryActions,
      onError: (error, errorInfo) => {
        // Call custom error handler
        if (config.onPaymentError) {
          config.onPaymentError(paymentErrorType, config.paymentContext);
        }

        // Call transaction failure handler
        if (config.onTransactionFailure && config.paymentContext?.transactionId) {
          config.onTransactionFailure(config.paymentContext.transactionId, error);
        }

        // Log payment error without sensitive details
        console.error(`[Payment Error Boundary] Payment failed:`, {
          errorType: paymentErrorType,
          severity,
          transactionId: config.paymentContext?.transactionId,
          paymentMethod: config.paymentContext?.paymentMethod ? '****' + config.paymentContext.paymentMethod.slice(-4) : undefined,
          componentStack: errorInfo.componentStack
        });
      }
    };
  };

  /**
   * Custom fallback component for payment errors
   */
  const PaymentErrorFallback: React.FC<ErrorFallbackProps> = (props) => {
    const { error, config: boundaryConfig, recoveryActions } = props;
    const paymentErrorType = determinePaymentErrorType(error);
    const { paymentContext } = config;
    
    const getErrorIcon = () => {
      switch (paymentErrorType) {
        case PaymentErrorType.FRAUD_DETECTION:
          return Shield;
        case PaymentErrorType.CARD_DECLINED:
        case PaymentErrorType.INSUFFICIENT_FUNDS:
        case PaymentErrorType.EXPIRED_CARD:
        case PaymentErrorType.INVALID_CARD:
          return CreditCard;
        case PaymentErrorType.TIMEOUT_ERROR:
          return Clock;
        default:
          return AlertTriangle;
      }
    };
    
    const ErrorIcon = getErrorIcon();
    const isHighSeverity = getErrorSeverity(paymentErrorType) >= ErrorSeverity.HIGH;
    
    return (
      <div className={`bg-white border-2 rounded-lg p-6 m-4 ${
        isHighSeverity ? 'border-red-300' : 'border-orange-300'
      }`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 p-2 rounded-full ${
            isHighSeverity ? 'bg-red-100' : 'bg-orange-100'
          }`}>
            <ErrorIcon className={`h-6 w-6 ${
              isHighSeverity ? 'text-red-600' : 'text-orange-600'
            }`} />
          </div>
          <div className="ml-4 flex-1">
            <h3 className={`text-lg font-semibold ${
              isHighSeverity ? 'text-red-900' : 'text-orange-900'
            }`}>
              {boundaryConfig.fallbackTitle}
            </h3>
            
            <div className={`mt-2 text-sm ${
              isHighSeverity ? 'text-red-800' : 'text-orange-800'
            }`}>
              <p>{boundaryConfig.fallbackMessage}</p>
              
              {paymentContext?.transactionId && (
                <p className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded">
                  Reference: {paymentContext.transactionId}
                </p>
              )}
              
              {paymentContext?.amount && paymentContext?.currency && (
                <p className="mt-1 text-sm font-medium">
                  Amount: {paymentContext.currency} {paymentContext.amount.toLocaleString()}
                </p>
              )}
            </div>

            {paymentErrorType === PaymentErrorType.FRAUD_DETECTION && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800 text-sm font-medium">
                  🛡️ Security Notice: This transaction requires additional verification.
                </p>
              </div>
            )}

            {recoveryActions.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
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
        </div>
      </div>
    );
  };

  return (
    <BaseErrorBoundary 
      config={createConfig(new Error('placeholder'))}
      fallbackComponent={PaymentErrorFallback}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default PaymentErrorBoundary;