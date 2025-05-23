import React from 'react';
'use client';

import { useState } from 'react';
import { CaseManagement } from '@/components/conveyancing/CaseManagement';
import { TaskTracker } from '@/components/conveyancing/TaskTracker';
import { DocumentManager } from '@/components/conveyancing/DocumentManager';
import { AMLCompliance } from '@/components/conveyancing/AMLCompliance';
import { FeeManagement } from '@/components/conveyancing/FeeManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  CheckSquare, 
  FileText, 
  Shield, 
  CreditCard,
  TrendingUp,
  Users,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function ConveyancingDashboard() {
  const [activeTabsetActiveTab] = useState('cases');
  const [selectedCaseIdsetSelectedCaseId] = useState<string | null>(null);

  // Mock metrics data
  const metrics = {
    activeCases: 24,
    pendingTasks: 57,
    documentsGenerated: 142,
    totalFees: 285600
  };

  const recentActivity = [
    { id: '1', action: 'Contract signed', case: 'CV-2024-0045', time: '2 hours ago' },
    { id: '2', action: 'AML check completed', case: 'CV-2024-0044', time: '4 hours ago' },
    { id: '3', action: 'New case created', case: 'CV-2024-0046', time: '6 hours ago' },
    { id: '4', action: 'Invoice sent', case: 'CV-2024-0043', time: '1 day ago' }
  ];

  const activeAlerts = [
    { id: '1', message: 'AML check due for case CV-2024-0042', severity: 'warning' },
    { id: '2', message: 'Contract exchange deadline approaching', severity: 'urgent' },
    { id: '3', message: 'Missing documents for case CV-2024-0041', severity: 'info' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Conveyancing Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your conveyancing cases, documents, and compliance requirements
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeCases}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              18 due today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.documentsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{metrics.totalFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activeAlerts.map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{alert.message}</span>
                <Badge 
                  variant={alert.severity === 'urgent' ? 'destructive' : 
                          alert.severity === 'warning' ? 'secondary' : 'default'}
                >
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cases">
            <Briefcase className="h-4 w-4 mr-2" />
            Cases
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="fees">
            <CreditCard className="h-4 w-4 mr-2" />
            Fees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          <CaseManagement onSelectCase={setSelectedCaseId} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TaskTracker caseId={selectedCaseId} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentManager caseId={selectedCaseId} />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <AMLCompliance caseId={selectedCaseId} />
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <FeeManagement caseId={selectedCaseId} />
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    Case: {activity.case}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}