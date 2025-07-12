/**
 * Conversion Optimized Unit Card
 * Integrates all conversion psychology elements into a high-converting unit card
 */

'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  Users, 
  Fire, 
  Zap, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Shield,
  Calculator,
  Home,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Star,
  Award,
  Lock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import UrgencyIndicators, { UrgencyData } from './UrgencyIndicators';
import OneClickExclusivityPurchase, { ExclusivityPurchaseData, PurchaserDetails } from './OneClickExclusivityPurchase';

export interface ConversionUnitData {
  id: string;
  unitNumber: string;
  name: string;
  price: number;
  originalPrice?: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  status: 'available' | 'reserved' | 'sold';
  developmentName: string;
  location: string;
  htbEligible: boolean;
  htbBenefit?: number;
  features: string[];
  
  // Conversion data
  urgencyData: UrgencyData;
  recentActivity: {
    viewsToday: number;
    currentViewers: number;
    recentInquiries: number;
    lastReserved?: Date;
  };
  sellingPoints: string[];
  priceIncreaseDate?: Date;
  priceIncreaseAmount?: number;
  exclusivityFee: number;
  testimonial?: {
    buyerName: string;
    rating: number;
    comment: string;
  };
}

interface ConversionOptimizedUnitCardProps {
  unit: ConversionUnitData;
  onViewDetails: (unitId: string) => void;
  onExclusivityPurchased: (transactionId: string, unitId: string, purchaserDetails: PurchaserDetails) => void;
  showIntenseMode?: boolean;
}

export const ConversionOptimizedUnitCard: React.FC<ConversionOptimizedUnitCardProps> = ({
  unit,
  onViewDetails,
  onExclusivityPurchased,
  showIntenseMode = false
}) => {
  const [showExclusivityModal, setShowExclusivityModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => `€${price.toLocaleString()}`;

  const getStatusColor = () => {
    switch (unit.status) {
      case 'available': return 'bg-green-500 text-white';
      case 'reserved': return 'bg-orange-500 text-white';
      case 'sold': return 'bg-gray-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const isHighDemand = () => {
    return unit.urgencyData.unitsRemaining <= 3 || 
           unit.recentActivity.currentViewers >= 5 ||
           unit.urgencyData.viewsToday >= 50;
  };

  const calculateSavings = () => {
    const htbSavings = unit.htbEligible ? (unit.htbBenefit || 30000) : 0;
    const priceDiscount = unit.originalPrice ? unit.originalPrice - unit.price : 0;
    return htbSavings + priceDiscount;
  };

  const exclusivityPurchaseData: ExclusivityPurchaseData = {
    propertyId: unit.id,
    propertyName: unit.name,
    propertyPrice: unit.price,
    exclusivityFee: unit.exclusivityFee,
    exclusivityPeriod: 14,
    developmentName: unit.developmentName,
    unitNumber: unit.unitNumber,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    htbEligible: unit.htbEligible,
    htbBenefit: unit.htbBenefit
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
        {/* High Demand Flame Badge */}
        {isHighDemand() && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-red-500 text-white animate-pulse">
              <Fire className="h-3 w-3 mr-1" />
              HIGH DEMAND
            </Badge>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge className={getStatusColor()}>
            {unit.status.toUpperCase()}
          </Badge>
        </div>

        {/* Main Image */}
        <div className="relative h-64 bg-gray-200">
          <Image
            src={unit.images[currentImageIndex] || '/images/unit-placeholder.jpg'}
            alt={`${unit.name} - Unit ${unit.unitNumber}`}
            fill
            className="object-cover"
          />
          
          {/* Live Activity Overlay */}
          {unit.recentActivity.currentViewers > 0 && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <Eye className="h-3 w-3 mr-1" />
                {unit.recentActivity.currentViewers} viewing now
              </Badge>
            </div>
          )}

          {/* Price Change Alert */}
          {unit.priceIncreaseDate && (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-orange-500 text-white animate-pulse">
                <TrendingUp className="h-3 w-3 mr-1" />
                Price ↑ Soon
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Unit {unit.unitNumber}
              </h3>
              {unit.htbEligible && (
                <Badge className="bg-green-600 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  HTB
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600">{unit.name}</p>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{unit.location}</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(unit.price)}
              </span>
              {unit.originalPrice && unit.originalPrice > unit.price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(unit.originalPrice)}
                </span>
              )}
            </div>
            
            {calculateSavings() > 0 && (
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  Save up to €{calculateSavings().toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Bed className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm text-gray-600">{unit.bedrooms} bed</span>
            </div>
            <div className="flex flex-col items-center">
              <Bath className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm text-gray-600">{unit.bathrooms} bath</span>
            </div>
            <div className="flex flex-col items-center">
              <Maximize className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm text-gray-600">{unit.size}m²</span>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Key Features</h4>
            <div className="flex flex-wrap gap-1">
              {unit.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {unit.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{unit.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Urgency Indicators - Compact Version */}
          <div className="bg-gray-50 rounded-lg p-3">
            <UrgencyIndicators 
              urgencyData={unit.urgencyData}
              propertyPrice={unit.price}
              showIntense={false}
            />
          </div>

          {/* Social Proof */}
          {unit.testimonial && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${
                        i < unit.testimonial!.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-blue-800">
                  {unit.testimonial.buyerName}
                </span>
              </div>
              <p className="text-xs text-blue-700 italic">
                "{unit.testimonial.comment}"
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {unit.status === 'available' ? (
              <>
                {/* Primary CTA - Exclusivity Purchase */}
                <Button
                  onClick={() => setShowExclusivityModal(true)}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 ${
                    showIntenseMode ? 'animate-pulse' : ''
                  }`}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Secure Exclusivity - €{unit.exclusivityFee.toLocaleString()}
                  <Zap className="h-4 w-4 ml-2" />
                </Button>

                {/* Secondary CTA - View Details */}
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(unit.id)}
                  className="w-full"
                >
                  View Full Details
                </Button>
              </>
            ) : (
              <Button disabled className="w-full">
                {unit.status === 'reserved' ? 'Reserved' : 'Sold'}
              </Button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-3 border-t">
            <span className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Escrow Protected</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Legal Binding</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Exclusivity Purchase Modal */}
      <OneClickExclusivityPurchase
        purchaseData={exclusivityPurchaseData}
        isOpen={showExclusivityModal}
        onComplete={(transactionId, purchaserDetails) => {
          setShowExclusivityModal(false);
          onExclusivityPurchased(transactionId, unit.id, purchaserDetails);
        }}
        onCancel={() => setShowExclusivityModal(false)}
      />
    </>
  );
};

export default ConversionOptimizedUnitCard;