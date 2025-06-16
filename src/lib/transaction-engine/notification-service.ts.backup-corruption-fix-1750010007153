/**
 * Notification Service
 * Handles all multi-channel notifications across the platform
 */

import { EventEmitter } from 'events';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { transactionEngine, TransactionEvent, Stakeholder } from './index';

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
  WHATSAPP = 'WHATSAPP'
}

export enum NotificationType {
  // Transaction notifications
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  STATE_CHANGED = 'STATE_CHANGED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  DOCUMENT_SIGNED = 'DOCUMENT_SIGNED',

  // KYC notifications
  KYC_REQUIRED = 'KYC_REQUIRED',
  KYC_VERIFIED = 'KYC_VERIFIED',
  KYC_FAILED = 'KYC_FAILED',

  // HTB notifications
  HTB_SUBMITTED = 'HTB_SUBMITTED',
  HTB_APPROVED = 'HTB_APPROVED',
  HTB_REJECTED = 'HTB_REJECTED',

  // Snagging notifications
  INSPECTION_SCHEDULED = 'INSPECTION_SCHEDULED',
  SNAG_REPORTED = 'SNAG_REPORTED',
  SNAG_RESOLVED = 'SNAG_RESOLVED',
  SNAGLIST_COMPLETED = 'SNAGLIST_COMPLETED',

  // Handover notifications
  HANDOVER_SCHEDULED = 'HANDOVER_SCHEDULED',
  HANDOVER_REMINDER = 'HANDOVER_REMINDER',
  HANDOVER_COMPLETED = 'HANDOVER_COMPLETED',

  // General notifications
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT'
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string;
  content: string;
  variables: string[];
  active: boolean;
}

