'use client';

import React, { useId } from 'react';
import { ScreenReaderText, LiveRegion } from './ScreenReaderText';

interface FormErrorMessageProps {
  /** Error message to display */
  message?: string;
  /** ID of the form field this error is associated with */
  fieldId: string; 
  /** Whether the error should be announced to screen readers */
  announce?: boolean;
}

/**
 * FormErrorMessage - Accessible error message component for form fields
 * 
 * Provides error feedback with proper ARIA attributes to ensure
 * screen readers can announce the error appropriately.
 */
export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  message,
  fieldId,
  announce = true,
}) => {
  // Don't render anything if no message
  if (!message) return null;
  
  const errorId = `${fieldId}-error`;
  
  return (
    <>
      <div 
        id={errorId}
        className="mt-1 text-sm text-red-600" 
        aria-live={announce ? "assertive" : "off"}
      >
        {message}
      </div>
      
      {/* Ensure immediate announcement for screen readers */}
      {announce && (
        <LiveRegion politeness="assertive">
          {message}
        </LiveRegion>
      )}
    </>
  );
};

interface RequiredLabelProps {
  /** Whether the field is required */
  required?: boolean;
  /** The visual label text */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** ID of the form field this label is associated with */
  htmlFor: string;
}

/**
 * RequiredLabel - Form label with accessible required indicator
 * 
 * Shows a visual asterisk for required fields while also
 * announcing "required" to screen readers.
 */
export const RequiredLabel: React.FC<RequiredLabelProps> = ({
  required = false,
  children,
  className = '',
  htmlFor,
}) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
      {required && (
        <>
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          <ScreenReaderText> (required)</ScreenReaderText>
        </>
      )}
    </label>
  );
};

interface AccessibleFieldsetProps {
  /** Legend text for the fieldset */
  legend: string;
  /** Whether to visually hide the legend (still accessible to screen readers) */
  hideLegend?: boolean;
  /** Children components */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AccessibleFieldset - Accessible grouping for related form controls
 * 
 * Uses fieldset and legend elements to create proper semantic grouping
 * that is accessible to screen readers.
 */
export const AccessibleFieldset: React.FC<AccessibleFieldsetProps> = ({
  legend,
  hideLegend = false,
  children,
  className = '',
}) => {
  return (
    <fieldset className={`border-0 p-0 m-0 ${className}`}>
      {hideLegend ? (
        <legend className="sr-only">{legend}</legend>
      ) : (
        <legend className="text-base font-medium text-gray-900 mb-4">{legend}</legend>
      )}
      {children}
    </fieldset>
  );
};

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label for the input */
  label: string;
  /** Error message */
  error?: string;
  /** Help text */
  description?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Additional CSS classes for the input */
  inputClassName?: string;
  /** Additional CSS classes for the wrapper */
  wrapperClassName?: string;
}

/**
 * AccessibleInput - Input component with accessibility features built-in
 * 
 * Provides proper labeling, error handling, and ARIA attributes
 * for maximum accessibility.
 */
export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  error,
  description,
  required = false,
  inputClassName = '',
  wrapperClassName = '',
  id: propId,
  ...inputProps
}) => {
  // Generate unique IDs if not provided
  const generatedId = useId();
  const id = propId || `input-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  
  // ARIA attributes based on error state
  const ariaAttributes = {
    'aria-invalid': !!error,
    'aria-required': required,
    'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
  };
  
  return (
    <div className={`${wrapperClassName}`}>
      <RequiredLabel required={required} htmlFor={id}>
        {label}
      </RequiredLabel>
      
      {description && (
        <p id={descriptionId} className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      )}
      
      <div className="mt-1">
        <input
          id={id}
          className={`
            appearance-none block w-full px-3 py-2 border
            ${error ? 'border-red-300' : 'border-gray-300'}
            rounded-md shadow-sm placeholder-gray-400 
            focus:outline-none focus:ring-blue-500 focus:border-blue-500 
            sm:text-sm ${inputClassName}
          `}
          {...ariaAttributes}
          {...inputProps}
        />
      </div>
      
      <FormErrorMessage message={error} fieldId={id} />
    </div>
  );
};

export default {
  FormErrorMessage,
  RequiredLabel,
  AccessibleFieldset,
  AccessibleInput,
};