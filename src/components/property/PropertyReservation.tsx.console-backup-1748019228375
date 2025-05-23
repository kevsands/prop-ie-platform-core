'use client';

import React, { useState } from 'react';
import { FiHome, FiCalendar, FiClock, FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';

interface PropertyReservationProps {
  propertyId: string;
  propertyName: string;
  propertyType: string;
  propertyPrice: number;
  propertyImage: string;
  onReserve?: (reservationData: any) => void;
}

const PropertyReservation: React.FC<PropertyReservationProps> = ({
  propertyId,
  propertyName,
  propertyType,
  propertyPrice,
  propertyImage,
  onReserve
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    preferredViewingDate: '',
    preferredViewingTime: '',
    additionalNotes: '',
    agreeTerms: false,
    financingMethod: 'mortgage',
    hasPreApproval: false,
    preApprovalAmount: '',
    lenderName: '',
    solicitorName: '',
    solicitorEmail: '',
    solicitorPhone: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reservationStatus, setReservationStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
  
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (stepNumber === 1) {
      if (!formData.preferredViewingDate) {
        newErrors.preferredViewingDate = 'Please select a preferred viewing date';
      }
      if (!formData.preferredViewingTime) {
        newErrors.preferredViewingTime = 'Please select a preferred viewing time';
      }
    } else if (stepNumber === 2) {
      if (formData.financingMethod === 'mortgage' && formData.hasPreApproval) {
        if (!formData.preApprovalAmount) {
          newErrors.preApprovalAmount = 'Please enter your pre-approval amount';
        } else if (isNaN(Number(formData.preApprovalAmount))) {
          newErrors.preApprovalAmount = 'Please enter a valid amount';
        }
        
        if (!formData.lenderName) {
          newErrors.lenderName = 'Please enter your lender name';
        }
      }
    } else if (stepNumber === 3) {
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the reservation terms';
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
      setReservationStatus('submitting');
      
      // Simulate API call
      setTimeout(() => {
        if (onReserve) {
          onReserve({
            propertyId,
            ...formData,
            reservationDate: new Date().toISOString(),
            status: 'pending'
          });
        }
        
        setReservationStatus('success');
        setStep(4);
      }, 1500);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-[#2B5273]">Reserve Your Property</h2>
        <p className="text-gray-500">Complete this form to reserve {propertyName}</p>
      </div>
      
      {/* Property Summary */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <img
              src={propertyImage}
              alt={propertyName}
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="w-full md:w-2/3 md:pl-6">
            <h3 className="text-xl font-semibold text-[#2B5273]">{propertyName}</h3>
            <p className="text-gray-600 mb-2">{propertyType}</p>
            <p className="text-2xl font-bold text-[#1E3142] mb-4">
              {formatCurrency(propertyPrice)}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start">
                {FiInfo({ className: "text-blue-500 mt-1 mr-3 flex-shrink-0" })}
                <div>
                  <p className="text-blue-800 font-medium">Reservation Process</p>
                  <p className="text-blue-600 text-sm">
                    This is a no-obligation reservation request. Once submitted, our team will review your request and contact you within 24 hours to arrange a viewing or discuss next steps.
                  </p>
                </div>
              </div>
            </div>
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
              {FiCalendar({ className: "h-5 w-5" })}
            </div>
            <span className="text-xs mt-2 font-medium">Viewing</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-[#2B5273]' : 'bg-gray-200'}`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-[#2B5273] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {FiHome({ className: "h-5 w-5" })}
            </div>
            <span className="text-xs mt-2 font-medium">Financing</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-[#2B5273]' : 'bg-gray-200'}`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-[#2B5273] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {FiCheck({ className: "h-5 w-5" })}
            </div>
            <span className="text-xs mt-2 font-medium">Confirmation</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step >= 4 ? 'bg-[#2B5273]' : 'bg-gray-200'}`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 4 ? 'bg-[#2B5273] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {FiCheck({ className: "h-5 w-5" })}
            </div>
            <span className="text-xs mt-2 font-medium">Complete</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Viewing Preferences */}
        {step === 1 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#2B5273] mb-4">Viewing Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="preferredViewingDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Viewing Date *
                </label>
                <input
                  type="date"
                  id="preferredViewingDate"
                  name="preferredViewingDate"
                  value={formData.preferredViewingDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border ${
                    errors.preferredViewingDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                />
                {errors.preferredViewingDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.preferredViewingDate}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="preferredViewingTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Viewing Time *
                </label>
                <select
                  id="preferredViewingTime"
                  name="preferredViewingTime"
                  value={formData.preferredViewingTime}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.preferredViewingTime ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
                {errors.preferredViewingTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.preferredViewingTime}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                placeholder="Any specific questions or requirements for your viewing?"
              ></textarea>
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
        
        {/* Step 2: Financing Information */}
        {step === 2 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#2B5273] mb-4">Financing Information</h3>
            
            <div className="mb-6">
              <label htmlFor="financingMethod" className="block text-sm font-medium text-gray-700 mb-1">
                How do you plan to finance this purchase?
              </label>
              <select
                id="financingMethod"
                name="financingMethod"
                value={formData.financingMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              >
                <option value="mortgage">Mortgage</option>
                <option value="cash">Cash Purchase</option>
                <option value="help-to-buy">Help-to-Buy Scheme</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {formData.financingMethod === 'mortgage' && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="hasPreApproval"
                    name="hasPreApproval"
                    checked={formData.hasPreApproval}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#2B5273] focus:ring-[#2B5273] border-gray-300 rounded"
                  />
                  <label htmlFor="hasPreApproval" className="ml-2 block text-sm text-gray-700">
                    I have mortgage pre-approval
                  </label>
                </div>
                
                {formData.hasPreApproval && (
                  <div className="pl-6 border-l-2 border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <label htmlFor="preApprovalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                          Pre-Approval Amount *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">€</span>
                          </div>
                          <input
                            type="text"
                            id="preApprovalAmount"
                            name="preApprovalAmount"
                            value={formData.preApprovalAmount}
                            onChange={handleChange}
                            className={`w-full pl-8 pr-3 py-2 border ${
                              errors.preApprovalAmount ? 'border-red-500' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                            placeholder="350,000"
                          />
                        </div>
                        {errors.preApprovalAmount && (
                          <p className="mt-1 text-sm text-red-600">{errors.preApprovalAmount}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-1">
                          Lender Name *
                        </label>
                        <input
                          type="text"
                          id="lenderName"
                          name="lenderName"
                          value={formData.lenderName}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${
                            errors.lenderName ? 'border-red-500' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                          placeholder="e.g., Bank of Ireland"
                        />
                        {errors.lenderName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lenderName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Solicitor Information (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="solicitorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Solicitor Name
                  </label>
                  <input
                    type="text"
                    id="solicitorName"
                    name="solicitorName"
                    value={formData.solicitorName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  />
                </div>
                
                <div>
                  <label htmlFor="solicitorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Solicitor Email
                  </label>
                  <input
                    type="email"
                    id="solicitorEmail"
                    name="solicitorEmail"
                    value={formData.solicitorEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
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
        
        {/* Step 3: Terms and Submit */}
        {step === 3 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#2B5273] mb-4">Confirm Reservation</h3>
            
            <div className="p-4 border border-gray-200 rounded-md mb-6 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Reservation Summary</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Property:</span>
                  <span className="font-medium text-gray-900">{propertyName}</span>
                </li>
                <li className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(propertyPrice)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Viewing Date:</span>
                  <span className="font-medium text-gray-900">{formData.preferredViewingDate}</span>
                </li>
                <li className="flex justify-between">
                  <span>Viewing Time:</span>
                  <span className="font-medium text-gray-900">{formData.preferredViewingTime}</span>
                </li>
                <li className="flex justify-between">
                  <span>Financing:</span>
                  <span className="font-medium text-gray-900">{
                    formData.financingMethod === 'mortgage' ? 'Mortgage' :
                    formData.financingMethod === 'cash' ? 'Cash Purchase' :
                    formData.financingMethod === 'help-to-buy' ? 'Help-to-Buy Scheme' : 'Other'
                  }</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  {FiAlertTriangle({ className: "text-yellow-400 h-5 w-5 mr-3 flex-shrink-0" })}
                  <div>
                    <p className="text-sm text-yellow-700">
                      This reservation request is subject to availability and does not constitute a legally binding agreement. A formal contract will be provided if your reservation is accepted.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#2B5273] focus:ring-[#2B5273] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="font-medium text-gray-700">I agree to the terms and conditions *</label>
                  <p className="text-gray-500">By checking this box, you agree to our <a href="#" className="text-[#2B5273] hover:underline">Privacy Policy</a> and <a href="#" className="text-[#2B5273] hover:underline">Terms of Service</a>.</p>
                  {errors.agreeTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Previous Step
              </button>
              <button
                type="submit"
                disabled={reservationStatus === 'submitting'}
                className={`${
                  reservationStatus === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2B5273] hover:bg-[#1E3142]'
                } text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center`}
              >
                {reservationStatus === 'submitting' ? (
                  <>
                    {FiClock({ className: "animate-spin -ml-1 mr-2 h-4 w-4" })}
                    Processing...
                  </>
                ) : 'Submit Reservation'}
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Success */}
        {step === 4 && (
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              {FiCheck({ className: "h-10 w-10 text-green-600" })}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reservation Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your reservation request for {propertyName}. We'll contact you within 24 hours to confirm your viewing appointment.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              A confirmation email has been sent to your registered email address.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => window.location.href = '/properties'}
                className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Browse More Properties
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PropertyReservation;