import React from 'react';
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileText,
  Check,
  X,
  AlertCircle,
  Shield,
  User,
  Home,
  DollarSign,
  Camera,
  Loader2
} from 'lucide-react';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  required: boolean;
}

const verificationSteps: VerificationStep[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic personal details',
    status: 'completed',
    required: true
  },
  {
    id: 'identity',
    title: 'Identity Verification',
    description: 'Government-issued ID',
    status: 'in_progress',
    required: true
  },
  {
    id: 'address',
    title: 'Address Verification',
    description: 'Proof of current address',
    status: 'pending',
    required: true
  },
  {
    id: 'funds',
    title: 'Source of Funds',
    description: 'Proof of funds for purchase',
    status: 'pending',
    required: true
  },
  {
    id: 'pep',
    title: 'PEP Declaration',
    description: 'Politically exposed person check',
    status: 'pending',
    required: true
  }
];

export default function KYCVerificationPage() {
  const [currentStepsetCurrentStep] = useState('identity');
  const [uploadedFilessetUploadedFiles] = useState<Record<string, File>>({});
  const [isUploadingsetIsUploading] = useState(false);
  const [verificationStatussetVerificationStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');

  const handleFileUpload = (stepId: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [stepId]: file }));
  };

  const handleSubmitDocument = async (stepId: string) => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      // Update step status
      const steps = [...verificationSteps];
      const stepIndex = steps.findIndex(s => s.id === stepId);
      if (stepIndex !== -1) {
        steps[stepIndex].status = 'completed';
      }
    }, 2000);
  };

  const completedSteps = verificationSteps.filter(step => step.status === 'completed').length;
  const totalSteps = verificationSteps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
        <p className="text-muted-foreground">
          Complete your KYC/AML verification to proceed with your property purchase
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Verification Progress</CardTitle>
          <CardDescription>
            {completedSteps} of {totalSteps} steps completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-4" />
          <div className="flex justify-between text-sm">
            <span>Started</span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
            <span>Verified</span>
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Steps Navigation */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Verification Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationSteps.map((step: any) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      currentStep === step.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-600 text-white' :
                      step.status === 'in_progress' ? 'bg-blue-600 text-white' :
                      step.status === 'failed' ? 'bg-red-600 text-white' :
                      'bg-gray-200'
                    }`}>
                      {step.status === 'completed' ? (
                        <Check className="h-4 w-4" />
                      ) : step.status === 'failed' ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <span className="text-sm">{verificationSteps.findIndex(s => s.id === step.id) + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Step Content */}
        <div className="md:col-span-2">
          {currentStep === 'identity' && (
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>
                  Upload a clear photo of your government-issued ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your documents are encrypted and stored securely. We only use them for verification purposes.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="id-type">Document Type</Label>
                    <Select defaultValue="passport">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving-license">Driving License</SelectItem>
                        <SelectItem value="national-id">National ID Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Upload Document</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {uploadedFiles.identity ? (
                        <div className="space-y-4">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="font-medium">{uploadedFiles.identity.name}</p>
                          <Button
                            variant="outline"
                            onClick={() => handleFileUpload('identity', uploadedFiles.identity)}
                          >
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                          <div>
                            <p className="font-medium">Drop your file here or click to browse</p>
                            <p className="text-sm text-muted-foreground">
                              Supported formats: JPG, PNG, PDF (Max 10MB)
                            </p>
                          </div>
                          <Input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e: any) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('identity', file);
                            }
                          />
                          <Label htmlFor="file-upload">
                            <Button as="span" variant="outline">
                              Select File
                            </Button>
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Selfie Verification</Label>
                    <Card className="bg-muted/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <div className="flex-1">
                            <h4 className="font-medium">Take a selfie with your ID</h4>
                            <p className="text-sm text-muted-foreground">
                              This helps us verify that you are the document holder
                            </p>
                          </div>
                          <Button variant="outline">
                            Open Camera
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button variant="outline">Save Draft</Button>
                    <Button 
                      onClick={() => handleSubmitDocument('identity')}
                      disabled={!uploadedFiles.identity || isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Submit Document'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'address' && (
            <Card>
              <CardHeader>
                <CardTitle>Address Verification</CardTitle>
                <CardDescription>
                  Provide proof of your current residential address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>Current Address</Label>
                    <div className="grid grid-cols-1 gap-4">
                      <Input placeholder="Address Line 1" />
                      <Input placeholder="Address Line 2" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="City" />
                        <Input placeholder="County" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Eircode" />
                        <Select defaultValue="ireland">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ireland">Ireland</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Proof of Address Document</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a recent utility bill, bank statement, or government letter (within last 3 months)
                    </p>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <Button variant="outline">Upload Document</Button>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button variant="outline">Previous</Button>
                    <Button>Continue</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'funds' && (
            <Card>
              <CardHeader>
                <CardTitle>Source of Funds</CardTitle>
                <CardDescription>
                  Verify the source of funds for your property purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertDescription>
                      We need to verify that funds are from legitimate sources as part of anti-money laundering requirements.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label>Primary Source of Funds</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Personal Savings</SelectItem>
                        <SelectItem value="salary">Salary/Income</SelectItem>
                        <SelectItem value="property-sale">Property Sale</SelectItem>
                        <SelectItem value="gift">Gift</SelectItem>
                        <SelectItem value="inheritance">Inheritance</SelectItem>
                        <SelectItem value="investment">Investment Returns</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Supporting Documents</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload bank statements showing funds (last 3-6 months)
                    </p>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">Bank Statement - March 2024</p>
                            <p className="text-sm text-muted-foreground">AIB_Statement_Mar2024.pdf</p>
                          </div>
                          <Button variant="outline" size="sm">Remove</Button>
                        </div>
                      </Card>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Add More Documents
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button variant="outline">Previous</Button>
                    <Button>Continue</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'pep' && (
            <Card>
              <CardHeader>
                <CardTitle>PEP Declaration</CardTitle>
                <CardDescription>
                  Politically Exposed Person declaration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <User className="h-4 w-4" />
                    <AlertDescription>
                      A PEP is someone who holds or has held a prominent public position. This includes government officials, senior executives of state corporations, and their immediate family members.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="pep-self" />
                      <Label htmlFor="pep-self" className="text-sm">
                        I am not a Politically Exposed Person (PEP)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="pep-family" />
                      <Label htmlFor="pep-family" className="text-sm">
                        No immediate family member is a PEP
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="pep-associate" />
                      <Label htmlFor="pep-associate" className="text-sm">
                        I am not a close associate of a PEP
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label>Additional Declaration</Label>
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-md"
                      placeholder="If you answered NO to any of the above, please provide details..."
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox id="declaration" />
                    <Label htmlFor="declaration" className="text-sm">
                      I declare that all information provided is true and accurate. I understand that providing false information may result in legal consequences.
                    </Label>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button variant="outline">Previous</Button>
                    <Button>Submit Verification</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Verification Status */}
      {verificationStatus === 'processing' && (
        <Alert className="mt-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Your documents are being reviewed. This usually takes 1-2 business days.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === 'completed' && (
        <Alert className="mt-6">
          <Check className="h-4 w-4" />
          <AlertDescription>
            Verification complete! You can now proceed with your property purchase.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}