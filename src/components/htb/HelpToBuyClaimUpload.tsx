'use client';

import React, { useState, useRef } from 'react';
import { FiUpload, FiCheck, FiAlertTriangle, FiInfo, FiHelpCircle, FiX } from 'react-icons/fi';

interface HelpToBuyClaimProps {
  propertyId?: string;
  propertyPrice?: number;
  onSubmit?: (data: any) => void;
}

const HelpToBuyClaimUpload: React.FC<HelpToBuyClaimProps> = ({
  propertyId,
  propertyPrice = 0,
  onSubmit
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    claimCode: '',
    claimAmount: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ppsNumber: '',
    agreeTerms: false,
    uploadedFile: null as File | null,
    uploadedFileName: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({
          ...errors,
          uploadedFile: 'File size exceeds 10MB limit'
        });
        return;
      }
      
      // Check file type (PDF, JPG, PNG)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          uploadedFile: 'Only PDF, JPG, and PNG files are accepted'
        });
        return;
      }
      
      setFormData({
        ...formData,
        uploadedFile: file,
        uploadedFileName: file.name
      });
      
      // Clear error when file is uploaded
      if (errors.uploadedFile) {
        setErrors({
          ...errors,
          uploadedFile: ''
        });
      }
    }
  };
  
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (stepNumber === 1) {
      if (!formData.claimCode) {
        newErrors.claimCode = 'Please enter your Help-to-Buy claim code';
      } else if (!/^[A-Z0-9]{8,12}$/.test(formData.claimCode)) {
        newErrors.claimCode = 'Please enter a valid Help-to-Buy claim code';
      }
      
      if (!formData.claimAmount) {
        newErrors.claimAmount = 'Please enter your claim amount';
      } else if (isNaN(Number(formData.claimAmount))) {
        newErrors.claimAmount = 'Please enter a valid amount';
      } else if (Number(formData.claimAmount) <= 0) {
        newErrors.claimAmount = 'Amount must be greater than zero';
      } else if (propertyPrice && Number(formData.claimAmount) > propertyPrice * 0.1) {
        newErrors.claimAmount = `Amount cannot exceed 10% of property price (${formatCurrency(propertyPrice * 0.1)})`;
      } else if (Number(formData.claimAmount) > 30000) {
        newErrors.claimAmount = 'Amount cannot exceed €30,000';
      }
    } else if (stepNumber === 2) {
      if (!formData.firstName) {
        newErrors.firstName = 'Please enter your first name';
      }
      
      if (!formData.lastName) {
        newErrors.lastName = 'Please enter your last name';
      }
      
      if (!formData.email) {
        newErrors.email = 'Please enter your email address';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.phone) {
        newErrors.phone = 'Please enter your phone number';
      } else if (!/^(\+353|0)[1-9]\d{7,8}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid Irish phone number';
      }
      
      if (!formData.ppsNumber) {
        newErrors.ppsNumber = 'Please enter your PPS number';
      } else if (!/^\d{7}[A-Z]{1,2}$/.test(formData.ppsNumber)) {
        newErrors.ppsNumber = 'Please enter a valid PPS number (e.g., 1234567T)';
      }
    } else if (stepNumber === 3) {
      if (!formData.uploadedFile) {
        newErrors.uploadedFile = 'Please upload your Help-to-Buy confirmation document';
      }
      
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(step)) {
      setSubmissionStatus('submitting');
      
      // Simulate API call
      setTimeout(() => {
        try {
          if (onSubmit) {
            onSubmit({
              ...formData,
              submissionDate: new Date().toISOString(),
              status: 'pending'
            });
          }
          
          setSubmissionStatus('success');
          setStep(4);
        } catch (error) {
          setSubmissionStatus('error');
          setErrors({
            ...errors,
            submission: 'There was an error submitting your claim. Please try again.'
          });
        }
      }, 1500);
    }
  };
  
  const handleReset = () => {
    setFormData({
      claimCode: '',
      claimAmount: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      ppsNumber: '',
      agreeTerms: false,
      uploadedFile: null,
      uploadedFileName: ''
    });
    setStep(1);
    setSubmissionStatus('idle');
    setErrors({});
  };
  
  const toggleTooltip = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };
  
  // Format currency
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '€0';
    
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(numAmount);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-[#2B5273]">Help-to-Buy Claim</h2>
        <p className="text-gray-500">Upload your Help-to-Buy claim code to apply it to your property purchase</p>
      </div>
      
      {/* Help-to-Buy Info */}
      <div className="p-6 border-b bg-blue-50">
        <div className="flex items-start">
          <FiInfo className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} aria-hidden="true" />
          <div>
            <p className="text-blue-800 font-medium">About the Help-to-Buy Scheme</p>
            <p className="text-blue-600 text-sm mb-2">
              The Help-to-Buy (HTB) incentive is a tax rebate designed to help first-time buyers get the deposit needed to buy or build a new home.
            </p>
            <p className="text-blue-600 text-sm">
              You can claim back up to €30,000 or 10% of the property price (whichever is lower) in income tax and DIRT paid over the previous four years.
            </p>
          </div>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-[#2B5273] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <span className="text-sm font-medium">1</span>
            </div>
            <span className="text-xs mt-2 font-medium">Claim Details</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-[#2B5273]' : 'bg-gray-200'}`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-[#2B5273] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <span className="text-sm font-medium">2</span>
            </div>
            <span className="text-xs mt-2 font-medium">Personal Info</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-[#2B5273]' : 'bg-gray-200'}`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-[#2B5273] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <span className="text-sm font-medium">3</span>
            </div>
            <span className="text-xs mt-2 font-medium">Documentation</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step >= 4 ? 'bg-[#2B5273]' : 'bg-gray-200'}`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 4 ? 'bg-[#2B5273] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <span className="text-sm font-medium">4</span>
            </div>
            <span className="text-xs mt-2 font-medium">Complete</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Claim Details */}
        {step === 1 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#2B5273] mb-4">Help-to-Buy Claim Details</h3>
            
            <div className="mb-6">
              <label htmlFor="claimCode" className="block text-sm font-medium text-gray-700 mb-1">
                Help-to-Buy Claim Code *
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-500"
                  onClick={() => toggleTooltip('claimCode')}
                  aria-label="Help for claim code"
                >
                  <FiHelpCircle className="h-4 w-4" />
                </button>
              </label>
              {activeTooltip === 'claimCode' && (
                <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 mb-2 relative">
                  Your claim code is provided by Revenue after your Help-to-Buy application is approved.
                  This code should be in your approval email.
                  <button 
                    onClick={() => setActiveTooltip(null)} 
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Close tooltip"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
              <input
                type="text"
                id="claimCode"
                name="claimCode"
                value={formData.claimCode}
                onChange={handleChange}
                placeholder="e.g., HTB12345678"
                className={`w-full px-3 py-2 border ${
                  errors.claimCode ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                aria-invalid={errors.claimCode ? "true" : "false"}
                aria-describedby={errors.claimCode ? "claimCode-error" : undefined}
              />
              {errors.claimCode && (
                <p id="claimCode-error" className="mt-1 text-sm text-red-600">{errors.claimCode}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your claim code is provided by Revenue after your Help-to-Buy application is approved
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="claimAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Claim Amount *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input
                  type="text"
                  id="claimAmount"
                  name="claimAmount"
                  value={formData.claimAmount}
                  onChange={handleChange}
                  placeholder="e.g., 30000"
                  className={`w-full pl-8 pr-3 py-2 border ${
                    errors.claimAmount ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                  aria-invalid={errors.claimAmount ? "true" : "false"}
                  aria-describedby={errors.claimAmount ? "claimAmount-error" : undefined}
                />
              </div>
              {errors.claimAmount && (
                <p id="claimAmount-error" className="mt-1 text-sm text-red-600">{errors.claimAmount}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Maximum claim amount is €30,000 or 10% of the property price (€{(propertyPrice * 0.1).toLocaleString()}), whichever is lower
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Personal Information */}
        {step === 2 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#2B5273] mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                  aria-invalid={errors.lastName ? "true" : "false"}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 087 1234567"
                  className={`w-full px-3 py-2 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="ppsNumber" className="block text-sm font-medium text-gray-700 mb-1">
                PPS Number *
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-500"
                  onClick={() => toggleTooltip('ppsNumber')}
                  aria-label="Help for PPS number"
                >
                  <FiHelpCircle className="h-4 w-4" />
                </button>
              </label>
              {activeTooltip === 'ppsNumber' && (
                <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 mb-2 relative">
                  Your Personal Public Service Number is required to verify your Help-to-Buy claim.
                  It should be in the format of 7 digits followed by 1-2 letters (e.g., 1234567T).
                  <button 
                    onClick={() => setActiveTooltip(null)} 
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Close tooltip"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
              <input
                type="text"
                id="ppsNumber"
                name="ppsNumber"
                value={formData.ppsNumber}
                onChange={handleChange}
                placeholder="e.g., 1234567T"
                className={`w-full px-3 py-2 border ${
                  errors.ppsNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                aria-invalid={errors.ppsNumber ? "true" : "false"}
                aria-describedby={errors.ppsNumber ? "ppsNumber-error" : undefined}
              />
              {errors.ppsNumber && (
                <p id="ppsNumber-error" className="mt-1 text-sm text-red-600">{errors.ppsNumber}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your PPS Number is used to verify your Help-to-Buy claim with Revenue
              </p>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Previous Step
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Documentation */}
        {step === 3 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#2B5273] mb-4">Upload Documentation</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Help-to-Buy Approval Document *
              </label>
              
              <div className={`border-2 border-dashed rounded-md p-6 ${
                errors.uploadedFile ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
              } text-center`}>
                <input
                  type="file"
                  id="documentUpload"
                  name="documentUpload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  aria-invalid={errors.uploadedFile ? "true" : "false"}
                  aria-describedby={errors.uploadedFile ? "uploadedFile-error" : undefined}
                />
                
                {formData.uploadedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <FiCheck className="text-green-500 mr-2" size={20} />
                      <span className="text-sm font-medium">{formData.uploadedFileName}</span>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            uploadedFile: null,
                            uploadedFileName: ''
                          });
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FiUpload className="mx-auto text-gray-400" size={36} />
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Select document
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG or PNG (max 10MB)
                    </p>
                  </div>
                )}
              </div>
              
              {errors.uploadedFile && (
                <p id="uploadedFile-error" className="mt-1 text-sm text-red-600">{errors.uploadedFile}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Please upload your Help-to-Buy approval document from Revenue
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className={`h-4 w-4 text-[#2B5273] focus:ring-[#2B5273] ${
                      errors.agreeTerms ? 'border-red-500' : 'border-gray-300'
                    } rounded`}
                    aria-invalid={errors.agreeTerms ? "true" : "false"}
                    aria-describedby={errors.agreeTerms ? "agreeTerms-error" : undefined}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                    I confirm that the information provided is accurate and I authorize Prop.ie to process my Help-to-Buy claim with Revenue on my behalf. *
                  </label>
                  {errors.agreeTerms && (
                    <p id="agreeTerms-error" className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
                  )}
                </div>
              </div>
            </div>
            
            {errors.submission && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
                <FiAlertTriangle className="mr-3 flex-shrink-0 mt-0.5" />
                <div>{errors.submission}</div>
              </div>
            )}
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Previous Step
              </button>
              <button
                type="submit"
                disabled={submissionStatus === 'submitting'}
                className={`bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center ${
                  submissionStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submissionStatus === 'submitting' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Claim'
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheck className="text-green-600" size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Help-to-Buy Claim Submitted</h3>
            <p className="text-gray-600 mb-6">
              Your claim has been successfully submitted. We will verify your information with Revenue and apply the Help-to-Buy rebate to your property purchase.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6 max-w-md mx-auto text-left">
              <h4 className="font-semibold text-[#2B5273] mb-3">Claim Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Claim Code:</span>
                  <span className="font-medium">{formData.claimCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Claim Amount:</span>
                  <span className="font-medium">{formatCurrency(formData.claimAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applicant:</span>
                  <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submission Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('en-IE')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Pending Verification
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="bg-white border border-[#2B5273] text-[#2B5273] hover:bg-gray-50 mr-4 font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Submit Another Claim
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/dashboard'}
                className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default HelpToBuyClaimUpload;