import React from 'react';
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Phone,
  Mail,
  Share2,
  Heart,
  Download,
  Video,
  Camera,
  CheckCircle,
  Home,
  Car,
  Trees,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Property } from '@/types/models/property';
import { PropertyStatus } from '@/types/enums';
import { formatPrice, formatDate } from '@/utils/format';
import { usePropertyAnalytics } from '@/hooks/usePropertyAnalytics';
import { PropertyCard } from '@/components/property/PropertyCard';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

// Lazy load heavy components
const PropertyMap = dynamic(() => import('@/components/property/PropertyMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px]" />
});

const VirtualTourViewer = dynamic(() => import('@/components/property/VirtualTourViewer'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[600px]" />
});

interface PropertyDetailResponse {
  property: Property;
  similarProperties: Array<{
    id: string;
    name: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    size: number;
    type: string;
    image: string;
  }>\n  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const analytics = usePropertyAnalytics();

  const propertyId = params.id as string;

  const [selectedImageIndexsetSelectedImageIndex] = useState(0);
  const [showGallerysetShowGallery] = useState(false);
  const [showVirtualToursetShowVirtualTour] = useState(false);
  const [showContactFormsetShowContactForm] = useState(false);
  const [isFavoritesetIsFavorite] = useState(false);

  // Fetch property details
  const { data, isLoading, error } = useQuery<PropertyDetailResponse>({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch property');
      return response.json();
    },
    staleTime: 300000, // 5 minutes
  });

  const property = data?.property;
  const similarProperties = data?.similarProperties || [];

  // Track property view
  useEffect(() => {
    if (property) {
      analytics.trackPropertyViewed({
        id: property.id,
        name: property.name,
        type: property.type,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        developmentId: property.developmentId,
        developmentName: property.development?.name,
        status: property.status}, 'property_detail');
    }
  }, [propertyanalytics]);

  // Save to favorites mutation
  const saveFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) {
        throw new Error('Please login to save favorites');
      }
      const response = await fetch(`/api/users/favorites`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId })});
      if (!response.ok) throw new Error('Failed to update favorites');
      return response.json();
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        description: isFavorite 
          ? 'Property removed from your favorites' 
          : 'Property saved to your favorites'});
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'});
    });

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.name,
        text: `Check out this property: ${property?.name}`,
        url: window.location.href}).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'Property link copied to clipboard'});
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[500px] w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">Failed to load property details</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mainImage = property.images?.[selectedImageIndex] || property.images?.[0];
  const hasMultipleImages = property.images && property.images.length> 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta */}
      <head>
        <title>{property.name} | Property Details</title>
        <meta name="description" content={property.description || `${property.bedrooms} bedroom ${property.type} for sale in ${property.location.city}`} />
      </head>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/properties">Properties</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {property.development && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/developments/${property.development.id}`}>
                      {property.development.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator / />
              )}
              <BreadcrumbItem>
                <span className="text-gray-600">{property.name}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                {/* Main Image */}
                <div className="relative h-[500px] bg-gray-100">
                  {mainImage ? (
                    <Image
                      src={mainImage.url}
                      alt={mainImage.alt || property.name}
                      fill
                      className="object-cover cursor-pointer"
                      priority
                      onClick={() => setShowGallery(true)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Camera className="h-16 w-16" />
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex((prev: any) => 
                          prev === 0 ? property.images.length - 1 : prev - 1
                        )}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex((prev: any) => 
                          prev === property.images.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {property.images && property.images.length> 0 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded">
                      {selectedImageIndex + 1} / {property.images.length}
                    </div>
                  )}

                  {/* Virtual Tour Button */}
                  {property.virtualTourUrl && (
                    <Button
                      onClick={() => setShowVirtualTour(true)}
                      className="absolute bottom-4 left-4 gap-2"
                      variant="secondary"
                    >
                      <Video className="h-4 w-4" />
                      Virtual Tour
                    </Button>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {property.images && property.images.length> 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {property.images.map((imageindex: any) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded ${
                          index === selectedImageIndex ? 'ring-2 ring-blue-600' : ''
                        }`}
                      >
                        <Image
                          src={image.thumbnailUrl || image.url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{property.name}</CardTitle>
                    <div className="flex items-center gap-1 text-gray-600 mt-2">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location.address}, {property.location.city}, {property.location.county}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(property.status)}>
                    {property.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Key Features */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Key Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Bed className="h-5 w-5 text-gray-600" />
                          <span>{property.bedrooms} Bedrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="h-5 w-5 text-gray-600" />
                          <span>{property.bathrooms} Bathrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Square className="h-5 w-5 text-gray-600" />
                          <span>{property.size} sq ft</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-gray-600" />
                          <span>{property.type.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    {property.description && (
                      <>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Description</h3>
                          <p className="text-gray-600 whitespace-pre-line">
                            {property.description}
                          </p>
                        </div>
                        <Separator / />
                    )}

                    {/* Features List */}
                    {property.features && property.features.length> 0 && (
                      <>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Features</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {property.features.map((featureindex: any) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Separator / />
                    )}

                    {/* Amenities */}
                    {property.amenities && property.amenities.length> 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((amenity: any) => (
                            <Badge key={amenity} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="specifications" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {property.specifications && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600">Total Area</p>
                            <p className="font-semibold">{property.specifications.totalArea} sq ft</p>
                          </div>
                          {property.specifications.internalArea && (
                            <div>
                              <p className="text-sm text-gray-600">Internal Area</p>
                              <p className="font-semibold">{property.specifications.internalArea} sq ft</p>
                            </div>
                          )}
                          {property.specifications.parkingSpaces !== undefined && (
                            <div>
                              <p className="text-sm text-gray-600">Parking Spaces</p>
                              <p className="font-semibold">{property.specifications.parkingSpaces}</p>
                            </div>
                          )}
                          {property.specifications.floors && (
                            <div>
                              <p className="text-sm text-gray-600">Number of Floors</p>
                              <p className="font-semibold">{property.specifications.floors}</p>
                            </div>
                          )}
                          {property.specifications.yearBuilt && (
                            <div>
                              <p className="text-sm text-gray-600">Year Built</p>
                              <p className="font-semibold">{property.specifications.yearBuilt}</p>
                            </div>
                          )}
                          {property.specifications.orientation && (
                            <div>
                              <p className="text-sm text-gray-600">Orientation</p>
                              <p className="font-semibold">{property.specifications.orientation}</p>
                            </div>
                          )}
                          {property.specifications.heatingType && (
                            <div>
                              <p className="text-sm text-gray-600">Heating</p>
                              <p className="font-semibold">{property.specifications.heatingType}</p>
                            </div>
                          )}
                          {property.specifications.windowType && (
                            <div>
                              <p className="text-sm text-gray-600">Windows</p>
                              <p className="font-semibold">{property.specifications.windowType}</p>
                            </div>
                          )}
                        </>
                      )}
                      {property.energyRating && (
                        <div>
                          <p className="text-sm text-gray-600">Energy Rating</p>
                          <p className="font-semibold">{property.energyRating}</p>
                        </div>
                      )}
                      {property.berNumber && (
                        <div>
                          <p className="text-sm text-gray-600">BER Number</p>
                          <p className="font-semibold">{property.berNumber}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="space-y-4">
                    <div className="h-[400px] rounded-lg overflow-hidden">
                      <PropertyMap
                        properties={[property]}
                        center={
                          lat: property.location.latitude,
                          lng: property.location.longitude}
                        zoom={15}
                      />
                    </div>

                    {/* Nearby Amenities */}
                    {property.location.nearbyAmenities && property.location.nearbyAmenities.length> 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-4">What's Nearby</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {property.location.nearbyAmenities.map((amenityindex: any) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                {amenity.type === 'school' && <Building className="h-5 w-5 text-gray-600" />}
                                {amenity.type === 'park' && <Trees className="h-5 w-5 text-gray-600" />}
                                {amenity.type === 'transport' && <Car className="h-5 w-5 text-gray-600" />}
                                {!['school', 'park', 'transport'].includes(amenity.type) && <MapPin className="h-5 w-5 text-gray-600" />}
                              </div>
                              <div>
                                <p className="font-medium">{amenity.name}</p>
                                <p className="text-sm text-gray-600">
                                  {amenity.distance} km • {amenity.walkingTime} min walk
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="floorplans" className="space-y-4">
                    {property.floorPlans && property.floorPlans.length> 0 ? (
                      <div className="grid gap-4">
                        {property.floorPlans.map((planindex: any) => (
                          <div key={index} className="relative">
                            <Image
                              src={plan}
                              alt={`Floor plan ${index + 1}`}
                              width={800}
                              height={600}
                              className="w-full h-auto rounded-lg"
                            />
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-4 right-4 gap-2"
                              asChild
                            >
                              <a href={plan} download>
                                <Download className="h-4 w-4" />
                                Download
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">
                        Floor plans not available yet
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Similar Properties */}
            {similarProperties.length> 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {similarProperties.map((similar: any) => (
                      <Link
                        key={similar.id}
                        href={`/properties/${similar.id}`}
                        className="group"
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-40">
                            <Image
                              src={similar.image}
                              alt={similar.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold line-clamp-1">{similar.name}</h4>
                            <p className="text-lg font-bold text-blue-600 mt-1">
                              {formatPrice(similar.price)}
                            </p>
                            <div className="flex gap-3 text-sm text-gray-600 mt-2">
                              <span>{similar.bedrooms} bed</span>
                              <span>{similar.bathrooms} bath</span>
                              <span>{similar.size} sq ft</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Price */}
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </p>
                    {property.originalPrice && property.price <property.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(property.originalPrice)}
                      </p>
                    )}
                  </div>

                  {/* Monthly Payment Estimate */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Est. Monthly Payment</p>
                    <p className="text-xl font-semibold">
                      {formatPrice(Math.round(property.price * 0.004))}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      *Based on 20% down, 3.5% interest
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {property.status === PropertyStatus.Available && (
                      <>
                        <Button className="w-full" size="lg" asChild>
                          <Link href={`/properties/${property.id}/reserve`}>
                            Reserve This Property
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="lg"
                          asChild
                        >
                          <Link href={`/properties/${property.id}/viewing`}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Viewing
                          </Link>
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowContactForm(true)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Agent
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => saveFavoriteMutation.mutate()}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Developer Info */}
            {property.development && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Development Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold">{property.development.name}</p>
                    <p className="text-sm text-gray-600">by {property.development.developer.name}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Units</span>
                    <span>{property.development.totalUnits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Units</span>
                    <span>{property.development.availableUnits}</span>
                  </div>
                  {property.development.completionDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion</span>
                      <span>{formatDate(property.development.completionDate)}</span>
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/developments/${property.development.id}`}>
                      View Development
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Have Questions?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Our property experts are here to help
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="tel:+353123456789">
                      <Phone className="h-4 w-4 mr-2" />
                      Call +353 1 234 5678
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={`mailto:info@propie.com?subject=Inquiry about ${property.name}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email Us
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {property.propertyTax && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Tax (Annual)</span>
                      <span>{formatPrice(property.propertyTax)}</span>
                    </div>
                  )}
                  {property.managementFee && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Management Fee (Monthly)</span>
                      <span>{formatPrice(property.managementFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stamp Duty (Est.)</span>
                    <span>{formatPrice(property.price * 0.01)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Legal Fees (Est.)</span>
                    <span>{formatPrice(2500)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-screen-xl">
          <DialogHeader>
            <DialogTitle>Property Gallery</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <div className="relative h-[70vh]">
              {property.images && property.images[selectedImageIndex] && (
                <Image
                  src={property.images[selectedImageIndex].url}
                  alt={property.images[selectedImageIndex].alt || property.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            {hasMultipleImages && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev: any) => 
                    prev === 0 ? property.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev: any) => 
                    prev === property.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtual Tour Modal */}
      {property.virtualTourUrl && (
        <Dialog open={showVirtualTour} onOpenChange={setShowVirtualTour}>
          <DialogContent className="max-w-screen-xl">
            <DialogHeader>
              <DialogTitle>Virtual Tour</DialogTitle>
            </DialogHeader>
            <div className="h-[70vh]">
              <VirtualTourViewer url={property.virtualTourUrl} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Helper function (import from enums in real implementation)
function getStatusColor(status: PropertyStatus): string {
  const colors: Record<PropertyStatus, string> = {
    [PropertyStatus.Available]: 'bg-green-100 text-green-800',
    [PropertyStatus.Reserved]: 'bg-orange-100 text-orange-800',
    [PropertyStatus.Sold]: 'bg-red-100 text-red-800',
    [PropertyStatus.UnderOffer]: 'bg-purple-100 text-purple-800',
    [PropertyStatus.ComingSoon]: 'bg-blue-100 text-blue-800',
    [PropertyStatus.UnderConstruction]: 'bg-yellow-100 text-yellow-800',
    [PropertyStatus.OffMarket]: 'bg-gray-100 text-gray-800',
    [PropertyStatus.Selling]: 'bg-emerald-100 text-emerald-800',
    [PropertyStatus.SaleAgreed]: 'bg-indigo-100 text-indigo-800',
    [PropertyStatus.ToLet]: 'bg-teal-100 text-teal-800'};
  return colors[status] || 'bg-gray-100 text-gray-800';
}