export interface NotificationRequest {
  recipientId: string;
  type: NotificationType;
  channel: NotificationChannel;
  data: Record<string, any>\n  );
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  scheduledFor?: Date;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string;
  content: string;
  data: Record<string, any>\n  );
  sentAt?: Date;
  readAt?: Date;
  clickedAt?: Date;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  error?: string;
  metadata?: Record<string, any>\n  );
}

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
});

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export class NotificationService extends EventEmitter {
  private static instance: NotificationService;
  private notificationQueue: NotificationRequest[] = [];

  private constructor() {
    super();
    this.subscribeToTransactionEvents();
    this.startNotificationProcessor();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Send notification
   */
  async sendNotification(request: NotificationRequest): Promise<Notification> {
    // Get recipient details
    const recipient = await prisma.user.findUnique({
      where: { id: request.recipientId }
    });

    if (!recipient) {
      throw new Error('Recipient not found');
    }

    // Get template
    const template = await this.getTemplate(request.type, request.channel);
    if (!template) {
      throw new Error('Template not found');
    }

    // Render content
    const content = this.renderTemplate(template.content, request.data);
    const subject = template.subject 
      ? this.renderTemplate(template.subject, request.data)
      : undefined;

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        recipientId: request.recipientId,
        type: request.type,
        channel: request.channel,
        subject,
        content,
        data: request.data,
        status: 'PENDING',
        scheduledFor: request.scheduledFor
      }
    });

    // Add to queue
    this.notificationQueue.push({
      ...request,
      notificationId: notification.id
    } as any);

    return notification as any;
  }

  /**
   * Send email notification
   */
  private async sendEmail(
    recipient: string,
    subject: string,
    content: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject,
        html: content,
        text: this.stripHtml(content)
      };

      await emailTransporter.sendMail(mailOptions);

      this.emit('email_sent', { recipient, subject });
    } catch (error: any) {
      this.emit('email_failed', { recipient, error: error.message });
      throw error;
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(
    recipient: string,
    content: string
  ): Promise<void> {
    if (!twilioClient) {
      throw new Error('Twilio not configured');
    }

    try {
      await twilioClient.messages.create({
        body: content,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: recipient
      });

      this.emit('sms_sent', { recipient });
    } catch (error: any) {
      this.emit('sms_failed', { recipient, error: error.message });
      throw error;
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> {
    // Get user's push tokens
    const pushTokens = await prisma.pushToken.findMany({
      where: { userId }
    });

    for (const token of pushTokens) {
      try {
        // Send via FCM or APNS
        // Mock implementation

        this.emit('push_sent', { userId, token: token.token });
      } catch (error: any) {
        this.emit('push_failed', { userId, error: error.message });
      }
    }
  }

  /**
   * Send in-app notification
   */
  private async sendInAppNotification(
    userId: string,
    type: NotificationType,
    content: string,
    data?: Record<string, any>
  ): Promise<void> {
    await prisma.inAppNotification.create({
      data: {
        userId,
        type,
        content,
        data,
        createdAt: new Date()
      }
    });

    // Emit event for real-time updates
    this.emit('in_app_notification', { userId, type, content });
  }

  /**
   * Process notification queue
   */
  private async startNotificationProcessor(): Promise<void> {
    setInterval(async () => {
      if (this.notificationQueue.length === 0) return;

      const batch = this.notificationQueue.splice(010);

      for (const request of batch) {
        try {
          await this.processNotification(request);
        } catch (error) {

        }
      }
    }, 1000); // Process every second
  }

  /**
   * Process individual notification
   */
  private async processNotification(request: NotificationRequest): Promise<void> {
    const notification = await prisma.notification.findUnique({
      where: { id: (request as any).notificationId }
    });

    if (!notification) return;

    // Check if scheduled for later
    if (notification.scheduledFor && notification.scheduledFor> new Date()) {
      this.notificationQueue.push(request); // Re-queue
      return;
    }

    try {
      const recipient = await prisma.user.findUnique({
        where: { id: notification.recipientId }
      });

      if (!recipient) {
        throw new Error('Recipient not found');
      }

      switch (notification.channel) {
        case NotificationChannel.EMAIL:
          await this.sendEmail(
            recipient.email,
            notification.subject || '',
            notification.content,
            notification.data as any
          );
          break;

        case NotificationChannel.SMS:
          await this.sendSMS(
            recipient.phoneNumber || '',
            notification.content
          );
          break;

        case NotificationChannel.PUSH:
          await this.sendPushNotification(
            recipient.id,
            notification.subject || 'Prop.ie',
            notification.content,
            notification.data as any
          );
          break;

        case NotificationChannel.IN_APP:
          await this.sendInAppNotification(
            recipient.id,
            notification.type,
            notification.content,
            notification.data as any
          );
          break;
      }

      // Update notification status
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      });

    } catch (error: any) {
      // Update notification with error
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'FAILED',
          error: error.message
        }
      });
    }
  }

  /**
   * Subscribe to transaction events
   */
  private subscribeToTransactionEvents(): void {
    transactionEngine.on(TransactionEvent.STATE_CHANGED, async (data: any) => {
      await this.handleTransactionStateChange(data);
    });

    transactionEngine.on(TransactionEvent.PAYMENT_RECEIVED, async (data: any) => {
      await this.handlePaymentReceived(data);
    });

    transactionEngine.on(TransactionEvent.DOCUMENT_UPLOADED, async (data: any) => {
      await this.handleDocumentUploaded(data);
    });
  }

  /**
   * Handle transaction state changes
   */
  private async handleTransactionStateChange(data: any): Promise<void> {
    const transaction = await transactionEngine.getTransaction(data.transactionId);
    if (!transaction) return;

    const stakeholders = transaction.stakeholders;

    for (const stakeholder of stakeholders) {
      const preferences = stakeholder.notificationPreferences;

      if (preferences.some(p => p.events.includes(TransactionEvent.STATE_CHANGED))) {
        await this.sendNotification({
          recipientId: stakeholder.id,
          type: NotificationType.STATE_CHANGED,
          channel: NotificationChannel.EMAIL,
          data: {
            transactionId: transaction.id,
            oldState: data.oldState,
            newState: data.newState,
            propertyId: transaction.propertyId
          }
        });
      }
    }
  }

  /**
   * Handle payment received
   */
  private async handlePaymentReceived(data: any): Promise<void> {
    const transaction = await transactionEngine.getTransaction(data.transactionId);
    if (!transaction) return;

    // Notify buyer
    await this.sendNotification({
      recipientId: transaction.buyerId,
      type: NotificationType.PAYMENT_RECEIVED,
      channel: NotificationChannel.EMAIL,
      data: {
        transactionId: transaction.id,
        payment: data.payment,
        propertyId: transaction.propertyId
      }
    });
  }

  /**
   * Handle document uploaded
   */
  private async handleDocumentUploaded(data: any): Promise<void> {
    const transaction = await transactionEngine.getTransaction(data.transactionId);
    if (!transaction) return;

    // Notify relevant stakeholders
    const stakeholders = transaction.stakeholders.filter(s => 
      s.permissions.includes('VIEW_DOCUMENTS')
    );

    for (const stakeholder of stakeholders) {
      await this.sendNotification({
        recipientId: stakeholder.id,
        type: NotificationType.DOCUMENT_UPLOADED,
        channel: NotificationChannel.IN_APP,
        data: {
          transactionId: transaction.id,
          document: data.document,
          propertyId: transaction.propertyId
        }
      });
    }
  }

  /**
   * Get template
   */
  private async getTemplate(
    type: NotificationType,
    channel: NotificationChannel
  ): Promise<NotificationTemplate | null> {
    // Check database first
    const template = await prisma.notificationTemplate.findFirst({
      where: {
        type,
        channel,
        active: true
      }
    });

    if (template) {
      return template as any;
    }

    // Return default template
    return this.getDefaultTemplate(typechannel);
  }

  /**
   * Get default template
   */
  private getDefaultTemplate(
    type: NotificationType,
    channel: NotificationChannel
  ): NotificationTemplate {
    const templates: Record<string, NotificationTemplate> = {
      [`${NotificationType.STATE_CHANGED}_${NotificationChannel.EMAIL}`]: {
        id: 'default-state-changed-email',
        type: NotificationType.STATE_CHANGED,
        channel: NotificationChannel.EMAIL,
        subject: 'Transaction Status Update - {propertyId}',
        content: `
          <h2>Transaction Status Update</h2>
          <p>Your transaction status has changed from {oldState} to {newState}.</p>
          <p>Property: {propertyId}</p>
          <p>Transaction ID: {transactionId}</p>
          <p>Please log in to your dashboard for more details.</p>
        `,
        variables: ['propertyId', 'transactionId', 'oldState', 'newState'],
        active: true
      },
      [`${NotificationType.PAYMENT_RECEIVED}_${NotificationChannel.EMAIL}`]: {
        id: 'default-payment-received-email',
        type: NotificationType.PAYMENT_RECEIVED,
        channel: NotificationChannel.EMAIL,
        subject: 'Payment Received - {payment.type}',
        content: `
          <h2>Payment Received</h2>
          <p>We have received your {payment.type} payment of €{payment.amount}.</p>
          <p>Transaction ID: {transactionId}</p>
          <p>Payment Reference: {payment.reference}</p>
          <p>Thank you for your payment.</p>
        `,
        variables: ['transactionId', 'payment.type', 'payment.amount', 'payment.reference'],
        active: true
      }
    };

    const key = `${type}_${channel}`;
    return templates[key] || {
      id: `default-${type}-${channel}`,
      type,
      channel,
      subject: 'Notification from Prop.ie',
      content: 'You have a new notification. Please log in to view details.',
      variables: [],
      active: true
    };
  }

  /**
   * Render template
   */
  private renderTemplate(template: string, data: Record<string, any>): string {
    let content = template;

    // Replace variables
    const variables = template.match(/{([^}]+)}/g) || [];

    for (const variable of variables) {
      const key = variable.replace(/[{}]/g, '');
      const value = this.getNestedValue(datakey);
      content = content.replace(variable, value || '');
    }

    return content;
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((ok: any) => o?.[k], obj);
  }

  /**
   * Strip HTML from content
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(
    request: NotificationRequest,
    scheduledFor: Date
  ): Promise<Notification> {
    return this.sendNotification({
      ...request,
      scheduledFor
    });
  }

  /**
   * Cancel scheduled notification
   */
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'CANCELLED' }
    });
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    filters?: {
      channel?: NotificationChannel;
      type?: NotificationType;
      status?: string;
      limit?: number;
    }
  ): Promise<Notification[]> {
    const where: any = { recipientId: userId };

    if (filters?.channel) {
      where.channel = filters.channel;
    }
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.status) {
      where.status = filters.status;
    }

    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50
    }) as any;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        readAt: new Date(),
        status: 'READ'
      }
    });
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    userId: string,
    preferences: {
      channel: NotificationChannel;
      enabled: boolean;
      events: TransactionEvent[];
    }[]
  ): Promise<void> {
    await prisma.notificationPreference.deleteMany({
      where: { userId }
    });

    await prisma.notificationPreference.createMany({
      data: preferences.map(p => ({
        userId,
        ...p
      }))
    });
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(
    recipientIds: string[],
    type: NotificationType,
    channel: NotificationChannel,
    data: Record<string, any>
  ): Promise<void> {
    const requests = recipientIds.map(recipientId => ({
      recipientId,
      type,
      channel,
      data
    }));

    for (const request of requests) {
      await this.sendNotification(request);
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();