'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { useVerification } from '@/context/VerificationContext';
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

export default function BuyerVerificationPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useEnterpriseAuth();
  const { isVerificationComplete } = useVerification();
  
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

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/buyer/verification'));
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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

        {/* Verification Status Banner */}
        {isVerificationComplete() && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Verification Complete!</h3>
                  <p className="text-green-700">
                    Your identity has been successfully verified. You now have full access to all buyer portal features.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/buyer/journey')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Continue to Journey →
              </button>
            </div>
          </div>
        )}

        {/* Intelligent Verification Router */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Intelligent Verification Router</h2>
              <p className="text-gray-600">Personalized verification path based on your profile</p>
            </div>
            
            {/* Profile Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">none</div>
                <div className="text-sm text-gray-600">Verification Level</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Documents Uploaded</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">low</div>
                <div className="text-sm text-gray-600">Risk Profile</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">first time-buyer</div>
                <div className="text-sm text-gray-600">User Type</div>
              </div>
            </div>

            {/* Recommended Option */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Complete Verification Form</h4>
                    <p className="text-blue-700 mb-3">Comprehensive 4-step verification with guided form completion</p>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-blue-800 mb-2">Requirements:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                        <div>• Personal info</div>
                        <div>• ID documents</div>
                        <div>• Address proof</div>
                        <div>• Financial docs</div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-2">Details:</p>
                      <div className="flex items-center space-x-4 text-sm text-blue-700">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          ⏱️ 15-20 minutes
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          👥 First-time buyers, Complete verification needed
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </span>
                </div>
                
                <button
                  onClick={() => setCurrentView('comprehensive_form')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Verification
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* All Options */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Verification Options</h3>
              <div className="grid gap-4">
                {/* Complete Verification Form */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">Complete Verification Form</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Comprehensive 4-step verification with guided form completion</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      15-20 minutes
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('comprehensive_form')}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select →
                  </button>
                </div>

                {/* Document Upload Center */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Document Upload Center</h4>
                    <p className="text-sm text-gray-600 mb-2">Advanced document categorization with Irish compliance features</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      10-15 minutes
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/buyer/documents')}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select →
                  </button>
                </div>

                {/* Advanced Verification Workflow */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Advanced Verification Workflow</h4>
                    <p className="text-sm text-gray-600 mb-2">Enterprise-grade with real-time progress and compliance scoring</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      20-30 minutes
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('verification_workflow')}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select →
                  </button>
                </div>

                {/* Simple Document Manager */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Simple Document Manager</h4>
                    <p className="text-sm text-gray-600 mb-2">Streamlined interface for quick document uploads</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      5-10 minutes
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/buyer/documents')}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select →
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Re-analysis */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Profile Updated?</p>
              <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:border-blue-300 transition">
                Re-analyze to get updated recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Original Verification Options - keeping for backwards compatibility */}
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
              onClick={() => router.push('/buyer/documents')}
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

        {/* KYC Status Section */}
        {isAuthenticated && user ? (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Verification Status</h3>
                <div className="text-sm text-gray-500">
                  User ID: {user.id}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isVerificationComplete() ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Verification Complete</p>
                      <p className="text-sm text-green-700">All verification requirements satisfied</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Verification Required</p>
                      <p className="text-sm text-yellow-700">Complete verification to unlock all features</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-900">Error Loading KYC Status</h3>
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-700 mb-4">User not found</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Verification Sync Status */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Verification Sync Status</h3>
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">Real-time synchronization across 4 systems</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-sm font-medium text-gray-900">Network</div>
                <div className="text-xs text-gray-500">Connected</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="text-lg font-bold text-gray-600">0%</div>
                </div>
                <div className="text-sm font-medium text-gray-900">Progress</div>
                <div className="text-xs text-gray-500">Not started</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="text-lg font-bold text-gray-600">4</div>
                </div>
                <div className="text-sm font-medium text-gray-900">Systems</div>
                <div className="text-xs text-gray-500">Ready</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">Status</div>
                <div className="text-xs text-green-600">Online</div>
              </div>
            </div>

            {/* Sync Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Synchronization Progress</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
              </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-900">Identity System</div>
                  <div className="text-xs text-green-700">Connected</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-900">Document System</div>
                  <div className="text-xs text-green-700">Connected</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-900">Compliance System</div>
                  <div className="text-xs text-green-700">Connected</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-900">Audit System</div>
                  <div className="text-xs text-green-700">Connected</div>
                </div>
              </div>
            </div>
          </div>
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
        
        // Redirect to journey page after successful completion
        setTimeout(() => {
          router.push('/buyer/journey');
        }, 3000);
        
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
          // Redirect to journey page after completion
          setTimeout(() => router.push('/buyer/journey'), 2000);
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
          // Redirect to journey page after completion
          setTimeout(() => router.push('/buyer/journey'), 2000);
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