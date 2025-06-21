/**
 * Ecosystem Notification Service
 * 
 * Week 4 Implementation: Core Service Enhancement
 * Phase 1, Month 1 - Foundation Enhancement
 * 
 * Enhanced notification system for the complete 49-role professional ecosystem
 * Provides real-time notifications, role-based messaging, and cross-stakeholder alerts
 */

import { PrismaClient, UserRole } from '@prisma/client';
import { EventEmitter } from 'events';

const prisma = new PrismaClient();

export interface EcosystemNotification {
  id: string;
  type: 'task_assignment' | 'role_coordination' | 'certification_expiry' | 'project_update' | 'compliance_alert' | 'workflow_status';
  title: string;
  message: string;
  targetRoles: UserRole[];
  targetUsers?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata: {
    transactionId?: string;
    projectId?: string;
    taskId?: string;
    coordinationId?: string;
    certificationId?: string;
    deadline?: Date;
    actionRequired?: boolean;
  };
  channels: ('in_app' | 'email' | 'sms' | 'webhook')[];
  timestamp: Date;
  expiresAt?: Date;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'acknowledged' | 'expired';
}

export interface NotificationTemplate {
  type: string;
  title: string;
  messageTemplate: string;
  defaultPriority: 'low' | 'medium' | 'high' | 'critical';
  defaultChannels: ('in_app' | 'email' | 'sms' | 'webhook')[];
  roleSpecific: boolean;
  variables: string[];
}

/**
 * Ecosystem Notification Service
 * 
 * Comprehensive notification system for the 49-role professional ecosystem
 * Handles real-time alerts, role-based messaging, and cross-stakeholder coordination
 */
export class EcosystemNotificationService extends EventEmitter {
  private notificationQueue = new Map<string, EcosystemNotification>();
  private templates = new Map<string, NotificationTemplate>();
  private userPreferences = new Map<string, any>();
  private roleSubscriptions = new Map<UserRole, Set<string>>();

  constructor() {
    super();
    this.initializeNotificationTemplates();
    this.initializeEventHandlers();
  }

