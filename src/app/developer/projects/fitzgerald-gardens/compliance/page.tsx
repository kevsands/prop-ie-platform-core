'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Calendar, 
  ArrowLeft,
  Download,
  Upload,
  ExternalLink,
  User,
  Building,
  Shield,
  AlertTriangle,
  Info,
  Plus,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function FitzgeraldGardensCompliancePage() {
  const [activeTabsetActiveTab] = useState('overview');

  const complianceItems = [
    {
      id: 1,
      title: 'Planning Permission',
      reference: 'LH/25/0234',
      status: 'approved',
      authority: 'Louth County Council',
      submittedDate: '2024-12-15',
      decisionDate: '2025-03-20',
      expiryDate: '2030-03-20',
      conditions: 15,
      category: 'planning',
      priority: 'high',
      description: 'Full planning permission for 97 residential units',
      documents: [
        { name: 'Planning Decision Notice.pdf', size: '2.1 MB' },
        { name: 'Approved Plans.pdf', size: '15.8 MB' },
        { name: 'Planning Conditions.pdf', size: '1.2 MB' }
      ]
    },
    {
      id: 2,
      title: 'Building Control Application',
      reference: 'BC/25/0112',
      status: 'in_progress',
      authority: 'Louth County Council',
      submittedDate: '2025-04-10',
      decisionDate: null,
      expiryDate: null,
      conditions: 0,
      category: 'building_control',
      priority: 'high',
      description: 'Building control approval for construction works',
      documents: [
        { name: 'Building Control Application.pdf', size: '8.5 MB' },
        { name: 'Structural Calculations.pdf', size: '12.3 MB' }
      ]
    },
    {
      id: 3,
      title: 'Fire Safety Certificate',
      reference: 'FSC/25/0089',
      status: 'pending',
      authority: 'Building Control Authority',
      submittedDate: '2025-05-15',
      decisionDate: null,
      expiryDate: null,
      conditions: 0,
      category: 'fire_safety',
      priority: 'high',
      description: 'Fire safety certificate for all residential blocks',
      documents: [
        { name: 'Fire Safety Application.pdf', size: '6.7 MB' },
        { name: 'Fire Strategy Report.pdf', size: '4.2 MB' }
      ]
    },
    {
      id: 4,
      title: 'Environmental Impact Assessment',
      reference: 'EIA/24/0156',
      status: 'approved',
      authority: 'EPA Ireland',
      submittedDate: '2024-08-20',
      decisionDate: '2024-11-30',
      expiryDate: '2029-11-30',
      conditions: 8,
      category: 'environmental',
      priority: 'medium',
      description: 'Environmental impact assessment and mitigation measures',
      documents: [
        { name: 'EIA Report.pdf', size: '25.6 MB' },
        { name: 'Environmental Conditions.pdf', size: '3.1 MB' }
      ]
    },
    {
      id: 5,
      title: 'Disability Access Certificate',
      reference: 'DAC/25/0067',
      status: 'expired',
      authority: 'Louth County Council',
      submittedDate: '2024-06-10',
      decisionDate: '2024-09-15',
      expiryDate: '2025-06-10',
      conditions: 3,
      category: 'accessibility',
      priority: 'high',
      description: 'Disability access compliance certificate - RENEWAL REQUIRED',
      documents: [
        { name: 'DAC Application.pdf', size: '4.1 MB' },
        { name: 'Access Drawings.pdf', size: '8.9 MB' }
      ]
    }
  ];

  const upcomingDeadlines = [
    { title: 'Fire Safety Certificate Decision', date: '2025-07-15', days: 30, type: 'decision' },
    { title: 'Planning Condition 12 - Landscaping Plan', date: '2025-07-01', days: 16, type: 'condition' },
    { title: 'Building Control Inspection - Phase 1', date: '2025-06-25', days: 10, type: 'inspection' },
    { title: 'DAC Renewal Application Due', date: '2025-06-20', days: 5, type: 'renewal' },
  ];

  const planningConditions = [
    {
      id: 1,
      number: 'Condition 3',
      title: 'Construction Management Plan',
      status: 'completed',
      dueDate: '2025-04-01',
      description: 'Submit detailed construction management plan including traffic management',
      compliance: 'Submitted and approved by Louth County Council on 2025-03-28'
    },
    {
      id: 2,
      number: 'Condition 7',
      title: 'Drainage Strategy Implementation',
      status: 'in_progress',
      dueDate: '2025-08-15',
      description: 'Implement sustainable drainage systems as per approved plans',
      compliance: 'Installation 65% complete. On track for August deadline.'
    },
    {
      id: 3,
      number: 'Condition 12',
      title: 'Landscaping Plan Submission',
      status: 'pending',
      dueDate: '2025-07-01',
      description: 'Submit detailed landscaping plan for common areas and boundaries',
      compliance: 'Landscape architect appointed. Plan preparation in progress.'
    },
    {
      id: 4,
      number: 'Condition 15',
      title: 'Archaeological Monitoring',
      status: 'overdue',
      dueDate: '2025-05-01',
      description: 'Continuous archaeological monitoring during excavation works',
      compliance: 'Monitoring report for April overdue. Archaeologist to submit by 2025-06-20.'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />\n  );
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />\n  );
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />\n  );
      case 'expired':
      case 'rejected':
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />\n  );
      default:
        return <Info className="w-5 h-5 text-gray-600" />\n  );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'planning': return <Building className="w-5 h-5" />\n  );
      case 'building_control': return <Shield className="w-5 h-5" />\n  );
      case 'fire_safety': return <AlertTriangle className="w-5 h-5" />\n  );
      case 'environmental': return <FileText className="w-5 h-5" />\n  );
      case 'accessibility': return <User className="w-5 h-5" />\n  );
      default: return <FileText className="w-5 h-5" />\n  );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/developer/projects/fitzgerald-gardens" 
                    className="flex items-center text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Project
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Planning & Compliance</h1>
                <p className="text-sm text-gray-500">Fitzgerald Gardens - Regulatory Requirements</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'applications', label: 'Applications' },
                { key: 'conditions', label: 'Planning Conditions' },
                { key: 'deadlines', label: 'Upcoming Deadlines' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {complianceItems.filter(item => item.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {complianceItems.filter(item => item.status === 'in_progress').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {complianceItems.filter(item => item.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Issues</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {complianceItems.filter(item => item.status === 'expired' || item.status === 'overdue').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgent Items */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Urgent Actions Required</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingDeadlines.filter(deadline => deadline.days <= 14).map((deadlineindex) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-900">{deadline.title}</p>
                          <p className="text-sm text-red-700">Due: {deadline.date} ({deadline.days} days)</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                        Take Action
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {complianceItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getCategoryIcon(item.category)}
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        {item.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            High Priority
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Reference</p>
                          <p className="font-medium text-gray-900">{item.reference}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Authority</p>
                          <p className="font-medium text-gray-900">{item.authority}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Submitted</p>
                          <p className="font-medium text-gray-900">{new Date(item.submittedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Decision Date</p>
                          <p className="font-medium text-gray-900">
                            {item.decisionDate ? new Date(item.decisionDate).toLocaleDateString() : 'Pending'}
                          </p>
                        </div>
                      </div>

                      {item.conditions> 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>{item.conditions} conditions</strong> attached to this approval
                          </p>
                        </div>
                      )}

                      {/* Documents */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Documents</h4>
                        <div className="space-y-2">
                          {item.documents.map((docindex) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-900">{doc.name}</span>
                                <span className="text-xs text-gray-500">({doc.size})</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-500">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-blue-600 hover:text-blue-500">
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Planning Conditions Tab */}
        {activeTab === 'conditions' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Planning Conditions</h2>
              <p className="text-sm text-gray-500 mt-1">Track compliance with planning permission conditions</p>
            </div>
            <div className="divide-y divide-gray-200">
              {planningConditions.map((condition) => (
                <div key={condition.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-500">{condition.number}</span>
                        <h3 className="text-lg font-medium text-gray-900">{condition.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(condition.status)}`}>
                          {condition.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{condition.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {new Date(condition.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{condition.compliance}</p>
                      </div>
                    </div>

                    <div className="ml-6">
                      {getStatusIcon(condition.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deadlines Tab */}
        {activeTab === 'deadlines' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
              <p className="text-sm text-gray-500 mt-1">Important dates and deadlines to track</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingDeadlines.map((deadlineindex) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    deadline.days <= 7 ? 'bg-red-50 border-red-200' :
                    deadline.days <= 14 ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{deadline.title}</h3>
                        <p className="text-sm text-gray-600">
                          {deadline.date} • {deadline.days} days remaining
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          deadline.days <= 7 ? 'bg-red-100 text-red-800' :
                          deadline.days <= 14 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {deadline.type}
                        </span>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}