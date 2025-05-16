'use client';

import React, { useState } from "react";

interface PurchaseStepProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  stepDescription: string;
  children: React.ReactNode;
}

const PurchaseStep: React.FC<PurchaseStepProps> = ({
  currentStep,
  totalSteps,
  stepName,
  stepDescription,
  children,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{stepName}</h2>
            <p className="mt-1 text-sm text-gray-500">{stepDescription}</p>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

interface PurchaseFlowProps {
  propertyId: string;
  propertyName: string;
}

const PurchaseFlow: React.FC<PurchaseFlowProps> = ({
  propertyId,
  propertyName,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PurchaseStep
            currentStep={1}
            totalSteps={totalSteps}
            stepName="Property Selection"
            stepDescription="Confirm your property selection and review details"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Selected Property
                </h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium">{propertyName}</h4>
                  <p className="text-sm text-gray-500">
                    3 Bedroom Semi-Detached House
                  </p>
                  <p className="text-sm text-gray-500">
                    Fitzgerald Gardens, Dublin
                  </p>
                  <p className="mt-2 text-lg font-bold">€385,000</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Property Features
                </h3>
                <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <li className="bg-gray-50 p-3 rounded-md flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">3 Bedrooms</span>
                  </li>
                  <li className="bg-gray-50 p-3 rounded-md flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">2.5 Bathrooms</span>
                  </li>
                  <li className="bg-gray-50 p-3 rounded-md flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">120 m² Living Area</span>
                  </li>
                  <li className="bg-gray-50 p-3 rounded-md flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">A-Rated Energy Efficiency</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue to Booking
                </button>
              </div>
            </div>
          </PurchaseStep>
        );
      case 2:
        return (
          <PurchaseStep
            currentStep={2}
            totalSteps={totalSteps}
            stepName="Booking Deposit"
            stepDescription="Secure your property with a booking deposit"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Booking Details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  To secure your property, a booking deposit of €10,000 is
                  required. This deposit is fully refundable if you decide not
                  to proceed with the purchase.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium">Payment Summary</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Property Price
                    </span>
                    <span className="text-sm font-medium">€385,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Booking Deposit
                    </span>
                    <span className="text-sm font-medium">€10,000</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="text-sm font-medium">
                      Balance Due at Closing
                    </span>
                    <span className="text-sm font-medium">€375,000</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Payment Method
                </h3>
                <div className="mt-2">
                  <div className="flex items-center">
                    <input
                      id="payment-bank-transfer"
                      name="payment-method"
                      type="radio"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="payment-bank-transfer"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Bank Transfer
                    </label>
                  </div>
                  <div className="mt-2 pl-7 text-sm text-gray-500">
                    <p>
                      Please transfer the booking deposit to the following
                      account:
                    </p>
                    <p className="mt-1">Bank: AIB</p>
                    <p>Account Name: Prop.ie Developments Ltd</p>
                    <p>IBAN: IE29AIBK93115212345678</p>
                    <p>
                      Reference: {propertyId}-{propertyName.replace(/\s+/g, "")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </PurchaseStep>
        );
      case 3:
        return (
          <PurchaseStep
            currentStep={3}
            totalSteps={totalSteps}
            stepName="Document Submission"
            stepDescription="Upload required documents for your purchase"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Required Documents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please upload the following documents to proceed with your
                  purchase. All documents must be in PDF format.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium">Proof of Identity</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Passport or Driver's License
                  </p>
                  <div className="mt-2">
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Upload ID
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium">Proof of Address</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Utility bill or bank statement (less than 3 months old)
                  </p>
                  <div className="mt-2">
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Upload Proof of Address
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium">Help-to-Buy Approval</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    HTB approval letter from Revenue
                  </p>
                  <div className="mt-2">
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Upload HTB Approval
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium">
                    Mortgage Approval in Principle
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Approval letter from your mortgage provider
                  </p>
                  <div className="mt-2">
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Upload Mortgage Approval
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue
                </button>
              </div>
            </div>
          </PurchaseStep>
        );
      case 4:
        return (
          <PurchaseStep
            currentStep={4}
            totalSteps={totalSteps}
            stepName="Legal Compliance"
            stepDescription="Review and accept legal documents"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Legal Documents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please review the following legal documents carefully. You
                  will need to accept these documents to proceed with your
                  purchase.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Contract for Sale</h4>
                      <p className="text-sm text-gray-500">
                        Standard contract for the purchase of your property
                      </p>
                    </div>
                    <div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Building Specifications</h4>
                      <p className="text-sm text-gray-500">
                        Detailed specifications of your property
                      </p>
                    </div>
                    <div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Planning Permission</h4>
                      <p className="text-sm text-gray-500">
                        Planning permission documents for the development
                      </p>
                    </div>
                    <div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="legal-acceptance"
                      name="legal-acceptance"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="legal-acceptance"
                      className="font-medium text-gray-700"
                    >
                      I have read and accept all legal documents
                    </label>
                    <p className="text-gray-500">
                      By checking this box, you confirm that you have read,
                      understood, and accept all the legal documents related to
                      this property purchase.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Accept and Continue
                </button>
              </div>
            </div>
          </PurchaseStep>
        );
      case 5:
        return (
          <PurchaseStep
            currentStep={5}
            totalSteps={totalSteps}
            stepName="Confirmation"
            stepDescription="Review and confirm your purchase"
          >
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Congratulations! Your property purchase is now in
                      progress.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Purchase Summary
                </h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Property</span>
                      <span className="text-sm font-medium">
                        {propertyName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Price</span>
                      <span className="text-sm font-medium">€385,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Booking Deposit
                      </span>
                      <span className="text-sm font-medium">€10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Booking Date
                      </span>
                      <span className="text-sm font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Estimated Completion
                      </span>
                      <span className="text-sm font-medium">
                        September 2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Next Steps
                </h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-sm">
                      Our team will review your documents and booking deposit
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-sm">
                      You will receive a confirmation email with your booking
                      details
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-sm">
                      Your solicitor will be contacted to proceed with the legal
                      process
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-sm">
                      You can track the progress of your purchase in your
                      dashboard
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Go to Dashboard
                </button>
              </div>
            </div>
          </PurchaseStep>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            ></div>
          </div>
        </div>
      </div>

      {renderStepContent()}
    </div>
  );
};

export default PurchaseFlow;
