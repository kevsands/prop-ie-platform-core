import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting quick database seed...');
  
  // Create Location
  const location = await prisma.location.create({
    data: {
      address: 'Ballymakenny Road',
      city: 'Drogheda',
      county: 'Louth',
      eircode: 'A92 XY56',
      country: 'Ireland',
      latitude: 53.7149,
      longitude: -6.3487,
    }
  });

  // Create Developer User
  const developer = await prisma.user.create({
    data: {
      email: 'kevin@prop.ie',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Kevin',
      lastName: 'Fitzgerald',
      phone: '+353123456789',
      roles: ['ADMIN', 'DEVELOPER'],
      status: 'ACTIVE',
      kycStatus: 'APPROVED',
      organization: 'Fitzgerald Developments',
    }
  });

  // Create Sample Buyer
  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@example.com',
      password: await bcrypt.hash('buyer123', 10),
      firstName: 'Sarah',
      lastName: 'Murphy',
      phone: '+353123456791',
      roles: ['BUYER'],
      status: 'ACTIVE',
      kycStatus: 'PENDING_REVIEW',
    }
  });

  // Create Fitzgerald Gardens Development
  const development = await prisma.development.create({
    data: {
      name: 'Fitzgerald Gardens',
      slug: 'fitzgerald-gardens',
      developerId: developer.id,
      locationId: location.id,
      status: 'SALES',
      totalUnits: 27,
      description: 'Fitzgerald Gardens is an exceptional new development of family homes on Ballymakenny Road, Drogheda. Phase 1 consists of 27 high-quality homes with 15 available for immediate sale to the public.',
      mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg',
      images: [
        '/images/developments/fitzgerald-gardens/1.jpg',
        '/images/developments/fitzgerald-gardens/2.jpg',
        '/images/developments/fitzgerald-gardens/3.jpg'
      ],
      features: [
        'A2-rated energy efficiency',
        'Modern kitchen with premium appliances',
        'Underfloor heating throughout',
        'Triple glazed windows',
        'Smart home technology ready',
        'Private parking spaces'
      ],
      marketingStatus: {
        launchDate: new Date('2024-02-01'),
        salesCenterOpen: true,
        showHouseAvailable: true,
        onlineListingActive: true
      },
      salesStatus: {
        totalUnits: 27,
        availableUnits: 15,
        reservedUnits: 8,
        saleAgreedUnits: 2,
        soldUnits: 2,
        salesVelocity: 1.8,
        targetPriceAverage: 395000,
        actualPriceAverage: 402000
      },
      constructionStatus: {
        currentStage: 'Foundation Complete',
        percentageComplete: 35,
        estimatedCompletionDate: new Date('2025-03-01'),
        lastUpdated: new Date('2024-03-20')
      },
      complianceStatus: {
        planningPermission: true,
        buildingRegulations: true,
        fireRegulations: true,
        disabilityAccess: true,
        energyRating: 'A2'
      }
    }
  });

  // Create Unit Types with your exact pricing
  const unitTypes = await Promise.all([
    // 3 Bed Semi - €425,000 (most popular)
    prisma.unitType.create({
      data: {
        development: { connect: { id: development.id } },
        name: '3 Bed Semi-Detached',
        type: 'SEMI_DETACHED',
        bedrooms: 3,
        bathrooms: 3,
        area: 125,
        priceFrom: 425000,
        totalUnits: 8,
        availableUnits: 5,
        features: [
          'Spacious semi-detached home',
          'Separate living and family rooms',
          'Large kitchen/dining area',
          'Master bedroom with en-suite',
          'Guest WC downstairs',
          'Private rear garden',
          'Driveway parking for 2 cars',
          'A2 energy rating'
        ]
      }
    }),

    // 3 Bed Mid - €389,950
    prisma.unitType.create({
      data: {
        development: { connect: { id: development.id } },
        name: '3 Bed Mid Terrace',
        type: 'TERRACED',
        bedrooms: 3,
        bathrooms: 2,
        area: 107,
        priceFrom: 389950,
        totalUnits: 6,
        availableUnits: 4,
        features: [
          'Traditional terraced home',
          'Separate living and dining rooms',
          'Modern kitchen',
          'Master bedroom with en-suite',
          'Private rear garden',
          'Parking space',
          'A2 energy rating'
        ]
      }
    }),

    // 3 Bed End - €399,950
    prisma.unitType.create({
      data: {
        development: { connect: { id: development.id } },
        name: '3 Bed End Terrace',
        type: 'TERRACED',
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        priceFrom: 399950,
        totalUnits: 4,
        availableUnits: 2,
        features: [
          'End-of-terrace home',
          'Additional side windows',
          'Separate living and dining rooms',
          'Modern kitchen',
          'Master bedroom with en-suite',
          'Private rear garden',
          'Parking space',
          'A2 energy rating'
        ]
      }
    }),

    // 4 Bed Semi - €495,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: development.id } },
        name: '4 Bed Semi-Detached',
        type: 'SEMI_DETACHED',
        bedrooms: 4,
        bathrooms: 3,
        area: 145,
        priceFrom: 495000,
        totalUnits: 3,
        availableUnits: 1,
        features: [
          'Large four-bedroom family home',
          'Separate living and family rooms',
          'Open plan kitchen/dining area',
          'Master bedroom with walk-in wardrobe and en-suite',
          'Three additional bedrooms',
          'Guest WC downstairs',
          'Private rear garden',
          'Driveway parking for 2 cars',
          'A2 energy rating'
        ]
      }
    }),

    // 2 Bed Mid Duplex - €345,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: development.id } },
        name: '2 Bed Mid Duplex',
        type: 'DUPLEX',
        bedrooms: 2,
        bathrooms: 2,
        area: 79,
        priceFrom: 345000,
        totalUnits: 4,
        availableUnits: 2,
        features: [
          'Two-storey duplex layout',
          'Open plan living/dining/kitchen',
          'Master bedroom with en-suite',
          'Private front door',
          'Parking space',
          'A2 energy rating'
        ]
      }
    }),

    // 1 Bed Apartment - €235,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: development.id } },
        name: '1 Bed Apartment',
        type: 'APARTMENT',
        bedrooms: 1,
        bathrooms: 1,
        area: 65,
        priceFrom: 235000,
        totalUnits: 2,
        availableUnits: 1,
        features: [
          'Open plan living/kitchen',
          'Double bedroom with built-in wardrobes',
          'Modern bathroom with shower',
          'Private balcony',
          'Allocated parking space',
          'A2 energy rating'
        ]
      }
    })
  ]);

  // Create some sample units
  const units = [];
  let unitCounter = 1;

  for (const unitType of unitTypes) {
    for (let i = 1; i <= Math.min(unitType.totalUnits, 3); i++) {
      const unit = await prisma.unit.create({
        data: {
          development: { connect: { id: development.id } },
          unitType: { connect: { id: unitType.id } },
          unitNumber: `FG${unitCounter.toString().padStart(2, '0')}`,
          name: `${unitType.name} - Unit ${unitCounter}`,
          type: unitType.type,
          size: unitType.area,
          bedrooms: unitType.bedrooms,
          bathrooms: unitType.bathrooms,
          floors: unitType.type === 'APARTMENT' ? 1 : 2,
          parkingSpaces: unitType.bedrooms >= 4 ? 2 : 1,
          basePrice: unitType.priceFrom,
          status: i <= unitType.availableUnits ? 'AVAILABLE' : 'RESERVED',
          berRating: 'A2',
          features: unitType.features,
          primaryImage: `/images/units/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/main.jpg`,
          images: [
            `/images/units/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/living.jpg`,
            `/images/units/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/kitchen.jpg`
          ],
          floorplans: [
            `/images/floor-plans/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/ground.pdf`
          ],
          block: 'Phase 1',
          floor: 0,
          aspect: ['North', 'South', 'East', 'West'][unitCounter % 4],
          availableFrom: new Date('2025-03-01')
        }
      });
      units.push(unit);
      unitCounter++;
    }
  }

  console.log('Quick seed completed successfully!');
  console.log(`✅ Created development: ${development.name}`);
  console.log(`✅ Created ${unitTypes.length} unit types`);
  console.log(`✅ Created ${units.length} sample units`);
  console.log(`✅ Created users: ${developer.email}, ${buyer.email}`);
  console.log('\nLogin credentials:');
  console.log(`🔑 Developer: kevin@prop.ie / admin123`);
  console.log(`🔑 Buyer: buyer@example.com / buyer123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });