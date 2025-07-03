'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Save, 
  AlertTriangle,
  Building2,
  Users,
  Calendar,
  MapPin,
  FileCheck,
  Scale,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Globe,
  TreePine,
  Zap,
  Car,
  Accessibility,
  Clock,
  Star,
  Info
} from 'lucide-react';

// Authorization Types for Irish Regulatory System
const AUTHORIZATION_TYPES = {
  planning_permission: {
    name: 'Planning Permission Application',
    description: 'Application for planning permission under the Planning & Development Act 2000',
    icon: <Building2 className="w-5 h-5" />,
    authority: 'Local Planning Authority',
    complexity: 'High',
    estimatedTime: '60-90 minutes',
    legislationBasis: 'Planning and Development Act 2000 & Planning and Development Regulations 2001'
  },
  building_control: {
    name: 'Building Control Application',
    description: 'Application for building control compliance under Building Regulations',
    icon: <FileCheck className="w-5 h-5" />,
    authority: 'Building Control Authority',
    complexity: 'Medium',
    estimatedTime: '45-60 minutes',
    legislationBasis: 'Building Control Act 1990 & Building Regulations 1997-2022'
  },
  fire_safety: {
    name: 'Fire Safety Certificate',
    description: 'Application for Fire Safety Certificate for buildings',
    icon: <Shield className="w-5 h-5" />,
    authority: 'Building Control Authority',
    complexity: 'High',
    estimatedTime: '75-90 minutes',
    legislationBasis: 'Building Control Act 1990 & Building Regulations Part B'
  },
  disability_access: {
    name: 'Disability Access Certificate',
    description: 'Certificate for compliance with disability access requirements',
    icon: <Accessibility className="w-5 h-5" />,
    authority: 'Building Control Authority',
    complexity: 'Medium',
    estimatedTime: '30-45 minutes',
    legislationBasis: 'Building Regulations Part M & Disability Act 2005'
  },
  environmental_impact: {
    name: 'Environmental Impact Assessment',
    description: 'Environmental impact assessment for development projects',
    icon: <TreePine className="w-5 h-5" />,
    authority: 'Environmental Protection Agency',
    complexity: 'Very High',
    estimatedTime: '120-180 minutes',
    legislationBasis: 'Planning and Development Act 2000 & EIA Directive 2011/92/EU'
  }
};

// Standard Application Sections for Irish Regulatory Applications
const STANDARD_SECTIONS = {
  applicant_details: {
    title: 'Applicant Details',
    required: true,
    description: 'Information about the applicant and authorized agent',
    fields: [
      'Applicant Full Name',
      'Applicant Address',
      'Applicant Contact Details',
      'Agent Details (if applicable)',
      'Agent Authorization Letter',
      'Company Registration (if applicable)',
      'VAT Number (if applicable)'
    ]
  },
  site_details: {
    title: 'Site/Property Details',
    required: true,
    description: 'Detailed information about the development site',
    fields: [
      'Site Address',
      'Folio Number',
      'Site Area (hectares/sq.m)',
      'Current Use',
      'Zoning Designation',
      'Site Boundaries',
      'Access Arrangements',
      'Existing Structures'
    ]
  },
  development_description: {
    title: 'Development Description',
    required: true,
    description: 'Comprehensive description of the proposed development',
    fields: [
      'Nature of Development',
      'Number of Units/Buildings',
      'Gross Floor Area',
      'Building Heights',
      'Density Calculations',
      'Car Parking Provision',
      'Open Space Provision',
      'Landscaping Proposals'
    ]
  },
  technical_details: {
    title: 'Technical Details',
    required: true,
    description: 'Technical aspects and specifications',
    fields: [
      'Structural Design',
      'Services Design',
      'Drainage Design',
      'Access Roads',
      'Site Levels',
      'Construction Methods',
      'Materials Specifications',
      'Energy Performance'
    ]
  },
  supporting_documents: {
    title: 'Supporting Documents',
    required: true,
    description: 'Required supporting documentation',
    fields: [
      'Site Location Map',
      'Existing Site Survey',
      'Proposed Site Plan',
      'Floor Plans',
      'Elevations',
      'Sections',
      'Landscape Plans',
      'Engineering Drawings'
    ]
  },
  environmental_considerations: {
    title: 'Environmental Considerations',
    required: false,
    description: 'Environmental impact and mitigation measures',
    fields: [
      'Environmental Impact Statement',
      'Natura Impact Statement',
      'Flood Risk Assessment',
      'Traffic Impact Assessment',
      'Noise Impact Assessment',
      'Archaeological Assessment',
      'Tree Survey',
      'Biodiversity Assessment'
    ]
  },
  consultation_requirements: {
    title: 'Consultation Requirements',
    required: true,
    description: 'Statutory consultation and public notification',
    fields: [
      'Public Notices',
      'Newspaper Advertisement',
      'Site Notice',
      'Prescribed Bodies Consultation',
      'Submissions Received',
      'Responses to Submissions',
      'Additional Information Requests'
    ]
  },
  compliance_declarations: {
    title: 'Compliance Declarations',
    required: true,
    description: 'Statutory declarations and certifications',
    fields: [
      'Planning Certificate',
      'Building Regulations Certificate',
      'Fire Safety Certificate',
      'Professional Certification',
      'Structural Certification',
      'Services Certification',
      'Quality Assurance Certificate'
    ]
  }
};

// Irish Regulatory Compliance Requirements
const IRISH_REGULATORY_COMPLIANCE = {
  planning_compliance: {
    title: 'Planning Compliance',
    items: [
      'Development Plan Compliance',
      'Local Area Plan Compliance',
      'Regional Planning Guidelines',
      'National Planning Framework',
      'Section 28 Guidelines',
      'Appropriate Assessment Screening'
    ]
  },
  building_standards: {
    title: 'Building Standards',
    items: [
      'Technical Guidance Documents (TGDs)',
      'Building Regulations 1997-2022',
      'Irish Building Standards',
      'European Harmonised Standards',
      'Fire Safety Standards',
      'Accessibility Standards'
    ]
  },
  environmental_standards: {
    title: 'Environmental Standards',
    items: [
      'EU Environmental Directives',
      'EPA Guidelines',
      'Water Framework Directive',
      'Habitats Directive',
      'Birds Directive',
      'Waste Management Regulations'
    ]
  },
  professional_standards: {
    title: 'Professional Standards',
    items: [
      'Engineers Ireland Standards',
      'Royal Institute of Architects Ireland',
      'Society of Chartered Surveyors Ireland',
      'Irish Planning Institute',
      'Construction Industry Federation',
      'Building Standards Advisory Body'
    ]
  }
};

interface AuthorizationTemplateBuilderProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  projectId?: string;
}

