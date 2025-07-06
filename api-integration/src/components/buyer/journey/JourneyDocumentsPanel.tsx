'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBuyerDocuments } from '@/context/BuyerDocumentContext';
import { useBuyerJourney } from '@/hooks/useBuyerJourney';
import { getRequiredDocumentsForPhase } from '@/types/buyer-documents';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { BuyerPhase } from '@/types/buyer-journey';
import { Document as DocumentType, DocumentType as DocType } from '@/types/document';

interface JourneyDocumentsPanelProps {
  maxItems?: number;
  showProgress?: boolean;
  showAll?: boolean;
  className?: string;
}

export default function JourneyDocumentsPanel({
  maxItems = 3,
  showProgress = true,
  showAll = false,
  className = '',
}: JourneyDocumentsPanelProps) {
  const { phaseProgress, documentStatuses, uploadDocument, refreshDocuments } = useBuyerDocuments();
  const { journey } = useBuyerJourney();
  
  const currentPhase = journey?.currentPhase || BuyerPhase.PLANNING;
  const currentPhaseProgress = phaseProgress[currentPhase as keyof typeof phaseProgress];
  
  // Get required documents for the current phase
  const requiredDocs = getRequiredDocumentsForPhase(currentPhase);
  
  // Sort documents by required first, then by not uploaded
  const sortedDocuments = [...documentStatuses]
    .filter(doc => 
      showAll ? true : 
      requiredDocs.some(rd => rd.id === doc.requiredDocumentId)
    )
    .sort((a, b) => {
      const aDoc = requiredDocs.find(d => d.id === a.requiredDocumentId);
      const bDoc = requiredDocs.find(d => d.id === b.requiredDocumentId);
      
      // Sort by required status
      if (aDoc?.isRequired && !bDoc?.isRequired) return -1;
      if (!aDoc?.isRequired && bDoc?.isRequired) return 1;
      
      // Then sort by upload status
      if (!a.uploaded && b.uploaded) return -1;
      if (a.uploaded && !b.uploaded) return 1;
      
      return 0;
    })
    .slice(0, maxItems);
  
  const handleUploadDocument = async (file: File, metadata: any, docId: string) => {
    const reqDoc = requiredDocs.find(d => d.id === docId);
    if (!reqDoc) return { success: false, message: 'Document type not found' };
    
    try {
      const result = await uploadDocument(file, {
        requiredDocumentId: reqDoc.id,
        name: reqDoc.name,
        description: reqDoc.description,
        type: reqDoc.type as string
      });
      
      if (result.success) {
        await refreshDocuments();
      }
      
      return result;
    } catch (error) {
      console.error('Error uploading document:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Required Documents</CardTitle>
        <CardDescription>
          Documents needed for your current phase
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {showProgress && currentPhaseProgress && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentPhaseProgress.uploadedCount}/{currentPhaseProgress.requiredCount} Required Documents
              </span>
            </div>
            <Progress value={currentPhaseProgress.percentage} className="h-2" />
          </div>
        )}
        
        <div className="space-y-3 mt-4">
          {sortedDocuments.length > 0 ? (
            sortedDocuments.map(doc => {
              const reqDoc = requiredDocs.find(d => d.id === doc.requiredDocumentId);
              return (
                <div key={doc.requiredDocumentId} className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${doc.uploaded 
                      ? doc.approved 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600' 
                      : reqDoc?.isRequired 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 text-gray-600'}`}
                    >
                      {doc.uploaded 
                        ? doc.approved 
                          ? <CheckCircle size={16} /> 
                          : <FileText size={16} /> 
                        : reqDoc?.isRequired 
                          ? <AlertCircle size={16} /> 
                          : <FileText size={16} />}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {doc.uploaded 
                          ? doc.approved 
                            ? 'Approved' 
                            : 'Pending review' 
                          : reqDoc?.isRequired 
                            ? 'Required' 
                            : 'Optional'}
                      </div>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={doc.uploaded ? 'outline' : 'default'} size="sm">
                        {doc.uploaded ? 'Replace' : 'Upload'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Upload {doc.name}</DialogTitle>
                      </DialogHeader>
                      
                      <DocumentUploader
                        onUpload={async (file, metadata) => {
                          const result = await handleUploadDocument(file, metadata, doc.requiredDocumentId);
                          return;
                        }}
                        loading={false}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p>No documents required for this phase</p>
            </div>
          )}
        </div>
        
        {sortedDocuments.length > 0 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/buyer/documents'}
            >
              View All Documents
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}