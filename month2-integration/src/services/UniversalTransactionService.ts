/**
 * Universal Transaction Service
 * Scalable transaction triangle system for all development projects
 * 
 * @fileoverview Platform-wide transaction management across all developments
 * @version 2.0.0
 * @author Property Development Platform Team
 */

import { 
  BuyerInformation, 
  Unit, 
  UnitStatus,
  ProjectStateUpdate,
  Project 
} from '@/types/project';
import { projectDataService } from '@/services/ProjectDataService';
import { buyerSolicitorIntegrationService, SolicitorCase } from '@/services/BuyerSolicitorIntegrationService';

// Enhanced interfaces for multi-project support
export interface UniversalTransactionData {
  projectTransactions: Map<string, ProjectTransactionSummary>;
  crossProjectMetrics: CrossProjectMetrics;
  portfolioInsights: PortfolioInsights;
  globalRiskAlerts: GlobalRiskAlert[];
}

export interface ProjectTransactionSummary {
  projectId: string;
  projectName: string;
  totalUnits: number;
  activeTransactions: number;
  completedTransactions: number;
  pipelineValue: number;
  averageTransactionTime: number;
  completionRate: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recentActivity: TransactionActivity[];
  solicitorCases: SolicitorCase[];
}

export interface CrossProjectMetrics {
  totalPortfolioValue: number;
  totalActiveTransactions: number;
  averageCompletionRate: number;
  topPerformingProject: string;
  underPerformingProjects: string[];
  portfolioRiskScore: number;
  monthlyVelocity: number;
  yearOverYearGrowth: number;
}

export interface PortfolioInsights {
  marketTrends: MarketTrend[];
  seasonalPatterns: SeasonalPattern[];
  buyerBehaviorInsights: BuyerInsight[];
  performanceComparisons: ProjectComparison[];
  predictiveAnalytics: PredictiveInsight[];
}

export interface GlobalRiskAlert {
  id: string;
  projectId: string;
  projectName: string;
  riskType: 'portfolio_concentration' | 'market_downturn' | 'seasonal_slowdown' | 'competitive_pressure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  recommendedActions: string[];
  affectedTransactions: number;
  potentialRevenueLoss: number;
}

export interface TransactionActivity {
  id: string;
  type: 'reservation' | 'completion' | 'cancellation' | 'milestone' | 'risk_alert';
  timestamp: Date;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  unitId?: string;
  buyerName?: string;
}

export interface MarketTrend {
  id: string;
  trend: string;
  direction: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: string;
  impactedProjects: string[];
}

export interface SeasonalPattern {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  historicalPerformance: number;
  currentProjection: number;
  recommendedActions: string[];
}

export interface BuyerInsight {
  insight: string;
  category: 'demographics' | 'preferences' | 'behavior' | 'financial';
  confidence: number;
  applicableProjects: string[];
}

export interface ProjectComparison {
  metric: string;
  projectRankings: { projectId: string; value: number; rank: number }[];
  insights: string[];
}

export interface PredictiveInsight {
  prediction: string;
  probability: number;
  timeframe: string;
  recommendedPreparations: string[];
}

// =============================================================================
// UNIVERSAL TRANSACTION SERVICE CLASS
// =============================================================================

