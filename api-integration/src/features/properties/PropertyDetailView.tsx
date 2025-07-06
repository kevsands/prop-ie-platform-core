'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  MapPinIcon,
  HomeIcon,
  CurrencyEuroIcon,
  Square3Stack3DIcon,
  CheckCircleIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon,
  CameraIcon,
  FolderIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  VideoCameraIcon,
  CubeIcon,
  UserGroupIcon,
  ClockIcon,
  InformationCircleIcon,
  ViewfinderCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import PropertyImageGallery from './PropertyImageGallery';
import PropertyFloorPlan from './PropertyFloorPlan';
import PropertyVirtualTour from './PropertyVirtualTour';
import PropertyMap from './PropertyMap';
import PropertyMortgageCalculator from './PropertyMortgageCalculator';
import PropertyStampDutyCalculator from './PropertyStampDutyCalculator';
import SimilarProperties from './SimilarProperties';
import PropertyDocuments from './PropertyDocuments';
import BookingCalendar from '@/components/booking/BookingCalendar';
import ShareDialog from '@/components/dialogs/ShareDialog';
import PriceHistoryChart from '@/components/charts/PriceHistoryChart';
import { useProperty } from '@/hooks/useProperty';
import { useAuth } from '@/hooks/useAuth';
import { useViewingBooking } from '@/hooks/useViewingBooking';
import { useSaveProperty } from '@/hooks/useSaveProperty';
import { useEnquiry } from '@/hooks/useEnquiry';

interface PropertyDetailViewProps {
  propertyId: string;
}

export default function PropertyDetailView({ propertyId }: PropertyDetailViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: property, isLoading } = useProperty(propertyId);
  const { mutate: bookViewing } = useViewingBooking();
  const { mutate: toggleSave, isSaved } = useSaveProperty(propertyId);
  const { mutate: sendEnquiry } = useEnquiry();

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedView, setSelectedView] = useState<'photos' | 'floor-plan' | 'virtual-tour' | 'map'>('photos');
  const [showBooking, setShowBooking] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');

  // Premium features check
  const hasPremiumContent = property?.virtualTour || property?.video;
  const hasDocuments = property?.documents?.length > 0;

  const handleBookViewing = (date: Date, time: string) => {
    bookViewing(
      { propertyId, date, time },
      {
        onSuccess: () => {
          toast.success('Viewing booked successfully! Check your email for confirmation.');
          setShowBooking(false);
        },
        onError: () => {
          toast.error('Failed to book viewing. Please try again.');
        }
      }
    );
  };

  const handleSendEnquiry = () => {
    if (!enquiryMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    sendEnquiry(
      { propertyId, message: enquiryMessage },
      {
        onSuccess: () => {
          toast.success('Enquiry sent successfully!');
          setEnquiryMessage('');
        },
        onError: () => {
          toast.error('Failed to send enquiry. Please try again.');
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <Button onClick={() => router.back()}>Go back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gray-900">
        {selectedView === 'photos' && (
          <PropertyImageGallery images={property.images} propertyName={property.name} />
        )}
        {selectedView === 'floor-plan' && (
          <PropertyFloorPlan floorPlans={property.floorPlans} propertyName={property.name} />
        )}
        {selectedView === 'virtual-tour' && property.virtualTour && (
          <PropertyVirtualTour tourUrl={property.virtualTour} propertyName={property.name} />
        )}
        {selectedView === 'map' && (
          <PropertyMap location={property.location} propertyName={property.name} />
        )}

        {/* View Selector */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
          <Button
            variant={selectedView === 'photos' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedView('photos')}
          >
            <CameraIcon className="h-4 w-4 mr-1" />
            Photos
          </Button>
          <Button
            variant={selectedView === 'floor-plan' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedView('floor-plan')}
          >
            <Square3Stack3DIcon className="h-4 w-4 mr-1" />
            Floor Plan
          </Button>
          {property.virtualTour && (
            <Button
              variant={selectedView === 'virtual-tour' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setSelectedView('virtual-tour')}
            >
              <ViewfinderCircleIcon className="h-4 w-4 mr-1" />
              Virtual Tour
            </Button>
          )}
          <Button
            variant={selectedView === 'map' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedView('map')}
          >
            <MapPinIcon className="h-4 w-4 mr-1" />
            Map
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => toggleSave()}
          >
            {isSaved ? (
              <HeartSolidIcon className="h-5 w-5 text-red-600" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setShowShareDialog(true)}
          >
            <ShareIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Overview */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPinIcon className="h-5 w-5 mr-1" />
                    {property.address}, {property.location.area}, {property.location.county}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">€{property.price.toLocaleString()}</p>
                  {property.pricePerSqft && (
                    <p className="text-sm text-gray-600">€{property.pricePerSqft}/sq ft</p>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <HomeIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{property.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Square3Stack3DIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{property.bathrooms} bathrooms</span>
                </div>
                <div className="flex items-center">
                  <CubeIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{property.size} sq ft</span>
                </div>
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{property.propertyType}</span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-100 text-green-800">
                  BER {property.berRating}
                </Badge>
                {property.isNewBuild && (
                  <Badge className="bg-blue-100 text-blue-800">
                    New Build
                  </Badge>
                )}
                {property.status === 'PRICE_DROP' && (
                  <Badge className="bg-red-100 text-red-800">
                    Price Reduced
                  </Badge>
                )}
                {property.features.includes('CORNER_UNIT') && (
                  <Badge className="bg-purple-100 text-purple-800">
                    Corner Unit
                  </Badge>
                )}
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Property Type</p>
                      <p className="font-semibold">{property.propertyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Build Year</p>
                      <p className="font-semibold">{property.yearBuilt || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Garden</p>
                      <p className="font-semibold">{property.features.includes('SOUTH_FACING_GARDEN') ? 'South Facing' : property.features.includes('GARDEN') ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Parking</p>
                      <p className="font-semibold">{property.features.includes('PARKING') ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Available From</p>
                      <p className="font-semibold">{format(new Date(property.availableFrom), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lease Term</p>
                      <p className="font-semibold">{property.leaseTerm || 'Freehold'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Development Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold">{property.development.name}</p>
                        <p className="text-sm text-gray-600">by {property.development.developer.name}</p>
                      </div>
                      <Badge>{property.development.phase}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Progress</span>
                        <span>{property.development.completionProgress}%</span>
                      </div>
                      <Progress value={property.development.completionProgress} className="h-2" />
                      {property.development.estimatedCompletion && (
                        <p className="text-sm text-gray-600">
                          Est. Completion: {format(new Date(property.development.estimatedCompletion), 'MMM yyyy')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Features & Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {property.features.map((feature) => (
                        <div key={feature} className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                          <span>{feature.replace(/_/g, ' ').toLowerCase()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Room Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {property.rooms.map((room, index) => (
                        <div key={index} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between">
                            <span className="font-semibold">{room.name}</span>
                            <span className="text-gray-600">{room.dimensions}</span>
                          </div>
                          {room.description && (
                            <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Property Price</span>
                        <span className="font-semibold">€{property.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stamp Duty (Est.)</span>
                        <span className="font-semibold">€{property.estimatedStampDuty?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Legal Fees (Est.)</span>
                        <span className="font-semibold">€{property.estimatedLegalFees?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-bold">
                        <span>Total Cost</span>
                        <span>€{(property.price + (property.estimatedStampDuty || 0) + (property.estimatedLegalFees || 0)).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <PropertyMortgageCalculator propertyPrice={property.price} />
                <PropertyStampDutyCalculator propertyPrice={property.price} propertyType={property.propertyType} />
                
                {property.priceHistory && property.priceHistory.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Price History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PriceHistoryChart data={property.priceHistory} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                {hasDocuments ? (
                  <PropertyDocuments documents={property.documents} propertyId={property.id} />
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No documents available yet</p>
                      <p className="text-sm text-gray-500 mt-2">Documents will be available once you're in advanced stages</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Actions and Agent Info */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book a Viewing</CardTitle>
                <CardDescription>
                  Schedule a time to view this property
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showBooking ? (
                  <BookingCalendar
                    propertyId={property.id}
                    onBook={handleBookViewing}
                    onCancel={() => setShowBooking(false)}
                  />
                ) : (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowBooking(true)}
                  >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Schedule Viewing
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Agent Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{property.agent.name}</p>
                    <p className="text-sm text-gray-600">{property.agent.agency}</p>
                    <p className="text-sm text-gray-600">{property.agent.license}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <VideoCall className="h-5 w-5 mr-2" />
                    Video Call
                  </Button>
                  <Button className="w-full" variant="outline">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    {property.agent.phone}
                  </Button>
                  <Button className="w-full" variant="outline">
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    Email Agent
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enquiry Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Enquiry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="I'm interested in this property..."
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    rows={4}
                  />
                  <Button
                    className="w-full"
                    onClick={handleSendEnquiry}
                    disabled={!enquiryMessage.trim()}
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Similar Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <SimilarProperties
                  currentPropertyId={property.id}
                  location={property.location}
                  propertyType={property.propertyType}
                  priceRange={{
                    min: property.price * 0.8,
                    max: property.price * 1.2
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShareDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        property={property}
      />
    </div>
  );
}