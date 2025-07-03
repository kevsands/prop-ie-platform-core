'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Plus, 
  Trash2, 
  Save, 
  AlertTriangle,
  Building2,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Globe,
  DollarSign,
  PieChart,
  LineChart,
  FileText,
  Star,
  Info,
  Clock,
  Award,
  Shield,
  Lightbulb,
  Database,
  Calculator,
  Archive
} from 'lucide-react';

// Business Plan Types for Irish Property Development
const BUSINESS_PLAN_TYPES = {
  development_business_plan: {
    name: 'Development Business Plan',
    description: 'Comprehensive business plan for property development projects',
    icon: <Building2 className="w-5 h-5" />,
    complexity: 'High',
    estimatedTime: '90-120 minutes',
    suitableFor: 'New developments, major renovations, mixed-use projects',
    irishContext: 'Irish Planning System, NAMA requirements, Local Enterprise Office guidelines'
  },
  investment_proposal: {
    name: 'Investment Proposal',
    description: 'Investment proposal for property development funding',
    icon: <TrendingUp className="w-5 h-5" />,
    complexity: 'High',
    estimatedTime: '75-90 minutes',
    suitableFor: 'Investor presentations, funding applications, partnership proposals',
    irishContext: 'Irish Investment Fund requirements, Enterprise Ireland guidelines'
  },
  portfolio_expansion: {
    name: 'Portfolio Expansion Plan',
    description: 'Strategic plan for expanding property development portfolio',
    icon: <PieChart className="w-5 h-5" />,
    complexity: 'Medium',
    estimatedTime: '60-75 minutes',
    suitableFor: 'Multi-project portfolios, strategic expansion, market entry',
    irishContext: 'Irish property market analysis, regional development strategies'
  },
  feasibility_study: {
    name: 'Feasibility Study',
    description: 'Detailed feasibility analysis for development projects',
    icon: <Calculator className="w-5 h-5" />,
    complexity: 'High',
    estimatedTime: '105-135 minutes',
    suitableFor: 'Site evaluation, project viability assessment, risk analysis',
    irishContext: 'Irish planning constraints, market conditions, regulatory compliance'
  }
};

