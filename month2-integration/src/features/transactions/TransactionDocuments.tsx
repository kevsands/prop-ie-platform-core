'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  UserGroupIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  DocumentChartBarIcon,
  DocumentCheckIcon,
  DocumentMagnifyingGlassIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import DocumentViewer from '@/components/documents/DocumentViewer';
import DocumentEditor from '@/components/documents/DocumentEditor';
import SignatureModal from '@/components/documents/SignatureModal';
import DocumentComments from '@/components/documents/DocumentComments';
import DocumentVersionHistory from '@/components/documents/DocumentVersionHistory';
import { useDocuments } from '@/hooks/useDocuments';
import { useAuth } from '@/hooks/useAuth';

interface TransactionDocument {
  id: string;
  name: string;
  type: 'CONTRACT' | 'SURVEY' | 'TITLE' | 'COMPLIANCE' | 'FINANCIAL' | 'PLANNING' | 'TAX' | 'INSURANCE' | 'OTHER';
  category: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'SIGNED' | 'EXECUTED' | 'ARCHIVED';
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
  dueDate?: Date;
  size: number;
  format: string;
  version: number;
  previousVersions?: DocumentVersion[];
  signatures?: SignatureStatus[];
  criticalPath: boolean;
  tags: string[];
  description?: string;
  metadata?: {
    confidential?: boolean;
    watermarked?: boolean;
    encrypted?: boolean;
    requiredForClosing?: boolean;
    legalReview?: boolean;
    clientApproval?: boolean;
    regulatoryCompliance?: boolean;
  };
  permissions: {
    view: string[];
    edit: string[];
    sign: string[];
    download: string[];
  };
  comments?: DocumentComment[];
  auditLog?: AuditEntry[];
  relatedDocuments?: string[];
}

interface DocumentVersion {
  id: string;
  version: number;
  uploadedBy: string;
  uploadedAt: Date;
  changes: string;
  size: number;
  url: string;
}

interface SignatureStatus {
  id: string;
  signerId: string;
  signerName: string;
  signerRole: string;
  status: 'PENDING' | 'SIGNED' | 'DECLINED';
  signedAt?: Date;
  declinedAt?: Date;
  reason?: string;
  signatureImage?: string;
  ipAddress?: string;
  location?: string;
}

interface DocumentComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
  replies?: DocumentComment[];
}

interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details: string;
  ipAddress: string;
}

interface TransactionDocumentsProps {
  documents: TransactionDocument[];
  transactionId: string;
  onDocumentUpdate?: (document: TransactionDocument) => void;
}

const documentTypeConfig = {
  CONTRACT: { icon: DocumentTextIcon, color: 'blue', label: 'Contract' },
  SURVEY: { icon: DocumentMagnifyingGlassIcon, color: 'green', label: 'Survey' },
  TITLE: { icon: DocumentCheckIcon, color: 'purple', label: 'Title' },
  COMPLIANCE: { icon: ShieldCheckIcon, color: 'yellow', label: 'Compliance' },
  FINANCIAL: { icon: DocumentChartBarIcon, color: 'red', label: 'Financial' },
  PLANNING: { icon: FolderIcon, color: 'indigo', label: 'Planning' },
  TAX: { icon: DocumentTextIcon, color: 'orange', label: 'Tax' },
  INSURANCE: { icon: ShieldCheckIcon, color: 'teal', label: 'Insurance' },
  OTHER: { icon: DocumentTextIcon, color: 'gray', label: 'Other' }
};

const documentStatusConfig = {
  DRAFT: { color: 'gray', label: 'Draft' },
  REVIEW: { color: 'yellow', label: 'In Review' },
  APPROVED: { color: 'green', label: 'Approved' },
  SIGNED: { color: 'blue', label: 'Signed' },
  EXECUTED: { color: 'purple', label: 'Executed' },
  ARCHIVED: { color: 'gray', label: 'Archived' }
};

