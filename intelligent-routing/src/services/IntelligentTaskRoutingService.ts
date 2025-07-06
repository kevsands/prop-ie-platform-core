/**
 * Intelligent Task Routing Service
 * 
 * Month 2 Implementation: Professional Role Integration (Advanced Features)
 * 
 * AI-powered task assignment system that automatically routes tasks to optimal professionals
 * based on availability, expertise, certification requirements, and workload optimization
 */

import { PrismaClient, UserRole, EcosystemTask, TaskTemplate, User } from '@prisma/client';
import { EventEmitter } from 'events';
import EcosystemCoordinationService from './EcosystemCoordinationService';
import EcosystemNotificationService from './EcosystemNotificationService';
import { professionalRoleService } from './professionalRoleService';

const prisma = new PrismaClient();

export interface TaskRoutingRequest {
  taskId?: string;
  taskTemplateId?: string;
  transactionId: string;
  requiredRole: UserRole;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: Date;
  estimatedDurationHours: number;
  requiredCertifications?: string[];
  requiredSpecializations?: string[];
  locationPreference?: string;
  budgetConstraints?: {
    maxHourlyRate?: number;
    maxTotalCost?: number;
  };
  clientPreferences?: {
    preferredProfessionalIds?: string[];
    excludeProfessionalIds?: string[];
    communicationStyle?: string;
  };
}

export interface ProfessionalMatch {
  userId: string;
  user: User;
  matchScore: number;
  availabilityScore: number;
  expertiseScore: number;
  workloadScore: number;
  locationScore: number;
  costScore: number;
  clientCompatibilityScore: number;
  reasoning: string[];
  estimatedStartDate: Date;
  estimatedCompletionDate: Date;
  hourlyRate?: number;
  totalEstimatedCost?: number;
}

export interface RoutingResult {
  routingId: string;
  taskId: string;
  recommendedProfessional: ProfessionalMatch;
  alternativeProfessionals: ProfessionalMatch[];
  routingConfidence: number;
  autoAssigned: boolean;
  reasonsForSelection: string[];
  potentialRisks: string[];
  escalationRequired: boolean;
  routingMetrics: {
    totalCandidatesEvaluated: number;
    averageMatchScore: number;
    processingTimeMs: number;
    aiConfidenceLevel: number;
  };
}

/**
 * Intelligent Task Routing Service
 * 
 * Uses AI algorithms to match tasks with optimal professionals
 * across the 49-role professional ecosystem
 */
export class IntelligentTaskRoutingService extends EventEmitter {
  private routingHistory = new Map<string, RoutingResult>();
  private professionalPerformanceCache = new Map<string, any>();
  private workloadAnalysisCache = new Map<string, any>();

  constructor() {
    super();
    this.initializeRoutingEngine();
  }

  /**
   * Initialize the routing engine with event handlers
   */
  private initializeRoutingEngine() {
    this.on('taskRouted', this.handleTaskRouted.bind(this));
    this.on('routingFailed', this.handleRoutingFailed.bind(this));
    this.on('professionalAccepted', this.handleProfessionalAccepted.bind(this));
    this.on('professionalDeclined', this.handleProfessionalDeclined.bind(this));
  }

