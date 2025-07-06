'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ViewingScheduler from '@/features/viewing-scheduler/ViewingScheduler';
import VirtualViewing from '@/features/virtual-viewing/VirtualViewing';
import ViewingHistory from '@/features/viewing-history/ViewingHistory';
import { Property } from '@/types/property';
import {
  Calendar,
  Video,
  History,
  MapPin,
  Home,
  Bed,
  Bath,
  Car,
  Ruler,
  Share2,
  Heart,
  MessageSquare,
  Phone,
  Mail,
  Navigation,
  Euro,
  Info,
  ChevronLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PropertyViewingPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const [activeTab, setActiveTab] = useState('schedule');
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch property details
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch property');
      return response.json();
    }
  });

  // Handle favorite toggle
  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    // API call to update favorite status
    await fetch(`/api/favorites/${propertyId}`, {
      method: isFavorite ? 'DELETE' : 'POST'
    });
  };

  // Handle share
  const handleShare = async () => {
    const shareData = {
      title: property?.title || 'Property',
      text: `Check out this property: ${property?.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Show toast notification
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find the property you're looking for.
              </p>
              <Button onClick={() => router.push('/properties')}>
                Back to Properties
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{property.title}</h1>
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {property.address}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFavorite}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Overview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={property.imageUrl || '/placeholder.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 left-4">
                    {property.status}
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur rounded-lg p-3 text-white">
                      <p className="text-2xl font-bold mb-1">
                        €{property.price.toLocaleString()}
                      </p>
                      <p className="text-sm opacity-90">
                        €{Math.round(property.price / property.area).toLocaleString()}/m²
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Bed className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bath className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.area}m²</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.parking} Parking</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Key Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features?.slice(0, 6).map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Contact Agent</h3>
                    <div className="space-y-2">
                      <Button className="w-full" variant="default">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Agent
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Viewing Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="schedule" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="virtual" className="flex items-center space-x-2">
                  <Video className="h-4 w-4" />
                  <span>Virtual Tour</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="schedule">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ViewingScheduler
                      property={property}
                      onScheduled={(viewing) => {
                        console.log('Viewing scheduled:', viewing);
                        // Handle post-scheduling actions
                      }}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="virtual">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <VirtualViewing property={property} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="history">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ViewingHistory propertyId={property.id} />
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Additional Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Navigation className="h-5 w-5" />
                    <span>Getting There</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">By Car</p>
                      <p className="text-sm">15 mins from city center</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Public Transport</p>
                      <p className="text-sm">Bus routes 46, 145 (5 min walk)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nearby</p>
                      <p className="text-sm">Schools, shops, parks within 10 min</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-5 w-5" />
                    <span>Viewing Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Take photos and notes during your visit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Check water pressure and electrical outlets</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Ask about service charges and utilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Explore the neighborhood before/after</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Viewing Checklist
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}