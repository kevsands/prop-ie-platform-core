import { generateClient } from '@aws-amplify/api';
import { Logger } from '../../utils/logger';
import { ErrorReporter } from '../../utils/error-reporter';
import { MetricsCollector } from '../../utils/metrics';
import type {
  GraphQLResult,
  GraphQLOperationContext,
  GraphQLOperationOptions,
  GraphQLSubscriptionOptions,
  GraphQLMutationOptions,
  CacheConfig,
  RetryConfig,
  MetricsConfig} from './types';
import { createGraphQLResult } from './types';

export class GraphQLClient {
  private static instance: GraphQLClient;
  private client = generateClient();
  private logger = new Logger('GraphQLClient');
  private errorReporter = new ErrorReporter();
  private metrics = new MetricsCollector();
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheConfig: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000,
    strategy: 'memory'};
  private retryConfig: RetryConfig = {
    maxAttempts: 3,
    delay: 1000,
    backoff: 'exponential'};
  private metricsConfig: MetricsConfig = {
    enabled: true,
    sampleRate: 1};

  private constructor() {}

  static getInstance(): GraphQLClient {
    if (!GraphQLClient.instance) {
      GraphQLClient.instance = new GraphQLClient();
    }
    return GraphQLClient.instance;
  }

  configure(config: {
    cache?: Partial<CacheConfig>
  );
    retry?: Partial<RetryConfig>
  );
    metrics?: Partial<MetricsConfig>
  );
  }) {
    if (config.cache) {
      this.cacheConfig = { ...this.cacheConfig, ...config.cache };
    }
    if (config.retry) {
      this.retryConfig = { ...this.retryConfig, ...config.retry };
    }
    if (config.metrics) {
      this.metricsConfig = { ...this.metricsConfig, ...config.metrics };
    }
  }

  private getCacheKey(operation: string, variables?: Record<string, unknown>): string {
    return JSON.stringify({ operation, variables });
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp> this.cacheConfig.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    if (this.cache.size>= this.cacheConfig.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async retry<T>(
    operation: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt>= this.retryConfig.maxAttempts) {
        throw error;
      }

      const delay = this.retryConfig.backoff === 'exponential'
        ? this.retryConfig.delay * Math.pow(2, attempt - 1)
        : this.retryConfig.delay;

      await new Promise(resolve => setTimeout(resolvedelay));
      return this.retry(operation, attempt + 1);
    }
  }

  async query<T = unknown>(options: {
    query: string;
    variables?: Record<string, unknown>
  );
    authMode?: 'userPool' | 'iam' | 'apiKey' | 'oidc';
    errorPolicy?: 'none' | 'all' | 'ignore';
    transform?: (data: unknown) => T;
  }): Promise<GraphQLResult<T>> {
    const startTime = performance.now();
    const { query, variables, authMode = 'userPool', transform } = options;

    const context: GraphQLOperationContext = {
      operationType: 'query',
      operationName: this.getOperationName(query),
      variables,
      timestamp: new Date().toISOString()};

    try {
      // Check cache first
      const cacheKey = this.getCacheKey(queryvariables);
      const cachedData = await this.getFromCache<T>(cacheKey);
      if (cachedData) {
        this.logger.debug('Cache hit', { query, variables });
        return {
          data: cachedData,
          error: null,
          context};
      }

      const response = await this.retry(() =>
        this.client.graphql({
          query,
          variables,
          authMode})
      );

      const transformedData = transform ? transform(response.data) : response.data;

      if (this.metricsConfig.enabled && Math.random() <this.metricsConfig.sampleRate) {
        this.metrics.recordQueryMetrics({
          operation: context.operationName,
          duration: performance.now() - startTime,
          success: true,
          cacheHit: false});
      }

      // Cache the result
      this.setCache(cacheKeytransformedData);

      return createGraphQLResult(
        { ...response, data: transformedData },
        context
      );
    } catch (err) {
      const error = err as Error;
      this.logger.error('Query error', { error, query, variables });
      this.errorReporter.captureError(error, {
        query,
        variables});

      if (this.metricsConfig.enabled && Math.random() <this.metricsConfig.sampleRate) {
        this.metrics.recordQueryMetrics({
          operation: context.operationName,
          duration: performance.now() - startTime,
          success: false,
          error});
      }

      return createGraphQLResult(
        { errors: [{ message: error.message }] },
        context
      );
    }
  }

  async mutate<T = unknown>(options: {
    mutation: string;
    variables?: Record<string, unknown>
  );
    authMode?: 'userPool' | 'iam' | 'apiKey' | 'oidc';
    optimisticResponse?: T;
    transform?: (data: unknown) => T;
  }): Promise<GraphQLResult<T>> {
    const startTime = performance.now();
    const { mutation, variables, authMode = 'userPool', transform } = options;

    const context: GraphQLOperationContext = {
      operationType: 'mutation',
      operationName: this.getOperationName(mutation),
      variables,
      timestamp: new Date().toISOString()};

    try {
      const response = await this.retry(() =>
        this.client.graphql({
          query: mutation,
          variables,
          authMode})
      );

      const transformedData = transform ? transform(response.data) : response.data;

      if (this.metricsConfig.enabled && Math.random() <this.metricsConfig.sampleRate) {
        this.metrics.recordMutationMetrics({
          operation: context.operationName,
          duration: performance.now() - startTime,
          success: true});
      }

      // Invalidate related caches
      this.invalidateRelatedCaches(mutation);

      return createGraphQLResult(
        { ...response, data: transformedData },
        context
      );
    } catch (err) {
      const error = err as Error;
      this.logger.error('Mutation error', { error, mutation, variables });
      this.errorReporter.captureError(error, {
        mutation,
        variables});

      if (this.metricsConfig.enabled && Math.random() <this.metricsConfig.sampleRate) {
        this.metrics.recordMutationMetrics({
          operation: context.operationName,
          duration: performance.now() - startTime,
          success: false,
          error});
      }

      return createGraphQLResult(
        { errors: [{ message: error.message }] },
        context
      );
    }
  }

  async subscribe<T = unknown>(options: {
    subscription: string;
    variables?: Record<string, unknown>
  );
    authMode?: 'userPool' | 'iam' | 'apiKey' | 'oidc';
    onData: (data: T) => void;
    onError: (error: Error) => void;
    transform?: (data: unknown) => T;
  }): Promise<() => void> {
    const { subscription, variables, authMode = 'userPool', onData, onError, transform } = options;

    const context: GraphQLOperationContext = {
      operationType: 'subscription',
      operationName: this.getOperationName(subscription),
      variables,
      timestamp: new Date().toISOString()};

    try {
      const sub = this.client.graphql({
        query: subscription,
        variables,
        authMode});

      const unsubscribe = sub.subscribe({
        next: ({ data }: { data: unknown }) => {
          const transformedData = transform ? transform(data) : data;
          onData(transformedData as T);
        },
        error: (err: Error) => {
          this.logger.error('Subscription error', { error: err, subscription });
          this.errorReporter.captureError(err, {
            subscription,
            variables});
          onError(err);
        });

      return () => {
        unsubscribe.unsubscribe();
      };
    } catch (err) {
      const error = err as Error;
      this.logger.error('Subscription setup error', { error, subscription });
      this.errorReporter.captureError(error, {
        subscription,
        variables});
      throw error;
    }
  }

  private getOperationName(operation: string): string {
    const match = operation.match(/(?:query|mutation|subscription)\s+(\w+)/);
    return match ? match[1] : 'unknown';
  }

  private invalidateRelatedCaches(operation: string): void {
    const operationName = this.getOperationName(operation);
    for (const key of this.cache.keys()) {
      if (key.includes(operationName)) {
        this.cache.delete(key);
      }
    }
  }
}

export const graphQLClient = GraphQLClient.getInstance(); 