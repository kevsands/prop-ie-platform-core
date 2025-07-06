'use client';

import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Upload, Download, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Document as DocumentType, DocumentType as DocType } from '@/types/document';
import { useBuyerDocuments } from '@/context/BuyerDocumentContext';
import { RequiredDocument, BuyerDocumentCategory } from '@/types/buyer-documents';
import { BuyerPhase } from '@/types/buyer-journey';
import DocumentList from '@/components/documents/DocumentList';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { useBuyerJourney } from '@/hooks/useBuyerJourney';

interface RequiredDocumentCardProps {
  document: RequiredDocument;
  uploadStatus: {
    uploaded: boolean;
    approved: boolean;
    documentId?: string;
    fileUrl?: string;
  };
  onUpload: () => void;
}

const RequiredDocumentCard: React.FC<RequiredDocumentCardProps> = ({ 
  document, 
  uploadStatus, 
  onUpload 
}) => {
  return (
    <Card className="overflow-hidden">
      <div className={`h-1.5 ${
        uploadStatus.approved 
          ? 'bg-green-500' 
          : uploadStatus.uploaded 
            ? 'bg-yellow-500' 
            : document.isRequired 
              ? 'bg-red-500' 
              : 'bg-gray-300'
      }`} />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{document.name}</CardTitle>
          {uploadStatus.uploaded && (
            uploadStatus.approved 
              ? <CheckCircle2 className="h-5 w-5 text-green-500" /> 
              : <Clock className="h-5 w-5 text-yellow-500" />
          )}
        </div>
        <CardDescription className="text-xs">{document.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm mb-3">
          {document.isRequired 
            ? <span className="font-semibold text-red-500">Required</span> 
            : <span className="text-gray-500">Optional</span>
          }
          {document.helpText && (
            <p className="text-xs text-gray-500 mt-1">{document.helpText}</p>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          {uploadStatus.uploaded ? (
            <>
              <Button
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={() => {
                  if (uploadStatus.fileUrl) {
                    window.open(uploadStatus.fileUrl, '_blank');
                  }
                }}
              >
                <Download className="h-4 w-4 mr-1" /> View Document
              </Button>
              {!uploadStatus.approved && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-shrink-0">Replace</Button>
                  </DialogTrigger>
                  <DocumentUploadDialog document={document} />
                </Dialog>
              )}
            </>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full">
                  <Upload className="h-4 w-4 mr-1" /> Upload Document
                </Button>
              </DialogTrigger>
              <DocumentUploadDialog document={document} />
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface DocumentUploadDialogProps {
  document: RequiredDocument;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ document }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { uploadDocument, refreshDocuments } = useBuyerDocuments();
  
  const handleUpload = async (file: File, metadata: any) => {
    setUploading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await uploadDocument(file, {
        requiredDocumentId: document.id,
        name: document.name,
        description: document.description,
        type: document.type
      });
      
      if (result.success) {
        setSuccess(true);
        await refreshDocuments();
      } else {
        setError(result.message || 'Failed to upload document');
      }
    } catch (err) {
      setError('An error occurred during upload');
      console.error('Error in document upload:', err);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Upload {document.name}</DialogTitle>
      </DialogHeader>
      
      {success ? (
        <div className="py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Document Uploaded Successfully</h3>
          <p className="text-gray-500 mt-2">Your document has been submitted and is now pending review.</p>
          <Button className="mt-4" onClick={() => setSuccess(false)}>Upload Another Document</Button>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-start mb-4">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div className="mb-4">
            <h3 className="font-medium">Document Requirements:</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 mt-1 space-y-1">
              <li>File must be a PDF, image, or Microsoft Office document</li>
              <li>Maximum file size: 10MB</li>
              <li>Document must be clearly legible</li>
              {document.helpText && <li>{document.helpText}</li>}
            </ul>
          </div>
          
          <DocumentUploader
            onUpload={handleUpload}
            loading={uploading}
          />
        </>
      )}
    </DialogContent>
  );
};

interface PhaseDocumentsTabProps {
  phase: BuyerPhase | 'ALL';
  phaseLabel: string;
  progress: number;
}

const PhaseDocumentsTab: React.FC<PhaseDocumentsTabProps> = ({ 
  phase, 
  phaseLabel, 
  progress 
}) => {
  const { 
    documentStatuses, 
    getPhaseDocuments, 
    requiredDocuments,
    loading,
    error,
    refreshDocuments
  } = useBuyerDocuments();
  
  const { journey } = useBuyerJourney();
  
  // Get documents for this phase or all documents
  const documents = phase === 'ALL' 
    ? getPhaseDocuments(journey?.currentPhase || BuyerPhase.PLANNING)
    : getPhaseDocuments(phase);
  
  // Get required documents and their statuses for this phase
  const phaseRequiredDocs = phase === 'ALL'
    ? requiredDocuments
    : requiredDocuments.filter(doc => 
        doc.requiredByPhase === phase as unknown as BuyerDocumentCategory
      );
  
  const handleDeleteDocument = async (id: string) => {
    // Document deletion logic
    await refreshDocuments();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{phaseLabel} Documents</h3>
          <span className="text-sm text-gray-500">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {phaseRequiredDocs.map(doc => {
          const status = documentStatuses.find(
            status => status.requiredDocumentId === doc.id
          );
          
          return (
            <RequiredDocumentCard
              key={doc.id}
              document={doc}
              uploadStatus={{
                uploaded: status?.uploaded || false,
                approved: status?.approved || false,
                documentId: status?.documentId,
                fileUrl: status?.fileUrl
              }}
              onUpload={() => {}}
            />
          );
        })}
      </div>
      
      <h3 className="text-lg font-medium mt-8">Uploaded Documents</h3>
      <DocumentList
        documents={documents}
        loading={loading}
        error={error}
        onDelete={handleDeleteDocument}
        emptyMessage="No documents have been uploaded yet"
      />
    </div>
  );
};

interface BuyerDocumentRepositoryProps {
  initialPhase?: BuyerPhase;
}

const BuyerDocumentRepository: React.FC<BuyerDocumentRepositoryProps> = ({ 
  initialPhase 
}) => {
  const { phaseProgress, overallProgress, loading } = useBuyerDocuments();
  const { journey } = useBuyerJourney();
  
  const currentPhase = journey?.currentPhase || BuyerPhase.PLANNING;
  const [activeTab, setActiveTab] = useState<string>(initialPhase || currentPhase);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Helper to get display name for phase
  const getPhaseDisplayName = (phase: BuyerPhase): string => {
    return phase.charAt(0) + phase.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>
            Upload and manage all documents required for your home buying journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">Overall Progress</h3>
              <span className="text-sm font-medium">{overallProgress}% Complete</span>
            </div>
            <Progress value={overallProgress} className="h-2.5" />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 mb-4">
          <TabsTrigger value={currentPhase}>
            Current Phase
          </TabsTrigger>
          <TabsTrigger value={BuyerPhase.PLANNING}>Planning</TabsTrigger>
          <TabsTrigger value={BuyerPhase.FINANCING}>Financing</TabsTrigger>
          <TabsTrigger value={BuyerPhase.LEGAL_PROCESS}>Legal</TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentPhase}>
          <PhaseDocumentsTab 
            phase="ALL"
            phaseLabel={`Current: ${getPhaseDisplayName(currentPhase)}`}
            progress={phaseProgress[currentPhase]?.percentage || 0}
          />
        </TabsContent>
        
        <TabsContent value={BuyerPhase.PLANNING}>
          <PhaseDocumentsTab 
            phase={BuyerPhase.PLANNING}
            phaseLabel="Planning"
            progress={phaseProgress[BuyerPhase.PLANNING]?.percentage || 0}
          />
        </TabsContent>
        
        <TabsContent value={BuyerPhase.FINANCING}>
          <PhaseDocumentsTab 
            phase={BuyerPhase.FINANCING}
            phaseLabel="Financing"
            progress={phaseProgress[BuyerPhase.FINANCING]?.percentage || 0}
          />
        </TabsContent>
        
        <TabsContent value={BuyerPhase.LEGAL_PROCESS}>
          <PhaseDocumentsTab 
            phase={BuyerPhase.LEGAL_PROCESS}
            phaseLabel="Legal Process"
            progress={phaseProgress[BuyerPhase.LEGAL_PROCESS]?.percentage || 0}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerDocumentRepository;