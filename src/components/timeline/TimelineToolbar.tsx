'use client';

import React from 'react';
import { 
  CalendarDays, 
  Filter, 
  Users, 
  ChevronDown, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Eye, 
  Link, 
  ArrowUpDown
} from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger} from "../ui/tooltip";
import { ProjectPhase, TaskStatus, TimelineToolbarProps } from '@/types/timeline';

/**
 * Timeline Toolbar Component
 * 
 * Provides filtering and view options for the project timeline
 */
const TimelineToolbar: React.FC<TimelineToolbarProps> = ({
  filterPhase,
  setFilterPhase,
  filterAssignee,
  setFilterAssignee,
  filterStatus,
  setFilterStatus,
  viewOptions,
  setViewOptions,
  zoomIn,
  zoomOut,
  resetZoom,
  exportTimeline,
  teamMembers,
  onViewModeChange,
  className
}) => {
  // Status color mappings
  const statusColors: Record<TaskStatus, string> = {
    completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    not_started: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800',
    delayed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    at_risk: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    cancelled: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'};

  return (
    <div className={`p-3 border rounded-md bg-white dark:bg-slate-950 shadow-sm ${className}`}>
      <div className="flex flex-wrap gap-3 items-center justify-between">
        {/* View Mode */}
        <div className="flex items-center gap-3">
          <Select 
            value={viewOptions.viewMode} 
            onValueChange={(value: any) => {
              setViewOptions({...viewOptions, viewMode: value as 'day' | 'week' | 'month' | 'quarter'});
              onViewModeChange(value as 'day' | 'week' | 'month' | 'quarter');
            }
          >
            <SelectTrigger className="w-[120px]">
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
            </SelectContent>
          </Select>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={resetZoom}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset Zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select value={filterPhase} onValueChange={(value: any) => setFilterPhase(value as ProjectPhase | 'all')}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="preconstruction">Preconstruction</SelectItem>
              <SelectItem value="foundation">Foundation</SelectItem>
              <SelectItem value="structure">Structure</SelectItem>
              <SelectItem value="envelope">Envelope</SelectItem>
              <SelectItem value="interior">Interior</SelectItem>
              <SelectItem value="finishing">Finishing</SelectItem>
              <SelectItem value="landscaping">Landscaping</SelectItem>
              <SelectItem value="handover">Handover</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAssignee} onValueChange={(value: any) => setFilterAssignee(value)}>
            <SelectTrigger className="w-[160px]">
              <Users className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Team Members</SelectItem>
              {teamMembers.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value as TaskStatus | 'all')}>
            <SelectTrigger className="w-[140px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not_started">
                <div className="flex items-center">
                  <Badge variant="outline" className={statusColors.not_started}>Not Started</Badge>
                </div>
              </SelectItem>
              <SelectItem value="in_progress">
                <div className="flex items-center">
                  <Badge variant="outline" className={statusColors.in_progress}>In Progress</Badge>
                </div>
              </SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center">
                  <Badge variant="outline" className={statusColors.completed}>Completed</Badge>
                </div>
              </SelectItem>
              <SelectItem value="delayed">
                <div className="flex items-center">
                  <Badge variant="outline" className={statusColors.delayed}>Delayed</Badge>
                </div>
              </SelectItem>
              <SelectItem value="at_risk">
                <div className="flex items-center">
                  <Badge variant="outline" className={statusColors.at_risk}>At Risk</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Options */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Switch 
              id="critical-path" 
              checked={viewOptions.showCriticalPath}
              onCheckedChange={(checked: any) => setViewOptions({...viewOptions, showCriticalPath: checked})}
            />
            <label htmlFor="critical-path" className="text-sm flex items-center gap-1 cursor-pointer">
              <Eye className="h-3.5 w-3.5" />
              Critical Path
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="dependencies" 
              checked={viewOptions.showDependencies}
              onCheckedChange={(checked: any) => setViewOptions({...viewOptions, showDependencies: checked})}
            />
            <label htmlFor="dependencies" className="text-sm flex items-center gap-1 cursor-pointer">
              <Link className="h-3.5 w-3.5" />
              Dependencies
            </label>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Switch 
              id="progress" 
              checked={viewOptions.showProgress}
              onCheckedChange={(checked: any) => setViewOptions({...viewOptions, showProgress: checked})}
            />
            <label htmlFor="progress" className="text-sm flex items-center gap-1 cursor-pointer">
              Progress
            </label>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={exportTimeline}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export Timeline</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default TimelineToolbar;