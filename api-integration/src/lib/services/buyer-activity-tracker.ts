/**
 * Buyer Activity Tracking Service
 * Real-time tracking of buyer behavior and automated agent notifications
 * Lead scoring and routing system for optimal sales conversion
 */

import { EventEmitter } from 'events';

// Types for buyer activity tracking
export interface BuyerActivity {
  id: string;
  buyerId: string;
  sessionId: string;
  timestamp: Date;
  activityType: 'page_view' | 'property_view' | 'calculator_use' | 'brochure_download' | 
                'virtual_tour' | 'viewing_request' | 'interest_expression' | 'contact_form' | 
                'mortgage_inquiry' | 'htb_check' | 'repeat_visit' | 'time_spent' | 'scroll_depth';
  
  // Activity-specific data
  data: {
    propertyId?: string;
    developmentId?: string;
    unitId?: string;
    page?: string;
    duration?: number; // seconds
    scrollDepth?: number; // percentage
    calculatorResult?: any;
    contactInfo?: any;
    referrer?: string;
    device?: string;
    location?: string;
  };
  
  // Engagement metrics
  engagement: {
    intensity: 'low' | 'medium' | 'high' | 'very_high';
    timeSpent: number;
    pageDepth: number;
    interactionCount: number;
  };
  
  // Lead scoring factors
  leadScore: number; // 0-100
  buyerIntent: 'browsing' | 'researching' | 'comparing' | 'ready_to_buy';
  urgency: 'low' | 'medium' | 'high' | 'immediate';
}

export interface BuyerProfile {
  id: string;
  sessionId: string;
  firstVisit: Date;
  lastActivity: Date;
  totalSessions: number;
  totalTimeSpent: number;
  activities: BuyerActivity[];
  
  // Calculated metrics
  engagementScore: number; // 0-100
  leadScore: number; // 0-100
  buyerStage: 'awareness' | 'consideration' | 'decision' | 'purchase';
  
  // Interests and preferences
  interests: {
    developmentIds: string[];
    unitTypes: string[];
    priceRange: { min: number; max: number };
    bedrooms: number[];
    features: string[];
  };
  
  // Contact information (if provided)
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    communicationPreference?: 'email' | 'phone' | 'whatsapp';
  };
  
  // Agent assignment
  assignedAgent?: string;
  lastAgentContact?: Date;
  
  // HTB eligibility (if checked)
  htbStatus?: {
    eligible: boolean;
    amount: number;
    lastChecked: Date;
  };
}

export interface AgentNotification {
  id: string;
  agentId: string;
  type: 'new_lead' | 'hot_lead' | 'viewing_request' | 'calculator_use' | 'return_visitor' | 'urgent_follow_up';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  buyerProfile: BuyerProfile;
  suggestedActions: string[];
  timestamp: Date;
  read: boolean;
  actedUpon: boolean;
}

export interface LeadScoringRules {
  activities: { [key: string]: number };
  timeSpentMultiplier: number;
  returnVisitorBonus: number;
  contactInfoBonus: number;
  calculatorUseBonus: number;
  viewingRequestBonus: number;
  urgencyFactors: { [key: string]: number };
}

class BuyerActivityTracker extends EventEmitter {
  private buyerProfiles: Map<string, BuyerProfile> = new Map();
  private activeNotifications: Map<string, AgentNotification[]> = new Map();
  
  // Lead scoring configuration
  private scoringRules: LeadScoringRules = {
    activities: {
      'page_view': 1,
      'property_view': 5,
      'calculator_use': 15,
      'brochure_download': 10,
      'virtual_tour': 12,
      'viewing_request': 25,
      'interest_expression': 20,
      'contact_form': 30,
      'mortgage_inquiry': 35,
      'htb_check': 15,
      'repeat_visit': 8,
      'time_spent': 0.1, // per minute
      'scroll_depth': 0.05 // per percentage point
    },
    timeSpentMultiplier: 0.1,
    returnVisitorBonus: 10,
    contactInfoBonus: 25,
    calculatorUseBonus: 15,
    viewingRequestBonus: 30,
    urgencyFactors: {
      'multiple_property_views': 1.2,
      'repeated_calculator_use': 1.3,
      'weekend_activity': 1.1,
      'evening_activity': 1.1,
      'mobile_user': 1.05
    }
  };

  constructor() {
    super();
    this.initializeAgentRouting();
  }

  /**
   * Track buyer activity and update profile
   */
  async trackActivity(activity: Omit<BuyerActivity, 'id' | 'leadScore'>): Promise<boolean> {
    try {
      const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Calculate lead score for this activity
      const leadScore = this.calculateActivityScore(activity);
      
      const fullActivity: BuyerActivity = {
        ...activity,
        id: activityId,
        leadScore
      };

      // Get or create buyer profile
      let profile = this.buyerProfiles.get(activity.buyerId);
      if (!profile) {
        profile = this.createNewBuyerProfile(activity);
      }

      // Update profile with new activity
      profile = this.updateBuyerProfile(profile, fullActivity);
      this.buyerProfiles.set(activity.buyerId, profile);

      // Emit activity event
      this.emit('buyer-activity', fullActivity, profile);

      // Check if this triggers agent notifications
      await this.evaluateAgentNotifications(profile, fullActivity);

      // Update buyer interests based on activity
      this.updateBuyerInterests(profile, fullActivity);

      console.log(`📊 Tracked activity: ${activity.activityType} for buyer ${activity.buyerId} (Score: +${leadScore})`);
      
      return true;
    } catch (error) {
      console.error('Error tracking buyer activity:', error);
      return false;
    }
  }

  /**
   * Get buyer profile with calculated metrics
   */
  getBuyerProfile(buyerId: string): BuyerProfile | null {
    return this.buyerProfiles.get(buyerId) || null;
  }

  /**
   * Get high-value leads for agent prioritization
   */
  getHighValueLeads(agentId?: string, limit: number = 10): BuyerProfile[] {
    const profiles = Array.from(this.buyerProfiles.values());
    
    return profiles
      .filter(profile => {
        // Filter by agent if specified
        if (agentId && profile.assignedAgent && profile.assignedAgent !== agentId) {
          return false;
        }
        
        // Only include profiles with reasonable engagement
        return profile.leadScore >= 30 || 
               profile.activities.length >= 3 || 
               profile.totalTimeSpent >= 300; // 5+ minutes
      })
      .sort((a, b) => {
        // Sort by lead score, then by recent activity
        if (b.leadScore !== a.leadScore) {
          return b.leadScore - a.leadScore;
        }
        return b.lastActivity.getTime() - a.lastActivity.getTime();
      })
      .slice(0, limit);
  }

  /**
   * Get agent notifications
   */
  getAgentNotifications(agentId: string, unreadOnly: boolean = false): AgentNotification[] {
    const notifications = this.activeNotifications.get(agentId) || [];
    
    if (unreadOnly) {
      return notifications.filter(n => !n.read);
    }
    
    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Mark notification as read/acted upon
   */
  markNotificationActedUpon(notificationId: string, agentId: string): boolean {
    const notifications = this.activeNotifications.get(agentId) || [];
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      notification.actedUpon = true;
      return true;
    }
    
    return false;
  }

  /**
   * Assign buyer to agent
   */
  assignBuyerToAgent(buyerId: string, agentId: string): boolean {
    const profile = this.buyerProfiles.get(buyerId);
    if (!profile) return false;
    
    profile.assignedAgent = agentId;
    profile.lastAgentContact = new Date();
    
    this.buyerProfiles.set(buyerId, profile);
    
    // Emit assignment event
    this.emit('buyer-assigned', { buyerId, agentId, profile });
    
    return true;
  }

  /**
   * Create new buyer profile
   */
  private createNewBuyerProfile(activity: Omit<BuyerActivity, 'id' | 'leadScore'>): BuyerProfile {
    const now = new Date();
    
    return {
      id: activity.buyerId,
      sessionId: activity.sessionId,
      firstVisit: now,
      lastActivity: now,
      totalSessions: 1,
      totalTimeSpent: 0,
      activities: [],
      engagementScore: 0,
      leadScore: 0,
      buyerStage: 'awareness',
      interests: {
        developmentIds: [],
        unitTypes: [],
        priceRange: { min: 0, max: 0 },
        bedrooms: [],
        features: []
      }
    };
  }

  /**
   * Update buyer profile with new activity
   */
  private updateBuyerProfile(profile: BuyerProfile, activity: BuyerActivity): BuyerProfile {
    // Add activity to profile
    profile.activities.push(activity);
    profile.lastActivity = activity.timestamp;
    
    // Update time spent
    if (activity.engagement.timeSpent) {
      profile.totalTimeSpent += activity.engagement.timeSpent;
    }
    
    // Recalculate scores
    profile.leadScore = this.calculateTotalLeadScore(profile);
    profile.engagementScore = this.calculateEngagementScore(profile);
    profile.buyerStage = this.determineBuyerStage(profile);
    
    // Update contact info if provided
    if (activity.data.contactInfo) {
      profile.contactInfo = { ...profile.contactInfo, ...activity.data.contactInfo };
    }
    
    return profile;
  }

  /**
   * Calculate lead score for a single activity
   */
  private calculateActivityScore(activity: Omit<BuyerActivity, 'id' | 'leadScore'>): number {
    let score = this.scoringRules.activities[activity.activityType] || 0;
    
    // Time spent bonus
    if (activity.engagement.timeSpent) {
      score += activity.engagement.timeSpent * this.scoringRules.timeSpentMultiplier;
    }
    
    // Interaction intensity bonus
    switch (activity.engagement.intensity) {
      case 'very_high':
        score *= 1.5;
        break;
      case 'high':
        score *= 1.3;
        break;
      case 'medium':
        score *= 1.1;
        break;
    }
    
    // Specific activity bonuses
    if (activity.data.scrollDepth && activity.data.scrollDepth > 80) {
      score += 5; // Deep engagement bonus
    }
    
    if (activity.data.calculatorResult) {
      score += this.scoringRules.calculatorUseBonus;
    }
    
    return Math.round(score);
  }

  /**
   * Calculate total lead score for buyer profile
   */
  private calculateTotalLeadScore(profile: BuyerProfile): number {
    let totalScore = profile.activities.reduce((sum, activity) => sum + activity.leadScore, 0);
    
    // Return visitor bonus
    if (profile.totalSessions > 1) {
      totalScore += this.scoringRules.returnVisitorBonus * (profile.totalSessions - 1);
    }
    
    // Contact info bonus
    if (profile.contactInfo?.email) {
      totalScore += this.scoringRules.contactInfoBonus;
    }
    
    // Recent activity bonus (activity within last 24 hours)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivities = profile.activities.filter(a => a.timestamp > dayAgo);
    if (recentActivities.length >= 3) {
      totalScore *= 1.2; // 20% bonus for recent high activity
    }
    
    return Math.min(100, Math.round(totalScore));
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(profile: BuyerProfile): number {
    const totalActivities = profile.activities.length;
    const avgTimePerSession = profile.totalTimeSpent / profile.totalSessions;
    const uniquePages = new Set(profile.activities.map(a => a.data.page)).size;
    
    let score = 0;
    
    // Activity quantity (0-30 points)
    score += Math.min(30, totalActivities * 2);
    
    // Time engagement (0-30 points)
    score += Math.min(30, avgTimePerSession / 20); // 20 seconds = 1 point
    
    // Page depth (0-20 points)
    score += Math.min(20, uniquePages * 2);
    
    // Return visits (0-20 points)
    score += Math.min(20, profile.totalSessions * 3);
    
    return Math.min(100, Math.round(score));
  }

  /**
   * Determine buyer stage based on activities
   */
  private determineBuyerStage(profile: BuyerProfile): BuyerProfile['buyerStage'] {
    const activityTypes = profile.activities.map(a => a.activityType);
    
    // Purchase stage indicators
    if (activityTypes.includes('viewing_request') || 
        activityTypes.includes('mortgage_inquiry') ||
        activityTypes.includes('contact_form')) {
      return 'purchase';
    }
    
    // Decision stage indicators
    if (activityTypes.includes('calculator_use') || 
        activityTypes.includes('htb_check') ||
        activityTypes.filter(t => t === 'property_view').length >= 3) {
      return 'decision';
    }
    
    // Consideration stage indicators
    if (activityTypes.includes('brochure_download') || 
        activityTypes.includes('virtual_tour') ||
        profile.totalTimeSpent > 600) { // 10+ minutes
      return 'consideration';
    }
    
    return 'awareness';
  }

  /**
   * Evaluate if agent notifications should be triggered
   */
  private async evaluateAgentNotifications(profile: BuyerProfile, activity: BuyerActivity): Promise<void> {
    const notifications: Omit<AgentNotification, 'id'>[] = [];
    
    // High-value lead notification (lead score > 70)
    if (profile.leadScore >= 70 && !profile.assignedAgent) {
      notifications.push({
        agentId: 'auto-assign', // Will be routed to available agent
        type: 'hot_lead',
        priority: 'urgent',
        title: 'Hot Lead Alert!',
        message: `Buyer ${profile.id} has high purchase intent (Score: ${profile.leadScore})`,
        buyerProfile: profile,
        suggestedActions: [
          'Call within 15 minutes',
          'Send personalized property recommendations',
          'Offer viewing scheduling'
        ],
        timestamp: new Date(),
        read: false,
        actedUpon: false
      });
    }
    
    // Viewing request notification
    if (activity.activityType === 'viewing_request') {
      notifications.push({
        agentId: profile.assignedAgent || 'auto-assign',
        type: 'viewing_request',
        priority: 'high',
        title: 'Viewing Request',
        message: `${profile.contactInfo?.name || 'Buyer'} requested viewing for ${activity.data.unitId}`,
        buyerProfile: profile,
        suggestedActions: [
          'Confirm viewing within 2 hours',
          'Prepare property information pack',
          'Schedule follow-up call'
        ],
        timestamp: new Date(),
        read: false,
        actedUpon: false
      });
    }
    
    // Calculator use with qualification
    if (activity.activityType === 'calculator_use' && activity.data.calculatorResult?.qualified) {
      notifications.push({
        agentId: profile.assignedAgent || 'auto-assign',
        type: 'calculator_use',
        priority: 'high',
        title: 'HTB Qualified Buyer',
        message: `Buyer qualified for €${activity.data.calculatorResult.htbAmount} HTB support`,
        buyerProfile: profile,
        suggestedActions: [
          'Contact within 1 hour',
          'Discuss HTB process',
          'Schedule mortgage consultation'
        ],
        timestamp: new Date(),
        read: false,
        actedUpon: false
      });
    }
    
    // Return visitor with increased engagement
    if (activity.activityType === 'repeat_visit' && profile.totalSessions >= 3) {
      notifications.push({
        agentId: profile.assignedAgent || 'auto-assign',
        type: 'return_visitor',
        priority: 'medium',
        title: 'Engaged Return Visitor',
        message: `Buyer returned ${profile.totalSessions} times, showing strong interest`,
        buyerProfile: profile,
        suggestedActions: [
          'Send follow-up email',
          'Offer exclusive viewing',
          'Provide market updates'
        ],
        timestamp: new Date(),
        read: false,
        actedUpon: false
      });
    }
    
    // Process notifications
    for (const notification of notifications) {
      await this.createAgentNotification(notification);
    }
  }

  /**
   * Create agent notification
   */
  private async createAgentNotification(notification: Omit<AgentNotification, 'id'>): Promise<void> {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullNotification: AgentNotification = {
      ...notification,
      id: notificationId
    };
    
    // Route to specific agent or auto-assign
    let targetAgentId = notification.agentId;
    if (targetAgentId === 'auto-assign') {
      targetAgentId = await this.autoAssignAgent(notification.buyerProfile);
    }
    
    // Add to agent's notifications
    if (!this.activeNotifications.has(targetAgentId)) {
      this.activeNotifications.set(targetAgentId, []);
    }
    
    this.activeNotifications.get(targetAgentId)!.push(fullNotification);
    
    // Emit notification event
    this.emit('agent-notification', fullNotification);
    
    console.log(`🔔 Agent notification sent: ${notification.type} to ${targetAgentId}`);
  }

  /**
   * Auto-assign agent based on availability and specialization
   */
  private async autoAssignAgent(profile: BuyerProfile): Promise<string> {
    // Simple round-robin assignment for now
    // In production, would consider agent availability, specialization, workload
    const availableAgents = ['agent-1', 'agent-2', 'agent-3'];
    const randomIndex = Math.floor(Math.random() * availableAgents.length);
    const selectedAgent = availableAgents[randomIndex];
    
    // Assign buyer to agent
    this.assignBuyerToAgent(profile.id, selectedAgent);
    
    return selectedAgent;
  }

  /**
   * Update buyer interests based on activity
   */
  private updateBuyerInterests(profile: BuyerProfile, activity: BuyerActivity): void {
    // Track development interests
    if (activity.data.developmentId && !profile.interests.developmentIds.includes(activity.data.developmentId)) {
      profile.interests.developmentIds.push(activity.data.developmentId);
    }
    
    // Track unit type interests from calculator use
    if (activity.data.calculatorResult) {
      const priceRange = activity.data.calculatorResult.priceRange;
      if (priceRange) {
        profile.interests.priceRange = priceRange;
      }
    }
  }

  /**
   * Initialize agent routing system
   */
  private initializeAgentRouting(): void {
    // Set up periodic cleanup of old notifications
    setInterval(() => {
      this.cleanupOldNotifications();
    }, 60 * 60 * 1000); // Every hour
    
    console.log('🤖 Buyer activity tracker initialized with agent routing');
  }

  /**
   * Clean up old notifications
   */
  private cleanupOldNotifications(): void {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    for (const [agentId, notifications] of this.activeNotifications.entries()) {
      const filtered = notifications.filter(n => n.timestamp > cutoff);
      this.activeNotifications.set(agentId, filtered);
    }
  }
}

// Export global instance
export const buyerActivityTracker = new BuyerActivityTracker();
export default BuyerActivityTracker;