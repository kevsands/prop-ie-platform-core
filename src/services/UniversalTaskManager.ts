/**
 * Universal Task Manager
 * 
 * Central orchestration system that integrates with existing TaskOrchestrationEngine
 * to provide unified task management across all personas. Supports the complete
 * 3,329+ task ecosystem with progressive disclosure and intelligent routing.
 */

import { UserRole, PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
import {
  Task,
  TaskTemplate,
  TaskStatus,
  TaskPriority,
  TaskComplexityLevel,
  TaskCategory,
  TaskViewType,
  TaskOrchestrationContext,
  TaskAnalytics
} from '@/types/task/universal-task';
import { progressiveDisclosureService, FilteredTaskView } from './ProgressiveDisclosureService';
import { realTimeServerManager } from '@/lib/realtime/realTimeServerManager';

/**
 * Task operation results
 */
export interface TaskOperationResult {
  success: boolean;
  taskId?: string;
  error?: string;
  affectedTasks?: string[];
  recommendations?: string[];
}

/**
 * Bulk task operations
 */
export interface BulkTaskOperation {
  operation: 'update_status' | 'assign' | 'prioritize' | 'delete' | 'duplicate';
  taskIds: string[];
  parameters: Record<string, any>;
}

/**
 * Task creation options
 */
export interface TaskCreationOptions {
  fromTemplate?: string;
  parentTaskId?: string;
  milestoneId?: string;
  autoAssign?: boolean;
  skipValidation?: boolean;
  notifyAssignee?: boolean;
}

/**
 * Task search and filter options
 */
export interface TaskSearchOptions {
  query?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: TaskCategory[];
  assignedTo?: string;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  complexityLevel?: TaskComplexityLevel[];
  hasBlookers?: boolean;
  isOverdue?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'priority' | 'dueDate' | 'status' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Universal Task Manager Class
 */
export class UniversalTaskManager extends EventEmitter {
  private static instance: UniversalTaskManager;
  private prisma: PrismaClient;
  private taskCache: Map<string, Task> = new Map();
  private templateCache: Map<string, TaskTemplate> = new Map();
  private analytics: Map<string, TaskAnalytics> = new Map();

  constructor(prisma: PrismaClient) {
    super();
    this.prisma = prisma;
    this.initializeEventHandlers();
  }

  public static getInstance(prisma?: PrismaClient): UniversalTaskManager {
    if (!UniversalTaskManager.instance) {
      if (!prisma) {
        throw new Error('Prisma client required for UniversalTaskManager initialization');
      }
      UniversalTaskManager.instance = new UniversalTaskManager(prisma);
    }
    return UniversalTaskManager.instance;
  }

  /**
   * Initialize event handlers for real-time coordination
   */
  private initializeEventHandlers(): void {
    this.on('task_created', (task: Task) => {
      this.broadcastTaskUpdate(task, 'created');
      this.updateAnalytics(task.id, 'created');
    });

    this.on('task_updated', (task: Task) => {
      this.broadcastTaskUpdate(task, 'updated');
      this.updateAnalytics(task.id, 'updated');
    });

    this.on('task_completed', (task: Task) => {
      this.broadcastTaskUpdate(task, 'completed');
      this.handleTaskCompletion(task);
    });

    this.on('task_blocked', (task: Task) => {
      this.broadcastTaskUpdate(task, 'blocked');
      this.handleTaskBlocked(task);
    });
  }

  /**
   * Get filtered task view for a specific user context
   */
  public async getTaskView(
    context: TaskOrchestrationContext,
    viewType?: TaskViewType,
    searchOptions?: TaskSearchOptions
  ): Promise<FilteredTaskView> {
    try {
      // Get tasks relevant to the user
      const tasks = await this.getTasksForUser(context, searchOptions);
      
      // Apply progressive disclosure
      const filteredView = await progressiveDisclosureService.getFilteredTaskView(
        tasks,
        context,
        viewType
      );

      // Update user analytics
      this.updateUserAnalytics(context.userId, tasks.length);

      return filteredView;
    } catch (error) {
      console.error('Error getting task view:', error);
      throw new Error(`Failed to get task view: ${error}`);
    }
  }

  /**
   * Create a new task
   */
  public async createTask(
    taskData: Partial<Task>,
    context: TaskOrchestrationContext,
    options: TaskCreationOptions = {}
  ): Promise<TaskOperationResult> {
    try {
      // Validate task data
      if (!options.skipValidation) {
        const validation = this.validateTaskData(taskData);
        if (!validation.isValid) {
          return { success: false, error: validation.error };
        }
      }

      // Create from template if specified
      if (options.fromTemplate) {
        const template = await this.getTaskTemplate(options.fromTemplate);
        if (template) {
          taskData = this.applyTemplate(taskData, template);
        }
      }

      // Generate task ID and set defaults
      const taskId = this.generateTaskId();
      const task: Task = {
        id: taskId,
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        category: taskData.category || TaskCategory.DOCUMENTATION,
        complexityLevel: taskData.complexityLevel || TaskComplexityLevel.SIMPLE,
        viewType: taskData.viewType || TaskViewType.DETAILED,
        parentTaskId: options.parentTaskId,
        milestoneId: options.milestoneId,
        status: TaskStatus.NOT_STARTED,
        priority: taskData.priority || TaskPriority.MEDIUM,
        targetPersonas: taskData.targetPersonas || [context.userRole],
        assignedTo: options.autoAssign ? context.userId : taskData.assignedTo,
        assignedRole: taskData.assignedRole || context.userRole,
        createdAt: new Date(),
        updatedAt: new Date(),
        progressPercentage: 0,
        automationLevel: taskData.automationLevel || 'MANUAL',
        commentCount: 0,
        attachmentCount: 0,
        isRegulatory: taskData.isRegulatory || false,
        isLegalRequirement: taskData.isLegalRequirement || false,
        isTimeDependent: taskData.isTimeDependent || false,
        complianceChecked: false,
        isVisible: true,
        isExpanded: false,
        ...taskData
      };

      // Save to database
      await this.saveTaskToDatabase(task);

      // Add to cache
      this.taskCache.set(taskId, task);

      // Emit event
      this.emit('task_created', task);

      // Auto-assign if requested
      if (options.autoAssign && options.notifyAssignee) {
        await this.notifyAssignee(task);
      }

      return { success: true, taskId };
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, error: `Failed to create task: ${error}` };
    }
  }

  /**
   * Update an existing task
   */
  public async updateTask(
    taskId: string,
    updates: Partial<Task>,
    context: TaskOrchestrationContext
  ): Promise<TaskOperationResult> {
    try {
      const existingTask = await this.getTask(taskId);
      if (!existingTask) {
        return { success: false, error: 'Task not found' };
      }

      // Check permissions
      if (!this.hasUpdatePermission(existingTask, context)) {
        return { success: false, error: 'Insufficient permissions' };
      }

      // Apply updates
      const updatedTask: Task = {
        ...existingTask,
        ...updates,
        updatedAt: new Date()
      };

      // Validate updated task
      const validation = this.validateTaskData(updatedTask);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Save to database
      await this.saveTaskToDatabase(updatedTask);

      // Update cache
      this.taskCache.set(taskId, updatedTask);

      // Handle status changes
      if (updates.status && updates.status !== existingTask.status) {
        await this.handleStatusChange(updatedTask, existingTask.status);
      }

      // Emit event
      this.emit('task_updated', updatedTask);

      return { success: true, taskId };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, error: `Failed to update task: ${error}` };
    }
  }

  /**
   * Complete a task
   */
  public async completeTask(
    taskId: string,
    context: TaskOrchestrationContext,
    completionNotes?: string
  ): Promise<TaskOperationResult> {
    try {
      const result = await this.updateTask(taskId, {
        status: TaskStatus.COMPLETED,
        actualEnd: new Date(),
        progressPercentage: 100,
        userNotes: completionNotes
      }, context);

      if (result.success) {
        const task = await this.getTask(taskId);
        if (task) {
          this.emit('task_completed', task);
        }
      }

      return result;
    } catch (error) {
      console.error('Error completing task:', error);
      return { success: false, error: `Failed to complete task: ${error}` };
    }
  }

  /**
   * Bulk operations on multiple tasks
   */
  public async performBulkOperation(
    operation: BulkTaskOperation,
    context: TaskOrchestrationContext
  ): Promise<TaskOperationResult> {
    try {
      const affectedTasks: string[] = [];
      const errors: string[] = [];

      for (const taskId of operation.taskIds) {
        try {
          let result: TaskOperationResult;

          switch (operation.operation) {
            case 'update_status':
              result = await this.updateTask(taskId, { 
                status: operation.parameters.status 
              }, context);
              break;

            case 'assign':
              result = await this.updateTask(taskId, { 
                assignedTo: operation.parameters.assignedTo,
                assignedRole: operation.parameters.assignedRole
              }, context);
              break;

            case 'prioritize':
              result = await this.updateTask(taskId, { 
                priority: operation.parameters.priority 
              }, context);
              break;

            case 'delete':
              result = await this.deleteTask(taskId, context);
              break;

            case 'duplicate':
              result = await this.duplicateTask(taskId, context);
              break;

            default:
              result = { success: false, error: 'Unknown operation' };
          }

          if (result.success) {
            affectedTasks.push(taskId);
          } else {
            errors.push(`Task ${taskId}: ${result.error}`);
          }
        } catch (error) {
          errors.push(`Task ${taskId}: ${error}`);
        }
      }

      const success = affectedTasks.length > 0;
      const error = errors.length > 0 ? errors.join('; ') : undefined;

      return { success, affectedTasks, error };
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      return { success: false, error: `Bulk operation failed: ${error}` };
    }
  }

  /**
   * Search and filter tasks
   */
  public async searchTasks(
    options: TaskSearchOptions,
    context: TaskOrchestrationContext
  ): Promise<Task[]> {
    try {
      // Build query based on options
      const whereClause = this.buildSearchWhereClause(options, context);
      
      // Execute search (this would be replaced with actual Prisma query)
      const tasks = await this.executeTaskSearch(whereClause, options);

      return tasks;
    } catch (error) {
      console.error('Error searching tasks:', error);
      return [];
    }
  }

  /**
   * Get task analytics
   */
  public async getTaskAnalytics(taskId: string): Promise<TaskAnalytics | null> {
    return this.analytics.get(taskId) || null;
  }

  /**
   * Get task dependencies
   */
  public async getTaskDependencies(taskId: string): Promise<{
    dependencies: Task[];
    dependents: Task[];
  }> {
    try {
      const task = await this.getTask(taskId);
      if (!task) {
        return { dependencies: [], dependents: [] };
      }

      // Get tasks this task depends on
      const dependencies: Task[] = [];
      if (task.dependencies) {
        for (const dep of task.dependencies) {
          const depTask = await this.getTask(dep.dependentTaskId);
          if (depTask) {
            dependencies.push(depTask);
          }
        }
      }

      // Get tasks that depend on this task
      const dependents = await this.getTasksDependingOn(taskId);

      return { dependencies, dependents };
    } catch (error) {
      console.error('Error getting task dependencies:', error);
      return { dependencies: [], dependents: [] };
    }
  }

  /**
   * Private helper methods
   */
  private async getTasksForUser(
    context: TaskOrchestrationContext,
    searchOptions?: TaskSearchOptions
  ): Promise<Task[]> {
    // This would be replaced with actual database query
    // For now, return cached tasks filtered by user context
    const allTasks = Array.from(this.taskCache.values());
    
    return allTasks.filter(task => {
      // Basic persona filtering
      if (!task.targetPersonas.includes(context.userRole)) {
        return false;
      }

      // Apply search options if provided
      if (searchOptions) {
        if (searchOptions.status && !searchOptions.status.includes(task.status)) {
          return false;
        }
        if (searchOptions.priority && !searchOptions.priority.includes(task.priority)) {
          return false;
        }
        if (searchOptions.category && !searchOptions.category.includes(task.category)) {
          return false;
        }
        if (searchOptions.assignedTo && task.assignedTo !== searchOptions.assignedTo) {
          return false;
        }
      }

      return true;
    });
  }

  private async getTask(taskId: string): Promise<Task | null> {
    // Check cache first
    if (this.taskCache.has(taskId)) {
      return this.taskCache.get(taskId)!;
    }

    // Load from database
    try {
      const task = await this.loadTaskFromDatabase(taskId);
      if (task) {
        this.taskCache.set(taskId, task);
      }
      return task;
    } catch (error) {
      console.error('Error loading task:', error);
      return null;
    }
  }

  private async getTaskTemplate(templateId: string): Promise<TaskTemplate | null> {
    if (this.templateCache.has(templateId)) {
      return this.templateCache.get(templateId)!;
    }

    // Load from database
    try {
      const template = await this.loadTaskTemplateFromDatabase(templateId);
      if (template) {
        this.templateCache.set(templateId, template);
      }
      return template;
    } catch (error) {
      console.error('Error loading task template:', error);
      return null;
    }
  }

  private validateTaskData(taskData: Partial<Task>): { isValid: boolean; error?: string } {
    if (!taskData.title || taskData.title.trim().length === 0) {
      return { isValid: false, error: 'Task title is required' };
    }

    if (taskData.dueDate && taskData.dueDate < new Date()) {
      return { isValid: false, error: 'Due date cannot be in the past' };
    }

    return { isValid: true };
  }

  private hasUpdatePermission(task: Task, context: TaskOrchestrationContext): boolean {
    // Check if user can update this task
    return (
      task.assignedTo === context.userId ||
      task.targetPersonas.includes(context.userRole) ||
      context.userRole === UserRole.ADMIN
    );
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private applyTemplate(taskData: Partial<Task>, template: TaskTemplate): Partial<Task> {
    return {
      ...taskData,
      category: taskData.category || template.category,
      complexityLevel: taskData.complexityLevel || template.complexityLevel,
      priority: taskData.priority || template.defaultPriority,
      estimatedDuration: taskData.estimatedDuration || template.estimatedDuration,
      targetPersonas: taskData.targetPersonas || template.targetPersonas,
      isRegulatory: taskData.isRegulatory ?? template.isRegulatory,
      isLegalRequirement: taskData.isLegalRequirement ?? template.isLegalRequirement,
      automationLevel: taskData.automationLevel || template.automationLevel
    };
  }

  private async handleStatusChange(task: Task, previousStatus: TaskStatus): Promise<void> {
    // Handle specific status transitions
    if (task.status === TaskStatus.COMPLETED) {
      this.emit('task_completed', task);
    } else if (task.status === TaskStatus.BLOCKED) {
      this.emit('task_blocked', task);
    }

    // Update dependent tasks
    await this.updateDependentTasks(task);
  }

  private async handleTaskCompletion(task: Task): Promise<void> {
    // Trigger dependent tasks
    const dependents = await this.getTasksDependingOn(task.id);
    for (const dependent of dependents) {
      if (this.canStartTask(dependent)) {
        await this.updateTask(dependent.id, { 
          status: TaskStatus.PENDING 
        }, { userId: 'system', userRole: UserRole.ADMIN } as TaskOrchestrationContext);
      }
    }
  }

  private async handleTaskBlocked(task: Task): Promise<void> {
    // Notify relevant stakeholders
    await this.notifyBlockage(task);
  }

  private broadcastTaskUpdate(task: Task, action: string): void {
    realTimeServerManager.broadcast(`task_${action}`, {
      taskId: task.id,
      task,
      timestamp: new Date()
    });
  }

  private updateAnalytics(taskId: string, action: string): void {
    const analytics = this.analytics.get(taskId) || {
      taskId,
      viewCount: 0,
      timeSpent: 0,
      interactionCount: 0,
      completionAccuracy: 0,
      bottleneckScore: 0,
      collaborationScore: 0,
      automationSuccess: 0
    };

    analytics.interactionCount++;
    this.analytics.set(taskId, analytics);
  }

  private updateUserAnalytics(userId: string, taskCount: number): void {
    // Update user interaction analytics
  }

  // Database operations (placeholders for actual implementation)
  private async saveTaskToDatabase(task: Task): Promise<void> {
    // Implement actual Prisma save operation
  }

  private async loadTaskFromDatabase(taskId: string): Promise<Task | null> {
    // Implement actual Prisma load operation
    return null;
  }

  private async loadTaskTemplateFromDatabase(templateId: string): Promise<TaskTemplate | null> {
    // Implement actual Prisma load operation
    return null;
  }

  private async deleteTask(taskId: string, context: TaskOrchestrationContext): Promise<TaskOperationResult> {
    // Implement task deletion
    return { success: true };
  }

  private async duplicateTask(taskId: string, context: TaskOrchestrationContext): Promise<TaskOperationResult> {
    // Implement task duplication
    return { success: true };
  }

  private buildSearchWhereClause(options: TaskSearchOptions, context: TaskOrchestrationContext): any {
    // Build Prisma where clause
    return {};
  }

  private async executeTaskSearch(whereClause: any, options: TaskSearchOptions): Promise<Task[]> {
    // Execute actual database search
    return [];
  }

  private async getTasksDependingOn(taskId: string): Promise<Task[]> {
    // Get tasks that depend on this task
    return [];
  }

  private canStartTask(task: Task): boolean {
    // Check if all dependencies are completed
    return true;
  }

  private async updateDependentTasks(task: Task): Promise<void> {
    // Update tasks that depend on this one
  }

  private async notifyAssignee(task: Task): Promise<void> {
    // Send notification to assigned user
  }

  private async notifyBlockage(task: Task): Promise<void> {
    // Notify stakeholders about blocked task
  }
}

// Export singleton function
export const createUniversalTaskManager = (prisma: PrismaClient) => 
  UniversalTaskManager.getInstance(prisma);