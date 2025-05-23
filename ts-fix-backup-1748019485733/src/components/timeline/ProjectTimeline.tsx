'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addMonths, subMonths, addDays, differenceInDays, parseISO, format, isAfter } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger} from "@/components/ui/tooltip";
import { ProjectTimelineProps, ProjectPhase, TaskStatus, TimelineTask, TimelineViewOptions } from '@/types/timeline';
import TimelineToolbar from './TimelineToolbar';
import TimelineHeader from './TimelineHeader';
import TimelineRow from './TimelineRow';
import DependencyLines from './DependencyLines';
import TimelineSummaryCards from './TimelineSummaryCards';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../ui/dialog';

/**
 * Project Timeline Component
 * 
 * A comprehensive Gantt chart timeline visualization for project management
 */
const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projectId,
  timelineData: propTimelineData, // Optional if provided directly
  isReadOnly = false,
  showCriticalPath: initialShowCriticalPath = true,
  showDependencies: initialShowDependencies = true,
  compactView: initialCompactView = false,
  filterPhase: initialFilterPhase = 'all',
  filterAssignee: initialFilterAssignee = 'all',
  filterStatus: initialFilterStatus = 'all',
  onTaskClick,
  onMilestoneClick,
  className
}) => {
  // Container ref for dependency lines
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // View options state
  const [viewOptionssetViewOptions] = useState<TimelineViewOptions>({
    viewMode: 'month',
    showCriticalPath: initialShowCriticalPath,
    showDependencies: initialShowDependencies,
    compactView: initialCompactView,
    showWeekends: true,
    showProgress: true
  });

  // Filter states
  const [filterPhasesetFilterPhase] = useState<ProjectPhase | 'all'>(initialFilterPhase);
  const [filterAssigneesetFilterAssignee] = useState<string | 'all'>(initialFilterAssignee);
  const [filterStatussetFilterStatus] = useState<TaskStatus | 'all'>(initialFilterStatus);

  // Timeline chart options
  const [columnWidthsetColumnWidth] = useState(20); // Width per day in pixels
  const [zoomLevelsetZoomLevel] = useState(1); // Current zoom level

  // Selected task for details view
  const [selectedTasksetSelectedTask] = useState<TimelineTask | null>(null);

  // Phase visibility state
  const [collapsedPhasessetCollapsedPhases] = useState<Record<string, boolean>>({});

  // Date range for visible timeline
  const today = new Date();
  const [visibleStartDatesetVisibleStartDate] = useState<Date>(
    subMonths(today3) // Default to 3 months before today
  );
  const [visibleEndDatesetVisibleEndDate] = useState<Date>(
    addMonths(today9) // Default to 9 months after today
  );

  // Fetch timeline data if not provided as props
  const { data, isLoading, error } = useQuery({
    queryKey: ['project-timeline', projectId, filterPhase, filterAssigneefilterStatus],
    queryFn: async () => {
      const url = new URL(`/api/projects/${projectId}/timeline`, window.location.origin);

      if (filterPhase !== 'all') {
        url.searchParams.append('phase', filterPhase);
      }

      if (filterAssignee !== 'all') {
        url.searchParams.append('assignee', filterAssignee);
      }

      if (filterStatus !== 'all') {
        url.searchParams.append('status', filterStatus);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }

      return response.json();
    },
    enabled: !propTimelineData && !!projectId,
    placeholderData: propTimelineData
  });

  // Use provided timeline data or fetched data
  const timelineData = propTimelineData || data;

  // Group tasks by phase
  const groupedTasks = React.useMemo(() => {
    if (!timelineData?.tasks) return {};

    const grouped: Record<string, TimelineTask[]> = {};

    timelineData.tasks.forEach(task: any => {
      if (!grouped[task.phase]) {
        grouped[task.phase] = [];
      }
      grouped[task.phase].push(task: any);
    });

    // Sort tasks within each phase by date
    Object.keys(grouped).forEach(phase => {
      grouped[phase].sort((ab) => {
        const aStart = new Date(a.startDate);
        const bStart = new Date(b.startDate);
        return aStart.getTime() - bStart.getTime();
      });
    });

    return grouped;
  }, [timelineData?.tasks]);

  // Extract phases with their order
  const orderedPhases = React.useMemo(() => {
    if (!timelineData?.phases) return [];

    // Define phase order
    const phaseOrder: Record<ProjectPhase, number> = {
      planning: 1,
      design: 2,
      preconstruction: 3,
      foundation: 4,
      structure: 5,
      envelope: 6,
      interior: 7,
      finishing: 8,
      landscaping: 9,
      handover: 10
    };

    return [...timelineData.phases].sort((ab) => phaseOrder[a.name] - phaseOrder[b.name]);
  }, [timelineData?.phases]);

  // Update column width when zoom level changes
  useEffect(() => {
    // Base column width is 20px per day
    const newWidth = Math.max(5, Math.min(50, 20 * zoomLevel));
    setColumnWidth(newWidth);
  }, [zoomLevel]);

  // Update visible date range when timeline data changes
  useEffect(() => {
    if (!timelineData?.summary) return;

    const projectStart = new Date(timelineData.summary.startDate);
    const projectEnd = new Date(timelineData.summary.endDate);

    // Add some padding on either side
    setVisibleStartDate(subMonths(projectStart1));
    setVisibleEndDate(addMonths(projectEnd1));
  }, [timelineData?.summary]);

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.25));
  };

  // Reset zoom
  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Export timeline as PNG
  const handleExportTimeline = () => {
    alert('Export timeline functionality will be implemented here');
    // In production, use html2canvas or similar library to export the timeline
  };

  // Handle task click
  const handleTaskClick = (task: TimelineTask) => {
    setSelectedTask(task: any);
    if (task.isMilestone && onMilestoneClick) {
      onMilestoneClick(task: any);
    } else if (onTaskClick) {
      onTaskClick(task: any);
    }
  };

  // Handle changing view mode
  const handleViewModeChange = (mode: 'day' | 'week' | 'month' | 'quarter') => {
    // Adjust zoom level based on view mode
    if (mode === 'day') {
      setZoomLevel(1.5);
    } else if (mode === 'week') {
      setZoomLevel(1);
    } else if (mode === 'month') {
      setZoomLevel(0.5);
    } else if (mode === 'quarter') {
      setZoomLevel(0.25);
    }
  };

  // Toggle a phase's collapsed state
  const togglePhaseCollapse = (phase: string) => {
    setCollapsedPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  // Shift timeline view to the left (earlier dates)
  const shiftTimelineLeft = () => {
    const visibleDays = differenceInDays(visibleEndDatevisibleStartDate);
    setVisibleStartDate(subMonths(visibleStartDate1));
    setVisibleEndDate(subMonths(visibleEndDate1));
  };

  // Shift timeline view to the right (later dates)
  const shiftTimelineRight = () => {
    const visibleDays = differenceInDays(visibleEndDatevisibleStartDate);
    setVisibleStartDate(addMonths(visibleStartDate1));
    setVisibleEndDate(addMonths(visibleEndDate1));
  };

  // Return to current time period
  const returnToToday = () => {
    const visibleDays = differenceInDays(visibleEndDatevisibleStartDate);
    setVisibleStartDate(subMonths(today3));
    setVisibleEndDate(addMonths(today9));
  };

  // Loading state
  if (isLoading && !timelineData) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 34].map(i => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !timelineData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Error Loading Timeline</CardTitle>
          <CardDescription>
            There was a problem loading the project timeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p>Failed to load timeline data. Please try again later.</p>
          </div>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Total days in the visible timeline
  const totalDays = differenceInDays(visibleEndDatevisibleStartDate) + 1;

  // Width of the entire timeline
  const timelineWidth = totalDays * columnWidth;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Timeline Summary */}
      <TimelineSummaryCards summary={timelineData.summary} />

      {/* Timeline Toolbar */}
      <div className="flex flex-col-reverse md:flex-row gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={shiftTimelineLeft}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={returnToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={shiftTimelineRight}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">
            {format(visibleStartDate, 'MMM d, yyyy')} - {format(visibleEndDate, 'MMM d, yyyy')}
          </div>
        </div>

        <TimelineToolbar 
          filterPhase={filterPhase}
          setFilterPhase={setFilterPhase}
          filterAssignee={filterAssignee}
          setFilterAssignee={setFilterAssignee}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          viewOptions={viewOptions}
          setViewOptions={setViewOptions}
          zoomIn={handleZoomIn}
          zoomOut={handleZoomOut}
          resetZoom={handleResetZoom}
          exportTimeline={handleExportTimeline}
          teamMembers={timelineData.teamMembers || []}
          onViewModeChange={handleViewModeChange}
          className="mb-3 md:mb-0"
        />
      </div>

      {/* Main Timeline Chart */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Gantt chart visualization of project tasks and milestones</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-hidden border rounded-md">
            {/* Frozen left column (task names) */}
            <div className="grid grid-cols-[250px_1fr]">
              {/* Task labels column */}
              <div className="bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-20">
                {/* Header section */}
                <div className="h-[60px] border-b border-slate-300 dark:border-slate-700">
                  <div className="h-7 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center px-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Project Tasks
                    </span>
                  </div>
                  <div className="h-8 bg-slate-100 dark:bg-slate-900/80 flex items-center px-3">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {timelineData.tasks.length} tasks in timeline
                    </span>
                  </div>
                </div>

                {/* Tasks column */}
                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                  {orderedPhases.map(phase => {
                    const phaseTasks = groupedTasks[phase.name] || [];
                    const isCollapsed = collapsedPhases[phase.name];

                    if (phaseTasks.length === 0) return null;

                    return (
                      <div key={phase.name} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                        {/* Phase header */}
                        <Collapsible
                          open={!isCollapsed}
                          onOpenChange={() => togglePhaseCollapse(phase.name)}
                        >
                          <CollapsibleTrigger asChild>
                            <div className="p-2 bg-slate-100 dark:bg-slate-900/60 font-medium text-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800/60 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <ChevronDown className={`h-4 w-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                                <span className="capitalize">{phase.name}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {phaseTasks.length}
                                </Badge>
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {phase.completionPercentage}% complete
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            {phaseTasks.map((task: anyindex) => (
                              <div 
                                key={task.id}
                                className={`h-12 ${viewOptions.compactView ? 'h-10' : 'h-12'} ${index % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/30' : ''}`}
                                data-task-id={task.id}
                              >
                                {/* Empty div to maintain positioning with TimelineRow */}
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline grid column */}
              <div 
                className="overflow-x-auto max-w-full bg-white dark:bg-slate-950 relative"
                ref={timelineContainerRef}
              >
                {/* Timeline header with dates */}
                <TimelineHeader 
                  startDate={visibleStartDate}
                  endDate={visibleEndDate}
                  viewMode={viewOptions.viewMode}
                  columnWidth={columnWidth}
                  today={today}
                  showWeekends={viewOptions.showWeekends}
                />

                {/* Timeline grid with task bars */}
                <div 
                  className="overflow-y-auto max-h-[calc(100vh-300px)]"
                  style={ width: `${timelineWidth}px` }
                >
                  {orderedPhases.map(phase => {
                    const phaseTasks = groupedTasks[phase.name] || [];
                    const isCollapsed = collapsedPhases[phase.name];

                    if (phaseTasks.length === 0) return null;

                    return (
                      <div key={phase.name} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                        {/* Phase header (empty as content is in left column) */}
                        <div className="p-2 bg-slate-100 dark:bg-slate-900/60 font-medium text-sm">
                          &nbsp;
                        </div>

                        {/* Phase tasks */}
                        {!isCollapsed && phaseTasks.map((task: anyindex) => (
                          <TimelineRow 
                            key={task.id}
                            task: any={task: any}
                            timelineStart={visibleStartDate}
                            timelineEnd={visibleEndDate}
                            columnWidth={columnWidth}
                            today={today}
                            showProgress={viewOptions.showProgress}
                            isCompact={viewOptions.compactView}
                            index={index}
                            onTaskClick={handleTaskClick}
                            showCriticalPath={viewOptions.showCriticalPath}
                          />
                        ))}
                      </div>
                    );
                  })}

                  {/* Dependency lines */}
                  {viewOptions.showDependencies && (
                    <DependencyLines 
                      tasks={timelineData.tasks}
                      containerRef={timelineContainerRef}
                      showDependencies={viewOptions.showDependencies}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedTask.name}
                {selectedTask.isMilestone && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                    Milestone
                  </Badge>
                )}
                {selectedTask.isCriticalPath && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                    Critical Path
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                <span className="capitalize">{selectedTask.phase}</span> Phase
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Start Date</h4>
                  <p>{format(new Date(selectedTask.startDate), 'MMM d, yyyy')}</p>
                  {selectedTask.plannedStartDate && selectedTask.plannedStartDate !== selectedTask.startDate && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Planned: {format(new Date(selectedTask.plannedStartDate), 'MMM d, yyyy')}
                    </p>
                  )}
                  {selectedTask.actualStartDate && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                      Actual: {format(new Date(selectedTask.actualStartDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">End Date</h4>
                  <p>{format(new Date(selectedTask.endDate), 'MMM d, yyyy')}</p>
                  {selectedTask.plannedEndDate && selectedTask.plannedEndDate !== selectedTask.endDate && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Planned: {format(new Date(selectedTask.plannedEndDate), 'MMM d, yyyy')}
                    </p>
                  )}
                  {selectedTask.actualEndDate && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                      Actual: {format(new Date(selectedTask.actualEndDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Status</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`
                    ${selectedTask.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : ''}
                    ${selectedTask.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : ''}
                    ${selectedTask.status === 'not_started' ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800' : ''}
                    ${selectedTask.status === 'delayed' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : ''}
                    ${selectedTask.status === 'at_risk' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' : ''}
                    ${selectedTask.status === 'cancelled' ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' : ''}
                  `}>
                    {selectedTask.status.replace('_', ' ')}
                  </Badge>

                  <div className="text-sm">
                    {selectedTask.percentComplete}% complete
                  </div>
                </div>

                {selectedTask.delayReason && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded-md">
                    <p className="font-medium">Delay Reason:</p>
                    <p>{selectedTask.delayReason}</p>
                  </div>
                )}
              </div>

              {selectedTask.description && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Description</h4>
                  <p className="text-sm">{selectedTask.description}</p>
                </div>
              )}

              {selectedTask.assignedTo && selectedTask.assignedTo.length> 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Assigned To</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.assignedTo.map(assigneeId => {
                      const member = timelineData.teamMembers.find(m: any => m.id === assigneeId);
                      return (
                        <div key={assigneeId} className="flex items-center">
                          <Avatar className="h-6 w-6 mr-1.5">
                            <AvatarFallback>{member?.initials || assigneeId.substring(02)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member?.name || assigneeId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedTask.dependencies && selectedTask.dependencies.length> 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Dependencies</h4>
                  <div className="space-y-1">
                    {selectedTask.dependencies.map(depId => {
                      const depTask = timelineData.tasks.find(t: any => t.id === depId);
                      return (
                        <div key={depId} className="text-sm flex items-center">
                          <span className="w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                          {depTask?.name || depId}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectTimeline;