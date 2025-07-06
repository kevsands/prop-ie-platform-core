'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  ArrowsRightLeftIcon,
  BeakerIcon,
  FolderIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TransactionTimeline from './TransactionTimeline';
import TransactionParticipants from './TransactionParticipants';
import TransactionDocuments from './TransactionDocuments';
import TransactionMilestones from './TransactionMilestones';
import TransactionFinancials from './TransactionFinancials';
import TransactionCommunications from './TransactionCommunications';
import TransactionAnalytics from './TransactionAnalytics';
import { useTransaction } from '@/hooks/useTransaction';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface TransactionCoordinatorProps {
  transactionId: string;
}

interface Transaction {
  id: string;
  propertyId: string;
  property: {
    name: string;
    address: string;
    price: number;
    development: {
      name: string;
      developer: string;
    };
  };
  status: 'INITIATED' | 'IN_PROGRESS' | 'PENDING_SIGNATURES' | 'CLOSING' | 'COMPLETED' | 'CANCELLED';
  stage: 'PRE_CONTRACT' | 'CONTRACT' | 'DUE_DILIGENCE' | 'FINANCING' | 'CLOSING' | 'POST_CLOSING';
  participants: {
    buyer: Participant;
    seller: Participant;
    buyerSolicitor: Participant;
    sellerSolicitor: Participant;
    agent?: Participant;
    mortgageBroker?: Participant;
  };
  timeline: TimelineEvent[];
  documents: TransactionDocument[];
  milestones: Milestone[];
  financialBreakdown: FinancialBreakdown;
  compliance: ComplianceStatus;
  communications: Communication[];
  createdAt: Date;
  estimatedCompletionDate: Date;
  actualCompletionDate?: Date;
  criticalPath: CriticalPathItem[];
  riskAssessment: RiskAssessment;
}

interface Participant {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  company?: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  completedActions: number;
  pendingActions: number;
  documents: number;
  lastActivity: Date;
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  type: 'MILESTONE' | 'DOCUMENT' | 'COMMUNICATION' | 'PAYMENT' | 'ISSUE';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  actor: string;
  metadata?: any;
}

interface TransactionDocument {
  id: string;
  name: string;
  type: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'SIGNED' | 'EXECUTED';
  uploadedBy: string;
  uploadedAt: Date;
  dueDate?: Date;
  signatures?: SignatureStatus[];
  version: number;
  criticalPath: boolean;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  responsible: string[];
  dependencies: string[];
  blockers: string[];
  progress: number;
}

interface FinancialBreakdown {
  propertyPrice: number;
  deposit: number;
  mortgageAmount: number;
  stampDuty: number;
  legalFees: number;
  surveyFees: number;
  otherFees: { name: string; amount: number }[];
  totalCost: number;
  paidToDate: number;
  outstandingAmount: number;
  nextPayment: {
    amount: number;
    dueDate: Date;
    description: string;
  };
}

interface ComplianceStatus {
  kyc: 'PENDING' | 'COMPLETE' | 'ISSUES';
  aml: 'PENDING' | 'COMPLETE' | 'ISSUES';
  taxClearance: 'PENDING' | 'COMPLETE' | 'NOT_REQUIRED';
  planning: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
  buildingRegs: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
  titleIssues: string[];
  overallStatus: 'CLEAR' | 'PENDING' | 'ISSUES';
}

interface Communication {
  id: string;
  type: 'EMAIL' | 'PHONE' | 'VIDEO' | 'MEETING' | 'NOTE';
  subject: string;
  participants: string[];
  timestamp: Date;
  summary?: string;
  attachments?: string[];
  followUpRequired: boolean;
}

interface CriticalPathItem {
  id: string;
  task: string;
  owner: string;
  startDate: Date;
  endDate: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  dependencies: string[];
  slackDays: number;
}

interface RiskAssessment {
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: Array<{
    name: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    impact: string;
    mitigation: string;
    status: 'ACTIVE' | 'MITIGATED' | 'RESOLVED';
  }>;
  lastUpdated: Date;
}

