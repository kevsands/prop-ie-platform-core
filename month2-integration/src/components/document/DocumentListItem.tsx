'use client';

import {
  CheckCircle2,
  Clock,
  FileQuestion,
  XCircle,
  Upload,
  FileCheck,
  CalendarClock,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  DocumentItem, 
  DocumentStatus, 
  DocumentCategory 
} from './DocumentComplianceTracker';

interface DocumentListItemProps {
  document: DocumentItem;
  onUpload?: (documentId: string) => void;
  onView?: (documentId: string) => void;
  isCompact?: boolean;
  className?: string;
}

export default function DocumentListItem({
  document,
  onUpload,
  onView,
  isCompact = false,
  className
}: DocumentListItemProps) {
  // Status details based on document status
  const getStatusDetails = (status: DocumentStatus) => {
    switch (status) {
      case 'APPROVED':
        return { 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', 
          icon: CheckCircle2, 
          label: 'Approved'
        };
      case 'PENDING':
        return { 
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300', 
          icon: Clock, 
          label: 'Pending'
        };
      case 'DRAFT':
        return { 
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', 
          icon: FileQuestion, 
          label: 'Draft'
        };
      case 'MISSING':
        return { 
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', 
          icon: XCircle, 
          label: 'Missing'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', 
          icon: FileQuestion, 
          label: 'Unknown'
        };
    }
  };

  // Get status details
  const statusDetails = getStatusDetails(document.status);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Check if document is past due
  const isPastDue = () => {
    const now = new Date();
    const deadline = new Date(document.deadline);
    return deadline < now && document.status !== 'APPROVED';
  };

  // Handle document action (view or upload)
  const handleAction = () => {
    if (document.status === 'MISSING' || document.status === 'DRAFT') {
      onUpload?.(document.id);
    } else {
      onView?.(document.id);
    }
  };

  // Compact view for timeline
  if (isCompact) {
    return (
      <div 
        className={cn(
          "flex items-center justify-between p-3 bg-card border rounded-md hover:border-primary/50 transition-colors",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md", statusDetails.color.split(' ')[0], "bg-opacity-10")}>
            <statusDetails.icon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{document.name}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge variant="outline" className="text-xs font-normal">
                {document.category}
              </Badge>
              {isPastDue() && (
                <Badge variant="destructive" className="text-xs">Overdue</Badge>
              )}
            </div>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={handleAction}
          className="gap-1"
        >
          {document.status === 'MISSING' || document.status === 'DRAFT' ? (
            <>
              <Upload className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">Upload</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">View</span>
            </>
          )}
        </Button>
      </div>
    );
  }

  // Regular full view
  return (
    <div 
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between p-4 bg-card border rounded-md hover:border-primary/50 transition-colors",
        className
      )}
    >
      <div className="flex items-start md:items-center gap-3 mb-3 md:mb-0">
        <div className={cn("p-2 rounded-md", statusDetails.color.split(' ')[0], "bg-opacity-10")}>
          <statusDetails.icon className="h-5 w-5" />
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h4 className="font-medium text-sm line-clamp-1">{document.name}</h4>
              </TooltipTrigger>
              {document.description && (
                <TooltipContent side="top" align="start">
                  <p className="max-w-xs">{document.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs font-normal">
              {document.category}
            </Badge>
            <Badge variant="secondary" className={cn("text-xs", statusDetails.color)}>
              {statusDetails.label}
            </Badge>
            {document.required && (
              <Badge variant="destructive" className="text-xs font-normal">
                Required
              </Badge>
            )}
            {isPastDue() && (
              <div className="flex items-center text-red-500 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>Overdue</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 ml-10 md:ml-auto">
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarClock className="h-3 w-3 mr-1" />
          <span>Due: {formatDate(document.deadline)}</span>
        </div>
        {document.lastUpdated && (
          <div className="text-xs text-muted-foreground flex items-center md:ml-4">
            <Clock className="h-3 w-3 mr-1" />
            <span>Updated: {formatDate(document.lastUpdated)}</span>
          </div>
        )}
        <Button 
          size="sm" 
          variant={document.status === 'MISSING' || document.status === 'DRAFT' ? 'default' : 'outline'}
          onClick={handleAction}
          className="md:ml-4"
        >
          {document.status === 'MISSING' || document.status === 'DRAFT' ? (
            <>
              <Upload className="h-4 w-4 mr-1" />
              <span>Upload</span>
            </>
          ) : (
            <>
              <FileCheck className="h-4 w-4 mr-1" />
              <span>View</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}