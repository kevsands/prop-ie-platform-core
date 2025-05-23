// Test session for debugging login issues
// Run this script to create a test session

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test buyer already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@buyer.com' }
    });

    if (existingUser) {
      console.log('Test user already exists');
      return existingUser;
    }

    // Create test buyer user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@buyer.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Buyer',
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'VERIFIED',
        organization: 'Test Org',
        preferences: {}
      }
    });

    console.log('Test user created successfully:', user.email);
    console.log('Login credentials:');
    console.log('Email: test@buyer.com');
    console.log('Password: password123');
    
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();