'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Define types for form data
interface FormData {
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

// Define type for error state
interface FormErrors {
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  ppsNumber?: string;
  idNumber?: string;
  idExpiryDate?: string;
  idFrontImage?: string;
  idBackImage?: string;
  selfieImage?: string;
  addressLine1?: string;
  city?: string;
  county?: string;
  eircode?: string;
  addressProofImage?: string;
  termsAccepted?: string;
  [key: string]: string | undefined;
}

interface ComprehensiveKYCFormProps {
  onBack: () => void;
  onComplete?: (data: FormData) => void;
}

export default function ComprehensiveKYCForm({ onBack, onComplete }: ComprehensiveKYCFormProps) {
  const router = useRouter();
  const { user } = useEnterpriseAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  
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
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
      if (!formData.ppsNumber.trim()) newErrors.ppsNumber = 'PPS Number is required';
      else if (!/^\d{7}[A-Z]{1,2}$/.test(formData.ppsNumber)) {
        newErrors.ppsNumber = 'PPS Number must be in the format 1234567A or 1234567AB';
      }
    }
    
    if (step === 2) {
      if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
      if (!formData.idExpiryDate) newErrors.idExpiryDate = 'Expiry date is required';
      if (!formData.idFrontImage) newErrors.idFrontImage = 'Front image of ID is required';
      if (formData.idType !== 'passport' && !formData.idBackImage) {
        newErrors.idBackImage = 'Back image of ID is required';
      }
      if (!formData.selfieImage) newErrors.selfieImage = 'Selfie image is required';
    }
    
