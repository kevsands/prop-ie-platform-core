/**
 * Financial Dashboard Component Interfaces
 * 
 * These interfaces define the expected props and data structures for
 * financial dashboard components and visualizations.
 */

import { MonetaryAmount, CurrencyCode } from './development-finance';

/**
 * Financial metric data point for time series visualization
 */
export interface FinancialMetricDataPoint {
  date: Date | string;
  value: number;
  formattedValue?: string;
  category?: string;
  isProjected?: boolean;
}

/**
 * Financial metric visualization props
 */
export interface FinancialMetricProps {
  title: string;
  subtitle?: string;
  value: number | string;
  previousValue?: number | string;
  percentageChange?: number;
  isPositiveTrend?: boolean; // Whether an increase is positive
  currency?: CurrencyCode;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  timeRange?: string;
  isLoading?: boolean;
  trendData?: FinancialMetricDataPoint[];
}

/**
 * Financial KPI card props
 */
export interface FinancialKPICardProps {
  title: string;
  value: number | string;
  previousValue?: number | string;
  percentageChange?: number;
  description?: string;
  isPositiveTrend?: boolean;
  icon?: React.ReactNode;
  trendDirection?: 'up' | 'down' | 'neutral';
  target?: number;
  progress?: number; // 0-100
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  isLoading?: boolean;
  onClick?: () => void;
}

/**
 * Financial chart props
 */
export interface FinancialChartProps {
  title: string;
  description?: string;
  data: FinancialMetricDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  seriesNames?: string[];
  colors?: string[];
  isLoading?: boolean;
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'radar' | 'scatter';
  showLegend?: boolean;
  showGrid?: boolean;
  isStacked?: boolean;
  height?: number | string;
  width?: number | string;
  tooltipFormatter?: (value: any) => string;
  dateFormat?: string;
  numberFormat?: Intl.NumberFormatOptions;
  minValue?: number;
  maxValue?: number;
  annotations?: {
    x?: Array<{ value: any; label: string; color?: string }>\n  );
    y?: Array<{ value: number; label: string; color?: string }>\n  );
  };
}

/**
 * Cash flow summary dashboard props
 */
export interface CashFlowSummaryDashboardProps {
  developmentId: string;
  title?: string;
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  inflows: MonetaryAmount;
  outflows: MonetaryAmount;
  netCashFlow: MonetaryAmount;
  cashFlowData: Array<{
    date: Date | string;
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
  projectedBreakEvenDate?: Date;
  isLoading?: boolean;
}

/**
 * Budget vs. Actual dashboard props
 */
export interface BudgetVsActualDashboardProps {
  developmentId: string;
  title?: string;
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
    date: Date | string;
    budget: number;
    actual: number;
  }>\n  );
  completionPercentage: number;
  timeElapsedPercentage: number;
  isLoading?: boolean;
}

/**
 * Funding distribution dashboard props
 */
export interface FundingDistributionDashboardProps {
  developmentId: string;
  title?: string;
  totalFunding: MonetaryAmount;
  fundingSources: Array<{
    name: string;
    type: string;
    amount: MonetaryAmount;
    percentage: number;
    color?: string;
  }>\n  );
  drawdownProgress: Array<{
    source: string;
    total: MonetaryAmount;
    drawn: MonetaryAmount;
    remaining: MonetaryAmount;
    percentage: number;
  }>\n  );
  upcomingDrawdowns?: Array<{
    date: Date;
    amount: MonetaryAmount;
    source: string;
    description?: string;
  }>\n  );
  isLoading?: boolean;
}

/**
 * Investment returns dashboard props
 */
export interface InvestmentReturnsDashboardProps {
  developmentId: string;
  title?: string;
  investmentAmount: MonetaryAmount;
  projectedReturns: {
    totalReturn: MonetaryAmount;
    roi: number;
    irr: number;
    equityMultiple: number;
    paybackPeriod: number;
  };
  actualReturns?: {
    totalReturn: MonetaryAmount;
    roi: number;
    irr: number;
    equityMultiple: number;
    paybackPeriod: number;
  };
  returnComparison?: Array<{
    name: string;
    return: number;
    isProjected?: boolean;
  }>\n  );
  returnByPeriod?: Array<{
    period: string;
    amount: MonetaryAmount;
    percentage: number;
  }>\n  );
  sensitivityAnalysis?: Array<{
    factor: string;
    values: number[];
    returns: number[];
  }>\n  );
  isLoading?: boolean;
}

/**
 * Project financial status dashboard props
 */
