/**
 * React Query Configuration
 * 
 * This file defines global configuration for React Query,
 * including cache strategies and default options.
 */

import { QueryClient } from '@tanstack/react-query';

// Define query client configuration
const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Cache time in milliseconds (10 minutes)
      cacheTime: 10 * 60 * 1000,

      // Time until query is marked as stale (5 minutes)
      staleTime: 5 * 60 * 1000,

      // Retry failed queries
      retry: 1,

      // Disable refetch on window focus for most queries (can be overridden)
      refetchOnWindowFocus: false,

      // Don't refetch on reconnect by default
      refetchOnReconnect: false},
    mutations: {
      // Retry failed mutations
      retry: 1};

// Create the query client with configuration
export const queryClient = new QueryClient(queryClientConfig);

// Cached query keys - organize by domain
export const queryKeys = {
  // Development-related queries
  developments: {
    all: ['developments'] as const,
    lists: () => [...queryKeys.developments.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.developments.lists(), filters] as const,
    details: () => [...queryKeys.developments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.developments.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.developments.all, 'slug', slug] as const,
    statistics: (id: string) => [...queryKeys.developments.all, 'statistics', id] as const},

  // User and auth related queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    currentUser: () => [...queryKeys.auth.user(), 'current'] as const,
    permissions: () => [...queryKeys.auth.user(), 'permissions'] as const},

  // Dashboard related queries
  dashboard: {
    all: ['dashboard'] as const,
    developer: () => [...queryKeys.dashboard.all, 'developer'] as const,
    metrics: () => [...queryKeys.dashboard.all, 'metrics'] as const,
    projects: () => [...queryKeys.dashboard.all, 'projects'] as const,
    financial: () => [...queryKeys.dashboard.all, 'financial'] as const},

  // Document related queries
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.documents.lists(), filters] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.documents.details(), id] as const,
    categories: (projectId?: string) => [...queryKeys.documents.all, 'categories', projectId || 'all'] as const}
};

/**
 * Helper function to determine if query should be refetched
 * based on the age of the data and how "dynamic" the resource is.
 * 
 * For some resources like developments, we can use a longer stale time
 * because they don't change that often.
 */
export const getCustomStaleTime = (queryKey: string[]) => {
  // Development lists have longer stale time (15 minutes)
  if (queryKey[0] === 'developments' && queryKey[1] === 'list') {
    return 15 * 60 * 1000;
  }

  // Development details have medium stale time (10 minutes)
  if (queryKey[0] === 'developments' && queryKey[1] === 'detail') {
    return 10 * 60 * 1000;
  }

  // Dashboard data should refresh more frequently (2 minutes)
  if (queryKey[0] === 'dashboard') {
    return 2 * 60 * 1000;
  }

  // User data should be very fresh (1 minute)
  if (queryKey[0] === 'auth') {
    return 1 * 60 * 1000;
  }

  // Default stale time (5 minutes)
  return 5 * 60 * 1000;
};

export default {
  queryClient,
  queryKeys,
  getCustomStaleTime
};