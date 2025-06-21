import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding Ellwood and Ballymakenny View developments...');

  // Get existing location and developer
  const location = await prisma.location.findFirst({
    where: { address: 'Ballymakenny Road' }
  });

  const developer = await prisma.user.findFirst({
    where: { email: 'kevin@prop.ie' }
  });

  if (!location || !developer) {
    throw new Error('Location or developer not found. Run quick-seed.ts first.');
  }

  // 1. ELLWOOD - SOLD OUT (Completed Development)
  const ellwoodDev = await prisma.development.upsert({
    where: { slug: 'ellwood' },
    update: {},
    create: {
      name: 'Ellwood',
      slug: 'ellwood',
      developerId: developer.id,
      locationId: location.id,
      status: 'READY',
      totalUnits: 46,
      description: 'Ellwood is a beautifully completed development of 46 premium homes on Ballymakenny Road, Drogheda. All units have been sold and families are now settled in their new homes. This development showcases our commitment to quality construction and community building.',
      mainImage: '/images/developments/ellwood/hero.jpg',
      images: [
        '/images/developments/ellwood/exterior.jpg',
        '/images/developments/ellwood/streetscape.jpg',
        '/images/developments/ellwood/completed.jpg',
        '/images/developments/ellwood/landscaping.jpg'
      ],
      features: [
        'A2-rated energy efficiency',
        'Premium kitchen appliances included',
        'Private driveways for all homes',
        'Mature landscaped front gardens',
        'High-speed fiber broadband infrastructure',
        'Completed community with established residents',
        'Proven build quality and finish standards'
      ],
      marketingStatus: {
        launchDate: new Date('2022-01-01'),
        salesCenterOpen: false,
        showHouseAvailable: false,
        onlineListingActive: false,
        completionDate: new Date('2023-08-01')
      },
      salesStatus: {
        totalUnits: 46,
        availableUnits: 0,
        reservedUnits: 0,
        saleAgreedUnits: 0,
        soldUnits: 46,
        salesVelocity: 0,
        targetPriceAverage: 385000,
        actualPriceAverage: 395000,
        totalSalesValue: 18170000
      },
      constructionStatus: {
        currentStage: 'Completed',
        percentageComplete: 100,
        estimatedCompletionDate: new Date('2023-08-01'),
        lastUpdated: new Date('2023-08-01'),
        actualCompletionDate: new Date('2023-08-01')
      },
      complianceStatus: {
        planningPermission: true,
        buildingRegulations: true,
        fireRegulations: true,
        disabilityAccess: true,
        energyRating: 'A2',
        completionCertificate: true,
        bondReleased: true
      }
    }
  });

  // 2. BALLYMAKENNY VIEW - 19/20 SOLD (Nearly Complete)
  const ballymakenneyDev = await prisma.development.upsert({
    where: { slug: 'ballymakenny-view' },
    update: {},
    create: {
      name: 'Ballymakenny View',
      slug: 'ballymakenny-view',
      developerId: developer.id,
      locationId: location.id,
      status: 'CONSTRUCTION',
      totalUnits: 20,
      description: 'Ballymakenny View is an exclusive development of 20 luxury homes featuring premium finishes and spacious layouts. With 19 units already sold to delighted homeowners, only one final unit remains - coming to market soon for the right buyer.',
      mainImage: '/images/developments/ballymakenny-view/hero.jpg',
      images: [
        '/images/developments/ballymakenny-view/exterior.jpg',
        '/images/developments/ballymakenny-view/show-house.jpg',
        '/images/developments/ballymakenny-view/gardens.jpg',
        '/images/developments/ballymakenny-view/kitchen.jpg',
        '/images/developments/ballymakenny-view/master-bedroom.jpg'
      ],
      features: [
        'A1-rated energy efficiency',
        'Designer kitchens with breakfast island',
        'Master bedroom with walk-in wardrobe and en-suite',
        'South-facing rear gardens',
        'Electric vehicle charging points',
        'Premium finishes throughout',
        'Underfloor heating on ground floor',
        'Smart home technology pre-wiring'
      ],
      marketingStatus: {
        launchDate: new Date('2023-03-01'),
        salesCenterOpen: false,
        showHouseAvailable: true,
        onlineListingActive: false,
        finalUnitComingSoon: true
      },
      salesStatus: {
        totalUnits: 20,
        availableUnits: 1,
        reservedUnits: 0,
        saleAgreedUnits: 0,
        soldUnits: 19,
        salesVelocity: 0,
        targetPriceAverage: 445000,
        actualPriceAverage: 458000,
        totalSalesValue: 8702000
      },
      constructionStatus: {
        currentStage: 'Final Fix & Snagging',
        percentageComplete: 95,
        estimatedCompletionDate: new Date('2024-09-01'),
        lastUpdated: new Date('2024-03-20')
      },
      complianceStatus: {
        planningPermission: true,
        buildingRegulations: true,
        fireRegulations: true,
        disabilityAccess: true,
        energyRating: 'A1',
        completionCertificate: false,
        bondReleased: false
      }
    }
  });

  // Create unit types for historical reference (Ellwood)
  const ellwoodUnitTypes = await Promise.all([
    prisma.unitType.create({
      data: {
        development: { connect: { id: ellwoodDev.id } },
        name: '3 Bed Semi-Detached',
        type: 'SEMI_DETACHED',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        priceFrom: 385000,
        totalUnits: 30,
        availableUnits: 0,
        features: [
          'Traditional semi-detached design',
          'Separate living and dining rooms',
          'Modern fitted kitchen',
          'Master bedroom with en-suite',
          'Private rear garden',
          'Driveway parking',
          'A2 energy rating'
        ]
      }
    }),

    prisma.unitType.create({
      data: {
        development: { connect: { id: ellwoodDev.id } },
        name: '4 Bed Detached',
        type: 'DETACHED',
        bedrooms: 4,
        bathrooms: 3,
        area: 155,
        priceFrom: 435000,
        totalUnits: 16,
        availableUnits: 0,
        features: [
          'Spacious detached family home',
          'Large living room and separate family room',
          'Open plan kitchen/dining area',
          'Master bedroom with walk-in wardrobe',
          'Three additional bedrooms',
          'Guest WC downstairs',
          'Large private garden',
          'Double driveway',
          'A2 energy rating'
        ]
      }
    })
  ]);

  // Create unit types for Ballymakenny View
  const ballymakenneyUnitTypes = await Promise.all([
    prisma.unitType.create({
      data: {
        development: { connect: { id: ballymakenneyDev.id } },
        name: '4 Bed Luxury Semi-Detached',
        type: 'SEMI_DETACHED',
        bedrooms: 4,
        bathrooms: 3,
        area: 150,
        priceFrom: 465000,
        totalUnits: 12,
        availableUnits: 0, // 11 sold + 1 remaining
        features: [
          'Luxury four-bedroom semi-detached',
          'Designer kitchen with breakfast island',
          'Separate living room and family room',
          'Master bedroom with walk-in wardrobe',
          'Master en-suite with double vanity',
          'Three additional double bedrooms',
          'Guest WC with basin',
          'Utility room off kitchen',
          'South-facing rear garden',
          'Double driveway with EV charging point',
          'A1 energy rating'
        ]
      }
    }),

    prisma.unitType.create({
      data: {
        development: { connect: { id: ballymakenneyDev.id } },
        name: '4 Bed Luxury Detached',
        type: 'DETACHED',
        bedrooms: 4,
        bathrooms: 3,
        area: 165,
        priceFrom: 495000,
        totalUnits: 8,
        availableUnits: 1, // 7 sold + 1 remaining (the one coming to market)
        features: [
          'Premium detached family home',
          'Grand entrance hallway',
          'Large living room with feature fireplace',
          'Open plan kitchen/dining/family area',
          'Separate utility room',
          'Home office/study',
          'Master bedroom with walk-in wardrobe',
          'Luxury master en-suite with separate bath and shower',
          'Three additional double bedrooms',
          'Family bathroom with bath',
          'Guest WC',
          'Large south-facing garden',
          'Double garage with internal access',
          'EV charging point',
          'A1 energy rating'
        ]
      }
    })
  ]);

  // Create some sample units for historical tracking
  console.log('Creating sample units for historical tracking...');

  // Create a few representative sold units for Ellwood
  const ellwoodSampleUnits = [];
  for (let i = 1; i <= 5; i++) {
    const unit = await prisma.unit.create({
      data: {
        development: { connect: { id: ellwoodDev.id } },
        unitType: { connect: { id: ellwoodUnitTypes[0].id } },
        unitNumber: `EW${i.toString().padStart(2, '0')}`,
        name: `3 Bed Semi - Unit ${i}`,
        type: 'SEMI_DETACHED',
        size: 120,
        bedrooms: 3,
        bathrooms: 2,
        floors: 2,
        parkingSpaces: 2,
        basePrice: 385000 + (Math.random() * 15000),
        status: 'SOLD',
        berRating: 'A2',
        features: ellwoodUnitTypes[0].features,
        primaryImage: '/images/units/ellwood/3-bed-semi/main.jpg',
        images: [
          '/images/units/ellwood/3-bed-semi/living.jpg',
          '/images/units/ellwood/3-bed-semi/kitchen.jpg',
          '/images/units/ellwood/3-bed-semi/garden.jpg'
        ],
        floorplans: [
          '/images/floor-plans/ellwood/3-bed-semi/ground.pdf',
          '/images/floor-plans/ellwood/3-bed-semi/first.pdf'
        ],
        block: 'Phase 1',
        floor: 0,
        aspect: ['North', 'South', 'East', 'West'][i % 4],
        availableFrom: new Date('2023-08-01')
      }
    });
    ellwoodSampleUnits.push(unit);
  }

  // Create the remaining luxury unit for Ballymakenny View
  const ballymakenneyRemainingUnit = await prisma.unit.create({
    data: {
      development: { connect: { id: ballymakenneyDev.id } },
      unitType: { connect: { id: ballymakenneyUnitTypes[1].id } },
      unitNumber: 'BV20',
      name: '4 Bed Luxury Detached - Show Home Quality',
      type: 'DETACHED',
      size: 165,
      bedrooms: 4,
      bathrooms: 3,
      floors: 2,
      parkingSpaces: 2,
      basePrice: 515000, // Premium unit
      status: 'COMING_SOON',
      berRating: 'A1',
      features: ballymakenneyUnitTypes[1].features.concat([
        'Show home quality finishes',
        'Upgraded kitchen appliances',
        'Premium bathroom fittings',
        'Landscaped garden design included'
      ]),
      primaryImage: '/images/units/ballymakenny-view/luxury-detached/main.jpg',
      images: [
        '/images/units/ballymakenny-view/luxury-detached/living.jpg',
        '/images/units/ballymakenny-view/luxury-detached/kitchen.jpg',
        '/images/units/ballymakenny-view/luxury-detached/master-bedroom.jpg',
        '/images/units/ballymakenny-view/luxury-detached/garden.jpg'
      ],
      floorplans: [
        '/images/floor-plans/ballymakenny-view/luxury-detached/ground.pdf',
        '/images/floor-plans/ballymakenny-view/luxury-detached/first.pdf'
      ],
      block: 'Phase 1',
      floor: 0,
      aspect: 'South',
      availableFrom: new Date('2024-09-01'),
      specialNotes: 'Final unit in exclusive development. Show home quality finishes. Viewing by appointment only.'
    }
  });

  console.log('✅ Additional developments created successfully!');
  console.log(`   - ${ellwoodDev.name}: ${ellwoodDev.totalUnits} units (ALL SOLD)`);
  console.log(`   - ${ballymakenneyDev.name}: ${ballymakenneyDev.totalUnits} units (19 sold, 1 remaining)`);
  console.log(`   - Created ${ellwoodSampleUnits.length} sample Ellwood units for reference`);
  console.log(`   - Created final luxury unit: ${ballymakenneyRemainingUnit.unitNumber} (€${ballymakenneyRemainingUnit.basePrice.toLocaleString()})`);

  console.log('\n📊 Development Portfolio Summary:');
  console.log('   🏠 Ellwood: COMPLETED (46/46 sold) - €18.17M total sales');
  console.log('   🏠 Ballymakenny View: NEARING COMPLETION (19/20 sold) - €8.70M total sales');
  console.log('   🏠 Fitzgerald Gardens: ACTIVE SALES (Phase 1: 12/27 units sold/reserved)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });