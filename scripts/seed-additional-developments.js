const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Ellwood Development Configuration
const ellwoodConfig = {
  projectName: "Ellwood",
  location: "Ellwood Avenue, Drogheda, Co. Louth",
  description: "Luxury residential development featuring 48 high-end units with contemporary design and premium finishes",
  
  totalUnits: 48,
  phase1Units: 24,
  availableForSale: 36,
  currentPhase: "Phase 1 Complete, Phase 2 Construction", 
  completionPercentage: 75,
  
  projectStartDate: "2023-08-01",
  estimatedCompletion: "2025-12-15",
  
  unitTypes: {
    "2_bed_apartment": {
      count: 20,
      basePrice: 385000,
      size: 95,
      bedrooms: 2,
      bathrooms: 2
    },
    "3_bed_apartment": {
      count: 18,
      basePrice: 465000,
      size: 140,
      bedrooms: 3,
      bathrooms: 2
    },
    "4_bed_penthouse": {
      count: 10,
      basePrice: 695000,
      size: 220,
      bedrooms: 4,
      bathrooms: 3
    }
  },
  
  totalInvestment: 22000000,
  soldToDate: 12,
  reservedUnits: 6
};

// Ballymakenny View Development Configuration
const ballymakennyConfig = {
  projectName: "Ballymakenny View",
  location: "Ballymakenny Heights, Drogheda, Co. Louth",
  description: "Exclusive development of 32 premium family homes with panoramic views over the Boyne Valley",
  
  totalUnits: 32,
  phase1Units: 32,
  availableForSale: 20,
  currentPhase: "Construction Phase 1", 
  completionPercentage: 45,
  
  projectStartDate: "2024-01-15",
  estimatedCompletion: "2025-10-30",
  
  unitTypes: {
    "3_bed_house": {
      count: 16,
      basePrice: 485000,
      size: 160,
      bedrooms: 3,
      bathrooms: 3
    },
    "4_bed_house": {
      count: 12,
      basePrice: 575000,
      size: 195,
      bedrooms: 4,
      bathrooms: 3
    },
    "5_bed_house": {
      count: 4,
      basePrice: 725000,
      size: 280,
      bedrooms: 5,
      bathrooms: 4
    }
  },
  
  totalInvestment: 18500000,
  soldToDate: 8,
  reservedUnits: 4
};

