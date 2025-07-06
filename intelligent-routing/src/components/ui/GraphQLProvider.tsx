'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * GraphQL Context with utility functions for working with GraphQL data
 */
interface GraphQLContextType {
  /**
   * Creates a cache key for React Query based on the query and variables
   */
  createQueryKey: (baseKey: string, variables?: Record<string, any>) => string[];
  
  /**
   * Format date fields for GraphQL variables
   */
  formatDateForGraphQL: (date: Date) => string;
  
  /**
   * Helper for extracting data from responses
   */
  extractData: <T extends Record<string, any>>(
    response: any,
    path: string
  ) => T | null;
  
  /**
   * Format currency values
   */
  formatCurrency: (amount: number, currency?: string) => string;
}

// Create the context
const GraphQLContext = createContext<GraphQLContextType | undefined>(undefined);

// Default cache time for queries (10 minutes)
const DEFAULT_STALE_TIME = 10 * 60 * 1000;

/**
 * GraphQLProvider component that sets up React Query and provides
 * utility functions for working with GraphQL data
 */
export const GraphQLProvider: React.FC<{ 
  children: ReactNode;
  staleTime?: number;
}> = ({ 
  children,
  staleTime = DEFAULT_STALE_TIME
}) => {
  // Create a React Query client with default options
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  // Utility functions for GraphQL operations
  const createQueryKey = (baseKey: string, variables?: Record<string, any>) => {
    return variables ? [baseKey, JSON.stringify(variables)] : [baseKey];
  };

  const formatDateForGraphQL = (date: Date) => {
    return date.toISOString();
  };

  const extractData = <T extends Record<string, any>>(
    response: any,
    path: string
  ): T | null => {
    if (!response) return null;
    
    // Handle direct responses from React Query where data is wrapped
    if (response.data) {
      response = response.data;
    }
    
    // Split the path by dots and traverse the object
    const parts = path.split('.');
    let result = response;
    
    for (const part of parts) {
      if (!result || typeof result !== 'object') return null;
      result = result[part];
    }
    
    return result as T;
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Context value
  const value: GraphQLContextType = {
    createQueryKey,
    formatDateForGraphQL,
    extractData,
    formatCurrency
  };

  return (
    <GraphQLContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GraphQLContext.Provider>
  );
};

/**
 * Custom hook to use the GraphQL context
 */
export const useGraphQL = () => {
  const context = useContext(GraphQLContext);
  if (context === undefined) {
    throw new Error('useGraphQL must be used within a GraphQLProvider');
  }
  return context;
};

export default GraphQLProvider;