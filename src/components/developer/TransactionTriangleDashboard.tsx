'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Scale, 
  Building2, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Eye,
  MessageSquare,
  FileText,
  Calendar,
  Euro,
  Activity,
  Zap,
  Target,
  BarChart3,
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  CreditCard,
  Receipt,
  Shield,
  AlertCircle,
  RefreshCw,
  Filter,
  Search,
  Download,
  Bell,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { buyerSolicitorIntegrationService, SolicitorCase } from '@/services/BuyerSolicitorIntegrationService';
import { projectDataService } from '@/services/ProjectDataService';
import { Unit } from '@/types/project';

interface TransactionTriangleData {
  activeBuyers: BuyerTransaction[];
  solicitorCases: SolicitorCase[];
  revenueImpact: RevenueMetrics;
  timelineInsights: TimelineInsights;
  riskAlerts: RiskAlert[];
}

interface BuyerTransaction {
  id: string;
  buyerName: string;
  unitId: string;
  unitNumber: string;
  status: 'reserved' | 'deposit_paid' | 'contract_signed' | 'completing' | 'completed';
  reservationDate: Date;
  expectedCompletion: Date;
  purchasePrice: number;
  currentStage: string;
  solicitorCase?: SolicitorCase;
  milestones: TransactionMilestone[];
  documents: DocumentStatus[];
  communications: CommunicationLog[];
}

interface TransactionMilestone {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate: Date;
  completedDate?: Date;
  owner: 'buyer' | 'solicitor' | 'developer';
  impact: 'low' | 'medium' | 'high' | 'critical';
}

interface DocumentStatus {
  id: string;
  name: string;
  type: string;
  status: 'required' | 'submitted' | 'approved' | 'rejected';
  owner: string;
  lastUpdated: Date;
}

interface CommunicationLog {
  id: string;
  from: string;
  to: string;
  subject: string;
  timestamp: Date;
  type: 'email' | 'call' | 'meeting' | 'document' | 'system';
  priority: 'low' | 'medium' | 'high';
}

interface RevenueMetrics {
  totalPipeline: number;
  reservedRevenue: number;
  atRiskRevenue: number;
  expectedThisQuarter: number;
  averageTransactionTime: number;
  completionRate: number;
}

interface TimelineInsights {
  onTrackTransactions: number;
  delayedTransactions: number;
  averageDelay: number;
  criticalMilestones: TransactionMilestone[];
}

interface RiskAlert {
  id: string;
  type: 'timeline_delay' | 'document_missing' | 'communication_gap' | 'financial_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  transactionId: string;
  buyerName: string;
  recommendedAction: string;
  daysOverdue?: number;
}

interface TransactionTriangleDashboardProps {
  projectId: string;
  units: Unit[];
}

