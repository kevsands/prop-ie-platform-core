'use client';

/**
 * Developer Dashboard GraphQL Hooks
 * 
 * Custom hooks for fetching and managing developer dashboard data
 * using GraphQL and React Query.
 */

import { useGraphQLQuery } from '../useGraphQL';
import type { QueryOptions as UseQueryOptions } from '@tanstack/react-query';
import { GraphQLResult } from '@/types/common';
import { 
  DeveloperDashboardData, 
  DeveloperProject, 
  FinancialMetric,
  ProjectProgress,
  SalesTrend,
  Milestone,
  DashboardFilter
} from '@/types/dashboard';
import {
  dashboardMetricsFragment,
  developerProjectFragment,
  projectSummaryFragment,
  salesMetricsFragment,
  timelineEventFragment
} from '@/lib/graphql/fragments';

interface DashboardQueryOptions {
  timeRange?: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  customDateRange?: {
    startDate: string;
    endDate: string;
  };
  projectStatus?: string[];
  projectTypes?: string[];
  locations?: string[];
}

/**
 * Hook to fetch comprehensive dashboard data for developers
 */
export function useDeveloperDashboard(
  options?: DashboardQueryOptions,
  queryOptions?: Omit<UseQueryOptions<GraphQLResult<{ developerDashboard: DeveloperDashboardData }>, Error>, 'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDeveloperDashboard($timeRange: String, $customDateRange: DateRangeInput, $projectStatus: [String], $projectTypes: [String], $locations: [String]) {
      developerDashboard(
        timeRange: $timeRange, 
        customDateRange: $customDateRange, 
        projectStatus: $projectStatus,
        projectTypes: $projectTypes,
        locations: $locations
      ) {
        activeProjects
        propertiesAvailable
        totalSales
        projects {
          ...DeveloperProject
        }
        salesTrend {
          period
          percentage
          direction
        }
        upcomingMilestones {
          id
          title
          projectId
          projectName
          date
          status
          description
        }
        financialMetrics {
          key
          label
          value
          formattedValue
          change
          changeDirection
        }
        projectProgress {
          id
          name
          progress
          phase
          endDate
          status
        }
      }
    }
    ${developerProjectFragment}
  `;

  const variables = {
    timeRange: options?.timeRange,
    customDateRange: options?.customDateRange,
    projectStatus: options?.projectStatus,
    projectTypes: options?.projectTypes,
    locations: options?.locations
  };

  return useGraphQLQuery<{ developerDashboard: DeveloperDashboardData }, Error>(
    ['developerDashboard', variables],
    query,
    variables,
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...queryOptions
    }
  );
}

/**
 * Hook to fetch only project data for the dashboard
 */
export function useDeveloperProjects(
  options?: DashboardQueryOptions,
  queryOptions?: Omit<UseQueryOptions<GraphQLResult<{ developerProjects: DeveloperProject[] }>, Error>, 'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDeveloperProjects($timeRange: String, $customDateRange: DateRangeInput, $projectStatus: [String], $projectTypes: [String], $locations: [String]) {
      developerProjects(
        timeRange: $timeRange, 
        customDateRange: $customDateRange, 
        projectStatus: $projectStatus,
        projectTypes: $projectTypes,
        locations: $locations
      ) {
        ...DeveloperProject
      }
    }
    ${developerProjectFragment}
  `;

  const variables = {
    timeRange: options?.timeRange,
    customDateRange: options?.customDateRange,
    projectStatus: options?.projectStatus,
    projectTypes: options?.projectTypes,
    locations: options?.locations
  };

  return useGraphQLQuery<{ developerProjects: DeveloperProject[] }, Error>(
    ['developerProjects', variables],
    query,
    variables,
    queryOptions
  );
}

/**
 * Hook to fetch financial metrics for the dashboard
 */
export function useFinancialMetrics(
  options?: DashboardQueryOptions,
  queryOptions?: Omit<UseQueryOptions<GraphQLResult<{ financialMetrics: FinancialMetric[] }>, Error>, 'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetFinancialMetrics($timeRange: String, $customDateRange: DateRangeInput) {
      financialMetrics(
        timeRange: $timeRange, 
        customDateRange: $customDateRange
      ) {
        key
        label
        value
        formattedValue
        change
        changeDirection
      }
    }
  `;

  const variables = {
    timeRange: options?.timeRange,
    customDateRange: options?.customDateRange
  };

  return useGraphQLQuery<{ financialMetrics: FinancialMetric[] }, Error>(
    ['financialMetrics', variables],
    query,
    variables,
    queryOptions
  );
}

/**
 * Hook to fetch project progress data
 */
export function useProjectProgress(
  options?: DashboardQueryOptions,
  queryOptions?: Omit<UseQueryOptions<GraphQLResult<{ projectProgress: ProjectProgress[] }>, Error>, 'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetProjectProgress($projectStatus: [String], $projectTypes: [String], $locations: [String]) {
      projectProgress(
        projectStatus: $projectStatus,
        projectTypes: $projectTypes,
        locations: $locations
      ) {
        id
        name
        progress
        phase
        endDate
        status
      }
    }
  `;

  const variables = {
    projectStatus: options?.projectStatus,
    projectTypes: options?.projectTypes,
    locations: options?.locations
  };

  return useGraphQLQuery<{ projectProgress: ProjectProgress[] }, Error>(
    ['projectProgress', variables],
    query,
    variables,
    queryOptions
  );
}

/**
 * Hook to fetch upcoming milestones
 */
export function useUpcomingMilestones(
  limit: number = 5,
  queryOptions?: Omit<UseQueryOptions<GraphQLResult<{ upcomingMilestones: Milestone[] }>, Error>, 'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetUpcomingMilestones($limit: Int) {
      upcomingMilestones(limit: $limit) {
        id
        title
        projectId
        projectName
        date
        completed
        upcoming
        delayed
        daysRemaining
        description
        status
      }
    }
  `;

  return useGraphQLQuery<{ upcomingMilestones: Milestone[] }, Error>(
    ['upcomingMilestones', limit],
    query,
    { limit },
    queryOptions
  );
}

/**
 * Hook to fetch sales trend data
 */
export function useSalesTrend(
  options?: DashboardQueryOptions,
  queryOptions?: Omit<UseQueryOptions<GraphQLResult<{ salesTrend: SalesTrend }>, Error>, 'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetSalesTrend($timeRange: String, $customDateRange: DateRangeInput) {
      salesTrend(
        timeRange: $timeRange, 
        customDateRange: $customDateRange
      ) {
        period
        percentage
        direction
      }
    }
  `;

  const variables = {
    timeRange: options?.timeRange,
    customDateRange: options?.customDateRange
  };

  return useGraphQLQuery<{ salesTrend: SalesTrend }, Error>(
    ['salesTrend', variables],
    query,
    variables,
    queryOptions
  );
}

/**
 * Hook to fetch dashboard filters (available options for filtering)
 */
export function useDashboardFilters(
  queryOptions?: Omit<UseQueryOptions<GraphQLResult<{ dashboardFilters: any }>, Error>, 'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDashboardFilters {
      dashboardFilters {
        projectStatuses
        projectTypes
        locations
      }
    }
  `;

  return useGraphQLQuery<{ dashboardFilters: any }, Error>(
    ['dashboardFilters'],
    query,
    {},
    queryOptions
  );
}

// Export all hooks as a default object for convenience
export default {
  useDeveloperDashboard,
  useDeveloperProjects,
  useFinancialMetrics,
  useProjectProgress,
  useUpcomingMilestones,
  useSalesTrend,
  useDashboardFilters
};