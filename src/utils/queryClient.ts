/**
 * React Query Client Configuration
 *
 * This module provides an optimized React Query client configuration with:
 * - Resource-specific stale times
 * - Global error handling
 * - Request deduplication
 * 
 * Note: Persistent caching temporarily removed for v4 compatibility
 */

import { QueryClient } from '@tanstack/react-query';

// Type definitions for React Query v4 compatibility
interface DefaultOptions {
  queries?: {
    staleTime?: number;
    cacheTime?: number;
    retry?: number;
    retryDelay?: (attempt: number) => number;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
  };
  mutations?: {
    retry?: number;
    retryDelay?: (attempt: number) => number;
  };
}

// Cache durations - these values can be adjusted based on data volatility
export const STALE_TIMES = {
  // User data changes frequently
  USER: 1000 * 60 * 2, // 2 minutes
  
  // Properties change infrequently
  PROPERTIES: 1000 * 60 * 10, // 10 minutes
  
  // Developments change very infrequently
  DEVELOPMENTS: 1000 * 60 * 30, // 30 minutes
  
  // Settings rarely change during a session
  SETTINGS: 1000 * 60 * 60, // 1 hour
  
  // Reference data is mostly static
  REFERENCE_DATA: 1000 * 60 * 60 * 24, // 24 hours
};

// Query key prefixes for better organization and invalidation
export const QUERY_KEYS = {
  USER: 'user',
  USER_PROFILE: 'user-profile',
  PROPERTIES: 'properties',
  PROPERTY_DETAIL: 'property-detail',
  DEVELOPMENTS: 'developments',
  DEVELOPMENT_DETAIL: 'development-detail',
  DOCUMENTS: 'documents',
  SETTINGS: 'settings',
  REFERENCE_DATA: 'reference-data',
};

/**
 * Default React Query options
 * These can be overridden at the individual query level
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // Common defaults for all queries
    staleTime: 1000 * 60 * 5, // 5 minutes default stale time
    cacheTime: 1000 * 60 * 10, // 10 minutes cache retention (v4 property name)
    retry: 1, // Retry failed queries once
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch automatically on window focus
    refetchOnReconnect: false, // Don't refetch automatically on reconnect
  },
  mutations: {
    // Mutation settings
    retry: 1, // Retry failed mutations once
    retryDelay: 1000, // Simple 1 second delay between retries
  },
};

/**
 * Creates and configures the React Query client
 * 
 * @param options Configuration options
 * @returns Configured QueryClient instance
 */
export function createQueryClient(options: {
  /**
   * Enable persistent cache for offline support (currently disabled for v4)
   */
  enablePersistence?: boolean;
  
  /**
   * Function to run on query errors (global error handler)
   */
  onError?: (error: unknown) => void;
  
  /**
   * Override default options
   */
  defaultOptions?: DefaultOptions;
} = {}) {
  const {
    onError,
    defaultOptions: customDefaultOptions,
  } = options;
  
  // Merge default options
  const mergedOptions = {
    ...defaultOptions,
    ...customDefaultOptions,
  };

  // Add global error handler if provided
  if (onError) {
    mergedOptions.queries = {
      ...mergedOptions.queries,
      onError,
    };
    mergedOptions.mutations = {
      ...mergedOptions.mutations,
      onError,
    };
  }
  
  // Create query client with merged options
  const queryClient = new QueryClient({
    defaultOptions: mergedOptions,
  });

  return queryClient;
}

/**
 * Context-specific query utilities
 * 
 * These utilities provide context-aware invalidation patterns.
 */
export const queryUtils = {
  /**
   * Invalidate all user-related queries
   */
  invalidateUserQueries: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });
  },
  
  /**
   * Invalidate property-related queries
   */
  invalidatePropertyQueries: (queryClient: QueryClient, propertyId?: string) => {
    if (propertyId) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTY_DETAIL, propertyId] });
    } else {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] });
    }
  },
  
  /**
   * Invalidate development-related queries
   */
  invalidateDevelopmentQueries: (queryClient: QueryClient, developmentId?: string) => {
    if (developmentId) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVELOPMENT_DETAIL, developmentId] });
    } else {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVELOPMENTS] });
    }
  },
  
  /**
   * Invalidate document-related queries
   */
  invalidateDocumentQueries: (queryClient: QueryClient, documentId?: string) => {
    if (documentId) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCUMENTS, documentId] });
    } else {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCUMENTS] });
    }
  },
};

/**
 * Single instance for the application
 * Note: For Next.js apps, consider creating this in a context or managing
 * differently between server and client
 */
let defaultQueryClient: QueryClient | null = null;

export function getDefaultQueryClient(): QueryClient {
  if (!defaultQueryClient) {
    defaultQueryClient = createQueryClient();
  }
  return defaultQueryClient;
}