  /**
   * Route task to optimal professional using AI algorithms
   */
  async routeTask(request: TaskRoutingRequest): Promise<RoutingResult> {
    const startTime = Date.now();
    const routingId = `routing_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    try {
      // 1. Find all qualified professionals
      const qualifiedProfessionals = await this.findQualifiedProfessionals(request);

      if (qualifiedProfessionals.length === 0) {
        return this.handleNoQualifiedProfessionals(routingId, request);
      }

      // 2. Score each professional using AI algorithms
      const scoredProfessionals = await this.scoreProfessionals(qualifiedProfessionals, request);

      // 3. Select optimal professional
      const recommendedProfessional = scoredProfessionals[0];
      const alternativeProfessionals = scoredProfessionals.slice(1, 4); // Top 3 alternatives

      // 4. Determine if auto-assignment should occur
      const autoAssigned = this.shouldAutoAssign(recommendedProfessional, request);

      // 5. Build routing result
      const routingResult: RoutingResult = {
        routingId,
        taskId: request.taskId || `task_${Date.now()}`,
        recommendedProfessional,
        alternativeProfessionals,
        routingConfidence: recommendedProfessional.matchScore,
        autoAssigned,
        reasonsForSelection: this.generateSelectionReasons(recommendedProfessional, request),
        potentialRisks: this.identifyPotentialRisks(recommendedProfessional, request),
        escalationRequired: recommendedProfessional.matchScore < 70,
        routingMetrics: {
          totalCandidatesEvaluated: qualifiedProfessionals.length,
          averageMatchScore: scoredProfessionals.reduce((sum, p) => sum + p.matchScore, 0) / scoredProfessionals.length,
          processingTimeMs: Date.now() - startTime,
          aiConfidenceLevel: this.calculateAIConfidence(recommendedProfessional, scoredProfessionals)
        }
      };

      // 6. Store routing result
      this.routingHistory.set(routingId, routingResult);

      // 7. Execute assignment if auto-assigned
      if (autoAssigned) {
        await this.executeAutoAssignment(routingResult, request);
      }

      this.emit('taskRouted', routingResult);

      return routingResult;

    } catch (error) {
      console.error('Task routing failed:', error);
      const failureResult = this.createFailureResult(routingId, request, error);
      this.emit('routingFailed', failureResult);
      return failureResult;
    }
  }

  /**
   * Find all professionals qualified for the task
   */
  private async findQualifiedProfessionals(request: TaskRoutingRequest): Promise<User[]> {
    const whereClause: any = {
      role: request.requiredRole,
      status: 'ACTIVE'
    };

    // Add certification requirements
    if (request.requiredCertifications?.length) {
      whereClause.professionalCertifications = {
        some: {
          certificationName: { in: request.requiredCertifications },
          isActive: true,
          OR: [
            { expiryDate: null },
            { expiryDate: { gt: new Date() } }
          ]
        }
      };
    }

    // Add specialization requirements
    if (request.requiredSpecializations?.length) {
      whereClause.professionalSpecializations = {
        some: {
          specializationArea: { in: request.requiredSpecializations }
        }
      };
    }

    return await prisma.user.findMany({
      where: whereClause,
      include: {
        professionalCertifications: {
          where: { isActive: true }
        },
        professionalSpecializations: true,
        professionalAssociations: {
          where: { isActive: true }
        }
      }
    });
  }

  /**
   * Score professionals using AI algorithms
   */
  private async scoreProfessionals(professionals: User[], request: TaskRoutingRequest): Promise<ProfessionalMatch[]> {
    const matches: ProfessionalMatch[] = [];

    for (const professional of professionals) {
      const match = await this.scoreProfessional(professional, request);
      matches.push(match);
    }

    // Sort by match score descending
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Score individual professional using AI algorithms
   */
  private async scoreProfessional(professional: User, request: TaskRoutingRequest): Promise<ProfessionalMatch> {
    // 1. Availability scoring (30% weight)
    const availabilityScore = await this.calculateAvailabilityScore(professional, request);

    // 2. Expertise scoring (25% weight)
    const expertiseScore = await this.calculateExpertiseScore(professional, request);

    // 3. Workload scoring (20% weight)
    const workloadScore = await this.calculateWorkloadScore(professional, request);

    // 4. Location scoring (10% weight)
    const locationScore = await this.calculateLocationScore(professional, request);

    // 5. Cost scoring (10% weight)
    const costScore = await this.calculateCostScore(professional, request);

    // 6. Client compatibility scoring (5% weight)
    const clientCompatibilityScore = await this.calculateClientCompatibilityScore(professional, request);

    // Calculate weighted overall match score
    const matchScore = Math.round(
      (availabilityScore * 0.30) +
      (expertiseScore * 0.25) +
      (workloadScore * 0.20) +
      (locationScore * 0.10) +
      (costScore * 0.10) +
      (clientCompatibilityScore * 0.05)
    );

    // Calculate estimated dates
    const { estimatedStartDate, estimatedCompletionDate } = await this.calculateEstimatedDates(professional, request);

    // Generate reasoning
    const reasoning = this.generateProfessionalReasoning(
      professional,
      { availabilityScore, expertiseScore, workloadScore, locationScore, costScore, clientCompatibilityScore }
    );

    return {
      userId: professional.id,
      user: professional,
      matchScore,
      availabilityScore,
      expertiseScore,
      workloadScore,
      locationScore,
      costScore,
      clientCompatibilityScore,
      reasoning,
      estimatedStartDate,
      estimatedCompletionDate,
      hourlyRate: this.getEstimatedHourlyRate(professional),
      totalEstimatedCost: this.calculateTotalEstimatedCost(professional, request)
    };
  }

  /**
   * Calculate availability score (0-100)
   */
  private async calculateAvailabilityScore(professional: User, request: TaskRoutingRequest): Promise<number> {
    // Get current active tasks
    const activeTasks = await prisma.ecosystemTask.count({
      where: {
        assignedToProfessionalUserId: professional.id,
        status: { in: ['assigned', 'in_progress'] }
      }
    });

    // Check calendar availability (simplified)
    const workloadCapacity = 40; // hours per week
    const currentWorkload = activeTasks * 8; // assume 8 hours per task
    const availableCapacity = Math.max(0, workloadCapacity - currentWorkload);

    // Calculate availability percentage
    const availabilityPercentage = Math.min(100, (availableCapacity / workloadCapacity) * 100);

    // Adjust for deadline urgency
    const daysUntilDeadline = Math.max(1, Math.ceil((request.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const urgencyMultiplier = daysUntilDeadline < 3 ? 1.2 : daysUntilDeadline < 7 ? 1.1 : 1.0;

    return Math.min(100, availabilityPercentage * urgencyMultiplier);
  }

  /**
   * Calculate expertise score (0-100)
   */
  private async calculateExpertiseScore(professional: User, request: TaskRoutingRequest): Promise<number> {
    let score = 50; // Base score for having the required role

    // Certification match bonus
    if (request.requiredCertifications?.length) {
      const userCertifications = professional.professionalCertifications?.map(c => c.certificationName) || [];
      const certificationMatches = request.requiredCertifications.filter(req => 
        userCertifications.includes(req)
      ).length;
      score += (certificationMatches / request.requiredCertifications.length) * 25;
    }

    // Specialization match bonus
    if (request.requiredSpecializations?.length) {
      const userSpecializations = professional.professionalSpecializations?.map(s => s.specializationArea) || [];
      const specializationMatches = request.requiredSpecializations.filter(req => 
        userSpecializations.includes(req)
      ).length;
      score += (specializationMatches / request.requiredSpecializations.length) * 15;
    }

    // Experience bonus (simplified - would integrate with performance history)
    const experienceBonus = 10; // Would calculate from historical performance
    score += experienceBonus;

    return Math.min(100, score);
  }

  /**
   * Calculate workload score (0-100) - higher score for balanced workload
   */
  private async calculateWorkloadScore(professional: User, request: TaskRoutingRequest): Promise<number> {
    const activeTasks = await prisma.ecosystemTask.count({
      where: {
        assignedToProfessionalUserId: professional.id,
        status: { in: ['assigned', 'in_progress'] }
      }
    });

    // Optimal workload is 3-5 active tasks
    const optimalMin = 3;
    const optimalMax = 5;

    if (activeTasks >= optimalMin && activeTasks <= optimalMax) {
      return 100; // Optimal workload
    } else if (activeTasks < optimalMin) {
      return 80 + (activeTasks / optimalMin) * 20; // Underutilized
    } else {
      // Overloaded - score decreases rapidly
      const overload = activeTasks - optimalMax;
      return Math.max(0, 80 - (overload * 15));
    }
  }

  /**
   * Calculate location score (0-100)
   */
  private async calculateLocationScore(professional: User, request: TaskRoutingRequest): Promise<number> {
    if (!request.locationPreference) {
      return 75; // Neutral score if no location preference
    }

    // Simplified location scoring - would integrate with geographical data
    // For Irish property transactions, location matters for site visits, meetings, etc.
    return 85; // Would calculate actual distance/travel time
  }

  /**
   * Calculate cost score (0-100) - higher score for cost-effective options
   */
  private async calculateCostScore(professional: User, request: TaskRoutingRequest): Promise<number> {
    const estimatedRate = this.getEstimatedHourlyRate(professional);
    
    if (!request.budgetConstraints?.maxHourlyRate) {
      return 75; // Neutral score if no budget constraints
    }

    const budgetRatio = estimatedRate / request.budgetConstraints.maxHourlyRate;
    
    if (budgetRatio <= 0.8) return 100; // Well within budget
    if (budgetRatio <= 1.0) return 85;  // Within budget
    if (budgetRatio <= 1.2) return 50;  // Over budget but acceptable
    return 20; // Significantly over budget
  }

  /**
   * Calculate client compatibility score (0-100)
   */
  private async calculateClientCompatibilityScore(professional: User, request: TaskRoutingRequest): Promise<number> {
    let score = 75; // Base score

    // Check client preferences
    if (request.clientPreferences?.preferredProfessionalIds?.includes(professional.id)) {
      score = 100;
    } else if (request.clientPreferences?.excludeProfessionalIds?.includes(professional.id)) {
      score = 0;
    }

    return score;
  }

  /**
   * Calculate estimated start and completion dates
   */
  private async calculateEstimatedDates(professional: User, request: TaskRoutingRequest) {
    const now = new Date();
    
    // Simple calculation - would integrate with professional's actual calendar
    const estimatedStartDate = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 days from now
    const estimatedCompletionDate = new Date(
      estimatedStartDate.getTime() + (request.estimatedDurationHours * 60 * 60 * 1000)
    );

    return { estimatedStartDate, estimatedCompletionDate };
  }

  /**
   * Get estimated hourly rate for professional
   */
  private getEstimatedHourlyRate(professional: User): number {
    // Simplified rate calculation - would integrate with actual rate data
    const baseRates: Record<string, number> = {
      [UserRole.BUYER_SOLICITOR]: 350,
      [UserRole.ARCHITECT]: 125,
      [UserRole.ENGINEER]: 150,
      [UserRole.BER_ASSESSOR]: 95,
      [UserRole.BCAR_CERTIFIER]: 180,
      [UserRole.QUANTITY_SURVEYOR]: 120
    };

    return baseRates[professional.role] || 100;
  }

  /**
   * Calculate total estimated cost
   */
  private calculateTotalEstimatedCost(professional: User, request: TaskRoutingRequest): number {
    const hourlyRate = this.getEstimatedHourlyRate(professional);
    return hourlyRate * request.estimatedDurationHours;
  }

  /**
   * Generate reasoning for professional selection
   */
  private generateProfessionalReasoning(professional: User, scores: any): string[] {
    const reasoning: string[] = [];

    if (scores.availabilityScore > 80) {
      reasoning.push(`High availability (${scores.availabilityScore}%) - can start immediately`);
    }

    if (scores.expertiseScore > 85) {
      reasoning.push(`Excellent expertise match with required certifications`);
    }

    if (scores.workloadScore > 90) {
      reasoning.push(`Optimal current workload for quality delivery`);
    }

    if (scores.costScore > 85) {
      reasoning.push(`Cost-effective option within budget constraints`);
    }

    return reasoning;
  }

  /**
   * Determine if task should be auto-assigned
   */
  private shouldAutoAssign(professional: ProfessionalMatch, request: TaskRoutingRequest): boolean {
    return (
      professional.matchScore >= 85 &&
      professional.availabilityScore >= 80 &&
      request.priority !== 'critical' // Critical tasks require manual approval
    );
  }

  /**
   * Execute automatic task assignment
   */
  private async executeAutoAssignment(result: RoutingResult, request: TaskRoutingRequest): Promise<void> {
    try {
      // Create or update task assignment
      const task = await this.assignTaskToProfessional(result, request);

      // Send notification to assigned professional
      await EcosystemNotificationService.sendEcosystemNotification(
        'TASK_ASSIGNED',
        [request.requiredRole],
        {
          taskTitle: task.title || 'New Task Assignment',
          projectName: request.transactionId,
          deadline: request.deadline.toLocaleDateString(),
          assignedBy: 'Intelligent Routing System'
        },
        {
          targetUsers: [result.recommendedProfessional.userId],
          priority: request.priority,
          metadata: {
            taskId: result.taskId,
            routingId: result.routingId,
            actionRequired: true
          }
        }
      );

      console.log(`✅ Auto-assigned task ${result.taskId} to ${result.recommendedProfessional.user.role}`);

    } catch (error) {
      console.error('Auto-assignment failed:', error);
      this.emit('routingFailed', { ...result, error: error.message });
    }
  }

  /**
   * Assign task to professional in database
   */
  private async assignTaskToProfessional(result: RoutingResult, request: TaskRoutingRequest) {
    // Would integrate with actual task creation/assignment logic
    return {
      id: result.taskId,
      title: `Task for ${request.requiredRole}`,
      assignedUserId: result.recommendedProfessional.userId,
      status: 'assigned'
    };
  }

  /**
   * Handle case where no qualified professionals are found
   */
  private handleNoQualifiedProfessionals(routingId: string, request: TaskRoutingRequest): RoutingResult {
    return {
      routingId,
      taskId: request.taskId || `task_${Date.now()}`,
      recommendedProfessional: null as any,
      alternativeProfessionals: [],
      routingConfidence: 0,
      autoAssigned: false,
      reasonsForSelection: [],
      potentialRisks: ['No qualified professionals available'],
      escalationRequired: true,
      routingMetrics: {
        totalCandidatesEvaluated: 0,
        averageMatchScore: 0,
        processingTimeMs: 0,
        aiConfidenceLevel: 0
      }
    };
  }

  /**
   * Generate selection reasons for recommended professional
   */
  private generateSelectionReasons(professional: ProfessionalMatch, request: TaskRoutingRequest): string[] {
    const reasons: string[] = [];

    reasons.push(`Match score of ${professional.matchScore}% indicates strong suitability`);
    
    if (professional.availabilityScore > 80) {
      reasons.push(`Immediate availability (${professional.availabilityScore}%)`);
    }

    if (professional.expertiseScore > 85) {
      reasons.push(`Strong expertise match with required skills`);
    }

    return reasons;
  }

  /**
   * Identify potential risks
   */
  private identifyPotentialRisks(professional: ProfessionalMatch, request: TaskRoutingRequest): string[] {
    const risks: string[] = [];

    if (professional.workloadScore < 50) {
      risks.push('Professional may be overloaded');
    }

    if (professional.availabilityScore < 60) {
      risks.push('Limited availability may delay start date');
    }

    if (request.deadline.getTime() - Date.now() < (3 * 24 * 60 * 60 * 1000)) {
      risks.push('Tight deadline may affect quality');
    }

    return risks;
  }

  /**
   * Calculate AI confidence level
   */
  private calculateAIConfidence(recommended: ProfessionalMatch, allMatches: ProfessionalMatch[]): number {
    if (allMatches.length === 0) return 0;

    const scoreGap = allMatches.length > 1 ? 
      recommended.matchScore - allMatches[1].matchScore : 
      recommended.matchScore;

    return Math.min(100, recommended.matchScore + (scoreGap * 0.5));
  }

  /**
   * Create failure result
   */
  private createFailureResult(routingId: string, request: TaskRoutingRequest, error: any): RoutingResult {
    return {
      routingId,
      taskId: request.taskId || `task_${Date.now()}`,
      recommendedProfessional: null as any,
      alternativeProfessionals: [],
      routingConfidence: 0,
      autoAssigned: false,
      reasonsForSelection: [],
      potentialRisks: [`Routing failed: ${error.message}`],
      escalationRequired: true,
      routingMetrics: {
        totalCandidatesEvaluated: 0,
        averageMatchScore: 0,
        processingTimeMs: 0,
        aiConfidenceLevel: 0
      }
    };
  }

  /**
   * Event handlers
   */
  private handleTaskRouted(result: RoutingResult): void {
    console.log(`🎯 Task routed: ${result.taskId} -> ${result.recommendedProfessional?.user.role} (${result.routingConfidence}%)`);
  }

  private handleRoutingFailed(result: RoutingResult): void {
    console.error(`❌ Routing failed for task: ${result.taskId}`);
  }

  private handleProfessionalAccepted(data: any): void {
    console.log(`✅ Professional accepted task: ${data.taskId}`);
  }

  private handleProfessionalDeclined(data: any): void {
    console.log(`❌ Professional declined task: ${data.taskId}`);
    // Would trigger re-routing to next best professional
  }

  /**
   * Get routing statistics
   */
  async getRoutingStats() {
    const recentRoutings = Array.from(this.routingHistory.values())
      .filter(r => r.routingMetrics.processingTimeMs > 0);

    return {
      totalRoutings: this.routingHistory.size,
      averageMatchScore: recentRoutings.reduce((sum, r) => sum + r.routingConfidence, 0) / recentRoutings.length || 0,
      autoAssignmentRate: (recentRoutings.filter(r => r.autoAssigned).length / recentRoutings.length * 100) || 0,
      averageProcessingTime: recentRoutings.reduce((sum, r) => sum + r.routingMetrics.processingTimeMs, 0) / recentRoutings.length || 0,
      escalationRate: (recentRoutings.filter(r => r.escalationRequired).length / recentRoutings.length * 100) || 0,
      systemHealth: this.calculateRoutingSystemHealth()
    };
  }

  /**
   * Calculate routing system health
   */
  private calculateRoutingSystemHealth(): 'healthy' | 'degraded' | 'unhealthy' {
    const recentRoutings = Array.from(this.routingHistory.values()).slice(-50);
    if (recentRoutings.length === 0) return 'healthy';

    const successRate = recentRoutings.filter(r => !r.escalationRequired).length / recentRoutings.length;
    const averageConfidence = recentRoutings.reduce((sum, r) => sum + r.routingConfidence, 0) / recentRoutings.length;

    if (successRate > 0.8 && averageConfidence > 75) return 'healthy';
    if (successRate > 0.6 && averageConfidence > 60) return 'degraded';
    return 'unhealthy';
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const stats = await this.getRoutingStats();
      
      return {
        status: 'healthy',
        routingEngine: 'operational',
        stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default new IntelligentTaskRoutingService();