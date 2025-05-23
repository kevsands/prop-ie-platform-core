'use client';

/**
 * Developer Dashboard GraphQL Hooks
 * 
 * This file provides custom hooks specifically for the developer dashboard
 * to fetch and manage dashboard data using GraphQL queries.
 */

import { useGraphQLQuery } from '../useGraphQL';
import { GraphQLResult } from '@/types/common';
import { useCallback, useState } from 'react';
import type { QueryOptions as UseQueryOptions } from '@tanstack/react-query';
import { 
  DevelopmentSummary,
  ProjectSummary,
  SalesMetrics,
  DashboardMetrics,
  TimelineEvent,
  User,
  DateRangeInput,
  DashboardFilterInput,
  ProjectStatus,
  ProjectCategory
} from '@/types/graphql';

// Define the type for the dashboard overview data
export interface DeveloperDashboardData {
  metrics: DashboardMetrics;
  recentProjects: ProjectSummary[];
  salesOverview: SalesMetrics;
  recentActivity: TimelineEvent[];
  teamMembers: User[];
}

// Type definition for user preferences
export interface DashboardPreferences {
  defaultDateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  customDateRange?: {
    startDate: string;
    endDate: string;
  };
  visibleWidgets: string[];
  projectStatusFilter: ProjectStatus[];
  projectCategoryFilter: ProjectCategory[];
  favoriteProjects: string[];
  chartTypes: {
    salesChart: 'bar' | 'line' | 'area';
    distributionChart: 'pie' | 'donut' | 'bar';
    progressChart: 'bar' | 'radial';
  };
  dashboardLayout: string;
  refreshInterval: number;
}

/**
 * Hook to fetch complete dashboard data for a developer
 */
export function useDeveloperDashboardOverview(
  filter?: DashboardFilterInput,
  dateRange?: DateRangeInput,
  options?: Omit<UseQueryOptions<GraphQLResult<{ developerDashboard: DeveloperDashboardData }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetDeveloperDashboard($filter: DashboardFilterInput, $dateRange: DateRangeInput) {
      developerDashboard(filter: $filter, dateRange: $dateRange) {
        metrics {
          totalProjects
          activeProjects
          completedProjects
          totalUnits
          availableUnits
          reservedUnits
          soldUnits
          totalSales
          totalRevenue
          projectedRevenue
          conversionRate
        }
        recentProjects {
          id
          name
          status
          category
          progress
          location
          startDate
          completionDate
          totalUnits
          soldUnits
          availableUnits
          reservedUnits
          lastUpdated
          thumbnail
        }
        salesOverview {
          monthlySales {
            month
            year
            count
            value
          }
          salesByStatus {
            status
            count
            value
          }
          conversionRate
          averageTimeToSale
          hotLeads
        }
        recentActivity {
          id
          timestamp
          type
          title
          description
          user {
            id
            fullName
            avatar
          }
          project {
            id
            name
          }
          entityType
          entityId
        }
        teamMembers {
          id
          fullName
          email
          avatar
          phone
          roles
          lastActive
        }
      }
    }
  `;

  return useGraphQLQuery<{ developerDashboard: DeveloperDashboardData }, Error>(
    ['developerDashboard', filterdateRange],
    query,
    { filter, dateRange },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options
    }
  );
}

/**
 * Hook to fetch project stats for a specific timeframe
 */
export function useProjectStats(
  dateRange?: DateRangeInput,
  options?: Omit<UseQueryOptions<GraphQLResult<{ projectStats: any }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetProjectStats($dateRange: DateRangeInput) {
      projectStats(dateRange: $dateRange) {
        totalProjects
        activeProjects
        completedProjects
        delayedProjects
        projectsByStatus {
          status
          count
        }
        projectsByCategory {
          category
          count
        }
        timeline {
          upcomingMilestones {
            id
            projectId
            projectName
            title
            dueDate
            status
          }
          recentCompletions {
            id
            projectId
            projectName
            title
            completedDate
            status
          }
        }
      }
    }
  `;

  return useGraphQLQuery<{ projectStats: any }, Error>(
    ['projectStats', dateRange],
    query,
    { dateRange },
    options
  );
}

/**
 * Hook to fetch financial overview for the developer dashboard
 */
export function useFinancialOverview(
  dateRange?: DateRangeInput,
  options?: Omit<UseQueryOptions<GraphQLResult<{ financialOverview: any }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetFinancialOverview($dateRange: DateRangeInput) {
      financialOverview(dateRange: $dateRange) {
        totalRevenue
        projectedRevenue
        expenses
        profit
        revenueByProject {
          projectId
          projectName
          revenue
          projected
        }
        revenueByMonth {
          month
          year
          revenue
          expenses
          profit
        }
        topPerformingProjects {
          id
          name
          revenue
          profitMargin
          unitsPerMonth
        }
      }
    }
  `;

  return useGraphQLQuery<{ financialOverview: any }, Error>(
    ['financialOverview', dateRange],
    query,
    { dateRange },
    options
  );
}

/**
 * Hook to fetch, save and manage user dashboard preferences
 */
export function useDashboardPreferences() {
  // Get default preferences from localStorage or use defaults
  const getInitialPreferences = (): DashboardPreferences => {
    if (typeof window === 'undefined') {
      return getDefaultPreferences();
    }

    const saved = localStorage.getItem('dashboardPreferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {

      }
    }

    return getDefaultPreferences();
  };

  const getDefaultPreferences = (): DashboardPreferences => ({
    defaultDateRange: 'month',
    visibleWidgets: [
      'projectStats', 
      'salesOverview', 
      'recentProjects', 
      'recentActivity', 
      'teamMembers'
    ],
    projectStatusFilter: [
      ProjectStatus.IN_PROGRESS, 
      ProjectStatus.PLANNING, 
      ProjectStatus.APPROVED
    ],
    projectCategoryFilter: [
      ProjectCategory.RESIDENTIAL, 
      ProjectCategory.COMMERCIAL, 
      ProjectCategory.MIXED
    ],
    favoriteProjects: [],
    chartTypes: {
      salesChart: 'bar',
      distributionChart: 'pie',
      progressChart: 'bar'
    },
    dashboardLayout: 'default',
    refreshInterval: 300 // 5 minutes in seconds
  });

  // State for preferences
  const [preferencessetPreferences] = useState<DashboardPreferences>(getInitialPreferences);

  // Function to update preferences
  const updatePreferences = useCallback((newPrefs: Partial<DashboardPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboardPreferences', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Function to reset preferences to default
  const resetPreferences = useCallback(() => {
    const defaults = getDefaultPreferences();
    setPreferences(defaults);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardPreferences', JSON.stringify(defaults));
    }
  }, []);

  // Return the preferences and update functions
  return { 
    preferences, 
    updatePreferences, 
    resetPreferences 
  };
}

/**
 * Hook to fetch all activities for a specific timeframe
 */
export function useActivityHistory(
  dateRange?: DateRangeInput,
  filter?: { 
    projectIds?: string[]; 
    activityTypes?: string[]; 
    userIds?: string[] 
  },
  options?: Omit<UseQueryOptions<GraphQLResult<{ activityHistory: TimelineEvent[] }>, Error>, 
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetActivityHistory(
      $dateRange: DateRangeInput, 
      $projectIds: [ID!], 
      $activityTypes: [String!], 
      $userIds: [ID!]
    ) {
      activityHistory(
        dateRange: $dateRange, 
        projectIds: $projectIds,
        activityTypes: $activityTypes,
        userIds: $userIds
      ) {
        id
        timestamp
        type
        title
        description
        user {
          id
          fullName
          avatar
        }
        project {
          id
          name
        }
        entityType
        entityId
      }
    }
  `;

  return useGraphQLQuery<{ activityHistory: TimelineEvent[] }, Error>(
    ['activityHistory', dateRange, filter?.projectIds, filter?.activityTypes, filter?.userIds],
    query,
    { 
      dateRange, 
      projectIds: filter?.projectIds,
      activityTypes: filter?.activityTypes,
      userIds: filter?.userIds
    },
    options
  );
}

// Export all hooks as a default object for convenience
export default {
  useDeveloperDashboardOverview,
  useProjectStats,
  useFinancialOverview,
  useDashboardPreferences,
  useActivityHistory
};