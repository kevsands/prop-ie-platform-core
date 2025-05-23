import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');
  
  // Create or find users
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@prop.ie' } });
  const adminUser = existingAdmin || await prisma.user.create({
    data: {
      email: 'admin@prop.ie',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      phone: '+353123456789',
      roles: ['ADMIN'],
      status: 'ACTIVE',
      kycStatus: 'APPROVED',
    },
  });

  const existingDeveloper = await prisma.user.findUnique({ where: { email: 'developer@fitzgerald.ie' } });
  const developer = existingDeveloper || await prisma.user.create({
    data: {
      email: 'developer@fitzgerald.ie',
      password: await bcrypt.hash('developer123', 10),
      firstName: 'John',
      lastName: 'Fitzgerald',
      phone: '+353123456790',
      roles: ['DEVELOPER'],
      status: 'ACTIVE',
      kycStatus: 'APPROVED',
    },
  });

  const existingBuyer = await prisma.user.findUnique({ where: { email: 'buyer@example.com' } });
  const buyer = existingBuyer || await prisma.user.create({
    data: {
      email: 'buyer@example.com',
      password: await bcrypt.hash('buyer123', 10),
      firstName: 'Jane',
      lastName: 'Buyer',
      phone: '+353123456791',
      roles: ['BUYER'],
      status: 'ACTIVE',
      kycStatus: 'APPROVED',
      buyerProfile: {
        create: {
          financialDetails: {
            firstTimeBuyer: true,
            cashBuyer: false,
            mortgageApprovalStatus: 'PENDING',
            helpToBuyEligible: true,
            maxAffordablePrice: 350000,
          },
          preferences: {
            propertyTypes: ['APARTMENT', 'SEMI_DETACHED'],
            minBedrooms: 2,
            maxPrice: 350000,
            preferredLocations: ['Dublin', 'Cork'],
          },
        },
      },
    },
  });

  // Create location
  const location = await prisma.location.create({
    data: {
      address: 'Main Street',
      city: 'Drogheda',
      county: 'Louth',
      eircode: 'A92 F5X2',
      country: 'Ireland',
      latitude: 53.7149,
      longitude: -6.3487,
    },
  });

  // Create Fitzgerald Gardens development
  const development = await prisma.development.create({
    data: {
      name: 'Fitzgerald Gardens',
      slug: 'fitzgerald-gardens',
      developerId: developer.id,
      locationId: location.id,
      status: 'SALES',
      totalUnits: 50,
      description: 'Fitzgerald Gardens is a stunning new development of 50 modern homes perfectly located in the heart of Drogheda. Each home has been thoughtfully designed to provide comfortable, energy-efficient living spaces for modern families.',
      mainImage: '/images/developments/fitzgerald-gardens/hero.jpg',
      images: [
        '/images/developments/fitzgerald-gardens/exterior.jpg',
        '/images/developments/fitzgerald-gardens/interior.jpg',
        '/images/developments/fitzgerald-gardens/amenities.jpg'
      ],
      videos: ['https://vimeo.com/fitzgeraldgardens-intro'],
      features: [
        'A-rated energy efficiency',
        'Premium kitchen appliances',
        'Private parking',
        'Landscaped gardens',
        'Smart home ready',
        'High-speed fiber broadband'
      ],
      marketingStatus: {
        launchDate: new Date('2024-01-15'),
        salesCenterOpen: true,
        showHouseAvailable: true,
        onlineListingActive: true
      },
      salesStatus: {
        totalUnits: 50,
        availableUnits: 32,
        reservedUnits: 8,
        saleAgreedUnits: 5,
        soldUnits: 5,
        salesVelocity: 2.5,
        targetPriceAverage: 385000,
        actualPriceAverage: 392000
      },
      constructionStatus: {
        currentStage: 'First Fix',
        percentageComplete: 65,
        estimatedCompletionDate: new Date('2024-12-01'),
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

  // Create amenities for the development
  const amenities = await Promise.all([
    prisma.amenity.create({
      data: {
        developmentId: development.id,
        name: 'Community Centre',
        type: 'LEISURE',
        distance: 'On-site',
        icon: 'community'
      }
    }),
    prisma.amenity.create({
      data: {
        developmentId: development.id,
        name: 'Children\'s Playground',
        type: 'LEISURE',
        distance: 'On-site',
        icon: 'playground'
      }
    }),
    prisma.amenity.create({
      data: {
        developmentId: development.id,
        name: 'Local Primary School',
        type: 'EDUCATION',
        distance: '5 min drive',
        icon: 'school'
      }
    }),
    prisma.amenity.create({
      data: {
        developmentId: development.id,
        name: 'Shopping Centre',
        type: 'SHOPPING',
        distance: '10 min drive',
        icon: 'shopping'
      }
    })
  ]);

  // Create unit types with schedules of accommodation
  const unitTypes = await Promise.all([
    // Type A - 2 Bed Apartment
    prisma.unitType.create({
      data: {
        development: { connect: { id: development.id } },
        name: 'Type A - 2 Bed Apartment',
        type: 'APARTMENT',
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        priceFrom: 345000,
        totalUnits: 20,
        availableUnits: 12,
        features: [
          'Open plan living/dining/kitchen',
          'Master bedroom with en-suite',
          'Private balcony',
          'Built-in wardrobes',
          'A2 energy rating'
        ],
        schedule: {
          create: [
            { room: 'Living/Dining/Kitchen', area: 32.5, order: 1 },
            { room: 'Master Bedroom', area: 14.2, order: 2 },
            { room: 'Bedroom 2', area: 11.8, order: 3 },
            { room: 'En-suite', area: 4.5, order: 4 },
            { room: 'Bathroom', area: 5.2, order: 5 },
            { room: 'Hallway', area: 7.8, order: 6 },
            { room: 'Balcony', area: 6.0, order: 7 },
            { room: 'Storage', area: 3.0, order: 8 }
          ]
        }
      }
    }),
    
    // Type B - 3 Bed Semi-Detached
    prisma.unitType.create({
      data: {
        development: { connect: { id: development.id } },
        name: 'Type B - 3 Bed Semi-Detached',
        type: 'SEMI_DETACHED',
        bedrooms: 3,
        bathrooms: 3,
        area: 125,
        priceFrom: 385000,
        totalUnits: 20,
        availableUnits: 10,
        features: [
          'Spacious semi-detached home',
          'Separate living and dining rooms',
          'Master bedroom with en-suite',
          'Private rear garden',
          'Driveway parking for 2 cars',
          'A2 energy rating'
        ],
        schedule: {
          create: [
            // Ground Floor
            { room: 'Living Room', area: 16.5, order: 1 },
            { room: 'Kitchen/Dining', area: 25.0, order: 2 },
            { room: 'WC', area: 3.0, order: 3 },
            { room: 'Hallway', area: 8.0, order: 4 },
            { room: 'Utility', area: 4.5, order: 5 },
            // First Floor
            { room: 'Master Bedroom', area: 16.0, order: 6 },
            { room: 'En-suite', area: 5.0, order: 7 },
            { room: 'Bedroom 2', area: 13.5, order: 8 },
            { room: 'Bedroom 3', area: 10.0, order: 9 },
            { room: 'Bathroom', area: 7.0, order: 10 },
            { room: 'Landing', area: 6.0, order: 11 },
            { room: 'Hot Press', area: 2.0, order: 12 }
          ]
        }
      }
    }),

    // Type C - 4 Bed Detached
    prisma.unitType.create({
      data: {
        development: { connect: { id: development.id } },
        name: 'Type C - 4 Bed Detached',
        type: 'DETACHED',
        bedrooms: 4,
        bathrooms: 3,
        area: 165,
        priceFrom: 495000,
        totalUnits: 10,
        availableUnits: 7,
        features: [
          'Spacious detached family home',
          'Separate living room and family room',
          'Large kitchen/dining area',
          'Master bedroom with walk-in wardrobe and en-suite',
          'Integral garage',
          'South-facing rear garden',
          'A1 energy rating'
        ],
        schedule: {
          create: [
            // Ground Floor
            { room: 'Living Room', area: 20.0, order: 1 },
            { room: 'Family Room', area: 15.0, order: 2 },
            { room: 'Kitchen/Dining', area: 28.0, order: 3 },
            { room: 'Utility', area: 6.0, order: 4 },
            { room: 'WC', area: 3.0, order: 5 },
            { room: 'Hallway', area: 10.0, order: 6 },
            { room: 'Garage', area: 18.0, order: 7 },
            // First Floor
            { room: 'Master Bedroom', area: 20.0, order: 8 },
            { room: 'Walk-in Wardrobe', area: 6.0, order: 9 },
            { room: 'Master En-suite', area: 8.0, order: 10 },
            { room: 'Bedroom 2', area: 14.0, order: 11 },
            { room: 'Bedroom 3', area: 12.0, order: 12 },
            { room: 'Bedroom 4', area: 10.0, order: 13 },
            { room: 'Family Bathroom', area: 8.0, order: 14 },
            { room: 'Landing', area: 8.0, order: 15 },
            { room: 'Hot Press', area: 2.0, order: 16 }
          ]
        }
      }
    })
  ]);

  // Create units using existing Unit model
  const allUnits: any[] = [];
  
  // Create units for Type A apartments
  for (let i = 1; i <= 20; i++) {
    const unit = await prisma.unit.create({
      data: {
        development: { connect: { id: development.id } },
        unitType: { connect: { id: unitTypes[0].id } },
        unitNumber: `A${i}`,
        name: `Type A - Unit ${i}`,
        type: 'APARTMENT',
        size: unitTypes[0].area,
        bedrooms: unitTypes[0].bedrooms,
        bathrooms: unitTypes[0].bathrooms,
        floors: 1,
        parkingSpaces: 1,
        basePrice: unitTypes[0].priceFrom + (Math.random() * 10000),
        status: i <= 3 ? 'SOLD' : i <= 8 ? 'RESERVED' : 'AVAILABLE',
        berRating: 'A2',
        features: unitTypes[0].features,
        primaryImage: '/images/units/type-a/main.jpg',
        images: ['/images/units/type-a/living.jpg', '/images/units/type-a/kitchen.jpg'],
        floorplans: ['/images/floor-plans/type-a/ground.jpg'],
        block: 'A',
        floor: Math.floor((i - 1) / 4),
        aspect: ['North', 'South', 'East', 'West'][i % 4],
        availableFrom: new Date('2024-12-01')
      }
    });
    allUnits.push(unit);
  }

  // Create units for Type B semi-detached houses
  for (let i = 1; i <= 20; i++) {
    const unit = await prisma.unit.create({
      data: {
        development: { connect: { id: development.id } },
        unitType: { connect: { id: unitTypes[1].id } },
        unitNumber: `B${i}`,
        name: `Type B - Unit ${i}`,
        type: 'SEMI_DETACHED',
        size: unitTypes[1].area,
        bedrooms: unitTypes[1].bedrooms,
        bathrooms: unitTypes[1].bathrooms,
        floors: 2,
        parkingSpaces: 2,
        basePrice: unitTypes[1].priceFrom + (Math.random() * 15000),
        status: i <= 2 ? 'SOLD' : i <= 5 ? 'SALE_AGREED' : i <= 10 ? 'RESERVED' : 'AVAILABLE',
        berRating: 'A2',
        features: unitTypes[1].features,
        primaryImage: '/images/units/type-b/main.jpg',
        images: ['/images/units/type-b/living.jpg', '/images/units/type-b/kitchen.jpg'],
        floorplans: ['/images/floor-plans/type-b/ground.jpg', '/images/floor-plans/type-b/first.jpg'],
        block: 'B',
        floor: 0,
        aspect: i % 2 === 0 ? 'East' : 'West',
        availableFrom: new Date('2024-11-15')
      }
    });
    allUnits.push(unit);
  }

  // Create units for Type C detached houses
  for (let i = 1; i <= 10; i++) {
    const unit = await prisma.unit.create({
      data: {
        development: { connect: { id: development.id } },
        unitType: { connect: { id: unitTypes[2].id } },
        unitNumber: `C${i}`,
        name: `Type C - Unit ${i}`,
        type: 'DETACHED',
        size: unitTypes[2].area,
        bedrooms: unitTypes[2].bedrooms,
        bathrooms: unitTypes[2].bathrooms,
        floors: 2,
        parkingSpaces: 2,
        basePrice: unitTypes[2].priceFrom + (Math.random() * 25000),
        status: i <= 1 ? 'SOLD' : i <= 3 ? 'RESERVED' : 'AVAILABLE',
        berRating: 'A1',
        features: unitTypes[2].features.concat(['Corner plot', 'Extra storage']),
        primaryImage: '/images/units/type-c/main.jpg',
        images: ['/images/units/type-c/living.jpg', '/images/units/type-c/kitchen.jpg'],
        floorplans: ['/images/floor-plans/type-c/ground.jpg', '/images/floor-plans/type-c/first.jpg'],
        block: 'C',
        floor: 0,
        aspect: ['North', 'South', 'East', 'West'][i % 4],
        availableFrom: new Date('2024-10-30')
      }
    });
    allUnits.push(unit);
  }

  // Create a lead first for viewings
  const lead = await prisma.lead.create({
    data: {
      type: 'buyer',
      status: 'QUALIFIED',
      source: 'WEBSITE',
      priorityScore: 9,
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      email: buyer.email,
      phone: buyer.phone,
      interestedInDevelopmentIds: [development.id],
      notes: ['Interested in 2-bed apartments', 'First-time buyer', 'Pre-approved for mortgage'],
      budget: 380000
    }
  });

  // Create viewings
  const viewings = await Promise.all([
    prisma.viewing.create({
      data: {
        lead: { connect: { id: lead.id } },
        development: { connect: { id: development.id } },
        units: { connect: [{ id: allUnits[12].id }] }, // Unit A12
        date: new Date('2024-04-15'),
        startTime: '14:00',
        endTime: '15:00',
        duration: 60,
        type: 'in_person',
        status: 'COMPLETED',
        hostId: developer.id,
        location: 'Fitzgerald Gardens Sales Office',
        attendees: [
          {
            name: `${buyer.firstName} ${buyer.lastName}`,
            email: buyer.email,
            phone: buyer.phone
          }
        ],
        feedback: {
          rating: 4,
          comments: 'Very interested, likes the layout but concerned about storage',
          interestedInUnit: true
        },
        followUp: {
          required: true,
          date: new Date('2024-04-18'),
          notes: 'Send floor plans and storage solutions'
        },
        notes: 'Buyer very engaged, asked detailed questions about finishes',
        createdById: developer.id
      }
    }),
    prisma.viewing.create({
      data: {
        lead: { connect: { id: lead.id } },
        development: { connect: { id: development.id } },
        units: { connect: [{ id: allUnits[20].id }] }, // Unit B1
        date: new Date('2024-04-20'),
        startTime: '10:00',
        endTime: '11:00',
        duration: 60,
        type: 'in_person',
        status: 'SCHEDULED',
        hostId: developer.id,
        location: 'Fitzgerald Gardens Show House',
        attendees: [
          {
            name: `${buyer.firstName} ${buyer.lastName}`,
            email: buyer.email,
            phone: buyer.phone
          }
        ],
        followUp: {
          required: false
        },
        notes: 'Follow-up viewing for Type B unit',
        createdById: developer.id
      }
    })
  ]);

  // Create a reservation
  const reservation = await prisma.reservation.create({
    data: {
      property: { connect: { id: allUnits[5].id } }, // Reserved Type A apartment
      user: { connect: { id: buyer.id } },
      reservationDate: new Date('2024-03-15'),
      expiryDate: new Date('2024-04-15'),
      depositAmount: 5000,
      depositPaid: true,
      status: 'confirmed',
      agreementSigned: true
    }
  });

  // Create a sale
  const sale = await prisma.sale.create({
    data: {
      development: { connect: { id: development.id } },
      unit: { connect: { id: allUnits[0].id } }, // First sold unit
      buyerId: buyer.id,
      status: 'RESERVATION',
      contractStatus: 'DRAFT',
      basePrice: allUnits[0].basePrice,
      customizationCost: 0,
      totalPrice: allUnits[0].basePrice,
      referenceNumber: 'FG-SALE-001',
      metadata: {
        mortgageRequired: true,
        helpToBuyUsed: true,
      },
      depositInfo: {
        create: {
          initialAmount: 5000,
          initialAmountPercentage: 5,
          initialPaidDate: new Date(),
          balanceAmount: allUnits[0].basePrice - 5000,
          balanceDueDate: new Date('2024-07-01'),
          totalPaid: 5000,
          status: 'PARTIALLY_PAID',
          paymentMethod: 'BANK_TRANSFER',
        },
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log('Created users:', { adminUser, developer, buyer });
  console.log('Created development:', development);
  console.log('Created unit types:', unitTypes.length);
  console.log('Created units:', allUnits.length);
  console.log('Created amenities:', amenities.length);
  console.log('Created viewings:', viewings.length);
  console.log('Created reservation:', reservation);
  console.log('Created sale:', sale);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });