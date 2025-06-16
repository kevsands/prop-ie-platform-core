'use client';

import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { 
  Euro, 
  Calculator, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload,
  ExternalLink,
  TrendingUp,
  Info,
  ArrowRight,
  Timer,
  Building2,
  User
} from 'lucide-react';
import Link from 'next/link';

interface HTBApplication {
  id: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'paid';
  submissionDate?: string;
  approvalDate?: string;
  paymentDate?: string;
  amount: number;
  property?: {
    id: string;
    title: string;
    price: number;
    developer: string;
  };
  documents: {
    name: string;
    status: 'required' | 'uploaded' | 'verified';
    uploadDate?: string;
  }[];
  timeline: {
    stage: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
    description: string;
  }[];
}

interface HTBDashboardProps {
  className?: string;
}

export const HTBDashboard: React.FC<HTBDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  // Initialize Sentry performance monitoring
  useEffect(() => {
    try {
      // Track component initialization
      Sentry.addBreadcrumb({
        message: 'HTB Dashboard initialized',
        level: 'info',
        category: 'ui.component'
      });
      
      Sentry.setTag('component', 'HTBDashboard');
      Sentry.setContext('htb_application', {
        status: 'in_progress',
        amount: 30000
      });
      
    } catch (error) {
      Sentry.captureException(error);
      setError('Failed to initialize HTB Dashboard');
    }
  }, []);

  // Monitor tab changes with performance tracking
  const handleTabChange = (tabId: string) => {
    try {
      setActiveTab(tabId);
      
      Sentry.addBreadcrumb({
        message: `HTB Dashboard tab changed to ${tabId}`,
        level: 'info',
        category: 'ui.click',
        data: { tab: tabId }
      });
      
      Sentry.setTag('current_tab', tabId);
      
    } catch (error) {
      Sentry.captureException(error);
      setError('Failed to change tab');
    }
  };

  // Mock HTB application data
  const htbApplication: HTBApplication = {
    id: 'HTB-2024-001',
    status: 'in_progress',
    submissionDate: '2024-03-15',
    amount: 30000,
    property: {
      id: '1',
      title: 'Fitzgerald Gardens - Unit 23',
      price: 385000,
      developer: 'Premium Developments'
    },
    documents: [
      { name: 'P60 Form (Year 1)', status: 'verified', uploadDate: '2024-03-10' },
      { name: 'P60 Form (Year 2)', status: 'verified', uploadDate: '2024-03-10' },
      { name: 'P60 Form (Year 3)', status: 'verified', uploadDate: '2024-03-10' },
      { name: 'P60 Form (Year 4)', status: 'verified', uploadDate: '2024-03-10' },
      { name: 'Bank Statements', status: 'uploaded', uploadDate: '2024-03-12' },
      { name: 'Property Purchase Contract', status: 'required' },
      { name: 'Solicitor Confirmation', status: 'required' }
    ],
    timeline: [
      {
        stage: 'Eligibility Check',
        status: 'completed',
        date: '2024-03-10',
        description: 'Verified first-time buyer status and property eligibility'
      },
      {
        stage: 'Document Upload',
        status: 'completed',
        date: '2024-03-12',
        description: 'Uploaded required tax documents and bank statements'
      },
      {
        stage: 'Application Review',
        status: 'current',
        description: 'Revenue reviewing submitted documentation'
      },
      {
        stage: 'Approval',
        status: 'pending',
        description: 'Final approval and HTB certificate generation'
      },
      {
        stage: 'Payment',
        status: 'pending',
        description: 'HTB refund paid to solicitor at property closing'
      }
    ]
  };

  const getStatusColor = (status: HTBApplication['status']) => {
    switch (status) {
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'submitted': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'paid': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: HTBApplication['status']) => {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'approved': return 'Approved';
      case 'paid': return 'Completed';
      default: return 'Unknown';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Euro },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'calculator', label: 'Calculator', icon: Calculator }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">Error</p>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 underline text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Euro className="w-6 h-6 text-green-600" />
              Help-to-Buy Management
            </h2>
            <p className="text-gray-600 mt-1">
              Track your HTB application and manage the refund process
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(htbApplication.status)}`}>
              {getStatusText(htbApplication.status)}
            </div>
            {htbApplication.id && (
              <p className="text-sm text-gray-500 mt-1">ID: {htbApplication.id}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="HTB Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* HTB Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">HTB Refund Amount</h3>
                <p className="text-3xl font-bold text-green-600">
                  €{htbApplication.amount.toLocaleString()}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  10% of property price
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Application Progress</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">60%</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  2 of 5 stages completed
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">Est. Completion</h3>
                <p className="text-xl font-bold text-purple-600">
                  4-6 weeks
                </p>
                <p className="text-sm text-purple-700 mt-1">
                  From application submission
                </p>
              </div>
            </div>

            {/* Property Details */}
            {htbApplication.property && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Associated Property
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Property:</span>
                    <p className="font-medium">{htbApplication.property.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Purchase Price:</span>
                    <p className="font-medium">€{htbApplication.property.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Developer:</span>
                    <p className="font-medium">{htbApplication.property.developer}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Effective Price:</span>
                    <p className="font-medium text-green-600">
                      €{(htbApplication.property.price - htbApplication.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/buyer/htb/documents"
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Upload Documents</p>
                    <p className="text-sm text-gray-600">3 documents pending</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
              
              <Link
                href="/buyer/htb/status"
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Check Status</p>
                    <p className="text-sm text-gray-600">Last updated 2 days ago</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
              <button 
                onClick={() => {
                  try {
                    Sentry.addBreadcrumb({
                      message: 'HTB document upload initiated',
                      level: 'info',
                      category: 'ui.click'
                    });
                    // Document upload logic would go here
                  } catch (error) {
                    Sentry.captureException(error);
                    setError('Failed to initiate document upload');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>
            
            <div className="space-y-3">
              {htbApplication.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-600' :
                      doc.status === 'uploaded' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {doc.status === 'verified' ? <CheckCircle className="w-4 h-4" /> :
                       doc.status === 'uploaded' ? <Clock className="w-4 h-4" /> :
                       <AlertCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      {doc.uploadDate && (
                        <p className="text-sm text-gray-600">Uploaded {doc.uploadDate}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.status === 'required' && (
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Upload
                      </button>
                    )}
                    {doc.status !== 'required' && (
                      <button className="text-gray-600 hover:text-gray-700">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Application Timeline</h3>
            
            <div className="space-y-6">
              {htbApplication.timeline.map((stage, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stage.status === 'completed' ? 'bg-green-100 text-green-600' :
                      stage.status === 'current' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {stage.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                       stage.status === 'current' ? <Timer className="w-4 h-4" /> :
                       <Clock className="w-4 h-4" />}
                    </div>
                    {index < htbApplication.timeline.length - 1 && (
                      <div className={`w-px h-12 ${
                        stage.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                      {stage.date && (
                        <span className="text-sm text-gray-500">{stage.date}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">HTB Calculator</h3>
              <Link
                href="/calculators/help-to-buy"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                Open Full Calculator
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-4">Quick Calculation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Price
                  </label>
                  <input
                    type="number"
                    defaultValue={htbApplication.property?.price || 350000}
                    onChange={(e) => {
                      try {
                        const price = parseFloat(e.target.value);
                        if (price > 0) {
                          Sentry.addBreadcrumb({
                            message: `HTB calculator price updated to €${price.toLocaleString()}`,
                            level: 'info',
                            category: 'ui.input',
                            data: { price }
                          });
                        }
                      } catch (error) {
                        Sentry.captureException(error);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HTB Refund (10%)
                  </label>
                  <div className="px-3 py-2 bg-green-100 border border-green-300 rounded-lg">
                    <span className="font-semibold text-green-800">
                      €{htbApplication.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HTBDashboard;