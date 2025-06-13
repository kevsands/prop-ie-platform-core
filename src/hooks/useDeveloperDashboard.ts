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
 * Hook that provides comprehensive developer dashboard data
 */
export function useDeveloperDashboard() {
  const { data: developmentsData, isLoading: isDevelopmentsLoading, error: developmentsError } =
    useDeveloperDashboardOverview();

  // Create comprehensive mock data structure that matches DeveloperDashboard expectations
  const transformedData = developmentsData ? {
    developer: {
      id: 'dev-001',
      companyName: 'Premier Property Developments',
      email: 'info@premierproperty.ie',
      phone: '+353 1 234 5678',
      address: 'Dublin 2, Ireland'
    },
    projects: developmentsData.developerDashboard.recentProjects || [],
    properties: [
      {
        id: 'prop-001',
        name: 'Riverside Commons Unit 1A',
        address: 'Liffey Quay, Dublin 2',
        type: 'Apartment',
        status: 'AVAILABLE',
        price: 450000,
        bedrooms: 2,
        bathrooms: 2,
        area: 85
      },
      {
        id: 'prop-002', 
        name: 'Phoenix Gardens Unit 2B',
        address: 'Phoenix Park, Dublin 8',
        type: 'Apartment',
        status: 'SOLD',
        price: 520000,
        bedrooms: 3,
        bathrooms: 2,
        area: 95
      }
    ],
    finances: {
      totalRevenue: developmentsData.developerDashboard.financialSummary.totalRevenue || 0,
      projectedRevenue: developmentsData.developerDashboard.financialSummary.projectedRevenue || 0,
      totalCosts: (developmentsData.developerDashboard.financialSummary.totalRevenue || 0) * 0.7,
      monthlyRevenue: developmentsData.developerDashboard.financialSummary.monthlySales || []
    },
    sales: {
      totalSales: developmentsData.developerDashboard.financialSummary.totalSales || 0,
      averageSalePrice: developmentsData.developerDashboard.salesMetrics.averageSalePrice || 0,
      conversionRate: developmentsData.developerDashboard.salesMetrics.conversionRate || 0
    },
    compliance: {
      overallScore: 94,
      issues: [
        {
          id: 'comp-001',
          title: 'Planning Permission Update Required',
          severity: 'medium',
          status: 'OPEN',
          dueDate: '2024-07-15'
        }
      ],
      criticalIssues: []
    },
    team: [
      {
        id: 'team-001',
        name: 'Sarah Mitchell',
        role: 'Project Manager',
        email: 'sarah@premierproperty.ie'
      }
    ],
    tasks: [
      {
        id: 'task-001',
        title: 'Review architectural plans',
        status: 'pending',
        assignee: 'team-001',
        dueDate: '2024-06-20'
      }
    ],
    notifications: [
      {
        id: 'notif-001',
        type: 'info',
        title: 'New planning application approved',
        message: 'Phoenix Gardens Phase 2 approved',
        timestamp: '2024-06-13T10:00:00Z'
      }
    ],
    analytics: {
      monthlyPerformance: developmentsData.developerDashboard.financialSummary.monthlySales || [],
      projectStatus: [
        { name: 'Active', value: 5, color: '#10B981' },
        { name: 'Planning', value: 2, color: '#F59E0B' },
        { name: 'Completed', value: 8, color: '#3B82F6' }
      ],
      priceTrends: [
        { month: 'Jan', dublin: 450000, cork: 320000, galway: 280000 },
        { month: 'Feb', dublin: 465000, cork: 325000, galway: 285000 },
        { month: 'Mar', dublin: 470000, cork: 330000, galway: 290000 }
      ],
      areas: ['dublin', 'cork', 'galway'],
      demandByType: [
        { type: 'Apartments', demand: 85, supply: 65 },
        { type: 'Houses', demand: 75, supply: 80 },
        { type: 'Commercial', demand: 60, supply: 70 }
      ],
      averageTimeToSale: 45,
      customerSatisfaction: 92,
      roi: 18.5,
      projections: [
        { month: 'Jul', pessimistic: 2000000, realistic: 2500000, optimistic: 3200000 },
        { month: 'Aug', pessimistic: 2100000, realistic: 2700000, optimistic: 3500000 },
        { month: 'Sep', pessimistic: 2200000, realistic: 2900000, optimistic: 3800000 }
      ],
      salesMetrics: developmentsData.developerDashboard.salesMetrics,
      constructionMilestones: [
        {
          id: 'milestone-001',
          projectId: 'proj-001',
          name: 'Foundation Complete',
          status: 'completed',
          completedDate: '2024-05-15'
        }
      ]
    }
  } : null;

  return {
    data: transformedData,
    loading: isDevelopmentsLoading,
    error: developmentsError
  };
}

export default useDeveloperDashboard;