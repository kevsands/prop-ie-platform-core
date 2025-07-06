const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedFitzgeraldGardens() {
  console.log('🏠 Seeding Fitzgerald Gardens - Real Project Data...');

  try {
    // 1. Create Location - Ballymakenny Road, Drogheda, Co. Louth
    const location = await prisma.location.upsert({
      where: { id: 'loc-fitzgerald-gardens' },
      update: {},
      create: {
        id: 'loc-fitzgerald-gardens',
        address: 'Ballymakenny Road, Drogheda, Co. Louth',
        addressLine1: 'Ballymakenny Road',
        city: 'Drogheda',
        county: 'Louth',
        eircode: 'A92 X3Y7',
        country: 'Ireland',
        latitude: 53.7158,
        longitude: -6.3478
      }
    });
    console.log('✓ Created location: Ballymakenny Road, Drogheda');

    // 2. Create Developer User
    const developer = await prisma.user.upsert({
      where: { id: 'dev-fitzgerald' },
      update: {},
      create: {
        id: 'dev-fitzgerald',
        email: 'dev@fitzgeraldgardens.ie',
        firstName: 'Fitzgerald',
        lastName: 'Developments',
        roles: ['DEVELOPER'],
        status: 'ACTIVE',
        organization: 'Fitzgerald Developments Ltd',
        position: 'Managing Director'
      }
    });
    console.log('✓ Created developer user');

    // 3. Create Main Development
    const development = await prisma.development.upsert({
      where: { id: 'dev-fitzgerald-gardens' },
      update: {},
      create: {
        id: 'dev-fitzgerald-gardens',
        name: 'Fitzgerald Gardens',
        slug: 'fitzgerald-gardens',
        developerId: developer.id,
        locationId: location.id,
        status: 'CONSTRUCTION',
        marketingStatus: {
          launched: true,
          launchDate: '2024-01-15',
          salesSuite: 'Open',
          viewingsAvailable: true
        },
        salesStatus: {
          totalUnits: 96,
          phase1aUnits: 27,
          phase1bUnits: 16,
          phase2aUnits: 43,
          phase2bUnits: 10,
          soldUnits: 18,
          availableUnits: 78,
          reservedUnits: 0
        },
        constructionStatus: {
          overallCompletion: 68,
          phase1aCompletion: 85,
          phase1bCompletion: 45,
          phase2aCompletion: 0
        },
        complianceStatus: {
          planningPermission: 'Granted',
          fireCompliance: 'In Progress',
          bcciCertification: 'Pending'
        },
        mainImage: '/images/developments/fitzgerald-gardens/main.jpg',
        images: [
          '/images/developments/fitzgerald-gardens/exterior-1.jpg',
          '/images/developments/fitzgerald-gardens/exterior-2.jpg',
          '/images/developments/fitzgerald-gardens/aerial.jpg',
          '/images/developments/fitzgerald-gardens/amenities.jpg'
        ],
        videos: [
          '/videos/fitzgerald-gardens-tour.mp4',
          '/videos/fitzgerald-gardens-drone.mp4'
        ],
        sitePlanUrl: '/documents/fitzgerald-gardens-site-plan.pdf',
        brochureUrl: '/documents/fitzgerald-gardens-brochure.pdf',
        virtualTourUrl: 'https://tour.fitzgeraldgardens.ie',
        websiteUrl: 'https://fitzgeraldgardens.ie',
        description: 'Fitzgerald Gardens is a premium residential development located on Ballymakenny Road in Drogheda, Co. Louth. This exceptional development offers 96 contemporary homes comprising a mix of 1, 2, 3 and 4 bedroom apartments and houses, designed to the highest standards with modern amenities and energy-efficient features.',
        shortDescription: 'Premium 96-unit development in Drogheda featuring modern apartments and houses',
        features: [
          'Energy A-rated homes',
          'Private gardens and balconies',
          'Underground parking',
          'Children\'s playground',
          'Landscaped communal areas',
          'Electric car charging points',
          'Fibre broadband ready',
          'Security system',
          'Waste management system',
          'Bicycle storage'
        ],
        amenities: [
          'Drogheda town center (2km)',
          'M1 motorway access (1.5km)',
          'Dublin (45 minutes)',
          'Local schools nearby',
          'Shopping centers',
          'Medical facilities',
          'Sports clubs',
          'Public transport links'
        ],
        buildingSpecs: {
          architect: 'Murphy Shelley Architects',
          contractor: 'Bennett Construction',
          engineer: 'Dornan Engineering',
          qsSurveyor: 'Gleeson Quantity Surveyors'
        },
        startDate: new Date('2024-02-01'),
        completionDate: new Date('2025-08-15'),
        publishedDate: new Date('2024-01-15'),
        isPublished: true,
        tags: ['Premium', 'Energy Efficient', 'Family Homes', 'Drogheda', 'Phase 1'],
        awards: []
      }
    });
    console.log('✓ Created Fitzgerald Gardens development');

    // 4. Create Project Timeline
    const timeline = await prisma.projectTimeline.upsert({
      where: { id: 'timeline-fitzgerald' },
      update: {},
      create: {
        id: 'timeline-fitzgerald',
        planningSubmissionDate: new Date('2023-06-15'),
        planningDecisionDate: new Date('2023-10-12'),
        constructionStartDate: new Date('2024-02-01'),
        constructionEndDate: new Date('2025-08-15'),
        marketingLaunchDate: new Date('2024-01-15'),
        salesLaunchDate: new Date('2024-01-20')
      }
    });

    // Update development with timeline
    await prisma.development.update({
      where: { id: 'dev-fitzgerald-gardens' },
      data: { timelineId: timeline.id }
    });
    console.log('✓ Created project timeline');

    // 5. Create Unit Types and Units
    const unitTypes = [
      {
        name: 'Hawthorne',
        type: 'DETACHED',
        bedrooms: 3,
        bathrooms: 2,
        size: 120,
        basePrice: 397500, // Average of €395k-€400k
        description: '3-bedroom detached houses with private gardens',
        count: 24
      },
      {
        name: 'Oak',
        type: 'DETACHED', 
        bedrooms: 4,
        bathrooms: 3,
        size: 145,
        basePrice: 475000,
        description: '4-bedroom detached houses with large gardens',
        count: 18
      },
      {
        name: 'Birch',
        type: 'APARTMENT',
        bedrooms: 2,
        bathrooms: 2,
        size: 75,
        basePrice: 350000,
        description: '2-bedroom apartments with balconies',
        count: 30
      },
      {
        name: 'Willow',
        type: 'APARTMENT',
        bedrooms: 1,
        bathrooms: 1,
        size: 55,
        basePrice: 295000,
        description: '1-bedroom apartments perfect for first-time buyers',
        count: 24
      }
    ];

    let unitCounter = 1;
    const phaseDistribution = {
      'Phase 1a': 27,
      'Phase 1b': 16,
      'Phase 2a': 43,
      'Phase 2b': 10
    };

    for (const unitType of unitTypes) {
      for (let i = 1; i <= unitType.count; i++) {
        // Determine phase based on unit counter
        let phase = 'Phase 1a';
        if (unitCounter > 27 && unitCounter <= 43) phase = 'Phase 1b';
        else if (unitCounter > 43 && unitCounter <= 86) phase = 'Phase 2a';
        else if (unitCounter > 86) phase = 'Phase 2b';

        // Determine status (68% overall completion)
        let status = 'AVAILABLE';
        if (phase === 'Phase 1a' && Math.random() < 0.2) status = 'SOLD';
        else if (phase === 'Phase 1b' && Math.random() < 0.1) status = 'SOLD';

        const unit = await prisma.unit.create({
          data: {
            id: `unit-fg-${unitCounter.toString().padStart(3, '0')}`,
            developmentId: development.id,
            name: `${unitType.name} ${i}`,
            type: unitType.type,
            size: unitType.size,
            bedrooms: unitType.bedrooms,
            bathrooms: unitType.bathrooms,
            floors: unitType.type === 'APARTMENT' ? 1 : 2,
            parkingSpaces: unitType.type === 'APARTMENT' ? 1 : 2,
            basePrice: unitType.basePrice + (Math.random() * 10000 - 5000), // Add some price variation
            status: status,
            berRating: 'A2',
            features: [
              'Energy A-rated',
              'Modern kitchen',
              'Integrated appliances',
              'Engineered oak flooring',
              'Electric heating',
              'Smart home pre-wiring'
            ],
            primaryImage: `/images/units/${unitType.name.toLowerCase()}/main-${i}.jpg`,
            images: [
              `/images/units/${unitType.name.toLowerCase()}/living-${i}.jpg`,
              `/images/units/${unitType.name.toLowerCase()}/kitchen-${i}.jpg`,
              `/images/units/${unitType.name.toLowerCase()}/bedroom-${i}.jpg`
            ],
            floorplans: [`/documents/floorplans/${unitType.name.toLowerCase()}-floorplan.pdf`],
            unitNumber: i.toString(),
            block: phase,
            floor: unitType.type === 'APARTMENT' ? Math.ceil(i / 4) : 0,
            aspect: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
            availableFrom: phase === 'Phase 1a' ? new Date('2025-03-01') : new Date('2025-08-15'),
            viewCount: Math.floor(Math.random() * 50),
            slug: `${unitType.name.toLowerCase()}-${i}`
          }
        });

        unitCounter++;
      }
      console.log(`✓ Created ${unitType.count} ${unitType.name} units`);
    }

    console.log('🎉 Fitzgerald Gardens data seeded successfully!');
    console.log(`📊 Total units created: ${unitCounter - 1}`);
    console.log('📍 Location: Ballymakenny Road, Drogheda, Co. Louth');
    console.log('🏗️ Construction: 68% complete');
    console.log('📅 Timeline: Feb 2024 - Aug 2025');

  } catch (error) {
    console.error('❌ Error seeding Fitzgerald Gardens:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedFitzgeraldGardens();
}

module.exports = seedFitzgeraldGardens;