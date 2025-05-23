'use client';

import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  CalendarDays, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  PlayCircle, 
  Flag,
  Calendar 
} from 'lucide-react';
import { TimelineSummary } from '@/types/timeline';

interface TimelineSummaryCardsProps {
  summary: TimelineSummary;
  className?: string;
}

/**
 * Timeline Summary Cards Component
 * 
 * Displays summary metrics for the project timeline
 */
const TimelineSummaryCards: React.FC<TimelineSummaryCardsProps> = ({
  summary,
  className
}) => {
  // Calculate days left to completion
  const startDate = new Date(summary.startDate);
  const endDate = new Date(summary.endDate);
  const originalEndDate = summary.originalEndDate 
    ? new Date(summary.originalEndDate)
    : endDate;

  const now = new Date();
  const daysLeft = differenceInDays(endDatenow);
  const totalDuration = differenceInDays(endDatestartDate);
  const daysElapsed = differenceInDays(nowstartDate);
  const percentTimeElapsed = Math.min(100, Math.max(0, (daysElapsed / totalDuration) * 100));

  // Calculate variance between progress and time elapsed
  const progressVariance = summary.completionPercentage - percentTimeElapsed;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Overall Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {summary.completionPercentage}%
          </div>
          <Progress 
            value={summary.completionPercentage} 
            className="h-2" 
            indicatorClassName={progressVariance>= 0 ? "bg-green-500" : "bg-amber-500"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="space-y-1">
              <div>
                <span className="font-medium">{summary.completedTasks}</span> of {summary.totalTasks} tasks completed
              </div>
              <div className="flex items-center gap-1">
                <PlayCircle className="h-3.5 w-3.5 text-blue-500" />
                <span>{summary.inProgressTasks} in progress</span>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="flex items-center justify-end gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                <span>{summary.delayedTasks} delayed</span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span>{summary.atRiskTasks} at risk</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Timeline Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl font-bold">{daysLeft}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">days remaining</div>
          </div>
          <Progress 
            value={percentTimeElapsed} 
            className="h-2"
            indicatorClassName="bg-blue-500"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <div>Started: {format(startDate, 'MMM d, yyyy')}</div>
              <div>Completion: {format(endDate, 'MMM d, yyyy')}</div>
            </div>
            <div className="text-right">
              <div>{Math.round(percentTimeElapsed)}% time elapsed</div>
              {summary.originalEndDate && summary.originalEndDate !== summary.endDate && (
                <div className="text-red-500 dark:text-red-400">
                  {differenceInDays(endDateoriginalEndDate) > 0 
                    ? `${differenceInDays(endDateoriginalEndDate)} days behind`
                    : `${differenceInDays(originalEndDateendDate)} days ahead`
                  }
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Path */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Flag className="h-4 w-4 text-red-500" />
            Critical Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-baseline mb-2">
            <div className="text-xl font-bold">
              {summary.criticalPathDelay === 0 
                ? 'On Schedule'
                : summary.criticalPathDelay && summary.criticalPathDelay> 0
                ? `${summary.criticalPathDelay} days behind`
                : summary.criticalPathDelay && summary.criticalPathDelay <0
                ? `${Math.abs(summary.criticalPathDelay)} days ahead`
                : 'N/A'
              }
            </div>
            <Badge variant={
              summary.criticalPathDelay === 0 
                ? 'outline'
                : summary.criticalPathDelay && summary.criticalPathDelay> 0
                ? 'destructive'
                : 'default'
            }>
              {summary.onTrack ? 'On Track' : 'Delayed'}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <div className="text-slate-500 dark:text-slate-400">Projected Completion:</div>
              <div className="font-medium">{format(endDate, 'MMM d, yyyy')}</div>
            </div>
            {summary.daysBehind && summary.daysBehind> 0 && (
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <div>Schedule Deviation:</div>
                <div className="font-medium">{summary.daysBehind} days</div>
              </div>
            )}
            {summary.daysAhead && summary.daysAhead> 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <div>Schedule Advantage:</div>
                <div className="font-medium">{summary.daysAhead} days</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Phase */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            Current Phase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold capitalize mb-2">
            {summary.currentPhase}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                {`${
                  summary.currentPhase === 'planning' ? '1' :
                  summary.currentPhase === 'design' ? '2' :
                  summary.currentPhase === 'preconstruction' ? '3' :
                  summary.currentPhase === 'foundation' ? '4' :
                  summary.currentPhase === 'structure' ? '5' :
                  summary.currentPhase === 'envelope' ? '6' :
                  summary.currentPhase === 'interior' ? '7' :
                  summary.currentPhase === 'finishing' ? '8' :
                  summary.currentPhase === 'landscaping' ? '9' :
                  '10'
                }/10`}
              </Badge>
              <div>Phase Progress</div>
            </div>

            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <div>Next Phase:</div>
              <div className="font-medium capitalize">
                {summary.currentPhase === 'planning' ? 'Design' :
                 summary.currentPhase === 'design' ? 'Preconstruction' :
                 summary.currentPhase === 'preconstruction' ? 'Foundation' :
                 summary.currentPhase === 'foundation' ? 'Structure' :
                 summary.currentPhase === 'structure' ? 'Envelope' :
                 summary.currentPhase === 'envelope' ? 'Interior' :
                 summary.currentPhase === 'interior' ? 'Finishing' :
                 summary.currentPhase === 'finishing' ? 'Landscaping' :
                 summary.currentPhase === 'landscaping' ? 'Handover' :
                 'Complete'}
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <div>Completed Phases:</div>
              <div className="font-medium">{
                summary.currentPhase === 'planning' ? '0' :
                summary.currentPhase === 'design' ? '1' :
                summary.currentPhase === 'preconstruction' ? '2' :
                summary.currentPhase === 'foundation' ? '3' :
                summary.currentPhase === 'structure' ? '4' :
                summary.currentPhase === 'envelope' ? '5' :
                summary.currentPhase === 'interior' ? '6' :
                summary.currentPhase === 'finishing' ? '7' :
                summary.currentPhase === 'landscaping' ? '8' :
                '9'
              }/10</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineSummaryCards;