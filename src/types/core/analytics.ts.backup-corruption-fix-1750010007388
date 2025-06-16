/**
 * PropIE Core Data Model - Analytics and AI
 * Defines analytics, reporting, and AI integration interfaces
 */

import { Development } from './development';
import { Lead } from './marketing';
import { Project } from './project';
import { Sale } from './sales';
import { Unit } from './unit';
import { User } from './user';

/**
 * Analytics Dashboard interface
 * Comprehensive analytics dashboard
 */
export interface AnalyticsDashboard {
  id: string;
  name: string;
  owner: User;
  type: DashboardType;
  created: Date;
  updated: Date;
  lastRefreshed: Date;
  refreshFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  isPublic: boolean;
  allowedUsers: User[];
  
  // Dashboard components
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  
  // Data sources and connections
  dataSources: DataSource[];
  
  // Organization
  layout: {
    rows: number;
    columns: number;
    widgetPositions: Record<string, { row: number; col: number; width: number; height: number }>\n  );
  };
  
  // Style and appearance
  theme: 'light' | 'dark' | 'custom';
  customTheme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  
  // Export and sharing
  exportOptions: {
    allowPDF: boolean;
    allowCSV: boolean;
    allowScheduledReports: boolean;
  };
  
  // Metadata
  description?: string;
  tags: string[];
}

/**
 * Dashboard Type enum
 * Types of analytics dashboards
 */
export enum DashboardType {
  EXECUTIVE = 'executive',
  SALES = 'sales',
  MARKETING = 'marketing',
  FINANCIAL = 'financial',
  CONSTRUCTION = 'construction',
  INVESTOR = 'investor',
  OPERATIONAL = 'operational',
  CUSTOM = 'custom'
}

/**
 * Dashboard Widget interface
 * Individual visualization component
 */
export interface DashboardWidget {
  id: string;
  name: string;
  type: WidgetType;
  dataSource: DataSource;
  
  // Query and data
  query: string;
  dataTransformations: DataTransformation[];
  refreshInterval?: number; // in seconds
  
  // Visualization settings
  visualization: {
    type: VisualizationType;
    config: Record<string, any>; // Depends on visualization type
    xAxis?: string;
    yAxis?: string[];
    groupBy?: string;
    colorBy?: string;
    labels?: string[];
    legend?: boolean;
    showValues?: boolean;
  };
  
  // Alerts and thresholds
  thresholds?: {
    field: string;
    warning: number;
    critical: number;
    comparator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  }[];
  
  // Drill-down and interactivity
  drillDown?: {
    enabled: boolean;
    targetDashboard?: string;
    passingParameters: Record<string, string>\n  );
  };
  
  // Organization
  position: {
    row: number;
    col: number;
    width: number;
    height: number;
  };
  
  // Metadata
  description?: string;
  created: Date;
  updated: Date;
}

/**
 * Widget Type enum
 * Types of dashboard widgets
 */
export enum WidgetType {
  CHART = 'chart',
  KPI = 'kpi',
  TABLE = 'table',
  MAP = 'map',
  TEXT = 'text',
  FILTER = 'filter',
  MEDIA = 'media',
  CUSTOM = 'custom'
}

/**
 * Visualization Type enum
 * Types of data visualizations
 */
export enum VisualizationType {
  BAR_CHART = 'bar_chart',
  LINE_CHART = 'line_chart',
  PIE_CHART = 'pie_chart',
  AREA_CHART = 'area_chart',
  SCATTER_PLOT = 'scatter_plot',
  HEATMAP = 'heatmap',
  GAUGE = 'gauge',
  NUMBER = 'number',
  BULLET = 'bullet',
  TABLE = 'table',
  PIVOT_TABLE = 'pivot_table',
  MAP = 'map',
  FUNNEL = 'funnel',
  SANKEY = 'sankey',
  WATERFALL = 'waterfall',
  CALENDAR = 'calendar',
  CUSTOM = 'custom'
}

/**
 * Data Transformation interface
 * Transform data for visualization
 */
export interface DataTransformation {
  type: 'filter' | 'aggregate' | 'sort' | 'limit' | 'calculate' | 'pivot' | 'join' | 'window';
  config: Record<string, any>; // Depends on transformation type
}

/**
 * Dashboard Filter interface
 * Interactive dashboard filter
 */
export interface DashboardFilter {
  id: string;
  name: string;
  field: string;
  type: 'date' | 'string' | 'number' | 'boolean' | 'list' | 'multi_select';
  defaultValue?: any;
  options?: any[];
  dynamicOptions?: {
    source: string;
    valueField: string;
    labelField: string;
  };
  affects: string[]; // widget IDs this filter affects
}

/**
 * Data Source interface
 * Source of analytics data
 */
export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  
  // Connection details (varies by type)
  connection: {
    url?: string;
    apiKey?: string;
    username?: string;
    databaseName?: string;
    tableName?: string;
    refreshToken?: string;
    serviceAccountKey?: string;
  };
  
  // Schema and metadata
  schema: {
    fields: Array<{
      name: string;
      type: string;
      description?: string;
    }>\n  );
    relationships?: Array<{
      from: string;
      to: string;
      type: '1:1' | '1:n' | 'n:n';
    }>\n  );
  };
  
  // Status and health
  status: 'active' | 'inactive' | 'error';
  lastRefreshed?: Date;
  refreshInterval?: number; // in minutes
  
  // Security and access
  accessLevel: 'admin' | 'editor' | 'viewer';
  allowedUsers: User[];
  
  // Metadata
  created: Date;
  updated: Date;
  createdBy: User;
}

/**
 * Data Source Type enum
 * Types of analytics data sources
 */
export enum DataSourceType {
  DATABASE = 'database',
  REST_API = 'rest_api',
  GRAPHQL_API = 'graphql_api',
  FILE = 'file',
  STREAMING = 'streaming',
  CUSTOM = 'custom'
}

/**
 * AI Model interface
 * AI model for property-related predictions
 */
export interface AIModel {
  id: string;
  name: string;
  type: AIModelType;
  version: string;
  
  // Model details
  description: string;
  purpose: string;
  algorithm: string;
  
  // Training information
  trainedOn: Date;
  trainingDataSources: string[];
  trainingDataTimeframe: {
    start: Date;
    end: Date;
  };
  
  // Performance metrics
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    mae?: number; // Mean Absolute Error
    rmse?: number; // Root Mean Square Error
    r2?: number; // R-squared
    otherMetrics?: Record<string, number>\n  );
  };
  
  // Input/Output configuration
  inputFeatures: AIModelFeature[];
  outputFeatures: AIModelFeature[];
  
  // Deployment information
  status: 'in_development' | 'training' | 'testing' | 'deployed' | 'archived';
  deploymentEnvironment?: string;
  endpoint?: string;
  lastUsed?: Date;
  usageCount?: number;
  averageLatency?: number; // in ms
  
  // Model management
  owner: User;
  accessLevel: 'public' | 'organization' | 'private';
  allowedUsers: User[];
  created: Date;
  updated: Date;
  tags: string[];
}

/**
 * AI Model Type enum
 * Types of AI models for real estate
 */
export enum AIModelType {
  PRICE_PREDICTION = 'price_prediction',
  SALES_FORECAST = 'sales_forecast',
  LEAD_SCORING = 'lead_scoring',
  CUSTOMER_SEGMENTATION = 'customer_segmentation',
  PROPERTY_RECOMMENDATION = 'property_recommendation',
  SENTIMENT_ANALYSIS = 'sentiment_analysis',
  CONSTRUCTION_RISK = 'construction_risk',
  MARKET_PREDICTION = 'market_prediction',
  PROJECT_DELAY_PREDICTION = 'project_delay_prediction',
  VISUAL_RECOGNITION = 'visual_recognition',
  DOCUMENT_EXTRACTION = 'document_extraction',
  CUSTOM = 'custom'
}

/**
 * AI Model Feature interface
 * Input or output feature for an AI model
 */
export interface AIModelFeature {
  name: string;
  description: string;
  type: 'numeric' | 'categorical' | 'text' | 'image' | 'date' | 'boolean' | 'array';
  required: boolean;
  format?: string;
  constraints?: {
    min?: number;
    max?: number;
    allowedValues?: any[];
    regex?: string;
  };
  defaultValue?: any;
  importance?: number; // Feature importance if known
}

