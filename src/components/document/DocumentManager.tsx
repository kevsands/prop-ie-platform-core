'use client';

import React, { useState } from 'react';
import { useDocuments, useDocumentCategories, useDocumentStats, useDocumentUpload, DocumentFilterInput, DocumentCategory, DocumentStatus } from '../../hooks/useDocuments';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { LoadingSpinner } from '../ui/spinner';
import DocumentList from './DocumentList';
import DocumentUploader from './DocumentUploader';
import SLPGenerator from './SLPGenerator';
import DocumentViewer from './DocumentViewer';
import DocumentIntegrations from './DocumentIntegrations';
import DocumentSecurity from './DocumentSecurity';
import { Badge } from '../ui/badge';
import { 
  FileText, 
  Upload, 
  Package, 
  Shield, 
  FolderOpen,
  Search,
  Filter as FilterIcon,
  Settings
} from 'lucide-react';

interface DocumentManagerProps {
  projectId?: string;
  initialFilters?: DocumentFilterInput;
  enableUpload?: boolean;
  showStats?: boolean;
  enableSLP?: boolean;
  enableSecurity?: boolean;
  enableIntegrations?: boolean;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  projectId,
  initialFilters,
  enableUpload = true,
  showStats = true,
  enableSLP = true,
  enableSecurity = true,
  enableIntegrations = true}) => {
  const [filterssetFilters] = useState<DocumentFilterInput>(initialFilters || {});
  const [isUploadModalOpensetIsUploadModalOpen] = useState(false);
  const [activeTabsetActiveTab] = useState<string>('all');
  const [isSLPGeneratorOpensetIsSLPGeneratorOpen] = useState(false);
  const [selectedDocumentsetSelectedDocument] = useState<any>(null);
  const [isViewerOpensetIsViewerOpen] = useState(false);
  const [selectedDocumentssetSelectedDocuments] = useState<Set<string>>(new Set());
  const [showSecurityPanelsetShowSecurityPanel] = useState(false);

  // Fetch document data
  const { 
    data: documentsData, 
    isLoading: isLoadingDocuments, 
    error: documentsError 
  } = useDocuments(
    { ...filters, ...(projectId ? { developmentId: projectId } : {}) }
  );

  // Fetch categories
  const { 
    data: categories, 
    isLoading: isLoadingCategories 
  } = useDocumentCategories(projectId);

  // Fetch stats if enabled
  const { 
    data: stats, 
    isLoading: isLoadingStats 
  } = useDocumentStats(projectId && showStats ? projectId : undefined);

  // Setup document upload
  const { uploadDocument, isLoading: isUploading } = useDocumentUpload();

  // Handle file upload
  const handleFileUpload = async (file: File, metadata: any) => {
    try {
      await uploadDocument(file, {
        name: metadata.name || file.name,
        description: metadata.description,
        type: file.type.split('/')[1] || 'document',
        category: metadata.category,
        tags: metadata.tags,
        developmentId: projectId,
        ...(metadata.expiryDate ? { expiryDate: metadata.expiryDate } : {}),
        signatureRequired: metadata.signatureRequired || false,
        ocrText: metadata.ocrText,
        ocrConfidence: metadata.ocrConfidence,
        virusScanStatus: metadata.virusScanStatus,
        enableWatermark: metadata.enableWatermark});

      setIsUploadModalOpen(false);
      // Success notification could be added here
    } catch (error) {

      // Error notification could be added here
    }
  };

  // Handle SLP generation
  const handleSLPGenerate = async (slpData: any) => {
    try {
      // Call API to generate SLP
      const response = await fetch('/api/documents/generate-slp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slpData)
      });

      if (response.ok) {
        setIsSLPGeneratorOpen(false);
        // Refresh documents list
        // Success notification
      }
    } catch (error) {

    }
  };

  // Handle document selection for bulk operations
  const toggleDocumentSelection = (documentId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(documentId)) {
      newSelection.delete(documentId);
    } else {
      newSelection.add(documentId);
    }
    setSelectedDocuments(newSelection);
  };

  // Get property data for SLP (mock data)
  const propertyData = {
    id: projectId || '1',
    address: '123 Main Street, Dublin 2',
    eircode: 'D02 XY45',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    berRating: 'A2',
    yearBuilt: 2022,
    developmentId: projectId
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof DocumentFilterInput, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value}));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Update filters based on tab
    if (value === 'all') {
      setFilters(prev => ({ ...prev, status: undefined }));
    } else if (value === 'pending') {
      setFilters(prev => ({ ...prev, status: [DocumentStatus.PENDING_REVIEW] }));
    } else if (value === 'approved') {
      setFilters(prev => ({ ...prev, status: [DocumentStatus.APPROVED] }));
    } else if (value === 'rejected') {
      setFilters(prev => ({ ...prev, status: [DocumentStatus.REJECTED] }));
    }
  };

  // Render error state
  if (documentsError) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          <p>Failed to load documents. Please try again later.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stats summary */}
      {showStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Documents</h3>
            <p className="text-2xl font-bold">{stats.totalCount}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold">
              {stats.byStatus.find(s: any => s.status === DocumentStatus.PENDING_REVIEW)?.count || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold">
              {stats.byStatus.find(s: any => s.status === DocumentStatus.APPROVED)?.count || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Compliance Rate</h3>
            <p className="text-2xl font-bold">{stats.completionRate}%</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Secured</h3>
            <p className="text-2xl font-bold flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              {Math.round((stats.totalCount * 0.85))} / {stats.totalCount}
            </p>
          </Card>
        </div>
      )}

      {/* Filters and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input 
              placeholder="Search documents..." 
              value={filters.search || ''} 
              onChange={(e: any) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select 
              value={filters.categories?.[0] || ''} 
              onValueChange={(value: any) => handleFilterChange('categories', value ? [value as DocumentCategory] : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {!isLoadingCategories && categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.name as DocumentCategory}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-2">
          {enableUpload && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          )}
          {enableSLP && (
            <Button 
              variant="outline" 
              onClick={() => setIsSLPGeneratorOpen(true)}
            >
              <Package className="mr-2 h-4 w-4" />
              Generate SLP
            </Button>
          )}
          {enableSecurity && (
            <Button 
              variant="outline" 
              onClick={() => setShowSecurityPanel(!showSecurityPanel)}
            >
              <Shield className="mr-2 h-4 w-4" />
              Security
            </Button>
          )}
        </div>
      </div>

      {/* Document tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="pt-4">
          {isLoadingDocuments ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <DocumentList 
              documents={documentsData?.items || []} 
              totalCount={documentsData?.totalCount || 0}
              selectedDocuments={selectedDocuments}
              onDocumentSelect={toggleDocumentSelection}
              onDocumentView={(doc: any) => {
                setSelectedDocument(doc);
                setIsViewerOpen(true);
              }
            />
          )}
        </TabsContent>

        <TabsContent value="integrations" className="pt-4">
          {enableIntegrations && (
            <DocumentIntegrations
              selectedDocuments={
                documentsData?.items.filter(doc => selectedDocuments.has(doc.id)) || []
              }
              onOperationComplete={() => {
                // Refresh documents
                setSelectedDocuments(new Set());
              }
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Security Panel */}
      {showSecurityPanel && enableSecurity && (
        <DocumentSecurity
          document={selectedDocument}
          onSecurityUpdate={(settings: any) => {

          }
        />
      )}

      {/* Upload modal */}
      {isUploadModalOpen && (
        <DocumentUploader
          onUpload={handleFileUpload}
          onCancel={() => setIsUploadModalOpen(false)}
          categories={categories || []}
          isUploading={isUploading}
          enableVirusScan={true}
          enableOCR={true}
          enableWatermark={false}
        />
      )}

      {/* SLP Generator */}
      {isSLPGeneratorOpen && (
        <SLPGenerator
          propertyData={propertyData}
          existingDocuments={documentsData?.items || []}
          onGenerate={handleSLPGenerate}
          onClose={() => setIsSLPGeneratorOpen(false)}
        />
      )}

      {/* Document Viewer */}
      {isViewerOpen && selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedDocument(null);
          }
          onSave={async (annotations: any) => {

            // Save annotations to API
          }
          enableAnnotations={true}
          enableWatermark={true}
          enableDownloadProtection={selectedDocument.category === 'CONFIDENTIAL'}
        />
      )}
    </div>
  );
};

export default DocumentManager;