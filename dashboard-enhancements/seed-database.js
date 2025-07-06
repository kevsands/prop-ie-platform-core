#!/usr/bin/env node

/**
 * Seed Database with Real Development Data
 * 
 * This script populates the database with real development projects
 * to replace the static mockDevelopments.ts file.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const realDevelopments = [
  {
    name: "Fitzgerald Gardens",
    description: "Luxury residential development in Dublin with 150 premium units",
    location: "Dublin 4, Ireland"
  },
  {
    name: "Phoenix Park Residences", 
    description: "Modern family homes near Phoenix Park with sustainable design",
    location: "Dublin 7, Ireland"
  },
  {
    name: "Killarney Heights",
    description: "Boutique development with panoramic views of Killarney National Park",
    location: "Killarney, Kerry"
  },
  {
    name: "Galway Bay Apartments",
    description: "Waterfront apartments with stunning views of Galway Bay",
    location: "Galway City, Ireland"
  },
  {
    name: "Cork Marina Village",
    description: "Contemporary townhouses and apartments in Cork's marina district",
    location: "Cork City, Ireland"
  }
];

async function seedDatabase() {
  console.log('🌱 Seeding PropIE database with real development data...\n');
  
  try {
    // Clear existing developments
    console.log('1️⃣ Clearing existing developments...');
    await prisma.development.deleteMany({});
    console.log('   ✅ Cleared existing data\n');
    
    // Create real developments
    console.log('2️⃣ Creating real developments...');
    for (const dev of realDevelopments) {
      const created = await prisma.development.create({
        data: dev
      });
      console.log(`   ✅ Created: ${created.name} (${created.id})`);
    }
    
    console.log('\n3️⃣ Final verification...');
    const count = await prisma.development.count();
    console.log(`   ✅ Total developments in database: ${count}`);
    
    // Show all developments
    const allDevelopments = await prisma.development.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        createdAt: true
      }
    });
    
    console.log('\n📋 Developments in Database:');
    allDevelopments.forEach(dev => {
      console.log(`   • ${dev.name} - ${dev.location}`);
    });
    
    console.log('\n🎉 DATABASE SEEDING COMPLETE!');
    console.log('\n🚀 Your PropIE platform now has REAL DATA instead of static mockups!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update frontend components to fetch from /api/developments');
    console.log('   2. Replace mockDevelopments.ts imports with API calls');
    console.log('   3. Test the updated UI with real database data');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();