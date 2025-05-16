# Client-Side Security Monitoring

This document explains the client-side security monitoring system implemented in this application, which provides real-time detection and protection against various security threats.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Implementation Details](#implementation-details)
4. [Security Incidents](#security-incidents)
5. [Usage Guide](#usage-guide)
6. [Integration Examples](#integration-examples)
7. [Customization](#customization)
8. [Best Practices](#best-practices)

## Overview

The client-side security monitoring system provides runtime protection against:

- Cross-Site Scripting (XSS) attacks
- DOM tampering
- Event hijacking
- Suspicious network requests
- Storage manipulation
- Iframe injection
- Malicious redirects

It offers both detection and prevention capabilities, with customizable severity levels and response actions.

## Features

### Real-Time Monitoring

- **DOM Tampering Detection**: Monitors for dynamic script injection and DOM modifications
- **Event Hijacking Detection**: Tracks event listeners for suspicious patterns
- **Network Monitoring**: Inspects fetch and XMLHttpRequest calls for suspicious endpoints
- **Storage Monitoring**: Checks localStorage/sessionStorage operations for malicious patterns
- **Redirect Protection**: Prevents navigation to suspicious URLs

### Protection Mechanisms

- **Blocking**: Optionally block critical security issues from executing
- **Reporting**: Send security violations to a server-side endpoint
- **UI Isolation**: Isolate the UI when critical issues are detected
- **Alerts**: Display warnings for non-critical issues

### Configuration Options

- Customizable security rules
- Adjustable severity thresholds
- Allowlist for trusted domains
- Development vs. production modes

## Implementation Details

### Core Components

1. **useClientSecurity Hook**: The primary hook that implements security monitoring logic
2. **ClientSecurityProvider**: Context provider component that wraps the application
3. **SecurityBanner**: Optional component to display security warnings
4. **Server-Side Reporting Endpoint**: API route for centralized security monitoring

### Hook Usage

The `useClientSecurity` hook monitors the application and returns incidents and control functions:

```typescript
const { 
  incidents,       // Array of detected incidents
  isBlocked,       // Whether UI is currently blocked
  unblock,         // Function to unblock UI
  clearIncidents,  // Function to clear incident history
  recordIncident   // Function to manually record incidents
} = useClientSecurity({
  // Options...
});
```

### Provider Component

The `ClientSecurityProvider` component wraps the application and provides security context:

```tsx
<ClientSecurityProvider 
  options={{
    detectDOMTampering: true,
    detectEventHijacking: true,
    monitorNetworkRequests: true,
    monitorStorage: true,
    preventIframeEmbedding: true,
    blockSuspiciousRedirects: true,
    reportEndpoint: '/api/security/report',
    enableReporting: true,
    blockOnCritical: true,
    allowedDomains: ['example.com', 'trusted-cdn.com']
  }}
>
  <App />
</ClientSecurityProvider>
```

## Security Incidents

Security incidents are classified by type and severity:

### Incident Types

- `xss`: Cross-Site Scripting attempts
- `csrf`: Cross-Site Request Forgery attempts
- `clickjacking`: UI redressing attacks
- `data-leak`: Potential data exfiltration
- `suspicious-network`: Suspicious network requests
- `dom-tampering`: DOM manipulation attacks
- `malicious-redirect`: Redirect to malicious sites
- `storage-manipulation`: Dangerous storage operations
- `iframe-injection`: Malicious iframe usage
- `script-injection`: Dynamic script injection
- `event-hijacking`: Event listener manipulation
- `other`: Other security issues

### Severity Levels

- `low`: Informational, possibly suspicious
- `medium`: Suspicious but not definitively malicious
- `high`: Likely malicious activity
- `critical`: Definite security threat

### Incident Structure

```typescript
interface SecurityIncident {
  type: SecurityIncidentType;
  severity: SecuritySeverity;
  timestamp: number;
  url: string;
  description: string;
  metadata?: Record<string, any>;
}
```

## Usage Guide

### Basic Setup

1. Add the provider to your root component:

```tsx
// _app.tsx or equivalent root component
import ClientSecurityProvider from '@/components/security/ClientSecurityProvider';

function MyApp({ Component, pageProps }) {
  return (
    <ClientSecurityProvider>
      <Component {...pageProps} />
    </ClientSecurityProvider>
  );
}
```

2. Create a server-side endpoint for reporting:

```typescript
// api/security/report/route.ts
export async function POST(request: NextRequest) {
  const { incident } = await request.json();
  
  // Log the incident
  console.warn(`Security incident: ${incident.type} (${incident.severity})`, incident);
  
  // Save to database, send alerts, etc.
  
  return NextResponse.json({ status: 'received' });
}
```

### Using the Security Context

Access security information and functions in any component:

```tsx
import { useSecurityContext } from '@/components/security/ClientSecurityProvider';

function MyComponent() {
  const { incidents, recordIncident } = useSecurityContext();
  
  // Manually record a security incident
  const handleSuspiciousAction = () => {
    recordIncident({
      type: 'suspicious-network',
      severity: 'medium',
      description: 'User attempted to access restricted API',
    });
  };
  
  return (
    <div>
      <h2>Security Incidents: {incidents.length}</h2>
      {/* Component content */}
    </div>
  );
}
```

## Integration Examples

### With Form Submission

```tsx
import { useSecurityContext } from '@/components/security/ClientSecurityProvider';

function ContactForm() {
  const { recordIncident } = useSecurityContext();
  
  const handleSubmit = async (formData) => {
    // Check for suspicious content
    if (containsSuspiciousContent(formData.message)) {
      recordIncident({
        type: 'xss',
        severity: 'high',
        description: 'Suspicious content in form submission',
        metadata: { formId: 'contact' }
      });
      return;
    }
    
    // Proceed with normal submission
    await submitForm(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### With Navigation

```tsx
import { useSecurityContext } from '@/components/security/ClientSecurityProvider';
import { useRouter } from 'next/navigation';

function NavigationLink({ href, children }) {
  const router = useRouter();
  const { recordIncident } = useSecurityContext();
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // Check URL before navigation
    if (isUrlSuspicious(href)) {
      recordIncident({
        type: 'malicious-redirect',
        severity: 'high',
        description: `Blocked navigation to suspicious URL: ${href}`,
      });
      return;
    }
    
    // Safe to navigate
    router.push(href);
  };
  
  return <a href={href} onClick={handleClick}>{children}</a>;
}
```

## Customization

### Custom Blocked View

You can provide a custom UI for when security issues block the application:

```tsx
<ClientSecurityProvider
  renderBlockedView={(unblock, incident) => (
    <div className="security-block-screen">
      <h1>Security Alert</h1>
      <p>We detected: {incident?.description}</p>
      <button onClick={unblock}>Continue anyway</button>
    </div>
  )}
>
  <App />
</ClientSecurityProvider>
```

### Adding Custom Rules

You can extend the security monitoring by adding custom detection logic:

```tsx
function MyComponent() {
  const { recordIncident } = useSecurityContext();
  
  useEffect(() => {
    // Custom security check
    const checkForVulnerability = () => {
      if (window.someVulnerableCondition) {
        recordIncident({
          type: 'other',
          severity: 'high',
          description: 'Custom vulnerability detected',
        });
      }
    };
    
    const interval = setInterval(checkForVulnerability, 5000);
    return () => clearInterval(interval);
  }, [recordIncident]);
  
  return <div>{/* Component content */}</div>;
}
```

## Best Practices

1. **Defense in Depth**: Use client-side security as one layer in a multi-layered security strategy
2. **Server Validation**: Always validate data on the server side, regardless of client-side checks
3. **CSP Implementation**: Combine with Content Security Policy for maximum protection
4. **Performance Considerations**: Monitor performance impact and adjust monitoring intensity if needed
5. **False Positives**: Tune configurations to minimize false positives based on application needs
6. **Incident Response**: Create clear procedures for responding to reported security incidents
7. **Regular Updates**: Keep the security monitoring rules updated with new threat patterns

## References

- [OWASP Client-Side Security](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOM-Based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)