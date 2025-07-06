'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Shield,
  Lock,
  TrendingUp,
  Building,
  CreditCard,
  User,
  Calendar,
  Info
} from 'lucide-react';

interface DocumentCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  required: boolean;
  deadline?: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  description: string;
  status: 'not-uploaded' | 'uploading' | 'reviewing' | 'approved' | 'rejected';
  required: boolean;
  uploadedDate?: Date;
  reviewedDate?: Date;
  rejectionReason?: string;
  fileUrl?: string;
  validator?: string;
  acceptedFormats: string[];
  maxSize: string;
  sample?: string;
}

export default function DocumentCollectionHub() {
  const [categories] = useState<DocumentCategory[]>([
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Proof of identity for AML compliance',
      icon: User,
      required: true,
      documents: [
        {
          id: 'passport',
          name: 'Passport or Driving License',
          description: 'Valid photo ID issued by government',
          status: 'approved',
          required: true,
          acceptedFormats: ['pdf', 'jpg', 'png'],
          maxSize: '5MB',
          uploadedDate: new Date('2024-11-01'),
          reviewedDate: new Date('2024-11-02'),
          validator: 'Prop Compliance Team'
        },
        {
          id: 'proof-address',
          name: 'Proof of Address',
          description: 'Utility bill or bank statement (within 3 months)',
          status: 'approved',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '5MB',
          uploadedDate: new Date('2024-11-01'),
          reviewedDate: new Date('2024-11-02'),
          validator: 'Prop Compliance Team'
        }
      ]
    },
    {
      id: 'financial',
      title: 'Financial Documentation',
      description: 'Income and employment verification',
      icon: CreditCard,
      required: true,
      deadline: '2024-12-01',
      documents: [
        {
          id: 'p60',
          name: 'P60 End of Year Certificate',
          description: 'Latest P60 from Revenue',
          status: 'approved',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '5MB',
          uploadedDate: new Date('2024-11-05'),
          reviewedDate: new Date('2024-11-06'),
          validator: 'Bank of Ireland'
        },
        {
          id: 'payslips',
          name: 'Payslips (6 months)',
          description: 'Recent consecutive payslips',
          status: 'uploading',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '10MB'
        },
        {
          id: 'bank-statements',
          name: 'Bank Statements (6 months)',
          description: 'All accounts showing salary deposits',
          status: 'not-uploaded',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '20MB',
          sample: '/samples/bank-statement-sample.pdf'
        },
        {
          id: 'employment-letter',
          name: 'Employment Contract/Letter',
          description: 'Confirming permanent employment',
          status: 'approved',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '5MB',
          uploadedDate: new Date('2024-11-03'),
          reviewedDate: new Date('2024-11-04'),
          validator: 'Bank of Ireland'
        }
      ]
    },
    {
      id: 'htb',
      title: 'Help-to-Buy Documents',
      description: 'Required for HTB tax relief claim',
      icon: TrendingUp,
      required: true,
      documents: [
        {
          id: 'tax-returns',
          name: 'Tax Returns (4 years)',
          description: 'Revenue Form 11 or Form 12',
          status: 'approved',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '20MB',
          uploadedDate: new Date('2024-11-07'),
          reviewedDate: new Date('2024-11-08'),
          validator: 'Revenue Commissioners'
        },
        {
          id: 'htb-application',
          name: 'HTB1 Application Form',
          description: 'Completed HTB application',
          status: 'reviewing',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '5MB',
          uploadedDate: new Date('2024-11-10')
        }
      ]
    },
    {
      id: 'property',
      title: 'Property Documents',
      description: 'Development and purchase details',
      icon: Building,
      required: true,
      documents: [
        {
          id: 'booking-form',
          name: 'Booking Form',
          description: 'Signed booking agreement',
          status: 'approved',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '5MB',
          uploadedDate: new Date('2024-11-10'),
          reviewedDate: new Date('2024-11-10'),
          validator: 'Prop Sales Team'
        },
        {
          id: 'brochure',
          name: 'Development Brochure',
          description: 'Property specifications',
          status: 'approved',
          required: false,
          acceptedFormats: ['pdf'],
          maxSize: '50MB',
          uploadedDate: new Date('2024-11-10'),
          reviewedDate: new Date('2024-11-10')
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal Documents',
      description: 'Solicitor and contract documents',
      icon: Shield,
      required: true,
      deadline: '2024-12-15',
      documents: [
        {
          id: 'solicitor-letter',
          name: 'Letter of Engagement',
          description: 'From your appointed solicitor',
          status: 'not-uploaded',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '5MB'
        },
        {
          id: 'undertaking',
          name: 'Solicitor\'s Undertaking',
          description: 'For mortgage drawdown',
          status: 'not-uploaded',
          required: true,
          acceptedFormats: ['pdf'],
          maxSize: '5MB'
        }
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('identity');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'uploading':
        return <Clock className="text-blue-600 animate-pulse" size={20} />;
      case 'reviewing':
        return <Clock className="text-orange-600" size={20} />;
      case 'rejected':
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return <Upload className="text-gray-400" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'uploading':
        return 'Uploading...';
      case 'reviewing':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Uploaded';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'uploading':
        return 'text-blue-600';
      case 'reviewing':
        return 'text-orange-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const handleFileUpload = (documentId: string, file: File) => {
    // Handle file upload logic
    console.log(`Uploading ${file.name} for document ${documentId}`);
  };

  const calculateProgress = () => {
    let totalRequired = 0;
    let totalApproved = 0;

    categories.forEach(category => {
      category.documents.forEach(doc => {
        if (doc.required) {
          totalRequired++;
          if (doc.status === 'approved') {
            totalApproved++;
          }
        }
      });
    });

    return {
      percentage: Math.round((totalApproved / totalRequired) * 100),
      approved: totalApproved,
      total: totalRequired
    };
  };

  const progress = calculateProgress();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Document Collection Hub</h2>
        <p className="text-gray-600 mt-1">
          Upload and track all required documents for your property purchase
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Overall Progress</h3>
          <span className="text-2xl font-bold text-blue-600">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{progress.approved} documents approved</span>
          <span>{progress.total - progress.approved} documents remaining</span>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map(category => {
            const categoryDocs = category.documents.filter(d => d.required);
            const approvedDocs = categoryDocs.filter(d => d.status === 'approved').length;
            const isComplete = approvedDocs === categoryDocs.length;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <category.icon size={24} className={isComplete ? 'text-green-600' : 'text-gray-600'} />
                  <span className="text-sm font-medium mt-2">{category.title}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {approvedDocs}/{categoryDocs.length}
                  </span>
                  {category.deadline && (
                    <span className="text-xs text-red-600 mt-1">
                      Due: {new Date(category.deadline).toLocaleDateString('en-IE')}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {categories
          .filter(cat => cat.id === selectedCategory)
          .map(category => (
            <div key={category.id}>
              <div className="mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <category.icon className="mr-3 text-gray-600" />
                  {category.title}
                </h3>
                <p className="text-gray-600 mt-1">{category.description}</p>
              </div>

              <div className="space-y-4">
                {category.documents.map(document => (
                  <div
                    key={document.id}
                    className={`border rounded-lg p-4 ${
                      document.status === 'rejected' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {getStatusIcon(document.status)}
                          <h4 className="text-lg font-medium ml-2">{document.name}</h4>
                          {document.required && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{document.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`font-medium ${getStatusColor(document.status)}`}>
                            {getStatusText(document.status)}
                          </span>
                          {document.uploadedDate && (
                            <span className="text-gray-500">
                              Uploaded: {document.uploadedDate.toLocaleDateString('en-IE')}
                            </span>
                          )}
                          {document.validator && (
                            <span className="text-gray-500">
                              Validated by: {document.validator}
                            </span>
                          )}
                        </div>

                        {document.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-100 rounded-lg">
                            <p className="text-red-800 text-sm">{document.rejectionReason}</p>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          <span>Accepted: {document.acceptedFormats.join(', ')}</span>
                          <span>•</span>
                          <span>Max size: {document.maxSize}</span>
                          {document.sample && (
                            <>
                              <span>•</span>
                              <a href={document.sample} className="text-blue-600 hover:underline">
                                View sample
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        {document.status === 'approved' ? (
                          <>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center">
                              <Eye size={16} className="mr-2" />
                              View
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center">
                              <Download size={16} className="mr-2" />
                              Download
                            </button>
                          </>
                        ) : document.status === 'not-uploaded' || document.status === 'rejected' ? (
                          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center">
                            <Upload size={16} className="mr-2" />
                            Upload
                            <input
                              type="file"
                              className="hidden"
                              accept={document.acceptedFormats.map(f => `.${f}`).join(',')}
                              onChange={(e) => e.target.files && handleFileUpload(document.id, e.target.files[0])}
                            />
                          </label>
                        ) : (
                          <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-center">
                            {document.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Security Notice */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <Lock className="text-blue-600 mr-3 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900">Bank-Grade Security</h4>
            <p className="text-blue-800 text-sm mt-1">
              All documents are encrypted and stored securely. Only authorized parties 
              (you, your solicitor, and your lender) can access your documents.
            </p>
          </div>
        </div>
      </div>

      {/* GDPR Notice */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="text-gray-600 mr-3 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900">GDPR Compliance</h4>
            <p className="text-gray-700 text-sm mt-1">
              Your data is processed in accordance with GDPR. Documents are retained for 7 years 
              as required by Irish law and permanently deleted thereafter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}