'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, CheckCircle } from 'lucide-react';
import { getUnitIdentifier } from '@/lib/utils/status-helpers';

interface DevelopmentDetailClientProps {
  initialDevelopmentId: string;
}

export default function DevelopmentDetailClient({ initialDevelopmentId }: DevelopmentDetailClientProps) {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const developmentId = initialDevelopmentId;

  // Load units data from API
  useEffect(() => {
    const loadUnits = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/units?developmentId=${developmentId}`);
        if (!response.ok) {
          throw new Error('Failed to load units');
        }
        
        const result = await response.json();
        setUnits(result.units || []);
        
      } catch (err) {
        console.error('Error loading units:', err);
        setError('Failed to load unit data');
      } finally {
        setLoading(false);
      }
    };

    if (developmentId) {
      loadUnits();
    }
  }, [developmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Fitzgerald Gardens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Development</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const availableUnits = units.filter(unit => unit.status === 'AVAILABLE');
  const soldUnits = units.filter(unit => unit.status === 'SOLD');
  const reservedUnits = units.filter(unit => unit.status === 'RESERVED');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gray-900">
        <div className="absolute inset-0">
          <img 
            src="/images/developments/fitzgerald-gardens/main-hero.jpg" 
            alt="Fitzgerald Gardens"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Fitzgerald Gardens</h1>
            <div className="flex items-center mb-6">
              <Home className="h-6 w-6 mr-3" />
              <span className="text-xl">Premium Homes in Drogheda</span>
            </div>
            <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed">
              2, 3 and 4 bedroom premium apartments with modern amenities
            </p>
            <div className="flex flex-wrap gap-6 text-lg">
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                <span>{units.length} Premium Units</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>From €320,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Unit Availability */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Live Unit Availability</h2>
            <p className="text-xl text-gray-600">
              Real-time updates from developer management system
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-gray-600">Live data sync enabled</span>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{availableUnits.length}</div>
              <div className="text-green-800 font-medium">Available Units</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{reservedUnits.length}</div>
              <div className="text-blue-800 font-medium">Reserved Units</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{soldUnits.length}</div>
              <div className="text-purple-800 font-medium">Sold Units</div>
            </div>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <div key={unit.id} className="bg-white rounded-lg shadow-lg overflow-hidden border">
                <img 
                  src={unit.primaryImage || '/images/developments/fitzgerald-gardens/units/default.jpg'} 
                  alt={unit.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{unit.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      unit.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                      unit.status === 'RESERVED' ? 'bg-blue-100 text-blue-800' :
                      unit.status === 'SOLD' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {unit.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-semibold text-gray-900">€{unit.basePrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bedrooms:</span>
                      <span className="font-semibold text-gray-900">{unit.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bathrooms:</span>
                      <span className="font-semibold text-gray-900">{unit.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="font-semibold text-gray-900">{unit.size}m²</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      href={`/developments/${developmentId}/units/${getUnitIdentifier(unit)}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    {unit.status === 'AVAILABLE' && (
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Reserve Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {units.length === 0 && (
            <div className="text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Units Available</h3>
              <p className="text-gray-600">Please check back later for updated availability.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}