'use client';

import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, Circle, useJsApiLoader } from '@react-google-maps/api';
import {
  MapPinIcon,
  TrainIcon,
  AcademicCapIcon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  HeartIcon,
  ArchiveBoxIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface PropertyLocation {
  area: string;
  county: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  eircode?: string;
}

interface PropertyMapProps {
  location: PropertyLocation;
  propertyName: string;
}

interface NearbyPlace {
  id: string;
  name: string;
  type: 'school' | 'transport' | 'shopping' | 'healthcare' | 'recreation' | 'restaurant';
  distance: string;
  walkTime: string;
  rating?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  mapTypeControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Mock nearby places data - in production this would come from Google Places API
const mockNearbyPlaces: NearbyPlace[] = [
  {
    id: '1',
    name: 'Scoil Mhuire Primary School',
    type: 'school',
    distance: '0.3km',
    walkTime: '4 min',
    rating: 4.5,
    coordinates: { lat: 53.3498 + 0.003, lng: -6.2603 + 0.002 }
  },
  {
    id: '2',
    name: 'Pearse Station',
    type: 'transport',
    distance: '0.8km',
    walkTime: '10 min',
    rating: 4.2,
    coordinates: { lat: 53.3498 - 0.005, lng: -6.2603 + 0.003 }
  },
  {
    id: '3',
    name: 'Tesco Express',
    type: 'shopping',
    distance: '0.2km',
    walkTime: '3 min',
    rating: 4.0,
    coordinates: { lat: 53.3498 + 0.001, lng: -6.2603 - 0.001 }
  },
  {
    id: '4',
    name: 'St. Vincent\'s Hospital',
    type: 'healthcare',
    distance: '1.2km',
    walkTime: '15 min',
    rating: 4.3,
    coordinates: { lat: 53.3498 - 0.008, lng: -6.2603 - 0.005 }
  }];

export default function PropertyMap({ location, propertyName }: PropertyMapProps) {
  const [selectedPlacesetSelectedPlace] = useState<NearbyPlace | null>(null);
  const [selectedTabsetSelectedTab] = useState('overview');
  const [showWalkingRadiussetShowWalkingRadius] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geometry']
  });

  const center = {
    lat: location.coordinates.lat,
    lng: location.coordinates.lng
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'school':
        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2};
      case 'transport':
        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2};
      case 'shopping':
        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#8B5CF6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2};
      case 'healthcare':
        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#EF4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2};
      default:
        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#6B7280',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2};
    }
  };

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Unable to load map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="absolute inset-0">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={defaultMapOptions}
          onLoad={onMapLoad}
        >
          {/* Property Marker */}
          <Marker
            position={center}
            title={propertyName}
            icon={
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(4848)
            }
          />

          {/* Walking radius circles */}
          {showWalkingRadius && (
            <>
              <Circle
                center={center}
                radius={250} // 3 min walk
                options={
                  fillColor: '#3B82F6',
                  fillOpacity: 0.1,
                  strokeColor: '#3B82F6',
                  strokeOpacity: 0.3,
                  strokeWeight: 1}
              />
              <Circle
                center={center}
                radius={500} // 6 min walk
                options={
                  fillColor: '#3B82F6',
                  fillOpacity: 0.05,
                  strokeColor: '#3B82F6',
                  strokeOpacity: 0.2,
                  strokeWeight: 1}
              />
              <Circle
                center={center}
                radius={1000} // 12 min walk
                options={
                  fillColor: '#3B82F6',
                  fillOpacity: 0.02,
                  strokeColor: '#3B82F6',
                  strokeOpacity: 0.1,
                  strokeWeight: 1}
              / />
          )}

          {/* Nearby Places Markers */}
          {mockNearbyPlaces.map((place: any) => (
            <Marker
              key={place.id}
              position={place.coordinates}
              title={place.name}
              icon={getMarkerIcon(place.type)}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {/* Info Window */}
          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.coordinates}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold">{selectedPlace.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedPlace.distance} • {selectedPlace.walkTime} walk
                </p>
                {selectedPlace.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-sm">★ {selectedPlace.rating}</span>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-semibold mb-3">Neighborhood Overview</h3>

        <div className="space-y-2 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showWalkingRadius}
              onChange={(e: any) => setShowWalkingRadius(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Show walking distances</span>
          </label>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-[300px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{location.area}, {location.county}</span>
              </div>
              {location.eircode && (
                <div className="flex items-center text-sm">
                  <HomeModernIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{location.eircode}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t space-y-2">
              <p className="text-sm font-semibold">Walk Score™</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-green-500" />
                </div>
                <span className="text-sm font-semibold">82</span>
              </div>
              <p className="text-xs text-gray-600">Very Walkable - Most errands can be accomplished on foot</p>
            </div>
          </TabsContent>

          <TabsContent value="transport" className="space-y-2">
            {mockNearbyPlaces
              .filter(place => place.type === 'transport')
              .map(place => (
                <div key={place.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <TrainIcon className="h-4 w-4 mr-2 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{place.name}</p>
                      <p className="text-xs text-gray-600">{place.walkTime} walk</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{place.distance}</Badge>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="amenities" className="space-y-2">
            {mockNearbyPlaces
              .filter(place => place.type !== 'transport')
              .map(place => (
                <div key={place.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    {place.type === 'school' && <AcademicCapIcon className="h-4 w-4 mr-2 text-blue-600" />}
                    {place.type === 'shopping' && <ShoppingBagIcon className="h-4 w-4 mr-2 text-purple-600" />}
                    {place.type === 'healthcare' && <HeartIcon className="h-4 w-4 mr-2 text-red-600" />}
                    <div>
                      <p className="text-sm font-medium">{place.name}</p>
                      <p className="text-xs text-gray-600">{place.walkTime} walk</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{place.distance}</Badge>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Street View Button */}
      <div className="absolute bottom-4 right-4">
        <Button
          onClick={() => {
            const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${location.coordinates.lat},${location.coordinates.lng}`;
            window.open(streetViewUrl, '_blank');
          }
          className="bg-white text-gray-900 hover:bg-gray-100"
        >
          <img 
            src="https://maps.gstatic.com/mapfiles/api-3/images/sv9.png" 
            alt="Street View"
            className="h-6 w-6 mr-2"
          />
          Street View
        </Button>
      </div>
    </div>
  );
}