export default function AuthorizationTemplateBuilder({
  initialData,
  onSave,
  onCancel,
  projectId
}: AuthorizationTemplateBuilderProps) {
  const [authorizationType, setAuthorizationType] = useState(initialData?.type || 'planning_permission');
  const [templateName, setTemplateName] = useState(initialData?.name || '');
  const [templateDescription, setTemplateDescription] = useState(initialData?.description || '');
  const [sections, setSections] = useState(() => {
    if (initialData?.sections) return initialData.sections;
    return { ...STANDARD_SECTIONS };
  });
  
  const [customRequirements, setCustomRequirements] = useState(initialData?.customRequirements || []);
  const [complianceSettings, setComplianceSettings] = useState(initialData?.compliance || {
    planningCompliance: true,
    buildingStandards: true,
    environmentalStandards: true,
    professionalStandards: true
  });
  
  const [timelineSettings, setTimelineSettings] = useState(initialData?.timeline || {
    preparationTime: 30, // days
    authorityProcessingTime: 56, // 8 weeks standard
    consultationPeriod: 28, // 4 weeks
    appealPeriod: 28, // 4 weeks
    validityPeriod: 1825 // 5 years
  });
  
  const [feeSettings, setFeeSettings] = useState(initialData?.fees || {
    applicationFee: true,
    publicationFee: true,
    additionalFees: [],
    paymentMethod: 'online'
  });

  const [professionalRequirements, setProfessionalRequirements] = useState(initialData?.professional || {
    architectCertification: true,
    engineerCertification: true,
    plannerInvolvement: false,
    surveyorInput: false,
    specialistConsultants: []
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

  const addCustomRequirement = () => {
    setCustomRequirements(prev => [...prev, {
      title: '',
      description: '',
      authority: '',
      mandatory: false,
      estimatedTime: '',
      cost: ''
    }]);
  };

  const updateCustomRequirement = (index: number, field: string, value: any) => {
    setCustomRequirements(prev => prev.map((req, i) => 
      i === index ? { ...req, [field]: value } : req
    ));
  };

  const removeCustomRequirement = (index: number) => {
    setCustomRequirements(prev => prev.filter((_, i) => i !== index));
  };

  const addSpecialistConsultant = () => {
    setProfessionalRequirements(prev => ({
      ...prev,
      specialistConsultants: [...prev.specialistConsultants, { specialty: '', required: false, certification: '' }]
    }));
  };

  const updateSpecialistConsultant = (index: number, field: string, value: any) => {
    setProfessionalRequirements(prev => ({
      ...prev,
      specialistConsultants: prev.specialistConsultants.map((consultant, i) => 
        i === index ? { ...consultant, [field]: value } : consultant
      )
    }));
  };

  const removeSpecialistConsultant = (index: number) => {
    setProfessionalRequirements(prev => ({
      ...prev,
      specialistConsultants: prev.specialistConsultants.filter((_, i) => i !== index)
    }));
  };

  const addAdditionalFee = () => {
    setFeeSettings(prev => ({
      ...prev,
      additionalFees: [...prev.additionalFees, { name: '', amount: '', description: '' }]
    }));
  };

  const updateAdditionalFee = (index: number, field: string, value: any) => {
    setFeeSettings(prev => ({
      ...prev,
      additionalFees: prev.additionalFees.map((fee, i) => 
        i === index ? { ...fee, [field]: value } : fee
      )
    }));
  };

  const removeAdditionalFee = (index: number) => {
    setFeeSettings(prev => ({
      ...prev,
      additionalFees: prev.additionalFees.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const templateData = {
      name: templateName,
      description: templateDescription,
      type: authorizationType,
      sections,
      customRequirements,
      compliance: complianceSettings,
      timeline: timelineSettings,
      fees: feeSettings,
      professional: professionalRequirements,
      authority: AUTHORIZATION_TYPES[authorizationType as keyof typeof AUTHORIZATION_TYPES].authority,
      legislationBasis: AUTHORIZATION_TYPES[authorizationType as keyof typeof AUTHORIZATION_TYPES].legislationBasis,
      projectId,
      createdAt: new Date().toISOString(),
      version: '1.0'
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
            <h2 className="text-2xl font-bold text-gray-900">Authorization Template Builder</h2>
            <p className="text-gray-600 mt-1">Create compliant authorization applications for Irish regulatory authorities</p>
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
              placeholder="e.g., Planning Permission - Residential Development"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Authorization Type</label>
            <select
              value={authorizationType}
              onChange={(e) => setAuthorizationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(AUTHORIZATION_TYPES).map(([key, type]) => (
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
            placeholder="Describe the specific use case and scope for this authorization template"
          />
        </div>
      </div>

      {/* Authorization Type Info */}
      {authorizationType && (
        <div className="p-6 bg-blue-50 border-b">
          <div className="flex items-center gap-3 mb-3">
            {AUTHORIZATION_TYPES[authorizationType as keyof typeof AUTHORIZATION_TYPES].icon}
            <h3 className="font-semibold text-blue-900">
              {AUTHORIZATION_TYPES[authorizationType as keyof typeof AUTHORIZATION_TYPES].name}
            </h3>
          </div>
          <p className="text-blue-800 mb-3">{AUTHORIZATION_TYPES[authorizationType as keyof typeof AUTHORIZATION_TYPES].description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Authority: {AUTHORIZATION_TYPES[authorizationType as keyof typeof AUTHORIZATION_TYPES].authority}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Est. Time: {AUTHORIZATION_TYPES[authorizationType as keyof typeof AUTHORIZATION_TYPES].estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Complexity: {AUTHORIZATION_TYPES[authorizationType as keyof typeof AUTHORIZATION_TYPES].complexity}</span>
            </div>
          </div>
          <div className="mt-2 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-800">
              <Scale className="w-3 h-3 inline mr-1" />
              <strong>Legislation:</strong> {AUTHORIZATION_TYPES[authorizationType as keyof typeof AUTHORIZATION_TYPES].legislationBasis}
            </p>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        {/* Standard Application Sections */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Application Sections</h3>
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

        {/* Irish Regulatory Compliance */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Irish Regulatory Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(IRISH_REGULATORY_COMPLIANCE).map(([key, section]) => (
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

        {/* Timeline Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time</label>
              <div className="relative">
                <input
                  type="number"
                  value={timelineSettings.preparationTime}
                  onChange={(e) => setTimelineSettings(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Authority Processing</label>
              <div className="relative">
                <input
                  type="number"
                  value={timelineSettings.authorityProcessingTime}
                  onChange={(e) => setTimelineSettings(prev => ({ ...prev, authorityProcessingTime: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Period</label>
              <div className="relative">
                <input
                  type="number"
                  value={timelineSettings.consultationPeriod}
                  onChange={(e) => setTimelineSettings(prev => ({ ...prev, consultationPeriod: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appeal Period</label>
              <div className="relative">
                <input
                  type="number"
                  value={timelineSettings.appealPeriod}
                  onChange={(e) => setTimelineSettings(prev => ({ ...prev, appealPeriod: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Validity Period</label>
              <div className="relative">
                <input
                  type="number"
                  value={timelineSettings.validityPeriod}
                  onChange={(e) => setTimelineSettings(prev => ({ ...prev, validityPeriod: parseInt(e.target.value) || 0 }))}
                  min="365"
                  max="3650"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Required Professionals</h4>
              {Object.entries(professionalRequirements).filter(([key]) => !key.includes('specialistConsultants')).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setProfessionalRequirements(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {key === 'architectCertification' && 'Architect Certification'}
                    {key === 'engineerCertification' && 'Engineer Certification'}
                    {key === 'plannerInvolvement' && 'Planner Involvement'}
                    {key === 'surveyorInput' && 'Surveyor Input'}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="md:col-span-1 lg:col-span-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Specialist Consultants</h4>
                <button
                  onClick={addSpecialistConsultant}
                  className="flex items-center gap-2 px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Plus className="w-3 h-3" />
                  Add Consultant
                </button>
              </div>
              
              {professionalRequirements.specialistConsultants.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No specialist consultants required</p>
              ) : (
                <div className="space-y-3">
                  {professionalRequirements.specialistConsultants.map((consultant, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="text"
                        value={consultant.specialty}
                        onChange={(e) => updateSpecialistConsultant(index, 'specialty', e.target.value)}
                        placeholder="e.g., Ecological Consultant"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={consultant.required}
                          onChange={(e) => updateSpecialistConsultant(index, 'required', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-xs text-gray-600">Required</span>
                      </label>
                      <button
                        onClick={() => removeSpecialistConsultant(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fee Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Standard Fees</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={feeSettings.applicationFee}
                    onChange={(e) => setFeeSettings(prev => ({ ...prev, applicationFee: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Application Fee</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={feeSettings.publicationFee}
                    onChange={(e) => setFeeSettings(prev => ({ ...prev, publicationFee: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Publication Fee</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={feeSettings.paymentMethod}
                onChange={(e) => setFeeSettings(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="online">Online Payment</option>
                <option value="cheque">Cheque Payment</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="postal_order">Postal Order</option>
              </select>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Additional Fees</h4>
                <button
                  onClick={addAdditionalFee}
                  className="flex items-center gap-2 px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Plus className="w-3 h-3" />
                  Add Fee
                </button>
              </div>
              
              {feeSettings.additionalFees.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No additional fees</p>
              ) : (
                <div className="space-y-2">
                  {feeSettings.additionalFees.map((fee, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={fee.name}
                        onChange={(e) => updateAdditionalFee(index, 'name', e.target.value)}
                        placeholder="Fee name"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => removeAdditionalFee(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Requirements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Custom Requirements</h3>
            <button
              onClick={addCustomRequirement}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Requirement
            </button>
          </div>
          
          {customRequirements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="mx-auto h-8 w-8 mb-2" />
              <p>No custom requirements added yet. Add requirements specific to your project or location.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customRequirements.map((requirement, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requirement Title</label>
                      <input
                        type="text"
                        value={requirement.title}
                        onChange={(e) => updateCustomRequirement(index, 'title', e.target.value)}
                        placeholder="e.g., Traffic Impact Assessment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Authority</label>
                      <input
                        type="text"
                        value={requirement.authority}
                        onChange={(e) => updateCustomRequirement(index, 'authority', e.target.value)}
                        placeholder="e.g., Transport Infrastructure Ireland"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                      <input
                        type="text"
                        value={requirement.estimatedTime}
                        onChange={(e) => updateCustomRequirement(index, 'estimatedTime', e.target.value)}
                        placeholder="e.g., 4-6 weeks"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={requirement.description}
                      onChange={(e) => updateCustomRequirement(index, 'description', e.target.value)}
                      rows={2}
                      placeholder="Describe this requirement and its purpose"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={requirement.mandatory}
                        onChange={(e) => updateCustomRequirement(index, 'mandatory', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Mandatory Requirement</span>
                    </label>
                    <button
                      onClick={() => removeCustomRequirement(index)}
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
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Regulatory Notice</p>
              <p className="text-xs text-blue-700">
                This template is based on current Irish regulations and should be verified against 
                the latest requirements from the relevant authority before submission.
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
              Save Authorization Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}