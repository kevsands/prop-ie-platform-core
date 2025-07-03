'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  FileContract, 
  Users, 
  Save, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  Shield,
  Scale,
  Clock,
  Award,
  BookOpen,
  MapPin,
  User,
  CreditCard,
  FileText,
  Settings,
  AlertCircle,
  Info,
  Star
} from 'lucide-react';

// RIAI Contract Types
const RIAI_CONTRACT_TYPES = {
  blue_form: {
    name: 'RIAI Blue Form',
    fullName: 'Standard Form of Building Contract (without quantities)',
    description: 'Main building contract between employer and contractor for construction projects',
    icon: <Building2 className="w-5 h-5" />,
    version: '2017 Edition',
    complexity: 'High',
    estimatedTime: '45-60 minutes',
    suitableFor: 'Major construction projects, new builds, significant renovations',
    legalBasis: 'RIAI Contract Administration & Irish Construction Industry Council Guidelines'
  },
  yellow_form: {
    name: 'RIAI Yellow Form',
    fullName: 'Standard Form of Sub-Contract',
    description: 'Sub-contract between main contractor and sub-contractor for specialized works',
    icon: <Users className="w-5 h-5" />,
    version: '2017 Edition',
    complexity: 'Medium',
    estimatedTime: '30-40 minutes',
    suitableFor: 'Trade sub-contracts, specialist work packages, services contracts',
    legalBasis: 'RIAI Contract Administration & Construction Contracts Act 2013'
  }
};

// Standard RIAI Contract Sections
const RIAI_CONTRACT_SECTIONS = {
  // Common to both Blue and Yellow Forms
  contract_details: {
    title: 'Contract Details',
    required: true,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Essential contract identification and basic terms',
    fields: [
      'Contract Title',
      'Contract Reference Number',
      'Contract Date',
      'RIAI Edition (2017)',
      'Contract Type',
      'Contract Administrator',
      'Governing Law (Irish Law)'
    ]
  },
  
  // Blue Form Specific Sections
  employer_contractor: {
    title: 'Employer and Contractor',
    required: true,
    applicableTo: ['blue_form'],
    description: 'Details of the contracting parties',
    fields: [
      'Employer Name and Address',
      'Employer Legal Status',
      'Contractor Name and Address',
      'Contractor Registration Details',
      'Tax Clearance References',
      'Insurance Details',
      'Professional Indemnity Insurance'
    ]
  },
  
  // Yellow Form Specific Sections
  main_contractor_subcontractor: {
    title: 'Main Contractor and Sub-contractor',
    required: true,
    applicableTo: ['yellow_form'],
    description: 'Details of main contractor and sub-contractor',
    fields: [
      'Main Contractor Name and Address',
      'Main Contractor Registration',
      'Sub-contractor Name and Address',
      'Sub-contractor Registration',
      'Sub-contractor Trade/Specialty',
      'Sub-contractor Insurance Details',
      'Sub-contractor Tax Status'
    ]
  },
  
  works_description: {
    title: 'Description of Works',
    required: true,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Detailed description of the works to be executed',
    fields: [
      'Site Address and Description',
      'Nature of Works',
      'Scope of Works',
      'Contract Documents',
      'Drawings and Specifications',
      'Bill of Quantities (if applicable)',
      'Performance Standards',
      'Quality Requirements'
    ]
  },
  
  contract_sum_price: {
    title: 'Contract Sum and Price',
    required: true,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Financial terms and pricing structure',
    fields: [
      'Contract Sum (Lump Sum)',
      'VAT Treatment',
      'Price Adjustment Provisions',
      'Variation Order Procedures',
      'Daywork Rates',
      'Cost Control Mechanisms',
      'Currency (Euro)',
      'Price Fluctuation Clauses'
    ]
  },
  
  time_provisions: {
    title: 'Time Provisions',
    required: true,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Time-related terms and schedule',
    fields: [
      'Commencement Date',
      'Date for Completion',
      'Contract Period',
      'Sectional Completion (if applicable)',
      'Extension of Time Provisions',
      'Liquidated Damages',
      'Critical Path Requirements',
      'Working Hours and Restrictions'
    ]
  },
  
  payment_terms: {
    title: 'Payment Terms',
    required: true,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Payment procedures and terms',
    fields: [
      'Payment Schedule',
      'Interim Payment Procedures',
      'Retention Percentage',
      'Retention Release Terms',
      'Final Account Procedures',
      'Payment Certificates',
      'Interest on Late Payment',
      'Construction Contracts Act Compliance'
    ]
  },
  
  insurance_bonds: {
    title: 'Insurance and Bonds',
    required: true,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Insurance requirements and performance bonds',
    fields: [
      'Public Liability Insurance',
      'Employers Liability Insurance',
      'Professional Indemnity Insurance',
      'Works Insurance',
      'Performance Bond Requirements',
      'Retention Bond Options',
      'Insurance Levels and Coverage',
      'Claims Procedures'
    ]
  },
  
  warranties_defects: {
    title: 'Warranties and Defects',
    required: true,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Warranty periods and defects liability',
    fields: [
      'Defects Liability Period',
      'Warranty Provisions',
      'Maintenance Requirements',
      'Defects Notification Procedures',
      'Remedial Works Procedures',
      'Structural Warranties',
      'Equipment Warranties',
      'Performance Guarantees'
    ]
  },
  
  health_safety: {
    title: 'Health and Safety',
    required: true,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Health and safety obligations and procedures',
    fields: [
      'Health and Safety Management',
      'Safety Statement Requirements',
      'CDM Compliance (if applicable)',
      'Safety Training Requirements',
      'Accident Reporting Procedures',
      'Emergency Procedures',
      'Site Safety Rules',
      'Personal Protective Equipment'
    ]
  },
  
  environmental_sustainability: {
    title: 'Environmental and Sustainability',
    required: false,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Environmental and sustainability requirements',
    fields: [
      'Environmental Management Plan',
      'Waste Management Procedures',
      'Energy Efficiency Requirements',
      'Sustainable Materials Specification',
      'Carbon Footprint Targets',
      'BREEAM/LEED Requirements',
      'Environmental Monitoring',
      'Green Building Certification'
    ]
  },
  
  dispute_resolution: {
    title: 'Dispute Resolution',
    required: true,
    applicableTo: ['blue_form', 'yellow_form'],
    description: 'Procedures for resolving disputes',
    fields: [
      'Conciliation Procedures',
      'Arbitration Provisions',
      'Adjudication Procedures',
      'Expert Determination',
      'Governing Law (Irish Law)',
      'Jurisdiction (Irish Courts)',
      'Alternative Dispute Resolution',
      'Legal Costs Provisions'
    ]
  }
};

// Standard RIAI Contract Terms and Conditions
const RIAI_STANDARD_CONDITIONS = {
  general_conditions: [
    'Interpretation and Definitions',
    'Contractor\'s Obligations',
    'Employer\'s Obligations',
    'Contract Administrator\'s Role',
    'Commencement and Completion',
    'Control of Works',
    'Materials and Workmanship',
    'Variations',
    'Extensions of Time',
    'Determination and Suspension'
  ],
  payment_conditions: [
    'Contract Sum',
    'Interim Payments',
    'Retention',
    'Final Certificate',
    'Payment Procedures',
    'Set-off Rights',
    'Interest on Late Payment',
    'VAT and Tax Deductions'
  ],
  completion_conditions: [
    'Practical Completion',
    'Sectional Completion',
    'Defects Liability',
    'Making Good Defects',
    'Final Certificate',
    'Release of Retention',
    'Performance Bond Release',
    'Handover Procedures'
  ]
};

interface RIAIContractTemplateBuilderProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  projectId?: string;
}

export default function RIAIContractTemplateBuilder({
  initialData,
  onSave,
  onCancel,
  projectId
}: RIAIContractTemplateBuilderProps) {
  const [contractType, setContractType] = useState(initialData?.type || 'blue_form');
  const [templateName, setTemplateName] = useState(initialData?.name || '');
  const [templateDescription, setTemplateDescription] = useState(initialData?.description || '');
  const [sections, setSections] = useState(() => {
    if (initialData?.sections) return initialData.sections;
    
    // Filter sections based on contract type
    const filteredSections = Object.fromEntries(
      Object.entries(RIAI_CONTRACT_SECTIONS).filter(([key, section]) => 
        section.applicableTo.includes(contractType)
      )
    );
    return filteredSections;
  });
  
  const [contractSettings, setContractSettings] = useState(initialData?.contractSettings || {
    riaiEdition: '2017',
    contractCurrency: 'EUR',
    governingLaw: 'Irish Law',
    jurisdiction: 'Irish Courts',
    languageVersion: 'English',
    includeVariationsProcedure: true,
    includeExtensionOfTime: true,
    includeLiquidatedDamages: true
  });
  
  const [financialSettings, setFinancialSettings] = useState(initialData?.financialSettings || {
    retentionPercentage: 5,
    retentionLimit: 50000,
    interestRate: 8, // ECB rate + margin
    paymentPeriod: 17, // days as per Construction Contracts Act
    finalAccountPeriod: 56, // 8 weeks
    releasePeriod: 49 // 7 weeks after practical completion
  });
  
  const [timeSettings, setTimeSettings] = useState(initialData?.timeSettings || {
    liquidatedDamagesAmount: '',
    defectsLiabilityPeriod: 12, // months
    practicalCompletionNotice: 7, // days
    extensionOfTimeProcedure: 'fair_and_reasonable',
    workingHours: 'standard_construction',
    holidayPeriods: true
  });
  
  const [insuranceSettings, setInsuranceSettings] = useState(initialData?.insuranceSettings || {
    publicLiabilityAmount: 6500000,
    employersLiabilityAmount: 13000000,
    professionalIndemnityAmount: 2000000,
    worksInsurance: 'contractor_responsibility',
    performanceBondPercentage: 10,
    retentionBondOption: true
  });

  // Update sections when contract type changes
  React.useEffect(() => {
    const filteredSections = Object.fromEntries(
      Object.entries(RIAI_CONTRACT_SECTIONS).filter(([key, section]) => 
        section.applicableTo.includes(contractType)
      )
    );
    setSections(filteredSections);
  }, [contractType]);

  const handleSectionToggle = (sectionKey: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        included: !prev[sectionKey].included
      }
    }));
  };

  const handleSave = () => {
    const templateData = {
      name: templateName,
      description: templateDescription,
      type: contractType,
      riaiVersion: RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].version,
      sections,
      contractSettings,
      financialSettings,
      timeSettings,
      insuranceSettings,
      standardConditions: RIAI_STANDARD_CONDITIONS,
      projectId,
      createdAt: new Date().toISOString(),
      version: '1.0',
      legalBasis: RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].legalBasis,
      contractCategory: 'RIAI_Official'
    };

    if (onSave) {
      onSave(templateData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">RIAI Contract Template Builder</h2>
            <p className="text-gray-600 mt-1">Create official RIAI standardized building contracts</p>
          </div>
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Template
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., RIAI Blue Form - Residential Development"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RIAI Contract Type</label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(RIAI_CONTRACT_TYPES).map(([key, type]) => (
                <option key={key} value={key}>{type.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the specific use case for this RIAI contract template"
          />
        </div>
      </div>

      {/* RIAI Contract Type Info */}
      {contractType && (
        <div className="p-6 bg-blue-50 border-b">
          <div className="flex items-center gap-3 mb-3">
            {RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].icon}
            <h3 className="font-semibold text-blue-900">
              {RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].fullName}
            </h3>
            <span className="px-2 py-1 text-xs font-medium bg-blue-200 text-blue-800 rounded-full">
              {RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].version}
            </span>
          </div>
          <p className="text-blue-800 mb-3">{RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Est. Time: {RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Complexity: {RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].complexity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Official RIAI Form</span>
            </div>
          </div>
          <div className="bg-blue-100 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Suitable for:</strong> {RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].suitableFor}
            </p>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        {/* Contract Sections */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RIAI Contract Sections</h3>
          <div className="space-y-4">
            {Object.entries(sections).map(([sectionKey, section]) => (
              <div key={sectionKey} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={section.included !== false}
                      onChange={() => handleSectionToggle(sectionKey)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                    {section.required && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Required
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      RIAI Standard
                    </span>
                  </div>
                </div>
                
                {section.included !== false && (
                  <div className="ml-7">
                    <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Financial Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Terms (RIAI Standard)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Percentage</label>
              <div className="relative">
                <input
                  type="number"
                  value={financialSettings.retentionPercentage}
                  onChange={(e) => setFinancialSettings(prev => ({ ...prev, retentionPercentage: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  max="10"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Limit (€)</label>
              <input
                type="number"
                value={financialSettings.retentionLimit}
                onChange={(e) => setFinancialSettings(prev => ({ ...prev, retentionLimit: parseInt(e.target.value) || 0 }))}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Period (days)</label>
              <select
                value={financialSettings.paymentPeriod}
                onChange={(e) => setFinancialSettings(prev => ({ ...prev, paymentPeriod: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="17">17 days (Construction Contracts Act)</option>
                <option value="21">21 days</option>
                <option value="28">28 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate on Late Payment</label>
              <div className="relative">
                <input
                  type="number"
                  value={financialSettings.interestRate}
                  onChange={(e) => setFinancialSettings(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  max="20"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">% p.a.</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Final Account Period (days)</label>
              <input
                type="number"
                value={financialSettings.finalAccountPeriod}
                onChange={(e) => setFinancialSettings(prev => ({ ...prev, finalAccountPeriod: parseInt(e.target.value) || 0 }))}
                min="28"
                max="90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Release Period (days)</label>
              <input
                type="number"
                value={financialSettings.releasePeriod}
                onChange={(e) => setFinancialSettings(prev => ({ ...prev, releasePeriod: parseInt(e.target.value) || 0 }))}
                min="28"
                max="90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Time Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Provisions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Defects Liability Period</label>
              <div className="relative">
                <input
                  type="number"
                  value={timeSettings.defectsLiabilityPeriod}
                  onChange={(e) => setTimeSettings(prev => ({ ...prev, defectsLiabilityPeriod: parseInt(e.target.value) || 0 }))}
                  min="6"
                  max="24"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">months</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Practical Completion Notice</label>
              <div className="relative">
                <input
                  type="number"
                  value={timeSettings.practicalCompletionNotice}
                  onChange={(e) => setTimeSettings(prev => ({ ...prev, practicalCompletionNotice: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="28"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extension of Time Procedure</label>
              <select
                value={timeSettings.extensionOfTimeProcedure}
                onChange={(e) => setTimeSettings(prev => ({ ...prev, extensionOfTimeProcedure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fair_and_reasonable">Fair and Reasonable</option>
                <option value="critical_path">Critical Path Analysis</option>
                <option value="time_impact">Time Impact Analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
              <select
                value={timeSettings.workingHours}
                onChange={(e) => setTimeSettings(prev => ({ ...prev, workingHours: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="standard_construction">08:00-18:00 Mon-Fri, 08:00-13:00 Sat</option>
                <option value="extended_hours">07:00-20:00 Mon-Fri, 08:00-17:00 Sat</option>
                <option value="restricted_hours">09:00-17:00 Mon-Fri only</option>
                <option value="custom">Custom Hours (to be specified)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Liquidated Damages</label>
              <input
                type="text"
                value={timeSettings.liquidatedDamagesAmount}
                onChange={(e) => setTimeSettings(prev => ({ ...prev, liquidatedDamagesAmount: e.target.value }))}
                placeholder="€ per day/week"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={timeSettings.holidayPeriods}
                  onChange={(e) => setTimeSettings(prev => ({ ...prev, holidayPeriods: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Account for Holiday Periods</span>
              </label>
            </div>
          </div>
        </div>

        {/* Insurance Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance and Bonds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Public Liability (€)</label>
              <select
                value={insuranceSettings.publicLiabilityAmount}
                onChange={(e) => setInsuranceSettings(prev => ({ ...prev, publicLiabilityAmount: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2600000">€2.6 million</option>
                <option value="6500000">€6.5 million (Standard)</option>
                <option value="13000000">€13 million</option>
                <option value="26000000">€26 million</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employers Liability (€)</label>
              <select
                value={insuranceSettings.employersLiabilityAmount}
                onChange={(e) => setInsuranceSettings(prev => ({ ...prev, employersLiabilityAmount: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="6500000">€6.5 million</option>
                <option value="13000000">€13 million (Standard)</option>
                <option value="26000000">€26 million</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Indemnity (€)</label>
              <select
                value={insuranceSettings.professionalIndemnityAmount}
                onChange={(e) => setInsuranceSettings(prev => ({ ...prev, professionalIndemnityAmount: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1000000">€1 million</option>
                <option value="2000000">€2 million (Standard)</option>
                <option value="5000000">€5 million</option>
                <option value="10000000">€10 million</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Works Insurance</label>
              <select
                value={insuranceSettings.worksInsurance}
                onChange={(e) => setInsuranceSettings(prev => ({ ...prev, worksInsurance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="contractor_responsibility">Contractor Responsibility</option>
                <option value="employer_arranged">Employer Arranged</option>
                <option value="joint_names">Joint Names Policy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performance Bond</label>
              <div className="relative">
                <input
                  type="number"
                  value={insuranceSettings.performanceBondPercentage}
                  onChange={(e) => setInsuranceSettings(prev => ({ ...prev, performanceBondPercentage: parseInt(e.target.value) || 0 }))}
                  min="0"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={insuranceSettings.retentionBondOption}
                  onChange={(e) => setInsuranceSettings(prev => ({ ...prev, retentionBondOption: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Retention Bond Option</span>
              </label>
            </div>
          </div>
        </div>

        {/* Standard Conditions Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RIAI Standard Conditions (Included)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(RIAI_STANDARD_CONDITIONS).map(([categoryKey, conditions]) => (
              <div key={categoryKey} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 capitalize">
                  {categoryKey.replace('_', ' ')} Conditions
                </h4>
                <div className="space-y-2">
                  {conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Official RIAI Template</p>
              <p className="text-xs text-blue-700">
                This template is based on the official RIAI {RIAI_CONTRACT_TYPES[contractType as keyof typeof RIAI_CONTRACT_TYPES].version} forms.
                Ensure compliance with current RIAI standards and Irish construction law.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!templateName}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save RIAI Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}