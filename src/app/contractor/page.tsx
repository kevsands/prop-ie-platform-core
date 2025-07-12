/**
 * Contractor Portal Landing Page
 * 
 * Main dashboard for contractors to submit valuations and track payments
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  FileText,
  Euro,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Calendar,
  Receipt,
  TrendingUp,
  Eye,
  Download,
  Upload,
  User,
  Shield,
  Activity
} from 'lucide-react';

interface ContractorDashboardData {
  projects: {
    id: string;
    name: string;
    status: string;
    totalContract: number;
    certifiedToDate: number;
    retention: number;
    nextValuationDue: string;
  }[];
  recentValuations: {
    id: string;
    number: number;
    amount: number;
    status: string;
    submittedAt: Date;
    project: string;
  }[];
  pendingPayments: {
    certificateNumber: number;
    amount: number;
    dueDate: Date;
    project: string;
  }[];
  summary: {
    totalEarned: number;
    pendingAmount: number;
    retentionHeld: number;
    averagePaymentDays: number;
  };
}

export default function ContractorPortal() {
  const [dashboardData, setDashboardData] = useState<ContractorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load contractor dashboard data
    const loadData = async () => {
      setLoading(true);
      try {
        // In production, this would fetch from API
        // For now, use realistic mock data
        const mockData: ContractorDashboardData = {
          projects: [
            {
              id: 'fitzgerald-gardens',
              name: 'Fitzgerald Gardens',
              status: 'active',
              totalContract: 9814000,
              certifiedToDate: 8687500,
              retention: 434375,
              nextValuationDue: '2025-08-01'
            }
          ],
          recentValuations: [
            {
              id: 'val-009',
              number: 9,
              amount: 617500,
              status: 'approved',
              submittedAt: new Date('2025-06-28'),
              project: 'Fitzgerald Gardens'
            },
            {
              id: 'val-008',
              number: 8,
              amount: 585000,
              status: 'paid',
              submittedAt: new Date('2025-05-31'),
              project: 'Fitzgerald Gardens'
            },
            {
              id: 'val-007',
              number: 7,
              amount: 650000,
              status: 'paid',
              submittedAt: new Date('2025-04-30'),
              project: 'Fitzgerald Gardens'
            }
          ],
          pendingPayments: [
            {
              certificateNumber: 9,
              amount: 617500,
              dueDate: new Date('2025-07-28'),
              project: 'Fitzgerald Gardens'
            }
          ],
          summary: {
            totalEarned: 8687500,
            pendingAmount: 617500,
            retentionHeld: 434375,
            averagePaymentDays: 28
          }
        };

        setDashboardData(mockData);
      } catch (error) {
        console.error('Error loading contractor data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-8 w-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading contractor portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contractor Portal</h1>
                <p className="text-gray-600">Murphy Construction Ltd - Main Contractor</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active Projects: 1
              </Badge>
              <Link href="/contractor/valuations/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Valuation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earned</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(dashboardData.summary.totalEarned)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Euro className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(dashboardData.summary.pendingAmount)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Retention Held</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(dashboardData.summary.retentionHeld)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Payment</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.summary.averagePaymentDays} days
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Active Projects
              </CardTitle>
              <CardDescription>
                Your current construction projects and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <Badge className="bg-green-100 text-green-800">
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Contract Value</span>
                      <span className="font-medium">{formatCurrency(project.totalContract)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Certified to Date</span>
                      <span className="font-medium">{formatCurrency(project.certifiedToDate)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {((project.certifiedToDate / project.totalContract) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(project.certifiedToDate / project.totalContract) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Valuation Due</span>
                      <span className="font-medium text-orange-600">
                        {new Date(project.nextValuationDue).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Link href={`/contractor/projects/${project.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Link href="/contractor/valuations/create">
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Submit Valuation
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Valuations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Valuations
              </CardTitle>
              <CardDescription>
                Your submitted monthly valuations and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentValuations.map((valuation) => (
                  <div key={valuation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Valuation #{valuation.number}</p>
                        <p className="text-sm text-gray-600">{valuation.project}</p>
                        <p className="text-sm text-gray-500">
                          {valuation.submittedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(valuation.amount)}</p>
                      <Badge className={getStatusColor(valuation.status)}>
                        {valuation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <Link href="/contractor/valuations">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Valuations
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments */}
        {dashboardData?.pendingPayments.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Payments
              </CardTitle>
              <CardDescription>
                Payment certificates awaiting settlement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.pendingPayments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Euro className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Certificate #{payment.certificateNumber}</p>
                        <p className="text-sm text-gray-600">{payment.project}</p>
                        <p className="text-sm text-gray-500">
                          Due: {payment.dueDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Math.ceil((payment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/contractor/valuations/create">
                <Button className="w-full h-20 flex flex-col items-center justify-center">
                  <Plus className="h-6 w-6 mb-2" />
                  Submit New Valuation
                </Button>
              </Link>
              
              <Link href="/contractor/valuations">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  View All Valuations
                </Button>
              </Link>
              
              <Link href="/contractor/payments">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Receipt className="h-6 w-6 mb-2" />
                  Payment History
                </Button>
              </Link>
              
              <Link href="/contractor/documents">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Download className="h-6 w-6 mb-2" />
                  Download Documents
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}