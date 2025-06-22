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
import { realTimeServerManager } from '@/lib/realtime/realTimeServerManager';

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

      // Broadcast real-time event via WebSocket
      this.broadcastRealTimeEvent('message_sent', {
        messageId,
        conversationId,
        senderId,
        recipientId,
        messageType: messageData.messageType,
        message: {
          subject: messageData.subject,
          content: messageData.content,
          priority: messageData.priority,
          senderType,
          timestamp: new Date().toISOString()
        }
      });

      // Also trigger legacy event system
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

      // Broadcast real-time read receipt
      this.broadcastRealTimeEvent('message_read', {
        messageId,
        conversationId: message.conversationId,
        readBy: userId,
        readAt: new Date().toISOString(),
        senderId: message.senderId,
        recipientId: message.recipientId
      });

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

      // Broadcast real-time notification via WebSocket
      this.broadcastRealTimeEvent('notification_created', {
        notificationId,
        recipientId,
        recipientType,
        type,
        priority,
        notification: {
          title,
          message,
          actionRequired: notification.actionRequired,
          actions: notification.actions,
          timestamp: notification.createdAt.toISOString()
        }
      });

      // Also trigger legacy event system  
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

      // Broadcast real-time meeting creation
      this.broadcastRealTimeEvent('meeting_scheduled', {
        meetingId,
        organizerId,
        organizerType,
        participants: meeting.participants.map(p => ({ id: p.id, type: p.type, name: p.name })),
        meeting: {
          title: meeting.title,
          scheduledAt: meeting.scheduledAt.toISOString(),
          duration: meeting.duration,
          meetingType: meeting.meetingType,
          location: meeting.location
        }
      });

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

  /**
   * Broadcast real-time events via WebSocket server
   */
  private broadcastRealTimeEvent(eventType: string, data: any): void {
    try {
      // Trigger server-side event for WebSocket broadcasting
      realTimeServerManager.triggerEvent(eventType, data);

      // Determine recipient for targeted broadcasting
      if (data.recipientId) {
        realTimeServerManager.broadcastToUsers([data.recipientId], eventType, data);
      }

      // Broadcast to relevant professional roles based on event type
      if (eventType === 'message_sent' || eventType === 'notification_created') {
        const targetRoles = this.determineTargetRoles(data);
        if (targetRoles.length > 0) {
          realTimeServerManager.broadcastToRoles(targetRoles, eventType, data);
        }
      }

      // Broadcast meeting events to all participants
      if (eventType === 'meeting_scheduled' && data.participants) {
        const participantIds = data.participants.map((p: any) => p.id);
        realTimeServerManager.broadcastToUsers(participantIds, eventType, data);
      }

      console.log(`📡 Cross-professional communication event broadcasted: ${eventType}`);
    } catch (error) {
      console.error('Failed to broadcast real-time communication event:', error);
    }
  }

  /**
   * Determine target roles for broadcasting based on event data
   */
  private determineTargetRoles(data: any): string[] {
    const roles: string[] = [];

    // For agent-developer communications, include relevant roles
    if (data.recipientType === 'agent' || data.senderType === 'agent') {
      roles.push('ESTATE_AGENT', 'ESTATE_AGENT_MANAGER');
    }

    if (data.recipientType === 'developer' || data.senderType === 'developer') {
      roles.push('DEVELOPER', 'DEVELOPMENT_PROJECT_MANAGER');
    }

    // Include administration roles for oversight
    if (data.priority === 'urgent' || data.priority === 'high') {
      roles.push('ADMIN', 'PROJECT_MANAGER');
    }

    // Include relevant professional roles based on message context
    if (data.messageType === 'contract_discussion') {
      roles.push('BUYER_SOLICITOR', 'VENDOR_SOLICITOR');
    }

    if (data.messageType === 'viewing_request' || data.messageType === 'buyer_enquiry') {
      roles.push('BUYER_MORTGAGE_BROKER', 'STRUCTURAL_ENGINEER');
    }

    return roles;
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

  public markNotificationAsRead(notificationId: string, userId?: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;
    
    notification.read = true;

    // Broadcast real-time notification read status
    this.broadcastRealTimeEvent('notification_read', {
      notificationId,
      recipientId: notification.recipientId,
      recipientType: notification.recipientType,
      readBy: userId || notification.recipientId,
      readAt: new Date().toISOString(),
      notificationType: notification.type
    });
    
    return true;
  }

  /**
   * Set typing indicator for real-time conversation updates
   */
  public setTypingIndicator(
    conversationId: string, 
    userId: string, 
    userType: 'agent' | 'developer',
    isTyping: boolean
  ): void {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) return;

      // Update participant typing status
      const participant = conversation.participants.find(p => p.id === userId);
      if (participant) {
        participant.isTyping = isTyping;
      }

      // Broadcast typing indicator to other participants
      const otherParticipants = conversation.participants
        .filter(p => p.id !== userId)
        .map(p => p.id);

      if (otherParticipants.length > 0) {
        this.broadcastRealTimeEvent('typing_indicator', {
          conversationId,
          userId,
          userType,
          isTyping,
          userName: participant?.name || 'Unknown User',
          timestamp: new Date().toISOString()
        });

        realTimeServerManager.broadcastToUsers(otherParticipants, 'typing_indicator', {
          conversationId,
          userId,
          userType,
          isTyping,
          userName: participant?.name || 'Unknown User',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to set typing indicator:', error);
    }
  }

  /**
   * Update conversation status with real-time broadcasting
   */
  public updateConversationStatus(
    conversationId: string, 
    status: 'active' | 'archived' | 'closed',
    updatedBy: string
  ): boolean {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) return false;

      const oldStatus = conversation.status;
      conversation.status = status;
      conversation.lastActivity = new Date();

      // Broadcast conversation status update
      const participantIds = conversation.participants.map(p => p.id);
      
      this.broadcastRealTimeEvent('conversation_status_updated', {
        conversationId,
        oldStatus,
        newStatus: status,
        updatedBy,
        updatedAt: new Date().toISOString(),
        participants: conversation.participants.map(p => ({ id: p.id, type: p.type, name: p.name }))
      });

      realTimeServerManager.broadcastToUsers(participantIds, 'conversation_status_updated', {
        conversationId,
        oldStatus,
        newStatus: status,
        updatedBy,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Failed to update conversation status:', error);
      return false;
    }
  }

  /**
   * Get real-time conversation analytics
   */
  public getConversationAnalytics(timeRange: 'today' | 'week' | 'month' = 'week'): {
    totalConversations: number;
    activeConversations: number;
    messagesSent: number;
    averageResponseTime: number;
    topMessageTypes: Array<{ type: string; count: number }>;
  } {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeRange) {
      case 'today':
        cutoff.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setDate(now.getDate() - 30);
        break;
    }

    const relevantConversations = Array.from(this.conversations.values())
      .filter(conv => conv.lastActivity >= cutoff);

    const relevantMessages = Array.from(this.messages.values())
      .filter(msg => msg.timestamp >= cutoff);

    const messageTypeCount = relevantMessages.reduce((acc, msg) => {
      acc[msg.messageType] = (acc[msg.messageType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalConversations: relevantConversations.length,
      activeConversations: relevantConversations.filter(conv => conv.status === 'active').length,
      messagesSent: relevantMessages.length,
      averageResponseTime: this.calculateAverageResponseTime(relevantMessages),
      topMessageTypes: Object.entries(messageTypeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    };
  }

  private calculateAverageResponseTime(messages: DeveloperAgentMessage[]): number {
    // Simplified calculation - in production would consider conversation threading
    const conversationGroups = messages.reduce((acc, msg) => {
      if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
      acc[msg.conversationId].push(msg);
      return acc;
    }, {} as Record<string, DeveloperAgentMessage[]>);

    let totalResponseTime = 0;
    let responseCount = 0;

    Object.values(conversationGroups).forEach(conversationMessages => {
      const sorted = conversationMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      for (let i = 1; i < sorted.length; i++) {
        const responseTime = sorted[i].timestamp.getTime() - sorted[i-1].timestamp.getTime();
        totalResponseTime += responseTime;
        responseCount++;
      }
    });

    return responseCount > 0 ? Math.round(totalResponseTime / responseCount / 1000 / 60) : 0; // Return in minutes
  }
}

// Export singleton instance
export const agentDeveloperCommunicationService = AgentDeveloperCommunicationService.getInstance();