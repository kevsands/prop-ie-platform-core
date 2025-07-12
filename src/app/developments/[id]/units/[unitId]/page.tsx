'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  Calendar, 
  Euro, 
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Home,
  Zap,
  Shield,
  Award
} from 'lucide-react';

import { unitsService, Unit } from '@/lib/services/units';
import { developmentsService } from '@/lib/services/developments-prisma';
import { HelpToBuyCalculator } from '@/components/calculators/HelpToBuyCalculator';
import PropertyReservation from '@/components/property/PropertyReservation';
import { formatDevelopmentLocation } from '@/lib/utils/status-helpers';

export default function UniversalUnitPage() {
  const params = useParams();
  const router = useRouter();
  const developmentId = params.id as string;
  const unitId = params.unitId as string;

  const [unit, setUnit] = useState<Unit | null>(null);
  const [development, setDevelopment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHTBCalculator, setShowHTBCalculator] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarUnits, setSimilarUnits] = useState<Unit[]>([]);

  useEffect(() => {
    loadUnitData();
  }, [developmentId, unitId]);

  const loadUnitData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load unit and development data in parallel
      const [developmentData, unitData] = await Promise.all([
        developmentsService.getDevelopments({ isPublished: true }).then(devs => 
          devs.find(dev => dev.id === developmentId)
        ),
        fetchUnitData(unitId)
      ]);

      if (!developmentData) {
        setError('Development not found');
        return;
      }

      if (!unitData) {
        setError('Unit not found');
        return;
      }

      setDevelopment(developmentData);
      setUnit(unitData);

      // Load similar units in this development
      loadSimilarUnits(developmentId, unitData);

      // Increment view count
      await unitsService.incrementViewCount(unitId);

    } catch (error) {
      console.error('Error loading unit data:', error);
      setError('Failed to load unit information');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitData = async (unitId: string): Promise<Unit | null> => {
    try {
      // First try the developer API which has the most complete data
      const projectResponse = await fetch(`/api/projects/${developmentId}`);
      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        if (projectData.success && projectData.data && projectData.data.units) {
          // Find unit by number (001 -> "1") or by ID
          const unit = projectData.data.units.find((u: any) => 
            u.number === unitId || 
            u.number === unitId.replace(/^0+/, '') || 
            u.id === unitId ||
            u.id === `unit-${developmentId}-${unitId}`
          );
          
          if (unit) {
            console.log('🔍 Raw unit data from developer API:', unit);
            
            // Transform developer data to buyer format with complete mapping
            const transformedUnit = {
              id: unit.id,
              unitNumber: unit.number,
              name: `Unit ${unit.number}`,
              type: unit.type,
              bedrooms: unit.physical?.bedrooms || 0,
              bathrooms: unit.physical?.bathrooms || 0,
              size: unit.physical?.sqft || 0,
              sqm: unit.physical?.sqm || 0,
              basePrice: unit.pricing?.basePrice || 0,
              price: unit.pricing?.currentPrice || unit.pricing?.basePrice || 0,
              status: unit.status?.toUpperCase() || 'AVAILABLE',
              building: unit.physical?.building || '',
              features: unit.features || [],
              amenities: unit.amenities || [],
              images: unit.images || [],
              primaryImage: unit.images?.[0] || `/images/developments/${developmentId}/placeholder.jpg`,
              floorPlan: unit.floorPlan || '',
              parkingSpaces: unit.parking || 1,
              viewCount: Math.floor(Math.random() * 50) + 10,
              berRating: 'A',
              aspect: unit.physical?.aspect || 'N',
              floor: unit.physical?.floor || 0,
              reservationDeposit: unit.pricing?.reservationDeposit || 0,
              
              // Sale information (privacy-filtered for buyers)
              ...(unit.status === 'sold' && {
                soldDate: unit.sale?.saleDate,
                isUnderOffer: false
              }),
              ...(unit.status === 'reserved' && {
                reservedDate: unit.sale?.reservationDate,
                isUnderOffer: true
              })
            };
            
            console.log('✅ Transformed unit for buyer view:', transformedUnit);
            return transformedUnit;
          }
        }
      }

      // Fallback to original units API
      const response = await fetch(`/api/units/${unitId}`);
      if (response.ok) {
        const unitData = await response.json();
        return unitData.data || unitData;
      }

      // Last resort: search through all units
      const allUnitsResponse = await fetch('/api/units');
      if (allUnitsResponse.ok) {
        const allUnitsData = await allUnitsResponse.json();
        return allUnitsData.data?.find((u: Unit) => 
          u.id === unitId || u.unitNumber === unitId
        ) || null;
      }

      return null;
    } catch (error) {
      console.error('Error fetching unit:', error);
      return null;
    }
  };

  const loadSimilarUnits = async (developmentId: string, currentUnit: Unit) => {
    try {
      // Use the same developer API for consistency
      const projectResponse = await fetch(`/api/projects/${developmentId}`);
      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        if (projectData.success && projectData.data && projectData.data.units) {
          // Transform all units and filter similar ones
          const allUnits = projectData.data.units.map((unit: any) => ({
            id: unit.id,
            unitNumber: unit.number,
            name: `Unit ${unit.number}`,
            type: unit.type,
            bedrooms: unit.physical?.bedrooms || 0,
            bathrooms: unit.physical?.bathrooms || 0,
            size: unit.physical?.sqft || 0,
            sqm: unit.physical?.sqm || 0,
            basePrice: unit.pricing?.basePrice || 0,
            price: unit.pricing?.currentPrice || unit.pricing?.basePrice || 0,
            status: unit.status?.toUpperCase() || 'AVAILABLE',
            primaryImage: unit.images?.[0] || `/images/developments/${developmentId}/placeholder.jpg`,
          }));
          
          // Filter out current unit and get similar ones (same type or bedroom count)
          const similar = allUnits
            .filter((u: Unit) => u.id !== currentUnit.id)
            .filter((u: Unit) => u.type === currentUnit.type || u.bedrooms === currentUnit.bedrooms)
            .slice(0, 3);
            
          setSimilarUnits(similar);
          return;
        }
      }
      
      // Fallback to original API
      const response = await fetch(`/api/units?developmentId=${developmentId}&limit=6`);
      if (response.ok) {
        const data = await response.json();
        const units = data.data || [];
        const similar = units
          .filter((u: Unit) => u.id !== currentUnit.id)
          .slice(0, 3);
        setSimilarUnits(similar);
      }
    } catch (error) {
      console.error('Error loading similar units:', error);
    }
  };

  const handleReservation = async (reservationData: any) => {
    try {
      // Handle reservation submission
      console.log('Reservation data:', reservationData);
      
      // Here you would integrate with your reservation system
      // For now, show success message
      alert('Reservation submitted successfully! We will contact you shortly.');
      
      // Refresh unit data to update status
      await loadUnitData();
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Error submitting reservation. Please try again.');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return { 
          label: 'Available Now', 
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          color: 'text-green-500'
        };
      case 'RESERVED':
        return { 
          label: 'Reserved', 
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: AlertCircle,
          color: 'text-yellow-500'
        };
      case 'SOLD':
        return { 
          label: 'Sold', 
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: CheckCircle,
          color: 'text-red-500'
        };
      default:
        return { 
          label: 'Coming Soon', 
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Calendar,
          color: 'text-blue-500'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading unit details...</p>
        </div>
      </div>
    );
  }

  if (error || !unit || !development) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Unit Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The unit you're looking for doesn't exist or has been removed.
          </p>
          <div className="space-x-4">
            <Link 
              href={`/developments/${developmentId}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Units
            </Link>
            <Link 
              href="/properties/search"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Search Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(unit.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/developments" className="hover:text-blue-600">Developments</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/developments/${developmentId}`} className="hover:text-blue-600">
              {development.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">
              Unit {unit.unitNumber || unit.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Unit Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Unit Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Unit {unit.unitNumber || unit.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {unit.type} • {unit.bedrooms} Bedroom • {development.name}
                  </p>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{formatDevelopmentLocation(development.location)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.className} mb-4`}>
                    <StatusIcon className={`w-4 h-4 mr-1 ${statusInfo.color}`} />
                    {statusInfo.label}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    €{(unit.price || unit.basePrice).toLocaleString()}
                  </div>
                  {unit.price !== unit.basePrice && unit.price && (
                    <div className="text-sm text-gray-500 mt-1">
                      Base price: €{unit.basePrice.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Bed className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <div className="text-lg font-semibold">{unit.bedrooms}</div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <div className="text-lg font-semibold">{unit.bathrooms}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Maximize className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <div className="text-lg font-semibold">{unit.size}</div>
                  <div className="text-sm text-gray-500">sqm</div>
                </div>
                <div className="text-center">
                  <Car className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <div className="text-lg font-semibold">{unit.parkingSpaces}</div>
                  <div className="text-sm text-gray-500">Parking</div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <Image
                    src={unit.images?.[selectedImageIndex] || unit.primaryImage || '/images/unit-placeholder.jpg'}
                    alt={`Unit ${unit.unitNumber || unit.name} - Image ${selectedImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Thumbnail Images */}
                {unit.images && unit.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {unit.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Unit thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Features & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unit.features?.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                )) || (
                  <>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Modern fitted kitchen</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Energy efficient heating</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Premium finishes</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">BER {unit.berRating || 'A'} rated</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Similar Units */}
            {similarUnits.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Similar Units in {development.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {similarUnits.map((similarUnit) => (
                    <Link
                      key={similarUnit.id}
                      href={`/developments/${developmentId}/units/${similarUnit.unitNumber || similarUnit.id}`}
                      className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={similarUnit.primaryImage || '/images/unit-placeholder.jpg'}
                          alt={`Unit ${similarUnit.unitNumber || similarUnit.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-semibold">Unit {similarUnit.unitNumber || similarUnit.name}</h3>
                      <p className="text-sm text-gray-600">{similarUnit.bedrooms} bed • {similarUnit.size} sqm</p>
                      <p className="text-lg font-bold text-blue-600">€{(similarUnit.price || similarUnit.basePrice).toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            
            {/* Reservation/Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {unit.status === 'AVAILABLE' ? (
                <PropertyReservation
                  propertyId={unit.id}
                  propertyName={`Unit ${unit.unitNumber || unit.name}`}
                  propertyType={unit.type}
                  propertyPrice={unit.price || unit.basePrice}
                  propertyImage={unit.primaryImage || '/images/unit-placeholder.jpg'}
                  onReserve={handleReservation}
                />
              ) : (
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusInfo.className} mb-4`}>
                    <StatusIcon className={`w-4 h-4 mr-1 ${statusInfo.color}`} />
                    {statusInfo.label}
                  </div>
                  <h3 className="text-lg font-semibold mb-4">Interested in this unit?</h3>
                  <p className="text-gray-600 mb-6">
                    Register your interest and we'll notify you of similar units or if this becomes available again.
                  </p>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Register Interest
                  </button>
                </div>
              )}
            </div>

            {/* Help to Buy Calculator */}
            {(unit.price || unit.basePrice) <= 500000 && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                <div className="flex items-center mb-4">
                  <Euro className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-800">Help to Buy Eligible</h3>
                </div>
                <p className="text-green-700 mb-4">
                  This unit qualifies for the Help to Buy scheme. You could get up to €30,000 back.
                </p>
                <button
                  onClick={() => setShowHTBCalculator(true)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Calculate Help to Buy
                </button>
              </div>
            )}

            {/* Development Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Development Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Development:</span>
                  <Link 
                    href={`/developments/${developmentId}`}
                    className="ml-2 text-blue-600 hover:text-blue-700"
                  >
                    {development.name}
                  </Link>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Location:</span>
                  <span className="ml-2">{formatDevelopmentLocation(development.location)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Unit Views:</span>
                  <span className="ml-2">{unit.viewCount || 0}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Link
                  href={`/developments/${developmentId}`}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
                >
                  View All Units in {development.name}
                </Link>
              </div>
            </div>

            {/* Contact Sales Office */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Sales Office</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span>+353 1 234 5678</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span>sales@{developmentId.replace('-', '')}.ie</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Schedule Viewing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Help to Buy Calculator Modal */}
      {showHTBCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Help to Buy Calculator</h2>
                <button
                  onClick={() => setShowHTBCalculator(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <HelpToBuyCalculator
                propertyPrice={unit.price || unit.basePrice}
                onClose={() => setShowHTBCalculator(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}