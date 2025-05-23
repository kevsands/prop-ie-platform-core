// Define our own types instead of importing from @tanstack/react-query
export type QueryKey = string | readonly unknown[];

export type QueryFunction<TData = unknown, TQueryKey extends QueryKey = QueryKey> = 
  (context: { queryKey: TQueryKey; meta: Record<string, unknown> }) => Promise<TData>;

export interface QueryOptions<TData = unknown, TError = unknown> {
  queryKey?: QueryKey;
  queryFn?: QueryFunction<TData, any>;
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
  retryDelay?: number | ((retryAttempt: number) => number);
  staleTime?: number;
  cacheTime?: number;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean | 'always';
  refetchOnReconnect?: boolean | 'always';
  refetchInterval?: number | false;
  refetchIntervalInBackground?: boolean;
  enabled?: boolean;
}

export type MutationFunction<TData = unknown, TVariables = void> = 
  (variables: TVariables) => Promise<TData>;

export interface MutationOptions<TData = unknown, TError = unknown, TVariables = void> {
  mutationFn?: MutationFunction<TData, TVariables>;
  retry?: boolean | number;
  retryDelay?: number | ((retryAttempt: number) => number);
  onMutate?: (variables: TVariables) => unknown;
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
  onError?: (error: TError, variables: TVariables, context: unknown) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables, context: unknown) => void;
}

export interface UseQueryOptions<TData = unknown, TError = Error, TQueryKey extends QueryKey = QueryKey> extends QueryOptions<TData, TError> {
  /** Whether to throw on error */
  throwOnError?: boolean;
  /** Custom error handler */
  onError?: (error: TError) => void;
  /** Custom success handler */
  onSuccess?: (data: TData) => void;
}

export interface UseMutationOptions<TData = unknown, TError = Error, TVariables = unknown> extends MutationOptions<TData, TError, TVariables> {
  /** Whether to throw on error */
  throwOnError?: boolean;
  /** Custom error handler */
  onError?: (error: TError) => void;
  /** Custom success handler */
  onSuccess?: (data: TData) => void;
} 