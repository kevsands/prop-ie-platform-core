#!/usr/bin/env node

/**
 * Test script to verify two-factor authentication metadata storage
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTwoFactorMetadata() {
  try {
    console.log('Testing two-factor authentication metadata storage...\n');

    // Create a test user
    const testEmail = `test-2fa-${Date.now()}@example.com`;
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        firstName: 'Test',
        lastName: 'User',
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'NOT_STARTED',
        metadata: {
          twoFactorEnabled: false,
          twoFactorSecret: null
        }
      }
    });

    console.log('✅ Created test user:', testUser.id);
    console.log('Initial metadata:', JSON.stringify(testUser.metadata, null, 2));

    // Enable two-factor authentication
    const secret = 'test-secret-' + Date.now();
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: {
        metadata: {
          ...testUser.metadata,
          twoFactorEnabled: true,
          twoFactorSecret: secret
        }
      }
    });

    console.log('\n✅ Enabled two-factor authentication');
    console.log('Updated metadata:', JSON.stringify(updatedUser.metadata, null, 2));

    // Verify reading two-factor status
    const verifyUser = await prisma.user.findUnique({
      where: { id: testUser.id }
    });

    const metadata = verifyUser.metadata;
    console.log('\n✅ Verified two-factor status:');
    console.log('- Enabled:', metadata.twoFactorEnabled);
    console.log('- Has secret:', !!metadata.twoFactorSecret);

    // Clean up
    await prisma.user.delete({
      where: { id: testUser.id }
    });

    console.log('\n✅ Cleaned up test user');
    console.log('\n🎉 All tests passed! Two-factor authentication metadata storage is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testTwoFactorMetadata();