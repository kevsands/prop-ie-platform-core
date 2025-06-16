import { generateClient } from '@aws-amplify/api';
import { Logger } from '../utils/logger';
import { ErrorReporter } from '../utils/error-reporter';
import { MetricsCollector } from '../utils/metrics';

export class DataClient {
  private static instance: DataClient;
  private client = generateClient();
  private logger = new Logger('DataClient');
  private errorReporter = new ErrorReporter();
  private metrics = new MetricsCollector();

  private constructor() {}

  static getInstance(): DataClient {
    if (!DataClient.instance) {
      DataClient.instance = new DataClient();
    }
    return DataClient.instance;
  }

  async query<T = any>(options: {
    query: string;
    variables?: Record<string, any>\n  );
    authMode?: 'userPool' | 'iam' | 'apiKey' | 'oidc';
    errorPolicy?: 'none' | 'all' | 'ignore';
    transform?: (data: any) => T;
  }): Promise<{
    data: T | null;
    error: Error | null;
  }> {
    const startTime = performance.now();
    const { query, variables, authMode = 'userPool', transform } = options;

    try {
      const response = await this.client.graphql({
        query,
        variables,
        authMode});

      const transformedData = transform ? transform(response.data) : response.data;

      this.metrics.recordQueryMetrics({
        operation: query,
        duration: performance.now() - startTime,
        success: true});

      return {
        data: transformedData,
        error: null};
    } catch (err: any) {
      const error = err as Error;
      this.logger.error('Query error', { error, query, variables });
      this.errorReporter.captureError(error, {
        query,
        variables});

      this.metrics.recordQueryMetrics({
        operation: query,
        duration: performance.now() - startTime,
        success: false,
        error});

      if (options.errorPolicy === 'ignore') {
        return {
          data: null,
          error: null};
      }

      return {
        data: null,
        error};
    }
  }

  async mutate<T = any>(options: {
    mutation: string;
    variables?: Record<string, any>\n  );
    authMode?: 'userPool' | 'iam' | 'apiKey' | 'oidc';
    optimisticResponse?: T;
    transform?: (data: any) => T;
  }): Promise<{
    data: T | null;
    error: Error | null;
  }> {
    const startTime = performance.now();
    const { mutation, variables, authMode = 'userPool', transform } = options;

    try {
      const response = await this.client.graphql({
        query: mutation,
        variables,
        authMode});

      const transformedData = transform ? transform(response.data) : response.data;

      this.metrics.recordMutationMetrics({
        operation: mutation,
        duration: performance.now() - startTime,
        success: true});

      return {
        data: transformedData,
        error: null};
    } catch (err: any) {
      const error = err as Error;
      this.logger.error('Mutation error', { error, mutation, variables });
      this.errorReporter.captureError(error, {
        mutation,
        variables});

      this.metrics.recordMutationMetrics({
        operation: mutation,
        duration: performance.now() - startTime,
        success: false,
        error});

      return {
        data: null,
        error};
    }
  }

  async subscribe<T = any>(options: {
    subscription: string;
    variables?: Record<string, any>\n  );
    authMode?: 'userPool' | 'iam' | 'apiKey' | 'oidc';
    onData: (data: T) => void;
    onError: (error: Error) => void;
    transform?: (data: any) => T;
  }): Promise<() => void> {
    const { subscription, variables, authMode = 'userPool', onData, onError, transform } = options;

    try {
      const sub = this.client.graphql({
        query: subscription,
        variables,
        authMode});

      const unsubscribe = sub.subscribe({
        next: ({ data }) => {
          const transformedData = transform ? transform(data) : data;
          onData(transformedData);
        },
        error: (err: any) => {
          const error = err as Error;
          this.logger.error('Subscription error', { error, subscription });
          this.errorReporter.captureError(error, {
            subscription,
            variables});
          onError(error);
        });

      return () => {
        unsubscribe.unsubscribe();
      };
    } catch (err: any) {
      const error = err as Error;
      this.logger.error('Subscription setup error', { error, subscription });
      this.errorReporter.captureError(error, {
        subscription,
        variables});
      throw error;
    }
  }
}

export const dataClient = DataClient.getInstance(); 