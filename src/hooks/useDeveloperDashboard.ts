'use client';

import { useState, useEffect, useCallback } from 'react';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import { useGraphQLQuery } from './useGraphQL';
import { GraphQLResult } from '@/types/common';

// Types for the dashboard data
export interface DashboardFilterInput {
  status?: string[];
  projectType?: string[];
  dateRange?: DateRangeInput;
  location?: string;
}

export interface DateRangeInput {
  startDate: string;
  endDate: string;
}

// Developer Dashboard data interfaces
export interface DeveloperDashboardData {
  stats: DashboardStats;
  recentProjects: Project[];
  recentActivity: ActivityItem[];
  financialSummary: FinancialSummary;
  salesMetrics: SalesMetrics;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalUnits: number;
  soldUnits: number;
  availableUnits: number;
  reservedUnits: number;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  location: {
    city: string;
    county: string;
  };
  images?: string[];
  description: string;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  reservedUnits: number;
  completionDate: string;
  progressPercentage: number;
}

export interface ActivityItem {
  id: string;
  type: 'milestone' | 'document' | 'sale' | 'team' | 'issue';
  title: string;
  description: string;
  timestamp: string;
  projectId?: string;
  projectName?: string;
  userId?: string;
  userName?: string;
}

export interface FinancialSummary {
  totalSales: number;
  totalRevenue: number;
  projectedRevenue: number;
  monthlySales: {
    month: string;
    sales: number;
    revenue: number;
  }[];
}

export interface SalesMetrics {
  conversionRate: number;
  averageSalePrice: number;
  upcomingAppointments: number;
  unitStatusDistribution: {
    status: string;
    count: number;
    color: string;
  }[];
}

// Dashboard preferences interface for customization
export interface DashboardPreferences {
  layout: 'compact' | 'detailed' | 'custom';
  visibleWidgets: string[];
  defaultDateRange: DateRangeInput;
  defaultFilters: DashboardFilterInput;
  refreshInterval: number; // in milliseconds
}

const DEFAULT_PREFERENCES: DashboardPreferences = {
  layout: 'detailed',
  visibleWidgets: ['stats', 'projects', 'activity', 'sales', 'financial'],
  defaultDateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    endDate: new Date().toISOString()
  },
  defaultFilters: {},
  refreshInterval: 5 * 60 * 1000 // 5 minutes
};

// Local storage key for dashboard preferences
const DASHBOARD_PREFERENCES_KEY = 'developer_dashboard_preferences';

/**
 * Hook for managing dashboard preferences
 */
export function useDashboardPreferences() {
  const [preferences, setPreferencesState] = useState<DashboardPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem(DASHBOARD_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferencesState(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading dashboard preferences:', error);
    }
  }, []);

  // Save preferences to localStorage
  const setPreferences = useCallback((newPreferences: Partial<DashboardPreferences>) => {
    setPreferencesState(prev => {
      const updatedPreferences = { ...prev, ...newPreferences };
      try {
        localStorage.setItem(DASHBOARD_PREFERENCES_KEY, JSON.stringify(updatedPreferences));
      } catch (error) {
        console.error('Error saving dashboard preferences:', error);
      }
      return updatedPreferences;
    });
  }, []);

  return { preferences, setPreferences };
}

/**
 * Hook for fetching developer dashboard overview data
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
        stats {
          totalProjects
          activeProjects
          completedProjects
          totalUnits
          soldUnits
          availableUnits
          reservedUnits
        }
        recentProjects {
          id
          name
          status
          location {
            city
            county
          }
          images
          description
          totalUnits
          availableUnits
          soldUnits
          reservedUnits
          completionDate
          progressPercentage
        }
        recentActivity {
          id
          type
          title
          description
          timestamp
          projectId
          projectName
          userId
          userName
        }
        financialSummary {
          totalSales
          totalRevenue
          projectedRevenue
          monthlySales {
            month
            sales
            revenue
          }
        }
        salesMetrics {
          conversionRate
          averageSalePrice
          upcomingAppointments
          unitStatusDistribution {
            status
            count
            color
          }
        }
      }
    }
  `;

  return useGraphQLQuery<{ developerDashboard: DeveloperDashboardData }, Error>(
    ['developerDashboard', filter, dateRange],
    query,
    { filter, dateRange },
    { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000, ...options }
  );
}

/**
 * Hook for fetching recent development projects
 */
export function useRecentProjects(
  limit: number = 5,
  options?: Omit<UseQueryOptions<GraphQLResult<{ recentProjects: Project[] }>, Error>,
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetRecentProjects($limit: Int) {
      recentProjects(limit: $limit) {
        id
        name
        status
        location {
          city
          county
        }
        images
        description
        totalUnits
        availableUnits
        soldUnits
        reservedUnits
        completionDate
        progressPercentage
      }
    }
  `;

  return useGraphQLQuery<{ recentProjects: Project[] }, Error>(
    ['recentProjects', limit],
    query,
    { limit },
    { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000, ...options }
  );
}

/**
 * Hook for fetching financial dashboard data
 */
export function useFinancialDashboard(
  filter?: DashboardFilterInput,
  dateRange?: DateRangeInput,
  options?: Omit<UseQueryOptions<GraphQLResult<{ financialDashboard: FinancialSummary }>, Error>,
    'queryKey' | 'queryFn'>
) {
  const query = /* GraphQL */ `
    query GetFinancialDashboard($filter: DashboardFilterInput, $dateRange: DateRangeInput) {
      financialDashboard(filter: $filter, dateRange: $dateRange) {
        totalSales
        totalRevenue
        projectedRevenue
        monthlySales {
          month
          sales
          revenue
        }
      }
    }
  `;

  return useGraphQLQuery<{ financialDashboard: FinancialSummary }, Error>(
    ['financialDashboard', filter, dateRange],
    query,
    { filter, dateRange },
    { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000, ...options }
  );
}

/**
 * Hook that leverages existing hooks for backward compatibility
 */
export function useDeveloperDashboard() {
  const { data: developmentsData, isLoading: isDevelopmentsLoading, error: developmentsError } =
    useDeveloperDashboardOverview();

  // Format and transform the data to match the expected structure
  const transformedData = {
    activeProjects: developmentsData?.developerDashboard.stats.activeProjects || 0,
    propertiesAvailable: developmentsData?.developerDashboard.stats.availableUnits || 0,
    totalSales: developmentsData?.developerDashboard.financialSummary.totalSales || 0,
    projects: developmentsData?.developerDashboard.recentProjects || []
  };

  return {
    data: transformedData,
    loading: isDevelopmentsLoading,
    error: developmentsError
  };
}

export default useDeveloperDashboard;