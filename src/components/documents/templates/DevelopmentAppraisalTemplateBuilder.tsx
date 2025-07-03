'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Plus, 
  Trash2, 
  Save, 
  DollarSign,
  TrendingUp,
  Home,
  Building2,
  MapPin,
  Calculator,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  Briefcase,
  FileText,
  Settings,
  Info,
  Star,
  Euro
} from 'lucide-react';

// Development Appraisal Types for Irish Market
const APPRAISAL_TYPES = {
  residential: {
    name: 'Residential Development Appraisal',
    description: 'Comprehensive appraisal for residential developments including houses and apartments',
    icon: <Home className="w-5 h-5" />,
    complexity: 'High',
    estimatedTime: '90-120 minutes',
    suitableFor: 'New housing developments, apartment schemes, mixed residential projects'
  },
  commercial: {
    name: 'Commercial Development Appraisal',
    description: 'Appraisal for commercial properties including offices, retail, and industrial',
    icon: <Building2 className="w-5 h-5" />,
    complexity: 'Very High',
    estimatedTime: '120-180 minutes',
    suitableFor: 'Office developments, retail parks, industrial estates, mixed-use projects'
  },
  mixed_use: {
    name: 'Mixed-Use Development Appraisal',
    description: 'Complex appraisal for developments combining residential and commercial elements',
    icon: <Briefcase className="w-5 h-5" />,
    complexity: 'Very High',
    estimatedTime: '150-200 minutes',
    suitableFor: 'Mixed-use developments, urban regeneration projects, master planning'
  },
  land_assembly: {
    name: 'Land Assembly Appraisal',
    description: 'Strategic appraisal for land acquisition and assembly projects',
    icon: <MapPin className="w-5 h-5" />,
    complexity: 'High',
    estimatedTime: '60-90 minutes',
    suitableFor: 'Land acquisition, site assembly, feasibility studies'
  }
};

// Standard Appraisal Sections for Irish Development
const APPRAISAL_SECTIONS = {
  executive_summary: {
    title: 'Executive Summary',
    required: true,
    description: 'High-level summary of project viability and key metrics',
    fields: [
      'Project Overview',
      'Key Financial Metrics',
      'Development Profit',
      'Profit Margin %',
      'Internal Rate of Return (IRR)',
      'Net Present Value (NPV)',
      'Payback Period',
      'Risk Assessment Summary'
    ]
  },
  site_analysis: {
    title: 'Site Analysis',
    required: true,
    description: 'Detailed analysis of the development site',
    fields: [
      'Site Location and Address',
      'Site Area (hectares/acres)',
      'Current Use and Zoning',
      'Planning Designations',
      'Site Access and Infrastructure',
      'Topography and Ground Conditions',
      'Environmental Considerations',
      'Neighboring Developments'
    ]
  },
  planning_analysis: {
    title: 'Planning Analysis',
    required: true,
    description: 'Planning policy and regulatory analysis',
    fields: [
      'Development Plan Compliance',
      'Local Area Plan Requirements',
      'Density Analysis',
      'Height Restrictions',
      'Part V Social Housing Requirements',
      'Development Contributions',
      'Planning Risk Assessment',
      'Planning Timeline'
    ]
  },
  market_analysis: {
    title: 'Market Analysis',
    required: true,
    description: 'Market conditions and demand analysis',
    fields: [
      'Local Market Conditions',
      'Comparable Sales Evidence',
      'Rental Market Analysis',
      'Supply and Demand Dynamics',
      'Price Trends and Forecasts',
      'Target Market Profile',
      'Competition Analysis',
      'Market Absorption Rates'
    ]
  },
  development_schedule: {
    title: 'Development Schedule',
    required: true,
    description: 'Project timeline and key milestones',
    fields: [
      'Pre-Development Phase',
      'Planning Application Period',
      'Pre-Construction Phase',
      'Construction Period',
      'Sales/Letting Period',
      'Project Completion',
      'Critical Path Analysis',
      'Risk Contingencies'
    ]
  },
  cost_analysis: {
    title: 'Cost Analysis',
    required: true,
    description: 'Comprehensive development cost breakdown',
    fields: [
      'Land Acquisition Costs',
      'Site Preparation Costs',
      'Construction Costs (€/sqm)',
      'Professional Fees',
      'Planning and Regulatory Costs',
      'Infrastructure Contributions',
      'Marketing and Sales Costs',
      'Finance Costs',
      'Contingency Allowances'
    ]
  },
  revenue_analysis: {
    title: 'Revenue Analysis',
    required: true,
    description: 'Sales revenue and income projections',
    fields: [
      'Unit Sales Schedule',
      'Sales Prices per Unit Type',
      'Sales Rate Assumptions',
      'Rental Income (if applicable)',
      'Commercial Income',
      'Government Grants/Incentives',
      'Revenue Phasing',
      'Revenue Risk Analysis'
    ]
  },
  financial_appraisal: {
    title: 'Financial Appraisal',
    required: true,
    description: 'Detailed financial modeling and viability assessment',
    fields: [
      'Development Cash Flow',
      'Profit and Loss Projection',
      'Return on Investment',
      'Debt Service Coverage',
      'Sensitivity Analysis',
      'Monte Carlo Risk Analysis',
      'Financing Structure',
      'Exit Strategy'
    ]
  },
  risk_assessment: {
    title: 'Risk Assessment',
    required: true,
    description: 'Comprehensive risk analysis and mitigation strategies',
    fields: [
      'Planning Risk',
      'Construction Risk',
      'Market Risk',
      'Financial Risk',
      'Regulatory Risk',
      'Environmental Risk',
      'Political/Economic Risk',
      'Risk Mitigation Measures'
    ]
  }
};

