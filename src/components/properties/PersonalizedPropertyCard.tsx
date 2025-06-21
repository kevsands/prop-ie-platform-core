/**
 * PersonalizedPropertyCard Component
 * Enhanced property card that shows match scores, personalized explanations,
 * and AI-powered "Why this property?" insights
 */

'use client';

import React, { useState } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { PropertyMatch } from '@/lib/algorithms/PropertyRecommendationEngine';

interface PersonalizedPropertyCardProps {
  match: PropertyMatch;
  showMatchScore?: boolean;
  showExplanations?: boolean;
  onFavorite?: (propertyId: string) => void;
  isFavorited?: boolean;
  className?: string;
}

export default function PersonalizedPropertyCard({
  match,
  showMatchScore = true,
  showExplanations = true,
  onFavorite,
  isFavorited = false,
  className = ''
}: PersonalizedPropertyCardProps) {
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  const { property, matchScore, explanations, strengths, considerations, personalizedFeatures } = match;

  // Get match score color and label
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return { color: 'text-green-600 bg-green-50 border-green-200', label: 'Excellent Match' };
    if (score >= 80) return { color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Great Match' };
    if (score >= 70) return { color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Good Match' };
    if (score >= 60) return { color: 'text-orange-600 bg-orange-50 border-orange-200', label: 'Fair Match' };
    return { color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Consider' };
  };

  const matchStyle = getMatchScoreColor(matchScore);

  // Format price
  const formatPrice = (price: number) => {
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
    .slice(0, 2);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Property Image with Match Score Overlay */}
      <div className="relative h-48 md:h-56">
        <Image
          src={property.images?.[0] || '/api/placeholder/400/300'}
          alt={property.name}
          fill
          className="object-cover"
        />
        
        {/* Match Score Badge */}
        {showMatchScore && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full border text-sm font-semibold ${matchStyle.color}`}>
            <div className="flex items-center gap-1">
              <Target size={14} />
              {matchScore}% {matchStyle.label}
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

        {/* Favorite Button */}
        <button
          onClick={() => onFavorite?.(property.id)}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
        >
          <Heart 
            size={20} 
            className={isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600'} 
          />
        </button>

        {/* HTB Badge */}
        {property.isNew && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            HTB Eligible
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4 md:p-6">
        {/* Property Name and Location */}
        <div className="mb-3">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
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
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </div>
          {property.floorArea && (
            <div className="text-sm text-gray-600">
              €{Math.round(property.price / property.floorArea)}/sqm
            </div>
          )}
        </div>

        {/* Property Specs */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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

        {/* Personalized Insights */}
        {personalizedFeatures.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-sm font-medium text-purple-700 mb-2">
              <Sparkles size={14} />
              Perfect for you
            </div>
            <div className="flex flex-wrap gap-2">
              {personalizedFeatures.slice(0, 3).map((feature, index) => (
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

        {/* Match Strengths */}
        {strengths.length > 0 && showExplanations && (
          <div className="mb-4">
            <div className="space-y-1">
              {strengths.slice(0, 2).map((strength, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle size={14} />
                  {strength}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Explanations */}
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
        {considerations.length > 0 && showExplanations && (
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

        {/* Detailed Explanation Toggle */}
        {showExplanations && explanations.length > 2 && (
          <div className="mb-4">
            <button
              onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showDetailedExplanation ? (
                <>
                  <ChevronUp size={14} />
                  Show less details
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  Show detailed analysis
                </>
              )}
            </button>

            {showDetailedExplanation && (
              <div className="mt-3 space-y-3">
                {explanations.map((explanation, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {explanation.category} Match
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
                    {explanation.details && (
                      <p className="text-xs text-gray-500 mt-1">{explanation.details}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/properties/${property.slug || property.id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
          >
            View Details
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Schedule Viewing
          </button>
        </div>

        {/* Match Score Summary */}
        {showMatchScore && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Overall Match Score</span>
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
      </div>
    </div>
  );
}