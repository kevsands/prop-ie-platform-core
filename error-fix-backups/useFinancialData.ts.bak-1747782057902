'use client';

import { useGraphQLQuery } from './useGraphQL';
import type { 
  CashFlowSummaryDashboardProps, 
  BudgetVsActualDashboardProps,
  FinancialMetricDataPoint 
} from '@/types/finance/dashboard';

// GraphQL query for financial dashboard data
const GET_CASH_FLOW_DATA = /* GraphQL */ `
  query GetCashFlowData($developmentId: ID!, $timeRange: TimeRange!) {
    getDevelopmentCashFlow(developmentId: $developmentId, timeRange: $timeRange) {
      inflows {
        amount
        currency
      }
      outflows {
        amount
        currency
      }
      netCashFlow {
        amount
        currency
      }
      cashFlowData {
        date
        inflows
        outflows
        netCashFlow
      }
      inflowCategories {
        name
        amount {
          amount
          currency
        }
        percentage
      }
      outflowCategories {
        name
        amount {
          amount
          currency
        }
        percentage
      }
      peakNegativeCashFlow {
        amount
        currency
      }
      projectedBreakEvenDate
    }
  }
`;

const GET_BUDGET_VS_ACTUAL_DATA = /* GraphQL */ `
  query GetBudgetVsActualData($developmentId: ID!) {
    getDevelopmentBudgetVsActual(developmentId: $developmentId) {
      totalBudget {
        amount
        currency
      }
      totalActual {
        amount
        currency
      }
      totalVariance {
        amount
        currency
      }
      totalVariancePercentage
      categories {
        name
        budget {
          amount
          currency
        }
        actual {
          amount
          currency
        }
        variance {
          amount
          currency
        }
        variancePercentage
        isOverBudget
      }
      timeSeries {
        date
        budget
        actual
      }
      completionPercentage
      timeElapsedPercentage
    }
  }
`;

const GET_FINANCIAL_METRICS = /* GraphQL */ `
  query GetFinancialMetrics($developmentId: ID!) {
    getDevelopmentFinancialMetrics(developmentId: $developmentId) {
      roi {
        value
        previousValue
        percentageChange
        trend
      }
      profitMargin {
        value
        previousValue
        percentageChange
        trend
      }
      constructionCosts {
        value
        previousValue
        percentageChange
        trend
      }
      salesVelocity {
        value
        previousValue
        percentageChange
        trend
      }
      trendData {
        metric
        data {
          date
          value
          isProjected
        }
      }
    }
  }
`;

/**
 * Custom hook to fetch cash flow data for a development
 */
export function useCashFlowData(developmentId: string, timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all' = 'month') {
  return useGraphQLQuery<{ getDevelopmentCashFlow: CashFlowSummaryDashboardProps }>(
    ['cashFlow', developmentId, timeRange],
    GET_CASH_FLOW_DATA,
    { developmentId, timeRange },
    {
      // Default React Query options
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      select: (data) => data?.getDevelopmentCashFlow
    }
  );
}

/**
 * Custom hook to fetch budget vs actual data for a development
 */
export function useBudgetVsActualData(developmentId: string) {
  return useGraphQLQuery<{ getDevelopmentBudgetVsActual: BudgetVsActualDashboardProps }>(
    ['budgetVsActual', developmentId],
    GET_BUDGET_VS_ACTUAL_DATA,
    { developmentId },
    {
      // Default React Query options
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      select: (data) => data?.getDevelopmentBudgetVsActual
    }
  );
}

/**
 * Custom hook to fetch financial metrics for a development
 */
export function useFinancialMetrics(developmentId: string) {
  return useGraphQLQuery(
    ['financialMetrics', developmentId],
    GET_FINANCIAL_METRICS,
    { developmentId },
    {
      // Default React Query options
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      select: (data) => {
        const metrics = data?.getDevelopmentFinancialMetrics;
        if (!metrics) return null;
        
        // Transform trend data into the format expected by the FinancialChart component
        const transformTrendData = (metricName: string): FinancialMetricDataPoint[] => {
          const trendData = metrics.trendData.find(t => t.metric === metricName);
          if (!trendData) return [];
          
          return trendData.data.map(point => ({
            date: point.date,
            value: point.value,
            isProjected: point.isProjected
          }));
        };
        
        return {
          roi: metrics.roi,
          profitMargin: metrics.profitMargin,
          constructionCosts: metrics.constructionCosts,
          salesVelocity: metrics.salesVelocity,
          trendData: {
            roi: transformTrendData('roi'),
            profitMargin: transformTrendData('profitMargin'),
            constructionCosts: transformTrendData('constructionCosts'),
            salesVelocity: transformTrendData('salesVelocity')
          }
        };
      }
    }
  );
}

/**
 * Default export for convenience
 */
export default {
  useCashFlowData,
  useBudgetVsActualData,
  useFinancialMetrics
};