export default function TransactionTriangleDashboard({ projectId, units }: TransactionTriangleDashboardProps) {
  const [dashboardData, setDashboardData] = useState<TransactionTriangleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'transactions' | 'timeline' | 'risks'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [projectId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get solicitor cases for this project
      const solicitorCases = buyerSolicitorIntegrationService.getAllCases()
        .filter(c => c.propertyId.includes(projectId) || c.property.developmentName.includes('Fitzgerald'));
      
      // Generate mock buyer transactions based on reserved units
      const reservedUnits = units.filter(unit => unit.status === 'reserved' || unit.status === 'sold');
      const activeBuyers = generateBuyerTransactions(reservedUnits, solicitorCases);
      
      // Calculate metrics
      const revenueImpact = calculateRevenueMetrics(activeBuyers);
      const timelineInsights = calculateTimelineInsights(activeBuyers);
      const riskAlerts = identifyRiskAlerts(activeBuyers);
      
      setDashboardData({
        activeBuyers,
        solicitorCases,
        revenueImpact,
        timelineInsights,
        riskAlerts
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBuyerTransactions = (units: Unit[], cases: SolicitorCase[]): BuyerTransaction[] => {
    return units.map((unit, index) => {
      const relatedCase = cases.find(c => c.propertyId === unit.id);
      const baseDate = new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)); // Stagger dates
      
      return {
        id: `trans-${unit.id}`,
        buyerName: unit.buyer?.name || `Buyer ${unit.number}`,
        unitId: unit.id,
        unitNumber: unit.number,
        status: generateTransactionStatus(index),
        reservationDate: baseDate,
        expectedCompletion: new Date(baseDate.getTime() + (12 * 7 * 24 * 60 * 60 * 1000)), // 12 weeks later
        purchasePrice: unit.pricing.currentPrice,
        currentStage: getCurrentStage(index),
        solicitorCase: relatedCase,
        milestones: generateMilestones(baseDate, index),
        documents: generateDocuments(index),
        communications: generateCommunications(baseDate, index)
      };
    });
  };

  const generateTransactionStatus = (index: number): BuyerTransaction['status'] => {
    const statuses: BuyerTransaction['status'][] = ['reserved', 'deposit_paid', 'contract_signed', 'completing', 'completed'];
    return statuses[index % statuses.length];
  };

  const getCurrentStage = (index: number): string => {
    const stages = [
      'Mortgage Approval Pending',
      'Solicitor Review in Progress', 
      'Contract Preparation',
      'Awaiting Exchange',
      'Completion Scheduled'
    ];
    return stages[index % stages.length];
  };

  const generateMilestones = (baseDate: Date, index: number): TransactionMilestone[] => {
    const milestones: TransactionMilestone[] = [
      {
        id: 'mil-1',
        name: 'Reservation Deposit',
        status: 'completed',
        dueDate: baseDate,
        completedDate: baseDate,
        owner: 'buyer',
        impact: 'high'
      },
      {
        id: 'mil-2', 
        name: 'Mortgage Approval',
        status: index < 3 ? 'in_progress' : 'completed',
        dueDate: new Date(baseDate.getTime() + (4 * 7 * 24 * 60 * 60 * 1000)),
        completedDate: index >= 3 ? new Date(baseDate.getTime() + (3 * 7 * 24 * 60 * 60 * 1000)) : undefined,
        owner: 'buyer',
        impact: 'critical'
      },
      {
        id: 'mil-3',
        name: 'Solicitor Appointed',
        status: index < 2 ? 'pending' : 'completed',
        dueDate: new Date(baseDate.getTime() + (1 * 7 * 24 * 60 * 60 * 1000)),
        completedDate: index >= 2 ? new Date(baseDate.getTime() + (1 * 7 * 24 * 60 * 60 * 1000)) : undefined,
        owner: 'solicitor',
        impact: 'high'
      },
      {
        id: 'mil-4',
        name: 'Contract Exchange',
        status: index < 1 ? 'pending' : 'in_progress',
        dueDate: new Date(baseDate.getTime() + (8 * 7 * 24 * 60 * 60 * 1000)),
        owner: 'solicitor',
        impact: 'critical'
      }
    ];
    return milestones;
  };

  const generateDocuments = (index: number): DocumentStatus[] => {
    return [
      {
        id: 'doc-1',
        name: 'Mortgage Approval Letter',
        type: 'financial',
        status: index < 2 ? 'required' : 'approved',
        owner: 'buyer',
        lastUpdated: new Date(Date.now() - (index * 24 * 60 * 60 * 1000))
      },
      {
        id: 'doc-2',
        name: 'Contract for Sale',
        type: 'legal',
        status: index < 1 ? 'required' : 'submitted',
        owner: 'solicitor',
        lastUpdated: new Date(Date.now() - (index * 12 * 60 * 60 * 1000))
      }
    ];
  };

  const generateCommunications = (baseDate: Date, index: number): CommunicationLog[] => {
    return [
      {
        id: 'comm-1',
        from: 'Developer',
        to: 'Buyer',
        subject: 'Welcome to Fitzgerald Gardens',
        timestamp: baseDate,
        type: 'email',
        priority: 'medium'
      },
      {
        id: 'comm-2',
        from: 'Solicitor',
        to: 'Buyer',
        subject: 'Document Requirements',
        timestamp: new Date(baseDate.getTime() + (24 * 60 * 60 * 1000)),
        type: 'email',
        priority: 'high'
      }
    ];
  };

  const calculateRevenueMetrics = (transactions: BuyerTransaction[]): RevenueMetrics => {
    const total = transactions.reduce((sum, t) => sum + t.purchasePrice, 0);
    const reserved = transactions
      .filter(t => ['reserved', 'deposit_paid'].includes(t.status))
      .reduce((sum, t) => sum + t.purchasePrice, 0);
    
    return {
      totalPipeline: total,
      reservedRevenue: reserved,
      atRiskRevenue: total * 0.15, // 15% at risk
      expectedThisQuarter: total * 0.6,
      averageTransactionTime: 84, // days
      completionRate: 0.92
    };
  };

  const calculateTimelineInsights = (transactions: BuyerTransaction[]): TimelineInsights => {
    const now = new Date();
    const onTrack = transactions.filter(t => 
      t.expectedCompletion > now && 
      t.milestones.filter(m => m.status === 'blocked').length === 0
    ).length;
    
    return {
      onTrackTransactions: onTrack,
      delayedTransactions: transactions.length - onTrack,
      averageDelay: 12, // days
      criticalMilestones: transactions
        .flatMap(t => t.milestones)
        .filter(m => m.impact === 'critical' && m.status !== 'completed')
        .slice(0, 5)
    };
  };

  const identifyRiskAlerts = (transactions: BuyerTransaction[]): RiskAlert[] => {
    const alerts: RiskAlert[] = [];
    
    transactions.forEach(transaction => {
      // Timeline risk
      if (transaction.expectedCompletion < new Date()) {
        alerts.push({
          id: `risk-${transaction.id}-timeline`,
          type: 'timeline_delay',
          severity: 'high',
          description: 'Transaction is behind schedule',
          transactionId: transaction.id,
          buyerName: transaction.buyerName,
          recommendedAction: 'Contact solicitor to expedite milestone completion',
          daysOverdue: Math.floor((new Date().getTime() - transaction.expectedCompletion.getTime()) / (24 * 60 * 60 * 1000))
        });
      }
      
      // Document risk
      const missingDocs = transaction.documents.filter(d => d.status === 'required');
      if (missingDocs.length > 0) {
        alerts.push({
          id: `risk-${transaction.id}-docs`,
          type: 'document_missing',
          severity: 'medium',
          description: `${missingDocs.length} documents pending submission`,
          transactionId: transaction.id,
          buyerName: transaction.buyerName,
          recommendedAction: 'Follow up with buyer and solicitor for document submission'
        });
      }
    });
    
    return alerts.slice(0, 10); // Limit to top 10 risks
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserved': return 'bg-blue-100 text-blue-800';
      case 'deposit_paid': return 'bg-yellow-100 text-yellow-800';
      case 'contract_signed': return 'bg-purple-100 text-purple-800';
      case 'completing': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'blocked': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `€${(amount / 1000).toFixed(0)}K`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading transaction triangle data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction Triangle Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Complete visibility into buyer → solicitor → developer workflow
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Cards - Responsive Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.activeBuyers.length}</p>
              <p className="text-xs text-green-600 mt-1">
                ↗ {formatCurrency(dashboardData.revenueImpact.totalPipeline)} pipeline
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Solicitor Cases</p>
              <p className="text-2xl font-bold text-purple-600">{dashboardData.solicitorCases.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData.solicitorCases.filter(c => c.metadata.autoCreated).length} auto-created
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(dashboardData.revenueImpact.completionRate * 100)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Avg {dashboardData.revenueImpact.averageTransactionTime} days
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Risk Alerts</p>
              <p className="text-2xl font-bold text-red-600">{dashboardData.riskAlerts.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData.riskAlerts.filter(r => r.severity === 'high').length} high priority
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="border-b">
          <nav className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'transactions', label: 'Active Transactions', icon: Users },
              { id: 'timeline', label: 'Timeline Insights', icon: Clock },
              { id: 'risks', label: 'Risk Management', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedView === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Impact Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total Pipeline</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(dashboardData.revenueImpact.totalPipeline)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Reserved Revenue</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(dashboardData.revenueImpact.reservedRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Expected This Quarter</span>
                    <span className="font-bold text-yellow-600">
                      {formatCurrency(dashboardData.revenueImpact.expectedThisQuarter)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">At Risk Revenue</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(dashboardData.revenueImpact.atRiskRevenue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Timeline Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">On Track</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {dashboardData.timelineInsights.onTrackTransactions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">Delayed</span>
                    </div>
                    <span className="font-bold text-red-600">
                      {dashboardData.timelineInsights.delayedTransactions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Average Delay</span>
                    </div>
                    <span className="font-bold text-gray-600">
                      {dashboardData.timelineInsights.averageDelay} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Active Buyer Transactions</h3>
                <div className="flex items-center gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="reserved">Reserved</option>
                    <option value="deposit_paid">Deposit Paid</option>
                    <option value="contract_signed">Contract Signed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {dashboardData.activeBuyers
                  .filter(t => filterStatus === 'all' || t.status === filterStatus)
                  .map((transaction) => (
                    <div key={transaction.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{transaction.buyerName}</h4>
                            <p className="text-sm text-gray-600">Unit {transaction.unitNumber} • {formatCurrency(transaction.purchasePrice)}</p>
                            <p className="text-xs text-gray-500">{transaction.currentStage}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {transaction.solicitorCase && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              <Scale className="w-3 h-3 inline mr-1" />
                              Case: {transaction.solicitorCase.caseNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Key Milestones</h5>
                          <div className="space-y-1">
                            {transaction.milestones.slice(0, 3).map((milestone) => (
                              <div key={milestone.id} className="flex items-center gap-2 text-sm">
                                {getMilestoneIcon(milestone.status)}
                                <span className={milestone.status === 'completed' ? 'text-gray-900' : 'text-gray-600'}>
                                  {milestone.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Document Status</h5>
                          <div className="space-y-1">
                            {transaction.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{doc.name}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  doc.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {doc.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Timeline</h5>
                          <div className="text-sm text-gray-600">
                            <div>Reserved: {formatDate(transaction.reservationDate)}</div>
                            <div>Expected: {formatDate(transaction.expectedCompletion)}</div>
                            {transaction.solicitorCase && (
                              <div className="text-purple-600 mt-1">
                                Case created: {formatDate(transaction.solicitorCase.createdAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {selectedView === 'risks' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Risk Management</h3>
              
              {dashboardData.riskAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h4>
                  <p className="text-gray-600">No significant risks detected in current transactions.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.riskAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                      alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                      alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`w-5 h-5 ${
                              alert.severity === 'critical' ? 'text-red-500' :
                              alert.severity === 'high' ? 'text-orange-500' :
                              alert.severity === 'medium' ? 'text-yellow-500' :
                              'text-blue-500'
                            }`} />
                            <h4 className="font-semibold text-gray-900">{alert.buyerName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{alert.description}</p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Action:</strong> {alert.recommendedAction}
                          </p>
                          {alert.daysOverdue && (
                            <p className="text-sm text-red-600">
                              {alert.daysOverdue} days overdue
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}