export class UniversalTransactionService {
  private static instance: UniversalTransactionService;
  private projectRegistry: Map<string, Project> = new Map();
  private transactionCache: Map<string, ProjectTransactionSummary> = new Map();
  private lastCacheUpdate: Date = new Date(0);
  private cacheValidityPeriod = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // Singleton pattern for enterprise data consistency
    this.initializeProjectRegistry();
  }

  public static getInstance(): UniversalTransactionService {
    if (!UniversalTransactionService.instance) {
      UniversalTransactionService.instance = new UniversalTransactionService();
    }
    return UniversalTransactionService.instance;
  }

  // =============================================================================
  // PROJECT REGISTRY MANAGEMENT
  // =============================================================================

  /**
   * Initialize project registry with all available developments
   */
  private async initializeProjectRegistry(): Promise<void> {
    try {
      // Get all available projects from the platform
      const availableProjects = this.getAvailableProjects();
      
      for (const projectConfig of availableProjects) {
        const project = this.initializeProject(projectConfig);
        this.projectRegistry.set(project.id, project);
      }

    } catch (error) {
    }
  }

  /**
   * Get list of all available development projects
   */
  private getAvailableProjects(): ProjectConfig[] {
    return [
      {
        id: 'fitzgerald-gardens',
        name: 'Fitzgerald Gardens',
        location: 'Drogheda, Co. Louth',
        developer: 'Cairn Homes',
        totalUnits: 50,
        phase: 'active'
      },
      {
        id: 'ellwood-manor',
        name: 'Ellwood Manor',
        location: 'Blanchardstown, Dublin 15',
        developer: 'Cairn Homes',
        totalUnits: 125,
        phase: 'active'
      },
      {
        id: 'ballymakenny-view',
        name: 'Ballymakenny View',
        location: 'Drogheda, Co. Louth',
        developer: 'Cairn Homes',
        totalUnits: 85,
        phase: 'planning'
      },
      {
        id: 'ashbrook-gardens',
        name: 'Ashbrook Gardens',
        location: 'Ashbourne, Co. Meath',
        developer: 'Cairn Homes',
        totalUnits: 200,
        phase: 'active'
      }
    ];
  }

  /**
   * Initialize a project with dynamic data generation
   */
  private initializeProject(config: ProjectConfig): Project {
    // Use existing Fitzgerald Gardens logic as template
    if (config.id === 'fitzgerald-gardens') {
      return projectDataService.initializeFitzgeraldGardens();
    }

    // Generate project data for other developments
    return this.generateProjectData(config);
  }

  /**
   * Generate realistic project data for any development
   */
  private generateProjectData(config: ProjectConfig): Project {
    const now = new Date();
    const startDate = new Date(now.getTime() - (Math.random() * 365 * 24 * 60 * 60 * 1000)); // Random start within last year
    const completionDate = new Date(now.getTime() + ((1 + Math.random()) * 365 * 24 * 60 * 60 * 1000)); // 1-2 years from now

    return {
      id: config.id,
      name: config.name,
      location: config.location,
      description: `Premium residential development in ${config.location}`,
      metrics: this.generateProjectMetrics(config),
      unitBreakdown: this.generateUnitBreakdown(config),
      timeline: {
        projectStart: startDate,
        plannedCompletion: completionDate,
        currentPhase: config.phase === 'active' ? 'Construction' : 'Planning',
        progressPercentage: config.phase === 'active' ? 45 + Math.random() * 40 : 15,
        milestones: this.generateMilestones(startDate, completionDate)
      },
      units: this.generateUnits(config),
      teamMembers: [],
      invoices: [],
      feeProposals: [],
      professionalAppointments: []
    };
  }

  private generateProjectMetrics(config: ProjectConfig): any {
    const basePrice = 300000 + (Math.random() * 200000);
    const totalRevenue = config.totalUnits * basePrice;
    
    return {
      totalUnits: config.totalUnits,
      soldUnits: Math.floor(config.totalUnits * (0.2 + Math.random() * 0.3)),
      reservedUnits: Math.floor(config.totalUnits * (0.1 + Math.random() * 0.2)),
      availableUnits: config.totalUnits,
      projectedRevenue: totalRevenue,
      averageUnitPrice: basePrice,
      salesVelocity: 2 + Math.random() * 4, // units per month
      conversionRate: 0.65 + Math.random() * 0.25
    };
  }

  private generateUnitBreakdown(config: ProjectConfig): any[] {
    return [
      {
        type: '1 Bed Apartment',
        totalCount: Math.floor(config.totalUnits * 0.3),
        sold: Math.floor(config.totalUnits * 0.3 * 0.4),
        reserved: Math.floor(config.totalUnits * 0.3 * 0.2),
        available: Math.floor(config.totalUnits * 0.3 * 0.4),
        priceRange: { min: 250000, max: 320000 }
      },
      {
        type: '2 Bed Apartment',
        totalCount: Math.floor(config.totalUnits * 0.4),
        sold: Math.floor(config.totalUnits * 0.4 * 0.3),
        reserved: Math.floor(config.totalUnits * 0.4 * 0.15),
        available: Math.floor(config.totalUnits * 0.4 * 0.55),
        priceRange: { min: 320000, max: 420000 }
      },
      {
        type: '3 Bed House',
        totalCount: Math.floor(config.totalUnits * 0.3),
        sold: Math.floor(config.totalUnits * 0.3 * 0.2),
        reserved: Math.floor(config.totalUnits * 0.3 * 0.1),
        available: Math.floor(config.totalUnits * 0.3 * 0.7),
        priceRange: { min: 420000, max: 580000 }
      }
    ];
  }

  private generateMilestones(startDate: Date, completionDate: Date): any[] {
    const duration = completionDate.getTime() - startDate.getTime();
    
    return [
      {
        id: 'planning',
        name: 'Planning Permission',
        date: new Date(startDate.getTime() + duration * 0.1),
        completed: true,
        critical: true
      },
      {
        id: 'construction',
        name: 'Construction Start',
        date: new Date(startDate.getTime() + duration * 0.25),
        completed: Date.now() > startDate.getTime() + duration * 0.25,
        critical: true
      },
      {
        id: 'completion',
        name: 'Project Completion',
        date: completionDate,
        completed: false,
        critical: true
      }
    ];
  }

  private generateUnits(config: ProjectConfig): Unit[] {
    // Generate realistic unit data for the project
    return Array.from({ length: config.totalUnits }, (_, index) => {
      const unitNumber = (index + 1).toString().padStart(3, '0');
      const unitTypes = ['1 Bed Apartment', '2 Bed Apartment', '3 Bed House'];
      const type = unitTypes[index % unitTypes.length];
      
      return {
        id: `${config.id}-unit-${unitNumber}`,
        number: unitNumber,
        type: type as any,
        status: this.generateUnitStatus(index),
        pricing: {
          basePrice: 300000 + (Math.random() * 200000),
          currentPrice: 300000 + (Math.random() * 200000),
          priceHistory: []
        },
        features: this.generateUnitFeatures(type),
        location: {
          building: Math.floor(index / 24) + 1,
          floor: Math.floor((index % 24) / 6) + 1,
          coordinates: { x: index % 10, y: Math.floor(index / 10) }
        },
        lastUpdated: new Date(),
        statusHistory: [],
        buyer: null,
        legalPack: {
          solicitorPackSent: false,
          contractSigned: false,
          depositPaid: false,
          mortgageApproved: false,
          completionScheduled: false
        }
      };
    });
  }

  private generateUnitStatus(index: number): UnitStatus {
    const statuses: UnitStatus[] = ['available', 'reserved', 'sold'];
    const weights = [0.6, 0.25, 0.15]; // 60% available, 25% reserved, 15% sold
    
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return statuses[i];
      }
    }
    
    return 'available';
  }

  private generateUnitFeatures(type: string): any {
    const baseFeatures = {
      bedrooms: type.includes('1 Bed') ? 1 : type.includes('2 Bed') ? 2 : 3,
      bathrooms: type.includes('1 Bed') ? 1 : 2,
      sqft: type.includes('1 Bed') ? 650 : type.includes('2 Bed') ? 850 : 1200,
      features: [
        'A-rated energy efficiency',
        'Premium kitchen appliances', 
        'Modern bathroom suites',
        'Private parking space'
      ],
      amenities: [
        'Landscaped communal areas',
        'Children\'s playground',
        'Bicycle storage',
        'Waste management facilities'
      ]
    };

    if (type.includes('House')) {
      baseFeatures.features.push('Private garden');
      baseFeatures.amenities.push('Garden shed');
    } else {
      baseFeatures.features.push('Private balcony');
    }

    return baseFeatures;
  }

  // =============================================================================
  // UNIVERSAL TRANSACTION MANAGEMENT
  // =============================================================================

  /**
   * Create solicitor case for any project/unit
   */
  public async createUniversalCase(
    projectId: string,
    unitId: string,
    buyer: BuyerInformation,
    reservationData: any
  ): Promise<SolicitorCase | null> {
    try {
      const project = this.projectRegistry.get(projectId);
      if (!project) {
        return null;
      }

      const unit = project.units.find(u => u.id === unitId);
      if (!unit) {
        return null;
      }

      // Create case using the buyer-solicitor integration service
      const solicitorCase = await buyerSolicitorIntegrationService.createCaseFromReservation({
        unitId,
        buyer,
        property: unit,
        reservationAmount: reservationData.amount,
        htbApplication: buyer.htbEligible ? {
          id: `htb-${buyer.id}`,
          amount: reservationData.htbAmount || 30000,
          status: 'submitted'
        } : undefined
      });

      // Broadcast universal state update
      projectDataService.broadcastStateUpdate({
        projectId,
        unitId,
        eventType: 'universal_case_created',
        timestamp: new Date(),
        data: {
          caseId: solicitorCase.id,
          caseNumber: solicitorCase.caseNumber,
          projectName: project.name,
          buyerName: buyer.name
        }
      });

      // Invalidate cache to trigger refresh
      this.invalidateCache();

      return solicitorCase;

    } catch (error) {
      return null;
    }
  }

  /**
   * Get transaction data for all projects
   */
  public async getUniversalTransactionData(): Promise<UniversalTransactionData> {
    try {
      await this.refreshCacheIfNeeded();

      const projectTransactions = new Map<string, ProjectTransactionSummary>();
      
      // Generate transaction summaries for each project
      for (const [projectId, project] of this.projectRegistry) {
        const summary = await this.generateProjectTransactionSummary(project);
        projectTransactions.set(projectId, summary);
      }

      const crossProjectMetrics = this.calculateCrossProjectMetrics(projectTransactions);
      const portfolioInsights = this.generatePortfolioInsights(projectTransactions);
      const globalRiskAlerts = this.identifyGlobalRiskAlerts(projectTransactions);

      return {
        projectTransactions,
        crossProjectMetrics,
        portfolioInsights,
        globalRiskAlerts
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate transaction summary for a specific project
   */
  private async generateProjectTransactionSummary(project: Project): Promise<ProjectTransactionSummary> {
    const reservedUnits = project.units.filter(u => u.status === 'reserved');
    const soldUnits = project.units.filter(u => u.status === 'sold');
    const activeTransactions = reservedUnits.length;
    const completedTransactions = soldUnits.length;

    // Get solicitor cases for this project
    const solicitorCases = buyerSolicitorIntegrationService.getAllCases()
      .filter(c => c.propertyId.includes(project.id) || 
                   c.property.developmentName.includes(project.name));

    const pipelineValue = [...reservedUnits, ...soldUnits]
      .reduce((sum, unit) => sum + unit.pricing.currentPrice, 0);

    const completionRate = project.metrics.conversionRate || 0.75;
    const averageTransactionTime = 84; // days

    return {
      projectId: project.id,
      projectName: project.name,
      totalUnits: project.metrics.totalUnits,
      activeTransactions,
      completedTransactions,
      pipelineValue,
      averageTransactionTime,
      completionRate,
      riskLevel: this.calculateProjectRiskLevel(project, activeTransactions),
      recentActivity: this.generateRecentActivity(project),
      solicitorCases
    };
  }

  private calculateProjectRiskLevel(project: Project, activeTransactions: number): 'low' | 'medium' | 'high' | 'critical' {
    const salesVelocity = project.metrics.salesVelocity || 3;
    const progressPercentage = project.timeline.progressPercentage || 50;
    
    if (salesVelocity < 2 && progressPercentage > 80) return 'critical';
    if (salesVelocity < 3 && progressPercentage > 60) return 'high';
    if (salesVelocity < 4) return 'medium';
    return 'low';
  }

  private generateRecentActivity(project: Project): TransactionActivity[] {
    // Generate mock recent activity data
    return [
      {
        id: `activity-${project.id}-1`,
        type: 'reservation',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        description: 'New unit reservation',
        impact: 'positive'
      },
      {
        id: `activity-${project.id}-2`,
        type: 'milestone',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        description: 'Mortgage approval completed',
        impact: 'positive'
      }
    ];
  }

  private calculateCrossProjectMetrics(projectTransactions: Map<string, ProjectTransactionSummary>): CrossProjectMetrics {
    const summaries = Array.from(projectTransactions.values());
    
    const totalPortfolioValue = summaries.reduce((sum, s) => sum + s.pipelineValue, 0);
    const totalActiveTransactions = summaries.reduce((sum, s) => sum + s.activeTransactions, 0);
    const averageCompletionRate = summaries.reduce((sum, s) => sum + s.completionRate, 0) / summaries.length;
    
    const topPerforming = summaries.sort((a, b) => b.completionRate - a.completionRate)[0];
    const underPerforming = summaries
      .filter(s => s.completionRate < averageCompletionRate * 0.8)
      .map(s => s.projectName);

    return {
      totalPortfolioValue,
      totalActiveTransactions,
      averageCompletionRate,
      topPerformingProject: topPerforming?.projectName || 'N/A',
      underPerformingProjects: underPerforming,
      portfolioRiskScore: this.calculatePortfolioRiskScore(summaries),
      monthlyVelocity: summaries.reduce((sum, s) => sum + s.activeTransactions, 0) / summaries.length,
      yearOverYearGrowth: 0.15 // 15% growth
    };
  }

  private calculatePortfolioRiskScore(summaries: ProjectTransactionSummary[]): number {
    const riskWeights = { low: 1, medium: 2, high: 3, critical: 4 };
    const totalRisk = summaries.reduce((sum, s) => sum + riskWeights[s.riskLevel], 0);
    return Math.min(100, (totalRisk / summaries.length) * 25);
  }

  private generatePortfolioInsights(projectTransactions: Map<string, ProjectTransactionSummary>): PortfolioInsights {
    return {
      marketTrends: [
        {
          id: 'trend-1',
          trend: 'Increased demand for 2-bed apartments',
          direction: 'up',
          confidence: 0.85,
          timeframe: 'Q1 2025',
          impactedProjects: ['fitzgerald-gardens', 'ellwood-manor']
        }
      ],
      seasonalPatterns: [
        {
          season: 'spring',
          historicalPerformance: 1.2,
          currentProjection: 1.15,
          recommendedActions: ['Increase marketing spend', 'Prepare additional inventory']
        }
      ],
      buyerBehaviorInsights: [
        {
          insight: 'HTB buyers prefer properties closer to Dublin',
          category: 'preferences',
          confidence: 0.78,
          applicableProjects: ['ellwood-manor']
        }
      ],
      performanceComparisons: [
        {
          metric: 'Sales Velocity',
          projectRankings: Array.from(projectTransactions.values()).map((s, i) => ({
            projectId: s.projectId,
            value: s.activeTransactions,
            rank: i + 1
          })),
          insights: ['Location proximity to Dublin correlates with higher velocity']
        }
      ],
      predictiveAnalytics: [
        {
          prediction: 'Fitzgerald Gardens will sell out by Q3 2025',
          probability: 0.82,
          timeframe: 'Q3 2025',
          recommendedPreparations: ['Begin planning for next phase', 'Secure additional land']
        }
      ]
    };
  }

  private identifyGlobalRiskAlerts(projectTransactions: Map<string, ProjectTransactionSummary>): GlobalRiskAlert[] {
    const alerts: GlobalRiskAlert[] = [];
    
    // Check for portfolio concentration risk
    const summaries = Array.from(projectTransactions.values());
    const highRiskProjects = summaries.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical');
    
    if (highRiskProjects.length > summaries.length * 0.3) {
      alerts.push({
        id: 'global-risk-1',
        projectId: 'portfolio',
        projectName: 'Portfolio-wide',
        riskType: 'portfolio_concentration',
        severity: 'high',
        description: 'High concentration of at-risk projects in portfolio',
        impact: 'Potential significant revenue impact across multiple developments',
        recommendedActions: [
          'Implement immediate intervention strategies',
          'Increase marketing and sales support',
          'Review pricing strategies'
        ],
        affectedTransactions: highRiskProjects.reduce((sum, p) => sum + p.activeTransactions, 0),
        potentialRevenueLoss: highRiskProjects.reduce((sum, p) => sum + p.pipelineValue * 0.2, 0)
      });
    }

    return alerts;
  }

  // =============================================================================
  // CACHE MANAGEMENT
  // =============================================================================

  private async refreshCacheIfNeeded(): Promise<void> {
    const now = new Date();
    if (now.getTime() - this.lastCacheUpdate.getTime() > this.cacheValidityPeriod) {
      await this.invalidateCache();
    }
  }

  private async invalidateCache(): Promise<void> {
    this.transactionCache.clear();
    this.lastCacheUpdate = new Date();
  }

  // =============================================================================
  // PUBLIC API
  // =============================================================================

  public getAvailableProjectIds(): string[] {
    return Array.from(this.projectRegistry.keys());
  }

  public getProjectById(projectId: string): Project | null {
    return this.projectRegistry.get(projectId) || null;
  }

  public async getProjectTransactionSummary(projectId: string): Promise<ProjectTransactionSummary | null> {
    const project = this.projectRegistry.get(projectId);
    if (!project) return null;

    return this.generateProjectTransactionSummary(project);
  }
}

// Project configuration interface
interface ProjectConfig {
  id: string;
  name: string;
  location: string;
  developer: string;
  totalUnits: number;
  phase: 'planning' | 'active' | 'completed';
}

// Export singleton instance
export const universalTransactionService = UniversalTransactionService.getInstance();