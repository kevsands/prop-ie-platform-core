// src/hooks/use-amplify-data.ts
import { generateClient } from '@aws-amplify/api';
import { Hub } from '@aws-amplify/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Logger } from '../utils/logger';
import { ErrorReporter } from '../utils/error-reporter';
import { MetricsCollector } from '../utils/metrics';
import { CacheManager } from '../utils/cache-manager';
import type { GraphQLResult, GraphQLSubscriptionResult } from '@aws-amplify/api';
import { Development, Property } from '../types/models';

// Initialize services
const client = generateClient();
const logger = new Logger('AmplifyData');
const errorReporter = new ErrorReporter();
const metrics = new MetricsCollector();
const cache = new CacheManager();

// Define missing types
interface Room {
  id: string;
  name: string;
  description?: string;
  status: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Customization {
  id: string;
  name: string;
  description?: string;
  status: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface QueryOptions<T> {
  variables?: Record<string, any>;
  cachePolicy?: 'cache-first' | 'network-only' | 'cache-and-network';
  errorPolicy?: 'none' | 'all' | 'ignore';
  retry?: number | boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
  transform?: (data: any) => T;
}

interface MutationOptions<T> extends Omit<QueryOptions<T>, 'cachePolicy'> {
  optimisticResponse?: T;
  refetchQueries?: string[];
}

interface SubscriptionOptions<T> extends Omit<QueryOptions<T>, 'cachePolicy'> {
  onSubscriptionData?: (data: T) => void;
}

// Query keys
export const queryKeys = {
  developments: ['developments'] as const,
  development: (id: string) => ['development', id] as const,
  properties: (developmentId: string) => ['properties', developmentId] as const,
  property: (id: string) => ['property', id] as const,
  rooms: (propertyId: string) => ['rooms', propertyId] as const,
  room: (id: string) => ['room', id] as const,
  categories: ['categories'] as const,
  category: (id: string) => ['category', id] as const,
  customizations: (categoryId: string) => ['customizations', categoryId] as const,
  customization: (id: string) => ['customization', id] as const,
};

// Development hooks
export function useDevelopments() {
  return useAmplifyQuery<{ listDevelopments: { items: Development[] } }>(
    /* GraphQL */ `
      query ListDevelopments {
        listDevelopments {
          items {
            id
            name
            description
            status
            createdAt
            updatedAt
          }
        }
      }
    `,
    {
      transform: (data) => data.listDevelopments.items ?? [],
    }
  );
}

export function useDevelopment(id: string) {
  return useAmplifyQuery<{ getDevelopment: Development }>(
    /* GraphQL */ `
      query GetDevelopment($id: ID!) {
        getDevelopment(id: $id) {
          id
          name
          description
          status
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: { id },
      transform: (data) => data.getDevelopment,
    }
  );
}

// Property hooks
export function useProperties(developmentId: string) {
  return useAmplifyQuery<{ listProperties: { items: Property[] } }>(
    /* GraphQL */ `
      query ListProperties($developmentId: ID!) {
        listProperties(filter: { developmentId: { eq: $developmentId } }) {
          items {
            id
            name
            description
            status
            developmentId
            createdAt
            updatedAt
          }
        }
      }
    `,
    {
      variables: { developmentId },
      transform: (data) => data.listProperties.items ?? [],
    }
  );
}

export function useProperty(id: string) {
  return useAmplifyQuery<{ getProperty: Property }>(
    /* GraphQL */ `
      query GetProperty($id: ID!) {
        getProperty(id: $id) {
          id
          name
          description
          status
          developmentId
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: { id },
      transform: (data) => data.getProperty,
    }
  );
}

// Room hooks
export function useRooms(propertyId: string) {
  return useAmplifyQuery<{ listRooms: { items: Room[] } }>(
    /* GraphQL */ `
      query ListRooms($propertyId: ID!) {
        listRooms(filter: { propertyId: { eq: $propertyId } }) {
          items {
            id
            name
            description
            status
            propertyId
            createdAt
            updatedAt
          }
        }
      }
    `,
    {
      variables: { propertyId },
      transform: (data) => data.listRooms.items ?? [],
    }
  );
}

export function useRoom(id: string) {
  return useAmplifyQuery<{ getRoom: Room }>(
    /* GraphQL */ `
      query GetRoom($id: ID!) {
        getRoom(id: $id) {
          id
          name
          description
          status
          propertyId
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: { id },
      transform: (data) => data.getRoom,
    }
  );
}

// Category hooks
export function useCategories() {
  return useAmplifyQuery<{ listCategories: { items: Category[] } }>(
    /* GraphQL */ `
      query ListCategories {
        listCategories {
          items {
            id
            name
            description
            createdAt
            updatedAt
          }
        }
      }
    `,
    {
      transform: (data) => data.listCategories.items ?? [],
    }
  );
}

export function useCategory(id: string) {
  return useAmplifyQuery<{ getCategory: Category }>(
    /* GraphQL */ `
      query GetCategory($id: ID!) {
        getCategory(id: $id) {
          id
          name
          description
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: { id },
      transform: (data) => data.getCategory,
    }
  );
}

// Customization hooks
export function useCustomizations(categoryId: string) {
  return useAmplifyQuery<{ listCustomizations: { items: Customization[] } }>(
    /* GraphQL */ `
      query ListCustomizations($categoryId: ID!) {
        listCustomizations(filter: { categoryId: { eq: $categoryId } }) {
          items {
            id
            name
            description
            status
            categoryId
            createdAt
            updatedAt
          }
        }
      }
    `,
    {
      variables: { categoryId },
      transform: (data) => data.listCustomizations.items ?? [],
    }
  );
}

export function useCustomization(id: string) {
  return useAmplifyQuery<{ getCustomization: Customization }>(
    /* GraphQL */ `
      query GetCustomization($id: ID!) {
        getCustomization(id: $id) {
          id
          name
          description
          status
          categoryId
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: { id },
      transform: (data) => data.getCustomization,
    }
  );
}

export function useAmplifyQuery<T = any>(
  query: string,
  options: QueryOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  const fetchData = useCallback(async () => {
    const startTime = performance.now();
    const cacheKey = JSON.stringify({ query, variables: options.variables });

    try {
      // Check cache if policy allows
      if (options.cachePolicy !== 'network-only') {
        const cachedData = await cache.get(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          metrics.recordQueryMetrics({
            operation: query,
            duration: 0,
            success: true,
            cacheHit: true,
          });
          return;
        }
      }

      const response = await client.graphql({
        query,
        variables: options.variables,
        authMode: 'userPool',
      });

      const transformedData = options.transform 
        ? options.transform(response.data)
        : response.data;

      setData(transformedData);
      setError(null);

      // Cache the result
      if (options.cachePolicy !== 'network-only') {
        await cache.set(cacheKey, transformedData);
      }

      metrics.recordQueryMetrics({
        operation: query,
        duration: performance.now() - startTime,
        success: true,
      });

      options.onSuccess?.(transformedData);
    } catch (err) {
      const error = err as Error;
      logger.error('Query error', { error, query, variables: options.variables });
      errorReporter.captureError(error, {
        query,
        variables: options.variables,
      });

      if (options.errorPolicy !== 'ignore') {
        setError(error);
      }

      metrics.recordQueryMetrics({
        operation: query,
        duration: performance.now() - startTime,
        success: false,
        error,
      });

      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [query, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setLoading(true);
    return fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch };
}

export function useAmplifyMutation<T = any>(
  mutation: string,
  options: MutationOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (variables?: Record<string, any>) => {
    const startTime = performance.now();
    setLoading(true);

    try {
      if (options.optimisticResponse) {
        setData(options.optimisticResponse);
      }

      const response = await client.graphql({
        query: mutation,
        variables: variables || options.variables,
        authMode: 'userPool',
      });

      const transformedData = options.transform 
        ? options.transform(response.data)
        : response.data;

      setData(transformedData);
      setError(null);

      // Invalidate related queries
      if (options.refetchQueries?.length) {
        await Promise.all(
          options.refetchQueries.map(queryKey => cache.invalidate(queryKey))
        );
      }

      metrics.recordMutationMetrics({
        operation: mutation,
        duration: performance.now() - startTime,
        success: true,
      });

      options.onSuccess?.(transformedData);
      return transformedData;
    } catch (err) {
      const error = err as Error;
      logger.error('Mutation error', { error, mutation, variables });
      errorReporter.captureError(error, {
        mutation,
        variables,
      });

      setError(error);

      metrics.recordMutationMetrics({
        operation: mutation,
        duration: performance.now() - startTime,
        success: false,
        error,
      });

      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mutation, options]);

  return { mutate, data, error, loading };
}

export function useAmplifySubscription<T = any>(
  subscription: string,
  options: SubscriptionOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    const sub = client.graphql({
      query: subscription,
      variables: options.variables,
    }) as Observable<{ data: T }>;

    const subscription = sub.subscribe({
      next: ({ data }) => {
        const transformedData = options.transform 
          ? options.transform(data)
          : data;
        setData(transformedData);
        options.onSubscriptionData?.(transformedData);
      },
      error: (err) => {
        const error = err as Error;
        logger.error('Subscription error', { error, subscription });
        errorReporter.captureError(error, {
          subscription,
          variables: options.variables,
        });
        setError(error);
        options.onError?.(error);
      },
    });

    subscriptionRef.current = subscription;

    return () => {
      subscription.unsubscribe();
    };
  }, [subscription, options]);

  return { data, error };
}

export default {
  useAmplifyQuery,
  useAmplifyMutation,
  useAmplifySubscription,
};