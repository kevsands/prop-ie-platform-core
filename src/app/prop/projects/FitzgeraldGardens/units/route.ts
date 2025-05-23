import { NextRequest, NextResponse } from 'next/server';

/**
 * FitzgeraldGardens units listing endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Mock data for demonstration purposes
    const unitsData = [
      {
        id: 'fg-unit-1',
        name: 'Apartment 1, Block A',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        size: 85, // square meters
        price: 325000,
        status: 'sold',
        features: [
          'Modern kitchen',
          'Balcony',
          'Parking space'
        ],
        floorPlan: '/images/floor-plans/type-a.jpg'
      },
      {
        id: 'fg-unit-2',
        name: 'Apartment 2, Block A',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        size: 85, // square meters
        price: 325000,
        status: 'available',
        features: [
          'Modern kitchen',
          'Balcony',
          'Parking space'
        ],
        floorPlan: '/images/floor-plans/type-a.jpg'
      },
      {
        id: 'fg-unit-3',
        name: 'Apartment 3, Block A',
        type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        size: 105, // square meters
        price: 385000,
        status: 'reserved',
        features: [
          'Modern kitchen',
          'Balcony',
          'Parking space',
          'Storage unit'
        ],
        floorPlan: '/images/floor-plans/type-b.jpg'
      }
    ];

    return NextResponse.json(unitsData);
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch units data' },
      { status: 500 }
    );
  }
}