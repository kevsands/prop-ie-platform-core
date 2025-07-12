'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PropertyReservation from '@/components/property/PropertyReservation';

interface Unit {
  id: string;
  unitNumber: string;
  name: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  floorArea: number;
  basePrice: number;
  price: number;
  status: string;
  berRating: string;
  features: string[];
  images: string[];
  primaryImage: string;
  floorplans: string[];
  floor: number;
  aspect: string;
  viewCount: number;
  parkingSpaces: number;
  updatedAt: string;
  developmentId: string;
  development: {
    id: string;
    name: string;
    description: string;
    location: string;
    mainImage: string;
  } | null;
}

export default function UnitDetailPage() {
  const params = useParams();
  const unitId = params.id as string;
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUnit = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/units/${unitId}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch unit');
        }
        
        if (result.success && result.data) {
          setUnit(result.data);
        } else {
          throw new Error('Unit not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setUnit(null);
      } finally {
        setLoading(false);
      }
    };

    if (unitId) {
      fetchUnit();
    }
  }, [unitId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Loading Unit Details</h1>
          <p className="text-gray-600">Fetching unit information from live database...</p>
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unit Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The unit you're looking for doesn't exist."}</p>
          <a 
            href="/developments/fitzgerald-gardens" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to All Units
          </a>
        </div>
      </div>
    );
  }

  const handleReservation = (reservationData: any) => {
    console.log('Reservation data:', reservationData);
    // Here you would integrate with your Stripe/payment system
    alert('Reservation submitted! We will contact you shortly.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span className="mx-2">/</span>
            <a href="/developments" className="hover:text-blue-600">Developments</a>
            <span className="mx-2">/</span>
            <a href="/developments/fitzgerald-gardens" className="hover:text-blue-600">Fitzgerald Gardens</a>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Unit {unit.unitNumber}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Unit {unit.unitNumber} - {unit.development?.name || 'Fitzgerald Gardens'}
          </h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
            <span>📍 {unit.development?.location}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              unit.status === 'available' ? 'bg-green-100 text-green-800' :
              unit.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {unit.status.toUpperCase()}
            </span>
            <span>🕒 Updated {new Date(unit.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Unit Details & Reservation */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Unit Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Unit Details</h2>
            
            {/* Unit Images */}
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
              {unit.primaryImage ? (
                <img 
                  src={unit.primaryImage} 
                  alt={`Unit ${unit.unitNumber}`}
                  className="w-full h-full object-cover"
                />
              ) : unit.images && unit.images.length > 0 ? (
                <img 
                  src={unit.images[0]} 
                  alt={`Unit ${unit.unitNumber}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Unit {unit.unitNumber} Image</span>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Unit Number:</span>
                <span>{unit.unitNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{unit.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Bedrooms:</span>
                <span>{unit.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Bathrooms:</span>
                <span>{unit.bathrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Floor Area:</span>
                <span>{unit.floorArea || unit.size} m²</span>
              </div>
              {unit.floor && (
                <div className="flex justify-between">
                  <span className="font-medium">Floor:</span>
                  <span>{unit.floor}</span>
                </div>
              )}
              {unit.aspect && (
                <div className="flex justify-between">
                  <span className="font-medium">Aspect:</span>
                  <span>{unit.aspect}</span>
                </div>
              )}
              {unit.parkingSpaces > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Parking:</span>
                  <span>{unit.parkingSpaces} space{unit.parkingSpaces > 1 ? 's' : ''}</span>
                </div>
              )}
              {unit.berRating && (
                <div className="flex justify-between">
                  <span className="font-medium">BER Rating:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">{unit.berRating}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium">Price:</span>
                <span className="text-2xl font-bold text-green-600">€{(unit.price || unit.basePrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={`font-bold capitalize ${
                  unit.status === 'available' ? 'text-green-500' : 
                  unit.status === 'reserved' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {unit.status}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">Features</h3>
              {unit.features && unit.features.length > 0 ? (
                <ul className="space-y-2 text-sm text-gray-600">
                  {unit.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Modern fitted kitchen</li>
                  <li>• Energy efficient heating</li>
                  <li>• Private garden/balcony</li>
                  <li>• Allocated parking space</li>
                  <li>• Close to amenities</li>
                </ul>
              )}
            </div>

            {/* Floorplans */}
            {unit.floorplans && unit.floorplans.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3">Floorplans</h3>
                <div className="grid grid-cols-1 gap-4">
                  {unit.floorplans.map((floorplan, index) => (
                    <div key={index} className="border rounded-lg p-2">
                      <img 
                        src={floorplan} 
                        alt={`Floorplan ${index + 1}`}
                        className="w-full h-auto rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reservation Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PropertyReservation
              propertyId={unit.id}
              propertyName={`Unit ${unit.unitNumber} - ${unit.development?.name || 'Fitzgerald Gardens'}`}
              propertyType={unit.type}
              propertyPrice={unit.price || unit.basePrice}
              propertyImage={unit.primaryImage || (unit.images && unit.images.length > 0 ? unit.images[0] : "/placeholder-unit.jpg")}
              onReserve={handleReservation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}