'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: Date;
  status: 'pending' | 'verified' | 'rejected';
  url?: string;
}

interface DocumentListProps {
  documents?: Document[];
  onDocumentView?: (document: Document) => void;
  onDocumentDownload?: (document: Document) => void;
}

export default function DocumentList({ 
  documents = [], 
  onDocumentView, 
  onDocumentDownload 
}: DocumentListProps) {
  const defaultDocuments: Document[] = [
    {
      id: '1',
      name: 'Mortgage Pre-Approval Letter',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'verified',
    },
    {
      id: '2',
      name: 'Proof of Income - Payslips',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'verified',
    },
    {
      id: '3',
      name: 'Bank Statements',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      id: '4',
      name: 'Identity Verification',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
  ];

  const displayDocuments = documents.length > 0 ? documents : defaultDocuments;

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending Review';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayDocuments.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-gray-400" />
                <div>
                  <h4 className="font-medium">{document.name}</h4>
                  <div className="text-sm text-gray-600">
                    {document.type} • {document.size} • {document.uploadDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {getStatusIcon(document.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(document.status)}
                  </span>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDocumentView?.(document)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDocumentDownload?.(document)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-4" variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Upload New Document
        </Button>
      </CardContent>
    </Card>
  );
}