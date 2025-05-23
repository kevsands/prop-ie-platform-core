import React from 'react';
'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentArrowUpIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, addDays } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'AD_HOC' | 'INCIDENT';
  format: 'PDF' | 'EXCEL' | 'CSV' | 'XML' | 'JSON';
  regulation: string;
  sections: ReportSection[];
  frequency: string;
  lastGenerated?: Date;
  nextDue?: Date;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  version: string;
  automationEnabled: boolean;
  recipients: string[];
  approvalRequired: boolean;
  dataSource: string[];
}

interface ReportSection {
  id: string;
  title: string;
  description: string;
  dataType: 'TABLE' | 'CHART' | 'TEXT' | 'METRICS' | 'COMPLIANCE_SCORE';
  required: boolean;
  order: number;
  fields: ReportField[];
  validationRules: ValidationRule[];
}

interface ReportField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  source: string;
  format?: string;
  validation?: string;
}

interface ValidationRule {
  id: string;
  field: string;
  type: 'REQUIRED' | 'FORMAT' | 'RANGE' | 'DEPENDENCY';
  rule: string;
  message: string;
}

interface RegulationReport {
  id: string;
  templateId: string;
  regulationName: string;
  reportName: string;
  period: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  createdDate: Date;
  dueDate: Date;
  submittedDate?: Date;
  submissionMethod: 'PORTAL' | 'EMAIL' | 'API' | 'POSTAL';
  submissionReference?: string;
  author: string;
  reviewer?: string;
  approver?: string;
  regulatoryBody: string;
  jurisdiction: string;
  fileUrl?: string;
  fileSize?: number;
  checksum?: string;
  metadata: ReportMetadata;
  sections: ReportData[];
  validationStatus: ValidationStatus;
  submissionHistory: SubmissionEvent[];
}

interface ReportMetadata {
  reportPeriodStart: Date;
  reportPeriodEnd: Date;
  entityName: string;
  entityId: string;
  regulatorReference: string;
  reportingOfficer: string;
  certificationDate?: Date;
  amendments: Amendment[];
  relatedReports: string[];
  confidentialityLevel: 'PUBLIC' | 'CONFIDENTIAL' | 'RESTRICTED';
}

interface Amendment {
  id: string;
  date: Date;
  description: string;
  author: string;
  reason: string;
  version: string;
}

interface ReportData {
  sectionId: string;
  title: string;
  content: any;
  completeness: number;
  validationErrors: string[];
  lastModified: Date;
  modifiedBy: string;
}

interface ValidationStatus {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  completeness: number;
  lastValidated: Date;
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'ERROR' | 'CRITICAL';
  code: string;
}

interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

interface SubmissionEvent {
  id: string;
  timestamp: Date;
  type: 'CREATED' | 'UPDATED' | 'VALIDATED' | 'SUBMITTED' | 'RECEIVED' | 'ACCEPTED' | 'REJECTED';
  user: string;
  details: string;
  status: string;
  response?: RegulatoryResponse;
}

interface RegulatoryResponse {
  responseId: string;
  responseDate: Date;
  status: 'ACKNOWLEDGED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'ADDITIONAL_INFO_REQUIRED';
  message: string;
  referenceNumber: string;
  nextSteps?: string;
  requiredActions?: string[];
  deadline?: Date;
}

interface RegulatoryFiling {
  id: string;
  regulation: string;
  type: 'PERIODIC' | 'EVENT_DRIVEN' | 'REQUEST_BASED';
  description: string;
  frequency: string;
  jurisdiction: string;
  regulatoryBody: string;
  filingDeadline: Date;
  penaltyForLateSubmission: string;
  template: string;
  requirements: string[];
  lastFiled?: Date;
  nextDue: Date;
  status: 'ON_TRACK' | 'AT_RISK' | 'OVERDUE';
  automationStatus: 'MANUAL' | 'SEMI_AUTOMATED' | 'FULLY_AUTOMATED';
}

interface RegulatoryReportingSystemProps {
  organizationId: string;
}

