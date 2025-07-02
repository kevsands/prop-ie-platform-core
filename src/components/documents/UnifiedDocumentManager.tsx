'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Shield,
  Building2,
  User,
  CreditCard,
  MapPin,
  Eye,
  Download,
  Plus,
  Filter
} from 'lucide-react';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';

// Document categories from the excellent first-time-buyers system
const documentCategories = [
  {
    id: 'identity',
    title: 'Identity Verification',
    description: 'Documents to verify your identity',
    icon: <User className="w-5 h-5" />,
    color: 'blue',
    route: '/first-time-buyers/documents#identity',
    documents: [
      {
        id: 'passport',
        name: 'Passport',
        description: 'Valid passport photo page',
        required: true,
        status: 'pending'
      },
      {
        id: 'driving_license',
        name: 'Driving License',
        description: 'Valid Irish or EU driving license',
        required: true,
        status: 'pending'
      },
      {
        id: 'pps_number',
        name: 'PPS Number Documentation',
        description: 'Public Services Card or other PPS documentation',
        required: true,
        status: 'pending'
      }
    ]
  },
  {
    id: 'address',
    title: 'Address Verification',
    description: 'Proof of current address',
    icon: <Building2 className="w-5 h-5" />,
    color: 'green',
    route: '/first-time-buyers/documents#address',
    documents: [
      {
        id: 'utility_bill',
        name: 'Utility Bill',
        description: 'Electricity, gas, or water bill (less than 3 months old)',
        required: true,
        status: 'pending'
      },
      {
        id: 'bank_statement',
        name: 'Bank Statement',
        description: 'Recent bank statement (less than 3 months old)',
        required: true,
        status: 'pending'
      }
    ]
  },
  {
    id: 'employment',
    title: 'Employment & Income',
    description: 'Documents proving your employment and income',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'purple',
    route: '/first-time-buyers/documents#employment',
    documents: [
      {
        id: 'employment_contract',
        name: 'Employment Contract',
        description: 'Current employment contract or letter',
        required: true,
        status: 'pending'
      },
      {
        id: 'payslips',
        name: 'Recent Payslips',
        description: 'Last 3 months payslips',
        required: true,
        status: 'pending'
      }
    ]
  },
  {
    id: 'htb',
    title: 'Help-to-Buy',
    description: 'Revenue Help-to-Buy scheme documents',
    icon: <Building2 className="w-5 h-5" />,
    color: 'orange',
    route: '/first-time-buyers/documents#htb',
    documents: [
      {
        id: 'htb_approval',
        name: 'HTB Approval Summary',
        description: 'Help-to-Buy approval from Revenue',
        required: true,
        status: 'pending'
      }
    ]
  },
  {
    id: 'property',
    title: 'Property Documents',
    description: 'Documents related to your property purchase',
    icon: <FileText className="w-5 h-5" />,
    color: 'indigo',
    route: '/first-time-buyers/documents#property',
    documents: [
      {
        id: 'booking_form',
        name: 'Booking Form',
        description: 'Signed booking form from developer',
        required: true,
        status: 'pending'
      }
    ]
  }
];

interface UnifiedDocumentManagerProps {
  showIntegrationOptions?: boolean;
  userType?: 'first-time-buyer' | 'existing-buyer' | 'investor';
  className?: string;
}

export default function UnifiedDocumentManager({
  showIntegrationOptions = true,
  userType = 'first-time-buyer',
  className = ''
}: UnifiedDocumentManagerProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useEnterpriseAuth();
  const [selectedCategory, setSelectedCategory] = useState('identity');
  const [documentStats, setDocumentStats] = useState({
    total: 0,
    uploaded: 0,
    verified: 0,
    pending: 0
  });

  useEffect(() => {
    // Calculate document statistics
    const allDocs = documentCategories.flatMap(cat => cat.documents);
    setDocumentStats({
      total: allDocs.length,
      uploaded: allDocs.filter(doc => doc.status !== 'pending').length,
      verified: allDocs.filter(doc => doc.status === 'verified').length,
      pending: allDocs.filter(doc => doc.status === 'pending').length
    });
  }, []);

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'uploaded':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Upload className="w-4 h-4 text-gray-400" />;
    }
  };

  const selectedCategoryData = documentCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className={`bg-white rounded-xl shadow-lg border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Unified Document Manager</h2>
            <p className="text-gray-600 mt-1">
              Comprehensive document management integrating all verification systems
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-700">GDPR Compliant</span>
          </div>
        </div>

        {/* Document Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{documentStats.total}</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{documentStats.uploaded}</div>
            <div className="text-sm text-gray-600">Uploaded</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{documentStats.verified}</div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{documentStats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Integration Options */}
        {showIntegrationOptions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Choose Your Document Upload Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/first-time-buyers/documents')}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-900">Advanced Upload Center</h4>
                  <p className="text-sm text-gray-600">Full-featured document upload with categories</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => router.push('/buyer/documents')}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-900">Simple Document Manager</h4>
                  <p className="text-sm text-gray-600">Streamlined upload interface</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Document Categories</h3>
            <nav className="space-y-2">
              {documentCategories.map(category => {
                const isActive = selectedCategory === category.id;
                const completedDocs = category.documents.filter(doc => doc.status === 'verified').length;
                const totalDocs = category.documents.filter(doc => doc.required).length;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive
                        ? `${getCategoryColor(category.color)} border`
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-white' : 'bg-gray-100'
                        }`}>
                          {category.icon}
                        </div>
                        <div>
                          <p className="font-medium">{category.title}</p>
                          <p className="text-xs text-gray-500">{completedDocs}/{totalDocs} complete</p>
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${isActive ? '' : 'text-gray-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Document Details */}
          <div className="lg:col-span-3">
            {selectedCategoryData && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedCategoryData.title}</h3>
                    <p className="text-gray-600">{selectedCategoryData.description}</p>
                  </div>
                  <button
                    onClick={() => router.push(selectedCategoryData.route)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Upload Documents
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedCategoryData.documents.map(document => (
                    <div
                      key={document.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(document.status)}
                            <h4 className="font-semibold text-gray-900">{document.name}</h4>
                            {document.required && (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{document.description}</p>
                          
                          {document.status === 'verified' && (
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {document.status === 'pending' && (
                          <button
                            onClick={() => router.push(`/first-time-buyers/documents#${document.id}`)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Integration Footer */}
      <div className="p-6 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Seamless Integration</h4>
            <p className="text-sm text-gray-600">
              Your documents are synchronized across all verification systems
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
}