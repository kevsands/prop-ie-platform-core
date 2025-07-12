/**
 * Contractor Valuation History Page
 * 
 * Complete history of submitted valuations with status tracking and actions
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
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
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Copy,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Activity,
  User
} from 'lucide-react';

interface ContractorValuation {
  id: string;
  projectId: string;
  valuationNumber: number;
  periodFrom: string;
  periodTo: string;
  grossValuation: number;
  netAmount: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  submittedAt: string | null;
  submittedBy: string;
  qsReviewedAt: string | null;
  qsReviewedBy: string | null;
  paidAt: string | null;
  qsComments?: string;
  rejectionReason?: string;
}

interface ValuationSummary {
  total: number;
  draft: number;
  submitted: number;
  approved: number;
  paid: number;
  totalValue: number;
}

export default function ContractorValuations() {
  const [valuations, setValuations] = useState<ContractorValuation[]>([]);
  const [summary, setSummary] = useState<ValuationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadValuations();
  }, []);

  const loadValuations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/valuations/contractor/submit?contractorId=murphy-construction');
      const data = await response.json();
      
      if (data.success) {
        setValuations(data.valuations);
        setSummary(data.summary);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error loading valuations:', error);
      toast({
        title: "Error",
        description: "Failed to load valuation history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'submitted':
      case 'under_review':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredValuations = valuations.filter(valuation => {
    const matchesSearch = searchQuery === '' || 
      valuation.valuationNumber.toString().includes(searchQuery) ||
      valuation.projectId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || valuation.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-8 w-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading valuation history...</p>
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
              <Link href="/contractor">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Valuation History</h1>
                <p className="text-gray-600">Track your submitted monthly valuations and payment status</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={loadValuations} variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Link href="/contractor/valuations/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit New Valuation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Valuations</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(summary.totalValue)}
                    </p>
                  </div>
                  <Euro className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid</p>
                    <p className="text-2xl font-bold text-blue-600">{summary.paid}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{summary.approved}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Review</p>
                    <p className="text-2xl font-bold text-orange-600">{summary.submitted}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by valuation number or project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredValuations.length} of {valuations.length} valuations
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredValuations.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Valuations Found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || activeTab !== 'all' 
                        ? 'No valuations match your current filters.' 
                        : 'You haven\'t submitted any valuations yet.'}
                    </p>
                    <Link href="/contractor/valuations/create">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Submit First Valuation
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                filteredValuations.map((valuation) => (
                  <Card key={valuation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Receipt className="h-6 w-6 text-blue-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Valuation #{valuation.valuationNumber}
                              </h3>
                              <Badge className={`flex items-center gap-1 ${getStatusColor(valuation.status)}`}>
                                {getStatusIcon(valuation.status)}
                                {valuation.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">Period</p>
                                <p className="font-medium">
                                  {formatDate(valuation.periodFrom)} - {formatDate(valuation.periodTo)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Gross Valuation</p>
                                <p className="font-medium">{formatCurrency(valuation.grossValuation)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Net Amount</p>
                                <p className="text-lg font-bold text-green-600">
                                  {formatCurrency(valuation.netAmount)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              {valuation.submittedAt && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Submitted {formatDate(valuation.submittedAt)}</span>
                                </div>
                              )}
                              {valuation.qsReviewedAt && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>Reviewed by {valuation.qsReviewedBy}</span>
                                </div>
                              )}
                              {valuation.paidAt && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span>Paid {formatDate(valuation.paidAt)}</span>
                                </div>
                              )}
                            </div>
                            
                            {valuation.qsComments && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>QS Comments:</strong> {valuation.qsComments}
                                </p>
                              </div>
                            )}
                            
                            {valuation.rejectionReason && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">
                                  <strong>Rejection Reason:</strong> {valuation.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {valuation.status === 'draft' && (
                            <Link href={`/contractor/valuations/edit/${valuation.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                          )}
                          
                          {valuation.status === 'rejected' && (
                            <Link href={`/contractor/valuations/resubmit/${valuation.id}`}>
                              <Button variant="outline" size="sm">
                                <Copy className="h-4 w-4 mr-2" />
                                Resubmit
                              </Button>
                            </Link>
                          )}
                          
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}