/**
 * Mortgage Pre-Approval Integration System
 * Comprehensive mortgage application and pre-approval workflow with multiple lender integration
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Calculator, 
  CreditCard, 
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  ArrowLeft,
  Euro,
  Percent,
  Calendar,
  User,
  Home,
  Briefcase,
  Target,
  Award,
  RefreshCw,
  Download,
  Send,
  Phone,
  Mail,
  Info,
  Star,
  ThumbsUp,
  AlertCircle,
  Eye,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface MortgageApplication {
  id: string;
  applicantInfo: {
    primaryApplicant: ApplicantDetails;
    secondaryApplicant?: ApplicantDetails;
    dependents: number;
    firstTimeBuyer: boolean;
  };
  financialInfo: {
    totalIncome: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    existingDebts: number;
    savings: number;
    deposit: number;
    requestedAmount: number;
    loanTerm: number; // years
  };
  propertyInfo: {
    propertyValue: number;
    propertyType: string;
    location: string;
    newBuild: boolean;
    htbEligible: boolean;
  };
  status: 'draft' | 'submitted' | 'under_review' | 'pre_approved' | 'approved' | 'declined';
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicantDetails {
  fullName: string;
  dateOfBirth: string;
  employment: {
    type: 'employed' | 'self_employed' | 'contract' | 'unemployed';
    employer?: string;
    position?: string;
    startDate: string;
    annualIncome: number;
    contractEndDate?: string;
  };
  address: {
    current: string;
    timeAtAddress: number; // months
    previousAddress?: string;
  };
  creditHistory: {
    score?: number;
    existingMortgage: boolean;
    ccsiNumber?: string;
  };
}

export interface MortgageOffer {
  id: string;
  lenderName: string;
  lenderLogo: string;
  productName: string;
  interestRate: number;
  apr: number;
  maxLoanAmount: number;
  loanToValue: number;
  term: number;
  monthlyPayment: number;
  totalCost: number;
  fees: {
    arrangementFee: number;
    valuationFee: number;
    legalFees: number;
    other: number;
  };
  features: string[];
  conditions: string[];
  decisionInPrinciple: boolean;
  validUntil: Date;
  rating: number; // 1-5 stars
  recommendationScore: number; // 0-100
  status: 'available' | 'conditional' | 'expired' | 'withdrawn';
  specialOffers?: string[];
}

export interface LenderRequirements {
  lenderName: string;
  minIncome: number;
  maxLoanToValue: number;
  minDeposit: number;
  creditScoreRequired: number;
  employmentRequirements: string[];
  documentRequirements: string[];
  processingTime: string;
  specialPrograms: string[];
}

interface MortgagePreApprovalSystemProps {
  userProfile?: any;
  verifiedDocuments?: any[];
  onApplicationSubmit?: (application: MortgageApplication) => void;
  onOfferAccept?: (offer: MortgageOffer) => void;
  className?: string;
}

const MOCK_LENDERS: LenderRequirements[] = [
  {
    lenderName: 'Bank of Ireland',
    minIncome: 35000,
    maxLoanToValue: 90,
    minDeposit: 10,
    creditScoreRequired: 650,
    employmentRequirements: ['Permanent employment', 'Min 6 months in current role'],
    documentRequirements: ['3 months payslips', '6 months bank statements', 'P60'],
    processingTime: '5-10 business days',
    specialPrograms: ['First Time Buyer', 'Green Mortgage', 'Professional Mortgage']
  },
  {
    lenderName: 'AIB',
    minIncome: 40000,
    maxLoanToValue: 90,
    minDeposit: 10,
    creditScoreRequired: 680,
    employmentRequirements: ['Permanent employment', 'Min 12 months in current role'],
    documentRequirements: ['3 months payslips', '6 months bank statements', 'Employment letter'],
    processingTime: '7-12 business days',
    specialPrograms: ['First Time Buyer', 'Haven Green', 'Switch & Save']
  },
  {
    lenderName: 'Permanent TSB',
    minIncome: 30000,
    maxLoanToValue: 85,
    minDeposit: 15,
    creditScoreRequired: 620,
    employmentRequirements: ['Permanent employment', 'Min 3 months in current role'],
    documentRequirements: ['3 months payslips', '6 months bank statements'],
    processingTime: '3-7 business days',
    specialPrograms: ['First Time Buyer', 'Cashback Mortgage', 'Graduate Mortgage']
  }
];

export default function MortgagePreApprovalSystem({
  userProfile,
  verifiedDocuments = [],
  onApplicationSubmit,
  onOfferAccept,
  className = ''
}: MortgagePreApprovalSystemProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [application, setApplication] = useState<Partial<MortgageApplication>>({
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [availableOffers, setAvailableOffers] = useState<MortgageOffer[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [affordabilityResults, setAffordabilityResults] = useState<any>(null);

  const steps = [
    { id: 'personal', name: 'Personal Details', icon: User },
    { id: 'financial', name: 'Financial Information', icon: Calculator },
    { id: 'property', name: 'Property Details', icon: Home },
    { id: 'review', name: 'Review & Submit', icon: FileText },
    { id: 'offers', name: 'Mortgage Offers', icon: Building2 }
  ];

  // Calculate affordability when financial info changes
  useEffect(() => {
    if (application.financialInfo?.monthlyIncome && application.financialInfo?.monthlyExpenses) {
      calculateAffordability();
    }
  }, [application.financialInfo]);

  // Generate offers when application is submitted
  useEffect(() => {
    if (application.status === 'submitted') {
      generateMortgageOffers();
    }
  }, [application.status]);

  const calculateAffordability = useCallback(() => {
    if (!application.financialInfo) return;

    const { monthlyIncome, monthlyExpenses, existingDebts } = application.financialInfo;
    const netIncome = monthlyIncome - monthlyExpenses - existingDebts;
    const maxAffordablePayment = netIncome * 0.35; // 35% of net income
    const estimatedMaxLoan = maxAffordablePayment * 12 * 25; // 25 year term approximation

    setAffordabilityResults({
      maxAffordablePayment,
      estimatedMaxLoan,
      debtToIncome: ((monthlyExpenses + existingDebts) / monthlyIncome) * 100,
      affordabilityRating: netIncome > maxAffordablePayment ? 'Good' : 'Tight'
    });
  }, [application.financialInfo]);

  const generateMortgageOffers = useCallback(async () => {
    setIsCalculating(true);

    // Simulate API call to multiple lenders
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockOffers: MortgageOffer[] = [
      {
        id: 'boi-001',
        lenderName: 'Bank of Ireland',
        lenderLogo: '/api/placeholder/80/40',
        productName: 'Green Mortgage - Fixed Rate',
        interestRate: 3.25,
        apr: 3.4,
        maxLoanAmount: 450000,
        loanToValue: 85,
        term: 30,
        monthlyPayment: 1956,
        totalCost: 704160,
        fees: {
          arrangementFee: 0,
          valuationFee: 150,
          legalFees: 1500,
          other: 200
        },
        features: [
          'Cashback €2,000 on drawdown',
          'No arrangement fee',
          'Green mortgage benefits',
          'Free property valuation'
        ],
        conditions: [
          'Minimum income €35,000',
          'Property must meet BER B3 or higher',
          'Offer valid for 6 months'
        ],
        decisionInPrinciple: true,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        rating: 4.5,
        recommendationScore: 92,
        status: 'available',
        specialOffers: ['€2,000 cashback', 'Rate reduction for green properties']
      },
      {
        id: 'aib-001',
        lenderName: 'AIB',
        lenderLogo: '/api/placeholder/80/40',
        productName: 'Haven Variable Rate',
        interestRate: 3.45,
        apr: 3.6,
        maxLoanAmount: 420000,
        loanToValue: 80,
        term: 25,
        monthlyPayment: 2105,
        totalCost: 631500,
        fees: {
          arrangementFee: 500,
          valuationFee: 200,
          legalFees: 1200,
          other: 150
        },
        features: [
          'Switch & Save package',
          'Online mortgage management',
          'Overpayment flexibility',
          'Haven rewards program'
        ],
        conditions: [
          'Minimum income €40,000',
          'Permanent employment required',
          'Current account switching required'
        ],
        decisionInPrinciple: true,
        validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        rating: 4.2,
        recommendationScore: 85,
        status: 'available'
      },
      {
        id: 'ptsb-001',
        lenderName: 'Permanent TSB',
        lenderLogo: '/api/placeholder/80/40',
        productName: 'Graduate Mortgage',
        interestRate: 3.15,
        apr: 3.3,
        maxLoanAmount: 380000,
        loanToValue: 85,
        term: 30,
        monthlyPayment: 1628,
        totalCost: 586080,
        fees: {
          arrangementFee: 300,
          valuationFee: 120,
          legalFees: 800,
          other: 100
        },
        features: [
          'Graduate program benefits',
          'Reduced rates for professionals',
          'Flexible repayment terms',
          'No early repayment penalties'
        ],
        conditions: [
          'Third level qualification required',
          'Professional registration',
          'Minimum income €30,000'
        ],
        decisionInPrinciple: false,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        rating: 4.0,
        recommendationScore: 78,
        status: 'conditional'
      }
    ];

    setAvailableOffers(mockOffers);
    setIsCalculating(false);
  }, []);

  const updateApplication = (section: string, data: any) => {
    setApplication(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof MortgageApplication], ...data },
      updatedAt: new Date()
    }));
  };

  const submitApplication = () => {
    const completeApplication: MortgageApplication = {
      id: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...application as MortgageApplication,
      status: 'submitted',
      submittedAt: new Date()
    };

    setApplication(completeApplication);
    onApplicationSubmit?.(completeApplication);
    setCurrentStep(4); // Move to offers step
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderPersonalDetailsStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={application.applicantInfo?.primaryApplicant?.fullName || ''}
            onChange={(e) => updateApplication('applicantInfo', {
              primaryApplicant: { ...application.applicantInfo?.primaryApplicant, fullName: e.target.value }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={application.applicantInfo?.primaryApplicant?.dateOfBirth || ''}
            onChange={(e) => updateApplication('applicantInfo', {
              primaryApplicant: { ...application.applicantInfo?.primaryApplicant, dateOfBirth: e.target.value }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type *
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={application.applicantInfo?.primaryApplicant?.employment?.type || ''}
            onChange={(e) => updateApplication('applicantInfo', {
              primaryApplicant: {
                ...application.applicantInfo?.primaryApplicant,
                employment: { ...application.applicantInfo?.primaryApplicant?.employment, type: e.target.value }
              }
            })}
          >
            <option value="">Select employment type</option>
            <option value="employed">Employed</option>
            <option value="self_employed">Self Employed</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income *
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="€50,000"
            value={application.applicantInfo?.primaryApplicant?.employment?.annualIncome || ''}
            onChange={(e) => updateApplication('applicantInfo', {
              primaryApplicant: {
                ...application.applicantInfo?.primaryApplicant,
                employment: { ...application.applicantInfo?.primaryApplicant?.employment, annualIncome: parseInt(e.target.value) }
              }
            })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={application.applicantInfo?.firstTimeBuyer || false}
              onChange={(e) => updateApplication('applicantInfo', {
                firstTimeBuyer: e.target.checked
              })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">First-time buyer</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderFinancialStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income *
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="€4,000"
            value={application.financialInfo?.monthlyIncome || ''}
            onChange={(e) => updateApplication('financialInfo', {
              monthlyIncome: parseInt(e.target.value) || 0
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Expenses *
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="€2,000"
            value={application.financialInfo?.monthlyExpenses || ''}
            onChange={(e) => updateApplication('financialInfo', {
              monthlyExpenses: parseInt(e.target.value) || 0
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Existing Debts
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="€500"
            value={application.financialInfo?.existingDebts || ''}
            onChange={(e) => updateApplication('financialInfo', {
              existingDebts: parseInt(e.target.value) || 0
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Deposit *
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="€50,000"
            value={application.financialInfo?.deposit || ''}
            onChange={(e) => updateApplication('financialInfo', {
              deposit: parseInt(e.target.value) || 0
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requested Loan Amount *
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="€400,000"
            value={application.financialInfo?.requestedAmount || ''}
            onChange={(e) => updateApplication('financialInfo', {
              requestedAmount: parseInt(e.target.value) || 0
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (Years) *
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={application.financialInfo?.loanTerm || ''}
            onChange={(e) => updateApplication('financialInfo', {
              loanTerm: parseInt(e.target.value)
            })}
          >
            <option value="">Select term</option>
            <option value="20">20 years</option>
            <option value="25">25 years</option>
            <option value="30">30 years</option>
            <option value="35">35 years</option>
          </select>
        </div>
      </div>

      {/* Affordability Calculator */}
      {affordabilityResults && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">Affordability Assessment</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Max Monthly Payment:</span>
              <div className="font-semibold text-blue-900">{formatCurrency(affordabilityResults.maxAffordablePayment)}</div>
            </div>
            <div>
              <span className="text-blue-700">Estimated Max Loan:</span>
              <div className="font-semibold text-blue-900">{formatCurrency(affordabilityResults.estimatedMaxLoan)}</div>
            </div>
            <div>
              <span className="text-blue-700">Debt-to-Income:</span>
              <div className="font-semibold text-blue-900">{affordabilityResults.debtToIncome.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPropertyStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Value *
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="€450,000"
            value={application.propertyInfo?.propertyValue || ''}
            onChange={(e) => updateApplication('propertyInfo', {
              propertyValue: parseInt(e.target.value) || 0
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type *
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={application.propertyInfo?.propertyType || ''}
            onChange={(e) => updateApplication('propertyInfo', {
              propertyType: e.target.value
            })}
          >
            <option value="">Select property type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="duplex">Duplex</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Dublin 2"
            value={application.propertyInfo?.location || ''}
            onChange={(e) => updateApplication('propertyInfo', {
              location: e.target.value
            })}
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={application.propertyInfo?.newBuild || false}
              onChange={(e) => updateApplication('propertyInfo', {
                newBuild: e.target.checked
              })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">New build property</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={application.propertyInfo?.htbEligible || false}
              onChange={(e) => updateApplication('propertyInfo', {
                htbEligible: e.target.checked
              })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Help to Buy eligible</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderOffersStep = () => (
    <div className="space-y-6">
      {isCalculating ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Comparing offers from multiple lenders...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Available Mortgage Offers ({availableOffers.length})
            </h3>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={16} />
              {showComparison ? 'Hide' : 'Show'} Comparison
            </button>
          </div>

          <div className="grid gap-6">
            {availableOffers.map((offer) => (
              <div
                key={offer.id}
                className={`border rounded-xl p-6 transition-all hover:shadow-lg ${
                  selectedOffer === offer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={offer.lenderLogo}
                      alt={offer.lenderName}
                      className="w-16 h-8 object-contain"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{offer.productName}</h4>
                      <p className="text-gray-600 text-sm">{offer.lenderName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(offer.rating) ? 'fill-current' : ''}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{offer.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Match: {offer.recommendationScore}%
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Interest Rate</span>
                    <div className="font-semibold text-lg text-gray-900">{offer.interestRate}%</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Monthly Payment</span>
                    <div className="font-semibold text-lg text-gray-900">{formatCurrency(offer.monthlyPayment)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Max Loan</span>
                    <div className="font-semibold text-lg text-gray-900">{formatCurrency(offer.maxLoanAmount)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">LTV</span>
                    <div className="font-semibold text-lg text-gray-900">{offer.loanToValue}%</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Key Features</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {offer.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Total Fees</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Arrangement: {formatCurrency(offer.fees.arrangementFee)}</div>
                      <div>Valuation: {formatCurrency(offer.fees.valuationFee)}</div>
                      <div>Legal: {formatCurrency(offer.fees.legalFees)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="flex items-center gap-4">
                    {offer.decisionInPrinciple && (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={14} />
                        Decision in Principle
                      </span>
                    )}
                    {offer.specialOffers && offer.specialOffers.length > 0 && (
                      <span className="flex items-center gap-1 text-blue-600 text-sm">
                        <Award size={14} />
                        Special Offers
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      {selectedOffer === offer.id ? 'Hide Details' : 'View Details'}
                    </button>
                    <button
                      onClick={() => onOfferAccept?.(offer)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedOffer === offer.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Conditions</h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {offer.conditions.map((condition, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertCircle size={14} className="text-orange-500" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {offer.specialOffers && offer.specialOffers.length > 0 && (
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Special Offers</h6>
                        <ul className="text-sm text-green-600 space-y-1">
                          {offer.specialOffers.map((specialOffer, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Award size={14} />
                              {specialOffer}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">APR:</span>
                        <span className="font-medium ml-2">{offer.apr}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Cost:</span>
                        <span className="font-medium ml-2">{formatCurrency(offer.totalCost)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Valid Until:</span>
                        <span className="font-medium ml-2">{offer.validUntil.toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ml-2 ${
                          offer.status === 'available' ? 'text-green-600' :
                          offer.status === 'conditional' ? 'text-orange-600' :
                          'text-gray-600'
                        }`}>
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mortgage Pre-Approval</h2>
            <p className="text-gray-600 text-sm">Compare offers from multiple lenders</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index <= currentStep 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {index < currentStep ? (
                  <CheckCircle size={16} />
                ) : (
                  <step.icon size={16} />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 hidden sm:block ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        {currentStep === 0 && renderPersonalDetailsStep()}
        {currentStep === 1 && renderFinancialStep()}
        {currentStep === 2 && renderPropertyStep()}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Application</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(application, null, 2)}
              </pre>
            </div>
          </div>
        )}
        {currentStep === 4 && renderOffersStep()}
      </div>

      {/* Navigation */}
      <div className="p-6 border-t">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : currentStep === 3 ? (
            <button
              onClick={submitApplication}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Send size={16} />
              Submit Application
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}