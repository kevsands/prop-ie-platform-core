'use client';

import React from 'react';
// Corrected import for @tanstack/react-query v5, common for Next.js App Router
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/toast-context';
import { SessionProvider } from 'next-auth/react';
// For React Query Devtools (optional, ensure it's installed if used):
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a new QueryClient instance
// It's good practice to create it once and reuse it.
// For Next.js App Router, you might want to ensure it's only created once per request on the server,
// or once per client session. A simple way for client components is to instantiate it outside the component
// or use useState to ensure it's stable.

// Option 1: Instantiate outside if this component is only rendered once per client session effectively.
// const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  // Option 2: Use useState to ensure the client is stable across re-renders of this component.
  // This is generally safer for components that might re-render.
  const [queryClient] = React.useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          // Global default query options can go here
          // staleTime: 5 * 1000 * 60, // 5 minutes
          // refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
        </ToastProvider>
        {/* Optional: React Query Devtools for easier debugging during development */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </SessionProvider>
  );
} 