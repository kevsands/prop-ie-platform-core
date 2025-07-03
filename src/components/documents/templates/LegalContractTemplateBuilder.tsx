'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  AlertTriangle,
  Building2,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Scale,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Home,
  MapPin,
  CreditCard,
  Clock,
  Star
} from 'lucide-react';

// Legal Contract Types for Irish Property Law
const CONTRACT_TYPES = {
  sale_house: {
    name: 'Contract for Sale - New House',
    description: 'Standard sale contract for new build houses in Ireland',
    icon: <Home className="w-5 h-5" />,
    complexity: 'Medium',
    estimatedTime: '20-30 minutes',
    lawBasis: 'Irish Property Law & Sale of Goods and Supply of Services Act 1980'
  },
  sale_apartment: {
    name: 'Contract for Sale - Apartment',
    description: 'Sale contract for apartments with management company provisions',
    icon: <Building2 className="w-5 h-5" />,
    complexity: 'High',
    estimatedTime: '25-35 minutes',
    lawBasis: 'Irish Property Law & Multi-Unit Developments Act 2011'
  },
  off_plan_sale: {
    name: 'Off-Plan Sale Contract',
    description: 'Contract for sale of property before completion',
    icon: <FileText className="w-5 h-5" />,
    complexity: 'High',
    estimatedTime: '30-40 minutes',
    lawBasis: 'Irish Property Law & European Communities Regulations'
  },
  reservation_agreement: {
    name: 'Reservation Agreement',
    description: 'Agreement to reserve property pending contract execution',
    icon: <Calendar className="w-5 h-5" />,
    complexity: 'Low',
    estimatedTime: '15-20 minutes',
    lawBasis: 'Contract Law & Real Property Act'
  },
  completion_agreement: {
    name: 'Completion Agreement',
    description: 'Agreement for final completion and handover',
    icon: <CheckCircle className="w-5 h-5" />,
    complexity: 'Medium',
    estimatedTime: '20-25 minutes',
    lawBasis: 'Irish Property Law & Building Control Regulations'
  }
};

// Standard Contract Clauses for Irish Property Sales
const STANDARD_CLAUSES = {
  parties: {
    title: 'Parties to the Contract',
    required: true,
    description: 'Define vendor and purchaser details',
    fields: [
      'Vendor Full Legal Name',
      'Vendor Address',
      'Vendor Legal Capacity',
      'Purchaser Full Legal Name(s)',
      'Purchaser Address',
      'Purchaser Legal Capacity',
      'Joint Purchaser Details (if applicable)'
    ]
  },
  property_description: {
    title: 'Property Description',
    required: true,
    description: 'Detailed description of the property being sold',
    fields: [
      'Property Address',
      'Folio Number',
      'Property Type',
      'Floor Area (sq.m)',
      'Site Area (if applicable)',
      'Boundaries Description',
      'Easements and Rights',
      'Planning Permission Details'
    ]
  },
  purchase_terms: {
    title: 'Purchase Price & Payment Terms',
    required: true,
    description: 'Financial terms of the sale',
    fields: [
      'Purchase Price',
      'Deposit Amount',
      'Deposit Payment Date',
      'Balance Payment Terms',
      'Method of Payment',
      'Interest on Late Payment',
      'Apportionment of Charges'
    ]
  },
  conditions_precedent: {
    title: 'Conditions Precedent',
    required: true,
    description: 'Conditions that must be satisfied before completion',
    fields: [
      'Mortgage Approval Condition',
      'Planning Permission Condition',
      'Building Control Approval',
      'Title Investigation Period',
      'Survey Condition',
      'Insurance Availability'
    ]
  },
  completion_provisions: {
    title: 'Completion Provisions',
    required: true,
    description: 'Terms relating to completion of the sale',
    fields: [
      'Completion Date',
      'Time for Completion',
      'Completion Location',
      'Documents for Completion',
      'Keys Handover',
      'Vacant Possession',
      'Risk Transfer'
    ]
  },
  warranties_representations: {
    title: 'Warranties & Representations',
    required: true,
    description: 'Vendor warranties and representations',
    fields: [
      'Title Warranty',
      'Planning Compliance',
      'Building Regulations Compliance',
      'No Adverse Notices',
      'Structural Warranty',
      'Environmental Warranties',
      'Defects Liability Period'
    ]
  },
  special_conditions: {
    title: 'Special Conditions',
    required: false,
    description: 'Property-specific or transaction-specific conditions',
    fields: [
      'Fixtures and Fittings',
      'Appliances Included',
      'Management Company Provisions',
      'Service Charges',
      'Parking Provisions',
      'Storage Facilities'
    ]
  },
  legal_provisions: {
    title: 'Legal Provisions',
    required: true,
    description: 'Standard legal clauses and provisions',
    fields: [
      'Governing Law',
      'Jurisdiction Clause',
      'Entire Agreement Clause',
      'Amendment Provisions',
      'Notices Provisions',
      'Counterpart Execution',
      'Severability Clause'
    ]
  }
};

// Irish Property Law Compliance Requirements
const IRISH_COMPLIANCE = {
  building_regulations: {
    title: 'Building Regulations Compliance',
    items: [
      'Building Control Certificate',
      'Commencement Notice',
      'Certificate of Compliance on Completion',
      'Fire Safety Certificate',
      'Disability Access Certificate'
    ]
  },
  planning_requirements: {
    title: 'Planning Requirements',
    items: [
      'Planning Permission Grant',
      'Compliance with Planning Conditions',
      'Development Contributions Paid',
      'As-Built Plans Match Permission',
      'Part V Social Housing Compliance'
    ]
  },
  title_requirements: {
    title: 'Title Requirements',
    items: [
      'Good Marketable Title',
      'Land Registry Compliant',
      'No Outstanding Charges',
      'Rights of Way Properly Granted',
      'Boundary Disputes Resolved'
    ]
  },
  consumer_protection: {
    title: 'Consumer Protection',
    items: [
      'Consumer Rights Information',
      'Cooling-off Period (if applicable)',
      'Unfair Terms Protection',
      'Building Energy Rating',
      'Property Services Regulatory Authority Compliance'
    ]
  }
};

interface LegalContractTemplateBuilderProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  projectId?: string;
}

export default function LegalContractTemplateBuilder({
  initialData,
  onSave,
  onCancel,
  projectId
}: LegalContractTemplateBuilderProps) {
  const [contractType, setContractType] = useState(initialData?.type || 'sale_house');
  const [templateName, setTemplateName] = useState(initialData?.name || '');
  const [templateDescription, setTemplateDescription] = useState(initialData?.description || '');
  const [clauses, setClauses] = useState(() => {
    if (initialData?.clauses) return initialData.clauses;
    return { ...STANDARD_CLAUSES };
  });
  
  const [customClauses, setCustomClauses] = useState(initialData?.customClauses || []);
  const [complianceSettings, setComplianceSettings] = useState(initialData?.compliance || {
    buildingRegulations: true,
    planningCompliance: true,
    titleRequirements: true,
    consumerProtection: true
  });
  
  const [warrantiesSettings, setWarrantiesSettings] = useState(initialData?.warranties || {
    structuralWarranty: { included: true, period: '6 years', provider: 'Homebond' },
    defectsLiability: { included: true, period: '12 months' },
    applianceWarranties: { included: true, period: '24 months' },
    professionalIndemnity: { included: true, coverage: '€1,000,000' }
  });
  
  const [completionSettings, setCompletionSettings] = useState(initialData?.completion || {
    noticePeriod: 21, // days
    timeEssential: true,
    vacantPossession: true,
    keyHandoverLocation: 'Property',
    completionTime: '14:00'
  });

  const [financialSettings, setFinancialSettings] = useState(initialData?.financial || {
    depositPercentage: 10,
    interestRate: 8, // per annum on late payment
    apportionmentDate: 'completion',
    managementCharges: true,
    serviceCharges: true
  });

  const handleClauseToggle = (clauseKey: string) => {
    setClauses(prev => ({
      ...prev,
      [clauseKey]: {
        ...prev[clauseKey],
        included: !prev[clauseKey].included
      }
    }));
  };

  const addCustomClause = () => {
    setCustomClauses(prev => [...prev, {
      title: '',
      description: '',
      content: '',
      required: false,
      category: 'special'
    }]);
  };

  const updateCustomClause = (index: number, field: string, value: any) => {
    setCustomClauses(prev => prev.map((clause, i) => 
      i === index ? { ...clause, [field]: value } : clause
    ));
  };

  const removeCustomClause = (index: number) => {
    setCustomClauses(prev => prev.filter((_, i) => i !== index));
  };

  const updateWarrantySetting = (warrantyType: string, field: string, value: any) => {
    setWarrantiesSettings(prev => ({
      ...prev,
      [warrantyType]: {
        ...prev[warrantyType],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    const templateData = {
      name: templateName,
      description: templateDescription,
      type: contractType,
      clauses,
      customClauses,
      compliance: complianceSettings,
      warranties: warrantiesSettings,
      completion: completionSettings,
      financial: financialSettings,
      projectId,
      createdAt: new Date().toISOString(),
      version: '1.0',
      lawBasis: CONTRACT_TYPES[contractType as keyof typeof CONTRACT_TYPES].lawBasis
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
            <h2 className="text-2xl font-bold text-gray-900">Legal Contract Template Builder</h2>
            <p className="text-gray-600 mt-1">Create compliant legal contracts for Irish property sales</p>
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
              placeholder="e.g., Standard House Sale Contract - Residential Development"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(CONTRACT_TYPES).map(([key, type]) => (
                <option key={key} value={key}>{type.name}</option>
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
            placeholder="Describe the purpose and specific use case for this contract template"
          />
        </div>
      </div>

      {/* Contract Type Info */}
      {contractType && (
        <div className="p-6 bg-blue-50 border-b">
          <div className="flex items-center gap-3 mb-3">
            {CONTRACT_TYPES[contractType as keyof typeof CONTRACT_TYPES].icon}
            <h3 className="font-semibold text-blue-900">
              {CONTRACT_TYPES[contractType as keyof typeof CONTRACT_TYPES].name}
            </h3>
          </div>
          <p className="text-blue-800 mb-3">{CONTRACT_TYPES[contractType as keyof typeof CONTRACT_TYPES].description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Est. Time: {CONTRACT_TYPES[contractType as keyof typeof CONTRACT_TYPES].estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Complexity: {CONTRACT_TYPES[contractType as keyof typeof CONTRACT_TYPES].complexity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Legal Basis: Irish Property Law</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        {/* Standard Contract Clauses */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Contract Clauses</h3>
          <div className="space-y-4">
            {Object.entries(clauses).map(([clauseKey, clause]) => (
              <div key={clauseKey} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={clause.included !== false}
                      onChange={() => handleClauseToggle(clauseKey)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <h4 className="font-medium text-gray-900">{clause.title}</h4>
                    {clause.required && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                </div>
                
                {clause.included !== false && (
                  <div className="ml-7">
                    <p className="text-sm text-gray-600 mb-3">{clause.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {clause.fields.map((field, fieldIndex) => (
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

        {/* Irish Compliance Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Irish Legal Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(IRISH_COMPLIANCE).map(([key, section]) => (
              <div key={key} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3">{section.title}</h4>
                <div className="space-y-2">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Percentage</label>
              <div className="relative">
                <input
                  type="number"
                  value={financialSettings.depositPercentage}
                  onChange={(e) => setFinancialSettings(prev => ({ ...prev, depositPercentage: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Late Payment Interest</label>
              <div className="relative">
                <input
                  type="number"
                  value={financialSettings.interestRate}
                  onChange={(e) => setFinancialSettings(prev => ({ ...prev, interestRate: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">% p.a.</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apportionment Date</label>
              <select
                value={financialSettings.apportionmentDate}
                onChange={(e) => setFinancialSettings(prev => ({ ...prev, apportionmentDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="completion">Completion Date</option>
                <option value="contract">Contract Date</option>
                <option value="possession">Possession Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Warranty Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Warranty & Liability Settings</h3>
          <div className="space-y-4">
            {Object.entries(warrantiesSettings).map(([warrantyKey, warranty]) => (
              <div key={warrantyKey} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={warranty.included}
                      onChange={(e) => updateWarrantySetting(warrantyKey, 'included', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <h4 className="font-medium text-gray-900">
                      {warrantyKey === 'structuralWarranty' && 'Structural Warranty'}
                      {warrantyKey === 'defectsLiability' && 'Defects Liability Period'}
                      {warrantyKey === 'applianceWarranties' && 'Appliance Warranties'}
                      {warrantyKey === 'professionalIndemnity' && 'Professional Indemnity Insurance'}
                    </h4>
                  </div>
                </div>
                
                {warranty.included && (
                  <div className="ml-7 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {warranty.period && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                        <input
                          type="text"
                          value={warranty.period}
                          onChange={(e) => updateWarrantySetting(warrantyKey, 'period', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                    {warranty.provider && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                        <select
                          value={warranty.provider}
                          onChange={(e) => updateWarrantySetting(warrantyKey, 'provider', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Homebond">Homebond</option>
                          <option value="Premier Guarantee">Premier Guarantee</option>
                          <option value="Custom Insurance">Custom Insurance</option>
                        </select>
                      </div>
                    )}
                    {warranty.coverage && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
                        <input
                          type="text"
                          value={warranty.coverage}
                          onChange={(e) => updateWarrantySetting(warrantyKey, 'coverage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Completion Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period (days)</label>
              <input
                type="number"
                value={completionSettings.noticePeriod}
                onChange={(e) => setCompletionSettings(prev => ({ ...prev, noticePeriod: parseInt(e.target.value) || 0 }))}
                min="1"
                max="90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Completion Time</label>
              <input
                type="time"
                value={completionSettings.completionTime}
                onChange={(e) => setCompletionSettings(prev => ({ ...prev, completionTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Handover Location</label>
              <select
                value={completionSettings.keyHandoverLocation}
                onChange={(e) => setCompletionSettings(prev => ({ ...prev, keyHandoverLocation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Property">At Property</option>
                <option value="Solicitor">Solicitor's Office</option>
                <option value="Developer">Developer's Office</option>
                <option value="Other">Other Location</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={completionSettings.timeEssential}
                    onChange={(e) => setCompletionSettings(prev => ({ ...prev, timeEssential: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Time Essential</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={completionSettings.vacantPossession}
                    onChange={(e) => setCompletionSettings(prev => ({ ...prev, vacantPossession: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Vacant Possession</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Clauses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Custom Clauses</h3>
            <button
              onClick={addCustomClause}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Custom Clause
            </button>
          </div>
          
          {customClauses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-8 w-8 mb-2" />
              <p>No custom clauses added yet. Add clauses specific to your project needs.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customClauses.map((clause, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Clause Title</label>
                      <input
                        type="text"
                        value={clause.title}
                        onChange={(e) => updateCustomClause(index, 'title', e.target.value)}
                        placeholder="e.g., Management Company Obligations"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={clause.category}
                        onChange={(e) => updateCustomClause(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="special">Special Conditions</option>
                        <option value="warranty">Warranty Related</option>
                        <option value="completion">Completion Related</option>
                        <option value="financial">Financial</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={clause.description}
                      onChange={(e) => updateCustomClause(index, 'description', e.target.value)}
                      placeholder="Brief description of this clause"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clause Content</label>
                    <textarea
                      value={clause.content}
                      onChange={(e) => updateCustomClause(index, 'content', e.target.value)}
                      rows={4}
                      placeholder="Enter the legal text for this clause"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={clause.required}
                        onChange={(e) => updateCustomClause(index, 'required', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Required Clause</span>
                    </label>
                    <button
                      onClick={() => removeCustomClause(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Legal Notice</p>
              <p className="text-xs text-amber-700">
                This template should be reviewed by qualified legal counsel before use. 
                Laws and regulations may change, and specific circumstances may require additional provisions.
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
              Save Contract Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}