'use client';

import { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocuments } from '@/hooks/api-hooks'; // Assuming this hook exists
import { cn } from '@/lib/utils';
import { 
  FileCheck, 
  FileWarning, 
  FilePlus, 
  FileX, 
  Filter, 
  CalendarClock,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileQuestion,
  Upload,
  ChevronRight,
  ListFilter,
  Calendar,
  Search
} from 'lucide-react';

// Document status types
export type DocumentStatus = 'MISSING' | 'DRAFT' | 'PENDING' | 'APPROVED';

// Document category types
export type DocumentCategory = 'PLANNING' | 'LEGAL' | 'CONSTRUCTION' | 'MARKETING';

// Document item interface
export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  deadline: string; // ISO date string
  description?: string;
  lastUpdated?: string; // ISO date string
  uploadedBy?: string;
  fileUrl?: string;
  required: boolean;
  projectId?: string;
}

// Prop interface
interface DocumentComplianceTrackerProps {
  projectId?: string;
  onUploadDocument?: (documentId: string) => void;
  onViewDocument?: (documentId: string) => void;
  className?: string;
}

export default function DocumentComplianceTracker({
  projectId,
  onUploadDocument,
  onViewDocument,
  className
}: DocumentComplianceTrackerProps) {
  // State for filters
  const [categoryFiltersetCategoryFilter] = useState<DocumentCategory | 'ALL'>('ALL');
  const [statusFiltersetStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');
  const [searchQuerysetSearchQuery] = useState('');
  const [activeTabsetActiveTab] = useState<'all' | 'timeline'>('all');

  // Fetch documents using React Query
  // In a real implementation, you would pass the projectId and filters to the hook
  const { data: documents, isLoading, error } = useDocuments({
    projectId,
    category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    search: searchQuery || undefined
  });

  // Status color mapping
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

  // Calculate stats for each category
  const categoryStats = useMemo(() => {
    const stats: Record<DocumentCategory, { total: number; approved: number; missing: number; pending: number; draft: number }> = {
      PLANNING: { total: 0, approved: 0, missing: 0, pending: 0, draft: 0 },
      LEGAL: { total: 0, approved: 0, missing: 0, pending: 0, draft: 0 },
      CONSTRUCTION: { total: 0, approved: 0, missing: 0, pending: 0, draft: 0 },
      MARKETING: { total: 0, approved: 0, missing: 0, pending: 0, draft: 0 }
    };

    if (documents?.data) {
      documents.data.forEach(doc => {
        if (stats[doc.category]) {
          stats[doc.category].total++;

          switch (doc.status) {
            case 'APPROVED':
              stats[doc.category].approved++;
              break;
            case 'MISSING':
              stats[doc.category].missing++;
              break;
            case 'PENDING':
              stats[doc.category].pending++;
              break;
            case 'DRAFT':
              stats[doc.category].draft++;
              break;
          }
        }
      });
    }

    return stats;
  }, [documents]);

  // Calculate overall compliance percentage
  const overallCompliance = useMemo(() => {
    if (!documents?.data || documents.data.length === 0) return 0;

    const approvedCount = documents.data.filter(doc => doc.status === 'APPROVED').length;
    return Math.round((approvedCount / documents.data.length) * 100);
  }, [documents]);

  // Filter documents by upcoming deadlines for timeline view
  const upcomingDeadlines = useMemo(() => {
    if (!documents?.data) return [];

    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    return documents.data
      .filter(doc => {
        if (doc.status === 'APPROVED') return false;

        const deadlineDate = new Date(doc.deadline);
        return deadlineDate>= now && deadlineDate <= thirtyDaysLater;
      })
      .sort((ab) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [documents]);

  // Group documents by month and day for timeline view
  const groupedDeadlines = useMemo(() => {
    const grouped: Record<string, DocumentItem[]> = {};

    upcomingDeadlines.forEach(doc => {
      const date = new Date(doc.deadline);
      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!grouped[monthDay]) {
        grouped[monthDay] = [];
      }

      grouped[monthDay].push(doc);
    });

    return grouped;
  }, [upcomingDeadlines]);

  // Handle document action (view or upload)
  const handleDocumentAction = (doc: DocumentItem) => {
    if (doc.status === 'MISSING' || doc.status === 'DRAFT') {
      onUploadDocument?.(doc.id);
    } else {
      onViewDocument?.(doc.id);
    }
  };

  // For loading states
  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-1/3" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-2/3" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-1/3 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-2">
              {Array(5).fill(0).map((_i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // For error states
  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Document Compliance Tracker</CardTitle>
          <CardDescription>Error loading document data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p>Failed to load document data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>Document Compliance Tracker</CardTitle>
            <CardDescription>Track and manage required documents for your project</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center border rounded-md px-3 py-1.5 text-sm bg-muted/60">
                    <FileCheck className="h-4 w-4 mr-1.5 text-green-500" />
                    <span>Compliance: </span>
                    <span className="font-bold ml-1">{overallCompliance}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Overall document compliance percentage</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="outline" size="sm" asChild>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                // This would open a document compliance report
              }>
                Generate Report
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categoryStats).map(([categorystats]) => {
            const progressPercentage = stats.total> 0 
              ? Math.round((stats.approved / stats.total) * 100) 
              : 0;

            return (
              <Card key={category}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{category.charAt(0) + category.slice(1).toLowerCase()}</h3>
                    <Badge variant={progressPercentage === 100 ? "default" : "outline">
                      {stats.approved}/{stats.total}
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      <span>Approved: {stats.approved}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                      <span>Missing: {stats.missing}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="w-full md:w-auto">
              <Select 
                value={categoryFilter} 
                onValueChange={(value) => setCategoryFilter(value as any)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="PLANNING">Planning</SelectItem>
                    <SelectItem value="LEGAL">Legal</SelectItem>
                    <SelectItem value="CONSTRUCTION">Construction</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-auto">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as any)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="MISSING">Missing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Tab view for All Documents vs Timeline */}
        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as 'all' | 'timeline')}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-1">
              <ListFilter className="h-4 w-4" />
              <span>All Documents</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {/* Documents List */}
            <div className="space-y-2">
              {documents?.data && documents.data.length> 0 ? (
                documents.data.map(doc => {
                  const statusDetails = getStatusDetails(doc.status);
                  return (
                    <div 
                      key={doc.id} 
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-card border rounded-md hover:border-primary/50 transition-colors group"
                    >
                      <div className="flex items-start md:items-center gap-3 mb-2 md:mb-0">
                        <div className={cn("p-2 rounded-md", statusDetails.color.split(' ')[0], "bg-opacity-10")}>
                          <statusDetails.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{doc.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs font-normal">
                              {doc.category}
                            </Badge>
                            <Badge variant="secondary" className={cn("text-xs", statusDetails.color)}>
                              {statusDetails.label}
                            </Badge>
                            {doc.required && (
                              <Badge variant="destructive" className="text-xs font-normal">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <CalendarClock className="h-3 w-3 mr-1" />
                          <span>Due: {new Date(doc.deadline).toLocaleDateString()}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant={doc.status === 'MISSING' || doc.status === 'DRAFT' ? 'default' : 'outline'}
                          onClick={() => handleDocumentAction(doc)}
                          className="ml-2"
                        >
                          {doc.status === 'MISSING' || doc.status === 'DRAFT' ? (
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
                })
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-md text-center">
                  <FileQuestion className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">No documents found</h3>
                  <p className="text-muted-foreground mb-4">There are no documents matching your current filters.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCategoryFilter('ALL');
                      setStatusFilter('ALL');
                      setSearchQuery('');
                    }
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            {/* Timeline View */}
            <div className="space-y-6">
              {Object.keys(groupedDeadlines).length> 0 ? (
                Object.entries(groupedDeadlines).map(([datedocs]) => (
                  <div key={date} className="relative pl-8 border-l pb-6">
                    <div className="absolute -left-2.5 top-0 bg-background border-4 border-background rounded-full">
                      <div className="h-5 w-5 rounded-full bg-primary"></div>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-semibold text-md">{date}</h3>
                      <p className="text-sm text-muted-foreground">
                        {docs.length} document{docs.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {docs.map(doc => {
                        const statusDetails = getStatusDetails(doc.status);
                        return (
                          <div 
                            key={doc.id} 
                            className="flex items-center justify-between p-3 bg-card border rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn("p-1.5 rounded-md", statusDetails.color.split(' ')[0], "bg-opacity-10")}>
                                <statusDetails.icon className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{doc.name}</h4>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Badge variant="outline" className="text-xs font-normal">
                                    {doc.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDocumentAction(doc)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-md text-center">
                  <CalendarClock className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">No upcoming deadlines</h3>
                  <p className="text-muted-foreground mb-4">There are no documents due in the next 30 days.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-1.5"></div>
            <span className="text-xs text-muted-foreground">Approved</span>
          </div>
          <div className="flex items-center ml-3">
            <div className="h-3 w-3 rounded-full bg-amber-500 mr-1.5"></div>
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center ml-3">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-1.5"></div>
            <span className="text-xs text-muted-foreground">Draft</span>
          </div>
          <div className="flex items-center ml-3">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-1.5"></div>
            <span className="text-xs text-muted-foreground">Missing</span>
          </div>
        </div>
        <div>
          <Button variant="default" onClick={() => onUploadDocument?.('new')}>
            <FilePlus className="h-4 w-4 mr-1.5" />
            Upload New Document
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}