// Irish Property Development Key Metrics
const IRISH_DEVELOPMENT_METRICS = {
  financial_ratios: {
    title: 'Key Financial Ratios',
    metrics: [
      { name: 'Profit on Cost', description: 'Development profit as % of total costs', benchmark: '15-25%' },
      { name: 'Profit on GDV', description: 'Development profit as % of gross development value', benchmark: '15-20%' },
      { name: 'IRR', description: 'Internal Rate of Return', benchmark: '18-25%' },
      { name: 'Yield on Cost', description: 'Net rental income as % of total development cost', benchmark: '6-8%' },
      { name: 'Loan to Cost', description: 'Development finance as % of total costs', benchmark: '65-75%' },
      { name: 'Debt Service Coverage', description: 'Net income / debt service payments', benchmark: '1.3x+' }
    ]
  },
  market_benchmarks: {
    title: 'Irish Market Benchmarks',
    metrics: [
      { name: 'Construction Cost/sqm', description: 'Typical construction costs', benchmark: '€1,200-€2,000/sqm' },
      { name: 'Sales Rate', description: 'Units sold per month', benchmark: '2-5 units/month' },
      { name: 'Planning Period', description: 'Planning application to decision', benchmark: '16-20 weeks' },
      { name: 'Construction Period', description: 'Construction duration', benchmark: '12-18 months' },
      { name: 'Professional Fees', description: 'As % of construction cost', benchmark: '12-15%' },
      { name: 'Marketing Costs', description: 'As % of gross development value', benchmark: '2-4%' }
    ]
  }
};

interface DevelopmentAppraisalTemplateBuilderProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  projectId?: string;
}

