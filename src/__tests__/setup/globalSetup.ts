// Global Setup for Integration Tests
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

export default async function globalSetup() {
  console.log('Setting up test database...');

  try {
    // Run migrations on test database
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
      }
    });

    // Seed test database with initial data
    await seedTestDatabase();

    console.log('Test database setup complete.');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedTestDatabase() {
  // Clear existing data
  await prisma.$executeRaw`TRUNCATE TABLE "Transaction" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Development" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Unit" CASCADE`;

  // Create system user for tests
  await prisma.user.create({
    data: {
      email: 'system@test.com',
      password: '$2b$10$dummyhashedpassword',
      name: 'System User',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true
    }
  });

  console.log('Test database seeded.');
}