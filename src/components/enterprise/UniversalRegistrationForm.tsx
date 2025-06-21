'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Home, 
  FileText, 
  Briefcase, 
  PiggyBank,
  Banknote,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Shield,
  Award,
  Sparkles
} from 'lucide-react';

import { 
  PrimaryRole, 
  CustomerArchetype, 
  ARCHETYPE_VALUE_PROPS,
  ValueProposition,
  GeographicFocus
} from '@/types/enterprise/customer-archetypes';

interface UniversalRegistrationData {
  // Phase 1: Universal Intake (60 seconds)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  primaryRole: PrimaryRole | '';
  geographicFocus: GeographicFocus | '';
  
  // Phase 2: Quick Qualifier (30 seconds)
  urgency: string;
  experience: string;
  specificNeed: string;
  
  // Consent
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

const PRIMARY_ROLES = [
  {
    value: 'DEVELOPER' as PrimaryRole,
    label: 'Property Developer',
    description: 'Develop, build or sell properties',
    icon: Building2,
    color: 'blue',
    examples: ['Property Developer', 'Construction Company', 'Investment Fund']
  },
  {
    value: 'BUYER' as PrimaryRole,
    label: 'Property Buyer',
    description: 'Looking to buy property in Ireland',
    icon: Home,
    color: 'green',
    examples: ['First-time Buyer', 'Investor', 'Trade-up Buyer']
  },
  {
    value: 'PROFESSIONAL' as PrimaryRole,
    label: 'Professional Services',
    description: 'Provide property-related services',
    icon: FileText,
    color: 'purple',
    examples: ['Solicitor', 'Estate Agent', 'Mortgage Broker']
  },
  {
    value: 'CORPORATE' as PrimaryRole,
    label: 'Corporate/Institutional',
    description: 'Large-scale property investment',
    icon: Briefcase,
    color: 'orange',
    examples: ['Investment Fund', 'Corporate Relocation', 'REIT']
  }
];

const GEOGRAPHIC_OPTIONS = [
  { value: 'DUBLIN', label: 'Dublin', description: 'Dublin city and greater Dublin area' },
  { value: 'CORK', label: 'Cork', description: 'Cork city and county' },
  { value: 'GALWAY', label: 'Galway', description: 'Galway city and county' },
  { value: 'NATIONAL', label: 'National', description: 'All of Ireland' },
  { value: 'INTERNATIONAL', label: 'International', description: 'International investor' }
];

export default function UniversalRegistrationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  
  const [formData, setFormData] = useState<UniversalRegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    primaryRole: '',
    geographicFocus: '',
    urgency: '',
    experience: '',
    specificNeed: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const selectedRoleConfig = PRIMARY_ROLES.find(role => role.value === formData.primaryRole);
  const valueProposition = formData.primaryRole ? getValueProposition(formData.primaryRole) : null;

