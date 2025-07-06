'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Euro, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Info,
  CreditCard,
  Home,
  PiggyBank,
  FileText
} from 'lucide-react';

interface HTBCalculatorProps {
  propertyPrice: number;
  unitId?: string;
  developmentId?: string;
  onQualificationChange?: (qualified: boolean, details: HTBQualificationResult) => void;
  onLeadGenerated?: (leadData: HTBLeadData) => void;
  className?: string;
  embedded?: boolean; // If true, shows compact version
}

interface HTBQualificationResult {
  qualified: boolean;
  htbAmount: number;
  maxHTBAmount: number;
  depositRequired: number;
  mortgageRequired: number;
  monthlyPayment: number;
  affordabilityScore: number;
  recommendations: string[];
  nextSteps: string[];
}

interface HTBLeadData {
  annualIncome: number;
  existingSavings: number;
  monthlyExpenses: number;
  firstTimeBuyer: boolean;
  qualified: boolean;
  interestLevel: 'low' | 'medium' | 'high';
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  propertyInterest: {
    propertyPrice: number;
    unitId?: string;
    developmentId?: string;
  };
}

export default function HTBCalculator({
  propertyPrice,
  unitId,
  developmentId,
  onQualificationChange,
  onLeadGenerated,
  className = '',
  embedded = false
}: HTBCalculatorProps) {
  const [formData, setFormData] = useState({
    annualIncome: '',
    existingSavings: '',
    monthlyExpenses: '',
    firstTimeBuyer: true,
    partnerIncome: '',
    hasPartner: false
  });

  const [result, setResult] = useState<HTBQualificationResult | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [step, setStep] = useState<'calculator' | 'results' | 'contact'>('calculator');

  useEffect(() => {
    if (Object.values(formData).some(value => value !== '' && value !== false)) {
      calculateHTBEligibility();
    }
  }, [formData, propertyPrice]);

  const calculateHTBEligibility = () => {
    const income = parseFloat(formData.annualIncome) || 0;
    const partnerIncome = formData.hasPartner ? (parseFloat(formData.partnerIncome) || 0) : 0;
    const totalIncome = income + partnerIncome;
    const savings = parseFloat(formData.existingSavings) || 0;
    const expenses = parseFloat(formData.monthlyExpenses) || 0;

    // HTB calculation rules
    const maxPropertyPrice = 500000; // HTB limit
    const htbRate = 0.1; // 10% of property price
    const maxHTBAmount = 30000; // Maximum HTB amount
    
    // Calculate HTB amount
    const calculatedHTB = Math.min(propertyPrice * htbRate, maxHTBAmount);
    const actualHTBAmount = propertyPrice <= maxPropertyPrice ? calculatedHTB : 0;
    
    // Calculate required amounts
    const depositRequired = Math.max(propertyPrice * 0.1 - actualHTBAmount, 0);
    const mortgageRequired = propertyPrice - actualHTBAmount - depositRequired;
    
    // Mortgage affordability (conservative 3.5x income multiple)
    const maxMortgage = totalIncome * 3.5;
    const monthlyMortgagePayment = (mortgageRequired * 0.04) / 12; // 4% interest rate estimate
    const monthlyAffordability = (totalIncome / 12) * 0.35; // 35% of monthly income
    
    // Qualification checks
    const incomeQualified = totalIncome >= 25000; // Minimum income
    const propertyPriceQualified = propertyPrice <= maxPropertyPrice;
    const firstTimeBuyerQualified = formData.firstTimeBuyer;
    const mortgageAffordable = mortgageRequired <= maxMortgage;
    const savingsAdequate = savings >= depositRequired;
    const monthlyAffordable = monthlyMortgagePayment <= monthlyAffordability;
    
    const qualified = incomeQualified && 
                     propertyPriceQualified && 
                     firstTimeBuyerQualified && 
                     mortgageAffordable && 
                     savingsAdequate &&
                     monthlyAffordable;

    // Generate recommendations
    const recommendations: string[] = [];
    const nextSteps: string[] = [];
    
    if (!incomeQualified) {
      recommendations.push('Consider increasing income or looking at joint applications');
    }
    if (!propertyPriceQualified) {
      recommendations.push('Look at properties under €500,000 to qualify for HTB');
    }
    if (!savingsAdequate) {
      recommendations.push(`Save additional €${(depositRequired - savings).toLocaleString()} for deposit`);
    }
    if (!monthlyAffordable) {
      recommendations.push('Consider a longer mortgage term or lower property price');
    }
    
    if (qualified) {
      nextSteps.push('Apply for HTB pre-approval');
      nextSteps.push('Get mortgage pre-approval');
      nextSteps.push('Schedule property viewing');
      nextSteps.push('Reserve your unit');
    } else {
      nextSteps.push('Review recommendations above');
      nextSteps.push('Speak with mortgage advisor');
      nextSteps.push('Consider alternative financing options');
    }

    // Calculate affordability score (0-100)
    const affordabilityScore = Math.min(100, Math.round(
      (incomeQualified ? 25 : 0) +
      (propertyPriceQualified ? 25 : 0) +
      (mortgageAffordable ? 25 : 0) +
      (savingsAdequate ? 25 : 0)
    ));

    const calculationResult: HTBQualificationResult = {
      qualified,
      htbAmount: actualHTBAmount,
      maxHTBAmount,
      depositRequired,
      mortgageRequired,
      monthlyPayment: monthlyMortgagePayment,
      affordabilityScore,
      recommendations,
      nextSteps
    };

    setResult(calculationResult);
    
    if (onQualificationChange) {
      onQualificationChange(qualified, calculationResult);
    }
  };

  const handleSubmitLead = () => {
    if (!result) return;

    const leadData: HTBLeadData = {
      annualIncome: parseFloat(formData.annualIncome) || 0,
      existingSavings: parseFloat(formData.existingSavings) || 0,
      monthlyExpenses: parseFloat(formData.monthlyExpenses) || 0,
      firstTimeBuyer: formData.firstTimeBuyer,
      qualified: result.qualified,
      interestLevel: result.qualified ? 'high' : 'medium',
      contactInfo: contactInfo.email ? contactInfo : undefined,
      propertyInterest: {
        propertyPrice,
        unitId,
        developmentId
      }
    };

    if (onLeadGenerated) {
      onLeadGenerated(leadData);
    }

    // Would integrate with CRM/lead management system here
    console.log('HTB Lead Generated:', leadData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (embedded && step === 'calculator') {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">HTB Quick Check</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-1">
              Annual Income
            </label>
            <input
              type="number"
              placeholder="€50,000"
              className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.annualIncome}
              onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-1">
              Current Savings
            </label>
            <input
              type="number"
              placeholder="€30,000"
              className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.existingSavings}
              onChange={(e) => setFormData(prev => ({ ...prev, existingSavings: e.target.value }))}
            />
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-md p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              {result.qualified ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${result.qualified ? 'text-green-700' : 'text-red-700'}`}>
                {result.qualified ? 'HTB Eligible!' : 'Not Currently Eligible'}
              </span>
            </div>
            
            {result.qualified && (
              <div className="text-sm text-gray-600">
                <p><strong>HTB Amount:</strong> {formatCurrency(result.htbAmount)}</p>
                <p><strong>Deposit Needed:</strong> {formatCurrency(result.depositRequired)}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setStep('results')}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Get Full Assessment
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold">Help to Buy Calculator</h2>
            <p className="text-blue-100 text-sm">
              Check your eligibility for up to €30,000 government support
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {step === 'calculator' && (
          <div className="space-y-6">
            {/* Property Price Display */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Property Price</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(propertyPrice)}</p>
              {propertyPrice > 500000 && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠️ Above HTB limit of €500,000
                </p>
              )}
            </div>

            {/* Income Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Annual Income *
                </label>
                <div className="relative">
                  <Euro className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    placeholder="50000"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Savings *
                </label>
                <div className="relative">
                  <PiggyBank className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    placeholder="30000"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.existingSavings}
                    onChange={(e) => setFormData(prev => ({ ...prev, existingSavings: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Partner Income */}
            <div>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={formData.hasPartner}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasPartner: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Joint application with partner
                </span>
              </label>

              {formData.hasPartner && (
                <div className="relative">
                  <Euro className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    placeholder="Partner's annual income"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.partnerIncome}
                    onChange={(e) => setFormData(prev => ({ ...prev, partnerIncome: e.target.value }))}
                  />
                </div>
              )}
            </div>

            {/* Monthly Expenses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Expenses (loans, credit cards, etc.)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  placeholder="1500"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.monthlyExpenses}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyExpenses: e.target.value }))}
                />
              </div>
            </div>

            {/* First Time Buyer */}
            <div className="bg-blue-50 rounded-lg p-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.firstTimeBuyer}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstTimeBuyer: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-700">
                  I am a first-time buyer
                </span>
              </label>
              <p className="text-xs text-blue-600 mt-1 ml-6">
                Required for Help to Buy eligibility
              </p>
            </div>

            {result && (
              <button
                onClick={() => setStep('results')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Detailed Results
              </button>
            )}
          </div>
        )}

        {step === 'results' && result && (
          <div className="space-y-6">
            {/* Qualification Status */}
            <div className={`rounded-lg p-6 ${result.qualified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                {result.qualified ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${result.qualified ? 'text-green-800' : 'text-red-800'}`}>
                    {result.qualified ? 'Congratulations! You qualify for Help to Buy' : 'Not Currently Eligible'}
                  </h3>
                  <p className={`text-sm ${result.qualified ? 'text-green-600' : 'text-red-600'}`}>
                    Affordability Score: {result.affordabilityScore}/100
                  </p>
                </div>
              </div>

              {result.qualified && (
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600">HTB Amount</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(result.htbAmount)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600">Additional Deposit</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.depositRequired)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600">Monthly Payment</p>
                    <p className="text-2xl font-bold text-gray-700">{formatCurrency(result.monthlyPayment)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Recommendations
                </h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Next Steps
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {result.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('contact')}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {result.qualified ? 'Get Expert Help' : 'Speak to Advisor'}
              </button>
              <button
                onClick={() => setStep('calculator')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Recalculate
              </button>
            </div>
          </div>
        )}

        {step === 'contact' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Expert Assistance</h3>
              <p className="text-gray-600">
                Connect with our mortgage specialists for personalized guidance
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+353 1 234 5678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <button
              onClick={handleSubmitLead}
              disabled={!contactInfo.email}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Connect with Specialist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}