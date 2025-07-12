/**
 * Enterprise Development Data Seeder
 * 
 * Seeds the enterprise PostgreSQL database with comprehensive development data
 * for fitzgerald-gardens, ballymakenny-view, and ellwood developments
 * with full enterprise relationships and real-time sync compatibility
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate consistent IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

/**
 * Comprehensive enterprise development data
 */
const enterpriseDevelopments = [
  {
    id: "fitzgerald-gardens",
    name: "Fitzgerald Gardens",
    slug: "fitzgerald-gardens",
    description: "Luxurious living with modern comforts in the heart of Drogheda. This prestigious development offers a perfect blend of contemporary design and traditional Irish charm, featuring energy-efficient homes with premium finishes throughout.",
    shortDescription: "Premium residential development featuring contemporary design and sustainable living in Drogheda's most sought-after location.",
    mainImage: "/images/developments/fitzgerald-gardens/hero.jpeg",
    images: [
      "/images/developments/fitzgerald-gardens/hero.jpeg",
      "/images/developments/fitzgerald-gardens/exterior.jpg",
      "/images/developments/fitzgerald-gardens/showhouse.jpg",
      "/images/developments/fitzgerald-gardens/amenities.jpg"
    ],
    status: "ACTIVE",
    isPublished: true,
    launchDate: new Date("2024-03-15"),
    expectedCompletion: new Date("2025-12-01"),
    startingPrice: 320000,
    priceRange: "€320,000 - €450,000",
    totalUnits: 45,
    availableUnits: 32,
    soldUnits: 8,
    reservedUnits: 5,
    features: [
      "Modern Kitchen with Premium Appliances",
      "Underfloor Heating Throughout", 
      "Triple Glazed Windows",
      "A2 Energy Rating",
      "Smart Home Technology",
      "Private Parking",
      "Landscaped Gardens",
      "Secure Entry System"
    ],
    amenities: [
      "Community Green Space",
      "Children's Playground", 
      "Walking Trails",
      "Bicycle Storage",
      "Electric Vehicle Charging",
      "Visitor Parking"
    ],
    location: {
      address: "North Drogheda",
      city: "Drogheda",
      county: "Co. Louth",
      eircode: "A92 X1Y2",
      latitude: 53.7181,
      longitude: -6.3476
    },
    developer: {
      name: "Premium Homes Ireland",
      email: "sales@premiumhomesireland.ie",
      phone: "+353 41 987 6543"
    },
    units: [
      {
        id: "fg-unit-001",
        unitNumber: "001",
        unitType: "Type A - 2 Bedroom",
        bedrooms: 2,
        bathrooms: 2,
        floorArea: 79,
        basePrice: 320000,
        currentPrice: 320000,
        status: "AVAILABLE",
        floor: 1,
        aspect: "South-facing"
      },
      {
        id: "fg-unit-002", 
        unitNumber: "002",
        unitType: "Type B - 3 Bedroom",
        bedrooms: 3,
        bathrooms: 2,
        floorArea: 102,
        basePrice: 380000,
        currentPrice: 380000,
        status: "AVAILABLE", 
        floor: 1,
        aspect: "East-facing"
      },
      {
        id: "fg-unit-003",
        unitNumber: "003", 
        unitType: "Type C - 4 Bedroom",
        bedrooms: 4,
        bathrooms: 3,
        floorArea: 135,
        basePrice: 430000,
        currentPrice: 430000,
        status: "SOLD",
        floor: 2,
        aspect: "South-facing"
      }
    ]
  },
  {
    id: "ballymakenny-view",
    name: "Ballymakenny View", 
    slug: "ballymakenny-view",
    description: "Modern family homes in a convenient location with excellent amenities. Situated in the sought-after Ballymakenny area, these homes offer spacious living with contemporary design and high-quality finishes.",
    shortDescription: "Exceptional family homes in prime Ballymakenny location with modern amenities and excellent transport links.",
    mainImage: "/images/developments/ballymakenny-view/hero.jpg",
    images: [
      "/images/developments/ballymakenny-view/hero.jpg",
      "/images/developments/ballymakenny-view/exterior.jpg", 
      "/images/developments/ballymakenny-view/interior.jpg",
      "/images/developments/ballymakenny-view/gardens.jpg"
    ],
    status: "ACTIVE",
    isPublished: true,
    launchDate: new Date("2025-06-01"),
    expectedCompletion: new Date("2026-08-01"),
    startingPrice: 350000,
    priceRange: "€350,000 - €425,000",
    totalUnits: 32,
    availableUnits: 32,
    soldUnits: 0,
    reservedUnits: 0,
    features: [
      "Spacious Open Plan Living",
      "Designer Kitchens with Island",
      "Engineered Hardwood Flooring",
      "South-Facing Gardens",
      "High Ceilings Throughout",
      "Fiber Broadband Ready",
      "Solar Panel Installation"
    ],
    amenities: [
      "Central Park Area",
      "Multi-Sport Courts",
      "Outdoor Exercise Equipment", 
      "Nature Walking Path",
      "Community Center",
      "Local Shopping Village"
    ],
    location: {
      address: "Ballymakenny Road",
      city: "Drogheda", 
      county: "Co. Louth",
      eircode: "A92 B3C4",
      latitude: 53.7095,
      longitude: -6.3524
    },
    developer: {
      name: "Harmony Developments",
      email: "info@harmonydevelopments.ie",
      phone: "+353 41 987 1234"
    },
    units: [
      {
        id: "bmv-unit-001",
        unitNumber: "001",
        unitType: "Type A - 3 Bedroom Semi-Detached",
        bedrooms: 3,
        bathrooms: 2,
        floorArea: 111,
        basePrice: 350000,
        currentPrice: 350000,
        status: "AVAILABLE",
        floor: 2,
        aspect: "South-facing"
      },
      {
        id: "bmv-unit-002",
        unitNumber: "002", 
        unitType: "Type B - 4 Bedroom Detached",
        bedrooms: 4,
        bathrooms: 3,
        floorArea: 139,
        basePrice: 400000,
        currentPrice: 400000,
        status: "AVAILABLE",
        floor: 2,
        aspect: "West-facing"
      }
    ]
  },
  {
    id: "ellwood",
    name: "Ellwood Riverside",
    slug: "ellwood",
    description: "Exclusive riverside apartments with stunning views and premium finishes. Located along the picturesque River Boyne, these luxury apartments offer sophisticated urban living with natural beauty at your doorstep.",
    shortDescription: "Luxury riverside apartments featuring premium finishes and stunning River Boyne views in the heart of Drogheda.",
    mainImage: "/images/developments/ellwood/hero.jpg",
    images: [
      "/images/developments/ellwood/hero.jpg",
      "/images/developments/ellwood/riverside.jpg",
      "/images/developments/ellwood/apartment.jpg", 
      "/images/developments/ellwood/amenities.jpg"
    ],
    status: "ACTIVE",
    isPublished: true,
    launchDate: new Date("2025-09-01"),
    expectedCompletion: new Date("2026-12-01"),
    startingPrice: 285000,
    priceRange: "€285,000 - €550,000", 
    totalUnits: 68,
    availableUnits: 68,
    soldUnits: 0,
    reservedUnits: 0,
    features: [
      "Floor-to-Ceiling Windows",
      "Private Balconies with River Views",
      "Designer Kitchen Units", 
      "Quartz Countertops",
      "Walk-in Wardrobes",
      "Smart Home Integration",
      "Underfloor Heating",
      "Premium Appliances Package"
    ],
    amenities: [
      "Residents' Lounge & Library",
      "Rooftop Garden Terrace",
      "24/7 Concierge Service",
      "Secure Underground Parking",
      "Fitness Center & Yoga Studio",
      "Riverside Walking Path",
      "Private Dock Access"
    ],
    location: {
      address: "Riverside Quarter, Boyne Quay",
      city: "Drogheda",
      county: "Co. Louth", 
      eircode: "A92 D5E6",
      latitude: 53.7158,
      longitude: -6.3445
    },
    developer: {
      name: "Riverside Living Ltd",
      email: "enquiries@riversideliving.ie",
      phone: "+353 41 987 9999"
    },
    units: [
      {
        id: "er-unit-001",
        unitNumber: "001",
        unitType: "Type A - 1 Bedroom Premium",
        bedrooms: 1,
        bathrooms: 1,
        floorArea: 60,
        basePrice: 285000,
        currentPrice: 285000,
        status: "AVAILABLE",
        floor: 1,
        aspect: "River view"
      },
      {
        id: "er-unit-002",
        unitNumber: "002",
        unitType: "Type B - 2 Bedroom Deluxe", 
        bedrooms: 2,
        bathrooms: 2,
        floorArea: 88,
        basePrice: 420000,
        currentPrice: 420000,
        status: "AVAILABLE",
        floor: 3,
        aspect: "River view"
      },
      {
        id: "er-unit-003",
        unitNumber: "003",
        unitType: "Type C - 3 Bedroom Penthouse",
        bedrooms: 3,
        bathrooms: 2,
        floorArea: 130,
        basePrice: 520000,
        currentPrice: 520000,
        status: "AVAILABLE",
        floor: 5,
        aspect: "Panoramic river view"
      }
    ]
  }
];

/**
 * Seed enterprise development data
 */
async function seedEnterpriseDevelopments() {
  console.log('🚀 Starting Enterprise Development Data Seeding...\n');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing development data...');
    await prisma.unit.deleteMany();
    await prisma.location.deleteMany();
    await prisma.development.deleteMany();
    console.log('✅ Existing data cleared\n');

    let totalDevelopments = 0;
    let totalUnits = 0;

    // Create each development with full enterprise structure
    for (const devData of enterpriseDevelopments) {
      console.log(`🏗️  Creating development: ${devData.name}`);

      // Create Location first
      const location = await prisma.location.create({
        data: {
          id: generateId(),
          address: devData.location.address,
          city: devData.location.city,
          county: devData.location.county,
          eircode: devData.location.eircode,
          latitude: devData.location.latitude,
          longitude: devData.location.longitude
        }
      });

      // Create Development with relationships
      const development = await prisma.development.create({
        data: {
          id: devData.id,
          name: devData.name,
          slug: devData.slug,
          description: devData.description,
          shortDescription: devData.shortDescription,
          mainImage: devData.mainImage,
          images: devData.images,
          videos: [],
          status: devData.status as any,
          isPublished: devData.isPublished,
          completionDate: devData.expectedCompletion,
          startDate: devData.launchDate,
          features: devData.features,
          amenities: devData.amenities,
          locationId: location.id,
          developerId: generateId(), // Placeholder developer ID
          marketingStatus: {},
          salesStatus: {},
          constructionStatus: {},
          complianceStatus: {},
          tags: [],
          awards: [],
          created: new Date(),
          updated: new Date()
        }
      });

      totalDevelopments++;
      console.log(`   ✅ Development created: ${development.name}`);

      // Create Units for this development
      console.log(`   📋 Creating ${devData.units.length} units...`);
      for (const unitData of devData.units) {
        const unit = await prisma.unit.create({
          data: {
            id: unitData.id,
            developmentId: development.id,
            name: unitData.unitType,
            type: 'APARTMENT', // Default unit type
            size: unitData.floorArea,
            bedrooms: unitData.bedrooms,
            bathrooms: unitData.bathrooms,
            floors: 1,
            parkingSpaces: 1,
            basePrice: unitData.basePrice,
            status: unitData.status as any,
            berRating: 'A2',
            features: [`${unitData.bedrooms} bedrooms`, `${unitData.bathrooms} bathrooms`, `${unitData.floorArea}m²`],
            primaryImage: `/images/developments/${devData.id}/units/${unitData.unitNumber}/main.jpg`,
            images: [
              `/images/developments/${devData.id}/units/${unitData.unitNumber}/main.jpg`,
              `/images/developments/${devData.id}/units/${unitData.unitNumber}/kitchen.jpg`,
              `/images/developments/${devData.id}/units/${unitData.unitNumber}/living.jpg`
            ],
            floorplans: [`/images/developments/${devData.id}/floorplans/${unitData.unitNumber}.jpg`],
            unitNumber: unitData.unitNumber,
            floor: unitData.floor,
            aspect: unitData.aspect,
            viewCount: 0,
            updatedAt: new Date()
          }
        });

        totalUnits++;
        console.log(`     💾 Unit created: ${unit.unitNumber} (${unit.name})`);
      }

      console.log(`   ✅ ${devData.name}: ${devData.units.length} units created\n`);
    }

    // Generate summary statistics
    console.log('📊 Enterprise Data Seeding Complete!\n');
    console.log('📈 Summary:');
    console.log(`   • Developments created: ${totalDevelopments}`);
    console.log(`   • Units created: ${totalUnits}`);
    console.log(`   • Average units per development: ${(totalUnits / totalDevelopments).toFixed(1)}`);
    console.log(`   • Database: Enterprise PostgreSQL with full relationships`);
    console.log(`   • Real-time sync: Ready for buyer platform integration`);
    console.log(`   • API compatibility: Updated for enterprise schema`);

    // Verify data integrity
    console.log('\n🔍 Verifying data integrity...');
    const developments = await prisma.development.findMany({
      include: {
        Location: true,
        Unit: true
      }
    });

    developments.forEach(dev => {
      console.log(`   ✅ ${dev.name}: ${dev.Unit.length} units, Location: ${dev.Location?.city}`);
    });

    console.log('\n🎉 Enterprise development data seeding completed successfully!');
    console.log('🚀 Ready for beautiful brochure pages with real-time sync!');

  } catch (error) {
    console.error('💥 Enterprise seeding failed:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await seedEnterpriseDevelopments();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { seedEnterpriseDevelopments, enterpriseDevelopments };