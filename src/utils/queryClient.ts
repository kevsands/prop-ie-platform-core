import { QueryClient } from '@tanstack/react-query';

// Create a client with v4 configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v4)
      retry: (failureCount: number, error: any) => {
        if (error.status === 404) return false;
        if (error.status === 401) return false;
        return failureCount <3;
      },
    mutations: {
      retry: false}});

export default queryClient;
