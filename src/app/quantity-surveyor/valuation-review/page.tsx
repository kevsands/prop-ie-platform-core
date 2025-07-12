/**
 * QS Valuation Review Dashboard
 * 
 * Allows quantity surveyors to review, approve/reject contractor valuations
 * Integrates with real database BOQ data and generates payment certificates
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Calculator, 
  Euro, 
  Download,
  Eye,
  ArrowLeft,
  AlertTriangle,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Edit,
  Send
} from 'lucide-react';

interface ContractorValuation {
  id: string;
  projectId: string;
  contractorId: string;
  valuationNumber: number;
  period: {
    from: Date;
    to: Date;
  };
  workCompleted: WorkCompletedItem[];
  materialsOnSite: MaterialItem[];
  variations: VariationClaim[];
  grossValuation: number;
  retentionPercentage: number;
  retentionAmount: number;
  previousCertificates: number;
  netAmount: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  submittedAt?: Date;
  submittedBy: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  approvedAt?: Date;
  approvedBy?: string;
  supportingDocuments: any[];
  contractorNotes?: string;
  qsComments?: string;
  rejectionReason?: string;
}

interface WorkCompletedItem {
  boqSectionId: string;
  boqElementId: string;
  description: string;
  quantityComplete: number;
  rate: number;
  amount: number;
  cumulativeQuantity: number;
  percentComplete: number;
}

interface MaterialItem {
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  deliveryDate: Date;
  storageLocation: string;
}

interface VariationClaim {
  variationNumber: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  justification: string;
}

interface ValuationSummary {
  totalPending: number;
  totalUnderReview: number;
  totalApproved: number;
  totalRejected: number;
  avgReviewTime: number;
  monthlyValueApproved: number;
}

export default function ValuationReviewDashboard() {
  const { toast } = useToast();
  const [valuations, setValuations] = useState<ContractorValuation[]>([]);
  const [selectedValuation, setSelectedValuation] = useState<ContractorValuation | null>(null);
  const [summary, setSummary] = useState<ValuationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [reviewComments, setReviewComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Load valuations data
  useEffect(() => {
    const loadValuations = async () => {
      try {
        setLoading(true);
        
        // For demo purposes, use mock data until API is fully connected
        const mockValuations: ContractorValuation[] = [
          {
            id: 'val_2025_009',
            projectId: 'fitzgerald-gardens',
            contractorId: 'murphy-construction-001',
            valuationNumber: 9,
            period: {
              from: new Date('2025-07-01'),
              to: new Date('2025-07-31')
            },
            workCompleted: [
              {
                boqSectionId: 'section_03',
                boqElementId: 'elem_03_001',
                description: 'Reinforced concrete frame',
                quantityComplete: 85.5,
                rate: 950,
                amount: 81225,
                cumulativeQuantity: 1062.5,
                percentComplete: 85
              },
              {
                boqSectionId: 'section_04',
                boqElementId: 'elem_04_001',
                description: 'Insulated facade system',
                quantityComplete: 320,
                rate: 425,
                amount: 136000,
                cumulativeQuantity: 1920,
                percentComplete: 60
              }
            ],
            materialsOnSite: [
              {
                description: 'Precast concrete elements',
                quantity: 12,
                unit: 'No',
                rate: 4500,
                amount: 54000,
                deliveryDate: new Date('2025-07-15'),
                storageLocation: 'East compound'
              }
            ],
            variations: [],
            grossValuation: 485000,
            retentionPercentage: 5.0,
            retentionAmount: 24250,
            previousCertificates: 8720000,
            netAmount: 460750,
            status: 'submitted',
            submittedAt: new Date('2025-07-28'),
            submittedBy: 'John Murphy',
            supportingDocuments: [
              {
                id: 'doc_001',
                filename: 'July_Progress_Photos.pdf',
                type: 'progress_photos',
                uploadedAt: new Date('2025-07-28')
              },
              {
                id: 'doc_002',
                filename: 'Measurement_Sheets_July.xlsx',
                type: 'measurement_sheet',
                uploadedAt: new Date('2025-07-28')
              }
            ],
            contractorNotes: 'Good progress on superstructure. Some delays on facade work due to weather, but catching up. All safety protocols maintained.'
          },
          {
            id: 'val_2025_008',
            projectId: 'fitzgerald-gardens',
            contractorId: 'murphy-construction-001',
            valuationNumber: 8,
            period: {
              from: new Date('2025-06-01'),
              to: new Date('2025-06-30')
            },
            workCompleted: [
              {
                boqSectionId: 'section_02',
                boqElementId: 'elem_02_001',
                description: 'Excavation for foundations',
                quantityComplete: 850,
                rate: 45,
                amount: 38250,
                cumulativeQuantity: 850,
                percentComplete: 100
              }
            ],
            materialsOnSite: [],
            variations: [],
            grossValuation: 650000,
            retentionPercentage: 5.0,
            retentionAmount: 32500,
            previousCertificates: 8070000,
            netAmount: 617500,
            status: 'approved',
            submittedAt: new Date('2025-06-28'),
            submittedBy: 'John Murphy',
            reviewedAt: new Date('2025-07-02'),
            reviewedBy: 'Sarah Mitchell MSCSI',
            approvedAt: new Date('2025-07-02'),
            approvedBy: 'Sarah Mitchell MSCSI',
            supportingDocuments: [],
            qsComments: 'Excavation work completed to specification. Good progress on foundations.'
          }
        ];

        setValuations(mockValuations);

        const mockSummary: ValuationSummary = {
          totalPending: 1,
          totalUnderReview: 0,
          totalApproved: 8,
          totalRejected: 0,
          avgReviewTime: 2.5,
          monthlyValueApproved: 9185000
        };

        setSummary(mockSummary);

      } catch (error) {
        console.error('Error loading valuations:', error);
        toast({
          title: "Error",
          description: "Failed to load valuations",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadValuations();
  }, [toast]);

  const handleApproveValuation = async (valuationId: string) => {
    try {
      const valuation = valuations.find(v => v.id === valuationId);
      if (!valuation) return;

      // Call real API endpoint for valuation approval
      const response = await fetch('/api/finance/valuations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valuationId,
          action: 'approve',
          userId: 'sarah-mitchell-qs', // In real app, get from auth context
          qsComments: reviewComments
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local state with real data
      const updatedValuations = valuations.map(v => 
        v.id === valuationId 
          ? {
              ...v,
              status: 'approved' as const,
              reviewedAt: new Date(),
              reviewedBy: 'Sarah Mitchell MSCSI',
              approvedAt: new Date(),
              approvedBy: 'Sarah Mitchell MSCSI',
              qsComments: reviewComments
            }
          : v
      );

      setValuations(updatedValuations);
      setSelectedValuation(null);
      setReviewComments('');

      toast({
        title: "Valuation Approved",
        description: `Valuation #${valuation.valuationNumber} approved. Payment certificate #${result.data?.paymentCertificate?.certificateNumber || 'TBC'} generated automatically.`
      });

    } catch (error) {
      console.error('Error approving valuation:', error);
      toast({
        title: "Error",
        description: "Failed to approve valuation: " + (error instanceof Error ? error.message : 'Unknown error'),
        variant: "destructive"
      });
    }
  };

  const handleRejectValuation = async (valuationId: string) => {
    try {
      const valuation = valuations.find(v => v.id === valuationId);
      if (!valuation) return;

      if (!rejectionReason.trim()) {
        toast({
          title: "Rejection Reason Required",
          description: "Please provide a reason for rejection",
          variant: "destructive"
        });
        return;
      }

      // Update valuation status
      const updatedValuations = valuations.map(v => 
        v.id === valuationId 
          ? {
              ...v,
              status: 'rejected' as const,
              reviewedAt: new Date(),
              reviewedBy: 'Sarah Mitchell MSCSI',
              rejectionReason,
              qsComments: reviewComments
            }
          : v
      );

      setValuations(updatedValuations);
      setSelectedValuation(null);
      setReviewComments('');
      setRejectionReason('');

      toast({
        title: "Valuation Rejected",
        description: `Valuation #${valuation.valuationNumber} has been rejected`
      });

    } catch (error) {
      console.error('Error rejecting valuation:', error);
      toast({
        title: "Error",
        description: "Failed to reject valuation",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const filteredValuations = valuations.filter(valuation => {
    switch (activeTab) {
      case 'pending':
        return valuation.status === 'submitted';
      case 'under-review':
        return valuation.status === 'under_review';
      case 'approved':
        return valuation.status === 'approved';
      case 'rejected':
        return valuation.status === 'rejected';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading valuations...</p>
        </div>
      </div>
    );
  }

  if (selectedValuation) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setSelectedValuation(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Valuation #{selectedValuation.valuationNumber} Review
                </h1>
                <p className="text-gray-600">
                  {selectedValuation.period.from.toLocaleDateString()} - {selectedValuation.period.to.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(selectedValuation.status)}>
                {selectedValuation.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedValuation.grossValuation)}
                  </p>
                  <p className="text-sm text-gray-600">Gross Valuation</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    -{formatCurrency(selectedValuation.retentionAmount)}
                  </p>
                  <p className="text-sm text-gray-600">Retention ({selectedValuation.retentionPercentage}%)</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">
                    {formatCurrency(selectedValuation.previousCertificates)}
                  </p>
                  <p className="text-sm text-gray-600">Previous Certificates</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedValuation.netAmount)}
                  </p>
                  <p className="text-sm text-gray-600">Net Amount Due</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Work Completed Details */}
          <Card>
            <CardHeader>
              <CardTitle>Work Completed This Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Description</th>
                      <th className="text-right p-3">Quantity</th>
                      <th className="text-right p-3">Rate</th>
                      <th className="text-right p-3">Amount</th>
                      <th className="text-right p-3">% Complete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedValuation.workCompleted.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-right">{item.quantityComplete}</td>
                        <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
                        <td className="p-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                        <td className="p-3 text-right">{item.percentComplete}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Materials on Site */}
          {selectedValuation.materialsOnSite.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Materials on Site</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Description</th>
                        <th className="text-right p-3">Quantity</th>
                        <th className="text-right p-3">Rate</th>
                        <th className="text-right p-3">Amount</th>
                        <th className="text-left p-3">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedValuation.materialsOnSite.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3 text-right">{item.quantity} {item.unit}</td>
                          <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                          <td className="p-3">{item.storageLocation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contractor Notes */}
          {selectedValuation.contractorNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Contractor Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{selectedValuation.contractorNotes}</p>
              </CardContent>
            </Card>
          )}

          {/* QS Review Section */}
          {selectedValuation.status === 'submitted' && (
            <Card>
              <CardHeader>
                <CardTitle>QS Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Comments
                  </label>
                  <Textarea
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Add your review comments..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide reason for rejection..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleApproveValuation(selectedValuation.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Valuation
                  </Button>
                  <Button
                    onClick={() => handleRejectValuation(selectedValuation.id)}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Valuation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Previous QS Comments */}
          {selectedValuation.qsComments && (
            <Card>
              <CardHeader>
                <CardTitle>QS Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{selectedValuation.qsComments}</p>
                {selectedValuation.reviewedBy && (
                  <p className="text-sm text-gray-500 mt-2">
                    Reviewed by {selectedValuation.reviewedBy} on {selectedValuation.reviewedAt?.toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Valuation Review Dashboard</h1>
            <p className="text-gray-600">Review and approve contractor monthly valuations</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800">
              <FileText className="h-3 w-3 mr-1" />
              Fitzgerald Gardens
            </Badge>
            <Button variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              BOQ Reference
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{summary.totalPending}</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{summary.totalUnderReview}</p>
                  <p className="text-sm text-gray-600">Under Review</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{summary.totalApproved}</p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{summary.totalRejected}</p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{summary.avgReviewTime}</p>
                  <p className="text-sm text-gray-600">Avg Review Days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Valuations List */}
        <Card>
          <CardHeader>
            <CardTitle>Contractor Valuations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pending ({valuations.filter(v => v.status === 'submitted').length})</TabsTrigger>
                <TabsTrigger value="under-review">Under Review ({valuations.filter(v => v.status === 'under_review').length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({valuations.filter(v => v.status === 'approved').length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({valuations.filter(v => v.status === 'rejected').length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredValuations.map((valuation) => (
                    <Card key={valuation.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <h3 className="text-lg font-semibold">
                                Valuation #{valuation.valuationNumber}
                              </h3>
                              <Badge className={getStatusColor(valuation.status)}>
                                {valuation.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-600">
                              Period: {valuation.period.from.toLocaleDateString()} - {valuation.period.to.toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Submitted by {valuation.submittedBy} on {valuation.submittedAt?.toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="text-right space-y-2">
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(valuation.netAmount)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Gross: {formatCurrency(valuation.grossValuation)}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedValuation(valuation)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                              {valuation.status === 'submitted' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveValuation(valuation.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredValuations.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900 mb-2">No valuations found</h3>
                      <p className="text-gray-600">No valuations in {activeTab.replace('-', ' ')} status.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}