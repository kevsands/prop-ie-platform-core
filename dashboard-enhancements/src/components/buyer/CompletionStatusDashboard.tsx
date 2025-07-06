'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { completionStatementService } from '@/services/CompletionStatementService';
import { rosieIntegrationService } from '@/services/ROSIeIntegrationService';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  RefreshCw,
  Home,
  Calendar,
  DollarSign,
  User,
  Building,
  Heart,
  Shield,
  Info
} from 'lucide-react';

interface CompletionStatus {
  propertyId: string;
  propertyAddress: string;
  purchasePrice: number;
  completionDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  htbAmount?: number;
  milestones: CompletionMilestone[];
  documents: CompletionDocument[];
  stakeholders: StakeholderStatus[];
  nextActions: NextAction[];
  rosieIntegration?: ROSIeIntegrationStatus;
}

interface CompletionMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'blocked';
  completedDate?: Date;
  expectedDate?: Date;
  responsible: string;
  dependencies?: string[];
}

interface CompletionDocument {
  id: string;
  name: string;
  type: 'contract' | 'certificate' | 'financial' | 'legal' | 'htb';
  status: 'required' | 'uploaded' | 'verified' | 'signed';
  uploadedDate?: Date;
  expiryDate?: Date;
  downloadUrl?: string;
}

interface StakeholderStatus {
  role: 'buyer' | 'developer' | 'solicitor' | 'agent' | 'lender';
  name: string;
  status: 'pending' | 'ready' | 'completed';
  lastUpdate: Date;
  contact?: string;
}

interface NextAction {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  responsible: string;
  category: 'document' | 'payment' | 'verification' | 'htb' | 'general';
}

interface ROSIeIntegrationStatus {
  connected: boolean;
  lastSync?: Date;
  htbClaimsStatus: any[];
  completionCertificate?: string;
  errors?: string[];
}

