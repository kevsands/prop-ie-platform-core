'use client';

import { useEffect, useState, ComponentType } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCSRFToken, verifyCSRFToken } from './CSRFToken';

interface CSRFProtectionOptions {
  redirectOnInvalid?: boolean;
  redirectUrl?: string;
  protectGET?: boolean;
  logViolations?: boolean;
  customErrorComponent?: React.ReactNode;
}

/**
 * Higher-Order Component (HOC) to protect routes from CSRF attacks
 * 
 * This HOC:
 * - Verifies CSRF tokens in form submissions
 * - Adds CSRF validation to client-side route changes
 * - Validates state parameters in URLs
 * - Prevents unauthorized form submissions
 * 
 * @param Component The component to protect 
 * @param options Configuration options
 * @returns Protected component
 */
export default function withCSRFProtection<P extends object>(
  Component: ComponentType<P>,
  options: CSRFProtectionOptions = {}
) {
  const {
    redirectOnInvalid = true,
    redirectUrl = '/login',
    protectGET = false,
    logViolations = true,
    customErrorComponent = null,
  } = options;

  function ProtectedComponent(props: P) {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const csrfToken = useCSRFToken();

    useEffect(() => {
      // Skip verification for GET requests unless explicitly enabled
      if (!protectGET && (!pathname || pathname.startsWith('/'))) {
        setIsVerified(true);
        setIsLoading(false);
        return;
      }

      // Check for CSRF token in state parameter (for route changes)
      const stateParam = searchParams?.get('state');
      if (stateParam) {
        try {
          // Parse the state parameter (could contain token and other data)
          const state = JSON.parse(atob(stateParam));
          
          if (state && state.csrf && verifyCSRFToken(state.csrf)) {
            setIsVerified(true);
            setIsLoading(false);
            return;
          }
          
          setError('Invalid state parameter');
          handleInvalidToken('Invalid state parameter');
        } catch (e) {
          setError('Malformed state parameter');
          handleInvalidToken('Malformed state parameter');
        }
      } else {
        // If no state parameter, assume valid for GET requests
        setIsVerified(true);
        setIsLoading(false);
      }
    }, [pathname, searchParams]);

    // Handle form submissions with CSRF validation
    useEffect(() => {
      if (typeof window === 'undefined') return;

      // Store original form submit method
      const originalSubmit = HTMLFormElement.prototype.submit;
      
      // Override form submission to check for CSRF token
      HTMLFormElement.prototype.submit = function() {
        // Skip validation for GET forms
        if (this.method.toLowerCase() === 'get' && !protectGET) {
          return originalSubmit.apply(this);
        }
        
        // Look for CSRF token in the form
        let csrfField: HTMLInputElement | null = null;
        for (let i = 0; i < this.elements.length; i++) {
          const element = this.elements[i] as HTMLInputElement;
          if (element.name === 'csrf_token' || element.name === '_csrf' || element.getAttribute('data-security') === 'csrf-token') {
            csrfField = element;
            break;
          }
        }
        
        // Validate the token if found
        if (csrfField && verifyCSRFToken(csrfField.value)) {
          return originalSubmit.apply(this);
        }
        
        // No token or invalid token
        const errorMsg = csrfField ? 'Invalid CSRF token' : 'Missing CSRF token';
        handleInvalidToken(errorMsg);
        
        // Prevent form submission
        return false;
      };
      
      // Listen for form submit events to capture inline submissions
      const formSubmitHandler = (e: SubmitEvent) => {
        const form = e.target as HTMLFormElement;
        
        // Skip validation for GET forms
        if (form.method.toLowerCase() === 'get' && !protectGET) {
          return;
        }
        
        // Check for CSRF token
        let hasValidToken = false;
        for (let i = 0; i < form.elements.length; i++) {
          const element = form.elements[i] as HTMLInputElement;
          if ((element.name === 'csrf_token' || element.name === '_csrf' || element.getAttribute('data-security') === 'csrf-token')
              && verifyCSRFToken(element.value)) {
            hasValidToken = true;
            break;
          }
        }
        
        if (!hasValidToken) {
          e.preventDefault();
          e.stopPropagation();
          handleInvalidToken('Form submission without valid CSRF token');
        }
      };
      
      // Add event listener for all forms
      document.addEventListener('submit', formSubmitHandler);
      
      // Clean up
      return () => {
        HTMLFormElement.prototype.submit = originalSubmit;
        document.removeEventListener('submit', formSubmitHandler);
      };
    }, []);

    // Handle invalid tokens
    const handleInvalidToken = (reason: string) => {
      if (logViolations) {
        console.error(`CSRF Protection Violation: ${reason}`, {
          path: pathname,
          timestamp: new Date().toISOString()
        });
        
        // Optionally report to server
        try {
          fetch('/api/security/report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              violation: {
                type: 'csrf',
                severity: 'high',
                description: `CSRF Protection Violation: ${reason}`,
                timestamp: Date.now(),
                url: typeof window !== 'undefined' ? window.location.href : '',
                metadata: {
                  path: pathname,
                  referrer: typeof document !== 'undefined' ? document.referrer : ''
                }
              }
            })
          }).catch(err => console.error('Failed to report CSRF violation:', err));
        } catch (error) {
          console.error('Error reporting CSRF violation:', error);
        }
      }
      
      setIsVerified(false);
      setIsLoading(false);
      setError(reason);
      
      // Redirect if enabled
      if (redirectOnInvalid && typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    };

    // Show loading state
    if (isLoading) {
      return <div>Verifying security token...</div>;
    }

    // Show error or custom error component
    if (!isVerified) {
      if (customErrorComponent) {
        return <>{customErrorComponent}</>;
      }
      
      return (
        <div className="security-error">
          <h2>Security Error</h2>
          <p>{error || 'Invalid security token'}</p>
          <p>This could be due to an expired session or a potential security threat.</p>
          <button 
            onClick={() => window.location.href = redirectUrl}
            className="security-redirect-button"
          >
            Return to login
          </button>
        </div>
      );
    }

    // Render the protected component
    return <Component {...props} />;
  }

  // Set display name for better debugging
  const componentName = Component.displayName || Component.name || 'Component';
  ProtectedComponent.displayName = `withCSRFProtection(${componentName})`;

  return ProtectedComponent;
}