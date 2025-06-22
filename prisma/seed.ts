import { PrismaClient } from '@prisma/client';
import { elizabethWalkData } from '../src/data/elizabeth-walk-data';
import { fitzgeraldGardensConfig } from '../src/data/fitzgerald-gardens-config';
import { mockProperties, mockDevelopments } from '../src/data/mock-models';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive data migration...');
  
  // Clear existing data (only clear tables that exist)
  console.log('🧹 Clearing existing data...');
  try {
    await prisma.unit.deleteMany();
  } catch (e) {
    console.log('Units table doesn\'t exist, skipping...');
  }
  try {
    await prisma.development.deleteMany();
  } catch (e) {
    console.log('Development table doesn\'t exist, skipping...');
  }

  // Create Fitzgerald Gardens Development
  console.log('🏗️ Creating Fitzgerald Gardens development...');
  const fitzgeraldGardens = await prisma.development.create({
    data: {
      id: 'fitzgerald-gardens',
      name: fitzgeraldGardensConfig.projectName,
      location: fitzgeraldGardensConfig.location,
      description: fitzgeraldGardensConfig.description,
      totalUnits: fitzgeraldGardensConfig.totalUnits,
      availableUnits: fitzgeraldGardensConfig.availableForSale,
      startingPrice: fitzgeraldGardensConfig.unitTypes['1_bed_apartment'].basePrice,
      completion: fitzgeraldGardensConfig.completionPercentage,
      featured: true,
      status: 'ACTIVE',
      phase: fitzgeraldGardensConfig.currentPhase,
      amenities: [
        'Modern Kitchen with Premium Appliances',
        'Underfloor Heating',
        'High-Efficiency Windows',
        'Private Balconies',
        'Secure Parking',
        'Landscaped Gardens',
        'Concierge Service',
        'Fitness Suite'
      ],
      images: [
        '/images/developments/fitzgerald-gardens/exterior-1.jpg',
        '/images/developments/fitzgerald-gardens/interior-1.jpg',
        '/images/developments/fitzgerald-gardens/amenities-1.jpg'
      ],
      brochureUrl: '/brochures/fitzgerald-gardens-brochure.pdf',
      virtualTourUrl: '/virtual-tours/fitzgerald-gardens',
      mapCoordinates: { lat: 53.7158, lng: -6.3422 }, // Drogheda coordinates
      completionDate: new Date(fitzgeraldGardensConfig.estimatedCompletion),
      createdAt: new Date(fitzgeraldGardensConfig.projectStartDate),
      updatedAt: new Date()
    }
  });

  // Create Fitzgerald Gardens Units
  console.log('🏠 Creating Fitzgerald Gardens units...');
  const fitzgeraldUnits = [];
  
  // Willow Collection - 1 Bedroom Apartments (24 units)
  for (let i = 1; i <= fitzgeraldGardensConfig.unitTypes['1_bed_apartment'].count; i++) {
    const unitNumber = `W-${i.toString().padStart(2, '0')}`;
    fitzgeraldUnits.push({
      id: `FG-${unitNumber}`,
      unitNumber,
      developmentId: 'fitzgerald-gardens',
      unitType: '1_bed_apartment',
      bedrooms: 1,
      bathrooms: 1,
      size: 58,
      price: fitzgeraldGardensConfig.unitTypes['1_bed_apartment'].basePrice,
      floor: Math.ceil(i / 6),
      status: i <= 8 ? 'SOLD' : (i <= 12 ? 'RESERVED' : 'AVAILABLE'),
      features: [
        'Modern Kitchen with Premium Appliances',
        'Underfloor Heating',
        'High-Efficiency Windows',
        'Private Balcony',
        'Built-in Wardrobes'
      ],
      floorPlan: `/floor-plans/fitzgerald-gardens/willow-1bed.pdf`,
      images: [
        `/images/units/fitzgerald-gardens/willow/unit-${unitNumber}-1.jpg`,
        `/images/units/fitzgerald-gardens/willow/unit-${unitNumber}-2.jpg`
      ],
      availability: i > 12 ? 'IMMEDIATE' : 'SOLD_OUT',
      completionDate: new Date('2025-08-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Birch Collection - 2 Bedroom Apartments (30 units)
  for (let i = 1; i <= fitzgeraldGardensConfig.unitTypes['2_bed_apartment'].count; i++) {
    const unitNumber = `B-${i.toString().padStart(2, '0')}`;
    fitzgeraldUnits.push({
      id: `FG-${unitNumber}`,
      unitNumber,
      developmentId: 'fitzgerald-gardens',
      unitType: '2_bed_apartment',
      bedrooms: 2,
      bathrooms: 2,
      size: 85,
      price: fitzgeraldGardensConfig.unitTypes['2_bed_apartment'].basePrice,
      floor: Math.ceil(i / 8),
      status: i <= 6 ? 'SOLD' : (i <= 10 ? 'RESERVED' : 'AVAILABLE'),
      features: [
        'Modern Kitchen with Premium Appliances',
        'Underfloor Heating',
        'High-Efficiency Windows',
        'Private Balcony',
        'Master En-suite',
        'Built-in Wardrobes',
        'Utility Room'
      ],
      floorPlan: `/floor-plans/fitzgerald-gardens/birch-2bed.pdf`,
      images: [
        `/images/units/fitzgerald-gardens/birch/unit-${unitNumber}-1.jpg`,
        `/images/units/fitzgerald-gardens/birch/unit-${unitNumber}-2.jpg`
      ],
      availability: i > 10 ? 'IMMEDIATE' : 'SOLD_OUT',
      completionDate: new Date('2025-08-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Hawthorne Collection - 3 Bedroom Apartments (24 units)
  for (let i = 1; i <= fitzgeraldGardensConfig.unitTypes['3_bed_apartment'].count; i++) {
    const unitNumber = `H-${i.toString().padStart(2, '0')}`;
    fitzgeraldUnits.push({
      id: `FG-${unitNumber}`,
      unitNumber,
      developmentId: 'fitzgerald-gardens',
      unitType: '3_bed_apartment',
      bedrooms: 3,
      bathrooms: 2,
      size: 125,
      price: fitzgeraldGardensConfig.unitTypes['3_bed_apartment'].basePrice,
      floor: Math.ceil(i / 6),
      status: i <= 4 ? 'SOLD' : (i <= 6 ? 'RESERVED' : 'AVAILABLE'),
      features: [
        'Modern Kitchen with Premium Appliances',
        'Underfloor Heating',
        'High-Efficiency Windows',
        'Private Balcony',
        'Master En-suite',
        'Built-in Wardrobes',
        'Utility Room',
        'Study Area'
      ],
      floorPlan: `/floor-plans/fitzgerald-gardens/hawthorne-3bed.pdf`,
      images: [
        `/images/units/fitzgerald-gardens/hawthorne/unit-${unitNumber}-1.jpg`,
        `/images/units/fitzgerald-gardens/hawthorne/unit-${unitNumber}-2.jpg`
      ],
      availability: i > 6 ? 'IMMEDIATE' : 'SOLD_OUT',
      completionDate: new Date('2025-08-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Oak Collection - 4 Bedroom Apartments (18 units)
  for (let i = 1; i <= fitzgeraldGardensConfig.unitTypes['4_bed_apartment'].count; i++) {
    const unitNumber = `O-${i.toString().padStart(2, '0')}`;
    fitzgeraldUnits.push({
      id: `FG-${unitNumber}`,
      unitNumber,
      developmentId: 'fitzgerald-gardens',
      unitType: '4_bed_apartment',
      bedrooms: 4,
      bathrooms: 3,
      size: 165,
      price: fitzgeraldGardensConfig.unitTypes['4_bed_apartment'].basePrice,
      floor: Math.ceil(i / 4),
      status: i <= 2 ? 'SOLD' : (i <= 4 ? 'RESERVED' : 'AVAILABLE'),
      features: [
        'Modern Kitchen with Premium Appliances',
        'Underfloor Heating',
        'High-Efficiency Windows',
        'Private Balcony',
        'Master En-suite',
        'Second En-suite',
        'Built-in Wardrobes',
        'Utility Room',
        'Study Area',
        'Storage Room'
      ],
      floorPlan: `/floor-plans/fitzgerald-gardens/oak-4bed.pdf`,
      images: [
        `/images/units/fitzgerald-gardens/oak/unit-${unitNumber}-1.jpg`,
        `/images/units/fitzgerald-gardens/oak/unit-${unitNumber}-2.jpg`
      ],
      availability: i > 4 ? 'IMMEDIATE' : 'SOLD_OUT',
      completionDate: new Date('2025-08-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  await prisma.unit.createMany({ data: fitzgeraldUnits });

  // Create Elizabeth Walk Development
  console.log('🏗️ Creating Elizabeth Walk development...');
  const elizabethWalk = await prisma.development.create({
    data: {
      id: 'elizabeth-walk',
      name: elizabethWalkData.name,
      location: elizabethWalkData.location,
      description: elizabethWalkData.description,
      totalUnits: elizabethWalkData.totalUnits,
      availableUnits: elizabethWalkData.availableUnits,
      startingPrice: elizabethWalkData.startingPrice,
      completion: elizabethWalkData.completion,
      featured: true,
      status: 'ACTIVE',
      phase: 'Phase 1 Complete',
      amenities: elizabethWalkData.amenities,
      images: elizabethWalkData.images,
      brochureUrl: elizabethWalkData.brochureUrl,
      virtualTourUrl: elizabethWalkData.virtualTourUrl,
      mapCoordinates: elizabethWalkData.mapCoordinates,
      completionDate: new Date(elizabethWalkData.completionDate),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // Create Elizabeth Walk Units
  console.log('🏠 Creating Elizabeth Walk units...');
  const elizabethUnits = [];
  
  for (let i = 1; i <= elizabethWalkData.totalUnits; i++) {
    const unitNumber = `EW-${i.toString().padStart(2, '0')}`;
    const unitType = i <= 12 ? '2_bed_apartment' : (i <= 24 ? '3_bed_apartment' : '3_bed_duplex');
    const bedrooms = unitType === '2_bed_apartment' ? 2 : 3;
    const bathrooms = unitType === '2_bed_apartment' ? 2 : (unitType === '3_bed_duplex' ? 3 : 2);
    const size = unitType === '2_bed_apartment' ? 78 : (unitType === '3_bed_duplex' ? 145 : 115);
    const price = unitType === '2_bed_apartment' ? 285000 : (unitType === '3_bed_duplex' ? 425000 : 365000);
    
    elizabethUnits.push({
      id: `EW-${unitNumber}`,
      unitNumber,
      developmentId: 'elizabeth-walk',
      unitType,
      bedrooms,
      bathrooms,
      size,
      price,
      floor: unitType === '3_bed_duplex' ? 2 : Math.ceil(i / 8),
      status: i <= 8 ? 'SOLD' : (i <= 14 ? 'RESERVED' : 'AVAILABLE'),
      features: [
        'Modern Kitchen',
        'Private Garden/Balcony',
        'Parking Space',
        'Energy Efficient',
        'Storage'
      ],
      floorPlan: `/floor-plans/elizabeth-walk/${unitType}.pdf`,
      images: [
        `/images/units/elizabeth-walk/unit-${unitNumber}-1.jpg`,
        `/images/units/elizabeth-walk/unit-${unitNumber}-2.jpg`
      ],
      availability: i > 14 ? 'IMMEDIATE' : 'SOLD_OUT',
      completionDate: new Date('2025-06-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  await prisma.unit.createMany({ data: elizabethUnits });

  // Update Ballymakenny View with mock-models.ts data
  console.log('🏗️ Updating Ballymakenny View with mock data...');
  const ballymakenny = await prisma.development.upsert({
    where: { id: 'ballymakenny-view' },
    create: {
      id: 'ballymakenny-view',
      name: 'Ballymakenny View',
      location: 'Ballymakenny, Drogheda, Co. Louth',
      description: 'Premium family homes with countryside views in a well-connected location',
      totalUnits: 32,
      availableUnits: 28,
      startingPrice: 380000,
      completion: 60,
      featured: true,
      status: 'ACTIVE',
      phase: 'Launching Soon',
      amenities: [
        'A-Rated Energy Efficiency',
        'Air Source Heat Pumps',
        'Solar PV Panels',
        'Smart Home Ready',
        '10 minutes to M1 Motorway',
        'Local Primary and Secondary Schools',
        'Parks and Recreation Areas',
        'Retail Park Nearby'
      ],
      images: [
        '/images/developments/Ballymakenny-View/hero.jpg',
        '/images/developments/Ballymakenny-View/01-People.jpg',
        '/images/developments/Ballymakenny-View/02-NoPeople.jpg'
      ],
      brochureUrl: '/images/brochures/Ballymakenny View Brochure.pdf',
      virtualTourUrl: 'https://example.com/virtual-tours/ballymakenny-view',
      mapCoordinates: { lat: 53.7245, lng: -6.3269 },
      completionDate: new Date('2024-09-30'),
      createdAt: new Date('2023-04-20T11:30:00Z'),
      updatedAt: new Date()
    },
    update: {
      description: 'Premium family homes with countryside views in a well-connected location',
      totalUnits: 32,
      availableUnits: 28,
      startingPrice: 380000,
      completion: 60,
      phase: 'Launching Soon',
      amenities: [
        'A-Rated Energy Efficiency',
        'Air Source Heat Pumps',
        'Solar PV Panels',
        'Smart Home Ready',
        '10 minutes to M1 Motorway',
        'Local Primary and Secondary Schools',
        'Parks and Recreation Areas',
        'Retail Park Nearby'
      ],
      images: [
        '/images/developments/Ballymakenny-View/hero.jpg',
        '/images/developments/Ballymakenny-View/01-People.jpg',
        '/images/developments/Ballymakenny-View/02-NoPeople.jpg'
      ],
      brochureUrl: '/images/brochures/Ballymakenny View Brochure.pdf',
      virtualTourUrl: 'https://example.com/virtual-tours/ballymakenny-view',
      mapCoordinates: { lat: 53.7245, lng: -6.3269 },
      completionDate: new Date('2024-09-30'),
      updatedAt: new Date()
    }
  });

  // Create Ballymakenny View units from mock data
  console.log('🏠 Creating Ballymakenny View units from mock data...');
  const ballymakenny4BedHouse = await prisma.unit.create({
    data: {
      id: 'BMV-H3-05',
      unitNumber: 'H3-05',
      developmentId: 'ballymakenny-view',
      unitType: '4_bed_house',
      bedrooms: 4,
      bathrooms: 3,
      size: 180,
      price: 495000,
      floor: 0, // Ground floor for house
      status: 'AVAILABLE',
      features: [
        'South-Facing Garden',
        'Home Office Space',
        'Double Garage',
        'Solar PV Panels',
        'Landscaped Front Garden',
        'Electric Gate',
        'Smart Home System'
      ],
      floorPlan: '/images/developments/Ballymakenny-View/HouseType A FP1.png',
      images: [
        '/images/developments/Ballymakenny-View/HouseType A.jpg',
        '/images/developments/Ballymakenny-View/01-NoPeople.jpg'
      ],
      availability: 'IMMEDIATE',
      completionDate: new Date('2024-09-30'),
      createdAt: new Date('2023-09-10T14:00:00Z'),
      updatedAt: new Date()
    }
  });

  const ballymakenny3BedHouse = await prisma.unit.create({
    data: {
      id: 'BMV-H2-08',
      unitNumber: 'H2-08',
      developmentId: 'ballymakenny-view',
      unitType: '3_bed_house',
      bedrooms: 3,
      bathrooms: 2.5,
      size: 145,
      price: 420000,
      floor: 0, // Ground floor for house
      status: 'COMING_SOON',
      features: [
        'Open Plan Living',
        'Modern Kitchen',
        'Private Garden',
        'Driveway Parking',
        'Energy Efficient Design'
      ],
      floorPlan: '/images/developments/Ballymakenny-View/HouseTypeB FP1.html',
      images: [
        '/images/developments/Ballymakenny-View/02-NoPeople.jpg',
        '/images/developments/Ballymakenny-View/01-People.jpg'
      ],
      availability: 'COMING_SOON',
      completionDate: new Date('2024-09-30'),
      createdAt: new Date('2023-09-10T14:00:00Z'),
      updatedAt: new Date()
    }
  });

  // Create Ellwood Development (from mockDataService)
  console.log('🏗️ Creating Ellwood development...');
  const ellwood = await prisma.development.create({
    data: {
      id: 'ellwood',
      name: 'Ellwood',
      location: 'South Drogheda, Co. Louth',
      description: 'Waterfront apartments with stunning views',
      totalUnits: 24,
      availableUnits: 20,
      startingPrice: 295000,
      completion: 100,
      featured: true,
      status: 'SOLD_OUT',
      phase: 'Complete - Sold Out',
      amenities: [
        'Waterfront Location',
        'River Views',
        'Close to Town Center',
        'Public Transport Links',
        'Balconies',
        'Modern Finishes'
      ],
      images: [
        '/images/developments/ellwood/hero.jpg',
        '/images/properties/rm203.jpg'
      ],
      brochureUrl: '/brochures/ellwood-brochure.pdf',
      virtualTourUrl: '/virtual-tours/ellwood',
      mapCoordinates: { lat: 53.7100, lng: -6.3550 },
      completionDate: new Date('2024-01-01'),
      createdAt: new Date('2023-03-01'),
      updatedAt: new Date()
    }
  });

  // Create Meadow Heights Development
  console.log('🏗️ Creating Meadow Heights development...');
  const meadowHeights = await prisma.development.create({
    data: {
      id: 'meadow-heights',
      name: 'Meadow Heights',
      location: 'West Drogheda, Co. Louth',
      description: 'Spacious family houses near amenities',
      totalUnits: 48,
      availableUnits: 35,
      startingPrice: 350000,
      completion: 45,
      featured: true,
      status: 'ACTIVE',
      phase: 'Launching Soon',
      amenities: [
        'Family-Friendly Design',
        'Close to Schools',
        'Shopping Center Nearby',
        'Modern Kitchens',
        'Private Gardens',
        'Parking Spaces'
      ],
      images: [
        '/images/developments/meadow-heights/hero.jpg',
        '/images/properties/mh301.jpg'
      ],
      brochureUrl: '/brochures/meadow-heights-brochure.pdf',
      virtualTourUrl: '/virtual-tours/meadow-heights',
      mapCoordinates: { lat: 53.7200, lng: -6.3700 },
      completionDate: new Date('2025-12-30'),
      createdAt: new Date('2023-09-01'),
      updatedAt: new Date()
    }
  });

  // Create Harbour View Development
  console.log('🏗️ Creating Harbour View development...');
  const harbourView = await prisma.development.create({
    data: {
      id: 'harbour-view',
      name: 'Harbour View',
      location: 'East Drogheda, Co. Louth',
      description: 'Modern townhouses close to the coast',
      totalUnits: 36,
      availableUnits: 22,
      startingPrice: 410000,
      completion: 88,
      featured: false,
      status: 'ACTIVE',
      phase: 'Phase 2 Nearing Completion',
      amenities: [
        'Coastal Location',
        'Sea Views',
        'Close to Beach',
        'Restaurants Nearby',
        'Modern Design',
        'En-suite Bedrooms'
      ],
      images: [
        '/images/developments/harbour-view/hero.jpg',
        '/images/properties/hv401.jpg'
      ],
      brochureUrl: '/brochures/harbour-view-brochure.pdf',
      virtualTourUrl: '/virtual-tours/harbour-view',
      mapCoordinates: { lat: 53.7180, lng: -6.3300 },
      completionDate: new Date('2025-04-30'),
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date()
    }
  });

  // Create Bayside Villas Development
  console.log('🏗️ Creating Bayside Villas development...');
  const baysideVillas = await prisma.development.create({
    data: {
      id: 'bayside-villas',
      name: 'Bayside Villas',
      location: 'Coastal Drogheda, Co. Louth',
      description: 'Exclusive coastal properties',
      totalUnits: 16,
      availableUnits: 16,
      startingPrice: 650000,
      completion: 15,
      featured: true,
      status: 'ACTIVE',
      phase: 'Future Development',
      amenities: [
        'Exclusive Coastal Location',
        'Premium Finishes',
        'Private Gardens',
        'Sea Access',
        'Luxury Design',
        'High-End Specifications'
      ],
      images: [
        '/images/developments/placeholder-dev-2.jpg'
      ],
      brochureUrl: '/brochures/bayside-villas-brochure.pdf',
      virtualTourUrl: '/virtual-tours/bayside-villas',
      mapCoordinates: { lat: 53.7250, lng: -6.3150 },
      completionDate: new Date('2026-06-30'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    }
  });

  // Create additional units from mockDataService
  console.log('🏠 Creating additional units from mockDataService...');
  const additionalUnits = [
    // Fitzgerald Gardens additional units
    {
      id: 'prop-fg-101',
      unitNumber: '101',
      developmentId: 'fitzgerald-gardens',
      unitType: '3_bed_semi_detached',
      bedrooms: 3,
      bathrooms: 3,
      size: 110,
      price: 385000,
      floor: 0,
      status: 'AVAILABLE',
      features: ['Garden', 'En-suite', 'Close to schools', 'Park nearby'],
      floorPlan: '/images/properties/floorplans/fg101.jpg',
      images: ['/images/properties/fg101.jpg'],
      availability: 'IMMEDIATE',
      completionDate: new Date('2025-08-15'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'prop-fg-105',
      unitNumber: '105',
      developmentId: 'fitzgerald-gardens',
      unitType: '4_bed_detached',
      bedrooms: 4,
      bathrooms: 4,
      size: 140,
      price: 450000,
      floor: 0,
      status: 'AVAILABLE',
      features: ['Garden', 'En-suite', 'Garage', 'Close to schools', 'Park nearby'],
      floorPlan: '/images/properties/floorplans/fg105.jpg',
      images: ['/images/properties/fg105.jpg'],
      availability: 'IMMEDIATE',
      completionDate: new Date('2025-08-15'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'prop-fg-110',
      unitNumber: '110',
      developmentId: 'fitzgerald-gardens',
      unitType: '3_bed_semi_detached',
      bedrooms: 3,
      bathrooms: 3,
      size: 110,
      price: 380000,
      floor: 0,
      status: 'AVAILABLE',
      features: ['Garden', 'En-suite', 'Close to schools', 'Park nearby'],
      floorPlan: '/images/properties/floorplans/fg110.jpg',
      images: ['/images/properties/fg101.jpg'],
      availability: 'IMMEDIATE',
      completionDate: new Date('2025-08-15'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'prop-fg-115',
      unitNumber: '115',
      developmentId: 'fitzgerald-gardens',
      unitType: '4_bed_detached',
      bedrooms: 4,
      bathrooms: 4,
      size: 140,
      price: 445000,
      floor: 0,
      status: 'AVAILABLE',
      features: ['Garden', 'En-suite', 'Garage', 'Close to schools', 'Park nearby'],
      floorPlan: '/images/properties/floorplans/fg115.jpg',
      images: ['/images/properties/fg105.jpg'],
      availability: 'IMMEDIATE',
      completionDate: new Date('2025-08-15'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    // Ellwood units
    {
      id: 'prop-rm-203',
      unitNumber: '203',
      developmentId: 'ellwood',
      unitType: '2_bed_apartment',
      bedrooms: 2,
      bathrooms: 2,
      size: 85,
      price: 295000,
      floor: 2,
      status: 'SOLD',
      features: ['Balcony', 'River View', 'Close to town', 'Public transport'],
      floorPlan: '/images/properties/floorplans/rm203.jpg',
      images: ['/images/properties/rm203.jpg'],
      availability: 'SOLD_OUT',
      completionDate: new Date('2024-01-01'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'prop-rm-208',
      unitNumber: '208',
      developmentId: 'ellwood',
      unitType: '2_bed_apartment',
      bedrooms: 2,
      bathrooms: 2,
      size: 85,
      price: 300000,
      floor: 2,
      status: 'SOLD',
      features: ['Balcony', 'River View', 'Close to town', 'Public transport'],
      floorPlan: '/images/properties/floorplans/rm208.jpg',
      images: ['/images/properties/rm203.jpg'],
      availability: 'SOLD_OUT',
      completionDate: new Date('2024-01-01'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    // Meadow Heights units
    {
      id: 'prop-mh-301',
      unitNumber: '301',
      developmentId: 'meadow-heights',
      unitType: '3_bed_terrace',
      bedrooms: 3,
      bathrooms: 2,
      size: 100,
      price: 350000,
      floor: 0,
      status: 'AVAILABLE',
      features: ['Garden', 'Modern Kitchen', 'Close to schools', 'Shopping center'],
      floorPlan: '/images/properties/floorplans/mh301.jpg',
      images: ['/images/properties/mh301.jpg'],
      availability: 'IMMEDIATE',
      completionDate: new Date('2025-12-30'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'prop-mh-305',
      unitNumber: '305',
      developmentId: 'meadow-heights',
      unitType: '3_bed_semi_detached',
      bedrooms: 3,
      bathrooms: 2,
      size: 105,
      price: 365000,
      floor: 0,
      status: 'AVAILABLE',
      features: ['Garden', 'Modern Kitchen', 'Close to schools', 'Shopping center'],
      floorPlan: '/images/properties/floorplans/mh305.jpg',
      images: ['/images/properties/mh301.jpg'],
      availability: 'IMMEDIATE',
      completionDate: new Date('2025-12-30'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    // Harbour View units
    {
      id: 'prop-hv-401',
      unitNumber: '401',
      developmentId: 'harbour-view',
      unitType: '4_bed_townhouse',
      bedrooms: 4,
      bathrooms: 3,
      size: 125,
      price: 410000,
      floor: 0,
      status: 'AVAILABLE',
      features: ['Garden', 'Sea Views', 'En-suite', 'Close to beach', 'Restaurants nearby'],
      floorPlan: '/images/properties/floorplans/hv401.jpg',
      images: ['/images/properties/hv401.jpg'],
      availability: 'IMMEDIATE',
      completionDate: new Date('2025-04-30'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    }
  ];

  await prisma.unit.createMany({ data: additionalUnits });

  console.log('✅ Data migration completed successfully!');
  console.log('📊 Summary:');
  console.log(`- Created ${await prisma.development.count()} developments`);
  console.log(`- Created ${await prisma.unit.count()} units`);
}

main()
  .catch((e) => {
    console.error('❌ Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });