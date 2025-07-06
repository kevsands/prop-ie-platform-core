'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useClientSecurity, { 
  SecurityIncident, 
  ClientSecurityOptions,
  SecurityIncidentType,
  SecuritySeverity
} from '@/hooks/useClientSecurity';

// Create context for security monitoring
export interface SecurityContextType {
  incidents: SecurityIncident[];
  isBlocked: boolean;
  unblock: () => void;
  clearIncidents: () => void;
  recordIncident: (incident: Omit<SecurityIncident, 'timestamp' | 'url'>) => SecurityIncident;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Props for the SecurityProvider component
export interface SecurityProviderProps {
  children: ReactNode;
  options?: ClientSecurityOptions;
  renderBlockedView?: (unblock: () => void, incident?: SecurityIncident) => ReactNode;
}

/**
 * Provider component for client-side security monitoring
 * 
 * Wraps the application with security monitoring capabilities and
 * provides a context for accessing security incidents and functions.
 */
export function ClientSecurityProvider({
  children,
  options,
  renderBlockedView
}: SecurityProviderProps) {
  // Initialize the security monitoring hook
  const { 
    incidents, 
    isBlocked, 
    unblock, 
    clearIncidents,
    recordIncident
  } = useClientSecurity(options);
  
  // Block UI when critical security incidents are detected
  if (isBlocked) {
    // Use custom blocked view if provided
    if (renderBlockedView) {
      return <>{renderBlockedView(unblock, incidents[0])}</>;
    }
    
    // Default blocked view
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-100/95">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="ml-2 text-xl font-bold text-gray-800">Security Alert</h2>
          </div>
          <p className="mb-4 text-gray-700">
            A critical security issue has been detected. This page has been blocked to protect your data.
          </p>
          {incidents.length > 0 && (
            <div className="p-3 mb-4 text-sm bg-gray-100 rounded">
              <p className="font-semibold text-gray-700">
                {incidents[0].type.toUpperCase()}: {incidents[0].description}
              </p>
            </div>
          )}
          <div className="flex justify-between">
            <button
              onClick={() => {
                clearIncidents();
                unblock();
              }}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Proceed Anyway (Unsafe)
            </button>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            If you believe this is a false positive, please contact support.
          </p>
        </div>
      </div>
    );
  }
  
  // Provide security context to children
  return (
    <SecurityContext.Provider value={{ incidents, isBlocked, unblock, clearIncidents, recordIncident }}>
      {children}
    </SecurityContext.Provider>
  );
}

/**
 * Hook for accessing security monitoring functionality
 * 
 * @returns Security context with incidents and methods
 */
export function useSecurityContext(): SecurityContextType {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}

// Optional security banner component
interface SecurityBannerProps {
  show?: boolean;
}

/**
 * Component to display security incidents as a banner
 */
export function SecurityBanner({ show = true }: SecurityBannerProps) {
  const { incidents } = useSecurityContext();
  
  if (!show || incidents.length === 0) {
    return null;
  }
  
  const latestIncident = incidents[0];
  
  // Color based on severity
  const colors = {
    low: 'bg-blue-100 border-blue-200',
    medium: 'bg-yellow-100 border-yellow-200',
    high: 'bg-orange-100 border-orange-200',
    critical: 'bg-red-100 border-red-200',
  };
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 p-4 border-t ${colors[latestIncident.severity]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="ml-2 text-sm text-gray-700">
            <span className="font-medium">{latestIncident.severity.toUpperCase()} Security Warning:</span>{' '}
            {latestIncident.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClientSecurityProvider;