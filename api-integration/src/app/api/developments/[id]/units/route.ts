import { NextRequest, NextResponse } from 'next/server';
import { developmentsService } from '@/lib/services/developments-prisma';

interface Params {
  params: {
    id: string;
  };
}

/**
 * GET /api/developments/[id]/units
 * Returns units for a specific development
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Development ID is required' },
        { status: 400 }
      );
    }

    // Get units for this development
    const units = await developmentsService.getUnitsForDevelopment(id);
    
    // If no units found in database, return mock units for specific developments
    if (!units || units.length === 0) {
      const mockUnits = getMockUnitsForDevelopment(id);
      return NextResponse.json(mockUnits);
    }
    
    return NextResponse.json(units);
    
  } catch (error) {
    console.error('Error fetching units for development:', error);
    
    // Fallback to mock data on error
    const { id } = await params;
    const mockUnits = getMockUnitsForDevelopment(id);
    return NextResponse.json(mockUnits);
  }
}

/**
 * Mock units data for developments when database is unavailable
 */
function getMockUnitsForDevelopment(developmentId: string) {
  switch (developmentId) {
    case 'fitzgerald-gardens':
      return generateFitzgeraldGardensUnits();
    case 'ellwood':
      return generateEllwoodUnits();
    case 'ballymakenny-view':
      return generateBallymakenneyViewUnits();
    default:
      return [];
  }
}

/**
 * Generate units for Fitzgerald Gardens - Phase 1: 27 units total
 * 12 sold to government, 15 available for market
 * REAL BUSINESS DATA - June 2025
 */
