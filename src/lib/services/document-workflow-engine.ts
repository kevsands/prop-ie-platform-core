/**
 * Document Workflow Engine - Enterprise State Management System
 * 
 * Document Version: v1.0
 * Created: July 2, 2025
 * Last Updated: July 2, 2025
 * Status: ✅ ACTIVE & CURRENT
 * Author: Claude AI Assistant
 * Platform Version: PROP.ie Enterprise v2025.07
 */

import { prisma } from '@/lib/prisma';
import { EventEmitter } from 'events';
import { WorkflowStatus, DocumentCategory, TemplateStatus } from '@prisma/client';

// ================================================================================
// WORKFLOW ENGINE TYPES
// ================================================================================

export interface WorkflowStage {
  id: string;
  name: string;
  type: 'approval' | 'task' | 'condition' | 'notification' | 'automation';
  sequence: number;
  requiredRoles: string[];
  conditions?: WorkflowCondition[];
  actions: WorkflowAction[];
  timeoutHours?: number;
  autoApprove?: boolean;
  notifications: NotificationConfig[];
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface WorkflowAction {
  type: 'update_document' | 'send_notification' | 'call_api' | 'generate_document' | 'assign_task';
  config: any;
  onSuccess?: WorkflowAction[];
  onError?: WorkflowAction[];
}

export interface NotificationConfig {
  type: 'email' | 'in_app' | 'sms' | 'webhook';
  template: string;
  recipients: string[];
  triggerOn: 'stage_start' | 'stage_complete' | 'stage_timeout' | 'stage_error';
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  stages: WorkflowStage[];
  globalVariables: { [key: string]: any };
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowInstance {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  status: WorkflowStatus;
  currentStage: string;
  progress: number;
  variables: { [key: string]: any };
  projectId?: string;
  documentId?: string;
  createdBy: string;
  assignedTo?: string;
  startedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  metadata: any;
}

export interface WorkflowEvent {
  type: 'stage_started' | 'stage_completed' | 'workflow_completed' | 'approval_required' | 'error_occurred';
  workflowId: string;
  stageId?: string;
  data: any;
  timestamp: Date;
  userId?: string;
}

// ================================================================================
// WORKFLOW ENGINE CLASS
// ================================================================================

export class DocumentWorkflowEngine extends EventEmitter {
  private runningWorkflows: Map<string, WorkflowInstance> = new Map();
  private stageTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    super();
    this.setupEventHandlers();
  }

  /**
   * Create workflow template
   */
  async createWorkflowTemplate(templateData: {
    name: string;
    description: string;
    category: string;
    stages: WorkflowStage[];
    globalVariables?: { [key: string]: any };
    createdBy: string;
  }): Promise<WorkflowTemplate> {
    const template = await prisma.workflowTemplate.create({
      data: {
        ...templateData,
        version: '1.0',
        isActive: true,
        stages: JSON.stringify(templateData.stages),
        globalVariables: JSON.stringify(templateData.globalVariables || {})
      }
    });

    return this.parseWorkflowTemplate(template);
  }

  /**
   * Start workflow instance
   */
  async startWorkflow(
    templateId: string,
    workflowData: {
      title: string;
      description?: string;
      projectId?: string;
      documentId?: string;
      assignedTo?: string;
      dueDate?: Date;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      variables?: { [key: string]: any };
      tags?: string[];
    },
    initiatedBy: string
  ): Promise<WorkflowInstance> {
    // Get workflow template
    const template = await this.getWorkflowTemplate(templateId);
    if (!template) {
      throw new Error('Workflow template not found');
    }

    // Create workflow instance
    const workflowInstance = await prisma.enterpriseWorkflowInstance.create({
      data: {
        workflowTemplateId: templateId,
        title: workflowData.title,
        description: workflowData.description,
        status: 'pending',
        currentStage: template.stages[0]?.id || '',
        progress: 0,
        projectId: workflowData.projectId,
        documentId: workflowData.documentId,
        assignedTo: workflowData.assignedTo,
        createdBy: initiatedBy,
        dueDate: workflowData.dueDate,
        priority: workflowData.priority || 'medium',
        variables: JSON.stringify({
          ...template.globalVariables,
          ...workflowData.variables
        }),
        tags: workflowData.tags || [],
        metadata: JSON.stringify({
          templateVersion: template.version,
          startedAt: new Date()
        })
      }
    });

    const instance = this.parseWorkflowInstance(workflowInstance, template);
    
    // Add to running workflows
    this.runningWorkflows.set(instance.id, instance);

    // Start first stage
    await this.startStage(instance, template.stages[0]);

    // Emit workflow started event
    this.emit('workflow_started', {
      type: 'workflow_started',
      workflowId: instance.id,
      data: instance,
      timestamp: new Date(),
      userId: initiatedBy
    });

    return instance;
  }

  /**
   * Advance workflow to next stage
   */
  async advanceWorkflow(
    workflowId: string,
    stageId: string,
    userId: string,
    approvalData?: any
  ): Promise<WorkflowInstance> {
    const instance = await this.getWorkflowInstance(workflowId);
    const template = await this.getWorkflowTemplate(instance.templateId);
    
    if (!instance || !template) {
      throw new Error('Workflow or template not found');
    }

    const currentStage = template.stages.find(s => s.id === stageId);
    if (!currentStage) {
      throw new Error('Current stage not found');
    }

    // Validate user permissions
    if (!this.hasStagePermission(userId, currentStage)) {
      throw new Error('Insufficient permissions to advance this stage');
    }

    // Record stage completion
    await this.completeStage(instance, currentStage, userId, approvalData);

    // Find next stage
    const nextStage = this.findNextStage(template.stages, currentStage, instance);

    if (nextStage) {
      // Update workflow to next stage
      instance.currentStage = nextStage.id;
      instance.progress = this.calculateProgress(template.stages, nextStage);
      
      await this.updateWorkflowInstance(instance);
      await this.startStage(instance, nextStage);
    } else {
      // Complete workflow
      await this.completeWorkflow(instance, userId);
    }

    return instance;
  }

  /**
   * Handle workflow approval
   */
  async approveStage(
    workflowId: string,
    stageId: string,
    userId: string,
    approvalData: {
      approved: boolean;
      comments?: string;
      conditions?: any;
    }
  ): Promise<WorkflowInstance> {
    if (approvalData.approved) {
      return await this.advanceWorkflow(workflowId, stageId, userId, approvalData);
    } else {
      // Handle rejection
      return await this.rejectStage(workflowId, stageId, userId, approvalData);
    }
  }

  /**
   * Reject workflow stage
   */
  async rejectStage(
    workflowId: string,
    stageId: string,
    userId: string,
    rejectionData: any
  ): Promise<WorkflowInstance> {
    const instance = await this.getWorkflowInstance(workflowId);
    
    // Update workflow status
    instance.status = 'rejected';
    await this.updateWorkflowInstance(instance);

    // Record rejection
    await prisma.workflowStageHistory.create({
      data: {
        workflowInstanceId: workflowId,
        stageId,
        stageName: stageId,
        status: 'rejected',
        assignedUsers: [userId],
        notes: rejectionData.comments,
        completedAt: new Date(),
        approvals: JSON.stringify(rejectionData)
      }
    });

    // Send notifications
    await this.sendStageNotifications(instance, stageId, 'stage_rejected');

    // Emit rejection event
    this.emit('stage_rejected', {
      type: 'stage_rejected',
      workflowId,
      stageId,
      data: rejectionData,
      timestamp: new Date(),
      userId
    });

    return instance;
  }

  /**
   * Get workflow instance with full details
   */
  async getWorkflowInstanceDetails(workflowId: string): Promise<{
    instance: WorkflowInstance;
    template: WorkflowTemplate;
    history: any[];
    currentStageDetails: WorkflowStage | null;
  }> {
    const instance = await this.getWorkflowInstance(workflowId);
    const template = await this.getWorkflowTemplate(instance.templateId);
    
    const history = await prisma.workflowStageHistory.findMany({
      where: { workflowInstanceId: workflowId },
      orderBy: { startedAt: 'asc' }
    });

    const currentStageDetails = template.stages.find(s => s.id === instance.currentStage) || null;

    return {
      instance,
      template,
      history,
      currentStageDetails
    };
  }

  /**
   * Get workflows by status and project
   */
  async getWorkflowsByProject(
    projectId: string,
    status?: WorkflowStatus[]
  ): Promise<WorkflowInstance[]> {
    const where: any = { projectId };
    
    if (status && status.length > 0) {
      where.status = { in: status };
    }

    const workflows = await prisma.enterpriseWorkflowInstance.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        workflowTemplate: true,
        project: true,
        document: true
      }
    });

    return Promise.all(workflows.map(async (wf) => {
      const template = await this.getWorkflowTemplate(wf.workflowTemplateId);
      return this.parseWorkflowInstance(wf, template);
    }));
  }

  /**
   * Get workflow analytics
   */
  async getWorkflowAnalytics(projectId?: string): Promise<{
    totalWorkflows: number;
    activeWorkflows: number;
    completedWorkflows: number;
    averageCompletionTime: number;
    stageBottlenecks: { [stageId: string]: number };
    completionRate: number;
  }> {
    const where: any = {};
    if (projectId) where.projectId = projectId;

    const [total, active, completed] = await Promise.all([
      prisma.enterpriseWorkflowInstance.count({ where }),
      prisma.enterpriseWorkflowInstance.count({ 
        where: { ...where, status: { in: ['pending', 'in_progress'] } }
      }),
      prisma.enterpriseWorkflowInstance.count({ 
        where: { ...where, status: 'completed' }
      })
    ]);

    // Calculate average completion time
    const completedWorkflows = await prisma.enterpriseWorkflowInstance.findMany({
      where: { ...where, status: 'completed', actualEndDate: { not: null } },
      select: { createdAt: true, actualEndDate: true }
    });

    const avgCompletionTime = completedWorkflows.length > 0
      ? completedWorkflows.reduce((sum, wf) => {
          const duration = wf.actualEndDate!.getTime() - wf.createdAt.getTime();
          return sum + duration;
        }, 0) / completedWorkflows.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    // Find stage bottlenecks (stages that take longest on average)
    const stageHistory = await prisma.workflowStageHistory.findMany({
      where: projectId ? { workflowInstance: { projectId } } : {},
      select: { stageId: true, startedAt: true, completedAt: true }
    });

    const stageBottlenecks: { [stageId: string]: number } = {};
    stageHistory.forEach(stage => {
      if (stage.completedAt) {
        const duration = stage.completedAt.getTime() - stage.startedAt.getTime();
        stageBottlenecks[stage.stageId] = (stageBottlenecks[stage.stageId] || 0) + duration;
      }
    });

    return {
      totalWorkflows: total,
      activeWorkflows: active,
      completedWorkflows: completed,
      averageCompletionTime: avgCompletionTime,
      stageBottlenecks,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }

  // ================================================================================
  // PRIVATE HELPER METHODS
  // ================================================================================

  private async startStage(instance: WorkflowInstance, stage: WorkflowStage): Promise<void> {
    // Update workflow status
    instance.status = 'in_progress';
    await this.updateWorkflowInstance(instance);

    // Record stage start
    await prisma.workflowStageHistory.create({
      data: {
        workflowInstanceId: instance.id,
        stageId: stage.id,
        stageName: stage.name,
        status: 'in_progress',
        assignedUsers: stage.requiredRoles,
        startedAt: new Date()
      }
    });

    // Set timeout if specified
    if (stage.timeoutHours) {
      const timeout = setTimeout(async () => {
        await this.handleStageTimeout(instance.id, stage.id);
      }, stage.timeoutHours * 60 * 60 * 1000);
      
      this.stageTimeouts.set(`${instance.id}-${stage.id}`, timeout);
    }

    // Execute stage actions
    await this.executeStageActions(instance, stage, 'stage_start');

    // Send notifications
    await this.sendStageNotifications(instance, stage.id, 'stage_start');

    // Auto-approve if configured
    if (stage.autoApprove) {
      setTimeout(async () => {
        await this.advanceWorkflow(instance.id, stage.id, 'system');
      }, 1000);
    }

    // Emit stage started event
    this.emit('stage_started', {
      type: 'stage_started',
      workflowId: instance.id,
      stageId: stage.id,
      data: { stage, instance },
      timestamp: new Date()
    });
  }

  private async completeStage(
    instance: WorkflowInstance,
    stage: WorkflowStage,
    userId: string,
    approvalData?: any
  ): Promise<void> {
    // Clear timeout
    const timeoutKey = `${instance.id}-${stage.id}`;
    if (this.stageTimeouts.has(timeoutKey)) {
      clearTimeout(this.stageTimeouts.get(timeoutKey)!);
      this.stageTimeouts.delete(timeoutKey);
    }

    // Update stage history
    await prisma.workflowStageHistory.updateMany({
      where: {
        workflowInstanceId: instance.id,
        stageId: stage.id,
        status: 'in_progress'
      },
      data: {
        status: 'completed',
        completedAt: new Date(),
        approvals: JSON.stringify(approvalData || {})
      }
    });

    // Execute completion actions
    await this.executeStageActions(instance, stage, 'stage_complete');

    // Send notifications
    await this.sendStageNotifications(instance, stage.id, 'stage_complete');

    // Emit stage completed event
    this.emit('stage_completed', {
      type: 'stage_completed',
      workflowId: instance.id,
      stageId: stage.id,
      data: { stage, instance, approvalData },
      timestamp: new Date(),
      userId
    });
  }

  private async completeWorkflow(instance: WorkflowInstance, userId: string): Promise<void> {
    instance.status = 'completed';
    instance.progress = 100;
    instance.completedAt = new Date();
    
    await this.updateWorkflowInstance(instance);

    // Remove from running workflows
    this.runningWorkflows.delete(instance.id);

    // Emit workflow completed event
    this.emit('workflow_completed', {
      type: 'workflow_completed',
      workflowId: instance.id,
      data: instance,
      timestamp: new Date(),
      userId
    });
  }

  private findNextStage(
    stages: WorkflowStage[],
    currentStage: WorkflowStage,
    instance: WorkflowInstance
  ): WorkflowStage | null {
    const sortedStages = stages.sort((a, b) => a.sequence - b.sequence);
    const currentIndex = sortedStages.findIndex(s => s.id === currentStage.id);
    
    if (currentIndex === -1 || currentIndex === sortedStages.length - 1) {
      return null;
    }

    const nextStage = sortedStages[currentIndex + 1];
    
    // Check conditions
    if (nextStage.conditions && nextStage.conditions.length > 0) {
      const conditionsMet = this.evaluateConditions(nextStage.conditions, instance);
      if (!conditionsMet) {
        // Skip this stage and find next
        return this.findNextStage(stages, nextStage, instance);
      }
    }

    return nextStage;
  }

  private evaluateConditions(conditions: WorkflowCondition[], instance: WorkflowInstance): boolean {
    // Implement condition evaluation logic
    return conditions.every(condition => {
      const value = instance.variables[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not_equals':
          return value !== condition.value;
        case 'greater_than':
          return value > condition.value;
        case 'less_than':
          return value < condition.value;
        case 'contains':
          return typeof value === 'string' && value.includes(condition.value);
        case 'exists':
          return value !== undefined && value !== null;
        default:
          return false;
      }
    });
  }

  private calculateProgress(stages: WorkflowStage[], currentStage: WorkflowStage): number {
    const sortedStages = stages.sort((a, b) => a.sequence - b.sequence);
    const currentIndex = sortedStages.findIndex(s => s.id === currentStage.id);
    return Math.round(((currentIndex + 1) / sortedStages.length) * 100);
  }

  private hasStagePermission(userId: string, stage: WorkflowStage): boolean {
    // TODO: Implement role-based permission checking
    // For now, return true - this should integrate with the authentication system
    return true;
  }

  private async executeStageActions(
    instance: WorkflowInstance,
    stage: WorkflowStage,
    trigger: string
  ): Promise<void> {
    const actions = stage.actions.filter(action => 
      stage.notifications.some(n => n.triggerOn === trigger)
    );

    for (const action of actions) {
      try {
        await this.executeAction(action, instance);
      } catch (error) {
        console.error(`Failed to execute action:`, error);
        // Execute error actions if defined
        if (action.onError) {
          for (const errorAction of action.onError) {
            await this.executeAction(errorAction, instance);
          }
        }
      }
    }
  }

  private async executeAction(action: WorkflowAction, instance: WorkflowInstance): Promise<void> {
    switch (action.type) {
      case 'update_document':
        // Update document with action config
        if (instance.documentId) {
          await prisma.document.update({
            where: { id: instance.documentId },
            data: action.config
          });
        }
        break;
        
      case 'send_notification':
        // Send notification (integrate with notification service)
        console.log('Sending notification:', action.config);
        break;
        
      case 'generate_document':
        // Generate document (integrate with document generation service)
        console.log('Generating document:', action.config);
        break;
        
      default:
        console.log('Unknown action type:', action.type);
    }
  }

  private async sendStageNotifications(
    instance: WorkflowInstance,
    stageId: string,
    trigger: string
  ): Promise<void> {
    // TODO: Implement notification sending
    console.log(`Sending notifications for workflow ${instance.id}, stage ${stageId}, trigger ${trigger}`);
  }

  private async handleStageTimeout(workflowId: string, stageId: string): Promise<void> {
    console.log(`Stage timeout: workflow ${workflowId}, stage ${stageId}`);
    
    // Emit timeout event
    this.emit('stage_timeout', {
      type: 'stage_timeout',
      workflowId,
      stageId,
      data: { reason: 'timeout' },
      timestamp: new Date()
    });
  }

  private setupEventHandlers(): void {
    this.on('workflow_started', (event: WorkflowEvent) => {
      console.log('Workflow started:', event.workflowId);
    });

    this.on('stage_completed', (event: WorkflowEvent) => {
      console.log('Stage completed:', event.workflowId, event.stageId);
    });

    this.on('workflow_completed', (event: WorkflowEvent) => {
      console.log('Workflow completed:', event.workflowId);
    });
  }

  private async getWorkflowTemplate(templateId: string): Promise<WorkflowTemplate> {
    const template = await prisma.workflowTemplate.findUnique({
      where: { id: templateId }
    });
    
    if (!template) {
      throw new Error('Workflow template not found');
    }

    return this.parseWorkflowTemplate(template);
  }

  private async getWorkflowInstance(workflowId: string): Promise<WorkflowInstance> {
    // Check running workflows first
    if (this.runningWorkflows.has(workflowId)) {
      return this.runningWorkflows.get(workflowId)!;
    }

    const instance = await prisma.enterpriseWorkflowInstance.findUnique({
      where: { id: workflowId }
    });

    if (!instance) {
      throw new Error('Workflow instance not found');
    }

    const template = await this.getWorkflowTemplate(instance.workflowTemplateId);
    return this.parseWorkflowInstance(instance, template);
  }

  private async updateWorkflowInstance(instance: WorkflowInstance): Promise<void> {
    await prisma.enterpriseWorkflowInstance.update({
      where: { id: instance.id },
      data: {
        status: instance.status,
        currentStage: instance.currentStage,
        progress: instance.progress,
        variables: JSON.stringify(instance.variables),
        completedAt: instance.completedAt,
        updatedAt: new Date()
      }
    });

    // Update running workflows cache
    this.runningWorkflows.set(instance.id, instance);
  }

  private parseWorkflowTemplate(template: any): WorkflowTemplate {
    return {
      ...template,
      stages: JSON.parse(template.stages || '[]'),
      globalVariables: JSON.parse(template.globalVariables || '{}')
    };
  }

  private parseWorkflowInstance(instance: any, template?: WorkflowTemplate): WorkflowInstance {
    return {
      ...instance,
      variables: JSON.parse(instance.variables || '{}'),
      metadata: JSON.parse(instance.metadata || '{}'),
      templateId: instance.workflowTemplateId
    };
  }
}

// Export singleton instance
export const documentWorkflowEngine = new DocumentWorkflowEngine();

export default documentWorkflowEngine;