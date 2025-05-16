/**
 * URL safety utility functions to protect against malicious redirects
 */

const KNOWN_MALICIOUS_DOMAINS = [
  'example-malicious-domain.com', // Example domain for demonstration purposes
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
  'shorturl.at',
  // Add more known malicious domains as needed
];

// Trusted domains for whitelist approach
const TRUSTED_DOMAINS = [
  // Add your own domain
  'prop-ie-aws-app.vercel.app',
  'amazonaws.com',
  'amazon.com',
  'google.com',
  'google-analytics.com',
  'microsoft.com',
  'azure.com',
  'vercel.app',
  'auth0.com',
  'amplify.aws',
  'cloudfront.net',
  // Add other trusted domains as needed
];

interface URLSafetyCheckResult {
  isSafe: boolean;
  reason?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Check if a URL is safe or potentially malicious
 * 
 * @param url The URL to check
 * @param options Configuration options
 * @returns Safety check result with reason if unsafe
 */
export function isUrlSafe(
  url: string,
  options: {
    allowRelative?: boolean;
    checkForShorteners?: boolean;
    onlyAllowTrustedDomains?: boolean;
  } = {}
): URLSafetyCheckResult {
  const {
    allowRelative = true,
    checkForShorteners = true,
    onlyAllowTrustedDomains = false,
  } = options;

  // Handle relative URLs (they're generally safe)
  if (url.startsWith('/') && !url.startsWith('//')) {
    return {
      isSafe: allowRelative,
      reason: allowRelative ? undefined : 'Relative URLs are not allowed in this context',
      severity: 'low',
    };
  }

  try {
    // Determine base for relative URLs
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
    const urlObj = new URL(url, base);

    // Check for javascript: or data: URLs
    if (['javascript:', 'data:', 'vbscript:', 'file:'].includes(urlObj.protocol)) {
      return {
        isSafe: false,
        reason: `Potentially malicious protocol: ${urlObj.protocol}`,
        severity: 'critical',
      };
    }

    // Check for known malicious domains
    if (KNOWN_MALICIOUS_DOMAINS.some(domain => urlObj.hostname.includes(domain))) {
      return {
        isSafe: false,
        reason: `URL contains known malicious domain: ${urlObj.hostname}`,
        severity: 'critical',
      };
    }

    // Check for URL shorteners if enabled
    if (checkForShorteners) {
      const knownShorteners = [
        'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'cli.gs', 'ow.ly',
        'buff.ly', 'adf.ly', 'j.mp', 'rebrand.ly', 'short.io'
      ];
      
      if (knownShorteners.some(shortener => urlObj.hostname.includes(shortener))) {
        return {
          isSafe: false,
          reason: `URL uses a shortener service which could hide malicious destinations: ${urlObj.hostname}`,
          severity: 'high',
        };
      }
    }

    // Enforce trusted domains if enabled
    if (onlyAllowTrustedDomains) {
      const isTrustedDomain = TRUSTED_DOMAINS.some(domain => urlObj.hostname.includes(domain));
      
      if (!isTrustedDomain) {
        return {
          isSafe: false,
          reason: `URL domain is not in the trusted domains list: ${urlObj.hostname}`,
          severity: 'medium',
        };
      }
    }

    // Check for suspicious URL patterns
    const suspiciousPatterns = [
      /\.(tk|ml|ga|cf|gq|top)$/, // Common free domains used for phishing
      /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP addresses
      /[^\w\-.:%]/, // URLs with unusual characters
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(urlObj.hostname)) {
        return {
          isSafe: false,
          reason: `URL contains suspicious pattern: ${urlObj.hostname}`,
          severity: 'medium',
        };
      }
    }

    // Check for excessive subdomains (potential DNS tunneling or evasion)
    const subdomainCount = urlObj.hostname.split('.').length - 2;
    if (subdomainCount > 3) {
      return {
        isSafe: false,
        reason: `URL contains excessive subdomains: ${urlObj.hostname}`,
        severity: 'medium',
      };
    }

    // URL passed all safety checks
    return {
      isSafe: true,
      severity: 'low',
    };
  } catch (error) {
    // Invalid URL format
    return {
      isSafe: false,
      reason: `Invalid URL format: ${error instanceof Error ? error.message : String(error)}`,
      severity: 'high',
    };
  }
}

