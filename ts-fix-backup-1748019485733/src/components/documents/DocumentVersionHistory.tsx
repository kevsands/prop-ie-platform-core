'use client';

import React from 'react';
import { 
  Document as DocumentType 
} from '@/types/document';
import { DocumentVersion } from '@/types/core/document';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Download, 
  Clock, 
  FileText,
  AlertCircle,
  CheckCircle2,
  History
} from 'lucide-react';

interface DocumentVersionHistoryProps {
  document: DocumentType;
  versions: DocumentVersion[];
  isLoading: boolean;
  error: string | null;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  document,
  versions,
  isLoading,
  error
}) => {
  // Handle version download
  const handleVersionDownload = (url: string) => {
    window.open(url, '_blank');
  };

  // Format date for display
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'PPP');
  };

  // Create a combined array of all versions, including the current one
  const allVersions = [
    // Current version
    {
      id: 'current',
      document: document,
      versionNumber: document.version || 1,
      fileUrl: document.fileUrl,
      createdBy: {
        id: document.uploadedBy,
        firstName: document.uploadedByName?.split(' ')[0] || '',
        lastName: document.uploadedByName?.split(' ').slice(1).join(' ') || ''
      },
      created: document.uploadDate,
      notes: 'Current version',
      changes: '',
      size: document.fileSize || 0,
      isCurrent: true
    },
    // Previous versions
    ...versions.map(v => ({
      ...v,
      isCurrent: false
    }))
  ].sort((ab) => b.versionNumber - a.versionNumber);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Document History</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <History className="h-3 w-3" />
          {versions.length + 1} Versions
        </Badge>
      </div>

      {isLoading ? (
        <div className="py-4 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-b-transparent border-primary rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading version history...</p>
        </div>
      ) : error ? (
        <Card className="bg-destructive/10">
          <CardContent className="p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      ) : allVersions.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">No version history found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allVersions.map((versionindex) => (
            <Card 
              key={version.id}
              className={version.isCurrent ? 'border-primary/50 shadow-sm' : ''}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={version.isCurrent ? "default" : "outline">
                      v{version.versionNumber}
                    </Badge>
                    <CardTitle className="text-base">
                      {version.isCurrent ? 'Current Version' : `Version ${version.versionNumber}`}
                    </CardTitle>
                    {version.isCurrent && (
                      <Badge variant="outline" className="bg-green-50 text-green-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Current
                      </Badge>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleVersionDownload(version.fileUrl)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(version.created)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground">Notes:</p>
                    <p className="text-sm">
                      {version.notes || 'No version notes provided'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Created By:</span>
                      <span className="font-medium">
                        {version.createdBy?.firstName} {version.createdBy?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{(version.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">File Type:</span>
                      <span>
                        <FileText className="h-3 w-3 inline-block mr-1" />
                        {document.fileType || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentVersionHistory;