'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/graphql/client';
import { 
  useDocuments, 
  useDocumentById, 
  useDocumentCategories,
  useDocumentStats,
  useCreateDocument,
  useUpdateDocument,
  useChangeDocumentStatus,
  useArchiveDocument,
  DocumentStatus,
  DocumentFilterInput
} from '@/hooks/useDocuments';

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * This is an example component that demonstrates how to use the GraphQL document hooks
 * to fetch and modify documents.
 * 
 * Key features demonstrated:
 * - Using React Query with GraphQL
 * - Fetching data with custom hooks
 * - Handling loading, error, and empty states
 * - Form handling with mutations
 * - Data filtering
 */
export function DocumentGraphQLExample() {
  const [projectIdsetProjectId] = useState<string | null>(null);
  const [selectedDocumentIdsetSelectedDocumentId] = useState<string | null>(null);
  const [filterssetFilters] = useState<DocumentFilterInput>({});
  
  // Example query hooks
  const { 
    data: documents, 
    isLoading: isLoadingDocuments, 
    error: documentsError 
  } = useDocuments(filters);
  
  const {
    data: documentDetails,
    isLoading: isLoadingDocumentDetails
  } = useDocumentById(selectedDocumentId || undefined);
  
  const { 
    data: categories 
  } = useDocumentCategories(projectId || undefined);
  
  const {
    data: documentStats
  } = useDocumentStats(projectId || undefined);
  
  // Example mutation hooks
  const createDocumentMutation = useCreateDocument();
  const updateDocumentMutation = useUpdateDocument();
  const changeStatusMutation = useChangeDocumentStatus();
  const archiveDocumentMutation = useArchiveDocument();
  
  // Handle status change for a document
  const handleStatusChange = async (documentId: string, newStatus: DocumentStatus) => {
    try {
      await changeStatusMutation.mutateAsync({ id: documentId, status: newStatus });
      console.log(`Document status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };
  
  // Handle document archive
  const handleArchiveDocument = async (documentId: string) => {
    try {
      await archiveDocumentMutation.mutateAsync(documentId);
      console.log('Document archived successfully');
    } catch (error) {
      console.error('Error archiving document:', error);
    }
  };
  
  // Show document details when clicked
  const handleViewDocument = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };
  
  // Clear document details view
  const handleCloseDetails = () => {
    setSelectedDocumentId(null);
  };
  
  // Render loading state
  if (isLoadingDocuments) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p>Loading documents...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (documentsError) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center text-red-500">
            <p>Error loading documents</p>
            <Button variant="outline" className="mt-4">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Management with GraphQL</CardTitle>
          <CardDescription>
            Example implementation using custom GraphQL hooks
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Project</label>
            <Select 
              value={projectId || ''} 
              onValueChange={(value: any) => setProjectId(value || null)}
            >
              <SelectTrigger className="w-full md:w-72">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Projects</SelectItem>
                <SelectItem value="project-1">Fitzgerald Gardens</SelectItem>
                <SelectItem value="project-2">Riverside Manor</SelectItem>
                <SelectItem value="project-3">Ballymakenny View</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Filter by Status</label>
            <Select 
              value={filters.status?.[0] || ''} 
              onValueChange={(value: any) => {
                setFilters(prev => ({
                  ...prev,
                  status: value ? [value as DocumentStatus] : undefined
                }));
              }
            >
              <SelectTrigger className="w-full md:w-72">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value={DocumentStatus.DRAFT}>Draft</SelectItem>
                <SelectItem value={DocumentStatus.PENDING_REVIEW}>Pending Review</SelectItem>
                <SelectItem value={DocumentStatus.APPROVED}>Approved</SelectItem>
                <SelectItem value={DocumentStatus.REJECTED}>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Search</label>
            <Input 
              placeholder="Search documents..." 
              value={filters.search || ''} 
              onChange={(e: any) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          {/* Document list example */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Documents</h3>
            {documents?.items?.length ? (
              <div className="space-y-4">
                {documents.items.map((doc: any) => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-500">{doc.fileType}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDocument(doc.id)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusChange(doc.id, DocumentStatus.APPROVED)}
                          disabled={doc.status === DocumentStatus.APPROVED}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleArchiveDocument(doc.id)}
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">
                No documents found. Try adjusting your filters.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Document details modal */}
      {selectedDocumentId && (
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
          </CardHeader>
          
          <CardContent>
            {isLoadingDocumentDetails ? (
              <p>Loading details...</p>
            ) : documentDetails ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p>{documentDetails.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p>{documentDetails.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Uploaded By</h3>
                  <p>{documentDetails.uploadedBy.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">File Type</h3>
                  <p>{documentDetails.fileType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">File Size</h3>
                  <p>{documentDetails.fileSize} bytes</p>
                </div>
                {documentDetails.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p>{documentDetails.description}</p>
                  </div>
                )}
                {documentDetails.tags && documentDetails.tags.length> 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {documentDetails.tags.map((tag: any, index: any) => (
                        <span 
                          key={index: any} 
                          className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                        >
                          {tag: any}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>Document not found</p>
            )}
          </CardContent>
          
          <CardFooter>
            <Button onClick={handleCloseDetails}>Close</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

/**
 * Wrapper component that provides the React Query context
 */
export default function DocumentGraphQLIntegrationExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <DocumentGraphQLExample />
    </QueryClientProvider>
  );
}