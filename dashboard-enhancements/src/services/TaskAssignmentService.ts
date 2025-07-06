/**
 * ================================================================================
 * TASK ASSIGNMENT AND NOTIFICATION SERVICE
 * Intelligent task assignment, automated notifications, and workflow coordination
 * ================================================================================
 */

import { EventEmitter } from 'events';

// Core Types
export interface TaskAssignment {
  id: string;
  taskId: string;
  assignedTo: AssigneeInfo;
  assignedBy: string;
  assignedAt: Date;
  dueDate?: Date;
  priority: TaskPriority;
  status: AssignmentStatus;
  completedAt?: Date;
  delegations: TaskDelegation[];
  reminders: TaskReminder[];
  metadata: Record<string, any>;
}

export interface AssigneeInfo {
  id: string;
  type: UserType;
  name: string;
  email: string;
  organizationId?: string;
  role: UserRole;
  expertise?: string[];
  workload: number; // Current task count
  availability: AvailabilityStatus;
  lastActive?: Date;
}

export interface TaskDelegation {
  id: string;
  fromUserId: string;
  toUserId: string;
  delegatedAt: Date;
  reason: string;
  acceptedAt?: Date;
  status: 'pending' | 'accepted' | 'declined';
  originalDueDate?: Date;
  newDueDate?: Date;
}

export interface TaskReminder {
  id: string;
  taskId: string;
  assignmentId: string;
  type: ReminderType;
  scheduledFor: Date;
  sentAt?: Date;
  channel: NotificationChannel;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  message: string;
  metadata?: Record<string, any>;
}

export interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: NotificationTrigger;
  conditions: NotificationCondition[];
  actions: NotificationAction[];
  priority: TaskPriority;
  enabled: boolean;
  createdAt: Date;
  lastTriggered?: Date;
}

export interface AutoAssignmentRule {
  id: string;
  name: string;
  description: string;
  conditions: AssignmentCondition[];
  assignmentLogic: AssignmentLogic;
  priority: number;
  enabled: boolean;
  createdAt: Date;
  lastUsed?: Date;
}

// Enums
export enum UserType {
  BUYER = 'buyer',
  SELLER = 'seller',
  DEVELOPER = 'developer',
  AGENT = 'agent',
  SOLICITOR = 'solicitor',
  LENDER = 'lender',
  SURVEYOR = 'surveyor',
  ADMIN = 'admin',
  SYSTEM = 'system'
}

export enum UserRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  COORDINATOR = 'coordinator',
  APPROVER = 'approver',
  REVIEWER = 'reviewer',
  OBSERVER = 'observer'
}

export enum TaskPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum AssignmentStatus {
  ASSIGNED = 'assigned',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELEGATED = 'delegated',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  AWAY = 'away',
  OFFLINE = 'offline'
}

export enum ReminderType {
  DUE_SOON = 'due_soon',
  OVERDUE = 'overdue',
  FOLLOW_UP = 'follow_up',
  ESCALATION = 'escalation',
  DELEGATION_REQUEST = 'delegation_request',
  MILESTONE_APPROACHING = 'milestone_approaching'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  SLACK = 'slack',
  TEAMS = 'teams'
}

export enum NotificationTrigger {
  TASK_ASSIGNED = 'task_assigned',
  TASK_COMPLETED = 'task_completed',
  TASK_OVERDUE = 'task_overdue',
  TASK_DELEGATED = 'task_delegated',
  MILESTONE_REACHED = 'milestone_reached',
  DEPENDENCY_COMPLETED = 'dependency_completed',
  DEADLINE_APPROACHING = 'deadline_approaching',
  CUSTOM = 'custom'
}

export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
}

export interface NotificationAction {
  type: 'send_notification' | 'create_task' | 'escalate' | 'delegate' | 'webhook';
  channel?: NotificationChannel;
  recipients?: string[];
  template?: string;
  data?: Record<string, any>;
}

export interface AssignmentCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface AssignmentLogic {
  strategy: 'round_robin' | 'workload_based' | 'expertise_match' | 'availability' | 'custom';
  parameters?: Record<string, any>;
  fallbackAssignee?: string;
}

// Events
export const ASSIGNMENT_EVENTS = {
  TASK_ASSIGNED: 'assignment:task_assigned',
  TASK_ACCEPTED: 'assignment:task_accepted',
  TASK_DELEGATED: 'assignment:task_delegated',
  TASK_COMPLETED: 'assignment:task_completed',
  TASK_OVERDUE: 'assignment:task_overdue',
  REMINDER_SENT: 'assignment:reminder_sent',
  ESCALATION_TRIGGERED: 'assignment:escalation_triggered'
} as const;

/**
 * Task Assignment Service Class
 * Handles intelligent task assignment, automated notifications, and workflow coordination
 */
export class TaskAssignmentService extends EventEmitter {
  private assignments: Map<string, TaskAssignment> = new Map();
  private users: Map<string, AssigneeInfo> = new Map();
  private notificationRules: Map<string, NotificationRule> = new Map();
  private autoAssignmentRules: Map<string, AutoAssignmentRule> = new Map();
  private reminders: Map<string, TaskReminder> = new Map();

  constructor() {
    super();
    this.setupEventHandlers();
    this.initializeDefaultRules();
    this.startReminderScheduler();
  }

  private setupEventHandlers() {
    this.on(ASSIGNMENT_EVENTS.TASK_ASSIGNED, this.handleTaskAssigned.bind(this));
    this.on(ASSIGNMENT_EVENTS.TASK_COMPLETED, this.handleTaskCompleted.bind(this));
    this.on(ASSIGNMENT_EVENTS.TASK_OVERDUE, this.handleTaskOverdue.bind(this));
  }

  private initializeDefaultRules() {
    // Default notification rules
    this.addNotificationRule({
      id: 'default_assignment_notification',
      name: 'Task Assignment Notification',
      description: 'Notify when a task is assigned',
      trigger: NotificationTrigger.TASK_ASSIGNED,
      conditions: [],
      actions: [
        {
          type: 'send_notification',
          channel: NotificationChannel.EMAIL,
          template: 'task_assigned'
        },
        {
          type: 'send_notification',
          channel: NotificationChannel.IN_APP,
          template: 'task_assigned'
        }
      ],
      priority: TaskPriority.MEDIUM,
      enabled: true,
      createdAt: new Date()
    });

    // Default auto-assignment rules
    this.addAutoAssignmentRule({
      id: 'solicitor_legal_tasks',
      name: 'Assign Legal Tasks to Solicitors',
      description: 'Automatically assign legal category tasks to available solicitors',
      conditions: [
        { field: 'category', operator: 'equals', value: 'legal' }
      ],
      assignmentLogic: {
        strategy: 'workload_based',
        parameters: { maxWorkload: 10 }
      },
      priority: 1,
      enabled: true,
      createdAt: new Date()
    });
  }

  /**
   * Assign a task to a user or automatically determine the best assignee
   */
  async assignTask(params: {
    taskId: string;
    assignedTo?: string;
    assignedBy: string;
    dueDate?: Date;
    priority?: TaskPriority;
    autoAssign?: boolean;
    taskData?: any;
  }): Promise<TaskAssignment> {
    const assignmentId = this.generateId();
    
    let assignee: AssigneeInfo | null = null;

    if (params.assignedTo) {
      // Direct assignment
      assignee = this.users.get(params.assignedTo) || null;
      if (!assignee) {
        throw new Error(`User not found: ${params.assignedTo}`);
      }
    } else if (params.autoAssign && params.taskData) {
      // Auto-assignment based on rules
      assignee = await this.findBestAssignee(params.taskData);
      if (!assignee) {
        throw new Error('No suitable assignee found');
      }
    } else {
      throw new Error('Either assignedTo or autoAssign must be specified');
    }

    const assignment: TaskAssignment = {
      id: assignmentId,
      taskId: params.taskId,
      assignedTo: assignee,
      assignedBy: params.assignedBy,
      assignedAt: new Date(),
      dueDate: params.dueDate,
      priority: params.priority || TaskPriority.MEDIUM,
      status: AssignmentStatus.ASSIGNED,
      delegations: [],
      reminders: [],
      metadata: {}
    };

    this.assignments.set(assignmentId, assignment);

    // Update assignee workload
    assignee.workload += 1;
    this.users.set(assignee.id, assignee);

    // Schedule automatic reminders
    await this.scheduleReminders(assignment);

    this.emit(ASSIGNMENT_EVENTS.TASK_ASSIGNED, assignment);

    return assignment;
  }

