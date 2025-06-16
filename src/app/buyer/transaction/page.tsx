'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Circle, 
  Home, 
  FileText, 
  CreditCard, 
  Shield, 
  Calendar, 
  User, 
  Building2, 
  Heart, 
  Euro, 
  ArrowRight, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin,
  Download,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Bell,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { format, addDays } from 'date-fns';

interface TransactionStage {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  estimatedDuration: string;
  actualDuration?: string;
  startDate?: Date;
  completedDate?: Date;
  estimatedCompletion?: Date;
  dependencies: string[];
  documents: TransactionDocument[];
  contacts: TransactionContact[];
  milestones: Milestone[];
  notes?: string;
}

interface TransactionDocument {
  id: string;
  name: string;
  status: 'required' | 'uploaded' | 'approved' | 'rejected';
  dueDate?: Date;
  uploadDate?: Date;
  reviewedBy?: string;
  notes?: string;
}

interface TransactionContact {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  status: 'assigned' | 'active' | 'completed';
}

interface Milestone {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  date?: Date;
  amount?: number;
  description: string;
}

interface PropertyTransaction {
  id: string;
  propertyName: string;
  propertyAddress: string;
  purchasePrice: number;
  htbAmount: number;
  mortgageAmount: number;
  depositPaid: number;
  reservationDate: Date;
  expectedCompletionDate: Date;
  currentStage: string;
  overallProgress: number;
}

export default function TransactionPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<string>('TXN-001');
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline' | 'contacts'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Mock transaction data
  const transaction: PropertyTransaction = {
    id: 'TXN-001',
    propertyName: 'Fitzgerald Gardens Unit 23',
    propertyAddress: 'Fitzgerald Gardens, Ballincollig, Cork',
    purchasePrice: 385000,
    htbAmount: 30000,
    mortgageAmount: 320000,
    depositPaid: 5500,
    reservationDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    expectedCompletionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    currentStage: 'mortgage_approval',
    overallProgress: 65
  };

  const stages: TransactionStage[] = [
    {
      id: 'reservation',
      name: 'Property Reservation',
      description: 'Secure your chosen property with initial deposit',
      status: 'completed',
      estimatedDuration: '1-2 days',
      actualDuration: '1 day',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      completedDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      dependencies: [],
      documents: [
        {
          id: 'DOC-001',
          name: 'Reservation Agreement',
          status: 'approved',
          uploadDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
          reviewedBy: 'Legal Team'
        }
      ],
      contacts: [
        {
          id: 'CON-001',
          name: 'Sarah Murphy',
          role: 'Sales Agent',
          company: 'Premium Developments',
          phone: '+353 21 123 4567',
          email: 'sarah.murphy@premiumdev.ie',
          status: 'completed'
        }
      ],
      milestones: [
        {
          id: 'MIL-001',
          name: 'Booking Deposit Paid',
          status: 'completed',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          amount: 500,
          description: 'Initial booking deposit to secure property'
        },
        {
          id: 'MIL-002',
          name: 'Reservation Deposit Paid',
          status: 'completed',
          date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
          amount: 5000,
          description: 'Full reservation deposit paid'
        }
      ]
    },
    {
      id: 'mortgage_approval',
      name: 'Mortgage Approval',
      description: 'Secure final mortgage approval and arrange financing',
      status: 'in_progress',
      estimatedDuration: '4-6 weeks',
      startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      estimatedCompletion: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      dependencies: ['reservation'],
      documents: [
        {
          id: 'DOC-002',
          name: 'Mortgage Application',
          status: 'approved',
          uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          reviewedBy: 'Bank of Ireland'
        },
        {
          id: 'DOC-003',
          name: 'Property Valuation',
          status: 'uploaded',
          uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'DOC-004',
          name: 'Final Mortgage Offer',
          status: 'required',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        }
      ],
      contacts: [
        {
          id: 'CON-002',
          name: 'Michael O\'Brien',
          role: 'Mortgage Advisor',
          company: 'Bank of Ireland',
          phone: '+353 21 987 6543',
          email: 'michael.obrien@boi.com',
          status: 'active'
        }
      ],
      milestones: [
        {
          id: 'MIL-003',
          name: 'Mortgage Application Submitted',
          status: 'completed',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          description: 'Full mortgage application submitted to bank'
        },
        {
          id: 'MIL-004',
          name: 'Property Valuation Completed',
          status: 'in_progress',
          description: 'Professional property valuation for mortgage'
        },
        {
          id: 'MIL-005',
          name: 'Final Mortgage Approval',
          status: 'pending',
          description: 'Receive final mortgage approval letter'
        }
      ]
    },
    {
      id: 'legal_process',
      name: 'Legal Process',
      description: 'Legal review, contract preparation and signing',
      status: 'pending',
      estimatedDuration: '3-4 weeks',
      dependencies: ['mortgage_approval'],
      documents: [
        {
          id: 'DOC-005',
          name: 'Solicitor Appointment',
          status: 'required',
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'DOC-006',
          name: 'Contract Review',
          status: 'required'
        },
        {
          id: 'DOC-007',
          name: 'Contract Signing',
          status: 'required'
        }
      ],
      contacts: [
        {
          id: 'CON-003',
          name: 'O\'Brien & Associates',
          role: 'Solicitor',
          company: 'O\'Brien & Associates Legal',
          phone: '+353 1 234 5678',
          email: 'cases@obrienlaw.ie',
          status: 'auto_assigned',
          caseNumber: 'FG202506001',
          assignedDate: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          specialization: 'Property Law & HTB Specialist'
        }
      ],
      milestones: [
        {
          id: 'MIL-006',
          name: 'Solicitor Auto-Assigned',
          status: 'completed',
          date: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          description: 'Legal representation automatically assigned upon reservation'
        },
        {
          id: 'MIL-007',
          name: 'Contract Signed',
          status: 'pending',
          description: 'Purchase contract legally executed'
        }
      ]
    },
    {
      id: 'completion',
      name: 'Completion',
      description: 'Final payment, key handover and property completion',
      status: 'pending',
      estimatedDuration: '1-2 weeks',
      dependencies: ['legal_process'],
      documents: [
        {
          id: 'DOC-008',
          name: 'Final Payment Authorization',
          status: 'required'
        },
        {
          id: 'DOC-009',
          name: 'Property Insurance',
          status: 'required'
        },
        {
          id: 'DOC-010',
          name: 'Completion Statement',
          status: 'required'
        }
      ],
      contacts: [],
      milestones: [
        {
          id: 'MIL-008',
          name: 'Final Payment',
          status: 'pending',
          amount: 355000,
          description: 'Final balance payment to complete purchase'
        },
        {
          id: 'MIL-009',
          name: 'Key Handover',
          status: 'pending',
          description: 'Receive keys and take possession'
        }
      ]
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'in_progress':
        return <Clock size={20} className="text-blue-600" />;
      case 'blocked':
        return <AlertTriangle size={20} className="text-red-600" />;
      default:
        return <Circle size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'blocked':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'uploaded':
        return 'text-blue-600 bg-blue-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'required':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const currentStageIndex = stages.findIndex(stage => stage.id === transaction.currentStage);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Status</h1>
          <p className="text-gray-600 mt-1">
            Track your property purchase progress and milestones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw size={16} className={`inline mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link 
            href="/buyer/payments"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <CreditCard size={16} className="inline mr-2" />
            View Payments
          </Link>
        </div>
      </div>

      {/* Transaction Overview */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{transaction.propertyName}</h2>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin size={16} />
              {transaction.propertyAddress}
            </p>
            <p className="text-sm text-gray-500 mt-2">Transaction ID: {transaction.id}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(transaction.purchasePrice)}</p>
            <p className="text-sm text-gray-500">Purchase Price</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-blue-600">{transaction.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${transaction.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Deposit Paid</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(transaction.depositPaid)}</p>
            <p className="text-xs text-green-600">Completed</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">HTB Benefit</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(transaction.htbAmount)}</p>
            <p className="text-xs text-blue-600">Approved</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Mortgage Amount</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(transaction.mortgageAmount)}</p>
            <p className="text-xs text-amber-600">In Process</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Expected Completion</p>
            <p className="text-lg font-bold text-gray-900">{format(transaction.expectedCompletionDate, 'MMM d')}</p>
            <p className="text-xs text-purple-600">{format(transaction.expectedCompletionDate, 'yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Stage Progress */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Transaction Stages</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {stages.map((stage, index) => (
              <div key={stage.id} className={`relative ${index < stages.length - 1 ? 'pb-6' : ''}`}>
                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div className="absolute left-10 top-12 w-0.5 h-6 bg-gray-200" />
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-20 h-20 rounded-lg flex items-center justify-center ${
                    stage.status === 'completed' ? 'bg-green-100' :
                    stage.status === 'in_progress' ? 'bg-blue-100' :
                    stage.status === 'blocked' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {getStageIcon(stage.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{stage.name}</h4>
                        <p className="text-sm text-gray-600">{stage.description}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(stage.status)}`}>
                        {stage.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="text-sm font-medium">{stage.actualDuration || stage.estimatedDuration}</p>
                      </div>
                      
                      {stage.startDate && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Started</p>
                          <p className="text-sm font-medium">{format(stage.startDate, 'MMM d, yyyy')}</p>
                        </div>
                      )}
                      
                      {stage.completedDate && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Completed</p>
                          <p className="text-sm font-medium">{format(stage.completedDate, 'MMM d, yyyy')}</p>
                        </div>
                      )}
                      
                      {stage.estimatedCompletion && !stage.completedDate && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Est. Completion</p>
                          <p className="text-sm font-medium">{format(stage.estimatedCompletion, 'MMM d, yyyy')}</p>
                        </div>
                      )}
                    </div>

                    {/* Milestones */}
                    {stage.milestones.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Milestones</p>
                        <div className="space-y-2">
                          {stage.milestones.map((milestone) => (
                            <div key={milestone.id} className="flex items-center gap-3 text-sm">
                              {milestone.status === 'completed' ? (
                                <CheckCircle size={16} className="text-green-600" />
                              ) : milestone.status === 'in_progress' ? (
                                <Clock size={16} className="text-blue-600" />
                              ) : (
                                <Circle size={16} className="text-gray-400" />
                              )}
                              <span className={milestone.status === 'completed' ? 'text-gray-900' : 'text-gray-600'}>
                                {milestone.name}
                                {milestone.amount && ` - ${formatCurrency(milestone.amount)}`}
                              </span>
                              {milestone.date && (
                                <span className="text-gray-500">
                                  ({format(milestone.date, 'MMM d')})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    {stage.documents.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Documents</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {stage.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                              <span className="text-gray-900">{doc.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getDocumentStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contacts */}
                    {stage.contacts.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Key Contacts</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {stage.contacts.map((contact) => (
                            <div key={contact.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <User size={16} className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-semibold text-gray-900">{contact.name}</p>
                                      <p className="text-sm text-gray-600">{contact.company}</p>
                                      <p className="text-xs text-purple-600 font-medium">{contact.specialization}</p>
                                    </div>
                                    {contact.status === 'auto_assigned' && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <Zap size={12} className="mr-1" />
                                        Auto-assigned
                                      </span>
                                    )}
                                  </div>
                                  
                                  {contact.caseNumber && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      Case: {contact.caseNumber} • Assigned {format(contact.assignedDate, 'h:mm a')}
                                    </div>
                                  )}
                                  
                                  <div className="mt-2 flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                      <Phone size={12} className="text-gray-400" />
                                      <a href={`tel:${contact.phone}`} className="text-purple-600 hover:text-purple-700">
                                        {contact.phone}
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Mail size={12} className="text-gray-400" />
                                      <a href={`mailto:${contact.email}`} className="text-purple-600 hover:text-purple-700">
                                        {contact.email}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link 
          href="/buyer/documents"
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-all group"
        >
          <FileText size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-gray-900">Upload Documents</h4>
          <p className="text-sm text-gray-600">Submit required documentation</p>
        </Link>

        <Link 
          href="/buyer/payments"
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-all group"
        >
          <CreditCard size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-gray-900">View Payments</h4>
          <p className="text-sm text-gray-600">Track payment history</p>
        </Link>

        <Link 
          href="/buyer/appointments"
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-all group"
        >
          <Calendar size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-gray-900">Schedule Meeting</h4>
          <p className="text-sm text-gray-600">Book consultation</p>
        </Link>

        <Link 
          href="/buyer/support"
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-all group"
        >
          <Bell size={24} className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-gray-900">Get Support</h4>
          <p className="text-sm text-gray-600">Contact our team</p>
        </Link>
      </div>
    </div>
  );
}