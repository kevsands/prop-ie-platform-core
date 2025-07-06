"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useHTB } from "@/context/HTBContext";
// Update this import path to match where your HTBStepIndicator component actually lives
import { HTBStepIndicator } from "@/components/htb/shared/HTBStepIndicator";
import { HTBClaimStatus, HTBClaim } from "@/types/htb";
/**
 * Main component that guides buyers through the HTB process
 */
export const HTBClaimProcess: React.FC<{ propertyId?: string; propertyPrice?: number }> = ({
    propertyId = "",
    propertyPrice = 0,
  }) => {
    const router = useRouter();
    const { selectedBuyerClaim, createNewClaim, fetchClaimById, updateAccessCode } = useHTB();
    
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
      propertyId: propertyId,
      requestedAmount: Math.min(propertyPrice * 0.1, 30000), // 10% of price or €30k max
      accessCode: "",
      accessCodeExpiryDate: "",
      documentFile: null as File | null,
    });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        documentFile: e.target.files[0],
      });
    }
  };
  
  const handleCreateClaim = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate
      if (!formData.propertyId) {
        setError("Please select a property");
        setIsLoading(false);
        return;
      }
      
      // Create new claim with the correct data format
      const claim = await createNewClaim({
        propertyId: formData.propertyId,
        requestedAmount: formData.requestedAmount
      });
      
      // Move to next step
      setStep(2);
      
      // Force reload of claim
      await fetchClaimById(claim.id, "buyer");
    } catch (err) {
      setError("Failed to create HTB claim. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitAccessCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate
      if (!formData.accessCode) {
        setError("Please enter your HTB access code");
        setIsLoading(false);
        return;
      }
      
      if (!selectedBuyerClaim) {
        setError("No active HTB claim found");
        setIsLoading(false);
        return;
      }
      
      // Parse date or use current date + 60 days if not provided
      const expiryDate = formData.accessCodeExpiryDate
        ? new Date(formData.accessCodeExpiryDate)
        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
      
      // Update claim with access code (removing the document file parameter)
      await updateAccessCode(
        selectedBuyerClaim.id,
        formData.accessCode,
        expiryDate
      );
      
      // Move to next step
      setStep(3);
      
      // Force reload of claim
      await fetchClaimById(selectedBuyerClaim.id, "buyer");
    } catch (err) {
      setError("Failed to submit access code. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 1: Initiate Help-to-Buy Application</h2>
            <p className="text-gray-600">
              Start your Help-to-Buy application process. You'll need to apply to Revenue separately
              to receive your HTB access code.
            </p>
            
            {propertyId ? (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium">
                  You're applying for Help-to-Buy for property ID: {propertyId}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Property Price: €{propertyPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Property
                </label>
                <select
                  id="propertyId"
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a property --</option>
                  {/* Property options would be populated here */}
                  <option value="prop1">Maple Heights - Unit 101</option>
                  <option value="prop2">Maple Heights - Unit 102</option>
                </select>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-700 mb-1">
                HTB Amount (€)
              </label>
              <input
                type="number"
                id="requestedAmount"
                name="requestedAmount"
                value={formData.requestedAmount}
                onChange={handleInputChange}
                min={0}
                max={30000}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: €30,000 or 10% of property price, whichever is lower
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md mb-6">
              <h3 className="text-sm font-medium text-yellow-800">Important Information</h3>
              <p className="text-sm text-yellow-700 mt-1">
                After initiating your HTB claim here, you must complete a separate application on the
                Revenue website to receive your HTB access code. You will then submit this code in the next step.
              </p>
              <a
                href="https://www.revenue.ie/en/property/help-to-buy-incentive/index.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
              >
                Visit Revenue Website →
              </a>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleCreateClaim}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Continue to Revenue Application"}
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 2: Submit Revenue HTB Access Code</h2>
            
            <div className="bg-green-50 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    HTB application initiated successfully!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Please complete your application on the Revenue website to receive your access code.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600">
              Once you've completed your application on the Revenue website and received your access code,
              enter it below to continue with your HTB claim.
            </p>
            
            <div className="mb-4">
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
                HTB Access Code *
              </label>
              <input
                type="text"
                id="accessCode"
                name="accessCode"
                value={formData.accessCode}
                onChange={handleInputChange}
                placeholder="e.g., HTB1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the HTB access code you received from Revenue
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="accessCodeExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Access Code Expiry Date
              </label>
              <input
                type="date"
                id="accessCodeExpiryDate"
                name="accessCodeExpiryDate"
                value={formData.accessCodeExpiryDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                If not provided, we'll assume 60 days from today
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="documentFile" className="block text-sm font-medium text-gray-700 mb-1">
                Revenue Confirmation Document (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                </div>
              </div>
              {formData.documentFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {formData.documentFile.name}
                </p>
              )}
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back
              </button>
              <button
                onClick={handleSubmitAccessCode}
                disabled={isLoading || !formData.accessCode}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit Access Code"}
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 3: HTB Claim Status</h2>
            
            <div className="bg-green-50 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Access code submitted successfully!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Your HTB claim is now with the developer for processing.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
             <h3 className="text-lg leading-6 font-medium text-gray-900">HTB Claim Details</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Current status and information about your Help-to-Buy claim.
                </p>
              </div>
              
              {selectedBuyerClaim && (
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Property</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedBuyerClaim.propertyId}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
  {selectedBuyerClaim.status.replace(/_/g, " ")}
</span>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Requested Amount</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        €{selectedBuyerClaim.requestedAmount.toLocaleString()}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Access Code</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedBuyerClaim.accessCode}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Application Date</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {new Date(selectedBuyerClaim.applicationDate).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {new Date(selectedBuyerClaim.lastUpdatedDate).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
              <p className="text-sm text-blue-700 mt-1">
                The developer will now process your HTB claim with Revenue. You'll be notified when
                the funds are drawn down and applied to your deposit. You can check the status of
                your claim at any time on this page.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => router.push("/buyer/htb/status")}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Claim Status
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Help-to-Buy Application</h1>
      
      <HTBStepIndicator
        steps={[
          { label: "Start Application", status: step >= 1 ? "complete" : "upcoming" },
          { label: "Submit Access Code", status: step >= 2 ? "complete" : "upcoming" },
          { label: "Track Status", status: step >= 3 ? "complete" : "upcoming" },
        ]}
        currentStep={step}
      />
      
      <div className="mt-8 bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        {getStepContent()}
      </div>
    </div>
  );
};
