'use client';

import React, { useState } from 'react';
import { useHTB, HTBClaim, HTBClaimStatus } from '@/context/HTBContext';
import { Calculator, CheckCircle, AlertCircle, ArrowRight, Info, EuroIcon, FileText, X } from 'lucide-react';

export interface HTBCalculatorProps {
  onClaimCreated?: (claim: HTBClaim) => void;
}

export const HTBCalculatorApp: React.FC<HTBCalculatorProps> = ({ onClaimCreated }) => {
  const { createNewClaim, isLoading, error } = useHTB();
  const [showApplicationsetShowApplication] = useState(false);
  const [calculatorDatasetCalculatorData] = useState({
    propertyPrice: '',
    depositAvailable: '',
    annualIncome: '',
    incomeTaxPaid: '',
    taxYears: 4
  });

  const [applicationDatasetApplicationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ppsNumber: '',
    propertyAddress: '',
    propertyId: '',
    acceptTerms: false
  });

  const [calculationResultssetCalculationResults] = useState<{
    eligible: boolean;
    maxHTB: number;
    depositNeeded: number;
    totalDeposit: number;
    affordability: number;
    lti: number;
    messages: string[];
  } | null>(null);

  const calculateHTB = () => {
    const price = parseFloat(calculatorData.propertyPrice) || 0;
    const deposit = parseFloat(calculatorData.depositAvailable) || 0;
    const income = parseFloat(calculatorData.annualIncome) || 0;
    const taxPaid = parseFloat(calculatorData.incomeTaxPaid) || 0;

    // HTB calculation rules
    const maxHTBAmount = 30000;
    const maxHTBPercentage = 0.1; // 10% of purchase price
    const maxPropertyValue = 500000;
    const depositRequired = price * 0.1; // 10% deposit for FTB

    // Calculate potential HTB
    const htbFromPrice = price * maxHTBPercentage;
    const htbFromTax = taxPaid * calculatorData.taxYears;
    const potentialHTB = Math.min(htbFromPricehtbFromTaxmaxHTBAmount);

    // Check eligibility
    const messages: string[] = [];
    const eligible = price <= maxPropertyValue;

    if (!eligible) {
      messages.push(`Property price exceeds the €${maxPropertyValue.toLocaleString()} limit for HTB.`);
    }

    if (htbFromTax <htbFromPrice) {
      messages.push(`HTB limited to €${htbFromTax.toLocaleString()} based on tax paid over ${calculatorData.taxYears} years.`);
    }

    if (potentialHTB === maxHTBAmount) {
      messages.push(`HTB capped at the maximum of €${maxHTBAmount.toLocaleString()}.`);
    }

    // Calculate affordability
    const lti = price / income;
    const maxLTI = 3.5;
    const affordability = income * maxLTI;

    if (lti> maxLTI) {
      messages.push(`Loan-to-income ratio of ${lti.toFixed(1)} exceeds the ${maxLTI} limit.`);
    }

    const totalDeposit = deposit + (eligible ? potentialHTB : 0);

    setCalculationResults({
      eligible,
      maxHTB: eligible ? potentialHTB : 0,
      depositNeeded: depositRequired,
      totalDeposit,
      affordability,
      lti,
      messages
    });
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!calculationResults || !calculationResults.eligible) {
      alert('Please complete the calculator to verify eligibility first.');
      return;
    }

    try {
      const claim = await createNewClaim({
        propertyId: applicationData.propertyId,
        requestedAmount: calculationResults.maxHTB,
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        email: applicationData.email,
        phone: applicationData.phone,
        ppsNumber: applicationData.ppsNumber,
        propertyAddress: applicationData.propertyAddress,
        claimAmount: calculationResults.maxHTB
      });

      if (onClaimCreated) {
        onClaimCreated(claim);
      }

      // Reset form
      setShowApplication(false);
      setApplicationData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        ppsNumber: '',
        propertyAddress: '',
        propertyId: '',
        acceptTerms: false
      });

      alert('HTB application submitted successfully! Check the progress tab to track your claim.');
    } catch (err) {

    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {!showApplication ? (
        <>
          {/* Calculator Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Calculator className="text-blue-600 mr-3" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Help-to-Buy Calculator</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Calculator Form */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Enter Your Details</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Price
                    </label>
                    <div className="relative">
                      <EuroIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={calculatorData.propertyPrice}
                        onChange={(e: any) => setCalculatorData({ ...calculatorData, propertyPrice: e.target.value })}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="400,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Deposit Available
                    </label>
                    <div className="relative">
                      <EuroIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={calculatorData.depositAvailable}
                        onChange={(e: any) => setCalculatorData({ ...calculatorData, depositAvailable: e.target.value })}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="20,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Income (Combined if joint application)
                    </label>
                    <div className="relative">
                      <EuroIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={calculatorData.annualIncome}
                        onChange={(e: any) => setCalculatorData({ ...calculatorData, annualIncome: e.target.value })}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="80,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Income Tax Paid (Average)
                    </label>
                    <div className="relative">
                      <EuroIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={calculatorData.incomeTaxPaid}
                        onChange={(e: any) => setCalculatorData({ ...calculatorData, incomeTaxPaid: e.target.value })}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="15,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Years to Include
                    </label>
                    <select
                      value={calculatorData.taxYears}
                      onChange={(e: any) => setCalculatorData({ ...calculatorData, taxYears: parseInt(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={1}>1 Year</option>
                      <option value={2}>2 Years</option>
                      <option value={3}>3 Years</option>
                      <option value={4}>4 Years</option>
                    </select>
                  </div>

                  <button
                    onClick={calculateHTB}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
                    Calculate HTB Benefits
                  </button>
                </div>
              </div>

              {/* Results Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Your HTB Benefits</h3>

                {calculationResults ? (
                  <div className="space-y-4">
                    {/* Eligibility Status */}
                    <div className={`p-4 rounded-lg ${calculationResults.eligible ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-center">
                        {calculationResults.eligible ? (
                          <CheckCircle className="text-green-600 mr-2" size={24} />
                        ) : (
                          <AlertCircle className="text-red-600 mr-2" size={24} />
                        )}
                        <span className={`font-medium ${calculationResults.eligible ? 'text-green-800' : 'text-red-800'}`}>
                          {calculationResults.eligible ? 'You are eligible for HTB!' : 'Not eligible for HTB'}
                        </span>
                      </div>
                    </div>

                    {/* Key Results */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-3">Your Numbers</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Maximum HTB Amount:</span>
                          <span className="font-semibold text-blue-900">€{calculationResults.maxHTB.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Total Deposit (inc. HTB):</span>
                          <span className="font-semibold text-green-600">€{calculationResults.totalDeposit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Deposit Required (10%):</span>
                          <span className="font-semibold">€{calculationResults.depositNeeded.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Max Affordability (3.5x):</span>
                          <span className="font-semibold">€{calculationResults.affordability.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    {calculationResults.messages.length> 0 && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <Info className="text-yellow-600 mr-2 mt-0.5" size={20} />
                          <div>
                            <h4 className="font-semibold text-yellow-900 mb-1">Important Notes</h4>
                            <ul className="space-y-1">
                              {calculationResults.messages.map((msgidx: any) => (
                                <li key={idx} className="text-sm text-yellow-800">{msg}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {calculationResults.eligible && (
                      <button
                        onClick={() => setShowApplication(true)}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center"
                      >
                        Apply for HTB
                        <ArrowRight className="ml-2" size={20} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <Calculator className="text-gray-400 mx-auto mb-4" size={48} />
                    <p className="text-gray-600">Enter your details to calculate your HTB benefits</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How Help-to-Buy Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-1">1. Check Eligibility</h4>
                <p>Use the calculator to determine your maximum HTB benefit based on income tax paid and property price.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">2. Apply Online</h4>
                <p>Submit your application through Prop.ie with all required documents and information.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">3. Receive Funds</h4>
                <p>Once approved, HTB funds are applied directly to your deposit at contract signing.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Application Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="text-blue-600 mr-3" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">HTB Application</h2>
              </div>
              <button
                onClick={() => setShowApplication(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {calculationResults && (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-green-800">
                  You're applying for <span className="font-semibold">€{calculationResults.maxHTB.toLocaleString()}</span> in Help-to-Buy assistance.
                </p>
              </div>
            )}

            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationData.firstName}
                    onChange={(e: any) => setApplicationData({ ...applicationData, firstName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationData.lastName}
                    onChange={(e: any) => setApplicationData({ ...applicationData, lastName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={applicationData.email}
                    onChange={(e: any) => setApplicationData({ ...applicationData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicationData.phone}
                    onChange={(e: any) => setApplicationData({ ...applicationData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PPS Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={applicationData.ppsNumber}
                  onChange={(e: any) => setApplicationData({ ...applicationData, ppsNumber: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234567AB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={applicationData.propertyAddress}
                  onChange={(e: any) => setApplicationData({ ...applicationData, propertyAddress: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Unit 102, Fitzgerald Gardens, Dublin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property ID / Development Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={applicationData.propertyId}
                  onChange={(e: any) => setApplicationData({ ...applicationData, propertyId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fitzgerald Gardens - Unit 102"
                />
              </div>

              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    checked={applicationData.acceptTerms}
                    onChange={(e: any) => setApplicationData({ ...applicationData, acceptTerms: e.target.checked })}
                    className="mt-1 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that the information provided is accurate and I accept the terms and conditions of the Help-to-Buy scheme. 
                    I understand that false information may result in rejection of my application.
                  </span>
                </label>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowApplication(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Calculator
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium flex items-center
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-600 hover:to-green-700'} transition-all duration-200`}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                  {!isLoading && <ArrowRight className="ml-2" size={20} />}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="text-red-600 mr-2" size={20} />
                <p className="text-red-800">{error.toString()}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};