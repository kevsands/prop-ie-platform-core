'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';
import { MFASetup } from './MFASetup';
import TrustedDevices from './TrustedDevices';
import { SessionFingerprint } from '../../lib/security/sessionFingerprint';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';

interface Step {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  required: boolean;
}

interface SecuritySetupWizardProps {
  onComplete?: () => void;
  initialStep?: number;
}

export function SecuritySetupWizard({ 
  onComplete, 
  initialStep = 0 
}: SecuritySetupWizardProps) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Define the setup steps
  const steps: Step[] = [
    {
      id: 'welcome',
      title: 'Enhanced Security Setup',
      description: 'Secure your account with advanced security features',
      required: false,
      component: (
        <div className="py-4">
          <h3 className="text-lg font-medium mb-4">Welcome to Enhanced Security Setup</h3>
          <p className="mb-4">
            We'll guide you through setting up additional security measures to protect your account:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li className="ml-2">Multi-Factor Authentication (MFA)</li>
            <li className="ml-2">Trusted Device Management</li>
            <li className="ml-2">Security preferences</li>
          </ul>
          <p className="text-sm text-gray-600 mb-6">
            This process takes about 5 minutes to complete.
          </p>
          <div className="flex justify-end">
            <Button 
              onClick={() => handleComplete('welcome')}
            >
              Get Started
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'mfa',
      title: 'Multi-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      required: true,
      component: (
        <div className="py-4">
          <MFASetup 
            onComplete={() => handleComplete('mfa')}
            displayMode="wizard"
          />
        </div>
      )
    },
    {
      id: 'trusted-device',
      title: 'Register Your Device',
      description: 'Add this device as trusted for easier access',
      required: false,
      component: (
        <div className="py-4">
          <h3 className="text-lg font-medium mb-4">Trusted Device Registration</h3>
          <p className="mb-4">
            Registering this device as trusted will make it easier to log in
            while maintaining security. We'll remember this device and
            require less verification in the future.
          </p>
          
          <Alert className="mb-4">
            <AlertTitle>Only trust devices you use regularly</AlertTitle>
            <AlertDescription>
              Only register devices that belong to you and that you use regularly.
              Don't register shared or public computers.
            </AlertDescription>
          </Alert>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label htmlFor="deviceName" className="text-sm font-medium">
                Device Name
              </label>
            </div>
            <input
              type="text"
              id="deviceName"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="My Laptop"
              disabled={isRegistering}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a name to help you identify this device
            </p>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => {
                // Skip this step
                handleComplete('trusted-device');
              }}
              disabled={isRegistering}
            >
              Skip
            </Button>
            <Button
              onClick={async () => {
                const deviceNameInput = document.getElementById('deviceName') as HTMLInputElement;
                const deviceName = deviceNameInput?.value || 'My Device';
                
                setIsRegistering(true);
                
                try {
                  // Register device as trusted
                  if (SessionFingerprint && typeof SessionFingerprint.trustCurrentDevice === 'function') {
                    await SessionFingerprint.trustCurrentDevice(deviceName);
                  }
                  
                  // Mark as completed
                  handleComplete('trusted-device');
                } catch (error) {
                  console.error('Error registering device:', error);
                } finally {
                  setIsRegistering(false);
                }
              }}
              disabled={isRegistering}
            >
              {isRegistering ? 'Registering...' : 'Register Device'}
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'security-preferences',
      title: 'Security Preferences',
      description: 'Customize your security settings',
      required: false,
      component: (
        <div className="py-4">
          <h3 className="text-lg font-medium mb-4">Security Preferences</h3>
          <p className="mb-6">
            Customize how we protect your account and notify you about security events.
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="enable-alerts"
                className="mt-1"
                defaultChecked
              />
              <div>
                <label htmlFor="enable-alerts" className="font-medium block">
                  Security Alerts
                </label>
                <p className="text-sm text-gray-600">
                  Receive alerts about suspicious activity on your account
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="enhanced-verification"
                className="mt-1"
                defaultChecked
              />
              <div>
                <label htmlFor="enhanced-verification" className="font-medium block">
                  Enhanced Login Verification
                </label>
                <p className="text-sm text-gray-600">
                  Require additional verification for logins from new locations
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="activity-logging"
                className="mt-1"
                defaultChecked
              />
              <div>
                <label htmlFor="activity-logging" className="font-medium block">
                  Account Activity Logging
                </label>
                <p className="text-sm text-gray-600">
                  Keep detailed logs of account activity for your review
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => handleComplete('security-preferences')}>
              Save Preferences
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: 'Setup Complete',
      description: 'Your account is now more secure',
      required: false,
      component: (
        <div className="py-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Security Setup Complete!</h3>
          <p className="mb-6 text-gray-600">
            Your account is now protected with enhanced security features.
          </p>
          
          <h4 className="font-medium mb-2">Security Features Enabled:</h4>
          <ul className="mb-8 inline-block text-left">
            {Object.keys(completed).includes('mfa') && (
              <li className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Multi-Factor Authentication</span>
              </li>
            )}
            {Object.keys(completed).includes('trusted-device') && (
              <li className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Trusted Device Registration</span>
              </li>
            )}
            {Object.keys(completed).includes('security-preferences') && (
              <li className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Security Preferences</span>
              </li>
            )}
          </ul>
          
          <Button 
            className="min-w-[200px]" 
            onClick={() => {
              // Call the onComplete callback
              if (onComplete) {
                onComplete();
              }
            }}
          >
            Go to Security Dashboard
          </Button>
        </div>
      )
    }
  ];
  
  // Handle completing a step
  const handleComplete = (stepId: string) => {
    const newCompleted = { ...completed };
    newCompleted[stepId] = true;
    setCompleted(newCompleted);
    
    // Find the index of the completed step
    const completedStepIndex = steps.findIndex(step => step.id === stepId);
    
    // Move to the next step
    if (completedStepIndex < steps.length - 1) {
      setActiveStep(completedStepIndex + 1);
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    // Count required steps
    const requiredSteps = steps.filter(step => step.required);
    
    // Count completed required steps
    const completedRequiredSteps = requiredSteps.filter(step => completed[step.id]);
    
    // Calculate percentage
    return (completedRequiredSteps.length / Math.max(requiredSteps.length, 1)) * 100;
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{steps[activeStep].title}</CardTitle>
        <CardDescription>
          {steps[activeStep].description}
        </CardDescription>
        <div className="mt-3">
          <div className="flex justify-between mb-1 text-xs text-gray-600">
            <span>Setup Progress</span>
            <span>{`Step ${activeStep + 1} of ${steps.length}`}</span>
          </div>
          <Progress 
            value={((activeStep + 1) / steps.length) * 100}
            className="h-2"
          />
        </div>
      </CardHeader>
      <CardContent>
        {steps[activeStep].component}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={() => {
            if (activeStep > 0) {
              setActiveStep(activeStep - 1);
            }
          }}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        
        <div className="text-xs text-gray-500">
          {steps[activeStep].required ? (
            <span className="text-red-500">* Required step</span>
          ) : (
            <span>Optional step</span>
          )}
        </div>
        
        <Button
          onClick={() => {
            if (activeStep < steps.length - 1) {
              // Skip this step
              handleComplete(steps[activeStep].id);
            } else if (onComplete) {
              onComplete();
            }
          }}
          variant={activeStep < steps.length - 1 ? 'ghost' : 'default'}
          disabled={steps[activeStep].required && !completed[steps[activeStep].id]}
        >
          {activeStep < steps.length - 1 ? 'Skip' : 'Finish'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SecuritySetupWizard;