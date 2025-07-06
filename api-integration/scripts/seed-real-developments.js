/**
 * Seed script to populate database with real developer-managed developments
 * These are the actual developments that should be managed through /developer/projects/
 * Replaces fake developments with real ones from Drogheda, Co. Louth
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const realDevelopments = [
  {
    id: 'fitzgerald-gardens',
    name: 'Fitzgerald Gardens',
    description: 'Luxurious living with modern comforts in the heart of Drogheda',
    location: 'Drogheda, Co. Louth',
    city: 'Drogheda',
    county: 'Co. Louth',
    status: 'ACTIVE',
    totalUnits: 32,
    startingPrice: 320000,
    isPublished: true,
    mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg'
  },
  {
    id: 'ballymakenny-view',
    name: 'Ballymakenny View', 
    description: 'Modern family homes in a convenient location with excellent amenities',
    location: 'Ballymakenny, Drogheda, Co. Louth',
    city: 'Drogheda',
    county: 'Co. Louth',
    status: 'ACTIVE',
    totalUnits: 16,
    startingPrice: 350000,
    isPublished: true,
    mainImage: '/images/developments/Ballymakenny-View/hero.jpg'
  },
  {
    id: 'ellwood',
    name: 'Ellwood',
    description: 'Contemporary apartment living in Drogheda',
    location: 'Ellwood, Drogheda, Co. Louth',
    city: 'Drogheda', 
    county: 'Co. Louth',
    status: 'ACTIVE',
    totalUnits: 24,
    startingPrice: 285000,
    isPublished: true,
    mainImage: '/images/developments/Ellwood-Logos/hero.jpg'
  }
];

async function main() {
  console.log('🚀 Starting real developments seed...');

  try {
    // Clear existing developments first
    console.log('📦 Clearing existing developments...');
    await prisma.unit.deleteMany({});
    await prisma.development.deleteMany({});

    // Seed real developments
    console.log('🏗️ Seeding real developments...');
    
    for (const devData of realDevelopments) {
      const development = await prisma.development.create({
        data: {
          id: devData.id,
          name: devData.name,
          description: devData.description,
          location: devData.location
        }
      });
      
      console.log(`✅ Created development: ${development.name} (${development.location})`);
    }

    console.log('🎉 Real developments seeded successfully!');
    console.log(`📊 Seeded ${realDevelopments.length} developments:`);
    realDevelopments.forEach(dev => {
      console.log(`   - ${dev.name} in ${dev.location} (${dev.totalUnits} units)`);
    });

  } catch (error) {
    console.error('❌ Error seeding real developments:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();