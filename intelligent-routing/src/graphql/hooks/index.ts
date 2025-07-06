import * as React from 'react';
import { graphQLClient } from '../client';
import type {
  GraphQLResult,
  GraphQLOperationOptions,
  GraphQLSubscriptionOptions,
  GraphQLMutationOptions,
} from '../types';

interface UseQueryOptions<T> extends GraphQLOperationOptions<T> {
  skip?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  enabled?: boolean;
}

interface UseMutationOptions<T> extends GraphQLMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseSubscriptionOptions<T> extends GraphQLSubscriptionOptions<T> {
  skip?: boolean;
  enabled?: boolean;
}

export function useQuery<T = unknown>(
  query: string,
  options: UseQueryOptions<T> = {}
) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    if (options.skip || options.enabled === false) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await graphQLClient.query<T>({
      query,
      ...options,
    });

    setData(result.data);
    setError(result.error);
    setLoading(false);

    if (result.error && options.onError) {
      options.onError(result.error);
    } else if (result.data && options.onSuccess) {
      options.onSuccess(result.data);
    }
  }, [query, options]);

  React.useEffect(() => {
    fetchData();

    let intervalId: NodeJS.Timeout | undefined;
    if (options.refetchInterval) {
      intervalId = setInterval(fetchData, options.refetchInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, options.refetchInterval]);

  // Handle window focus
  React.useEffect(() => {
    if (!options.refetchOnWindowFocus) return;

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData, options.refetchOnWindowFocus]);

  // Handle online/offline
  React.useEffect(() => {
    if (!options.refetchOnReconnect) return;

    const handleOnline = () => {
      fetchData();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [fetchData, options.refetchOnReconnect]);

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  };
}

export function useMutation<T = unknown, V extends Record<string, unknown> = Record<string, unknown>>(
  mutation: string,
  options: UseMutationOptions<T> = {}
) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(false);

  const mutate = React.useCallback(async (variables?: V) => {
    setLoading(true);

    const result = await graphQLClient.mutate<T>({
      mutation,
      variables,
      ...options,
    });

    setData(result.data);
    setError(result.error);
    setLoading(false);

    if (result.error) {
      options.onError?.(result.error);
      throw result.error;
    }

    if (result.data) {
      options.onSuccess?.(result.data);
    }

    return result.data;
  }, [mutation, options]);

  return {
    mutate,
    data,
    error,
    loading,
  };
}

export function useSubscription<T = unknown>(
  subscription: string,
  options: UseSubscriptionOptions<T> = {}
) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (options.skip || options.enabled === false) {
      return;
    }

    let cleanup: (() => void) | undefined;

    const setupSubscription = async () => {
      try {
        cleanup = await graphQLClient.subscribe<T>({
          subscription,
          ...options,
          onData: (data) => {
            setData(data);
            setError(null);
            options.onData?.(data);
          },
          onError: (error) => {
            setError(error);
            options.onError?.(error);
          },
        });
      } catch (err) {
        const error = err as Error;
        setError(error);
        options.onError?.(error);
      }
    };

    setupSubscription();

    return () => {
      cleanup?.();
    };
  }, [subscription, options]);

  return {
    data,
    error,
  };
}

export default {
  useQuery,
  useMutation,
  useSubscription,
}; 