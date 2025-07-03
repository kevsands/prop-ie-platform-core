'use client';

import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';

// RFP Template Types for Irish Construction Industry
const RFP_TYPES = {
  main_contractor: {
    name: 'Main Contractor RFP',
    description: 'Comprehensive RFP for selecting main building contractors',
    icon: <Building2 className="w-5 h-5" />,
    estimatedDuration: '45-60 minutes',
    complexity: 'High'
  },
  subcontractor: {
    name: 'Subcontractor RFP',
    description: 'Specialized RFP for trade subcontractors',
    icon: <Users className="w-5 h-5" />,
    estimatedDuration: '30-40 minutes',
    complexity: 'Medium'
  },
  professional_services: {
    name: 'Professional Services RFP',
    description: 'RFP for architects, engineers, and consultants',
    icon: <Award className="w-5 h-5" />,
    estimatedDuration: '35-45 minutes',
    complexity: 'Medium'
  },
  supplier: {
    name: 'Material Supplier RFP',
    description: 'RFP for material and equipment suppliers',
    icon: <ClipboardList className="w-5 h-5" />,
    estimatedDuration: '20-30 minutes',
    complexity: 'Low'
  },
  specialist_trade: {
    name: 'Specialist Trade RFP',
    description: 'RFP for specialized construction trades',
    icon: <Shield className="w-5 h-5" />,
    estimatedDuration: '25-35 minutes',
    complexity: 'Medium'
  }
};

// Standard RFP Sections for Irish Construction
const STANDARD_RFP_SECTIONS = {
  project_overview: {
    title: 'Project Overview',
    required: true,
    fields: [
      'Project Name',
      'Project Location',
      'Project Type',
      'Project Value Range',
      'Project Duration',
      'Key Project Dates'
    ]
  },
  scope_of_works: {
    title: 'Scope of Works',
    required: true,
    fields: [
      'Detailed Scope Description',
      'Work Packages',
      'Deliverables',
      'Performance Standards',
      'Quality Requirements',
      'Materials Specifications'
    ]
  },
  company_information: {
    title: 'Company Information Requirements',
    required: true,
    fields: [
      'Company Registration Details',
      'Tax Clearance Certificate',
      'Professional Indemnity Insurance',
      'Public Liability Insurance',
      'Health & Safety Records',
      'CIRI Registration (if applicable)'
    ]
  },
  financial_requirements: {
    title: 'Financial Requirements',
    required: true,
    fields: [
      'Annual Accounts (3 years)',
      'Audited Financial Statements',
      'Bank References',
      'Bonding Capacity',
      'Credit Rating',
      'Turnover Requirements'
    ]
  },
  technical_experience: {
    title: 'Technical Experience',
    required: true,
    fields: [
      'Relevant Project Experience',
      'Project References',
      'Technical Capabilities',
      'Quality Certifications',
      'Innovation Track Record',
      'Sustainability Experience'
    ]
  },
  health_safety: {
    title: 'Health & Safety',
    required: true,
    fields: [
      'Safety Management System',
      'OHSAS 18001/ISO 45001 Certification',
      'Safety Performance Record',
      'Training Programs',
      'Site Safety Procedures',
      'Emergency Response Plans'
    ]
  },
  environmental: {
    title: 'Environmental Requirements',
    required: false,
    fields: [
      'Environmental Management System',
      'ISO 14001 Certification',
      'Waste Management Plans',
      'Carbon Footprint Reduction',
      'Sustainable Construction Practices',
      'BREEAM/LEED Experience'
    ]
  },
  pricing_commercial: {
    title: 'Pricing & Commercial Terms',
    required: true,
    fields: [
      'Pricing Structure',
      'Payment Terms',
      'Variation Procedures',
      'Retention Terms',
      'Performance Guarantees',
      'Contract Duration'
    ]
  }
};

interface RFPTemplateBuilderProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  projectId?: string;
}

