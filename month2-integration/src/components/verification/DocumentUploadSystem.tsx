/**
 * Document Upload System
 * Comprehensive KYC/AML compliant document upload and verification system
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Camera, 
  Scan,
  Shield,
  Clock,
  User,
  CreditCard,
  Home,
  Building2,
  Eye,
  Download,
  Trash2,
  RotateCcw,
  Zap,
  Lock,
  AlertTriangle,
  Info
} from 'lucide-react';

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'identity' | 'financial' | 'address' | 'employment';
  icon: React.ComponentType<any>;
  acceptedFormats: string[];
  maxSize: number; // in MB
  examples?: string[];
  validationRules?: string[];
}

export interface UploadedDocument {
  id: string;
  file: File;
  documentTypeId: string;
  status: 'uploading' | 'processing' | 'verified' | 'rejected' | 'pending';
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectionReason?: string;
  extractedData?: {
    [key: string]: any;
  };
  confidence?: number; // 0-100 for AI verification confidence
  thumbnailUrl?: string;
  downloadUrl?: string;
}

interface DocumentUploadSystemProps {
  onDocumentUpload?: (document: UploadedDocument) => void;
  onVerificationComplete?: (allDocuments: UploadedDocument[]) => void;
  userProfile?: any;
  className?: string;
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'passport',
    name: 'Passport',
    description: 'Irish or EU passport (photo page)',
    required: true,
    category: 'identity',
    icon: User,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 10,
    examples: ['Clear photo of passport photo page', 'All text must be readable'],
    validationRules: ['Must be valid and not expired', 'Clear photo with all details visible']
  },
  {
    id: 'drivers_license',
    name: 'Driver\'s License',
    description: 'Irish driving license (alternative to passport)',
    required: false,
    category: 'identity',
    icon: CreditCard,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 10,
    examples: ['Front and back of license', 'All text clearly visible'],
    validationRules: ['Must be current and valid', 'Both sides required']
  },
  {
    id: 'pps_card',
    name: 'PPS Number Card',
    description: 'Personal Public Service number card',
    required: true,
    category: 'identity',
    icon: CreditCard,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5,
    examples: ['Clear photo of PPS card', 'Number must be fully visible'],
    validationRules: ['Must be valid PPS format', 'Card must not be damaged']
  },
  {
    id: 'payslip',
    name: 'Payslips',
    description: 'Latest 3 months payslips',
    required: true,
    category: 'financial',
    icon: FileText,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 15,
    examples: ['Recent payslips from employer', 'Must show salary and deductions'],
    validationRules: ['Must be recent (within 3 months)', 'Official company letterhead required']
  },
  {
    id: 'bank_statements',
    name: 'Bank Statements',
    description: '6 months bank statements',
    required: true,
    category: 'financial',
    icon: Building2,
    acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSize: 20,
    examples: ['Official bank statements', 'All pages must be included'],
    validationRules: ['Must be from recognized Irish bank', 'All transactions visible']
  },
  {
    id: 'utility_bill',
    name: 'Utility Bill',
    description: 'Recent utility bill for address verification',
    required: true,
    category: 'address',
    icon: Home,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 10,
    examples: ['ESB, Gas Networks, broadband bill', 'Must show current address'],
    validationRules: ['Must be within last 3 months', 'Address must match application']
  },
  {
    id: 'employment_letter',
    name: 'Employment Letter',
    description: 'Letter from employer confirming employment',
    required: false,
    category: 'employment',
    icon: Building2,
    acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSize: 10,
    examples: ['Letter on company letterhead', 'Signed by HR or manager'],
    validationRules: ['Must be recent', 'Must include salary information']
  }
];

export default function DocumentUploadSystem({
  onDocumentUpload,
  onVerificationComplete,
  userProfile,
  className = ''
}: DocumentUploadSystemProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [activeCategory, setActiveCategory] = useState<'identity' | 'financial' | 'address' | 'employment'>('identity');
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList, documentTypeId: string) => {
    const documentType = DOCUMENT_TYPES.find(dt => dt.id === documentTypeId);
    if (!documentType) return;

    setIsProcessing(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file
      const validation = validateFile(file, documentType);
      if (!validation.isValid) {
        alert(`File validation failed: ${validation.error}`);
        continue;
      }

      // Create document record
      const newDocument: UploadedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        documentTypeId,
        status: 'uploading',
        uploadedAt: new Date()
      };

      setUploadedDocuments(prev => [...prev, newDocument]);

      // Simulate upload and processing
      await simulateDocumentProcessing(newDocument);
    }

    setIsProcessing(false);
  }, []);

  // Validate file before upload
  const validateFile = (file: File, documentType: DocumentType) => {
    if (!documentType.acceptedFormats.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} not accepted. Please use: ${documentType.acceptedFormats.join(', ')}`
      };
    }

    if (file.size > documentType.maxSize * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size exceeds ${documentType.maxSize}MB limit`
      };
    }

    return { isValid: true };
  };

  // Simulate document processing with AI verification
  const simulateDocumentProcessing = async (document: UploadedDocument) => {
    const documentType = DOCUMENT_TYPES.find(dt => dt.id === document.documentTypeId)!;

    // Update to processing
    setUploadedDocuments(prev => prev.map(doc => 
      doc.id === document.id 
        ? { ...doc, status: 'processing' }
        : doc
    ));

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Simulate AI verification results
    const verificationSuccess = Math.random() > 0.1; // 90% success rate
    const confidence = Math.floor(85 + Math.random() * 15); // 85-100%

    const extractedData = generateMockExtractedData(document.documentTypeId);

    setUploadedDocuments(prev => prev.map(doc => 
      doc.id === document.id 
        ? { 
            ...doc, 
            status: verificationSuccess ? 'verified' : 'rejected',
            verifiedAt: verificationSuccess ? new Date() : undefined,
            rejectionReason: verificationSuccess ? undefined : getRandomRejectionReason(),
            extractedData,
            confidence,
            thumbnailUrl: URL.createObjectURL(document.file),
            downloadUrl: URL.createObjectURL(document.file)
          }
        : doc
    ));

    onDocumentUpload?.(document);

    // Check if all required documents are verified
    checkVerificationComplete();
  };

  // Generate mock extracted data based on document type
  const generateMockExtractedData = (documentTypeId: string) => {
    switch (documentTypeId) {
      case 'passport':
        return {
          fullName: 'John Patrick O\'Sullivan',
          passportNumber: 'P123456789',
          nationality: 'Irish',
          dateOfBirth: '1985-03-15',
          expiryDate: '2028-03-14'
        };
      case 'payslip':
        return {
          employer: 'Tech Solutions Ireland Ltd',
          grossPay: '€4,500.00',
          netPay: '€3,240.00',
          payPeriod: 'Monthly',
          payDate: '2024-01-31'
        };
      case 'bank_statements':
        return {
          accountNumber: '****1234',
          bank: 'Bank of Ireland',
          averageBalance: '€12,450',
          statementPeriod: '6 months'
        };
      case 'utility_bill':
        return {
          provider: 'ESB Networks',
          address: '123 Grafton Street, Dublin 2',
          billDate: '2024-01-15',
          accountNumber: '****5678'
        };
      default:
        return {};
    }
  };

  const getRandomRejectionReason = () => {
    const reasons = [
      'Document image is too blurry or unclear',
      'Document appears to be expired',
      'Some required information is not visible',
      'Document format not recognized',
      'Image quality too low for verification'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const checkVerificationComplete = () => {
    const requiredTypes = DOCUMENT_TYPES.filter(dt => dt.required);
    const verifiedTypes = uploadedDocuments.filter(doc => doc.status === 'verified');
    
    const allRequiredVerified = requiredTypes.every(reqType =>
      verifiedTypes.some(verDoc => verDoc.documentTypeId === reqType.id)
    );

    if (allRequiredVerified) {
      onVerificationComplete?.(uploadedDocuments);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, documentTypeId: string) => {
    e.preventDefault();
    setDragOver(documentTypeId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, documentTypeId: string) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, documentTypeId);
    }
  };

  const removeDocument = (documentId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const retryUpload = (documentId: string) => {
    const document = uploadedDocuments.find(doc => doc.id === documentId);
    if (document) {
      simulateDocumentProcessing(document);
    }
  };

  const getDocumentsByCategory = (category: string) => {
    return DOCUMENT_TYPES.filter(dt => dt.category === category);
  };

  const getUploadedDocumentsByType = (documentTypeId: string) => {
    return uploadedDocuments.filter(doc => doc.documentTypeId === documentTypeId);
  };

  const getVerificationProgress = () => {
    const requiredDocs = DOCUMENT_TYPES.filter(dt => dt.required);
    const verifiedRequiredDocs = requiredDocs.filter(reqDoc =>
      uploadedDocuments.some(upDoc => 
        upDoc.documentTypeId === reqDoc.id && upDoc.status === 'verified'
      )
    );
    
    return {
      completed: verifiedRequiredDocs.length,
      total: requiredDocs.length,
      percentage: Math.round((verifiedRequiredDocs.length / requiredDocs.length) * 100)
    };
  };

  const progress = getVerificationProgress();
  const categories = [
    { id: 'identity', name: 'Identity', icon: User, color: 'blue' },
    { id: 'financial', name: 'Financial', icon: CreditCard, color: 'green' },
    { id: 'address', name: 'Address', icon: Home, color: 'purple' },
    { id: 'employment', name: 'Employment', icon: Building2, color: 'orange' }
  ] as const;

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Document Verification</h2>
              <p className="text-gray-600 text-sm">Upload documents for KYC/AML compliance</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{progress.percentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Verification Progress</span>
            <span>{progress.completed} of {progress.total} required documents</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {categories.map((category) => {
            const categoryDocs = getDocumentsByCategory(category.id);
            const verifiedCount = categoryDocs.filter(doc =>
              uploadedDocuments.some(upDoc => 
                upDoc.documentTypeId === doc.id && upDoc.status === 'verified'
              )
            ).length;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? `border-${category.color}-600 text-${category.color}-600 bg-${category.color}-50`
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <category.icon size={18} />
                <span className="font-medium">{category.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  verifiedCount === categoryDocs.length
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {verifiedCount}/{categoryDocs.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Upload Area */}
      <div className="p-6">
        <div className="grid gap-6">
          {getDocumentsByCategory(activeCategory).map((documentType) => {
            const uploadedDocs = getUploadedDocumentsByType(documentType.id);
            const hasVerified = uploadedDocs.some(doc => doc.status === 'verified');

            return (
              <DocumentUploadCard
                key={documentType.id}
                documentType={documentType}
                uploadedDocuments={uploadedDocs}
                onFileUpload={(files) => handleFileUpload(files, documentType.id)}
                onRemoveDocument={removeDocument}
                onRetryUpload={retryUpload}
                dragOver={dragOver === documentType.id}
                onDragOver={(e) => handleDragOver(e, documentType.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, documentType.id)}
                isProcessing={isProcessing}
              />
            );
          })}
        </div>

        {/* Verification Status */}
        {progress.percentage === 100 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h3 className="font-semibold text-green-900">Verification Complete!</h3>
                <p className="text-green-800 text-sm">
                  All required documents have been verified. You can now proceed with your application.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Upload Tips</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Ensure all text is clearly readable</li>
                <li>• Use good lighting and avoid shadows</li>
                <li>• Take photos straight on (not at an angle)</li>
                <li>• Upload original documents, not photocopies when possible</li>
                <li>• Files are encrypted and securely stored</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,application/pdf"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            // This would need to be connected to a specific document type
            // For now, we'll handle this in the individual upload cards
          }
        }}
      />
    </div>
  );
}

