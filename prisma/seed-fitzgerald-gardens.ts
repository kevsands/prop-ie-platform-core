import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFitzgeraldGardens() {
  // Create user first
  const developer = await prisma.user.upsert({
    where: { email: 'fitzgerald@developers.ie' },
    update: {},
    create: {
      email: 'fitzgerald@developers.ie',
      firstName: 'Fitzgerald',
      lastName: 'Developments',
      password: 'password123', // You should hash this in production
      roles: ['DEVELOPER']
    }
  });

  // Create location
  const location = await prisma.location.create({
    data: {
      address: 'Mell Road',
      city: 'Drogheda',
      county: 'Louth',
      eircode: 'A92 XY34',
      country: 'Ireland'
    }
  });

  // Create Fitzgerald Gardens development
  const fitzgeraldGardens = await prisma.development.create({
    data: {
      name: 'Fitzgerald Gardens',
      slug: 'fitzgerald-gardens',
      status: 'SELLING',
      totalUnits: 120,
      developer: {
        connect: { id: developer.id }
      },
      location: {
        connect: { id: location.id }
      },
      marketingStatus: {},
      salesStatus: {},
      constructionStatus: {},
      complianceStatus: {},
      mainImage: '/images/fitzgerald-gardens/main.jpg',
      images: [
        '/images/fitzgerald-gardens/exterior-1.jpg',
        '/images/fitzgerald-gardens/exterior-2.jpg',
        '/images/fitzgerald-gardens/interior-1.jpg'
      ],
      videos: [],
      description: 'Fitzgerald Gardens is a prestigious new residential development located in the heart of Drogheda, Co. Louth. This carefully planned community offers a perfect blend of modern living and traditional Irish charm, with 120 beautifully designed homes ranging from one-bedroom apartments to spacious four-bedroom houses.',
      shortDescription: 'Premium homes in Drogheda, Co. Louth',
      features: [
        'High-spec kitchen appliances',
        'A-rated energy efficiency',
        'Private parking',
        'Landscaped gardens',
        'Close to schools and amenities'
      ],
      amenities: [
        'Community park',
        'Children\'s playground',
        'Walking trails',
        'Cycle paths',
        'Local shops nearby'
      ],
      tags: ['new-homes', 'drogheda', 'louth', 'a-rated'],
      awards: [],
      isPublished: true,
      publishedDate: new Date()
    }
  });

  // Create Unit Types
  const unitTypes = await Promise.all([
    prisma.unitType.create({
      data: {
        developmentId: fitzgeraldGardens.id,
        name: '1 Bed Apartment',
        bedrooms: 1,
        bathrooms: 1,
        type: 'APARTMENT',
        area: 52,
        priceFrom: 285000,
        totalUnits: 24,
        availableUnits: 0,
        features: ['Balcony', 'Fully Fitted Kitchen', 'Built-in Wardrobes', 'Parking Space Available']
      }
    }),
    prisma.unitType.create({
      data: {
        developmentId: fitzgeraldGardens.id,
        name: '2 Bed Apartment',
        bedrooms: 2,
        bathrooms: 2,
        type: 'APARTMENT',
        area: 75,
        priceFrom: 385000,
        totalUnits: 48,
        availableUnits: 4,
        features: ['Balcony', 'Master En-suite', 'Fully Fitted Kitchen', 'Built-in Wardrobes', 'Parking Space']
      }
    }),
    prisma.unitType.create({
      data: {
        developmentId: fitzgeraldGardens.id,
        name: '3 Bed House',
        bedrooms: 3,
        bathrooms: 2.5,
        type: 'HOUSE',
        area: 110,
        priceFrom: 425000,
        totalUnits: 36,
        availableUnits: 20,
        features: ['Private Garden', 'Master En-suite', 'Utility Room', 'Guest WC', 'Driveway Parking']
      }
    }),
    prisma.unitType.create({
      data: {
        developmentId: fitzgeraldGardens.id,
        name: '4 Bed House',
        bedrooms: 4,
        bathrooms: 3,
        type: 'HOUSE',
        area: 145,
        priceFrom: 475000,
        totalUnits: 12,
        availableUnits: 8,
        features: ['Large Private Garden', 'Master En-suite', 'Two Additional En-suites', 'Utility Room', 'Study', 'Double Garage']
      }
    })
  ]);

  // Create some sample units
  const units = [];
  for (const unitType of unitTypes) {
    // Create 2 sample units for each type
    for (let i = 0; i < 2; i++) {
      const unit = await prisma.unit.create({
        data: {
          developmentId: fitzgeraldGardens.id,
          unitTypeId: unitType.id,
          unitNumber: `${unitType.name.split(' ')[0]}-${i + 1}`,
          name: `Unit ${unitType.name.split(' ')[0]}-${i + 1}`,
          type: unitType.type,
          size: unitType.area,
          bedrooms: unitType.bedrooms,
          bathrooms: unitType.bathrooms,
          floors: 1,
          parkingSpaces: 1,
          basePrice: unitType.priceFrom,
          price: unitType.priceFrom,
          status: i === 0 ? 'AVAILABLE' : 'RESERVED',
          berRating: 'A2',
          features: unitType.features,
          primaryImage: '/images/unit-placeholder.jpg',
          images: [],
          floorplans: [],
          floor: Math.floor(i / 4),
          block: unitType.type === 'APARTMENT' ? 'A' : 'B'
        }
      });
      units.push(unit);
    }
  }

  console.log('Fitzgerald Gardens development created with:');
  console.log('- Development ID:', fitzgeraldGardens.id);
  console.log('- Unit Types:', unitTypes.length);
  console.log('- Sample Units:', units.length);

  return {
    development: fitzgeraldGardens,
    unitTypes,
    units
  };
}

seedFitzgeraldGardens()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