  function getValueProposition(role: PrimaryRole): ValueProposition | null {
    // Map primary roles to specific value props - this would be more sophisticated in practice
    const roleMapping: Record<PrimaryRole, string> = {
      'DEVELOPER': 'PROPERTY_DEVELOPER',
      'BUYER': 'FIRST_TIME_IRISH', // Default, will be refined in step 2
      'PROFESSIONAL': 'SOLICITOR', // Default
      'CORPORATE': 'INSTITUTIONAL_INVESTOR'
    };
    
    return ARCHETYPE_VALUE_PROPS[roleMapping[role]] || null;
  }

  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
      if (!formData.email.trim()) newErrors.email = 'Email required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number required';
      if (!formData.primaryRole) newErrors.primaryRole = 'Please select your role';
      if (!formData.geographicFocus) newErrors.geographicFocus = 'Geographic focus required';
    }

    if (step === 2) {
      if (!formData.urgency) newErrors.urgency = 'Please select your timeline';
      if (!formData.experience) newErrors.experience = 'Experience level required';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        setCurrentStep(2);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Phase 1: Register user with basic info
      const registrationResponse = await fetch('/api/auth/register-universal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          primaryRole: formData.primaryRole,
          geographicFocus: formData.geographicFocus,
          urgency: formData.urgency,
          experience: formData.experience,
          agreeToMarketing: formData.agreeToMarketing
        })
      });

      if (!registrationResponse.ok) {
        throw new Error('Registration failed');
      }

      const result = await registrationResponse.json();

      // Immediate access granted - redirect to role-specific onboarding
      const redirectPaths: Record<PrimaryRole, string> = {
        'DEVELOPER': '/developer/onboarding',
        'BUYER': determineBuyerOnboardingPath(formData),
        'PROFESSIONAL': '/professional/onboarding',
        'CORPORATE': '/corporate/onboarding'
      };

      router.push(redirectPaths[formData.primaryRole as PrimaryRole]);
      
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  function determineBuyerOnboardingPath(data: UniversalRegistrationData): string {
    // Smart routing based on initial data
    if (data.experience === 'first-time') {
      return '/buyer/first-time/onboarding';
    } else if (data.urgency === 'immediate' && data.experience === 'experienced') {
      return '/buyer/fast-track/onboarding';
    } else {
      return '/buyer/onboarding';
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+353 87 123 4567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What best describes your role? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRIMARY_ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = formData.primaryRole === role.value;
            
            return (
              <div
                key={role.value}
                onClick={() => setFormData({ ...formData, primaryRole: role.value })}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? `border-${role.color}-500 bg-${role.color}-50` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-${role.color}-100`}>
                    <Icon className={`text-${role.color}-600`} size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{role.label}</h3>
                    <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                    <div className="text-xs text-gray-500">
                      Examples: {role.examples.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {errors.primaryRole && <p className="text-red-500 text-sm mt-1">{errors.primaryRole}</p>}
      </div>

      {/* Geographic Focus */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Geographic Focus *
        </label>
        <select
          value={formData.geographicFocus}
          onChange={(e) => setFormData({ ...formData, geographicFocus: e.target.value as GeographicFocus })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.geographicFocus ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your area of focus</option>
          {GEOGRAPHIC_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
        {errors.geographicFocus && <p className="text-red-500 text-sm mt-1">{errors.geographicFocus}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Value Proposition Display */}
      {valueProposition && selectedRoleConfig && (
        <div className={`bg-${selectedRoleConfig.color}-50 border border-${selectedRoleConfig.color}-200 rounded-lg p-6`}>
          <div className="flex items-start space-x-4">
            <div className={`p-3 bg-${selectedRoleConfig.color}-100 rounded-lg`}>
              <selectedRoleConfig.icon className={`text-${selectedRoleConfig.color}-600`} size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{valueProposition.headline}</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {valueProposition.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Qualifiers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's your timeline? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'immediate', label: 'Immediate (1-30 days)', icon: '🚀' },
            { value: 'active', label: 'Active (1-3 months)', icon: '⚡' },
            { value: 'planning', label: 'Planning (3-12 months)', icon: '📅' },
            { value: 'future', label: 'Future (12+ months)', icon: '🔮' }
          ].map(option => (
            <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={option.value}
                checked={formData.urgency === option.value}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="mr-3"
              />
              <span className="mr-2">{option.icon}</span>
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.urgency && <p className="text-red-500 text-sm mt-1">{errors.urgency}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Level *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'first-time', label: 'First Time', description: 'New to property' },
            { value: 'some', label: 'Some Experience', description: '1-2 previous transactions' },
            { value: 'experienced', label: 'Experienced', description: '3+ transactions' },
            { value: 'expert', label: 'Expert', description: 'Industry professional' }
          ].map(option => (
            <label key={option.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={option.value}
                checked={formData.experience === option.value}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="mr-3 mt-1"
              />
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
      </div>

      {/* Consent */}
      <div className="space-y-3">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="mt-1 h-4 w-4 text-blue-600 rounded"
          />
          <span className="text-sm">
            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
          </span>
        </label>
        {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToMarketing}
            onChange={(e) => setFormData({ ...formData, agreeToMarketing: e.target.checked })}
            className="mt-1 h-4 w-4 text-blue-600 rounded"
          />
          <span className="text-sm">
            I'd like to receive updates about relevant properties and market insights
          </span>
        </label>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-800">{errors.submit}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-24 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of 2 • {currentStep === 1 ? 'Basic Info' : 'Quick Qualifier'}
            </span>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">
              {currentStep === 1 ? 'Welcome to PROP' : 'Almost There!'}
            </h1>
            <p className="text-blue-100">
              {currentStep === 1 
                ? 'Join Ireland\'s leading property platform in under 60 seconds'
                : 'Let us personalize your experience'
              }
            </p>
            <div className="flex items-center space-x-4 mt-4 text-sm">
              <span className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{currentStep === 1 ? '60 seconds' : '30 seconds'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield size={16} />
                <span>GDPR Compliant</span>
              </span>
              <span className="flex items-center space-x-1">
                <Award size={16} />
                <span>Trusted by 10,000+ users</span>
              </span>
            </div>
          </div>

          <div className="p-6">
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </div>

          <div className="p-6 bg-gray-50 border-t flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === 1 ? 'Continue' : 'Get Started'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="text-blue-600" size={28} />
              </div>
              <h3 className="font-semibold mb-1">Secure & Private</h3>
              <p className="text-sm text-gray-600">ISO 27001 certified security</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="text-green-600" size={28} />
              </div>
              <h3 className="font-semibold mb-1">Instant Access</h3>
              <p className="text-sm text-gray-600">No waiting, immediate platform access</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Target className="text-purple-600" size={28} />
              </div>
              <h3 className="font-semibold mb-1">Personalized</h3>
              <p className="text-sm text-gray-600">Tailored to your specific needs</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <Award className="text-orange-600" size={28} />
              </div>
              <h3 className="font-semibold mb-1">Award Winning</h3>
              <p className="text-sm text-gray-600">Ireland's #1 PropTech platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}