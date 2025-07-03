/**
 * Enterprise Real-Time Notification and Communication System
 * Multi-channel notification delivery with personalization and analytics
 * Supports email, SMS, push, in-app, and webhook notifications
 */

import { z } from 'zod';
import { enterpriseAuditLogger } from '@/lib/security/enterpriseAuditLogger';
import { multiTenantManager } from './multiTenantManager';

// Notification channels
export const NotificationChannel = z.enum([
  'email',
  'sms',
  'push_notification',
  'in_app',
  'webhook',
  'slack',
  'microsoft_teams',
  'whatsapp'
]);

// Notification priority levels
export const NotificationPriority = z.enum([
  'low',      // Info, updates, marketing
  'normal',   // Standard business notifications
  'high',     // Important updates, deadlines
  'urgent',   // Critical issues, immediate action required
  'critical'  // System alerts, security incidents
]);

// Notification categories for PROP.ie business
export const NotificationCategory = z.enum([
  // Property transaction events
  'property_reserved',
  'booking_deposit_due',
  'contract_exchange_reminder',
  'completion_approaching',
  'keys_ready',
  
  // Construction updates
  'construction_milestone',
  'construction_delay',
  'quality_inspection',
  'completion_date_update',
  
  // PROP Choice notifications
  'prop_choice_reminder',
  'customization_deadline',
  'installation_scheduled',
  'delivery_update',
  
  // Financial notifications
  'payment_due',
  'payment_received',
  'payment_failed',
  'htb_update',
  'mortgage_update',
  
  // Professional services
  'solicitor_update',
  'surveyor_appointment',
  'document_request',
  'legal_deadline',
  
  // System notifications
  'account_update',
  'security_alert',
  'maintenance_notice',
  'feature_announcement',
  
  // Marketing and engagement
  'newsletter',
  'property_recommendation',
  'market_update',
  'educational_content'
]);

// Delivery status tracking
export const DeliveryStatus = z.enum([
  'pending',
  'queued',
  'sent',
  'delivered',
  'read',
  'clicked',
  'failed',
  'bounced',
  'unsubscribed',
  'spam'
]);

// Notification template schema
export const NotificationTemplate = z.object({
  id: z.string(),
  name: z.string(),
  category: NotificationCategory,
  channels: z.array(NotificationChannel),
  priority: NotificationPriority,
  
  // Content templates for different channels
  content: z.object({
    email: z.object({
      subject: z.string(),
      htmlTemplate: z.string(),
      textTemplate: z.string(),
      fromName: z.string().optional(),
      fromEmail: z.string().email().optional()
    }).optional(),
    
    sms: z.object({
      message: z.string().max(160),
      unicode: z.boolean().default(false)
    }).optional(),
    
    push: z.object({
      title: z.string().max(50),
      body: z.string().max(100),
      icon: z.string().url().optional(),
      clickAction: z.string().url().optional(),
      sound: z.string().optional()
    }).optional(),
    
    inApp: z.object({
      title: z.string(),
      message: z.string(),
      actionText: z.string().optional(),
      actionUrl: z.string().url().optional(),
      icon: z.string().optional(),
      dismissible: z.boolean().default(true)
    }).optional(),
    
    webhook: z.object({
      payload: z.record(z.any()),
      headers: z.record(z.string()).optional(),
      method: z.enum(['POST', 'PUT', 'PATCH']).default('POST')
    }).optional()
  }),
  
  // Personalization variables
  variables: z.array(z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'date', 'currency', 'url']),
    required: z.boolean(),
    defaultValue: z.string().optional(),
    description: z.string().optional()
  })),
  
  // Targeting and segmentation
  targeting: z.object({
    userTypes: z.array(z.enum(['buyer', 'developer', 'agent', 'solicitor', 'admin'])),
    tenantTypes: z.array(z.string()).optional(),
    subscriptionTiers: z.array(z.string()).optional(),
    regions: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional()
  }),
  
  // Scheduling and delivery settings
  delivery: z.object({
    immediate: z.boolean().default(true),
    batchSize: z.number().default(1000),
    retryAttempts: z.number().default(3),
    retryDelay: z.number().default(300), // seconds
    preferredHours: z.object({
      start: z.number().min(0).max(23).default(9),
      end: z.number().min(0).max(23).default(18)
    }).optional(),
    timezone: z.string().default('Europe/Dublin'),
    respectDND: z.boolean().default(true), // Do Not Disturb
    throttleLimit: z.number().optional() // Max per hour
  }),
  
  // A/B testing
  abTesting: z.object({
    enabled: z.boolean().default(false),
    variants: z.array(z.object({
      id: z.string(),
      name: z.string(),
      percentage: z.number().min(0).max(100),
      content: z.record(z.any())
    })).optional(),
    winnerCriteria: z.enum(['open_rate', 'click_rate', 'conversion_rate']).optional()
  }).optional(),
  
  // Compliance and consent
  compliance: z.object({
    requiresConsent: z.boolean().default(false),
    consentType: z.enum(['marketing', 'transactional', 'legal']).optional(),
    gdprCompliant: z.boolean().default(true),
    optOutAvailable: z.boolean().default(true),
    dataRetentionDays: z.number().default(365)
  }),
  
  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string(),
  version: z.number().default(1),
  active: z.boolean().default(true),
  tags: z.array(z.string()).optional()
});

// Notification message schema
export const NotificationMessage = z.object({
  id: z.string().uuid(),
  templateId: z.string(),
  tenantId: z.string(),
  
  // Recipient information
  recipient: z.object({
    userId: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    deviceTokens: z.array(z.string()).optional(),
    preferredLanguage: z.string().default('en'),
    timezone: z.string().default('Europe/Dublin'),
    preferences: z.object({
      channels: z.array(NotificationChannel),
      frequency: z.enum(['immediate', 'hourly', 'daily', 'weekly']),
      quietHours: z.object({
        start: z.string(),
        end: z.string()
      }).optional()
    }).optional()
  }),
  
  // Message content
  content: z.record(z.any()), // Personalized content for each channel
  variables: z.record(z.any()), // Template variables
  
  // Delivery settings
  channels: z.array(NotificationChannel),
  priority: NotificationPriority,
  scheduledAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  
  // Tracking and analytics
  tracking: z.object({
    campaignId: z.string().optional(),
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    utmParams: z.record(z.string()).optional()
  }).optional(),
  
  // Status and delivery
  status: DeliveryStatus,
  deliveryAttempts: z.array(z.object({
    channel: NotificationChannel,
    attemptedAt: z.string().datetime(),
    status: DeliveryStatus,
    error: z.string().optional(),
    deliveryId: z.string().optional(),
    metadata: z.record(z.any()).optional()
  })),
  
  // Engagement tracking
  engagement: z.object({
    opened: z.boolean().default(false),
    openedAt: z.string().datetime().optional(),
    clicked: z.boolean().default(false),
    clickedAt: z.string().datetime().optional(),
    converted: z.boolean().default(false),
    convertedAt: z.string().datetime().optional(),
    unsubscribed: z.boolean().default(false),
    unsubscribedAt: z.string().datetime().optional()
  }).optional(),
  
  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  sentAt: z.string().datetime().optional(),
  deliveredAt: z.string().datetime().optional()
});

export type NotificationTemplate = z.infer<typeof NotificationTemplate>;
export type NotificationMessage = z.infer<typeof NotificationMessage>;

export class EnterpriseNotificationSystem {
  private static instance: EnterpriseNotificationSystem;
  private templates = new Map<string, NotificationTemplate>();
  private messageQueue: NotificationMessage[] = [];
  private processingInterval: NodeJS.Timeout | null = null;
  private analyticsBuffer: any[] = [];

  private constructor() {
    this.initializeDefaultTemplates();
    this.startMessageProcessor();
  }

  public static getInstance(): EnterpriseNotificationSystem {
    if (!EnterpriseNotificationSystem.instance) {
      EnterpriseNotificationSystem.instance = new EnterpriseNotificationSystem();
    }
    return EnterpriseNotificationSystem.instance;
  }

  /**
   * Send a notification using a template
   */
  public async sendNotification(params: {
    templateId: string;
    tenantId: string;
    recipientId: string;
    variables?: Record<string, any>;
    channels?: NotificationChannel[];
    priority?: NotificationPriority;
    scheduledAt?: Date;
    tracking?: any;
  }): Promise<string> {
    const template = this.templates.get(params.templateId);
    if (!template) {
      throw new Error(`Template not found: ${params.templateId}`);
    }

    // Get recipient information
    const recipient = await this.getRecipientInfo(params.recipientId, params.tenantId);
    if (!recipient) {
      throw new Error(`Recipient not found: ${params.recipientId}`);
    }

    // Check tenant permissions and quotas
    await this.checkTenantNotificationLimits(params.tenantId);

    // Generate personalized content
    const personalizedContent = await this.personalizeContent(template, params.variables || {}, recipient);

    // Create notification message
    const message: NotificationMessage = {
      id: this.generateMessageId(),
      templateId: params.templateId,
      tenantId: params.tenantId,
      recipient: {
        userId: params.recipientId,
        email: recipient.email,
        phone: recipient.phone,
        deviceTokens: recipient.deviceTokens,
        preferredLanguage: recipient.preferredLanguage || 'en',
        timezone: recipient.timezone || 'Europe/Dublin',
        preferences: recipient.notificationPreferences
      },
      content: personalizedContent,
      variables: params.variables || {},
      channels: params.channels || template.channels,
      priority: params.priority || template.priority,
      scheduledAt: params.scheduledAt?.toISOString(),
      tracking: params.tracking,
      status: 'pending',
      deliveryAttempts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate message
    const validatedMessage = NotificationMessage.parse(message);

    // Add to queue or send immediately based on priority
    if (params.priority === 'critical' || params.priority === 'urgent') {
      await this.processSingleMessage(validatedMessage);
    } else {
      this.messageQueue.push(validatedMessage);
    }

    // Log notification creation
    await enterpriseAuditLogger.logEvent({
      eventType: 'system_alert_triggered',
      riskLevel: params.priority === 'critical' ? 'high' : 'low',
      category: 'notification_system',
      actor: {
        id: 'notification_system',
        type: 'system'
      },
      target: {
        id: params.recipientId,
        type: 'user'
      },
      event: {
        action: 'send_notification',
        description: `Notification sent: ${template.name}`,
        outcome: 'success',
        metadata: {
          templateId: params.templateId,
          channels: params.channels || template.channels,
          priority: params.priority || template.priority,
          messageId: message.id
        }
      }
    });

    return message.id;
  }

  /**
   * Send bulk notifications to multiple recipients
   */
  public async sendBulkNotification(params: {
    templateId: string;
    tenantId: string;
    recipients: string[];
    variables?: Record<string, any>;
    segmentation?: {
      userTypes?: string[];
      tags?: string[];
      regions?: string[];
    };
    scheduledAt?: Date;
    batchSize?: number;
  }): Promise<{ messageIds: string[]; failed: string[] }> {
    const template = this.templates.get(params.templateId);
    if (!template) {
      throw new Error(`Template not found: ${params.templateId}`);
    }

    const messageIds: string[] = [];
    const failed: string[] = [];
    const batchSize = params.batchSize || template.delivery.batchSize;

    // Process recipients in batches
    for (let i = 0; i < params.recipients.length; i += batchSize) {
      const batch = params.recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipientId) => {
        try {
          // Apply segmentation filters
          if (params.segmentation && !(await this.matchesSegmentation(recipientId, params.segmentation))) {
            return null;
          }

          const messageId = await this.sendNotification({
            templateId: params.templateId,
            tenantId: params.tenantId,
            recipientId,
            variables: params.variables,
            scheduledAt: params.scheduledAt
          });

          return messageId;
        } catch (error) {
          failed.push(recipientId);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      messageIds.push(...batchResults.filter(id => id !== null) as string[]);

      // Rate limiting between batches
      if (template.delivery.throttleLimit && i + batchSize < params.recipients.length) {
        await this.delay(1000); // 1 second delay between batches
      }
    }

    // Log bulk notification
    await enterpriseAuditLogger.logEvent({
      eventType: 'system_alert_triggered',
      riskLevel: 'low',
      category: 'notification_system',
      event: {
        action: 'bulk_notification',
        description: `Bulk notification sent to ${params.recipients.length} recipients`,
        outcome: 'success',
        metadata: {
          templateId: params.templateId,
          totalRecipients: params.recipients.length,
          successful: messageIds.length,
          failed: failed.length
        }
      }
    });

    return { messageIds, failed };
  }

  /**
   * Create or update notification template
   */
  public async createTemplate(templateData: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<NotificationTemplate> {
    const templateId = this.generateTemplateId();
    
    const template: NotificationTemplate = {
      ...templateData,
      id: templateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    // Validate template
    const validatedTemplate = NotificationTemplate.parse(template);

    // Store template
    this.templates.set(templateId, validatedTemplate);

    // In production, persist to database
    await this.persistTemplate(validatedTemplate);

    return validatedTemplate;
  }

  /**
   * Get notification analytics and insights
   */
  public async getNotificationAnalytics(params: {
    tenantId: string;
    templateId?: string;
    startDate: Date;
    endDate: Date;
    channels?: NotificationChannel[];
    categories?: NotificationCategory[];
  }): Promise<any> {
    // In production, this would query analytics database
    const mockAnalytics = {
      summary: {
        totalSent: 15420,
        totalDelivered: 14987,
        totalOpened: 8245,
        totalClicked: 1876,
        totalConverted: 234,
        deliveryRate: 97.2,
        openRate: 55.0,
        clickRate: 12.5,
        conversionRate: 1.5,
        unsubscribeRate: 0.2
      },
      
      channelPerformance: {
        email: {
          sent: 10000,
          delivered: 9750,
          opened: 5500,
          clicked: 1200,
          deliveryRate: 97.5,
          openRate: 56.4,
          clickRate: 12.3
        },
        sms: {
          sent: 3000,
          delivered: 2980,
          opened: 2500,
          clicked: 450,
          deliveryRate: 99.3,
          openRate: 83.9,
          clickRate: 15.1
        },
        push_notification: {
          sent: 2420,
          delivered: 2257,
          opened: 1245,
          clicked: 226,
          deliveryRate: 93.3,
          openRate: 55.2,
          clickRate: 10.1
        }
      },
      
      templatePerformance: [
        {
          templateId: 'construction_milestone_update',
          name: 'Construction Milestone Update',
          sent: 2500,
          openRate: 72.4,
          clickRate: 18.7,
          category: 'construction_milestone'
        },
        {
          templateId: 'payment_reminder',
          name: 'Payment Reminder',
          sent: 1800,
          openRate: 65.2,
          clickRate: 22.1,
          category: 'payment_due'
        }
      ],
      
      timeSeriesData: {
        daily: [
          { date: '2025-06-01', sent: 450, delivered: 442, opened: 245, clicked: 45 },
          { date: '2025-06-02', sent: 520, delivered: 508, opened: 289, clicked: 67 }
          // ... more daily data
        ]
      },
      
      segmentAnalytics: {
        userTypes: {
          buyer: { openRate: 58.2, clickRate: 14.1 },
          developer: { openRate: 52.7, clickRate: 10.8 },
          agent: { openRate: 49.1, clickRate: 9.2 }
        },
        regions: {
          dublin: { openRate: 56.8, clickRate: 13.2 },
          cork: { openRate: 54.1, clickRate: 11.9 },
          galway: { openRate: 53.7, clickRate: 12.4 }
        }
      },
      
      engagementFunnel: {
        sent: 15420,
        delivered: 14987,
        opened: 8245,
        clicked: 1876,
        converted: 234,
        dropOffPoints: [
          { stage: 'delivery', rate: 2.8 },
          { stage: 'open', rate: 45.0 },
          { stage: 'click', rate: 77.3 },
          { stage: 'conversion', rate: 87.5 }
        ]
      }
    };

    return mockAnalytics;
  }

  /**
   * Process message queue
   */
  private startMessageProcessor(): void {
    this.processingInterval = setInterval(async () => {
      if (this.messageQueue.length === 0) return;

      const batchSize = 100;
      const batch = this.messageQueue.splice(0, batchSize);

      // Process batch in parallel
      const promises = batch.map(message => this.processSingleMessage(message));
      await Promise.allSettled(promises);

    }, 5000); // Process every 5 seconds
  }

  /**
   * Process a single notification message
   */
  private async processSingleMessage(message: NotificationMessage): Promise<void> {
    const template = this.templates.get(message.templateId);
    if (!template) return;

    // Check if message is scheduled for future delivery
    if (message.scheduledAt && new Date(message.scheduledAt) > new Date()) {
      this.messageQueue.push(message); // Re-queue for later
      return;
    }

    // Check if message has expired
    if (message.expiresAt && new Date(message.expiresAt) < new Date()) {
      message.status = 'failed';
      return;
    }

    // Send through each channel
    for (const channel of message.channels) {
      try {
        await this.sendThroughChannel(message, channel, template);
      } catch (error) {
        console.error(`Failed to send through ${channel}:`, error);
        message.deliveryAttempts.push({
          channel,
          attemptedAt: new Date().toISOString(),
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Update message status
    const successfulDeliveries = message.deliveryAttempts.filter(a => a.status === 'sent' || a.status === 'delivered');
    if (successfulDeliveries.length > 0) {
      message.status = 'sent';
      message.sentAt = new Date().toISOString();
    } else {
      message.status = 'failed';
    }

    message.updatedAt = new Date().toISOString();

    // Store delivery analytics
    this.analyticsBuffer.push({
      messageId: message.id,
      templateId: message.templateId,
      tenantId: message.tenantId,
      channels: message.channels,
      status: message.status,
      deliveryAttempts: message.deliveryAttempts,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send notification through specific channel
   */
  private async sendThroughChannel(
    message: NotificationMessage,
    channel: NotificationChannel,
    template: NotificationTemplate
  ): Promise<void> {
    const deliveryAttempt = {
      channel,
      attemptedAt: new Date().toISOString(),
      status: 'pending' as DeliveryStatus,
      deliveryId: this.generateDeliveryId()
    };

    try {
      switch (channel) {
        case 'email':
          await this.sendEmail(message, template);
          break;
        case 'sms':
          await this.sendSMS(message, template);
          break;
        case 'push_notification':
          await this.sendPushNotification(message, template);
          break;
        case 'in_app':
          await this.sendInAppNotification(message, template);
          break;
        case 'webhook':
          await this.sendWebhook(message, template);
          break;
        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }

      deliveryAttempt.status = 'sent';
    } catch (error) {
      deliveryAttempt.status = 'failed';
      deliveryAttempt.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      message.deliveryAttempts.push(deliveryAttempt);
    }
  }

  /**
   * Channel-specific delivery methods
   */
  private async sendEmail(message: NotificationMessage, template: NotificationTemplate): Promise<void> {
    if (!message.recipient.email || !template.content.email) {
      throw new Error('Email address or template not available');
    }

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`Sending email to ${message.recipient.email}: ${template.content.email.subject}`);
    
    // Simulate API call
    await this.delay(100);
  }

  private async sendSMS(message: NotificationMessage, template: NotificationTemplate): Promise<void> {
    if (!message.recipient.phone || !template.content.sms) {
      throw new Error('Phone number or SMS template not available');
    }

    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`Sending SMS to ${message.recipient.phone}: ${template.content.sms.message}`);
    
    // Simulate API call
    await this.delay(100);
  }

  private async sendPushNotification(message: NotificationMessage, template: NotificationTemplate): Promise<void> {
    if (!message.recipient.deviceTokens?.length || !template.content.push) {
      throw new Error('Device tokens or push template not available');
    }

    // In production, integrate with push service (FCM, APNS, etc.)
    console.log(`Sending push notification to ${message.recipient.deviceTokens.length} devices: ${template.content.push.title}`);
    
    // Simulate API call
    await this.delay(100);
  }

  private async sendInAppNotification(message: NotificationMessage, template: NotificationTemplate): Promise<void> {
    if (!template.content.inApp) {
      throw new Error('In-app template not available');
    }

    // In production, store in database for real-time display
    console.log(`Creating in-app notification for user ${message.recipient.userId}: ${template.content.inApp.title}`);
    
    // Simulate database write
    await this.delay(50);
  }

  private async sendWebhook(message: NotificationMessage, template: NotificationTemplate): Promise<void> {
    if (!template.content.webhook) {
      throw new Error('Webhook template not available');
    }

    // In production, make HTTP request to webhook URL
    console.log(`Sending webhook notification for message ${message.id}`);
    
    // Simulate HTTP request
    await this.delay(200);
  }

  /**
   * Helper methods
   */
  private async personalizeContent(
    template: NotificationTemplate,
    variables: Record<string, any>,
    recipient: any
  ): Promise<Record<string, any>> {
    const personalizedContent: Record<string, any> = {};

    // Process each channel's content
    Object.entries(template.content).forEach(([channel, content]) => {
      if (content) {
        personalizedContent[channel] = this.replaceVariables(content, {
          ...variables,
          firstName: recipient.firstName || 'there',
          lastName: recipient.lastName || '',
          email: recipient.email || '',
          phone: recipient.phone || ''
        });
      }
    });

    return personalizedContent;
  }

  private replaceVariables(template: any, variables: Record<string, any>): any {
    if (typeof template === 'string') {
      return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] || match;
      });
    } else if (typeof template === 'object' && template !== null) {
      const result: any = {};
      Object.entries(template).forEach(([key, value]) => {
        result[key] = this.replaceVariables(value, variables);
      });
      return result;
    }
    return template;
  }

  private initializeDefaultTemplates(): void {
    // Create default templates for PROP.ie business events
    const defaultTemplates = [
      {
        id: 'property_reserved',
        name: 'Property Reservation Confirmation',
        category: 'property_reserved' as NotificationCategory,
        channels: ['email', 'sms'] as NotificationChannel[],
        priority: 'high' as NotificationPriority,
        content: {
          email: {
            subject: 'Property Reserved Successfully - {{propertyName}}',
            htmlTemplate: '<h1>Congratulations!</h1><p>Your property reservation for {{propertyName}} has been confirmed.</p>',
            textTemplate: 'Congratulations! Your property reservation for {{propertyName}} has been confirmed.'
          },
          sms: {
            message: 'Property reserved: {{propertyName}}. Booking deposit due within 7 days. PROP.ie',
            unicode: false
          }
        },
        variables: [
          { name: 'propertyName', type: 'string' as const, required: true },
          { name: 'reservationAmount', type: 'currency' as const, required: true },
          { name: 'bookingDeadline', type: 'date' as const, required: true }
        ],
        targeting: {
          userTypes: ['buyer']
        },
        delivery: {
          immediate: true,
          batchSize: 1000,
          retryAttempts: 3,
          retryDelay: 300,
          timezone: 'Europe/Dublin',
          respectDND: true
        },
        compliance: {
          requiresConsent: false,
          consentType: 'transactional' as const,
          gdprCompliant: true,
          optOutAvailable: false,
          dataRetentionDays: 2555
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        version: 1,
        active: true
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template as NotificationTemplate);
    });
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTemplateId(): string {
    return `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDeliveryId(): string {
    return `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Placeholder methods that would be implemented in production
  private async getRecipientInfo(recipientId: string, tenantId: string): Promise<any> {
    return {
      email: 'user@example.com',
      phone: '+353871234567',
      firstName: 'John',
      lastName: 'Doe',
      preferredLanguage: 'en',
      timezone: 'Europe/Dublin',
      notificationPreferences: {
        channels: ['email', 'sms'],
        frequency: 'immediate'
      }
    };
  }

  private async checkTenantNotificationLimits(tenantId: string): Promise<void> {
    // Check tenant quotas and limits
    const tenant = await multiTenantManager.getTenant(tenantId);
    if (!tenant) throw new Error('Tenant not found');
    
    // Check notification quotas (would be implemented in production)
  }

  private async matchesSegmentation(recipientId: string, segmentation: any): Promise<boolean> {
    // Implement segmentation logic
    return true;
  }

  private async persistTemplate(template: NotificationTemplate): Promise<void> {
    // Persist to database in production
  }

  public async shutdown(): Promise<void> {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    
    // Process remaining messages
    while (this.messageQueue.length > 0) {
      const batch = this.messageQueue.splice(0, 100);
      const promises = batch.map(message => this.processSingleMessage(message));
      await Promise.allSettled(promises);
    }
  }
}

// Export singleton instance
export const notificationSystem = EnterpriseNotificationSystem.getInstance();

// Convenience functions for common PROP.ie notifications
export const propieNotifications = {
  propertyReserved: (tenantId: string, buyerId: string, propertyName: string, amount: number) =>
    notificationSystem.sendNotification({
      templateId: 'property_reserved',
      tenantId,
      recipientId: buyerId,
      variables: { propertyName, reservationAmount: amount, bookingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      priority: 'high'
    }),

  constructionUpdate: (tenantId: string, buyerId: string, milestone: string, progress: number) =>
    notificationSystem.sendNotification({
      templateId: 'construction_milestone',
      tenantId,
      recipientId: buyerId,
      variables: { milestone, progress },
      priority: 'normal'
    }),

  paymentReminder: (tenantId: string, buyerId: string, amount: number, dueDate: Date) =>
    notificationSystem.sendNotification({
      templateId: 'payment_due',
      tenantId,
      recipientId: buyerId,
      variables: { amount, dueDate },
      priority: 'high'
    })
};