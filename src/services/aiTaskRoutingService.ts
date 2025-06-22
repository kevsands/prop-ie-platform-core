/**
 * AI Task Routing Service
 * 
 * Connects the enhanced TaskOrchestrationEngine with real professional users
 * for intelligent task assignment and workflow management
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ProfessionalMatch {
  userId: string;
  name: string;
  role: string;
  matchScore: number;
  availability: 'available' | 'busy' | 'unavailable';
  currentWorkload: number;
  experienceYears: number;
  specializations: string[];
  hourlyRate: number;
  averageRating: number;
  completionRate: number;
  responseTime: string;
}

export interface TaskRoutingRequest {
  taskId: string;
  taskTemplateId: string;
  requiredRole: string;
  requiredCertifications?: string[];
  complexity: 'simple' | 'medium' | 'complex' | 'expert';
  urgency: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  estimatedHours: number;
  projectContext: {
    type: 'property_transaction' | 'development_project';
    value: number;
    location: string;
  };
  clientRequirements?: string[];
}

export interface RoutingResult {
  success: boolean;
  assignedProfessional?: ProfessionalMatch;
  alternativeProfessionals: ProfessionalMatch[];
  routingConfidence: number;
  routingRationale: string;
  estimatedStartDate: Date;
  estimatedCompletionDate: Date;
  warnings: string[];
  recommendations: string[];
}

/**
 * AI-Powered Professional Matching Algorithm
 */
export class AITaskRoutingService {
  
  /**
   * Find optimal professional for task assignment
   */
  async routeTask(request: TaskRoutingRequest): Promise<RoutingResult> {
    try {
      // 1. Get available professionals for the required role
      const availableProfessionals = await this.getAvailableProfessionals(request.requiredRole);
      
      if (availableProfessionals.length === 0) {
        return {
          success: false,
          alternativeProfessionals: [],
          routingConfidence: 0,
          routingRationale: `No available professionals found for role: ${request.requiredRole}`,
          estimatedStartDate: new Date(),
          estimatedCompletionDate: new Date(),
          warnings: [`No professionals available for ${request.requiredRole}`],
          recommendations: ['Consider expanding search to related roles', 'Check professional availability schedules']
        };
      }

      // 2. Score and rank professionals
      const scoredProfessionals = await this.scoreProfessionals(availableProfessionals, request);
      
      // 3. Select best match
      const bestMatch = scoredProfessionals[0];
      const alternatives = scoredProfessionals.slice(1, 4); // Top 3 alternatives

      // 4. Calculate routing confidence
      const confidence = this.calculateRoutingConfidence(bestMatch, request);

      // 5. Estimate timeline
      const { startDate, completionDate } = this.estimateTimeline(bestMatch, request);

      // 6. Generate warnings and recommendations
      const warnings = this.generateWarnings(bestMatch, request);
      const recommendations = this.generateRecommendations(bestMatch, request, scoredProfessionals);

      return {
        success: true,
        assignedProfessional: bestMatch,
        alternativeProfessionals: alternatives,
        routingConfidence: confidence,
        routingRationale: this.generateRoutingRationale(bestMatch, request),
        estimatedStartDate: startDate,
        estimatedCompletionDate: completionDate,
        warnings,
        recommendations
      };

    } catch (error) {
      console.error('AI Task Routing Error:', error);
      return {
        success: false,
        alternativeProfessionals: [],
        routingConfidence: 0,
        routingRationale: `Routing failed: ${error.message}`,
        estimatedStartDate: new Date(),
        estimatedCompletionDate: new Date(),
        warnings: ['Task routing system error'],
        recommendations: ['Retry routing', 'Check system status', 'Manual assignment may be required']
      };
    }
  }

  /**
   * Assign task to professional and update database
   */
  async assignTask(taskId: string, routingResult: RoutingResult): Promise<boolean> {
    if (!routingResult.success || !routingResult.assignedProfessional) {
      return false;
    }

    try {
      await prisma.ecosystem_tasks.update({
        where: { id: taskId },
        data: {
          assigned_to: routingResult.assignedProfessional.userId,
          assigned_by: 'ai_routing_system',
          status: 'assigned',
          scheduled_start: routingResult.estimatedStartDate,
          due_date: routingResult.estimatedCompletionDate,
          metadata: JSON.stringify({
            ai_routing: {
              confidence: routingResult.routingConfidence,
              rationale: routingResult.routingRationale,
              alternatives: routingResult.alternativeProfessionals.map(p => ({
                userId: p.userId,
                name: p.name,
                score: p.matchScore
              })),
              routedAt: new Date().toISOString()
            }
          }),
          updated_at: new Date()
        }
      });

      // Log the assignment
      console.log(`✅ Task ${taskId} assigned to ${routingResult.assignedProfessional.name} (${routingResult.assignedProfessional.role}) with ${(routingResult.routingConfidence * 100).toFixed(1)}% confidence`);
      
      return true;
    } catch (error) {
      console.error('Task assignment error:', error);
      return false;
    }
  }

