'use client';

import React, { useState, useEffect } from 'react';
import { 
  DocumentStatus, 
  DocumentType as DocType,
  DocumentCategory,
  Document
} from '@/types/document';
import { DocumentVersion } from '@/types/core/document';

// Using Document from /types/document.ts, not from /types/core/document.ts
type DocumentType = Document;
import { documentService } from '@/services/documentService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '.';
import { format } from 'date-fns';
import { 
  Download, 
  Clock, 
  FileText, 
  Tag, 
  Upload, 
  Users, 
  History, 
  Eye, 
  Edit, 
  Archive, 
  ExternalLink, 
  Share2, 
  CheckSquare 
} from 'lucide-react';
import DocumentVersionHistory from './DocumentVersionHistory';
import DocumentWorkflowView from './DocumentWorkflowView';
import DocumentPermissionsEditor from './DocumentPermissionsEditor';

interface DocumentDetailsProps {
  document: DocumentType;
  onVersionAdded?: (document: DocumentType) => void;
  onStatusChange?: (document: DocumentType) => void;
  canEdit?: boolean;
  canViewPermissions?: boolean;
  canEditPermissions?: boolean;
  canApprove?: boolean;
  canArchive?: boolean;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  document,
  onVersionAdded,
  onStatusChange,
  canEdit = true,
  canViewPermissions = true,
  canEditPermissions = false,
  canApprove = false,
  canArchive = true
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch document versions
  useEffect(() => {
    const fetchVersions = async () => {
      if (!document || !document.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await documentService.getDocumentVersions(document.id);
        
        if (result.success && result.versions) {
          setVersions(result.versions);
        } else {
          setError(result.message || 'Failed to load document versions');
        }
      } catch (err) {
        console.error('Error fetching document versions:', err);
        setError('An error occurred while loading document versions');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVersions();
  }, [document]);

  // Handle document download
  const handleDownload = () => {
    if (document?.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  // Format date for display
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'PPP');
  };

  // Handle version upload
  const handleVersionUpload = async (file: File, metadata: Partial<DocumentType>) => {
    if (!document.id) return;
    
    setIsUploading(true);
    
    try {
      const result = await documentService.uploadDocument(file, {
        ...metadata,
        isNewVersion: true,
        documentId: document.id
      });
      
      if (result.success && result.document) {
        // Refresh versions list
        const versionsResult = await documentService.getDocumentVersions(document.id);
        if (versionsResult.success && versionsResult.versions) {
          setVersions(versionsResult.versions);
        }
        
        // Close dialog
        setIsVersionDialogOpen(false);
        
        // Notify parent
        if (onVersionAdded) {
          onVersionAdded(result.document);
        }
      } else {
        setError(result.message || 'Failed to upload new version');
      }
    } catch (err) {
      console.error('Error uploading new version:', err);
      setError('An error occurred while uploading new version');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle document approval
  const handleApprove = async () => {
    if (!document.id) return;
    
    try {
      // Assume we have a current workflow instance for simplicity
      // In a real implementation, would need to get active workflow instance first
      if (document.workflow?.id) {
        const result = await documentService.approveWorkflowStage(
          document.id, 
          document.workflow.id
        );
        
        if (result.success) {
          // Update document status
          const updatedDocument = await documentService.updateDocument(document.id, {
            status: DocumentStatus.APPROVED
          });
          
          if (onStatusChange) {
            onStatusChange(updatedDocument);
          }
        } else {
          setError(result.message || 'Failed to approve document');
        }
      } else {
        // Simple status update for documents without workflow
        const updatedDocument = await documentService.updateDocument(document.id, {
          status: DocumentStatus.APPROVED
        });
        
        if (onStatusChange) {
          onStatusChange(updatedDocument);
        }
      }
    } catch (err) {
      console.error('Error approving document:', err);
      setError('An error occurred while approving document');
    }
  };

  // Handle document archiving
  const handleArchive = async () => {
    if (!document.id) return;
    
    try {
      const result = await documentService.deleteDocument(document.id, true);
      
      if (result.success) {
        // Update document status
        const updatedDocument = await documentService.updateDocument(document.id, {
          status: DocumentStatus.ARCHIVED
        });
        
        if (onStatusChange) {
          onStatusChange(updatedDocument);
        }
      } else {
        setError(result.message || 'Failed to archive document');
      }
    } catch (err) {
      console.error('Error archiving document:', err);
      setError('An error occurred while archiving document');
    }
  };

  // Status badge color
  const getStatusColor = (status: DocumentStatus | string) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case DocumentStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case DocumentStatus.PENDING_REVIEW:
        return 'bg-blue-100 text-blue-800';
      case DocumentStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case DocumentStatus.EXPIRED:
      case DocumentStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{document.name}</CardTitle>
            <CardDescription className="mt-1">
              {document.description || 'No description provided'}
            </CardDescription>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className={getStatusColor(document.status)}>
                {document.status}
              </Badge>
              <Badge variant="outline">
                {document.type}
              </Badge>
              <Badge variant="outline">
                {document.category}
              </Badge>
              {document.signatureRequired && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  Signature Required
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="mr-1 h-4 w-4" />
              Download
            </Button>
            
            {canEdit && (
              <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Upload className="mr-1 h-4 w-4" />
                    New Version
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Upload New Version</DialogTitle>
                  </DialogHeader>
                  <DocumentUploader
                    onUpload={handleVersionUpload}
                    loading={isUploading}
                    existingDocument={document}
                    isVersionUpload={true}
                  />
                </DialogContent>
              </Dialog>
            )}
            
            {canApprove && document.status !== DocumentStatus.APPROVED && (
              <Button size="sm" variant="default" onClick={handleApprove}>
                <CheckSquare className="mr-1 h-4 w-4" />
                Approve
              </Button>
            )}
            
            {canArchive && document.status !== DocumentStatus.ARCHIVED && (
              <Button size="sm" variant="secondary" onClick={handleArchive}>
                <Archive className="mr-1 h-4 w-4" />
                Archive
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">
              <FileText className="mr-1 h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="versions">
              <History className="mr-1 h-4 w-4" />
              Versions
            </TabsTrigger>
            {document.workflow && (
              <TabsTrigger value="workflow">
                <CheckSquare className="mr-1 h-4 w-4" />
                Workflow
              </TabsTrigger>
            )}
            {canViewPermissions && (
              <TabsTrigger value="permissions">
                <Users className="mr-1 h-4 w-4" />
                Permissions
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="details" className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">File Details</h3>
                  <div className="text-sm space-y-2 ml-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{document.fileType || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{document.fileSize ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span>{document.version || 1}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Timeline</h3>
                  <div className="text-sm space-y-2 ml-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{formatDate(document.uploadDate)}</span>
                    </div>
                    {document.lastModified && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Modified:</span>
                        <span>{formatDate(document.lastModified)}</span>
                      </div>
                    )}
                    {document.expiryDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{formatDate(document.expiryDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {document.tags && document.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Tags</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {document.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-y-4">
                {document.relatedTo && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Related To</h3>
                    <Card className="bg-muted/30">
                      <CardContent className="p-3">
                        <div className="flex items-center">
                          <div>
                            <p className="text-sm font-medium">{document.relatedTo.name || document.relatedTo.id}</p>
                            <p className="text-xs text-muted-foreground">{document.relatedTo.type}</p>
                          </div>
                          {document.relatedTo.url && (
                            <Button size="sm" variant="ghost" className="ml-auto" asChild>
                              <a href={document.relatedTo.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Uploaded By</h3>
                  <Card className="bg-muted/30">
                    <CardContent className="p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{document.uploadedByName || 'Unknown User'}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(document.uploadDate)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {document.workflow && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Current Workflow</h3>
                    <Card className="bg-muted/30">
                      <CardContent className="p-3">
                        <div className="flex items-center">
                          <div>
                            <p className="text-sm font-medium">{document.workflow.currentStage?.name || 'In Progress'}</p>
                            <p className="text-xs text-muted-foreground">Started {document.workflow.startDate && formatDate(document.workflow.startDate)}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setActiveTab('workflow')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Metadata - shown if exists */}
                {document.metadata && Object.keys(document.metadata).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Additional Metadata</h3>
                    <Card className="bg-muted/30">
                      <CardContent className="p-3">
                        <div className="space-y-1">
                          {Object.entries(document.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{key}:</span>
                              <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="versions" className="pt-2">
            <DocumentVersionHistory 
              document={document} 
              versions={versions} 
              isLoading={isLoading} 
              error={error}
            />
          </TabsContent>
          
          {document.workflow && (
            <TabsContent value="workflow" className="pt-2">
              <DocumentWorkflowView 
                document={document} 
                workflowInstance={document.workflow} 
              />
            </TabsContent>
          )}
          
          {canViewPermissions && (
            <TabsContent value="permissions" className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Document Permissions</h3>
                {canEditPermissions && (
                  <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-4 w-4" />
                        Edit Permissions
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Edit Document Permissions</DialogTitle>
                      </DialogHeader>
                      <DocumentPermissionsEditor 
                        document={document} 
                        onSave={() => setIsPermissionsDialogOpen(false)} 
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Visibility</Label>
                      <div className="mt-1 p-2 border rounded-md">
                        {document.permissions?.isPublic ? (
                          <p className="text-sm flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Public - Visible to all users
                          </p>
                        ) : (
                          <p className="text-sm flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Restricted - Only specific users have access
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Sensitivity Level</Label>
                      <div className="mt-1 p-2 border rounded-md">
                        <p className="text-sm">
                          {document.permissions?.sensitivity === 'low' && 'Low - General information'}
                          {document.permissions?.sensitivity === 'standard' && 'Standard - Business use'}
                          {document.permissions?.sensitivity === 'confidential' && 'Confidential - Restricted access'}
                          {!document.permissions?.sensitivity && 'Standard'}
                        </p>
                      </div>
                    </div>
                    
                    {/* User Permissions */}
                    <div>
                      <Label className="text-sm">User Access</Label>
                      <div className="mt-1 border rounded-md divide-y">
                        {/* View Access */}
                        <div className="p-2">
                          <p className="text-sm font-medium">Can View</p>
                          {document.permissions?.canView && document.permissions.canView.length > 0 ? (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {document.permissions.canView.map((user: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-blue-50">
                                  {user}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No specific users</p>
                          )}
                        </div>
                        
                        {/* Edit Access */}
                        <div className="p-2">
                          <p className="text-sm font-medium">Can Edit</p>
                          {document.permissions?.canEdit && document.permissions.canEdit.length > 0 ? (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {document.permissions.canEdit.map((user: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-green-50">
                                  {user}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No specific users</p>
                          )}
                        </div>
                        
                        {/* Share Access */}
                        <div className="p-2">
                          <p className="text-sm font-medium">Can Share</p>
                          {document.permissions?.canShare && document.permissions.canShare.length > 0 ? (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {document.permissions.canShare.map((user: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-purple-50">
                                  {user}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No specific users</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-6">
        <div className="text-xs text-muted-foreground">
          <Clock className="inline-block mr-1 h-3 w-3" />
          Last updated: {document.lastModified ? formatDate(document.lastModified) : formatDate(document.uploadDate)}
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
          
          {canEditPermissions && (
            <Button size="sm" variant="ghost" onClick={() => setIsPermissionsDialogOpen(true)}>
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentDetails;