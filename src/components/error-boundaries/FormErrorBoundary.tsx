'use client';

import React, { ReactNode } from 'react';
import { AlertCircle, RefreshCw, Save, Trash2, FileText } from 'lucide-react';
import { 
  BaseErrorBoundary, 
  ErrorType, 
  ErrorSeverity, 
  ErrorBoundaryConfig,
  RecoveryAction,
  ErrorFallbackProps 
} from './BaseErrorBoundary';

/**
 * Form Error types for specific handling
 */
export enum FormErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SUBMISSION_ERROR = 'SUBMISSION_ERROR',
  FIELD_ERROR = 'FIELD_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  FORM_STATE_ERROR = 'FORM_STATE_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_FORM_ERROR = 'UNKNOWN_FORM_ERROR'
}

/**
 * Form context for error recovery
 */
interface FormContext {
  formId?: string;
  formName?: string;
  formData?: Record<string, any>;
  hasUnsavedChanges?: boolean;
  lastSavedData?: Record<string, any>;
}

/**
 * Configuration for Form Error Boundary
 */
interface FormErrorBoundaryConfig {
  name?: string;
  formContext?: FormContext;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
  retryEnabled?: boolean;
  maxRetries?: number;
  onFormError?: (errorType: FormErrorType, formContext?: FormContext) => void;
  onDataLoss?: (formData: Record<string, any>) => void;
  onRecovery?: (recoveredData: Record<string, any>) => void;
  customErrorMessages?: Record<FormErrorType, string>;
}

interface FormErrorBoundaryProps {
  children: ReactNode;
  config?: FormErrorBoundaryConfig;
}

/**
 * Form Error Boundary Component
 * 
 * Specialized error boundary for handling form-related errors with
 * data preservation and recovery mechanisms
 */
