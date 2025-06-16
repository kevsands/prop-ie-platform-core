import React from 'react';
'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarClock, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  FileQuestion,
  XCircle} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentItem, DocumentStatus } from './DocumentComplianceTracker';

interface DocumentTimelineProps {
  documents: DocumentItem[];
  onViewDocumentAction: (documentId: string) => void;
  onUploadDocumentAction: (documentId: string) => void;
  className?: string;
}

export default function DocumentTimeline({
  documents,
  onViewDocumentAction,
  onUploadDocumentAction,
  className
}: DocumentTimelineProps) {
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

  // Filter documents with upcoming deadlines (next 30 days) that are not approved
  const upcomingDocuments = useMemo(() => {
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    return documents
      .filter(doc => {
        if (doc.status === 'APPROVED') return false;

        const deadlineDate = new Date(doc.deadline);
        return deadlineDate>= now && deadlineDate <= thirtyDaysLater;
      })
      .sort((ab: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [documents]);

  // Group documents by date (e.g., "Apr 15")
  const groupedDocuments = useMemo(() => {
    const grouped: Record<string, DocumentItem[]> = {};

    upcomingDocuments.forEach(doc => {
      const date = new Date(doc.deadline);
      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!grouped[monthDay]) {
        grouped[monthDay] = [];
      }

      grouped[monthDay].push(doc);
    });

    return grouped;
  }, [upcomingDocuments]);

  // Calculate days from now
  const getDaysFromNow = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 00);

    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 00);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  // Handle document action (view or upload)
  const handleDocumentAction = (doc: DocumentItem) => {
    if (doc.status === 'MISSING' || doc.status === 'DRAFT') {
      onUploadDocumentAction(doc.id);
    } else {
      onViewDocumentAction(doc.id);
    }
  };

  if (upcomingDocuments.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 bg-muted/20 rounded-md text-center", className)}>
        <CalendarClock className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">No upcoming deadlines</h3>
        <p className="text-muted-foreground mb-4">There are no documents due in the next 30 days.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {Object.entries(groupedDocuments).map(([datedocs]) => (
        <div key={date} className="relative pl-8 border-l pb-6">
          {/* Date marker */}
          <div className="absolute -left-2.5 top-0 bg-background border-4 border-background rounded-full">
            <div className="h-5 w-5 rounded-full bg-primary"></div>
          </div>

          {/* Date header */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-md">{date}</h3>
              <Badge variant="outline" className="text-xs">
                {getDaysFromNow(docs[0].deadline)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {docs.length} document{docs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Document cards */}
          <div className="space-y-2">
            {docs.map(doc => {
              const statusDetails = getStatusDetails(doc.status);
              const isPastDue = new Date(doc.deadline) <new Date() && doc.status !== 'APPROVED';

              return (
                <Card key={doc.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between gap-2 p-3">
                      {/* Document info */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={cn("p-1.5 rounded-md flex-shrink-0", statusDetails.color.split(' ')[0], "bg-opacity-10")}>
                          <statusDetails.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            <Badge variant="outline" className="text-xs font-normal">
                              {doc.category}
                            </Badge>
                            {isPastDue && (
                              <div className="flex items-center text-red-500 text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                <span>Overdue</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDocumentAction(doc)}
                        className="flex-shrink-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Status indicator strip */}
                    <div 
                      className={cn(
                        "h-1 w-full",
                        doc.status === 'MISSING' 
                          ? "bg-red-500" 
                          : doc.status === 'DRAFT' 
                            ? "bg-blue-500" 
                            : doc.status === 'PENDING' 
                              ? "bg-amber-500" 
                              : "bg-green-500"
                      )} 
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-center items-center mt-4 text-xs text-muted-foreground gap-4">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-1.5"></div>
          <span>Missing</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-500 mr-1.5"></div>
          <span>Draft</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-amber-500 mr-1.5"></div>
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
}