export default function TransactionDocuments({ documents, transactionId, onDocumentUpdate }: TransactionDocumentsProps) {
  const { user } = useAuth();
  const { uploadDocument, deleteDocument, updateDocument } = useDocuments();
  
  const [selectedDocument, setSelectedDocument] = useState<TransactionDocument | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('transactionId', transactionId);
        formData.append('type', 'OTHER');
        
        const result = await uploadDocument(formData);
        toast.success(`${file.name} uploaded successfully`);
        onDocumentUpdate?.(result);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }, [transactionId, uploadDocument, onDocumentUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    }
  });

  const filteredDocuments = documents.filter(doc => {
    if (filterType !== 'all' && doc.type !== filterType) return false;
    if (filterStatus !== 'all' && doc.status !== filterStatus) return false;
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const documentStats = {
    total: documents.length,
    executed: documents.filter(d => d.status === 'EXECUTED').length,
    pendingSignatures: documents.filter(d => d.status === 'SIGNED' && d.signatures?.some(s => s.status === 'PENDING')).length,
    overdue: documents.filter(d => d.dueDate && new Date(d.dueDate) < new Date() && d.status !== 'EXECUTED').length,
    critical: documents.filter(d => d.criticalPath).length
  };

  const handleDocumentAction = async (action: string, document: TransactionDocument) => {
    switch (action) {
      case 'view':
        setSelectedDocument(document);
        setShowViewer(true);
        break;
      case 'edit':
        setSelectedDocument(document);
        setShowEditor(true);
        break;
      case 'sign':
        setSelectedDocument(document);
        setShowSignatureModal(true);
        break;
      case 'download':
        // Handle download
        toast.success(`Downloading ${document.name}`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${document.name}?`)) {
          try {
            await deleteDocument(document.id);
            toast.success(`${document.name} deleted`);
          } catch (error) {
            toast.error('Failed to delete document');
          }
        }
        break;
      case 'version-history':
        setSelectedDocument(document);
        setShowVersionHistory(true);
        break;
      case 'comments':
        setSelectedDocument(document);
        setShowComments(true);
        break;
    }
  };

  const handleBulkAction = async (action: string) => {
    const selectedDocs = documents.filter(doc => selectedDocuments.has(doc.id));
    
    switch (action) {
      case 'download':
        toast.success(`Downloading ${selectedDocs.length} documents`);
        break;
      case 'archive':
        toast.success(`Archiving ${selectedDocs.length} documents`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedDocs.length} documents?`)) {
          toast.success(`Deleting ${selectedDocs.length} documents`);
        }
        break;
    }
  };

  const renderDocumentCard = (document: TransactionDocument) => {
    const config = documentTypeConfig[document.type];
    const statusConfig = documentStatusConfig[document.status];
    const Icon = config.icon;
    const isOverdue = document.dueDate && new Date(document.dueDate) < new Date() && document.status !== 'EXECUTED';
    const canEdit = document.permissions.edit.includes(user?.role || '');
    const canSign = document.permissions.sign.includes(user?.role || '') && document.status === 'APPROVED';
    const canDownload = document.permissions.download.includes(user?.role || '');

    return (
      <motion.div
        key={document.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative"
      >
        <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${
          isOverdue ? 'border-red-300' : ''
        }`}>
          <CardContent className="p-0">
            {viewMode === 'grid' ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${config.bgColor}-100`}>
                    <Icon className={`h-6 w-6 text-${config.color}-600`} />
                  </div>
                  <Checkbox
                    checked={selectedDocuments.has(document.id)}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedDocuments);
                      if (checked) {
                        newSelected.add(document.id);
                      } else {
                        newSelected.delete(document.id);
                      }
                      setSelectedDocuments(newSelected);
                    }}
                  />
                </div>
                
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{document.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{config.label} • v{document.version}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={statusConfig.color as any}>
                    {statusConfig.label}
                  </Badge>
                  {document.criticalPath && (
                    <Badge variant="destructive" className="text-xs">
                      Critical
                    </Badge>
                  )}
                </div>

                {document.signatures && document.signatures.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Signatures</span>
                      <span>
                        {document.signatures.filter(s => s.status === 'SIGNED').length}/
                        {document.signatures.length}
                      </span>
                    </div>
                    <Progress 
                      value={(document.signatures.filter(s => s.status === 'SIGNED').length / document.signatures.length) * 100}
                      className="h-1"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDocumentAction('view', document)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDocumentAction('edit', document)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {canSign && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDocumentAction('sign', document)}
                    >
                      <DocumentCheckIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {canDownload && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDocumentAction('download', document)}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isOverdue && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="text-xs">
                      Overdue
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center p-4">
                <Checkbox
                  checked={selectedDocuments.has(document.id)}
                  onCheckedChange={(checked) => {
                    const newSelected = new Set(selectedDocuments);
                    if (checked) {
                      newSelected.add(document.id);
                    } else {
                      newSelected.delete(document.id);
                    }
                    setSelectedDocuments(newSelected);
                  }}
                  className="mr-4"
                />
                
                <div className={`p-2 rounded-lg ${config.bgColor}-100 mr-4`}>
                  <Icon className={`h-6 w-6 text-${config.color}-600`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{document.name}</h3>
                    {document.criticalPath && (
                      <Badge variant="destructive" className="text-xs">Critical</Badge>
                    )}
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">Overdue</Badge>
                    )}
                    {document.metadata?.confidential && (
                      <LockClosedIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{config.label}</span>
                    <span>v{document.version}</span>
                    <span>{format(document.uploadedAt, 'MMM dd, yyyy')}</span>
                    <span>{(document.size / 1024 / 1024).toFixed(2)} MB</span>
                    {document.dueDate && (
                      <span className={isOverdue ? 'text-red-600' : ''}>
                        Due: {format(document.dueDate, 'MMM dd')}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant={statusConfig.color as any}>
                    {statusConfig.label}
                  </Badge>
                  
                  {document.signatures && (
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(document.signatures.filter(s => s.status === 'SIGNED').length / document.signatures.length) * 100}
                        className="w-20 h-2"
                      />
                      <span className="text-sm text-gray-600">
                        {document.signatures.filter(s => s.status === 'SIGNED').length}/
                        {document.signatures.length}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDocumentAction('view', document)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDocumentAction('edit', document)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {canSign && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDocumentAction('sign', document)}
                      >
                        <DocumentCheckIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {canDownload && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDocumentAction('download', document)}
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDocumentAction('more', document)}
                    >
                      <BellIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Document Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{documentStats.total}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Executed</p>
                <p className="text-2xl font-bold text-green-600">{documentStats.executed}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Signatures</p>
                <p className="text-2xl font-bold text-yellow-600">{documentStats.pendingSignatures}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{documentStats.overdue}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Path</p>
                <p className="text-2xl font-bold text-purple-600">{documentStats.critical}</p>
              </div>
              <BellIcon className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction Documents</CardTitle>
              <CardDescription>Manage all documents related to this transaction</CardDescription>
            </div>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CloudArrowUpIcon className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(documentTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(documentStatusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              
              {selectedDocuments.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('download')}
                  >
                    Download ({selectedDocuments.size})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('archive')}
                  >
                    Archive ({selectedDocuments.size})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete ({selectedDocuments.size})
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {isDragActive
                ? 'Drop files here...'
                : 'Drag and drop files here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, PNG, JPG
            </p>
          </div>

          {/* Document Grid/List */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No documents found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setFilterType('all');
                  setFilterStatus('all');
                  setSearchQuery('');
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-2'
              }>
                {filteredDocuments.map(doc => renderDocumentCard(doc))}
              </div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer Modal */}
      {selectedDocument && showViewer && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => {
            setShowViewer(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {/* Document Editor Modal */}
      {selectedDocument && showEditor && (
        <DocumentEditor
          document={selectedDocument}
          onSave={async (updatedDoc) => {
            await updateDocument(selectedDocument.id, updatedDoc);
            setShowEditor(false);
            setSelectedDocument(null);
            toast.success('Document updated successfully');
          }}
          onClose={() => {
            setShowEditor(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {/* Signature Modal */}
      {selectedDocument && showSignatureModal && (
        <SignatureModal
          document={selectedDocument}
          onSign={async (signature) => {
            // Handle signature submission
            toast.success('Document signed successfully');
            setShowSignatureModal(false);
            setSelectedDocument(null);
          }}
          onClose={() => {
            setShowSignatureModal(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {/* Version History Modal */}
      {selectedDocument && showVersionHistory && (
        <DocumentVersionHistory
          document={selectedDocument}
          onClose={() => {
            setShowVersionHistory(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {/* Comments Panel */}
      {selectedDocument && showComments && (
        <DocumentComments
          document={selectedDocument}
          onClose={() => {
            setShowComments(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}