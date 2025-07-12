/**
 * Enhanced Development Page
 * Integrates conversion features with basic unit display for optimal buyer experience
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2,
  MapPin,
  Calendar,
  Award,
  Shield,
  Calculator,
  Eye,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Phone,
  Mail,
  Download,
  Share2,
  Heart,
  Bookmark
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import UnitsGridListing from '../units/UnitsGridListing';
import UrgencyIndicators from '../conversion/UrgencyIndicators';
import SocialProofFeed from '../conversion/SocialProofFeed';
import ScarcityTimer from '../conversion/ScarcityTimer';
import { PurchaserDetails } from '../conversion/OneClickExclusivityPurchase';
import { Unit } from '@/types/core/unit';

export interface DevelopmentPageData {
  development: {
    id: string;
    name: string;
    slug: string;
    location: string;
    description: string;
    heroImage: string;
    gallery: string[];
    completionDate: Date;
    totalUnits: number;
    priceRange: { min: number; max: number };
    features: string[];
    amenities: string[];
    developer: {
      name: string;
      logo: string;
      description: string;
      trackRecord: string[];
    };
    location_details: {
      address: string;
      transport: string[];
      schools: string[];
      shopping: string[];
      healthcare: string[];
    };
  };
  units: Unit[];
  urgencyData: {
    unitsRemaining: number;
    totalUnits: number;
    currentViewers: number;
    viewsToday: number;
    recentReservations: number;
    priceIncreaseDate?: Date;
    priceIncreaseAmount?: number;
    timeLeftForCurrentPrice?: number;
    lastReservationTime?: Date;
    averageTimeToSell?: number;
  };
  socialProof: {
    recentPurchases: Array<{
      id: string;
      buyerName: string;
      buyerInitials: string;
      unitNumber: string;
      developmentName: string;
      purchaseType: 'exclusivity' | 'reservation' | 'contract';
      timestamp: Date;
      location: string;
      price?: number;
      bedrooms?: number;
    }>;
    testimonials: Array<{
      id: string;
      buyerName: string;
      buyerInitials: string;
      rating: number;
      comment: string;
      purchaseDate: Date;
      developmentName: string;
      verified: boolean;
      helpful: number;
    }>;
    viewingActivity: {
      currentViewers: number;
      recentViewers: string[];
      peakViewingTime: string;
      totalViewsToday: number;
    };
  };
  scarcityEvents: Array<{
    id: string;
    type: 'price_increase' | 'offer_expiry' | 'unit_release' | 'final_availability';
    title: string;
    description: string;
    endTime: Date;
    impact: {
      priceChange?: number;
      discountAmount?: number;
      unitsAffected?: number;
    };
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    actionText?: string;
  }>;
}

interface EnhancedDevelopmentPageProps {
  data: DevelopmentPageData;
  onUnitView: (unitId: string) => void;
  onExclusivityPurchased: (transactionId: string, unitId: string, purchaserDetails: PurchaserDetails) => void;
  onInquiry: () => void;
  onBrochureDownload: () => void;
  onShareDevelopment: () => void;
}

export const EnhancedDevelopmentPage: React.FC<EnhancedDevelopmentPageProps> = ({
  data,
  onUnitView,
  onExclusivityPurchased,
  onInquiry,
  onBrochureDownload,
  onShareDevelopment
}) => {
  const [activeTab, setActiveTab] = useState('units');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { development, units, urgencyData, socialProof, scarcityEvents } = data;

  const formatPrice = (price: number) => `€${price.toLocaleString()}`;

  const unitsGridData = {
    units,
    totalCount: units.length,
    summary: {
      available: units.filter(u => u.status === 'available').length,
      reserved: units.filter(u => u.status === 'reserved').length,
      sold: units.filter(u => u.status === 'sold').length,
      averagePrice: units.reduce((sum, u) => sum + u.basePrice, 0) / units.length,
      priceRange: development.priceRange
    },
    developmentInfo: {
      id: development.id,
      name: development.name,
      location: development.location,
      totalUnits: development.totalUnits
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px]">
        <Image
          src={development.heroImage}
          alt={development.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                {development.name}
              </h1>
              <div className="flex items-center space-x-4 text-lg mb-6">
                <span className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{development.location}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>{development.totalUnits} units</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Completion {development.completionDate.getFullYear()}</span>
                </span>
              </div>
              <p className="text-xl mb-8 opacity-90">
                {development.description}
              </p>
              <div className="flex items-center space-x-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setActiveTab('units')}
                >
                  View Units From {formatPrice(development.priceRange.min)}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={onBrochureDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={onShareDevelopment}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Urgency Indicators */}
            {urgencyData && (
              <div className="mb-8">
                <UrgencyIndicators
                  urgencyData={urgencyData}
                  propertyPrice={development.priceRange.min}
                  showIntense={urgencyData.unitsRemaining <= 10}
                />
              </div>
            )}

            {/* Scarcity Timers */}
            {scarcityEvents.length > 0 && (
              <div className="mb-8">
                <ScarcityTimer
                  events={scarcityEvents}
                  showMultiple={false}
                  onEventExpired={(eventId) => console.log('Event expired:', eventId)}
                />
              </div>
            )}

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="units">Units</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="developer">Developer</TabsTrigger>
              </TabsList>

              <TabsContent value="units" className="mt-6">
                <UnitsGridListing
                  data={unitsGridData}
                  viewMode="buyer"
                  showConversionFeatures={true}
                  onUnitView={onUnitView}
                  onExclusivityPurchased={onExclusivityPurchased}
                />
              </TabsContent>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Key Features */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {development.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Amenities */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {development.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Price Information */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Price Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Price Range</p>
                      <p className="text-2xl font-bold">
                        {formatPrice(development.priceRange.min)} - {formatPrice(development.priceRange.max)}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Help-to-Buy eligible</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calculator className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Save up to €30,000 with HTB</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Location & Transport</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Address</h4>
                      <p className="text-gray-600">{development.location_details.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Transport Links</h4>
                        <ul className="space-y-1">
                          {development.location_details.transport.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Schools</h4>
                        <ul className="space-y-1">
                          {development.location_details.schools.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {development.gallery.map((image, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${development.name} gallery ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="developer" className="mt-6">
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={development.developer.logo}
                      alt={development.developer.name}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{development.developer.name}</h3>
                      <p className="text-gray-600 mb-4">{development.developer.description}</p>
                      
                      <h4 className="font-semibold mb-2">Track Record</h4>
                      <ul className="space-y-1">
                        {development.developer.trackRecord.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Get Information</h3>
              <div className="space-y-3">
                <Button className="w-full" onClick={onInquiry}>
                  <Phone className="h-4 w-4 mr-2" />
                  Request Callback
                </Button>
                <Button variant="outline" className="w-full" onClick={onBrochureDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Inquiry
                </Button>
              </div>
            </Card>

            {/* Social Proof */}
            <SocialProofFeed
              recentPurchases={socialProof.recentPurchases}
              testimonials={socialProof.testimonials}
              viewingActivity={socialProof.viewingActivity}
              developmentName={development.name}
              showLive={true}
            />

            {/* Development Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Development Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Units</span>
                  <span className="font-semibold">{development.totalUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="font-semibold text-green-600">{urgencyData.unitsRemaining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Views Today</span>
                  <span className="font-semibold">{urgencyData.viewsToday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion</span>
                  <span className="font-semibold">{development.completionDate.getFullYear()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDevelopmentPage;