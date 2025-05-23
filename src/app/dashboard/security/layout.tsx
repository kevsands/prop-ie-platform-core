import React from 'react';
import { AppSecurityProvider } from '@/components/security/AppSecurityProvider';

/**
 * Security Dashboard Layout
 * 
 * This component wraps all security dashboard pages with the security provider
 * to ensure consistent security monitoring and protection.
 */
export default function SecurityDashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <AppSecurityProvider>
      {children}
    </AppSecurityProvider>
  );
}