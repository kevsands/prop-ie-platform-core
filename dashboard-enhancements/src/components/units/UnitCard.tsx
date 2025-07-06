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
  MapPin
} from 'lucide-react';
import { Unit } from '@/lib/services/units';
import { 
  getStatusInfo, 
  formatPrice, 
  getDevelopmentSlug, 
  getUnitIdentifier,
  formatViewCount 
} from '@/lib/utils/status-helpers';
import UnitSyncIndicator from './UnitSyncIndicator';

interface UnitCardProps {
  unit: Unit;
  developmentId: string;
  developmentName?: string;
  showDevelopmentName?: boolean;
  showViewCount?: boolean;
  showSyncIndicator?: boolean;
  syncStatus?: 'synced' | 'syncing' | 'error' | 'offline';
  isLive?: boolean;
  lastUpdate?: Date;
  updateType?: string;
  compact?: boolean;
  onClick?: () => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ 
  unit, 
  developmentId, 
  developmentName,
  showDevelopmentName = false,
  showViewCount = false,
  showSyncIndicator = false,
  syncStatus = 'offline',
  isLive = false,
  lastUpdate,
  updateType,
  compact = false,
  onClick 
}) => {
  const statusInfo = getStatusInfo(unit.status);
  const StatusIcon = statusInfo.icon;
  const developmentSlug = getDevelopmentSlug(developmentId, developmentName);
  const unitIdentifier = getUnitIdentifier(unit);
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className={`relative ${compact ? 'h-32' : 'h-48'} bg-gray-100 overflow-hidden`}>
        <Image
          src={unit.primaryImage || unit.images?.[0] || '/images/unit-placeholder.jpg'}
          alt={`Unit ${unit.unitNumber || unit.name}`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/unit-placeholder.jpg';
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}>
            <StatusIcon className={`w-3 h-3 mr-1 ${statusInfo.color}`} />
            {statusInfo.label}
          </div>
        </div>
        
        {/* Unit Number */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-md font-medium">
            Unit {unit.unitNumber || unit.name}
          </div>
        </div>

        {/* View Count */}
        {showViewCount && unit.viewCount !== undefined && (
          <div className="absolute top-3 left-3">
            <div className="bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-md flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {formatViewCount(unit.viewCount)}
            </div>
          </div>
        )}
      </div>
      
      <div className={`${compact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
              {unit.name || `Unit ${unit.unitNumber}`}
            </h3>
            {showDevelopmentName && developmentName && (
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {developmentName}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">{unit.type}</p>
          </div>
          <div className="text-right">
            <p className={`font-bold text-blue-600 ${compact ? 'text-lg' : 'text-xl'}`}>
              {formatPrice(unit.basePrice)}
            </p>
            {unit.berRating && (
              <p className="text-xs text-gray-500 mt-1">BER {unit.berRating}</p>
            )}
          </div>
        </div>
        
        {/* Specifications */}
        <div className={`grid grid-cols-3 gap-4 ${compact ? 'text-sm' : ''}`}>
          <div className="flex items-center text-gray-600">
            <Bed className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{unit.bedrooms}</span>
            <span className="ml-1 text-sm">bed</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Bath className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{unit.bathrooms}</span>
            <span className="ml-1 text-sm">bath</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Maximize className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{unit.size}</span>
            <span className="ml-1 text-sm">m²</span>
          </div>
        </div>

        {/* Additional Info */}
        {!compact && (
          <div className="mt-4 space-y-2">
            {unit.parkingSpaces > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <Car className="w-4 h-4 mr-2 text-gray-400" />
                <span>{unit.parkingSpaces} parking space{unit.parkingSpaces > 1 ? 's' : ''}</span>
              </div>
            )}
            
            {unit.availableFrom && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>Available from {new Date(unit.availableFrom).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Sync Indicator */}
        {showSyncIndicator && (
          <div className="mt-4">
            <UnitSyncIndicator
              status={syncStatus}
              lastUpdate={lastUpdate}
              isLive={isLive}
              updateType={updateType}
              compact={compact}
            />
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link 
            href={`/developments/${developmentSlug}/units/${unitIdentifier}`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;