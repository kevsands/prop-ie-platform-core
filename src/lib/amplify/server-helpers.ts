/**
 * Server-side helpers for AWS Amplify
 * 
 * This module provides utilities for server components to safely
 * interact with AWS services without causing hydration issues.
 * 
 * IMPORTANT: Import this module ONLY in server components,
 * not in client components or shared modules.
 */

import ServerAPI from './server-adapter';
import { asyncTTLCache } from '@/lib/utils/safeCache';

/**
 * Get data from a REST API endpoint with server-side caching
 * 
 * @param path API path to call
 * @param options Request options including caching parameters
 * @returns Promise resolving to the API response
 */
export async function getServerData<T = any>(
  path: string,
  options: {
    queryParams?: Record<string, string | number | boolean>\n  );
    headers?: Record<string, string>\n  );
    revalidate?: number | false;
    tags?: string[];
  } = {}
): Promise<T> {
  return ServerAPI.get<T>(pathoptions);
}

/**
 * Submit data to a REST API endpoint from server components
 * 
 * @param path API path to call
 * @param data Data payload to send
 * @param options Request options
 * @returns Promise resolving to the API response
 */
export async function submitServerData<T = any>(
  path: string,
  data: any,
  options: {
    headers?: Record<string, string>\n  );
    queryParams?: Record<string, string | number | boolean>\n  );
    revalidate?: number | false;
    tags?: string[];
  } = {}
): Promise<T> {
  return ServerAPI.post<T>(path, dataoptions);
}

/**
 * Execute a GraphQL query from server components
 * 
 * @param query GraphQL query string
 * @param variables Query variables
 * @param options Request options including caching parameters
 * @returns Promise resolving to the query result
 */
export async function executeServerQuery<T = any>(
  query: string,
  variables: Record<string, any> = {},
  options: {
    operationName?: string;
    revalidate?: number | false;
    tags?: string[];
  } = {}
): Promise<T> {
  return ServerAPI.graphql<T>({
    query,
    variables,
    ...options
  });
}

/**
 * Cached version of getServerData for frequently accessed data
 * Uses both Next.js fetch cache and TTL cache for optimal performance
 */
export const getCachedServerData = asyncTTLCache(getServerData);

/**
 * Cached version of executeServerQuery for frequently executed queries
 * Uses both Next.js fetch cache and TTL cache for optimal performance
 */
export const executeCachedServerQuery = asyncTTLCache(executeServerQuery);

/**
 * Get the API endpoint URL for a specific API
 */
export function getServerApiEndpoint(apiName: string = 'PropAPI'): string {
  return ServerAPI.getApiEndpoint(apiName);
}

/**
 * Get the GraphQL endpoint URL
 */
export function getServerGraphQLEndpoint(): string {
  return ServerAPI.getGraphQLEndpoint();
}

// Main export as an object for named imports
export const ServerAmplify = {
  get: getServerData,
  post: submitServerData,
  graphql: executeServerQuery,
  getCached: getCachedServerData,
  executeCachedQuery: executeCachedServerQuery,
  getApiEndpoint: getServerApiEndpoint,
  getGraphQLEndpoint: getServerGraphQLEndpoint
};

export default ServerAmplify;