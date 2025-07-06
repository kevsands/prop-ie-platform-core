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

interface DocumentManagerProps {
  projectId?: string;
  initialFilters?: DocumentFilterInput;
  enableUpload?: boolean;
  showStats?: boolean;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  projectId,
  initialFilters,
  enableUpload = true,
  showStats = true,
}) => {
  const [filters, setFilters] = useState<DocumentFilterInput>(initialFilters || {});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  
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
      });
      
      setIsUploadModalOpen(false);
      // Success notification could be added here
    } catch (error) {
      console.error('Failed to upload document:', error);
      // Error notification could be added here
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (key: keyof DocumentFilterInput, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
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
      {/* Stats summary */}
      {showStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Documents</h3>
            <p className="text-2xl font-bold">{stats.totalCount}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold">
              {stats.byStatus.find(s => s.status === DocumentStatus.PENDING_REVIEW)?.count || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold">
              {stats.byStatus.find(s => s.status === DocumentStatus.APPROVED)?.count || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Compliance Rate</h3>
            <p className="text-2xl font-bold">{stats.completionRate}%</p>
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
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select 
              value={filters.categories?.[0] || ''} 
              onValueChange={(value) => handleFilterChange('categories', value ? [value as DocumentCategory] : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {!isLoadingCategories && categories?.map((category) => (
                  <SelectItem key={category.id} value={category.name as DocumentCategory}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {enableUpload && (
          <Button onClick={() => setIsUploadModalOpen(true)}>
            Upload Document
          </Button>
        )}
      </div>
      
      {/* Document tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Upload modal */}
      {isUploadModalOpen && (
        <DocumentUploader
          onUpload={handleFileUpload}
          onCancel={() => setIsUploadModalOpen(false)}
          categories={categories || []}
          isUploading={isUploading}
        />
      )}
    </div>
  );
};

export default DocumentManager;