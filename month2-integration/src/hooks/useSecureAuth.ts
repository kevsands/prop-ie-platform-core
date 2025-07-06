'use client';

/**
 * Secure Authentication Hook
 * 
 * Integrates the AuthContext and Security module into a single, easy-to-use hook
 * that provides authentication state along with security capabilities.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import Security from '@/lib/security';
import { AuditLogger, AuditSeverity } from '@/lib/security/auditLogger';

export interface UseSecureAuthOptions {
  /**
   * Whether to perform security initialization on hook mount
   * @default true
   */
  initializeOnMount?: boolean;
  
  /**
   * Security level to check for when using the requiresAuth method
   * @default 'basic'
   */
  defaultSecurityLevel?: 'basic' | 'medium' | 'high';
  
  /**
   * Whether to log security events
   * @default true
   */
  enableAuditLogging?: boolean;
}

/**
 * Integrated hook that combines authentication state with security capabilities
 */
export const useSecureAuth = (options: UseSecureAuthOptions = {}) => {
  const {
    initializeOnMount = true,
    defaultSecurityLevel = 'basic',
    enableAuditLogging = true,
  } = options;
  
  // Get authentication context
  const auth = useAuth();
  
  // Add security initialization state
  const [securityInitialized, setSecurityInitialized] = useState<boolean>(
    Security.isInitialized()
  );
  
  // Initialize security module if not already initialized
  useEffect(() => {
    if (initializeOnMount && !securityInitialized) {
      const initSecurity = async () => {
        try {
          await Security.initialize();
          setSecurityInitialized(true);
          
          if (enableAuditLogging) {
            AuditLogger.logSecurity(
              'security_module_initialized',
              AuditSeverity.INFO,
              'Security module initialized successfully',
              { 
                context: 'useSecureAuth',
                userId: auth.user?.id
              }
            );
          }
        } catch (error) {
          console.error('Failed to initialize security module:', error);
          
          if (enableAuditLogging) {
            AuditLogger.logSecurity(
              'security_module_init_failed',
              AuditSeverity.ERROR,
              'Failed to initialize security module',
              { 
                context: 'useSecureAuth',
                error: error instanceof Error ? error.message : String(error)
              }
            );
          }
        }
      };
      
      initSecurity();
    }
  }, [initializeOnMount, securityInitialized, auth.user?.id, enableAuditLogging]);
  
  /**
   * Check if the current user has sufficient authorization for a given resource
   * Combines authentication, role check, permission check, and security level verification
   */
  const requiresAuth = useCallback(async (
    options: {
      role?: string | string[];
      permission?: string | string[];
      securityLevel?: 'basic' | 'medium' | 'high';
      requiresMFA?: boolean;
    } = {}
  ): Promise<boolean> => {
    const {
      role,
      permission,
      securityLevel = defaultSecurityLevel,
      requiresMFA = false,
    } = options;
    
    try {
      // First, check authentication
      if (!auth.isAuthenticated || !auth.user) {
        return false;
      }
      
      // Check security level
      if (securityLevel) {
        const hasSecurityLevel = await auth.checkSecurityLevel(securityLevel);
        if (!hasSecurityLevel) {
          return false;
        }
      }
      
      // Check role if specified
      if (role) {
        const roles = Array.isArray(role) ? role : [role];
        const hasRequiredRole = roles.some(r => auth.hasRole(r));
        if (!hasRequiredRole) {
          return false;
        }
      }
      
      // Check permission if specified
      if (permission) {
        const permissions = Array.isArray(permission) ? permission : [permission];
        const hasRequiredPermission = permissions.some(p => auth.hasPermission(p));
        if (!hasRequiredPermission) {
          return false;
        }
      }
      
      // Check MFA if required
      if (requiresMFA && !auth.mfaEnabled) {
        return false;
      }
      
      // All checks passed
      return true;
    } catch (error) {
      console.error('Error in requiresAuth check:', error);
      
      if (enableAuditLogging) {
        AuditLogger.logSecurity(
          'auth_check_error',
          AuditSeverity.ERROR,
          'Error during authorization check',
          { 
            userId: auth.user?.id,
            role,
            permission,
            securityLevel,
            requiresMFA,
            error: error instanceof Error ? error.message : String(error)
          }
        );
      }
      
      // Fail closed for security
      return false;
    }
  }, [auth, defaultSecurityLevel, enableAuditLogging]);
  
  /**
   * Elevate security level by triggering additional verification
   * This can be used to re-authenticate or verify MFA before sensitive operations
   */
  const elevateSecurityLevel = useCallback(async (
    targetLevel: 'medium' | 'high'
  ): Promise<boolean> => {
    try {
      // First check if we already have the requested level
      const alreadyElevated = await auth.checkSecurityLevel(targetLevel);
      if (alreadyElevated) {
        return true;
      }
      
      if (targetLevel === 'medium') {
        // For medium level, check session fingerprint
        try {
          const fingerprintValid = await Security.getSessionFingerprint().validate();
          if (fingerprintValid.valid) {
            return true;
          }
        } catch (error) {
          console.error('Error validating session fingerprint:', error);
        }
      }
      
      if (targetLevel === 'high') {
        // High level might require MFA if not already enabled
        if (!auth.mfaEnabled) {
          return false; // MFA needs to be set up first
        }
        
        // Additional verificaiton would be handled by the application UI
        // For example, requesting MFA code again or doing a step-up auth
      }
      
      // The UI should react to false and prompt for appropriate verification
      return false;
    } catch (error) {
      console.error('Error in elevateSecurityLevel:', error);
      
      if (enableAuditLogging) {
        AuditLogger.logSecurity(
          'security_elevation_error',
          AuditSeverity.ERROR,
          'Error during security level elevation',
          { 
            userId: auth.user?.id,
            targetLevel,
            error: error instanceof Error ? error.message : String(error)
          }
        );
      }
      
      return false;
    }
  }, [auth, enableAuditLogging]);
  
  // Return combined authentication and security capabilities
  return {
    ...auth,
    securityInitialized,
    requiresAuth,
    elevateSecurityLevel,
    security: Security
  };
};

export default useSecureAuth;