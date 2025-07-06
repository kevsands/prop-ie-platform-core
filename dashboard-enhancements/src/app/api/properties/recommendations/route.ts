/**
 * Property Recommendations API
 * Returns personalized property recommendations based on user profile
 * Uses the PropertyRecommendationEngine for intelligent matching
 */

import { NextRequest, NextResponse } from 'next/server';
import PropertyRecommendationEngine, { UserProfile } from '@/lib/algorithms/PropertyRecommendationEngine';
import { Property } from '@/types/properties';

// For now, using sample property data - in production this would come from your database
const sampleProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Modern 2-Bed Apartment',
    slug: 'modern-2-bed-apartment-dublin',
    projectId: 'proj-1',
    projectName: 'Fitzgerald Gardens',
    projectSlug: 'fitzgerald-gardens',
    address: { city: 'Dublin 8', state: 'Dublin', country: 'Ireland' },
    unitNumber: 'A-201',
    price: 385000,
    status: 'Available',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    floorArea: 78,
    features: ['Balcony', 'Modern Kitchen', 'Built-in Storage', 'Energy Efficient'],
    amenities: ['Gym', 'Concierge', 'Roof Garden', 'Bike Storage'],
    images: ['/api/placeholder/400/300'],
    floorPlan: '/api/placeholder/400/300',
    virtualTourUrl: 'https://example.com/virtual-tour',
    description: 'Contemporary 2-bedroom apartment with modern finishes and city views.',
    isNew: true,
    isReduced: false,
    developmentId: 'dev-1',
    developmentName: 'Fitzgerald Gardens',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'prop-2',
    name: '3-Bed Family Home',
    slug: '3-bed-family-home-dublin',
    projectId: 'proj-2',
    projectName: 'Riverside Views',
    projectSlug: 'riverside-views',
    address: { city: 'Dublin 15', state: 'Dublin', country: 'Ireland' },
    unitNumber: 'H-15',
    price: 450000,
    status: 'Available',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    floorArea: 95,
    features: ['Garden', 'Driveway', 'Garage', 'Open Plan Living'],
    amenities: ['Playground', 'Green Spaces', 'Local Schools'],
    images: ['/api/placeholder/400/300'],
    floorPlan: '/api/placeholder/400/300',
    description: 'Spacious 3-bedroom family home with private garden.',
    isNew: true,
    isReduced: false,
    developmentId: 'dev-2',
    developmentName: 'Riverside Views',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'prop-3',
    name: 'Luxury 1-Bed Studio',
    slug: 'luxury-1-bed-studio-cork',
    projectId: 'proj-3',
    projectName: 'City Central',
    projectSlug: 'city-central',
    address: { city: 'Cork', state: 'Cork', country: 'Ireland' },
    unitNumber: 'S-102',
    price: 280000,
    status: 'Available',
    type: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 0,
    floorArea: 45,
    features: ['City Views', 'High Ceilings', 'Modern Appliances'],
    amenities: ['Roof Terrace', 'Business Center', 'Reception'],
    images: ['/api/placeholder/400/300'],
    floorPlan: '/api/placeholder/400/300',
    description: 'Modern studio apartment in the heart of Cork city.',
    isNew: true,
    isReduced: true,
    developmentId: 'dev-3',
    developmentName: 'City Central',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z'
  },
  {
    id: 'prop-4',
    name: '4-Bed Executive Home',
    slug: '4-bed-executive-home-galway',
    projectId: 'proj-4',
    projectName: 'Coastal Haven',
    projectSlug: 'coastal-haven',
    address: { city: 'Galway', state: 'Galway', country: 'Ireland' },
    unitNumber: 'E-8',
    price: 625000,
    status: 'Available',
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 2,
    floorArea: 140,
    features: ['Sea Views', 'Large Garden', 'Home Office', 'Double Garage'],
    amenities: ['Beach Access', 'Golf Course', 'Country Club'],
    images: ['/api/placeholder/400/300'],
    floorPlan: '/api/placeholder/400/300',
    description: 'Executive family home with stunning sea views.',
    isNew: false,
    isReduced: false,
    developmentId: 'dev-4',
    developmentName: 'Coastal Haven',
    createdAt: '2023-12-01T12:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 'prop-5',
    name: '2-Bed Garden Apartment',
    slug: '2-bed-garden-apartment-kildare',
    projectId: 'proj-5',
    projectName: 'Green Valley',
    projectSlug: 'green-valley',
    address: { city: 'Naas', state: 'Kildare', country: 'Ireland' },
    unitNumber: 'G-7',
    price: 340000,
    status: 'Available',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    floorArea: 72,
    features: ['Private Garden', 'Ground Floor', 'Storage Room'],
    amenities: ['Landscaped Gardens', 'Children\'s Play Area', 'Walking Trails'],
    images: ['/api/placeholder/400/300'],
    floorPlan: '/api/placeholder/400/300',
    description: 'Ground floor apartment with private garden access.',
    isNew: true,
    isReduced: false,
    developmentId: 'dev-5',
    developmentName: 'Green Valley',
    createdAt: '2024-01-12T13:00:00Z',
    updatedAt: '2024-01-12T13:00:00Z'
  }
];

