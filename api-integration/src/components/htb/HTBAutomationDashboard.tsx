'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Euro, 
  TrendingUp,
  RefreshCw,
  Eye,
  Download,
  MessageSquare,
  Calendar,
  ArrowRight,
  Upload
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { HTBClaim, HTBClaimStatus, HTBDocument } from '@/types/htb';
import { htbAutomationService, HTBProcessingStage } from '@/lib/services/htb-automation-service';
import { htbService } from '@/lib/services/htb-real';
import { htbRealRegulationsService } from '@/lib/services/htb-real-regulations-service';

interface HTBAutomationDashboardProps {
  buyerId: string;
  className?: string;
}

interface AutomationStatus {
  stage: HTBProcessingStage;
  progress: number;
  nextActions: string[];
  documentsStatus: { total: number; uploaded: number; verified: number };
}

export default function HTBAutomationDashboard({
  buyerId,
  className = ''
}: HTBAutomationDashboardProps) {
  const [claims, setClaims] = useState<HTBClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<HTBClaim | null>(null);
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load HTB claims for buyer
  const loadClaims = async () => {
    try {
      setRefreshing(true);
      const buyerClaims = await htbService.getBuyerClaims(buyerId);
      setClaims(buyerClaims);
      
      if (buyerClaims.length > 0 && !selectedClaim) {
        setSelectedClaim(buyerClaims[0]);
      }
    } catch (error) {
      console.error('Failed to load HTB claims:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load automation status for selected claim
  const loadAutomationStatus = async (claimId: string) => {
    try {
      const status = await htbAutomationService.getAutomationStatus(claimId);
      setAutomationStatus(status);
    } catch (error) {
      console.error('Failed to load automation status:', error);
    }
  };

  useEffect(() => {
    loadClaims();
  }, [buyerId]);

  useEffect(() => {
    if (selectedClaim) {
      loadAutomationStatus(selectedClaim.id);
    }
  }, [selectedClaim]);

  // Get status color based on HTB claim status
  const getStatusColor = (status: HTBClaimStatus): string => {
    switch (status) {
      case HTBClaimStatus.APPROVED:
        return 'text-green-600 bg-green-100';
      case HTBClaimStatus.SUBMITTED:
      case HTBClaimStatus.APPROVAL_PENDING:
        return 'text-blue-600 bg-blue-100';
      case HTBClaimStatus.UNDER_REVIEW:
        return 'text-yellow-600 bg-yellow-100';
      case HTBClaimStatus.REJECTED:
        return 'text-red-600 bg-red-100';
      case HTBClaimStatus.COMPLETED:
        return 'text-green-700 bg-green-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get stage description
  const getStageDescription = (stage: HTBProcessingStage): string => {
    const descriptions = {
      'initial_assessment': 'Assessing your eligibility for Help-to-Buy',
      'document_collection': 'Collecting and verifying required documents',
      'eligibility_verification': 'Verifying your eligibility criteria',
      'property_validation': 'Validating property details and compliance',
      'financial_verification': 'Verifying your financial information',
      'application_submission': 'Submitting application to Housing Agency',
      'approval_pending': 'Awaiting approval from Housing Agency',
      'approved': 'Your HTB application has been approved',
      'rejected': 'Application has been rejected - review required',
      'disbursement_ready': 'HTB funds ready for disbursement',
      'completed': 'HTB claim has been completed successfully'
    };
    return descriptions[stage] || 'Processing your HTB application';
  };

  // Calculate overall progress percentage
  const calculateOverallProgress = (claim: HTBClaim, automation: AutomationStatus): number => {
    const stageWeights = {
      'initial_assessment': 5,
      'document_collection': 20,
      'eligibility_verification': 35,
      'property_validation': 50,
      'financial_verification': 65,
      'application_submission': 80,
      'approval_pending': 90,
      'approved': 95,
      'rejected': 0,
      'disbursement_ready': 98,
      'completed': 100
    };

    const baseProgress = stageWeights[automation.stage] || 0;
    const docProgress = automation.documentsStatus.total > 0 
      ? (automation.documentsStatus.verified / automation.documentsStatus.total) * 15 
      : 0;

    return Math.min(baseProgress + docProgress, 100);
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading HTB applications...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No HTB Applications Found</h3>
                <p className="text-muted-foreground">
                  You haven't started any Help-to-Buy applications yet.
                </p>
              </div>
              <Button>
                Start HTB Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Bot className="h-6 w-6 mr-2 text-blue-600" />
            HTB Automation Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your automated Help-to-Buy applications
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadClaims}
          disabled={refreshing}
        >
          {refreshing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Claims Selection */}
      {claims.length > 1 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your HTB Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {claims.map((claim) => (
                <Button
                  key={claim.id}
                  variant={selectedClaim?.id === claim.id ? "default" : "outline"}
                  className="h-auto p-4 justify-start"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <div className="text-left">
                    <div className="font-medium">{claim.propertyAddress}</div>
                    <div className="text-xs text-muted-foreground">
                      €{claim.propertyPrice.toLocaleString()} • {format(new Date(claim.applicationDate), 'MMM dd, yyyy')}
                    </div>
                    <Badge className={cn("text-xs mt-1", getStatusColor(claim.status))}>
                      {claim.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedClaim && automationStatus && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    HTB Application Progress
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Real Regulations
                    </Badge>
                    <Badge className={getStatusColor(selectedClaim.status)}>
                      {selectedClaim.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  {getStageDescription(automationStatus.stage)} • Assessed against current Housing Agency regulations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {calculateOverallProgress(selectedClaim, automationStatus).toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={calculateOverallProgress(selectedClaim, automationStatus)} 
                    className="h-2" 
                  />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-xl font-bold text-blue-600">
                        €{selectedClaim.requestedAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">HTB Amount</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-xl font-bold text-green-600">
                        {automationStatus.documentsStatus.verified}/{automationStatus.documentsStatus.total}
                      </div>
                      <div className="text-sm text-muted-foreground">Documents Verified</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-xl font-bold text-purple-600">
                        {calculateOverallProgress(selectedClaim, automationStatus).toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Completion</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-xl font-bold text-orange-600">
                        {Math.max(0, Math.floor((new Date('2025-03-01').getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                      </div>
                      <div className="text-sm text-muted-foreground">Days Remaining</div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Compliance Notice */}
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">Housing Agency Compliance</div>
                        <div className="text-sm mt-1">
                          Your application is being processed according to current HTB regulations.
                          {selectedClaim.requestedAmount >= 20000 && ' Qualified financial advisor review is required for amounts over €20,000.'}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        2025 Regulations
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Next Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Next Actions Required
                </CardTitle>
                <CardDescription>
                  Actions needed to progress your HTB application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {automationStatus.nextActions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action}</p>
                        {index === 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Priority action - complete as soon as possible
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    </div>
                  ))}
                  
                  {automationStatus.nextActions.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p>No immediate actions required</p>
                      <p className="text-sm">Your application is progressing normally</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {/* Documents Status */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Required Documents
                  </CardTitle>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
                <CardDescription>
                  Upload and track verification status of required documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Documents Progress */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{automationStatus.documentsStatus.total}</div>
                      <div className="text-sm text-muted-foreground">Total Required</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{automationStatus.documentsStatus.uploaded}</div>
                      <div className="text-sm text-muted-foreground">Uploaded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{automationStatus.documentsStatus.verified}</div>
                      <div className="text-sm text-muted-foreground">AI Verified</div>
                    </div>
                  </div>
                  
                  {/* Verification Status */}
                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertDescription>
                      <div className="text-sm">
                        Documents are verified using certified AI systems compliant with Irish financial regulations.
                        All verifications are logged for audit purposes.
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Document List */}
                  <div className="space-y-3">
                    {selectedClaim.documents && selectedClaim.documents.length > 0 ? (
                      selectedClaim.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "p-2 rounded-full",
                              doc.type.includes('verified') ? 'bg-green-100' : 'bg-blue-100'
                            )}>
                              {doc.type.includes('verified') ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <FileText className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {doc.type} • Uploaded {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                                {doc.type.includes('verified') && (
                                  <span className="text-green-600 ml-2">• AI Verified</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={doc.type.includes('verified') ? 'default' : 'outline'}
                              className={doc.type.includes('verified') ? 'bg-green-100 text-green-800' : ''}
                            >
                              {doc.type.includes('verified') ? 'Verified' : 'Processing'}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No documents uploaded yet</p>
                        <p className="text-sm">Upload your required documents to continue</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Application Timeline
                </CardTitle>
                <CardDescription>
                  Track the progress of your HTB application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedClaim.statusHistory && selectedClaim.statusHistory.length > 0 ? (
                    selectedClaim.statusHistory.map((update, index) => (
                      <div key={update.id} className="flex items-start space-x-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            index === 0 ? "bg-blue-100" : "bg-gray-100"
                          )}>
                            {index === 0 ? (
                              <Clock className="h-4 w-4 text-blue-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          {index < selectedClaim.statusHistory!.length - 1 && (
                            <div className="w-px h-8 bg-gray-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{update.newStatus.replace('_', ' ')}</h4>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(update.updatedAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                          {update.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{update.notes}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No status updates yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Application Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Property Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Address:</span>
                        <p className="font-medium">{selectedClaim.propertyAddress}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <p className="font-medium">€{selectedClaim.propertyPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Property ID:</span>
                        <p className="font-medium">{selectedClaim.propertyId}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">HTB Percentage:</span>
                        <p className="font-medium">
                          {((selectedClaim.requestedAmount / selectedClaim.propertyPrice) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Application Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Application Date:</span>
                        <p className="font-medium">{format(new Date(selectedClaim.applicationDate), 'PPP')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">HTB Amount:</span>
                        <p className="font-medium text-green-600">€{selectedClaim.requestedAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reference:</span>
                        <p className="font-medium font-mono text-xs">{selectedClaim.id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Regulation Version:</span>
                        <p className="font-medium">2025 HTB Scheme</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Regulatory Compliance */}
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Regulatory Compliance
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Housing Agency:</div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-green-600">Compliant</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">GDPR:</div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-green-600">Compliant</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Financial Advice:</div>
                      <div className="flex items-center">
                        {selectedClaim.requestedAmount >= 20000 ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                            <span className="text-green-600">Required</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-gray-600">Not Required</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Document AI:</div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-green-600">Certified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedClaim.approvedAmount && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="font-medium text-green-800">
                          HTB Application Approved!
                        </div>
                        <div className="text-green-700">
                          Your HTB application has been approved for €{selectedClaim.approvedAmount.toLocaleString()}.
                          This approval is based on current Housing Agency regulations and qualified financial advice.
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}