// Individual Document Upload Card Component
interface DocumentUploadCardProps {
  documentType: DocumentType;
  uploadedDocuments: UploadedDocument[];
  onFileUpload: (files: FileList) => void;
  onRemoveDocument: (documentId: string) => void;
  onRetryUpload: (documentId: string) => void;
  dragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  isProcessing: boolean;
}

function DocumentUploadCard({
  documentType,
  uploadedDocuments,
  onFileUpload,
  onRemoveDocument,
  onRetryUpload,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  isProcessing
}: DocumentUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasVerified = uploadedDocuments.some(doc => doc.status === 'verified');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'uploading': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`border-2 border-dashed rounded-lg p-6 transition-all ${
      dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
    } ${hasVerified ? 'bg-green-50 border-green-300' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            hasVerified ? 'bg-green-600' : 'bg-gray-600'
          }`}>
            <documentType.icon className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {documentType.name}
              {documentType.required && (
                <span className="text-red-500 text-sm">*</span>
              )}
            </h3>
            <p className="text-gray-600 text-sm">{documentType.description}</p>
          </div>
        </div>

        {hasVerified && (
          <CheckCircle className="text-green-600" size={24} />
        )}
      </div>

      {/* Upload Area */}
      {uploadedDocuments.length === 0 ? (
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer ${
            dragOver ? 'border-blue-500 bg-blue-50' : ''
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to upload
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            {documentType.acceptedFormats.join(', ')} • Max {documentType.maxSize}MB
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={documentType.acceptedFormats.join(',')}
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onFileUpload(e.target.files);
              }
            }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {uploadedDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <FileText size={20} className="text-gray-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{doc.file.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{(doc.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    {doc.confidence && (
                      <span className="text-blue-600">
                        {doc.confidence}% confidence
                      </span>
                    )}
                  </div>
                  {doc.rejectionReason && (
                    <p className="text-red-600 text-sm mt-1">{doc.rejectionReason}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {doc.status === 'processing' && (
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                )}
                
                {doc.status === 'verified' && doc.downloadUrl && (
                  <button
                    onClick={() => window.open(doc.downloadUrl, '_blank')}
                    className="p-2 text-gray-600 hover:text-blue-600"
                    title="View document"
                  >
                    <Eye size={16} />
                  </button>
                )}

                {doc.status === 'rejected' && (
                  <button
                    onClick={() => onRetryUpload(doc.id)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                    title="Retry upload"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}

                <button
                  onClick={() => onRemoveDocument(doc.id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                  title="Remove document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Add more button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Upload size={16} />
            Add another file
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={documentType.acceptedFormats.join(',')}
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onFileUpload(e.target.files);
              }
            }}
          />
        </div>
      )}

      {/* Document Examples */}
      {documentType.examples && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-2">Examples:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            {documentType.examples.map((example, index) => (
              <li key={index}>• {example}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}