/**
 * Solicitor Coordination Dashboard
 * 
 * Month 2, Week 2 Implementation: Core Professional Roles
 * Legal coordination, conveyancing, and compliance for Irish property development
 * 
 * Features:
 * - Conveyancing workflow management
 * - Legal document preparation and review
 * - Client communication and coordination
 * - Law Society of Ireland compliance
 * - Multi-professional integration
 * - Risk management and compliance
 * - Fee management and invoicing
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Scale,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
  Building,
  Briefcase,
  Calendar,
  MessageSquare,
  Shield,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Mail,
  Phone,
  Video,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  BookOpen,
  Gavel,
  Home,
  MapPin,
  Receipt
} from 'lucide-react';

export interface LegalCase {
  id: string;
  reference: string;
  type: 'conveyancing' | 'development' | 'commercial' | 'residential' | 'litigation' | 'planning';
  status: 'instruction' | 'in_progress' | 'awaiting_docs' | 'contracts_prepared' | 'exchange' | 'completion' | 'closed';
  clientId: string;
  clientName: string;
  propertyAddress: string;
  propertyType: 'apartment' | 'house' | 'commercial' | 'land' | 'mixed_use';
  transactionType: 'purchase' | 'sale' | 'lease' | 'development' | 'mortgage';
  purchasePrice: number;
  currency: 'EUR' | 'GBP' | 'USD';
  instructionDate: Date;
  targetExchangeDate?: Date;
  targetCompletionDate?: Date;
  actualExchangeDate?: Date;
  actualCompletionDate?: Date;
  solicitorId: string;
  solicitorName: string;
  otherPartySolicitor?: string;
  documents: LegalDocument[];
  milestones: LegalMilestone[];
  tasks: LegalTask[];
  communications: LegalCommunication[];
  fees: LegalFees;
  notes: string[];
  riskFactors: RiskFactor[];
  complianceChecks: ComplianceCheck[];
}

export interface LegalDocument {
  id: string;
  caseId: string;
  name: string;
  type: 'contract' | 'deed' | 'certificate' | 'report' | 'correspondence' | 'search' | 'survey' | 'planning';
  category: 'title_docs' | 'searches' | 'surveys' | 'planning' | 'contracts' | 'completion_docs' | 'correspondence';
  status: 'pending' | 'received' | 'reviewed' | 'approved' | 'requires_action' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  receivedDate?: Date;
  reviewedDate?: Date;
  reviewedBy?: string;
  dueDate?: Date;
  source: string;
  recipient?: string;
  description: string;
  version: number;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
}

export interface LegalMilestone {
  id: string;
  caseId: string;
  name: string;
  description: string;
  category: 'instruction' | 'searches' | 'survey' | 'mortgage' | 'contracts' | 'exchange' | 'completion' | 'registration';
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  targetDate: Date;
  actualDate?: Date;
  dependencies: string[];
  assignedTo: string;
  documents: string[];
  notes: string[];
}

export interface LegalTask {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: 'document_review' | 'client_contact' | 'search_order' | 'contract_prep' | 'compliance_check' | 'filing' | 'meeting';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string;
  createdBy: string;
  createdDate: Date;
  dueDate: Date;
  completedDate?: Date;
  estimatedHours: number;
  actualHours?: number;
  relatedDocuments: string[];
  relatedMilestone?: string;
  notes: string[];
}

export interface LegalCommunication {
  id: string;
  caseId: string;
  type: 'email' | 'phone' | 'meeting' | 'letter' | 'video_call';
  direction: 'inbound' | 'outbound';
  date: Date;
  from: string;
  to: string[];
  subject: string;
  summary: string;
  documents: string[];
  actionRequired: boolean;
  actionDescription?: string;
  followUpDate?: Date;
}

export interface LegalFees {
  baseFeeBand: 'A' | 'B' | 'C' | 'D' | 'E';
  baseFee: number;
  additionalServices: FeeItem[];
  searches: FeeItem[];
  registrationFees: FeeItem[];
  totalProfessionalFees: number;
  totalDisbursements: number;
  vat: number;
  totalFees: number;
  paymentSchedule: Payment[];
  invoices: Invoice[];
}

export interface FeeItem {
  description: string;
  amount: number;
  category: 'professional_fee' | 'disbursement' | 'registration' | 'search' | 'survey';
  status: 'estimated' | 'quoted' | 'invoiced' | 'paid';
}

export interface Payment {
  id: string;
  date: Date;
  amount: number;
  type: 'deposit' | 'interim' | 'completion' | 'disbursement';
  status: 'pending' | 'received' | 'overdue';
  reference?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: FeeItem[];
}

export interface RiskFactor {
  id: string;
  caseId: string;
  type: 'title_defect' | 'planning_issue' | 'survey_concern' | 'finance_risk' | 'legal_dispute' | 'compliance_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  likelihood: 'unlikely' | 'possible' | 'likely' | 'certain';
  mitigation: string;
  status: 'identified' | 'assessing' | 'mitigating' | 'resolved';
  identifiedDate: Date;
  reviewDate: Date;
  assignedTo: string;
}

export interface ComplianceCheck {
  id: string;
  caseId: string;
  type: 'anti_money_laundering' | 'client_identification' | 'conflict_check' | 'professional_indemnity' | 'cpd_compliance' | 'law_society_rules';
  status: 'pending' | 'compliant' | 'non_compliant' | 'requires_action';
  checkDate: Date;
  checkedBy: string;
  details: string;
  evidence: string[];
  remedialAction?: string;
  completionDate?: Date;
}

export interface LawSocietyCompliance {
  solicitorId: string;
  practitingCertificate: {
    number: string;
    expiryDate: Date;
    valid: boolean;
  };
  professionalIndemnityInsurance: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: Date;
    valid: boolean;
  };
  continuingProfessionalDevelopment: {
    currentYear: number;
    hoursRequired: number;
    hoursCompleted: number;
    compliant: boolean;
  };
  clientAccount: {
    accountProvider: string;
    accountNumber: string;
    lastAudit: Date;
    compliant: boolean;
  };
  antiMoneyLaundering: {
    policyInPlace: boolean;
    lastTraining: Date;
    compliant: boolean;
  };
}

export interface LegalKPIs {
  caseCompletion: {
    onTime: number;
    delayed: number;
    average: number;
  };
  documentTurnaround: {
    averageDays: number;
    withinSLA: number;
  };
  clientSatisfaction: {
    rating: number;
    responses: number;
  };
  revenueMetrics: {
    monthlyRevenue: number;
    outstandingFees: number;
    collectionRate: number;
  };
  complianceScore: number;
  riskExposure: {
    highRiskCases: number;
    totalExposure: number;
  };
}

const statusColors = {
  instruction: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  awaiting_docs: 'bg-orange-100 text-orange-800',
  contracts_prepared: 'bg-purple-100 text-purple-800',
  exchange: 'bg-indigo-100 text-indigo-800',
  completion: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
  critical: 'bg-red-200 text-red-900'
};

export default function SolicitorCoordinationDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [legalData, setLegalData] = useState<{
    cases: LegalCase[];
    kpis: LegalKPIs;
    compliance: LawSocietyCompliance;
  } | null>(null);

  useEffect(() => {
    loadLegalData();
  }, []);

  const loadLegalData = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API calls
      const response = await fetch('/api/solicitor/legal-coordination?action=get_legal_data&solicitorId=mary_oleary');
      const data = await response.json();
      setLegalData(data);
    } catch (error) {
      console.error('Error loading legal data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!legalData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No legal data available</p>
      </div>
    );
  }

  const { cases, kpis, compliance } = legalData;

  const activeCases = cases.filter(c => !['closed', 'completion'].includes(c.status));
  const urgentTasks = cases.flatMap(c => c.tasks).filter(t => t.priority === 'urgent' && t.status !== 'completed');
  const pendingDocuments = cases.flatMap(c => c.documents).filter(d => d.status === 'pending' || d.status === 'requires_action');
  const upcomingMilestones = cases.flatMap(c => c.milestones).filter(m => {
    const daysUntil = Math.ceil((new Date(m.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0 && m.status !== 'completed';
  });

  const filteredCases = selectedCase === 'all' ? cases : cases.filter(c => c.id === selectedCase);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Scale className="h-8 w-8 text-blue-600 mr-3" />
                Legal Coordination Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Mary O'Leary & Associates - Conveyancing & Property Law</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Compliance Check
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold">{activeCases.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {kpis.caseCompletion.onTime}% on track
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Documents</p>
                  <p className="text-2xl font-bold">{pendingDocuments.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {kpis.documentTurnaround.averageDays} day avg turnaround
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold">€{kpis.revenueMetrics.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {kpis.revenueMetrics.collectionRate}% collection rate
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Euro className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold">{kpis.complianceScore}%</p>
                  <p className="text-xs text-green-600 mt-1">
                    Law Society compliant
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Cases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Recent Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cases.slice(0, 5).map((legalCase) => (
                      <div key={legalCase.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{legalCase.reference}</p>
                          <p className="text-sm text-gray-600">{legalCase.clientName}</p>
                          <p className="text-xs text-gray-500">{legalCase.propertyAddress}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${statusColors[legalCase.status]} mb-1`}>
                            {legalCase.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <p className="text-sm text-gray-600">€{legalCase.purchasePrice.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Urgent Tasks ({urgentTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {urgentTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={priorityColors[task.priority]}>
                            {task.priority.toUpperCase()}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{task.estimatedHours}h</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Upcoming Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingMilestones.slice(0, 5).map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{milestone.name}</p>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                          <p className="text-xs text-gray-500">Assigned: {milestone.assignedTo}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(milestone.targetDate).toLocaleDateString()}
                          </p>
                          <Badge className={`${milestone.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {milestone.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Revenue Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Revenue</span>
                      <span className="font-medium">€{kpis.revenueMetrics.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Outstanding Fees</span>
                      <span className="font-medium text-orange-600">€{kpis.revenueMetrics.outstandingFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Collection Rate</span>
                      <span className="font-medium text-green-600">{kpis.revenueMetrics.collectionRate}%</span>
                    </div>
                    <Progress value={kpis.revenueMetrics.collectionRate} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cases Tab */}
          <TabsContent value="cases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Legal Cases ({cases.length})
                  </span>
                  <div className="flex items-center gap-4">
                    <Select value={selectedCase} onValueChange={setSelectedCase}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cases</SelectItem>
                        {cases.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.reference} - {c.clientName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Case
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCases.map((legalCase) => (
                    <Card key={legalCase.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{legalCase.reference}</h3>
                            <p className="text-gray-600">{legalCase.type.charAt(0).toUpperCase() + legalCase.type.slice(1)} - {legalCase.transactionType.charAt(0).toUpperCase() + legalCase.transactionType.slice(1)}</p>
                          </div>
                          <Badge className={statusColors[legalCase.status]}>
                            {legalCase.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Client</p>
                            <p className="font-medium">{legalCase.clientName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Property</p>
                            <p className="font-medium">{legalCase.propertyAddress}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Purchase Price</p>
                            <p className="font-medium">€{legalCase.purchasePrice.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Instruction Date</p>
                            <p className="font-medium">{new Date(legalCase.instructionDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Target Exchange</p>
                            <p className="font-medium">
                              {legalCase.targetExchangeDate ? new Date(legalCase.targetExchangeDate).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Target Completion</p>
                            <p className="font-medium">
                              {legalCase.targetCompletionDate ? new Date(legalCase.targetCompletionDate).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Documents</p>
                              <p className="font-bold">{legalCase.documents.length}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Tasks</p>
                              <p className="font-bold">{legalCase.tasks.filter(t => t.status !== 'completed').length}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Milestones</p>
                              <p className="font-bold">{legalCase.milestones.filter(m => m.status === 'completed').length}/{legalCase.milestones.length}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Legal Documents ({pendingDocuments.length} pending)
                  </span>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          document.type === 'contract' ? 'bg-blue-100' :
                          document.type === 'search' ? 'bg-green-100' :
                          document.type === 'survey' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          <FileText className={`h-4 w-4 ${
                            document.type === 'contract' ? 'text-blue-600' :
                            document.type === 'search' ? 'text-green-600' :
                            document.type === 'survey' ? 'text-yellow-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-sm text-gray-600">{document.description}</p>
                          <p className="text-xs text-gray-500">
                            {document.type.charAt(0).toUpperCase() + document.type.slice(1)} • 
                            From: {document.source} • 
                            Version: {document.version}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={`${
                            document.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            document.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                            document.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          } mb-1`}>
                            {document.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={priorityColors[document.priority]}>
                            {document.priority.toUpperCase()}
                          </Badge>
                          {document.dueDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Due: {new Date(document.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Law Society Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Law Society Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Practicing Certificate</p>
                      <p className="text-sm text-gray-600">#{compliance.practitingCertificate.number}</p>
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(compliance.practitingCertificate.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={compliance.practitingCertificate.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {compliance.practitingCertificate.valid ? 'VALID' : 'EXPIRED'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Professional Indemnity Insurance</p>
                      <p className="text-sm text-gray-600">{compliance.professionalIndemnityInsurance.provider}</p>
                      <p className="text-xs text-gray-500">
                        Coverage: €{compliance.professionalIndemnityInsurance.coverageAmount.toLocaleString()}
                      </p>
                    </div>
                    <Badge className={compliance.professionalIndemnityInsurance.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {compliance.professionalIndemnityInsurance.valid ? 'VALID' : 'EXPIRED'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Continuing Professional Development</p>
                      <p className="text-sm text-gray-600">
                        {compliance.continuingProfessionalDevelopment.hoursCompleted}/{compliance.continuingProfessionalDevelopment.hoursRequired} hours completed
                      </p>
                      <Progress 
                        value={(compliance.continuingProfessionalDevelopment.hoursCompleted / compliance.continuingProfessionalDevelopment.hoursRequired) * 100} 
                        className="mt-2"
                      />
                    </div>
                    <Badge className={compliance.continuingProfessionalDevelopment.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {compliance.continuingProfessionalDevelopment.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Client Account</p>
                      <p className="text-sm text-gray-600">{compliance.clientAccount.accountProvider}</p>
                      <p className="text-xs text-gray-500">
                        Last Audit: {new Date(compliance.clientAccount.lastAudit).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={compliance.clientAccount.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {compliance.clientAccount.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Anti-Money Laundering</p>
                      <p className="text-sm text-gray-600">Policy in place and training current</p>
                      <p className="text-xs text-gray-500">
                        Last Training: {new Date(compliance.antiMoneyLaundering.lastTraining).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={compliance.antiMoneyLaundering.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {compliance.antiMoneyLaundering.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Overall Compliance Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Compliance Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <div className="text-6xl font-bold text-green-600 mb-2">{kpis.complianceScore}%</div>
                    <p className="text-gray-600">Overall Compliance Rating</p>
                    <Progress value={kpis.complianceScore} className="mt-4" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{cases.length}</p>
                      <p className="text-sm text-gray-600">Active Cases</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">100%</p>
                      <p className="text-sm text-gray-600">Compliance Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{kpis.riskExposure.highRiskCases}</p>
                      <p className="text-sm text-gray-600">High Risk Cases</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">€{kpis.riskExposure.totalExposure.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Risk Exposure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Legal Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cases.flatMap(c => c.tasks).filter(t => t.status !== 'completed').map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <p className="text-xs text-gray-500">
                          {task.type.replace('_', ' ').toUpperCase()} • 
                          Assigned: {task.assignedTo} • 
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority.toUpperCase()}
                        </Badge>
                        <Badge className={`${
                          task.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Client Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cases.flatMap(c => c.communications).slice(0, 10).map((comm) => (
                    <div key={comm.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          comm.type === 'email' ? 'bg-blue-100' :
                          comm.type === 'phone' ? 'bg-green-100' :
                          comm.type === 'meeting' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          {comm.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                          {comm.type === 'phone' && <Phone className="h-4 w-4 text-green-600" />}
                          {comm.type === 'meeting' && <Users className="h-4 w-4 text-purple-600" />}
                          {comm.type === 'video_call' && <Video className="h-4 w-4 text-indigo-600" />}
                        </div>
                        <div>
                          <p className="font-medium">{comm.subject}</p>
                          <p className="text-sm text-gray-600">{comm.summary}</p>
                          <p className="text-xs text-gray-500">
                            {comm.direction.toUpperCase()} • {comm.from} → {comm.to.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{new Date(comm.date).toLocaleDateString()}</p>
                        {comm.actionRequired && (
                          <Badge className="bg-red-100 text-red-800 mt-1">
                            ACTION REQUIRED
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Case Completion Rate</span>
                    <span className="font-medium">{kpis.caseCompletion.onTime}%</span>
                  </div>
                  <Progress value={kpis.caseCompletion.onTime} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Case Duration</span>
                    <span className="font-medium">{kpis.caseCompletion.average} days</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Document Turnaround</span>
                    <span className="font-medium">{kpis.documentTurnaround.averageDays} days</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Client Satisfaction</span>
                    <span className="font-medium">{kpis.clientSatisfaction.rating}/5.0</span>
                  </div>
                  <Progress value={kpis.clientSatisfaction.rating * 20} />
                </CardContent>
              </Card>

              {/* Financial Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="h-5 w-5 mr-2" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Revenue</span>
                    <span className="font-medium text-green-600">€{kpis.revenueMetrics.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Outstanding Fees</span>
                    <span className="font-medium text-orange-600">€{kpis.revenueMetrics.outstandingFees.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Collection Rate</span>
                    <span className="font-medium">{kpis.revenueMetrics.collectionRate}%</span>
                  </div>
                  <Progress value={kpis.revenueMetrics.collectionRate} />
                  
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{activeCases.length}</p>
                        <p className="text-xs text-gray-600">Active Cases</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">€{Math.round(kpis.revenueMetrics.monthlyRevenue / activeCases.length).toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Avg Case Value</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}