'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ScaleIcon,
  UserGroupIcon,
  BanknotesIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  LockClosedIcon,
  FireIcon,
  BellIcon,
  ChartBarIcon,
  CalendarIcon,
  BriefcaseIcon,
  BeakerIcon,
  CpuChipIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  FlagIcon,
  ArrowDownTrayIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import { useCompliance } from '@/hooks/useCompliance';
import { format, subDays } from 'date-fns';
import { toast } from 'sonner';

interface ComplianceScore {
  overall: number;
  categories: {
    dataProtection: number;
    financial: number;
    legal: number;
    operational: number;
    security: number;
    environmental: number;
  };
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  category: 'GDPR' | 'PCI_DSS' | 'SOX' | 'AML' | 'KYC' | 'MIFID' | 'CCPA' | 'CUSTOM';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'PENDING';
  dueDate?: Date;
  lastAssessed?: Date;
  evidence: Evidence[];
  controls: Control[];
  risks: Risk[];
  owner: string;
  department: string;
  documentation: Document[];
  auditHistory: AuditRecord[];
}

interface Evidence {
  id: string;
  type: 'DOCUMENT' | 'LOG' | 'SCREENSHOT' | 'ATTESTATION' | 'CERTIFICATE';
  name: string;
  description: string;
  uploadedBy: string;
  uploadedAt: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  url: string;
}

interface Control {
  id: string;
  name: string;
  type: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE' | 'COMPENSATING';
  description: string;
  effectiveness: 'EFFECTIVE' | 'PARTIAL' | 'INEFFECTIVE' | 'NOT_TESTED';
  automated: boolean;
  frequency: 'CONTINUOUS' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  lastTested?: Date;
  nextTest?: Date;
}

interface Risk {
  id: string;
  description: string;
  likelihood: 'RARE' | 'UNLIKELY' | 'POSSIBLE' | 'LIKELY' | 'CERTAIN';
  impact: 'NEGLIGIBLE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'SEVERE';
  status: 'OPEN' | 'MITIGATED' | 'ACCEPTED' | 'CLOSED';
  mitigation?: string;
  owner: string;
}

interface AuditRecord {
  id: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'REGULATORY';
  auditor: string;
  date: Date;
  findings: Finding[];
  recommendations: string[];
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FOLLOW_UP';
  report?: string;
}

interface Finding {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  remediation?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  dueDate?: Date;
}

