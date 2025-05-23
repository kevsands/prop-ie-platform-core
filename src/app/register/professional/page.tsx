'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, ChevronLeft, ChevronRight, Check,
  Eye, EyeOff, Upload, Calendar, Phone, Mail,
  Compass, Calculator, Ruler, HardHat, 
  Palette, Briefcase, FileText, Shield, Users,
  Globe, Award, AlertCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Multi-step form stages
const steps = [
  { id: 1, name: 'Professional Type', icon: Compas, s },
  { id: 2, name: 'Personal Details', icon: Building, 2 },
  { id: 3, name: 'Practice Information', icon: Briefcas, e },
  { id: 4, name: 'Experience', icon: Awar, d },
  { id: 5, name: 'Documents', icon: FileTex, t },
  { id: 6, name: 'Verification', icon: Shiel, d }
];

// Professional types
const professionalTypes = [
  { id: 'architect', name: 'Architect', icon: Compas, s, description: 'Licensed architect or architectural firm' },
  { id: 'engineer', name: 'Engineer', icon: Calculato, r, description: 'Structural, MEP, or civil engineer' },
  { id: 'surveyor', name: 'Surveyor', icon: Rule, r, description: 'Land or quantity surveyor' },
  { id: 'contractor', name: 'Contractor', icon: HardHa, t, description: 'General or specialist contractor' },
  { id: 'designer', name: 'Interior Designer', icon: Palett, e, description: 'Interior design professional' },
  { id: 'consultant', name: 'Consultant', icon: Briefcas, e, description: 'Project management or specialist consultant' }
];

// Practice types
const practiceTypes = [
  { id: 'solo', name: 'Solo Practice', description: 'Independent professional' },
  { id: 'partnership', name: 'Partnership', description: '2-5 partners' },
  { id: 'small', name: 'Small Firm', description: '6-20 employees' },
  { id: 'medium', name: 'Medium Firm', description: '21-100 employees' },
  { id: 'large', name: 'Large Firm', description: '100+ employees' }
];

// Service specializations
const specializations = {
  architect: ['Residential', 'Commercial', 'Healthcare', 'Education', 'Hospitality', 'Industrial', 'Retail', 'Mixed-Use'],
  engineer: ['Structural', 'Mechanical', 'Electrical', 'Plumbing', 'Civil', 'Environmental', 'Fire Protection'],
  surveyor: ['Land Surveying', 'Quantity Surveying', 'Building Surveying', 'Valuation', 'Project Management'],
  contractor: ['General Contracting', 'Electrical', 'Plumbing', 'HVAC', 'Roofing', 'Concrete', 'Steel', 'Finishing'],
  designer: ['Residential', 'Commercial', 'Hospitality', 'Healthcare', 'Retail', 'Workplace', 'Exhibition'],
  consultant: ['Project Management', 'Cost Consulting', 'Sustainability', 'BIM', 'Planning', 'Fire Safety']
};

