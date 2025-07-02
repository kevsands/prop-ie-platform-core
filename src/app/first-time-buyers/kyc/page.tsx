'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { 
  Shield, 
  User, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  Building2,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  Globe,
  Camera,
  Eye,
  Download,
  RefreshCw,
  Info,
  Star,
  Lock,
  Zap
} from 'lucide-react';

// Define types for comprehensive form data
interface ComprehensiveFormData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  ppsNumber: string;
  
  // Identity Verification
  idType: 'passport' | 'driving_license' | 'national_id';
  idNumber: string;
  idExpiryDate: string;
  idFrontImage: File | null;
  idBackImage: File | null;
  selfieImage: File | null;
  
  // Address Verification
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  eircode: string;
  addressProofType: 'utility_bill' | 'bank_statement' | 'government_letter';
  addressProofImage: File | null;
  
  // Declaration
  isPoliticallyExposed: boolean;
  isHighRiskCountry: boolean;
  sourceOfFunds: 'employment' | 'savings' | 'investment' | 'inheritance' | 'other';
  termsAccepted: boolean;
}

// Define type for form errors
interface FormErrors {
  [key: string]: string | undefined;
}

export default function UnifiedKYCHub() {
  const router = useRouter();
  const { user, isAuthenticated } = useEnterpriseAuth();
  
  // Main navigation state
  const [currentView, setCurrentView] = useState<'hub' | 'comprehensive_form' | 'document_upload' | 'verification_workflow'>('hub');
  
  // Comprehensive form state
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<ComprehensiveFormData>({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    ppsNumber: '',
    
    // Identity Verification
    idType: 'passport',
    idNumber: '',
    idExpiryDate: '',
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
    
    // Address Verification
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    eircode: '',
    addressProofType: 'utility_bill',
    addressProofImage: null,
    
    // Declaration
    isPoliticallyExposed: false,
    isHighRiskCountry: false,
    sourceOfFunds: 'employment',
    termsAccepted: false
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'not_started' | 'in_progress' | 'completed' | 'failed'>('not_started');

  // Hub view with verification options
  const renderHub = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Identity Verification
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure, comprehensive KYC/AML compliance for Irish property transactions. 
            Choose your preferred verification method to get started.
          </p>
        </div>

        {/* Verification Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Comprehensive Form Option */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Form Verification</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive 4-step verification process with guided form completion, 
              document uploads, and instant validation.
            </p>
            <ul className="text-sm text-gray-500 mb-6 space-y-2">
              <li>✓ Personal information collection</li>
              <li>✓ Identity document verification</li>
              <li>✓ Address proof validation</li>
              <li>✓ AML compliance declaration</li>
            </ul>
            <button
              onClick={() => setCurrentView('comprehensive_form')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Complete Verification
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Document Upload Option */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Document Upload Center</h3>
            <p className="text-gray-600 mb-6">
              Upload your verification documents with our advanced categorization system, 
              real-time progress tracking, and Irish compliance features.
            </p>
            <ul className="text-sm text-gray-500 mb-6 space-y-2">
              <li>✓ Identity & Address documents</li>
              <li>✓ Employment & Financial proof</li>
              <li>✓ HTB (Help-to-Buy) documentation</li>
              <li>✓ Property transaction documents</li>
            </ul>
            <button
              onClick={() => router.push('/first-time-buyers/documents')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Upload Documents
              <Upload className="w-4 h-4" />
            </button>
          </div>

          {/* Advanced Workflow Option */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Verification Workflow</h3>
            <p className="text-gray-600 mb-6">
              Enterprise-grade verification with real-time progress tracking, 
              compliance scoring, and automated background checks.
            </p>
            <ul className="text-sm text-gray-500 mb-6 space-y-2">
              <li>✓ 8-step automated verification</li>
              <li>✓ Real-time compliance scoring</li>
              <li>✓ Biometric verification options</li>
              <li>✓ Complete audit trail</li>
            </ul>
            <button
              onClick={() => setCurrentView('verification_workflow')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Advanced Workflow
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Intelligent Router Section */}
        <div className="mb-8">
          <React.Suspense fallback={
            <div className="bg-white rounded-xl shadow-lg border p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading intelligent recommendations...</p>
            </div>
          }>
            <IntelligentVerificationRouter />
          </React.Suspense>
        </div>

        {/* KYC Status Section */}
        {isAuthenticated && user && (
          <div className="mb-8">
            <React.Suspense fallback={
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="animate-pulse">Loading KYC status...</div>
              </div>
            }>
              <KYCStatusDisplay />
            </React.Suspense>
          </div>
        )}

        {/* Sync Status Section */}
        <div className="mb-8">
          <React.Suspense fallback={
            <div className="bg-white rounded-lg border p-4 text-center">
              <div className="animate-pulse">Loading sync status...</div>
            </div>
          }>
            <VerificationSyncStatus showDetails={false} />
          </React.Suspense>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Why Verify Your Identity?</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Required for all Irish property transactions over €15,000</li>
                <li>• Ensures compliance with Anti-Money Laundering regulations</li>
                <li>• Enables access to Help-to-Buy scheme benefits</li>
                <li>• Protects all parties in the transaction process</li>
                <li>• Your data is encrypted and handled in compliance with GDPR</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    
    if (type === 'file' && files) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const validateStep = () => {
    const newErrors: FormErrors = {};
    
    if (formStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
      if (!formData.ppsNumber.trim()) newErrors.ppsNumber = 'PPS Number is required';
      else if (!/^\d{7}[A-Z]{1,2}$/.test(formData.ppsNumber)) {
        newErrors.ppsNumber = 'PPS Number must be in the format 1234567A or 1234567AB';
      }
    }
    
    if (formStep === 2) {
      if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
      if (!formData.idExpiryDate) newErrors.idExpiryDate = 'Expiry date is required';
      if (!formData.idFrontImage) newErrors.idFrontImage = 'Front image of ID is required';
      if (formData.idType !== 'passport' && !formData.idBackImage) {
        newErrors.idBackImage = 'Back image of ID is required';
      }
      if (!formData.selfieImage) newErrors.selfieImage = 'Selfie image is required';
    }
    
    if (formStep === 3) {
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.county.trim()) newErrors.county = 'County is required';
      if (!formData.eircode.trim()) newErrors.eircode = 'Eircode is required';
      if (!formData.addressProofImage) newErrors.addressProofImage = 'Proof of address is required';
    }
    
    if (formStep === 4) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and conditions';
      }
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setFormStep(formStep + 1);
    }
  };

  const handlePrevStep = () => {
    setFormStep(formStep - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validateStep()) {
      setIsFormLoading(true);
      
      try {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        // Create FormData for file uploads
        const submitData = new FormData();
        
        // Add user ID
        submitData.append('userId', user.id);
        
        // Add form fields
        submitData.append('fullName', formData.fullName);
        submitData.append('dateOfBirth', formData.dateOfBirth);
        submitData.append('nationality', formData.nationality);
        submitData.append('ppsNumber', formData.ppsNumber);
        submitData.append('idType', formData.idType);
        submitData.append('idNumber', formData.idNumber);
        submitData.append('idExpiryDate', formData.idExpiryDate);
        submitData.append('addressLine1', formData.addressLine1);
        submitData.append('addressLine2', formData.addressLine2);
        submitData.append('city', formData.city);
        submitData.append('county', formData.county);
        submitData.append('eircode', formData.eircode);
        submitData.append('addressProofType', formData.addressProofType);
        submitData.append('sourceOfFunds', formData.sourceOfFunds);
        submitData.append('isPoliticallyExposed', formData.isPoliticallyExposed.toString());
        submitData.append('isHighRiskCountry', formData.isHighRiskCountry.toString());
        submitData.append('termsAccepted', formData.termsAccepted.toString());
        
        // Add files
        if (formData.idFrontImage) {
          submitData.append('idFrontImage', formData.idFrontImage);
        }
        if (formData.idBackImage) {
          submitData.append('idBackImage', formData.idBackImage);
        }
        if (formData.selfieImage) {
          submitData.append('selfieImage', formData.selfieImage);
        }
        if (formData.addressProofImage) {
          submitData.append('addressProofImage', formData.addressProofImage);
        }

        // Submit to API
        const response = await fetch('/api/kyc/submit', {
          method: 'POST',
          body: submitData
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to submit KYC verification');
        }

        console.log('KYC submitted successfully:', result);
        setFormStep(5); // Success step
        setVerificationStatus('completed');
        
      } catch (error) {
        console.error('KYC Verification error:', error);
        setFormErrors({ 
          submit: error instanceof Error ? error.message : 'Failed to submit verification' 
        });
      } finally {
        setIsFormLoading(false);
      }
    }
  };

  // Import the comprehensive form component and advanced workflow
  const ComprehensiveKYCForm = React.lazy(() => import('@/components/kyc/ComprehensiveKYCForm'));
  const AdvancedVerificationWorkflow = React.lazy(() => import('@/components/kyc/AdvancedVerificationWorkflow'));
  const IntelligentVerificationRouter = React.lazy(() => import('@/components/kyc/IntelligentVerificationRouter'));
  const VerificationSyncStatus = React.lazy(() => import('@/components/verification/VerificationSyncStatus'));
  const KYCStatusDisplay = React.lazy(() => import('@/components/kyc/KYCStatusDisplay'));

  // Comprehensive form component
  const renderComprehensiveForm = () => (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ComprehensiveKYCForm 
        onBack={() => setCurrentView('hub')}
        onComplete={(data) => {
          console.log('KYC Form completed with data:', data);
          setVerificationStatus('completed');
          // Optionally redirect or show success state
          setTimeout(() => setCurrentView('hub'), 3000);
        }}
      />
    </React.Suspense>
  );

  // Advanced verification workflow component
  const renderAdvancedWorkflow = () => (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <AdvancedVerificationWorkflow 
        onBack={() => setCurrentView('hub')}
        onComplete={(status) => {
          console.log('Advanced verification completed:', status);
          setVerificationStatus('completed');
          setTimeout(() => setCurrentView('hub'), 3000);
        }}
      />
    </React.Suspense>
  );

  // Main render logic
  if (currentView === 'comprehensive_form') {
    return renderComprehensiveForm();
  }
  
  if (currentView === 'verification_workflow') {
    return renderAdvancedWorkflow();
  }

  return renderHub();
}