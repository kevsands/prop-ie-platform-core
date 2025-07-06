'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function KYCVerificationPage() {
  const router = useRouter();
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
        // In a real implementation, this would call your API
        console.log('KYC Verification data:', formData);
        
        // Simulate API call
        setTimeout(() => {
          setStep(5); // Success step
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('KYC Verification error:', error);
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#2B5273]">KYC/AML Verification</h2>
            <div className="text-sm text-gray-500">
              Step {step} of {step > 4 ? 4 : 4}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-[#2B5273] h-2 rounded-full" 
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
            
            {/* Step 3: Address Verification would go here */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Verification</h3>
                <div className="space-y-4">
                  {/* Address form fields would go here */}
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
            
            {/* Step 4: Declaration would go here */}
            {step === 4 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Declaration</h3>
                <div className="space-y-4">
                  {/* Declaration form fields would go here */}
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
                        I confirm that all information provided is accurate and complete.
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
                      className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
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
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}