export const FormErrorBoundary: React.FC<FormErrorBoundaryProps> = ({ 
  children, 
  config = {} 
}) => {
  /**
   * Determine form error type from error message/details
   */
  const determineFormErrorType = (error: Error): FormErrorType => {
    const message = error.message.toLowerCase();
    
    // Check for specific error patterns
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return FormErrorType.VALIDATION_ERROR;
    }
    
    if (message.includes('submit') || message.includes('save') || message.includes('update')) {
      return FormErrorType.SUBMISSION_ERROR;
    }
    
    if (message.includes('field') || message.includes('input')) {
      return FormErrorType.FIELD_ERROR;
    }
    
    if (message.includes('upload') || message.includes('file')) {
      return FormErrorType.FILE_UPLOAD_ERROR;
    }
    
    if (message.includes('state') || message.includes('form data')) {
      return FormErrorType.FORM_STATE_ERROR;
    }
    
    if (message.includes('timeout') || message.includes('abort')) {
      return FormErrorType.TIMEOUT_ERROR;
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return FormErrorType.NETWORK_ERROR;
    }
    
    return FormErrorType.UNKNOWN_FORM_ERROR;
  };

  /**
   * Get user-friendly error message based on error type
   */
  const getErrorMessage = (errorType: FormErrorType): string => {
    const customMessages = config.customErrorMessages || {};
    
    if (customMessages[errorType]) {
      return customMessages[errorType];
    }
    
    switch (errorType) {
      case FormErrorType.VALIDATION_ERROR:
        return 'Please check your form inputs. Some fields contain invalid or missing information.';
      
      case FormErrorType.SUBMISSION_ERROR:
        return 'We couldn\'t save your form. Please check your information and try again.';
      
      case FormErrorType.FIELD_ERROR:
        return 'There was an issue with one of the form fields. Please review your inputs.';
      
      case FormErrorType.FILE_UPLOAD_ERROR:
        return 'File upload failed. Please check the file size and format, then try again.';
      
      case FormErrorType.FORM_STATE_ERROR:
        return 'The form encountered an unexpected state. Your data may have been recovered.';
      
      case FormErrorType.TIMEOUT_ERROR:
        return 'The form submission took too long. Your data has been saved locally.';
      
      case FormErrorType.NETWORK_ERROR:
        return 'Connection issue prevented form submission. Your data has been preserved.';
      
      default:
        return 'An unexpected error occurred with the form. Your data has been preserved when possible.';
    }
  };

  /**
   * Get error severity based on error type
   */
  const getErrorSeverity = (errorType: FormErrorType): ErrorSeverity => {
    switch (errorType) {
      case FormErrorType.FORM_STATE_ERROR:
        return ErrorSeverity.HIGH;
      
      case FormErrorType.FILE_UPLOAD_ERROR:
        return ErrorSeverity.MEDIUM;
      
      case FormErrorType.VALIDATION_ERROR:
      case FormErrorType.FIELD_ERROR:
        return ErrorSeverity.LOW;
      
      case FormErrorType.SUBMISSION_ERROR:
      case FormErrorType.NETWORK_ERROR:
      case FormErrorType.TIMEOUT_ERROR:
        return ErrorSeverity.MEDIUM;
      
      default:
        return ErrorSeverity.MEDIUM;
    }
  };

  /**
   * Save form data to localStorage for recovery
   */
  const saveFormDataLocally = (formData: Record<string, any>, formId?: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const key = `form_backup_${formId || 'default'}_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify({
        data: formData,
        timestamp: Date.now(),
        formId
      }));
      
      // Keep only the latest 5 backups per form
      const allKeys = Object.keys(localStorage).filter(k => k.startsWith(`form_backup_${formId || 'default'}_`));
      if (allKeys.length > 5) {
        allKeys.sort().slice(0, -5).forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Failed to save form data locally:', error);
    }
  };

  /**
   * Recover form data from localStorage
   */
  const recoverFormData = (formId?: string): Record<string, any> | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const prefix = `form_backup_${formId || 'default'}_`;
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      
      if (keys.length === 0) return null;
      
      // Get the most recent backup
      const latestKey = keys.sort().pop();
      if (!latestKey) return null;
      
      const backupData = JSON.parse(localStorage.getItem(latestKey) || '{}');
      return backupData.data || null;
    } catch (error) {
      console.warn('Failed to recover form data:', error);
      return null;
    }
  };

  /**
   * Clear form backups
   */
  const clearFormBackups = (formId?: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const prefix = `form_backup_${formId || 'default'}_`;
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear form backups:', error);
    }
  };

  /**
   * Get recovery actions based on error type
   */
  const getRecoveryActions = (errorType: FormErrorType): RecoveryAction[] => {
    const actions: RecoveryAction[] = [];
    const { formContext } = config;
    
    // Data recovery action if form data exists
    if (formContext?.formData || formContext?.hasUnsavedChanges) {
      actions.push({
        id: 'save-data',
        label: 'Save Data Locally',
        action: () => {
          if (formContext?.formData) {
            saveFormDataLocally(formContext.formData, formContext.formId);
            alert('Form data saved locally for recovery.');
          }
        },
        icon: Save,
        variant: 'primary'
      });
    }

    // Recovery action if backup data exists
    const recoveredData = recoverFormData(formContext?.formId);
    if (recoveredData) {
      actions.push({
        id: 'recover-data',
        label: 'Recover Previous Data',
        action: () => {
          if (config.onRecovery) {
            config.onRecovery(recoveredData);
          } else {
            // Trigger a custom event with recovered data
            window.dispatchEvent(new CustomEvent('formDataRecovery', { 
              detail: { data: recoveredData, formId: formContext?.formId }
            }));
          }
        },
        icon: RefreshCw,
        variant: 'secondary'
      });
    }

    // Clear backups action
    actions.push({
      id: 'clear-backups',
      label: 'Clear Saved Data',
      action: () => {
        clearFormBackups(formContext?.formId);
        alert('Saved form data cleared.');
      },
      icon: Trash2,
      variant: 'danger'
    });

    // Error-specific actions
    switch (errorType) {
      case FormErrorType.VALIDATION_ERROR:
        actions.push({
          id: 'show-validation',
          label: 'Show Validation Guide',
          action: () => {
            // Could open a modal with validation requirements
            alert('Please check all required fields are filled correctly.');
          },
          icon: FileText,
          variant: 'secondary'
        });
        break;
      
      case FormErrorType.FILE_UPLOAD_ERROR:
        actions.push({
          id: 'upload-help',
          label: 'Upload Help',
          action: () => {
            alert('Supported formats: PDF, DOC, DOCX, JPG, PNG. Max size: 10MB.');
          },
          icon: FileText,
          variant: 'secondary'
        });
        break;
      
      case FormErrorType.NETWORK_ERROR:
        actions.push({
          id: 'retry-offline',
          label: 'Retry When Online',
          action: () => {
            // Set up a listener for when the connection is restored
            const handleOnline = () => {
              window.location.reload();
              window.removeEventListener('online', handleOnline);
            };
            window.addEventListener('online', handleOnline);
            alert('Will retry automatically when connection is restored.');
          },
          icon: RefreshCw,
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
    const formErrorType = determineFormErrorType(error);
    const severity = getErrorSeverity(formErrorType);
    const recoveryActions = getRecoveryActions(formErrorType);
    
    // Save form data if available and error is severe
    if (config.formContext?.formData && severity !== ErrorSeverity.LOW) {
      saveFormDataLocally(config.formContext.formData, config.formContext.formId);
    }
    
    return {
      name: config.name || 'Form Error Boundary',
      errorTypes: [ErrorType.FORM_VALIDATION],
      severity,
      fallbackTitle: 'Form Error',
      fallbackMessage: getErrorMessage(formErrorType),
      showDetails: false,
      retryConfig: {
        enabled: config.retryEnabled ?? true,
        maxRetries: config.maxRetries ?? 2,
        retryDelay: 2000,
        exponentialBackoff: false
      },
      reportingConfig: {
        enabled: true,
        includeUserContext: true,
        includeErrorStack: true,
        customTags: {
          boundaryType: 'form',
          formId: config.formContext?.formId || 'unknown',
          formName: config.formContext?.formName || 'unknown',
          hasUnsavedChanges: config.formContext?.hasUnsavedChanges?.toString(),
          formErrorType
        }
      },
      recoveryActions,
      onError: (error, errorInfo) => {
        // Call custom error handler
        if (config.onFormError) {
          config.onFormError(formErrorType, config.formContext);
        }

        // Log specific form error details
        console.error(`[Form Error Boundary] Form ${config.formContext?.formName || 'Unknown'} failed:`, {
          error: error.message,
          formErrorType,
          severity,
          formContext: config.formContext,
          componentStack: errorInfo.componentStack
        });

        // Notify about potential data loss
        if (config.formContext?.hasUnsavedChanges && config.onDataLoss) {
          config.onDataLoss(config.formContext.formData || {});
        }
      }
    };
  };

  /**
   * Custom fallback component for form errors
   */
  const FormErrorFallback: React.FC<ErrorFallbackProps> = (props) => {
    const { error, config: boundaryConfig, recoveryActions } = props;
    const formErrorType = determineFormErrorType(error);
    
    return (
      <div className="bg-white border border-red-200 rounded-lg p-6 m-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-red-800">
              {boundaryConfig.fallbackTitle}
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{boundaryConfig.fallbackMessage}</p>
              
              {config.formContext?.formName && (
                <p className="mt-1 text-xs opacity-75">
                  Form: {config.formContext.formName}
                </p>
              )}
              
              {config.formContext?.hasUnsavedChanges && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ You have unsaved changes that have been preserved locally.
                  </p>
                </div>
              )}
            </div>

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

  return (
    <BaseErrorBoundary 
      config={createConfig(new Error('placeholder'))}
      fallbackComponent={FormErrorFallback}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default FormErrorBoundary;