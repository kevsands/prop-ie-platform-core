'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  FileText,
  Building,
  CreditCard,
  User,
  Globe,
  Lock,
  ArrowRight,
  Camera,
  Upload
} from 'lucide-react';

// KYC/AML steps for Irish property purchase
const kycSteps = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Basic personal details',
    icon: <User className="w-5 h-5" />,
    status: 'pending'
  },
  {
    id: 'identity-verification',
    title: 'Identity Verification',
    description: 'Verify your identity documents',
    icon: <UserCheck className="w-5 h-5" />,
    status: 'pending'
  },
  {
    id: 'address-verification',
    title: 'Address Verification',
    description: 'Confirm your current address',
    icon: <Building className="w-5 h-5" />,
    status: 'pending'
  },
  {
    id: 'source-of-funds',
    title: 'Source of Funds',
    description: 'Verify the source of your deposit',
    icon: <CreditCard className="w-5 h-5" />,
    status: 'pending'
  },
  {
    id: 'pep-check',
    title: 'PEP & Sanctions Check',
    description: 'Politically Exposed Person screening',
    icon: <Globe className="w-5 h-5" />,
    status: 'pending'
  }
];

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ppsNumber: string;
  nationality: string;
  occupation: string;

  // Contact Information
  email: string;
  phone: string;

  // Current Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  eircode: string;
  yearsAtAddress: string;

  // Previous Address (if less than 3 years)
  previousAddressLine1: string;
  previousAddressLine2: string;
  previousCity: string;
  previousCounty: string;
  previousEircode: string;

  // Source of Funds
  employmentStatus: string;
  employerName: string;
  annualIncome: string;
  sourceOfDeposit: string;
  sourceOfDepositDetails: string;

  // PEP Declaration
  isPEP: boolean;
  pepDetails: string;
  familyPEP: boolean;
  familyPEPDetails: string;
}

export default function KYCCompliancePage() {
  const router = useRouter();
  const [currentStepsetCurrentStep] = useState('personal-info');
  const [formDatasetFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    ppsNumber: '',
    nationality: 'Irish',
    occupation: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    eircode: '',
    yearsAtAddress: '',
    previousAddressLine1: '',
    previousAddressLine2: '',
    previousCity: '',
    previousCounty: '',
    previousEircode: '',
    employmentStatus: '',
    employerName: '',
    annualIncome: '',
    sourceOfDeposit: '',
    sourceOfDepositDetails: '',
    isPEP: false,
    pepDetails: '',
    familyPEP: false,
    familyPEPDetails: ''
  });

  const [verificationStatussetVerificationStatus] = useState({
    identityVerified: false,
    addressVerified: false,
    fundsVerified: false,
    pepCleared: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleStepComplete = () => {
    const stepIndex = kycSteps.findIndex(step => step.id === currentStep);
    if (stepIndex <kycSteps.length - 1) {
      setCurrentStep(kycSteps[stepIndex + 1].id);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal-info':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PPS Number
                </label>
                <input
                  type="text"
                  name="ppsNumber"
                  value={formData.ppsNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234567A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Irish">Irish</option>
                  <option value="EU">EU Citizen</option>
                  <option value="UK">UK Citizen</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+353 XX XXX XXXX"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'identity-verification':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Identity Verification</h3>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">
                    We need to verify your identity as part of our Anti-Money Laundering (AML) obligations 
                    under Irish law. This is a standard requirement for all property purchases.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Upload Identity Document</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Please upload a clear photo or scan of one of the following:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                  <li>Valid passport (photo page)</li>
                  <li>Irish driving license (both sides)</li>
                  <li>Irish Public Services Card</li>
                </ul>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Upload Document
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF, JPG, or PNG • Max 5MB
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Selfie Verification</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Take a selfie holding your ID document to verify it's really you
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Take Selfie
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure your face and ID are clearly visible
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'address-verification':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Address Verification</h3>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Current Address</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2 (optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    County
                  </label>
                  <select
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select County</option>
                    <option value="Cork">Cork</option>
                    <option value="Dublin">Dublin</option>
                    <option value="Galway">Galway</option>
                    <option value="Kerry">Kerry</option>
                    <option value="Limerick">Limerick</option>
                    {/* Add all Irish counties */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eircode
                  </label>
                  <input
                    type="text"
                    name="eircode"
                    value={formData.eircode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="A12 B34C"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years at this address
                  </label>
                  <select
                    name="yearsAtAddress"
                    value={formData.yearsAtAddress}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3+">More than 3 years</option>
                  </select>
                </div>
              </div>

              {formData.yearsAtAddress === '0-1' || formData.yearsAtAddress === '1-3' ? (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Previous Address</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Please provide your previous address as you've been at your current address for less than 3 years
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Address Line 1
                      </label>
                      <input
                        type="text"
                        name="previousAddressLine1"
                        value={formData.previousAddressLine1}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous City
                      </label>
                      <input
                        type="text"
                        name="previousCity"
                        value={formData.previousCity}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous County
                      </label>
                      <select
                        name="previousCounty"
                        value={formData.previousCounty}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select County</option>
                        <option value="Cork">Cork</option>
                        <option value="Dublin">Dublin</option>
                        <option value="Galway">Galway</option>
                        {/* Add all Irish counties */}
                      </select>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 border rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Upload Proof of Address</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Please upload one of the following (dated within last 3 months):
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                  <li>Utility bill (electricity, gaswater)</li>
                  <li>Bank statement</li>
                  <li>Internet/phone bill</li>
                  <li>Local council/revenue correspondence</li>
                </ul>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Upload Document
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF, JPG, or PNG • Max 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'source-of-funds':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Source of Funds</h3>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800">
                    Under Irish AML regulations, we must verify the source of funds for your property purchase. 
                    This includes both your deposit and the source of your mortgage funds.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Status
                </label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="retired">Retired</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {(formData.employmentStatus === 'employed' || formData.employmentStatus === 'self-employed') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employer Name {formData.employmentStatus === 'self-employed' ? '(Business Name)' : ''}
                    </label>
                    <input
                      type="text"
                      name="employerName"
                      value={formData.employerName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Income (€)
                    </label>
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source of Deposit
                </label>
                <select
                  name="sourceOfDeposit"
                  value={formData.sourceOfDeposit}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Source</option>
                  <option value="savings">Personal Savings</option>
                  <option value="gift">Gift from Family</option>
                  <option value="inheritance">Inheritance</option>
                  <option value="sale">Sale of Asset</option>
                  <option value="loan">Personal Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Please provide details about your deposit source
                </label>
                <textarea
                  name="sourceOfDepositDetails"
                  value={formData.sourceOfDepositDetails}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Savings accumulated over 5 years from salary, Gift from parents (please provide letter), etc."
                  required
                />
              </div>

              <div className="border rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Required Documentation</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Based on your selections, please upload the following:
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">Bank statements (6 months)</p>
                      <p className="text-sm text-gray-600">Showing salary deposits and savings accumulation</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                      Upload
                    </button>
                  </div>

                  {formData.sourceOfDeposit === 'gift' && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-900">Gift Letter</p>
                        <p className="text-sm text-gray-600">Signed letter from gift donor</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                        Upload
                      </button>
                    </div>
                  )}

                  {(formData.employmentStatus === 'employed' || formData.employmentStatus === 'self-employed') && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-gray-900">P60 Forms (2 years)</p>
                          <p className="text-sm text-gray-600">Annual tax statements</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                          Upload
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-gray-900">Payslips (3 months)</p>
                          <p className="text-sm text-gray-600">Recent payslips showing income</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                          Upload
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'pep-check':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">PEP & Sanctions Check</h3>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">
                    We are required to check if you or your immediate family members are Politically 
                    Exposed Persons (PEPs) or subject to any international sanctions. This is a standard 
                    requirement under Irish AML regulations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="isPEP"
                    checked={formData.isPEP}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Are you a Politically Exposed Person?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      This includes senior political figures, senior government officials, judicial or 
                      military officials, senior executives of state-owned corporations, or important 
                      political party officials.
                    </p>
                  </div>
                </label>

                {formData.isPEP && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Please provide details
                    </label>
                    <textarea
                      name="pepDetails"
                      value={formData.pepDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Position held, duration, etc."
                      required
                    />
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="familyPEP"
                    checked={formData.familyPEP}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Are any of your immediate family members PEPs?
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Immediate family includes spouse/partner, children, and parents.
                    </p>
                  </div>
                </label>

                {formData.familyPEP && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Please provide details
                    </label>
                    <textarea
                      name="familyPEPDetails"
                      value={formData.familyPEPDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Family member's name, relationship, position held, etc."
                      required
                    />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Declaration</h4>
                <p className="text-sm text-gray-700">
                  I declare that the information provided above is true and accurate to the best of my 
                  knowledge. I understand that providing false or misleading information is a criminal 
                  offense under Irish law.
                </p>

                <label className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    className="mr-2"
                    required
                  />
                  <span className="text-sm font-medium text-gray-900">
                    I agree to this declaration
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KYC & AML Verification</h1>
              <p className="text-gray-600 mt-1">Complete your identity verification for property purchase</p>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-gray-600">Compliant with Irish Regulations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {kycSteps.map((stepindex: any) => {
              const isActive = step.id === currentStep;
              const isComplete = kycSteps.findIndex(s => s.id === currentStep) > index;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : isComplete
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      disabled={!isComplete && !isActive}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </button>
                    <div className="text-center mt-2">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index <kycSteps.length - 1 && (
                    <div className={`w-20 h-0.5 mx-4 ${
                      isComplete ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderStepContent()}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => {
                  const stepIndex = kycSteps.findIndex(step => step.id === currentStep);
                  if (stepIndex> 0) {
                    setCurrentStep(kycSteps[stepIndex - 1].id);
                  }
                }
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                disabled={currentStep === kycSteps[0].id}
              >
                Previous
              </button>

              <button
                onClick={handleStepComplete}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                {currentStep === kycSteps[kycSteps.length - 1].id ? 'Complete Verification' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Security Information */}
          <div className="mt-6 bg-gray-100 rounded-lg p-6">
            <div className="flex items-start">
              <Lock className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Your data is secure</h4>
                <p className="text-sm text-gray-600">
                  All information is encrypted and stored in compliance with GDPR and Irish data 
                  protection laws. We only share information with authorized parties as required 
                  for your property purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}