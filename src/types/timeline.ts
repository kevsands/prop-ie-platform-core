/**
 * Timeline Types
 * Type definitions for project timeline components
 */

// Task status
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'delayed' | 'at_risk' | 'cancelled';

// Project phase
export type ProjectPhase = 
  | 'planning' 
  | 'design' 
  | 'preconstruction' 
  | 'foundation' 
  | 'structure' 
  | 'envelope' 
  | 'interior' 
  | 'finishing' 
  | 'landscaping' 
  | 'handover';

// Timeline task
export interface TimelineTask {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: TaskStatus;
  phase: ProjectPhase;
  percentComplete: number;
  dependencies?: string[]; // Array of task IDs this task depends on
  assignedTo?: string[]; // Array of team member IDs
  isMilestone?: boolean;
  isCriticalPath?: boolean;
  description?: string;
  plannedStartDate?: string; // Original planned start date
  plannedEndDate?: string; // Original planned end date
  actualStartDate?: string; // Actual start date (if started)
  actualEndDate?: string; // Actual end date (if completed)
  delayReason?: string;
  notes?: string;
  cost?: number;
  tags?: string[];
  subTasks?: TimelineTask[];
  color?: string; // Custom color for the task bar
}

// Team member
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  initials: string;
  department?: string;
  company?: string;
  isExternal?: boolean;
  contactEmail?: string;
  contactPhone?: string;
}

// Timeline summary
export interface TimelineSummary {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  delayedTasks: number;
  atRiskTasks: number;
  notStartedTasks: number;
  cancelledTasks: number;
  completionPercentage: number;
  onTrack: boolean;
  daysAhead?: number;
  daysBehind?: number;
  startDate: string;
  endDate: string;
  originalEndDate?: string;
  criticalPathDelay?: number;
  currentPhase: ProjectPhase;
}

// Project timeline
export interface ProjectTimeline {
  projectId: string;
  projectName: string;
  summary: TimelineSummary;
  tasks: TimelineTask[];
  phases: {
    name: ProjectPhase;
    startDate: string;
    endDate: string;
    completionPercentage: number;
    status: TaskStatus;
  }[];
  teamMembers: TeamMember[];
  milestones: TimelineTask[];
  criticalPath: string[]; // Array of task IDs that form the critical path
}

// Project Timeline props
export interface ProjectTimelineProps {
  projectId: string;
  timelineData?: ProjectTimeline; // Optional if provided directly
  isReadOnly?: boolean;
  showCriticalPath?: boolean;
  showDependencies?: boolean;
  compactView?: boolean;
  filterPhase?: ProjectPhase | 'all';
  filterAssignee?: string | 'all';
  filterStatus?: TaskStatus | 'all';
  onTaskClick?: (task: TimelineTask) => void;
  onMilestoneClick?: (milestone: TimelineTask) => void;
  className?: string;
}

// Timeline chart options
export interface TimelineChartOptions {
  startDate: Date;
  endDate: Date;
  viewMode: 'day' | 'week' | 'month' | 'quarter';
  showWeekends: boolean;
  showToday: boolean;
  showProgress: boolean;
  rowHeight: number;
  barHeight: number;
  barCornerRadius: number;
  padding: number;
  headerHeight: number;
  columnWidth: number;
  zoomLevel: number;
}

// Timeline view options for the toolbar
export interface TimelineViewOptions {
  viewMode: 'day' | 'week' | 'month' | 'quarter';
  showCriticalPath: boolean;
  showDependencies: boolean;
  compactView: boolean;
  showWeekends: boolean;
  showProgress: boolean;
}

// TimelineToolbarProps
export interface TimelineToolbarProps {
  filterPhase: ProjectPhase | 'all';
  setFilterPhase: (phase: ProjectPhase | 'all') => void;
  filterAssignee: string | 'all';
  setFilterAssignee: (assignee: string | 'all') => void;
  filterStatus: TaskStatus | 'all';
  setFilterStatus: (status: TaskStatus | 'all') => void;
  viewOptions: TimelineViewOptions;
  setViewOptions: (options: TimelineViewOptions) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  exportTimeline: () => void;
  teamMembers: TeamMember[];
  onViewModeChange: (mode: 'day' | 'week' | 'month' | 'quarter') => void;
  className?: string;
}

// Timeline row props
export interface TimelineRowProps {
  task: TimelineTask;
  timelineStart: Date;
  timelineEnd: Date;
  columnWidth: number;
  today: Date;
  showProgress: boolean;
  isCompact: boolean;
  index: number;
  onTaskClick?: (task: TimelineTask) => void;
  showCriticalPath: boolean;
}