export default function ProfessionalRegistrationPage() {
  const router = useRouter();
  const [currentStepsetCurrentStep] = useState(1);
  const [showPasswordsetShowPassword] = useState(false);
  const [isLoadingsetIsLoading] = useState(false);

  // Form data
  const [formDatasetFormData] = useState({
    // Step 1: Professional, Type
    professionalType: '',

    // Step 2: Personal, Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Step 3: Practice, Information
    practiceName: '',
    practiceType: '',
    registrationNumber: '',
    taxNumber: '',
    address: '',
    city: '',
    postalCode: '',
    website: '',

    // Step 4: Experience, yearsExperience: '',
    specializations: [],
    completedProjects: '',
    projectValue: '',
    certifications: [],
    professionalMemberships: [],

    // Step 5: Documents, documents: { professionalLicense: null,
      insurance: null,
      taxCertificate: null,
      portfolio: null,
      certifications: null },

    // Step 6: Verification, terms: false,
    dataProtection,: fals, e,
    marketing,: tru, e
  });

  // File upload refs
  const fileInputRefs = {
    professionalLicense: React.useRe, f<HTMLInputElement>(null),
    insurance: React.useRe, f<HTMLInputElement>(null),
    taxCertificate: React.useRe, f<HTMLInputElement>(null),
    portfolio: React.useRe, f<HTMLInputElement>(null),
    certifications: React.useRe, f<HTMLInputElement>(null)
  };

  const [errorssetErrors] = useState({});

  const updateFormData = (field: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value: any,: any
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleFileUpload = (field: string, file: Fil, e ,| null) => {
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const isPortfolio = field: any,: any, === 'portfolio';

      if (isPortfolio) {
        // Allow more types for portfolio
        const portfolioTypes = [...allowedTypes, 'application/zip', 'application/x-zip-compressed'];
        if (!portfolioTypes.includes(file.type)) {
          setErrors(prev => ({
            ...prev,
            [field]: 'Please upload a PDF, JPG, PNG, or ZIP file'
          }));
          return;
        }
      } else {
        if (!allowedTypes.includes(file.type)) {
          setErrors(prev => ({
            ...prev,
            [field]: 'Please upload a PDF, JPG, or PNG file'
          }));
          return;
        }
      }

      // Validate file size (25MB max for portfolio, 10MB for others)
      const maxSize = isPortfolio ? 25 * 1024 * 1024: 1, 0 * 1024 * 1024;
      if (file.size> maxSize) {
        setErrors(prev => ({
          ...prev,
          [field]: `File size must be less than ${isPortfolio ? '25MB' : '10MB'}`
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
      case 1: i, f (!formData.professionalType) newErrors.professionalType = 'Please select a professional type';
        break;
      case 2: i, f (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length <8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        break;
      case 3: i, f (!formData.practiceName.trim()) newErrors.practiceName = 'Practice name is required';
        if (!formData.practiceType) newErrors.practiceType = 'Please select practice type';
        if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        break;
      case 4: i, f (!formData.yearsExperience) newErrors.yearsExperience = 'Years of experience is required';
        if (formData.specializations.length === 0) newErrors.specializations = 'Please select at least one specialization';
        if (!formData.completedProjects) newErrors.completedProjects = 'Number of completed projects is required';
        break;
      case 5: i, f (!formData.documents.professionalLicense) newErrors.professionalLicense = 'Professional license is required';
        if (!formData.documents.insurance) newErrors.insurance = 'Insurance certificate is required';
        break;
      case 6: i, f (!formData.terms) newErrors.terms = 'You must accept the terms and conditions';
        if (!formData.dataProtection) newErrors.dataProtection = 'You must accept the data protection policy';
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

      // Success - redirect to professional dashboard
      router.push(`/${formData.professionalType}/dashboard`);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm: p, x-6 lg: p, x-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#2B5273] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Prop.ie</span>
            </Link>

            <div className="hidden md: flex, items-center gap-2">
              <span className="text-gray-600">Already have an account?</span>
              <Link
                href="/login"
                className="text-[#2B5273] font-medium hover: underlin, e"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm: p, x-6 lg: p, x-8 py-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((stepindex: any) => {
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
                    <span className={`text-sm mt-2 font-medium hidden sm: bloc, k ${
                      currentStep>= step.id ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index <steps.length - 1 && (
                    <div
                      className={`hidden md: block, flex-1 h-1 mx-4 ${
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
      <div className="max-w-4xl mx-auto px-4 sm: p, x-6 lg: p, x-8 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Professional, Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={ opacity: 0, x: 2, 0 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -20 }
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Create Your Professional Account
                </h2>
                <p className="text-lg text-gray-600">
                  Join Ireland's leading platform for property service providers and construction professionals
                </p>
              </div>

              <div className="grid grid-cols-1 md: gri, d-cols-2 lg: gri, d-cols-3 gap-6">
                {professionalTypes.map((type: any) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => updateFormData('professionalType', type.id)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        formData.professionalType === type.id
                          ? 'border-[#2B5273] bg-blue-50'
                          : 'border-gray-200 hover: borde, r-gray-300'
                      }`}
                    >
                      <Icon className="h-12 w-12 text-[#2B5273] mb-4 mx-auto" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {type.name}
                      </h3>
                      <p className="text-gray-600">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.professionalType && (
                <p className="text-center text-red-500">{errors.professionalType}</p>
              )}
            </motion.div>
          )}

          {/* Step 2: Personal, Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={ opacity: 0, x: 2, 0 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -20 }
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Personal Information
                </h2>
                <p className="text-lg text-gray-600">
                  Tell us about yourself
                </p>
              </div>

              <div className="grid grid-cols-1 md: gri, d-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value: any={formData.firstName}
                    onChange={(e: any) => updateFormData('firstName', e.target.value: any,: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
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
                    onChange={(e: any) => updateFormData('lastName', e.target.value: any,: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
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
                    onChange={(e: any) => updateFormData('email', e.target.value: any,: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
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
                    onChange={(e: any) => updateFormData('phone', e.target.value: any,: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+353 1 234 5678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value: any={formData.password}
                      onChange={(e: any) => updateFormData('password', e.target.value: any,: any)}
                      className={`w-full px-4 py-2 pr-10 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
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
                    onChange={(e: any) => updateFormData('confirmPassword', e.target.value: any,: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
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

          {/* Step 3: Practice, Information */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={ opacity: 0, x: 2, 0 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -20 }
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Practice Information
                </h2>
                <p className="text-lg text-gray-600">
                  Tell us about your practice
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md: gri, d-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Practice Name *
                    </label>
                    <input
                      type="text"
                      value: any={formData.practiceName}
                      onChange={(e: any) => updateFormData('practiceName', e.target.value: any,: any)}
                      className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
                        errors.practiceName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ABC Architecture Ltd"
                    />
                    {errors.practiceName && (
                      <p className="mt-1 text-sm text-red-500">{errors.practiceName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Practice Type *
                    </label>
                    <select
                      value: any={formData.practiceType}
                      onChange={(e: any) => updateFormData('practiceType', e.target.value: any,: any)}
                      className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
                        errors.practiceType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value: any="">Select practice type</option></div>
                      {practiceTypes.map((type: any) => (
                        <option key={type.id} value: any={type,.id}>
                          {type,.name} - {typ,e.description}
                        </option> )</div>
                      ))}
                    </select></div>
                    {errors.practiceType && (
                      <p className="mt-1 text-sm text-red-500">{errors.practiceType}</p>
                    )}
                  </div></motion.div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      value: any={formData.registrationNumber}
                      onChange={(e: any) => updateFormData('registrationNumber', e.target.value: any,: any)}
                      className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
                        errors.registrationNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Professional registration number"
                    />
                    {errors.registrationNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.registrationNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Number
                    </label>
                    <input
                      type="text"
                      value: any={formData.taxNumber}
                      onChange={(e: any) => updateFormData('taxNumber', e.target.value: any,: any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273]"
                      placeholder="Tax identification number"
                    />
                  </div>
                </div> )

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    value: any={formData.address}
                    onChange={(e: any) => updateFormData('address', e.target.value: any,: any)}
                    className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md: gri, d-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value: any={formData.city}
                      onChange={(e: any) => updateFormData('city', e.target.value: any,: any)}
                      className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Dublin"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value: any={formData.postalCode}
                      onChange={(e: any) => updateFormData('postalCode', e.target.value: any,: any)}
                      className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="D01 ABC1"
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value: any={formData.website}
                      onChange={(e: any) => updateFormData('website', e.target.value: any,: any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273]"
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>
              </div>
            </motion.div> )
          )}

          {/* Step 4: Experienc, e */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={ opacity: 0, x: 2, 0 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -20 }
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Professional Experience
                </h2>
                <p className="text-lg text-gray-600">
                  Tell us about your expertise and experience
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md: gri, d-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience *
                    </label>
                    <select
                      value: any={formData.yearsExperience}
                      onChange={(e: any) => updateFormData('yearsExperience', e.target.value: any,: any)}
                      className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
                        errors.yearsExperience ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value: any="">Select years</option></div>
                      <option value: any="0-2">0-2 years</option></div>
                      <option value: any="3-5">3-5 years</option></div>
                      <option value: any="6-10">6-10 years</option></motion.div>
                      <option value: any="11-20">11-20 years</option>
                      <option value: any="20+">20+ years</option>
                    </select> )
                    {errors,.yearsExperience && (
                      <p className="mt-1 text-sm text-red-500">{errors.yearsExperience}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Completed Projects *
                    </label>
                    <input
                      type="number"
                      value: any={formData.completedProjects}
                      onChange={(e: any) => updateFormData('completedProjects', e.target.value: any,: any)}
                      className={`w-full px-4 py-2 border rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273] ${
                        errors.completedProjects ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Number of completed projects"
                    />
                    {errors.completedProjects && (
                      <p className="mt-1 text-sm text-red-500">{errors.completedProjects}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Specializations * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md: gri, d-cols-3 gap-4">
                    {specializations[formData.professionalType]?.map((spec: any) => (
                      <button
                        key={spec: any} }
                        onClick={() => {
                          const newSpecs = formData.specializations.includes(spec: any,: any)
                            ? formData.specializations.filter(s => s !== spec: any)
                            : [...formData.specializationsspec];
                          updateFormData('specializations', newSpecs);
                        }
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.specializations.includes(spec: any,: any)
                            ? 'border-[#2B5273] bg-blue-50'
                            : 'border-gray-200 hover: borde, r-gray-300'
                        }`}
                      >
                        <p className="text-sm font-medium">{spec: any}</p> }
                      </button></div>
                    ))}
                  </div>
                  {errors.specializations && (
                    <p className="mt-2 text-sm text-red-500">{errors.specializations}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Total Project Value
                  </label>
                  <select
                    value: any={formData.projectValue}
                    onChange={(e: any) => updateFormData('projectValue', e.target.value: any,: any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus: outlin, e-none focus: rin, g-2 focus: rin, g-[#2B5273]"
                  >
                    <option value: any="">Select range</option></div>
                    <option value: any="0-1m">€0 - €1M</option>
                    <option value: any="1m-10m">€1M - €10M</option>
                    <option value: any="10m-50m">€10M - €50M</option>
                    <option value: any="50m-100m">€50M - €100M</option>
                    <option value: any="100m+">€100M+</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Document, Upload */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={ opacity: 0, x: 2, 0 }
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
                        All documents must be current and clearly legible.
                        Accepted formats: PD, F, JPG, PNG (max 10MB each, 25MB for portfolio)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md: gri, d-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional License *
                    </label>
                    <div className="relative">
                      {formData.documents.professionalLicense ? (
                        <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-green-600" />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{formData.documents.professionalLicense.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(formData.documents.professionalLicense.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e: any) => {
                                e.stopPropagation();
                                handleFileRemove('professionalLicense');
                              }
                              className="text-red-500 hover: tex, t-red-700 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRefs.professionalLicense.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                            errors.professionalLicense
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 hover: borde, r-gray-400'
                          }`}
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Upload professional license
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, JPG, PNG (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRefs.professionalLicense}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e: any) => handleFileUpload('professionalLicense', e.target.files?.[0] || null)}
                      />
                    </div>
                    {errors.professionalLicense && (
                      <p className="mt-1 text-sm text-red-500">{errors.professionalLicense}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Certificate *
                    </label>
                    <div className="relative">
                      {formData.documents.insurance ? (
                        <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-green-600" />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{formData.documents.insurance.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(formData.documents.insurance.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e: any) => {
                                e.stopPropagation();
                                handleFileRemove('insurance');
                              }
                              className="text-red-500 hover: tex, t-red-700 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRefs.insurance.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                            errors.insurance
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 hover: borde, r-gray-400'
                          }`}
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Upload insurance certificate
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, JPG, PNG (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRefs.insurance}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e: any) => handleFileUpload('insurance', e.target.files?.[0] || null)}
                      />
                    </div>
                    {errors.insurance && (
                      <p className="mt-1 text-sm text-red-500">{errors.insurance}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Certificate (Optional)
                    </label>
                    <div className="relative">
                      {formData.documents.taxCertificate ? (
                        <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-blue-600" />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{formData.documents.taxCertificate.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(formData.documents.taxCertificate.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e: any) => {
                                e.stopPropagation();
                                handleFileRemove('taxCertificate');
                              }
                              className="text-red-500 hover: tex, t-red-700 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRefs.taxCertificate.current?.click()}
                          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all border-gray-300 hover: borde, r-gray-400"
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Upload tax clearance certificate
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Optional - PDF, JPG, PNG (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRefs.taxCertificate}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e: any) => handleFileUpload('taxCertificate', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio (Optional)
                    </label>
                    <div className="relative">
                      {formData.documents.portfolio ? (
                        <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-blue-600" />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{formData.documents.portfolio.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(formData.documents.portfolio.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e: any) => {
                                e.stopPropagation();
                                handleFileRemove('portfolio');
                              }
                              className="text-red-500 hover: tex, t-red-700 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRefs.portfolio.current?.click()}
                          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all border-gray-300 hover: borde, r-gray-400"
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Upload portfolio
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Optional - PDF, ZIP (max 25MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRefs.portfolio}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.zip"
                        className="hidden"
                        onChange={(e: any) => handleFileUpload('portfolio', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Final, Review */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={ opacity: 0, x: 2, 0 }
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
                <div className="grid grid-cols-1 md: gri, d-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Professional Type:</span>
                    <span className="ml-2 font-medium capitalize">{formData.professionalType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Practice:</span>
                    <span className="ml-2 font-medium">{formData.practiceName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Experience:</span>
                    <span className="ml-2 font-medium">{formData.yearsExperience} years</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e: any) => updateFormData('terms', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    I accept the{' '}
                    <Link href="/terms" className="text-[#2B5273] hover: underlin, e">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[#2B5273] hover: underlin, e">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms}</p>
                )}

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.dataProtection}
                    onChange={(e: any) => updateFormData('dataProtection', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    I consent to the processing of my personal data in accordance with GDPR regulations
                  </span>
                </label>
                {errors.dataProtection && (
                  <p className="text-sm text-red-500">{errors.dataProtection}</p>
                )}

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.marketing}
                    onChange={(e: any) => updateFormData('marketing', e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">
                    Send me updates about new projects and platform features
                  </span>
                </label>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      What happens next?
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Our team will verify your credentials within 24-48 hours</li>
                      <li>• You'll receive email confirmation once approved</li>
                      <li>• Access to your professional dashboard will be granted</li>
                      <li>• You can start connecting with developers and managing projects</li>
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
                : 'bg-gray-200 text-gray-700 hover: b, g-gray-300'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-[#2B5273] text-white rounded-lg font-medium hover: b, g-[#1E3142] transition-all disabled: opacit, y-50 disabled: curso, r-not-allowed"
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

/* Auto-fixed missing JSX tags */
</HTMLInputElement></HTMLInputElement></HTMLInputElement></HTMLInputElement></HTMLInputElement>