  /**
   * Initialize notification templates for all professional roles
   */
  private initializeNotificationTemplates() {
    const templates: NotificationTemplate[] = [
      // Task Assignment Templates
      {
        type: 'TASK_ASSIGNED',
        title: 'New Task Assignment',
        messageTemplate: 'You have been assigned a new task: {{taskTitle}} for {{projectName}}. Deadline: {{deadline}}',
        defaultPriority: 'medium',
        defaultChannels: ['in_app', 'email'],
        roleSpecific: true,
        variables: ['taskTitle', 'projectName', 'deadline', 'assignedBy']
      },
      {
        type: 'URGENT_TASK_ASSIGNMENT',
        title: 'Urgent Task Assignment',
        messageTemplate: 'URGENT: Critical task assigned - {{taskTitle}}. Immediate attention required for {{projectName}}.',
        defaultPriority: 'critical',
        defaultChannels: ['in_app', 'email', 'sms'],
        roleSpecific: true,
        variables: ['taskTitle', 'projectName', 'urgencyReason']
      },

      // Role Coordination Templates
      {
        type: 'ECOSYSTEM_COORDINATION',
        title: 'Professional Coordination Required',
        messageTemplate: 'Your expertise is needed for {{transactionType}} coordination. Multiple professionals are waiting for your input.',
        defaultPriority: 'high',
        defaultChannels: ['in_app', 'email'],
        roleSpecific: true,
        variables: ['transactionType', 'coordinatingProfessionals', 'timeline']
      },
      {
        type: 'CROSS_ROLE_DEPENDENCY',
        title: 'Professional Dependency Alert',
        messageTemplate: '{{dependentRole}} is waiting for your {{taskType}} completion before proceeding with {{dependentTask}}.',
        defaultPriority: 'high',
        defaultChannels: ['in_app', 'email'],
        roleSpecific: true,
        variables: ['dependentRole', 'taskType', 'dependentTask', 'impact']
      },

      // Certification & Compliance Templates
      {
        type: 'CERTIFICATION_EXPIRY',
        title: 'Professional Certification Expiring',
        messageTemplate: 'Your {{certificationType}} expires on {{expiryDate}}. Renew now to maintain active status.',
        defaultPriority: 'high',
        defaultChannels: ['in_app', 'email'],
        roleSpecific: true,
        variables: ['certificationType', 'expiryDate', 'renewalProcess']
      },
      {
        type: 'COMPLIANCE_ALERT',
        title: 'Compliance Action Required',
        messageTemplate: 'Compliance requirement for {{complianceType}} needs immediate attention. Project: {{projectName}}',
        defaultPriority: 'critical',
        defaultChannels: ['in_app', 'email', 'sms'],
        roleSpecific: true,
        variables: ['complianceType', 'projectName', 'deadline', 'consequences']
      },

      // Project Updates Templates
      {
        type: 'PROJECT_MILESTONE',
        title: 'Project Milestone Achieved',
        messageTemplate: '{{milestoneTitle}} completed for {{projectName}}. Next phase: {{nextPhase}}',
        defaultPriority: 'medium',
        defaultChannels: ['in_app'],
        roleSpecific: false,
        variables: ['milestoneTitle', 'projectName', 'nextPhase', 'impact']
      },
      {
        type: 'PROJECT_DELAY',
        title: 'Project Timeline Update',
        messageTemplate: 'Timeline adjustment for {{projectName}}. New completion date: {{newDate}}. Your tasks may be affected.',
        defaultPriority: 'high',
        defaultChannels: ['in_app', 'email'],
        roleSpecific: true,
        variables: ['projectName', 'newDate', 'reason', 'affectedTasks']
      },

      // Professional-Specific Templates
      {
        type: 'BER_ASSESSMENT_DUE',
        title: 'BER Assessment Required',
        messageTemplate: 'BER assessment due for {{propertyAddress}}. Compliance deadline: {{deadline}}',
        defaultPriority: 'high',
        defaultChannels: ['in_app', 'email'],
        roleSpecific: true,
        variables: ['propertyAddress', 'deadline', 'assessmentType']
      },
      {
        type: 'BCAR_CERTIFICATION_REQUIRED',
        title: 'BCAR Certification Required',
        messageTemplate: 'BCAR certification needed for {{constructionPhase}} at {{projectName}}. Statutory deadline: {{deadline}}',
        defaultPriority: 'critical',
        defaultChannels: ['in_app', 'email', 'sms'],
        roleSpecific: true,
        variables: ['constructionPhase', 'projectName', 'deadline', 'certificationScope']
      },
      {
        type: 'SOLICITOR_CONVEYANCING',
        title: 'Conveyancing Action Required',
        messageTemplate: 'Conveyancing milestone for {{clientName}}: {{action}}. Target completion: {{targetDate}}',
        defaultPriority: 'high',
        defaultChannels: ['in_app', 'email'],
        roleSpecific: true,
        variables: ['clientName', 'action', 'targetDate', 'propertyDetails']
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.type, template);
    });
  }

  /**
   * Initialize event handlers for real-time notifications
   */
  private initializeEventHandlers() {
    this.on('taskAssigned', this.handleTaskAssignment.bind(this));
    this.on('roleCoordination', this.handleRoleCoordination.bind(this));
    this.on('certificationExpiry', this.handleCertificationExpiry.bind(this));
    this.on('complianceAlert', this.handleComplianceAlert.bind(this));
    this.on('projectUpdate', this.handleProjectUpdate.bind(this));
  }

  /**
   * Send notification to specific roles across the ecosystem
   */
  async sendEcosystemNotification(
    type: string,
    targetRoles: UserRole[],
    variables: Record<string, any>,
    options?: {
      targetUsers?: string[];
      priority?: 'low' | 'medium' | 'high' | 'critical';
      channels?: ('in_app' | 'email' | 'sms' | 'webhook')[];
      metadata?: any;
      expiresAt?: Date;
    }
  ): Promise<EcosystemNotification> {
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Notification template '${type}' not found`);
    }

    // Process message template with variables
    let message = template.messageTemplate;
    template.variables.forEach(variable => {
      if (variables[variable]) {
        message = message.replace(new RegExp(`{{${variable}}}`, 'g'), variables[variable]);
      }
    });

    const notification: EcosystemNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type: type as any,
      title: template.title,
      message,
      targetRoles,
      targetUsers: options?.targetUsers,
      priority: options?.priority || template.defaultPriority,
      metadata: options?.metadata || {},
      channels: options?.channels || template.defaultChannels,
      timestamp: new Date(),
      expiresAt: options?.expiresAt,
      status: 'pending'
    };

    // Queue notification for processing
    this.notificationQueue.set(notification.id, notification);

    // Process notification through all channels
    await this.processNotification(notification);

    this.emit('notificationSent', notification);

    return notification;
  }

  /**
   * Process notification through configured channels
   */
  private async processNotification(notification: EcosystemNotification) {
    try {
      // Get target users based on roles
      const targetUsers = await this.getTargetUsers(notification.targetRoles, notification.targetUsers);

      // Process each channel
      const promises = notification.channels.map(channel => {
        switch (channel) {
          case 'in_app':
            return this.sendInAppNotification(notification, targetUsers);
          case 'email':
            return this.sendEmailNotification(notification, targetUsers);
          case 'sms':
            return this.sendSMSNotification(notification, targetUsers);
          case 'webhook':
            return this.sendWebhookNotification(notification, targetUsers);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      notification.status = 'sent';
      this.notificationQueue.set(notification.id, notification);

    } catch (error) {
      console.error('Failed to process notification:', error);
      notification.status = 'pending';
      // Retry logic could be implemented here
    }
  }

  /**
   * Get target users based on roles and specific user IDs
   */
  private async getTargetUsers(roles: UserRole[], specificUsers?: string[]) {
    const roleUsers = await prisma.user.findMany({
      where: {
        role: { in: roles },
        status: 'ACTIVE'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phoneNumber: true
      }
    });

    let targetUsers = roleUsers;

    if (specificUsers?.length) {
      const specificUserData = await prisma.user.findMany({
        where: {
          id: { in: specificUsers },
          status: 'ACTIVE'
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phoneNumber: true
        }
      });
      
      // Combine role-based and specific users (deduplicate)
      const allUsers = [...roleUsers, ...specificUserData];
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      );
      targetUsers = uniqueUsers;
    }

    return targetUsers;
  }

  /**
   * Send in-app notification
   */
  private async sendInAppNotification(notification: EcosystemNotification, users: any[]) {
    // Implementation would integrate with your in-app notification system
    // For now, we'll store in database for retrieval by UI
    const inAppNotifications = users.map(user => ({
      id: `${notification.id}_${user.id}`,
      userId: user.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      metadata: notification.metadata,
      isRead: false,
      createdAt: notification.timestamp
    }));

    // Store notifications in database (would need a notifications table)
    console.log('In-app notifications queued:', inAppNotifications.length);
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(notification: EcosystemNotification, users: any[]) {
    // Implementation would integrate with your email service (SES, SendGrid, etc.)
    const emailPromises = users.map(user => {
      const emailData = {
        to: user.email,
        subject: `${notification.priority.toUpperCase()}: ${notification.title}`,
        html: this.generateEmailHTML(notification, user),
        metadata: notification.metadata
      };
      
      // Would call email service here
      console.log(`Email queued for ${user.email}: ${notification.title}`);
      return Promise.resolve(emailData);
    });

    await Promise.all(emailPromises);
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(notification: EcosystemNotification, users: any[]) {
    // Implementation would integrate with SMS service (Twilio, AWS SNS, etc.)
    const smsPromises = users
      .filter(user => user.phoneNumber && notification.priority === 'critical')
      .map(user => {
        const smsData = {
          to: user.phoneNumber,
          message: `${notification.priority.toUpperCase()}: ${notification.title}\n${notification.message}`,
          metadata: notification.metadata
        };
        
        // Would call SMS service here
        console.log(`SMS queued for ${user.phoneNumber}: ${notification.title}`);
        return Promise.resolve(smsData);
      });

    await Promise.all(smsPromises);
  }

  /**
   * Send webhook notification
   */
  private async sendWebhookNotification(notification: EcosystemNotification, users: any[]) {
    // Implementation would send to configured webhook endpoints
    const webhookData = {
      notification,
      targetUsers: users.map(u => ({ id: u.id, role: u.role })),
      timestamp: notification.timestamp
    };

    console.log('Webhook notification queued:', webhookData);
    // Would make HTTP POST to webhook URLs here
  }

  /**
   * Generate HTML email template
   */
  private generateEmailHTML(notification: EcosystemNotification, user: any): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2c3e50; margin: 0;">
                ${notification.priority === 'critical' ? '🚨 ' : ''}${notification.title}
              </h2>
              <p style="color: #7f8c8d; margin: 5px 0 0 0;">
                Priority: ${notification.priority.toUpperCase()} | Role: ${user.role}
              </p>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
              <p>Dear ${user.name || 'Professional'},</p>
              <p>${notification.message}</p>
              
              ${notification.metadata.actionRequired ? `
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <strong>Action Required:</strong> Please log in to your PROP.ie dashboard to complete this task.
                </div>
              ` : ''}
              
              <div style="margin: 30px 0;">
                <a href="http://localhost:3000/dashboard" 
                   style="background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  View in Dashboard
                </a>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #7f8c8d; font-size: 12px;">
              <p>This notification was sent by PROP.ie Professional Ecosystem Management System.</p>
              <p>Sent: ${notification.timestamp.toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Event Handlers
   */
  private async handleTaskAssignment(data: any) {
    await this.sendEcosystemNotification(
      'TASK_ASSIGNED',
      [data.assignedRole],
      {
        taskTitle: data.taskTitle,
        projectName: data.projectName,
        deadline: data.deadline,
        assignedBy: data.assignedBy
      },
      {
        targetUsers: [data.assignedUserId],
        metadata: {
          taskId: data.taskId,
          projectId: data.projectId,
          actionRequired: true
        }
      }
    );
  }

  private async handleRoleCoordination(data: any) {
    await this.sendEcosystemNotification(
      'ECOSYSTEM_COORDINATION',
      data.requiredRoles,
      {
        transactionType: data.transactionType,
        coordinatingProfessionals: data.coordinatingProfessionals,
        timeline: data.timeline
      },
      {
        priority: 'high',
        metadata: {
          coordinationId: data.coordinationId,
          transactionId: data.transactionId
        }
      }
    );
  }

  private async handleCertificationExpiry(data: any) {
    await this.sendEcosystemNotification(
      'CERTIFICATION_EXPIRY',
      [data.professionalRole],
      {
        certificationType: data.certificationType,
        expiryDate: data.expiryDate,
        renewalProcess: data.renewalProcess
      },
      {
        targetUsers: [data.userId],
        priority: 'high',
        channels: ['in_app', 'email'],
        metadata: {
          certificationId: data.certificationId
        }
      }
    );
  }

  private async handleComplianceAlert(data: any) {
    await this.sendEcosystemNotification(
      'COMPLIANCE_ALERT',
      data.responsibleRoles,
      {
        complianceType: data.complianceType,
        projectName: data.projectName,
        deadline: data.deadline,
        consequences: data.consequences
      },
      {
        priority: 'critical',
        channels: ['in_app', 'email', 'sms'],
        metadata: {
          projectId: data.projectId,
          complianceId: data.complianceId,
          actionRequired: true
        }
      }
    );
  }

  private async handleProjectUpdate(data: any) {
    await this.sendEcosystemNotification(
      'PROJECT_MILESTONE',
      data.affectedRoles,
      {
        milestoneTitle: data.milestoneTitle,
        projectName: data.projectName,
        nextPhase: data.nextPhase,
        impact: data.impact
      },
      {
        priority: 'medium',
        metadata: {
          projectId: data.projectId,
          milestoneId: data.milestoneId
        }
      }
    );
  }

  /**
   * Get notification statistics for ecosystem monitoring
   */
  async getEcosystemNotificationStats() {
    const stats = {
      totalNotifications: this.notificationQueue.size,
      notificationsByType: {} as Record<string, number>,
      notificationsByRole: {} as Record<string, number>,
      notificationsByPriority: {} as Record<string, number>,
      notificationsByStatus: {} as Record<string, number>,
      averageResponseTime: 0,
      systemHealth: 'healthy' as 'healthy' | 'degraded' | 'unhealthy'
    };

    // Calculate statistics from notification queue
    for (const notification of this.notificationQueue.values()) {
      // By type
      stats.notificationsByType[notification.type] = 
        (stats.notificationsByType[notification.type] || 0) + 1;

      // By priority
      stats.notificationsByPriority[notification.priority] = 
        (stats.notificationsByPriority[notification.priority] || 0) + 1;

      // By status
      stats.notificationsByStatus[notification.status] = 
        (stats.notificationsByStatus[notification.status] || 0) + 1;

      // By roles
      notification.targetRoles.forEach(role => {
        stats.notificationsByRole[role] = 
          (stats.notificationsByRole[role] || 0) + 1;
      });
    }

    return stats;
  }

  /**
   * Clean up expired notifications
   */
  async cleanupExpiredNotifications() {
    const now = new Date();
    let cleanedCount = 0;

    for (const [id, notification] of this.notificationQueue.entries()) {
      if (notification.expiresAt && notification.expiresAt < now) {
        this.notificationQueue.delete(id);
        cleanedCount++;
      }
    }

    console.log(`Cleaned up ${cleanedCount} expired notifications`);
    return cleanedCount;
  }

  /**
   * Health check for notification service
   */
  async healthCheck() {
    try {
      const stats = await this.getEcosystemNotificationStats();
      
      return {
        status: 'healthy',
        queueSize: this.notificationQueue.size,
        templatesLoaded: this.templates.size,
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

export default new EcosystemNotificationService();