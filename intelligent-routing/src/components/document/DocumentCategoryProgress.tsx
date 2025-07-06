'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { DocumentCategory } from './DocumentComplianceTracker';

interface CategoryStats {
  total: number;
  approved: number;
  missing: number;
  pending: number;
  draft: number;
}

interface DocumentCategoryProgressProps {
  category: DocumentCategory;
  stats: CategoryStats;
  onClick?: (category: DocumentCategory) => void;
  isSelected?: boolean;
  className?: string;
}

export default function DocumentCategoryProgress({
  category,
  stats,
  onClick,
  isSelected = false,
  className
}: DocumentCategoryProgressProps) {
  // Format category name for display
  const categoryDisplay = category.charAt(0) + category.slice(1).toLowerCase();
  
  // Calculate progress percentage
  const progressPercentage = stats.total > 0 
    ? Math.round((stats.approved / stats.total) * 100) 
    : 0;

  // Status breakdown percentages
  const approvedPercentage = stats.total > 0 ? (stats.approved / stats.total) * 100 : 0;
  const pendingPercentage = stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;
  const draftPercentage = stats.total > 0 ? (stats.draft / stats.total) * 100 : 0;
  const missingPercentage = stats.total > 0 ? (stats.missing / stats.total) * 100 : 0;

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:border-primary/50 cursor-pointer",
        isSelected && "border-primary ring-1 ring-primary",
        className
      )}
      onClick={() => onClick?.(category)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{categoryDisplay}</h3>
          <Badge variant={progressPercentage === 100 ? "default" : "outline"}>
            {stats.approved}/{stats.total}
          </Badge>
        </div>
        
        {/* Color-segmented progress bar */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-2 w-full bg-muted rounded-full mb-2 overflow-hidden flex">
                {stats.total > 0 && (
                  <>
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${approvedPercentage}%` }}
                    />
                    <div 
                      className="h-full bg-amber-500" 
                      style={{ width: `${pendingPercentage}%` }}
                    />
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${draftPercentage}%` }}
                    />
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${missingPercentage}%` }}
                    />
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                <div className="font-medium">Document Status Breakdown</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                    <span>Approved: {stats.approved}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mr-1.5"></div>
                    <span>Pending: {stats.pending}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></div>
                    <span>Draft: {stats.draft}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div>
                    <span>Missing: {stats.missing}</span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="grid grid-cols-2 text-xs text-muted-foreground mt-2 gap-y-1">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
            <span>Approved: {stats.approved}</span>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
            <span>Missing: {stats.missing}</span>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
            <span>Pending: {stats.pending}</span>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
            <span>Draft: {stats.draft}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}