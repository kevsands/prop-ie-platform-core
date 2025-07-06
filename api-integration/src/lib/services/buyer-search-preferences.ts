/**
 * Buyer Search Preferences Service
 * Persistent search preferences with login/guest session tracking
 * Improves buyer experience with personalized property discovery
 */

import { EventEmitter } from 'events';

// Types for search preferences
export interface SearchPreferences {
  id: string;
  buyerId?: string; // null for guest sessions
  sessionId: string;
  
  // Basic search criteria
  location: {
    counties: string[];
    cities: string[];
    areas: string[];
    radius?: number; // km from specified point
    coordinates?: { lat: number; lng: number };
  };
  
  // Property criteria
  property: {
    types: ('apartment' | 'house' | 'townhouse' | 'duplex' | 'penthouse')[];
    bedrooms: {
      min: number;
      max: number;
    };
    bathrooms: {
      min: number;
      max: number;
    };
    minSize?: number; // sqm
    maxSize?: number; // sqm
    parking: boolean;
    garden: boolean;
    balcony: boolean;
    ensuite: boolean;
  };
  
  // Budget and financing
  budget: {
    min: number;
    max: number;
    currency: 'EUR';
    includeHTB: boolean;
    htbAmount?: number;
    depositAmount?: number;
    monthlyPaymentLimit?: number;
  };
  
  // Lifestyle preferences
  lifestyle: {
    nearPublicTransport: boolean;
    nearSchools: boolean;
    nearShopping: boolean;
    nearHealthcare: boolean;
    nearRecreation: boolean;
    maxCommuteTime?: number; // minutes
    commuteDestination?: string;
  };
  
  // Development preferences
  development: {
    newBuild: boolean;
    resale: boolean;
    offPlan: boolean;
    readyToMove: boolean;
    constructionStage: ('planning' | 'construction' | 'nearing_completion' | 'completed')[];
    builderPreferences: string[];
  };
  
  // Search behavior tracking
  behavior: {
    savedSearches: SavedSearch[];
    viewedProperties: string[];
    favoriteProperties: string[];
    enquiredProperties: string[];
    viewingHistory: PropertyViewing[];
    searchFrequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
    bestContactTime: 'morning' | 'afternoon' | 'evening' | 'weekend';
  };
  
  // Notification preferences
  notifications: {
    newMatches: boolean;
    priceChanges: boolean;
    similarProperties: boolean;
    marketUpdates: boolean;
    viewingReminders: boolean;
    method: ('email' | 'sms' | 'push' | 'whatsapp')[];
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  
  // Session metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastSearchAt: Date;
    searchCount: number;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    source: 'organic' | 'paid' | 'social' | 'email' | 'direct' | 'referral';
    campaign?: string;
  };
}

export interface SavedSearch {
  id: string;
  name: string;
  criteria: Partial<SearchPreferences>;
  frequency: 'immediate' | 'daily' | 'weekly';
  emailAlerts: boolean;
  createdAt: Date;
  lastRunAt?: Date;
  matchCount: number;
}

export interface PropertyViewing {
  propertyId: string;
  developmentId: string;
  viewedAt: Date;
  duration: number; // seconds
  source: 'search' | 'recommendation' | 'email' | 'agent';
  actions: ('saved' | 'enquired' | 'shared' | 'downloaded_brochure' | 'htb_calculated')[];
}

export interface GuestSession {
  sessionId: string;
  preferences: SearchPreferences;
  createdAt: Date;
  lastActiveAt: Date;
  conversionEvents: {
    type: 'registration' | 'enquiry' | 'viewing_booking' | 'favorites_saved';
    timestamp: Date;
    data: any;
  }[];
  fingerprint: string; // Device/browser fingerprint for session continuity
}

export interface PreferenceInsight {
  category: 'location' | 'property' | 'budget' | 'lifestyle' | 'behavior';
  insight: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  basedOn: string[];
}

class BuyerSearchPreferencesService extends EventEmitter {
  private preferences: Map<string, SearchPreferences> = new Map(); // buyerId/sessionId -> preferences
  private guestSessions: Map<string, GuestSession> = new Map(); // sessionId -> guest session
  private savedSearches: Map<string, SavedSearch[]> = new Map(); // buyerId -> saved searches
  
  constructor() {
    super();
    this.initializeDefaultPreferences();
    this.startSessionCleanup();
    this.startInsightGeneration();
  }

  /**
   * Create or update search preferences for authenticated user
   */
  async updateBuyerPreferences(
    buyerId: string,
    preferences: Partial<SearchPreferences>,
    sessionId?: string
  ): Promise<SearchPreferences> {
    try {
      const existingPrefs = this.preferences.get(buyerId);
      const now = new Date();
      
      // Merge guest session data if converting from guest to logged in
      let guestData = {};
      if (sessionId) {
        const guestSession = this.guestSessions.get(sessionId);
        if (guestSession) {
          guestData = {
            behavior: guestSession.preferences.behavior,
            metadata: {
              ...guestSession.preferences.metadata,
              searchCount: guestSession.preferences.metadata.searchCount
            }
          };
          // Mark guest session for conversion
          guestSession.conversionEvents.push({
            type: 'registration',
            timestamp: now,
            data: { convertedToBuyerId: buyerId }
          });
        }
      }
      
      const updatedPreferences: SearchPreferences = {
        id: existingPrefs?.id || `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        buyerId,
        sessionId: sessionId || existingPrefs?.sessionId || `session_${Date.now()}`,
        location: { ...existingPrefs?.location, ...preferences.location } || {
          counties: [],
          cities: [],
          areas: []
        },
        property: { ...existingPrefs?.property, ...preferences.property } || {
          types: ['apartment', 'house'],
          bedrooms: { min: 1, max: 4 },
          bathrooms: { min: 1, max: 3 },
          parking: false,
          garden: false,
          balcony: false,
          ensuite: false
        },
        budget: { ...existingPrefs?.budget, ...preferences.budget } || {
          min: 250000,
          max: 500000,
          currency: 'EUR',
          includeHTB: true
        },
        lifestyle: { ...existingPrefs?.lifestyle, ...preferences.lifestyle } || {
          nearPublicTransport: false,
          nearSchools: false,
          nearShopping: false,
          nearHealthcare: false,
          nearRecreation: false
        },
        development: { ...existingPrefs?.development, ...preferences.development } || {
          newBuild: true,
          resale: true,
          offPlan: false,
          readyToMove: true,
          constructionStage: ['completed', 'nearing_completion'],
          builderPreferences: []
        },
        behavior: { 
          ...existingPrefs?.behavior, 
          ...guestData.behavior,
          ...preferences.behavior 
        } || {
          savedSearches: [],
          viewedProperties: [],
          favoriteProperties: [],
          enquiredProperties: [],
          viewingHistory: [],
          searchFrequency: 'weekly',
          bestContactTime: 'evening'
        },
        notifications: { ...existingPrefs?.notifications, ...preferences.notifications } || {
          newMatches: true,
          priceChanges: true,
          similarProperties: true,
          marketUpdates: false,
          viewingReminders: true,
          method: ['email'],
          frequency: 'daily'
        },
        metadata: {
          createdAt: existingPrefs?.metadata.createdAt || now,
          updatedAt: now,
          lastSearchAt: existingPrefs?.metadata.lastSearchAt || now,
          searchCount: existingPrefs?.metadata.searchCount || 1,
          deviceType: preferences.metadata?.deviceType || 'desktop',
          browser: preferences.metadata?.browser || 'unknown',
          source: preferences.metadata?.source || 'direct',
          campaign: preferences.metadata?.campaign,
          ...guestData.metadata
        }
      };

      this.preferences.set(buyerId, updatedPreferences);
      
      // Emit preference update event
      this.emit('preferences-updated', updatedPreferences);
      
      // Generate insights based on new preferences
      await this.generatePreferenceInsights(buyerId);
      
      console.log(`🎯 Search preferences updated for buyer ${buyerId}`);
      
      return updatedPreferences;
      
    } catch (error) {
      console.error('Error updating buyer preferences:', error);
      throw error;
    }
  }

  /**
   * Track search preferences for guest users
   */
  async trackGuestSession(
    sessionId: string,
    preferences: Partial<SearchPreferences>,
    fingerprint: string
  ): Promise<GuestSession> {
    try {
      const existingSession = this.guestSessions.get(sessionId);
      const now = new Date();
      
      const session: GuestSession = {
        sessionId,
        preferences: {
          id: `guest_${sessionId}`,
          sessionId,
          location: { ...existingSession?.preferences.location, ...preferences.location } || {
            counties: [],
            cities: [],
            areas: []
          },
          property: { ...existingSession?.preferences.property, ...preferences.property } || {
            types: ['apartment', 'house'],
            bedrooms: { min: 1, max: 4 },
            bathrooms: { min: 1, max: 3 },
            parking: false,
            garden: false,
            balcony: false,
            ensuite: false
          },
          budget: { ...existingSession?.preferences.budget, ...preferences.budget } || {
            min: 250000,
            max: 500000,
            currency: 'EUR',
            includeHTB: true
          },
          lifestyle: { ...existingSession?.preferences.lifestyle, ...preferences.lifestyle } || {
            nearPublicTransport: false,
            nearSchools: false,
            nearShopping: false,
            nearHealthcare: false,
            nearRecreation: false
          },
          development: { ...existingSession?.preferences.development, ...preferences.development } || {
            newBuild: true,
            resale: true,
            offPlan: false,
            readyToMove: true,
            constructionStage: ['completed', 'nearing_completion'],
            builderPreferences: []
          },
          behavior: { 
            ...existingSession?.preferences.behavior, 
            ...preferences.behavior 
          } || {
            savedSearches: [],
            viewedProperties: [],
            favoriteProperties: [],
            enquiredProperties: [],
            viewingHistory: [],
            searchFrequency: 'weekly',
            bestContactTime: 'evening'
          },
          notifications: { ...existingSession?.preferences.notifications, ...preferences.notifications } || {
            newMatches: false, // Default off for guests
            priceChanges: false,
            similarProperties: false,
            marketUpdates: false,
            viewingReminders: false,
            method: ['email'],
            frequency: 'daily'
          },
          metadata: {
            createdAt: existingSession?.preferences.metadata.createdAt || now,
            updatedAt: now,
            lastSearchAt: now,
            searchCount: (existingSession?.preferences.metadata.searchCount || 0) + 1,
            deviceType: preferences.metadata?.deviceType || 'desktop',
            browser: preferences.metadata?.browser || 'unknown',
            source: preferences.metadata?.source || 'direct',
            campaign: preferences.metadata?.campaign
          }
        },
        createdAt: existingSession?.createdAt || now,
        lastActiveAt: now,
        conversionEvents: existingSession?.conversionEvents || [],
        fingerprint
      };

      this.guestSessions.set(sessionId, session);
      
      // Emit guest activity event
      this.emit('guest-activity', session);
      
      console.log(`👤 Guest session tracked: ${sessionId} (${session.preferences.metadata.searchCount} searches)`);
      
      return session;
      
    } catch (error) {
      console.error('Error tracking guest session:', error);
      throw error;
    }
  }

  /**
   * Get preferences for authenticated buyer
   */
  getBuyerPreferences(buyerId: string): SearchPreferences | null {
    return this.preferences.get(buyerId) || null;
  }

  /**
   * Get guest session data
   */
  getGuestSession(sessionId: string): GuestSession | null {
    return this.guestSessions.get(sessionId) || null;
  }

  /**
   * Record property viewing activity
   */
  async recordPropertyViewing(
    identifier: string, // buyerId or sessionId
    viewing: PropertyViewing,
    isGuest: boolean = false
  ): Promise<void> {
    try {
      if (isGuest) {
        const session = this.guestSessions.get(identifier);
        if (session) {
          session.preferences.behavior.viewingHistory.push(viewing);
          session.preferences.behavior.viewedProperties.push(viewing.propertyId);
          session.lastActiveAt = new Date();
          
          this.emit('guest-property-viewed', { sessionId: identifier, viewing });
        }
      } else {
        const preferences = this.preferences.get(identifier);
        if (preferences) {
          preferences.behavior.viewingHistory.push(viewing);
          preferences.behavior.viewedProperties.push(viewing.propertyId);
          preferences.metadata.lastSearchAt = new Date();
          
          this.emit('property-viewed', { buyerId: identifier, viewing });
        }
      }
      
      console.log(`👁️ Property viewing recorded: ${viewing.propertyId} by ${identifier}`);
      
    } catch (error) {
      console.error('Error recording property viewing:', error);
    }
  }

  /**
   * Create saved search for buyer
   */
  async createSavedSearch(
    buyerId: string,
    search: Omit<SavedSearch, 'id' | 'createdAt' | 'matchCount'>
  ): Promise<SavedSearch> {
    try {
      const savedSearch: SavedSearch = {
        id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...search,
        createdAt: new Date(),
        matchCount: 0
      };

      const existingSaves = this.savedSearches.get(buyerId) || [];
      existingSaves.push(savedSearch);
      this.savedSearches.set(buyerId, existingSaves);

      // Update buyer's behavior tracking
      const preferences = this.preferences.get(buyerId);
      if (preferences) {
        preferences.behavior.savedSearches.push(savedSearch);
      }

      this.emit('saved-search-created', { buyerId, savedSearch });
      
      console.log(`💾 Saved search created: "${search.name}" for buyer ${buyerId}`);
      
      return savedSearch;
      
    } catch (error) {
      console.error('Error creating saved search:', error);
      throw error;
    }
  }

  /**
   * Get property recommendations based on preferences
   */
  async getPersonalizedRecommendations(
    identifier: string,
    isGuest: boolean = false,
    limit: number = 10
  ): Promise<{
    properties: any[];
    reasoning: string[];
    confidence: number;
  }> {
    try {
      const preferences = isGuest 
        ? this.guestSessions.get(identifier)?.preferences
        : this.preferences.get(identifier);
      
      if (!preferences) {
        return { properties: [], reasoning: [], confidence: 0 };
      }

      // Mock property recommendations based on preferences
      const mockProperties = this.generateRecommendations(preferences, limit);
      
      const reasoning = [
        `Based on your budget range of ${this.formatCurrency(preferences.budget.min)} - ${this.formatCurrency(preferences.budget.max)}`,
        `Matching your preference for ${preferences.property.types.join(' or ')} properties`,
        `Considering your ${preferences.property.bedrooms.min}-${preferences.property.bedrooms.max} bedroom requirement`,
        `Including locations: ${preferences.location.counties.join(', ') || 'All areas'}`
      ];
      
      if (preferences.behavior.viewedProperties.length > 0) {
        reasoning.push(`Similar to ${preferences.behavior.viewedProperties.length} properties you've viewed`);
      }

      const confidence = this.calculateRecommendationConfidence(preferences);
      
      console.log(`🎯 Generated ${mockProperties.length} recommendations for ${identifier} (${Math.round(confidence)}% confidence)`);
      
      return {
        properties: mockProperties,
        reasoning,
        confidence
      };
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return { properties: [], reasoning: [], confidence: 0 };
    }
  }

  /**
   * Generate preference insights and recommendations
   */
  async generatePreferenceInsights(buyerId: string): Promise<PreferenceInsight[]> {
    try {
      const preferences = this.preferences.get(buyerId);
      if (!preferences) return [];

      const insights: PreferenceInsight[] = [];

      // Budget optimization insight
      if (preferences.budget.includeHTB && !preferences.budget.htbAmount) {
        insights.push({
          category: 'budget',
          insight: 'You may qualify for Help to Buy support up to €30,000',
          confidence: 85,
          impact: 'high',
          recommendation: 'Complete HTB pre-qualification to increase your buying power',
          basedOn: ['HTB eligibility criteria', 'Budget range']
        });
      }

      // Location optimization
      if (preferences.location.counties.length === 0) {
        insights.push({
          category: 'location',
          insight: 'Expanding your location search could increase available options by 340%',
          confidence: 92,
          impact: 'high',
          recommendation: 'Consider nearby counties like Meath or Kildare for better value',
          basedOn: ['Market analysis', 'Price comparison data']
        });
      }

      // Behavior insights
      if (preferences.behavior.viewedProperties.length > 20 && preferences.behavior.enquiredProperties.length === 0) {
        insights.push({
          category: 'behavior',
          insight: 'You\'ve viewed many properties but haven\'t made enquiries yet',
          confidence: 95,
          impact: 'medium',
          recommendation: 'Consider booking viewings for your top 3 favorites',
          basedOn: ['Viewing history', 'Engagement patterns']
        });
      }

      // Property type insights
      if (preferences.property.types.length === 1 && preferences.property.types[0] === 'apartment') {
        insights.push({
          category: 'property',
          insight: 'Townhouses in your area offer 15% more space for similar budget',
          confidence: 78,
          impact: 'medium',
          recommendation: 'Explore townhouse options for better value',
          basedOn: ['Market comparison', 'Space analysis']
        });
      }

      this.emit('insights-generated', { buyerId, insights });
      
      return insights;
      
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  /**
   * Get search analytics for buyer
   */
  getSearchAnalytics(buyerId: string): {
    totalSearches: number;
    propertiesViewed: number;
    favoritesSaved: number;
    averageViewingTime: number;
    topLocations: string[];
    budgetTrend: { date: Date; min: number; max: number }[];
  } | null {
    const preferences = this.preferences.get(buyerId);
    if (!preferences) return null;

    return {
      totalSearches: preferences.metadata.searchCount,
      propertiesViewed: preferences.behavior.viewedProperties.length,
      favoritesSaved: preferences.behavior.favoriteProperties.length,
      averageViewingTime: preferences.behavior.viewingHistory.reduce((sum, v) => sum + v.duration, 0) / preferences.behavior.viewingHistory.length || 0,
      topLocations: preferences.location.counties.slice(0, 3),
      budgetTrend: [
        { date: preferences.metadata.createdAt, min: preferences.budget.min, max: preferences.budget.max }
      ]
    };
  }

  // Private helper methods

  private generateRecommendations(preferences: SearchPreferences, limit: number): any[] {
    // Mock property generation based on preferences
    const mockProperties = [];
    
    for (let i = 0; i < limit; i++) {
      const propertyType = preferences.property.types[Math.floor(Math.random() * preferences.property.types.length)];
      const bedrooms = Math.max(preferences.property.bedrooms.min, Math.min(preferences.property.bedrooms.max, Math.floor(Math.random() * 4) + 1));
      const price = preferences.budget.min + (Math.random() * (preferences.budget.max - preferences.budget.min));
      
      mockProperties.push({
        id: `prop_${i}`,
        title: `${bedrooms} Bed ${propertyType}`,
        price,
        location: preferences.location.counties[0] || 'Dublin',
        bedrooms,
        bathrooms: Math.min(bedrooms, Math.floor(Math.random() * 3) + 1),
        type: propertyType,
        matchScore: Math.floor(Math.random() * 20) + 80, // 80-100% match
        features: {
          parking: preferences.property.parking || Math.random() > 0.5,
          garden: preferences.property.garden || Math.random() > 0.6,
          balcony: preferences.property.balcony || Math.random() > 0.4
        }
      });
    }
    
    return mockProperties.sort((a, b) => b.matchScore - a.matchScore);
  }

  private calculateRecommendationConfidence(preferences: SearchPreferences): number {
    let confidence = 50; // Base confidence
    
    // Increase confidence based on data richness
    if (preferences.location.counties.length > 0) confidence += 15;
    if (preferences.budget.min && preferences.budget.max) confidence += 15;
    if (preferences.property.types.length > 0) confidence += 10;
    if (preferences.behavior.viewedProperties.length > 5) confidence += 10;
    if (preferences.behavior.viewingHistory.length > 3) confidence += 10;
    
    return Math.min(100, confidence);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  private initializeDefaultPreferences(): void {
    // Initialize with some sample buyer preferences for demonstration
    console.log('🎯 Search preferences service initialized');
  }

  private startSessionCleanup(): void {
    // Clean up old guest sessions every hour
    setInterval(() => {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      
      for (const [sessionId, session] of this.guestSessions.entries()) {
        if (session.lastActiveAt < cutoff) {
          this.guestSessions.delete(sessionId);
        }
      }
    }, 60 * 60 * 1000);
    
    console.log('🧹 Session cleanup scheduler started');
  }

  private startInsightGeneration(): void {
    // Generate insights for active buyers every 6 hours
    setInterval(() => {
      for (const buyerId of this.preferences.keys()) {
        this.generatePreferenceInsights(buyerId);
      }
    }, 6 * 60 * 60 * 1000);
    
    console.log('💡 Insight generation scheduler started');
  }
}

// Export global instance
export const buyerSearchPreferencesService = new BuyerSearchPreferencesService();
export default BuyerSearchPreferencesService;