export default function RFPTemplateBuilder({
  initialData,
  onSave,
  onCancel,
  projectId
}: RFPTemplateBuilderProps) {
  const [rfpType, setRfpType] = useState(initialData?.type || 'main_contractor');
  const [templateName, setTemplateName] = useState(initialData?.name || '');
  const [templateDescription, setTemplateDescription] = useState(initialData?.description || '');
  const [sections, setSections] = useState(() => {
    if (initialData?.sections) return initialData.sections;
    
    // Default sections based on RFP type
    const defaultSections = { ...STANDARD_RFP_SECTIONS };
    return defaultSections;
  });
  
  const [customFields, setCustomFields] = useState(initialData?.customFields || []);
  const [evaluationCriteria, setEvaluationCriteria] = useState(initialData?.evaluationCriteria || [
    { criteria: 'Technical Capability', weight: 30 },
    { criteria: 'Financial Stability', weight: 20 },
    { criteria: 'Health & Safety Record', weight: 20 },
    { criteria: 'Price Competitiveness', weight: 20 },
    { criteria: 'Project Experience', weight: 10 }
  ]);
  
  const [timelineSettings, setTimelineSettings] = useState(initialData?.timeline || {
    submissionDeadline: '',
    clarificationDeadline: '',
    evaluationPeriod: 14,
    contractAwardDate: ''
  });

  const [irishCompliance, setIrishCompliance] = useState(initialData?.irishCompliance || {
    taxClearance: true,
    rct: true, // Relevant Contracts Tax
    vatRegistration: true,
    professionalIndemnity: true,
    publicLiability: true,
    employersLiability: true
  });

  const handleSectionToggle = (sectionKey: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        included: !prev[sectionKey].included
      }
    }));
  };

  const handleSectionFieldUpdate = (sectionKey: string, fieldIndex: number, newValue: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        fields: prev[sectionKey].fields.map((field, index) => 
          index === fieldIndex ? newValue : field
        )
      }
    }));
  };

  const addCustomField = () => {
    setCustomFields(prev => [...prev, { name: '', type: 'text', required: false, description: '' }]);
  };

  const updateCustomField = (index: number, field: string, value: any) => {
    setCustomFields(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeCustomField = (index: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateEvaluationCriteria = (index: number, field: string, value: any) => {
    setEvaluationCriteria(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addEvaluationCriteria = () => {
    setEvaluationCriteria(prev => [...prev, { criteria: '', weight: 0 }]);
  };

  const removeEvaluationCriteria = (index: number) => {
    setEvaluationCriteria(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const templateData = {
      name: templateName,
      description: templateDescription,
      type: rfpType,
      sections,
      customFields,
      evaluationCriteria,
      timeline: timelineSettings,
      irishCompliance,
      projectId,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };

    if (onSave) {
      onSave(templateData);
    }
  };

  const totalWeight = evaluationCriteria.reduce((sum, criteria) => sum + (criteria.weight || 0), 0);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">RFP Template Builder</h2>
            <p className="text-gray-600 mt-1">Create professional RFP templates for Irish construction projects</p>
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
              placeholder="e.g., Main Contractor RFP - Residential Development"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RFP Type</label>
            <select
              value={rfpType}
              onChange={(e) => setRfpType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(RFP_TYPES).map(([key, type]) => (
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
            placeholder="Describe the purpose and scope of this RFP template"
          />
        </div>
      </div>

      {/* RFP Type Info */}
      {rfpType && (
        <div className="p-6 bg-blue-50 border-b">
          <div className="flex items-center gap-3 mb-3">
            {RFP_TYPES[rfpType as keyof typeof RFP_TYPES].icon}
            <h3 className="font-semibold text-blue-900">
              {RFP_TYPES[rfpType as keyof typeof RFP_TYPES].name}
            </h3>
          </div>
          <p className="text-blue-800 mb-2">{RFP_TYPES[rfpType as keyof typeof RFP_TYPES].description}</p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Est. Time: {RFP_TYPES[rfpType as keyof typeof RFP_TYPES].estimatedDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Complexity: {RFP_TYPES[rfpType as keyof typeof RFP_TYPES].complexity}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        {/* Standard Sections */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard RFP Sections</h3>
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
                  </div>
                </div>
                
                {section.included !== false && (
                  <div className="ml-7">
                    <p className="text-sm text-gray-600 mb-3">Fields included in this section:</p>
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

        {/* Irish Compliance Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Irish Compliance Requirements</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 mb-4">Ensure compliance with Irish construction and tax regulations:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(irishCompliance).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setIrishCompliance(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    {key === 'taxClearance' && 'Tax Clearance Certificate'}
                    {key === 'rct' && 'RCT (Relevant Contracts Tax)'}
                    {key === 'vatRegistration' && 'VAT Registration'}
                    {key === 'professionalIndemnity' && 'Professional Indemnity Insurance'}
                    {key === 'publicLiability' && 'Public Liability Insurance'}
                    {key === 'employersLiability' && 'Employers Liability Insurance'}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Evaluation Criteria</h3>
            <button
              onClick={addEvaluationCriteria}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Criteria
            </button>
          </div>
          
          <div className="space-y-3">
            {evaluationCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  value={criteria.criteria}
                  onChange={(e) => updateEvaluationCriteria(index, 'criteria', e.target.value)}
                  placeholder="Evaluation criteria"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={criteria.weight}
                    onChange={(e) => updateEvaluationCriteria(index, 'weight', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
                <button
                  onClick={() => removeEvaluationCriteria(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Weight:</span>
              <span className={`text-sm font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                {totalWeight}%
              </span>
            </div>
            {totalWeight !== 100 && (
              <p className="text-xs text-red-600 mt-1">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Total weight should equal 100%
              </p>
            )}
          </div>
        </div>

        {/* Timeline Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Submission Deadline</label>
              <input
                type="date"
                value={timelineSettings.submissionDeadline}
                onChange={(e) => setTimelineSettings(prev => ({ ...prev, submissionDeadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clarification Deadline</label>
              <input
                type="date"
                value={timelineSettings.clarificationDeadline}
                onChange={(e) => setTimelineSettings(prev => ({ ...prev, clarificationDeadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Evaluation Period (days)</label>
              <input
                type="number"
                value={timelineSettings.evaluationPeriod}
                onChange={(e) => setTimelineSettings(prev => ({ ...prev, evaluationPeriod: parseInt(e.target.value) || 0 }))}
                min="1"
                max="90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contract Award Date</label>
              <input
                type="date"
                value={timelineSettings.contractAwardDate}
                onChange={(e) => setTimelineSettings(prev => ({ ...prev, contractAwardDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Custom Fields */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Custom Fields</h3>
            <button
              onClick={addCustomField}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Custom Field
            </button>
          </div>
          
          {customFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-8 w-8 mb-2" />
              <p>No custom fields added yet. Add fields specific to your project needs.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customFields.map((field, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateCustomField(index, 'name', e.target.value)}
                        placeholder="e.g., Previous Irish Projects"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateCustomField(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="text">Text Input</option>
                        <option value="textarea">Text Area</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="file">File Upload</option>
                        <option value="select">Dropdown</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateCustomField(index, 'required', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Required</span>
                      </label>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeCustomField(index)}
                        className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description/Instructions</label>
                    <textarea
                      value={field.description}
                      onChange={(e) => updateCustomField(index, 'description', e.target.value)}
                      rows={2}
                      placeholder="Provide instructions or description for this field"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
          <div>
            <p className="text-sm text-gray-600">
              This template will be saved with version 1.0 and can be edited later.
            </p>
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
              disabled={!templateName || totalWeight !== 100}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save RFP Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}