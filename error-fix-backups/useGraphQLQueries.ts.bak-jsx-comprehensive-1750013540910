'use client';

/**
 * GraphQL Query Hooks
 * 
 * This file provides React hooks for common GraphQL queries used throughout the application.
 * Each hook provides loading, error, and data states through React Query.
 */

import { UseQueryOptions } from '@tanstack/react-query';
import { useGraphQLQuery, GraphQLResult } from '../useGraphQL';
import { 
  developmentSummaryFragment, 
  developmentDetailsFragment,
  userSummaryFragment,
  salesStatusFragment,
  documentFragment
} from '@/lib/graphql/fragments';
import { 
  DevelopmentFilterInput, 
  PaginationInput,
  Development,
  DevelopmentSummary,
  DevelopmentsResponse,
  User,
  UsersResponse,
  Document,
  UserFilterInput,
  ProjectMilestone
} from '@/types/graphql';

// Development Queries

/**
 * Hook to fetch developments with filtering and pagination
 */
export function useDevelopments(
  filter?: DevelopmentFilterInput,
  pagination?: PaginationInput,
  options?: Omit<UseQueryOptions<GraphQLResult<{ developments: DevelopmentsResponse }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDevelopments($filter: DevelopmentFilterInput, $pagination: PaginationInput) {
      developments(filter: $filter, pagination: $pagination) {
        developments {
          ...DevelopmentSummary
        }
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
    ${developmentSummaryFragment}
  `;

  return useGraphQLQuery<{ developments: DevelopmentsResponse }, Error>(
    ['developments', filterpagination],
    query,
    { filter, pagination },
    options
  );
}

/**
 * Hook to fetch development details by ID
 */
export function useDevelopment(
  id: string,
  options?: Omit<UseQueryOptions<GraphQLResult<{ development: Development }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDevelopment($id: ID!) {
      development(id: $id) {
        ...DevelopmentDetails
      }
    }
    ${developmentDetailsFragment}
  `;

  return useGraphQLQuery<{ development: Development }, Error>(
    ['development', id],
    query,
    { id },
    options
  );
}

/**
 * Hook to fetch a development by slug
 */
export function useDevelopmentBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<GraphQLResult<{ developmentBySlug: Development }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDevelopmentBySlug($slug: String!) {
      developmentBySlug(slug: $slug) {
        ...DevelopmentDetails
      }
    }
    ${developmentDetailsFragment}
  `;

  return useGraphQLQuery<{ developmentBySlug: Development }, Error>(
    ['development', 'slug', slug],
    query,
    { slug },
    options
  );
}

/**
 * Hook to fetch developments managed by the current user
 * Requires authentication with DEVELOPER role
 */
export function useMyDevelopments(
  filter?: DevelopmentFilterInput,
  pagination?: PaginationInput,
  options?: Omit<UseQueryOptions<GraphQLResult<{ myDevelopments: DevelopmentsResponse }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetMyDevelopments($filter: DevelopmentFilterInput, $pagination: PaginationInput) {
      myDevelopments(filter: $filter, pagination: $pagination) {
        developments {
          ...DevelopmentSummary
        }
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
    ${developmentSummaryFragment}
  `;

  return useGraphQLQuery<{ myDevelopments: DevelopmentsResponse }, Error>(
    ['myDevelopments', filterpagination],
    query,
    { filter, pagination },
    options
  );
}

/**
 * Hook to fetch development statistics for dashboard
 */
export function useDevelopmentStatistics(
  id: string,
  options?: Omit<UseQueryOptions<GraphQLResult<{ developmentStatistics: any }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDevelopmentStatistics($id: ID!) {
      developmentStatistics(id: $id)
    }
  `;

  return useGraphQLQuery<{ developmentStatistics: any }, Error>(
    ['developmentStatistics', id],
    query,
    { id },
    options
  );
}

// User Queries

/**
 * Hook to fetch the current authenticated user
 */
export function useCurrentUser(
  options?: Omit<UseQueryOptions<GraphQLResult<{ me: User }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetCurrentUser {
      me {
        id
        email
        firstName
        lastName
        fullName
        phone
        roles
        status
        kycStatus
        organization
        position
        avatar
        lastActive
      }
    }
  `;

  return useGraphQLQuery<{ me: User }, Error>(
    ['me'],
    query,
    {},
    options
  );
}

/**
 * Hook to fetch a user by ID
 * Requires ADMIN role
 */
export function useUser(
  id: string,
  options?: Omit<UseQueryOptions<GraphQLResult<{ user: User }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        email
        firstName
        lastName
        fullName
        phone
        roles
        status
        kycStatus
        organization
        position
        avatar
        lastActive
        lastLogin
      }
    }
  `;

  return useGraphQLQuery<{ user: User }, Error>(
    ['user', id],
    query,
    { id },
    options
  );
}

/**
 * Hook to fetch users with filtering and pagination
 * Requires ADMIN or DEVELOPER role
 */
export function useUsers(
  filter?: UserFilterInput,
  pagination?: PaginationInput,
  options?: Omit<UseQueryOptions<GraphQLResult<{ users: UsersResponse }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetUsers($filter: UserFilterInput, $pagination: PaginationInput) {
      users(filter: $filter, pagination: $pagination) {
        users {
          id
          email
          firstName
          lastName
          fullName
          roles
          status
          organization
          avatar
        }
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

  return useGraphQLQuery<{ users: UsersResponse }, Error>(
    ['users', filterpagination],
    query,
    { filter, pagination },
    options
  );
}

/**
 * Hook to search for users by name or email
 */
export function useSearchUsers(
  query: string,
  roles?: string[],
  pagination?: PaginationInput,
  options?: Omit<UseQueryOptions<GraphQLResult<{ searchUsers: UsersResponse }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const gqlQuery = /* GraphQL */ `
    query SearchUsers($query: String!, $roles: [Role!], $pagination: PaginationInput) {
      searchUsers(query: $query, roles: $roles, pagination: $pagination) {
        users {
          ...UserSummary
        }
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
    ${userSummaryFragment}
  `;

  return useGraphQLQuery<{ searchUsers: UsersResponse }, Error>(
    ['searchUsers', query, rolespagination],
    gqlQuery,
    { query, roles, pagination },
    options
  );
}

// Document Queries

/**
 * Hook to fetch documents for a development
 */
export function useDevelopmentDocuments(
  developmentId: string,
  options?: Omit<UseQueryOptions<GraphQLResult<{ developmentDocuments: Document[] }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDevelopmentDocuments($developmentId: ID!) {
      developmentDocuments(developmentId: $developmentId) {
        ...DocumentDetails
      }
    }
    ${documentFragment}
  `;

  return useGraphQLQuery<{ developmentDocuments: Document[] }, Error>(
    ['developmentDocuments', developmentId],
    query,
    { developmentId },
    options
  );
}

// Project Timeline Queries

/**
 * Hook to fetch project milestones for a development
 */
export function useDevelopmentMilestones(
  developmentId: string,
  options?: Omit<UseQueryOptions<GraphQLResult<{ developmentMilestones: ProjectMilestone[] }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDevelopmentMilestones($developmentId: ID!) {
      developmentMilestones(developmentId: $developmentId) {
        id
        name
        description
        plannedDate
        actualDate
        status
        dependencies {
          id
          name
        }
      }
    }
  `;

  return useGraphQLQuery<{ developmentMilestones: ProjectMilestone[] }, Error>(
    ['developmentMilestones', developmentId],
    query,
    { developmentId },
    options
  );
}

// Sales Queries

/**
 * Hook to fetch sales status for a development
 */
export function useDevelopmentSalesStatus(
  developmentId: string,
  options?: Omit<UseQueryOptions<GraphQLResult<{ developmentSalesStatus: any }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDevelopmentSalesStatus($developmentId: ID!) {
      developmentSalesStatus(developmentId: $developmentId) {
        ...SalesStatus
      }
    }
    ${salesStatusFragment}
  `;

  return useGraphQLQuery<{ developmentSalesStatus: any }, Error>(
    ['developmentSalesStatus', developmentId],
    query,
    { developmentId },
    options
  );
}