// Standard Business Plan Sections
const BUSINESS_PLAN_SECTIONS = {
  executive_summary: {
    title: 'Executive Summary',
    required: true,
    description: 'High-level overview of the business plan and key highlights',
    icon: <FileText className="w-4 h-4" />,
    estimatedPages: '2-3 pages',
    fields: [
      'Project Overview',
      'Market Opportunity',
      'Financial Highlights',
      'Key Success Factors',
      'Investment Requirements',
      'Expected Returns',
      'Timeline Summary'
    ]
  },
  company_overview: {
    title: 'Company & Team Overview',
    required: true,
    description: 'Information about the development company and team',
    icon: <Users className="w-4 h-4" />,
    estimatedPages: '2-4 pages',
    fields: [
      'Company Background',
      'Management Team Profiles',
      'Track Record & Experience',
      'Professional Qualifications',
      'Previous Projects',
      'Company Structure',
      'Key Personnel'
    ]
  },
  market_analysis: {
    title: 'Market Analysis',
    required: true,
    description: 'Comprehensive analysis of the Irish property market',
    icon: <BarChart3 className="w-4 h-4" />,
    estimatedPages: '4-6 pages',
    fields: [
      'Irish Property Market Overview',
      'Regional Market Analysis',
      'Target Market Segments',
      'Competitive Analysis',
      'Market Trends & Drivers',
      'Demand Analysis',
      'Price Trends'
    ]
  },
  project_description: {
    title: 'Project Description',
    required: true,
    description: 'Detailed description of the development project',
    icon: <Building2 className="w-4 h-4" />,
    estimatedPages: '3-5 pages',
    fields: [
      'Project Location & Site',
      'Development Concept',
      'Unit Mix & Specifications',
      'Design & Architecture',
      'Planning Status',
      'Construction Timeline',
      'Key Features & Amenities'
    ]
  },
  financial_projections: {
    title: 'Financial Projections',
    required: true,
    description: 'Comprehensive financial analysis and projections',
    icon: <DollarSign className="w-4 h-4" />,
    estimatedPages: '5-8 pages',
    fields: [
      'Development Appraisal',
      'Cash Flow Projections',
      'Profit & Loss Forecasts',
      'Sensitivity Analysis',
      'Return on Investment',
      'Break-even Analysis',
      'Financial Assumptions'
    ]
  },
  marketing_strategy: {
    title: 'Marketing & Sales Strategy',
    required: true,
    description: 'Strategy for marketing and selling the development',
    icon: <Target className="w-4 h-4" />,
    estimatedPages: '3-4 pages',
    fields: [
      'Target Customer Profiles',
      'Marketing Channels',
      'Sales Strategy',
      'Pricing Strategy',
      'Launch Timeline',
      'Sales Projections',
      'Marketing Budget'
    ]
  },
  risk_analysis: {
    title: 'Risk Analysis & Management',
    required: true,
    description: 'Identification and mitigation of project risks',
    icon: <Shield className="w-4 h-4" />,
    estimatedPages: '2-3 pages',
    fields: [
      'Market Risks',
      'Construction Risks',
      'Financial Risks',
      'Regulatory Risks',
      'Environmental Risks',
      'Mitigation Strategies',
      'Insurance Coverage'
    ]
  },
  regulatory_compliance: {
    title: 'Regulatory & Compliance',
    required: true,
    description: 'Irish regulatory requirements and compliance strategy',
    icon: <BookOpen className="w-4 h-4" />,
    estimatedPages: '2-3 pages',
    fields: [
      'Planning Permission Status',
      'Building Regulations Compliance',
      'Environmental Assessments',
      'Health & Safety Requirements',
      'Tax Implications',
      'Legal Structure',
      'Professional Requirements'
    ]
  },
  implementation_timeline: {
    title: 'Implementation Timeline',
    required: true,
    description: 'Detailed project timeline and milestones',
    icon: <Calendar className="w-4 h-4" />,
    estimatedPages: '2-3 pages',
    fields: [
      'Project Phases',
      'Key Milestones',
      'Critical Path Activities',
      'Resource Requirements',
      'Dependencies',
      'Contingency Planning',
      'Progress Monitoring'
    ]
  },
  appendices: {
    title: 'Supporting Documents',
    required: false,
    description: 'Supporting documentation and appendices',
    icon: <Archive className="w-4 h-4" />,
    estimatedPages: 'Variable',
    fields: [
      'Site Plans & Drawings',
      'Market Research Data',
      'Financial Models',
      'Planning Documentation',
      'Team CVs',
      'Reference Projects',
      'Third-party Reports'
    ]
  }
};

// Irish Market Benchmarks for Business Plans
const IRISH_MARKET_BENCHMARKS = {
  dublin: {
    name: 'Dublin Market',
    avgSalePrice: '€450,000 - €650,000',
    constructionCosts: '€2,200 - €2,800 per sqm',
    saleRate: '8-12 units per month',
    marketGrowth: '3-5% annually'
  },
  cork: {
    name: 'Cork Market',
    avgSalePrice: '€280,000 - €420,000',
    constructionCosts: '€1,900 - €2,400 per sqm',
    saleRate: '4-8 units per month',
    marketGrowth: '4-6% annually'
  },
  galway: {
    name: 'Galway Market',
    avgSalePrice: '€320,000 - €480,000',
    constructionCosts: '€2,000 - €2,500 per sqm',
    saleRate: '3-6 units per month',
    marketGrowth: '3-5% annually'
  },
  regional: {
    name: 'Regional Markets',
    avgSalePrice: '€200,000 - €350,000',
    constructionCosts: '€1,700 - €2,200 per sqm',
    saleRate: '2-5 units per month',
    marketGrowth: '2-4% annually'
  }
};

interface BusinessPlanTemplateBuilderProps {
  onSave: (templateData: any) => void;
  onCancel: () => void;
  projectId?: string;
  existingTemplate?: any;
}

