/**
 * Unified Payment and Cost Dashboard
 * 
 * Real-time financial management integrating:
 * - Bill of Quantities (BOQ)
 * - Contractor Valuations
 * - Professional Invoices
 * - Payment Certificates
 * - Cash Flow Management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Euro,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calculator,
  CreditCard,
  Receipt,
  Building2,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Banknote,
  Briefcase,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Settings
} from 'lucide-react';

interface FinancialSummary {
  totalProjectBudget: number;
  totalContractorCertified: number;
  totalProfessionalInvoices: number;
  totalProfessionalPaid: number;
  pendingContractorValue: number;
  pendingProfessionalValue: number;
  totalCommitted: number;
  availableBudget: number;
  costPerformance: number;
  currency: string;
}

interface FinanceDashboardData {
  project: {
    id: string;
    name: string;
    status: string;
    budget: number;
    currency: string;
  };
  summary: FinancialSummary;
  breakdowns: {
    contractorStatus: Record<string, number>;
    professionalStatus: Record<string, number>;
  };
  recentActivity: {
    contractorValuations: any[];
    professionalInvoices: any[];
    paymentCertificates: any[];
  };
  billOfQuantities: any[];
  cashFlow: {
    thisMonth: {
      contractorPayments: number;
      professionalPayments: number;
    };
    nextMonth: {
      estimatedContractorPayments: number;
      estimatedProfessionalPayments: number;
    };
  };
}

export default function UnifiedFinanceDashboard() {
  const [dashboardData, setDashboardData] = useState<FinanceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/finance/dashboard?projectId=fitzgerald-gardens');
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading finance dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to load financial dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'paid': 'bg-emerald-100 text-emerald-800',
      'disputed': 'bg-orange-100 text-orange-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Chart data preparation
  const cashFlowData = dashboardData ? [
    {
      period: 'This Month',
      contractor: dashboardData.cashFlow.thisMonth.contractorPayments,
      professional: dashboardData.cashFlow.thisMonth.professionalPayments,
      total: dashboardData.cashFlow.thisMonth.contractorPayments + dashboardData.cashFlow.thisMonth.professionalPayments
    },
    {
      period: 'Next Month (Est.)',
      contractor: dashboardData.cashFlow.nextMonth.estimatedContractorPayments,
      professional: dashboardData.cashFlow.nextMonth.estimatedProfessionalPayments,
      total: dashboardData.cashFlow.nextMonth.estimatedContractorPayments + dashboardData.cashFlow.nextMonth.estimatedProfessionalPayments
    }
  ] : [];

  const budgetBreakdownData = dashboardData ? [
    { name: 'Contractor Certified', value: dashboardData.summary.totalContractorCertified, color: '#3B82F6' },
    { name: 'Professional Invoices', value: dashboardData.summary.totalProfessionalInvoices, color: '#10B981' },
    { name: 'Available Budget', value: dashboardData.summary.availableBudget, color: '#F59E0B' }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading financial dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load financial data</p>
          <Button onClick={loadDashboardData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-gray-600">{dashboardData.project.name} - Unified Cost & Payment Management</p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
              <Button onClick={loadDashboardData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Project Budget</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.summary.totalProjectBudget)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Committed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.summary.totalCommitted)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {((dashboardData.summary.totalCommitted / dashboardData.summary.totalProjectBudget) * 100).toFixed(1)}% of budget
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Budget</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.summary.availableBudget)}
                  </p>
                  <div className="flex items-center mt-1">
                    {dashboardData.summary.availableBudget > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <p className="text-sm text-gray-500">
                      {((dashboardData.summary.availableBudget / dashboardData.summary.totalProjectBudget) * 100).toFixed(1)}% remaining
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Euro className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.summary.pendingContractorValue + dashboardData.summary.pendingProfessionalValue)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Contractor: {formatCurrency(dashboardData.summary.pendingContractorValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contractors">Contractors</TabsTrigger>
            <TabsTrigger value="professionals">Professionals</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="boq">BOQ Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Breakdown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Budget Allocation
                  </CardTitle>
                  <CardDescription>
                    Current budget distribution across project areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={budgetBreakdownData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {budgetBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cash Flow Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Cash Flow Projections
                  </CardTitle>
                  <CardDescription>
                    Current and projected monthly payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                      <Bar dataKey="contractor" stackId="a" fill="#3B82F6" name="Contractor" />
                      <Bar dataKey="professional" stackId="a" fill="#10B981" name="Professional" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Financial Activity
                </CardTitle>
                <CardDescription>
                  Latest valuations, invoices, and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.contractorValuations.slice(0, 3).map((valuation) => (
                    <div key={valuation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Contractor Valuation #{valuation.valuationNumber}</p>
                          <p className="text-sm text-gray-600">Submitted by {valuation.submittedBy}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(Number(valuation.netAmount))}</p>
                        <Badge className={getStatusColor(valuation.status)}>{valuation.status}</Badge>
                      </div>
                    </div>
                  ))}
                  
                  {dashboardData.recentActivity.professionalInvoices.slice(0, 2).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Professional Invoice #{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-600">{invoice.professionalRole}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(Number(invoice.total))}</p>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contractors">
            <Card>
              <CardHeader>
                <CardTitle>Contractor Valuations</CardTitle>
                <CardDescription>
                  Monthly progress valuations and payment certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                  {Object.entries(dashboardData.breakdowns.contractorStatus).map(([status, count]) => (
                    <div key={status} className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {dashboardData.recentActivity.contractorValuations.map((valuation) => (
                    <div key={valuation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Valuation #{valuation.valuationNumber}</h4>
                        <Badge className={getStatusColor(valuation.status)}>{valuation.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Gross Valuation</p>
                          <p className="font-medium">{formatCurrency(Number(valuation.grossValuation))}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Retention</p>
                          <p className="font-medium">{formatCurrency(Number(valuation.retentionAmount))}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Net Amount</p>
                          <p className="font-medium">{formatCurrency(Number(valuation.netAmount))}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Submitted</p>
                          <p className="font-medium">{valuation.submittedAt ? new Date(valuation.submittedAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      {valuation.qsComments && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm"><strong>QS Comments:</strong> {valuation.qsComments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professionals">
            <Card>
              <CardHeader>
                <CardTitle>Professional Invoices</CardTitle>
                <CardDescription>
                  Design team and consultant billing management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {Object.entries(dashboardData.breakdowns.professionalStatus).map(([status, count]) => (
                    <div key={status} className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {dashboardData.recentActivity.professionalInvoices.map((invoice) => (
                    <div key={invoice.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Invoice #{invoice.invoiceNumber}</h4>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Professional Role</p>
                          <p className="font-medium capitalize">{invoice.professionalRole}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="font-medium">{formatCurrency(Number(invoice.total))}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Issue Date</p>
                          <p className="font-medium">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Due Date</p>
                          <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {invoice.description && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm">{invoice.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cashflow">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Management</CardTitle>
                <CardDescription>
                  Payment timing and liquidity planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">This Month</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Contractor Payments</span>
                        <span className="font-medium">{formatCurrency(dashboardData.cashFlow.thisMonth.contractorPayments)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional Payments</span>
                        <span className="font-medium">{formatCurrency(dashboardData.cashFlow.thisMonth.professionalPayments)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(dashboardData.cashFlow.thisMonth.contractorPayments + dashboardData.cashFlow.thisMonth.professionalPayments)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Next Month (Estimated)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Contractor Payments</span>
                        <span className="font-medium">{formatCurrency(dashboardData.cashFlow.nextMonth.estimatedContractorPayments)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional Payments</span>
                        <span className="font-medium">{formatCurrency(dashboardData.cashFlow.nextMonth.estimatedProfessionalPayments)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(dashboardData.cashFlow.nextMonth.estimatedContractorPayments + dashboardData.cashFlow.nextMonth.estimatedProfessionalPayments)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="boq">
            <Card>
              <CardHeader>
                <CardTitle>Bill of Quantities Analysis</CardTitle>
                <CardDescription>
                  Project cost breakdown and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.billOfQuantities.map((boq) => (
                    <div key={boq.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{boq.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">v{boq.version}</Badge>
                          <Badge className={getStatusColor(boq.status)}>{boq.status}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Value</p>
                          <p className="font-medium">{formatCurrency((boq.totals as any)?.grandTotal || 0)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Contingency</p>
                          <p className="font-medium">{Number(boq.contingency)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Overhead</p>
                          <p className="font-medium">{Number(boq.overhead)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tax Rate</p>
                          <p className="font-medium">{Number(boq.taxRate)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}