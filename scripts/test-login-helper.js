/**
 * Test login helper
 * Creates a session for test users to bypass the normal login flow
 */

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test login session...');

  // Find the test buyer
  const testBuyer = await prisma.user.findFirst({
    where: { email: 'testbuyer@example.com' }
  });

  if (!testBuyer) {
    console.error('Test buyer not found. Please run create-test-transaction.js first.');
    process.exit(1);
  }

  // Generate a JWT token
  const token = jwt.sign(
    {
      id: testBuyer.id,
      email: testBuyer.email,
      name: testBuyer.name,
      role: testBuyer.role
    },
    process.env.NEXTAUTH_SECRET || 'secret',
    { expiresIn: '1d' }
  );

  // Generate login instructions
  const loginUrl = `http://localhost:3000/api/auth/callback/credentials?token=${token}`;
  
  console.log('\nTest Login Instructions:');
  console.log('------------------------');
  console.log('1. Make sure your development server is running (npm run dev)');
  console.log(`2. Visit this URL in your browser to login as the test buyer:`);
  console.log(`\n   ${loginUrl}\n`);
  console.log('This will create a session that bypasses the normal login flow.');
  console.log('You can then navigate to the transaction page to test the payment system:');
  console.log(`\n   http://localhost:3000/buyer/transactions\n`);
}

main()
  .catch(e => {
    console.error('Error creating test login:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });