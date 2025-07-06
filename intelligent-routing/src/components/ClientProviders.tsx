'use client';

/**
 * Client Providers Component
 * 
 * This component wraps client-side only providers that should not be rendered on the server.
 * It includes:
 * - AWS Amplify Provider for initialization
 * - Authentication context provider
 * - Notification context provider
 * - React Query provider for data fetching
 * - Security features that require browser APIs
 */

import React, { useState } from 'react';
import AmplifyProvider from '@/components/AmplifyProvider';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ProvidersWrapperProps } from '@/types/common/components';
// Import from React Query package
import { QueryClient as ReactQueryClient } from '@tanstack/react-query';
import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppSecurityProvider } from '@/components/security/AppSecurityProvider';

/**
 * Client Providers component wraps all client-side context providers
 * following our architectural pattern of explicit provider initialization.
 */
export function ClientProviders({ children, includeAll = true, include = [] }: ProvidersWrapperProps) {
  // Initialize React Query client
  const [queryClient] = useState(() => new ReactQueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));
  
  const [showDevtools] = useState(process.env.NODE_ENV === 'development');
  
  // Helper to check if a provider should be included
  const shouldInclude = (name: string) => includeAll || include.includes(name as any);
  
  // Wrap children with each enabled provider
  let wrappedChildren = <>{children}</>;
  
  // Wrap with notification provider if included
  if (shouldInclude('notifications')) {
    wrappedChildren = (
      <NotificationProvider>
        {wrappedChildren}
      </NotificationProvider>
    );
  }
  
  // Wrap with auth provider if included
  if (shouldInclude('auth')) {
    wrappedChildren = (
      <AuthProvider>
        {wrappedChildren}
      </AuthProvider>
    );
  }
  
  // Wrap with security provider if included
  if (shouldInclude('security')) {
    wrappedChildren = (
      <AppSecurityProvider>
        {wrappedChildren}
      </AppSecurityProvider>
    );
  }
  
  // Wrap with React Query provider if included
  if (shouldInclude('query')) {
    wrappedChildren = (
      <ReactQueryClientProvider client={queryClient}>
        {wrappedChildren}
        {showDevtools && <ReactQueryDevtools initialIsOpen={false} position="bottom" />}
      </ReactQueryClientProvider>
    );
  }
  
  // Always wrap with AmplifyProvider as it's required for other providers
  return (
    <AmplifyProvider>
      {wrappedChildren}
    </AmplifyProvider>
  );
}

export default ClientProviders;