async function seedAdditionalDevelopments() {
  console.log('🌱 Starting additional developments seeding...');

  try {
    // Create Ellwood Development
    console.log('🏢 Creating Ellwood development...');
    
    // Create location for Ellwood
    const ellwoodLocation = await prisma.location.create({
      data: {
        address: ellwoodConfig.location,
        addressLine1: "Ellwood Avenue",
        city: "Drogheda",
        county: "Louth",
        eircode: "A92 Y9X2",
        country: "Ireland",
        latitude: 53.7125,
        longitude: -6.3425
      }
    });
    
    // Create developer for Ellwood
    const ellwoodDeveloper = await prisma.user.upsert({
      where: { email: "developer@ellwood.ie" },
      update: {},
      create: {
        email: "developer@ellwood.ie",
        firstName: "James",
        lastName: "O'Sullivan",
        phone: "+353 87 234 5678",
        roles: ["DEVELOPER"],
        status: "ACTIVE",
        kycStatus: "APPROVED",
        avatar: "/images/avatars/ellwood-developer.jpg"
      }
    });
    
    // Create Ellwood development
    const ellwoodDevelopment = await prisma.development.create({
      data: {
        name: ellwoodConfig.projectName,
        slug: "ellwood",
        developerId: ellwoodDeveloper.id,
        locationId: ellwoodLocation.id,
        status: "CONSTRUCTION",
        marketingStatus: {
          isActive: true,
          launchDate: "2023-10-01",
          salesStarted: true
        },
        salesStatus: {
          totalUnits: ellwoodConfig.totalUnits,
          soldUnits: ellwoodConfig.soldToDate,
          reservedUnits: ellwoodConfig.reservedUnits,
          availableUnits: ellwoodConfig.availableForSale
        },
        constructionStatus: {
          phase: ellwoodConfig.currentPhase,
          completionPercentage: ellwoodConfig.completionPercentage,
          onTrack: true
        },
        complianceStatus: {
          planningApproved: true,
          buildingRegsApproved: true,
          environmentalClearance: true
        },
        mainImage: "/images/developments/ellwood/hero.jpeg",
        description: ellwoodConfig.description,
        shortDescription: "Luxury 48-unit development in Drogheda",
        features: [
          "A1 BER Energy Rating",
          "Premium finishes throughout",
          "Private balconies and terraces",
          "Underground parking",
          "Concierge service",
          "Landscaped gardens"
        ],
        amenities: [
          "Fitness center",
          "Rooftop terrace",
          "Business center",
          "24/7 security",
          "EV charging stations",
          "Bike storage"
        ],
        buildingType: "Luxury apartments",
        completionDate: new Date(ellwoodConfig.estimatedCompletion),
        startDate: new Date(ellwoodConfig.projectStartDate),
        publishedDate: new Date("2023-10-01"),
        isPublished: true,
        tags: ["Luxury", "Premium", "Contemporary", "Drogheda"]
      }
    });
    
    console.log(`✓ Created Ellwood development`);

    // Create Ballymakenny View Development
    console.log('🏡 Creating Ballymakenny View development...');
    
    // Create location for Ballymakenny View
    const ballymakennyLocation = await prisma.location.create({
      data: {
        address: ballymakennyConfig.location,
        addressLine1: "Ballymakenny Heights",
        city: "Drogheda",
        county: "Louth",
        eircode: "A92 Z8W5",
        country: "Ireland",
        latitude: 53.7155,
        longitude: -6.3485
      }
    });
    
    // Create developer for Ballymakenny View
    const ballymakennyDeveloper = await prisma.user.upsert({
      where: { email: "developer@ballymakennyview.ie" },
      update: {},
      create: {
        email: "developer@ballymakennyview.ie",
        firstName: "Mary",
        lastName: "Connolly",
        phone: "+353 87 345 6789",
        roles: ["DEVELOPER"],
        status: "ACTIVE",
        kycStatus: "APPROVED",
        avatar: "/images/avatars/ballymakenny-developer.jpg"
      }
    });
    
    // Create Ballymakenny View development
    const ballymakennyDevelopment = await prisma.development.create({
      data: {
        name: ballymakennyConfig.projectName,
        slug: "ballymakenny-view",
        developerId: ballymakennyDeveloper.id,
        locationId: ballymakennyLocation.id,
        status: "CONSTRUCTION",
        marketingStatus: {
          isActive: true,
          launchDate: "2024-02-15",
          salesStarted: true
        },
        salesStatus: {
          totalUnits: ballymakennyConfig.totalUnits,
          soldUnits: ballymakennyConfig.soldToDate,
          reservedUnits: ballymakennyConfig.reservedUnits,
          availableUnits: ballymakennyConfig.availableForSale
        },
        constructionStatus: {
          phase: ballymakennyConfig.currentPhase,
          completionPercentage: ballymakennyConfig.completionPercentage,
          onTrack: true
        },
        complianceStatus: {
          planningApproved: true,
          buildingRegsApproved: true,
          environmentalClearance: true
        },
        mainImage: "/images/developments/ballymakenny-view/hero.jpeg",
        description: ballymakennyConfig.description,
        shortDescription: "Exclusive 32-home development with valley views",
        features: [
          "A2 BER Energy Rating",
          "Panoramic valley views",
          "Private gardens",
          "Premium fixtures",
          "Double garages",
          "Modern open-plan living"
        ],
        amenities: [
          "Children's playground",
          "Walking trails",
          "Landscaped common areas",
          "Electric gates",
          "CCTV security",
          "Fiber broadband"
        ],
        buildingType: "Family homes",
        completionDate: new Date(ballymakennyConfig.estimatedCompletion),
        startDate: new Date(ballymakennyConfig.projectStartDate),
        publishedDate: new Date("2024-02-15"),
        isPublished: true,
        tags: ["Family", "Views", "Exclusive", "Drogheda"]
      }
    });
    
    console.log(`✓ Created Ballymakenny View development`);

    // Generate some units for each development
    console.log('🏠 Creating units for developments...');
    
    // Create units for Ellwood
    let unitCounter = 1;
    for (const [type, config] of Object.entries(ellwoodConfig.unitTypes)) {
      for (let i = 0; i < config.count; i++) {
        const unit = await prisma.unit.create({
          data: {
            name: `Ellwood Unit E${unitCounter.toString().padStart(2, '0')}`,
            developmentId: ellwoodDevelopment.id,
            type: type.includes('apartment') ? 'APARTMENT' : 'PENTHOUSE',
            status: i < ellwoodConfig.soldToDate / 3 ? 'SOLD' : 
                   i < (ellwoodConfig.soldToDate + ellwoodConfig.reservedUnits) / 3 ? 'RESERVED' : 'AVAILABLE',
            bedrooms: config.bedrooms,
            bathrooms: config.bathrooms,
            size: config.size,
            floors: type.includes('penthouse') ? 2 : 1,
            parkingSpaces: type.includes('penthouse') ? 2 : 1,
            basePrice: config.basePrice + (Math.random() * 50000 - 25000), // Price variation
            berRating: "A2",
            features: ["Modern kitchen", "High ceilings", "Premium finishes"],
            primaryImage: "/images/units/ellwood/default.jpg",
            images: ["/images/units/ellwood/default.jpg"]
          }
        });
        unitCounter++;
      }
    }
    
    // Create units for Ballymakenny View
    unitCounter = 1;
    for (const [type, config] of Object.entries(ballymakennyConfig.unitTypes)) {
      for (let i = 0; i < config.count; i++) {
        const unit = await prisma.unit.create({
          data: {
            name: `Ballymakenny View House BV${unitCounter.toString().padStart(2, '0')}`,
            developmentId: ballymakennyDevelopment.id,
            type: config.bedrooms >= 5 ? 'DETACHED' : 'SEMI_DETACHED',
            status: i < ballymakennyConfig.soldToDate / 3 ? 'SOLD' : 
                   i < (ballymakennyConfig.soldToDate + ballymakennyConfig.reservedUnits) / 3 ? 'RESERVED' : 'AVAILABLE',
            bedrooms: config.bedrooms,
            bathrooms: config.bathrooms,
            size: config.size,
            floors: 2,
            parkingSpaces: 2,
            basePrice: config.basePrice + (Math.random() * 75000 - 37500), // Price variation
            berRating: "A2",
            features: ["Private garden", "Double garage", "Valley views", "Open plan living"],
            primaryImage: "/images/units/ballymakenny/default.jpg",
            images: ["/images/units/ballymakenny/default.jpg"]
          }
        });
        unitCounter++;
      }
    }
    
    console.log(`✓ Created units for both developments`);

    console.log('✅ Additional developments seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   • Ellwood: ${ellwoodConfig.totalUnits} units (${ellwoodConfig.soldToDate} sold)`);
    console.log(`   • Ballymakenny View: ${ballymakennyConfig.totalUnits} units (${ballymakennyConfig.soldToDate} sold)`);
    console.log(`   • Total value: €${(ellwoodConfig.totalInvestment + ballymakennyConfig.totalInvestment).toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error seeding additional developments:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedAdditionalDevelopments()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });