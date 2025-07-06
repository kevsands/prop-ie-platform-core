/**
 * Identity Verification Workflow
 * Comprehensive identity verification system with real-time status tracking and compliance reporting
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  FileText, 
  CreditCard,
  Smartphone,
  Camera,
  Scan,
  Zap,
  Lock,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Info,
  Star,
  Globe,
  Phone,
  Mail,
  Building2,
  Calendar,
  MapPin
} from 'lucide-react';
import { UploadedDocument } from './DocumentUploadSystem';

export interface VerificationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'requires_action';
  required: boolean;
  automated: boolean;
  estimatedDuration: string;
  icon: React.ComponentType<any>;
  completedAt?: Date;
  failureReason?: string;
  actionRequired?: string;
  progress?: number; // 0-100
  verificationData?: any;
}

export interface IdentityVerificationStatus {
  overallStatus: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'requires_review';
  overallProgress: number;
  completedSteps: number;
  totalSteps: number;
  estimatedTimeRemaining: string;
  complianceScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date;
  verificationId: string;
  reportUrl?: string;
}

interface IdentityVerificationWorkflowProps {
  uploadedDocuments: UploadedDocument[];
  userProfile?: any;
  onVerificationComplete?: (status: IdentityVerificationStatus) => void;
  onStepComplete?: (step: VerificationStep) => void;
  onActionRequired?: (step: VerificationStep, action: string) => void;
  className?: string;
}

const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: 'document_validation',
    name: 'Document Validation',
    description: 'Validating authenticity and quality of uploaded documents',
    status: 'pending',
    required: true,
    automated: true,
    estimatedDuration: '2-5 minutes',
    icon: FileText,
    progress: 0
  },
  {
    id: 'identity_cross_check',
    name: 'Identity Cross-Check',
    description: 'Verifying identity details against multiple databases',
    status: 'pending',
    required: true,
    automated: true,
    estimatedDuration: '3-7 minutes',
    icon: User,
    progress: 0
  },
  {
    id: 'address_verification',
    name: 'Address Verification',
    description: 'Confirming current address through multiple sources',
    status: 'pending',
    required: true,
    automated: true,
    estimatedDuration: '2-4 minutes',
    icon: MapPin,
    progress: 0
  },
  {
    id: 'financial_screening',
    name: 'Financial Screening',
    description: 'Analyzing financial documents and creditworthiness',
    status: 'pending',
    required: true,
    automated: true,
    estimatedDuration: '5-10 minutes',
    icon: Building2,
    progress: 0
  },
  {
    id: 'peps_sanctions_check',
    name: 'PEPs & Sanctions Check',
    description: 'Screening against politically exposed persons and sanctions lists',
    status: 'pending',
    required: true,
    automated: true,
    estimatedDuration: '1-3 minutes',
    icon: Globe,
    progress: 0
  },
  {
    id: 'biometric_verification',
    name: 'Biometric Verification',
    description: 'Optional facial recognition and liveness check',
    status: 'pending',
    required: false,
    automated: true,
    estimatedDuration: '1-2 minutes',
    icon: Camera,
    progress: 0
  },
  {
    id: 'manual_review',
    name: 'Manual Review',
    description: 'Human review for edge cases and final approval',
    status: 'pending',
    required: false,
    automated: false,
    estimatedDuration: '15-30 minutes',
    icon: Eye,
    progress: 0
  },
  {
    id: 'compliance_report',
    name: 'Compliance Report',
    description: 'Generate final KYC/AML compliance documentation',
    status: 'pending',
    required: true,
    automated: true,
    estimatedDuration: '1-2 minutes',
    icon: Shield,
    progress: 0
  }
];

export default function IdentityVerificationWorkflow({
  uploadedDocuments,
  userProfile,
  onVerificationComplete,
  onStepComplete,
  onActionRequired,
  className = ''
}: IdentityVerificationWorkflowProps) {
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>(VERIFICATION_STEPS);
  const [verificationStatus, setVerificationStatus] = useState<IdentityVerificationStatus>({
    overallStatus: 'not_started',
    overallProgress: 0,
    completedSteps: 0,
    totalSteps: VERIFICATION_STEPS.length,
    estimatedTimeRemaining: '15-30 minutes',
    complianceScore: 0,
    riskLevel: 'medium',
    lastUpdated: new Date(),
    verificationId: `VER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Check if verification can start
  const canStartVerification = uploadedDocuments.filter(doc => doc.status === 'verified').length >= 3;

  // Start verification process
  const startVerification = useCallback(async () => {
    if (!canStartVerification) return;

    setIsProcessing(true);
    setVerificationStatus(prev => ({
      ...prev,
      overallStatus: 'in_progress',
      lastUpdated: new Date()
    }));

    // Start processing first step
    processNextStep(0);
  }, [canStartVerification]);

  // Process verification step
  const processStep = useCallback(async (stepIndex: number) => {
    const step = verificationSteps[stepIndex];
    if (!step) return;

    // Update step to in_progress
    setVerificationSteps(prev => prev.map((s, i) => 
      i === stepIndex 
        ? { ...s, status: 'in_progress', progress: 0 }
        : s
    ));

    // Simulate step processing with progress updates
    await simulateStepProcessing(stepIndex);
  }, [verificationSteps]);

  // Simulate step processing with realistic timing
  const simulateStepProcessing = async (stepIndex: number) => {
    const step = verificationSteps[stepIndex];
    const duration = getStepDuration(step.id);

    // Progress simulation
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, duration / 10));
      
      setVerificationSteps(prev => prev.map((s, i) => 
        i === stepIndex 
          ? { ...s, progress }
          : s
      ));
    }

    // Determine step outcome
    const outcome = determineStepOutcome(step.id, uploadedDocuments);
    
    setVerificationSteps(prev => prev.map((s, i) => 
      i === stepIndex 
        ? { 
            ...s, 
            status: outcome.status,
            progress: 100,
            completedAt: outcome.status === 'completed' ? new Date() : undefined,
            failureReason: outcome.failureReason,
            actionRequired: outcome.actionRequired,
            verificationData: outcome.data
          }
        : s
    ));

    // Update overall status
    updateOverallStatus(stepIndex, outcome.status);

    // Call callbacks
    if (outcome.status === 'completed') {
      onStepComplete?.(verificationSteps[stepIndex]);
    } else if (outcome.status === 'requires_action') {
      onActionRequired?.(verificationSteps[stepIndex], outcome.actionRequired || '');
    }

    // Process next step if current completed successfully
    if (outcome.status === 'completed' && stepIndex < verificationSteps.length - 1) {
      setTimeout(() => processNextStep(stepIndex + 1), 1000);
    } else if (stepIndex === verificationSteps.length - 1 && outcome.status === 'completed') {
      // All steps completed
      completeVerification();
    }
  };

  const processNextStep = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
    processStep(stepIndex);
  };

  const getStepDuration = (stepId: string): number => {
    const durations: { [key: string]: number } = {
      document_validation: 3000,
      identity_cross_check: 5000,
      address_verification: 3500,
      financial_screening: 7000,
      peps_sanctions_check: 2500,
      biometric_verification: 2000,
      manual_review: 1000, // Simulated as instant for demo
      compliance_report: 2000
    };
    return durations[stepId] || 3000;
  };

  const determineStepOutcome = (stepId: string, documents: UploadedDocument[]) => {
    // Simulate realistic outcomes based on step type
    const baseSuccessRate = 0.85;
    const random = Math.random();

    switch (stepId) {
      case 'document_validation':
        const hasValidDocs = documents.filter(d => d.status === 'verified').length >= 3;
        return hasValidDocs && random > 0.1 
          ? { status: 'completed' as const, data: { documentsValidated: documents.length } }
          : { status: 'failed' as const, failureReason: 'Document quality insufficient for automated verification' };

      case 'identity_cross_check':
        return random > 0.05 
          ? { status: 'completed' as const, data: { matchConfidence: 94, sourcesChecked: 5 } }
          : { status: 'requires_action' as const, actionRequired: 'Additional identity documentation required' };

      case 'address_verification':
        return random > 0.1 
          ? { status: 'completed' as const, data: { addressConfirmed: true, utilityBillMatch: true } }
          : { status: 'requires_action' as const, actionRequired: 'Current address proof required' };

      case 'financial_screening':
        return random > 0.15 
          ? { status: 'completed' as const, data: { creditScore: 745, incomeVerified: true } }
          : { status: 'requires_action' as const, actionRequired: 'Additional financial documentation needed' };

      case 'peps_sanctions_check':
        return random > 0.02 
          ? { status: 'completed' as const, data: { clearanceStatus: 'clean', listsChecked: 12 } }
          : { status: 'requires_action' as const, actionRequired: 'Enhanced due diligence required' };

      case 'biometric_verification':
        return random > 0.1 
          ? { status: 'completed' as const, data: { livenessScore: 98, faceMatch: 96 } }
          : { status: 'failed' as const, failureReason: 'Biometric verification failed - please retry' };

      case 'manual_review':
        return { status: 'completed' as const, data: { reviewerNotes: 'All checks passed - approved for property transaction' } };

      case 'compliance_report':
        return { status: 'completed' as const, data: { reportGenerated: true, complianceScore: 95 } };

      default:
        return { status: 'completed' as const };
    }
  };

  const updateOverallStatus = (completedStepIndex: number, stepStatus: string) => {
    const completedSteps = verificationSteps.filter((_, i) => i <= completedStepIndex && stepStatus === 'completed').length;
    const overallProgress = Math.round((completedSteps / verificationSteps.length) * 100);
    
    setVerificationStatus(prev => ({
      ...prev,
      completedSteps,
      overallProgress,
      complianceScore: Math.min(95, completedSteps * 12),
      estimatedTimeRemaining: calculateTimeRemaining(completedSteps),
      lastUpdated: new Date()
    }));
  };

  const calculateTimeRemaining = (completedSteps: number): string => {
    const remainingSteps = verificationSteps.length - completedSteps;
    const avgTimePerStep = 3; // minutes
    const totalMinutes = remainingSteps * avgTimePerStep;
    
    if (totalMinutes < 5) return '< 5 minutes';
    if (totalMinutes < 15) return '5-15 minutes';
    return '15-30 minutes';
  };

  const completeVerification = () => {
    setIsProcessing(false);
    setVerificationStatus(prev => ({
      ...prev,
      overallStatus: 'completed',
      overallProgress: 100,
      complianceScore: 95,
      riskLevel: 'low',
      estimatedTimeRemaining: 'Complete',
      reportUrl: `/api/verification/reports/${prev.verificationId}`,
      lastUpdated: new Date()
    }));

    onVerificationComplete?.(verificationStatus);
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'requires_action': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'failed': return X;
      case 'in_progress': return Clock;
      case 'requires_action': return AlertTriangle;
      default: return Clock;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Identity Verification</h2>
              <p className="text-gray-600 text-sm">Comprehensive KYC/AML compliance workflow</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{verificationStatus.overallProgress}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Verification Progress</span>
            <span>{verificationStatus.completedSteps} of {verificationStatus.totalSteps} steps</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${verificationStatus.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{verificationStatus.verificationId}</div>
            <div className="text-sm text-gray-600">Verification ID</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold px-2 py-1 rounded ${getRiskLevelColor(verificationStatus.riskLevel)}`}>
              {verificationStatus.riskLevel.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600">Risk Level</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{verificationStatus.complianceScore}/100</div>
            <div className="text-sm text-gray-600">Compliance Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{verificationStatus.estimatedTimeRemaining}</div>
            <div className="text-sm text-gray-600">Time Remaining</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Pre-verification Check */}
        {!canStartVerification && verificationStatus.overallStatus === 'not_started' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-600" size={24} />
              <div>
                <h3 className="font-semibold text-orange-900">Documents Required</h3>
                <p className="text-orange-800 text-sm">
                  Please upload and verify at least 3 documents before starting identity verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Start Verification Button */}
        {canStartVerification && verificationStatus.overallStatus === 'not_started' && (
          <div className="text-center mb-6">
            <button
              onClick={startVerification}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Shield size={20} />
              Start Identity Verification
            </button>
            <p className="text-gray-600 text-sm mt-2">
              This process typically takes 15-30 minutes to complete
            </p>
          </div>
        )}

        {/* Verification Steps */}
        {verificationStatus.overallStatus !== 'not_started' && (
          <div className="space-y-4">
            {verificationSteps.map((step, index) => {
              const StatusIcon = getStatusIcon(step.status);
              const isActive = index === currentStepIndex && isProcessing;

              return (
                <div
                  key={step.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-600' :
                        step.status === 'in_progress' ? 'bg-blue-600' :
                        step.status === 'failed' ? 'bg-red-600' :
                        step.status === 'requires_action' ? 'bg-orange-600' :
                        'bg-gray-400'
                      }`}>
                        <step.icon className="text-white" size={20} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{step.name}</h3>
                          {step.required && (
                            <span className="text-red-500 text-sm">*</span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStepStatusColor(step.status)}`}>
                            {step.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                        {step.estimatedDuration && step.status === 'pending' && (
                          <p className="text-gray-500 text-xs mt-1">Est. {step.estimatedDuration}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {step.status === 'in_progress' && (
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${step.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{step.progress || 0}%</span>
                        </div>
                      )}
                      
                      <StatusIcon 
                        size={20} 
                        className={
                          step.status === 'completed' ? 'text-green-600' :
                          step.status === 'failed' ? 'text-red-600' :
                          step.status === 'in_progress' ? 'text-blue-600 animate-spin' :
                          step.status === 'requires_action' ? 'text-orange-600' :
                          'text-gray-400'
                        } 
                      />
                    </div>
                  </div>

                  {/* Step Details */}
                  {(step.failureReason || step.actionRequired || step.verificationData) && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      {step.failureReason && (
                        <div className="text-red-700 text-sm mb-2">
                          <strong>Failed:</strong> {step.failureReason}
                        </div>
                      )}
                      {step.actionRequired && (
                        <div className="text-orange-700 text-sm mb-2">
                          <strong>Action Required:</strong> {step.actionRequired}
                        </div>
                      )}
                      {step.verificationData && (
                        <div className="text-green-700 text-sm">
                          <strong>Verified:</strong> {Object.entries(step.verificationData).map(([key, value]) => 
                            `${key}: ${value}`
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Completion Status */}
        {verificationStatus.overallStatus === 'completed' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900">Identity Verification Complete!</h3>
                <p className="text-green-800 text-sm">
                  Your identity has been successfully verified. You can now proceed with property transactions.
                </p>
              </div>
              {verificationStatus.reportUrl && (
                <button
                  onClick={() => window.open(verificationStatus.reportUrl, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download size={16} />
                  Download Report
                </button>
              )}
            </div>
          </div>
        )}

        {/* Help Information */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Verification Process</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• All verification steps are automated and secure</li>
                <li>• Your data is encrypted and handled in compliance with GDPR</li>
                <li>• Verification typically completes within 15-30 minutes</li>
                <li>• You'll receive email updates for each completed step</li>
                <li>• Our compliance team may contact you if manual review is required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}