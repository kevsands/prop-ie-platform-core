'use client';

import React, { useState, useCallback } from 'react';
import { Transaction, TransactionDocument } from '@/context/TransactionContext';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  FileTextIcon,
  UploadIcon,
  DownloadIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  MoreVerticalIcon,
  FileIcon,
  FolderIcon,
  ClockIcon,
  ShieldCheckIcon,
  FilterIcon,
  SearchIcon,
  ShareIcon,
  TrashIcon
} from 'lucide-react';

interface DocumentCenterProps {
  transaction: Transaction;
  userRole?: string;
  className?: string;
}

type DocumentCategory = 'CONTRACT' | 'MORTGAGE' | 'SURVEY' | 'TITLE' | 'OTHER';
type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface UploadingFile {
  id: string;
  file: File;
  category: DocumentCategory;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({ 
  transaction, 
  userRole,
  className = "" 
}) => {
  const { user } = useAuth();
  const { addDocument } = useTransaction();
  const { toast } = useToast();

  const [isUploadDialogOpensetIsUploadDialogOpen] = useState(false);
  const [selectedCategorysetSelectedCategory] = useState<DocumentCategory>('CONTRACT');
  const [searchQuerysetSearchQuery] = useState('');
  const [filterCategorysetFilterCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [filterStatussetFilterStatus] = useState<DocumentStatus | 'ALL'>('ALL');
  const [uploadingFilessetUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActivesetDragActive] = useState(false);

  // Document categories configuration
  const documentCategories = {
    CONTRACT: { label: 'Contracts', icon: <FileTextIcon className="h-4 w-4" />, color: 'blue' },
    MORTGAGE: { label: 'Mortgage', icon: <FileIcon className="h-4 w-4" />, color: 'green' },
    SURVEY: { label: 'Survey', icon: <FolderIcon className="h-4 w-4" />, color: 'purple' },
    TITLE: { label: 'Title', icon: <ShieldCheckIcon className="h-4 w-4" />, color: 'orange' },
    OTHER: { label: 'Other', icon: <FileIcon className="h-4 w-4" />, color: 'gray' }
  };

  // Check if user can manage documents
  const canManageDocuments = () => {
    if (!user || !userRole) return false;
    // All participants can upload documents, but approval depends on role
    return true;
  };

  // Check if user can approve/reject documents
  const canApproveDocuments = () => {
    if (!user || !userRole) return false;
    return ['BUYER_SOLICITOR', 'VENDOR_SOLICITOR', 'DEVELOPER'].includes(userRole);
  };

  // Filter documents based on search and filters
  const filteredDocuments = transaction.documents.filter(doc => {
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterCategory !== 'ALL' && doc.category !== filterCategory) {
      return false;
    }
    if (filterStatus !== 'ALL' && doc.status !== filterStatus) {
      return false;
    }
    // Check if user has access to this document
    if (doc.visibleTo && !doc.visibleTo.includes(user!.id)) {
      return false;
    }
    return true;
  });

  // Group documents by category
  const groupedDocuments = filteredDocuments.reduce((accdoc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<DocumentCategory, TransactionDocument[]>);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Validate files
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const validFiles = fileArray.filter(file => {
      if (file.size> maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    // Create upload entries
    const newUploads: UploadingFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(29),
      file,
      category: selectedCategory,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploads]);

    // Upload files
    for (const upload of newUploads) {
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadingFiles(prev => 
            prev.map(u => 
              u.id === upload.id && u.progress <90
                ? { ...u, progress: u.progress + 10 }
                : u
            )
          );
        }, 200);

        // Upload file
        await addDocument(transaction.id, upload.file, {
          name: upload.file.name,
          category: upload.category,
          type: upload.file.type,
          visibleTo: [user!.id] // Default to uploader only, can be changed later
        });

        clearInterval(progressInterval);

        // Mark as completed
        setUploadingFiles(prev => 
          prev.map(u => 
            u.id === upload.id 
              ? { ...u, progress: 100, status: 'completed' }
              : u
          )
        );

        toast({
          title: "Success",
          description: `${upload.file.name} uploaded successfully`});

        // Remove from uploading list after a delay
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(u => u.id !== upload.id));
        }, 2000);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${upload.file.name}`,
          variant: "destructive"
        });

        setUploadingFiles(prev => 
          prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'error' }
              : u
          )
        );
      }
    }
  }, [selectedCategory, user, transaction.id, addDocumenttoast]);

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Handle document actions
  const handleDocumentAction = async (documentId: string, action: 'approve' | 'reject' | 'download' | 'share') => {
    const document = transaction.documents.find(d => d.id === documentId);
    if (!document) return;

    switch (action) {
      case 'approve':
      case 'reject':
        // TODO: Implement document approval/rejection
        toast({
          title: "Success",
          description: `Document ${action}d successfully`});
        break;

      case 'download':
        // TODO: Implement document download
        window.open(document.url, '_blank');
        break;

      case 'share':
        // TODO: Implement document sharing
        toast({
          title: "Coming soon",
          description: "Document sharing will be available soon");
        break;
    }
  };

  // Get document stats
  const documentStats = {
    total: transaction.documents.length,
    pending: transaction.documents.filter(d => d.status === 'PENDING').length,
    approved: transaction.documents.filter(d => d.status === 'APPROVED').length,
    rejected: transaction.documents.filter(d => d.status === 'REJECTED').length
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Document Center
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Document Stats */}
            <div className="flex items-center gap-4 mr-4">
              <div className="text-sm">
                <span className="text-gray-500">Total:</span>
                <span className="ml-1 font-medium">{documentStats.total}</span>
              </div>
              {documentStats.pending> 0 && (
                <div className="text-sm">
                  <span className="text-yellow-600">Pending:</span>
                  <span className="ml-1 font-medium">{documentStats.pending}</span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {canManageDocuments() && (
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Upload Documents</DialogTitle>
                    <DialogDescription>
                      Upload documents related to this transaction. Supported formats: PDF, JPEG, PNG, DOC, DOCX (Max 10MB)
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    {/* Category Selection */}
                    <div className="grid gap-2">
                      <Label>Document Category</Label>
                      <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as DocumentCategory)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(documentCategories).map(([keyconfig]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                {config.icon}
                                {config.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* File Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <UploadIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Support for PDF, JPEG, PNG, DOC, DOCX (Max 10MB)
                      </p>
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <Label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer">
                          Browse Files
                        </Button>
                      </Label>
                    </div>

                    {/* Upload Progress */}
                    {uploadingFiles.length> 0 && (
                      <div className="space-y-2">
                        <Label>Uploading Files</Label>
                        {uploadingFiles.map(upload => (
                          <div key={upload.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{upload.file.name}</span>
                              {upload.status === 'completed' && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                              {upload.status === 'error' && <XCircleIcon className="h-4 w-4 text-red-500" />}
                            </div>
                            <Progress value={upload.progress} className="h-2" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as DocumentCategory | 'ALL')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {Object.entries(documentCategories).map(([keyconfig]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    {config.icon}
                    {config.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as DocumentStatus | 'ALL')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Documents List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            {Object.entries(documentCategories).map(([keyconfig]) => (
              <TabsTrigger key={key} value={key}>
                {config.label}
                {groupedDocuments[key as DocumentCategory]?.length> 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {groupedDocuments[key as DocumentCategory].length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileTextIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No documents found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((document) => (
                  <DocumentItem
                    key={document.id}
                    document={document}
                    userRole={userRole}
                    canApprove={canApproveDocuments()}
                    onAction={handleDocumentAction}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {Object.entries(documentCategories).map(([keyconfig]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {(!groupedDocuments[key as DocumentCategory] || groupedDocuments[key as DocumentCategory].length === 0) ? (
                <div className="text-center py-8">
                  {config.icon}
                  <p className="text-gray-500 mt-2">No {config.label.toLowerCase()} documents</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groupedDocuments[key as DocumentCategory].map((document) => (
                    <DocumentItem
                      key={document.id}
                      document={document}
                      userRole={userRole}
                      canApprove={canApproveDocuments()}
                      onAction={handleDocumentAction}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Document Item Component
interface DocumentItemProps {
  document: TransactionDocument;
  userRole?: string;
  canApprove: boolean;
  onAction: (documentId: string, action: 'approve' | 'reject' | 'download' | 'share') => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, userRole, canApprove, onAction }) => {
  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50';
      case 'REJECTED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <FileTextIcon className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{document.name}</p>
            <Badge className={`text-xs ${getStatusColor(document.status)}`}>
              {document.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Uploaded by {document.uploadedBy}</span>
            <span>•</span>
            <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{document.category}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAction(document.id, 'download')}
        >
          <DownloadIcon className="h-4 w-4" />
        </Button>

        {document.status === 'PENDING' && canApprove && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction(document.id, 'approve')}
              className="text-green-600 hover:text-green-700"
            >
              <CheckCircleIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction(document.id, 'reject')}
              className="text-red-600 hover:text-red-700"
            >
              <XCircleIcon className="h-4 w-4" />
            </Button>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction(document.id, 'download')}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(document.id, 'share')}>
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            {canApprove && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onAction(document.id, 'approve')}
                  className="text-green-600"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onAction(document.id, 'reject')}
                  className="text-red-600"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DocumentCenter;