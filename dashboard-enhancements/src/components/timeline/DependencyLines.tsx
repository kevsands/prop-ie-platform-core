'use client';

import React, { useState, useEffect } from 'react';
import { TimelineTask } from '@/types/timeline';

interface DependencyLinesProps {
  tasks: TimelineTask[];
  containerRef: React.RefObject<HTMLDivElement>;
  showDependencies: boolean;
}

/**
 * Dependency Lines Component
 * 
 * Renders SVG lines connecting dependent tasks in the Gantt chart
 */
const DependencyLines: React.FC<DependencyLinesProps> = ({
  tasks,
  containerRef,
  showDependencies
}) => {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; isCritical: boolean }[]>([]);

  // Find task element position
  const getTaskPosition = (taskId: string) => {
    if (!containerRef.current) return null;
    
    const taskElem = containerRef.current.querySelector(`[data-task-id="${taskId}"]`) as HTMLElement;
    if (!taskElem) return null;
    
    const taskBarElem = taskElem.querySelector('div[class*="rounded-md"]') as HTMLElement;
    if (!taskBarElem) return null;
    
    const rect = taskBarElem.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    return {
      left: rect.left - containerRect.left + containerRef.current.scrollLeft,
      top: rect.top - containerRect.top + containerRef.current.scrollTop,
      right: rect.right - containerRect.left + containerRef.current.scrollLeft,
      bottom: rect.bottom - containerRect.top + containerRef.current.scrollTop,
      width: rect.width,
      height: rect.height
    };
  };

  // Calculate dependency lines
  const calculateLines = () => {
    if (!showDependencies || !containerRef.current) return;
    
    const newLines: { x1: number; y1: number; x2: number; y2: number; isCritical: boolean }[] = [];
    
    tasks.forEach(task => {
      if (!task.dependencies || task.dependencies.length === 0) return;
      
      const taskEndPosition = getTaskPosition(task.id);
      if (!taskEndPosition) return;
      
      task.dependencies.forEach(dependencyId => {
        const dependencyTask = tasks.find(t => t.id === dependencyId);
        if (!dependencyTask) return;
        
        const dependencyPosition = getTaskPosition(dependencyId);
        if (!dependencyPosition) return;
        
        // Calculate line start and end points (from end of dependency to start of task)
        const x1 = dependencyPosition.right;
        const y1 = dependencyPosition.top + dependencyPosition.height / 2;
        const x2 = taskEndPosition.left;
        const y2 = taskEndPosition.top + taskEndPosition.height / 2;
        
        const isCriticalPath = 
          task.isCriticalPath && 
          dependencyTask.isCriticalPath && 
          task.dependencies.includes(dependencyId);
        
        newLines.push({ x1, y1, x2, y2, isCritical: isCriticalPath });
      });
    });
    
    setLines(newLines);
  };

  // Update lines on scroll, resize, or when tasks change
  useEffect(() => {
    if (!showDependencies) {
      setLines([]);
      return;
    }
    
    calculateLines();
    
    const handleResize = () => calculateLines();
    const handleScroll = () => calculateLines();
    
    window.addEventListener('resize', handleResize);
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [tasks, containerRef.current, showDependencies]);

  if (!showDependencies || lines.length === 0) return null;

  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
        <marker
          id="arrow-critical"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
        </marker>
      </defs>
      
      {lines.map((line, index) => {
        // Calculate control points for the curve
        const controlPointX1 = line.x1 + Math.min(50, (line.x2 - line.x1) / 2);
        const controlPointX2 = line.x2 - Math.min(50, (line.x2 - line.x1) / 2);
        
        const path = `
          M ${line.x1},${line.y1} 
          C ${controlPointX1},${line.y1} ${controlPointX2},${line.y2} ${line.x2},${line.y2}
        `;
        
        return (
          <path
            key={index}
            d={path}
            fill="none"
            stroke={line.isCritical ? "#ef4444" : "currentColor"}
            strokeWidth={line.isCritical ? 1.5 : 1}
            strokeDasharray={line.isCritical ? "none" : "4,2"}
            className="text-slate-400 dark:text-slate-600"
            markerEnd={line.isCritical ? "url(#arrow-critical)" : "url(#arrow)"}
          />
        );
      })}
    </svg>
  );
};

export default DependencyLines;