// Global Teardown for Integration Tests
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

export default async function globalTeardown() {
  console.log('Cleaning up test database...');

  try {
    // Clean up all test data
    await cleanupTestDatabase();
    console.log('Test database cleanup complete.');
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanupTestDatabase() {
  // Clear all tables in reverse order of dependencies
  await prisma.$executeRaw`TRUNCATE TABLE "Notification" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "TransactionEvent" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Payment" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Document" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Task" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Transaction" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Unit" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Development" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
}