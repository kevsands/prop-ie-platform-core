'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Home, 
  PiggyBank, 
  Calculator,
  FileText,
  Clock,
  MapPin,
  Banknote,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

import { 
  CustomerArchetype,
  PrimaryRole,
  RegistrationStep,
  FormField,
  OnboardingPath
} from '@/types/enterprise/customer-archetypes';

interface ProgressiveProfilingProps {
  userArchetype: CustomerArchetype;
  initialData?: any;
  onComplete: (profileData: any) => void;
  onUpdate?: (profileData: any) => void;
}

// Dynamic form field configurations based on archetype
const ARCHETYPE_STEPS: Record<string, RegistrationStep[]> = {
  'FIRST_TIME_IRISH': [
    {
      id: 'htb-eligibility',
      title: 'Help-to-Buy Eligibility',
      description: 'Check your €30,000 grant eligibility',
      fields: [
        {
          name: 'isFirstTime',
          type: 'checkbox',
          label: 'This is my first time buying property',
          required: true
        },
        {
          name: 'isIrishResident',
          type: 'checkbox', 
          label: 'I am an Irish tax resident',
          required: true
        },
        {
          name: 'annualIncome',
          type: 'select',
          label: 'Annual Income',
          required: true,
          options: [
            { value: '0-35000', label: '€0 - €35,000' },
            { value: '35000-50000', label: '€35,000 - €50,000' },
            { value: '50000-75000', label: '€50,000 - €75,000' },
            { value: '75000+', label: '€75,000+' }
          ]
        }
      ]
    },
    {
      id: 'financial-position',
      title: 'Financial Position',
      description: 'Help us understand your buying power',
      fields: [
        {
          name: 'depositAmount',
          type: 'number',
          label: 'Current Deposit Saved (€)',
          required: true,
          validation: { min: 0 }
        },
        {
          name: 'hasAIP',
          type: 'checkbox',
          label: 'I have Approval in Principle',
          required: false
        },
        {
          name: 'mortgageLender',
          type: 'select',
          label: 'Preferred Lender',
          required: false,
          options: [
            { value: 'aib', label: 'AIB' },
            { value: 'boi', label: 'Bank of Ireland' },
            { value: 'ptsb', label: 'PTSB' },
            { value: 'avant', label: 'Avant Money' },
            { value: 'other', label: 'Other' }
          ],
          condition: (formData) => formData.hasAIP
        }
      ]
    }
  ],
  
  'PROPERTY_DEVELOPER': [
    {
      id: 'company-details',
      title: 'Company Information',
      description: 'Tell us about your development business',
      fields: [
        {
          name: 'companyName',
          type: 'text',
          label: 'Company Name',
          required: true
        },
        {
          name: 'croNumber',
          type: 'text',
          label: 'CRO Number',
          required: true,
          validation: { pattern: '^[0-9]{6}$' }
        },
        {
          name: 'companySize',
          type: 'select',
          label: 'Company Size',
          required: true,
          options: [
            { value: 'startup', label: 'Startup (1-10 employees)' },
            { value: 'small', label: 'Small (11-50 employees)' },
            { value: 'medium', label: 'Medium (51-200 employees)' },
            { value: 'large', label: 'Large (200+ employees)' }
          ]
        }
      ]
    },
    {
      id: 'development-portfolio',
      title: 'Development Portfolio',
      description: 'Your current and planned projects',
      fields: [
        {
          name: 'currentProjects',
          type: 'number',
          label: 'Current Active Projects',
          required: true,
          validation: { min: 0, max: 100 }
        },
        {
          name: 'plannedProjects',
          type: 'number',
          label: 'Projects Planned (Next 2 Years)',
          required: true,
          validation: { min: 0, max: 100 }
        },
        {
          name: 'propertyTypes',
          type: 'multiselect',
          label: 'Property Types You Develop',
          required: true,
          options: [
            { value: 'apartments', label: 'Apartments' },
            { value: 'houses', label: 'Houses' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'mixed', label: 'Mixed-Use' }
          ]
        },
        {
          name: 'targetBuyers',
          type: 'multiselect',
          label: 'Target Buyer Segments',
          required: true,
          options: [
            { value: 'ftb', label: 'First-Time Buyers' },
            { value: 'investors', label: 'Buy-to-Let Investors' },
            { value: 'trade-up', label: 'Trade-Up Buyers' },
            { value: 'international', label: 'International Buyers' }
          ]
        }
      ]
    }
  ],

  'SOLICITOR': [
    {
      id: 'practice-details',
      title: 'Practice Information',
      description: 'Tell us about your legal practice',
      fields: [
        {
          name: 'firmName',
          type: 'text',
          label: 'Firm Name',
          required: true
        },
        {
          name: 'lawSocietyNumber',
          type: 'text',
          label: 'Law Society Number',
          required: true
        },
        {
          name: 'practiceType',
          type: 'select',
          label: 'Practice Type',
          required: true,
          options: [
            { value: 'sole', label: 'Sole Practitioner' },
            { value: 'partnership', label: 'Partnership' },
            { value: 'company', label: 'Company' },
            { value: 'associate', label: 'Associate' }
          ]
        }
      ]
    },
    {
      id: 'service-focus',
      title: 'Service Specialization',
      description: 'Your areas of expertise',
      fields: [
        {
          name: 'specializations',
          type: 'multiselect',
          label: 'Legal Specializations',
          required: true,
          options: [
            { value: 'residential-conveyancing', label: 'Residential Conveyancing' },
            { value: 'commercial-conveyancing', label: 'Commercial Conveyancing' },
            { value: 'probate', label: 'Probate' },
            { value: 'family-law', label: 'Family Law' },
            { value: 'litigation', label: 'Litigation' }
          ]
        },
        {
          name: 'annualTransactions',
          type: 'select',
          label: 'Annual Property Transactions',
          required: true,
          options: [
            { value: '1-25', label: '1-25 transactions' },
            { value: '26-50', label: '26-50 transactions' },
            { value: '51-100', label: '51-100 transactions' },
            { value: '100+', label: '100+ transactions' }
          ]
        }
      ]
    }
  ]
};

const COMPLETION_INCENTIVES = {
  'FIRST_TIME_IRISH': {
    title: 'Unlock Your €30k HTB Calculator',
    description: 'See exactly how much Help-to-Buy grant you can claim',
    reward: 'Instant HTB calculator + exclusive property alerts'
  },
  'PROPERTY_DEVELOPER': {
    title: 'Get Premium Developer Dashboard',
    description: 'Advanced analytics and buyer insights for your projects',
    reward: 'Free 30-day trial of premium developer tools'
  },
  'SOLICITOR': {
    title: 'Access Digital Conveyancing Tools',
    description: 'Streamline your practice with modern workflow tools',
    reward: 'Free digital conveyancing starter pack'
  }
};

export default function ProgressiveProfilingEngine({ 
  userArchetype, 
  initialData = {}, 
  onComplete, 
  onUpdate 
}: ProgressiveProfilingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [completeness, setCompleteness] = useState(30);

  const archetypeKey = `${userArchetype.primaryRole}_${userArchetype.subtype}`.toUpperCase();
  const steps = ARCHETYPE_STEPS[archetypeKey] || [];
  const currentStep = steps[currentStepIndex];
  const incentive = COMPLETION_INCENTIVES[archetypeKey];

  useEffect(() => {
    calculateCompleteness();
    if (onUpdate) {
      onUpdate(formData);
    }
  }, [formData]);

  const calculateCompleteness = () => {
    const totalFields = steps.reduce((acc, step) => acc + step.fields.length, 0);
    const completedFields = Object.keys(formData).filter(key => {
      const value = formData[key];
      return value !== '' && value !== null && value !== undefined && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;
    
    const newCompleteness = Math.min(Math.round((completedFields / totalFields) * 100), 100);
    setCompleteness(newCompleteness);
  };

  const validateCurrentStep = (): boolean => {
    if (!currentStep) return true;
    
    const stepErrors: any = {};
    
    currentStep.fields.forEach(field => {
      // Check field condition
      if (field.condition && !field.condition(formData)) {
        return; // Skip validation for conditional fields that shouldn't show
      }
      
      const value = formData[field.name];
      
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        stepErrors[field.name] = `${field.label} is required`;
      }
      
      if (value && field.validation) {
        const { pattern, minLength, maxLength, min, max } = field.validation;
        
        if (pattern && !new RegExp(pattern).test(value)) {
          stepErrors[field.name] = `Invalid ${field.label.toLowerCase()} format`;
        }
        
        if (minLength && value.length < minLength) {
          stepErrors[field.name] = `${field.label} must be at least ${minLength} characters`;
        }
        
        if (maxLength && value.length > maxLength) {
          stepErrors[field.name] = `${field.label} must be no more than ${maxLength} characters`;
        }
        
        if (min !== undefined && Number(value) < min) {
          stepErrors[field.name] = `${field.label} must be at least ${min}`;
        }
        
        if (max !== undefined && Number(value) > max) {
          stepErrors[field.name] = `${field.label} must be no more than ${max}`;
        }
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Save profile data
      await fetch('/api/user/profile/progressive-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetype: userArchetype,
          profileData: formData,
          completeness: completeness
        })
      });
      
      onComplete(formData);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    // Check field condition
    if (field.condition && !field.condition(formData)) {
      return null;
    }

    const value = formData[field.name] || '';
    const error = errors[field.name];

    const updateValue = (newValue: any) => {
      setFormData({ ...formData, [field.name]: newValue });
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && '*'}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => updateValue(e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {field.helpText && <p className="text-gray-500 text-sm">{field.helpText}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && '*'}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => updateValue(e.target.value)}
              placeholder={field.placeholder}
              min={field.validation?.min}
              max={field.validation?.max}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {field.helpText && <p className="text-gray-500 text-sm">{field.helpText}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && '*'}
            </label>
            <select
              value={value}
              onChange={(e) => updateValue(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {field.helpText && <p className="text-gray-500 text-sm">{field.helpText}</p>}
          </div>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && '*'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {field.options?.map(option => (
                <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateValue([...selectedValues, option.value]);
                      } else {
                        updateValue(selectedValues.filter(v => v !== option.value));
                      }
                    }}
                    className="mr-3 h-4 w-4 text-blue-600 rounded"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-gray-600">{option.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {field.helpText && <p className="text-gray-500 text-sm">{field.helpText}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => updateValue(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm">
                {field.label} {field.required && '*'}
              </span>
            </label>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {field.helpText && <p className="text-gray-500 text-sm">{field.helpText}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentStep) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Complete!</h2>
        <p className="text-gray-600">Your profile has been updated successfully.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          <div className="text-sm font-medium text-blue-600">
            {completeness}% Complete
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Completion Incentive */}
      {incentive && completeness >= 80 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Sparkles className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{incentive.title}</h3>
              <p className="text-gray-700 mb-2">{incentive.description}</p>
              <p className="text-sm font-medium text-blue-600">{incentive.reward}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">{currentStep.title}</h1>
          <p className="text-blue-100">{currentStep.description}</p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {currentStep.fields.map(renderField)}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 ${
              currentStepIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{currentStepIndex === steps.length - 1 ? 'Complete Profile' : 'Continue'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}