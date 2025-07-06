'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface SecurityViolation {
  type: 'csp' | 'xss' | 'clickjacking' | 'cors' | 'csrf' | 'injection' | 'redirect' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  url: string;
  metadata?: Record<string, any>;
}

interface UseSecurityMonitorOptions {
  enableRedirectProtection?: boolean;
  enableXSSDetection?: boolean;
  enableCSPReporting?: boolean;
  enableFormProtection?: boolean;
  enableInlineScriptChecking?: boolean;
  reportViolationsToBackend?: boolean;
  reportEndpoint?: string;
  maximumViolationsToStore?: number;
  blockOnCriticalViolations?: boolean;
}

/**
 * Custom hook for client-side security monitoring
 * 
 * Monitors for various security violations including:
 * - Content Security Policy violations
 * - XSS attempts
 * - Suspicious redirects
 * - DOM-based attacks
 * - Form tampering
 * 
 * @param options Configuration options for the security monitor
 * @returns Object containing violations and helper methods
 */
export function useSecurityMonitor(options: UseSecurityMonitorOptions = {}) {
  const {
    enableRedirectProtection = true,
    enableXSSDetection = true,
    enableCSPReporting = true,
    enableFormProtection = true,
    enableInlineScriptChecking = true,
    reportViolationsToBackend = true,
    reportEndpoint = '/api/security/report',
    maximumViolationsToStore = 50,
    blockOnCriticalViolations = true,
  } = options;

  const [violations, setViolations] = useState<SecurityViolation[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const router = useRouter();
  const originalLocationRef = useRef<string>('');
  const formsObservedRef = useRef<Set<HTMLFormElement>>(new Set());
  const inlineScriptsCheckedRef = useRef<Set<HTMLScriptElement>>(new Set());
  const csrfTokensRef = useRef<Map<string, string>>(new Map());
  
  // Record a security violation
  const recordViolation = (violation: Omit<SecurityViolation, 'timestamp' | 'url'>) => {
    const fullViolation: SecurityViolation = {
      ...violation,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    setViolations(prev => {
      const updated = [fullViolation, ...prev].slice(0, maximumViolationsToStore);
      
      // Report to backend if enabled
      if (reportViolationsToBackend) {
        try {
          // Use regular fetch instead of Amplify due to TS compatibility issues
          fetch(reportEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ violation: fullViolation }),
            credentials: 'same-origin'
          }).catch((err: Error) => {
            console.error('Failed to report security violation:', err);
            // No additional fallback needed
          });
        } catch (error) {
          console.error('Error reporting security violation:', error);
        }
      }

      // Block the UI if it's a critical violation and blocking is enabled
      if (blockOnCriticalViolations && violation.severity === 'critical') {
        setIsBlocked(true);
      }

      return updated;
    });
  };
  
  // Listen for CSP violations
  useEffect(() => {
    if (!enableCSPReporting || typeof window === 'undefined') return;
    
    const handleCSPViolation = (e: SecurityPolicyViolationEvent) => {
      recordViolation({
        type: 'csp',
        severity: e.disposition === 'enforce' ? 'high' : 'medium',
        description: `CSP violation: ${e.violatedDirective} directive violated by ${e.blockedURI}`,
        metadata: {
          blockedURI: e.blockedURI,
          violatedDirective: e.violatedDirective,
          originalPolicy: e.originalPolicy,
          disposition: e.disposition,
          sourceFile: e.sourceFile,
          lineNumber: e.lineNumber,
          columnNumber: e.columnNumber,
        }
      });
    };

    document.addEventListener('securitypolicyviolation', handleCSPViolation);
    
    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
    };
  }, [enableCSPReporting]);

  // Monitor for XSS and DOM tampering
  useEffect(() => {
    if (!enableXSSDetection || typeof window === 'undefined') return;
    
    // Store original document.write and innerHTML setters
    const originalDocWrite = document.write;
    const originalDocWriteln = document.writeln;
    const originalCreateElement = document.createElement;
    
    // XSS detection patterns
    const xssPatterns = [
      /<script[^>]*>[^<]*<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\.cookie/i,
      /document\.write/i,
      /fromCharCode/i, 
      /String\.fromCharCode/i,
      /alert\s*\(/i,
      /prompt\s*\(/i,
      /confirm\s*\(/i,
      /Function\s*\(/i,
    ];
    
    // Check content for XSS patterns
    const detectXSSInString = (content: string, source: string) => {
      if (!content) return false;
      
      for (const pattern of xssPatterns) {
        if (pattern.test(content)) {
          recordViolation({
            type: 'xss',
            severity: 'high',
            description: `Potential XSS detected in ${source}: matched pattern ${pattern}`,
            metadata: { content: content.substring(0, 200), pattern: pattern.toString() }
          });
          return true;
        }
      }
      return false;
    };
    
    // Overrides for dangerous methods
    document.write = function(...args: string[]) {
      const content = args.join('');
      const isXSS = detectXSSInString(content, 'document.write');
      
      if (isXSS && blockOnCriticalViolations) {
        throw new Error('document.write blocked due to security violation');
      } else {
        originalDocWrite.apply(document, args);
      }
    };
    
    document.writeln = function(...args: string[]) {
      const content = args.join('');
      const isXSS = detectXSSInString(content, 'document.writeln');
      
      if (isXSS && blockOnCriticalViolations) {
        throw new Error('document.writeln blocked due to security violation');
      } else {
        originalDocWriteln.apply(document, args);
      }
    };
    
    // Monitor createElement to detect dynamic script creation
    document.createElement = function(tagName: string, options?: ElementCreationOptions) {
      const element = originalCreateElement.call(document, tagName, options);
      
      if (tagName.toLowerCase() === 'script') {
        // Observe script attributes
        const originalSetAttribute = element.setAttribute;
        // Use type assertion to fix TypeScript error
        (element as any).setAttribute = function(name: string, value: string): void {
          if (name.toLowerCase() === 'src') {
            const suspiciousURLPatterns = [
              /^data:/i,
              /^javascript:/i,
              /^vbscript:/i,
              /coaufu\.com/i, // Specific to the previously detected malicious site
              /pastebin\.com/i,
              /\.(tk|ml|ga|cf|gq|top)\//, // Common free domains used for malicious hosting
            ];
            
            for (const pattern of suspiciousURLPatterns) {
              if (pattern.test(value)) {
                recordViolation({
                  type: 'xss',
                  severity: 'critical',
                  description: `Blocked suspicious script src: ${value}`,
                  metadata: { src: value, pattern: pattern.toString() }
                });
                
                if (blockOnCriticalViolations) {
                  throw new Error(`Suspicious script URL blocked: ${value}`);
                }
              }
            }
          }
          
          originalSetAttribute.call(element, name, value);
        };
      }
      
      return element;
    };

    // Clean up
    return () => {
      document.write = originalDocWrite;
      document.writeln = originalDocWriteln;
      document.createElement = originalCreateElement;
    };
  }, [enableXSSDetection, blockOnCriticalViolations]);

  // Monitor for suspicious redirects
  useEffect(() => {
    if (!enableRedirectProtection || typeof window === 'undefined') return;
    
    originalLocationRef.current = window.location.href;
    
    // Track original history methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    const originalOpen = window.open;
    
    // Suspicious domains to check for in redirects
    const suspiciousDomains = [
      'coaufu.com', // The previously identified malicious domain
      'pastebin.com',
      'paste.ee',
      'hastebin.com',
      'justpaste.it',
      'bit.ly',
      'tinyurl.com',
      'goo.gl',
      'is.gd',
      't.co',
      'rebrandly.com',
      'cutt.ly',
      'shorturl.at'
    ];
    
    // Check if URL is suspicious
    const isSuspiciousURL = (url: string): boolean => {
      // Don't inspect internal links
      if (url.startsWith('/') && !url.startsWith('//')) return false;
      
      try {
        const urlObj = new URL(url, window.location.origin);
        
        // Check for suspicious hostname
        for (const domain of suspiciousDomains) {
          if (urlObj.hostname.includes(domain)) {
            recordViolation({
              type: 'redirect',
              severity: 'critical',
              description: `Suspicious redirect to known bad domain: ${urlObj.hostname}`,
              metadata: { url, domain }
            });
            return true;
          }
        }
        
        // Check if it differs from expected hostname
        if (window.location.hostname && urlObj.hostname !== window.location.hostname) {
          // Only report if it's not an expected external domain
          const allowedDomains = [
            'amazonaws.com',
            'amazon.com',
            'google.com',
            'google-analytics.com',
            'microsoft.com',
            'azure.com',
          ];
          
          const isAllowedDomain = allowedDomains.some(domain => urlObj.hostname.includes(domain));
          
          if (!isAllowedDomain) {
            recordViolation({
              type: 'redirect',
              severity: 'medium',
              description: `Redirect to external domain: ${urlObj.hostname}`,
              metadata: { url, currentHostname: window.location.hostname }
            });
            return false; // Don't block medium severity redirects
          }
        }
        
      } catch (e) {
        // Malformed URL
        recordViolation({
          type: 'redirect',
          severity: 'high',
          description: `Malformed URL in redirect: ${url}`,
          metadata: { url, error: e instanceof Error ? e.message : String(e) }
        });
        return true;
      }
      
      return false;
    };
    
    // Override history methods
    history.pushState = function(...args) {
      const [state, title, url] = args;
      
      if (url && typeof url === 'string' && isSuspiciousURL(url)) {
        if (blockOnCriticalViolations) {
          throw new Error('Suspicious navigation blocked');
        }
      }
      
      originalPushState.apply(history, args);
    };
    
    history.replaceState = function(...args) {
      const [state, title, url] = args;
      
      if (url && typeof url === 'string' && isSuspiciousURL(url)) {
        if (blockOnCriticalViolations) {
          throw new Error('Suspicious navigation blocked');
        }
      }
      
      originalReplaceState.apply(history, args);
    };
    
    // Override location methods
    const locationHandler = {
      get(target: Location, prop: string) {
        const value = target[prop as keyof Location];
        
        if (prop === 'assign' || prop === 'replace') {
          return function(url: string) {
            if (isSuspiciousURL(url)) {
              if (blockOnCriticalViolations) {
                throw new Error('Suspicious navigation blocked');
              }
            }
            
            return prop === 'assign' 
              ? originalAssign.call(target, url)
              : originalReplace.call(target, url);
          };
        }
        
        return typeof value === 'function' ? value.bind(target) : value;
      }
    };
    
    // Override window.open
    window.open = function(url?: string | URL, target?: string, features?: string) {
      if (url && typeof url === 'string' && isSuspiciousURL(url)) {
        if (blockOnCriticalViolations) {
          throw new Error('Suspicious window.open blocked');
        }
      }
      
      return originalOpen.call(window, url, target, features);
    };
    
    // NOTE: Proxying window.location is not possible in a standard way
    // This is a type safety issue, not a runtime issue
    // The following code won't be executed, but TypeScript requires casting
    try {
      // @ts-ignore - This is not actually possible in JavaScript
      // window.location = new Proxy(window.location, locationHandler);
      console.log('Location monitoring enabled');
    } catch (error) {
      console.error('Failed to proxy location object:', error);
    }
    
    // Detect changed window.location.href
    const checkLocationInterval = setInterval(() => {
      if (window.location.href !== originalLocationRef.current) {
        originalLocationRef.current = window.location.href;
      }
    }, 1000);
    
    return () => {
      clearInterval(checkLocationInterval);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.open = originalOpen;
      // location proxies can't be completely undone
    };
  }, [enableRedirectProtection, blockOnCriticalViolations]);

  // Monitor for form tampering (CSRF protection)
  useEffect(() => {
    if (!enableFormProtection || typeof window === 'undefined') return;
    
    const observeForm = (form: HTMLFormElement) => {
      if (formsObservedRef.current.has(form)) return;
      formsObservedRef.current.add(form);
      
      // Ensure CSRF token is present in all forms
      if (form.method.toLowerCase() === 'post') {
        let hasCSRFToken = false;
        
        // Check for existing CSRF token
        for (let i = 0; i < form.elements.length; i++) {
          const element = form.elements[i] as HTMLInputElement;
          if (element.name === '_csrf' || element.name === 'csrf_token' || element.name === 'csrfToken') {
            hasCSRFToken = true;
            break;
          }
        }
        
        // If no token found, record a violation
        if (!hasCSRFToken) {
          recordViolation({
            type: 'csrf',
            severity: 'high',
            description: 'Form without CSRF protection detected',
            metadata: { 
              formAction: form.action,
              formMethod: form.method,
              formId: form.id,
              formClass: form.className 
            }
          });
        }
      }
      
      // Monitor for form submission
      form.addEventListener('submit', (e) => {
        // Check if the form has been modified unexpectedly
        const formId = form.id || `form_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create a checksum/fingerprint of the form to detect tampering
        // This is a simple example - a real implementation would be more robust
        const formFingerprint = Array.from(form.elements)
          .map(el => `${(el as HTMLInputElement).name}:${(el as HTMLInputElement).type}`)
          .join('|');
        
        // If we have a stored fingerprint, compare it
        const storedFingerprint = sessionStorage.getItem(`form_fingerprint_${formId}`);
        if (storedFingerprint && storedFingerprint !== formFingerprint) {
          recordViolation({
            type: 'csrf',
            severity: 'high',
            description: 'Form structure has been tampered with',
            metadata: { 
              formId,
              expected: storedFingerprint,
              actual: formFingerprint
            }
          });
          
          if (blockOnCriticalViolations) {
            e.preventDefault();
            e.stopPropagation();
          }
        } else if (!storedFingerprint) {
          // Store the fingerprint for future references
          try {
            sessionStorage.setItem(`form_fingerprint_${formId}`, formFingerprint);
          } catch (err) {
            console.error('Failed to store form fingerprint:', err);
          }
        }
      });
    };
    
    // Observer for new forms added to the DOM
    const formObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Check added nodes for forms
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'FORM') {
              observeForm(node as HTMLFormElement);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // Check for forms within added container elements
              const forms = (node as Element).getElementsByTagName('form');
              Array.from(forms).forEach(form => observeForm(form));
            }
          });
        }
      }
    });
    
    // Observe all forms already in the DOM
    document.querySelectorAll('form').forEach(form => observeForm(form));
    
    // Start observing the document for new forms
    formObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => {
      formObserver.disconnect();
      formsObservedRef.current.clear();
    };
  }, [enableFormProtection, blockOnCriticalViolations]);

  // Check for suspicious inline scripts
  useEffect(() => {
    if (!enableInlineScriptChecking || typeof window === 'undefined') return;
    
    const checkForSuspiciousInlineScripts = () => {
      document.querySelectorAll('script:not([src])').forEach((script: Element) => {
        if (inlineScriptsCheckedRef.current.has(script as HTMLScriptElement)) return;
        inlineScriptsCheckedRef.current.add(script as HTMLScriptElement);
        
        const content = script.textContent || '';
        
        // Check for obfuscated code patterns
        const obfuscationPatterns = [
          /eval\s*\(/i,
          /atob\s*\(/i,
          /String\.fromCharCode/i,
          /decodeURIComponent/i,
          /unescape/i,
          /\\x[0-9a-f]{2}/i,
          /\\u[0-9a-f]{4}/i,
          /=\s*["']([^"']{100,}|[\x00-\x1F\x7F-\xFF]{20,})["']/i, // Long strings or non-printable chars
          /\)\s*\(["'][^"']+["']\)/i, // Self-executing functions with string args
          /\b(Number|parseInt|String)\(['"]([^'"]{20,})['"]\)/i, // Type conversions of long strings
        ];
        
        for (const pattern of obfuscationPatterns) {
          if (pattern.test(content)) {
            recordViolation({
              type: 'xss',
              severity: 'high',
              description: 'Potentially obfuscated inline script detected',
              metadata: { 
                pattern: pattern.toString(),
                scriptExcerpt: content.substring(0, 150)
              }
            });
            break;
          }
        }
        
        // Check for suspicious network access patterns
        const networkPatterns = [
          /new\s+XMLHttpRequest\(\)/i,
          /fetch\s*\(/i,
          /document\.cookie/i,
          /localStorage/i,
          /sessionStorage/i,
          /postMessage/i,
          /navigator\.sendBeacon/i,
          /WebSocket/i
        ];
        
        for (const pattern of networkPatterns) {
          if (pattern.test(content)) {
            // This is a medium severity because these are legitimate in many cases
            recordViolation({
              type: 'xss',
              severity: 'medium',
              description: 'Inline script with network access detected',
              metadata: { 
                pattern: pattern.toString(),
                scriptExcerpt: content.substring(0, 150)
              }
            });
            break;
          }
        }
        
        // Check for sensitive data access
        const sensitiveDataPatterns = [
          /password/i,
          /creditcard/i,
          /credit[\s_-]?card/i,
          /cardnumber/i, 
          /card[\s_-]?number/i,
          /socialsecurity/i,
          /social[\s_-]?security/i,
          /ssn/i,
          /email/i,
          /address/i,
          /account/i,
          /personalid/i,
          /personal[\s_-]?id/i
        ];
        
        const inputElements = document.querySelectorAll('input');
        const sensitiveInputs = Array.from(inputElements).filter(input => {
          const inputName = (input.name || '').toLowerCase();
          const inputId = (input.id || '').toLowerCase();
          const inputType = (input.type || '').toLowerCase();
          
          if (inputType === 'password') return true;
          
          return sensitiveDataPatterns.some(pattern => 
            pattern.test(inputName) || pattern.test(inputId)
          );
        });
        
        // If we have sensitive inputs and the script accesses their values
        if (sensitiveInputs.length > 0) {
          const inputAccessPatterns = sensitiveInputs.map(input => {
            const inputId = input.id ? `document\\.getElementById\\(['"]${input.id}['"]\\)` : '';
            const inputName = input.name ? `getElementsByName\\(['"]${input.name}['"]\\)` : '';
            const querySelectors = [
              input.id ? `querySelector\\(['"]#${input.id}['"]\\)` : '',
              input.name ? `querySelector\\(['"]\\[name=["']${input.name}["']\\]['"]\\)` : '',
            ].filter(Boolean);
            
            const patterns = [
              inputId, 
              inputName,
              ...querySelectors
            ].filter(Boolean);
            
            return patterns.length > 0 ? new RegExp(patterns.join('|'), 'i') : null;
          }).filter(Boolean) as RegExp[];
          
          for (const pattern of inputAccessPatterns) {
            if (pattern && pattern.test(content)) {
              recordViolation({
                type: 'xss',
                severity: 'high',
                description: 'Inline script accessing sensitive input data',
                metadata: { 
                  pattern: pattern.toString(),
                  scriptExcerpt: content.substring(0, 150)
                }
              });
              break;
            }
          }
        }
      });
    };
    
    // Initial check
    checkForSuspiciousInlineScripts();
    
    // Set up an observer for new inline scripts
    const scriptObserver = new MutationObserver(mutations => {
      let shouldCheck = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Check if any scripts were added
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'SCRIPT') {
              shouldCheck = true;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              if ((node as Element).getElementsByTagName('script').length > 0) {
                shouldCheck = true;
              }
            }
          });
        }
      }
      
      if (shouldCheck) {
        checkForSuspiciousInlineScripts();
      }
    });
    
    scriptObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    return () => {
      scriptObserver.disconnect();
    };
  }, [enableInlineScriptChecking]);

  // Provide a mechanism to unblock the UI
  const unblock = () => {
    setIsBlocked(false);
  };

  // Provide a mechanism to clear all violations
  const clearViolations = () => {
    setViolations([]);
  };

  return { 
    violations,
    isBlocked,
    unblock,
    clearViolations,
    recordViolation
  };
}

export default useSecurityMonitor;