export default function BusinessPlanTemplateBuilder({
  onSave,
  onCancel,
  projectId,
  existingTemplate
}: BusinessPlanTemplateBuilderProps) {
  const [templateData, setTemplateData] = useState({
    templateName: existingTemplate?.templateName || '',
    planType: existingTemplate?.planType || 'development_business_plan',
    projectInfo: existingTemplate?.projectInfo || {
      projectName: '',
      location: '',
      developer: '',
      projectValue: '',
      targetMarket: '',
      developmentType: 'residential'
    },
    selectedSections: existingTemplate?.selectedSections || 
      Object.fromEntries(Object.keys(BUSINESS_PLAN_SECTIONS).map(key => [key, true])),
    executiveSummary: existingTemplate?.executiveSummary || {
      projectOverview: '',
      marketOpportunity: '',
      financialHighlights: {
        totalInvestment: '',
        expectedRevenue: '',
        projectedProfit: '',
        roi: ''
      },
      keySuccessFactors: [''],
      timeline: ''
    },
    marketAnalysis: existingTemplate?.marketAnalysis || {
      targetMarket: '',
      marketSize: '',
      competitivePosition: '',
      marketTrends: [''],
      pricingStrategy: '',
      selectedBenchmark: 'dublin'
    },
    financialProjections: existingTemplate?.financialProjections || {
      developmentCosts: {
        landCost: '',
        constructionCost: '',
        professionalFees: '',
        financingCosts: '',
        marketing: '',
        contingency: ''
      },
      revenueProjections: {
        totalUnits: '',
        avgSalePrice: '',
        totalRevenue: '',
        saleTimeline: ''
      },
      profitAnalysis: {
        grossProfit: '',
        netProfit: '',
        profitMargin: '',
        roi: ''
      }
    },
    riskFactors: existingTemplate?.riskFactors || [''],
    complianceRequirements: existingTemplate?.complianceRequirements || [''],
    customSections: existingTemplate?.customSections || [],
    irishCompliance: existingTemplate?.irishCompliance || {
      planningStatus: '',
      buildingRegulations: true,
      environmentalAssessment: false,
      partVRequirements: false,
      taxImplications: ''
    }
  });

  const handleBasicInfoChange = (field: string, value: string) => {
    if (field.startsWith('projectInfo.')) {
      const projectField = field.replace('projectInfo.', '');
      setTemplateData(prev => ({
        ...prev,
        projectInfo: {
          ...prev.projectInfo,
          [projectField]: value
        }
      }));
    } else {
      setTemplateData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSectionToggle = (sectionKey: string) => {
    setTemplateData(prev => ({
      ...prev,
      selectedSections: {
        ...prev.selectedSections,
        [sectionKey]: !prev.selectedSections[sectionKey]
      }
    }));
  };

  const handleExecutiveSummaryChange = (field: string, value: any) => {
    setTemplateData(prev => ({
      ...prev,
      executiveSummary: {
        ...prev.executiveSummary,
        [field]: value
      }
    }));
  };

  const handleFinancialChange = (category: string, field: string, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      financialProjections: {
        ...prev.financialProjections,
        [category]: {
          ...prev.financialProjections[category],
          [field]: value
        }
      }
    }));
  };

  const addCustomSection = () => {
    setTemplateData(prev => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        {
          id: Date.now(),
          title: '',
          description: '',
          content: '',
          required: false
        }
      ]
    }));
  };

  const removeCustomSection = (id: number) => {
    setTemplateData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== id)
    }));
  };

  const addArrayItem = (field: string) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = () => {
    const selectedSectionsCount = Object.values(templateData.selectedSections).filter(Boolean).length;
    
    if (!templateData.templateName || selectedSectionsCount === 0) {
      alert('Please provide a template name and select at least one section.');
      return;
    }

    const businessPlanData = {
      ...templateData,
      templateType: 'business_plan',
      createdAt: new Date().toISOString(),
      projectId: projectId || 'general',
      metadata: {
        planType: BUSINESS_PLAN_TYPES[templateData.planType],
        selectedSectionsCount,
        estimatedCompletionTime: BUSINESS_PLAN_TYPES[templateData.planType].estimatedTime,
        selectedBenchmark: IRISH_MARKET_BENCHMARKS[templateData.marketAnalysis.selectedBenchmark]
      }
    };

    onSave(businessPlanData);
  };

  const selectedPlanType = BUSINESS_PLAN_TYPES[templateData.planType];
  const selectedSectionsCount = Object.values(templateData.selectedSections).filter(Boolean).length;
  const totalSections = Object.keys(BUSINESS_PLAN_SECTIONS).length;
  const selectedBenchmark = IRISH_MARKET_BENCHMARKS[templateData.marketAnalysis.selectedBenchmark];

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Business Plan Template Builder</h1>
                <p className="text-gray-600">Create comprehensive business plans for Irish property development</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Business Plan Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateData.templateName}
                  onChange={(e) => handleBasicInfoChange('templateName', e.target.value)}
                  placeholder="e.g., Residential Development Business Plan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Plan Type *
                </label>
                <select
                  value={templateData.planType}
                  onChange={(e) => handleBasicInfoChange('planType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(BUSINESS_PLAN_TYPES).map(([key, type]) => (
                    <option key={key} value={key}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={templateData.projectInfo.projectName}
                  onChange={(e) => handleBasicInfoChange('projectInfo.projectName', e.target.value)}
                  placeholder="e.g., Fitzgerald Gardens Development"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={templateData.projectInfo.location}
                  onChange={(e) => handleBasicInfoChange('projectInfo.location', e.target.value)}
                  placeholder="e.g., Cork, Ireland"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Developer/Company
                </label>
                <input
                  type="text"
                  value={templateData.projectInfo.developer}
                  onChange={(e) => handleBasicInfoChange('projectInfo.developer', e.target.value)}
                  placeholder="e.g., Prop.ie Development Ltd"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Development Type
                </label>
                <select
                  value={templateData.projectInfo.developmentType}
                  onChange={(e) => handleBasicInfoChange('projectInfo.developmentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="mixed_use">Mixed Use</option>
                  <option value="industrial">Industrial</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Executive Summary Content</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Overview
                </label>
                <textarea
                  value={templateData.executiveSummary.projectOverview}
                  onChange={(e) => handleExecutiveSummaryChange('projectOverview', e.target.value)}
                  placeholder="Brief overview of the development project..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Opportunity
                </label>
                <textarea
                  value={templateData.executiveSummary.marketOpportunity}
                  onChange={(e) => handleExecutiveSummaryChange('marketOpportunity', e.target.value)}
                  placeholder="Description of the market opportunity..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Investment Required
                  </label>
                  <input
                    type="text"
                    value={templateData.executiveSummary.financialHighlights.totalInvestment}
                    onChange={(e) => handleExecutiveSummaryChange('financialHighlights', {
                      ...templateData.executiveSummary.financialHighlights,
                      totalInvestment: e.target.value
                    })}
                    placeholder="€5,200,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected ROI
                  </label>
                  <input
                    type="text"
                    value={templateData.executiveSummary.financialHighlights.roi}
                    onChange={(e) => handleExecutiveSummaryChange('financialHighlights', {
                      ...templateData.executiveSummary.financialHighlights,
                      roi: e.target.value
                    })}
                    placeholder="25%"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Success Factors
                </label>
                {templateData.executiveSummary.keySuccessFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={factor}
                      onChange={(e) => updateArrayItem('executiveSummary.keySuccessFactors', index, e.target.value)}
                      placeholder="e.g., Prime location in growing market"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeArrayItem('executiveSummary.keySuccessFactors', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('executiveSummary.keySuccessFactors')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Success Factor
                </button>
              </div>
            </div>
          </div>

          {/* Financial Projections */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Projections</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Development Costs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Land Cost</label>
                    <input
                      type="text"
                      value={templateData.financialProjections.developmentCosts.landCost}
                      onChange={(e) => handleFinancialChange('developmentCosts', 'landCost', e.target.value)}
                      placeholder="€1,200,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Construction Cost</label>
                    <input
                      type="text"
                      value={templateData.financialProjections.developmentCosts.constructionCost}
                      onChange={(e) => handleFinancialChange('developmentCosts', 'constructionCost', e.target.value)}
                      placeholder="€3,800,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Fees</label>
                    <input
                      type="text"
                      value={templateData.financialProjections.developmentCosts.professionalFees}
                      onChange={(e) => handleFinancialChange('developmentCosts', 'professionalFees', e.target.value)}
                      placeholder="€380,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Financing Costs</label>
                    <input
                      type="text"
                      value={templateData.financialProjections.developmentCosts.financingCosts}
                      onChange={(e) => handleFinancialChange('developmentCosts', 'financingCosts', e.target.value)}
                      placeholder="€200,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Revenue Projections</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Units</label>
                    <input
                      type="text"
                      value={templateData.financialProjections.revenueProjections.totalUnits}
                      onChange={(e) => handleFinancialChange('revenueProjections', 'totalUnits', e.target.value)}
                      placeholder="15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Sale Price</label>
                    <input
                      type="text"
                      value={templateData.financialProjections.revenueProjections.avgSalePrice}
                      onChange={(e) => handleFinancialChange('revenueProjections', 'avgSalePrice', e.target.value)}
                      placeholder="€480,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Plan Sections */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Business Plan Sections</h3>
              <span className="text-sm text-gray-600">
                {selectedSectionsCount} of {totalSections} sections selected
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(BUSINESS_PLAN_SECTIONS).map(([sectionKey, section]) => (
                <div key={sectionKey} className={`border rounded-lg p-4 transition-all ${
                  templateData.selectedSections[sectionKey] 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={templateData.selectedSections[sectionKey]}
                      onChange={() => handleSectionToggle(sectionKey)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {section.icon}
                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                        {section.required && (
                          <span className="text-xs text-red-600 font-medium">Required</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                      <p className="text-xs text-gray-500">{section.estimatedPages}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Sections */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Custom Sections</h3>
              <button
                onClick={addCustomSection}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Custom Section
              </button>
            </div>
            
            {templateData.customSections.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No custom sections added</p>
            ) : (
              <div className="space-y-4">
                {templateData.customSections.map((section, index) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const updatedSections = [...templateData.customSections];
                          updatedSections[index].title = e.target.value;
                          setTemplateData(prev => ({ ...prev, customSections: updatedSections }));
                        }}
                        placeholder="Section Title"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeCustomSection(section.id)}
                        className="ml-3 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={section.description}
                      onChange={(e) => {
                        const updatedSections = [...templateData.customSections];
                        updatedSections[index].description = e.target.value;
                        setTemplateData(prev => ({ ...prev, customSections: updatedSections }));
                      }}
                      placeholder="Section description and content guidelines..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plan Type Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              {selectedPlanType.icon}
              <h3 className="font-semibold text-gray-900">Plan Type</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">{selectedPlanType.name}</h4>
                <p className="text-sm text-gray-600">{selectedPlanType.description}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Complexity:</span>
                  <span className="font-medium">{selectedPlanType.complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Time:</span>
                  <span className="font-medium">{selectedPlanType.estimatedTime}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <p className="text-xs text-gray-600">{selectedPlanType.suitableFor}</p>
              </div>
            </div>
          </div>

          {/* Irish Market Context */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-4">Irish Market Context</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Market Benchmark
                </label>
                <select
                  value={templateData.marketAnalysis.selectedBenchmark}
                  onChange={(e) => setTemplateData(prev => ({
                    ...prev,
                    marketAnalysis: {
                      ...prev.marketAnalysis,
                      selectedBenchmark: e.target.value
                    }
                  }))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(IRISH_MARKET_BENCHMARKS).map(([key, benchmark]) => (
                    <option key={key} value={key}>{benchmark.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Avg. Sale Price:</span>
                  <span className="font-medium text-blue-900">{selectedBenchmark.avgSalePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Construction:</span>
                  <span className="font-medium text-blue-900">{selectedBenchmark.constructionCosts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Sale Rate:</span>
                  <span className="font-medium text-blue-900">{selectedBenchmark.saleRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Growth:</span>
                  <span className="font-medium text-blue-900">{selectedBenchmark.marketGrowth}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Template Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Template Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Selected Sections:</span>
                <span className="font-medium">{selectedSectionsCount}/{totalSections}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Custom Sections:</span>
                <span className="font-medium">{templateData.customSections.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Template Type:</span>
                <span className="font-medium">Business Plan</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Info className="w-4 h-4" />
                <span>Template will include Irish regulatory compliance requirements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}