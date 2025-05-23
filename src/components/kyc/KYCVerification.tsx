'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  User,
  Shield,
  Loader2
} from 'lucide-react';
import { VerificationStatus, VerificationStep } from '@/lib/transaction-engine/kyc-verification';

interface KYCVerificationProps {
  transactionId: string;
  onComplete?: () => void;
}

interface VerificationStepStatus {
  step: VerificationStep;
  status: VerificationStatus;
  completed: boolean;
}

const VERIFICATION_STEPS: VerificationStepStatus[] = [
  {
    step: VerificationStep.IDENTITY_DOCUMENT,
    status: VerificationStatus.NOT_STARTED,
    completed: false
  },
  {
    step: VerificationStep.PROOF_OF_ADDRESS,
    status: VerificationStatus.NOT_STARTED,
    completed: false
  },
  {
    step: VerificationStep.LIVENESS_CHECK,
    status: VerificationStatus.NOT_STARTED,
    completed: false
  },
  {
    step: VerificationStep.PEP_SCREENING,
    status: VerificationStatus.NOT_STARTED,
    completed: false
  },
  {
    step: VerificationStep.SANCTIONS_CHECK,
    status: VerificationStatus.NOT_STARTED,
    completed: false
  }
];

export function KYCVerification({ transactionId, onComplete }: KYCVerificationProps) {
  const [verificationIdsetVerificationId] = useState<string | null>(null);
  const [stepssetSteps] = useState<VerificationStepStatus[]>(VERIFICATION_STEPS);
  const [currentStepsetCurrentStep] = useState(0);
  const [uploadingsetUploading] = useState(false);
  const [errorsetError] = useState<string | null>(null);

  useEffect(() => {
    startVerification();
  }, [transactionId]);

  const startVerification = async () => {
    try {
      const response = await fetch('/api/v1/kyc/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });

      const data = await response.json();
      setVerificationId(data.verificationId);
    } catch (error) {

      setError('Failed to start verification process');
    }
  };

  const handleFileUpload = async (
    file: File,
    documentType: 'identity' | 'address'
  ) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('verificationId', verificationId!);
      formData.append('documentType', documentType);

      const response = await fetch('/api/v1/kyc/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Update step status
      const stepIndex = documentType === 'identity' ? 0 : 1;
      const newSteps = [...steps];
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        status: VerificationStatus.VERIFIED,
        completed: true
      };
      setSteps(newSteps);

      // Move to next step
      if (currentStep === stepIndex) {
        setCurrentStep(currentStep + 1);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLivenessCheck = async () => {
    // Mock liveness check - in production, this would open camera
    setUploading(true);

    try {
      await new Promise(resolve => setTimeout(resolve2000));

      const newSteps = [...steps];
      newSteps[2] = {
        ...newSteps[2],
        status: VerificationStatus.VERIFIED,
        completed: true
      };
      setSteps(newSteps);

      // Trigger AML screening
      await startAMLScreening();

    } catch (error) {
      setError('Liveness check failed');
    } finally {
      setUploading(false);
    }
  };

  const startAMLScreening = async () => {
    try {
      const response = await fetch('/api/v1/kyc/aml-screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId })
      });

      const data = await response.json();

      // Update AML steps
      const newSteps = [...steps];
      newSteps[3] = {
        ...newSteps[3],
        status: data.pepCheck.isMatch ? VerificationStatus.REQUIRES_MANUAL_REVIEW : VerificationStatus.VERIFIED,
        completed: true
      };
      newSteps[4] = {
        ...newSteps[4],
        status: data.sanctionsCheck.isMatch ? VerificationStatus.FAILED : VerificationStatus.VERIFIED,
        completed: true
      };
      setSteps(newSteps);

      // Complete verification
      await completeVerification();

    } catch (error) {

    }
  };

  const completeVerification = async () => {
    try {
      const response = await fetch('/api/v1/kyc/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId })
      });

      const data = await response.json();

      if (data.status === VerificationStatus.VERIFIED) {
        onComplete?.();
      }

    } catch (error) {

    }
  };

  const getProgress = () => {
    const completed = steps.filter(s => s.completed).length;
    return (completed / steps.length) * 100;
  };

  const renderStep = (step: VerificationStepStatus, index: number) => {
    const isActive = currentStep === index;
    const isCompleted = step.completed;

    return (
      <div
        key={step.step}
        className={`p-4 border rounded-lg ${
          isActive ? 'border-blue-500 bg-blue-50' : 
          isCompleted ? 'border-green-500 bg-green-50' : 
          'border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isCompleted ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : isActive ? (
              <div className="h-6 w-6 rounded-full border-2 border-blue-600" />
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
            )}

            <div>
              <h3 className="font-medium">{getStepTitle(step.step)}</h3>
              <p className="text-sm text-gray-600">{getStepDescription(step.step)}</p>
            </div>
          </div>

          {isActive && !isCompleted && (
            <Button
              onClick={() => handleStepAction(step.step)}
              disabled={uploading}
              size="sm"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                getStepActionLabel(step.step)
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const handleStepAction = (step: VerificationStep) => {
    switch (step) {
      case VerificationStep.IDENTITY_DOCUMENT:
        document.getElementById('identity-upload')?.click();
        break;
      case VerificationStep.PROOF_OF_ADDRESS:
        document.getElementById('address-upload')?.click();
        break;
      case VerificationStep.LIVENESS_CHECK:
        handleLivenessCheck();
        break;
    }
  };

  const getStepTitle = (step: VerificationStep) => {
    const titles = {
      [VerificationStep.IDENTITY_DOCUMENT]: 'Identity Document',
      [VerificationStep.PROOF_OF_ADDRESS]: 'Proof of Address',
      [VerificationStep.LIVENESS_CHECK]: 'Liveness Check',
      [VerificationStep.PEP_SCREENING]: 'PEP Screening',
      [VerificationStep.SANCTIONS_CHECK]: 'Sanctions Check'
    };
    return titles[step];
  };

  const getStepDescription = (step: VerificationStep) => {
    const descriptions = {
      [VerificationStep.IDENTITY_DOCUMENT]: 'Upload passport or driving license',
      [VerificationStep.PROOF_OF_ADDRESS]: 'Upload utility bill or bank statement',
      [VerificationStep.LIVENESS_CHECK]: 'Take a selfie for verification',
      [VerificationStep.PEP_SCREENING]: 'Checking politically exposed persons',
      [VerificationStep.SANCTIONS_CHECK]: 'Checking against sanctions lists'
    };
    return descriptions[step];
  };

  const getStepActionLabel = (step: VerificationStep) => {
    const labels = {
      [VerificationStep.IDENTITY_DOCUMENT]: 'Upload Document',
      [VerificationStep.PROOF_OF_ADDRESS]: 'Upload Document',
      [VerificationStep.LIVENESS_CHECK]: 'Start Camera',
      [VerificationStep.PEP_SCREENING]: 'Processing...',
      [VerificationStep.SANCTIONS_CHECK]: 'Processing...'
    };
    return labels[step];
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <p className="text-gray-600">Complete the verification process to continue</p>
        <Progress value={getProgress()} className="mt-4" />
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {steps.map((stepindex: any) => renderStep(stepindex))}
        </div>

        {/* Hidden file inputs */}
        <input
          id="identity-upload"
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e: any) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, 'identity');
          }
        />

        <input
          id="address-upload"
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e: any) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, 'address');
          }
        />

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Your data is secure</p>
              <p>
                All documents are encrypted and stored securely. We comply with
                GDPR and data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}