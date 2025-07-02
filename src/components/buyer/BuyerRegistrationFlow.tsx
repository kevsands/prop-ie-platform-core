'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle, Lock, FileCheck, Euro, Shield, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';

interface BuyerRegistrationFlowProps {
  developmentId: string;
  developmentName: string;
  onComplete: (data: any) => void;
}

type StepStatus = 'pending' | 'active' | 'completed';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: StepStatus;
}

export default function BuyerRegistrationFlow({ 
  developmentId, 
  developmentName,
  onComplete 
}: BuyerRegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [proofOfFundsUrl, setProofOfFundsUrl] = useState('');
  
  const steps: Step[] = [
    {
      id: 'register',
      title: 'Create Account',
      description: 'Register and verify your email',
      icon: <Lock className="w-5 h-5" />,
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'active' : 'pending',
    },
    {
      id: 'kyc',
      title: 'KYC Verification',
      description: 'Upload identity documents',
      icon: <FileCheck className="w-5 h-5" />,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending',
    },
    {
      id: 'funds',
      title: 'Proof of Funds',
      description: 'Verify financial capacity',
      icon: <Euro className="w-5 h-5" />,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending',
    },
    {
      id: 'terms',
      title: 'Legal Agreement',
      description: 'Accept purchase terms',
      icon: <Shield className="w-5 h-5" />,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending',
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({
        acceptedTerms,
        proofOfFundsUrl,
        developmentId,
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <RegistrationStep onNext={handleNextStep} />;
      case 1:
        return <KYCStep onNext={handleNextStep} />;
      case 2:
        return <ProofOfFundsStep onNext={handleNextStep} onUpload={setProofOfFundsUrl} />;
      case 3:
        return <LegalAgreementStep 
          developmentName={developmentName}
          onAccept={(accepted) => {
            setAcceptedTerms(accepted);
            if (accepted) handleNextStep();
          }} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${step.status === 'completed' ? 'bg-green-500 text-white' : ''}
                ${step.status === 'active' ? 'bg-blue-600 text-white' : ''}
                ${step.status === 'pending' ? 'bg-gray-200 text-gray-500' : ''}
              `}>
                {step.status === 'completed' ? <Check className="w-6 h-6" /> : step.icon}
              </div>
              <span className="text-sm font-medium mt-2">{step.title}</span>
              <span className="text-xs text-gray-500 mt-1">{step.description}</span>
            </div>
          ))}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
          <div 
            className="absolute top-6 left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {renderStepContent()}
      </div>
    </div>
  );
}

// Individual Step Components
function RegistrationStep({ onNext }: { onNext: () => void }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    acceptMarketing: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Call the real API to create user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: 'buyer',
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log('User created successfully:', user);
        onNext();
      } else {
        const error = await response.json();
        console.error('Failed to create user:', error);
        alert('Failed to create account: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create account. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-bold mb-6">Create Your Account</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          className="mr-2"
          checked={formData.acceptMarketing}
          onChange={(e) => setFormData({ ...formData, acceptMarketing: e.target.checked })}
        />
        <label className="text-sm text-gray-600">
          Send me updates about new properties and offers
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Account
      </button>
    </form>
  );
}

function KYCStep({ onNext }: { onNext: () => void }) {
  const router = useRouter();
  
  const handleProceedToVerification = () => {
    // Save current registration progress
    localStorage.setItem('registrationInProgress', 'true');
    // Redirect to unified verification system
    router.push('/buyer/verification/unified?return=/buyer/register&step=kyc');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold mb-6">Enhanced Identity Verification</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-lg font-medium text-blue-800 mb-2">Streamlined Verification Process</h4>
            <p className="text-sm text-blue-700 mb-4">
              We've upgraded our verification system! Complete your identity verification with our new, 
              intuitive step-by-step process that's faster and more secure.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-blue-700">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center text-sm text-blue-700">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                <span>Real-time document processing</span>
              </div>
              <div className="flex items-center text-sm text-blue-700">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                <span>Progress tracking</span>
              </div>
              <div className="flex items-center text-sm text-blue-700">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                <span>Compliant with Irish AML regulations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-3">What you'll need:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            <span>Government-issued photo ID (passport, driver's license, or national ID)</span>
          </li>
          <li className="flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            <span>Proof of address (utility bill, bank statement, or government letter)</span>
          </li>
          <li className="flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            <span>Recent payslips or employment documentation</span>
          </li>
          <li className="flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            <span>Bank statements (last 6 months)</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleProceedToVerification}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
        >
          <Shield className="w-5 h-5 mr-2" />
          Continue to Verification
        </button>
        
        <button
          onClick={onNext}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Skip for Now
        </button>
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        You can complete verification later, but it's required before making any property reservations.
      </p>
    </div>
  );
}

function ProofOfFundsStep({ onNext, onUpload }: { onNext: () => void; onUpload: (url: string) => void }) {
  const [fundDocument, setFundDocument] = useState<File | null>(null);

  const handleUpload = (file: File) => {
    setFundDocument(file);
    onUpload(file.name); // In real app, would upload to server
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold mb-6">Proof of Funds</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Euro className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Financial Verification</h4>
            <p className="text-sm text-blue-700 mt-1">
              We need to verify you have sufficient funds to complete the purchase. This ensures a smooth transaction and protects all parties involved.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Proof of Funds
        </label>
        <p className="text-sm text-gray-500 mb-2">
          Acceptable documents include:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-500 mb-4">
          <li>Bank statement showing available funds</li>
          <li>Mortgage pre-approval letter</li>
          <li>Investment account statement</li>
          <li>Letter from financial institution</li>
        </ul>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
          className="w-full px-4 py-2 border border-dashed rounded-md"
        />
      </div>

      <button
        onClick={onNext}
        disabled={!fundDocument}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        Continue to Legal Agreement
      </button>
    </div>
  );
}

function LegalAgreementStep({ 
  developmentName, 
  onAccept 
}: { 
  developmentName: string; 
  onAccept: (accepted: boolean) => void;
}) {
  const [checkedBoxes, setCheckedBoxes] = useState({
    nonRefundable: false,
    purchaseObligation: false,
    priceAgreement: false,
    termsAccepted: false,
  });

  const allChecked = Object.values(checkedBoxes).every(v => v);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold mb-6">Legal Agreement</h3>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-red-800">Important Legal Notice</h4>
            <p className="text-sm text-red-700 mt-1">
              By proceeding with this purchase, you are entering into a legally binding agreement. Please read and acknowledge all terms carefully.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start">
          <input
            type="checkbox"
            className="mr-3 mt-1"
            checked={checkedBoxes.nonRefundable}
            onChange={(e) => setCheckedBoxes({ ...checkedBoxes, nonRefundable: e.target.checked })}
          />
          <span className="text-sm text-gray-700">
            I understand that the reservation deposit is <strong>NON-REFUNDABLE</strong> and will be forfeited if I do not complete the purchase.
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            className="mr-3 mt-1"
            checked={checkedBoxes.purchaseObligation}
            onChange={(e) => setCheckedBoxes({ ...checkedBoxes, purchaseObligation: e.target.checked })}
          />
          <span className="text-sm text-gray-700">
            I acknowledge that by reserving this property, I am entering into a <strong>legal obligation to purchase</strong> and am removing it from the market, preventing other potential buyers from purchasing it.
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            className="mr-3 mt-1"
            checked={checkedBoxes.priceAgreement}
            onChange={(e) => setCheckedBoxes({ ...checkedBoxes, priceAgreement: e.target.checked })}
          />
          <span className="text-sm text-gray-700">
            I agree to the purchase price as advertised for {developmentName} and understand this price is final and non-negotiable.
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            className="mr-3 mt-1"
            checked={checkedBoxes.termsAccepted}
            onChange={(e) => setCheckedBoxes({ ...checkedBoxes, termsAccepted: e.target.checked })}
          />
          <span className="text-sm text-gray-700">
            I have read and accept the full <Link href="/terms/property-purchase" className="text-blue-600 underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link>.
          </span>
        </label>
      </div>

      <div className="bg-gray-100 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Digital Signature</h4>
        <p className="text-sm text-gray-600 mb-4">
          By clicking "Accept and Continue", you are digitally signing this agreement.
        </p>
        <button
          onClick={() => onAccept(allChecked)}
          disabled={!allChecked}
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          Accept and Continue to Payment
        </button>
      </div>
    </div>
  );
}