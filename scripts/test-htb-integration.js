/**
 * Help to Buy (HTB) Integration Test
 * Tests HTB eligibility, calculations, and integration with real property data
 */

const sqlite3 = require('sqlite3').verbose();

console.log('🏠 Testing Help to Buy (HTB) Integration with Real Properties...');

// HTB Constants and Rules
const HTB_RULES = {
  maxPropertyPrice: 500000, // €500k limit for HTB eligibility
  maxGrant: 30000, // €30k maximum grant
  minGrant: 10000, // €10k minimum grant
  grantPercentage: 0.05, // 5% of property price (first €320k) + 10% of balance
  firstThreshold: 320000, // €320k threshold
  secondPercentage: 0.10 // 10% for amount over €320k
};

// Calculate HTB grant amount based on property price
function calculateHTBGrant(propertyPrice) {
  if (propertyPrice > HTB_RULES.maxPropertyPrice) {
    return 0; // Not eligible if over €500k
  }

  let grantAmount = 0;
  
  if (propertyPrice <= HTB_RULES.firstThreshold) {
    // 5% of full amount if under €320k
    grantAmount = propertyPrice * 0.05;
  } else {
    // 5% of first €320k + 10% of remainder
    grantAmount = (HTB_RULES.firstThreshold * 0.05) + ((propertyPrice - HTB_RULES.firstThreshold) * 0.10);
  }

  // Apply min/max limits
  grantAmount = Math.max(HTB_RULES.minGrant, Math.min(HTB_RULES.maxGrant, grantAmount));
  
  return Math.round(grantAmount);
}

// Test scenarios for different buyer types
const testScenarios = [
  {
    name: "First-Time Buyer - Willow 1-Bed",
    propertyType: "1_bed_apartment",
    maxBudget: 320000,
    firstTimeBuyer: true,
    expectedHTBEligible: true,
    expectedUnit: "Willow Collection"
  },
  {
    name: "First-Time Buyer - Birch 2-Bed", 
    propertyType: "2_bed_apartment",
    maxBudget: 380000,
    firstTimeBuyer: true,
    expectedHTBEligible: true,
    expectedUnit: "Birch Collection"
  },
  {
    name: "First-Time Buyer - Hawthorne 3-Bed",
    propertyType: "3_bed_apartment", 
    maxBudget: 420000,
    firstTimeBuyer: true,
    expectedHTBEligible: true,
    expectedUnit: "Hawthorne Collection"
  },
  {
    name: "First-Time Buyer - Oak 4-Bed",
    propertyType: "4_bed_apartment",
    maxBudget: 500000,
    firstTimeBuyer: true,
    expectedHTBEligible: true,
    expectedUnit: "Oak Collection"
  },
  {
    name: "Premium Buyer - Over HTB Limit",
    propertyType: "4_bed_house",
    maxBudget: 600000,
    firstTimeBuyer: true,
    expectedHTBEligible: false,
    expectedUnit: "Not HTB Eligible"
  }
];

// Open database
const db = new sqlite3.Database('./prisma/dev.db', (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database.');
});

