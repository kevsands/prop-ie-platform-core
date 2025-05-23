'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  LockClosedIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  FolderIcon,
  DocumentMagnifyingGlassIcon,
  DocumentCheckIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useDocuments } from '@/hooks/useDocuments';
import { useAuth } from '@/hooks/useAuth';

interface PropertyDocument {
  id: string;
  name: string;
  type: 'CONTRACT' | 'SURVEY' | 'TITLE' | 'COMPLIANCE' | 'FINANCIAL' | 'PLANNING' | 'OTHER';
  category: string;
  uploadedAt: Date;
  size: number;
  status: 'PENDING' | 'VERIFIED' | 'REQUIRES_ACTION';
  url?: string;
  locked: boolean;
  description?: string;
  requiredForStage?: string;
  expiryDate?: Date;
  watermarked?: boolean;
  downloadCount?: number;
  lastViewed?: Date;
  verifiedBy?: {
    name: string;
    role: string;
    date: Date;
  };
  signatures?: {
    required: number;
    completed: number;
    signers: Array<{
      name: string;
      status: 'PENDING' | 'SIGNED';
      signedAt?: Date;
    }>;
  };
}

interface PropertyDocumentsProps {
  documents: PropertyDocument[];
  propertyId: string;
}

const documentTypeConfig = {
  CONTRACT: { icon: DocumentTextIcon, color: 'blue', label: 'Contract' },
  SURVEY: { icon: DocumentMagnifyingGlassIcon, color: 'green', label: 'Survey' },
  TITLE: { icon: DocumentCheckIcon, color: 'purple', label: 'Title' },
  COMPLIANCE: { icon: ShieldCheckIcon, color: 'yellow', label: 'Compliance' },
  FINANCIAL: { icon: DocumentArrowDownIcon, color: 'red', label: 'Financial' },
  PLANNING: { icon: FolderIcon, color: 'indigo', label: 'Planning' },
  OTHER: { icon: DocumentTextIcon, color: 'gray', label: 'Other' }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function PropertyDocuments({ documents, propertyId }: PropertyDocumentsProps) {
  const { user } = useAuth();
  const { downloadDocument, viewDocument, requestAccess } = useDocuments();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyRequired, setShowOnlyRequired] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PropertyDocument | null>(null);

  const categories = ['all', ...new Set(documents.map(doc => doc.category))];
  
  const filteredDocuments = documents.filter(doc => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (showOnlyRequired && !doc.requiredForStage) return false;
    return true;
  });

  const documentStats = {
    total: documents.length,
    verified: documents.filter(d => d.status === 'VERIFIED').length,
    pending: documents.filter(d => d.status === 'PENDING').length,
    requiresAction: documents.filter(d => d.status === 'REQUIRES_ACTION').length
  };

  const handleDownload = async (document: PropertyDocument) => {
    if (document.locked && user?.role !== 'BUYER') {
      const { success } = await requestAccess(document.id);
      if (!success) {
        toast.error('Access denied. Please contact your agent.');
        return;
      }
    }

    try {
      const { url } = await downloadDocument(document.id);
      window.open(url, '_blank');
      toast.success(`Downloaded ${document.name}`);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleView = async (document: PropertyDocument) => {
    if (document.locked && user?.role !== 'BUYER') {
      toast.error('This document is locked. Request access to view.');
      return;
    }

    try {
      const { url } = await viewDocument(document.id);
      setSelectedDocument(document);
      window.open(url, '_blank');
      toast.success(`Viewing ${document.name}`);
    } catch (error) {
      toast.error('Failed to view document');
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Overview */}
      <div className="grid grid-cols-4 gap-4">
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
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">{documentStats.verified}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{documentStats.pending}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-red-600">{documentStats.requiresAction}</p>
              </div>
              <ExclamationCircleIcon className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Document Completion</CardTitle>
          <CardDescription>Track your documentation progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{Math.round((documentStats.verified / documentStats.total) * 100)}%</span>
              </div>
              <Progress 
                value={(documentStats.verified / documentStats.total) * 100} 
                className="h-2"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                <span>Contract Documents: 3/3</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 text-yellow-600 mr-2" />
                <span>Financial Documents: 2/4</span>
              </div>
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 text-red-600 mr-2" />
                <span>Compliance Documents: 1/2</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <div className="flex items-center gap-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyRequired}
                  onChange={(e) => setShowOnlyRequired(e.target.checked)}
                  className="mr-2"
                />
                Required Only
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-6">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category === 'all' ? 'All' : category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-2">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents found</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredDocuments.map((document, index) => {
                    const config = documentTypeConfig[document.type];
                    const Icon = config.icon;
                    const isLocked = document.locked && user?.role !== 'BUYER';
                    
                    return (
                      <motion.div
                        key={document.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-lg bg-${config.color}-100`}>
                                <Icon className={`h-6 w-6 text-${config.color}-600`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{document.name}</h4>
                                  {isLocked && (
                                    <LockClosedIcon className="h-4 w-4 text-gray-500" />
                                  )}
                                  <Badge variant={
                                    document.status === 'VERIFIED' ? 'success' :
                                    document.status === 'PENDING' ? 'warning' :
                                    'destructive'
                                  }>
                                    {document.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <span>{config.label}</span>
                                  <span>•</span>
                                  <span>{formatFileSize(document.size)}</span>
                                  <span>•</span>
                                  <span>{format(document.uploadedAt, 'MMM dd, yyyy')}</span>
                                  {document.expiryDate && (
                                    <>
                                      <span>•</span>
                                      <span className="text-red-600">
                                        Expires: {format(document.expiryDate, 'MMM dd, yyyy')}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {document.description && (
                                  <p className="text-sm text-gray-600 mt-2">{document.description}</p>
                                )}
                                {document.signatures && (
                                  <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                      <Progress 
                                        value={(document.signatures.completed / document.signatures.required) * 100}
                                        className="h-1.5 w-24"
                                      />
                                      <span className="text-xs text-gray-600">
                                        {document.signatures.completed}/{document.signatures.required} signatures
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {document.verifiedBy && (
                                <HoverCard>
                                  <HoverCardTrigger>
                                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                                  </HoverCardTrigger>
                                  <HoverCardContent>
                                    <p className="text-sm">
                                      Verified by {document.verifiedBy.name} ({document.verifiedBy.role})
                                      <br />
                                      on {format(document.verifiedBy.date, 'MMM dd, yyyy')}
                                    </p>
                                  </HoverCardContent>
                                </HoverCard>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(document)}
                                disabled={isLocked}
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleDownload(document)}
                                disabled={isLocked}
                              >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}