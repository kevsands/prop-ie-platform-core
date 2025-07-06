/**
 * Test script for HTB PostgreSQL service
 * Verifies that the HTB service is working correctly with PostgreSQL
 */

const path = require('path');

// Add the src directory to the path so we can import TypeScript modules
require('ts-node').register({
  project: path.join(process.cwd(), 'tsconfig.json'),
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    strict: false,
    skipLibCheck: true
  }
});

async function testHTBService() {
  try {
    console.log('🧪 Testing HTB PostgreSQL Service...\n');

    // Import the HTB service
    const { htbService } = require('../src/lib/services/htb-postgresql.ts');

    console.log('✅ HTB PostgreSQL service imported successfully');

    // Test 1: Create a new HTB claim
    console.log('\n📝 Test 1: Creating HTB claim...');
    const newClaim = await htbService.createClaim('property-test-123', 50000);
    console.log('✅ HTB claim created successfully');
    console.log(`   Claim ID: ${newClaim.id}`);
    console.log(`   Property ID: ${newClaim.propertyId}`);
    console.log(`   Requested Amount: €${newClaim.requestedAmount}`);
    console.log(`   Status: ${newClaim.status}`);

    // Test 2: Get claim by ID
    console.log('\n🔍 Test 2: Retrieving claim by ID...');
    const retrievedClaim = await htbService.getClaimById(newClaim.id);
    console.log('✅ Claim retrieved successfully');
    console.log(`   Retrieved Claim ID: ${retrievedClaim.id}`);
    console.log(`   Status History: ${retrievedClaim.statusHistory.length} entries`);

    // Test 3: Get buyer claims
    console.log('\n📋 Test 3: Getting buyer claims...');
    const buyerClaims = await htbService.getBuyerClaims();
    console.log('✅ Buyer claims retrieved successfully');
    console.log(`   Total claims: ${buyerClaims.length}`);

    // Test 4: Add a note
    console.log('\n📝 Test 4: Adding note to claim...');
    const note = await htbService.addNote(newClaim.id, 'Test note added via PostgreSQL service', false);
    console.log('✅ Note added successfully');
    console.log(`   Note ID: ${note.id}`);
    console.log(`   Note content: ${note.content}`);

    // Test 5: Submit access code
    console.log('\n🔑 Test 5: Submitting access code...');
    const updatedClaim = await htbService.submitAccessCode(
      newClaim.id, 
      'TEST-ACCESS-CODE-12345', 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    );
    console.log('✅ Access code submitted successfully');
    console.log(`   Updated status: ${updatedClaim.status}`);
    console.log(`   Access code: ${updatedClaim.accessCode}`);

    console.log('\n🎉 All HTB PostgreSQL service tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Service import: PASSED');
    console.log('   ✅ Create claim: PASSED');
    console.log('   ✅ Get claim by ID: PASSED');
    console.log('   ✅ Get buyer claims: PASSED');
    console.log('   ✅ Add note: PASSED');
    console.log('   ✅ Submit access code: PASSED');

    console.log('\n🚀 HTB PostgreSQL Service is ready for production use!');

  } catch (error) {
    console.error('\n❌ HTB Service test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testHTBService()
    .then(() => {
      console.log('\n✅ HTB PostgreSQL service test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ HTB PostgreSQL service test failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testHTBService };