/**
 * AI Prediction interface
 * Result of an AI model prediction
 */
export interface AIPrediction {
  id: string;
  model: AIModel;
  timestamp: Date;
  requestedBy: User;
  
  // Input data
  inputs: Record<string, any>\n  );
  // Prediction results
  prediction: any;
  confidence?: number;
  probabilityDistribution?: Record<string, number>\n  );
  alternativePredictions?: Array<{
    value: any;
    confidence: number;
  }>\n  );
  // Explanation
  featureContributions?: Record<string, number>\n  );
  explanation?: string;
  
  // Metadata
  executionTime: number; // in ms
  status: 'pending' | 'completed' | 'failed' | 'timeout';
  errorMessage?: string;
}

/**
 * Price Prediction interface
 * Property price prediction
 */
export interface PricePrediction extends AIPrediction {
  // Specific to price prediction
  predictedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  comparableProperties: string[];
  keyFactors: Array<{
    factor: string;
    impact: number; // positive or negative impact on price
    description: string;
  }>\n  );
  confidenceScore: number; // 0-100
  marketConditionAdjustment: number;
  seasonalityAdjustment: number;
}

/**
 * Lead Score Prediction interface
 * Lead quality and conversion prediction
 */
export interface LeadScorePrediction extends AIPrediction {
  lead: Lead;
  
  // Lead scoring results
  leadScore: number; // 0-100
  conversionProbability: number; // 0-1
  estimatedTimeToConversion?: number; // in days
  
  // Insights
  insights: {
    keyPositiveFactors: string[];
    keyNegativeFactors: string[];
    suggestedActions: string[];
  };
  
  // Comparison
  comparisonToSegmentAverage: number; // percentage points +/-
  
  // Next best action
  recommendedActions: Array<{
    action: string;
    expectedImpact: number;
    priority: 'low' | 'medium' | 'high';
  }>\n  );
}

/**
 * Report interface
 * Generated analytics report
 */
export interface Report {
  id: string;
  name: string;
  type: ReportType;
  format: 'pdf' | 'excel' | 'csv' | 'html' | 'json';
  
  // Content and generation
  dashboardId?: string;
  query?: string;
  generatedUrl: string;
  generatedDate: Date;
  parameters: Record<string, any>\n  );
  // Scheduling
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone: string;
    startDate: Date;
    endDate?: Date;
    nextRunDate?: Date;
    lastRunDate?: Date;
    status: 'active' | 'paused' | 'completed';
  };
  
  // Distribution
  distribution: {
    recipients: string[];
    emailSubject?: string;
    emailBody?: string;
    sendIfEmpty: boolean;
  };
  
  // Metadata
  createdBy: User;
  created: Date;
  updated: Date;
  tags: string[];
}

/**
 * Report Type enum
 * Types of analytics reports
 */
export enum ReportType {
  EXECUTIVE_SUMMARY = 'executive_summary',
  SALES_PERFORMANCE = 'sales_performance',
  MARKETING_EFFECTIVENESS = 'marketing_effectiveness',
  FINANCIAL_ANALYSIS = 'financial_analysis',
  CONSTRUCTION_PROGRESS = 'construction_progress',
  LEAD_ANALYSIS = 'lead_analysis',
  CUSTOMER_INSIGHTS = 'customer_insights',
  MARKET_TRENDS = 'market_trends',
  CUSTOM = 'custom'
}

/**
 * Analytics Event interface
 * Trackable event for analytics
 */
export interface AnalyticsEvent {
  id: string;
  eventType: string;
  timestamp: Date;
  source: string;
  
  // User information
  userId?: string;
  anonymousId?: string;
  sessionId?: string;
  
  // Event details
  properties: Record<string, any>\n  );
  // Context information
  context: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    page?: string;
    app?: string;
    screen?: string;
    device?: string;
    os?: string;
    locale?: string;
    timezone?: string;
  };
  
  // Processing information
  processed: boolean;
  processedTimestamp?: Date;
}

/**
 * User Behavior Analytics interface
 * Analysis of user behavior on platform
 */
export interface UserBehaviorAnalytics {
  user: User;
  period: {
    start: Date;
    end: Date;
  };
  
  // Session metrics
  sessions: {
    count: number;
    averageDuration: number; // in seconds
    bounceRate: number;
    deviceBreakdown: Record<string, number>\n  );
    timeOfDayDistribution: number[];
    dayOfWeekDistribution: number[];
  };
  
  // Page and feature usage
  pageViews: Array<{
    page: string;
    views: number;
    averageTimeOnPage: number;
    exitRate: number;
  }>\n  );
  featureUsage: Record<string, {
    count: number;
    lastUsed: Date;
  }>\n  );
  // Search behavior
  searches: {
    count: number;
    topQueries: Array<{
      query: string;
      count: number;
    }>\n  );
    averageResultsViewed: number;
    noResultsQueries: string[];
  };
  
  // Property interactions
  propertyInteractions: {
    viewed: string[];
    viewedCount: number;
    favoritedCount: number;
    inquiredCount: number;
    viewingScheduledCount: number;
    applicationStartedCount: number;
    applicationCompletedCount: number;
  };
  
  // Conversion funnel
  conversionFunnel: {
    entryPoint: string;
    steps: Array<{
      name: string;
      count: number;
      dropOffRate: number;
    }>\n  );
    conversionRate: number;
    averageTimeToConversion: number; // in days
  };
  
  // Engagement metrics
  engagement: {
    score: number; // 0-100
    trend: number; // percentage change from previous period
    segments: string[];
    churnRisk: 'low' | 'medium' | 'high';
  };
}

/**
 * Market Analysis interface
 * Real estate market analytics
 */
export interface MarketAnalytics {
  region: string;
  period: {
    start: Date;
    end: Date;
  };
  
  // Price trends
  priceTrends: {
    averageSalePrice: number;
    medianSalePrice: number;
    pricePerSquareMeter: number;
    yearOverYearChange: number;
    quarterOverQuarterChange: number;
    forecast: Array<{
      period: string;
      predicted: number;
      confidence: {
        lower: number;
        upper: number;
      };
    }>\n  );
  };
  
  // Inventory and sales
  inventory: {
    currentInventory: number;
    newListings: number;
    absorptionRate: number;
    daysOnMarket: number;
    monthsOfSupply: number;
  };
  
  // Demand indicators
  demandIndicators: {
    searchVolume: number;
    searchVolumeChange: number;
    viewingsPerProperty: number;
    offerAcceptanceRate: number;
    bidPriceToAskRatio: number;
  };
  
  // Economic indicators
  economicIndicators: {
    mortgageRates: number;
    mortgageApplications: number;
    unemploymentRate: number;
    housingAffordabilityIndex: number;
    householdIncomeRatio: number;
  };
  
  // Segmentation
  segmentation: {
    priceByPropertyType: Record<string, number>\n  );
    salesByPropertyType: Record<string, number>\n  );
    salesByBedrooms: Record<string, number>\n  );
    hottestNeighborhoods: Array<{
      name: string;
      priceChange: number;
      daysOnMarket: number;
      salesVolume: number;
    }>\n  );
  };
  
  // Competitive analysis
  competitors: Array<{
    developer: string;
    developments: number;
    averagePrice: number;
    salesVelocity: number;
    marketShare: number;
  }>\n  );
}

/**
 * Business Intelligence interface
 * Business performance analytics
 */
export interface BusinessIntelligence {
  period: {
    start: Date;
    end: Date;
  };
  