export default function CompletionStatusDashboard() {
  const { user } = useAuth();
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCompletionStatus();
    }
  }, [user]);

  const loadCompletionStatus = async () => {
    try {
      setError(null);
      // Get user's active property transaction
      const response = await fetch(`/api/buyer/${user?.id}/completion-status`);
      
      if (!response.ok) {
        throw new Error('Failed to load completion status');
      }

      const data = await response.json();
      setCompletionStatus(data);
    } catch (err) {
      console.error('Error loading completion status:', err);
      setError(err instanceof Error ? err.message : 'Failed to load completion status');
      
      // Fallback to demo data for development
      if (process.env.NODE_ENV === 'development') {
        setCompletionStatus(getDemoCompletionStatus());
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    setRefreshing(true);
    try {
      // Sync with ROS.ie first
      if (completionStatus?.rosieIntegration?.connected) {
        await rosieIntegrationService.syncAllHTBClaims(user?.id || '');
      }
      
      // Reload status
      await loadCompletionStatus();
    } catch (err) {
      console.error('Error refreshing status:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'current': case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'blocked': case 'delayed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-80 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !completionStatus) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Unable to Load Completion Status</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadCompletionStatus}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!completionStatus) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Home className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">No Active Property Transaction</h3>
          <p className="text-blue-700">You don't have any active property transactions requiring completion tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Completion Status</h1>
          <p className="text-gray-600 mt-1">{completionStatus.propertyAddress}</p>
        </div>
        <button
          onClick={refreshStatus}
          disabled={refreshing}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Completion Overview</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(completionStatus.status)}`}>
                {completionStatus.status.charAt(0).toUpperCase() + completionStatus.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(completionStatus.purchasePrice)}
                </div>
                <div className="text-sm text-gray-600">Purchase Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completionStatus.progress}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
              {completionStatus.htbAmount && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(completionStatus.htbAmount)}
                  </div>
                  <div className="text-sm text-gray-600">HTB Amount</div>
                </div>
              )}
              {completionStatus.completionDate && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Date(completionStatus.completionDate).toLocaleDateString('en-IE')}
                  </div>
                  <div className="text-sm text-gray-600">Completion Date</div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionStatus.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Completion Milestones</h2>
            <div className="space-y-4">
              {completionStatus.milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {milestone.status === 'completed' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : milestone.status === 'current' ? (
                      <Clock className="h-6 w-6 text-blue-600" />
                    ) : milestone.status === 'blocked' ? (
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                      <span className="text-sm text-gray-500">{milestone.responsible}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {milestone.completedDate && (
                        <span>Completed: {new Date(milestone.completedDate).toLocaleDateString('en-IE')}</span>
                      )}
                      {milestone.expectedDate && !milestone.completedDate && (
                        <span>Expected: {new Date(milestone.expectedDate).toLocaleDateString('en-IE')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completionStatus.documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{doc.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  {doc.uploadedDate && (
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.uploadedDate).toLocaleDateString('en-IE')}
                    </p>
                  )}
                  {doc.downloadUrl && (
                    <button className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Next Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Actions</h2>
            <div className="space-y-3">
              {completionStatus.nextActions.slice(0, 5).map((action) => (
                <div key={action.id} className={`border rounded-lg p-3 ${getPriorityColor(action.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{action.title}</h4>
                      <p className="text-xs mt-1 opacity-90">{action.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span>{action.responsible}</span>
                        {action.dueDate && (
                          <span>• Due: {new Date(action.dueDate).toLocaleDateString('en-IE')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholders */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stakeholders</h2>
            <div className="space-y-3">
              {completionStatus.stakeholders.map((stakeholder) => (
                <div key={stakeholder.role} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{stakeholder.name}</div>
                    <div className="text-xs text-gray-600 capitalize">{stakeholder.role}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stakeholder.status)}`}>
                    {stakeholder.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ROS.ie Integration Status */}
          {completionStatus.rosieIntegration && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ROS.ie Integration</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Connection Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    completionStatus.rosieIntegration.connected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                  }`}>
                    {completionStatus.rosieIntegration.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {completionStatus.rosieIntegration.lastSync && (
                  <div className="text-xs text-gray-500">
                    Last sync: {new Date(completionStatus.rosieIntegration.lastSync).toLocaleString('en-IE')}
                  </div>
                )}
                {completionStatus.rosieIntegration.htbClaimsStatus.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">HTB Claims</div>
                    {completionStatus.rosieIntegration.htbClaimsStatus.map((claim, index) => (
                      <div key={index} className="text-xs text-gray-600 p-2 bg-gray-50 rounded border">
                        Claim: {claim.claimCode} - {claim.status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getDemoCompletionStatus(): CompletionStatus {
  return {
    propertyId: 'prop-fitzgerald-unit-12',
    propertyAddress: 'Unit 12, Fitzgerald Gardens, Drogheda, Co. Louth',
    purchasePrice: 350000,
    completionDate: new Date('2024-07-15'),
    status: 'in_progress',
    progress: 75,
    htbAmount: 30000,
    milestones: [
      {
        id: 'milestone-1',
        title: 'Contracts Exchanged',
        description: 'Purchase contracts signed by all parties',
        status: 'completed',
        completedDate: new Date('2024-03-15'),
        responsible: 'Solicitor'
      },
      {
        id: 'milestone-2',
        title: 'Mortgage Approved',
        description: 'Mortgage application approved and funds committed',
        status: 'completed',
        completedDate: new Date('2024-04-01'),
        responsible: 'Lender'
      },
      {
        id: 'milestone-3',
        title: 'HTB Claim Processed',
        description: 'Help-to-Buy claim submitted and approved via ROS.ie',
        status: 'current',
        expectedDate: new Date('2024-06-30'),
        responsible: 'Revenue Commissioners'
      },
      {
        id: 'milestone-4',
        title: 'Final Inspection',
        description: 'Final property inspection and snag list completion',
        status: 'pending',
        expectedDate: new Date('2024-07-10'),
        responsible: 'Developer'
      },
      {
        id: 'milestone-5',
        title: 'Completion',
        description: 'Final completion and key handover',
        status: 'pending',
        expectedDate: new Date('2024-07-15'),
        responsible: 'Solicitor'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Purchase Contract',
        type: 'contract',
        status: 'signed',
        uploadedDate: new Date('2024-03-15'),
        downloadUrl: '/documents/contract.pdf'
      },
      {
        id: 'doc-2',
        name: 'Mortgage Approval Letter',
        type: 'financial',
        status: 'verified',
        uploadedDate: new Date('2024-04-01'),
        downloadUrl: '/documents/mortgage.pdf'
      },
      {
        id: 'doc-3',
        name: 'HTB Certificate',
        type: 'htb',
        status: 'verified',
        uploadedDate: new Date('2024-02-01'),
        downloadUrl: '/documents/htb-cert.pdf'
      },
      {
        id: 'doc-4',
        name: 'Completion Certificate',
        type: 'certificate',
        status: 'required',
        expiryDate: new Date('2024-07-15')
      }
    ],
    stakeholders: [
      {
        role: 'buyer',
        name: 'John Doe',
        status: 'ready',
        lastUpdate: new Date(),
        contact: 'john.doe@email.com'
      },
      {
        role: 'developer',
        name: 'Fitzgerald Developments Ltd',
        status: 'completed',
        lastUpdate: new Date('2024-06-15'),
        contact: 'info@fitzgeralddev.ie'
      },
      {
        role: 'solicitor',
        name: 'O\'Brien & Associates',
        status: 'pending',
        lastUpdate: new Date('2024-06-10'),
        contact: 'completion@obrienlaw.ie'
      },
      {
        role: 'lender',
        name: 'Bank of Ireland',
        status: 'completed',
        lastUpdate: new Date('2024-04-01'),
        contact: 'mortgages@boi.com'
      }
    ],
    nextActions: [
      {
        id: 'action-1',
        title: 'Submit Claim Code',
        description: 'Submit HTB claim code to developer for processing',
        priority: 'high',
        dueDate: new Date('2024-06-25'),
        responsible: 'Buyer',
        category: 'htb'
      },
      {
        id: 'action-2',
        title: 'Schedule Final Inspection',
        description: 'Arrange final property inspection with developer',
        priority: 'medium',
        dueDate: new Date('2024-07-05'),
        responsible: 'Solicitor',
        category: 'general'
      },
      {
        id: 'action-3',
        title: 'Insurance Arrangement',
        description: 'Arrange property insurance for completion date',
        priority: 'medium',
        dueDate: new Date('2024-07-10'),
        responsible: 'Buyer',
        category: 'general'
      }
    ],
    rosieIntegration: {
      connected: true,
      lastSync: new Date(),
      htbClaimsStatus: [
        {
          claimCode: 'HTB2024001234',
          status: 'approved',
          amount: 30000
        }
      ],
      completionCertificate: undefined,
      errors: []
    }
  };
}