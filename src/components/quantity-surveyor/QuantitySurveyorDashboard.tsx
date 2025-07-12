/**
 * Quantity Surveyor Dashboard
 * 
 * Month 2, Week 1 Implementation: Core Professional Roles
 * Cost management, valuation, and financial oversight for Irish property development
 * 
 * Features:
 * - Cost estimation and budget management
 * - Bill of quantities (BOQ) preparation and management
 * - Valuations for progress payments
 * - Variation management and cost control
 * - SCSI (Society of Chartered Surveyors Ireland) compliance
 * - Final account preparation
 * - Cost reporting and analysis
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectData } from '@/hooks/useProjectData';
import { realTimeDataSyncService } from '@/services/RealTimeDataSyncService';
import TaskOrchestrationEngine from '@/services/TaskOrchestrationEngine';
import { 
  Users, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Calculator,
  BarChart3,
  MessageSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Euro,
  PieChart,
  Building,
  Hammer,
  Target,
  Award,
  Briefcase,
  ArrowUpDown,
  Eye,
  Download,
  Upload,
  Calendar,
  Search,
  Filter,
  Home
} from 'lucide-react';

export interface CostElement {
  id: string;
  code: string;
  description: string;
  category: 'preliminaries' | 'substructure' | 'superstructure' | 'finishes' | 'services' | 'external_works' | 'provisional';
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  variance: number;
  status: 'estimated' | 'tendered' | 'agreed' | 'certified' | 'paid';
  supplier?: string;
  notes: string[];
  lastUpdated: Date;
  updatedBy: string;
}

export interface BillOfQuantities {
  id: string;
  projectId: string;
  version: string;
  status: 'draft' | 'issued' | 'priced' | 'accepted' | 'superseded';
  issueDate: Date;
  sections: BOQSection[];
  totalValue: number;
  contingency: number;
  preliminaries: number;
  grandTotal: number;
  currency: 'EUR' | 'GBP' | 'USD';
  validity: Date;
  preparedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
}

export interface BOQSection {
  id: string;
  code: string;
  title: string;
  description: string;
  elements: CostElement[];
  sectionTotal: number;
  variance: number;
  completionPercentage: number;
}

export interface Valuation {
  id: string;
  valuationNumber: number;
  projectId: string;
  periodFrom: Date;
  periodTo: Date;
  status: 'draft' | 'submitted' | 'certified' | 'paid' | 'disputed';
  workExecuted: ValuationWork[];
  materialsOnSite: MaterialValuation[];
  previouslyValued: number;
  thisValuation: number;
  cumulativeValue: number;
  retentionPercentage: number;
  retentionAmount: number;
  previousRetention: number;
  releaseRetention: number;
  netAmount: number;
  variations: VariationClaim[];
  preparedBy: string;
  certifiedBy?: string;
  certifiedDate?: Date;
  paymentDue: Date;
  notes: string;
}

export interface ValuationWork {
  id: string;
  elementId: string;
  description: string;
  originalQuantity: number;
  executedQuantity: number;
  rate: number;
  amount: number;
  percentageComplete: number;
  measurement: MeasurementRecord[];
  photos: string[];
  verifiedBy?: string;
  verificationDate?: Date;
}

export interface MaterialValuation {
  id: string;
  description: string;
  supplier: string;
  deliveryDate: Date;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  invoiceNumber: string;
  delivered: boolean;
  incorporated: boolean;
  retentionPercentage: number;
  photos: string[];
}

export interface MeasurementRecord {
  id: string;
  date: Date;
  measuredBy: string;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
    area?: number;
    volume?: number;
  };
  calculatedQuantity: number;
  notes: string;
  photos: string[];
  witnessedBy?: string;
}

export interface VariationClaim {
  id: string;
  variationNumber: string;
  description: string;
  type: 'addition' | 'omission' | 'substitution';
  status: 'proposed' | 'priced' | 'approved' | 'rejected' | 'pending';
  originalAmount: number;
  claimedAmount: number;
  agreedAmount?: number;
  reasoning: string;
  documentation: string[];
  submittedDate: Date;
  submittedBy: string;
  reviewedBy?: string;
  reviewDate?: Date;
  impact: {
    cost: number;
    time: number;
    scope: string;
  };
}

export interface CostReport {
  id: string;
  type: 'budget_vs_actual' | 'cost_breakdown' | 'variation_summary' | 'cash_flow' | 'final_account';
  title: string;
  period: string;
  generatedDate: Date;
  generatedBy: string;
  summary: CostSummary;
  analysis: CostAnalysis;
  recommendations: string[];
  charts: ChartData[];
  exportUrl: string;
}

export interface CostSummary {
  budgetTotal: number;
  actualTotal: number;
  variance: number;
  variancePercentage: number;
  contingencyUsed: number;
  contingencyRemaining: number;
  forecastFinal: number;
  certificationsToDate: number;
  retentionHeld: number;
  outstandingClaims: number;
}

export interface CostAnalysis {
  majorVariances: CostVariance[];
  trendAnalysis: CostTrend[];
  riskFactors: string[];
  opportunities: string[];
  benchmarking: BenchmarkData[];
}

export interface CostVariance {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  reason: string;
  impact: 'low' | 'medium' | 'high';
  action: string;
}

export interface CostTrend {
  period: string;
  budgeted: number;
  actual: number;
  forecast: number;
  variance: number;
}

export interface BenchmarkData {
  category: string;
  projectRate: number;
  marketRate: number;
  variance: number;
  source: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: any[];
  labels: string[];
  colors: string[];
}

export interface SCSICompliance {
  membershipStatus: boolean;
  registrationNumber?: string;
  professionalIndemnity: {
    valid: boolean;
    provider: string;
    amount: number;
    expiryDate: Date;
  };
  continuingProfessionalDevelopment: {
    currentYear: number;
    requiredHours: number;
    completedHours: number;
    courses: CPDCourse[];
  };
  codeOfConduct: boolean;
  qualifications: string[];
  specializations: string[];
}

export interface CPDCourse {
  id: string;
  title: string;
  provider: string;
  hours: number;
  completionDate: Date;
  category: 'technical' | 'management' | 'legal' | 'ethics';
  certificateUrl?: string;
}

export interface CashFlowProjection {
  period: string;
  startDate: Date;
  endDate: Date;
  plannedCertifications: number;
  actualCertifications: number;
  plannedPayments: number;
  actualPayments: number;
  retentionHeld: number;
  retentionReleased: number;
  variance: number;
  cumulativeCertified: number;
  cumulativePaid: number;
}

export interface QuantitySurveyorData {
  projectId: string;
  projectName: string;
  client: string;
  contractValue: number;
  billOfQuantities: BillOfQuantities;
  valuations: Valuation[];
  costReports: CostReport[];
  compliance: SCSICompliance;
  cashFlow: CashFlowProjection[];
  summary: {
    totalCertified: number;
    totalPaid: number;
    retentionHeld: number;
    outstandingAmount: number;
    variationsValue: number;
    contingencyUsed: number;
    forecastFinal: number;
    profitMargin: number;
  };
  kpis: {
    costPerformance: number;
    schedulePerformance: number;
    variationControl: number;
    cashFlowHealth: number;
    certificationAccuracy: number;
  };
}

interface QuantitySurveyorDashboardProps {
  projectId?: string;
}

const QuantitySurveyorDashboard: React.FC<QuantitySurveyorDashboardProps> = ({ 
  projectId = 'fitzgerald-gardens' 
}) => {
  // 🚀 ENTERPRISE INTEGRATION: Use real project data from developer portal
  const {
    project,
    units,
    totalRevenue,
    totalUnits,
    soldUnits,
    teamMembers,
    invoices,
    isLoading: projectLoading,
    error: projectError
  } = useProjectData(projectId);
  
  const [qsCostData, setQsCostData] = useState<QuantitySurveyorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current');

  // Helper functions to create default data structures
  const createDefaultBOQ = (): BillOfQuantities => ({
    id: 'boq_fitzgerald_gardens',
    projectId: 'fitzgerald-gardens-qs',
    version: '2.1',
    status: 'accepted',
    issueDate: new Date('2024-08-15'),
    sections: [
      {
        id: 'section_01',
        code: '01',
        title: 'Preliminaries',
        description: 'Site setup, temporary works, and project management',
        elements: [
          {
            id: 'elem_01_001',
            code: '01.001',
            description: 'Site establishment and temporary facilities',
            category: 'preliminaries',
            unit: 'Sum',
            quantity: 1,
            rate: 850000,
            amount: 850000,
            variance: 0,
            status: 'agreed',
            notes: [],
            lastUpdated: new Date(),
            updatedBy: 'Michael Murphy MSCSI'
          }
        ],
        sectionTotal: 850000,
        variance: 0,
        completionPercentage: 100
      },
      {
        id: 'section_02',
        code: '02',
        title: 'Substructure Works',
        description: 'Foundations, basement, and below-ground construction',
        elements: [
          {
            id: 'elem_02_001',
            code: '02.001',
            description: 'Excavation and groundworks',
            category: 'substructure',
            unit: 'm³',
            quantity: 12500,
            rate: 35.50,
            amount: 443750,
            variance: 0,
            status: 'certified',
            supplier: 'Murphy Civil Engineering',
            notes: ['Completed on schedule'],
            lastUpdated: new Date(),
            updatedBy: 'Michael Murphy MSCSI'
          }
        ],
        sectionTotal: 3200000,
        variance: 2.3,
        completionPercentage: 100
      }
    ],
    totalValue: 25650000,
    contingency: 1282500,
    preliminaries: 1567500,
    grandTotal: 28500000,
    currency: 'EUR',
    validity: new Date('2025-12-31'),
    preparedBy: 'Michael Murphy MSCSI',
    reviewedBy: 'Sarah O\'Brien RIAI',
    approvedBy: 'Fitzgerald Developments Ltd'
  });

  const createDefaultCompliance = (): SCSICompliance => ({
    membershipStatus: true,
    registrationNumber: 'QS12847',
    professionalIndemnity: {
      valid: true,
      provider: 'Aviva Insurance Ireland',
      amount: 5000000,
      expiryDate: new Date('2025-12-31')
    },
    continuingProfessionalDevelopment: {
      currentYear: 2025,
      requiredHours: 20,
      completedHours: 28,
      courses: [
        {
          id: 'cpd_001',
          title: 'Advanced Cost Management Techniques',
          provider: 'SCSI',
          hours: 8,
          completionDate: new Date('2025-03-15'),
          category: 'technical'
        },
        {
          id: 'cpd_002',
          title: 'Digital Construction Technologies',
          provider: 'Construction IT Alliance',
          hours: 12,
          completionDate: new Date('2025-05-20'),
          category: 'technical'
        }
      ]
    },
    codeOfConduct: true,
    qualifications: ['BSc Quantity Surveying', 'MSCSI', 'Project Management Certificate'],
    specializations: ['Residential Development', 'Cost Management', 'Contract Administration']
  });

  const createDefaultSummary = () => ({
    totalCertified: 18720000,
    totalPaid: 17783000,
    retentionHeld: 937000,
    outstandingAmount: 937000,
    variationsValue: 245500,
    contingencyUsed: 456000,
    forecastFinal: 28745500,
    profitMargin: 8.6
  });

  const createDefaultKPIs = () => ({
    costPerformance: 97.2,
    schedulePerformance: 102.3,
    variationControl: 94.8,
    cashFlowHealth: 96.1,
    certificationAccuracy: 98.5
  });

  const createFallbackData = (): QuantitySurveyorData => ({
    projectId: 'fitzgerald-gardens-qs',
    projectName: 'Fitzgerald Gardens - Phase 2',
    client: 'Fitzgerald Developments Ltd',
    contractValue: 28500000,
    billOfQuantities: createDefaultBOQ(),
    valuations: [
      {
        id: 'val_001',
        valuationNumber: 12,
        projectId: 'fitzgerald-gardens-qs',
        periodFrom: new Date('2025-06-01'),
        periodTo: new Date('2025-06-30'),
        status: 'certified',
        workExecuted: [],
        materialsOnSite: [],
        previouslyValued: 17570000,
        thisValuation: 1150000,
        cumulativeValue: 18720000,
        retentionPercentage: 5,
        retentionAmount: 57500,
        previousRetention: 878500,
        releaseRetention: 0,
        netAmount: 1092500,
        variations: [],
        preparedBy: 'Michael Murphy MSCSI',
        certifiedBy: 'Sarah O\'Brien RIAI',
        certifiedDate: new Date('2025-07-02'),
        paymentDue: new Date('2025-07-16'),
        notes: 'June 2025 valuation - superstructure works progressing on schedule'
      }
    ],
    costReports: [
      {
        id: 'rep_001',
        type: 'budget_vs_actual',
        title: 'Monthly Cost Report - June 2025',
        period: 'June 2025',
        generatedDate: new Date(),
        generatedBy: 'Michael Murphy MSCSI',
        summary: {
          budgetTotal: 28500000,
          actualTotal: 18720000,
          variance: -245500,
          variancePercentage: -0.86,
          contingencyUsed: 456000,
          contingencyRemaining: 826500,
          forecastFinal: 28745500,
          certificationsToDate: 18720000,
          retentionHeld: 937000,
          outstandingClaims: 89500
        },
        analysis: {
          majorVariances: [],
          trendAnalysis: [],
          riskFactors: ['Steel price volatility', 'Weather dependency'],
          opportunities: ['Early completion bonus', 'Material cost savings'],
          benchmarking: []
        },
        recommendations: ['Monitor steel procurement closely', 'Accelerate interior works'],
        charts: [],
        exportUrl: '/reports/fitzgerald-gardens-june-2025.pdf'
      }
    ],
    compliance: createDefaultCompliance(),
    cashFlow: [
      {
        period: 'June 2025',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-30'),
        plannedCertifications: 1200000,
        actualCertifications: 1150000,
        plannedPayments: 1140000,
        actualPayments: 1092500,
        retentionHeld: 57500,
        retentionReleased: 0,
        variance: -50000,
        cumulativeCertified: 18720000,
        cumulativePaid: 17783000
      }
    ],
    summary: createDefaultSummary(),
    kpis: createDefaultKPIs()
  });

  // 🚀 ENTERPRISE INTEGRATION: Load QS-specific cost data and connect to real project
  useEffect(() => {
    const loadQSData = async () => {
      if (!project) return;
      
      try {
        setLoading(true);
        
        // Load QS-specific cost management data
        const response = await fetch(`/api/quantity-surveyor/cost-management?action=get_project_costs&projectId=${projectId}`);
        const data = await response.json() as any;
        
        if (data && !data.error) {
          // Transform API response integrating with real project data
          const transformedData: QuantitySurveyorData = {
            projectId: project.id, // Use real project ID
            projectName: project.name, // Use real project name
            client: 'Fitzgerald Developments Ltd',
            contractValue: totalRevenue || 28500000, // Use real contract value from project
            billOfQuantities: data.boq || createDefaultBOQ(),
            valuations: data.valuations || [],
            costReports: data.costReports || [],
            compliance: data.compliance || createDefaultCompliance(),
            cashFlow: data.cashFlow || [],
            summary: data.summary || createDefaultSummary(),
            kpis: data.kpis || createDefaultKPIs()
          };
          
          setQsCostData(transformedData);
        } else {
          console.error('QS API error:', data.error);
          // Set fallback data integrated with real project
          setQsCostData(createFallbackDataWithProject(project));
        }
        
        // Subscribe to real-time project updates
        const unsubscribe = realTimeDataSyncService.subscribeToProjectUpdates(
          projectId,
          (update) => {
            console.log('🏗️ QS Dashboard: Real-time project update:', update.type);
            // Refresh cost data when project changes
            if (update.type === 'unit_status_change' || update.type === 'unit_price_update') {
              loadQSData();
            }
          }
        );
        
        // 🎯 ENTERPRISE INTEGRATION: Connect to TaskOrchestrationEngine for professional coordination
        const taskEngine = new TaskOrchestrationEngine();
        
        // Register QS tasks for project
        await taskEngine.registerProfessionalTasks('quantity-surveyor', projectId, [
          {
            type: 'valuation_review',
            priority: 'high',
            description: `Review monthly valuation for ${project.name}`,
            estimatedDuration: 4, // hours
            dependencies: ['construction_progress_update']
          },
          {
            type: 'boq_update',
            priority: 'medium', 
            description: `Update BOQ pricing for ${project.name}`,
            estimatedDuration: 2,
            dependencies: ['material_price_update']
          },
          {
            type: 'cost_variance_analysis',
            priority: 'high',
            description: `Analyze cost variances for ${project.name}`,
            estimatedDuration: 3,
            dependencies: ['valuation_review']
          }
        ]);
        
        console.log('🎯 QS Tasks registered with orchestration engine');
        
        return unsubscribe;
      } catch (error) {
        console.error('Failed to load QS data:', error);
        setQsCostData(createFallbackDataWithProject(project));
      } finally {
        setLoading(false);
      }
    };

    if (project) {
      loadQSData();
    }
  }, [project, projectId, totalRevenue]);
  
  // Helper function to create fallback data integrated with real project
  const createFallbackDataWithProject = (realProject: any): QuantitySurveyorData => {
    return {
      projectId: realProject.id,
      projectName: realProject.name,
      client: 'Fitzgerald Developments Ltd',
      contractValue: totalRevenue || 28500000,
      billOfQuantities: createDefaultBOQ(),
      valuations: [],
      costReports: [],
      compliance: createDefaultCompliance(),
      cashFlow: [],
      summary: createDefaultSummary(),
      kpis: createDefaultKPIs()
    };
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'certified':
      case 'paid':
      case 'approved':
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'submitted':
      case 'priced':
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
      case 'proposed':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'disputed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarianceColor = (variance: number): string => {
    if (variance > 5) return 'text-red-600';
    if (variance < -5) return 'text-green-600';
    return 'text-gray-600';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading || projectLoading || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project and cost data...</p>
        </div>
      </div>
    );
  }

  if (projectError || !qsCostData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">Failed to load project data</p>
          <p className="text-sm text-gray-500">{projectError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quantity Surveyor</h1>
              <p className="text-gray-600 mt-1">{project.name} - Cost Management & Valuation</p>
              <div className="mt-2 flex items-center gap-4">
                <Badge variant="outline">{totalUnits} Total Units</Badge>
                <Badge variant="outline">{soldUnits} Sold</Badge>
                <Badge variant="outline">€{totalRevenue.toLocaleString()} Revenue</Badge>
                <Badge variant="outline">{project.progress?.overall || 68}% Complete</Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/developer/team/quantity-surveyors">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Developer Dashboard
                </Button>
              </Link>
              <Link href="/quantity-surveyor/valuation-review">
                <Button>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review Valuations
                </Button>
              </Link>
              <Button variant="outline">
                <Calculator className="h-4 w-4 mr-2" />
                New Valuation
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline">
                <Euro className="h-4 w-4 mr-2" />
                Cost Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contract Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(qsCostData.contractValue)}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Total project contract</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certified to Date</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(qsCostData.summary?.totalCertified || 0)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  {(((qsCostData.summary?.totalCertified || qsCostData.currentSpend || 0) / (qsCostData.contractValue || qsCostData.totalBudget || 1)) * 100).toFixed(1)}% of contract
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(qsCostData.summary?.outstandingAmount || 0)}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Awaiting payment</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Forecast Final</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(qsCostData.summary?.forecastFinal || 0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2">
                <p className={`text-xs ${getVarianceColor((((qsCostData.summary?.forecastFinal || 0) - qsCostData.contractValue) / qsCostData.contractValue) * 100)}`}>
                  {formatPercentage((((qsCostData.summary?.forecastFinal || 0) - qsCostData.contractValue) / qsCostData.contractValue) * 100)} variance
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="boq">Bill of Quantities</TabsTrigger>
            <TabsTrigger value="valuations">Valuations</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="compliance">SCSI</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Cost management and project financial health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="mb-2">
                      <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">{qsCostData.kpis.costPerformance}</span>
                      </div>
                    </div>
                    <h4 className="font-medium">Cost Performance</h4>
                    <p className="text-sm text-gray-600">Budget vs Actual</p>
                  </div>

                  <div className="text-center">
                    <div className="mb-2">
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">{qsCostData.kpis.schedulePerformance}</span>
                      </div>
                    </div>
                    <h4 className="font-medium">Schedule Performance</h4>
                    <p className="text-sm text-gray-600">Progress vs Plan</p>
                  </div>

                  <div className="text-center">
                    <div className="mb-2">
                      <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-yellow-600">{qsCostData.kpis.variationControl}</span>
                      </div>
                    </div>
                    <h4 className="font-medium">Variation Control</h4>
                    <p className="text-sm text-gray-600">Change Management</p>
                  </div>

                  <div className="text-center">
                    <div className="mb-2">
                      <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-purple-600">{qsCostData.kpis.cashFlowHealth}</span>
                      </div>
                    </div>
                    <h4 className="font-medium">Cash Flow Health</h4>
                    <p className="text-sm text-gray-600">Payment Performance</p>
                  </div>

                  <div className="text-center">
                    <div className="mb-2">
                      <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-orange-600">{qsCostData.kpis.certificationAccuracy}</span>
                      </div>
                    </div>
                    <h4 className="font-medium">Certification Accuracy</h4>
                    <p className="text-sm text-gray-600">Valuation Quality</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Contract Value</span>
                      <span className="font-bold">{formatCurrency(qsCostData.contractValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Certified to Date</span>
                      <span className="font-bold text-green-600">{formatCurrency(qsCostData.summary?.totalCertified || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Variations</span>
                      <span className={`font-bold ${(qsCostData.summary?.variationsValue || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(qsCostData.summary?.variationsValue || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Contingency Used</span>
                      <span className="font-bold text-orange-600">{formatCurrency(qsCostData.summary?.contingencyUsed || 0)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Forecast Final</span>
                      <span className="font-bold text-lg">{formatCurrency(qsCostData.summary?.forecastFinal || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Variance</span>
                      <span className={`font-bold ${getVarianceColor((((qsCostData.summary?.forecastFinal || 0) - qsCostData.contractValue) / qsCostData.contractValue) * 100)}`}>
                        {formatCurrency((qsCostData.summary?.forecastFinal || 0) - qsCostData.contractValue)} 
                        ({formatPercentage((((qsCostData.summary?.forecastFinal || 0) - qsCostData.contractValue) / qsCostData.contractValue) * 100)})
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Paid</span>
                      <span className="font-bold text-green-600">{formatCurrency(qsCostData.summary?.totalPaid || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Retention Held</span>
                      <span className="font-bold text-yellow-600">{formatCurrency(qsCostData.summary?.retentionHeld || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Outstanding Amount</span>
                      <span className="font-bold text-orange-600">{formatCurrency(qsCostData.summary?.outstandingAmount || 0)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Payment Efficiency</span>
                      <span className="font-bold">
                        {(((qsCostData.summary?.totalPaid || 0) / (qsCostData.summary?.totalCertified || 1)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Profit Margin</span>
                      <span className={`font-bold ${(qsCostData.summary?.profitMargin || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(qsCostData.summary?.profitMargin || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Valuation #12 Certified</p>
                      <p className="text-sm text-gray-600">Monthly valuation for €285,000 certified by client</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">BOQ Updated</p>
                      <p className="text-sm text-gray-600">Structural works rates updated with latest market pricing</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <ArrowUpDown className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Variation Submitted</p>
                      <p className="text-sm text-gray-600">Additional insulation specification - €25,000 addition</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bill of Quantities Tab */}
          <TabsContent value="boq" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Bill of Quantities</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  Update Rates
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>BOQ Version {qsCostData.billOfQuantities.version}</CardTitle>
                    <CardDescription>
                      Status: {qsCostData.billOfQuantities.status} | 
                      Total: {formatCurrency(qsCostData.billOfQuantities.grandTotal)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(qsCostData.billOfQuantities.status)}>
                    {qsCostData.billOfQuantities.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {qsCostData.billOfQuantities.sections.map((section) => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{section.code} - {section.title}</h4>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(section.sectionTotal)}</p>
                          <p className={`text-sm ${getVarianceColor(section.variance)}`}>
                            {section.variance >= 0 ? '+' : ''}{section.variance.toFixed(1)}% variance
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completion</span>
                          <span>{section.completionPercentage}%</span>
                        </div>
                        <Progress value={section.completionPercentage} className="h-2" />
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Code</th>
                              <th className="text-left p-2">Description</th>
                              <th className="text-left p-2">Unit</th>
                              <th className="text-right p-2">Qty</th>
                              <th className="text-right p-2">Rate</th>
                              <th className="text-right p-2">Amount</th>
                              <th className="text-center p-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.elements.slice(0, 5).map((element) => (
                              <tr key={element.id} className="border-b">
                                <td className="p-2 font-mono">{element.code}</td>
                                <td className="p-2">{element.description}</td>
                                <td className="p-2">{element.unit}</td>
                                <td className="p-2 text-right">{element.quantity}</td>
                                <td className="p-2 text-right">{formatCurrency(element.rate)}</td>
                                <td className="p-2 text-right font-medium">{formatCurrency(element.amount)}</td>
                                <td className="p-2 text-center">
                                  <Badge className={getStatusColor(element.status)} variant="outline">
                                    {element.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {section.elements.length > 5 && (
                          <p className="text-sm text-gray-500 text-center mt-2">
                            +{section.elements.length - 5} more items
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Valuations Tab */}
          <TabsContent value="valuations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Interim Valuations</h3>
              <Button>
                <Calculator className="h-4 w-4 mr-2" />
                New Valuation
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {qsCostData.valuations.slice(0, 6).map((valuation) => (
                <Card key={valuation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Valuation #{valuation.valuationNumber}</CardTitle>
                      <Badge className={getStatusColor(valuation.status)}>
                        {valuation.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {valuation.periodFrom.toLocaleDateString()} - {valuation.periodTo.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">This Valuation</span>
                        <span className="font-medium">{formatCurrency(valuation.thisValuation)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cumulative</span>
                        <span className="font-medium">{formatCurrency(valuation.cumulativeValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Retention</span>
                        <span className="font-medium text-yellow-600">{formatCurrency(valuation.retentionAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Net Amount</span>
                        <span className="font-bold text-green-600">{formatCurrency(valuation.netAmount)}</span>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Prepared by</span>
                          <span>{valuation.preparedBy}</span>
                        </div>
                        {valuation.certifiedBy && (
                          <div className="flex justify-between text-sm">
                            <span>Certified by</span>
                            <span>{valuation.certifiedBy}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span>Payment Due</span>
                          <span>{valuation.paymentDue.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Variations Tab */}
          <TabsContent value="variations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Contract Variations</h3>
              <Button>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                New Variation
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Variation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(125000)}
                    </p>
                    <p className="text-sm text-gray-600">Approved Additions</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded">
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(45000)}
                    </p>
                    <p className="text-sm text-gray-600">Omissions</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(80000)}
                    </p>
                    <p className="text-sm text-gray-600">Net Variation</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded">
                    <p className="text-2xl font-bold text-yellow-600">
                      3.2%
                    </p>
                    <p className="text-sm text-gray-600">of Contract Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Variation Orders</CardTitle>
                <CardDescription>All contract variations and change orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock variation data would be mapped here */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">VO-001: Additional Insulation Specification</h4>
                        <p className="text-sm text-gray-600">Enhanced energy performance requirements</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800">Addition</Badge>
                        <Badge className={getStatusColor('approved')}>Approved</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Original:</span>
                        <p className="text-gray-600">{formatCurrency(0)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Claimed:</span>
                        <p className="text-gray-600">{formatCurrency(25000)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Agreed:</span>
                        <p className="text-green-600 font-medium">{formatCurrency(25000)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Impact:</span>
                        <p className="text-gray-600">+3 days</p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      <p><strong>Submitted:</strong> 15 Jun 2025 by Client</p>
                      <p><strong>Approved:</strong> 18 Jun 2025 by Project Manager</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cash Flow Tab */}
          <TabsContent value="cash-flow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
                <CardDescription>Planned vs actual cash flow and payment performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">94%</p>
                      <p className="text-sm text-gray-600">Certification Accuracy</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded">
                      <p className="text-2xl font-bold text-green-600">28 days</p>
                      <p className="text-sm text-gray-600">Average Payment Time</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded">
                      <p className="text-2xl font-bold text-orange-600">5%</p>
                      <p className="text-sm text-gray-600">Retention Rate</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Period</th>
                          <th className="text-right p-2">Planned Cert.</th>
                          <th className="text-right p-2">Actual Cert.</th>
                          <th className="text-right p-2">Planned Payment</th>
                          <th className="text-right p-2">Actual Payment</th>
                          <th className="text-right p-2">Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qsCostData.cashFlow.slice(0, 6).map((period) => (
                          <tr key={period.period} className="border-b">
                            <td className="p-2 font-medium">{period.period}</td>
                            <td className="p-2 text-right">{formatCurrency(period.plannedCertifications)}</td>
                            <td className="p-2 text-right">{formatCurrency(period.actualCertifications)}</td>
                            <td className="p-2 text-right">{formatCurrency(period.plannedPayments)}</td>
                            <td className="p-2 text-right">{formatCurrency(period.actualPayments)}</td>
                            <td className={`p-2 text-right font-medium ${getVarianceColor(period.variance)}`}>
                              {formatCurrency(period.variance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Cost Reports</h3>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qsCostData.costReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <CardDescription>{report.period}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p><strong>Generated:</strong> {report.generatedDate.toLocaleDateString()}</p>
                        <p><strong>By:</strong> {report.generatedBy}</p>
                      </div>

                      <div className="border-t pt-3">
                        <h4 className="font-medium text-sm mb-2">Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Budget Total:</span>
                            <span>{formatCurrency(report.summary.budgetTotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Actual Total:</span>
                            <span>{formatCurrency(report.summary.actualTotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Variance:</span>
                            <span className={getVarianceColor(report.summary.variancePercentage)}>
                              {formatPercentage(report.summary.variancePercentage)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SCSI Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SCSI Professional Compliance</CardTitle>
                <CardDescription>Society of Chartered Surveyors Ireland compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>SCSI Membership</span>
                      <Badge className={
                        qsCostData.compliance?.membershipStatus 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {qsCostData.compliance?.membershipStatus ? 'Active Member' : 'Not Member'}
                      </Badge>
                    </div>

                    {qsCostData.compliance?.registrationNumber && (
                      <div className="flex items-center justify-between">
                        <span>Registration Number</span>
                        <span className="font-mono">{qsCostData.compliance.registrationNumber}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span>Professional Indemnity</span>
                      <Badge className={
                        qsCostData.compliance?.professionalIndemnity?.valid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {qsCostData.compliance?.professionalIndemnity?.valid ? 'Valid' : 'Expired'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Code of Conduct</span>
                      <Badge className={
                        qsCostData.compliance?.codeOfConduct 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {qsCostData.compliance?.codeOfConduct ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Qualifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {qsCostData.compliance?.qualifications?.map((qual, index) => (
                          <Badge key={index} variant="outline">
                            {qual}
                          </Badge>
                        )) || <span className="text-gray-500">No qualifications listed</span>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {qsCostData.compliance?.specializations?.map((spec, index) => (
                          <Badge key={index} variant="outline">
                            {spec}
                          </Badge>
                        )) || <span className="text-gray-500">No specializations listed</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Continuing Professional Development</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Year</p>
                      <p className="font-bold">{qsCostData.compliance?.continuingProfessionalDevelopment?.currentYear || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Required Hours</p>
                      <p className="font-bold">{qsCostData.compliance?.continuingProfessionalDevelopment?.requiredHours || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed Hours</p>
                      <p className="font-bold text-green-600">{qsCostData.compliance?.continuingProfessionalDevelopment?.completedHours || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Progress 
                      value={
                        (qsCostData.compliance?.continuingProfessionalDevelopment?.completedHours && 
                         qsCostData.compliance?.continuingProfessionalDevelopment?.requiredHours) 
                          ? (qsCostData.compliance.continuingProfessionalDevelopment.completedHours / qsCostData.compliance.continuingProfessionalDevelopment.requiredHours) * 100
                          : 0
                      } 
                      className="h-3"
                    />
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Recent CPD Courses</h5>
                    <div className="space-y-2">
                      {qsCostData.compliance?.continuingProfessionalDevelopment?.courses?.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-gray-600">{course.provider}</p>
                          </div>
                          <div className="text-right">
                            <p>{course.hours} hours</p>
                            <p className="text-gray-500">{course.completionDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                      )) || <p className="text-gray-500">No CPD courses recorded</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuantitySurveyorDashboard;