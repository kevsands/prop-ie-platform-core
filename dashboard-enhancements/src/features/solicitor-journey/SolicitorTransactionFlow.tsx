'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  DocumentCheckIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface LegalStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'review';
  documents: Document[];
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
  dependencies?: string[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'received' | 'pending' | 'approved' | 'issues';
  uploadedAt?: string;
  issues?: string[];
}

interface Transaction {
  id: string;
  propertyAddress: string;
  purchasePrice: number;
  buyer: {
    name: string;
    email: string;
    solicitor?: string;
  };
  seller: {
    name: string;
    email: string;
    solicitor?: string;
  };
  status: 'active' | 'completed' | 'on-hold';
  closingDate: string;
  contractDate?: string;
}

export function SolicitorTransactionFlow({ transactionId }: { transactionId: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock transaction data
  const transaction: Transaction = {
    id: transactionId,
    propertyAddress: '42 Oak Avenue, Dublin 4',
    purchasePrice: 450000,
    buyer: {
      name: 'John & Mary Smith',
      email: 'smiths@example.com',
      solicitor: 'O\'Sullivan & Associates'
    },
    seller: {
      name: 'FitzGerald Developments Ltd',
      email: 'sales@fitzgerald.ie',
      solicitor: 'Murphy Legal Partners'
    },
    status: 'active',
    closingDate: '2024-03-15',
    contractDate: '2024-01-20'
  };

  const legalSteps: LegalStep[] = [
    {
      id: 'initial-review',
      title: 'Initial Contract Review',
      description: 'Review sale contract and identify key terms',
      status: 'completed',
      priority: 'high',
      documents: [
        { id: '1', name: 'Sales Contract', type: 'contract', status: 'approved' },
        { id: '2', name: 'Property Title', type: 'title', status: 'approved' }
      ]
    },
    {
      id: 'title-search',
      title: 'Title Search & Investigation',
      description: 'Verify property ownership and check for encumbrances',
      status: 'completed',
      priority: 'high',
      documents: [
        { id: '3', name: 'Title Deeds', type: 'title', status: 'approved' },
        { id: '4', name: 'Land Registry Search', type: 'search', status: 'approved' },
        { id: '5', name: 'Planning Search', type: 'search', status: 'approved' }
      ]
    },
    {
      id: 'mortgage-approval',
      title: 'Mortgage Documentation',
      description: 'Process mortgage approval and related documents',
      status: 'in-progress',
      priority: 'high',
      deadline: '2024-02-20',
      documents: [
        { id: '6', name: 'Mortgage Approval Letter', type: 'finance', status: 'received' },
        { id: '7', name: 'Loan Agreement', type: 'finance', status: 'pending' },
        { id: '8', name: 'Insurance Policy', type: 'insurance', status: 'issues', 
          issues: ['Policy amount insufficient', 'Missing flood coverage'] }
      ]
    },
    {
      id: 'compliance-checks',
      title: 'Compliance & Regulatory Checks',
      description: 'Ensure all regulatory requirements are met',
      status: 'in-progress',
      priority: 'medium',
      documents: [
        { id: '9', name: 'Building Energy Rating', type: 'compliance', status: 'approved' },
        { id: '10', name: 'Tax Clearance Certificate', type: 'compliance', status: 'pending' },
        { id: '11', name: 'Local Authority Charges', type: 'compliance', status: 'received' }
      ],
      dependencies: ['title-search']
    },
    {
      id: 'contract-deposit',
      title: 'Contract Deposit',
      description: 'Manage contract deposit payment',
      status: 'pending',
      priority: 'high',
      deadline: '2024-02-10',
      documents: [
        { id: '12', name: 'Deposit Receipt', type: 'finance', status: 'pending' },
        { id: '13', name: 'Undertaking Letter', type: 'legal', status: 'pending' }
      ],
      dependencies: ['mortgage-approval']
    },
    {
      id: 'final-checks',
      title: 'Pre-Closing Checks',
      description: 'Final verifications before closing',
      status: 'pending',
      priority: 'high',
      documents: [
        { id: '14', name: 'Updated Searches', type: 'search', status: 'pending' },
        { id: '15', name: 'Closing Statement', type: 'finance', status: 'pending' }
      ],
      dependencies: ['compliance-checks', 'contract-deposit']
    },
    {
      id: 'closing',
      title: 'Closing',
      description: 'Complete sale and transfer ownership',
      status: 'pending',
      priority: 'high',
      deadline: transaction.closingDate,
      documents: [
        { id: '16', name: 'Deed of Transfer', type: 'legal', status: 'pending' },
        { id: '17', name: 'Closing Funds Receipt', type: 'finance', status: 'pending' },
        { id: '18', name: 'Keys Release Authorization', type: 'legal', status: 'pending' }
      ],
      dependencies: ['final-checks']
    },
    {
      id: 'post-closing',
      title: 'Post-Closing',
      description: 'Register ownership and finalize documentation',
      status: 'pending',
      priority: 'medium',
      documents: [
        { id: '19', name: 'Registration Documents', type: 'legal', status: 'pending' },
        { id: '20', name: 'Final Account', type: 'finance', status: 'pending' }
      ],
      dependencies: ['closing']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'review':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      approved: { variant: 'default', className: 'bg-green-100 text-green-800' },
      received: { variant: 'secondary' },
      pending: { variant: 'outline' },
      issues: { variant: 'destructive' }
    };
    return variants[status] || { variant: 'outline' };
  };

  const completedSteps = legalSteps.filter(step => step.status === 'completed').length;
  const progress = (completedSteps / legalSteps.length) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Legal Transaction Management</h1>
        <p className="text-gray-600">{transaction.propertyAddress}</p>
      </div>

      {/* Transaction Overview */}
      <Card className="mb-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Purchase Price</p>
            <p className="text-2xl font-bold">€{transaction.purchasePrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Closing Date</p>
            <p className="text-lg font-semibold">{new Date(transaction.closingDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Progress</p>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <Badge className="mt-1" variant={transaction.status === 'active' ? 'default' : 'secondary'}>
              {transaction.status}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-4">
            {legalSteps.map((step) => (
              <Card key={step.id} className={`p-4 ${step.status === 'in-progress' ? 'border-primary' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(step.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      
                      {step.deadline && (
                        <div className="flex items-center gap-2 mt-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Due: {new Date(step.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {/* Document Summary */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {step.documents.map(doc => (
                          <Badge 
                            key={doc.id} 
                            {...getDocumentStatusBadge(doc.status)}
                          >
                            {doc.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Issues Alert */}
                      {step.documents.some(doc => doc.status === 'issues') && (
                        <Alert className="mt-3">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          <AlertTitle>Action Required</AlertTitle>
                          <AlertDescription>
                            Some documents have issues that need to be resolved
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      step.priority === 'high' ? 'destructive' : 
                      step.priority === 'medium' ? 'secondary' : 'outline'
                    }>
                      {step.priority}
                    </Badge>
                    {step.status === 'in-progress' && (
                      <Button size="sm">View Details</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalSteps.flatMap(step => 
              step.documents.map(doc => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                        {doc.uploadedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                        {doc.issues && doc.issues.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-red-600">Issues:</p>
                            <ul className="text-sm text-red-600 list-disc list-inside">
                              {doc.issues.map((issue, idx) => (
                                <li key={idx}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge {...getDocumentStatusBadge(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    {doc.status === 'issues' && (
                      <Button size="sm" variant="destructive">Resolve Issues</Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {legalSteps.map((step, index) => (
                <div key={step.id} className="relative flex items-start">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-gray-200">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        {step.deadline && (
                          <p className="text-sm text-gray-500 mt-1">
                            Deadline: {new Date(step.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge variant={step.status === 'completed' ? 'default' : 'outline'}>
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="communications" className="mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Communications</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Email from Buyer\'s Bank</p>
                    <p className="text-sm text-gray-600">Mortgage approval documentation ready</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <Button size="sm" variant="outline">Reply</Button>
                </div>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Note from Title Company</p>
                    <p className="text-sm text-gray-600">Title search completed - no issues found</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <Button size="lg">
          <DocumentCheckIcon className="h-5 w-5 mr-2" />
          Generate Status Report
        </Button>
        <Button size="lg" variant="outline">
          <UserGroupIcon className="h-5 w-5 mr-2" />
          Schedule Meeting
        </Button>
        <Button size="lg" variant="outline">
          <CurrencyEuroIcon className="h-5 w-5 mr-2" />
          Financial Summary
        </Button>
      </div>
    </div>
  );
}