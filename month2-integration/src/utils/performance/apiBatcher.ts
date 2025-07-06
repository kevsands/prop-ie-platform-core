/**
 * API Batching and Deduplication Utilities
 * 
 * A module for optimizing API calls by batching multiple requests together,
 * deduplicating identical requests, and managing request priorities.
 */

interface RequestKey {
  url: string;
  method: string;
  bodyHash?: string;
}

interface PendingRequest<T = any> {
  url: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  key: string;
  timestamp: number;
  priority: number;
  batchId?: string;
  abortController: AbortController;
  isAborted: boolean;
  timeout?: NodeJS.Timeout;
  retryCount: number;
  maxRetries: number;
}

interface BatchRequestOptions {
  url: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  priority?: number;
  timeout?: number;
  batchKey?: string;
  maxRetries?: number;
  retryDelay?: number;
}

interface BatcherOptions {
  /**
   * Maximum batch size (number of requests)
   */
  maxBatchSize?: number;

  /**
   * Maximum delay before sending a batch (ms)
   */
  maxDelayMs?: number;

  /**
   * Minimum delay for batching (ms)
   */
  minDelayMs?: number;

  /**
   * Default request timeout (ms)
   */
  defaultTimeoutMs?: number;

  /**
   * Whether to deduplicate identical requests
   */
  deduplicate?: boolean;

  /**
   * Maximum number of retries for failed requests
   */
  maxRetries?: number;

  /**
   * Base delay for exponential backoff (ms)
   */
  retryDelayMs?: number;

  /**
   * Debug mode
   */
  debugMode?: boolean;

  /**
   * Custom transformers for batching specific endpoints
   */
  customBatchTransformers?: Record<string, BatchTransformer>;
}

/**
 * Interface for custom batch transformers
 * Implementations can convert multiple requests into a single batched request
 * and extract individual responses from the batch response
 */
interface BatchTransformer {
  /**
   * Combine multiple requests into a single batch request
   */
  batchRequests: (requests: PendingRequest[]) => {
    url: string;
    method: string;
    body: any;
    headers?: Record<string, string>;
  };

  /**
   * Extract individual responses from a batch response
   */
  extractResponses: (batchResponse: any, requests: PendingRequest[]) => any[];
}

/**
 * API request batcher and deduplicator
 */
export class ApiBatcher {
  private pendingRequests: Map<string, PendingRequest[]> = new Map();
  private batchTimers: Map<string, NodeJS.Timeout> = new Map();
  private options: Required<BatcherOptions>;

  constructor(options: BatcherOptions = {}) {
    // Set default options
    this.options = {
      maxBatchSize: 20,
      maxDelayMs: 50,
      minDelayMs: 10,
      defaultTimeoutMs: 10000,
      deduplicate: true,
      maxRetries: 2,
      retryDelayMs: 300,
      debugMode: false,
      customBatchTransformers: {},
      ...options
    };
  }

  /**
   * Create a request key for deduplication
   */
  private createRequestKey(request: RequestKey): string {
    const { url, method, bodyHash } = request;
    return `${method}:${url}${bodyHash ? `:${bodyHash}` : ''}`;
  }

  /**
   * Hash the request body for deduplication
   */
  private hashBody(body: any): string {
    if (!body) return '';

    try {
      return JSON.stringify(body);
    } catch (e) {
      // If the body can't be stringified, use a unique identifier
      return `object_${Date.now()}_${Math.random()}`;
    }
  }

  /**
   * Schedule a batch to be sent
   */
  private scheduleBatch(batchKey: string): void {
    // Clear existing timer if any
    if (this.batchTimers.has(batchKey)) {
      clearTimeout(this.batchTimers.get(batchKey)!);
    }

    // Schedule new batch
    const timer = setTimeout(() => {
      this.processBatch(batchKey);
    }, this.options.minDelayMs);

    this.batchTimers.set(batchKey, timer);
  }