/**
 * Safely handle navigation to external URLs
 * 
 * @param url The URL to navigate to
 * @param options Safety and navigation options
 * @returns Promise that resolves when navigation is complete or rejected if unsafe
 */
export function safeNavigate(
  url: string,
  options: {
    allowRelative?: boolean;
    checkForShorteners?: boolean;
    onlyAllowTrustedDomains?: boolean;
    openInNewTab?: boolean;
    addReferrerPolicy?: boolean;
    addNoopener?: boolean;
    addNoreferrer?: boolean;
    confirmExternalNavigation?: boolean;
  } = {}
): Promise<boolean> {
  const {
    allowRelative = true,
    checkForShorteners = true,
    onlyAllowTrustedDomains = false,
    openInNewTab = false,
    addReferrerPolicy = true,
    addNoopener = true,
    addNoreferrer = true,
    confirmExternalNavigation = false,
  } = options;

  return new Promise((resolve, reject) => {
    const safetyCheck = isUrlSafe(url, {
      allowRelative,
      checkForShorteners,
      onlyAllowTrustedDomains,
    });

    if (!safetyCheck.isSafe) {
      reject(new Error(`Unsafe URL blocked: ${safetyCheck.reason}`));
      return;
    }

    try {
      // Check if it's an external URL
      const isExternal = (() => {
        // Handle relative URLs
        if (url.startsWith('/') && !url.startsWith('//')) {
          return false;
        }

        // Compare hostnames for absolute URLs
        if (typeof window !== 'undefined') {
          const urlObj = new URL(url, window.location.origin);
          return urlObj.hostname !== window.location.hostname;
        }
        
        return false;
      })();

      // Confirm external navigation if enabled
      if (isExternal && confirmExternalNavigation && typeof window !== 'undefined') {
        const urlObj = new URL(url, window.location.origin);
        const confirmed = window.confirm(
          `You are navigating to an external site: ${urlObj.hostname}. Do you wish to continue?`
        );
        
        if (!confirmed) {
          resolve(false);
          return;
        }
      }

      // Handle the navigation
      if (typeof window !== 'undefined') {
        if (openInNewTab || isExternal) {
          // Construct safety attributes for the window.open
          const features = [];
          
          if (addNoopener) features.push('noopener');
          if (addNoreferrer) features.push('noreferrer');
          
          // Open in a new tab with security attributes
          const newWindow = window.open(url, '_blank', features.join(','));
          
          // Apply referrer policy if possible
          if (newWindow && addReferrerPolicy) {
            try {
              // Attempt to add meta referrer policy (may not work due to cross-origin restrictions)
              newWindow.document.head.innerHTML += `
                <meta name="referrer" content="no-referrer">
              `;
            } catch (e) {
              // Ignore errors from cross-origin frames
            }
          }
          
          resolve(true);
        } else {
          // Navigate in the same window
          window.location.href = url;
          resolve(true);
        }
      } else {
        // No window object available
        reject(new Error('No window object available for navigation'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Create a safe anchor tag with security attributes
 * 
 * @param url The URL to link to
 * @param text The link text
 * @param options Additional options
 * @returns HTML for a secure anchor tag
 */
export function createSafeAnchor(
  url: string,
  text: string,
  options: {
    className?: string;
    id?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    title?: string;
    ariaLabel?: string;
  } = {}
): string {
  const {
    className = '',
    id = '',
    target = '_self',
    title = '',
    ariaLabel = '',
  } = options;

  // Check URL safety
  const safetyCheck = isUrlSafe(url);
  if (!safetyCheck.isSafe) {
    return `<span class="unsafe-link">${text}</span>`;
  }

  // Determine if external link
  const isExternal = !url.startsWith('/') || url.startsWith('//');
  
  // Add security attributes for external links
  const securityAttrs = isExternal
    ? 'rel="noopener noreferrer" referrerpolicy="no-referrer"'
    : '';
  
  // Add other attributes if provided
  const classAttr = className ? `class="${className}"` : '';
  const idAttr = id ? `id="${id}"` : '';
  const titleAttr = title ? `title="${title}"` : '';
  const ariaLabelAttr = ariaLabel ? `aria-label="${ariaLabel}"` : '';
  
  return `<a href="${url}" ${target ? `target="${target}"` : ''} ${securityAttrs} ${classAttr} ${idAttr} ${titleAttr} ${ariaLabelAttr}>${text}</a>`;
}

export default {
  isUrlSafe,
  safeNavigate,
  createSafeAnchor
};