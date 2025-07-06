'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Star, 
  Quote,
  CheckCircle,
  TrendingUp,
  Eye,
  Heart,
  Clock,
  MapPin,
  Award,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Home,
  Shield,
  Zap
} from 'lucide-react';
import Image from 'next/image';

interface SocialProofSystemProps {
  developmentId: string;
  unitId?: string;
  propertyId?: string;
  className?: string;
}

interface Testimonial {
  id: string;
  buyerName: string;
  buyerInitials: string;
  buyerImage?: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  developmentName: string;
  unitType: string;
  purchaseDate: Date;
  verified: boolean;
  helpfulVotes: number;
  tags: string[];
  buyerProfile: {
    firstTimeBuyer: boolean;
    familySize?: number;
    occupation?: string;
    location?: string;
  };
}

interface SocialActivity {
  id: string;
  type: 'viewing_booked' | 'interest_expressed' | 'unit_reserved' | 'htb_qualified' | 'offer_made';
  message: string;
  timestamp: Date;
  location?: string;
  urgent?: boolean;
}

interface PopularityMetrics {
  totalViews: number;
  recentViews24h: number;
  totalInterest: number;
  recentInterest24h: number;
  viewingsScheduled: number;
  competitorComparison: {
    morePopularThan: number; // percentage of other properties
    ranking: number; // position in development
  };
}

export default function SocialProofSystem({
  developmentId,
  unitId,
  propertyId,
  className = ''
}: SocialProofSystemProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [recentActivity, setRecentActivity] = useState<SocialActivity[]>([]);
  const [popularityMetrics, setPopularityMetrics] = useState<PopularityMetrics | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSocialProofData();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadRecentActivity();
    }, 30000);

    return () => clearInterval(interval);
  }, [developmentId, unitId]);

  const loadSocialProofData = async () => {
    setLoading(true);
    try {
      // Load testimonials, activity, and metrics
      const data = await generateSocialProofData();
      setTestimonials(data.testimonials);
      setRecentActivity(data.recentActivity);
      setPopularityMetrics(data.popularityMetrics);
    } catch (error) {
      console.error('Error loading social proof data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const activity = await generateRecentActivity();
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const generateSocialProofData = async () => {
    // Mock data generation based on real buyer behavior patterns
    const testimonials: Testimonial[] = [
      {
        id: 'test-1',
        buyerName: 'Sarah & Michael O\'Connor',
        buyerInitials: 'SO',
        rating: 5,
        title: 'Perfect First Home with HTB Support',
        content: 'We couldn\'t be happier with our purchase at Fitzgerald Gardens. The HTB scheme made it possible for us as first-time buyers, and the quality of the build is exceptional. The team guided us through every step, and our agent Sarah was incredibly helpful. The location is perfect for commuting to Dublin.',
        developmentName: 'Fitzgerald Gardens',
        unitType: '2-bed apartment',
        purchaseDate: new Date('2024-05-15'),
        verified: true,
        helpfulVotes: 23,
        tags: ['first-time-buyer', 'htb', 'quality-build', 'great-location'],
        buyerProfile: {
          firstTimeBuyer: true,
          familySize: 2,
          occupation: 'Teacher & Software Developer',
          location: 'Moving from Dublin'
        }
      },
      {
        id: 'test-2',
        buyerName: 'James Murphy',
        buyerInitials: 'JM',
        rating: 5,
        title: 'Excellent Investment Opportunity',
        content: 'As an investor, I was impressed by the location and the government backing with 12 units already sold. The rental potential is excellent, and the build quality gives me confidence in long-term value. The penthouse I purchased has already appreciated since completion.',
        developmentName: 'Fitzgerald Gardens',
        unitType: '3-bed penthouse',
        purchaseDate: new Date('2024-04-20'),
        verified: true,
        helpfulVotes: 18,
        tags: ['investor', 'penthouse', 'government-backing', 'appreciation'],
        buyerProfile: {
          firstTimeBuyer: false,
          occupation: 'Property Investor',
          location: 'Drogheda'
        }
      },
      {
        id: 'test-3',
        buyerName: 'Emma & David Walsh',
        buyerInitials: 'EW',
        rating: 5,
        title: 'Smooth Purchase Process with Great Support',
        content: 'The entire process from viewing to completion was seamless. The one-click booking system made scheduling viewings so easy, and the HTB calculator helped us understand our options immediately. We love our new home and the community here is wonderful.',
        developmentName: 'Fitzgerald Gardens',
        unitType: '3-bed family home',
        purchaseDate: new Date('2024-06-01'),
        verified: true,
        helpfulVotes: 31,
        tags: ['family', 'smooth-process', 'community', 'htb-calculator'],
        buyerProfile: {
          firstTimeBuyer: true,
          familySize: 4,
          occupation: 'Nurse & Engineer',
          location: 'Drogheda'
        }
      },
      {
        id: 'test-4',
        buyerName: 'Robert O\'Brien',
        buyerInitials: 'RO',
        rating: 4,
        title: 'Great Value and Location',
        content: 'Fantastic value for money compared to Dublin prices. The transport links are excellent for my commute, and the energy efficiency is a big plus. Only small issue was a minor delay in completion, but the team kept us informed throughout.',
        developmentName: 'Fitzgerald Gardens',
        unitType: '2-bed apartment',
        purchaseDate: new Date('2024-03-10'),
        verified: true,
        helpfulVotes: 15,
        tags: ['value-for-money', 'transport-links', 'energy-efficient'],
        buyerProfile: {
          firstTimeBuyer: false,
          occupation: 'Financial Analyst',
          location: 'Commuter to Dublin'
        }
      }
    ];

    const recentActivity: SocialActivity[] = [
      {
        id: 'act-1',
        type: 'viewing_booked',
        message: 'Someone from Drogheda just booked a viewing for Unit 15',
        timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
        location: 'Drogheda'
      },
      {
        id: 'act-2',
        type: 'htb_qualified',
        message: 'A buyer just qualified for €28,000 HTB support',
        timestamp: new Date(Date.now() - 28 * 60 * 1000), // 28 minutes ago
        urgent: true
      },
      {
        id: 'act-3',
        type: 'interest_expressed',
        message: 'Someone from Dublin expressed interest in a 3-bed unit',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        location: 'Dublin'
      },
      {
        id: 'act-4',
        type: 'unit_reserved',
        message: 'Unit 19 was just reserved by a family buyer',
        timestamp: new Date(Date.now() - 67 * 60 * 1000), // 1 hour 7 minutes ago
        urgent: true
      },
      {
        id: 'act-5',
        type: 'viewing_booked',
        message: 'Two viewings scheduled for this weekend',
        timestamp: new Date(Date.now() - 89 * 60 * 1000), // 1 hour 29 minutes ago
      }
    ];

    const popularityMetrics: PopularityMetrics = {
      totalViews: 342,
      recentViews24h: 28,
      totalInterest: 68,
      recentInterest24h: 8,
      viewingsScheduled: 15,
      competitorComparison: {
        morePopularThan: 78, // More popular than 78% of similar properties
        ranking: 2 // 2nd most popular in development
      }
    };

    return {
      testimonials,
      recentActivity,
      popularityMetrics
    };
  };

  const generateRecentActivity = async (): Promise<SocialActivity[]> => {
    // Simulate real-time activity updates
    const activities: SocialActivity[] = [
      {
        id: `act-${Date.now()}`,
        type: 'viewing_booked',
        message: 'Someone just booked a viewing for tomorrow',
        timestamp: new Date(),
        urgent: false
      }
    ];

    return activities;
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: SocialActivity['type']) => {
    switch (type) {
      case 'viewing_booked':
        return <Calendar className="w-4 h-4" />;
      case 'interest_expressed':
        return <Heart className="w-4 h-4" />;
      case 'unit_reserved':
        return <Home className="w-4 h-4" />;
      case 'htb_qualified':
        return <Shield className="w-4 h-4" />;
      case 'offer_made':
        return <Zap className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: SocialActivity['type']) => {
    switch (type) {
      case 'viewing_booked':
        return 'text-blue-600 bg-blue-50';
      case 'interest_expressed':
        return 'text-pink-600 bg-pink-50';
      case 'unit_reserved':
        return 'text-green-600 bg-green-50';
      case 'htb_qualified':
        return 'text-purple-600 bg-purple-50';
      case 'offer_made':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Popularity Metrics */}
      {popularityMetrics && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Property Popularity</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{popularityMetrics.totalViews}</div>
              <div className="text-sm text-gray-600">Total Views</div>
              <div className="text-xs text-green-600">+{popularityMetrics.recentViews24h} today</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{popularityMetrics.totalInterest}</div>
              <div className="text-sm text-gray-600">Interest Shown</div>
              <div className="text-xs text-green-600">+{popularityMetrics.recentInterest24h} today</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{popularityMetrics.viewingsScheduled}</div>
              <div className="text-sm text-gray-600">Viewings Booked</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">#{popularityMetrics.competitorComparison.ranking}</div>
              <div className="text-sm text-gray-600">Most Popular</div>
              <div className="text-xs text-orange-600">in development</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-700">
                More popular than <strong>{popularityMetrics.competitorComparison.morePopularThan}%</strong> of similar properties
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Activity Feed */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Live</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 max-h-64 overflow-y-auto">
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  activity.urgent ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                    {activity.location && (
                      <>
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{activity.location}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {activity.urgent && (
                  <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                    Hot
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">4.8/5</span>
              <span className="text-sm text-gray-500">({testimonials.length} reviews)</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid gap-4">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div 
                key={testimonial.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => setSelectedTestimonial(testimonial)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {testimonial.buyerImage ? (
                      <Image
                        src={testimonial.buyerImage}
                        alt={testimonial.buyerName}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{testimonial.buyerInitials}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{testimonial.buyerName}</h4>
                      {testimonial.verified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < testimonial.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <h5 className="font-medium text-gray-800 mb-2">{testimonial.title}</h5>
                    <p className="text-sm text-gray-600 line-clamp-3">{testimonial.content}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>{testimonial.unitType}</span>
                      <span>•</span>
                      <span>{testimonial.purchaseDate.toLocaleDateString()}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{testimonial.helpfulVotes} helpful</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {testimonial.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All {testimonials.length} Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
              <div className="font-medium text-green-800">Government Backed</div>
              <div className="text-sm text-green-600">12 units sold to Housing Scheme</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-green-600" />
            <div>
              <div className="font-medium text-green-800">A2 Energy Rating</div>
              <div className="text-sm text-green-600">Lowest running costs</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <div className="font-medium text-green-800">HTB Eligible</div>
              <div className="text-sm text-green-600">Up to €30,000 support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Testimonial Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Customer Review</h3>
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-lg">
                      {selectedTestimonial.buyerInitials}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{selectedTestimonial.buyerName}</h4>
                      {selectedTestimonial.verified && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < selectedTestimonial.rating 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {selectedTestimonial.rating}/5 stars
                      </span>
                    </div>
                    
                    <h5 className="font-semibold text-gray-800 mb-3">{selectedTestimonial.title}</h5>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedTestimonial.content}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Property: </span>
                    <span className="text-gray-600">{selectedTestimonial.unitType}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Purchase Date: </span>
                    <span className="text-gray-600">{selectedTestimonial.purchaseDate.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Buyer Type: </span>
                    <span className="text-gray-600">
                      {selectedTestimonial.buyerProfile.firstTimeBuyer ? 'First-time buyer' : 'Experienced buyer'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Helpful Votes: </span>
                    <span className="text-gray-600">{selectedTestimonial.helpfulVotes}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedTestimonial.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({selectedTestimonial.helpfulVotes})
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}