  // Financial metrics
  financial: {
    revenue: number;
    revenueByDevelopment: Record<string, number>\n  );
    revenueByUnitType: Record<string, number>\n  );
    grossProfitMargin: number;
    operatingExpenses: number;
    marketingROI: number;
    cashFlow: number;
    projectedRevenue: Array<{
      period: string;
      amount: number;
    }>\n  );
  };
  
  // Sales performance
  sales: {
    totalSales: number;
    salesByAgent: Record<string, number>\n  );
    salesConversionRate: number;
    averageSalesCycle: number; // in days
    salesForecast: Array<{
      period: string;
      units: number;
      value: number;
    }>\n  );
  };
  
  // Marketing metrics
  marketing: {
    leadAcquisitionCost: number;
    customerAcquisitionCost: number;
    marketingSpendByChannel: Record<string, number>\n  );
    leadsBySource: Record<string, number>\n  );
    campaignPerformance: Array<{
      campaign: string;
      spend: number;
      leads: number;
      sales: number;
      roi: number;
    }>\n  );
  };
  
  // Operational metrics
  operational: {
    activeProjects: number;
    projectsOnSchedule: number;
    projectsOnBudget: number;
    averageProjectDelay: number; // in days
    constructionProductivity: number;
    contractorPerformance: Record<string, {
      score: number;
      onTimeCompletion: number;
      qualityScore: number;
      costVariance: number;
    }>\n  );
  };
  
  // Customer metrics
  customer: {
    customerSatisfaction: number;
    nps: number; // Net Promoter Score
    reviewSentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
    customerRetention: number;
    referralsGenerated: number;
  };
  
  // Operational efficiency
  efficiency: {
    averageTurnaroundTimes: Record<string, number>; // in days
    resourceUtilization: number;
    processBottlenecks: string[];
    costReductionOpportunities: Array<{
      area: string;
      potentialSavings: number;
      implementationComplexity: 'low' | 'medium' | 'high';
    }>\n  );
  };
  
  // Key business drivers
  keyDrivers: Array<{
    metric: string;
    impact: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    actions: string[];
  }>\n  );
}

/**
 * Helper to calculate key performance indicators
 */
export function calculateKPIs(
  developments: Development[],
  sales: Sale[],
  projects: Project[]
): {
  salesVelocity: number;
  averageSalePrice: number;
  projectsOnSchedule: number;
  customerSatisfaction: number;
} {
  // Calculate total sales in last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSales = sales.filter(sale => 
    new Date(sale.createdAt) >= thirtyDaysAgo
  );
  
  // Sales velocity (sales per month)
  const salesVelocity = recentSales.length;
  
  // Average sale price
  const averageSalePrice = recentSales.length> 0
    ? recentSales.reduce((sumsale: any) => sum + sale.totalPrice0) / recentSales.length
    : 0;
  
  // Projects on schedule
  const onScheduleProjects = projects.filter(project => {
    const today = new Date();
    return (
      project.status === 'in_progress' &&
      new Date(project.plannedEndDate) >= today
    );
  });
  
  const projectsOnSchedule = projects.length> 0
    ? (onScheduleProjects.length / projects.length) * 100
    : 0;
  
  // Simplified customer satisfaction (would normally come from surveys)
  const customerSatisfaction = 85; // placeholder
  
  return {
    salesVelocity,
    averageSalePrice,
    projectsOnSchedule,
    customerSatisfaction
  };
}

/**
 * Helper to generate report categories
 */
export function getReportCategories(): {
  category: string;
  reports: Array<{ id: string; name: string; description: string }>\n  );
}[] {
  return [
    {
      category: 'Executive',
      reports: [
        {
          id: 'exec-summary',
          name: 'Executive Summary',
          description: 'Overview of all key business metrics'
        },
        {
          id: 'exec-forecast',
          name: 'Business Forecast',
          description: 'Projected performance for next quarter'
        }
      ]
    },
    {
      category: 'Sales',
      reports: [
        {
          id: 'sales-performance',
          name: 'Sales Performance',
          description: 'Detailed sales metrics and trends'
        },
        {
          id: 'sales-pipeline',
          name: 'Sales Pipeline',
          description: 'Current sales pipeline and projections'
        }
      ]
    },
    {
      category: 'Marketing',
      reports: [
        {
          id: 'marketing-roi',
          name: 'Marketing ROI',
          description: 'Return on investment for marketing campaigns'
        },
        {
          id: 'lead-analysis',
          name: 'Lead Analysis',
          description: 'Analysis of lead quality and conversion'
        }
      ]
    },
    {
      category: 'Operations',
      reports: [
        {
          id: 'project-status',
          name: 'Project Status',
          description: 'Status of all active development projects'
        },
        {
          id: 'construction-progress',
          name: 'Construction Progress',
          description: 'Progress and timeline for construction projects'
        }
      ]
    },
    {
      category: 'Financial',
      reports: [
        {
          id: 'financial-performance',
          name: 'Financial Performance',
          description: 'Revenue, costs, and profit analysis'
        },
        {
          id: 'cash-flow',
          name: 'Cash Flow',
          description: 'Cash flow analysis and forecasting'
        }
      ]
    }
  ];
}