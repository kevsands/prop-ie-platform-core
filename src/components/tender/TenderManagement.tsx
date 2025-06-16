'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Upload,
  Calendar,
  DollarSign,
  Clock,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Award,
  BarChart3,
  Users
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/utils/format';
import { 
  useSubmitTenderBid, 
  usePurchasePremiumListing, 
  usePurchaseAIAnalysis,
  useGetTenderRevenue
} from '@/services/TenderService';
import { revenueEngine } from '@/services/revenueEngine';

interface TenderPackage {
  id: string;
  name: string;
  description: string;
  category: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'EVALUATING' | 'AWARDED';
  budget: number;
  submissions: number;
  fees?: {
    submissionFee: number;
    aiAnalysisFee?: number;
    totalCollected: number;
  };
  aiAnalysisAvailable?: boolean;
}

interface TenderSubmission {
  id: string;
  contractorName: string;
  proposedAmount: number;
  proposedTimeline: number;
  submittedAt: string;
  totalScore?: number;
  ranking?: number;
  isPremiumContractor?: boolean;
  submissionFeePaid?: boolean;
  aiAnalysis?: {
    priceCompetitiveness: any;
    timelineAnalysis: any;
    experienceScore: any;
    riskFactors: string[];
    recommendations: string[];
    feesPaid?: boolean;
  };
  riskAssessment?: {
    overallRisk: string;
    financialRisk: string;
    deliveryRisk: string;
    qualityRisk: string;
  };
}

export function TenderManagement() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTender, setSelectedTender] = useState<TenderPackage | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [showAIAnalysisPurchase, setShowAIAnalysisPurchase] = useState(false);
  const [showFeesBreakdown, setShowFeesBreakdown] = useState(false);

  // Revenue hooks
  const submitBidMutation = useSubmitTenderBid();
  const purchasePremiumMutation = usePurchasePremiumListing();
  const purchaseAIMutation = usePurchaseAIAnalysis();
  const { data: tenderRevenue } = useGetTenderRevenue();

  // Mock data
  const tenders: TenderPackage[] = [
    {
      id: '1',
      name: 'Electrical Installation - Phase 1',
      description: 'Complete electrical installation for residential units',
      category: 'Electrical',
      issueDate: '2024-01-10',
      dueDate: '2024-02-10',
      status: 'EVALUATING',
      budget: 450000,
      submissions: 5,
      fees: {
        submissionFee: 25,
        aiAnalysisFee: 50,
        totalCollected: 175
      },
      aiAnalysisAvailable: true
    },
    {
      id: '2',
      name: 'Plumbing Works - Block A',
      description: 'Plumbing installation for Block A apartments',
      category: 'Plumbing',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'PUBLISHED',
      budget: 320000,
      submissions: 3,
      fees: {
        submissionFee: 25,
        totalCollected: 75
      },
      aiAnalysisAvailable: false
    }
  ];

  const submissions: TenderSubmission[] = [
    {
      id: '1',
      contractorName: 'Elite Electrical Ltd',
      proposedAmount: 425000,
      proposedTimeline: 90,
      submittedAt: '2024-02-08',
      totalScore: 88,
      ranking: 1,
      isPremiumContractor: true,
      submissionFeePaid: true,
      aiAnalysis: {
        priceCompetitiveness: { score: 85, marketComparison: 'Below market average' },
        timelineAnalysis: { feasibility: 'High', risks: ['Weather dependency'] },
        experienceScore: { score: 92, relevantProjects: 15 },
        riskFactors: ['Insurance expiring in 2 months'],
        recommendations: ['Verify subcontractor availability', 'Request updated insurance'],
        feesPaid: true
      },
      riskAssessment: {
        overallRisk: 'Low',
        financialRisk: 'Low',
        deliveryRisk: 'Medium',
        qualityRisk: 'Low'
      }
    },
    {
      id: '2',
      contractorName: 'PowerTech Solutions',
      proposedAmount: 438000,
      proposedTimeline: 85,
      submittedAt: '2024-02-09',
      totalScore: 82,
      ranking: 2,
      isPremiumContractor: false,
      submissionFeePaid: true,
      aiAnalysis: {
        priceCompetitiveness: { score: 78, marketComparison: 'At market average' },
        timelineAnalysis: { feasibility: 'Medium', risks: ['Aggressive timeline'] },
        experienceScore: { score: 88, relevantProjects: 12 },
        riskFactors: ['Tight timeline may impact quality'],
        recommendations: ['Clarify resource allocation', 'Add buffer to timeline'],
        feesPaid: false
      },
      riskAssessment: {
        overallRisk: 'Medium',
        financialRisk: 'Low',
        deliveryRisk: 'High',
        qualityRisk: 'Medium'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'PUBLISHED': return 'primary';
      case 'CLOSED': return 'secondary';
      case 'EVALUATING': return 'warning';
      case 'AWARDED': return 'success';
      default: return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleAwardTender = (submissionId: string) => {

    // API call to award tender
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tender Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <FileText className="h-4 w-4 mr-2" />
          Create Tender
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Create New Tender Package</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Tender Name</Label>
                <Input id="name" placeholder="e.g., Electrical Installation - Phase 1" />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select id="category" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select category</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="masonry">Masonry</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget Estimate</Label>
                  <Input id="budget" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="dueDate">Submission Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>

              <div>
                <Label>Requirements Document</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop files here or click to upload
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Select Files
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button>Create Tender</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Tenders</TabsTrigger>
          <TabsTrigger value="evaluating">Under Evaluation</TabsTrigger>
          <TabsTrigger value="awarded">Awarded</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {tenders
            .filter(t => t.status === 'PUBLISHED')
            .map(tender => (
              <Card key={tender.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{tender.name}</h3>
                        <Badge variant={getStatusColor(tender.status)}>
                          {tender.status}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">{tender.description}</p>

                      <div className="grid grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium">{tender.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="font-medium">{formatCurrency(tender.budget)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p className="font-medium">{formatDate(tender.dueDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Submissions</p>
                          <p className="font-medium">{tender.submissions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="font-medium text-green-600">
                            {tender.fees ? formatCurrency(tender.fees.totalCollected) : '€0'}
                          </p>
                          {tender.aiAnalysisAvailable && (
                            <p className="text-xs text-blue-600">AI Analysis Available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-col">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedTender(tender);
                            setShowSubmissions(true);
                          }}
                        >
                          View Submissions
                        </Button>
                      </div>
                      {tender.aiAnalysisAvailable && (
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                            onClick={() => {
                              setSelectedTender(tender);
                              setShowAIAnalysisPurchase(true);
                            }}
                          >
                            <Brain className="h-4 w-4 mr-1" />
                            Get AI Analysis (€50)
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-700 border-green-200"
                            onClick={() => {
                              setSelectedTender(tender);
                              setShowFeesBreakdown(true);
                            }}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Revenue Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="evaluating" className="space-y-4 mt-6">
          {tenders
            .filter(t => t.status === 'EVALUATING')
            .map(tender => (
              <Card key={tender.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{tender.name}</h3>
                        <Badge variant={getStatusColor(tender.status)}>
                          {tender.status}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">{tender.description}</p>

                      <Alert>
                        <Brain className="h-4 w-4" />
                        <AlertDescription>
                          AI analysis complete. {tender.submissions} submissions ranked and scored.
                        </AlertDescription>
                      </Alert>
                    </div>

                    <Button 
                      onClick={() => {
                        setSelectedTender(tender);
                        setShowSubmissions(true);
                      }
                    >
                      Evaluate Submissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Submissions Modal */}
      {showSubmissions && selectedTender && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Tender Submissions - {selectedTender.name}
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSubmissions(false)}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {submissions.map((submissionindex: any) => (
                <Card key={submission.id} className={index === 0 ? 'border-primary' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <Badge variant={index === 0 ? 'default' : 'secondary'}>
                            Rank #{submission.ranking}
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">{submission.contractorName}</h3>
                            {submission.isPremiumContractor && (
                              <Badge className="bg-gold-100 text-gold-800 border-gold-200">
                                Premium
                              </Badge>
                            )}
                            {submission.submissionFeePaid && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                Fee Paid
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Submitted {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold">{formatCurrency(submission.proposedAmount)}</p>
                        <p className="text-sm text-muted-foreground">{submission.proposedTimeline} days</p>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            AI Analysis
                            {submission.aiAnalysis?.feesPaid && (
                              <Badge className="bg-blue-100 text-blue-800 ml-2">
                                Premium Analysis
                              </Badge>
                            )}
                          </h4>

                          {submission.aiAnalysis?.feesPaid ? (
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Price Score:</span>
                                <span className="ml-2">{submission.aiAnalysis?.priceCompetitiveness.score}/100</span>
                              </div>
                              <div>
                                <span className="font-medium">Experience Score:</span>
                                <span className="ml-2">{submission.aiAnalysis?.experienceScore.score}/100</span>
                              </div>
                              <div>
                                <span className="font-medium">Timeline Feasibility:</span>
                                <span className="ml-2">{submission.aiAnalysis?.timelineAnalysis.feasibility}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground mb-3">
                                Detailed AI analysis available with premium upgrade
                              </p>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Brain className="h-4 w-4 mr-1" />
                                Purchase AI Analysis (€50)
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Risk Assessment
                          </h4>

                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Overall Risk:</span>
                              <span className={`ml-2 font-semibold ${getRiskColor(submission.riskAssessment?.overallRisk || '')}`}>
                                {submission.riskAssessment?.overallRisk}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Financial Risk:</span>
                              <span className={`ml-2 ${getRiskColor(submission.riskAssessment?.financialRisk || '')}`}>
                                {submission.riskAssessment?.financialRisk}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Delivery Risk:</span>
                              <span className={`ml-2 ${getRiskColor(submission.riskAssessment?.deliveryRisk || '')}`}>
                                {submission.riskAssessment?.deliveryRisk}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recommendations & Risk Factors */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Recommendations</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {submission.aiAnalysis?.recommendations.map((reci: any) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Risk Factors</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {submission.aiAnalysis?.riskFactors.map((riski: any) => (
                            <li key={i} className="text-yellow-600">{risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline">View Full Submission</Button>
                      {index === 0 && (
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAwardTender(submission.id)}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Award Tender
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Purchase Modal */}
      {showAIAnalysisPurchase && selectedTender && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Purchase AI Analysis</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAIAnalysisPurchase(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Premium AI Analysis Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Comprehensive bid scoring and ranking</li>
                  <li>• Risk assessment and mitigation strategies</li>
                  <li>• Market comparison and price analysis</li>
                  <li>• Timeline feasibility evaluation</li>
                  <li>• Detailed contractor performance insights</li>
                </ul>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">AI Analysis Fee:</span>
                <span className="text-xl font-bold text-blue-600">€50</span>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAIAnalysisPurchase(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    purchaseAIMutation.mutate({
                      tenderId: selectedTender.id,
                      developerId: 'current-user'
                    });
                    setShowAIAnalysisPurchase(false);
                  }}
                  disabled={purchaseAIMutation.isPending}
                >
                  {purchaseAIMutation.isPending ? 'Processing...' : 'Purchase Analysis'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Breakdown Modal */}
      {showFeesBreakdown && selectedTender && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Revenue Breakdown</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFeesBreakdown(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Submission Fees</p>
                  <p className="text-2xl font-bold text-green-900">
                    €{selectedTender.fees?.submissionFee ? selectedTender.fees.submissionFee * selectedTender.submissions : 0}
                  </p>
                  <p className="text-xs text-green-700">
                    {selectedTender.submissions} submissions × €{selectedTender.fees?.submissionFee || 25}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">AI Analysis</p>
                  <p className="text-2xl font-bold text-blue-900">
                    €{selectedTender.fees?.aiAnalysisFee || 0}
                  </p>
                  <p className="text-xs text-blue-700">
                    {selectedTender.aiAnalysisAvailable ? 'Available' : 'Not requested'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Revenue:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    €{selectedTender.fees?.totalCollected || 0}
                  </span>
                </div>
              </div>

              {tenderRevenue && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Platform Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Platform Revenue:</span>
                      <span className="font-medium">€{tenderRevenue.totalRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Potential:</span>
                      <span className="font-medium text-green-600">+{tenderRevenue.growthPotential}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Monthly:</span>
                      <span className="font-medium">€{tenderRevenue.projectedMonthlyRevenue}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Premium Contractor Upgrade Modal */}
      {showPremiumUpgrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPremiumUpgrade(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Premium Contractor Benefits</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Priority listing in search results</li>
                  <li>• Enhanced profile with portfolio showcase</li>
                  <li>• Direct contact from developers</li>
                  <li>• Advanced bidding analytics</li>
                  <li>• Verified contractor badge</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Monthly Premium</p>
                    <p className="text-sm text-gray-600">€100/month</p>
                  </div>
                  <Button 
                    className="bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => {
                      purchasePremiumMutation.mutate({
                        contractorId: 'current-contractor',
                        duration: 'monthly'
                      });
                      setShowPremiumUpgrade(false);
                    }}
                  >
                    Choose Monthly
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div>
                    <p className="font-medium">Annual Premium</p>
                    <p className="text-sm text-gray-600">€1,000/year (2 months free!)</p>
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      purchasePremiumMutation.mutate({
                        contractorId: 'current-contractor',
                        duration: 'annual'
                      });
                      setShowPremiumUpgrade(false);
                    }}
                  >
                    Choose Annual
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}