  /**
   * Process a batch of requests
   */
  private async processBatch(batchKey: string): Promise<void> {
    // Get pending requests for this batch
    const requests = this.pendingRequests.get(batchKey) || [];
    if (requests.length === 0) return;

    // Remove the batch timer
    if (this.batchTimers.has(batchKey)) {
      clearTimeout(this.batchTimers.get(batchKey)!);
      this.batchTimers.delete(batchKey);
    }

    // Clear the pending requests
    this.pendingRequests.delete(batchKey);

    // Check if we have a custom transformer for this batch key
    const transformer = this.options.customBatchTransformers[batchKey];

    if (transformer && requests.length > 1) {
      // Process using the transformer
      await this.processBatchWithTransformer(requests, transformer);
    } else {
      // Process individual requests
      for (const request of requests) {
        // Skip aborted requests
        if (request.isAborted) continue;

        this.sendRequest(request).catch(error => {
          this.log(`Error sending request: ${error.message}`);
        });
      }
    }
  }

  /**
   * Process a batch of requests using a custom transformer
   */
  private async processBatchWithTransformer(
    requests: PendingRequest[],
    transformer: BatchTransformer
  ): Promise<void> {
    // Filter out aborted requests
    const activeRequests = requests.filter(r => !r.isAborted);
    if (activeRequests.length === 0) return;

    try {
      // Transform the requests into a single batch request
      const batchRequest = transformer.batchRequests(activeRequests);

      this.log(`Sending batch request to ${batchRequest.url} with ${activeRequests.length} requests`);

      // Send the batch request
      const response = await fetch(batchRequest.url, {
        method: batchRequest.method,
        headers: {
          'Content-Type': 'application/json',
          ...batchRequest.headers
        },
        body: JSON.stringify(batchRequest.body)
      });

      if (!response.ok) {
        throw new Error(`Batch request failed with status ${response.status}`);
      }

      // Parse the response
      const batchResponse = await response.json();

      // Extract individual responses
      const individualResponses = transformer.extractResponses(batchResponse, activeRequests);

      // Resolve each request with its corresponding response
      activeRequests.forEach((request, index) => {
        const individualResponse = individualResponses[index];
        request.resolve(individualResponse);
      });
    } catch (error) {
      // Handle batch failure - fall back to individual requests
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`Batch request failed: ${errorMessage}. Falling back to individual requests.`);

      // Send individual requests
      for (const request of activeRequests) {
        this.sendRequest(request).catch(error => {
          this.log(`Error sending individual request: ${error.message}`);
        });
      }
    }
  }

  /**
   * Send an individual request
   */
  private async sendRequest(request: PendingRequest): Promise<void> {
    // Skip if already aborted
    if (request.isAborted) return;

    try {
      this.log(`Sending request to ${request.url}`);

      // Send the request
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers
        },
        body: request.body ? JSON.stringify(request.body) : undefined,
        signal: request.abortController.signal
      });

      // Check for success
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      // Parse the response
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Resolve the request
      request.resolve(responseData);
    } catch (error) {
      // Check if this is an abort error
      if ((error instanceof Error && 'name' in error && error.name === 'AbortError') || request.isAborted) {
        request.reject(new Error('Request aborted'));
        return;
      }

      // Check if we should retry
      if (request.retryCount < request.maxRetries) {
        this.log(`Retrying request (${request.retryCount + 1}/${request.maxRetries}): ${request.url}`);

        // Increment retry count
        request.retryCount++;

        // Calculate backoff delay with exponential backoff
        const backoffDelay = this.options.retryDelayMs * Math.pow(2, request.retryCount - 1);

        // Schedule retry
        setTimeout(() => {
          this.sendRequest(request).catch(error => {
            this.log(`Error in retry: ${error.message}`);
          });
        }, backoffDelay);
      } else {
        // Max retries reached, reject the request
        request.reject(error);
      }
    }
  }

  /**
   * Log debug information if debug mode is enabled
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[ApiBatcher] ${message}`);
    }
  }

  /**
   * Add a request to the batch queue
   */
  public request<T = any>(options: BatchRequestOptions): Promise<T> {
    const {
      url,
      method = 'GET',
      body,
      headers,
      priority = 0,
      timeout = this.options.defaultTimeoutMs,
      batchKey = 'default',
      maxRetries = this.options.maxRetries,
      retryDelay = this.options.retryDelayMs
    } = options;

    // Create an abort controller for this request
    const abortController = new AbortController();

    // Calculate body hash for deduplication
    const bodyHash = body ? this.hashBody(body) : undefined;

    // Create request key for deduplication
    const key = this.createRequestKey({ url, method, bodyHash });

    return new Promise<T>((resolve, reject) => {
      // Create a new pending request
      const request: PendingRequest<T> = {
        url,
        method,
        body,
        headers,
        resolve,
        reject,
        key,
        timestamp: Date.now(),
        priority,
        abortController,
        isAborted: false,
        retryCount: 0,
        maxRetries
      };

      // Set up request timeout
      if (timeout > 0) {
        request.timeout = setTimeout(() => {
          request.isAborted = true;
          abortController.abort();
          reject(new Error(`Request timed out after ${timeout}ms`));
        }, timeout);
      }

      // Check for duplicates if deduplication is enabled
      if (this.options.deduplicate) {
        // Get all batches
        for (const [existingBatchKey, requests] of this.pendingRequests.entries()) {
          // Check if we have a duplicate in any batch
          const duplicateIndex = requests.findIndex(r => r.key === key);

          if (duplicateIndex !== -1) {
            const duplicate = requests[duplicateIndex];

            this.log(`Found duplicate request: ${url}`);

            // If the new request has higher priority, replace the duplicate
            if (priority > duplicate.priority) {
              this.log(`New request has higher priority, replacing duplicate`);

              // Abort the old request
              duplicate.isAborted = true;
              duplicate.abortController.abort();

              // Remove the old request
              requests.splice(duplicateIndex, 1);

              // Add the new request
              this.addRequestToBatch(batchKey, request);
            } else {
              // Just piggyback on the existing request
              this.log(`Piggybacking on existing request`);

              // Create a wrapper that resolves/rejects when the duplicate resolves/rejects
              const wrapPromise = (originalRequest: PendingRequest<T>) => {
                const originalResolve = originalRequest.resolve;
                const originalReject = originalRequest.reject;

                originalRequest.resolve = (value) => {
                  originalResolve(value);
                  resolve(value);
                };

                originalRequest.reject = (reason) => {
                  originalReject(reason);
                  reject(reason);
                };
              };

              wrapPromise(duplicate);
            }

            return;
          }
        }
      }

      // Add the request to the batch
      this.addRequestToBatch(batchKey, request);
    });
  }

  /**
   * Add a request to a specific batch
   */
  private addRequestToBatch<T = any>(batchKey: string, request: PendingRequest<T>): void {
    // Get or create the batch
    if (!this.pendingRequests.has(batchKey)) {
      this.pendingRequests.set(batchKey, []);
    }

    const batch = this.pendingRequests.get(batchKey)!;

    // Add the request to the batch
    batch.push(request);
    request.batchId = batchKey;

    this.log(`Added request to batch ${batchKey}: ${request.url}`);

    // If we've reached the max batch size, process immediately
    if (batch.length >= this.options.maxBatchSize) {
      this.log(`Batch ${batchKey} reached max size, processing immediately`);
      this.processBatch(batchKey);
    } else {
      // Otherwise, schedule the batch
      this.scheduleBatch(batchKey);
    }
  }

  /**
   * Cancel all pending requests
   */
  public cancelAll(): void {
    // Abort all pending requests
    for (const [batchKey, requests] of this.pendingRequests.entries()) {
      for (const request of requests) {
        request.isAborted = true;
        request.abortController.abort();
        request.reject(new Error('Request cancelled'));

        if (request.timeout) {
          clearTimeout(request.timeout);
        }
      }

      // Clear the batch
      this.pendingRequests.delete(batchKey);
    }

    // Clear all batch timers
    for (const [batchKey, timer] of this.batchTimers.entries()) {
      clearTimeout(timer);
      this.batchTimers.delete(batchKey);
    }

    this.log(`Cancelled all pending requests`);
  }

  /**
   * Register a custom batch transformer
   */
  public registerBatchTransformer(batchKey: string, transformer: BatchTransformer): void {
    this.options.customBatchTransformers[batchKey] = transformer;
    this.log(`Registered batch transformer for ${batchKey}`);
  }

  /**
   * Get the current pending request count
   */
  public getPendingCount(): number {
    let count = 0;
    for (const [_, requests] of this.pendingRequests.entries()) {
      count += requests.filter(r => !r.isAborted).length;
    }
    return count;
  }
}

/**
 * Factory for creating common batch transformers
 */
export const BatchTransformers = {
  /**
   * Create a transformer for GraphQL batch operations
   * that combines multiple queries into a single request
   */
  createGraphQLBatchTransformer(endpoint: string): BatchTransformer {
    return {
      batchRequests: (requests: PendingRequest[]): {
        url: string;
        method: string;
        body: any;
        headers?: Record<string, string>;
      } => {
        // Combine GraphQL operations into a batch
        const operations = requests.map((request, index) => {
          const body = typeof request.body === 'string'
            ? JSON.parse(request.body)
            : request.body;

          return {
            // Use numbered operation names
            operationName: body.operationName || `operation${index}`,
            query: body.query,
            variables: body.variables || {}
          };
        });

        // Create the batch request
        return {
          url: endpoint,
          method: 'POST',
          headers: requests[0].headers,
          body: { operations }
        };
      },

      extractResponses: (batchResponse: any, requests: PendingRequest[]): any[] => {
        // Extract individual responses from the batch
        if (Array.isArray(batchResponse)) {
          // If the response is already an array, return it directly
          return batchResponse;
        } else if (batchResponse.results && Array.isArray(batchResponse.results)) {
          // If the response has a results array, return that
          return batchResponse.results;
        } else {
          // Fallback: return the same response for all requests
          return requests.map(() => batchResponse);
        }
      }
    };
  },

  /**
   * Create a transformer for REST batch operations
   * that combines multiple requests to the same endpoint
   */
  createRestBatchTransformer(
    endpoint: string,
    idExtractor: (request: Record<string, any>) => string
  ): BatchTransformer {
    return {
      batchRequests: (requests: PendingRequest[]): {
        url: string;
        method: string;
        body: any;
        headers?: Record<string, string>;
      } => {
        // Combine REST operations into a batch
        const items = requests.map(request => {
          const body = typeof request.body === 'string'
            ? JSON.parse(request.body)
            : request.body;

          return {
            id: idExtractor(body),
            ...body
          };
        });

        // Create the batch request
        return {
          url: endpoint,
          method: 'POST',
          headers: requests[0].headers,
          body: { items }
        };
      },

      extractResponses: (batchResponse: any, requests: PendingRequest[]): any[] => {
        // Extract individual responses from the batch
        if (batchResponse.results && Array.isArray(batchResponse.results)) {
          return batchResponse.results;
        } else if (Array.isArray(batchResponse)) {
          return batchResponse;
        } else {
          // Fallback: return the same response for all requests
          return requests.map(() => batchResponse);
        }
      }
    };
  }
};

/**
 * Create a singleton instance of the API batcher
 */
export const apiBatcher = new ApiBatcher({
  maxBatchSize: 25,
  maxDelayMs: 50,
  minDelayMs: 10,
  deduplicate: true,
  maxRetries: 1
});

export default apiBatcher;