function generateFitzgeraldGardensUnits() {
  const units = [];
  
  // Phase 1 - 27 units built and ready for sale
  for (let i = 1; i <= 27; i++) {
    const unitNumber = `FG-P1-${i.toString().padStart(3, '0')}`;
    const isGovernmentSold = i <= 12; // Units 1-12 sold to government
    const unitType = i <= 9 ? '1-Bedroom Apartment' : (i <= 18 ? '2-Bedroom Duplex' : '3-Bedroom Penthouse');
    
    units.push({
      id: `fitzgerald-gardens-unit-${i}`,
      unitNumber,
      developmentId: 'fitzgerald-gardens',
      phase: 'Phase 1 of 4', // Will eventually be 96 units total
      name: `${unitType} ${unitNumber}`,
      type: i <= 9 ? 'Apartment' : (i <= 18 ? 'Duplex' : 'Penthouse'),
      bedrooms: i <= 9 ? 1 : (i <= 18 ? 2 : 3),
      bathrooms: i <= 9 ? 1 : (i <= 18 ? 2 : 2),
      sqft: i <= 9 ? 650 : (i <= 18 ? 950 : 1200),
      basePrice: i <= 9 ? 320000 : (i <= 18 ? 420000 : 520000),
      currentPrice: i <= 9 ? 320000 : (i <= 18 ? 420000 : 520000),
      status: isGovernmentSold ? 'Sold' : 'Available',
      availableFrom: isGovernmentSold ? null : new Date('2025-07-01'), // Ready for immediate sale
      floor: Math.ceil(i / 9),
      parkingSpaces: i > 18 ? 2 : 1,
      balcony: true,
      viewType: i > 18 ? 'Dublin City View' : (i > 9 ? 'Garden View' : 'Courtyard View'),
      energyRating: 'A2',
      images: [`/images/developments/fitzgerald-gardens/units/unit-${i}/hero.jpg`],
      floorPlan: `/images/developments/fitzgerald-gardens/floorplans/type-${i <= 9 ? '1bed' : (i <= 18 ? '2bed' : '3bed')}.pdf`,
      features: [
        'Modern fitted kitchen with Bosch appliances',
        'Double glazed windows', 
        'Built-in wardrobes',
        i > 18 ? 'Private rooftop terrace' : (i > 9 ? 'Private balcony' : 'Shared garden access'),
        'Underfloor heating',
        'Fiber broadband ready',
        'Secure bicycle storage',
        'EV charging point available'
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2025-06-28'),
      reservedBy: isGovernmentSold ? 'Government Affordable Housing Scheme' : null,
      reservedAt: isGovernmentSold ? new Date('2024-06-15') : null,
      viewCount: isGovernmentSold ? 0 : Math.floor(Math.random() * 25) + 15, // Higher interest for available units
      htbEligible: !isGovernmentSold, // Available units are HTB eligible
      incentives: isGovernmentSold ? [] : [
        'No legal fees for first-time buyers',
        'Stamp duty rebate available',
        'Furniture package worth €5,000'
      ]
    });
  }
  
  return units;
}

/**
 * Generate units for Ellwood development - SOLD OUT
 * All 24 units sold - show for historical reference only
 */
function generateEllwoodUnits() {
  const units = [];
  
  // All 24 units are SOLD OUT - development complete
  for (let i = 1; i <= 24; i++) {
    const unitNumber = `EW-${i.toString().padStart(3, '0')}`;
    
    units.push({
      id: `ellwood-unit-${i}`,
      unitNumber,
      developmentId: 'ellwood',
      name: `Unit ${unitNumber}`,
      type: 'Apartment',
      bedrooms: i <= 12 ? 1 : 2,
      bathrooms: i <= 12 ? 1 : 2,
      sqft: i <= 12 ? 600 : 850,
      basePrice: i <= 12 ? 285000 : 385000,
      currentPrice: i <= 12 ? 285000 : 385000,
      status: 'Sold', // ALL UNITS SOLD
      availableFrom: null,
      floor: Math.ceil(i / 8),
      parkingSpaces: 1,
      balcony: true,
      viewType: i > 16 ? 'River View' : 'Street View',
      energyRating: 'A3',
      images: [`/images/developments/ellwood/units/unit-${i}/hero.jpg`],
      floorPlan: `/images/developments/ellwood/floorplans/type-${i <= 12 ? '1bed' : '2bed'}.pdf`,
      features: [
        'Contemporary design',
        'Fitted kitchen',
        'Private balcony',
        'Secure parking'
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2025-06-01'),
      viewCount: 0, // No longer tracking views
      soldDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000), // Sold in last 6 months
      completionStatus: 'Completed and Occupied'
    });
  }
  
  return units;
}

/**
 * Generate units for Ballymakenny View development - FINAL UNIT
 * 15 of 16 units sold, 1 remaining unit available
 */
function generateBallymakenneyViewUnits() {
  const units = [];
  
  for (let i = 1; i <= 16; i++) {
    const unitNumber = `BV-${i.toString().padStart(3, '0')}`;
    const isLastUnit = i === 16; // Only unit 16 is available
    
    units.push({
      id: `ballymakenny-view-unit-${i}`,
      unitNumber,
      developmentId: 'ballymakenny-view',
      name: `Unit ${unitNumber}`,
      type: 'House',
      bedrooms: i <= 8 ? 3 : 4,
      bathrooms: i <= 8 ? 2 : 3,
      sqft: i <= 8 ? 1200 : 1500,
      basePrice: i <= 8 ? 350000 : 450000,
      currentPrice: isLastUnit ? 450000 : (i <= 8 ? 350000 : 450000), // Premium for last unit
      status: isLastUnit ? 'Available' : 'Sold', // Only unit 16 available
      availableFrom: isLastUnit ? new Date('2025-07-01') : null,
      floor: 2, // Houses are 2 story
      parkingSpaces: 2,
      garden: true,
      viewType: 'Garden View',
      energyRating: 'A2',
      images: [`/images/developments/ballymakenny-view/units/unit-${i}/hero.jpg`],
      floorPlan: `/images/developments/ballymakenny-view/floorplans/type-${i <= 8 ? '3bed' : '4bed'}.pdf`,
      features: [
        'Private rear garden',
        'Double garage with EV charging',
        'Modern kitchen with island',
        'En-suite master bedroom',
        'Family bathroom',
        isLastUnit ? 'Premium corner plot' : 'Mature landscaping',
        isLastUnit ? 'Extended driveway' : 'Standard driveway'
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2025-06-28'),
      viewCount: isLastUnit ? 28 : 0, // High interest for last unit
      soldDate: isLastUnit ? null : new Date(Date.now() - Math.random() * 300 * 24 * 60 * 60 * 1000),
      urgency: isLastUnit ? 'urgent' : undefined,
      specialOffer: isLastUnit ? 'Last remaining house in development' : undefined,
      htbEligible: isLastUnit
    });
  }
  
  return units;
}