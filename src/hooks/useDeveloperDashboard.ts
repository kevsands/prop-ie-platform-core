'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { developerRestApiService } from '@/services/developerRestApiService';

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
  options?: UseQueryOptions<DeveloperDashboardData, Error>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['developerDashboard', user?.id, filter, dateRange],
    queryFn: () => developerRestApiService.getDeveloperDashboard(filter, dateRange),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * Hook for fetching recent development projects
 */
export function useRecentProjects(
  limit: number = 5,
  options?: UseQueryOptions<Project[], Error>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recentProjects', user?.id, limit],
    queryFn: async () => {
      const projects = await developerRestApiService.getProjects();
      return projects.slice(0, limit);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * Hook for fetching financial dashboard data
 */
export function useFinancialDashboard(
  filter?: DashboardFilterInput,
  dateRange?: DateRangeInput,
  options?: UseQueryOptions<FinancialSummary, Error>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['financialDashboard', user?.id, filter, dateRange],
    queryFn: () => developerRestApiService.getFinancialData(dateRange),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * Hook that leverages existing hooks for backward compatibility
 */
export function useDeveloperDashboard() {
  const { data: developmentsData, isLoading: isDevelopmentsLoading, error: developmentsError } =
    useDeveloperDashboardOverview();

  // Format and transform the data to match the expected structure
  const transformedData = {
    activeProjects: developmentsData?.stats.activeProjects || 0,
    propertiesAvailable: developmentsData?.stats.availableUnits || 0,
    totalSales: developmentsData?.financialSummary.totalSales || 0,
    projects: developmentsData?.recentProjects || []
  };

  return {
    data: transformedData,
    loading: isDevelopmentsLoading,
    error: developmentsError
  };
}

export default useDeveloperDashboard;