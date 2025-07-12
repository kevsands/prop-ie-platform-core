'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Download,
  Eye,
  MessageSquare,
  Building,
  Receipt,
  PieChart
} from 'lucide-react';

interface ValuationForApproval {
  id: string;
  valuationNumber: number;
  projectId: string;
  preparedBy: string;
  periodFrom: Date;
  periodTo: Date;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_changes';
  thisValuation: number;
  cumulativeValue: number;
  retentionAmount: number;
  netAmount: number;
  submittedDate: Date;
  dueForApproval: Date;
  workCompleted: string[];
  notes: string;
  documentsAttached: number;
}

interface BOQVariance {
  elementCode: string;
  description: string;
  originalRate: number;
  currentRate: number;
  variance: number;
  variancePercentage: number;
  reason: string;
  impact: 'low' | 'medium' | 'high';
  status: 'approved' | 'pending' | 'rejected';
}

interface PaymentRecommendation {
  id: string;
  subcontractor: string;
  workCategory: string;
  recommendedAmount: number;
  supportingDocuments: string[];
  workComplete: number;
  qualityAssurance: 'passed' | 'pending' | 'failed';
  complianceCheck: boolean;
  recommendedBy: string;
  priority: 'urgent' | 'normal' | 'low';
  paymentDue: Date;
}

export default function DeveloperQuantitySurveyorPage() {
  const [activeTab, setActiveTab] = useState('pending-approvals');
  const [selectedProject, setSelectedProject] = useState('fitzgerald-gardens');
  const [loading, setLoading] = useState(true);
  const [processingApproval, setProcessingApproval] = useState<string | null>(null);

  // Mock data - in production this would come from API
  const pendingValuations: ValuationForApproval[] = [
    {
      id: 'val_001',
      valuationNumber: 12,
      projectId: 'fitzgerald-gardens',
      preparedBy: 'Michael Murphy MSCSI',
      periodFrom: new Date('2025-06-01'),
      periodTo: new Date('2025-06-30'),
      status: 'submitted',
      thisValuation: 1150000,
      cumulativeValue: 18720000,
      retentionAmount: 57500,
      netAmount: 1092500,
      submittedDate: new Date('2025-07-01'),
      dueForApproval: new Date('2025-07-08'),
      workCompleted: ['Structural works Phase 2', 'External envelope 60% complete', 'Services rough-in'],
      notes: 'June 2025 progress valuation - all works proceeding on schedule. Quality inspections passed.',
      documentsAttached: 15
    },
    {
      id: 'val_002', 
      valuationNumber: 13,
      projectId: 'ellwood',
      preparedBy: 'Sarah Kelly MSCSI',
      periodFrom: new Date('2025-06-01'),
      periodTo: new Date('2025-06-30'),
      status: 'under_review',
      thisValuation: 850000,
      cumulativeValue: 12300000,
      retentionAmount: 42500,
      netAmount: 807500,
      submittedDate: new Date('2025-06-28'),
      dueForApproval: new Date('2025-07-05'),
      workCompleted: ['Foundation works complete', 'Groundworks 90%', 'Site infrastructure'],
      notes: 'Monthly valuation for groundworks completion. Minor delay on utilities connection.',
      documentsAttached: 12
    }
  ];

  const boqVariances: BOQVariance[] = [
    {
      elementCode: 'B.2.1',
      description: 'Reinforced concrete foundations',
      originalRate: 185.00,
      currentRate: 195.50,
      variance: 10.50,
      variancePercentage: 5.7,
      reason: 'Increased cement costs due to supply chain inflation',
      impact: 'medium',
      status: 'pending'
    },
    {
      elementCode: 'C.3.1',
      description: 'Structural steelwork',
      originalRate: 2850.00,
      currentRate: 3100.00,
      variance: 250.00,
      variancePercentage: 8.8,
      reason: 'Steel price volatility - market rates increased Q2 2025',
      impact: 'high',
      status: 'approved'
    }
  ];

  const paymentRecommendations: PaymentRecommendation[] = [
    {
      id: 'pay_001',
      subcontractor: 'Murphy Civil Engineering',
      workCategory: 'Groundworks & Foundations',
      recommendedAmount: 485000,
      supportingDocuments: ['Progress photos', 'Quality certificates', 'Measurement sheets'],
      workComplete: 100,
      qualityAssurance: 'passed',
      complianceCheck: true,
      recommendedBy: 'Michael Murphy MSCSI',
      priority: 'urgent',
      paymentDue: new Date('2025-07-15')
    },
    {
      id: 'pay_002',
      subcontractor: 'Steel Fabrication Ltd',
      workCategory: 'Structural Steel Frame',
      recommendedAmount: 312000,
      supportingDocuments: ['Delivery dockets', 'Erection progress', 'Welding certificates'],
      workComplete: 67,
      qualityAssurance: 'passed',
      complianceCheck: true,
      recommendedBy: 'Michael Murphy MSCSI',
      priority: 'normal',
      paymentDue: new Date('2025-07-20')
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // API Integration Functions
  const approveValuation = async (valuationId: string) => {
    setProcessingApproval(valuationId);
    try {
      const response = await fetch('/api/quantity-surveyor/cost-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve_valuation',
          valuationId,
          approvedBy: 'Developer Portal User', // In production, get from auth context
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Show success notification
        console.log('✅ Valuation approved successfully');
        // In production, refresh data or update state
        // setValuations(prev => prev.map(v => v.id === valuationId ? {...v, status: 'approved'} : v));
      } else {
        console.error('❌ Failed to approve valuation:', result.error);
      }
    } catch (error) {
      console.error('❌ Error approving valuation:', error);
    } finally {
      setProcessingApproval(null);
    }
  };

  const approveVariation = async (variationId: string, approvedCost: number) => {
    setProcessingApproval(variationId);
    try {
      const response = await fetch('/api/quantity-surveyor/cost-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve_variation',
          variationId,
          approvedCost,
          approvedBy: 'Developer Portal User',
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Variation approved successfully');
        // Update local state or refresh data
      } else {
        console.error('❌ Failed to approve variation:', result.error);
      }
    } catch (error) {
      console.error('❌ Error approving variation:', error);
    } finally {
      setProcessingApproval(null);
    }
  };

  const approvePayment = async (paymentId: string) => {
    setProcessingApproval(paymentId);
    try {
      // This would integrate with payment processing system
      console.log('🏦 Processing payment approval for:', paymentId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('✅ Payment approved and processed');
      // Update local state
    } catch (error) {
      console.error('❌ Error processing payment:', error);
    } finally {
      setProcessingApproval(null);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'submitted':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'requires_changes':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quantity surveyor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quantity Surveyor Management</h1>
              <p className="text-gray-600 mt-1">Approve valuations, review BOQ changes, and manage payments</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="fitzgerald-gardens">Fitzgerald Gardens</option>
                <option value="ellwood">Ellwood</option>
                <option value="ballymakenny-view">Ballymakenny View</option>
              </select>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">2 urgent, 1 normal</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month Certified</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(2000000)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">2 valuations approved</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">BOQ Variances</p>
                  <p className="text-2xl font-bold text-red-600">5</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">3 high impact</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Queue</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(1200000)}</p>
                </div>
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">8 payments recommended</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending-approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="boq-variances">BOQ Variances</TabsTrigger>
            <TabsTrigger value="payment-recommendations">Payment Queue</TabsTrigger>
            <TabsTrigger value="financial-overview">Financial Overview</TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending-approvals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Valuations Requiring Approval</h3>
              <p className="text-sm text-gray-600">
                {pendingValuations.filter(v => v.status === 'submitted').length} submissions awaiting review
              </p>
            </div>

            <div className="space-y-4">
              {pendingValuations.map((valuation) => (
                <Card key={valuation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">
                          Valuation #{valuation.valuationNumber} - {valuation.projectId}
                        </CardTitle>
                        <CardDescription>
                          {valuation.periodFrom.toLocaleDateString()} - {valuation.periodTo.toLocaleDateString()}
                          {' • '}Prepared by {valuation.preparedBy}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(valuation.status)}>
                          {valuation.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          Due: {valuation.dueForApproval.toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Financial Summary */}
                      <div>
                        <h4 className="font-medium mb-3">Financial Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>This Valuation:</span>
                            <span className="font-medium">{formatCurrency(valuation.thisValuation)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cumulative Value:</span>
                            <span className="font-medium">{formatCurrency(valuation.cumulativeValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Retention (5%):</span>
                            <span className="font-medium text-yellow-600">{formatCurrency(valuation.retentionAmount)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Net Payment:</span>
                            <span className="font-bold text-green-600">{formatCurrency(valuation.netAmount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Work Completed */}
                      <div>
                        <h4 className="font-medium mb-3">Work Completed</h4>
                        <div className="space-y-2">
                          {valuation.workCompleted.map((work, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>{work}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <p><strong>Documents:</strong> {valuation.documentsAttached} attachments</p>
                          <p><strong>Submitted:</strong> {valuation.submittedDate.toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <h4 className="font-medium mb-3">Developer Actions</h4>
                        <div className="space-y-2">
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => approveValuation(valuation.id)}
                            disabled={processingApproval === valuation.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {processingApproval === valuation.id ? 'Processing...' : 'Approve & Certify'}
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Review Details
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Request Changes
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download Docs
                          </Button>
                        </div>

                        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                          <p className="font-medium text-gray-700 mb-1">QS Notes:</p>
                          <p className="text-gray-600">{valuation.notes}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* BOQ Variances Tab */}
          <TabsContent value="boq-variances" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Bill of Quantities Variances</h3>
              <p className="text-sm text-gray-600">
                {boqVariances.filter(v => v.status === 'pending').length} variances requiring approval
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rate Variations Requiring Approval</CardTitle>
                <CardDescription>Review and approve changes to BOQ rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Element Code</th>
                        <th className="text-left p-3">Description</th>
                        <th className="text-right p-3">Original Rate</th>
                        <th className="text-right p-3">New Rate</th>
                        <th className="text-right p-3">Variance</th>
                        <th className="text-center p-3">Impact</th>
                        <th className="text-left p-3">Reason</th>
                        <th className="text-center p-3">Status</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boqVariances.map((variance, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-mono">{variance.elementCode}</td>
                          <td className="p-3">{variance.description}</td>
                          <td className="p-3 text-right">{formatCurrency(variance.originalRate)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(variance.currentRate)}</td>
                          <td className="p-3 text-right">
                            <span className={variance.variance > 0 ? 'text-red-600' : 'text-green-600'}>
                              {variance.variance > 0 ? '+' : ''}{formatCurrency(variance.variance)}
                              <br />
                              <span className="text-xs">({variance.variancePercentage.toFixed(1)}%)</span>
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant="outline" className={
                              variance.impact === 'high' ? 'text-red-600 border-red-200' :
                              variance.impact === 'medium' ? 'text-yellow-600 border-yellow-200' :
                              'text-green-600 border-green-200'
                            }>
                              {variance.impact}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{variance.reason}</td>
                          <td className="p-3 text-center">
                            <Badge className={getStatusColor(variance.status)}>
                              {variance.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            {variance.status === 'pending' && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <AlertTriangle className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Recommendations Tab */}
          <TabsContent value="payment-recommendations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment Recommendations</h3>
              <p className="text-sm text-gray-600">
                {formatCurrency(paymentRecommendations.reduce((sum, p) => sum + p.recommendedAmount, 0))} total recommended
              </p>
            </div>

            <div className="space-y-4">
              {paymentRecommendations.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-lg">{payment.subcontractor}</h4>
                        <p className="text-gray-600">{payment.workCategory}</p>
                        <p className="text-sm text-gray-500">
                          Recommended by {payment.recommendedBy} • Due: {payment.paymentDue.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(payment.recommendedAmount)}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getPriorityColor(payment.priority)}>
                            {payment.priority}
                          </Badge>
                          <Badge className={getStatusColor(payment.qualityAssurance)}>
                            QA: {payment.qualityAssurance}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Work Progress</h5>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completion</span>
                            <span>{payment.workComplete}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${payment.workComplete}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {payment.complianceCheck ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span>Compliance: {payment.complianceCheck ? 'Passed' : 'Issues'}</span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Supporting Documents</h5>
                        <div className="space-y-1">
                          {payment.supportingDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Actions</h5>
                        <div className="space-y-2">
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => approvePayment(payment.id)}
                            disabled={processingApproval === payment.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {processingApproval === payment.id ? 'Processing...' : 'Approve Payment'}
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Review Documents
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Query Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Financial Overview Tab */}
          <TabsContent value="financial-overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Certification Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>June 2025</span>
                      <span className="font-bold">{formatCurrency(1150000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>May 2025</span>
                      <span className="font-bold">{formatCurrency(950000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>April 2025</span>
                      <span className="font-bold">{formatCurrency(1200000)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget vs Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Budget</span>
                      <span className="font-bold">{formatCurrency(28500000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Certified to Date</span>
                      <span className="font-bold text-green-600">{formatCurrency(18720000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Remaining Budget</span>
                      <span className="font-bold">{formatCurrency(9780000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>% Complete</span>
                      <span className="font-bold">65.7%</span>
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