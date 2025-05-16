# Runtime Security Controls

This document provides an overview of the runtime security controls implemented in the application to protect against common web vulnerabilities and attacks.

## Table of Contents

1. [Content Security Policy (CSP)](#content-security-policy)
2. [Security Headers](#security-headers)
3. [Client-Side Security Monitoring](#client-side-security-monitoring)
4. [Protection Against XSS](#protection-against-xss)
5. [Protection Against CSRF](#protection-against-csrf)
6. [Protection Against Malicious Redirects](#protection-against-malicious-redirects)
7. [Server-Side Security Middleware](#server-side-security-middleware)
8. [Best Practices & Usage Guide](#best-practices--usage-guide)

## Content Security Policy

The application implements a comprehensive Content Security Policy (CSP) to restrict the types of content that can be loaded and executed:

```javascript
// Enhanced Content Security Policy - configured in next.config.js
"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.monitor.azure.com https://az416426.vo.msecnd.net; connect-src 'self' https://*.amazonaws.com https://*.amazonaws-region.amazonaws.com https://az416426.vo.msecnd.net https://*.monitoring.azure.com; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:; media-src 'self'; child-src 'self' blob:; upgrade-insecure-requests; block-all-mixed-content; trusted-types dompurify;"
```

### Key CSP Directives

- `default-src 'self'`: Only allows content from the same origin by default
- `script-src`: Restricts JavaScript sources to the same origin and specific trusted domains
- `connect-src`: Controls what network connections are allowed
- `img-src`: Limits image sources to the same origin, data URIs, and secure HTTPS sources
- `object-src 'none'`: Blocks plugins like Flash, Java, etc.
- `frame-ancestors 'none'`: Prevents your site from being embedded in iframes (clickjacking protection)
- `upgrade-insecure-requests`: Automatically upgrades HTTP requests to HTTPS
- `block-all-mixed-content`: Blocks mixed content (HTTP content on HTTPS pages)
- `trusted-types dompurify`: Enables Trusted Types API with DOMPurify for safer DOM manipulation

## Security Headers

Additional security headers are implemented to enhance protection:

```javascript
// Security headers in next.config.js and middleware
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Cache-Control': 'no-store, max-age=0' // For sensitive pages
}
```

### Header Explanations

- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking by disallowing iframe embedding
- **X-XSS-Protection**: Enables browser's built-in XSS filter
- **Referrer-Policy**: Controls information sent in the Referer header
- **Permissions-Policy**: Restricts access to browser features
- **Cross-Origin-*-Policy**: Implements cross-origin isolation
- **Strict-Transport-Security**: Enforces HTTPS connections
- **Cache-Control**: Prevents caching of sensitive information

## Client-Side Security Monitoring

The application includes a comprehensive client-side security monitoring hook (`useSecurityMonitor`) that provides real-time detection and protection against:

- Content Security Policy violations
- XSS attempts
- DOM manipulation attacks
- Suspicious redirects
- Form tampering (CSRF)
- Inline script injections

### Implementation

The security monitor is integrated into the application via the `SecurityMonitor` component in `AppWrapper.tsx`:

```jsx
<SecurityMonitor 
  enableRedirectProtection={true}
  enableXSSDetection={true}
  enableCSPReporting={true}
  enableFormProtection={true}
  reportViolationsToBackend={true}
  onViolation={handleSecurityViolation}
  blockOnCriticalViolations={true}
  showSecurityBanner={process.env.NODE_ENV === 'development'}
/>
```

Security violations are reported to the server via the `/api/security/report` endpoint, which logs and potentially triggers alerts for critical issues.

## Protection Against XSS

Multiple layers of protection against Cross-Site Scripting (XSS) attacks are implemented:

1. **Content Security Policy**: Restricts script execution sources
2. **Input Sanitization**: The `sanitize.ts` utility provides functions for safely handling user input:
   - `escapeHtml()`: Escapes HTML special characters
   - `stripHtml()`: Removes all HTML tags
   - `sanitizeAttribute()`: Sanitizes values for HTML attributes
   - `sanitizeObject()`: Recursively sanitizes objects

3. **XSS Detection**: The `useSecurityMonitor` hook monitors for:
   - Suspicious inline scripts
   - DOM manipulation attempts
   - Potentially dangerous methods like `document.write`
   - Obfuscated code patterns

### Usage Example

```typescript
import { sanitize } from '@/lib/security/sanitize';

// Safe handling of user input
const userComment = "<script>alert('XSS')</script>Hello world";
const safeComment = sanitize.escapeHtml(userComment);
// Result: "&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;/script&gt;Hello world"

// Safe rendering in JSX
return <div dangerouslySetInnerHTML={{ __html: safeComment }} />;
```

## Protection Against CSRF

Cross-Site Request Forgery (CSRF) protection is implemented via:

1. **CSRF Token Component**: The `CSRFToken` component generates and manages secure tokens:
   ```jsx
   <form action="/api/submit" method="POST">
     <CSRFToken />
     {/* form fields */}
     <button type="submit">Submit</button>
   </form>
   ```

2. **withCSRFProtection HOC**: A Higher-Order Component that protects routes:
   ```jsx
   const ProtectedPage = withCSRFProtection(UserProfile, {
     redirectOnInvalid: true,
     redirectUrl: '/login',
     protectGET: false
   });
   ```

3. **Security Middleware**: Server-side validation of CSRF tokens
4. **Form Monitoring**: The `useSecurityMonitor` hook detects and blocks form submissions without valid CSRF tokens

## Protection Against Malicious Redirects

The application implements multiple protections against malicious redirects:

1. **URL Safety Checking**: The `urlSafetyCheck.ts` utility validates URLs before navigation:
   ```typescript
   import { isUrlSafe, safeNavigate } from '@/lib/security/urlSafetyCheck';
   
   // Check if a URL is safe
   const checkResult = isUrlSafe('https://example.com/page');
   if (checkResult.isSafe) {
     // URL is safe to navigate to
   }
   
   // Safe navigation helper
   safeNavigate('https://example.com/page', {
     openInNewTab: true,
     confirmExternal: true
   });
   ```

2. **SafeLink Component**: A secure wrapper for Next.js `Link` component:
   ```jsx
   <SafeLink 
     href="https://example.com" 
     openInNewTab={true}
     confirmExternal={true}
   >
     External Link
   </SafeLink>
   ```

3. **Redirect Monitoring**: The `useSecurityMonitor` hook detects and blocks suspicious redirects to:
   - Known malicious domains
   - Data/JavaScript URIs
   - Unexpected external domains

## Server-Side Security Middleware

The application includes server-side middleware (`securityMiddleware.ts`) that provides additional protections:

1. **Request Filtering**: Blocks requests to suspicious paths
2. **Rate Limiting**: Prevents abuse of sensitive endpoints
3. **Security Headers**: Adds security headers to all responses
4. **Cross-Origin Protection**: Implements cross-origin isolation

The middleware is integrated into the Next.js request pipeline in `middleware.ts`.

## Best Practices & Usage Guide

### For Developers

1. **URL Handling**
   - Always use the `SafeLink` component instead of plain `<a>` tags or `next/link`
   - Validate URLs with `isUrlSafe()` before programmatic navigation
   - Never use `window.location = userProvidedUrl` directly

2. **Form Handling**
   - Include the `<CSRFToken />` component in all forms
   - Use the `withCSRFProtection` HOC for pages with sensitive forms
   - Sanitize all user inputs with the appropriate sanitization functions

3. **Content Rendering**
   - Never use `dangerouslySetInnerHTML` with unsanitized content
   - Use `sanitize.stripHtml()` or `sanitize.escapeHtml()` for user-generated content
   - Prefer React's built-in escaping by using JSX over string manipulation

4. **API Endpoints**
   - Validate CSRF tokens for all state-changing operations
   - Implement proper input validation and sanitization
   - Use appropriate HTTP methods (GET for read-only, POST/PUT/DELETE for state changes)

### Testing Security Controls

The security controls can be tested as follows:

1. **CSP Testing**
   - Use the [CSP Evaluator](https://csp-evaluator.withgoogle.com/) to validate your CSP
   - Check browser console for CSP violation reports

2. **XSS Testing**
   - Try injecting `<script>alert('XSS')</script>` into form fields
   - Verify that the security monitor detects and blocks the attempt

3. **CSRF Testing**
   - Try submitting forms after clearing session storage
   - Verify that submissions without valid CSRF tokens are blocked

4. **Redirect Testing**
   - Try navigating to known malicious domains
   - Verify that the `SafeLink` component blocks suspicious URLs

5. **Security Headers**
   - Use [Security Headers](https://securityheaders.com/) to scan your application
   - Verify all required headers are present and correctly configured