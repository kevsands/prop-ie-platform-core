'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  User,
  ChevronRight,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useVerification } from '@/context/VerificationContext';

interface VerificationStatusCardProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export default function VerificationStatusCard({ 
  className = '', 
  showDetails = true,
  compact = false 
}: VerificationStatusCardProps) {
  const {
    profile,
    loading,
    error,
    getOverallProgress,
    isVerificationComplete,
    getCurrentStep,
    getNextRequiredAction,
    getPendingDocuments,
    getRejectedDocuments
  } = useVerification();

  if (loading && !profile) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Verification Error</h3>
            <p className="text-sm text-gray-600">Unable to load verification status</p>
          </div>
          <Link 
            href="/buyer/verification/unified"
            className="text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const progress = getOverallProgress();
  const currentStep = getCurrentStep();
  const nextAction = getNextRequiredAction();
  const pendingDocs = getPendingDocuments();
  const rejectedDocs = getRejectedDocuments();
  const isComplete = isVerificationComplete();

  const getStatusColor = () => {
    if (isComplete) return 'from-green-500 to-emerald-500';
    if (rejectedDocs.length > 0) return 'from-red-500 to-rose-500';
    if (progress > 50) return 'from-blue-500 to-indigo-500';
    return 'from-gray-400 to-gray-500';
  };

  const getStatusIcon = () => {
    if (isComplete) return <CheckCircle className="w-6 h-6 text-white" />;
    if (rejectedDocs.length > 0) return <AlertCircle className="w-6 h-6 text-white" />;
    if (progress > 0) return <Clock className="w-6 h-6 text-white" />;
    return <Shield className="w-6 h-6 text-white" />;
  };

  const getStatusText = () => {
    if (isComplete) return 'Verification Complete';
    if (rejectedDocs.length > 0) return 'Action Required';
    if (progress > 50) return 'In Progress';
    if (progress > 0) return 'Getting Started';
    return 'Not Started';
  };

  const getStatusDescription = () => {
    if (isComplete) return 'Your identity has been fully verified';
    if (rejectedDocs.length > 0) return `${rejectedDocs.length} document(s) need attention`;
    if (currentStep) return `Current step: ${currentStep.title}`;
    return 'Identity verification required';
  };

  if (compact) {
    return (
      <Link 
        href="/buyer/verification/unified"
        className={`block bg-white rounded-lg border shadow-sm p-4 hover:shadow-lg hover:border-blue-300 transition-all group ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${getStatusColor()} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{getStatusText()}</h3>
              <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor()} rounded-lg flex items-center justify-center`}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Identity Verification</h3>
              <p className="text-sm text-gray-600">{getStatusDescription()}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Verification Progress</span>
            <span className={`font-medium ${
              isComplete ? 'text-green-600' : 
              rejectedDocs.length > 0 ? 'text-red-600' : 
              'text-blue-600'
            }`}>
              {getStatusText()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${getStatusColor()} transition-all duration-1000`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {showDetails && (
          <>
            {/* Current Status Details */}
            {nextAction && !isComplete && (
              <div className={`p-3 rounded-lg mb-4 ${
                rejectedDocs.length > 0 ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start space-x-2">
                  {rejectedDocs.length > 0 ? (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      rejectedDocs.length > 0 ? 'text-red-800' : 'text-blue-800'
                    }`}>
                      Next Action Required
                    </p>
                    <p className={`text-sm ${
                      rejectedDocs.length > 0 ? 'text-red-700' : 'text-blue-700'
                    }`}>
                      {nextAction}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Steps Summary */}
            {profile && profile.steps && (
              <div className="space-y-2 mb-4">
                {profile.steps.map((step) => {
                  const stepProgress = step.documents.filter(doc => 
                    doc.isRequired && doc.status === 'approved'
                  ).length / step.documents.filter(doc => doc.isRequired).length * 100;
                  
                  return (
                    <div key={step.id} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-500 text-white' :
                        step.status === 'in-progress' ? 'bg-blue-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : step.status === 'in-progress' ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{step.order}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{step.title}</span>
                          <span className="text-xs text-gray-500">{Math.round(stepProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-500 ${
                              step.status === 'completed' ? 'bg-green-500' :
                              step.status === 'in-progress' ? 'bg-blue-500' :
                              'bg-gray-300'
                            }`}
                            style={{ width: `${stepProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/buyer/verification/unified"
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isComplete 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isComplete ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>View Verification</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>Continue Verification</span>
                  </>
                )}
                <ChevronRight className="w-4 h-4" />
              </Link>
              
              {!isComplete && (
                <Link 
                  href="/buyer/documents"
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Documents</span>
                </Link>
              )}
            </div>
          </>
        )}

        {/* Completion Badge */}
        {isComplete && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Verification Complete!</p>
                <p className="text-sm text-green-700">
                  You now have full access to all platform features and can proceed with property purchases.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}