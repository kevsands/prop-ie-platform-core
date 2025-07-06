'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  Shield,
  Lock,
  Eye,
  Download,
  Calendar,
  User,
  Building,
  CreditCard
} from 'lucide-react';

// Document categories for Irish property purchase
const documentCategories = [
  {
    id: 'identity',
    title: 'Identity Verification',
    description: 'Documents to verify your identity',
    icon: <User className="w-5 h-5" />,
    documents: [
      {
        id: 'passport',
        name: 'Passport',
        description: 'Valid passport photo page',
        required: true,
        alternativeOf: 'driving_license',
        maxSize: 5242880, // 5MB
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        status: 'pending'
      },
      {
        id: 'driving_license',
        name: 'Driving License',
        description: 'Valid Irish or EU driving license',
        required: true,
        alternativeOf: 'passport',
        maxSize: 5242880,
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        status: 'pending'
      },
      {
        id: 'pps_number',
        name: 'PPS Number Documentation',
        description: 'Public Services Card or other PPS documentation',
        required: true,
        maxSize: 5242880,
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'address',
    title: 'Address Verification',
    description: 'Proof of current address',
    icon: <Building className="w-5 h-5" />,
    documents: [
      {
        id: 'utility_bill',
        name: 'Utility Bill',
        description: 'Electricity, gas, or water bill (less than 3 months old)',
        required: true,
        maxSize: 5242880,
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        status: 'pending'
      },
      {
        id: 'bank_statement',
        name: 'Bank Statement',
        description: 'Recent bank statement (less than 3 months old)',
        required: true,
        maxSize: 5242880,
        acceptedFormats: ['.pdf'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'employment',
    title: 'Employment & Income',
    description: 'Documents proving your employment and income',
    icon: <CreditCard className="w-5 h-5" />,
    documents: [
      {
        id: 'employment_contract',
        name: 'Employment Contract',
        description: 'Current employment contract or letter',
        required: true,
        maxSize: 10485760, // 10MB
        acceptedFormats: ['.pdf'],
        status: 'pending'
      },
      {
        id: 'p60',
        name: 'P60 Forms',
        description: 'P60 forms for the last 2 years',
        required: true,
        multiple: true,
        maxSize: 5242880,
        acceptedFormats: ['.pdf'],
        status: 'pending'
      },
      {
        id: 'payslips',
        name: 'Recent Payslips',
        description: 'Last 3 months payslips',
        required: true,
        multiple: true,
        maxSize: 5242880,
        acceptedFormats: ['.pdf'],
        status: 'pending'
      },
      {
        id: 'bank_statements_6m',
        name: 'Bank Statements (6 months)',
        description: 'Bank statements for the last 6 months',
        required: true,
        multiple: true,
        maxSize: 10485760,
        acceptedFormats: ['.pdf'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'htb',
    title: 'Help-to-Buy',
    description: 'Revenue Help-to-Buy scheme documents',
    icon: <Building className="w-5 h-5" />,
    documents: [
      {
        id: 'htb_approval',
        name: 'HTB Approval Summary',
        description: 'Help-to-Buy approval from Revenue',
        required: true,
        maxSize: 5242880,
        acceptedFormats: ['.pdf'],
        status: 'pending'
      },
      {
        id: 'tax_clearance',
        name: 'Tax Clearance Certificate',
        description: 'Tax clearance certificate (if required)',
        required: false,
        maxSize: 5242880,
        acceptedFormats: ['.pdf'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'property',
    title: 'Property Documents',
    description: 'Documents related to your property purchase',
    icon: <FileText className="w-5 h-5" />,
    documents: [
      {
        id: 'booking_form',
        name: 'Booking Form',
        description: 'Signed booking form from developer',
        required: true,
        maxSize: 10485760,
        acceptedFormats: ['.pdf'],
        status: 'pending'
      },
      {
        id: 'sales_contract',
        name: 'Contract for Sale',
        description: 'Property sales contract',
        required: true,
        maxSize: 20971520, // 20MB
        acceptedFormats: ['.pdf'],
        status: 'pending'
      },
      {
        id: 'building_agreement',
        name: 'Building Agreement',
        description: 'Building agreement (if applicable)',
        required: false,
        maxSize: 20971520,
        acceptedFormats: ['.pdf'],
        status: 'pending'
      }
    ]
  }
];

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'verified' | 'rejected';
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

export default function DocumentUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [selectedCategory, setSelectedCategory] = useState('identity');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback((acceptedFiles: File[], documentId: string) => {
    acceptedFiles.forEach(file => {
      const uploadId = `${documentId}_${Date.now()}`;
      
      // Simulate file upload
      setUploadedFiles(prev => ({
        ...prev,
        [uploadId]: {
          id: uploadId,
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          status: 'uploading'
        }
      }));

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [uploadId]: progress }));
        
        if (progress >= 100) {
          clearInterval(interval);
          setUploadedFiles(prev => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              status: 'processing'
            }
          }));
          
          // Simulate processing
          setTimeout(() => {
            setUploadedFiles(prev => ({
              ...prev,
              [uploadId]: {
                ...prev[uploadId],
                status: 'verified',
                verifiedBy: 'System',
                verifiedDate: new Date().toISOString()
              }
            }));
          }, 2000);
        }
      }, 200);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => selectedDocument && onDrop(files, selectedDocument),
    accept: selectedDocument ? 
      documentCategories
        .flatMap(cat => cat.documents)
        .find(doc => doc.id === selectedDocument)
        ?.acceptedFormats.reduce((acc, format) => {
          acc[format] = [];
          return acc;
        }, {} as Record<string, string[]>) 
      : undefined,
    maxSize: selectedDocument ?
      documentCategories
        .flatMap(cat => cat.documents)
        .find(doc => doc.id === selectedDocument)?.maxSize
      : undefined,
    disabled: !selectedDocument
  });

  const getDocumentStatus = (documentId: string) => {
    const uploads = Object.values(uploadedFiles).filter(f => f.id.startsWith(documentId));
    if (uploads.length === 0) return 'pending';
    if (uploads.some(f => f.status === 'verified')) return 'verified';
    if (uploads.some(f => f.status === 'rejected')) return 'rejected';
    if (uploads.some(f => f.status === 'processing')) return 'processing';
    return 'uploading';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'uploading': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      default: return <Upload className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const selectedCategoryData = documentCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Upload Center</h1>
              <p className="text-gray-600 mt-1">Securely upload your documents for verification</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Bank-level encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Lock className="w-5 h-5 text-blue-600 mr-3" />
            <p className="text-sm text-blue-800">
              All documents are encrypted and stored securely in compliance with Irish data protection laws (GDPR)
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Document Categories</h2>
              <nav className="space-y-2">
                {documentCategories.map(category => {
                  const categoryDocuments = category.documents;
                  const verifiedCount = categoryDocuments.filter(
                    doc => getDocumentStatus(doc.id) === 'verified'
                  ).length;
                  const totalRequired = categoryDocuments.filter(doc => doc.required).length;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                            selectedCategory === category.id ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            {category.icon}
                          </div>
                          <span className="font-medium">{category.title}</span>
                        </div>
                        <div className="text-sm">
                          <span className={`font-medium ${
                            verifiedCount === totalRequired ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {verifiedCount}/{totalRequired}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Progress Summary */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Overall Progress</h3>
              <div className="space-y-3">
                {documentCategories.map(category => {
                  const categoryDocuments = category.documents;
                  const verifiedCount = categoryDocuments.filter(
                    doc => getDocumentStatus(doc.id) === 'verified'
                  ).length;
                  const totalRequired = categoryDocuments.filter(doc => doc.required).length;
                  const progress = totalRequired > 0 ? (verifiedCount / totalRequired) * 100 : 0;
                  
                  return (
                    <div key={category.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{category.title}</span>
                        <span className="text-gray-500">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Document Upload Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCategoryData?.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedCategoryData?.description}
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {selectedCategoryData?.documents.map(document => {
                    const status = getDocumentStatus(document.id);
                    const documentUploads = Object.values(uploadedFiles).filter(
                      f => f.id.startsWith(document.id)
                    );
                    
                    return (
                      <div 
                        key={document.id}
                        className={`border rounded-lg p-4 transition ${
                          selectedDocument === document.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="font-semibold text-gray-900">
                                {document.name}
                              </h3>
                              {document.required && (
                                <span className="ml-2 text-xs text-red-600 font-medium">
                                  Required
                                </span>
                              )}
                              <div className={`ml-3 px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(status)}`}>
                                {getStatusIcon(status)}
                                <span className="ml-1 capitalize">{status}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {document.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <FileText className="w-3 h-3 mr-1" />
                              <span>Accepted: {document.acceptedFormats.join(', ')}</span>
                              <span className="mx-2">•</span>
                              <span>Max size: {formatFileSize(document.maxSize)}</span>
                            </div>
                          </div>
                          
                          {status !== 'verified' && (
                            <button
                              onClick={() => setSelectedDocument(
                                selectedDocument === document.id ? null : document.id
                              )}
                              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              Upload
                            </button>
                          )}
                        </div>

                        {/* Uploaded Files */}
                        {documentUploads.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {documentUploads.map(file => (
                              <div 
                                key={file.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <FileText className="w-4 h-4 text-gray-400 mr-3" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize(file.size)} • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {file.status === 'uploading' && uploadProgress[file.id] && (
                                    <div className="w-24">
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${uploadProgress[file.id]}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                                    {file.status}
                                  </div>
                                  {file.status === 'verified' && (
                                    <>
                                      <button 
                                        className="p-1 hover:bg-gray-200 rounded"
                                        title="View document"
                                      >
                                        <Eye className="w-4 h-4 text-gray-600" />
                                      </button>
                                      <button 
                                        className="p-1 hover:bg-gray-200 rounded"
                                        title="Download document"
                                      >
                                        <Download className="w-4 h-4 text-gray-600" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upload Area */}
                        {selectedDocument === document.id && status !== 'verified' && (
                          <div className="mt-4">
                            <div
                              {...getRootProps()}
                              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                                isDragActive 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <input {...getInputProps()} />
                              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              {isDragActive ? (
                                <p className="text-blue-600">Drop the files here...</p>
                              ) : (
                                <>
                                  <p className="text-gray-700 mb-2">
                                    Drag & drop files here, or click to select
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {document.acceptedFormats.join(', ')} • Max {formatFileSize(document.maxSize)}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="mt-6 bg-yellow-50 rounded-lg p-6">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Information</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• All documents must be clear and legible</li>
                    <li>• Personal information must match across all documents</li>
                    <li>• Documents are verified within 24-48 hours</li>
                    <li>• You'll receive email notifications for any issues</li>
                    <li>• Documents are stored securely and deleted after purchase completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}