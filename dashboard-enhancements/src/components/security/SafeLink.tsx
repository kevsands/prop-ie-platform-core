'use client';

import { useCallback, MouseEvent, ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';
import { isUrlSafe } from '@/lib/security/urlSafetyCheck';

interface SafeLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  children: ReactNode;
  className?: string;
  openInNewTab?: boolean;
  onUnsafeLink?: (url: string, reason: string) => void;
  confirmExternal?: boolean;
  allowRelative?: boolean;
  onlyAllowTrustedDomains?: boolean;
}

/**
 * A secure wrapper for Next.js Link component that protects against malicious redirects
 * 
 * This component adds security checks to link navigation:
 * - Prevents navigation to known malicious domains
 * - Adds rel="noopener noreferrer" to external links
 * - Optionally confirms external navigation
 * - Supports custom unsafe link handling
 * 
 * @param props The link props and security options
 */
export default function SafeLink({
  href,
  children,
  className = '',
  openInNewTab = false,
  onUnsafeLink,
  confirmExternal = false,
  allowRelative = true,
  onlyAllowTrustedDomains = false,
  ...props
}: SafeLinkProps) {
  const isExternal = href && typeof href === 'string' && !href.startsWith('/');
  
  const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    // Early exit for non-string hrefs (shouldn't happen with our type)
    if (typeof href !== 'string') return;
    
    // Check URL safety
    const safetyCheck = isUrlSafe(href, {
      allowRelative,
      onlyAllowTrustedDomains,
    });
    
    if (!safetyCheck.isSafe) {
      e.preventDefault();
      
      // Call the unsafe link handler if provided
      if (onUnsafeLink) {
        onUnsafeLink(href, safetyCheck.reason || 'Unknown safety issue');
      } else {
        console.warn(`Navigation to unsafe URL blocked: ${href}`, safetyCheck.reason);
      }
      
      return;
    }
    
    // Confirmation for external links
    if (confirmExternal && isExternal) {
      const confirmed = window.confirm(`You're navigating to an external site: ${href}. Do you want to continue?`);
      if (!confirmed) {
        e.preventDefault();
        return;
      }
    }
  }, [href, allowRelative, onlyAllowTrustedDomains, confirmExternal, isExternal, onUnsafeLink]);
  
  if (isExternal) {
    // Handle external links
    return (
      <a 
        href={href}
        className={className}
        target={openInNewTab ? '_blank' : undefined}
        rel="noopener noreferrer"
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }
  
  // Handle internal links with Next.js Link
  return (
    <Link
      href={href}
      className={className}
      target={openInNewTab ? '_blank' : undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}