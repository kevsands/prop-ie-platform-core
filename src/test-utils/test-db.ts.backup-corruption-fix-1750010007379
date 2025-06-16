/**
 * Test database utilities for integration tests
 */

import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Create a mock Prisma client for unit tests
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>\n  );
// Reset the mock between tests
beforeEach(() => {
  mockReset(prismaMock);
});

// Test database connection for integration tests
let testPrisma: PrismaClient | null = null;

export const getTestPrisma = () => {
  if (!testPrisma) {
    testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL}});
  }
  return testPrisma;
};

// Clean up test database after tests
export const cleanupTestDb = async () => {
  const prisma = getTestPrisma();
  
  // Delete all data in reverse order of dependencies
  await prisma.$transaction([
    prisma.document.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.unit.deleteMany(),
    prisma.development.deleteMany(),
    prisma.user.deleteMany()]);
};

// Seed test database with sample data
export const seedTestDb = async () => {
  const prisma = getTestPrisma();
  
  // Create test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'buyer@test.com',
        name: 'Test Buyer',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz', // bcrypt hash
        roles: ['buyer'],
        emailVerified: new Date()}),
    prisma.user.create({
      data: {
        email: 'developer@test.com',
        name: 'Test Developer',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz',
        roles: ['developer'],
        emailVerified: new Date()}),
    prisma.user.create({
      data: {
        email: 'agent@test.com',
        name: 'Test Agent',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz',
        roles: ['agent'],
        emailVerified: new Date()})]);
  
  // Create test development
  const development = await prisma.development.create({
    data: {
      name: 'Test Development',
      description: 'A test development for integration tests',
      location: 'Dublin, Ireland',
      developer: 'Test Developer Corp',
      status: 'active',
      totalUnits: 10,
      availableUnits: 8,
      priceFrom: 250000,
      completionDate: new Date('2025-12-31'),
      features: ['Parking', 'Gym', 'Security'],
      amenities: ['Pool', 'Garden'],
      images: ['/images/test-dev-1.jpg', '/images/test-dev-2.jpg']});
  
  // Create test units
  const units = await Promise.all(
    Array.from({ length: 5 }, (_i: any) =>
      prisma.unit.create({
        data: {
          developmentId: development.id,
          unitNumber: `A${i + 1}`,
          type: i % 2 === 0 ? 'apartment' : 'house',
          bedrooms: (i % 3) + 1,
          bathrooms: (i % 2) + 1,
          size: 80 + i * 10,
          floor: i,
          price: 250000 + i * 50000,
          status: i === 0 ? 'reserved' : 'available',
          features: ['Balcony', 'Storage'],
          images: [`/images/unit-${i + 1}.jpg`]})
    )
  );
  
  // Create test transaction
  const transaction = await prisma.transaction.create({
    data: {
      buyerId: users[0].id, // Test Buyer
      unitId: units[0].id,
      status: 'pending',
      totalAmount: units[0].price,
      depositAmount: units[0].price * 0.1,
      depositPaid: false,
      contractSigned: false,
      mortgageApproved: false,
      completionDate: new Date('2025-06-30')});
  
  return { users, development, units, transaction };
};

// Transaction wrapper for tests
export const withTestTransaction = async <T>(
  fn: (prisma: PrismaClient) => Promise<T>
): Promise<T> => {
  const prisma = getTestPrisma();
  
  return prisma.$transaction(async (tx: any) => {
    const result = await fn(tx as PrismaClient);
    // Rollback the transaction by throwing an error
    throw new Error('ROLLBACK_TEST_TRANSACTION');
  }).catch((error: any) => {
    if (error.message === 'ROLLBACK_TEST_TRANSACTION') {
      return error.result;
    }
    throw error;
  });
};

// Close test database connection
export const closeTestDb = async () => {
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }
};