'use client';

/**
 * Gantt Chart Component
 * 
 * Interactive Gantt chart for visualizing task dependencies, critical paths,
 * and cross-persona coordination in complex property transactions.
 * Supports drag-and-drop scheduling and real-time updates.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { UserRole } from '@prisma/client';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskComplexityLevel,
  TaskOrchestrationContext
} from '@/types/task/universal-task';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

// Icons
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Settings,
  Download,
  Maximize2
} from 'lucide-react';

/**
 * Task dependency relationship
 */
interface TaskDependency {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  lag: number; // Days
  isOnCriticalPath: boolean;
}

/**
 * Gantt chart timeline settings
 */
interface TimelineSettings {
  viewMode: 'day' | 'week' | 'month' | 'quarter';
  showWeekends: boolean;
  showCriticalPath: boolean;
  showPersonaLanes: boolean;
  zoomLevel: number;
  startDate: Date;
  endDate: Date;
}

/**
 * Task bar position and dimensions
 */
interface TaskBar {
  task: Task;
  x: number;
  y: number;
  width: number;
  height: number;
  persona: UserRole;
  isOnCriticalPath: boolean;
  dependencies: TaskDependency[];
}

/**
 * Component props
 */
interface GanttChartProps {
  tasks: Task[];
  dependencies?: TaskDependency[];
  context: TaskOrchestrationContext;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDependencyCreate?: (dependency: Omit<TaskDependency, 'id'>) => void;
  onTaskClick?: (task: Task) => void;
  showPersonaLanes?: boolean;
  allowDragDrop?: boolean;
  height?: number;
  className?: string;
}

/**
 * Main GanttChart Component
 */
