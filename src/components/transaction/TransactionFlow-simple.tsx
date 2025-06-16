'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  FileText, 
  DollarSign, 
  Home, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface TransactionStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  icon: React.ReactNode;
}

const TransactionFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState('application');

  const steps: TransactionStep[] = [
    {
      id: 'application',
      title: 'Application Submitted',
      description: 'Initial application and documentation review',
      status: 'completed',
      icon: <FileText size={20} />
    },
    {
      id: 'approval',
      title: 'Mortgage Approval',
      description: 'Awaiting mortgage approval from lender',
      status: 'in_progress',
      icon: <DollarSign size={20} />
    },
    {
      id: 'survey',
      title: 'Property Survey',
      description: 'Professional property survey and valuation',
      status: 'pending',
      icon: <Home size={20} />
    },
    {
      id: 'legal',
      title: 'Legal Review',
      description: 'Solicitor contract review and due diligence',
      status: 'pending',
      icon: <User size={20} />
    },
    {
      id: 'completion',
      title: 'Completion',
      description: 'Final settlement and key handover',
      status: 'pending',
      icon: <CheckCircle size={20} />
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction Progress</h1>
        <p className="text-gray-600">
          Track the progress of your property transaction from application to completion.
        </p>
      </div>

      {/* Transaction Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">€450,000</div>
              <div className="text-sm text-gray-500">Purchase Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">€45,000</div>
              <div className="text-sm text-gray-500">Deposit Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">28 days</div>
              <div className="text-sm text-gray-500">Est. Completion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id}
            className={`transition-all duration-200 ${
              activeStep === step.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-100' :
                    step.status === 'in_progress' ? 'bg-blue-100' :
                    step.status === 'blocked' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(step.status)}>
                    {step.status.replace('_', ' ')}
                  </Badge>
                  {getStatusIcon(step.status)}
                </div>
              </div>

              {/* Step-specific content */}
              {step.status === 'in_progress' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-900">Action Required</div>
                      <div className="text-sm text-blue-700">
                        Waiting for mortgage approval documentation
                      </div>
                    </div>
                    <Button size="sm">
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step.status === 'completed' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span className="text-sm">Completed on March 15, 2024</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <FileText className="mx-auto h-6 w-6 mb-2" />
                <div className="font-medium">Upload Documents</div>
                <div className="text-xs text-gray-500">Add required paperwork</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <User className="mx-auto h-6 w-6 mb-2" />
                <div className="font-medium">Contact Solicitor</div>
                <div className="text-xs text-gray-500">Get legal assistance</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <DollarSign className="mx-auto h-6 w-6 mb-2" />
                <div className="font-medium">Payment Schedule</div>
                <div className="text-xs text-gray-500">View payment timeline</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionFlow;