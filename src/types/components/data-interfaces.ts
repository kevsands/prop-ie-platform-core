/**
 * Component Data Interface Definitions
 * 
 * This file contains TypeScript interfaces that define the prop types
 * for components that need to integrate with the GraphQL schema.
 * These interfaces match the GraphQL schema types to ensure type safety
 * between the API and UI components.
 */

import type { CurrencyCode, MonetaryAmount } from '../finance/development-finance';

/**
 * GraphQL API Response Types
 * These types match the GraphQL schema response shapes
 */

// Base Types for API Responses
export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>\n  );
    path: string[];
  }>\n  );
}

// Financial Metric Response from GraphQL API
export interface FinancialMetricResponse {
  value: number;
  previousValue?: number;
  percentageChange?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendData?: Array<{
    date: string;
    value: number;
    isProjected?: boolean;
  }>\n  );
}

// Development Financial Metrics Response
export interface DevelopmentFinancialMetricsResponse {
  roi: FinancialMetricResponse;
  profitMargin: FinancialMetricResponse;
  constructionCosts: FinancialMetricResponse;
  salesVelocity: FinancialMetricResponse;
  trendData: Array<{
    metric: string;
    data: Array<{
      date: string;
      value: number;
      isProjected?: boolean;
    }>\n  );
  }>\n  );
}

// Cash Flow Data Response
export interface CashFlowDataResponse {
  inflows: MonetaryAmount;
  outflows: MonetaryAmount;
  netCashFlow: MonetaryAmount;
  cashFlowData: Array<{
    date: string;
    inflows: number;
    outflows: number;
    netCashFlow: number;
  }>\n  );
  inflowCategories: Array<{
    name: string;
    amount: MonetaryAmount;
    percentage: number;
  }>\n  );
  outflowCategories: Array<{
    name: string;
    amount: MonetaryAmount;
    percentage: number;
  }>\n  );
  peakNegativeCashFlow?: MonetaryAmount;
  projectedBreakEvenDate?: string;
}

// Budget vs Actual Data Response
export interface BudgetVsActualDataResponse {
  totalBudget: MonetaryAmount;
  totalActual: MonetaryAmount;
  totalVariance: MonetaryAmount;
  totalVariancePercentage: number;
  categories: Array<{
    name: string;
    budget: MonetaryAmount;
    actual: MonetaryAmount;
    variance: MonetaryAmount;
    variancePercentage: number;
    isOverBudget: boolean;
  }>\n  );
  timeSeries?: Array<{
    date: string;
    budget: number;
    actual: number;
  }>\n  );
  completionPercentage: number;
  timeElapsedPercentage: number;
}

/**
 * Component Prop Interfaces
 * These interfaces define the expected props for UI components that will
 * display data from the GraphQL API.
 */

// MetricCard Component Props with GraphQL Integration
export interface MetricCardGraphQLProps {
  title: string;
  metricPath: string; // Path to the metric in the GraphQL response (e.g., 'roi')
  queryKey: string[]; // React Query key for fetching the data
  query: string; // GraphQL query
  variables: Record<string, any>; // GraphQL variables
  prefix?: string;
  suffix?: string;
  formatValue?: (value: number) => string; // Optional formatter
  showTrend?: boolean;
  invertTrend?: boolean; // Whether increasing values are considered negative
  className?: string;
}

// FinancialChart Component Props with GraphQL Integration
export interface FinancialChartGraphQLProps {
  title: string;
  description?: string;
  metricsToDisplay: string[]; // Array of metric names to include in the chart
  queryKey: string[]; // React Query key for fetching the data
  query: string; // GraphQL query
  variables: Record<string, any>; // GraphQL variables
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'radar' | 'scatter';
  xAxisLabel?: string;
  yAxisLabel?: string;
  colors?: string[];
  height?: number | string;
  width?: number | string;
  showLegend?: boolean;
  showGrid?: boolean;
  includeForecast?: boolean;
  dateFormat?: string;
}

// CashFlowSummary Component Props with GraphQL Integration
export interface CashFlowSummaryGraphQLProps {
  developmentId: string;
  title?: string;
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  queryKey?: string[]; // Optional custom query key
  className?: string;
}

// BudgetVsActual Component Props with GraphQL Integration
export interface BudgetVsActualGraphQLProps {
  developmentId: string;
  title?: string;
  showCategories?: boolean;
  showTimeSeries?: boolean;
  maxCategories?: number;
  queryKey?: string[]; // Optional custom query key
  className?: string;
}

/**
 * Common Interfaces for Dashboard Layout Integration
 */

// Widget Definition for Dashboard Grid
export interface DashboardWidgetDefinition {
  id: string;
  type: string;
  title: string;
  width: 1 | 2 | 3 | 4; // Grid width (out of 4)
  height: 1 | 2 | 3; // Grid height
  props: Record<string, any>\n  );
}

// Dashboard Layout Configuration with Widgets
export interface DashboardLayoutConfig {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidgetDefinition[];
  filters?: {
    dateRange?: boolean;
    projects?: boolean;
    categories?: boolean;
    granularity?: boolean;
    forecast?: boolean;
  };
  defaultFilters?: Record<string, any>\n  );
}

// Dashboard State Interface
export interface DashboardState {
  layouts: DashboardLayoutConfig[];
  activeLayoutId: string;
  filters: Record<string, any>\n  );
  isLoading: boolean;
  isEditing: boolean;
}

/**
 * GraphQL Fragment Definitions
 * These are useful for sharing common type definitions across queries
 */
export const MONETARY_AMOUNT_FRAGMENT = /* GraphQL */ `
  fragment MonetaryAmountFields on MonetaryAmount {
    amount
    currency
  }
`;

export const FINANCIAL_METRIC_FRAGMENT = /* GraphQL */ `
  fragment FinancialMetricFields on FinancialMetric {
    value
    previousValue
    percentageChange
    trend
  }
`;

export const CASH_FLOW_DATA_FRAGMENT = /* GraphQL */ `
  fragment CashFlowDataFields on CashFlowData {
    date
    inflows
    outflows
    netCashFlow
  }
`;

export const BUDGET_CATEGORY_FRAGMENT = /* GraphQL */ `
  fragment BudgetCategoryFields on BudgetCategory {
    name
    budget {
      ...MonetaryAmountFields
    }
    actual {
      ...MonetaryAmountFields
    }
    variance {
      ...MonetaryAmountFields
    }
    variancePercentage
    isOverBudget
  }
  ${MONETARY_AMOUNT_FRAGMENT}
`;