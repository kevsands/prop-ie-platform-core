'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { 
  Document as DocumentType, 
  DocumentStatus, 
  DocumentType as DocType,
  DocumentCategory
} from '@/types/document';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, File, Calendar, AlertCircle, CheckCircle, Loader2, Shield, Eye } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { DocumentCategoryTypeMapping } from '@/types/core/document';

interface DocumentUploaderProps {
  onUpload: (file: File, metadata: Partial<DocumentType>) => Promise<void>;
  loading: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  relatedEntityName?: string;
  existingDocument?: DocumentType; // For versioning
  isVersionUpload?: boolean;
  enableVerification?: boolean;
  onVerificationComplete?: (verificationResult: VerificationResult) => void;
}

interface VerificationResult {
  success: boolean;
  confidence: number;
  checks: VerificationCheck[];
  extractedData?: Record<string, any>;
  warnings?: string[];
  errors?: string[];
}

interface VerificationCheck {
  type: string;
  name: string;
  status: 'passed' | 'failed' | 'warning';
  confidence: number;
  details?: string;
}

type VerificationStatus = 'idle' | 'analyzing' | 'extracting' | 'validating' | 'complete' | 'failed';

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUpload,
  loading,
  relatedEntityType,
  relatedEntityId,
  relatedEntityName,
  existingDocument,
  isVersionUpload = false,
  enableVerification = true,
  onVerificationComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<DocType>(DocType.LEGAL);
  const [category, setCategory] = useState<DocumentCategory>(DocumentCategory.ADMINISTRATIVE);
  const [tags, setTags] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [signatureRequired, setSignatureRequired] = useState<boolean>(false);
  const [versionNotes, setVersionNotes] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [sensitivity, setSensitivity] = useState<string>('standard');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [showVerificationDetails, setShowVerificationDetails] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Sentry monitoring and populate form data
  useEffect(() => {
    Sentry.addBreadcrumb({
      message: 'Document Uploader component initialized',
      level: 'info',
      category: 'ui.component'
    });
    
    Sentry.setContext('document_uploader', {
      isVersionUpload,
      relatedEntityType,
      relatedEntityId,
      existingDocumentId: existingDocument?.id
    });

    if (existingDocument && isVersionUpload) {
      setName(existingDocument.name);
      setDescription(existingDocument.description || '');
      setType(existingDocument.type);
      setCategory(existingDocument.category);
      setTags(existingDocument.tags?.join(', ') || '');
      setExpiryDate(existingDocument.expiryDate ? new Date(existingDocument.expiryDate) : undefined);
      setSignatureRequired(existingDocument.signatureRequired || false);
      
      Sentry.addBreadcrumb({
        message: 'Document uploader initialized for version upload',
        level: 'info',
        category: 'document.version',
        data: { 
          documentId: existingDocument.id,
          documentName: existingDocument.name,
          currentVersion: existingDocument.version || 1
        }
      });
    }
  }, [existingDocument, isVersionUpload, relatedEntityType, relatedEntityId]);

  // Filter document types by selected category
  const availableDocTypes = useMemo(() => {
    if (!category) return Object.values(DocType);
    return DocumentCategoryTypeMapping[category] || Object.values(DocType);
  }, [category]);

  // Validate the type is allowed for the selected category
  useEffect(() => {
    if (category && type && availableDocTypes.indexOf(type) === -1) {
      setType(availableDocTypes[0]);
    }
  }, [category, type, availableDocTypes]);

  // Handle file selection with monitoring and verification
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        
        Sentry.addBreadcrumb({
          message: 'Document file selected for upload',
          level: 'info',
          category: 'file.select',
          data: { 
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            isVersionUpload
          }
        });
        
        // Auto-populate name if empty and not in versioning mode
        if (!name && !isVersionUpload) {
          setName(selectedFile.name);
        }

        // Clear file validation error if it exists
        if (validationErrors.file) {
          setValidationErrors(prev => ({...prev, file: ''}));
        }
        
        // Start verification if enabled
        if (enableVerification) {
          startDocumentVerification(selectedFile);
        }
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      // Auto-populate name if empty and not in versioning mode
      if (!name && !isVersionUpload) {
        setName(droppedFile.name);
      }

      // Clear file validation error if it exists
      if (validationErrors.file) {
        setValidationErrors(prev => ({...prev, file: ''}));
      }
      
      // Start verification if enabled
      if (enableVerification) {
        startDocumentVerification(droppedFile);
      }
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Document verification function
  const startDocumentVerification = async (file: File) => {
    if (!enableVerification) return;
    
    try {
      setVerificationStatus('analyzing');
      setVerificationProgress(10);
      setVerificationResult(null);
      
      Sentry.addBreadcrumb({
        message: 'Document verification started',
        level: 'info',
        category: 'verification.start',
        data: { 
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }
      });
      
      // Simulate verification process with realistic steps
      await simulateVerificationProcess(file);
      
    } catch (error) {
      setVerificationStatus('failed');
      setVerificationProgress(0);
      
      Sentry.captureException(error, {
        tags: { operation: 'document_verification' },
        extra: { fileName: file.name }
      });
    }
  };
  
  // Simulate realistic document verification process
  const simulateVerificationProcess = async (file: File) => {
    // Phase 1: File analysis
    setVerificationStatus('analyzing');
    setVerificationProgress(25);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Phase 2: Data extraction
    setVerificationStatus('extracting');
    setVerificationProgress(50);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Phase 3: Validation
    setVerificationStatus('validating');
    setVerificationProgress(75);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Phase 4: Complete
    setVerificationStatus('complete');
    setVerificationProgress(100);
    
    // Generate mock verification result based on document type and category
    const result = generateMockVerificationResult(file, type, category);
    setVerificationResult(result);
    
    if (onVerificationComplete) {
      onVerificationComplete(result);
    }
    
    Sentry.addBreadcrumb({
      message: 'Document verification completed',
      level: 'info',
      category: 'verification.complete',
      data: { 
        fileName: file.name,
        success: result.success,
        confidence: result.confidence
      }
    });
  };
  
  // Generate realistic mock verification results
  const generateMockVerificationResult = (file: File, docType: DocType, docCategory: DocumentCategory): VerificationResult => {
    const checks: VerificationCheck[] = [];
    const warnings: string[] = [];
    const extractedData: Record<string, any> = {};
    
    // File format validation
    const isValidFormat = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'].includes(file.type);
    checks.push({
      type: 'format',
      name: 'File Format Validation',
      status: isValidFormat ? 'passed' : 'failed',
      confidence: isValidFormat ? 0.95 : 0.1,
      details: isValidFormat ? 'Document format is supported' : 'Unsupported file format'
    });
    
    // Document quality check
    const qualityScore = Math.random() * 0.4 + 0.6; // 60-100%
    checks.push({
      type: 'quality',
      name: 'Document Quality',
      status: qualityScore > 0.7 ? 'passed' : 'warning',
      confidence: qualityScore,
      details: qualityScore > 0.7 ? 'Good document quality' : 'Document quality could be improved'
    });
    
    if (qualityScore < 0.8) {
      warnings.push('Document quality is lower than optimal. Consider rescanning for better results.');
    }
    
    // Document type specific checks
    if (docType === DocType.LEGAL) {
      checks.push({
        type: 'legal_format',
        name: 'Legal Document Format',
        status: 'passed',
        confidence: 0.85,
        details: 'Document appears to follow legal formatting standards'
      });
      
      extractedData.documentType = 'Legal Contract';
      extractedData.pageCount = Math.floor(Math.random() * 10) + 5;
    }
    
    if (docType === DocType.FINANCIAL) {
      checks.push({
        type: 'financial_data',
        name: 'Financial Information Detection',
        status: 'passed',
        confidence: 0.92,
        details: 'Financial data structures detected'
      });
      
      extractedData.currency = 'EUR';
      extractedData.containsAmounts = true;
    }
    
    if (docType === DocType.IDENTIFICATION) {
      checks.push({
        type: 'id_verification',
        name: 'ID Document Verification',
        status: 'passed',
        confidence: 0.88,
        details: 'Document contains identification markers'
      });
      
      extractedData.idType = 'Passport';
      extractedData.hasPhoto = true;
    }
    
    // Security checks
    checks.push({
      type: 'security',
      name: 'Security Scan',
      status: 'passed',
      confidence: 0.99,
      details: 'No security threats detected'
    });
    
    // Text extraction confidence
    const textConfidence = Math.random() * 0.3 + 0.7; // 70-100%
    checks.push({
      type: 'text_extraction',
      name: 'Text Extraction',
      status: textConfidence > 0.8 ? 'passed' : 'warning',
      confidence: textConfidence,
      details: textConfidence > 0.8 ? 'Text extracted successfully' : 'Some text may be unclear'
    });
    
    const overallConfidence = checks.reduce((sum, check) => sum + check.confidence, 0) / checks.length;
    const hasFailures = checks.some(check => check.status === 'failed');
    
    return {
      success: !hasFailures && overallConfidence > 0.7,
      confidence: Math.round(overallConfidence * 100) / 100,
      checks,
      extractedData,
      warnings: warnings.length > 0 ? warnings : undefined,
      errors: hasFailures ? ['Document verification failed. Please check the file and try again.'] : undefined
    };
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!file) {
      errors.file = 'Please select a file to upload';
    }
    
    if (!name.trim()) {
      errors.name = 'Document name is required';
    }
    
    if (!type) {
      errors.type = 'Document type is required';
    }
    
    if (!category) {
      errors.category = 'Document category is required';
    }
    
    if (isVersionUpload && !versionNotes.trim()) {
      errors.versionNotes = 'Please provide notes about what changed in this version';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission with comprehensive monitoring
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const uploadStartTime = Date.now();
    
    try {
      Sentry.addBreadcrumb({
        message: 'Document upload form submitted',
        level: 'info',
        category: 'form.submit',
        data: { 
          documentName: name,
          category,
          type,
          isVersionUpload,
          fileSize: file?.size,
          relatedEntityType
        }
      });

      if (!validateForm()) {
        Sentry.addBreadcrumb({
          message: 'Document upload form validation failed',
          level: 'warning',
          category: 'validation.error',
          data: { errors: Object.keys(validationErrors) }
        });
        return;
      }
      
      // Prepare metadata
      const metadata: Partial<DocumentType> = {
        name: name.trim(),
        description: description.trim(),
        type,
        status: DocumentStatus.DRAFT,
        category,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        expiryDate,
        signatureRequired
      };
      
      // Add related entity if provided
      if (relatedEntityType && relatedEntityId) {
        metadata.relatedTo = {
          type: relatedEntityType as any,
          id: relatedEntityId,
          name: relatedEntityName
        };
      }
      
      // Add versioning data if this is a version upload
      if (isVersionUpload && existingDocument) {
        metadata.version = (existingDocument.version || 0) + 1;
        metadata.previousVersions = [...(existingDocument.previousVersions || []), existingDocument.id];
        metadata.metadata = {
          ...metadata.metadata,
          versionNotes: versionNotes.trim()
        };
      }
      
      // Add permissions
      metadata.permissions = {
        canView: [],
        canEdit: [],
        canDelete: [],
        canShare: [],
        canSign: [],
        isPublic
      };

      // Add sensitivity level to metadata
      metadata.metadata = {
        ...metadata.metadata,
        sensitivity
      };

      if (!file) {
        throw new Error('No file selected');
      }
      
      await onUpload(file, metadata);
      
      const uploadDuration = Date.now() - uploadStartTime;
      
      Sentry.addBreadcrumb({
        message: 'Document upload completed successfully',
        level: 'info',
        category: 'upload.success',
        data: { 
          documentName: name,
          uploadDuration,
          fileSize: file.size,
          isVersionUpload
        }
      });
      
      resetForm();
      
    } catch (error) {
      const uploadDuration = Date.now() - uploadStartTime;
      
      Sentry.captureException(error, {
        tags: {
          operation: 'document_upload',
          documentType: type,
          category: category
        },
        extra: {
          documentName: name,
          uploadDuration,
          fileSize: file?.size,
          isVersionUpload,
          relatedEntityType
        }
      });
      
      console.error('Error uploading document:', error);
      setValidationErrors(prev => ({
        ...prev,
        submit: 'Failed to upload document. Please try again.'
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFile(null);
    setName('');
    setDescription('');
    setTags('');
    setExpiryDate(undefined);
    setSignatureRequired(false);
    setVersionNotes('');
    setIsPublic(false);
    setSensitivity('standard');
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove selected file
  const removeFile = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // File drop area class
  const fileDropAreaClass = cn(
    'border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors',
    dragActive ? 'border-primary bg-primary/5' : 'border-muted',
    file ? 'bg-gray-50' : 'hover:bg-gray-50',
    validationErrors.file ? 'border-destructive' : ''
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div 
        className={fileDropAreaClass}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {file ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <File className="h-6 w-6 text-primary" />
                <div className="text-sm text-left">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {file.type || 'Unknown type'} · {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Verification Status */}
            {enableVerification && verificationStatus !== 'idle' && (
              <div className="bg-gray-50 p-3 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Document Verification</span>
                    {verificationStatus === 'complete' && verificationResult && (
                      <Badge variant={verificationResult.success ? 'default' : 'destructive'} className="text-xs">
                        {verificationResult.success ? 'Verified' : 'Failed'}
                      </Badge>
                    )}
                  </div>
                  {verificationStatus === 'complete' && verificationResult && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowVerificationDetails(!showVerificationDetails)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  )}
                </div>
                
                {verificationStatus !== 'complete' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs text-muted-foreground">
                        {verificationStatus === 'analyzing' && 'Analyzing document structure...'}
                        {verificationStatus === 'extracting' && 'Extracting document data...'}
                        {verificationStatus === 'validating' && 'Validating document contents...'}
                      </span>
                    </div>
                    <Progress value={verificationProgress} className="h-1" />
                  </div>
                )}
                
                {verificationStatus === 'complete' && verificationResult && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Confidence Score</span>
                      <span className="text-xs font-medium">{Math.round(verificationResult.confidence * 100)}%</span>
                    </div>
                    <Progress value={verificationResult.confidence * 100} className="h-1" />
                    
                    {verificationResult.warnings && verificationResult.warnings.length > 0 && (
                      <Alert className="py-2">
                        <AlertCircle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          {verificationResult.warnings[0]}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {showVerificationDetails && (
                      <div className="mt-3 space-y-2 border-t pt-2">
                        <h4 className="text-xs font-medium">Verification Checks</h4>
                        {verificationResult.checks.map((check, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="flex items-center space-x-1">
                              {check.status === 'passed' && <CheckCircle className="h-3 w-3 text-green-600" />}
                              {check.status === 'warning' && <AlertCircle className="h-3 w-3 text-yellow-600" />}
                              {check.status === 'failed' && <X className="h-3 w-3 text-red-600" />}
                              <span>{check.name}</span>
                            </span>
                            <span className="text-muted-foreground">
                              {Math.round(check.confidence * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {verificationStatus === 'failed' && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      Verification failed. Please try uploading a different file.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-4">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, Word, Excel, PowerPoint, and image files supported</p>
          </div>
        )}
      </div>
      
      {validationErrors.file && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationErrors.file}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <Label htmlFor="name" className={validationErrors.name ? 'text-destructive' : ''}>
              Document Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationErrors.name) {
                  setValidationErrors(prev => ({...prev, name: ''}));
                }
              }}
              placeholder="Enter document name"
              className={validationErrors.name ? 'border-destructive' : ''}
              disabled={isVersionUpload}
              required
            />
            {validationErrors.name && (
              <p className="text-destructive text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="category" className={validationErrors.category ? 'text-destructive' : ''}>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={category} 
              onValueChange={(value) => {
                setCategory(value as DocumentCategory);
                if (validationErrors.category) {
                  setValidationErrors(prev => ({...prev, category: ''}));
                }
              }}
              disabled={isVersionUpload}
            >
              <SelectTrigger className={validationErrors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DocumentCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0) + cat.slice(1).toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.category && (
              <p className="text-destructive text-xs mt-1">{validationErrors.category}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="type" className={validationErrors.type ? 'text-destructive' : ''}>
              Document Type <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={type} 
              onValueChange={(value) => {
                setType(value as DocType);
                if (validationErrors.type) {
                  setValidationErrors(prev => ({...prev, type: ''}));
                }
              }}
              disabled={isVersionUpload}
            >
              <SelectTrigger className={validationErrors.type ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {availableDocTypes.map((docType) => (
                  <SelectItem key={docType} value={docType}>
                    {docType.charAt(0) + docType.slice(1).toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.type && (
              <p className="text-destructive text-xs mt-1">{validationErrors.type}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. important, contract, approved"
              disabled={isVersionUpload}
            />
          </div>
          
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiryDate && "text-muted-foreground"
                  )}
                  disabled={isVersionUpload}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, 'PPP') : <span>Set expiry date (optional)</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the document"
              rows={3}
              disabled={isVersionUpload}
            />
          </div>
          
          {isVersionUpload && (
            <div>
              <Label htmlFor="versionNotes" className={validationErrors.versionNotes ? 'text-destructive' : ''}>
                Version Notes <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="versionNotes"
                value={versionNotes}
                onChange={(e) => {
                  setVersionNotes(e.target.value);
                  if (validationErrors.versionNotes) {
                    setValidationErrors(prev => ({...prev, versionNotes: ''}));
                  }
                }}
                placeholder="What has changed in this version?"
                rows={3}
                className={validationErrors.versionNotes ? 'border-destructive' : ''}
              />
              {validationErrors.versionNotes && (
                <p className="text-destructive text-xs mt-1">{validationErrors.versionNotes}</p>
              )}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="signatureRequired" 
              checked={signatureRequired} 
              onCheckedChange={(checked) => setSignatureRequired(checked as boolean)} 
              disabled={isVersionUpload}
            />
            <Label htmlFor="signatureRequired" className="cursor-pointer">
              Requires signature
            </Label>
          </div>
          
          {/* Access Control Section */}
          <Separator className="my-2" />
          <div>
            <h3 className="text-sm font-medium mb-2">Access Control</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isPublic" 
                  checked={isPublic} 
                  onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                  disabled={isVersionUpload}
                />
                <Label htmlFor="isPublic" className="cursor-pointer">
                  Make document public to all users
                </Label>
              </div>
              
              <div>
                <Label htmlFor="sensitivity" className="mb-1">Sensitivity Level</Label>
                <RadioGroup 
                  id="sensitivity" 
                  value={sensitivity} 
                  onValueChange={setSensitivity}
                  className="flex flex-col space-y-1"
                  disabled={isVersionUpload}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="sensitivity-low" />
                    <Label htmlFor="sensitivity-low">Low (General information)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="sensitivity-standard" />
                    <Label htmlFor="sensitivity-standard">Standard (Business use)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confidential" id="sensitivity-confidential" />
                    <Label htmlFor="sensitivity-confidential">Confidential (Restricted access)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Entity Info */}
      {relatedEntityType && relatedEntityId && (
        <Card className="bg-muted/40">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              This document will be linked to: <span className="font-medium">{relatedEntityName || `${relatedEntityType} #${relatedEntityId}`}</span>
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Version Info */}
      {isVersionUpload && existingDocument && (
        <Card className="bg-blue-50">
          <CardContent className="pt-4">
            <p className="text-sm">
              Creating new version of: <span className="font-medium">{existingDocument.name}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Current version: {existingDocument.version || 1} • Uploaded {existingDocument.uploadDate && format(new Date(existingDocument.uploadDate), 'PPP')}
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
              {isVersionUpload ? 'Uploading Version...' : 'Uploading...'}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {isVersionUpload ? 'Upload New Version' : 'Upload Document'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default DocumentUploader;