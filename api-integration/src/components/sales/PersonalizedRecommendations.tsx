'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Star,
  Sparkles,
  Target,
  MapPin,
  Bed,
  Bath,
  Euro,
  Calendar,
  Eye,
  ArrowRight,
  ThumbsUp,
  Clock,
  Zap,
  Award,
  Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PersonalizedRecommendationsProps {
  buyerId?: string;
  buyerProfile?: any;
  currentPropertyId?: string;
  developmentId?: string;
  maxRecommendations?: number;
  onRecommendationClick?: (propertyId: string, reason: string) => void;
  onInteractionTracked?: (interaction: any) => void;
  className?: string;
}

interface PropertyRecommendation {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  developmentName: string;
  unitNumber?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SALE_AGREED';
  
  // Recommendation metadata
  matchScore: number; // 0-100
  reasons: string[];
  priority: 'high' | 'medium' | 'low';
  recommendationType: 'similar_properties' | 'price_match' | 'location_preference' | 'trending' | 'ai_curated' | 'urgent_opportunity';
  
  // Additional data for recommendations
  priceAdvantage?: number; // percentage below market
  viewingActivity?: number;
  timeOnMarket?: number; // days
  specialOffers?: string[];
  agentRecommended?: boolean;
}

interface RecommendationEngine {
  analyzePreferences: (profile: any) => any;
  generateRecommendations: (preferences: any, excludeId?: string) => PropertyRecommendation[];
  calculateMatchScore: (property: any, preferences: any) => number;
}

export default function PersonalizedRecommendations({
  buyerId,
  buyerProfile,
  currentPropertyId,
  developmentId,
  maxRecommendations = 6,
  onRecommendationClick,
  onInteractionTracked,
  className = ''
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'for_you' | 'similar' | 'trending'>('for_you');

  useEffect(() => {
    generateRecommendations();
  }, [buyerId, buyerProfile, currentPropertyId, selectedTab]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate AI-powered recommendations based on buyer profile and behavior
      const engine = new PropertyRecommendationEngine();
      const preferences = engine.analyzePreferences(buyerProfile);
      const recs = engine.generateRecommendations(preferences, currentPropertyId);
      
      // Filter and sort based on selected tab
      let filteredRecs = recs;
      switch (selectedTab) {
        case 'similar':
          filteredRecs = recs.filter(r => r.recommendationType === 'similar_properties');
          break;
        case 'trending':
          filteredRecs = recs.filter(r => r.recommendationType === 'trending');
          break;
        default:
          // 'for_you' - all recommendations sorted by match score
          break;
      }
      
      setRecommendations(filteredRecs.slice(0, maxRecommendations));
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = (property: PropertyRecommendation) => {
    // Track interaction
    if (onInteractionTracked) {
      onInteractionTracked({
        type: 'recommendation_clicked',
        propertyId: property.id,
        recommendationType: property.recommendationType,
        matchScore: property.matchScore,
        timestamp: new Date()
      });
    }

    // Call click handler
    if (onRecommendationClick) {
      onRecommendationClick(property.id, property.reasons[0]);
    }

    // Track buyer activity
    if (buyerId) {
      fetch('/api/buyer-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId,
          sessionId: `session_${Date.now()}`,
          activityType: 'property_view',
          data: {
            propertyId: property.id,
            developmentId: property.developmentName,
            source: 'ai_recommendation',
            matchScore: property.matchScore,
            recommendationType: property.recommendationType
          },
          engagement: {
            intensity: 'high',
            timeSpent: 0,
            pageDepth: 1,
            interactionCount: 1
          }
        })
      }).catch(console.error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getRecommendationTypeIcon = (type: PropertyRecommendation['recommendationType']) => {
    switch (type) {
      case 'ai_curated':
        return <Brain className="w-4 h-4" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'urgent_opportunity':
        return <Zap className="w-4 h-4" />;
      case 'price_match':
        return <Target className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getRecommendationTypeColor = (type: PropertyRecommendation['recommendationType']) => {
    switch (type) {
      case 'ai_curated':
        return 'text-purple-600 bg-purple-100';
      case 'trending':
        return 'text-green-600 bg-green-100';
      case 'urgent_opportunity':
        return 'text-red-600 bg-red-100';
      case 'price_match':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityBadge = (priority: PropertyRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Hot</div>;
      case 'medium':
        return <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Popular</div>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
          </div>
          
          {buyerProfile && (
            <div className="text-sm text-gray-600">
              Based on your preferences and activity
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {[
            { id: 'for_you', label: 'For You', icon: Target },
            { id: 'similar', label: 'Similar', icon: Heart },
            { id: 'trending', label: 'Trending', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedTab === id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((property) => (
            <div
              key={property.id}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleRecommendationClick(property)}
            >
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={property.images[0] || '/images/properties/default-property.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationTypeColor(property.recommendationType)}`}>
                    <div className="flex items-center gap-1">
                      {getRecommendationTypeIcon(property.recommendationType)}
                      <span className="capitalize">{property.recommendationType.replace('_', ' ')}</span>
                    </div>
                  </div>
                  {getPriorityBadge(property.priority)}
                </div>

                {/* Match Score */}
                <div className="absolute top-3 right-3">
                  <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{property.matchScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Special Offers */}
                {property.specialOffers && property.specialOffers.length > 0 && (
                  <div className="absolute bottom-3 left-3">
                    <div className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                      {property.specialOffers[0]}
                    </div>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{property.location}</span>
                  </div>
                </div>

                {/* Property Specs */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="text-xs">
                    {property.size}m²
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </div>
                    {property.priceAdvantage && (
                      <div className="text-xs text-green-600 font-medium">
                        {property.priceAdvantage}% below market
                      </div>
                    )}
                  </div>
                  
                  {property.status === 'AVAILABLE' && (
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Available
                    </div>
                  )}
                </div>

                {/* Recommendation Reasons */}
                <div className="mb-3">
                  <div className="text-xs text-gray-600 mb-1">Why recommended:</div>
                  <div className="text-xs text-purple-600">
                    {property.reasons.slice(0, 2).join(' • ')}
                  </div>
                </div>

                {/* Activity Indicators */}
                {(property.viewingActivity || property.agentRecommended) && (
                  <div className="flex items-center gap-3 text-xs text-gray-500 border-t pt-2">
                    {property.viewingActivity && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{property.viewingActivity} viewing{property.viewingActivity !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {property.agentRecommended && (
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>Agent pick</span>
                      </div>
                    )}
                  </div>
                )}

                {/* View Button */}
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/developments/${property.developmentName.toLowerCase().replace(/\s+/g, '-')}/${property.id}`}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View Property
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle save/favorite
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 text-center">
          <Link
            href="/properties/search?recommended=true"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            View All Recommendations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Recommendation Engine Implementation
class PropertyRecommendationEngine implements RecommendationEngine {
  analyzePreferences(profile: any) {
    if (!profile) {
      return this.getDefaultPreferences();
    }

    return {
      priceRange: profile.interests?.priceRange || { min: 300000, max: 600000 },
      bedrooms: profile.interests?.bedrooms || [2, 3],
      developmentIds: profile.interests?.developmentIds || [],
      features: profile.interests?.features || [],
      locations: profile.activities
        ?.filter((a: any) => a.data.location)
        ?.map((a: any) => a.data.location) || [],
      buyerStage: profile.buyerStage || 'consideration',
      engagementLevel: profile.engagementScore || 50
    };
  }

  generateRecommendations(preferences: any, excludeId?: string): PropertyRecommendation[] {
    // Mock recommendations based on Fitzgerald Gardens units
    const baseRecommendations: PropertyRecommendation[] = [
      {
        id: 'fitzgerald-gardens-unit-13',
        title: 'Modern 2-Bed Apartment',
        location: 'Fitzgerald Gardens, Drogheda',
        price: 420000,
        bedrooms: 2,
        bathrooms: 2,
        size: 85,
        images: ['/images/developments/fitzgerald-gardens.jpg'],
        developmentName: 'Fitzgerald Gardens',
        unitNumber: 'FG-P1-013',
        status: 'AVAILABLE',
        matchScore: 95,
        reasons: ['Perfect price match for your budget', 'Preferred 2-bedroom layout', 'Phase 1 premium location'],
        priority: 'high',
        recommendationType: 'ai_curated',
        priceAdvantage: 8,
        viewingActivity: 12,
        agentRecommended: true,
        specialOffers: ['HTB Available']
      },
      {
        id: 'fitzgerald-gardens-unit-14',
        title: 'Luxury 2-Bed with Balcony',
        location: 'Fitzgerald Gardens, Drogheda',
        price: 435000,
        bedrooms: 2,
        bathrooms: 2,
        size: 88,
        images: ['/images/developments/fitzgerald-gardens.jpg'],
        developmentName: 'Fitzgerald Gardens',
        unitNumber: 'FG-P1-014',
        status: 'AVAILABLE',
        matchScore: 92,
        reasons: ['Enhanced features you viewed', 'Similar to saved properties', 'High demand unit'],
        priority: 'high',
        recommendationType: 'similar_properties',
        viewingActivity: 8,
        timeOnMarket: 5
      },
      {
        id: 'fitzgerald-gardens-unit-25',
        title: '3-Bed Penthouse',
        location: 'Fitzgerald Gardens, Drogheda',
        price: 520000,
        bedrooms: 3,
        bathrooms: 2,
        size: 115,
        images: ['/images/developments/fitzgerald-gardens.jpg'],
        developmentName: 'Fitzgerald Gardens',
        unitNumber: 'FG-P1-025',
        status: 'AVAILABLE',
        matchScore: 88,
        reasons: ['Premium penthouse opportunity', 'Only 3 penthouse units left', 'Exceptional views'],
        priority: 'high',
        recommendationType: 'urgent_opportunity',
        viewingActivity: 15,
        specialOffers: ['Penthouse Upgrade Package']
      },
      {
        id: 'fitzgerald-gardens-unit-18',
        title: 'Family 3-Bed Home',
        location: 'Fitzgerald Gardens, Drogheda',
        price: 465000,
        bedrooms: 3,
        bathrooms: 2,
        size: 95,
        images: ['/images/developments/fitzgerald-gardens.jpg'],
        developmentName: 'Fitzgerald Gardens',
        unitNumber: 'FG-P1-018',
        status: 'AVAILABLE',
        matchScore: 85,
        reasons: ['Growing family consideration', 'Excellent value per sqm', 'Popular floor plan'],
        priority: 'medium',
        recommendationType: 'trending',
        viewingActivity: 10,
        priceAdvantage: 5
      },
      {
        id: 'fitzgerald-gardens-unit-16',
        title: 'Bright 2-Bed Corner Unit',
        location: 'Fitzgerald Gardens, Drogheda',
        price: 445000,
        bedrooms: 2,
        bathrooms: 2,
        size: 82,
        images: ['/images/developments/fitzgerald-gardens.jpg'],
        developmentName: 'Fitzgerald Gardens',
        unitNumber: 'FG-P1-016',
        status: 'AVAILABLE',
        matchScore: 82,
        reasons: ['Corner unit with extra light', 'Within your search criteria', 'Recently price adjusted'],
        priority: 'medium',
        recommendationType: 'price_match',
        viewingActivity: 6,
        priceAdvantage: 3
      },
      {
        id: 'fitzgerald-gardens-unit-21',
        title: 'Executive 3-Bed Apartment',
        location: 'Fitzgerald Gardens, Drogheda',
        price: 485000,
        bedrooms: 3,
        bathrooms: 2,
        size: 105,
        images: ['/images/developments/fitzgerald-gardens.jpg'],
        developmentName: 'Fitzgerald Gardens',
        unitNumber: 'FG-P1-021',
        status: 'AVAILABLE',
        matchScore: 78,
        reasons: ['Executive features', 'Similar browsing patterns', 'High-end finishes'],
        priority: 'medium',
        recommendationType: 'similar_properties',
        viewingActivity: 7,
        agentRecommended: true
      }
    ];

    return baseRecommendations
      .filter(rec => rec.id !== excludeId)
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  calculateMatchScore(property: any, preferences: any): number {
    let score = 0;
    
    // Price match (30% weight)
    const priceMatch = this.calculatePriceMatch(property.price, preferences.priceRange);
    score += priceMatch * 0.3;
    
    // Bedroom match (25% weight)
    const bedroomMatch = preferences.bedrooms.includes(property.bedrooms) ? 100 : 60;
    score += bedroomMatch * 0.25;
    
    // Location preference (20% weight)
    const locationMatch = preferences.developmentIds.includes(property.developmentName) ? 100 : 70;
    score += locationMatch * 0.2;
    
    // Feature preferences (15% weight)
    const featureMatch = this.calculateFeatureMatch(property.features, preferences.features);
    score += featureMatch * 0.15;
    
    // Engagement bonus (10% weight)
    const engagementBonus = Math.min(100, preferences.engagementLevel * 1.5);
    score += engagementBonus * 0.1;
    
    return Math.round(Math.min(100, score));
  }

  private getDefaultPreferences() {
    return {
      priceRange: { min: 300000, max: 600000 },
      bedrooms: [2, 3],
      developmentIds: ['fitzgerald-gardens'],
      features: [],
      locations: ['Drogheda'],
      buyerStage: 'consideration',
      engagementLevel: 50
    };
  }

  private calculatePriceMatch(price: number, range: { min: number; max: number }): number {
    if (price >= range.min && price <= range.max) {
      return 100;
    }
    
    const deviation = price < range.min 
      ? (range.min - price) / range.min
      : (price - range.max) / range.max;
    
    return Math.max(0, 100 - (deviation * 100));
  }

  private calculateFeatureMatch(propertyFeatures: string[], preferredFeatures: string[]): number {
    if (preferredFeatures.length === 0) return 80;
    
    const matches = preferredFeatures.filter(feature => 
      propertyFeatures.some(pf => pf.toLowerCase().includes(feature.toLowerCase()))
    ).length;
    
    return (matches / preferredFeatures.length) * 100;
  }
}