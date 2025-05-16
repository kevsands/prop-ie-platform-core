/**
 * Dashboard Types
 * Type definitions for dashboard components
 */

// Project Overview Component Props
export interface ProjectOverviewProps {
  projectId: string;
  projectName?: string;
  className?: string;
}

// Project Data Types
export interface ProjectData {
  id: string;
  name: string;
  location: string;
  description: string;
  status: string;
  budget: BudgetInfo;
  documents: DocumentInfo;
  sales: SalesInfo;
  timeline: TimelineInfo;
  team: TeamInfo;
}

// Budget Information
export interface BudgetInfo {
  total: number;
  spent: number;
  percentage: number;
  remaining: number;
}

// Document Information
export interface DocumentInfo {
  totalCount: number;
  completedCount: number;
  completionPercentage: number;
  pendingCount: number;
}

// Sales Information
export interface SalesInfo {
  totalUnits: number;
  unitsSold: number;
  salePercentage: number;
  reservedUnits: number;
}

// Timeline Information
export interface TimelineInfo {
  startDate: string;
  targetCompletionDate: string;
  totalMilestones: number;
  completedMilestones: number;
  completionPercentage: number;
  isDelayed: boolean;
  delayDays: number;
  milestones: Milestone[];
}

// Milestone
export interface Milestone {
  id?: string;
  title: string;
  projectId?: string;
  projectName?: string;
  date: string;
  completed?: boolean;
  upcoming?: boolean;
  delayed?: boolean;
  daysRemaining?: number;
  description?: string;
  status?: 'pending' | 'completed' | 'overdue';
}

// Team Information
export interface TeamInfo {
  members: TeamMember[];
}

// Team Member
export interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
  initials: string;
}

// Activity and Alert Types
export interface ProjectActivity {
  type: 'document' | 'sale' | 'team' | 'milestone' | 'comment';
  user: {
    name: string;
    avatarUrl: string;
    initials: string;
  };
  timestamp: number;
  message: string;
  details?: string;
}

export interface ProjectActivityData {
  activities: ProjectActivity[];
}

export interface ProjectAlert {
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  deadline?: number;
}

export interface ProjectAlertsData {
  alerts: ProjectAlert[];
}

// Dashboard Layout Types
export interface DashboardLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

// Main Dashboard Props
export interface DeveloperDashboardProps {
  userId: string;
  projects?: ProjectSummary[];
}

// Project Summary for Dashboard
export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  location: string;
  progress: number;
  unitsSold: number;
  totalUnits: number;
  nextMilestone?: {
    title: string;
    date: string;
    daysRemaining?: number;
  };
}

// Dashboard Metric Card
export interface DashboardMetricProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  onClick?: () => void;
}

// Modern Dashboard types for the refactored components
export type ProjectStatus = 
  | 'Active' 
  | 'Planning' 
  | 'Construction' 
  | 'Completed' 
  | 'OnHold'
  | 'Cancelled';

// Dashboard metrics from GraphQL query
export interface DeveloperDashboardData {
  activeProjects: number;
  propertiesAvailable: number;
  totalSales: number | string;
  projects: DeveloperProject[];
  salesTrend?: SalesTrend;
  upcomingMilestones?: Milestone[];
  financialMetrics?: FinancialMetric[];
  projectProgress?: ProjectProgress[];
}

// Developer Project type from GraphQL
export interface DeveloperProject {
  id: string;
  name: string;
  status: string;
  completionPercentage: number;
  location: string;
  propertyCount: number;
  lastUpdated: string;
}

// Dashboard query response format
export interface DashboardQueryResponse {
  data: DeveloperDashboardData;
  loading: boolean;
  error: Error | null;
}

// KPI trend data
export type TrendDirection = 'up' | 'down' | 'neutral';

export interface KPITrend {
  value: number;
  direction: TrendDirection;
}

// Sales trend information
export interface SalesTrend {
  period: string;
  percentage: number;
  direction: TrendDirection;
}

// Financial metric
export interface FinancialMetric {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  change?: number;
  changeDirection?: TrendDirection;
}

// Project progress
export interface ProjectProgress {
  id: string;
  name: string;
  progress: number;
  phase: string;
  endDate: string;
  status: 'on_track' | 'delayed' | 'completed' | 'on_hold';
}

// Dashboard filter options
export interface DashboardFilter {
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  customDateRange?: {
    startDate: string;
    endDate: string;
  };
  projectStatus?: string[];
  projectTypes?: string[];
  locations?: string[];
}

// Widget types for dashboard components
export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'list' | 'table' | 'map' | 'calendar';
  title: string;
  data: any;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
  };
  settings?: Record<string, any>;
}

// Dashboard layout settings
export interface DashboardLayout {
  widgets: string[]; // Array of widget IDs
  layout: 'grid' | 'list' | 'custom';
  columns?: number;
  customPositions?: Record<string, { x: number; y: number; w: number; h: number }>;
}

// User dashboard preferences
export interface DashboardPreferences {
  defaultFilter: DashboardFilter;
  layout: DashboardLayout;
  favoriteWidgets: string[];
  refreshInterval: number; // in seconds
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email: boolean;
    push: boolean;
    frequency: 'realtime' | 'daily' | 'weekly';
  };
}