  /**
   * Get available professionals for a specific role
   */
  private async getAvailableProfessionals(role: string): Promise<ProfessionalMatch[]> {
    const professionals = await prisma.users.findMany({
      where: {
        professional_role_primary: role,
        active: true,
        availability_status: 'available'
      }
    });

    return Promise.all(professionals.map(async (prof) => {
      const currentTasks = await this.getCurrentWorkload(prof.id);
      const performanceMetrics = await this.getPerformanceMetrics(prof.id);

      return {
        userId: prof.id,
        name: prof.name,
        role: prof.professional_role_primary!,
        matchScore: 0, // Will be calculated in scoreProfessionals
        availability: prof.availability_status as 'available' | 'busy' | 'unavailable',
        currentWorkload: currentTasks.length,
        experienceYears: prof.experience_years || 5,
        specializations: prof.professional_specializations ? 
          JSON.parse(prof.professional_specializations) : [],
        hourlyRate: prof.hourly_rate || 100,
        averageRating: performanceMetrics.averageRating,
        completionRate: performanceMetrics.completionRate,
        responseTime: performanceMetrics.responseTime
      };
    }));
  }

  /**
   * Score professionals based on task requirements
   */
  private async scoreProfessionals(
    professionals: ProfessionalMatch[], 
    request: TaskRoutingRequest
  ): Promise<ProfessionalMatch[]> {
    const scoredProfessionals = professionals.map(prof => {
      let score = 0;

      // 1. Experience weight (30%)
      const experienceScore = Math.min(prof.experienceYears / 20, 1) * 0.3;
      score += experienceScore;

      // 2. Workload weight (25%) - prefer less busy professionals
      const workloadScore = Math.max(0, (10 - prof.currentWorkload) / 10) * 0.25;
      score += workloadScore;

      // 3. Performance rating weight (20%)
      const ratingScore = (prof.averageRating / 5) * 0.2;
      score += ratingScore;

      // 4. Completion rate weight (15%)
      const completionScore = prof.completionRate * 0.15;
      score += completionScore;

      // 5. Specialization match weight (10%)
      let specializationScore = 0;
      if (request.clientRequirements) {
        const matchingSpecs = prof.specializations.filter(spec => 
          request.clientRequirements!.some(req => 
            req.toLowerCase().includes(spec.toLowerCase())
          )
        );
        specializationScore = (matchingSpecs.length / Math.max(request.clientRequirements.length, 1)) * 0.1;
      } else {
        specializationScore = 0.05; // Base score if no specific requirements
      }
      score += specializationScore;

      return {
        ...prof,
        matchScore: Math.round(score * 100) / 100
      };
    });

    // Sort by score descending
    return scoredProfessionals.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate routing confidence based on match quality
   */
  private calculateRoutingConfidence(professional: ProfessionalMatch, request: TaskRoutingRequest): number {
    let confidence = professional.matchScore;

    // Adjust based on task complexity vs professional experience
    const complexityMultiplier = {
      'simple': 1.1,
      'medium': 1.0,
      'complex': 0.9,
      'expert': 0.8
    };
    confidence *= complexityMultiplier[request.complexity];

    // Adjust based on urgency vs availability
    if (request.urgency === 'critical' && professional.currentWorkload > 5) {
      confidence *= 0.8;
    }

    // Adjust based on performance history
    confidence *= (professional.completionRate + 1) / 2;

    return Math.min(Math.max(confidence, 0.1), 1.0);
  }

  /**
   * Estimate task timeline based on professional availability
   */
  private estimateTimeline(professional: ProfessionalMatch, request: TaskRoutingRequest): {
    startDate: Date;
    completionDate: Date;
  } {
    const now = new Date();
    let startDate = new Date(now);

    // Delay start based on current workload
    const workloadDelayDays = Math.min(professional.currentWorkload * 0.5, 7);
    startDate.setDate(startDate.getDate() + workloadDelayDays);

    // Add urgency adjustment
    const urgencyAdjustment = {
      'critical': -2,
      'urgent': -1,
      'high': 0,
      'medium': 1,
      'low': 2
    };
    startDate.setDate(startDate.getDate() + urgencyAdjustment[request.urgency]);

    // Calculate completion date
    const completionDate = new Date(startDate);
    const estimatedDays = Math.ceil(request.estimatedHours / 8); // 8 hours per day
    completionDate.setDate(completionDate.getDate() + estimatedDays);

    return { startDate, completionDate };
  }

  /**
   * Generate routing rationale
   */
  private generateRoutingRationale(professional: ProfessionalMatch, request: TaskRoutingRequest): string {
    const reasons = [
      `${professional.name} selected as optimal match for ${request.requiredRole}`,
      `Match score: ${(professional.matchScore * 100).toFixed(1)}%`,
      `Experience: ${professional.experienceYears} years`,
      `Current workload: ${professional.currentWorkload} active tasks`,
      `Performance rating: ${professional.averageRating.toFixed(1)}/5.0`,
      `Completion rate: ${(professional.completionRate * 100).toFixed(1)}%`
    ];

    if (professional.specializations.length > 0) {
      reasons.push(`Specializations: ${professional.specializations.join(', ')}`);
    }

    return reasons.join('; ');
  }

  /**
   * Generate warnings for the routing decision
   */
  private generateWarnings(professional: ProfessionalMatch, request: TaskRoutingRequest): string[] {
    const warnings: string[] = [];

    if (professional.currentWorkload > 8) {
      warnings.push(`Professional has high workload (${professional.currentWorkload} tasks)`);
    }

    if (professional.averageRating < 4.0) {
      warnings.push(`Professional has below-average rating (${professional.averageRating}/5.0)`);
    }

    if (request.urgency === 'critical' && professional.currentWorkload > 3) {
      warnings.push('Critical task assigned to busy professional - monitor closely');
    }

    if (professional.experienceYears < 3 && request.complexity === 'expert') {
      warnings.push('Junior professional assigned to expert-level task');
    }

    return warnings;
  }

  /**
   * Generate recommendations for optimal task execution
   */
  private generateRecommendations(
    professional: ProfessionalMatch, 
    request: TaskRoutingRequest,
    allProfessionals: ProfessionalMatch[]
  ): string[] {
    const recommendations: string[] = [];

    if (professional.currentWorkload > 5) {
      recommendations.push('Consider task prioritization with professional');
    }

    if (request.complexity === 'expert' && allProfessionals.length > 1) {
      const seniorAlternative = allProfessionals.find(p => p.experienceYears > professional.experienceYears + 5);
      if (seniorAlternative) {
        recommendations.push(`Consider senior alternative: ${seniorAlternative.name} (${seniorAlternative.experienceYears} years experience)`);
      }
    }

    if (professional.specializations.length > 0) {
      recommendations.push(`Leverage professional's specializations: ${professional.specializations.join(', ')}`);
    }

    recommendations.push(`Monitor progress closely given ${professional.responseTime} average response time`);

    return recommendations;
  }

  /**
   * Get current workload for a professional
   */
  private async getCurrentWorkload(userId: string) {
    return prisma.ecosystem_tasks.findMany({
      where: {
        assigned_to: userId,
        status: {
          in: ['assigned', 'in_progress', 'waiting_approval']
        }
      }
    });
  }

  /**
   * Get performance metrics for a professional
   */
  private async getPerformanceMetrics(userId: string): Promise<{
    averageRating: number;
    completionRate: number;
    responseTime: string;
  }> {
    const completedTasks = await prisma.ecosystem_tasks.findMany({
      where: {
        assigned_to: userId,
        status: 'completed'
      }
    });

    const totalTasks = await prisma.ecosystem_tasks.count({
      where: {
        assigned_to: userId,
        status: {
          in: ['completed', 'cancelled', 'failed']
        }
      }
    });

    // Calculate metrics with defaults for new professionals
    const completionRate = totalTasks > 0 ? completedTasks.length / totalTasks : 0.85;
    
    const averageRating = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => sum + (task.quality_score || 4), 0) / completedTasks.length
      : 4.2;

    return {
      averageRating,
      completionRate,
      responseTime: '2-4 hours' // Default response time
    };
  }

  /**
   * Bulk route multiple tasks
   */
  async routeMultipleTasks(requests: TaskRoutingRequest[]): Promise<Map<string, RoutingResult>> {
    const results = new Map<string, RoutingResult>();
    
    console.log(`🤖 Starting bulk routing for ${requests.length} tasks...`);

    for (const request of requests) {
      try {
        const result = await this.routeTask(request);
        results.set(request.taskId, result);
        
        if (result.success) {
          // Assign the task
          await this.assignTask(request.taskId, result);
        }
        
        // Small delay to prevent database overload
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        console.error(`Failed to route task ${request.taskId}:`, error);
        results.set(request.taskId, {
          success: false,
          alternativeProfessionals: [],
          routingConfidence: 0,
          routingRationale: `Routing failed: ${error.message}`,
          estimatedStartDate: new Date(),
          estimatedCompletionDate: new Date(),
          warnings: [`Routing error: ${error.message}`],
          recommendations: ['Manual assignment required']
        });
      }
    }

    const successCount = Array.from(results.values()).filter(r => r.success).length;
    console.log(`✅ Bulk routing complete: ${successCount}/${requests.length} tasks successfully routed`);

    return results;
  }
}

export default AITaskRoutingService;