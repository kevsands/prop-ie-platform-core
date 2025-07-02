'use client';

import React, { useState, useEffect } from 'react';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  User, 
  MapPin,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';

interface KYCStatus {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    kycStatus: string;
  };
  verification: {
    status: string;
    progress: number;
    completedSteps: number;
    totalSteps: number;
    nextSteps: string[];
    submittedAt: string | null;
  };
  documents: {
    total: number;
    byCategory: {
      identity: any[];
      address: any[];
      financial: any[];
    };
    recent: any[];
  };
  formData: any;
  requiresAction: boolean;
}

interface KYCStatusDisplayProps {
  className?: string;
  compact?: boolean;
}

export default function KYCStatusDisplay({ className = '', compact = false }: KYCStatusDisplayProps) {
  const { user } = useEnterpriseAuth();
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKYCStatus = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/kyc/status/${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch KYC status');
      }

      setKycStatus(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching KYC status:', err);
      setError(err instanceof Error ? err.message : 'Failed to load KYC status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCStatus();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PENDING_REVIEW':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5" />;
      case 'PENDING_REVIEW':
        return <Clock className="w-5 h-5" />;
      case 'IN_PROGRESS':
        return <RefreshCw className="w-5 h-5" />;
      case 'REJECTED':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-red-200 p-6 ${className}`}>
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <h3 className="font-medium">Error Loading KYC Status</h3>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchKYCStatus}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!kycStatus) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <p className="text-gray-500">No KYC status available</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(kycStatus.verification.status)}`}>
          {getStatusIcon(kycStatus.verification.status)}
          <span className="text-sm font-medium">
            {formatStatus(kycStatus.verification.status)}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          {kycStatus.verification.progress}% complete
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getStatusColor(kycStatus.verification.status)}`}>
              {getStatusIcon(kycStatus.verification.status)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">KYC Verification Status</h3>
              <p className="text-sm text-gray-600">
                {formatStatus(kycStatus.verification.status)} • {kycStatus.verification.progress}% complete
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchKYCStatus}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Refresh status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{kycStatus.verification.completedSteps} of {kycStatus.verification.totalSteps} steps</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${kycStatus.verification.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Next Steps */}
        {kycStatus.verification.nextSteps.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Next Steps</h4>
            <ul className="space-y-2">
              {kycStatus.verification.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 mt-0.5 text-yellow-500" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Documents Summary */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-900">{kycStatus.documents.byCategory.identity.length}</div>
              <div className="text-xs text-blue-600">Identity</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-900">{kycStatus.documents.byCategory.address.length}</div>
              <div className="text-xs text-green-600">Address</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-900">{kycStatus.documents.byCategory.financial.length}</div>
              <div className="text-xs text-purple-600">Financial</div>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        {kycStatus.documents.recent.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recent Documents</h4>
            <div className="space-y-2">
              {kycStatus.documents.recent.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                      <div className="text-xs text-gray-500">
                        Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                      doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Data Summary */}
        {kycStatus.formData && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Submitted Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Full Name:</span>
                <div className="font-medium">{kycStatus.formData.fullName}</div>
              </div>
              <div>
                <span className="text-gray-500">Nationality:</span>
                <div className="font-medium">{kycStatus.formData.nationality}</div>
              </div>
              <div>
                <span className="text-gray-500">ID Type:</span>
                <div className="font-medium">{kycStatus.formData.idType?.replace('_', ' ')}</div>
              </div>
              <div>
                <span className="text-gray-500">Submitted:</span>
                <div className="font-medium">
                  {kycStatus.verification.submittedAt ? 
                    new Date(kycStatus.verification.submittedAt).toLocaleDateString() : 
                    'Not submitted'
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Required */}
        {kycStatus.requiresAction && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-900">Action Required</h5>
                <p className="text-sm text-yellow-700 mt-1">
                  Your KYC verification requires additional steps to complete. Please review the next steps above.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}