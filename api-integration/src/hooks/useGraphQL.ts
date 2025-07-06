'use client';

import { generateClient } from 'aws-amplify/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type {
  QueryKey,
  QueryObserverOptions,
  MutationObserverOptions,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import type {
  GraphQLOperationContext,
  GraphQLOperationOptions,
} from '../types/graphql';
import { createGraphQLResult, GraphQLErrorHandler } from '../types/graphql';
import type { GraphQLResult as CommonGraphQLResult } from '../types/common';
import { Logger } from '../utils/logger';
import { ErrorReporter } from '../utils/error-reporter';
import { MetricsCollector } from '../utils/metrics';
import { CacheManager } from '../utils/cache-manager';

// Initialize clients and services
const amplifyClient = generateClient();
const errorHandler = new GraphQLErrorHandler();
const logger = new Logger('GraphQLClient');
const errorReporter = new ErrorReporter();
const metrics = new MetricsCollector();
const cacheManager = new CacheManager();

// Define GraphQL response types
interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
    extensions?: Record<string, unknown>;
  }>;
}

interface GraphQLResult<T> extends CommonGraphQLResult<T> {
  context?: GraphQLOperationContext;
}

/**
 * Enhanced GraphQL query hook with comprehensive error handling, metrics, and caching
 */
export function useGraphQLQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  query: string,
  variables?: Record<string, unknown>,
  options?: Omit<QueryObserverOptions<GraphQLResult<TData>, TError>, 'queryKey' | 'queryFn'> & GraphQLOperationOptions
) {
  const queryFn = useCallback(async () => {
    const startTime = performance.now();
    const cacheKey = JSON.stringify({ query, variables });
    
    try {
      // Check cache first
      const cachedData = await cacheManager.get(cacheKey);
      if (cachedData) {
        logger.debug('Cache hit', { queryKey, variables });
        return cachedData;
      }

      // Prepare context for tracking
      const context: GraphQLOperationContext = {
        operationType: 'query',
        operationName: query.split('{')[0].trim(),
        variables,
        timestamp: new Date().toISOString(),
      };

      // Execute query with timeout and retry logic
      const response = await Promise.race([
        amplifyClient.graphql({
          query,
          variables,
          authMode: 'userPool'
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 30000)
        ),
      ]);

      const result = createGraphQLResult(response, context, errorHandler);

      // Handle errors with proper context
      if (result.error) {
        errorReporter.captureError(result.error, {
          context,
          query,
          variables,
        });

        if (options?.throwOnError) {
          throw result.error;
        }
      }

      // Cache successful results
      if (result.data) {
        await cacheManager.set(cacheKey, result);
      }

      // Track metrics
      const duration = performance.now() - startTime;
      metrics.recordQueryMetrics({
        operation: context.operationName,
        duration,
        success: !result.error,
        cacheHit: false,
      });

      if (result.error) {
        options?.onError?.(result.error);
      }
      if (result.data) {
        options?.onSuccess?.(result.data);
      }

      return result;
    } catch (error) {
      logger.error('GraphQL query error', { error, query, variables });
      errorReporter.captureError(error, {
        query,
        variables,
        stack: (error as Error).stack,
      });

      metrics.recordQueryMetrics({
        operation: query.split('{')[0].trim(),
        duration: performance.now() - startTime,
        success: false,
        error: error as Error,
      });

      throw error;
    }
  }, [query, variables, options]);

  return useQuery({
    queryKey,
    queryFn,
    retry: (failureCount: number, error: unknown) => {
      // Implement smart retry logic
      if (error instanceof NetworkError) return failureCount < 3;
      if (error instanceof ValidationError) return false;
      return failureCount < 2;
    },
    ...options,
  });
}

/**
 * Enhanced GraphQL mutation hook with comprehensive error handling and metrics
 */
export function useGraphQLMutation<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>, TError = Error>(
  mutation: string,
  options?: Omit<MutationObserverOptions<GraphQLResult<TData>, TError, TVariables>, 'mutationFn'> & GraphQLOperationOptions
) {
  const mutationFn = useCallback(async (variables: TVariables) => {
    const startTime = performance.now();

    try {
      const context: GraphQLOperationContext = {
        operationType: 'mutation',
        operationName: mutation.split('{')[0].trim(),
        variables,
        timestamp: new Date().toISOString(),
      };

      // Execute mutation with timeout
      const response = await Promise.race([
        amplifyClient.graphql({
          query: mutation,
          variables,
          authMode: 'userPool'
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Mutation timeout')), 30000)
        ),
      ]);

      const result = createGraphQLResult(response, context, errorHandler);

      if (result.error) {
        errorReporter.captureError(result.error, {
          context,
          mutation,
          variables,
        });

        if (options?.throwOnError) {
          throw result.error;
        }
      }

      // Invalidate relevant caches
      await cacheManager.invalidateRelated(mutation);

      // Track metrics
      metrics.recordMutationMetrics({
        operation: context.operationName,
        duration: performance.now() - startTime,
        success: !result.error,
      });

      if (result.error) {
        options?.onError?.(result.error);
      }
      if (result.data) {
        options?.onSuccess?.(result.data);
      }

      return result;
    } catch (error) {
      logger.error('GraphQL mutation error', { error, mutation, variables });
      errorReporter.captureError(error, {
        mutation,
        variables,
        stack: (error as Error).stack,
      });

      metrics.recordMutationMetrics({
        operation: mutation.split('{')[0].trim(),
        duration: performance.now() - startTime,
        success: false,
        error: error as Error,
      });

      throw error;
    }
  }, [mutation, options]);

  return useMutation({
    mutationFn,
    retry: (failureCount: number, error: unknown) => {
      // Implement smart retry logic
      if (error instanceof NetworkError) return failureCount < 2;
      if (error instanceof ValidationError) return false;
      return false;
    },
    ...options,
  });
}

// Error classes for better error handling
class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export default {
  useGraphQLQuery,
  useGraphQLMutation,
};