export default function GanttChart({
  tasks,
  dependencies = [],
  context,
  onTaskUpdate,
  onDependencyCreate,
  onTaskClick,
  showPersonaLanes = true,
  allowDragDrop = true,
  height = 600,
  className = ''
}: GanttChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [settings, setSettings] = useState<TimelineSettings>({
    viewMode: 'week',
    showWeekends: true,
    showCriticalPath: true,
    showPersonaLanes: showPersonaLanes,
    zoomLevel: 1,
    startDate: new Date(Math.min(...tasks.map(t => t.createdAt.getTime()))),
    endDate: new Date(Math.max(...tasks.map(t => (t.dueDate || new Date()).getTime())))
  });
  
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    taskId: string | null;
    startX: number;
    startDate: Date | null;
  }>({
    isDragging: false,
    taskId: null,
    startX: 0,
    startDate: null
  });

  // Generate dependencies if not provided
  const enhancedDependencies = useMemo(() => {
    if (dependencies.length > 0) {
      return dependencies;
    }
    return generateTaskDependencies(tasks);
  }, [tasks, dependencies]);

  // Calculate critical path with enterprise CPM algorithm
  const criticalPathData = useMemo(() => {
    return calculateCriticalPath(tasks, enhancedDependencies);
  }, [tasks, enhancedDependencies]);

  // Get persona information
  const getPersonaInfo = (persona: UserRole) => {
    const personaConfig = {
      [UserRole.BUYER]: { name: 'Buyer', color: '#3B82F6', icon: '🏠' },
      [UserRole.DEVELOPER]: { name: 'Developer', color: '#8B5CF6', icon: '🏗️' },
      [UserRole.AGENT]: { name: 'Agent', color: '#10B981', icon: '🤝' },
      [UserRole.SOLICITOR]: { name: 'Solicitor', color: '#EF4444', icon: '⚖️' },
      [UserRole.ADMIN]: { name: 'Admin', color: '#6B7280', icon: '👤' }
    };
    return personaConfig[persona] || personaConfig[UserRole.BUYER];
  };

  // Group tasks by persona
  const personaGroups = useMemo(() => {
    const groups = new Map<UserRole, Task[]>();
    tasks.forEach(task => {
      const persona = task.assignedRole || UserRole.BUYER;
      if (!groups.has(persona)) {
        groups.set(persona, []);
      }
      groups.get(persona)!.push(task);
    });
    return groups;
  }, [tasks]);

  // Calculate timeline dimensions
  const timelineDimensions = useMemo(() => {
    const dayWidth = 40 * settings.zoomLevel;
    const taskHeight = 24;
    const laneHeight = settings.showPersonaLanes ? 60 : 30;
    const headerHeight = 80;
    const sidebarWidth = 200;
    
    const totalDays = Math.ceil((settings.endDate.getTime() - settings.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const chartWidth = totalDays * dayWidth;
    const chartHeight = settings.showPersonaLanes 
      ? personaGroups.size * laneHeight * 4
      : tasks.length * (taskHeight + 8);

    return {
      dayWidth,
      taskHeight,
      laneHeight,
      headerHeight,
      sidebarWidth,
      chartWidth,
      chartHeight,
      totalDays
    };
  }, [settings, personaGroups.size, tasks.length]);

  // Generate task bars with positions
  const taskBars = useMemo(() => {
    const bars: TaskBar[] = [];
    let currentY = timelineDimensions.headerHeight;

    if (settings.showPersonaLanes) {
      // Group by persona
      Array.from(personaGroups.entries()).forEach(([persona, personaTasks], personaIndex) => {
        personaTasks.forEach((task, taskIndex) => {
          const startDate = task.actualStart || task.createdAt;
          const endDate = task.dueDate || new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          const daysSinceStart = Math.floor((startDate.getTime() - settings.startDate.getTime()) / (1000 * 60 * 60 * 24));
          const duration = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
          
          const x = timelineDimensions.sidebarWidth + (daysSinceStart * timelineDimensions.dayWidth);
          const width = duration * timelineDimensions.dayWidth;
          const y = currentY + (taskIndex * (timelineDimensions.taskHeight + 4));
          
          bars.push({
            task,
            x,
            y,
            width,
            height: timelineDimensions.taskHeight,
            persona,
            isOnCriticalPath: criticalPath.includes(task.id),
            dependencies: dependencies.filter(dep => dep.sourceTaskId === task.id || dep.targetTaskId === task.id)
          });
        });
        currentY += timelineDimensions.laneHeight * 2;
      });
    } else {
      // Simple list view
      tasks.forEach((task, index) => {
        const startDate = task.actualStart || task.createdAt;
        const endDate = task.dueDate || new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const daysSinceStart = Math.floor((startDate.getTime() - settings.startDate.getTime()) / (1000 * 60 * 60 * 24));
        const duration = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 1000)));
        
        const x = timelineDimensions.sidebarWidth + (daysSinceStart * timelineDimensions.dayWidth);
        const width = duration * timelineDimensions.dayWidth;
        const y = currentY + (index * (timelineDimensions.taskHeight + 8));
        
        bars.push({
          task,
          x,
          y,
          width,
          height: timelineDimensions.taskHeight,
          persona: task.assignedRole || UserRole.BUYER,
          isOnCriticalPath: criticalPathData.criticalTaskIds.includes(task.id),
          dependencies: enhancedDependencies.filter(dep => dep.sourceTaskId === task.id || dep.targetTaskId === task.id)
        });
      });
    }

    return bars;
  }, [tasks, settings, timelineDimensions, personaGroups, criticalPath, dependencies]);

  // Generate timeline header dates
  const timelineHeader = useMemo(() => {
    const dates: Date[] = [];
    const current = new Date(settings.startDate);
    
    while (current <= settings.endDate) {
      dates.push(new Date(current));
      if (settings.viewMode === 'day') {
        current.setDate(current.getDate() + 1);
      } else if (settings.viewMode === 'week') {
        current.setDate(current.getDate() + 7);
      } else if (settings.viewMode === 'month') {
        current.setMonth(current.getMonth() + 1);
      } else {
        current.setMonth(current.getMonth() + 3);
      }
    }
    
    return dates;
  }, [settings]);

  // Handle task bar click
  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task.id);
    onTaskClick?.(task);
  }, [onTaskClick]);

  // Handle task drag start
  const handleDragStart = useCallback((e: React.MouseEvent, taskId: string) => {
    if (!allowDragDrop) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setDragState({
      isDragging: true,
      taskId,
      startX: e.clientX,
      startDate: task.actualStart || task.createdAt
    });
  }, [allowDragDrop, tasks]);

  // Handle task drag
  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.taskId || !dragState.startDate) return;

    const deltaX = e.clientX - dragState.startX;
    const deltaDays = Math.round(deltaX / timelineDimensions.dayWidth);
    const newStartDate = new Date(dragState.startDate.getTime() + (deltaDays * 24 * 60 * 60 * 1000));

    // Update task position (visual feedback)
    const taskBar = taskBars.find(bar => bar.task.id === dragState.taskId);
    if (taskBar && svgRef.current) {
      const rect = svgRef.current.querySelector(`[data-task-id="${dragState.taskId}"]`) as SVGRectElement;
      if (rect) {
        rect.setAttribute('x', String(taskBar.x + deltaX));
      }
    }
  }, [dragState, timelineDimensions.dayWidth, taskBars]);

  // Handle task drag end
  const handleDragEnd = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.taskId || !dragState.startDate) return;

    const deltaX = e.clientX - dragState.startX;
    const deltaDays = Math.round(deltaX / timelineDimensions.dayWidth);
    const newStartDate = new Date(dragState.startDate.getTime() + (deltaDays * 24 * 60 * 60 * 1000));

    if (deltaDays !== 0) {
      onTaskUpdate?.(dragState.taskId, {
        actualStart: newStartDate,
        dueDate: new Date(newStartDate.getTime() + (7 * 24 * 60 * 60 * 1000)) // Keep 7-day duration
      });
    }

    setDragState({
      isDragging: false,
      taskId: null,
      startX: 0,
      startDate: null
    });
  }, [dragState, timelineDimensions.dayWidth, onTaskUpdate]);

  // Get task status color
  const getTaskStatusColor = (status: TaskStatus, isOnCriticalPath: boolean) => {
    if (isOnCriticalPath && settings.showCriticalPath) {
      return '#DC2626'; // Red for critical path
    }
    
    switch (status) {
      case TaskStatus.COMPLETED:
        return '#10B981';
      case TaskStatus.IN_PROGRESS:
        return '#3B82F6';
      case TaskStatus.BLOCKED:
        return '#EF4444';
      case TaskStatus.WAITING_APPROVAL:
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className={`gantt-chart ${className}`}>
      {/* Header Controls */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Project Timeline</span>
              </CardTitle>
              <CardDescription>
                Interactive Gantt chart with dependency mapping and critical path analysis
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">View:</label>
              <Select
                value={settings.viewMode}
                onValueChange={(value) => setSettings(prev => ({ ...prev, viewMode: value as any }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="quarter">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, zoomLevel: Math.max(0.5, prev.zoomLevel - 0.25) }))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-12 text-center">{Math.round(settings.zoomLevel * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, zoomLevel: Math.min(3, prev.zoomLevel + 0.25) }))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Options */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showCriticalPath}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showCriticalPath: checked }))}
                />
                <label className="text-sm">Critical Path</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showPersonaLanes}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showPersonaLanes: checked }))}
                />
                <label className="text-sm">Persona Lanes</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showWeekends}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showWeekends: checked }))}
                />
                <label className="text-sm">Weekends</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{criticalPathData.criticalTaskIds.length}</div>
            <div className="text-sm text-gray-600">Critical Path</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{enhancedDependencies.length}</div>
            <div className="text-sm text-gray-600">Dependencies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{personaGroups.size}</div>
            <div className="text-sm text-gray-600">Personas</div>
          </CardContent>
        </Card>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardContent className="p-0">
          <div className="relative" style={{ height }}>
            <ScrollArea className="w-full h-full">
              <svg
                ref={svgRef}
                width={timelineDimensions.sidebarWidth + timelineDimensions.chartWidth}
                height={Math.max(height, timelineDimensions.chartHeight + timelineDimensions.headerHeight)}
                className="border"
                onMouseMove={handleDrag}
                onMouseUp={handleDragEnd}
              >
                {/* Timeline Header */}
                <g className="timeline-header">
                  {/* Header Background */}
                  <rect
                    x={0}
                    y={0}
                    width={timelineDimensions.sidebarWidth + timelineDimensions.chartWidth}
                    height={timelineDimensions.headerHeight}
                    fill="#F9FAFB"
                    stroke="#E5E7EB"
                  />
                  
                  {/* Date Labels */}
                  {timelineHeader.map((date, index) => {
                    const x = timelineDimensions.sidebarWidth + (index * timelineDimensions.dayWidth);
                    return (
                      <g key={index}>
                        <line
                          x1={x}
                          y1={0}
                          x2={x}
                          y2={timelineDimensions.headerHeight}
                          stroke="#E5E7EB"
                        />
                        <text
                          x={x + timelineDimensions.dayWidth / 2}
                          y={timelineDimensions.headerHeight / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-sm fill-gray-700"
                        >
                          {date.toLocaleDateString('en-GB', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Sidebar */}
                <g className="sidebar">
                  <rect
                    x={0}
                    y={0}
                    width={timelineDimensions.sidebarWidth}
                    height={timelineDimensions.chartHeight + timelineDimensions.headerHeight}
                    fill="#F9FAFB"
                    stroke="#E5E7EB"
                  />
                  
                  {settings.showPersonaLanes && (
                    Array.from(personaGroups.entries()).map(([persona, personaTasks], personaIndex) => {
                      const y = timelineDimensions.headerHeight + (personaIndex * timelineDimensions.laneHeight * 2);
                      const personaInfo = getPersonaInfo(persona);
                      
                      return (
                        <g key={persona}>
                          <rect
                            x={0}
                            y={y}
                            width={timelineDimensions.sidebarWidth}
                            height={timelineDimensions.laneHeight}
                            fill={personaInfo.color}
                            fillOpacity={0.1}
                          />
                          <text
                            x={10}
                            y={y + timelineDimensions.laneHeight / 2}
                            dominantBaseline="middle"
                            className="text-sm font-medium fill-gray-900"
                          >
                            {personaInfo.icon} {personaInfo.name} ({personaTasks.length})
                          </text>
                        </g>
                      );
                    })
                  )}
                </g>

                {/* Grid Lines */}
                <g className="grid-lines">
                  {Array.from({ length: timelineDimensions.totalDays + 1 }).map((_, index) => {
                    const x = timelineDimensions.sidebarWidth + (index * timelineDimensions.dayWidth);
                    return (
                      <line
                        key={index}
                        x1={x}
                        y1={timelineDimensions.headerHeight}
                        x2={x}
                        y2={timelineDimensions.chartHeight + timelineDimensions.headerHeight}
                        stroke="#F3F4F6"
                        strokeWidth="1"
                      />
                    );
                  })}
                </g>

                {/* Task Bars */}
                <g className="task-bars">
                  {taskBars.map((bar) => (
                    <g key={bar.task.id}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <rect
                              data-task-id={bar.task.id}
                              x={bar.x}
                              y={bar.y}
                              width={bar.width}
                              height={bar.height}
                              fill={getTaskStatusColor(bar.task.status, bar.isOnCriticalPath)}
                              stroke={selectedTask === bar.task.id ? '#1F2937' : 'transparent'}
                              strokeWidth={selectedTask === bar.task.id ? 2 : 0}
                              rx={4}
                              className="cursor-pointer transition-all hover:opacity-80"
                              onClick={() => handleTaskClick(bar.task)}
                              onMouseDown={(e) => handleDragStart(e, bar.task.id)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="p-2">
                              <div className="font-medium">{bar.task.title}</div>
                              <div className="text-sm text-gray-600">
                                Status: {bar.task.status}
                              </div>
                              <div className="text-sm text-gray-600">
                                Priority: {bar.task.priority}
                              </div>
                              {bar.isOnCriticalPath && (
                                <div className="text-sm text-red-600 font-medium">
                                  Critical Path
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {/* Task Label */}
                      <text
                        x={bar.x + 8}
                        y={bar.y + bar.height / 2}
                        dominantBaseline="middle"
                        className="text-xs fill-white font-medium"
                        style={{ pointerEvents: 'none' }}
                      >
                        {bar.task.title.substring(0, 20)}
                        {bar.task.title.length > 20 ? '...' : ''}
                      </text>

                      {/* Progress Overlay */}
                      {bar.task.progressPercentage > 0 && (
                        <rect
                          x={bar.x}
                          y={bar.y + bar.height - 3}
                          width={(bar.width * bar.task.progressPercentage) / 100}
                          height={3}
                          fill="#10B981"
                          rx={1}
                        />
                      )}
                    </g>
                  ))}
                </g>

                {/* Dependency Arrows */}
                <g className="dependency-arrows">
                  {enhancedDependencies.map((dep) => {
                    const sourceBar = taskBars.find(bar => bar.task.id === dep.sourceTaskId);
                    const targetBar = taskBars.find(bar => bar.task.id === dep.targetTaskId);
                    
                    if (!sourceBar || !targetBar) return null;

                    const startX = sourceBar.x + sourceBar.width;
                    const startY = sourceBar.y + sourceBar.height / 2;
                    const endX = targetBar.x;
                    const endY = targetBar.y + targetBar.height / 2;

                    const isOnCriticalPath = criticalPathData.criticalTaskIds.includes(dep.sourceTaskId) && 
                                           criticalPathData.criticalTaskIds.includes(dep.targetTaskId);
                    const color = isOnCriticalPath && settings.showCriticalPath ? '#DC2626' : '#6B7280';

                    return (
                      <g key={dep.id}>
                        <defs>
                          <marker
                            id={`arrowhead-${dep.id}`}
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                          >
                            <polygon
                              points="0 0, 10 3.5, 0 7"
                              fill={color}
                            />
                          </marker>
                        </defs>
                        <path
                          d={`M ${startX} ${startY} L ${startX + 20} ${startY} L ${endX - 20} ${endY} L ${endX} ${endY}`}
                          stroke={color}
                          strokeWidth={isOnCriticalPath ? 2 : 1}
                          fill="none"
                          markerEnd={`url(#arrowhead-${dep.id})`}
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Enterprise-grade Critical Path Method (CPM) calculation
 * Implements proper forward and backward pass algorithm
 */
function calculateCriticalPath(tasks: Task[], dependencies: TaskDependency[]): {
  criticalTaskIds: string[];
  slackTimes: Map<string, number>;
  projectDuration: number;
} {
  const taskMap = new Map(tasks.map(task => [task.id, task]));
  const earlyStart = new Map<string, number>();
  const earlyFinish = new Map<string, number>();
  const lateStart = new Map<string, number>();
  const lateFinish = new Map<string, number>();
  const slackTimes = new Map<string, number>();

  // Calculate task durations in days
  const getTaskDuration = (task: Task): number => {
    if (task.estimatedDuration) {
      return task.estimatedDuration;
    }
    if (task.actualStart && task.dueDate) {
      return Math.ceil((task.dueDate.getTime() - task.actualStart.getTime()) / (1000 * 60 * 60 * 24));
    }
    // Default based on complexity
    const durationMap = {
      [TaskComplexityLevel.SIMPLE]: 1,
      [TaskComplexityLevel.MODERATE]: 3,
      [TaskComplexityLevel.COMPLEX]: 7,
      [TaskComplexityLevel.EXPERT]: 14
    };
    return durationMap[task.complexityLevel] || 3;
  };

  // Build adjacency lists
  const predecessors = new Map<string, string[]>();
  const successors = new Map<string, string[]>();
  
  tasks.forEach(task => {
    predecessors.set(task.id, []);
    successors.set(task.id, []);
  });

  dependencies.forEach(dep => {
    if (dep.type === 'finish_to_start') {
      predecessors.get(dep.targetTaskId)?.push(dep.sourceTaskId);
      successors.get(dep.sourceTaskId)?.push(dep.targetTaskId);
    }
  });

  // Forward pass - calculate early start and early finish
  const calculateForwardPass = () => {
    const visited = new Set<string>();
    
    const visit = (taskId: string) => {
      if (visited.has(taskId)) return;
      visited.add(taskId);
      
      const task = taskMap.get(taskId);
      if (!task) return;
      
      const preds = predecessors.get(taskId) || [];
      let maxEarlyFinish = 0;
      
      // Process all predecessors first
      preds.forEach(predId => {
        if (!visited.has(predId)) {
          visit(predId);
        }
        const predEarlyFinish = earlyFinish.get(predId) || 0;
        maxEarlyFinish = Math.max(maxEarlyFinish, predEarlyFinish);
      });
      
      const es = maxEarlyFinish;
      const ef = es + getTaskDuration(task);
      
      earlyStart.set(taskId, es);
      earlyFinish.set(taskId, ef);
    };
    
    tasks.forEach(task => visit(task.id));
  };

  // Backward pass - calculate late start and late finish
  const calculateBackwardPass = () => {
    const projectDuration = Math.max(...Array.from(earlyFinish.values()));
    const visited = new Set<string>();
    
    const visit = (taskId: string) => {
      if (visited.has(taskId)) return;
      visited.add(taskId);
      
      const task = taskMap.get(taskId);
      if (!task) return;
      
      const succs = successors.get(taskId) || [];
      let minLateStart = projectDuration;
      
      if (succs.length === 0) {
        // End task
        minLateStart = earlyFinish.get(taskId) || 0;
      } else {
        // Process all successors first
        succs.forEach(succId => {
          if (!visited.has(succId)) {
            visit(succId);
          }
          const succLateStart = lateStart.get(succId) || 0;
          minLateStart = Math.min(minLateStart, succLateStart);
        });
      }
      
      const lf = minLateStart;
      const ls = lf - getTaskDuration(task);
      
      lateFinish.set(taskId, lf);
      lateStart.set(taskId, ls);
    };
    
    // Start from end tasks and work backwards
    const endTasks = tasks.filter(task => 
      (successors.get(task.id) || []).length === 0
    );
    endTasks.forEach(task => visit(task.id));
    
    // Visit remaining tasks
    tasks.forEach(task => visit(task.id));
  };

  // Calculate slack times and identify critical path
  const calculateSlackAndCriticalPath = () => {
    const criticalTaskIds: string[] = [];
    
    tasks.forEach(task => {
      const es = earlyStart.get(task.id) || 0;
      const ls = lateStart.get(task.id) || 0;
      const slack = ls - es;
      
      slackTimes.set(task.id, slack);
      
      // Tasks with zero or near-zero slack are on critical path
      if (slack <= 0.5) {
        criticalTaskIds.push(task.id);
      }
    });
    
    return criticalTaskIds;
  };

  // Execute CPM algorithm
  calculateForwardPass();
  calculateBackwardPass();
  const criticalTaskIds = calculateSlackAndCriticalPath();
  const projectDuration = Math.max(...Array.from(earlyFinish.values()));

  return {
    criticalTaskIds,
    slackTimes,
    projectDuration
  };
}

/**
 * Generate realistic task dependencies based on task categories and personas
 */
function generateTaskDependencies(tasks: Task[]): TaskDependency[] {
  const dependencies: TaskDependency[] = [];
  let depId = 1;

  // Sort tasks by creation date and persona workflow
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by logical workflow order
    const workflowOrder = {
      [TaskCategory.BUYER_PLANNING]: 1,
      [TaskCategory.BUYER_SEARCHING]: 2,
      [TaskCategory.BUYER_FINANCING]: 3,
      [TaskCategory.AGENT_CLIENT_MANAGEMENT]: 2,
      [TaskCategory.AGENT_MARKETING]: 2,
      [TaskCategory.SOLICITOR_SEARCHES]: 4,
      [TaskCategory.SOLICITOR_CONTRACTS]: 5,
      [TaskCategory.DEVELOPER_CONSTRUCTION]: 1,
      [TaskCategory.DEVELOPER_SALES]: 3
    };
    
    const orderA = workflowOrder[a.category] || 999;
    const orderB = workflowOrder[b.category] || 999;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  // Create logical dependencies between task categories
  for (let i = 0; i < sortedTasks.length - 1; i++) {
    const currentTask = sortedTasks[i];
    const nextTask = sortedTasks[i + 1];
    
    // Create dependency if tasks are logically connected
    const shouldCreateDependency = (
      // Buyer workflow
      (currentTask.category === TaskCategory.BUYER_PLANNING && 
       nextTask.category === TaskCategory.BUYER_SEARCHING) ||
      (currentTask.category === TaskCategory.BUYER_SEARCHING && 
       nextTask.category === TaskCategory.BUYER_FINANCING) ||
      
      // Legal workflow  
      (currentTask.category === TaskCategory.BUYER_FINANCING && 
       nextTask.category === TaskCategory.SOLICITOR_SEARCHES) ||
      (currentTask.category === TaskCategory.SOLICITOR_SEARCHES && 
       nextTask.category === TaskCategory.SOLICITOR_CONTRACTS) ||
      
      // Cross-persona dependencies
      (currentTask.assignedRole === UserRole.AGENT && 
       nextTask.assignedRole === UserRole.SOLICITOR) ||
      (currentTask.assignedRole === UserRole.DEVELOPER && 
       nextTask.assignedRole === UserRole.AGENT)
    );
    
    if (shouldCreateDependency) {
      dependencies.push({
        id: `dep_${depId++}`,
        sourceTaskId: currentTask.id,
        targetTaskId: nextTask.id,
        type: 'finish_to_start',
        lag: 0,
        isOnCriticalPath: false // Will be calculated later
      });
    }
  }

  // Add critical legal dependencies
  const legalTasks = tasks.filter(task => task.isLegalRequirement);
  const criticalTasks = tasks.filter(task => task.priority === TaskPriority.CRITICAL);
  
  legalTasks.forEach(legalTask => {
    const dependentTasks = tasks.filter(task => 
      task.id !== legalTask.id &&
      task.assignedRole === UserRole.BUYER &&
      task.createdAt > legalTask.createdAt
    );
    
    dependentTasks.slice(0, 2).forEach(depTask => {
      dependencies.push({
        id: `dep_${depId++}`,
        sourceTaskId: legalTask.id,
        targetTaskId: depTask.id,
        type: 'finish_to_start',
        lag: 1,
        isOnCriticalPath: false
      });
    });
  });

  return dependencies;
}