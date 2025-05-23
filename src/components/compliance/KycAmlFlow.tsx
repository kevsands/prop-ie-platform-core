'use client';

import React, { useState } from 'react';

/**
 * KYC/AML Verification Flow Component
 * Demonstrates the compliance checks for property transactions
 */
export const KycAmlFlow = () => {
  const [currentStepsetCurrentStep] = useState(1);
  const [verificationStatussetVerificationStatus] = useState<'not_started' | 'in_progress' | 'verified' | 'rejected'>('not_started');
  const [documentssetDocuments] = useState({
    identityUploaded: false,
    addressUploaded: false,
    financialUploaded: false,
    consentProvided: false});

  const steps = [
    {
      id: 1,
      title: 'Identity Verification',
      description: 'Upload your government-issued ID to verify your identity',
      requirements: [
        'Passport or national identity card',
        'Document must be valid and not expired',
        'All details must be clearly visible'
      ],
      uploadType: 'identity' as const,
      uploadLabel: 'Upload ID Document'},
    {
      id: 2,
      title: 'Address Verification',
      description: 'Confirm your residential address with an official document',
      requirements: [
        'Utility bill or bank statement',
        'Document must be less than 3 months old',
        'Must show your full name and address'
      ],
      uploadType: 'address' as const,
      uploadLabel: 'Upload Proof of Address'},
    {
      id: 3,
      title: 'Financial Background',
      description: 'Verify your financial information to meet AML requirements',
      requirements: [
        'Source of funds documentation',
        'Bank statements (last 3 months)',
        'Evidence of deposit source'
      ],
      uploadType: 'financial' as const,
      uploadLabel: 'Upload Financial Documents'},
    {
      id: 4,
      title: 'Consent & Submit',
      description: 'Review your information and provide consent for verification',
      requirements: [
        'Review privacy policy',
        'Consent to identity verification',
        'Consent to third-party checks'
      ],
      uploadType: 'consent' as const,
      uploadLabel: 'Provide Consent'}
  ];

  const handleDocumentUpload = (type: 'identity' | 'address' | 'financial' | 'consent') => {
    // In a real implementation, this would handle file uploads
    // For demo purposes, we'll just update the state
    const fieldName = type === 'consent' ? 'consentProvided' : `${type}Uploaded`;
    setDocuments(prev => ({
      ...prev,
      [fieldName]: true
    }));

    // If all documents are uploaded, set status to in_progress
    const updatedDocs = {
      ...documents,
      [fieldName]: true
    };

    if (Object.values(updatedDocs).every(value => value)) {
      setVerificationStatus('in_progress');
      // Simulate automatic verification with timeout
      setTimeout(() => {
        setVerificationStatus('verified');
      }, 3000);
    }
  };

  const handleNext = () => {
    if (currentStep <steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep> 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep - 1];

  // Helper function to check if current step is completed
  const isStepCompleted = (step: typeof steps[0]) => {
    if (step.uploadType === 'consent') {
      return documents.consentProvided;
    }
    return documents[`${step.uploadType}Uploaded`];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#2B5273] text-center mb-6">
        KYC/AML Verification Process
      </h2>

      <div className="flex items-center mb-8">
        {/* Progress steps */}
        {steps.map((step: any) => (
          <div key={step.id} className="flex-1">
            <div className="relative">
              {/* Line */}
              {step.id <steps.length && (
                <div className={`absolute top-1/2 w-full h-1 ${
                  step.id <currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              )}

              {/* Circle */}
              <div 
                className={`
                  relative z-10 mx-auto w-8 h-8 rounded-full flex items-center justify-center
                  ${step.id === currentStep ? 'bg-[#2B5273] text-white' : 
                    step.id <currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                `}
              >
                {step.id <currentStep ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
            </div>

            <div className="text-center mt-2">
              <span className={`text-xs font-medium ${
                step.id === currentStep ? 'text-[#2B5273]' : 
                step.id <currentStep ? 'text-green-500' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Current step content */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{currentStepData.title}</h3>
        <p className="text-gray-600 mb-4">{currentStepData.description}</p>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-2 text-[#2B5273]">Requirements:</h4>
          <ul className="space-y-1">
            {currentStepData.requirements.map((reqindex: any) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => handleDocumentUpload(currentStepData.uploadType)}
            disabled={isStepCompleted(currentStepData)}
            className={`
              px-6 py-3 rounded-md flex items-center
              ${isStepCompleted(currentStepData) ? 
                'bg-green-100 text-green-700 cursor-not-allowed' : 
                'bg-[#2B5273] text-white hover:bg-[#234563]'}
            `}
          >
            {isStepCompleted(currentStepData) ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Uploaded Successfully
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {currentStepData.uploadLabel}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification status */}
      {currentStep === 4 && (
        <div className={`mb-6 p-4 rounded-lg ${
          verificationStatus === 'verified' ? 'bg-green-50 text-green-700' :
          verificationStatus === 'in_progress' ? 'bg-yellow-50 text-yellow-700' :
          verificationStatus === 'rejected' ? 'bg-red-50 text-red-700' :
          'bg-gray-50 text-gray-600'
        }`}>
          <div className="flex items-center">
            {verificationStatus === 'verified' && (
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
            {verificationStatus === 'in_progress' && (
              <svg className="w-6 h-6 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            <h4 className="font-semibold">
              {verificationStatus === 'verified' && 'Verification Complete! You are now KYC/AML verified.'}
              {verificationStatus === 'in_progress' && 'Verification in Progress... This usually takes 2-3 minutes.'}
              {verificationStatus === 'rejected' && 'Verification Failed. Please check your documents and try again.'}
              {verificationStatus === 'not_started' && 'Ready for Verification. Please complete all steps to submit.'}
            </h4>
          </div>

          {verificationStatus === 'verified' && (
            <div className="mt-4 p-3 bg-white rounded border border-green-200">
              <p className="text-sm text-gray-700 mb-2">
                Your verification has been successfully completed and meets all KYC/AML requirements for property transactions in Ireland.
              </p>
              <p className="text-sm font-medium">Verification ID: KYC-123456-78</p>
              <p className="text-sm">Valid until: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-[#2B5273] text-[#2B5273] hover:bg-gray-50'
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep === steps.length || !isStepCompleted(currentStepData)}
          className={`px-4 py-2 rounded ${
            currentStep === steps.length || !isStepCompleted(currentStepData)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#2B5273] text-white hover:bg-[#234563]'
          }`}
        >
          Next
        </button>
      </div>

      {/* Help & Support */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need assistance with your verification? <a href="#" className="text-[#2B5273] hover:underline">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default KycAmlFlow; 