    if (step === 3) {
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.county.trim()) newErrors.county = 'County is required';
      if (!formData.eircode.trim()) newErrors.eircode = 'Eircode is required';
      if (!formData.addressProofImage) newErrors.addressProofImage = 'Proof of address is required';
    }
    
    if (step === 4) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and conditions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validateStep()) {
      setIsLoading(true);
      
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
        setStep(5); // Success step
        onComplete?.(formData);
        
      } catch (error) {
        console.error('KYC Verification error:', error);
        setErrors({ 
          submit: error instanceof Error ? error.message : 'Failed to submit verification' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Options
            </button>
            <div className="text-sm text-gray-500">
              Step {step} of {step > 4 ? 4 : 4}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-[#2B5273] text-center mb-8">KYC/AML Verification</h2>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-[#2B5273] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name (as it appears on ID)
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <select
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                        errors.nationality ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Nationality</option>
                      <option value="Irish">Irish</option>
                      <option value="British">British</option>
                      <option value="Other EU">Other EU</option>
                      <option value="Non-EU">Non-EU</option>
                    </select>
                    {errors.nationality && (
                      <p className="mt-1 text-sm text-red-500">{errors.nationality}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="ppsNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      PPS Number
                    </label>
                    <input
                      type="text"
                      id="ppsNumber"
                      name="ppsNumber"
                      value={formData.ppsNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 1234567A"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                        errors.ppsNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.ppsNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.ppsNumber}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Your Personal Public Service Number is required for tax purposes and Help-to-Buy verification.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Identity Verification */}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Identity Verification</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">
                      ID Type
                    </label>
                    <select
                      id="idType"
                      name="idType"
                      value={formData.idType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    >
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving License</option>
                      <option value="national_id">National ID Card</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      ID Number
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                        errors.idNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.idNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.idNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="idExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      ID Expiry Date
                    </label>
                    <input
                      type="date"
                      id="idExpiryDate"
                      name="idExpiryDate"
                      value={formData.idExpiryDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                        errors.idExpiryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.idExpiryDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.idExpiryDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="idFrontImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Front of ID
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="idFrontImage" className="relative cursor-pointer bg-white rounded-md font-medium text-[#2B5273] hover:text-[#1E3142] focus-within:outline-none">
                            <span>Upload a file</span>
                            <input 
                              id="idFrontImage" 
                              name="idFrontImage" 
                              type="file" 
                              accept="image/*"
                              onChange={handleInputChange}
                              className="sr-only" 
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    {formData.idFrontImage && (
                      <p className="mt-2 text-sm text-green-600">
                        File selected: {formData.idFrontImage.name}
                      </p>
                    )}
                    {errors.idFrontImage && (
                      <p className="mt-1 text-sm text-red-500">{errors.idFrontImage}</p>
                    )}
                  </div>
                  
                  {formData.idType !== 'passport' && (
                    <div>
                      <label htmlFor="idBackImage" className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Back of ID
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="idBackImage" className="relative cursor-pointer bg-white rounded-md font-medium text-[#2B5273] hover:text-[#1E3142] focus-within:outline-none">
                              <span>Upload a file</span>
                              <input 
                                id="idBackImage" 
                                name="idBackImage" 
                                type="file" 
                                accept="image/*"
                                onChange={handleInputChange}
                                className="sr-only" 
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                      {formData.idBackImage && (
                        <p className="mt-2 text-sm text-green-600">
                          File selected: {formData.idBackImage.name}
                        </p>
                      )}
                      {errors.idBackImage && (
                        <p className="mt-1 text-sm text-red-500">{errors.idBackImage}</p>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="selfieImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Selfie with ID
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="selfieImage" className="relative cursor-pointer bg-white rounded-md font-medium text-[#2B5273] hover:text-[#1E3142] focus-within:outline-none">
                            <span>Upload a file</span>
                            <input 
                              id="selfieImage" 
                              name="selfieImage" 
                              type="file" 
                              accept="image/*"
                              onChange={handleInputChange}
                              className="sr-only" 
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Take a selfie while holding your ID. PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    {formData.selfieImage && (
                      <p className="mt-2 text-sm text-green-600">
                        File selected: {formData.selfieImage.name}
                      </p>
                    )}
                    {errors.selfieImage && (
                      <p className="mt-1 text-sm text-red-500">{errors.selfieImage}</p>
                    )}
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Address Verification */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Verification</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                        errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.addressLine1 && (
                      <p className="mt-1 text-sm text-red-500">{errors.addressLine1}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
                        County
                      </label>
                      <select
                        id="county"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                          errors.county ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select County</option>
                        <option value="Antrim">Antrim</option>
                        <option value="Armagh">Armagh</option>
                        <option value="Carlow">Carlow</option>
                        <option value="Cavan">Cavan</option>
                        <option value="Clare">Clare</option>
                        <option value="Cork">Cork</option>
                        <option value="Derry">Derry</option>
                        <option value="Donegal">Donegal</option>
                        <option value="Down">Down</option>
                        <option value="Dublin">Dublin</option>
                        <option value="Fermanagh">Fermanagh</option>
                        <option value="Galway">Galway</option>
                        <option value="Kerry">Kerry</option>
                        <option value="Kildare">Kildare</option>
                        <option value="Kilkenny">Kilkenny</option>
                        <option value="Laois">Laois</option>
                        <option value="Leitrim">Leitrim</option>
                        <option value="Limerick">Limerick</option>
                        <option value="Longford">Longford</option>
                        <option value="Louth">Louth</option>
                        <option value="Mayo">Mayo</option>
                        <option value="Meath">Meath</option>
                        <option value="Monaghan">Monaghan</option>
                        <option value="Offaly">Offaly</option>
                        <option value="Roscommon">Roscommon</option>
                        <option value="Sligo">Sligo</option>
                        <option value="Tipperary">Tipperary</option>
                        <option value="Tyrone">Tyrone</option>
                        <option value="Waterford">Waterford</option>
                        <option value="Westmeath">Westmeath</option>
                        <option value="Wexford">Wexford</option>
                        <option value="Wicklow">Wicklow</option>
                      </select>
                      {errors.county && (
                        <p className="mt-1 text-sm text-red-500">{errors.county}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="eircode" className="block text-sm font-medium text-gray-700 mb-1">
                      Eircode
                    </label>
                    <input
                      type="text"
                      id="eircode"
                      name="eircode"
                      value={formData.eircode}
                      onChange={handleInputChange}
                      placeholder="e.g. D02 X285"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] ${
                        errors.eircode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.eircode && (
                      <p className="mt-1 text-sm text-red-500">{errors.eircode}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="addressProofType" className="block text-sm font-medium text-gray-700 mb-1">
                      Proof of Address Type
                    </label>
                    <select
                      id="addressProofType"
                      name="addressProofType"
                      value={formData.addressProofType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    >
                      <option value="utility_bill">Utility Bill</option>
                      <option value="bank_statement">Bank Statement</option>
                      <option value="government_letter">Government Letter</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="addressProofImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Proof of Address
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="addressProofImage" className="relative cursor-pointer bg-white rounded-md font-medium text-[#2B5273] hover:text-[#1E3142] focus-within:outline-none">
                            <span>Upload a file</span>
                            <input 
                              id="addressProofImage" 
                              name="addressProofImage" 
                              type="file" 
                              accept="image/*,.pdf"
                              onChange={handleInputChange}
                              className="sr-only" 
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Document must be less than 3 months old. PNG, JPG, PDF up to 10MB
                        </p>
                      </div>
                    </div>
                    {formData.addressProofImage && (
                      <p className="mt-2 text-sm text-green-600">
                        File selected: {formData.addressProofImage.name}
                      </p>
                    )}
                    {errors.addressProofImage && (
                      <p className="mt-1 text-sm text-red-500">{errors.addressProofImage}</p>
                    )}
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Declaration */}
            {step === 4 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Declaration</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Source of Funds
                    </label>
                    <select
                      name="sourceOfFunds"
                      value={formData.sourceOfFunds}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    >
                      <option value="employment">Employment</option>
                      <option value="savings">Savings</option>
                      <option value="investment">Investment</option>
                      <option value="inheritance">Inheritance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isPoliticallyExposed"
                          name="isPoliticallyExposed"
                          type="checkbox"
                          checked={formData.isPoliticallyExposed}
                          onChange={handleInputChange}
                          className="focus:ring-[#2B5273] h-4 w-4 text-[#2B5273] border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isPoliticallyExposed" className="font-medium text-gray-700">
                          I am a Politically Exposed Person (PEP)
                        </label>
                        <p className="text-gray-500">
                          This includes senior political figures, their family members, and close associates.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isHighRiskCountry"
                          name="isHighRiskCountry"
                          type="checkbox"
                          checked={formData.isHighRiskCountry}
                          onChange={handleInputChange}
                          className="focus:ring-[#2B5273] h-4 w-4 text-[#2B5273] border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isHighRiskCountry" className="font-medium text-gray-700">
                          I have connections to a high-risk country
                        </label>
                        <p className="text-gray-500">
                          Countries subject to sanctions or with poor AML controls.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="termsAccepted"
                        name="termsAccepted"
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="focus:ring-[#2B5273] h-4 w-4 text-[#2B5273] border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                        I accept the terms and conditions
                      </label>
                      <p className="text-gray-500">
                        I confirm that all information provided is accurate and complete. I consent to the collection and processing of my personal data for KYC/AML compliance purposes.
                      </p>
                    </div>
                  </div>
                  {errors.termsAccepted && (
                    <p className="mt-1 text-sm text-red-500">{errors.termsAccepted}</p>
                  )}
                  
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] disabled:opacity-50"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Verification'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 5: Success */}
            {step === 5 && (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Verification Submitted</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Thank you for submitting your KYC verification. We will review your application and get back to you within 24-48 hours.
                </p>
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => router.push('/buyer/dashboard')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                  >
                    Return to Dashboard
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={onBack}
                      className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                      Back to Verification Options
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}