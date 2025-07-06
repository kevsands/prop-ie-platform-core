'use client';

import React from 'react';
import { differenceInDays, format, addDays, isWeekend, isSameDay } from 'date-fns';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { TimelineRowProps, TaskStatus, TimelineTask } from '@/types/timeline';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Star, AlertTriangle, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

/**
 * Timeline Row Component
 * 
 * Represents a single task bar in the Gantt chart
 */
const TimelineRow: React.FC<TimelineRowProps> = ({
  task,
  timelineStart,
  timelineEnd,
  columnWidth,
  today,
  showProgress,
  isCompact,
  index,
  onTaskClick,
  showCriticalPath
}) => {
  // Status color mappings
  const statusColors: Record<TaskStatus, string> = {
    completed: 'bg-green-500 hover:bg-green-600',
    in_progress: 'bg-blue-500 hover:bg-blue-600',
    not_started: 'bg-slate-400 hover:bg-slate-500',
    delayed: 'bg-red-500 hover:bg-red-600',
    at_risk: 'bg-amber-500 hover:bg-amber-600',
    cancelled: 'bg-slate-300 hover:bg-slate-400 opacity-60'
  };

  const statusIcons: Record<TaskStatus, React.ReactNode> = {
    completed: <CheckCircle className="h-3 w-3" />,
    in_progress: <Clock className="h-3 w-3" />,
    not_started: <Clock className="h-3 w-3" />,
    delayed: <AlertTriangle className="h-3 w-3" />,
    at_risk: <AlertCircle className="h-3 w-3" />,
    cancelled: <XCircle className="h-3 w-3" />
  };
  
  // Calculate the task's position and width
  const taskStart = new Date(task.actualStartDate || task.startDate);
  const taskEnd = new Date(task.actualEndDate || task.endDate);
  
  // Calculate the number of days from the timeline start to the task start
  const daysFromStart = Math.max(0, differenceInDays(taskStart, timelineStart));
  
  // Calculate the task duration in days
  const taskDuration = Math.max(1, differenceInDays(taskEnd, taskStart) + 1);
  
  // Calculate left position and width based on column width
  const leftPosition = daysFromStart * columnWidth;
  const barWidth = taskDuration * columnWidth;
  
  // Calculate planned task position and width if they differ
  const hasDateDifference = task.plannedStartDate && task.plannedEndDate && 
    (task.plannedStartDate !== task.startDate || task.plannedEndDate !== task.endDate);
  
  let plannedLeftPosition = 0;
  let plannedBarWidth = 0;
  
  if (hasDateDifference) {
    const plannedStart = new Date(task.plannedStartDate!);
    const plannedEnd = new Date(task.plannedEndDate!);
    const plannedDaysFromStart = Math.max(0, differenceInDays(plannedStart, timelineStart));
    const plannedDuration = Math.max(1, differenceInDays(plannedEnd, plannedStart) + 1);
    
    plannedLeftPosition = plannedDaysFromStart * columnWidth;
    plannedBarWidth = plannedDuration * columnWidth;
  }

  // Determine if the task is delayed
  const isDelayed = task.status === 'delayed' || task.delayReason;
  
  // Determine if today is within the task's timeframe
  const isTodayWithinTask = 
    taskStart <= today && 
    taskEnd >= today &&
    task.status !== 'completed' && 
    task.status !== 'cancelled';
  
  // Function to render assignee avatars
  const renderAssignees = () => {
    if (!task.assignedTo || task.assignedTo.length === 0 || isCompact) return null;
    
    return (
      <div className="flex -space-x-2 ml-2">
        {task.assignedTo.slice(0, 2).map((assigneeId, i) => (
          <Avatar key={i} className="h-5 w-5 border border-white">
            <AvatarFallback className="text-[10px]">{assigneeId.substring(2)}</AvatarFallback>
          </Avatar>
        ))}
        {task.assignedTo.length > 2 && (
          <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center border border-white">
            +{task.assignedTo.length - 2}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`relative h-12 ${isCompact ? 'h-10' : 'h-12'} w-full ${index % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/30' : ''}`}
      data-task-id={task.id}
    >
      {/* Task Label */}
      <div className="absolute left-0 top-0 h-full flex items-center z-10 pointer-events-none">
        <div className="flex items-center px-2">
          {task.isMilestone && <Star className="h-3.5 w-3.5 text-amber-500 mr-1.5" />}
          <span className={`text-sm font-medium ${task.isMilestone ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
            {task.name}
          </span>
          {!isCompact && (
            <>
              {statusIcons[task.status] && (
                <span className="ml-1.5">
                  <Badge variant="outline" className={`
                    text-xs px-1.5 py-0 flex items-center gap-1
                    ${task.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : ''}
                    ${task.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : ''}
                    ${task.status === 'not_started' ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800' : ''}
                    ${task.status === 'delayed' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : ''}
                    ${task.status === 'at_risk' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' : ''}
                    ${task.status === 'cancelled' ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' : ''}
                  `}>
                    {statusIcons[task.status]}
                    <span>{task.status.replace('_', ' ')}</span>
                  </Badge>
                </span>
              )}
              {renderAssignees()}
            </>
          )}
        </div>
      </div>
      
      {/* Task Bar */}
      <div 
        className="absolute top-0 h-full"
        style={{ 
          left: `${leftPosition}px`, 
          width: `${barWidth}px` 
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`
                  relative h-8 ${isCompact ? 'h-6 mt-2' : 'h-8 mt-2'} rounded-md cursor-pointer
                  ${statusColors[task.status]}
                  ${task.isCriticalPath && showCriticalPath ? 'ring-2 ring-offset-1 ring-red-500 dark:ring-red-600' : ''}
                  ${task.isMilestone ? 'rounded-full aspect-square' : ''}
                  transition-all duration-200
                `}
                onClick={() => onTaskClick && onTaskClick(task)}
              >
                {/* Task Progress Bar */}
                {showProgress && task.percentComplete > 0 && task.percentComplete < 100 && !task.isMilestone && (
                  <div 
                    className="absolute top-0 left-0 h-full bg-opacity-30 dark:bg-opacity-40 bg-white rounded-md"
                    style={{ width: `${task.percentComplete}%` }}
                  />
                )}
                
                {/* Today Marker if within task duration */}
                {isTodayWithinTask && !task.isMilestone && (
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white dark:bg-slate-300 z-10"
                    style={{ 
                      left: `${Math.min(barWidth, Math.max(0, differenceInDays(today, taskStart) * columnWidth))}px` 
                    }}
                  />
                )}
                
                {/* Task date range if not compact */}
                {!isCompact && !task.isMilestone && barWidth > 50 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-white font-medium truncate px-2">
                      {format(taskStart, 'MMM d')} - {format(taskEnd, 'MMM d')}
                    </span>
                  </div>
                )}
                
                {/* Milestone content if applicable */}
                {task.isMilestone && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 max-w-xs">
                <div className="font-bold">
                  {task.name} 
                  {task.isMilestone && <span className="ml-1 text-amber-500">★</span>}
                  {task.isCriticalPath && showCriticalPath && <span className="ml-1 text-red-500">⚑</span>}
                </div>
                <div className="text-sm">
                  <span>{format(taskStart, 'MMM d, yyyy')} - {format(taskEnd, 'MMM d, yyyy')}</span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="outline" className={`
                      ${task.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : ''}
                      ${task.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : ''}
                      ${task.status === 'not_started' ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800' : ''}
                      ${task.status === 'delayed' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : ''}
                      ${task.status === 'at_risk' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' : ''}
                      ${task.status === 'cancelled' ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' : ''}
                    `}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    {task.percentComplete > 0 && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                        {task.percentComplete}% complete
                      </Badge>
                    )}
                  </div>
                </div>
                {task.delayReason && (
                  <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-1 rounded">
                    Delay: {task.delayReason}
                  </div>
                )}
                {task.description && (
                  <div className="text-xs mt-1">{task.description}</div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Planned Date Bar (if different from actual) */}
      {hasDateDifference && !task.isMilestone && (
        <div 
          className="absolute top-0 h-full"
          style={{ 
            left: `${plannedLeftPosition}px`, 
            width: `${plannedBarWidth}px` 
          }}
        >
          <div className={`
            h-2 mt-3 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-md bg-transparent
          `} />
        </div>
      )}
    </div>
  );
};

export default TimelineRow;