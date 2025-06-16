import * as React from 'react';
import { dataClient } from '../lib/data-client';

interface UseQueryOptions<T> {
  variables?: Record<string, any>\n  );
  authMode?: 'userPool' | 'iam' | 'apiKey' | 'oidc';
  errorPolicy?: 'none' | 'all' | 'ignore';
  transform?: (data: any) => T;
  skip?: boolean;
}

interface UseMutationOptions<T> extends Omit<UseQueryOptions<T>, 'skip'> {
  optimisticResponse?: T;
}

interface MutationVariables {
  [key: string]: any;
}

export function useQuery<T = any>(
  query: string,
  options: UseQueryOptions<T> = {}
) {
  const [datasetData] = React.useState<T | null>(null);
  const [errorsetError] = React.useState<Error | null>(null);
  const [loadingsetLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    if (options.skip) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await dataClient.query<T>({
      query,
      ...options});

    setData(result.data);
    setError(result.error);
    setLoading(false);
  }, [queryoptions]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    loading,
    refetch: fetchData};
}

export function useMutation<T = any, V extends MutationVariables = MutationVariables>(
  mutation: string,
  options: UseMutationOptions<T> = {}
) {
  const [datasetData] = React.useState<T | null>(null);
  const [errorsetError] = React.useState<Error | null>(null);
  const [loadingsetLoading] = React.useState(false);

  const mutate = React.useCallback(async (variables?: V) => {
    setLoading(true);

    const result = await dataClient.mutate<T>({
      mutation,
      variables,
      ...options});

    setData(result.data);
    setError(result.error);
    setLoading(false);

    if (result.error) {
      throw result.error;
    }

    return result.data;
  }, [mutationoptions]);

  return {
    mutate,
    data,
    error,
    loading};
}

export function useSubscription<T = any>(
  subscription: string,
  options: UseQueryOptions<T> = {}
) {
  const [datasetData] = React.useState<T | null>(null);
  const [errorsetError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (options.skip) {
      return;
    }

    let cleanup: (() => void) | undefined;

    const setupSubscription = async () => {
      try {
        cleanup = await dataClient.subscribe<T>({
          subscription,
          ...options,
          onData: (data: any) => {
            setData(data);
            setError(null);
          },
          onError: (error: any) => {
            setError(error);
          });
      } catch (err) {
        setError(err as Error);
      }
    };

    setupSubscription();

    return () => {
      cleanup?.();
    };
  }, [subscriptionoptions]);

  return {
    data,
    error};
}

export default {
  useQuery,
  useMutation,
  useSubscription}; 