export default function DevelopmentAppraisalTemplateBuilder({
  initialData,
  onSave,
  onCancel,
  projectId
}: DevelopmentAppraisalTemplateBuilderProps) {
  const [appraisalType, setAppraisalType] = useState(initialData?.type || 'residential');
  const [templateName, setTemplateName] = useState(initialData?.name || '');
  const [templateDescription, setTemplateDescription] = useState(initialData?.description || '');
  const [sections, setSections] = useState(() => {
    if (initialData?.sections) return initialData.sections;
    return { ...APPRAISAL_SECTIONS };
  });
  
  const [projectAssumptions, setProjectAssumptions] = useState(initialData?.assumptions || {
    siteArea: '',
    totalUnits: '',
    grossFloorArea: '',
    buildingHeight: '',
    density: '',
    carParking: '',
    developmentPeriod: 24, // months
    constructionPeriod: 12 // months
  });
  
  const [financialAssumptions, setFinancialAssumptions] = useState(initialData?.financial || {
    landCostPerAcre: '',
    constructionCostPerSqm: 1500,
    professionalFeesPercent: 12,
    planningCosts: 50000,
    developmentContributions: 75000,
    marketingCostsPercent: 3,
    contingencyPercent: 5,
    financeRate: 7.5, // %
    targetProfitMargin: 20, // %
    expectedIRR: 22 // %
  });
  
  const [marketAssumptions, setMarketAssumptions] = useState(initialData?.market || {
    averageSalesPrice: '',
    salesRatePerMonth: 3,
    priceInflationRate: 2.5, // % per annum
    costInflationRate: 3.0, // % per annum
    vacancyRate: 5, // % for rental properties
    yieldAssumption: 6.5, // % for investment properties
    marketGrowthRate: 2.0 // % per annum
  });
  
  const [customMetrics, setCustomMetrics] = useState(initialData?.customMetrics || []);

  const handleSectionToggle = (sectionKey: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        included: !prev[sectionKey].included
      }
    }));
  };

  const addCustomMetric = () => {
    setCustomMetrics(prev => [...prev, {
      name: '',
      description: '',
      formula: '',
      benchmark: '',
      importance: 'medium'
    }]);
  };

  const updateCustomMetric = (index: number, field: string, value: any) => {
    setCustomMetrics(prev => prev.map((metric, i) => 
      i === index ? { ...metric, [field]: value } : metric
    ));
  };

  const removeCustomMetric = (index: number) => {
    setCustomMetrics(prev => prev.filter((_, i) => i !== index));
  };

  const calculateEstimatedProfit = () => {
    const totalCosts = 
      (parseFloat(financialAssumptions.landCostPerAcre) || 0) + 
      (parseFloat(projectAssumptions.grossFloorArea) || 0) * financialAssumptions.constructionCostPerSqm +
      financialAssumptions.planningCosts +
      financialAssumptions.developmentContributions;
    
    const estimatedRevenue = 
      (parseFloat(projectAssumptions.totalUnits) || 0) * (parseFloat(marketAssumptions.averageSalesPrice) || 0);
    
    return estimatedRevenue - totalCosts;
  };

  const calculateProfitMargin = () => {
    const profit = calculateEstimatedProfit();
    const revenue = (parseFloat(projectAssumptions.totalUnits) || 0) * (parseFloat(marketAssumptions.averageSalesPrice) || 0);
    return revenue > 0 ? (profit / revenue * 100) : 0;
  };

  const handleSave = () => {
    const templateData = {
      name: templateName,
      description: templateDescription,
      type: appraisalType,
      sections,
      projectAssumptions,
      financialAssumptions,
      marketAssumptions,
      customMetrics,
      benchmarks: IRISH_DEVELOPMENT_METRICS,
      estimatedProfit: calculateEstimatedProfit(),
      estimatedProfitMargin: calculateProfitMargin(),
      projectId,
      createdAt: new Date().toISOString(),
      version: '1.0',
      currency: 'EUR',
      market: 'Ireland'
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
            <h2 className="text-2xl font-bold text-gray-900">Development Appraisal Template</h2>
            <p className="text-gray-600 mt-1">Create comprehensive financial appraisals for Irish property developments</p>
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
              placeholder="e.g., Residential Development Appraisal - Cork"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appraisal Type</label>
            <select
              value={appraisalType}
              onChange={(e) => setAppraisalType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(APPRAISAL_TYPES).map(([key, type]) => (
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
            placeholder="Describe the specific use case for this development appraisal"
          />
        </div>
      </div>

      {/* Appraisal Type Info */}
      {appraisalType && (
        <div className="p-6 bg-green-50 border-b">
          <div className="flex items-center gap-3 mb-3">
            {APPRAISAL_TYPES[appraisalType as keyof typeof APPRAISAL_TYPES].icon}
            <h3 className="font-semibold text-green-900">
              {APPRAISAL_TYPES[appraisalType as keyof typeof APPRAISAL_TYPES].name}
            </h3>
          </div>
          <p className="text-green-800 mb-3">{APPRAISAL_TYPES[appraisalType as keyof typeof APPRAISAL_TYPES].description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Est. Time: {APPRAISAL_TYPES[appraisalType as keyof typeof APPRAISAL_TYPES].estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Complexity: {APPRAISAL_TYPES[appraisalType as keyof typeof APPRAISAL_TYPES].complexity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Irish Market Focus</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        {/* Quick Financial Preview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">Quick Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded">
              <div className="text-lg font-bold text-blue-600">€{calculateEstimatedProfit().toLocaleString()}</div>
              <div className="text-sm text-blue-700">Est. Profit</div>
            </div>
            <div className="text-center p-3 bg-white rounded">
              <div className="text-lg font-bold text-green-600">{calculateProfitMargin().toFixed(1)}%</div>
              <div className="text-sm text-green-700">Profit Margin</div>
            </div>
            <div className="text-center p-3 bg-white rounded">
              <div className="text-lg font-bold text-purple-600">{financialAssumptions.expectedIRR}%</div>
              <div className="text-sm text-purple-700">Target IRR</div>
            </div>
            <div className="text-center p-3 bg-white rounded">
              <div className="text-lg font-bold text-amber-600">{projectAssumptions.developmentPeriod}m</div>
              <div className="text-sm text-amber-700">Development Period</div>
            </div>
          </div>
        </div>

        {/* Remaining component sections would continue here... */}
      </div>
    </div>
  );
}