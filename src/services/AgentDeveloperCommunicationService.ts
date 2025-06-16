/**
 * Agent-Developer Communication Service
 * Real-time communication bridge between estate agents and developers
 * 
 * @fileoverview Communication service for agent-developer collaboration
 * @version 1.0.0
 * @author Property Development Platform Team
 */

import { 
  BuyerInformation, 
  Unit, 
  ProjectStateUpdate 
} from '@/types/project';
import { agentBuyerIntegrationService, AgentProfile } from '@/services/AgentBuyerIntegrationService';
import { projectDataService } from '@/services/ProjectDataService';

// Enhanced interfaces for agent-developer communication
export interface DeveloperAgentMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'agent' | 'developer';
  recipientId: string;
  recipientType: 'agent' | 'developer';
  subject: string;
  content: string;
  messageType: MessageType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'sent' | 'delivered' | 'read' | 'replied';
  timestamp: Date;
  attachments?: MessageAttachment[];
  metadata: MessageMetadata;
  context?: MessageContext;
  tags: string[];
}

export interface MessageConversation {
  id: string;
  participants: ConversationParticipant[];
  subject: string;
  projectId?: string;
  unitId?: string;
  buyerId?: string;
  conversationType: ConversationType;
  status: 'active' | 'archived' | 'closed';
  lastActivity: Date;
  messageCount: number;
  unreadCount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  context: ConversationContext;
}

export interface ConversationParticipant {
  id: string;
  type: 'agent' | 'developer';
  name: string;
  email: string;
  phone?: string;
  role: string;
  lastRead?: Date;
  isTyping?: boolean;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface MessageMetadata {
  readReceipts: ReadReceipt[];
  deliveryStatus: DeliveryStatus;
  source: 'web' | 'mobile' | 'api' | 'automated';
  deviceInfo?: string;
  location?: string;
  replyToMessageId?: string;
  forwardedFrom?: string;
}

export interface MessageContext {
  propertyId?: string;
  propertyName?: string;
  buyerName?: string;
  agentCommission?: number;
  viewingScheduled?: Date;
  contractStage?: string;
  urgencyReason?: string;
}

export interface ConversationContext {
  projectName: string;
  unitDetails?: {
    unitNumber: string;
    type: string;
    price: number;
    status: string;
  };
  buyerDetails?: {
    name: string;
    email: string;
    stage: string;
    agentId: string;
  };
  salesMetrics?: {
    totalEnquiries: number;
    viewingsScheduled: number;
    offersReceived: number;
    saleValue?: number;
  };
}

export interface ReadReceipt {
  userId: string;
  readAt: Date;
  deviceType: string;
}

export interface DeliveryStatus {
  sent: Date;
  delivered?: Date;
  failed?: boolean;
  failureReason?: string;
  retryCount: number;
}

export interface AgentDeveloperNotification {
  id: string;
  type: NotificationType;
  recipientId: string;
  recipientType: 'agent' | 'developer';
  title: string;
  message: string;
  data: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionRequired: boolean;
  actions?: NotificationAction[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  url?: string;
}

export interface AgentDeveloperMeeting {
  id: string;
  title: string;
  description: string;
  participants: ConversationParticipant[];
  scheduledAt: Date;
  duration: number; // minutes
  location: string;
  meetingType: 'in_person' | 'video_call' | 'phone_call';
  agenda: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  actionItems?: ActionItem[];
  recordingUrl?: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export type MessageType = 
  | 'general_enquiry'
  | 'buyer_enquiry'
  | 'viewing_request'
  | 'offer_submission'
  | 'contract_discussion'
  | 'marketing_material'
  | 'commission_discussion'
  | 'project_update'
  | 'urgent_matter'
  | 'meeting_request';

export type ConversationType = 
  | 'general'
  | 'buyer_specific'
  | 'project_specific'
  | 'marketing_campaign'
  | 'commission_review'
  | 'escalation';

export type NotificationType = 
  | 'new_message'
  | 'new_buyer_enquiry'
  | 'viewing_scheduled'
  | 'offer_received'
  | 'contract_signed'
  | 'commission_earned'
  | 'project_update'
  | 'meeting_reminder'
  | 'urgent_alert';

// =============================================================================
// AGENT-DEVELOPER COMMUNICATION SERVICE CLASS
// =============================================================================

export class AgentDeveloperCommunicationService {
  private static instance: AgentDeveloperCommunicationService;
  private conversations: Map<string, MessageConversation> = new Map();
  private messages: Map<string, DeveloperAgentMessage> = new Map();
  private notifications: Map<string, AgentDeveloperNotification> = new Map();
  private meetings: Map<string, AgentDeveloperMeeting> = new Map();
  private eventListeners: Map<string, Array<(event: any) => void>> = new Map();

  private constructor() {
    // Singleton pattern for enterprise data consistency
    this.initializeSampleData();
  }

  public static getInstance(): AgentDeveloperCommunicationService {
    if (!AgentDeveloperCommunicationService.instance) {
      AgentDeveloperCommunicationService.instance = new AgentDeveloperCommunicationService();
    }
    return AgentDeveloperCommunicationService.instance;
  }

  // =============================================================================
  // MESSAGING SYSTEM
  // =============================================================================

  /**
   * Send message from agent to developer or vice versa
   */
  public async sendMessage(
    senderId: string,
    senderType: 'agent' | 'developer',
    recipientId: string,
    recipientType: 'agent' | 'developer',
    messageData: {
      subject: string;
      content: string;
      messageType: MessageType;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      conversationId?: string;
      context?: MessageContext;
      attachments?: Omit<MessageAttachment, 'id' | 'uploadedAt' | 'uploadedBy'>[];
    }
  ): Promise<DeveloperAgentMessage> {
    try {
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Find or create conversation
      let conversationId = messageData.conversationId;
      if (!conversationId) {
        const conversation = await this.createConversation(
          senderId,
          senderType,
          recipientId,
          recipientType,
          messageData.subject,
          messageData.messageType
        );
        conversationId = conversation.id;
      }

      const message: DeveloperAgentMessage = {
        id: messageId,
        conversationId,
        senderId,
        senderType,
        recipientId,
        recipientType,
        subject: messageData.subject,
        content: messageData.content,
        messageType: messageData.messageType,
        priority: messageData.priority || 'medium',
        status: 'sent',
        timestamp: new Date(),
        attachments: messageData.attachments?.map(att => ({
          ...att,
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          uploadedAt: new Date(),
          uploadedBy: senderId
        })),
        metadata: {
          readReceipts: [],
          deliveryStatus: {
            sent: new Date(),
            retryCount: 0
          },
          source: 'web'
        },
        context: messageData.context,
        tags: this.generateMessageTags(messageData.messageType, messageData.context)
      };

      this.messages.set(messageId, message);

      // Update conversation
      const conversation = this.conversations.get(conversationId);
      if (conversation) {
        conversation.lastActivity = new Date();
        conversation.messageCount += 1;
        conversation.unreadCount += 1;
      }

      // Create notification for recipient
      await this.createNotification(
        recipientId,
        recipientType,
        'new_message',
        `New message from ${senderType}`,
        `${messageData.subject} - ${messageData.content.substring(0, 100)}...`,
        { messageId, conversationId }
      );

      // Broadcast real-time event
      this.broadcastEvent('message_sent', {
        messageId,
        conversationId,
        senderId,
        recipientId,
        messageType: messageData.messageType
      });

      return message;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new conversation between agent and developer
   */
  public async createConversation(
    initiatorId: string,
    initiatorType: 'agent' | 'developer',
    recipientId: string,
    recipientType: 'agent' | 'developer',
    subject: string,
    conversationType: MessageType,
    context?: {
      projectId?: string;
      unitId?: string;
      buyerId?: string;
    }
  ): Promise<MessageConversation> {
    try {
      const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Get participant details
      const initiator = await this.getParticipantDetails(initiatorId, initiatorType);
      const recipient = await this.getParticipantDetails(recipientId, recipientType);

      // Build conversation context
      const conversationContext = await this.buildConversationContext(context);

      const conversation: MessageConversation = {
        id: conversationId,
        participants: [initiator, recipient],
        subject,
        projectId: context?.projectId,
        unitId: context?.unitId,
        buyerId: context?.buyerId,
        conversationType: this.mapMessageTypeToConversationType(conversationType),
        status: 'active',
        lastActivity: new Date(),
        messageCount: 0,
        unreadCount: 0,
        priority: 'medium',
        tags: [],
        context: conversationContext
      };

      this.conversations.set(conversationId, conversation);

      return conversation;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  public async markMessageAsRead(messageId: string, userId: string): Promise<boolean> {
    try {
      const message = this.messages.get(messageId);
      if (!message) return false;

      // Add read receipt
      message.metadata.readReceipts.push({
        userId,
        readAt: new Date(),
        deviceType: 'web'
      });

      message.status = 'read';

      // Update conversation unread count
      const conversation = this.conversations.get(message.conversationId);
      if (conversation) {
        conversation.unreadCount = Math.max(0, conversation.unreadCount - 1);
      }

      return true;

    } catch (error) {
      return false;
    }
  }

  // =============================================================================
  // NOTIFICATION SYSTEM
  // =============================================================================

  /**
   * Create notification for agent or developer
   */
  public async createNotification(
    recipientId: string,
    recipientType: 'agent' | 'developer',
    type: NotificationType,
    title: string,
    message: string,
    data: any,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<AgentDeveloperNotification> {
    try {
      const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const notification: AgentDeveloperNotification = {
        id: notificationId,
        type,
        recipientId,
        recipientType,
        title,
        message,
        data,
        priority,
        read: false,
        actionRequired: this.requiresAction(type),
        actions: this.generateNotificationActions(type, data),
        createdAt: new Date(),
        expiresAt: this.calculateExpiryDate(type)
      };

      this.notifications.set(notificationId, notification);

      // Broadcast real-time notification
      this.broadcastEvent('notification_created', {
        notificationId,
        recipientId,
        recipientType,
        type,
        priority
      });

      return notification;

    } catch (error) {
      throw error;
    }
  }

  // =============================================================================
  // MEETING SYSTEM
  // =============================================================================

  /**
   * Schedule meeting between agent and developer
   */
  public async scheduleMeeting(
    organizerId: string,
    organizerType: 'agent' | 'developer',
    participants: string[],
    meetingData: {
      title: string;
      description: string;
      scheduledAt: Date;
      duration: number;
      location: string;
      meetingType: 'in_person' | 'video_call' | 'phone_call';
      agenda: string[];
    }
  ): Promise<AgentDeveloperMeeting> {
    try {
      const meetingId = `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const meeting: AgentDeveloperMeeting = {
        id: meetingId,
        title: meetingData.title,
        description: meetingData.description,
        participants: await Promise.all(
          participants.map(async (pid) => {
            // Determine participant type based on ID pattern or lookup
            const type = pid.startsWith('agent-') ? 'agent' : 'developer';
            return this.getParticipantDetails(pid, type);
          })
        ),
        scheduledAt: meetingData.scheduledAt,
        duration: meetingData.duration,
        location: meetingData.location,
        meetingType: meetingData.meetingType,
        agenda: meetingData.agenda,
        status: 'scheduled',
        actionItems: []
      };

      this.meetings.set(meetingId, meeting);

      // Create notifications for all participants
      for (const participant of meeting.participants) {
        await this.createNotification(
          participant.id,
          participant.type,
          'meeting_reminder',
          `Meeting scheduled: ${meeting.title}`,
          `Meeting with ${organizerType} on ${meeting.scheduledAt.toLocaleDateString()}`,
          { meetingId }
        );
      }

      return meeting;

    } catch (error) {
      throw error;
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private async getParticipantDetails(
    participantId: string,
    type: 'agent' | 'developer'
  ): Promise<ConversationParticipant> {
    if (type === 'agent') {
      const agent = agentBuyerIntegrationService.getAgentById(participantId);
      return {
        id: participantId,
        type: 'agent',
        name: agent?.name || 'Unknown Agent',
        email: agent?.email || '',
        phone: agent?.phone,
        role: 'Estate Agent'
      };
    } else {
      // In production, this would query developer data
      return {
        id: participantId,
        type: 'developer',
        name: 'Cairn Homes',
        email: 'info@cairnhomes.com',
        phone: '+353 1 234 5678',
        role: 'Developer'
      };
    }
  }

  private async buildConversationContext(context?: {
    projectId?: string;
    unitId?: string;
    buyerId?: string;
  }): Promise<ConversationContext> {
    const defaultContext: ConversationContext = {
      projectName: 'Fitzgerald Gardens',
      salesMetrics: {
        totalEnquiries: 0,
        viewingsScheduled: 0,
        offersReceived: 0
      }
    };

    if (context?.projectId) {
      const project = projectDataService.getProjectById(context.projectId);
      if (project) {
        defaultContext.projectName = project.name;
      }
    }

    if (context?.unitId) {
      const unit = projectDataService.getUnitById('fitzgerald-gardens', context.unitId);
      if (unit) {
        defaultContext.unitDetails = {
          unitNumber: unit.number,
          type: unit.type,
          price: unit.pricing.currentPrice,
          status: unit.status
        };
      }
    }

    return defaultContext;
  }

  private generateMessageTags(messageType: MessageType, context?: MessageContext): string[] {
    const tags: string[] = [messageType];
    
    if (context?.propertyId) tags.push('property-specific');
    if (context?.buyerName) tags.push('buyer-related');
    if (context?.agentCommission) tags.push('commission');
    if (context?.urgencyReason) tags.push('urgent');
    
    return tags;
  }

  private mapMessageTypeToConversationType(messageType: MessageType): ConversationType {
    const typeMap: Record<MessageType, ConversationType> = {
      'general_enquiry': 'general',
      'buyer_enquiry': 'buyer_specific',
      'viewing_request': 'buyer_specific',
      'offer_submission': 'buyer_specific',
      'contract_discussion': 'buyer_specific',
      'marketing_material': 'marketing_campaign',
      'commission_discussion': 'commission_review',
      'project_update': 'project_specific',
      'urgent_matter': 'escalation',
      'meeting_request': 'general'
    };
    
    return typeMap[messageType] || 'general';
  }

  private requiresAction(type: NotificationType): boolean {
    const actionRequiredTypes: NotificationType[] = [
      'new_buyer_enquiry',
      'viewing_scheduled',
      'offer_received',
      'meeting_reminder',
      'urgent_alert'
    ];
    
    return actionRequiredTypes.includes(type);
  }

  private generateNotificationActions(type: NotificationType, data: any): NotificationAction[] {
    const actions: NotificationAction[] = [];
    
    switch (type) {
      case 'new_message':
        actions.push({
          id: 'reply',
          label: 'Reply',
          action: 'reply_message',
          style: 'primary',
          url: `/messages/${data.conversationId}`
        });
        break;
      case 'new_buyer_enquiry':
        actions.push(
          {
            id: 'respond',
            label: 'Respond',
            action: 'respond_enquiry',
            style: 'primary'
          },
          {
            id: 'schedule',
            label: 'Schedule Viewing',
            action: 'schedule_viewing',
            style: 'secondary'
          }
        );
        break;
    }
    
    return actions;
  }

  private calculateExpiryDate(type: NotificationType): Date | undefined {
    const expiryDays: Record<NotificationType, number | undefined> = {
      'new_message': undefined,
      'new_buyer_enquiry': 7,
      'viewing_scheduled': 1,
      'offer_received': 3,
      'contract_signed': undefined,
      'commission_earned': undefined,
      'project_update': 30,
      'meeting_reminder': 1,
      'urgent_alert': 1
    };
    
    const days = expiryDays[type];
    return days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : undefined;
  }

  private broadcastEvent(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        // Event listener error handling
      }
    });
  }

  private initializeSampleData(): void {
    // Initialize some sample conversations for demonstration
    // Service initialization complete
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  public getConversationsByParticipant(
    participantId: string,
    participantType: 'agent' | 'developer'
  ): MessageConversation[] {
    return Array.from(this.conversations.values()).filter(conv => 
      conv.participants.some(p => p.id === participantId && p.type === participantType)
    );
  }

  public getMessagesByConversation(conversationId: string): DeveloperAgentMessage[] {
    return Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  public getNotificationsByRecipient(
    recipientId: string,
    recipientType: 'agent' | 'developer'
  ): AgentDeveloperNotification[] {
    return Array.from(this.notifications.values()).filter(notif => 
      notif.recipientId === recipientId && notif.recipientType === recipientType
    );
  }

  public getMeetingsByParticipant(
    participantId: string,
    participantType: 'agent' | 'developer'
  ): AgentDeveloperMeeting[] {
    return Array.from(this.meetings.values()).filter(meeting => 
      meeting.participants.some(p => p.id === participantId && p.type === participantType)
    );
  }

  public addEventListener(eventType: string, callback: (event: any) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  public markNotificationAsRead(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;
    
    notification.read = true;
    return true;
  }
}

// Export singleton instance
export const agentDeveloperCommunicationService = AgentDeveloperCommunicationService.getInstance();