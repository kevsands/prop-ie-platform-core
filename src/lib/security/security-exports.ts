/**
 * Security Exports Module
 * 
 * This module provides a simplified facade for security functionality with proper imports
 * that are compatible with Next.js App Router architecture and AWS Amplify v6.
 * It serves as a bridge between the detailed security implementation and client components.
 */

// Core Security APIs
import { AuditLogger, AuditSeverity } from './auditLogger';
import { SecurityError, ValidationError, SecurityErrorCode } from './errorHandling';

/**
 * Security Service API
 * 
 * Provides a simplified interface to the security services with proper
 * cross-environment support and safe imports for server and client components.
 */
export const SecurityService = {
  /**
   * Initialize security services
   */
  initialize: async (): Promise<boolean> => {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      try {
        // Log initialization
        AuditLogger.logSecurity(
          'security_module_init',
          AuditSeverity.INFO,
          'Security module initialized',
          { 
            environment: process.env.NODE_ENV || 'development'
          }
        );

        return true;
      } catch (error) {

        return false;
      }
    }
    return true;
  },

  /**
   * Validate input data for security threats
   * 
   * @param data Data to validate
   * @returns Whether the data is safe or not
   */
  validateInput: (data: any): boolean => {
    try {
      // Perform basic validation
      if (!data) return false;

      // Check for suspicious strings
      if (typeof data === 'string') {
        return !data.includes('script');
      }

      // For objects, validate recursively
      if (typeof data === 'object') {
        return Object.values(data).every(v => 
          typeof v !== 'string' || !String(v).includes('script')
        );
      }

      return true;
    } catch (error) {

      return false;
    }
  },

  /**
   * Sanitize HTML content
   * 
   * @param html HTML content to sanitize
   * @returns Sanitized HTML
   */
  sanitizeHTML: (html: string): string => {
    // Simple sanitization
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '');
  },

  /**
   * Check if a URL is safe
   * 
   * @param url URL to check
   * @returns Whether the URL is safe or not
   */
  isURLSafe: (url: string): boolean => {
    try {
      // Simple URL safety check
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      // Check against known bad domains
      const badDomains = [
        'evil.com',
        'malware.com',
        'example-malicious-domain.com', // Example domain for demonstration purposes
        'phishing.org'
      ];

      return !badDomains.some(domain => hostname.includes(domain));
    } catch (error) {

      return false;
    }
  },

  /**
   * Log a security event safely
   * 
   * @param event Event type
   * @param message Event message
   * @param details Optional event details
   */
  logSecurityEvent: (event: string, message: string, details?: any) => {
    AuditLogger.logSecurity(event, AuditSeverity.INFOmessagedetails);
  },

  /**
   * Handle security errors safely
   * 
   * @param error Error to handle
   * @returns Formatted response
   */
  handleError: (error: Error): any => {
    // Convert to SecurityError if needed
    const securityError = error instanceof SecurityError 
      ? error 
      : new SecurityError(
          error.message, 
          SecurityErrorCode.INTERNAL_SECURITY_ERROR,
          {},
          { originalError: error.message }
        );

    // Log the error
    AuditLogger.logSecurity(
      'security_error',
      AuditSeverity.ERROR,
      securityError.message,
      { errorCode: securityError.code }
    );

    // Return JSON response
    return {
      error: true,
      code: securityError.code,
      message: securityError.message,
      timestamp: Date.now()
    };
  }
};

// Export types
export { SecurityError, ValidationError, SecurityErrorCode, AuditSeverity };

// Import security flags
import { ENABLE_SECURITY_MONITORING } from './security-flags';

// Export the SecurityMonitor component for use throughout the application
// Use a conditional export to handle disabled monitoring
import React from 'react';
import RealSecurityMonitor from '@/components/security/SecurityMonitor';

// Define common props interface for security monitor
export interface SecurityMonitorProps {
  level?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

// Create a stub component when security monitoring is disabled
const NoopSecurityMonitor = ({ children }: SecurityMonitorProps) => {
  return children || null;
};

// Export the appropriate component based on the flag
export const SecurityMonitor = ENABLE_SECURITY_MONITORING 
  ? RealSecurityMonitor 
  : NoopSecurityMonitor;

// Default export
export default SecurityService;