/**
 * Progressive Disclosure Service
 * 
 * Manages intelligent task presentation across personas to make the 3,329+ task
 * ecosystem accessible without overwhelming users. Integrates with existing
 * TaskOrchestrationEngine for enterprise-grade task management.
 */

import { UserRole } from '@prisma/client';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskComplexityLevel,
  TaskCategory,
  TaskViewType,
  TaskMilestone,
  ProgressiveDisclosureConfig,
  TaskOrchestrationContext
} from '@/types/task/universal-task';

/**
 * Filtered task view for progressive disclosure
 */
export interface FilteredTaskView {
  visibleTasks: Task[];
  hiddenTaskCount: number;
  milestones: TaskMilestone[];
  groupedTasks: Map<string, Task[]>;
  complexityDistribution: Map<TaskComplexityLevel, number>;
  progressSummary: ProgressSummary;
  recommendedActions: RecommendedAction[];
}

/**
 * Progress summary for high-level tracking
 */
export interface ProgressSummary {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  overdueTasks: number;
  progressPercentage: number;
  estimatedCompletion: Date;
  nextCriticalTask?: Task;
}

/**
 * AI-powered recommended actions
 */
export interface RecommendedAction {
  type: 'focus_on_task' | 'resolve_blocker' | 'seek_help' | 'delegate' | 'reschedule';
  priority: TaskPriority;
  description: string;
  taskId?: string;
  actionData?: Record<string, any>;
  confidence: number; // AI confidence 0-100
}

/**
 * Task grouping strategies
 */
export type TaskGroupingStrategy = 'milestone' | 'category' | 'priority' | 'timeline' | 'persona' | 'dependencies';

/**
 * Progressive Disclosure Service Class
 */
export class ProgressiveDisclosureService {
  private static instance: ProgressiveDisclosureService;
  private disclosureConfigs: Map<UserRole, ProgressiveDisclosureConfig> = new Map();

  constructor() {
    this.initializeDefaultConfigs();
  }

  public static getInstance(): ProgressiveDisclosureService {
    if (!ProgressiveDisclosureService.instance) {
      ProgressiveDisclosureService.instance = new ProgressiveDisclosureService();
    }
    return ProgressiveDisclosureService.instance;
  }

  /**
   * Initialize default progressive disclosure configurations for each persona
   */
  private initializeDefaultConfigs(): void {
    // Buyer configuration - simplicity focus
    this.disclosureConfigs.set(UserRole.BUYER, {
      persona: UserRole.BUYER,
      defaultViewType: TaskViewType.MILESTONE,
      maxVisibleTasks: 8,
      groupingStrategy: 'milestone',
      showComplexityIndicators: false,
      autoHideCompleted: true,
      expandOnHover: true,
      showDependencies: false,
      showAiInsights: true
    });

    // Developer configuration - comprehensive control
    this.disclosureConfigs.set(UserRole.DEVELOPER, {
      persona: UserRole.DEVELOPER,
      defaultViewType: TaskViewType.PROFESSIONAL,
      maxVisibleTasks: 25,
      groupingStrategy: 'category',
      showComplexityIndicators: true,
      autoHideCompleted: false,
      expandOnHover: false,
      showDependencies: true,
      showAiInsights: true
    });

    // Estate Agent configuration - client-focused
    this.disclosureConfigs.set(UserRole.AGENT, {
      persona: UserRole.AGENT,
      defaultViewType: TaskViewType.DETAILED,
      maxVisibleTasks: 15,
      groupingStrategy: 'priority',
      showComplexityIndicators: true,
      autoHideCompleted: true,
      expandOnHover: true,
      showDependencies: false,
      showAiInsights: true
    });

    // Solicitor configuration - legal focus
    this.disclosureConfigs.set(UserRole.SOLICITOR, {
      persona: UserRole.SOLICITOR,
      defaultViewType: TaskViewType.PROFESSIONAL,
      maxVisibleTasks: 20,
      groupingStrategy: 'timeline',
      showComplexityIndicators: true,
      autoHideCompleted: false,
      expandOnHover: false,
      showDependencies: true,
      showAiInsights: true
    });

    // Admin configuration - full visibility
    this.disclosureConfigs.set(UserRole.ADMIN, {
      persona: UserRole.ADMIN,
      defaultViewType: TaskViewType.PROFESSIONAL,
      maxVisibleTasks: 50,
      groupingStrategy: 'category',
      showComplexityIndicators: true,
      autoHideCompleted: false,
      expandOnHover: false,
      showDependencies: true,
      showAiInsights: true
    });
  }