export default function ComplianceDashboard() {
  const {
    score,
    requirements,
    audits,
    violations,
    tasks,
    reports,
    regulations,
    runAssessment,
    updateRequirement,
    uploadEvidence,
    generateReport,
    scheduleAudit
  } = useCompliance();

  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<ComplianceRequirement | null>(null);
  const [assessmentProgress, setAssessmentProgress] = useState(0);
  const [isAssessing, setIsAssessing] = useState(false);

  const handleRunAssessment = async () => {
    setIsAssessing(true);
    setAssessmentProgress(0);
    
    try {
      await runAssessment((progress) => {
        setAssessmentProgress(progress);
      });
      toast.success('Compliance assessment completed');
    } catch (error) {
      toast.error('Assessment failed');
    } finally {
      setIsAssessing(false);
      setShowAssessmentModal(false);
    }
  };

  const handleUploadEvidence = async (requirementId: string, file: File) => {
    try {
      await uploadEvidence(requirementId, file);
      toast.success('Evidence uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload evidence');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'green';
      case 'PARTIAL': return 'yellow';
      case 'NON_COMPLIANT': return 'red';
      case 'PENDING': return 'gray';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  };

  const filteredRequirements = useMemo(() => {
    return requirements.filter(req => {
      if (selectedCategory !== 'all' && req.category !== selectedCategory) return false;
      return true;
    });
  }, [requirements, selectedCategory]);

  const complianceStats = useMemo(() => {
    const total = requirements.length;
    const compliant = requirements.filter(r => r.status === 'COMPLIANT').length;
    const partial = requirements.filter(r => r.status === 'PARTIAL').length;
    const nonCompliant = requirements.filter(r => r.status === 'NON_COMPLIANT').length;
    const pending = requirements.filter(r => r.status === 'PENDING').length;

    return {
      total,
      compliant,
      partial,
      nonCompliant,
      pending,
      complianceRate: total > 0 ? (compliant / total) * 100 : 0
    };
  }, [requirements]);

  const upcomingAudits = audits.filter(a => 
    a.status === 'PLANNED' && new Date(a.date) > new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const openFindings = audits.flatMap(a => a.findings).filter(f => f.status === 'OPEN');
  const criticalFindings = openFindings.filter(f => f.severity === 'CRITICAL');

  const chartColors = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage regulatory compliance across all requirements</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold">{score.overall}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    {score.trend === 'IMPROVING' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                    ) : score.trend === 'DECLINING' ? (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
                    ) : (
                      <MinusIcon className="h-4 w-4 text-gray-600" />
                    )}
                    <span className={`text-sm ${
                      score.trend === 'IMPROVING' ? 'text-green-600' :
                      score.trend === 'DECLINING' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {score.trend}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${
                  score.overall >= 90 ? 'bg-green-100' :
                  score.overall >= 70 ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <ShieldCheckIcon className={`h-6 w-6 ${
                    score.overall >= 90 ? 'text-green-600' :
                    score.overall >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Requirements</p>
                  <p className="text-2xl font-bold">{complianceStats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {complianceStats.compliant} compliant
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Findings</p>
                  <p className="text-2xl font-bold">{openFindings.length}</p>
                  <p className="text-xs text-red-500 mt-1">
                    {criticalFindings.length} critical
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Violations (30d)</p>
                  <p className="text-2xl font-bold">{violations.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {violations.filter(v => v.resolved).length} resolved
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Next Audit</p>
                  <p className="text-lg font-bold">
                    {upcomingAudits[0] ? 
                      format(upcomingAudits[0].date, 'MMM dd') : 
                      'None scheduled'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {upcomingAudits.length} upcoming
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {criticalFindings.length > 0 && (
          <Alert className="mb-8">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Critical Compliance Issue:</strong> {criticalFindings[0].description}
              <Button size="sm" variant="link" className="ml-2">
                View Details
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Compliance Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance by Category</CardTitle>
                <CardDescription>Multi-dimensional compliance assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { category: 'Data Protection', score: score.categories.dataProtection },
                      { category: 'Financial', score: score.categories.financial },
                      { category: 'Legal', score: score.categories.legal },
                      { category: 'Operational', score: score.categories.operational },
                      { category: 'Security', score: score.categories.security },
                      { category: 'Environmental', score: score.categories.environmental }
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name="Compliance Score" 
                        dataKey="score" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Score Trend</CardTitle>
                  <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { month: 'Jan', score: 82 },
                        { month: 'Feb', score: 85 },
                        { month: 'Mar', score: 83 },
                        { month: 'Apr', score: 87 },
                        { month: 'May', score: 89 },
                        { month: 'Jun', score: 91 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements Status</CardTitle>
                  <CardDescription>Current compliance status distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Compliant', value: complianceStats.compliant, fill: '#10B981' },
                            { name: 'Partial', value: complianceStats.partial, fill: '#F59E0B' },
                            { name: 'Non-Compliant', value: complianceStats.nonCompliant, fill: '#EF4444' },
                            { name: 'Pending', value: complianceStats.pending, fill: '#6B7280' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[0, 1, 2, 3].map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {[
                      { label: 'Compliant', value: complianceStats.compliant, color: 'bg-green-500' },
                      { label: 'Partial', value: complianceStats.partial, color: 'bg-yellow-500' },
                      { label: 'Non-Compliant', value: complianceStats.nonCompliant, color: 'bg-red-500' },
                      { label: 'Pending', value: complianceStats.pending, color: 'bg-gray-500' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4">
                  <Button 
                    className="w-full"
                    onClick={() => setShowAssessmentModal(true)}
                  >
                    <BeakerIcon className="h-4 w-4 mr-2" />
                    Run Assessment
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => generateReport()}
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => scheduleAudit()}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Audit
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            {/* Requirements Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Compliance Requirements</CardTitle>
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="GDPR">GDPR</SelectItem>
                        <SelectItem value="PCI_DSS">PCI DSS</SelectItem>
                        <SelectItem value="SOX">SOX</SelectItem>
                        <SelectItem value="AML">AML</SelectItem>
                        <SelectItem value="KYC">KYC</SelectItem>
                        <SelectItem value="MIFID">MiFID II</SelectItem>
                        <SelectItem value="CCPA">CCPA</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Requirement
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequirements.map(requirement => (
                    <Card key={requirement.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{requirement.name}</h4>
                              <Badge variant={getStatusColor(requirement.status) as any}>
                                {requirement.status}
                              </Badge>
                              <Badge variant={getPriorityColor(requirement.priority) as any}>
                                {requirement.priority}
                              </Badge>
                              <Badge variant="outline">{requirement.category}</Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{requirement.description}</p>
                            
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Controls</p>
                                <p className="font-medium">{requirement.controls.length}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Evidence</p>
                                <p className="font-medium">{requirement.evidence.length}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Owner</p>
                                <p className="font-medium">{requirement.owner}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Due Date</p>
                                <p className="font-medium">
                                  {requirement.dueDate ? format(requirement.dueDate, 'MMM dd') : 'N/A'}
                                </p>
                              </div>
                            </div>

                            {requirement.risks.length > 0 && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                                <ExclamationTriangleIcon className="h-4 w-4" />
                                {requirement.risks.filter(r => r.status === 'OPEN').length} open risks
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedRequirement(requirement)}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              Upload Evidence
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

          <TabsContent value="audits" className="space-y-6">
            {/* Audit Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Audit Schedule</CardTitle>
                  <Button>
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Audit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audits.map(audit => (
                    <Card key={audit.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{audit.type} Audit</h4>
                              <Badge variant={
                                audit.status === 'COMPLETED' ? 'success' :
                                audit.status === 'IN_PROGRESS' ? 'warning' :
                                audit.status === 'FOLLOW_UP' ? 'destructive' :
                                'default'
                              }>
                                {audit.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Auditor</p>
                                <p className="font-medium">{audit.auditor}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Date</p>
                                <p className="font-medium">{format(audit.date, 'MMM dd, yyyy')}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Findings</p>
                                <p className="font-medium">{audit.findings.length}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Open Items</p>
                                <p className="font-medium text-red-600">
                                  {audit.findings.filter(f => f.status === 'OPEN').length}
                                </p>
                              </div>
                            </div>

                            {audit.findings.length > 0 && (
                              <div className="mt-3 flex gap-4">
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-red-500" />
                                  <span className="text-sm">
                                    Critical: {audit.findings.filter(f => f.severity === 'CRITICAL').length}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                                  <span className="text-sm">
                                    High: {audit.findings.filter(f => f.severity === 'HIGH').length}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                  <span className="text-sm">
                                    Medium: {audit.findings.filter(f => f.severity === 'MEDIUM').length}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-green-500" />
                                  <span className="text-sm">
                                    Low: {audit.findings.filter(f => f.severity === 'LOW').length}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="ghost">
                              View Report
                            </Button>
                            <Button size="sm" variant="outline">
                              Manage Findings
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

          <TabsContent value="violations" className="space-y-6">
            {/* Violations Log */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Compliance Violations</CardTitle>
                  <DatePickerWithRange 
                    date={dateRange}
                    onDateChange={setDateRange}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Violation</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Severity</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Responsible</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {violations.map(violation => (
                        <tr key={violation.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            {format(violation.date, 'MMM dd, yyyy')}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            {violation.description}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{violation.category}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={
                              violation.severity === 'CRITICAL' ? 'destructive' :
                              violation.severity === 'HIGH' ? 'warning' :
                              'default'
                            }>
                              {violation.severity}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={violation.resolved ? 'success' : 'secondary'}>
                              {violation.resolved ? 'Resolved' : 'Open'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {violation.responsible}
                          </td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="ghost">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="controls" className="space-y-6">
            {/* Control Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Control Effectiveness</CardTitle>
                <CardDescription>Monitor and assess control performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['EFFECTIVE', 'PARTIAL', 'INEFFECTIVE', 'NOT_TESTED'].map(status => {
                    const controls = requirements.flatMap(r => r.controls).filter(c => c.effectiveness === status);
                    const color = status === 'EFFECTIVE' ? 'green' :
                                 status === 'PARTIAL' ? 'yellow' :
                                 status === 'INEFFECTIVE' ? 'red' : 'gray';
                    
                    return (
                      <Card key={status}>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">{status}</p>
                            <p className={`text-3xl font-bold text-${color}-600`}>
                              {controls.length}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">controls</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-4">
                  {requirements.flatMap(r => r.controls).slice(0, 5).map(control => (
                    <Card key={control.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{control.name}</h4>
                              <Badge variant={
                                control.effectiveness === 'EFFECTIVE' ? 'success' :
                                control.effectiveness === 'PARTIAL' ? 'warning' :
                                control.effectiveness === 'INEFFECTIVE' ? 'destructive' :
                                'secondary'
                              }>
                                {control.effectiveness}
                              </Badge>
                              <Badge variant="outline">{control.type}</Badge>
                              {control.automated && (
                                <Badge variant="outline">Automated</Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{control.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Frequency:</span>
                                <span className="font-medium ml-1">{control.frequency}</span>
                              </div>
                              {control.lastTested && (
                                <div>
                                  <span className="text-gray-600">Last Tested:</span>
                                  <span className="font-medium ml-1">
                                    {format(control.lastTested, 'MMM dd')}
                                  </span>
                                </div>
                              )}
                              {control.nextTest && (
                                <div>
                                  <span className="text-gray-600">Next Test:</span>
                                  <span className="font-medium ml-1">
                                    {format(control.nextTest, 'MMM dd')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Button size="sm" variant="outline">
                            Test Control
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Compliance Reports */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Compliance Reports</CardTitle>
                  <Button>
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reports.map(report => (
                    <Card key={report.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium mb-1">{report.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <ClockIcon className="h-4 w-4" />
                              {format(report.generatedAt, 'MMM dd, yyyy')}
                            </div>
                          </div>
                          <Badge variant="outline">{report.type}</Badge>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Assessment Modal */}
      <Dialog open={showAssessmentModal} onOpenChange={setShowAssessmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Compliance Assessment</DialogTitle>
            <DialogDescription>
              Perform a comprehensive compliance assessment across all requirements
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {isAssessing ? (
              <>
                <p className="text-sm text-gray-600">Assessment in progress...</p>
                <Progress value={assessmentProgress} />
                <p className="text-xs text-gray-500 text-center">
                  {assessmentProgress}% complete
                </p>
              </>
            ) : (
              <>
                <div>
                  <Label>Assessment Scope</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Requirements</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                      <SelectItem value="overdue">Overdue Items</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Include in Assessment</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="controls" defaultChecked />
                      <Label htmlFor="controls">Control Testing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="evidence" defaultChecked />
                      <Label htmlFor="evidence">Evidence Review</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="risks" defaultChecked />
                      <Label htmlFor="risks">Risk Assessment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="documentation" defaultChecked />
                      <Label htmlFor="documentation">Documentation Check</Label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssessmentModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRunAssessment}
              disabled={isAssessing}
            >
              {isAssessing ? 'Running...' : 'Run Assessment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Requirement Details Modal */}
      {selectedRequirement && (
        <Dialog 
          open={!!selectedRequirement} 
          onOpenChange={() => setSelectedRequirement(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedRequirement.name}</DialogTitle>
              <DialogDescription>
                Compliance requirement details and evidence
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Requirement Overview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={getStatusColor(selectedRequirement.status) as any}>
                    {selectedRequirement.status}
                  </Badge>
                  <Badge variant={getPriorityColor(selectedRequirement.priority) as any}>
                    {selectedRequirement.priority}
                  </Badge>
                  <Badge variant="outline">{selectedRequirement.category}</Badge>
                </div>
                <p className="text-sm text-gray-600">{selectedRequirement.description}</p>
              </div>

              {/* Controls */}
              <div>
                <h3 className="font-semibold mb-3">Controls ({selectedRequirement.controls.length})</h3>
                <div className="space-y-2">
                  {selectedRequirement.controls.map(control => (
                    <div key={control.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{control.name}</p>
                          <p className="text-sm text-gray-600">{control.description}</p>
                        </div>
                        <Badge variant={
                          control.effectiveness === 'EFFECTIVE' ? 'success' :
                          control.effectiveness === 'PARTIAL' ? 'warning' :
                          control.effectiveness === 'INEFFECTIVE' ? 'destructive' :
                          'secondary'
                        }>
                          {control.effectiveness}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence */}
              <div>
                <h3 className="font-semibold mb-3">Evidence ({selectedRequirement.evidence.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedRequirement.evidence.map(evidence => (
                    <div key={evidence.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{evidence.name}</p>
                          <p className="text-sm text-gray-600">{evidence.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>Uploaded by {evidence.uploadedBy}</span>
                            <span>•</span>
                            <span>{format(evidence.uploadedAt, 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                        <Badge variant={
                          evidence.status === 'VERIFIED' ? 'success' :
                          evidence.status === 'REJECTED' ? 'destructive' :
                          'warning'
                        }>
                          {evidence.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-3" variant="outline">
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Upload Evidence
                </Button>
              </div>

              {/* Risks */}
              {selectedRequirement.risks.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Risks ({selectedRequirement.risks.length})</h3>
                  <div className="space-y-2">
                    {selectedRequirement.risks.map(risk => (
                      <div key={risk.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{risk.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span>Likelihood: <Badge variant="outline">{risk.likelihood}</Badge></span>
                              <span>Impact: <Badge variant="outline">{risk.impact}</Badge></span>
                              <span>Owner: {risk.owner}</span>
                            </div>
                            {risk.mitigation && (
                              <p className="text-sm text-gray-600 mt-2">
                                Mitigation: {risk.mitigation}
                              </p>
                            )}
                          </div>
                          <Badge variant={
                            risk.status === 'OPEN' ? 'destructive' :
                            risk.status === 'MITIGATED' ? 'warning' :
                            'success'
                          }>
                            {risk.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit History */}
              {selectedRequirement.auditHistory.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Audit History</h3>
                  <div className="space-y-2">
                    {selectedRequirement.auditHistory.map(audit => (
                      <div key={audit.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{audit.type} Audit</p>
                            <p className="text-sm text-gray-600">
                              By {audit.auditor} on {format(audit.date, 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <Badge>{audit.status}</Badge>
                        </div>
                        {audit.findings.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            {audit.findings.length} findings
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRequirement(null)}>
                Close
              </Button>
              <Button>
                Update Requirement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}