export default function TransactionCoordinator({ transactionId }: TransactionCoordinatorProps) {
  const { user } = useAuth();
  const { data: transaction, isLoading } = useTransaction(transactionId);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showRiskAlert, setShowRiskAlert] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Transaction not found</p>
      </div>
    );
  }

  const overallProgress = Math.round(
    (transaction.milestones.filter(m => m.status === 'COMPLETED').length / transaction.milestones.length) * 100
  );

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'PRE_CONTRACT':
        return DocumentTextIcon;
      case 'CONTRACT':
        return ArrowsRightLeftIcon;
      case 'DUE_DILIGENCE':
        return DocumentMagnifyingGlassIcon;
      case 'FINANCING':
        return BanknotesIcon;
      case 'CLOSING':
        return BuildingOfficeIcon;
      case 'POST_CLOSING':
        return CheckCircleIcon;
      default:
        return FolderIcon;
    }
  };

  const StageIcon = getStageIcon(transaction.stage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction Coordinator</h1>
              <p className="text-gray-600 mt-1">{transaction.property.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={
                transaction.status === 'COMPLETED' ? 'success' :
                transaction.status === 'CANCELLED' ? 'destructive' :
                'default'
              }>
                {transaction.status}
              </Badge>
              <Button variant="outline">
                <VideoCameraIcon className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
              <Button>
                <BellIcon className="h-4 w-4 mr-2" />
                Set Alert
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Alert */}
        {transaction.riskAssessment.overallRisk !== 'LOW' && showRiskAlert && (
          <Alert className="mb-6">
            <ExclamationCircleIcon className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-start justify-between">
                <div>
                  <strong>Risk Assessment: {transaction.riskAssessment.overallRisk}</strong>
                  <p className="text-sm mt-1">
                    {transaction.riskAssessment.factors
                      .filter(f => f.status === 'ACTIVE' && f.severity !== 'LOW')
                      .map(f => f.name)
                      .join(', ')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRiskAlert(false)}
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <StageIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Transaction Progress</CardTitle>
                    <CardDescription>{transaction.stage.replace(/_/g, ' ')}</CardDescription>
                  </div>
                </div>
                <span className="text-2xl font-bold">{overallProgress}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} className="h-3 mb-4" />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Started</p>
                  <p className="font-semibold">{format(transaction.createdAt, 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Completion</p>
                  <p className="font-semibold">{format(transaction.estimatedCompletionDate, 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="font-semibold">
                    {transaction.documents.filter(d => d.status === 'EXECUTED').length}/
                    {transaction.documents.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Milestones</p>
                  <p className="font-semibold">
                    {transaction.milestones.filter(m => m.status === 'COMPLETED').length}/
                    {transaction.milestones.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-xl font-bold">
                    €{transaction.financialBreakdown.totalCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paid to Date</p>
                  <p className="font-semibold text-green-600">
                    €{transaction.financialBreakdown.paidToDate.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className="font-semibold text-red-600">
                    €{transaction.financialBreakdown.outstandingAmount.toLocaleString()}
                  </p>
                </div>
                {transaction.financialBreakdown.nextPayment && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">Next Payment</p>
                    <p className="font-semibold">
                      €{transaction.financialBreakdown.nextPayment.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due {format(transaction.financialBreakdown.nextPayment.dueDate, 'MMM dd')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">KYC</span>
                    <Badge variant={
                      transaction.compliance.kyc === 'COMPLETE' ? 'success' :
                      transaction.compliance.kyc === 'ISSUES' ? 'destructive' :
                      'warning'
                    }>
                      {transaction.compliance.kyc}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AML</span>
                    <Badge variant={
                      transaction.compliance.aml === 'COMPLETE' ? 'success' :
                      transaction.compliance.aml === 'ISSUES' ? 'destructive' :
                      'warning'
                    }>
                      {transaction.compliance.aml}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tax Clearance</span>
                    <Badge variant={
                      transaction.compliance.taxClearance === 'COMPLETE' ? 'success' :
                      transaction.compliance.taxClearance === 'NOT_REQUIRED' ? 'secondary' :
                      'warning'
                    }>
                      {transaction.compliance.taxClearance}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Planning</span>
                    <Badge variant={
                      transaction.compliance.planning === 'COMPLIANT' ? 'success' :
                      transaction.compliance.planning === 'NON_COMPLIANT' ? 'destructive' :
                      'warning'
                    }>
                      {transaction.compliance.planning}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Building Regs</span>
                    <Badge variant={
                      transaction.compliance.buildingRegs === 'COMPLIANT' ? 'success' :
                      transaction.compliance.buildingRegs === 'NON_COMPLIANT' ? 'destructive' :
                      'warning'
                    }>
                      {transaction.compliance.buildingRegs}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall</span>
                    <Badge variant={
                      transaction.compliance.overallStatus === 'CLEAR' ? 'success' :
                      transaction.compliance.overallStatus === 'ISSUES' ? 'destructive' :
                      'warning'
                    }>
                      {transaction.compliance.overallStatus}
                    </Badge>
                  </div>
                </div>
                
                {transaction.compliance.titleIssues.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Title Issues</p>
                    <ul className="text-sm text-yellow-700 list-disc list-inside">
                      {transaction.compliance.titleIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Critical Path */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Critical Path
                </CardTitle>
                <CardDescription>
                  Tasks that directly impact the completion date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transaction.criticalPath.slice(0, 5).map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.task}</p>
                          <p className="text-sm text-gray-600">Owner: {item.owner}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            item.status === 'COMPLETED' ? 'success' :
                            item.status === 'BLOCKED' ? 'destructive' :
                            item.status === 'IN_PROGRESS' ? 'default' :
                            'secondary'
                          }>
                            {item.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.slackDays > 0 ? `${item.slackDays} days slack` : 'No slack'}
                          </p>
                        </div>
                      </div>
                      {item.dependencies.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Depends on: {item.dependencies.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Communications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Recent Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transaction.communications.slice(0, 5).map((comm) => (
                    <div key={comm.id} className="border-b pb-3 last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded ${
                            comm.type === 'EMAIL' ? 'bg-blue-100' :
                            comm.type === 'PHONE' ? 'bg-green-100' :
                            comm.type === 'VIDEO' ? 'bg-purple-100' :
                            comm.type === 'MEETING' ? 'bg-orange-100' :
                            'bg-gray-100'
                          }`}>
                            {comm.type === 'EMAIL' && <MailIcon className="h-4 w-4" />}
                            {comm.type === 'PHONE' && <PhoneIcon className="h-4 w-4" />}
                            {comm.type === 'VIDEO' && <VideoCameraIcon className="h-4 w-4" />}
                            {comm.type === 'MEETING' && <UserGroupIcon className="h-4 w-4" />}
                            {comm.type === 'NOTE' && <DocumentTextIcon className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium">{comm.subject}</p>
                            <p className="text-sm text-gray-600">
                              {comm.participants.join(', ')}
                            </p>
                            {comm.summary && (
                              <p className="text-sm text-gray-700 mt-1">{comm.summary}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {format(comm.timestamp, 'MMM dd, HH:mm')}
                          </p>
                          {comm.followUpRequired && (
                            <Badge variant="warning" className="mt-1">
                              Follow-up
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <TransactionTimeline events={transaction.timeline} />
          </TabsContent>

          <TabsContent value="participants">
            <TransactionParticipants participants={transaction.participants} />
          </TabsContent>

          <TabsContent value="documents">
            <TransactionDocuments 
              documents={transaction.documents} 
              transactionId={transaction.id}
            />
          </TabsContent>

          <TabsContent value="milestones">
            <TransactionMilestones 
              milestones={transaction.milestones}
              transactionId={transaction.id}
            />
          </TabsContent>

          <TabsContent value="financials">
            <TransactionFinancials 
              breakdown={transaction.financialBreakdown}
              transactionId={transaction.id}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <TransactionAnalytics 
              transaction={transaction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}