export interface ProjectFinancialStatusDashboardProps {
  developmentId: string;
  title?: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'ahead';
  gdv: MonetaryAmount;
  totalCost: MonetaryAmount;
  margin: number;
  profitOnCost: number;
  completionProgress: number;
  salesProgress?: number;
  costPerformanceIndex?: number; // CPI from earned value management
  schedulePerformanceIndex?: number; // SPI from earned value management
  keyMetrics: Array<{
    name: string;
    value: number | string;
    target?: number | string;
    status: 'good' | 'warning' | 'danger' | 'neutral';
  }>\n  );
  risks?: Array<{
    name: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigationPlan?: string;
  }>\n  );
  isLoading?: boolean;
}

/**
 * Financial dashboard filters 
 */
export interface FinancialDashboardFilters {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  projectId?: string;
  categoryFilters?: string[];
  granularity?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  includeForecast?: boolean;
  comparisonPeriod?: 'previous_period' | 'same_period_last_year' | 'ytd' | 'none';
  viewAs?: 'amount' | 'percentage' | 'both';
  groupBy?: string;
  sortBy?: string;
  scenarioId?: string;
}

/**
 * Master financial dashboard props
 */
export interface FinancialDashboardProps {
  userRole: string;
  developmentId?: string;
  dashboardType: 'developer' | 'investor' | 'executive' | 'project_manager';
  filters?: FinancialDashboardFilters;
  isLoading?: boolean;
  widgets: Array<{
    id: string;
    type: string;
    title: string;
    width: 1 | 2 | 3 | 4; // Grid width (out of 4)
    height: 1 | 2 | 3 | 4; // Grid height
    props: any;
  }>\n  );
}

/**
 * Projected sales dashboard props
 */
export interface ProjectedSalesDashboardProps {
  developmentId: string;
  title?: string;
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  totalSalesValue: MonetaryAmount;
  soldValue: MonetaryAmount;
  reservedValue: MonetaryAmount;
  availableValue: MonetaryAmount;
  salesVelocity: number; // Units per period
  projectedSellOutDate: Date;
  salesByPeriod: Array<{
    period: string;
    units: number;
    value: number;
  }>\n  );
  salesByUnitType: Array<{
    unitType: string;
    total: number;
    sold: number;
    reserved: number;
    available: number;
  }>\n  );
  isLoading?: boolean;
}

/**
 * Developer performance dashboard props
 */
export interface DeveloperPerformanceDashboardProps {
  developerId: string;
  title?: string;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageMargin: number;
  averageROI: number;
  projectPerformance: Array<{
    projectId: string;
    name: string;
    status: string;
    margin: number;
    roi: number;
    budgetVariance: number;
    scheduleVariance: number;
  }>\n  );
  performanceTrend: Array<{
    period: string;
    margin: number;
    roi: number;
    projectsCompleted: number;
  }>\n  );
  isLoading?: boolean;
}

/**
 * Custom widget props for extensibility
 */
export interface CustomFinancialWidgetProps {
  title: string;
  type: string;
  data: any;
  config: Record<string, any>\n  );
  dimensions?: {
    width: number | string;
    height: number | string;
  };
  isLoading?: boolean;
  onAction?: (action: string, payload?: any) => void;
}

/**
 * Trend direction for metrics
 */
export type TrendDirection = 'up' | 'down' | 'neutral' | 'flat' | 'warning';

/**
 * Budget vs Actual component props
 */
export interface BudgetVsActualProps {
  title: string;
  description?: string;
  budgetLabel?: string;
  actualLabel?: string;
  budgetValue: number;
  actualValue: number;
  category?: string;
  period?: string;
  invertComparison?: boolean;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Cash Flow Summary component props
 */
export interface CashFlowSummaryProps {
  title: string;
  inflows: number;
  outflows: number;
  netCashFlow: number;
  timeRange: string;
  className?: string;
  isLoading?: boolean;
}

/**
 * Chart component props
 */
export interface ChartProps {
  data: Array<{
    name: string | number;
    value: number;
    [key: string]: any;
  }>\n  );
  type: 'line' | 'bar' | 'area' | 'pie';
  height?: number;
  width?: number;
  className?: string;
}

/**
 * Metric card component props
 */
export interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: number;
  previousValue?: number | string;
  percentChange?: number;
  trendDirection?: TrendDirection;
  description?: string;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
  isPercentage?: boolean;
  showTrend?: boolean;
  targetValue?: number;
  trendText?: string;
  trendPeriod?: string;
  performance?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon?: React.ReactNode;
  miniChart?: React.ReactNode;
  trendData?: any[];
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}