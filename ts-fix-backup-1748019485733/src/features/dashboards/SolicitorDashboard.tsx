'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ScaleIcon,
  CurrencyEuroIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon,
  DocumentDuplicateIcon,
  DocumentCheckIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  BookOpenIcon,
  KeyIcon,
  BuildingOfficeIcon,
  LightBulbIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useSolicitorData } from '@/hooks/useSolicitorData';
import { format, differenceInDays } from 'date-fns';
import CaseManager from '@/components/legal/CaseManager';
import DocumentReview from '@/components/legal/DocumentReview';
import ComplianceChecker from '@/components/legal/ComplianceChecker';
import ClientCommunications from '@/components/legal/ClientCommunications';
import TitleExamination from '@/components/legal/TitleExamination';
import DueDiligence from '@/components/legal/DueDiligence';
import TaskCalendar from '@/components/calendar/TaskCalendar';
import InvoiceManager from '@/components/financial/InvoiceManager';
import LegalResearch from '@/components/legal/LegalResearch';
import ContractTemplates from '@/components/legal/ContractTemplates';
import { toast } from 'sonner';

interface SolicitorDashboardProps {
  solicitorId?: string;
}

export default function SolicitorDashboard({ solicitorId }: SolicitorDashboardProps) {
  const { user } = useAuth();
  const { data: solicitorData, isLoading } = useSolicitorData(solicitorId || user?.id);
  const [selectedCasesetSelectedCase] = useState<string>('all');
  const [filterStatussetFilterStatus] = useState<string>('all');
  const [searchQuerysetSearchQuery] = useState('');
  const [selectedDatesetSelectedDate] = useState<Date>(new Date());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!solicitorData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No solicitor data found</p>
      </div>
    );
  }

  const {
    solicitor,
    cases,
    documents,
    tasks,
    clients,
    compliance,
    financials,
    communications,
    analytics
  } = solicitorData;

  const filteredCases = cases.filter(caseItem: any => {
    if (selectedCase !== 'all' && caseItem.id !== selectedCase) return false;
    if (filterStatus !== 'all' && caseItem.status !== filterStatus) return false;
    if (searchQuery) {
      const query: any = searchQuery.toLowerCase();
      return caseItem.reference.toLowerCase().includes(query: any) ||
             caseItem.clientName.toLowerCase().includes(query: any) ||
             caseItem.propertyAddress.toLowerCase().includes(query: any);
    }
    return true;
  });

  const activeCases = cases.filter(c: any => c.status === 'ACTIVE').length;
  const completedThisMonth = cases.filter(c: any => 
    c.status === 'COMPLETED' && 
    c.completedDate && 
    new Date(c.completedDate).getMonth() === new Date().getMonth()
  ).length;
  const pendingReviews = documents.filter(d: any => d.status === 'PENDING_REVIEW').length;
  const complianceScore = compliance.overallScore;

  const urgentTasks = tasks.filter(t: any => t.priority === 'URGENT' && t.status !== 'COMPLETED');
  const upcomingDeadlines = tasks.filter(t: any => {
    const daysUntilDue = differenceInDays(new Date(t.dueDate), new Date());
    return daysUntilDue <= 3 && daysUntilDue>= 0 && t.status !== 'COMPLETED';
  });

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Solicitor Dashboard</h1>
              <p className="text-gray-600 mt-1">{solicitor.firmName} - {solicitor.specialization}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline">
                <ClipboardDocumentCheckIcon className="h-4 w-4 mr-2" />
                Compliance Check
              </Button>
              <Button>
                <FolderIcon className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold">{activeCases}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {completedThisMonth} completed this month
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="text-2xl font-bold">{pendingReviews}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    pending review
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold">{complianceScore}%</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={complianceScore} className="w-20 h-2" />
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgent Tasks</p>
                  <p className="text-2xl font-bold">{urgentTasks.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {upcomingDeadlines.length} deadlines soon
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {urgentTasks.length> 0 && (
          <Alert className="mb-8">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Urgent:</strong> {urgentTasks[0].title} - Due {format(new Date(urgentTasks[0].dueDate), 'MMM dd')}
              <Button size="sm" variant="link" className="ml-2">
                View Task
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Case Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Case Progress Overview</CardTitle>
                  <CardDescription>Active cases by stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.casesByStage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stage" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Task Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks
                      .filter(t: any => format(new Date(t.dueDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                      .map(task: any => (
                        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className={`w-2 h-2 rounded-full ${
                            task.priority === 'URGENT' ? 'bg-red-500' :
                            task.priority === 'HIGH' ? 'bg-orange-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-gray-600">{task.caseReference}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(new Date(task.dueDate), 'HH:mm')}
                          </span>
                        </div>
                      ))}
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    className="rounded-md border mt-4"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Documents</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {documents.slice(08).map(doc: any => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                          <Badge variant={
                            doc.status === 'EXECUTED' ? 'success' :
                            doc.status === 'PENDING_REVIEW' ? 'warning' :
                            'default'
                          }>
                            {doc.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{doc.name}</h4>
                        <p className="text-xs text-gray-600">{doc.caseReference}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(new Date(doc.lastModified), 'MMM dd, yyyy')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Client Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Client Activity</CardTitle>
                <CardDescription>Recent interactions and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.slice(05).map((client: any, index: any) => (
                    <motion.div
                      key={client.id}
                      initial={ opacity: 0, x: -20 }
                      animate={ opacity: 1, x: 0 }
                      transition={ delay: index * 0.05 }
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>{client.name.split(' ').map(n: any => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-600">{client.caseReference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          client.status === 'ACTIVE' ? 'success' :
                          client.status === 'PENDING' ? 'warning' :
                          'secondary'
                        }>
                          {client.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          Last contact: {format(new Date(client.lastContact), 'MMM dd')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cases" className="space-y-6">
            <CaseManager 
              cases={filteredCases}
              onSelectCase={setSelectedCase}
              onCreateCase={() => toast.success('New case created')}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentReview 
              documents={documents}
              cases={cases}
              onReview={(doc: any) => toast.success(`Document ${doc.name} reviewed`)}
            />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <ComplianceChecker 
              compliance={compliance}
              cases={cases}
              onCheckCompliance={() => toast.info('Running compliance check...')}
            />
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <ClientCommunications 
              communications={communications}
              clients={clients}
              onSendMessage={() => toast.success('Message sent')}
            />
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <InvoiceManager 
              financials={financials}
              cases={cases}
              onCreateInvoice={() => toast.success('Invoice created')}
            />
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <LegalResearch 
              templates={solicitorData.templates}
              resources={solicitorData.resources}
              onSearch={(query: any) => toast.info(`Searching for: ${query: any}`)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}