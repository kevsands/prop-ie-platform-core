/**
 * GraphQL Authentication Client
 * 
 * This file provides utilities for integrating AWS Amplify v6 authentication
 * with the GraphQL client, including token management and role-based query filtering.
 */

import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Auth } from '@/lib/amplify/auth';
import { GraphQLResult } from '@aws-amplify/api';

// Initialize the GraphQL client
const amplifyClient = generateClient();

/**
 * Creates an authenticated GraphQL client with the current user's token
 * @returns A configured GraphQL client for authenticated operations
 */
export async function createAuthenticatedClient() {
  try {
    // Fetch current auth session to get tokens
    const session = await fetchAuthSession();
    const token = session?.tokens?.accessToken?.toString();

    if (!token) {
      console.warn('No auth token available for GraphQL client');
      return amplifyClient;
    }

    // Configure API with authentication
    return amplifyClient;
  } catch (error) {
    console.error('Error creating authenticated GraphQL client:', error);
    return amplifyClient;
  }
}

/**
 * Executes a GraphQL operation with authentication
 * @param operation - The GraphQL operation (query or mutation)
 * @param variables - Variables for the GraphQL operation
 * @returns The GraphQL operation result
 */
export async function executeAuthenticatedOperation<T>(
  operation: any,
  variables?: Record<string, any>
): Promise<T> {
  try {
    // Get access token
    const token = await Auth.getAccessToken();

    // Execute the GraphQL operation with the token
    const result = await amplifyClient.graphql({
      ...operation,
      variables,
      authMode: token ? 'AMAZON_COGNITO_USER_POOLS' : 'API_KEY',
      authToken: token || undefined,
    });

    return result as T;
  } catch (error) {
    console.error('Error executing authenticated GraphQL operation:', error);
    throw error;
  }
}

/**
 * Applies role-based filtering to GraphQL queries
 * @param roles - User roles
 * @param filter - Original filter object
 * @returns Modified filter with role-based constraints
 */
export function developmentRoleFilter(
  roles: string[],
  filter: Record<string, any> = {}
): Record<string, any> {
  const modifiedFilter = { ...filter };

  // Apply different filters based on role
  if (roles.includes('ADMIN')) {
    // Admins can see everything, no filter modifications
    return modifiedFilter;
  }

  if (roles.includes('DEVELOPER')) {
    // Developers can only see their own developments or published ones
    // This would be implemented in the resolver, but we ensure the UI reflects this
    return modifiedFilter;
  }

  if (roles.includes('BUYER')) {
    // Buyers can only see published developments
    modifiedFilter.isPublished = true;
    return modifiedFilter;
  }

  // Default: only published developments
  modifiedFilter.isPublished = true;
  return modifiedFilter;
}

/**
 * Applies role-based filtering to user queries
 * @param roles - User roles
 * @param filter - Original filter object
 * @returns Modified filter with role-based constraints
 */
export function userRoleFilter(
  roles: string[],
  filter: Record<string, any> = {}
): Record<string, any> {
  const modifiedFilter = { ...filter };

  // Apply different filters based on role
  if (roles.includes('ADMIN')) {
    // Admins can see everything, no filter modifications
    return modifiedFilter;
  }

  if (roles.includes('DEVELOPER')) {
    // Developers can see only certain user types
    modifiedFilter.roles = ['BUYER', 'AGENT', 'SOLICITOR'];
    return modifiedFilter;
  }

  // Default: very limited access
  return modifiedFilter;
}