export async function POST(request: NextRequest) {
  try {
    const { userProfile, limit = 10 }: { userProfile: UserProfile; limit?: number } = await request.json();

    if (!userProfile) {
      return NextResponse.json({
        success: false,
        error: 'User profile is required'
      }, { status: 400 });
    }

    // In production, you would fetch properties from your database here
    // For now, using sample data
    const allProperties = sampleProperties;

    // Get personalized recommendations using the recommendation engine
    const recommendations = PropertyRecommendationEngine.recommendProperties(
      allProperties,
      userProfile,
      limit
    );

    // Add some analytics data for the response
    const analytics = {
      totalPropertiesAnalyzed: allProperties.length,
      recommendationsReturned: recommendations.length,
      averageMatchScore: recommendations.length > 0 
        ? Math.round(recommendations.reduce((sum, rec) => sum + rec.matchScore, 0) / recommendations.length)
        : 0,
      topMatchScore: recommendations.length > 0 ? recommendations[0].matchScore : 0,
      userProfileCompleteness: calculateProfileCompleteness(userProfile)
    };

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        analytics,
        userProfile: {
          ...userProfile,
          // Don't return sensitive data
          password: undefined
        }
      }
    });

  } catch (error) {
    console.error('Property recommendations error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate recommendations'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID is required'
    }, { status: 400 });
  }

  try {
    // In production, you would fetch the user profile from your database using the userId
    // For now, return sample recommendations
    const sampleUserProfile: UserProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      budget: '300-400',
      hasHTB: true,
      preferredCounties: ['Dublin'],
      propertyType: ['apartment', 'house'],
      bedrooms: '2-3',
      importantFeatures: ['parking', 'balcony', 'modern kitchen'],
      currentStatus: 'first-time-buyer',
      completionScore: 75
    };

    const recommendations = PropertyRecommendationEngine.recommendProperties(
      sampleProperties,
      sampleUserProfile,
      limit
    );

    const analytics = {
      totalPropertiesAnalyzed: sampleProperties.length,
      recommendationsReturned: recommendations.length,
      averageMatchScore: recommendations.length > 0 
        ? Math.round(recommendations.reduce((sum, rec) => sum + rec.matchScore, 0) / recommendations.length)
        : 0,
      topMatchScore: recommendations.length > 0 ? recommendations[0].matchScore : 0,
      userProfileCompleteness: calculateProfileCompleteness(sampleUserProfile)
    };

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        analytics,
        userProfile: sampleUserProfile
      }
    });

  } catch (error) {
    console.error('Property recommendations error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate recommendations'
    }, { status: 500 });
  }
}

/**
 * Calculate user profile completeness percentage
 */
function calculateProfileCompleteness(profile: UserProfile): number {
  const fields = [
    'firstName', 'lastName', 'email', 'budget', 'preferredCounties', 
    'propertyType', 'bedrooms', 'currentStatus'
  ];
  
  const completedFields = fields.filter(field => {
    const value = profile[field as keyof UserProfile];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  });
  
  return Math.round((completedFields.length / fields.length) * 100);
}