  /**
   * Get filtered task view based on persona and context
   */
  public async getFilteredTaskView(
    tasks: Task[],
    context: TaskOrchestrationContext,
    viewType?: TaskViewType
  ): Promise<FilteredTaskView> {
    const config = this.getDisclosureConfig(context.userRole);
    const effectiveViewType = viewType || config.defaultViewType;

    // Apply persona-specific filtering
    const filteredTasks = this.applyPersonaFiltering(tasks, context);
    
    // Apply complexity-based filtering
    const complexityFiltered = this.applyComplexityFiltering(filteredTasks, context);
    
    // Apply view-type specific logic
    const viewFiltered = this.applyViewTypeFiltering(complexityFiltered, effectiveViewType, config);
    
    // Group tasks according to strategy
    const groupedTasks = this.groupTasks(viewFiltered.visibleTasks, config.groupingStrategy);
    
    // Generate milestones for milestone view
    const milestones = await this.generateMilestones(viewFiltered.visibleTasks, context);
    
    // Calculate progress summary
    const progressSummary = this.calculateProgressSummary(tasks, viewFiltered.visibleTasks);
    
    // Generate AI recommendations
    const recommendedActions = await this.generateRecommendations(tasks, context);
    
    // Calculate complexity distribution
    const complexityDistribution = this.calculateComplexityDistribution(viewFiltered.visibleTasks);

    return {
      visibleTasks: viewFiltered.visibleTasks,
      hiddenTaskCount: viewFiltered.hiddenTaskCount,
      milestones,
      groupedTasks,
      complexityDistribution,
      progressSummary,
      recommendedActions
    };
  }

  /**
   * Apply persona-specific task filtering
   */
  private applyPersonaFiltering(tasks: Task[], context: TaskOrchestrationContext): Task[] {
    return tasks.filter(task => {
      // Check if task is relevant to user's persona
      if (!task.targetPersonas.includes(context.userRole)) {
        return false;
      }

      // Filter based on user's skill level
      if (context.skillLevel === 'beginner' && task.complexityLevel === TaskComplexityLevel.EXPERT) {
        return false;
      }

      // Filter based on current focus
      if (context.currentFocus && task.category !== context.currentFocus) {
        // Still show critical and high priority tasks from other categories
        return task.priority === TaskPriority.CRITICAL || task.priority === TaskPriority.HIGH;
      }

      return true;
    });
  }

  /**
   * Apply complexity-based filtering based on user preferences
   */
  private applyComplexityFiltering(tasks: Task[], context: TaskOrchestrationContext): Task[] {
    const maxComplexity = this.getMaxComplexityForUser(context);
    
    return tasks.filter(task => {
      // Always show critical tasks regardless of complexity
      if (task.priority === TaskPriority.CRITICAL) {
        return true;
      }

      // Filter by preferred complexity level
      const complexityOrder = [
        TaskComplexityLevel.SIMPLE,
        TaskComplexityLevel.MODERATE,
        TaskComplexityLevel.COMPLEX,
        TaskComplexityLevel.EXPERT
      ];

      const taskComplexityIndex = complexityOrder.indexOf(task.complexityLevel);
      const maxComplexityIndex = complexityOrder.indexOf(maxComplexity);

      return taskComplexityIndex <= maxComplexityIndex;
    });
  }

