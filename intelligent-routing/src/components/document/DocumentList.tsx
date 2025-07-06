'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  Download, 
  Eye, 
  FileText, 
  Filter, 
  MoreHorizontal, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { formatFileSize, formatDateRelative } from '@/utils/format-utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DocumentItem } from '@/hooks/useGraphQLQueries';

export interface DocumentItemProps extends DocumentItem {}

export interface DocumentListProps {
  documents: DocumentItemProps[];
  loading?: boolean;
  error?: Error | null;
  onViewDocument?: (document: DocumentItemProps) => void;
  onEditDocument?: (document: DocumentItemProps) => void;
  onDeleteDocument?: (document: DocumentItemProps) => void;
  emptyMessage?: string;
  showFilters?: boolean;
}

export function DocumentList({
  documents = [],
  loading = false,
  error = null,
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  emptyMessage = "No documents found.",
  showFilters = true
}: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  
  // Apply filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filteredStatus ? doc.status === filteredStatus : true;
    return matchesSearch && matchesStatus;
  });
  
  // Get unique statuses for filter dropdown
  const statuses = [...new Set(documents.map(doc => doc.status))];

  // Render document status badge
  const renderStatusBadge = (status: string) => {
    const variantMap: Record<string, "default" | "outline" | "secondary" | "destructive"> = {
      'DRAFT': 'outline',
      'PENDING': 'secondary',
      'APPROVED': 'default',
      'REJECTED': 'destructive',
      'EXPIRED': 'secondary'
    };
    
    return (
      <Badge variant={variantMap[status] || 'default'}>
        {status}
      </Badge>
    );
  };

  // Handle document action from dropdown
  const handleAction = (action: 'view' | 'edit' | 'delete', document: DocumentItemProps) => {
    switch (action) {
      case 'view':
        onViewDocument?.(document);
        break;
      case 'edit':
        onEditDocument?.(document);
        break;
      case 'delete':
        onDeleteDocument?.(document);
        break;
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FileText className="h-4 w-4 text-blue-500" />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FileText className="h-4 w-4 text-green-500" />;
    if (fileType.includes('image')) return <FileText className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };
  
  // Extract category from metadata
  const getDocumentCategory = (document: DocumentItemProps): string => {
    return document.metadata?.category || 'Uncategorized';
  };
  
  // If there's an error
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="py-10">
          <div className="text-center text-red-500">
            <p>Error loading documents: {error.message}</p>
            <Button variant="outline" className="mt-4">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Documents</CardTitle>
          
          {showFilters && (
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    {filteredStatus ? filteredStatus : 'All Statuses'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setFilteredStatus(null)}
                    className={!filteredStatus ? 'bg-accent' : ''}
                  >
                    All Statuses
                  </DropdownMenuItem>
                  {statuses.map(status => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setFilteredStatus(status)}
                      className={filteredStatus === status ? 'bg-accent' : ''}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="flex items-center gap-2">
                      {getFileIcon(document.fileType)}
                      <span className="font-medium">{document.name}</span>
                    </TableCell>
                    <TableCell>
                      {getDocumentCategory(document)}
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(document.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDateRelative(document.uploadedAt)}</span>
                        {document.uploadedBy && (
                          <span className="text-xs text-muted-foreground">
                            by {document.uploadedBy.name}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatFileSize(document.fileSize)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          asChild
                        >
                          <a href={document.downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction('view', document)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('edit', document)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction('delete', document)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}