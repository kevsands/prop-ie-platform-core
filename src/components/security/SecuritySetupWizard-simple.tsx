'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Shield, CheckCircle, User, Phone, Key } from 'lucide-react';

const SecuritySetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [setupComplete, setSetupComplete] = useState(false);

  const steps = [
    { id: 1, title: 'Account Verification', icon: User },
    { id: 2, title: 'Phone Authentication', icon: Phone },
    { id: 3, title: 'Security Keys', icon: Key },
    { id: 4, title: 'Complete Setup', icon: CheckCircle }
  ];

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setSetupComplete(true);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (setupComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Security Setup Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your account is now secured with multi-factor authentication.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Security Setup Wizard</h1>
        <p className="text-gray-600">
          Set up multi-factor authentication to secure your account.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isComplete = step.id < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                isComplete ? 'bg-green-500 text-white' :
                isActive ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {isComplete ? <CheckCircle size={20} /> : <Icon size={20} />}
              </div>
              <span className={`text-sm ${isActive ? 'font-medium' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-gray-600">
                First, let's verify your account information to ensure security.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Email Address</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Identity Verification</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Add your phone number for SMS-based two-factor authentication.
              </p>
              <div className="space-y-3">
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <Button className="w-full">Send Verification Code</Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Set up additional security keys for enhanced protection.
              </p>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium mb-2">Authenticator App</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Use Google Authenticator or similar app for secure codes.
                  </p>
                  <Button variant="outline">Setup Authenticator</Button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium mb-2">Hardware Security Key</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Use a physical security key for maximum protection.
                  </p>
                  <Button variant="outline">Add Security Key</Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Review your security settings and complete the setup.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span>Email Verification</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span>Phone Authentication</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span>Security Keys</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button onClick={handleNextStep}>
              {currentStep === 4 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySetupWizard;