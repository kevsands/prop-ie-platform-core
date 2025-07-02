'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import IdentityVerificationWorkflow from '@/components/verification/IdentityVerificationWorkflow';

// Mock uploaded documents for demonstration
const mockUploadedDocuments = [
  {
    id: 'doc-1',
    name: 'Passport.pdf',
    type: 'identity',
    size: 2048576,
    uploadDate: new Date(),
    status: 'verified' as const,
    category: 'identity',
    url: '/mock/passport.pdf'
  },
  {
    id: 'doc-2', 
    name: 'Utility_Bill.pdf',
    type: 'address',
    size: 1024576,
    uploadDate: new Date(),
    status: 'verified' as const,
    category: 'address',
    url: '/mock/utility.pdf'
  },
  {
    id: 'doc-3',
    name: 'Bank_Statement.pdf', 
    type: 'financial',
    size: 3048576,
    uploadDate: new Date(),
    status: 'verified' as const,
    category: 'financial',
    url: '/mock/bank.pdf'
  }
];

interface AdvancedVerificationWorkflowProps {
  onBack: () => void;
  onComplete?: (status: any) => void;
}

export default function AdvancedVerificationWorkflow({ 
  onBack, 
  onComplete 
}: AdvancedVerificationWorkflowProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate checking for required documents
    setIsReady(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Verification Options
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Verification Workflow</h1>
              <p className="text-gray-600">Enterprise-grade identity verification with real-time progress tracking</p>
            </div>
          </div>
        </div>

        {/* Workflow Component */}
        {isReady ? (
          <IdentityVerificationWorkflow
            uploadedDocuments={mockUploadedDocuments}
            onVerificationComplete={(status) => {
              console.log('Advanced verification completed:', status);
              onComplete?.(status);
            }}
            onStepComplete={(step) => {
              console.log('Step completed:', step);
            }}
            onActionRequired={(step, action) => {
              console.log('Action required:', step, action);
            }}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing advanced verification workflow...</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-3">Advanced Verification Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div>
              <h4 className="font-medium mb-2">Automated Checks</h4>
              <ul className="space-y-1">
                <li>• Document authenticity validation</li>
                <li>• Cross-database identity verification</li>
                <li>• Address confirmation</li>
                <li>• Financial screening</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Compliance & Security</h4>
              <ul className="space-y-1">
                <li>• PEPs & sanctions screening</li>
                <li>• Biometric verification</li>
                <li>• Manual review workflow</li>
                <li>• Complete compliance reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}