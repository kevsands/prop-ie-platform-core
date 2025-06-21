import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting real project database seed...');
  
  // Create Location (Ballymakenny Road, Drogheda)
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

  // Create key team members
  const teamMembers = await Promise.all([
    // Developer/Admin
    prisma.user.upsert({
      where: { email: 'kevin@prop.ie' },
      update: {},
      create: {
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
    }),
    
    // Solicitor - Brady Hughes
    prisma.user.upsert({
      where: { email: 'brady@bradyhughes.ie' },
      update: {},
      create: {
        email: 'brady@bradyhughes.ie',
        password: await bcrypt.hash('solicitor123', 10),
        firstName: 'Brady',
        lastName: 'Hughes',
        phone: '+353417123456',
        roles: ['SOLICITOR'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'Brady Hughes Solicitors',
        position: 'Managing Partner'
      }
    }),

    // Accountant - DFK
    prisma.user.upsert({
      where: { email: 'info@dfk.ie' },
      update: {},
      create: {
        email: 'info@dfk.ie',
        password: await bcrypt.hash('accountant123', 10),
        firstName: 'John',
        lastName: 'Murphy',
        phone: '+353417234567',
        roles: ['AGENT'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'DFK Chartered Accountants',
        position: 'Partner'
      }
    }),

    // Engineer - Waterman Moylan
    prisma.user.upsert({
      where: { email: 'info@watermanmoylan.ie' },
      update: {},
      create: {
        email: 'info@watermanmoylan.ie',
        password: await bcrypt.hash('engineer123', 10),
        firstName: 'Michael',
        lastName: 'Waterman',
        phone: '+353417345678',
        roles: ['ARCHITECT'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'Waterman Moylan Consulting Engineers',
        position: 'Senior Engineer'
      }
    }),

    // Contractor - Meegan Builders
    prisma.user.upsert({
      where: { email: 'info@meeganbuilders.ie' },
      update: {},
      create: {
        email: 'info@meeganbuilders.ie',
        password: await bcrypt.hash('contractor123', 10),
        firstName: 'Tom',
        lastName: 'Meegan',
        phone: '+353417456789',
        roles: ['CONTRACTOR'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'Meegan Builders Ltd',
        position: 'Managing Director'
      }
    }),

    // Sample First-Time Buyer
    prisma.user.upsert({
      where: { email: 'buyer@example.com' },
      update: {},
      create: {
        email: 'buyer@example.com',
        password: await bcrypt.hash('buyer123', 10),
        firstName: 'Sarah',
        lastName: 'Murphy',
        phone: '+353123456791',
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'PENDING_REVIEW',
        buyerProfile: {
          create: {
            financialDetails: {
              firstTimeBuyer: true,
              cashBuyer: false,
              mortgageApprovalStatus: 'PENDING',
              helpToBuyEligible: true,
              maxAffordablePrice: 420000,
            },
            preferences: {
              propertyTypes: ['SEMI_DETACHED', 'TERRACED'],
              minBedrooms: 3,
              maxPrice: 420000,
              preferredLocations: ['Drogheda'],
            },
          },
        },
      }
    })
  ]);

  const [developer, solicitor, accountant, engineer, contractor, buyer] = teamMembers;

  // 1. ELLWOOD - SOLD OUT
  const ellwoodDev = await prisma.development.create({
    data: {
      name: 'Ellwood',
      slug: 'ellwood',
      developerId: developer.id,
      locationId: location.id,
      status: 'COMPLETED',
      totalUnits: 46,
      description: 'Ellwood is a beautifully completed development of 46 premium homes on Ballymakenny Road, Drogheda. All units have been sold and families are now settled in their new homes.',
      mainImage: '/images/developments/ellwood/hero.jpg',
      images: [
        '/images/developments/ellwood/exterior.jpg',
        '/images/developments/ellwood/streetscape.jpg',
        '/images/developments/ellwood/completed.jpg'
      ],
      features: [
        'A2-rated energy efficiency',
        'Premium kitchen appliances',
        'Private driveways',
        'Landscaped front gardens',
        'High-speed fiber broadband',
        'All homes sold and occupied'
      ],
      salesStatus: {
        totalUnits: 46,
        availableUnits: 0,
        reservedUnits: 0,
        saleAgreedUnits: 0,
        soldUnits: 46,
        salesVelocity: 0,
        targetPriceAverage: 385000,
        actualPriceAverage: 395000
      },
      constructionStatus: {
        currentStage: 'Completed',
        percentageComplete: 100,
        estimatedCompletionDate: new Date('2023-08-01'),
        lastUpdated: new Date('2023-08-01')
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

  // 2. BALLYMAKENNY VIEW - 19/20 SOLD
  const ballymakenneyDev = await prisma.development.create({
    data: {
      name: 'Ballymakenny View',
      slug: 'ballymakenny-view',
      developerId: developer.id,
      locationId: location.id,
      status: 'NEARING_COMPLETION',
      totalUnits: 20,
      description: 'Ballymakenny View is an exclusive development of 20 luxury homes. With 19 units already sold, only one final unit remains - coming to market soon.',
      mainImage: '/images/developments/ballymakenny-view/hero.jpg',
      images: [
        '/images/developments/ballymakenny-view/exterior.jpg',
        '/images/developments/ballymakenny-view/show-house.jpg',
        '/images/developments/ballymakenny-view/gardens.jpg'
      ],
      features: [
        'A1-rated energy efficiency',
        'Designer kitchens with island',
        'Master bedroom with walk-in wardrobe',
        'South-facing rear gardens',
        'Electric vehicle charging points',
        'Premium finishes throughout'
      ],
      salesStatus: {
        totalUnits: 20,
        availableUnits: 1,
        reservedUnits: 0,
        saleAgreedUnits: 0,
        soldUnits: 19,
        salesVelocity: 0,
        targetPriceAverage: 445000,
        actualPriceAverage: 458000
      },
      constructionStatus: {
        currentStage: 'Final Fix',
        percentageComplete: 95,
        estimatedCompletionDate: new Date('2024-09-01'),
        lastUpdated: new Date('2024-03-20')
      },
      complianceStatus: {
        planningPermission: true,
        buildingRegulations: true,
        fireRegulations: true,
        disabilityAccess: true,
        energyRating: 'A1'
      }
    }
  });

  // 3. FITZGERALD GARDENS - PHASE 1 ACTIVE SELLING
  const fitzgeraldDev = await prisma.development.create({
    data: {
      name: 'Fitzgerald Gardens',
      slug: 'fitzgerald-gardens',
      developerId: developer.id,
      locationId: location.id,
      status: 'SALES',
      totalUnits: 96, // Total site
      description: 'Fitzgerald Gardens is an exceptional new development of family homes on Ballymakenny Road, Drogheda. Phase 1 consists of 27 high-quality homes with 15 available for immediate sale to the public. The complete development will comprise 96 homes across multiple phases.',
      mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg',
      images: [
        '/images/developments/fitzgerald-gardens/1.jpg',
        '/images/developments/fitzgerald-gardens/2.jpg',
        '/images/developments/fitzgerald-gardens/3.jpg',
        '/images/developments/fitzgerald-gardens/2bed-apartment.jpeg',
        '/images/developments/fitzgerald-gardens/3bed-House.jpeg',
        '/images/developments/fitzgerald-gardens/HouseTypes Header.jpeg',
        '/images/developments/fitzgerald-gardens/Vanity-unit.jpeg'
      ],
      features: [
        'A2-rated energy efficiency',
        'Modern kitchen with premium appliances',
        'Underfloor heating throughout',
        'Triple glazed windows',
        'Smart home technology ready',
        'Private parking spaces',
        'Landscaped communal areas',
        'Children\'s playground'
      ],
      marketingStatus: {
        launchDate: new Date('2024-02-01'),
        salesCenterOpen: true,
        showHouseAvailable: true,
        onlineListingActive: true
      },
      salesStatus: {
        totalUnits: 27, // Phase 1 only
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

  // Create Amenities for Fitzgerald Gardens
  const amenities = await Promise.all([
    prisma.amenity.create({
      data: {
        developmentId: fitzgeraldDev.id,
        name: 'Children\'s Playground',
        type: 'LEISURE',
        distance: 'On-site',
        icon: 'playground'
      }
    }),
    prisma.amenity.create({
      data: {
        developmentId: fitzgeraldDev.id,
        name: 'Landscaped Green Spaces',
        type: 'LEISURE',
        distance: 'On-site',
        icon: 'park'
      }
    }),
    prisma.amenity.create({
      data: {
        developmentId: fitzgeraldDev.id,
        name: 'Drogheda Town Centre',
        type: 'SHOPPING',
        distance: '5 min drive',
        icon: 'shopping'
      }
    }),
    prisma.amenity.create({
      data: {
        developmentId: fitzgeraldDev.id,
        name: 'Local Primary Schools',
        type: 'EDUCATION',
        distance: '3 min drive',
        icon: 'school'
      }
    }),
    prisma.amenity.create({
      data: {
        developmentId: fitzgeraldDev.id,
        name: 'Drogheda Train Station',
        type: 'TRANSPORT',
        distance: '8 min drive',
        icon: 'train'
      }
    }),
    prisma.amenity.create({
      data: {
        developmentId: fitzgeraldDev.id,
        name: 'M1 Motorway Access',
        type: 'TRANSPORT',
        distance: '2 min drive',
        icon: 'road'
      }
    })
  ]);

  // Create Unit Types for Fitzgerald Gardens based on your pricing
  const unitTypes = await Promise.all([
    // 1 Bed Apartment - €235,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: fitzgeraldDev.id } },
        name: '1 Bed Apartment',
        type: 'APARTMENT',
        bedrooms: 1,
        bathrooms: 1,
        area: 65,
        priceFrom: 235000,
        totalUnits: 3,
        availableUnits: 2,
        features: [
          'Open plan living/kitchen',
          'Double bedroom with built-in wardrobes',
          'Modern bathroom with shower',
          'Private balcony',
          'Allocated parking space',
          'A2 energy rating'
        ]
      }
    }),

    // 2 Bed Mid Duplex - €345,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: fitzgeraldDev.id } },
        name: '2 Bed Mid Duplex',
        type: 'DUPLEX',
        bedrooms: 2,
        bathrooms: 2,
        area: 79,
        priceFrom: 345000,
        totalUnits: 4,
        availableUnits: 3,
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

    // 2 Bed End Duplex - €365,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: fitzgeraldDev.id } },
        name: '2 Bed End Duplex',
        type: 'DUPLEX',
        bedrooms: 2,
        bathrooms: 2,
        area: 81,
        priceFrom: 365000,
        totalUnits: 2,
        availableUnits: 1,
        features: [
          'End-of-terrace duplex',
          'Additional side windows',
          'Open plan living/dining/kitchen',
          'Master bedroom with en-suite',
          'Private front door',
          'Parking space',
          'A2 energy rating'
        ]
      }
    }),

    // 3 Bed Mid Duplex - €385,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: fitzgeraldDev.id } },
        name: '3 Bed Mid Duplex',
        type: 'DUPLEX',
        bedrooms: 3,
        bathrooms: 2,
        area: 95,
        priceFrom: 385000,
        totalUnits: 3,
        availableUnits: 2,
        features: [
          'Spacious three-bedroom duplex',
          'Open plan living/dining/kitchen',
          'Master bedroom with en-suite',
          'Two additional bedrooms',
          'Parking space',
          'A2 energy rating'
        ]
      }
    }),

    // 3 Bed End Duplex - €395,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: fitzgeraldDev.id } },
        name: '3 Bed End Duplex',
        type: 'DUPLEX',
        bedrooms: 3,
        bathrooms: 2,
        area: 98,
        priceFrom: 395000,
        totalUnits: 2,
        availableUnits: 1,
        features: [
          'End-of-terrace three-bedroom duplex',
          'Additional side windows',
          'Open plan living/dining/kitchen',
          'Master bedroom with en-suite',
          'Two additional bedrooms',
          'Parking space',
          'A2 energy rating'
        ]
      }
    }),

    // 3 Bed Mid - €389,950
    prisma.unitType.create({
      data: {
        development: { connect: { id: fitzgeraldDev.id } },
        name: '3 Bed Mid Terrace',
        type: 'TERRACED',
        bedrooms: 3,
        bathrooms: 2,
        area: 107,
        priceFrom: 389950,
        totalUnits: 4,
        availableUnits: 2,
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
        development: { connect: { id: fitzgeraldDev.id } },
        name: '3 Bed End Terrace',
        type: 'TERRACED',
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        priceFrom: 399950,
        totalUnits: 2,
        availableUnits: 1,
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

    // 3 Bed Semi - €425,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: fitzgeraldDev.id } },
        name: '3 Bed Semi-Detached',
        type: 'SEMI_DETACHED',
        bedrooms: 3,
        bathrooms: 3,
        area: 125,
        priceFrom: 425000,
        totalUnits: 4,
        availableUnits: 2,
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

    // 4 Bed Semi - €495,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: fitzgeraldDev.id } },
        name: '4 Bed Semi-Detached',
        type: 'SEMI_DETACHED',
        bedrooms: 4,
        bathrooms: 3,
        area: 145,
        priceFrom: 495000,
        totalUnits: 2,
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

    // 4 Bed End - €475,000
    prisma.unitType.create({
      data: {
        development: { connect: { id: fitzgeraldDev.id } },
        name: '4 Bed End Terrace',
        type: 'TERRACED',
        bedrooms: 4,
        bathrooms: 3,
        area: 135,
        priceFrom: 475000,
        totalUnits: 1,
        availableUnits: 0, // Reserved
        features: [
          'Spacious end-of-terrace family home',
          'Additional side windows',
          'Separate living and family rooms',
          'Modern kitchen/dining area',
          'Master bedroom with en-suite',
          'Three additional bedrooms',
          'Guest WC downstairs',
          'Private rear garden',
          'Parking space',
          'A2 energy rating'
        ]
      }
    })
  ]);

  // Create specific units for Fitzgerald Gardens Phase 1
  const allUnits: any[] = [];
  let unitCounter = 1;

  // Create units for each type
  for (let typeIndex = 0; typeIndex < unitTypes.length; typeIndex++) {
    const unitType = unitTypes[typeIndex];
    
    for (let i = 1; i <= unitType.totalUnits; i++) {
      const isAvailable = i <= unitType.availableUnits;
      const isReserved = !isAvailable && i <= (unitType.totalUnits - unitType.availableUnits);
      
      let status: string;
      if (i <= unitType.availableUnits) {
        status = 'AVAILABLE';
      } else if (i <= unitType.totalUnits - 2) {
        status = 'RESERVED';
      } else {
        status = 'SALE_AGREED';
      }

      const unit = await prisma.unit.create({
        data: {
          development: { connect: { id: fitzgeraldDev.id } },
          unitType: { connect: { id: unitType.id } },
          unitNumber: `FG${unitCounter.toString().padStart(2, '0')}`,
          name: `${unitType.name} - Unit ${unitCounter}`,
          type: unitType.type,
          size: unitType.area,
          bedrooms: unitType.bedrooms,
          bathrooms: unitType.bathrooms,
          floors: unitType.type === 'APARTMENT' ? 1 : 2,
          parkingSpaces: unitType.type === 'APARTMENT' ? 1 : unitType.bedrooms >= 4 ? 2 : 1,
          basePrice: unitType.priceFrom + (Math.random() * 5000),
          status: status,
          berRating: 'A2',
          features: unitType.features,
          primaryImage: `/images/units/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/main.jpg`,
          images: [
            `/images/units/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/living.jpg`,
            `/images/units/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/kitchen.jpg`,
            `/images/units/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/bedroom.jpg`
          ],
          floorplans: [
            `/images/floor-plans/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/ground.pdf`,
            ...(unitType.type !== 'APARTMENT' ? [`/images/floor-plans/fitzgerald-gardens/${unitType.name.toLowerCase().replace(/\s+/g, '-')}/first.pdf`] : [])
          ],
          block: 'Phase 1',
          floor: unitType.type === 'APARTMENT' ? Math.floor((i - 1) / 3) : 0,
          aspect: ['North', 'South', 'East', 'West'][unitCounter % 4],
          availableFrom: new Date('2025-03-01')
        }
      });
      allUnits.push(unit);
      unitCounter++;
    }
  }

  // Create customization options for Fitzgerald Gardens
  const customizationOptions = await Promise.all([
    // Kitchen Upgrades
    prisma.unitCustomizationOption.create({
      data: {
        unitType: { connect: { id: unitTypes[7].id } }, // Connect to 3 Bed Semi (most popular)
        name: 'Premium Kitchen Package',
        category: 'KITCHEN',
        type: 'UPGRADE',
        description: 'Upgraded kitchen with granite worktops, soft-close drawers, and premium appliances',
        price: 8500,
        isDefault: false,
        orderByDate: new Date('2024-10-01'), // 8 weeks before completion
        installationDuration: 2,
        supplier: 'Nolan Kitchens',
        features: [
          'Granite worktops',
          'Soft-close drawers and doors',
          'Upgrade to premium appliances',
          'Under-cabinet LED lighting',
          'Wine rack inclusion'
        ],
        images: ['/images/customizations/kitchen/premium-package.jpg']
      }
    }),

    // Flooring Upgrade
    prisma.unitCustomizationOption.create({
      data: {
        unitType: { connect: { id: unitTypes[7].id } },
        name: 'Engineered Hardwood Flooring',
        category: 'FLOORING',
        type: 'UPGRADE',
        description: 'Premium engineered oak flooring throughout ground floor living areas',
        price: 4200,
        isDefault: false,
        orderByDate: new Date('2024-11-01'),
        installationDuration: 3,
        supplier: 'Irish Hardwood Flooring',
        features: [
          'Engineered oak flooring',
          'Professional installation',
          'Skirting board upgrade',
          '25-year warranty'
        ],
        images: ['/images/customizations/flooring/engineered-oak.jpg']
      }
    }),

    // White Goods Package
    prisma.unitCustomizationOption.create({
      data: {
        unitType: { connect: { id: unitTypes[7].id } },
        name: 'Complete White Goods Package',
        category: 'APPLIANCES',
        type: 'PACKAGE',
        description: 'Complete set of premium white goods including fridge freezer, washing machine, and dishwasher',
        price: 3200,
        isDefault: false,
        orderByDate: new Date('2024-12-01'),
        installationDuration: 1,
        supplier: 'DID Electrical',
        features: [
          'American-style fridge freezer',
          'Washing machine & dryer',
          'Dishwasher',
          'Microwave',
          'Full manufacturer warranties'
        ],
        images: ['/images/customizations/appliances/white-goods-package.jpg']
      }
    }),

    // Smart Home Package
    prisma.unitCustomizationOption.create({
      data: {
        unitType: { connect: { id: unitTypes[7].id } },
        name: 'Smart Home Technology Package',
        category: 'TECHNOLOGY',
        type: 'PACKAGE',
        description: 'Complete smart home system with app control, smart heating, and security',
        price: 2800,
        isDefault: false,
        orderByDate: new Date('2024-10-15'),
        installationDuration: 2,
        supplier: 'Smart Home Ireland',
        features: [
          'Smart thermostat with app control',
          'Smart lighting throughout',
          'Video doorbell system',
          'Smart security sensors',
          'Integrated control app'
        ],
        images: ['/images/customizations/technology/smart-home-package.jpg']
      }
    }),

    // Furniture Package - Living Room
    prisma.unitCustomizationOption.create({
      data: {
        unitType: { connect: { id: unitTypes[7].id } },
        name: 'Living Room Furniture Package',
        category: 'FURNITURE',
        type: 'PACKAGE',
        description: 'Complete living room furniture package including sofa, coffee table, and lighting',
        price: 4500,
        isDefault: false,
        orderByDate: new Date('2025-01-15'),
        installationDuration: 1,
        supplier: 'DFS Ireland',
        features: [
          '3-seater sofa and 2-seater',
          'Coffee table and side tables',
          'Table lamps and floor lamp',
          'Curtains and cushions',
          'Professional delivery and setup'
        ],
        images: ['/images/customizations/furniture/living-room-package.jpg']
      }
    }),

    // Bedroom Package
    prisma.unitCustomizationOption.create({
      data: {
        unitType: { connect: { id: unitTypes[7].id } },
        name: 'Master Bedroom Furniture Package',
        category: 'FURNITURE',
        type: 'PACKAGE',
        description: 'Complete master bedroom furniture including bed, wardrobes, and bedside units',
        price: 3800,
        isDefault: false,
        orderByDate: new Date('2025-01-15'),
        installationDuration: 1,
        supplier: 'Harvey Norman',
        features: [
          'King size bed with premium mattress',
          'Fitted wardrobes',
          'Bedside lockers (pair)',
          'Dressing table with mirror',
          'Bedroom lighting'
        ],
        images: ['/images/customizations/furniture/bedroom-package.jpg']
      }
    })
  ]);

  // Create a lead and viewing for demonstration
  const lead = await prisma.lead.create({
    data: {
      type: 'buyer',
      status: 'QUALIFIED',
      source: 'WEBSITE',
      priorityScore: 8,
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      email: buyer.email,
      phone: buyer.phone,
      interestedInDevelopmentIds: [fitzgeraldDev.id],
      notes: ['Interested in 3-bed semi-detached', 'First-time buyer', 'Help-to-Buy eligible'],
      budget: 425000
    }
  });

  // Create a viewing
  const viewing = await prisma.viewing.create({
    data: {
      lead: { connect: { id: lead.id } },
      development: { connect: { id: fitzgeraldDev.id } },
      units: { connect: [{ id: allUnits[15].id }] }, // 3 Bed Semi unit
      date: new Date('2024-04-15'),
      startTime: '14:00',
      endTime: '15:00',
      duration: 60,
      type: 'in_person',
      status: 'COMPLETED',
      hostId: developer.id,
      location: 'Fitzgerald Gardens Sales Office, Ballymakenny Road',
      attendees: [
        {
          name: `${buyer.firstName} ${buyer.lastName}`,
          email: buyer.email,
          phone: buyer.phone
        }
      ],
      feedback: {
        rating: 5,
        comments: 'Very impressed with the quality and location. Interested in customization options.',
        interestedInUnit: true
      },
      followUp: {
        required: true,
        date: new Date('2024-04-18'),
        notes: 'Send customization brochure and arrange second viewing'
      },
      notes: 'Buyer very engaged, asked about kitchen upgrades and completion timeline',
      createdById: developer.id
    }
  });

  // Create a reservation
  const reservation = await prisma.reservation.create({
    data: {
      property: { connect: { id: allUnits[15].id } }, // Reserved 3 bed semi
      user: { connect: { id: buyer.id } },
      reservationDate: new Date('2024-04-20'),
      expiryDate: new Date('2024-05-20'),
      depositAmount: 10000,
      depositPaid: true,
      status: 'confirmed',
      agreementSigned: true
    }
  });

  console.log('Real project database seeded successfully!');
  console.log('\n=== DEVELOPMENTS CREATED ===');
  console.log(`1. Ellwood: ${ellwoodDev.totalUnits} units (SOLD OUT)`);
  console.log(`2. Ballymakenny View: ${ballymakenneyDev.totalUnits} units (19 sold, 1 remaining)`);
  console.log(`3. Fitzgerald Gardens: ${fitzgeraldDev.totalUnits} total units (Phase 1: 27 units, 15 available for sale)`);
  
  console.log('\n=== TEAM MEMBERS CREATED ===');
  console.log(`- Kevin Fitzgerald (Developer): kevin@prop.ie`);
  console.log(`- Brady Hughes (Solicitor): brady@bradyhughes.ie`);
  console.log(`- DFK Accountants: info@dfk.ie`);
  console.log(`- Waterman Moylan Engineers: info@watermanmoylan.ie`);
  console.log(`- Meegan Builders: info@meeganbuilders.ie`);
  
  console.log('\n=== FITZGERALD GARDENS DETAILS ===');
  console.log(`Total Unit Types: ${unitTypes.length}`);
  console.log(`Total Units Created: ${allUnits.length}`);
  console.log(`Customization Options: ${customizationOptions.length}`);
  console.log(`Price Range: €235,000 - €495,000`);
  
  console.log('\n=== SALES ACTIVITY ===');
  console.log(`Sample Lead Created: ${lead.firstName} ${lead.lastName}`);
  console.log(`Viewing Scheduled: ${viewing.date}`);
  console.log(`Reservation Made: Unit ${allUnits[15].unitNumber}`);
  
  console.log('\nDatabase ready for September launch! 🏠✨');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });