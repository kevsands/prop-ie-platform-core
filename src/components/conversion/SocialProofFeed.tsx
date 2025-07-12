/**
 * Social Proof Feed Component
 * Shows real-time buyer activity and testimonials to build trust and drive conversions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Star, 
  Users, 
  Home, 
  Calendar,
  MapPin,
  MessageSquare,
  TrendingUp,
  Heart,
  Award,
  Clock,
  User,
  Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface RecentPurchase {
  id: string;
  buyerName: string;
  buyerInitials: string;
  avatar?: string;
  unitNumber: string;
  developmentName: string;
  purchaseType: 'exclusivity' | 'reservation' | 'contract';
  timestamp: Date;
  location: string;
  price?: number;
  bedrooms?: number;
}

export interface BuyerTestimonial {
  id: string;
  buyerName: string;
  buyerInitials: string;
  avatar?: string;
  rating: number;
  comment: string;
  purchaseDate: Date;
  developmentName: string;
  verified: boolean;
  helpful: number;
}

export interface ViewingActivity {
  currentViewers: number;
  recentViewers: string[];
  peakViewingTime: string;
  totalViewsToday: number;
}

interface SocialProofFeedProps {
  recentPurchases: RecentPurchase[];
  testimonials: BuyerTestimonial[];
  viewingActivity: ViewingActivity;
  developmentName: string;
  showLive?: boolean;
}

export const SocialProofFeed: React.FC<SocialProofFeedProps> = ({
  recentPurchases,
  testimonials,
  viewingActivity,
  developmentName,
  showLive = true
}) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  // Cycle through recent activities
  useEffect(() => {
    if (recentPurchases.length === 0) return;

    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % recentPurchases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [recentPurchases.length]);

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getPurchaseTypeLabel = (type: string) => {
    switch (type) {
      case 'exclusivity': return 'Secured Exclusivity';
      case 'reservation': return 'Made Reservation';
      case 'contract': return 'Signed Contract';
      default: return 'Purchased';
    }
  };

  const getPurchaseTypeColor = (type: string) => {
    switch (type) {
      case 'exclusivity': return 'bg-blue-100 text-blue-800';
      case 'reservation': return 'bg-orange-100 text-orange-800';
      case 'contract': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Activity Banner */}
      {showLive && viewingActivity.currentViewers > 0 && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-800">
                  {viewingActivity.currentViewers} people viewing now
                </p>
                <p className="text-sm text-blue-600">
                  {viewingActivity.totalViewsToday} views today
                </p>
              </div>
            </div>
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
        </Card>
      )}

      {/* Recent Purchase Activity */}
      {recentPurchases.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          </div>
          
          {/* Animated Recent Purchase */}
          <div className="space-y-3">
            {recentPurchases.slice(0, 3).map((purchase, index) => (
              <div 
                key={purchase.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  index === currentActivityIndex ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={purchase.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                    {purchase.buyerInitials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">
                      {purchase.buyerName}
                    </span>
                    <Badge className={getPurchaseTypeColor(purchase.purchaseType)}>
                      {getPurchaseTypeLabel(purchase.purchaseType)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center space-x-1">
                      <Home className="h-3 w-3" />
                      <span>Unit {purchase.unitNumber}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(purchase.timestamp)}</span>
                    </span>
                    {purchase.bedrooms && (
                      <span>{purchase.bedrooms} bed</span>
                    )}
                  </div>
                </div>
                
                {index === currentActivityIndex && (
                  <div className="text-green-600 animate-pulse">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Buyer Testimonials */}
      {testimonials.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-800">Buyer Reviews</h3>
            <Badge variant="outline" className="text-xs">
              Verified Purchases
            </Badge>
          </div>
          
          <div className="space-y-4">
            {testimonials.slice(0, 2).map((testimonial) => (
              <div key={testimonial.id} className="border-l-4 border-yellow-400 pl-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-yellow-100 text-yellow-600 text-xs">
                      {testimonial.buyerInitials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-800">
                        {testimonial.buyerName}
                      </span>
                      {testimonial.verified && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < testimonial.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-2">
                      "{testimonial.comment}"
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{testimonial.developmentName}</span>
                      <span className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{testimonial.helpful} helpful</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Trust Indicators */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="text-center space-y-2">
          <Award className="h-8 w-8 text-green-600 mx-auto" />
          <h4 className="font-semibold text-green-800">
            Trusted by 500+ Happy Homeowners
          </h4>
          <p className="text-sm text-green-600">
            Join our community of satisfied buyers who secured their dream homes through PropIE
          </p>
          <div className="flex justify-center space-x-4 text-xs text-green-700 mt-3">
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Legal Protection</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Escrow Secured</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Expert Support</span>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SocialProofFeed;