  /**
   * Delegate a task to another user
   */
  async delegateTask(params: {
    assignmentId: string;
    fromUserId: string;
    toUserId: string;
    reason: string;
    newDueDate?: Date;
  }): Promise<TaskDelegation> {
    const assignment = this.assignments.get(params.assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const toUser = this.users.get(params.toUserId);
    if (!toUser) {
      throw new Error('Target user not found');
    }

    const delegation: TaskDelegation = {
      id: this.generateId(),
      fromUserId: params.fromUserId,
      toUserId: params.toUserId,
      delegatedAt: new Date(),
      reason: params.reason,
      status: 'pending',
      originalDueDate: assignment.dueDate,
      newDueDate: params.newDueDate
    };

    assignment.delegations.push(delegation);
    assignment.status = AssignmentStatus.DELEGATED;

    this.emit(ASSIGNMENT_EVENTS.TASK_DELEGATED, { assignment, delegation });

    return delegation;
  }

  /**
   * Accept a delegated task
   */
  async acceptDelegation(params: {
    assignmentId: string;
    delegationId: string;
    userId: string;
  }): Promise<void> {
    const assignment = this.assignments.get(params.assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const delegation = assignment.delegations.find(d => d.id === params.delegationId);
    if (!delegation) {
      throw new Error('Delegation not found');
    }

    delegation.acceptedAt = new Date();
    delegation.status = 'accepted';

    // Update assignment
    const newAssignee = this.users.get(params.userId);
    if (newAssignee) {
      // Decrease workload of original assignee
      assignment.assignedTo.workload -= 1;
      this.users.set(assignment.assignedTo.id, assignment.assignedTo);

      // Update assignment to new assignee
      assignment.assignedTo = newAssignee;
      assignment.status = AssignmentStatus.ACCEPTED;
      if (delegation.newDueDate) {
        assignment.dueDate = delegation.newDueDate;
      }

      // Increase workload of new assignee
      newAssignee.workload += 1;
      this.users.set(newAssignee.id, newAssignee);
    }

    this.emit(ASSIGNMENT_EVENTS.TASK_ACCEPTED, assignment);
  }

  /**
   * Mark task as completed
   */
  async completeTask(assignmentId: string, completedBy: string): Promise<void> {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    assignment.status = AssignmentStatus.COMPLETED;
    assignment.completedAt = new Date();

    // Decrease assignee workload
    assignment.assignedTo.workload -= 1;
    this.users.set(assignment.assignedTo.id, assignment.assignedTo);

    // Cancel any pending reminders
    assignment.reminders.forEach(reminder => {
      if (reminder.status === 'scheduled') {
        reminder.status = 'cancelled';
      }
    });

    this.emit(ASSIGNMENT_EVENTS.TASK_COMPLETED, assignment);
  }

  /**
   * Find the best assignee for a task based on auto-assignment rules
   */
  private async findBestAssignee(taskData: any): Promise<AssigneeInfo | null> {
    const applicableRules = Array.from(this.autoAssignmentRules.values())
      .filter(rule => rule.enabled && this.evaluateConditions(taskData, rule.conditions))
      .sort((a, b) => a.priority - b.priority);

    for (const rule of applicableRules) {
      const assignee = await this.applyAssignmentLogic(rule.assignmentLogic, taskData);
      if (assignee) {
        rule.lastUsed = new Date();
        return assignee;
      }
    }

    return null;
  }

  /**
   * Apply assignment logic to find the best assignee
   */
  private async applyAssignmentLogic(logic: AssignmentLogic, taskData: any): Promise<AssigneeInfo | null> {
    const eligibleUsers = Array.from(this.users.values()).filter(user => 
      user.availability === AvailabilityStatus.AVAILABLE
    );

    switch (logic.strategy) {
      case 'workload_based':
        const maxWorkload = logic.parameters?.maxWorkload || 5;
        return eligibleUsers
          .filter(user => user.workload < maxWorkload)
          .sort((a, b) => a.workload - b.workload)[0] || null;

      case 'expertise_match':
        const requiredExpertise = taskData.requiredExpertise || [];
        return eligibleUsers
          .filter(user => user.expertise?.some(exp => requiredExpertise.includes(exp)))
          .sort((a, b) => a.workload - b.workload)[0] || null;

      case 'round_robin':
        // Simple round-robin based on last assignment
        return eligibleUsers.sort((a, b) => 
          (a.lastActive?.getTime() || 0) - (b.lastActive?.getTime() || 0)
        )[0] || null;

      case 'availability':
        return eligibleUsers
          .filter(user => user.availability === AvailabilityStatus.AVAILABLE)
          .sort((a, b) => a.workload - b.workload)[0] || null;

      default:
        return logic.fallbackAssignee ? this.users.get(logic.fallbackAssignee) || null : null;
    }
  }

  /**
   * Schedule automatic reminders for a task
   */
  private async scheduleReminders(assignment: TaskAssignment): Promise<void> {
    if (!assignment.dueDate) return;

    const now = new Date();
    const dueDate = assignment.dueDate;
    const timeToDue = dueDate.getTime() - now.getTime();

    // Schedule reminder 24 hours before due date
    if (timeToDue > 24 * 60 * 60 * 1000) {
      const reminderDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
      await this.scheduleReminder({
        taskId: assignment.taskId,
        assignmentId: assignment.id,
        type: ReminderType.DUE_SOON,
        scheduledFor: reminderDate,
        channel: NotificationChannel.EMAIL,
        message: `Task "${assignment.taskId}" is due in 24 hours`
      });
    }

    // Schedule overdue reminder 2 hours after due date
    const overdueDate = new Date(dueDate.getTime() + 2 * 60 * 60 * 1000);
    await this.scheduleReminder({
      taskId: assignment.taskId,
      assignmentId: assignment.id,
      type: ReminderType.OVERDUE,
      scheduledFor: overdueDate,
      channel: NotificationChannel.EMAIL,
      message: `Task "${assignment.taskId}" is overdue`
    });
  }

  /**
   * Schedule a specific reminder
   */
  private async scheduleReminder(params: {
    taskId: string;
    assignmentId: string;
    type: ReminderType;
    scheduledFor: Date;
    channel: NotificationChannel;
    message: string;
    metadata?: Record<string, any>;
  }): Promise<TaskReminder> {
    const reminder: TaskReminder = {
      id: this.generateId(),
      taskId: params.taskId,
      assignmentId: params.assignmentId,
      type: params.type,
      scheduledFor: params.scheduledFor,
      channel: params.channel,
      status: 'scheduled',
      message: params.message,
      metadata: params.metadata
    };

    this.reminders.set(reminder.id, reminder);

    const assignment = this.assignments.get(params.assignmentId);
    if (assignment) {
      assignment.reminders.push(reminder);
    }

    return reminder;
  }

  /**
   * Process scheduled reminders
   */
  private startReminderScheduler(): void {
    setInterval(async () => {
      const now = new Date();
      const dueReminders = Array.from(this.reminders.values()).filter(
        reminder => reminder.status === 'scheduled' && reminder.scheduledFor <= now
      );

      for (const reminder of dueReminders) {
        try {
          await this.sendReminder(reminder);
          reminder.status = 'sent';
          reminder.sentAt = new Date();
          this.emit(ASSIGNMENT_EVENTS.REMINDER_SENT, reminder);
        } catch (error) {
          reminder.status = 'failed';
          console.error('Failed to send reminder:', error);
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Send a reminder notification
   */
  private async sendReminder(reminder: TaskReminder): Promise<void> {
    const assignment = this.assignments.get(reminder.assignmentId);
    if (!assignment) return;

    // In production, this would integrate with actual notification services
    console.log(`Sending ${reminder.type} reminder to ${assignment.assignedTo.email}: ${reminder.message}`);
    
    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Add a notification rule
   */
  addNotificationRule(rule: Omit<NotificationRule, 'id'> & { id?: string }): NotificationRule {
    const id = rule.id || this.generateId();
    const fullRule: NotificationRule = { ...rule, id };
    this.notificationRules.set(id, fullRule);
    return fullRule;
  }

  /**
   * Add an auto-assignment rule
   */
  addAutoAssignmentRule(rule: Omit<AutoAssignmentRule, 'id'> & { id?: string }): AutoAssignmentRule {
    const id = rule.id || this.generateId();
    const fullRule: AutoAssignmentRule = { ...rule, id };
    this.autoAssignmentRules.set(id, fullRule);
    return fullRule;
  }

  /**
   * Register a user in the system
   */
  registerUser(user: AssigneeInfo): void {
    this.users.set(user.id, user);
  }

  /**
   * Get assignment by ID
   */
  getAssignment(assignmentId: string): TaskAssignment | null {
    return this.assignments.get(assignmentId) || null;
  }

  /**
   * Get assignments for a user
   */
  getUserAssignments(userId: string): TaskAssignment[] {
    return Array.from(this.assignments.values()).filter(
      assignment => assignment.assignedTo.id === userId
    );
  }

  /**
   * Get overdue assignments
   */
  getOverdueAssignments(): TaskAssignment[] {
    const now = new Date();
    return Array.from(this.assignments.values()).filter(
      assignment => assignment.dueDate && assignment.dueDate < now && 
      assignment.status !== AssignmentStatus.COMPLETED
    );
  }

  // Event handlers
  private async handleTaskAssigned(assignment: TaskAssignment): Promise<void> {
    console.log(`Task ${assignment.taskId} assigned to ${assignment.assignedTo.name}`);
  }

  private async handleTaskCompleted(assignment: TaskAssignment): Promise<void> {
    console.log(`Task ${assignment.taskId} completed by ${assignment.assignedTo.name}`);
  }

  private async handleTaskOverdue(assignment: TaskAssignment): Promise<void> {
    console.log(`Task ${assignment.taskId} is overdue for ${assignment.assignedTo.name}`);
    // Trigger escalation logic here
  }

  // Utility methods
  private evaluateConditions(data: any, conditions: (NotificationCondition | AssignmentCondition)[]): boolean {
    return conditions.every(condition => {
      const value = data[condition.field];
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not_equals':
          return value !== condition.value;
        case 'contains':
          return typeof value === 'string' && value.includes(condition.value);
        case 'greater_than':
          return value > condition.value;
        case 'less_than':
          return value < condition.value;
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(value);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(value);
        default:
          return false;
      }
    });
  }

  private generateId(): string {
    return `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const taskAssignmentService = new TaskAssignmentService();