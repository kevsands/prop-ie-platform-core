'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Bot, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Euro, 
  Calendar,
  MapPin,
  User,
  Building,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { 
  HTBApplicationInput, 
  HTBAutomationResult, 
  HTBProcessingStage,
  htbAutomationService 
} from '@/lib/services/htb-automation-service';
import { htbRealRegulationsService } from '@/lib/services/htb-real-regulations-service';

interface HTBAutomationWizardProps {
  buyerId: string;
  propertyId?: string;
  propertyPrice?: number;
  propertyAddress?: string;
  onApplicationComplete?: (result: HTBAutomationResult) => void;
  className?: string;
}

type WizardStep = 'intro' | 'applicant' | 'financial' | 'property' | 'review' | 'processing' | 'complete';

export default function HTBAutomationWizard({
  buyerId,
  propertyId = '',
  propertyPrice = 0,
  propertyAddress = '',
  onApplicationComplete,
  className = ''
}: HTBAutomationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('intro');
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState<Partial<HTBApplicationInput>>({
    buyerId,
    propertyId,
    propertyPrice,
    propertyAddress
  });
  const [automationResult, setAutomationResult] = useState<HTBAutomationResult | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const stepTitles = {
    intro: 'Automated HTB Assistant',
    applicant: 'Personal Details',
    financial: 'Financial Information',
    property: 'Property Details',
    review: 'Review Application',
    processing: 'Processing Application',
    complete: 'Application Complete'
  };

  const stepOrder: WizardStep[] = ['intro', 'applicant', 'financial', 'property', 'review', 'processing', 'complete'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

  // Handle form field updates
  const updateApplicationData = (field: string, value: any) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate current step
  const validateStep = (step: WizardStep): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (step === 'applicant') {
      if (!applicationData.applicantDetails?.firstName) newErrors.firstName = 'First name is required';
      if (!applicationData.applicantDetails?.lastName) newErrors.lastName = 'Last name is required';
      if (!applicationData.applicantDetails?.email) newErrors.email = 'Email is required';
      if (!applicationData.applicantDetails?.ppsNumber) newErrors.ppsNumber = 'PPS number is required';
    }

    if (step === 'financial') {
      if (!applicationData.financialDetails?.grossAnnualIncome) newErrors.grossAnnualIncome = 'Annual income is required';
      if (!applicationData.financialDetails?.depositAmount) newErrors.depositAmount = 'Deposit amount is required';
      if (!applicationData.financialDetails?.mortgageAmount) newErrors.mortgageAmount = 'Mortgage amount is required';
    }

    if (step === 'property') {
      if (!applicationData.propertyPrice) newErrors.propertyPrice = 'Property price is required';
      if (!applicationData.propertyAddress) newErrors.propertyAddress = 'Property address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < stepOrder.length) {
        setCurrentStep(stepOrder[nextIndex]);
      }
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  // Submit application for automated processing with real regulations
  const submitApplication = async () => {
    if (!validateStep('review')) return;

    setLoading(true);
    setCurrentStep('processing');

    try {
      // Process with real HTB regulations service
      const result = await htbAutomationService.processHTBApplication(applicationData as HTBApplicationInput);
      setAutomationResult(result);
      setCurrentStep('complete');
      
      if (onApplicationComplete) {
        onApplicationComplete(result);
      }
    } catch (error: any) {
      setErrors({ submit: `Application failed: ${error.message}` });
      setCurrentStep('review');
    } finally {
      setLoading(false);
    }
  };

  // Get step progress color
  const getStepColor = (step: WizardStep) => {
    const stepIndex = stepOrder.indexOf(step);
    if (stepIndex < currentStepIndex) return 'text-green-600';
    if (stepIndex === currentStepIndex) return 'text-blue-600';
    return 'text-gray-400';
  };

  return (
    <div className={cn('max-w-4xl mx-auto space-y-6', className)}>
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <CardTitle>{stepTitles[currentStep]}</CardTitle>
            </div>
            <Badge variant="outline">
              Step {currentStepIndex + 1} of {stepOrder.length}
            </Badge>
          </div>
          <Progress value={progress} className="mt-3" />
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === 'intro' && (
            <div className="space-y-6 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">Automated HTB Processing</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our intelligent system will automatically process your Help-to-Buy application, 
                  verify your eligibility, and guide you through the entire process.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium">Automated Eligibility</h3>
                  <p className="text-sm text-muted-foreground">Real-time eligibility assessment with instant feedback</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Smart Calculations</h3>
                  <p className="text-sm text-muted-foreground">Optimized HTB amount recommendations</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium">Fast Processing</h3>
                  <p className="text-sm text-muted-foreground">Streamlined workflow saves weeks of processing time</p>
                </div>
              </div>

              <Button onClick={nextStep} size="lg" className="mt-8">
                Start HTB Application
              </Button>
            </div>
          )}

          {currentStep === 'applicant' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please provide your personal details for the HTB application.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={errors.firstName ? 'text-destructive' : ''}>
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={applicationData.applicantDetails?.firstName || ''}
                    onChange={(e) => updateApplicationData('applicantDetails', {
                      ...applicationData.applicantDetails,
                      firstName: e.target.value
                    })}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className={errors.lastName ? 'text-destructive' : ''}>
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={applicationData.applicantDetails?.lastName || ''}
                    onChange={(e) => updateApplicationData('applicantDetails', {
                      ...applicationData.applicantDetails,
                      lastName: e.target.value
                    })}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={errors.email ? 'text-destructive' : ''}>
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationData.applicantDetails?.email || ''}
                    onChange={(e) => updateApplicationData('applicantDetails', {
                      ...applicationData.applicantDetails,
                      email: e.target.value
                    })}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={applicationData.applicantDetails?.phone || ''}
                    onChange={(e) => updateApplicationData('applicantDetails', {
                      ...applicationData.applicantDetails,
                      phone: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ppsNumber" className={errors.ppsNumber ? 'text-destructive' : ''}>
                    PPS Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ppsNumber"
                    value={applicationData.applicantDetails?.ppsNumber || ''}
                    onChange={(e) => updateApplicationData('applicantDetails', {
                      ...applicationData.applicantDetails,
                      ppsNumber: e.target.value
                    })}
                    className={errors.ppsNumber ? 'border-destructive' : ''}
                  />
                  {errors.ppsNumber && <p className="text-xs text-destructive">{errors.ppsNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={applicationData.applicantDetails?.dateOfBirth || ''}
                    onChange={(e) => updateApplicationData('applicantDetails', {
                      ...applicationData.applicantDetails,
                      dateOfBirth: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="firstTimeBuyer"
                  checked={applicationData.applicantDetails?.isFirstTimeBuyer || false}
                  onCheckedChange={(checked) => updateApplicationData('applicantDetails', {
                    ...applicationData.applicantDetails,
                    isFirstTimeBuyer: checked
                  })}
                />
                <Label htmlFor="firstTimeBuyer" className="cursor-pointer">
                  I am a first-time buyer
                </Label>
              </div>
            </div>
          )}

          {currentStep === 'financial' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center">
                  <Euro className="h-5 w-5 mr-2" />
                  Financial Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Provide your financial details for automated eligibility assessment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="grossAnnualIncome" className={errors.grossAnnualIncome ? 'text-destructive' : ''}>
                    Gross Annual Income (€) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="grossAnnualIncome"
                    type="number"
                    value={applicationData.financialDetails?.grossAnnualIncome || ''}
                    onChange={(e) => updateApplicationData('financialDetails', {
                      ...applicationData.financialDetails,
                      grossAnnualIncome: Number(e.target.value)
                    })}
                    className={errors.grossAnnualIncome ? 'border-destructive' : ''}
                  />
                  {errors.grossAnnualIncome && <p className="text-xs text-destructive">{errors.grossAnnualIncome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="netMonthlyIncome">Net Monthly Income (€)</Label>
                  <Input
                    id="netMonthlyIncome"
                    type="number"
                    value={applicationData.financialDetails?.netMonthlyIncome || ''}
                    onChange={(e) => updateApplicationData('financialDetails', {
                      ...applicationData.financialDetails,
                      netMonthlyIncome: Number(e.target.value)
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Monthly Expenses (€)</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    value={applicationData.financialDetails?.monthlyExpenses || ''}
                    onChange={(e) => updateApplicationData('financialDetails', {
                      ...applicationData.financialDetails,
                      monthlyExpenses: Number(e.target.value)
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existingDebt">Existing Debt (€)</Label>
                  <Input
                    id="existingDebt"
                    type="number"
                    value={applicationData.financialDetails?.existingDebt || ''}
                    onChange={(e) => updateApplicationData('financialDetails', {
                      ...applicationData.financialDetails,
                      existingDebt: Number(e.target.value)
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depositAmount" className={errors.depositAmount ? 'text-destructive' : ''}>
                    Available Deposit (€) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    value={applicationData.financialDetails?.depositAmount || ''}
                    onChange={(e) => updateApplicationData('financialDetails', {
                      ...applicationData.financialDetails,
                      depositAmount: Number(e.target.value)
                    })}
                    className={errors.depositAmount ? 'border-destructive' : ''}
                  />
                  {errors.depositAmount && <p className="text-xs text-destructive">{errors.depositAmount}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mortgageAmount" className={errors.mortgageAmount ? 'text-destructive' : ''}>
                    Mortgage Amount (€) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="mortgageAmount"
                    type="number"
                    value={applicationData.financialDetails?.mortgageAmount || ''}
                    onChange={(e) => updateApplicationData('financialDetails', {
                      ...applicationData.financialDetails,
                      mortgageAmount: Number(e.target.value)
                    })}
                    className={errors.mortgageAmount ? 'border-destructive' : ''}
                  />
                  {errors.mortgageAmount && <p className="text-xs text-destructive">{errors.mortgageAmount}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'property' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Property Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Details about the property you're purchasing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyPrice" className={errors.propertyPrice ? 'text-destructive' : ''}>
                    Property Price (€) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="propertyPrice"
                    type="number"
                    value={applicationData.propertyPrice || ''}
                    onChange={(e) => updateApplicationData('propertyPrice', Number(e.target.value))}
                    className={errors.propertyPrice ? 'border-destructive' : ''}
                  />
                  {errors.propertyPrice && <p className="text-xs text-destructive">{errors.propertyPrice}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={applicationData.propertyDetails?.propertyType || ''}
                    onValueChange={(value) => updateApplicationData('propertyDetails', {
                      ...applicationData.propertyDetails,
                      propertyType: value as 'new' | 'secondhand'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Home</SelectItem>
                      <SelectItem value="secondhand">Second-hand Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="propertyAddress" className={errors.propertyAddress ? 'text-destructive' : ''}>
                    Property Address <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="propertyAddress"
                    value={applicationData.propertyAddress || ''}
                    onChange={(e) => updateApplicationData('propertyAddress', e.target.value)}
                    className={errors.propertyAddress ? 'border-destructive' : ''}
                    rows={3}
                  />
                  {errors.propertyAddress && <p className="text-xs text-destructive">{errors.propertyAddress}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={applicationData.propertyDetails?.bedrooms || ''}
                    onChange={(e) => updateApplicationData('propertyDetails', {
                      ...applicationData.propertyDetails,
                      bedrooms: Number(e.target.value)
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floorArea">Floor Area (m²)</Label>
                  <Input
                    id="floorArea"
                    type="number"
                    value={applicationData.propertyDetails?.floorArea || ''}
                    onChange={(e) => updateApplicationData('propertyDetails', {
                      ...applicationData.propertyDetails,
                      floorArea: Number(e.target.value)
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Review Your Application</h3>
                <p className="text-sm text-muted-foreground">
                  Please review all information before submitting for automated processing.
                </p>
              </div>

              <div className="space-y-6">
                {/* Personal Details Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Personal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="font-medium">
                          {applicationData.applicantDetails?.firstName} {applicationData.applicantDetails?.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{applicationData.applicantDetails?.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">PPS Number:</span>
                        <p className="font-medium">{applicationData.applicantDetails?.ppsNumber}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">First-time Buyer:</span>
                        <p className="font-medium">
                          {applicationData.applicantDetails?.isFirstTimeBuyer ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Euro className="h-4 w-4 mr-2" />
                      Financial Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Annual Income:</span>
                        <p className="font-medium">€{applicationData.financialDetails?.grossAnnualIncome?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Available Deposit:</span>
                        <p className="font-medium">€{applicationData.financialDetails?.depositAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mortgage Amount:</span>
                        <p className="font-medium">€{applicationData.financialDetails?.mortgageAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly Expenses:</span>
                        <p className="font-medium">€{applicationData.financialDetails?.monthlyExpenses?.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Property Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <p className="font-medium">€{applicationData.propertyPrice?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{applicationData.propertyDetails?.propertyType || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Address:</span>
                        <p className="font-medium">{applicationData.propertyAddress}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {currentStep === 'processing' && (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <h3 className="text-lg font-medium">Processing Your HTB Application</h3>
                <p className="text-muted-foreground">
                  Our automated system is analyzing your eligibility and processing your application...
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">This may take a few moments</div>
                <Progress value={75} className="max-w-md mx-auto" />
              </div>
            </div>
          )}

          {currentStep === 'complete' && automationResult && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  automationResult.success ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {automationResult.success ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>
                <h3 className="text-lg font-medium">
                  {automationResult.success ? 'Application Processed Successfully' : 'Application Review Required'}
                </h3>
                <p className="text-muted-foreground">
                  {automationResult.success 
                    ? 'Your HTB application has been automatically processed and submitted.'
                    : 'Your application requires additional review before processing.'}
                </p>
              </div>

              {automationResult.success && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          €{automationResult.maxHTBAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Maximum HTB Amount</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          €{automationResult.recommendedAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Approved Amount</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {automationResult.estimatedProcessingTime} days
                        </div>
                        <div className="text-sm text-muted-foreground">Est. Processing Time</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="font-medium">Real HTB Regulations Applied</div>
                        <div className="text-sm">
                          Your application has been assessed against current Housing Agency regulations.
                          {automationResult.recommendedAmount >= 20000 && ' A qualified financial advisor will review your application.'}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {automationResult.warnings && automationResult.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="font-medium">Important Notices:</div>
                      {automationResult.warnings.map((warning, index) => (
                        <div key={index} className="text-sm">{warning}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {!automationResult.success && automationResult.errors && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="font-medium">Eligibility Issues:</div>
                      {automationResult.errors.map((error, index) => (
                        <div key={index} className="text-sm">{error}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Next Steps:</h4>
                <ul className="space-y-2">
                  {automationResult.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                
                {automationResult.requiredDocuments && automationResult.requiredDocuments.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <h5 className="font-medium text-sm mb-2">Required Documents ({automationResult.requiredDocuments.length}):</h5>
                    <ul className="text-xs space-y-1">
                      {automationResult.requiredDocuments.slice(0, 5).map((doc, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                          <span>{doc.name}</span>
                        </li>
                      ))}
                      {automationResult.requiredDocuments.length > 5 && (
                        <li className="text-muted-foreground">+ {automationResult.requiredDocuments.length - 5} more documents</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {automationResult.applicationReference && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Application Reference: </span>
                      <span className="font-mono font-medium">{automationResult.applicationReference}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Keep this reference number for tracking your application status.
                      {automationResult.success && ' You can now proceed to upload your required documents.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {currentStep !== 'intro' && currentStep !== 'processing' && currentStep !== 'complete' && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={loading}>
            Previous
          </Button>
          
          {currentStep === 'review' ? (
            <Button onClick={submitApplication} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={loading}>
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  );
}