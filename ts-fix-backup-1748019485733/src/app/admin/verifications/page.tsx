'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiFileText, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiEye, FiShield, FiTrendingUp } from 'react-icons/fi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface VerificationRequest {
  id: string;
  type: 'developer' | 'project' | 'document';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  developer: {
    id: string;
    companyName: string;
    companyNumber: string;
    email: string;
    phone: string;
    country: string;
    documents: DocumentFile[];
    riskScore?: number;
    aiAnalysis?: string;
  };
  project?: {
    id: string;
    name: string;
    location: string;
    estimatedValue: number;
    documents: DocumentFile[];
  };
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
}

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  verified: boolean;
  aiScore?: number;
}

interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
}

export default function AdminVerifications() {
  const [verificationssetVerifications] = useState<VerificationRequest[]>([
    {
      id: '1',
      type: 'developer',
      status: 'pending',
      developer: {
        id: 'd1',
        companyName: 'Skyline Developments Ltd',
        companyNumber: 'IE567890',
        email: 'info@skylinedev.ie',
        phone: '+353 1 234 5678',
        country: 'Ireland',
        documents: [
          {
            id: 'doc1',
            name: 'Company Registration.pdf',
            type: 'application/pdf',
            url: '#',
            uploadedAt: new Date('2024-01-15'),
            verified: false,
            aiScore: 92},
          {
            id: 'doc2',
            name: 'Financial Statements.pdf',
            type: 'application/pdf',
            url: '#',
            uploadedAt: new Date('2024-01-15'),
            verified: false,
            aiScore: 88}],
        riskScore: 15,
        aiAnalysis: 'Low risk profile. Established company with 10+ years in business. Clean financial records.'},
      submittedAt: new Date('2024-01-15')},
    {
      id: '2',
      type: 'project',
      status: 'under_review',
      developer: {
        id: 'd2',
        companyName: 'Metro Build Corp',
        companyNumber: 'IE890123',
        email: 'contact@metrobuild.ie',
        phone: '+353 1 987 6543',
        country: 'Ireland',
        documents: []},
      project: {
        id: 'p1',
        name: 'Central Plaza Apartments',
        location: 'Dublin City Center',
        estimatedValue: 45000000,
        documents: [
          {
            id: 'doc3',
            name: 'Planning Permission.pdf',
            type: 'application/pdf',
            url: '#',
            uploadedAt: new Date('2024-01-14'),
            verified: false,
            aiScore: 95},
          {
            id: 'doc4',
            name: 'Site Plans.dwg',
            type: 'application/dwg',
            url: '#',
            uploadedAt: new Date('2024-01-14'),
            verified: false,
            aiScore: 90}]},
      submittedAt: new Date('2024-01-14'),
      reviewedBy: 'Admin User'}]);

  const [selectedVerificationsetSelectedVerification] = useState<VerificationRequest | null>(null);
  const [aiInsightssetAiInsights] = useState<AIInsight[]>([]);
  const [isAnalyzingsetIsAnalyzing] = useState(false);
  const [reviewNotessetReviewNotes] = useState('');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Simulate new verification request
      if (Math.random() > 0.8) {
        const newVerification: VerificationRequest = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? 'developer' : 'project',
          status: 'pending',
          developer: {
            id: `d${Date.now()}`,
            companyName: `New Developer ${Date.now()}`,
            companyNumber: `IE${Date.now()}`,
            email: `contact${Date.now()}@example.ie`,
            phone: '+353 1 000 0000',
            country: 'Ireland',
            documents: [],
            riskScore: Math.floor(Math.random() * 100)},
          submittedAt: new Date()};

        setVerifications(prev => [newVerification, ...prev]);
        toast.info('New verification request received');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleAIAnalysis = async (verification: VerificationRequest) => {
    setIsAnalyzing(true);
    setSelectedVerification(verification);

    // Simulate AI analysis
    setTimeout(() => {
      const insights: AIInsight[] = [
        {
          id: '1',
          type: 'success',
          title: 'Valid Registration',
          description: 'Company registration documents match official records'},
        {
          id: '2',
          type: 'info',
          title: 'Financial Health',
          description: 'Revenue growth of 23% year-over-year, healthy cash flow'},
        {
          id: '3',
          type: 'warning',
          title: 'Previous Project Delay',
          description: 'One project experienced 3-month delay in 2022'},
        {
          id: '4',
          type: 'success',
          title: 'Compliance Check',
          description: 'No regulatory violations or outstanding issues'}];

      setAiInsights(insights);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleApprove = (id: string) => {
    setVerifications(prev => 
      prev.map(v => 
        v.id === id 
          ? { ...v, status: 'approved', reviewedAt: new Date(), reviewedBy: 'Admin User', notes: reviewNotes }
          : v
      )
    );
    setSelectedVerification(null);
    setReviewNotes('');
    toast.success('Verification approved');
  };

  const handleReject = (id: string) => {
    setVerifications(prev => 
      prev.map(v => 
        v.id === id 
          ? { ...v, status: 'rejected', reviewedAt: new Date(), reviewedBy: 'Admin User', notes: reviewNotes }
          : v
      )
    );
    setSelectedVerification(null);
    setReviewNotes('');
    toast.error('Verification rejected');
  };

  const getStatusBadge = (status: VerificationRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning"><FiClock className="w-3 h-3 mr-1" />Pending</Badge>\n  );
      case 'approved':
        return <Badge variant="success"><FiCheckCircle className="w-3 h-3 mr-1" />Approved</Badge>\n  );
      case 'rejected':
        return <Badge variant="destructive"><FiXCircle className="w-3 h-3 mr-1" />Rejected</Badge>\n  );
      case 'under_review':
        return <Badge variant="secondary"><FiEye className="w-3 h-3 mr-1" />Under Review</Badge>\n  );
    }
  };

  const getRiskBadge = (score?: number) => {
    if (!score) return null;

    if (score <30) {
      return <Badge variant="success">Low Risk ({score}%)</Badge>\n  );
    } else if (score <70) {
      return <Badge variant="warning">Medium Risk ({score}%)</Badge>\n  );
    } else {
      return <Badge variant="destructive">High Risk ({score}%)</Badge>\n  );
    }
  };

  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const underReviewCount = verifications.filter(v => v.status === 'under_review').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verification Center</h1>
          <p className="text-gray-600 mt-1">Review and approve developer and project applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiEye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{underReviewCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiShield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Verification Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {verifications.map((verification) => (
              <motion.div
                key={verification.id}
                initial={ opacity: 0, y: 20 }
                animate={ opacity: 1, y: 0 }
                transition={ duration: 0.3 }
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        verification.type === 'developer' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {verification.type === 'developer' ? (
                          <FiBriefcase className="w-6 h-6 text-blue-600" />
                        ) : (
                          <FiFileText className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {verification.type === 'developer' 
                            ? verification.developer.companyName
                            : verification.project?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {verification.type === 'developer'
                            ? `Company #${verification.developer.companyNumber}`
                            : `Location: ${verification.project?.location}`}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          {getStatusBadge(verification.status)}
                          {getRiskBadge(verification.developer.riskScore)}
                          <span className="text-sm text-gray-500">
                            Submitted {format(verification.submittedAt, 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAIAnalysis(verification)}
                      >
                        <FiShield className="w-4 h-4 mr-2" />
                        AI Analysis
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedVerification(verification)}
                          >
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Verification Review</DialogTitle>
                            <DialogDescription>
                              Review and approve or reject this verification request
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Company/Project Details */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Details</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Company Name</Label>
                                  <p className="text-gray-900">{verification.developer.companyName}</p>
                                </div>
                                <div>
                                  <Label>Registration Number</Label>
                                  <p className="text-gray-900">{verification.developer.companyNumber}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="text-gray-900">{verification.developer.email}</p>
                                </div>
                                <div>
                                  <Label>Country</Label>
                                  <p className="text-gray-900">{verification.developer.country}</p>
                                </div>
                              </div>
                            </div>

                            {/* Documents */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                              <div className="space-y-2">
                                {(verification.type === 'developer' 
                                  ? verification.developer.documents 
                                  : verification.project?.documents || []
                                ).map((doc) => (
                                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <FiFileText className="w-5 h-5 text-gray-500" />
                                      <div>
                                        <p className="font-medium text-gray-900">{doc.name}</p>
                                        <p className="text-sm text-gray-600">
                                          Uploaded {format(doc.uploadedAt, 'MMM d, yyyy')}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {doc.aiScore && (
                                        <Badge variant="secondary">
                                          AI Score: {doc.aiScore}%
                                        </Badge>
                                      )}
                                      <Button variant="ghost" size="sm">
                                        <FiEye className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* AI Insights */}
                            {isAnalyzing ? (
                              <div className="text-center py-8">
                                <motion.div
                                  animate={ rotate: 360 }
                                  transition={ duration: 2, repeat: Infinity, ease: "linear" }
                                  className="w-12 h-12 mx-auto mb-4"
                                >
                                  <FiShield className="w-full h-full text-blue-600" />
                                </motion.div>
                                <p className="text-gray-600">Running AI analysis...</p>
                              </div>
                            ) : aiInsights.length> 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">AI Insights</h4>
                                <div className="space-y-2">
                                  {aiInsights.map((insight) => (
                                    <div key={insight.id} className={`p-3 rounded-lg ${
                                      insight.type === 'success' ? 'bg-green-50' :
                                      insight.type === 'warning' ? 'bg-yellow-50' :
                                      'bg-blue-50'
                                    }`}>
                                      <div className="flex items-start gap-3">
                                        {insight.type === 'success' ? (
                                          <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        ) : insight.type === 'warning' ? (
                                          <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                        ) : (
                                          <FiAlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                        )}
                                        <div>
                                          <p className="font-medium text-gray-900">{insight.title}</p>
                                          <p className="text-sm text-gray-600">{insight.description}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Review Notes */}
                            <div>
                              <Label htmlFor="notes">Review Notes</Label>
                              <Textarea
                                id="notes"
                                placeholder="Add any notes about this verification..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="mt-1"
                                rows={4}
                              />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedVerification(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(verification.id)}
                              >
                                Reject
                              </Button>
                              <Button
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white"
                                onClick={() => handleApprove(verification.id)}
                              >
                                Approve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="pending">
            {verifications.filter(v => v.status === 'pending').map((verification) => (
              <Card key={verification.id} className="p-6">
                {/* Same card content as above */}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="under_review">
            {verifications.filter(v => v.status === 'under_review').map((verification) => (
              <Card key={verification.id} className="p-6">
                {/* Same card content as above */}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed">
            {verifications.filter(v => v.status === 'approved' || v.status === 'rejected').map((verification) => (
              <Card key={verification.id} className="p-6">
                {/* Same card content as above */}
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}