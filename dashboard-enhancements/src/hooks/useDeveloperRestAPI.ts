/**
 * Developer REST API Hook
 * 
 * Updated version of useDeveloperDashboard that connects to the newly enabled REST endpoints
 * instead of GraphQL. This preserves the existing hook interface while using real APIs.
 */

import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { 
  developerRestApiService,
  type DeveloperDashboardData,
  type DashboardFilterInput,
  type DateRangeInput,
  type DeveloperProject,
  type FinancialSummary,
  type ActivityItem,
  type SalesMetrics
} from '@/services/developerRestApiService';

// Re-export types for convenience
export type {
  DeveloperDashboardData,
  DashboardFilterInput,
  DateRangeInput,
  DeveloperProject,
  FinancialSummary,
  ActivityItem,
  SalesMetrics
} from '@/services/developerRestApiService';

export function useDeveloperRestAPI() {
  const { user } = useAuth();

  // Dashboard Operations
  const useDeveloperDashboardOverview = (
    filter?: DashboardFilterInput,
    dateRange?: DateRangeInput,
    options?: UseQueryOptions<DeveloperDashboardData, Error>
  ) => {
    return useQuery({
      queryKey: ['developerDashboard', user?.id, filter, dateRange],
      queryFn: () => developerRestApiService.getDeveloperDashboard(filter, dateRange),
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    });
  };

  const useRecentProjects = (
    limit: number = 5,
    options?: UseQueryOptions<DeveloperProject[], Error>
  ) => {
    return useQuery({
      queryKey: ['recentProjects', user?.id, limit],
      queryFn: async () => {
        const projects = await developerRestApiService.getProjects();
        return projects.slice(0, limit);
      },
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    });
  };

  const useFinancialDashboard = (
    filter?: DashboardFilterInput,
    dateRange?: DateRangeInput,
    options?: UseQueryOptions<FinancialSummary, Error>
  ) => {
    return useQuery({
      queryKey: ['financialDashboard', user?.id, filter, dateRange],
      queryFn: () => developerRestApiService.getFinancialData(dateRange),
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    });
  };

  const useProjects = (
    options?: UseQueryOptions<DeveloperProject[], Error>
  ) => {
    return useQuery({
      queryKey: ['projects', user?.id],
      queryFn: () => developerRestApiService.getProjects(),
      enabled: !!user,
      staleTime: 3 * 60 * 1000, // 3 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    });
  };

  const useSalesData = (
    options?: UseQueryOptions<any[], Error>
  ) => {
    return useQuery({
      queryKey: ['salesData', user?.id],
      queryFn: () => developerRestApiService.getSalesData(),
      enabled: !!user,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    });
  };

  // Project Management Operations (mutations would be added here)
  const useCreateProject = (options?: UseMutationOptions<DeveloperProject, Error, Partial<DeveloperProject>>) => {
    return useMutation({
      mutationFn: (projectData: Partial<DeveloperProject>) => {
        // This would use the projects API to create a new project
        throw new Error('Create project not yet implemented');
      },
      ...options,
    });
  };

  const useUpdateProject = (options?: UseMutationOptions<DeveloperProject, Error, { id: string; data: Partial<DeveloperProject> }>) => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<DeveloperProject> }) => {
        // This would use the projects API to update a project
        throw new Error('Update project not yet implemented');
      },
      ...options,
    });
  };

  const useDeleteProject = (options?: UseMutationOptions<void, Error, string>) => {
    return useMutation({
      mutationFn: (id: string) => {
        // This would use the projects API to delete a project
        throw new Error('Delete project not yet implemented');
      },
      ...options,
    });
  };

  // Legacy compatibility wrapper that mimics the old useDeveloperDashboard structure
  const useDeveloperDashboard = () => {
    const { data: dashboardData, isLoading, error } = useDeveloperDashboardOverview();

    // Transform the data to match the legacy structure
    const transformedData = {
      activeProjects: dashboardData?.stats.activeProjects || 0,
      propertiesAvailable: dashboardData?.stats.availableUnits || 0,
      totalSales: dashboardData?.financialSummary.totalSales || 0,
      projects: dashboardData?.recentProjects || []
    };

    return {
      data: transformedData,
      loading: isLoading,
      error: error
    };
  };

  return {
    // Dashboard queries
    useDeveloperDashboardOverview,
    useRecentProjects,
    useFinancialDashboard,
    useDeveloperDashboard, // Legacy compatibility
    
    // Data queries
    useProjects,
    useSalesData,
    
    // Project management mutations
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
  };
}

// Export the main hook as default for backward compatibility
export default useDeveloperRestAPI;

// Export individual hooks for specific use cases
export const useDeveloperDashboard = () => {
  const api = useDeveloperRestAPI();
  return api.useDeveloperDashboard();
};

export const useDeveloperDashboardOverview = (
  filter?: DashboardFilterInput,
  dateRange?: DateRangeInput,
  options?: UseQueryOptions<DeveloperDashboardData, Error>
) => {
  const api = useDeveloperRestAPI();
  return api.useDeveloperDashboardOverview(filter, dateRange, options);
};

export const useRecentProjects = (
  limit: number = 5,
  options?: UseQueryOptions<DeveloperProject[], Error>
) => {
  const api = useDeveloperRestAPI();
  return api.useRecentProjects(limit, options);
};

export const useFinancialDashboard = (
  filter?: DashboardFilterInput,
  dateRange?: DateRangeInput,
  options?: UseQueryOptions<FinancialSummary, Error>
) => {
  const api = useDeveloperRestAPI();
  return api.useFinancialDashboard(filter, dateRange, options);
};