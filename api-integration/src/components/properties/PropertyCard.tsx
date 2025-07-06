'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  Home, 
  Eye, 
  Heart, 
  MapPin,
  Star,
  Euro,
  Calendar
} from 'lucide-react';
import { 
  getStatusInfo, 
  formatPrice, 
  getDevelopmentSlug,
  formatViewCount 
} from '@/lib/utils/status-helpers';

interface PropertyData {
  id: string;
  name?: string;
  title?: string;
  unitNumber?: string;
  type?: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  basePrice?: number;
  price?: number;
  status: string;
  primaryImage?: string;
  image?: string;
  images?: string[];
  berRating?: string;
  parkingSpaces?: number;
  availableFrom?: string;
  developmentId?: string;
  developmentName?: string;
  developmentSlug?: string;
  location?: string;
  aiScore?: number;
  viewCount?: number;
  htbEligible?: boolean;
  isNew?: boolean;
  isReduced?: boolean;
  tags?: string[];
}

interface PropertyCardProps {
  property: PropertyData;
  showLocation?: boolean;
  showAiScore?: boolean;
  showViewCount?: boolean;
  compact?: boolean;
  onViewDetails?: () => void;
}

export default function PropertyCard({ 
  property, 
  showLocation = true,
  showAiScore = false,
  showViewCount = false,
  compact = false,
  onViewDetails 
}: PropertyCardProps) {
  const statusInfo = getStatusInfo(property.status);
  const StatusIcon = statusInfo.icon;
  const developmentSlug = getDevelopmentSlug(property.developmentId, property.developmentName);
  const unitIdentifier = property.unitNumber || property.id;
  const propertyPrice = property.basePrice || property.price || 0;
  const propertyImage = property.primaryImage || property.image || property.images?.[0] || '/images/property-placeholder.jpg';
  const propertyTitle = property.name || property.title || `Unit ${property.unitNumber}`;

  // Track property viewing for search preferences
  const trackPropertyViewing = async () => {
    try {
      const sessionId = `session_${Date.now()}`;
      const viewing = {
        propertyId: property.id,
        developmentId: property.developmentId,
        viewedAt: new Date(),
        duration: 0, // Will be updated on actual page view
        source: 'search',
        actions: ['viewed_card']
      };

      // Check if user is authenticated (in real app, get from auth context)
      const isGuest = !localStorage.getItem('buyerId'); // Simplified check
      const identifier = isGuest ? sessionId : localStorage.getItem('buyerId') || sessionId;

      await fetch('/api/buyer-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record-viewing',
          identifier,
          viewing,
          isGuest
        })
      });
    } catch (error) {
      console.error('Error tracking property viewing:', error);
    }
  };
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
        onViewDetails ? 'cursor-pointer' : ''
      }`}
      onClick={onViewDetails}
    >
      <div className={`relative ${compact ? 'h-32' : 'h-48'} bg-gray-100 overflow-hidden`}>
        <Image
          src={propertyImage}
          alt={propertyTitle}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/property-placeholder.jpg';
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}>
            <StatusIcon className={`w-3 h-3 mr-1 ${statusInfo.color}`} />
            {statusInfo.label}
          </div>
        </div>
        
        {/* Special Badges */}
        <div className="absolute top-3 left-3 space-y-1">
          {property.isNew && (
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
              New
            </div>
          )}
          {property.isReduced && (
            <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-md font-medium">
              Price Drop
            </div>
          )}
          {property.htbEligible && (
            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center">
              <Euro className="w-3 h-3 mr-1" />
              HTB
            </div>
          )}
        </div>

        {/* AI Score */}
        {showAiScore && property.aiScore !== undefined && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-md flex items-center font-medium">
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              {property.aiScore}% Match
            </div>
          </div>
        )}

        {/* View Count */}
        {showViewCount && property.viewCount !== undefined && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-md flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {formatViewCount(property.viewCount)}
            </div>
          </div>
        )}
      </div>
      
      <div className={`${compact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'} leading-tight`}>
              {propertyTitle}
            </h3>
            {showLocation && (
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {property.location || property.developmentName}
              </p>
            )}
            {property.type && (
              <p className="text-sm text-gray-500 mt-1">{property.type}</p>
            )}
          </div>
          <div className="text-right">
            <p className={`font-bold text-blue-600 ${compact ? 'text-lg' : 'text-xl'}`}>
              {formatPrice(propertyPrice)}
            </p>
            {property.berRating && (
              <p className="text-xs text-gray-500 mt-1">BER {property.berRating}</p>
            )}
          </div>
        </div>
        
        {/* Tags */}
        {property.tags && property.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Specifications */}
        <div className={`grid grid-cols-3 gap-4 ${compact ? 'text-sm' : ''}`}>
          <div className="flex items-center text-gray-600">
            <Bed className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{property.bedrooms}</span>
            <span className="ml-1 text-sm">bed</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Bath className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{property.bathrooms}</span>
            <span className="ml-1 text-sm">bath</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Maximize className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{property.size}</span>
            <span className="ml-1 text-sm">m²</span>
          </div>
        </div>

        {/* Additional Info */}
        {!compact && (
          <div className="mt-4 space-y-2">
            {property.parkingSpaces && property.parkingSpaces > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <Car className="w-4 h-4 mr-2 text-gray-400" />
                <span>{property.parkingSpaces} parking space{property.parkingSpaces > 1 ? 's' : ''}</span>
              </div>
            )}
            
            {property.availableFrom && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link 
            href={property.developmentSlug ? 
              `/developments/${property.developmentSlug}/units/${unitIdentifier}` :
              `/developments/${developmentSlug}/units/${unitIdentifier}`
            }
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
            onClick={(e) => {
              if (onViewDetails) {
                e.preventDefault();
                onViewDetails();
              } else {
                e.stopPropagation();
                // Track property viewing for preferences
                trackPropertyViewing();
              }
            }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}