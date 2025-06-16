'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Shield,
  Upload,
  File,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';

interface KYCDocument {
  id: string;
  type: 'identity' | 'address' | 'funds';
  name: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadDate?: string;
  verifiedDate?: string;
  rejectionReason?: string;
  fileUrl?: string;
  fileSize?: number;
}

interface KYCVerificationProps {
  transactionId: string;
  onComplete?: () => void;
}

export default function KYCVerificationForm({ transactionId, onComplete }: KYCVerificationProps) {
  const [selectedTypesetSelectedType] = useState<'identity' | 'address' | 'funds' | null>(null);
  const [uploadProgresssetUploadProgress] = useState<Record<string, number>>({});

  // Fetch KYC documents
  const { data: documents, refetch } = useQuery({
    queryKey: ['kyc-documents', transactionId],
    queryFn: async () => {
      const response = await fetch(`/api/transactions/${transactionId}/kyc`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch KYC documents');
      return response.json();
    }
  });

  // Upload mutation
  const uploadDocument = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('transactionId', transactionId);

      const response = await fetch('/api/kyc/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      refetch();
      setSelectedType(null);
    }
  });

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[], type: string) => {
    acceptedFiles.forEach(file => {
      uploadDocument.mutate({ file, type });
    });
  }, [uploadDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: any) => selectedType && onDrop(filesselectedType),
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !selectedType
  });

  const documentTypes = [
    {
      type: 'identity',
      title: 'Identity Document',
      description: 'Passport or driver\'s license',
      icon: Shield,
      acceptedFormats: 'JPG, PNG, PDF (max 10MB)',
      requirements: [
        'Must be valid and not expired',
        'All details must be clearly visible',
        'Full page/card must be captured'
      ]
    },
    {
      type: 'address',
      title: 'Proof of Address',
      description: 'Utility bill or bank statement',
      icon: File,
      acceptedFormats: 'JPG, PNG, PDF (max 10MB)',
      requirements: [
        'Dated within last 3 months',
        'Shows your full name and address',
        'From recognized utility or financial institution'
      ]
    },
    {
      type: 'funds',
      title: 'Proof of Funds',
      description: 'Bank statement showing deposit funds',
      icon: File,
      acceptedFormats: 'PDF preferred (max 10MB)',
      requirements: [
        'Shows available funds for deposit',
        'Dated within last 30 days',
        'Shows account holder name matching application'
      ]
    }
  ];

  const getDocumentStatus = (type: string) => {
    const doc = documents?.find((d: KYCDocument) => d.type === type);
    return doc?.status || 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />\n  );
      case 'uploaded':
        return <RefreshCw className="w-5 h-5 text-yellow-600" />\n  );
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />\n  );
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />\n  );
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'uploaded':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Required';
    }
  };

  const allVerified = documentTypes.every(type => 
    getDocumentStatus(type.type) === 'verified'
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verification</h2>
          <p className="text-gray-600">
            Please upload the required documents to verify your identity and complete your reservation.
          </p>
        </div>

        {/* Progress Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Verification Progress</p>
                <p className="text-sm text-blue-700">
                  {documents?.filter((d: KYCDocument) => d.status === 'verified').length || 0} of {documentTypes.length} documents verified
                </p>
              </div>
            </div>
            {allVerified && (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
          </div>
        </div>

        {/* Document Types */}
        <div className="space-y-4 mb-6">
          {documentTypes.map((docType: any) => {
            const status = getDocumentStatus(docType.type);
            const document = documents?.find((d: KYCDocument) => d.type === docType.type);

            return (
              <div
                key={docType.type}
                className={`border rounded-lg p-4 transition-all ${
                  selectedType === docType.type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      status === 'verified' ? 'bg-green-100' :
                      status === 'uploaded' ? 'bg-yellow-100' :
                      status === 'rejected' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      <docType.icon className={`w-5 h-5 ${
                        status === 'verified' ? 'text-green-600' :
                        status === 'uploaded' ? 'text-yellow-600' :
                        status === 'rejected' ? 'text-red-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{docType.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{docType.description}</p>

                      {status === 'rejected' && document?.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                          <strong>Rejection reason:</strong> {document.rejectionReason}
                        </div>
                      )}

                      {selectedType === docType.type && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-2">Requirements:</p>
                          <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                            {docType.requirements.map((reqindex: any) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                          <p className="text-xs text-gray-500 mt-2">
                            Accepted formats: {docType.acceptedFormats}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className={`text-sm font-medium ${
                          status === 'verified' ? 'text-green-600' :
                          status === 'uploaded' ? 'text-yellow-600' :
                          status === 'rejected' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {getStatusText(status)}
                        </span>
                      </div>
                      {document?.uploadDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded {new Date(document.uploadDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {document?.fileUrl && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => window.open(document.fileUrl, '_blank')}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="View document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = document.fileUrl!;
                            link.download = document.name;
                            link.click();
                          }
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Download document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {(status === 'pending' || status === 'rejected') && (
                      <button
                        onClick={() => setSelectedType(
                          selectedType === docType.type ? null : docType.type as any
                        )}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        {selectedType === docType.type ? 'Cancel' : 'Upload'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload Zone */}
        {selectedType && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-gray-700">Drop the file here...</p>
            ) : (
              <>
                <p className="text-gray-700 mb-2">
                  Drag and drop your {documentTypes.find(d => d.type === selectedType)?.title.toLowerCase()} here
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploadDocument.isPending && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <p className="text-sm text-gray-700">Uploading document...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {uploadDocument.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">
                {uploadDocument.error?.message || 'Upload failed. Please try again.'}
              </p>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {allVerified && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Verification Complete!</p>
                <p className="text-sm text-green-800">
                  All documents have been verified. You can now proceed with your reservation.
                </p>
              </div>
            </div>
            {onComplete && (
              <button
                onClick={onComplete}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">Need help?</p>
              <p>
                Documents are typically verified within 24 hours. If you have any questions or 
                issues with the verification process, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}