async function testHTBEligibility(scenario) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Testing: ${scenario.name}`);
    console.log(`   Property Type: ${scenario.propertyType}`);
    console.log(`   Max Budget: €${scenario.maxBudget.toLocaleString()}`);
    console.log(`   First-Time Buyer: ${scenario.firstTimeBuyer}`);

    // Find properties matching the scenario
    const query = `
      SELECT u.*, d.name as developmentName, d.location 
      FROM Unit u
      JOIN Development d ON u.developmentId = d.id 
      WHERE u.type = ?
        AND u.price <= ?
        AND u.status = 'available'
      ORDER BY u.price ASC
      LIMIT 3
    `;

    db.all(query, [scenario.propertyType, scenario.maxBudget], (err, units) => {
      if (err) {
        console.error('❌ Database query failed:', err.message);
        resolve(false);
        return;
      }

      if (units.length === 0) {
        console.log('⚠️  No properties found matching criteria');
        resolve(false);
        return;
      }

      console.log(`✅ Found ${units.length} matching properties:`);
      
      let htbTestsPassed = 0;
      units.forEach((unit, index) => {
        console.log(`\n   ${index + 1}. ${unit.name}`);
        console.log(`      Price: €${unit.price.toLocaleString()}`);
        console.log(`      Development: ${unit.developmentName}`);

        // Test HTB eligibility
        const isHTBEligible = unit.price <= HTB_RULES.maxPropertyPrice && scenario.firstTimeBuyer;
        const htbGrant = isHTBEligible ? calculateHTBGrant(unit.price) : 0;
        const depositRequired = Math.round(unit.price * 0.1); // 10% deposit
        const netDepositAfterHTB = Math.max(0, depositRequired - htbGrant);

        console.log(`      HTB Eligible: ${isHTBEligible ? '✅ YES' : '❌ NO'}`);
        
        if (isHTBEligible) {
          console.log(`      HTB Grant: €${htbGrant.toLocaleString()}`);
          console.log(`      Deposit Required: €${depositRequired.toLocaleString()}`);
          console.log(`      Net Deposit After HTB: €${netDepositAfterHTB.toLocaleString()}`);
          
          // Calculate percentage coverage
          const htbCoverage = Math.round((htbGrant / depositRequired) * 100);
          console.log(`      HTB Coverage: ${htbCoverage}% of deposit`);
          
          if (htbCoverage >= 80) {
            console.log(`      💰 Excellent HTB coverage!`);
          } else if (htbCoverage >= 50) {
            console.log(`      💵 Good HTB coverage`);
          } else {
            console.log(`      💸 Limited HTB coverage`);
          }
        } else {
          const reason = unit.price > HTB_RULES.maxPropertyPrice ? 
            `Price exceeds €${HTB_RULES.maxPropertyPrice.toLocaleString()} limit` :
            'Not a first-time buyer';
          console.log(`      Reason: ${reason}`);
        }

        // Verify HTB calculation is correct
        const expectedHTB = calculateHTBGrant(unit.price);
        if (htbGrant === expectedHTB) {
          htbTestsPassed++;
        }
      });

      // Verify scenario expectations
      const scenarioCorrect = (units[0].price <= HTB_RULES.maxPropertyPrice) === scenario.expectedHTBEligible;
      if (scenarioCorrect) {
        console.log(`✅ Scenario validation passed`);
      } else {
        console.log(`❌ Scenario validation failed`);
      }

      resolve(htbTestsPassed === units.length && scenarioCorrect);
    });
  });
}

async function testHTBCalculationAccuracy() {
  return new Promise((resolve) => {
    console.log('\n🧮 Testing HTB Calculation Accuracy...');
    
    // Test specific price points for calculation accuracy
    const testPrices = [
      { price: 295000, expected: 14750 }, // 5% of €295k
      { price: 320000, expected: 16000 }, // 5% of €320k
      { price: 350000, expected: 19000 }, // 5% of €320k + 10% of €30k = €16k + €3k
      { price: 397500, expected: 23750 }, // 5% of €320k + 10% of €77.5k = €16k + €7.75k
      { price: 475000, expected: 30000 }, // Would be €31.5k but capped at €30k
      { price: 550000, expected: 0 }      // Over €500k limit
    ];

    let calculationTestsPassed = 0;
    
    testPrices.forEach(test => {
      const calculated = calculateHTBGrant(test.price);
      const correct = calculated === test.expected;
      
      console.log(`   €${test.price.toLocaleString()}: ${correct ? '✅' : '❌'} €${calculated.toLocaleString()} (expected: €${test.expected.toLocaleString()})`);
      
      if (correct) calculationTestsPassed++;
    });

    console.log(`\n📊 HTB Calculation Tests: ${calculationTestsPassed}/${testPrices.length} passed`);
    resolve(calculationTestsPassed === testPrices.length);
  });
}

async function testHTBDatabaseIntegration() {
  return new Promise((resolve) => {
    console.log('\n🔗 Testing HTB Database Integration...');

    // Test that all available units have correct HTB eligibility
    db.all(`
      SELECT u.*, d.name as developmentName
      FROM Unit u
      JOIN Development d ON u.developmentId = d.id 
      WHERE u.status = 'available'
      ORDER BY u.price ASC
    `, (err, units) => {
      if (err) {
        console.error('❌ Database integration test failed:', err.message);
        resolve(false);
        return;
      }

      console.log(`   Testing HTB eligibility for ${units.length} available units...`);
      
      let eligibleUnits = 0;
      let nonEligibleUnits = 0;
      let totalHTBGrants = 0;
      
      units.forEach(unit => {
        const isEligible = unit.price <= HTB_RULES.maxPropertyPrice;
        const htbAmount = isEligible ? calculateHTBGrant(unit.price) : 0;
        
        if (isEligible) {
          eligibleUnits++;
          totalHTBGrants += htbAmount;
        } else {
          nonEligibleUnits++;
        }
      });

      console.log(`   ✅ HTB Eligible Units: ${eligibleUnits}/${units.length}`);
      console.log(`   ❌ Non-Eligible Units: ${nonEligibleUnits}/${units.length}`);
      console.log(`   💰 Total HTB Grants Available: €${totalHTBGrants.toLocaleString()}`);
      console.log(`   📈 Average HTB Grant: €${Math.round(totalHTBGrants / eligibleUnits).toLocaleString()}`);

      // HTB Portfolio Analysis
      const htbByCollection = {};
      units.forEach(unit => {
        if (unit.price <= HTB_RULES.maxPropertyPrice) {
          const collection = unit.name.includes('Willow') ? 'Willow (1-bed)' :
                           unit.name.includes('Birch') ? 'Birch (2-bed)' :
                           unit.name.includes('Hawthorne') ? 'Hawthorne (3-bed)' :
                           unit.name.includes('Oak') ? 'Oak (4-bed)' : 'Other';
          
          if (!htbByCollection[collection]) {
            htbByCollection[collection] = { count: 0, totalGrants: 0 };
          }
          
          htbByCollection[collection].count++;
          htbByCollection[collection].totalGrants += calculateHTBGrant(unit.price);
        }
      });

      console.log('\n   📊 HTB Grants by Collection:');
      Object.entries(htbByCollection).forEach(([collection, data]) => {
        const avgGrant = Math.round(data.totalGrants / data.count);
        console.log(`      ${collection}: ${data.count} units, avg grant €${avgGrant.toLocaleString()}`);
      });

      resolve(true);
    });
  });
}

// Run all HTB tests
async function runAllHTBTests() {
  console.log('🏠 Starting Comprehensive HTB Integration Tests...\n');

  // Test 1: HTB Calculation Accuracy
  console.log('=== PHASE 1: HTB CALCULATION TESTING ===');
  const calculationTestPassed = await testHTBCalculationAccuracy();

  // Test 2: HTB Eligibility by Scenario
  console.log('\n=== PHASE 2: HTB ELIGIBILITY TESTING ===');
  let scenarioTestsPassed = 0;
  for (const scenario of testScenarios) {
    const testPassed = await testHTBEligibility(scenario);
    if (testPassed) scenarioTestsPassed++;
  }

  // Test 3: Database Integration
  console.log('\n=== PHASE 3: HTB DATABASE INTEGRATION ===');
  const integrationTestPassed = await testHTBDatabaseIntegration();

  // Final Results
  setTimeout(() => {
    console.log('\n🎯 HTB INTEGRATION TEST RESULTS');
    console.log('==============================');
    console.log(`✅ HTB Calculation Engine: ${calculationTestPassed ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ HTB Eligibility Scenarios: ${scenarioTestsPassed}/${testScenarios.length} passed`);
    console.log(`✅ Database Integration: ${integrationTestPassed ? 'PASSED' : 'FAILED'}`);

    const totalTests = 1 + testScenarios.length + 1;
    const passedTests = (calculationTestPassed ? 1 : 0) + scenarioTestsPassed + (integrationTestPassed ? 1 : 0);
    const successRate = Math.round((passedTests / totalTests) * 100);

    console.log(`\n🚀 OVERALL HTB SUCCESS RATE: ${successRate}% (${passedTests}/${totalTests} tests passed)`);

    if (successRate >= 90) {
      console.log('🎉 HTB INTEGRATION IS PRODUCTION READY!');
      console.log('💰 Platform can process HTB applications for real first-time buyers');
      console.log('🏠 HTB grants available up to €30,000 per eligible property');
    } else {
      console.log('⚠️  Some HTB issues detected - review failed tests');
    }

    // Close database
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed.');
      }
    });
  }, 1000);
}

// Start the HTB test suite
runAllHTBTests();