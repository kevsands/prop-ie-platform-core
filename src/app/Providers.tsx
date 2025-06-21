'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { TransactionProvider } from '@/context/TransactionContext';

// Create a client
const queryClient = new QueryClient({ 
  defaultOptions: { 
    queries: {
      staleTime: 60 * 1000,
      retry: false
    }
  }
});

/**
 * Core Providers component for the application
 * 
 * This handles the provider tree in the correct order:
 * 1. QueryClientProvider - Provides React-Query for data fetching
 * 2. AuthProvider - Our app-specific auth context
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TransactionProvider>
          {children}
        </TransactionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}