export default function RegulatoryReportingSystem({ organizationId }: RegulatoryReportingSystemProps) {
  const [reportTemplatessetReportTemplates] = useState<ReportTemplate[]>([]);
  const [reportssetReports] = useState<RegulationReport[]>([]);
  const [filingssetFilings] = useState<RegulatoryFiling[]>([]);
  const [selectedTemplatesetSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [selectedReportsetSelectedReport] = useState<RegulationReport | null>(null);
  const [selectedTabsetSelectedTab] = useState('overview');
  const [isGeneratingReportsetIsGeneratingReport] = useState(false);
  const [isSubmittingReportsetIsSubmittingReport] = useState(false);
  const [showNewReportDialogsetShowNewReportDialog] = useState(false);
  const [showSubmissionDialogsetShowSubmissionDialog] = useState(false);
  const [filterssetFilters] = useState({
    regulation: 'all',
    status: 'all',
    period: 'all',
    dueDate: 'all'
  });

  useEffect(() => {
    // Fetch report templates, reports, and filings
    fetchReportingData();
  }, [organizationId]);

  const fetchReportingData = async () => {
    // Simulate API call
    const mockTemplates: ReportTemplate[] = [
      {
        id: '1',
        name: 'GDPR Monthly Compliance Report',
        description: 'Monthly data protection compliance report for GDPR',
        type: 'MONTHLY',
        format: 'PDF',
        regulation: 'GDPR',
        sections: [
          {
            id: 's1',
            title: 'Executive Summary',
            description: 'High-level overview of GDPR compliance status',
            dataType: 'TEXT',
            required: true,
            order: 1,
            fields: [],
            validationRules: []
          },
          {
            id: 's2',
            title: 'Data Processing Activities',
            description: 'Summary of data processing activities for the period',
            dataType: 'TABLE',
            required: true,
            order: 2,
            fields: [],
            validationRules: []
          }
        ],
        frequency: 'Monthly',
        lastGenerated: new Date('2024-11-01'),
        nextDue: new Date('2024-12-01'),
        status: 'ACTIVE',
        version: '1.2',
        automationEnabled: true,
        recipients: ['compliance@prop.ie', 'legal@prop.ie'],
        approvalRequired: true,
        dataSource: ['user_database', 'transaction_logs', 'access_logs']
      },
      {
        id: '2',
        name: 'AML Quarterly Report',
        description: 'Quarterly anti-money laundering report',
        type: 'QUARTERLY',
        format: 'EXCEL',
        regulation: 'AML',
        sections: [],
        frequency: 'Quarterly',
        lastGenerated: new Date('2024-10-01'),
        nextDue: new Date('2025-01-01'),
        status: 'ACTIVE',
        version: '2.1',
        automationEnabled: false,
        recipients: ['aml@prop.ie', 'risk@prop.ie'],
        approvalRequired: true,
        dataSource: ['transaction_database', 'customer_profiles', 'risk_scores']
      }
    ];

    const mockReports: RegulationReport[] = [
      {
        id: '1',
        templateId: '1',
        regulationName: 'GDPR',
        reportName: 'GDPR Monthly Compliance Report - November 2024',
        period: 'November 2024',
        status: 'IN_REVIEW',
        createdDate: new Date('2024-11-25'),
        dueDate: new Date('2024-12-01'),
        submissionMethod: 'PORTAL',
        author: 'John Smith',
        reviewer: 'Jane Doe',
        regulatoryBody: 'Data Protection Commission',
        jurisdiction: 'Ireland',
        metadata: {
          reportPeriodStart: new Date('2024-11-01'),
          reportPeriodEnd: new Date('2024-11-30'),
          entityName: 'Prop Technologies Ltd',
          entityId: 'PROP-IE-001',
          regulatorReference: 'DPC-IE-2024-11',
          reportingOfficer: 'John Smith',
          amendments: [],
          relatedReports: [],
          confidentialityLevel: 'CONFIDENTIAL'
        },
        sections: [],
        validationStatus: {
          isValid: true,
          errors: [],
          warnings: [],
          completeness: 85,
          lastValidated: new Date()
        },
        submissionHistory: []
      }
    ];

    const mockFilings: RegulatoryFiling[] = [
      {
        id: '1',
        regulation: 'GDPR',
        type: 'PERIODIC',
        description: 'Monthly GDPR compliance report',
        frequency: 'Monthly',
        jurisdiction: 'Ireland',
        regulatoryBody: 'Data Protection Commission',
        filingDeadline: new Date('2024-12-01'),
        penaltyForLateSubmission: '€20 million or 4% of annual turnover',
        template: 'GDPR Monthly Template',
        requirements: ['Personal data inventory', 'Breach notifications', 'DPO activities'],
        lastFiled: new Date('2024-11-01'),
        nextDue: new Date('2024-12-01'),
        status: 'ON_TRACK',
        automationStatus: 'SEMI_AUTOMATED'
      }
    ];

    setReportTemplates(mockTemplates);
    setReports(mockReports);
    setFilings(mockFilings);
  };

  const generateReport = async (templateId: string) => {
    setIsGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      // Add new report to the list
      const newReport: RegulationReport = {
        id: `report-${Date.now()}`,
        templateId,
        regulationName: 'GDPR',
        reportName: `GDPR Monthly Report - ${format(new Date(), 'MMMM yyyy')}`,
        period: format(new Date(), 'MMMM yyyy'),
        status: 'DRAFT',
        createdDate: new Date(),
        dueDate: addDays(new Date(), 7),
        submissionMethod: 'PORTAL',
        author: 'Current User',
        regulatoryBody: 'Data Protection Commission',
        jurisdiction: 'Ireland',
        metadata: {
          reportPeriodStart: new Date(),
          reportPeriodEnd: new Date(),
          entityName: 'Prop Technologies Ltd',
          entityId: 'PROP-IE-001',
          regulatorReference: `DPC-IE-${format(new Date(), 'yyyy-MM')}`,
          reportingOfficer: 'Current User',
          amendments: [],
          relatedReports: [],
          confidentialityLevel: 'CONFIDENTIAL'
        },
        sections: [],
        validationStatus: {
          isValid: false,
          errors: [],
          warnings: [],
          completeness: 0,
          lastValidated: new Date()
        },
        submissionHistory: []
      };
      setReports([newReport, ...reports]);
      setSelectedReport(newReport);
      setShowNewReportDialog(false);
    }, 2000);
  };

  const submitReport = async (reportId: string) => {
    setIsSubmittingReport(true);
    // Simulate report submission
    setTimeout(() => {
      setIsSubmittingReport(false);
      // Update report status
      setReports(reports.map(r => 
        r.id === reportId 
          ? { ...r, status: 'SUBMITTED' as const, submittedDate: new Date() }
          : r
      ));
      setShowSubmissionDialog(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
      case 'SUBMITTED':
      case 'ACCEPTED':
        return 'text-green-600 bg-green-50';
      case 'AT_RISK':
      case 'IN_REVIEW':
      case 'DRAFT':
        return 'text-yellow-600 bg-yellow-50';
      case 'OVERDUE':
      case 'REJECTED':
      case 'NON_COMPLIANT':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredReports = reports.filter(report => {
    if (filters.regulation !== 'all' && report.regulationName !== filters.regulation) return false;
    if (filters.status !== 'all' && report.status !== filters.status) return false;
    // Add more filter logic as needed
    return true;
  });

  const upcomingDeadlines = filings
    .filter(filing => filing.status !== 'OVERDUE')
    .sort((ab: any) => a.filingDeadline.getTime() - b.filingDeadline.getTime())
    .slice(05);

  const overdueFilings = filings.filter(filing => filing.status === 'OVERDUE');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Regulatory Reporting System</h1>
          <p className="text-gray-600">Manage compliance reports and regulatory filings</p>
        </div>
        <div className="flex gap-4">
          <Dialog open={showNewReportDialog} onOpenChange={setShowNewReportDialog}>
            <DialogTrigger asChild>
              <Button>
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Select a report template to generate a new compliance report
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {reportTemplates.map((template: any) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedTemplate(template)}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                        <Badge>{template.regulation}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span> {template.type}
                        </div>
                        <div>
                          <span className="text-gray-500">Format:</span> {template.format}
                        </div>
                        <div>
                          <span className="text-gray-500">Next Due:</span>{' '}
                          {template.nextDue ? format(template.nextDue, 'MMM dd') : 'N/A'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewReportDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => selectedTemplate && generateReport(selectedTemplate.id)}
                  disabled={!selectedTemplate || isGeneratingReport}
                >
                  {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reports Due</p>
                <p className="text-2xl font-bold">{upcomingDeadlines.length}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{overdueFilings.length}</p>
              </div>
              <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold">
                  {reports.filter(r => r.status === 'SUBMITTED').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">
                  {reports.filter(r => ['DRAFT', 'IN_REVIEW'].includes(r.status)).length}
                </p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="filings">Filing Calendar</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>
                Reports and filings due in the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((filing: any) => {
                  const daysUntilDue = differenceInDays(filing.filingDeadline, new Date());
                  return (
                    <div key={filing.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          daysUntilDue <= 7 ? "bg-red-50" : "bg-yellow-50"
                        )}>
                          <CalendarIcon className={cn(
                            "h-5 w-5",
                            daysUntilDue <= 7 ? "text-red-500" : "text-yellow-500"
                          )} />
                        </div>
                        <div>
                          <p className="font-medium">{filing.description}</p>
                          <p className="text-sm text-gray-500">
                            {filing.regulation} • {filing.jurisdiction}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {format(filing.filingDeadline, 'MMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {daysUntilDue} days remaining
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Overdue Filings Alert */}
          {overdueFilings.length> 0 && (
            <Alert variant="destructive">
              <ExclamationCircleIcon className="h-4 w-4" />
              <AlertTitle>Overdue Filings</AlertTitle>
              <AlertDescription>
                You have {overdueFilings.length} overdue filing(s). Immediate action required to avoid penalties.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.regulation} onValueChange={(value: any) => 
                  setFilters({...filters, regulation: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Regulations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regulations</SelectItem>
                    <SelectItem value="GDPR">GDPR</SelectItem>
                    <SelectItem value="AML">AML</SelectItem>
                    <SelectItem value="SOX">SOX</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(value: any) => 
                  setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="IN_REVIEW">In Review</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.period} onValueChange={(value: any) => 
                  setFilters({...filters, period: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Periods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Periods</SelectItem>
                    <SelectItem value="current_month">Current Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="current_quarter">Current Quarter</SelectItem>
                    <SelectItem value="current_year">Current Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report: any) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{report.reportName}</CardTitle>
                      <CardDescription>
                        {report.regulationName} • {report.period}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p>{format(report.dueDate, 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Author:</span>
                      <p>{report.author}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Completeness:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={report.validationStatus.completeness} className="w-20" />
                        <span>{report.validationStatus.completeness}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <p>{report.submittedDate ? format(report.submittedDate, 'MMM dd') : 'Not yet'}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm"
                    onClick={() => setSelectedReport(report)}>
                    View Details
                  </Button>
                  {report.status === 'DRAFT' && (
                    <Button variant="outline" size="sm">
                      Continue Editing
                    </Button>
                  )}
                  {['IN_REVIEW', 'APPROVED'].includes(report.status) && (
                    <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">Submit Report</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Report</DialogTitle>
                          <DialogDescription>
                            Submit this report to the regulatory authority
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Submission Method</Label>
                            <Select defaultValue="PORTAL">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PORTAL">Regulatory Portal</SelectItem>
                                <SelectItem value="EMAIL">Email</SelectItem>
                                <SelectItem value="API">API</SelectItem>
                                <SelectItem value="POSTAL">Postal Mail</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Additional Notes</Label>
                            <Textarea placeholder="Any additional information..." />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowSubmissionDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => submitReport(report.id)} disabled={isSubmittingReport}>
                            {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="filings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Filing Calendar</CardTitle>
              <CardDescription>
                Track all regulatory filing deadlines and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filings.map((filing: any) => {
                  const daysUntilDue = differenceInDays(filing.filingDeadline, new Date());
                  const isOverdue = daysUntilDue <0;

                  return (
                    <div key={filing.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{filing.description}</h3>
                            <Badge className={getStatusColor(filing.status)}>
                              {filing.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Regulation:</span>
                              <p>{filing.regulation}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Frequency:</span>
                              <p>{filing.frequency}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Jurisdiction:</span>
                              <p>{filing.jurisdiction}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Automation:</span>
                              <p>{filing.automationStatus.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Requirements:</span>
                            <ul className="list-disc list-inside mt-1">
                              {filing.requirements.map((reqindex: any) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div>
                            <p className="text-sm text-gray-500">Due Date</p>
                            <p className="font-semibold">
                              {format(filing.filingDeadline, 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {isOverdue ? 'Overdue by' : 'Due in'}
                            </p>
                            <p className={cn(
                              "font-semibold",
                              isOverdue ? "text-red-600" : daysUntilDue <= 7 ? "text-yellow-600" : "text-green-600"
                            )}>
                              {Math.abs(daysUntilDue)} days
                            </p>
                          </div>
                          {filing.lastFiled && (
                            <div>
                              <p className="text-sm text-gray-500">Last Filed</p>
                              <p className="text-sm">{format(filing.lastFiled, 'MMM dd')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {filing.penaltyForLateSubmission && (
                        <Alert className="mt-4" variant={isOverdue ? "destructive" : "default">
                          <AlertDescription>
                            <strong>Penalty for late submission:</strong> {filing.penaltyForLateSubmission}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Manage templates for regulatory reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template: any) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge>{template.regulation}</Badge>
                          <Badge variant="outline">{template.format}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <p>{template.type}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Version:</span>
                            <p>{template.version}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Sections:</span>
                            <p>{template.sections.length}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Auto-enabled:</span>
                            <p>{template.automationEnabled ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Automation Settings</CardTitle>
              <CardDescription>
                Configure automated report generation and submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportTemplates.filter(t => t.automationEnabled).map((template: any) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      <Badge className="bg-green-50 text-green-600">
                        Automation Enabled
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Data Sources</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {template.dataSource.map((source: any) => (
                              <Badge key={source} variant="secondary">{source}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Recipients</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {template.recipients.map((recipient: any) => (
                              <Badge key={recipient} variant="secondary">{recipient}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Next run: {template.nextDue ? format(template.nextDue, 'MMM dd') : 'Not scheduled'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Last run: {template.lastGenerated ? format(template.lastGenerated, 'MMM dd') : 'Never'}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            Run Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Details Dialog */}
      <AnimatePresence>
        {selectedReport && (
          <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedReport.reportName}</DialogTitle>
                <DialogDescription>
                  View and manage report details, submission history, and validation status
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Report Metadata */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Status</Label>
                      <Badge className={cn("mt-1", getStatusColor(selectedReport.status))}>
                        {selectedReport.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <Label>Period</Label>
                      <p>{selectedReport.period}</p>
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <p>{format(selectedReport.dueDate, 'MMMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <Label>Author</Label>
                      <p>{selectedReport.author}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Regulatory Body</Label>
                      <p>{selectedReport.regulatoryBody}</p>
                    </div>
                    <div>
                      <Label>Jurisdiction</Label>
                      <p>{selectedReport.jurisdiction}</p>
                    </div>
                    <div>
                      <Label>Submission Method</Label>
                      <p>{selectedReport.submissionMethod}</p>
                    </div>
                    {selectedReport.submittedDate && (
                      <div>
                        <Label>Submitted Date</Label>
                        <p>{format(selectedReport.submittedDate, 'MMMM dd, yyyy')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Validation Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Validation Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Completeness</span>
                        <div className="flex items-center gap-3">
                          <Progress value={selectedReport.validationStatus.completeness} className="w-32" />
                          <span className="font-medium">{selectedReport.validationStatus.completeness}%</span>
                        </div>
                      </div>
                      {selectedReport.validationStatus.errors.length> 0 && (
                        <Alert variant="destructive">
                          <AlertTitle>Validation Errors</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc list-inside mt-2">
                              {selectedReport.validationStatus.errors.map((errorindex: any) => (
                                <li key={index}>{error.message}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                      {selectedReport.validationStatus.warnings.length> 0 && (
                        <Alert>
                          <AlertTitle>Warnings</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc list-inside mt-2">
                              {selectedReport.validationStatus.warnings.map((warningindex: any) => (
                                <li key={index}>{warning.message}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Submission History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Submission History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedReport.submissionHistory.length === 0 ? (
                      <p className="text-gray-500">No submission history available</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedReport.submissionHistory.map((event: any) => (
                          <div key={event.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                            <div className={cn(
                              "p-2 rounded-lg",
                              event.type === 'ACCEPTED' ? "bg-green-50" :
                              event.type === 'REJECTED' ? "bg-red-50" :
                              "bg-gray-50"
                            )}>
                              <DocumentCheckIcon className={cn(
                                "h-4 w-4",
                                event.type === 'ACCEPTED' ? "text-green-500" :
                                event.type === 'REJECTED' ? "text-red-500" :
                                "text-gray-500"
                              )} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium">{event.type.replace('_', ' ')}</p>
                                <span className="text-sm text-gray-500">
                                  {format(event.timestamp, 'MMM dd, HH:mm')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{event.details}</p>
                              {event.response && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-medium">Regulatory Response</p>
                                  <p className="text-sm text-gray-600">{event.response.message}</p>
                                  {event.response.referenceNumber && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      Reference: {event.response.referenceNumber}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}