  /**
   * Apply view-type specific filtering and presentation logic
   */
  private applyViewTypeFiltering(
    tasks: Task[],
    viewType: TaskViewType,
    config: ProgressiveDisclosureConfig
  ): { visibleTasks: Task[]; hiddenTaskCount: number } {
    let visibleTasks: Task[] = [];
    let hiddenTaskCount = 0;

    switch (viewType) {
      case TaskViewType.MILESTONE:
        // Show only milestone-level tasks, hide granular sub-tasks
        visibleTasks = tasks.filter(task => !task.parentTaskId);
        hiddenTaskCount = tasks.length - visibleTasks.length;
        break;

      case TaskViewType.DETAILED:
        // Show tasks but limit based on configuration
        const prioritizedTasks = this.prioritizeTasksForDisplay(tasks);
        visibleTasks = prioritizedTasks.slice(0, config.maxVisibleTasks);
        hiddenTaskCount = tasks.length - visibleTasks.length;
        break;

      case TaskViewType.PROFESSIONAL:
        // Show all relevant tasks for professional users
        visibleTasks = tasks;
        hiddenTaskCount = 0;
        break;

      case TaskViewType.COLLABORATIVE:
        // Show tasks that involve multiple personas
        visibleTasks = tasks.filter(task => 
          task.collaborators && task.collaborators.length > 1 ||
          task.requiresApprovalFrom && task.requiresApprovalFrom.length > 0
        );
        hiddenTaskCount = tasks.length - visibleTasks.length;
        break;

      default:
        visibleTasks = tasks;
        hiddenTaskCount = 0;
    }

    // Apply auto-hide completed tasks if configured
    if (config.autoHideCompleted) {
      const nonCompletedTasks = visibleTasks.filter(task => 
        task.status !== TaskStatus.COMPLETED
      );
      hiddenTaskCount += visibleTasks.length - nonCompletedTasks.length;
      visibleTasks = nonCompletedTasks;
    }

    return { visibleTasks, hiddenTaskCount };
  }

  /**
   * Group tasks according to the specified strategy
   */
  private groupTasks(tasks: Task[], strategy: TaskGroupingStrategy): Map<string, Task[]> {
    const groups = new Map<string, Task[]>();

    tasks.forEach(task => {
      let groupKey: string;

      switch (strategy) {
        case 'milestone':
          groupKey = task.milestoneId || 'No Milestone';
          break;
        case 'category':
          groupKey = task.category;
          break;
        case 'priority':
          groupKey = task.priority;
          break;
        case 'timeline':
          groupKey = this.getTimelineGroup(task);
          break;
        case 'persona':
          groupKey = task.targetPersonas[0]; // Primary persona
          break;
        case 'dependencies':
          groupKey = task.dependencies && task.dependencies.length > 0 ? 'Has Dependencies' : 'Independent';
          break;
        default:
          groupKey = 'All Tasks';
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(task);
    });

    return groups;
  }

  /**
   * Generate milestone view for high-level progress tracking
   */
  private async generateMilestones(tasks: Task[], context: TaskOrchestrationContext): Promise<TaskMilestone[]> {
    const milestoneMap = new Map<string, TaskMilestone>();

    // Group tasks by milestone
    tasks.forEach(task => {
      if (task.milestoneId) {
        if (!milestoneMap.has(task.milestoneId)) {
          milestoneMap.set(task.milestoneId, {
            id: task.milestoneId,
            title: this.getMilestoneTitle(task.milestoneId, context.userRole),
            description: this.getMilestoneDescription(task.milestoneId, context.userRole),
            targetPersonas: [context.userRole],
            associatedTasks: [],
            completionCriteria: [],
            progressPercentage: 0,
            isVisible: true,
            order: this.getMilestoneOrder(task.milestoneId)
          });
        }
        milestoneMap.get(task.milestoneId)!.associatedTasks.push(task.id);
      }
    });

    // Calculate progress for each milestone
    milestoneMap.forEach(milestone => {
      const milestoneTasks = tasks.filter(task => task.milestoneId === milestone.id);
      const completedTasks = milestoneTasks.filter(task => task.status === TaskStatus.COMPLETED);
      milestone.progressPercentage = milestoneTasks.length > 0 
        ? (completedTasks.length / milestoneTasks.length) * 100 
        : 0;
    });

    return Array.from(milestoneMap.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Calculate comprehensive progress summary
   */
  private calculateProgressSummary(allTasks: Task[], visibleTasks: Task[]): ProgressSummary {
    const now = new Date();
    
    const completedTasks = allTasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const inProgressTasks = allTasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
    const blockedTasks = allTasks.filter(task => task.status === TaskStatus.BLOCKED).length;
    const overdueTasks = allTasks.filter(task => 
      task.dueDate && task.dueDate < now && task.status !== TaskStatus.COMPLETED
    ).length;

    const progressPercentage = allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0;

    // Find next critical task
    const nextCriticalTask = visibleTasks
      .filter(task => 
        task.priority === TaskPriority.CRITICAL && 
        task.status !== TaskStatus.COMPLETED
      )
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        return 0;
      })[0];

    // Estimate completion date based on current progress
    const remainingTasks = allTasks.length - completedTasks;
    const avgTaskDuration = 8; // hours
    const estimatedCompletion = new Date(now.getTime() + (remainingTasks * avgTaskDuration * 60 * 60 * 1000));

    return {
      totalTasks: allTasks.length,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      overdueTasks,
      progressPercentage,
      estimatedCompletion,
      nextCriticalTask
    };
  }

  /**
   * Generate AI-powered recommendations
   */
  private async generateRecommendations(tasks: Task[], context: TaskOrchestrationContext): Promise<RecommendedAction[]> {
    const recommendations: RecommendedAction[] = [];

    // Check for blocked tasks
    const blockedTasks = tasks.filter(task => task.status === TaskStatus.BLOCKED);
    if (blockedTasks.length > 0) {
      recommendations.push({
        type: 'resolve_blocker',
        priority: TaskPriority.HIGH,
        description: `${blockedTasks.length} task(s) are blocked and need attention`,
        confidence: 95
      });
    }

    // Check for overdue tasks
    const overdueTasks = tasks.filter(task => 
      task.dueDate && task.dueDate < new Date() && task.status !== TaskStatus.COMPLETED
    );
    if (overdueTasks.length > 0) {
      recommendations.push({
        type: 'focus_on_task',
        priority: TaskPriority.CRITICAL,
        description: `${overdueTasks.length} task(s) are overdue`,
        taskId: overdueTasks[0].id,
        confidence: 90
      });
    }

    // Check workload capacity
    if (context.workloadCapacity > 80) {
      const delegatableTasks = tasks.filter(task => 
        task.complexityLevel !== TaskComplexityLevel.EXPERT &&
        task.status === TaskStatus.PENDING
      );
      if (delegatableTasks.length > 0) {
        recommendations.push({
          type: 'delegate',
          priority: TaskPriority.MEDIUM,
          description: 'Consider delegating some tasks to manage workload',
          confidence: 75
        });
      }
    }

    return recommendations;
  }

  /**
   * Helper methods
   */
  private getDisclosureConfig(persona: UserRole): ProgressiveDisclosureConfig {
    return this.disclosureConfigs.get(persona) || this.disclosureConfigs.get(UserRole.BUYER)!;
  }

  private getMaxComplexityForUser(context: TaskOrchestrationContext): TaskComplexityLevel {
    if (context.skillLevel === 'expert') return TaskComplexityLevel.EXPERT;
    if (context.skillLevel === 'intermediate') return TaskComplexityLevel.COMPLEX;
    return TaskComplexityLevel.MODERATE;
  }

  private prioritizeTasksForDisplay(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => {
      // Priority order: CRITICAL > HIGH > MEDIUM > LOW
      const priorityOrder = {
        [TaskPriority.CRITICAL]: 4,
        [TaskPriority.HIGH]: 3,
        [TaskPriority.MEDIUM]: 2,
        [TaskPriority.LOW]: 1,
        [TaskPriority.DEFERRED]: 0
      };

      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Secondary sort by due date
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }

      return 0;
    });
  }

  private getTimelineGroup(task: Task): string {
    const now = new Date();
    if (task.dueDate) {
      const daysUntilDue = Math.ceil((task.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue < 0) return 'Overdue';
      if (daysUntilDue <= 1) return 'Due Today';
      if (daysUntilDue <= 7) return 'Due This Week';
      if (daysUntilDue <= 30) return 'Due This Month';
      return 'Future';
    }
    return 'No Due Date';
  }

  private getMilestoneTitle(milestoneId: string, persona: UserRole): string {
    // This would typically come from a database or configuration
    const milestoneTitles: Record<string, Record<UserRole, string>> = {
      'planning': {
        [UserRole.BUYER]: 'Planning Your Purchase',
        [UserRole.DEVELOPER]: 'Project Planning',
        [UserRole.AGENT]: 'Client Onboarding',
        [UserRole.SOLICITOR]: 'Initial Legal Review'
      },
      'financing': {
        [UserRole.BUYER]: 'Securing Financing',
        [UserRole.DEVELOPER]: 'Development Financing',
        [UserRole.AGENT]: 'Financial Qualification',
        [UserRole.SOLICITOR]: 'Financial Due Diligence'
      }
      // Add more milestone mappings...
    };

    return milestoneTitles[milestoneId]?.[persona] || milestoneId;
  }

  private getMilestoneDescription(milestoneId: string, persona: UserRole): string {
    // Return appropriate description based on milestone and persona
    return `Complete all tasks in the ${milestoneId} phase`;
  }

  private getMilestoneOrder(milestoneId: string): number {
    const orderMap: Record<string, number> = {
      'planning': 1,
      'financing': 2,
      'searching': 3,
      'legal': 4,
      'completion': 5
    };
    return orderMap[milestoneId] || 99;
  }

  private calculateComplexityDistribution(tasks: Task[]): Map<TaskComplexityLevel, number> {
    const distribution = new Map<TaskComplexityLevel, number>();
    
    // Initialize all complexity levels
    Object.values(TaskComplexityLevel).forEach(level => {
      distribution.set(level, 0);
    });

    // Count tasks by complexity
    tasks.forEach(task => {
      const current = distribution.get(task.complexityLevel) || 0;
      distribution.set(task.complexityLevel, current + 1);
    });

    return distribution;
  }

  /**
   * Update user preferences for progressive disclosure
   */
  public updateUserPreferences(
    persona: UserRole, 
    preferences: Partial<ProgressiveDisclosureConfig>
  ): void {
    const currentConfig = this.getDisclosureConfig(persona);
    const updatedConfig = { ...currentConfig, ...preferences };
    this.disclosureConfigs.set(persona, updatedConfig);
  }

  /**
   * Get available view types for a persona
   */
  public getAvailableViewTypes(persona: UserRole): TaskViewType[] {
    switch (persona) {
      case UserRole.BUYER:
        return [TaskViewType.MILESTONE, TaskViewType.DETAILED];
      case UserRole.DEVELOPER:
        return [TaskViewType.PROFESSIONAL, TaskViewType.GANTT, TaskViewType.DETAILED, TaskViewType.COLLABORATIVE];
      case UserRole.AGENT:
        return [TaskViewType.DETAILED, TaskViewType.COLLABORATIVE, TaskViewType.MILESTONE];
      case UserRole.SOLICITOR:
        return [TaskViewType.PROFESSIONAL, TaskViewType.GANTT, TaskViewType.DETAILED, TaskViewType.COLLABORATIVE];
      case UserRole.ADMIN:
        return Object.values(TaskViewType);
      default:
        return [TaskViewType.DETAILED, TaskViewType.MILESTONE];
    }
  }
}

// Export singleton instance
export const progressiveDisclosureService = ProgressiveDisclosureService.getInstance();