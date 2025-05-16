import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from 'aws-amplify/api';

// Initialize the API client
const apiClient = generateClient();

// Define a type that works with both GraphQL result types
export type SafeGraphQLResult<T> = GraphQLResult<T>;

export async function safeGraphQLQuery<T>(query: string, variables?: any): Promise<T | null> {
  try {
    const result = await apiClient.graphql<T>({ query, variables });
    return result.data || null;
  } catch (error) {
    console.error('GraphQL query failed:', error);
    return null;
  }
}

// Use this to safely access data property
export function getSafeData<T>(result: any): T | null {
  if (result && typeof result === 'object' && 'data' in result) {
    return result.data as T;
  }
  return null;
}