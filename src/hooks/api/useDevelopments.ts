'use client';

import { useGraphQLQuery } from '../useGraphQL';
import type { QueryOptions as UseQueryOptions } from '@tanstack/react-query';
import { GraphQLResult } from '@/types/common';
import { 
  developmentSummaryFragment, 
  developmentDetailsFragment,
  developmentCardFragment
} from '@/lib/graphql/fragments';
import { queryKeys, getCustomStaleTime } from '@/lib/react-query-config';

// Define TypeScript interfaces for our GraphQL responses
export interface Location {
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  county: string;
  eircode?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
}

export interface DeveloperSummary {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  roles?: string[];
}

export interface DevelopmentSummary {
  id: string;
  name: string;
  slug?: string;
  status: string;
  statusColor?: string;
  mainImage: string;
  shortDescription?: string;
  totalUnits: number;
  availableUnits: number;
  priceRange?: string;
  location: Location;
  features?: string[];
  bedrooms?: number | number[];
  bathrooms?: number;
  energyRating?: string;
  availability?: string;
  developer: DeveloperSummary;
}

export interface SalesStatus {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  saleAgreedUnits: number;
  soldUnits: number;
  salesVelocity: number;
  targetPriceAverage: number;
  actualPriceAverage: number;
  projectedSelloutDate?: string;
}

export interface Timeline {
  planningSubmissionDate: string;
  planningDecisionDate?: string;
  constructionStartDate?: string;
  constructionEndDate?: string;
  marketingLaunchDate?: string;
  salesLaunchDate?: string;
}

export interface Unit {
  id: string;
  name: string;
  type: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
}

export interface Development extends DevelopmentSummary {
  description: string;
  images: string[];
  videos?: string[];
  sitePlanUrl?: string;
  brochureUrl?: string;
  virtualTourUrl?: string;
  websiteUrl?: string;
  amenities: string[];
  squareFeet?: number;
  depositAmount?: string;
  buildingType?: string;
  timeline: Timeline;
  salesStatus: SalesStatus;
  tags?: string[];
  showingDates?: string[];
  units?: Unit[];
  created: string;
  updated: string;
  publishedDate?: string;
  isPublished: boolean;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface DevelopmentsResponse {
  developments: DevelopmentSummary[];
  totalCount: number;
  pageInfo: PageInfo;
}

export interface DevelopmentFilterInput {
  search?: string;
  status?: string[];
  developer?: string;
  city?: string;
  county?: string;
  minUnits?: number;
  maxUnits?: number;
  isPublished?: boolean;
  tags?: string[];
}

export interface PaginationInput {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

// GraphQL Queries
const GET_DEVELOPMENT = /* GraphQL */ `
  query GetDevelopment($id: ID!) {
    development(id: $id) {
      ...DevelopmentDetails
    }
  }
  ${developmentDetailsFragment}
`;

const GET_DEVELOPMENT_BY_SLUG = /* GraphQL */ `
  query GetDevelopmentBySlug($slug: String!) {
    developmentBySlug(slug: $slug) {
      ...DevelopmentDetails
    }
  }
  ${developmentDetailsFragment}
`;

const GET_DEVELOPMENTS = /* GraphQL */ `
  query GetDevelopments($filter: DevelopmentFilterInput, $pagination: PaginationInput) {
    developments(filter: $filter, pagination: $pagination) {
      developments {
        ...DevelopmentCard
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
  ${developmentCardFragment}
`;

const GET_MY_DEVELOPMENTS = /* GraphQL */ `
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

// Hook for fetching a development by ID
export function useDevelopment(id?: string, options?: Omit<UseQueryOptions<GraphQLResult<{ development: Development }>, Error, Development>, 'queryKey' | 'queryFn'>) {
  const queryKey = id ? queryKeys.developments.detail(id) : ['development', 'undefined'];

  return useGraphQLQuery<{ development: Development }>(
    queryKey as unknown[],
    GET_DEVELOPMENT,
    { id },
    {
      enabled: Boolean(id),
      refetchOnWindowFocus: false,
      staleTime: getCustomStaleTime(queryKey as string[]),
      ...options,
      select: (data: GraphQLResult<{ development: Development }>) => {
        return data?.data?.development;
      }
    }
  );
}

// Hook for fetching a development by slug
export function useDevelopmentBySlug(slug?: string, options?: Omit<UseQueryOptions<GraphQLResult<{ developmentBySlug: Development }>, Error, Development>, 'queryKey' | 'queryFn'>) {
  const queryKey = slug ? queryKeys.developments.bySlug(slug) : ['development', 'slug', 'undefined'];

  return useGraphQLQuery<{ developmentBySlug: Development }>(
    queryKey as unknown[],
    GET_DEVELOPMENT_BY_SLUG,
    { slug },
    {
      enabled: Boolean(slug),
      refetchOnWindowFocus: false,
      staleTime: getCustomStaleTime(queryKey as string[]),
      ...options,
      select: (data: GraphQLResult<{ developmentBySlug: Development }>) => {
        return data?.data?.developmentBySlug;
      }
    }
  );
}

// Hook for fetching developments with filtering and pagination
export function useDevelopments(
  options: {
    filter?: DevelopmentFilterInput;
    pagination?: PaginationInput;
  } = {},
  queryOptions?: Omit<UseQueryOptions<GraphQLResult<{ developments: DevelopmentsResponse }>, Error, DevelopmentsResponse>, 'queryKey' | 'queryFn'>
) {
  const filters = JSON.stringify(options.filter || {});
  const queryKey = queryKeys.developments.list(filters);

  return useGraphQLQuery<{ developments: DevelopmentsResponse }>(
    queryKey as any[],
    GET_DEVELOPMENTS,
    {
      filter: options.filter || null,
      pagination: options.pagination || null
    },
    {
      refetchOnWindowFocus: false,
      staleTime: getCustomStaleTime(queryKey as any),
      ...queryOptions,
      select: (data: GraphQLResult<{ developments: DevelopmentsResponse }>) => {
        return data?.data?.developments || { developments: [], totalCount: 0, pageInfo: { hasNextPage: false, hasPreviousPage: false } };
      }
    }
  );
}

// Hook for fetching developments owned by the current user
export function useMyDevelopments(
  options: {
    filter?: DevelopmentFilterInput;
    pagination?: PaginationInput;
  } = {},
  queryOptions?: Omit<UseQueryOptions<GraphQLResult<{ myDevelopments: DevelopmentsResponse }>, Error, DevelopmentsResponse>, 'queryKey' | 'queryFn'>
) {
  const filters = JSON.stringify(options.filter || {});
  const queryKey = [...queryKeys.developments.all, 'my', filters];

  return useGraphQLQuery<{ myDevelopments: DevelopmentsResponse }>(
    queryKey as any[],
    GET_MY_DEVELOPMENTS,
    {
      filter: options.filter || null,
      pagination: options.pagination || null
    },
    {
      refetchOnWindowFocus: false,
      staleTime: getCustomStaleTime(queryKey as any),
      ...queryOptions,
      select: (data: GraphQLResult<{ myDevelopments: DevelopmentsResponse }>) => {
        return data?.data?.myDevelopments || { developments: [], totalCount: 0, pageInfo: { hasNextPage: false, hasPreviousPage: false } };
      }
    }
  );
}

// Utility function to get status color class based on status
export function getStatusColorClass(statusColor?: string): string {
  if (!statusColor) return 'bg-gray-500';

  // Handle both formats: 'green' and 'green-500'
  if (statusColor.includes('-')) {
    return `bg-${statusColor}`;
  }

  switch (statusColor) {
    case 'green': return 'bg-green-500';
    case 'blue': return 'bg-blue-500';
    case 'yellow': return 'bg-yellow-500';
    case 'gray': return 'bg-gray-500';
    case 'purple': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
}