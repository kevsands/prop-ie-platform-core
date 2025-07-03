'use client';

import React, { useState, useCallback } from 'react';
import { 
  Shield, 
  User, 
  Home, 
  FileText, 
  Euro,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Camera,
  X,
  ChevronRight,
  ChevronLeft,
  Info,
  Download,
  RefreshCw
} from 'lucide-react';
import { useVerification } from '@/context/VerificationContext';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import IdentityVerificationWorkflow from './IdentityVerificationWorkflow';
import DocumentUploadSystem from './DocumentUploadSystem';
import ComprehensiveKYCForm from '@/components/kyc/ComprehensiveKYCForm';

interface UnifiedKYCFlowProps {
  onComplete?: () => void;
  developmentId?: string;
  developmentName?: string;
}

export default function UnifiedKYCFlow({ 
  onComplete, 
  developmentId, 
  developmentName 
}: UnifiedKYCFlowProps) {
  const { user } = useEnterpriseAuth();
  const {
    profile,
    loading,
    error,
    uploadDocument,
    retryDocument,
    getStepProgress,
    getOverallProgress,
    canProceedToStep,
    getCurrentStep,
    getNextRequiredAction,
    isVerificationComplete,
    refreshVerificationStatus
  } = useVerification();

  const [activeStepId, setActiveStepId] = useState<string>('');
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadModalDoc, setUploadModalDoc] = useState<string | null>(null);
  const [currentWorkflowView, setCurrentWorkflowView] = useState<'overview' | 'comprehensive_form' | 'document_upload' | 'verification_workflow'>('overview');
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

  // Set initial active step
  React.useEffect(() => {
    if (!activeStepId && profile) {
      const currentStep = getCurrentStep();
      if (currentStep) {
        setActiveStepId(currentStep.id);
      } else if (profile.steps.length > 0) {
        setActiveStepId(profile.steps[0].id);
      }
    }
  }, [profile, activeStepId, getCurrentStep]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleUpload = useCallback(async (documentId: string, file: File) => {
    setUploadingDocId(documentId);
    try {
      await uploadDocument(documentId, file);
    } finally {
      setUploadingDocId(null);
      setUploadModalDoc(null);
      setSelectedFile(null);
    }
  }, [uploadDocument]);

  const handleRetry = useCallback(async (documentId: string) => {
    await retryDocument(documentId);
  }, [retryDocument]);

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'identity-verification':
        return <User className="w-5 h-5" />;
      case 'address-verification':
        return <Home className="w-5 h-5" />;
      case 'financial-verification':
        return <Euro className="w-5 h-5" />;
      case 'aml-compliance':
        return <Shield className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'under-review':
      case 'uploaded':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepStatusColor = (stepId: string) => {
    if (!profile) return 'bg-gray-100 text-gray-500';
    
    const step = profile.steps.find(s => s.id === stepId);
    if (!step) return 'bg-gray-100 text-gray-500';

    switch (step.status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'blocked':
        return 'bg-red-500 text-white';
      default:
        return canProceedToStep(stepId) ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400';
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshVerificationStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Verification Profile</h2>
          <p className="text-gray-600">Unable to load verification profile.</p>
        </div>
      </div>
    );
  }

  const activeStep = profile.steps.find(s => s.id === activeStepId);
  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advanced Identity Verification</h1>
              <p className="text-gray-600 mt-1">
                {developmentName 
                  ? `Enterprise KYC/AML verification for ${developmentName}` 
                  : 'Complete enterprise-grade KYC/AML verification with compliance scoring'
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600">Overall Progress</div>
                <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
              </div>
              <div className="w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                  />
                  <path
                    className="text-blue-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${overallProgress}, 100`}
                    strokeLinecap="round"
                    fill="transparent"
                    d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Verification Options */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => setCurrentWorkflowView('overview')}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentWorkflowView === 'overview' 
                  ? 'border-blue-500 bg-blue-50 text-blue-900' 
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="font-medium">Standard Flow</p>
              <p className="text-sm text-gray-600">Step-by-step verification</p>
            </button>
            
            <button
              onClick={() => setCurrentWorkflowView('comprehensive_form')}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentWorkflowView === 'comprehensive_form' 
                  ? 'border-green-500 bg-green-50 text-green-900' 
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <FileText className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="font-medium">Irish KYC Form</p>
              <p className="text-sm text-gray-600">PPS, Eircode, PEP screening</p>
            </button>
            
            <button
              onClick={() => setCurrentWorkflowView('document_upload')}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentWorkflowView === 'document_upload' 
                  ? 'border-purple-500 bg-purple-50 text-purple-900' 
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <Upload className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="font-medium">Document System</p>
              <p className="text-sm text-gray-600">AI-powered validation</p>
            </button>
            
            <button
              onClick={() => setCurrentWorkflowView('verification_workflow')}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentWorkflowView === 'verification_workflow' 
                  ? 'border-orange-500 bg-orange-50 text-orange-900' 
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="font-medium">Enterprise Workflow</p>
              <p className="text-sm text-gray-600">Compliance & risk scoring</p>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {profile.steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => canProceedToStep(step.id) && setActiveStepId(step.id)}
                    disabled={!canProceedToStep(step.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                      getStepStatusColor(step.id)
                    } ${
                      activeStepId === step.id ? 'ring-4 ring-blue-200' : ''
                    } ${
                      canProceedToStep(step.id) ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      getStepIcon(step.id)
                    )}
                  </button>
                  <div className="text-center mt-2">
                    <p className={`text-sm font-medium ${
                      activeStepId === step.id ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{Math.round(getStepProgress(step.id))}% complete</p>
                  </div>
                </div>
                {index < profile.steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Component Rendering */}
      {currentWorkflowView !== 'overview' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back to Overview Button */}
          <button
            onClick={() => setCurrentWorkflowView('overview')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Standard Flow
          </button>

          {currentWorkflowView === 'comprehensive_form' && (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Irish KYC Comprehensive Form</h2>
                <p className="text-gray-600">Complete Irish-specific KYC verification with PPS number validation, Eircode integration, and PEP screening</p>
              </div>
              <ComprehensiveKYCForm 
                onBack={() => setCurrentWorkflowView('overview')}
                onComplete={(data) => {
                  console.log('KYC Form completed:', data);
                  setCurrentWorkflowView('overview');
                }}
              />
            </div>
          )}

          {currentWorkflowView === 'document_upload' && (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Document Upload System</h2>
                <p className="text-gray-600">AI-powered document validation with automatic extraction and verification</p>
              </div>
              <DocumentUploadSystem 
                onDocumentsChange={setUploadedDocuments}
                uploadedDocuments={uploadedDocuments}
              />
            </div>
          )}

          {currentWorkflowView === 'verification_workflow' && (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Identity Verification Workflow</h2>
                <p className="text-gray-600">Advanced verification with compliance scoring, risk assessment, and automated database cross-checking</p>
              </div>
              <IdentityVerificationWorkflow 
                uploadedDocuments={uploadedDocuments}
                userProfile={user}
                onVerificationComplete={(status) => {
                  console.log('Verification completed:', status);
                  if (onComplete) onComplete();
                }}
                onStepComplete={(step) => {
                  console.log('Step completed:', step);
                }}
                onActionRequired={(step, action) => {
                  console.log('Action required:', step, action);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Main Content - Standard Overview */}
      {currentWorkflowView === 'overview' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Step Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Verification Steps</h3>
              <div className="space-y-3">
                {profile.steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => canProceedToStep(step.id) && setActiveStepId(step.id)}
                    disabled={!canProceedToStep(step.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      activeStepId === step.id
                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-900'
                        : canProceedToStep(step.id)
                        ? 'hover:bg-gray-50 border border-gray-200'
                        : 'bg-gray-50 border border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        getStepStatusColor(step.id)
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          getStepIcon(step.id)
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-gray-500">
                          {Math.round(getStepProgress(step.id))}% complete
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Next Action */}
              {getNextRequiredAction() && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Next Action</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {getNextRequiredAction()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Active Step */}
          <div className="lg:col-span-3">
            {activeStep && (
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeStep.title}</h2>
                  <p className="text-gray-600">{activeStep.description}</p>
                  
                  {activeStep.dependencies && activeStep.dependencies.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <Info className="w-4 h-4 inline mr-1" />
                        This step requires completion of previous verification steps.
                      </p>
                    </div>
                  )}
                </div>

                {/* Documents for this step */}
                <div className="space-y-6">
                  {activeStep.documents.map((document) => (
                    <div key={document.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getDocumentStatusIcon(document.status)}
                            <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
                            {document.isRequired && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                Required
                              </span>
                            )}
                          </div>
                          {document.notes && (
                            <p className="text-sm text-gray-600 mb-3">{document.notes}</p>
                          )}
                          
                          {/* Status info */}
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`flex items-center space-x-1 px-2 py-1 rounded-full font-medium ${
                              document.status === 'approved' ? 'bg-green-100 text-green-800' :
                              document.status === 'under-review' || document.status === 'uploaded' ? 'bg-yellow-100 text-yellow-800' :
                              document.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {getDocumentStatusIcon(document.status)}
                              <span className="capitalize">{document.status.replace('-', ' ')}</span>
                            </span>
                            
                            {document.uploadedDate && (
                              <span className="text-gray-500">
                                Uploaded {document.uploadedDate.toLocaleDateString()}
                              </span>
                            )}
                            
                            {document.reviewedDate && (
                              <span className="text-gray-500">
                                Reviewed {document.reviewedDate.toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* Rejection reason */}
                          {document.status === 'rejected' && document.rejectionReason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-800">
                                <strong>Rejection reason:</strong> {document.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          {document.status === 'approved' && document.fileUrl && (
                            <button className="p-2 text-gray-500 hover:text-gray-700 transition">
                              <Download className="w-5 h-5" />
                            </button>
                          )}
                          
                          {['not-started', 'rejected'].includes(document.status) && (
                            <button
                              onClick={() => setUploadModalDoc(document.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Upload</span>
                            </button>
                          )}
                          
                          {document.status === 'uploaded' && (
                            <button
                              onClick={() => setUploadModalDoc(document.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span>Replace</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Help Section */}
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        If you're having trouble with verification or have questions about required documents, 
                        our support team is here to help.
                      </p>
                      <button className="text-sm font-medium text-blue-600 hover:underline">
                        Contact Support →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Upload Modal */}
      {uploadModalDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button
                onClick={() => setUploadModalDoc(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Choose file to upload
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
              
              {selectedFile && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setUploadModalDoc(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedFile && uploadModalDoc && handleUpload(uploadModalDoc, selectedFile)}
                  disabled={!selectedFile || uploadingDocId === uploadModalDoc}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {uploadingDocId === uploadModalDoc ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {isVerificationComplete() && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white p-6 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Verification Complete!</h4>
              <p className="text-sm text-green-100 mb-3">
                Your identity has been successfully verified. You now have full access to all platform features.
              </p>
              {onComplete && (
                <button
                  onClick={onComplete}
                  className="text-sm font-medium text-white underline hover:no-underline"
                >
                  Continue to Dashboard →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}