'use client';

import { useState } from 'react';

// Security incident types
export type SecurityIncidentType = 
  | 'xss' 
  | 'csrf' 
  | 'clickjacking' 
  | 'data-leak' 
  | 'suspicious-network' 
  | 'dom-tampering'
  | 'malicious-redirect'
  | 'storage-manipulation'
  | 'iframe-injection'
  | 'script-injection'
  | 'event-hijacking'
  | 'other';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityIncident {
  type: SecurityIncidentType;
  severity: SecuritySeverity;
  timestamp: number;
  url: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface ClientSecurityOptions {
  /** Enable DOM tampering detection */
  detectDOMTampering?: boolean;
  /** Enable event hijacking detection */
  detectEventHijacking?: boolean;
  /** Enable network request monitoring */
  monitorNetworkRequests?: boolean;
  /** Enable storage monitoring (localStorage, sessionStorage) */
  monitorStorage?: boolean;
  /** Enable iframe embedding prevention */
  preventIframeEmbedding?: boolean;
  /** Block navigation to suspicious URLs */
  blockSuspiciousRedirects?: boolean;
  /** URL for reporting security incidents */
  reportEndpoint?: string;
  /** Enable sending reports to backend */
  enableReporting?: boolean;
  /** Block UI on critical security issues */
  blockOnCritical?: boolean;
  /** List of allowed domains for network requests */
  allowedDomains?: string[];
}

/**
 * Simplified version of useClientSecurity hook for development
 * 
 * This is a minimal version that doesn't perform actual monitoring
 * but maintains the same interface for compatibility
 */
export function useClientSecurity(options: ClientSecurityOptions = {}) {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  
  // For development, we'll just log a message that security is disabled
  console.log('[DEV] Client security monitoring is simplified for development');
  
  // Create a recordIncident function that actually does something minimal
  const recordIncident = (incident: Omit<SecurityIncident, 'timestamp' | 'url'>): SecurityIncident => {
    const newIncident: SecurityIncident = {
      ...incident,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : ''
    };
    
    setIncidents(prev => [newIncident, ...prev]);
    
    if (options.blockOnCritical && incident.severity === 'critical') {
      setIsBlocked(true);
    }
    
    console.log(`[DEV] Security incident detected: ${incident.type} - ${incident.description}`);
    
    return newIncident;
  };
  
  return {
    incidents,
    isBlocked,
    unblock: () => setIsBlocked(false),
    clearIncidents: () => setIncidents([]),
    recordIncident
  };
}

export default useClientSecurity;