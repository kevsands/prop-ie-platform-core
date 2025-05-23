'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building, Shield, ChevronLeft, ChevronRight, Check,
  Eye, EyeOff, Info, Upload, Globe, Briefcase, TrendingUp,
  AlertCircle, Lock, UserCheck, FileText, ShieldCheck,
  CreditCard, Calendar, Award, BarChart3, Target, Zap,
  Phone, Mail, MapPin, Building2, Users, DollarSign, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Multi-step form stages
const steps = [
  { id: 1, name: 'Account Type', icon: Building },
  { id: 2, name: 'Personal Details', icon: UserCheck },
  { id: 3, name: 'Investment Profile', icon: TrendingUp },
  { id: 4, name: 'Documents', icon: FileText },
  { id: 5, name: 'Verification', icon: ShieldCheck }
];

// Investment strategies
const investmentStrategies = [
  { id: 'growth', name: 'Growth', description: 'Focus on capital appreciation', risk: 'High' },
  { id: 'income', name: 'Income', description: 'Regular rental income', risk: 'Medium' },
  { id: 'balanced', name: 'Balanced', description: 'Mix of growth and income', risk: 'Medium' },
  { id: 'conservative', name: 'Conservative', description: 'Capital preservation', risk: 'Low' }
];

// Property preferences
const propertyTypes = [
  { id: 'residential', name: 'Residential', icon: Building },
  { id: 'commercial', name: 'Commercial', icon: Building2 },
  { id: 'industrial', name: 'Industrial', icon: Briefcase },
  { id: 'mixed-use', name: 'Mixed Use', icon: Users },
  { id: 'hospitality', name: 'Hospitality', icon: Globe },
  { id: 'healthcare', name: 'Healthcare', icon: ShieldCheck }
];

// Investment ranges
const investmentRanges = [
  { id: '0-500k', label: '€0 - €500k', min: 0, max: 500000 },
  { id: '500k-1m', label: '€500k - €1M', min: 500000, max: 1000000 },
  { id: '1m-5m', label: '€1M - €5M', min: 1000000, max: 5000000 },
  { id: '5m-10m', label: '€5M - €10M', min: 5000000, max: 10000000 },
  { id: '10m+', label: '€10M+', min: 10000000, max: null }
];

