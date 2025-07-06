'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { enhancedAnalytics } from '@/lib/security/enhancedAnalytics';
import { SecurityMonitor, SecurityMonitorProps } from '@/lib/security/security-exports';

interface SecurityContextType {
  securityLevel: 'low' | 'medium' | 'high';
  isMonitoring: boolean;
  enableMonitoring: () => void;
  disableMonitoring: () => void;
  setSecurityLevel: (level: 'low' | 'medium' | 'high') => void;
  logSecurityEvent: (event: Record<string, any>) => void;
}

const SecurityContext = createContext<SecurityContextType>({
  securityLevel: 'medium',
  isMonitoring: false,
  enableMonitoring: () => {},
  disableMonitoring: () => {},
  setSecurityLevel: () => {},
  logSecurityEvent: () => {},
});

export const useAppSecurity = () => useContext(SecurityContext);

interface AppSecurityProviderProps {
  children: ReactNode;
}

export function AppSecurityProvider({ children }: AppSecurityProviderProps) {
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Initialize security monitoring based on stored preferences or defaults
    const storedLevel = localStorage.getItem('security-level');
    if (storedLevel && ['low', 'medium', 'high'].includes(storedLevel)) {
      setSecurityLevel(storedLevel as 'low' | 'medium' | 'high');
    }

    const monitoringEnabled = localStorage.getItem('security-monitoring') === 'true';
    setIsMonitoring(monitoringEnabled);

    // Initialize analytics
    enhancedAnalytics.init({
      enabledFeatures: monitoringEnabled ? ['all'] : ['critical'],
      securityLevel: storedLevel as any || 'medium',
    });
  }, []);

  const enableMonitoring = () => {
    setIsMonitoring(true);
    localStorage.setItem('security-monitoring', 'true');
    enhancedAnalytics.enableFeature('all');
  };

  const disableMonitoring = () => {
    setIsMonitoring(false);
    localStorage.setItem('security-monitoring', 'false');
    enhancedAnalytics.disableFeature('behavioral');
  };

  const handleSetSecurityLevel = (level: 'low' | 'medium' | 'high') => {
    setSecurityLevel(level);
    localStorage.setItem('security-level', level);
    enhancedAnalytics.setSecurityLevel(level);
  };

  const logSecurityEvent = (event: Record<string, any>) => {
    enhancedAnalytics.logEvent('security_event', event);
  };

  const contextValue: SecurityContextType = {
    securityLevel,
    isMonitoring,
    enableMonitoring,
    disableMonitoring,
    setSecurityLevel: handleSetSecurityLevel,
    logSecurityEvent,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {isMonitoring && <SecurityMonitor level={securityLevel} />}
      {children}
    </SecurityContext.Provider>
  );
}