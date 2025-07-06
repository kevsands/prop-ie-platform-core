/**
 * Mobile Optimized Property Card
 * Responsive property card with touch-optimized interactions and mobile-first design
 */

'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Ruler, 
  Star,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  Target,
  Euro,
  Home,
  Sparkles,
  Award,
  CheckCircle,
  AlertTriangle,
  Share2,
  Eye,
  Calendar,
  Phone,
  ArrowRight
} from 'lucide-react';
import { PropertyMatch } from '@/lib/algorithms/PropertyRecommendationEngine';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface MobileOptimizedPropertyCardProps {
  match: PropertyMatch;
  showMatchScore?: boolean;
  showExplanations?: boolean;
  onFavorite?: (propertyId: string) => void;
  isFavorited?: boolean;
  onShare?: (propertyId: string) => void;
  onScheduleViewing?: (propertyId: string) => void;
  className?: string;
}

export default function MobileOptimizedPropertyCard({
  match,
  showMatchScore = true,
  showExplanations = true,
  onFavorite,
  isFavorited = false,
  onShare,
  onScheduleViewing,
  className = ''
}: MobileOptimizedPropertyCardProps) {
  const { device, optimizations, getTouchOptimizedProps, getImageUrl, shouldReduceMotion } = useMobileOptimization();
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { property, matchScore, explanations, strengths, considerations, personalizedFeatures } = match;

  // Get match score color and label
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return { color: 'text-green-600 bg-green-50 border-green-200', label: 'Excellent' };
    if (score >= 80) return { color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Great' };
    if (score >= 70) return { color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Good' };
    if (score >= 60) return { color: 'text-orange-600 bg-orange-50 border-orange-200', label: 'Fair' };
    return { color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Consider' };
  };

  const matchStyle = getMatchScoreColor(matchScore);

  // Format price
  const formatPrice = (price: number) => {
    if (device.isMobile && price >= 1000000) {
      return `€${(price / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get top explanations
  const topExplanations = explanations
    .filter(exp => exp.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, device.isMobile ? 1 : 2);

  // Touch handlers for mobile interactions
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!device.hasTouch) return;
    
    const touch = e.touches[0];
    const startTime = Date.now();
    const startY = touch.clientY;

    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endTime = Date.now();
      const endTouch = endEvent.changedTouches[0];
      const endY = endTouch.clientY;
      
      const deltaTime = endTime - startTime;
      const deltaY = Math.abs(endY - startY);
      
      // Long press detection (500ms)
      if (deltaTime > 500 && deltaY < 10) {
        setShowDetailedExplanation(!showDetailedExplanation);
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
  };

  // Swipe gesture for card actions
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && onShare) {
      onShare(property.id);
    } else if (direction === 'right' && onFavorite) {
      onFavorite(property.id);
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
        shouldReduceMotion() ? '' : 'hover:shadow-lg hover:scale-[1.02]'
      } ${className}`}
      onTouchStart={handleTouchStart}
    >
      {/* Property Image with Overlay Information */}
      <div className="relative">
        <div className="relative h-48 md:h-56 bg-gray-200">
          <Image
            src={getImageUrl(property.images?.[0] || '/api/placeholder/400/300', 'card')}
            alt={property.name}
            fill
            className={`object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
            sizes={device.isMobile ? '100vw' : '(max-width: 768px) 50vw, 33vw'}
            priority={false}
          />
          
          {/* Loading skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>
        
        {/* Match Score Badge */}
        {showMatchScore && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full border text-xs font-semibold ${matchStyle.color}`}>
            <div className="flex items-center gap-1">
              <Target size={12} />
              {device.isMobile ? `${matchScore}%` : `${matchScore}% ${matchStyle.label}`}
            </div>
          </div>
        )}

        {/* Status Badge */}
        {property.status && (
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'Available' ? 'bg-green-600 text-white' :
            property.status === 'Reserved' ? 'bg-orange-600 text-white' :
            'bg-gray-600 text-white'
          }`}>
            {property.status}
          </div>
        )}

        {/* HTB Badge */}
        {property.isNew && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            HTB
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            {...getTouchOptimizedProps()}
            onClick={() => onFavorite?.(property.id)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all active:scale-95"
          >
            <Heart 
              size={18} 
              className={isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600'} 
            />
          </button>
          
          {device.isMobile && onShare && (
            <button
              {...getTouchOptimizedProps()}
              onClick={() => onShare(property.id)}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all active:scale-95"
            >
              <Share2 size={18} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className={`p-4 ${device.isMobile ? 'md:p-6' : 'md:p-6'}`}>
        {/* Property Name and Location */}
        <div className="mb-3">
          <h3 className={`font-bold text-gray-900 mb-1 ${device.isMobile ? 'text-lg' : 'text-lg md:text-xl'}`}>
            <Link 
              href={`/properties/${property.slug || property.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {property.name}
            </Link>
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={14} className="mr-1" />
            {property.address?.city || property.projectName}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className={`font-bold text-gray-900 ${device.isMobile ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
            {formatPrice(property.price)}
          </div>
          {property.floorArea && (
            <div className="text-sm text-gray-600">
              €{Math.round(property.price / property.floorArea)}/sqm
            </div>
          )}
        </div>

        {/* Property Specs - Responsive Layout */}
        <div className={`flex items-center gap-3 text-sm text-gray-600 mb-4 ${
          device.isMobile ? 'flex-wrap gap-x-4 gap-y-2' : 'gap-4'
        }`}>
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed size={16} />
              {property.bedrooms} bed
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath size={16} />
              {property.bathrooms} bath
            </div>
          )}
          {property.parkingSpaces && (
            <div className="flex items-center gap-1">
              <Car size={16} />
              {property.parkingSpaces} parking
            </div>
          )}
          {property.floorArea && (
            <div className="flex items-center gap-1">
              <Ruler size={16} />
              {property.floorArea}sqm
            </div>
          )}
        </div>

        {/* Personalized Insights - Mobile Optimized */}
        {personalizedFeatures.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-sm font-medium text-purple-700 mb-2">
              <Sparkles size={14} />
              Perfect for you
            </div>
            <div className="flex flex-wrap gap-2">
              {personalizedFeatures.slice(0, device.isMobile ? 2 : 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Match Strengths - Compact for Mobile */}
        {strengths.length > 0 && showExplanations && (
          <div className="mb-4">
            <div className="space-y-1">
              {strengths.slice(0, device.isMobile ? 1 : 2).map((strength, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle size={14} />
                  {strength}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Explanations - Mobile Optimized */}
        {topExplanations.length > 0 && showExplanations && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-1 text-sm font-medium text-blue-800 mb-2">
              <Info size={14} />
              Why this property?
            </div>
            <div className="space-y-1">
              {topExplanations.map((explanation, index) => (
                <div key={index} className="text-sm text-blue-700">
                  • {explanation.explanation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Considerations */}
        {considerations.length > 0 && showExplanations && !device.isMobile && (
          <div className="mb-4">
            <div className="space-y-1">
              {considerations.slice(0, 1).map((consideration, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-orange-600">
                  <AlertTriangle size={14} />
                  {consideration}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Explanation Toggle - Simplified for Mobile */}
        {showExplanations && explanations.length > 1 && (
          <div className="mb-4">
            <button
              {...getTouchOptimizedProps()}
              onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showDetailedExplanation ? (
                <>
                  <ChevronUp size={14} />
                  {device.isMobile ? 'Less' : 'Show less details'}
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  {device.isMobile ? 'More info' : 'Show detailed analysis'}
                </>
              )}
            </button>

            {showDetailedExplanation && (
              <div className="mt-3 space-y-2">
                {explanations.map((explanation, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {explanation.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          explanation.score >= 80 ? 'bg-green-500' :
                          explanation.score >= 60 ? 'bg-blue-500' :
                          explanation.score >= 40 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`} />
                        <span className="text-sm text-gray-600">{explanation.score}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{explanation.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons - Mobile Optimized */}
        <div className={`flex gap-3 ${device.isMobile ? 'flex-col' : ''}`}>
          <Link
            href={`/properties/${property.slug || property.id}`}
            className={`bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium ${
              device.isMobile ? 'flex-1' : 'flex-1'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Eye size={16} />
              View Details
            </span>
          </Link>
          
          {device.isMobile ? (
            <div className="flex gap-3">
              <button
                {...getTouchOptimizedProps()}
                onClick={() => onScheduleViewing?.(property.id)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <span className="flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  Book Viewing
                </span>
              </button>
              
              <button
                {...getTouchOptimizedProps()}
                onClick={() => window.open(`tel:+353-1-234-5678`, '_self')}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onScheduleViewing?.(property.id)}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Schedule Viewing
            </button>
          )}
        </div>

        {/* Match Score Summary - Bottom */}
        {showMatchScore && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {device.isMobile ? 'Match' : 'Overall Match Score'}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      matchScore >= 90 ? 'bg-green-500' :
                      matchScore >= 80 ? 'bg-blue-500' :
                      matchScore >= 70 ? 'bg-purple-500' :
                      matchScore >= 60 ? 'bg-orange-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
                <span className="font-medium text-gray-900">{matchScore}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile-specific swipe hint */}
        {device.isMobile && (
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Swipe right to save • Swipe left to share
            </p>
          </div>
        )}
      </div>
    </div>
  );
}