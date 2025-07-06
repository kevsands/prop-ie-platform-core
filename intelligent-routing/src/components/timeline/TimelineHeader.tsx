'use client';

import React from 'react';
import { format, differenceInDays, addDays, isSameMonth, isWeekend, getMonth, isSunday, getDay, isFirstDayOfMonth, getDate, lastDayOfMonth, isToday } from 'date-fns';

interface TimelineHeaderProps {
  startDate: Date;
  endDate: Date;
  viewMode: 'day' | 'week' | 'month' | 'quarter';
  columnWidth: number;
  today: Date;
  showWeekends: boolean;
}

/**
 * Timeline Header Component
 * 
 * Renders the date headers for the Gantt chart
 */
const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  startDate,
  endDate,
  viewMode,
  columnWidth,
  today,
  showWeekends
}) => {
  // Calculate the total number of days in the timeline
  const totalDays = differenceInDays(endDate, startDate) + 1;
  
  // Generate all dates in the timeline range
  const allDates = Array.from({ length: totalDays }, (_, i) => 
    addDays(startDate, i)
  );
  
  // Render month header cells
  const renderMonthHeaders = () => {
    let currentMonth = -1;
    let currentMonthWidth = 0;
    const monthCells = [];
    
    for (let i = 0; i < allDates.length; i++) {
      const date = allDates[i];
      const month = getMonth(date);
      
      if (month !== currentMonth) {
        // Push the previous month cell if it exists
        if (currentMonth !== -1) {
          monthCells.push(
            <div 
              key={`month-${currentMonth}`}
              className="h-full border-r border-slate-200 dark:border-slate-700 flex items-center justify-center"
              style={{ width: `${currentMonthWidth}px` }}
            >
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {format(addDays(date, -1), 'MMMM yyyy')}
              </span>
            </div>
          );
        }
        
        // Reset for the new month
        currentMonth = month;
        currentMonthWidth = columnWidth;
      } else {
        currentMonthWidth += columnWidth;
      }
    }
    
    // Add the last month
    if (currentMonth !== -1) {
      monthCells.push(
        <div 
          key={`month-${currentMonth}`}
          className="h-full border-r border-slate-200 dark:border-slate-700 flex items-center justify-center"
          style={{ width: `${currentMonthWidth}px` }}
        >
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {format(allDates[allDates.length - 1], 'MMMM yyyy')}
          </span>
        </div>
      );
    }
    
    return monthCells;
  };
  
  // Render week header cells
  const renderWeekHeaders = () => {
    return allDates.map((date, i) => {
      const isWeekStart = isSunday(date); // or use getDay(date) === 1 for Monday
      const showWeek = isWeekStart || i === 0;
      
      return (
        <div
          key={`week-${i}`}
          className={`
            h-full border-r border-slate-200 dark:border-slate-700 
            ${isWeekStart ? 'border-slate-300 dark:border-slate-600' : ''}
            ${isWeekend(date) && !showWeekends ? 'bg-slate-100 dark:bg-slate-800/50' : ''}
          `}
          style={{ width: `${columnWidth}px` }}
        >
          {showWeek && (
            <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-1">
              Week {format(date, 'w')}
            </div>
          )}
        </div>
      );
    });
  };
  
  // Render day header cells
  const renderDayHeaders = () => {
    return allDates.map((date, i) => {
      const isCurrentDay = isToday(date);
      const isMonthStart = isFirstDayOfMonth(date);
      
      return (
        <div
          key={`day-${i}`}
          className={`
            h-full border-r border-slate-200 dark:border-slate-700 relative
            ${isMonthStart ? 'border-l-2 border-l-slate-300 dark:border-l-slate-600' : ''}
            ${isWeekend(date) ? 'bg-slate-100/80 dark:bg-slate-800/30' : ''}
            ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
          `}
          style={{ width: `${columnWidth}px` }}
        >
          <div className={`
            text-[10px] text-center pt-0.5
            ${isCurrentDay ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}
          `}>
            {format(date, 'd')}
          </div>
          <div className={`
            text-[9px] text-center
            ${isCurrentDay ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500'}
          `}>
            {format(date, 'EEE')}
          </div>
        </div>
      );
    });
  };
  
  // Determine which headers to show based on view mode
  const renderHeaderCells = () => {
    switch (viewMode) {
      case 'day':
        return renderDayHeaders();
      case 'week':
        return renderWeekHeaders();
      case 'month':
      case 'quarter':
        return renderMonthHeaders();
      default:
        return renderDayHeaders();
    }
  };
  
  // Render today marker
  const renderTodayMarker = () => {
    // Only show if today is within the timeline range
    if (today < startDate || today > endDate) return null;
    
    const daysFromStart = differenceInDays(today, startDate);
    const leftPosition = daysFromStart * columnWidth;
    
    return (
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-blue-500 dark:bg-blue-400 z-10 pointer-events-none"
        style={{ left: `${leftPosition + (columnWidth / 2)}px` }}
      />
    );
  };

  return (
    <div className="relative w-full">
      {/* Month/Week Header Row */}
      <div className="h-7 flex flex-nowrap border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        {viewMode === 'month' || viewMode === 'quarter' ? renderMonthHeaders() : renderWeekHeaders()}
      </div>
      
      {/* Day Header Row */}
      <div className="h-8 flex flex-nowrap border-b border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/80">
        {renderDayHeaders()}
        {renderTodayMarker()}
      </div>
    </div>
  );
};

export default TimelineHeader;