export default function InvestorRegistrationPage() {
  const router = useRouter();
  const [currentStepsetCurrentStep] = useState(1);
  const [showPasswordsetShowPassword] = useState(false);
  const [isLoadingsetIsLoading] = useState(false);

  // Form data
  const [formDatasetFormData] = useState({
    accountType: 'individual',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    position: '',
    website: '',
    investmentRange: '',
    investmentHorizon: '',
    riskTolerance: '',
    strategies: [],
    propertyTypes: [],
    geographicFocus: [],
    previousExperience: '',
    documents: {
      proofOfIdentity: null,
      proofOfAddress: null,
      bankStatement: null,
      companyDocs: null
    },
    terms: false,
    newsletter: true
  });

  // File upload refs
  const fileInputRefs = {
    proofOfIdentity: React.useRef<HTMLInputElement>(null),
    proofOfAddress: React.useRef<HTMLInputElement>(null),
    bankStatement: React.useRef<HTMLInputElement>(null),
    companyDocs: React.useRef<HTMLInputElement>(null)
  };

  const [errorssetErrors] = useState({});

  const updateFormData = (field: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value: any
    }));
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [field]: 'Please upload a PDF, JPG, or PNG file'
        }));
        return;
      }

      // Validate file size (10MB max)
      if (file.size> 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [field]: 'File size must be less than 10MB'
        }));
        return;
      }

      // Update form data with file
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file
        }
      }));

      // Clear error for this field
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileRemove = (field: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: null
      }
    }));

    // Reset the file input
    if (fileInputRefs[field]?.current) {
      fileInputRefs[field].current.value: any = '';
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch(currentStep) {
      case 1:
        // Account type is always selected
        break;
      case 2:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length <8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (formData.accountType === 'corporate') {
          if (!formData.company.trim()) newErrors.company = 'Company name is required';
          if (!formData.position.trim()) newErrors.position = 'Position is required';
        }
        break;
      case 3:
        if (!formData.investmentRange) newErrors.investmentRange = 'Please select investment range';
        if (!formData.investmentHorizon) newErrors.investmentHorizon = 'Please select investment horizon';
        if (!formData.riskTolerance) newErrors.riskTolerance = 'Please select risk tolerance';
        if (formData.strategies.length === 0) newErrors.strategies = 'Please select at least one strategy';
        if (formData.propertyTypes.length === 0) newErrors.propertyTypes = 'Please select at least one property type';
        break;
      case 4:
        if (!formData.documents.proofOfIdentity) newErrors.proofOfIdentity = 'Proof of identity required';
        if (!formData.documents.proofOfAddress) newErrors.proofOfAddress = 'Proof of address required';
        if (formData.accountType === 'corporate' && !formData.documents.companyDocs) {
          newErrors.companyDocs = 'Company documents required';
        }
        break;
      case 5:
        if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep <steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep> 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve2000));

      // Success - redirect to dashboard
      router.push('/investor/dashboard');
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#2B5273] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Prop.ie</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-gray-600">Already have an account?</span>
              <Link
                href="/login"
                className="text-[#2B5273] font-medium hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((stepindex) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center ${index <steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        currentStep> step.id
                          ? 'bg-green-500 text-white'
                          : currentStep === step.id
                          ? 'bg-[#2B5273] text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {currentStep> step.id ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${
                      currentStep>= step.id ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index <steps.length - 1 && (
                    <div
                      className={`hidden md:block flex-1 h-1 mx-4 ${
                        currentStep> step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Account Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={ opacity: 0, x: 20 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -20 }
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Create Your Investor Account
                </h2>
                <p className="text-lg text-gray-600">
                  Join Ireland\'s premier property investment platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => updateFormData('accountType', 'individual')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    formData.accountType === 'individual'
                      ? 'border-[#2B5273] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <UserCheck className="h-12 w-12 text-[#2B5273] mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Individual Investor
                    </h3>
                    <p className="text-gray-600">
                      Personal investment account for individual property investors
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => updateFormData('accountType', 'corporate')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    formData.accountType === 'corporate'
                      ? 'border-[#2B5273] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <Building2 className="h-12 w-12 text-[#2B5273] mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Corporate Account
                    </h3>
                    <p className="text-gray-600">
                      Investment account for companies and institutional investors
                    </p>
                  </div>
                </button>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Why choose Prop.ie?
                    </h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Access to exclusive off-market opportunities</li>
                      <li>• AI-powered investment recommendations</li>
                      <li>• End-to-end digital transaction management</li>
                      <li>• Professional portfolio analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={ opacity: 0, x: 20 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -20 }
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Personal Information
                </h2>
                <p className="text-lg text-gray-600">
                  Let\'s start with your basic details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value: any={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value: any={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value: any={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value: any={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+353 1 234 5678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {formData.accountType === 'corporate' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value: any={formData.company}
                        onChange={(e) => updateFormData('company', e.target.value: any)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                          errors.company ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="ABC Investments Ltd"
                      />
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position *
                      </label>
                      <input
                        type="text"
                        value: any={formData.position}
                        onChange={(e) => updateFormData('position', e.target.value: any)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                          errors.position ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Investment Director"
                      />
                      {errors.position && (
                        <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Website
                      </label>
                      <input
                        type="url"
                        value: any={formData.website}
                        onChange={(e) => updateFormData('website', e.target.value: any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value: any={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value: any)}
                      className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value: any={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Investment Profile */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={ opacity: 0, x: 20 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -20 }
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Investment Profile
                </h2>
                <p className="text-lg text-gray-600">
                  Help us understand your investment preferences
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Investment Range *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {investmentRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => updateFormData('investmentRange', range.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.investmentRange === range.id
                            ? 'border-[#2B5273] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <DollarSign className="h-6 w-6 mx-auto mb-2 text-[#2B5273]" />
                          <p className="font-medium">{range.label}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.investmentRange && (
                    <p className="mt-2 text-sm text-red-500">{errors.investmentRange}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Investment Horizon *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['1-3 years', '3-5 years', '5-10 years', '10+ years'].map((horizon) => (
                      <button
                        key={horizon}
                        onClick={() => updateFormData('investmentHorizon', horizon)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.investmentHorizon === horizon
                            ? 'border-[#2B5273] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Calendar className="h-5 w-5 mx-auto mb-2 text-[#2B5273]" />
                        <p className="text-sm font-medium">{horizon}</p>
                      </button>
                    ))}
                  </div>
                  {errors.investmentHorizon && (
                    <p className="mt-2 text-sm text-red-500">{errors.investmentHorizon}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Risk Tolerance *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['conservative', 'moderate', 'aggressive'].map((risk) => (
                      <button
                        key={risk}
                        onClick={() => updateFormData('riskTolerance', risk)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.riskTolerance === risk
                            ? 'border-[#2B5273] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Target className="h-6 w-6 mx-auto mb-2 text-[#2B5273]" />
                        <p className="font-medium capitalize">{risk}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {risk === 'conservative' && 'Lower risk, stable returns'}
                          {risk === 'moderate' && 'Balanced risk and growth'}
                          {risk === 'aggressive' && 'Higher risk, maximum growth'}
                        </p>
                      </button>
                    ))}
                  </div>
                  {errors.riskTolerance && (
                    <p className="mt-2 text-sm text-red-500">{errors.riskTolerance}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Investment Strategies * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {investmentStrategies.map((strategy) => (
                      <button
                        key={strategy.id}
                        onClick={() => {
                          const newStrategies = formData.strategies.includes(strategy.id)
                            ? formData.strategies.filter(s => s !== strategy.id)
                            : [...formData.strategies, strategy.id];
                          updateFormData('strategies', newStrategies);
                        }
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.strategies.includes(strategy.id)
                            ? 'border-[#2B5273] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{strategy.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            strategy.risk === 'High' ? 'bg-red-100 text-red-600' :
                            strategy.risk === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {strategy.risk} Risk
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.strategies && (
                    <p className="mt-2 text-sm text-red-500">{errors.strategies}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Property Types * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {propertyTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => {
                            const newTypes = formData.propertyTypes.includes(type.id)
                              ? formData.propertyTypes.filter(t => t !== type.id)
                              : [...formData.propertyTypes, type.id];
                            updateFormData('propertyTypes', newTypes);
                          }
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.propertyTypes.includes(type.id)
                              ? 'border-[#2B5273] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-6 w-6 mx-auto mb-2 text-[#2B5273]" />
                          <p className="text-sm font-medium">{type.name}</p>
                        </button>
                      );
                    })}
                  </div>
                  {errors.propertyTypes && (
                    <p className="mt-2 text-sm text-red-500">{errors.propertyTypes}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Previous Real Estate Investment Experience
                  </label>
                  <textarea
                    value: any={formData.previousExperience}
                    onChange={(e) => updateFormData('previousExperience', e.target.value: any)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="Describe your previous property investment experience..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Document Upload */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={ opacity: 0, x: 20 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -20 }
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Document Verification
                </h2>
                <p className="text-lg text-gray-600">
                  Please upload the required documents for verification
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Document Requirements</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        All documents must be clear, legible, and dated within the last 3 months.
                        Accepted formats: PDF, JPG, PNG (max 10MB each)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proof of Identity *
                    </label>
                    <div className="relative">
                      {formData.documents.proofOfIdentity ? (
                        <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-green-600" />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{formData.documents.proofOfIdentity.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(formData.documents.proofOfIdentity.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileRemove('proofOfIdentity');
                              }
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRefs.proofOfIdentity.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                            errors.proofOfIdentity
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Upload passport or driving license
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, JPG, PNG (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRefs.proofOfIdentity}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileUpload('proofOfIdentity', e.target.files?.[0] || null)}
                      />
                    </div>
                    {errors.proofOfIdentity && (
                      <p className="mt-1 text-sm text-red-500">{errors.proofOfIdentity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proof of Address *
                    </label>
                    <div className="relative">
                      {formData.documents.proofOfAddress ? (
                        <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-green-600" />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{formData.documents.proofOfAddress.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(formData.documents.proofOfAddress.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileRemove('proofOfAddress');
                              }
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRefs.proofOfAddress.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                            errors.proofOfAddress
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Upload utility bill or bank statement
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, JPG, PNG (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRefs.proofOfAddress}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileUpload('proofOfAddress', e.target.files?.[0] || null)}
                      />
                    </div>
                    {errors.proofOfAddress && (
                      <p className="mt-1 text-sm text-red-500">{errors.proofOfAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Statement (Optional)
                    </label>
                    <div className="relative">
                      {formData.documents.bankStatement ? (
                        <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-blue-600" />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{formData.documents.bankStatement.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(formData.documents.bankStatement.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileRemove('bankStatement');
                              }
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRefs.bankStatement.current?.click()}
                          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all border-gray-300 hover:border-gray-400"
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Upload recent bank statement
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Optional - PDF, JPG, PNG (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRefs.bankStatement}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileUpload('bankStatement', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  {formData.accountType === 'corporate' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Documents *
                      </label>
                      <div className="relative">
                        {formData.documents.companyDocs ? (
                          <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-green-600" />
                                <div className="text-left">
                                  <p className="font-medium text-gray-900">{formData.documents.companyDocs.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {(formData.documents.companyDocs.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileRemove('companyDocs');
                                }
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => fileInputRefs.companyDocs.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                              errors.companyDocs
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              Upload certificate of incorporation
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, JPG, PNG (max 10MB)
                            </p>
                          </div>
                        )}
                        <input
                          ref={fileInputRefs.companyDocs}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileUpload('companyDocs', e.target.files?.[0] || null)}
                        />
                      </div>
                      {errors.companyDocs && (
                        <p className="mt-1 text-sm text-red-500">{errors.companyDocs}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Final Review */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={ opacity: 0, x: 20 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -20 }
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Final Review
                </h2>
                <p className="text-lg text-gray-600">
                  Please review your information and accept our terms
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Account Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Account Type:</span>
                    <span className="ml-2 font-medium capitalize">{formData.accountType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Investment Range:</span>
                    <span className="ml-2 font-medium">
                      {investmentRanges.find(r => r.id === formData.investmentRange)?.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => updateFormData('terms', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    I accept the{' '}
                    <Link href="/terms" className="text-[#2B5273] hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[#2B5273] hover:underline">
                      Privacy Policy
                    </Link>
                    . I understand that my information will be used to verify my identity and assess my suitability as an investor.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms}</p>
                )}

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => updateFormData('newsletter', e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">
                    Send me investment opportunities and platform updates
                  </span>
                </label>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      What happens next?
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Our team will review your application within 24 hours</li>
                      <li>• You\'ll receive an email confirmation once approved</li>
                      <li>• Access to your investor dashboard will be granted</li>
                      <li>• You can start browsing investment opportunities immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-[#2B5273] text-white rounded-lg font-medium hover:bg-[#1E3142] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                Processing...
              </>
            ) : currentStep === steps.length ? (
              <>
                Complete Registration
                <Check className="h-5 w-5" / />
            ) : (
              <>
                Next
                <ChevronRight className="h-5 w-5" / />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}