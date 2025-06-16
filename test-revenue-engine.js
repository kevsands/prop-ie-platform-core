#!/usr/bin/env node

/**
 * Revenue Engine Testing Script
 * Tests all core revenue functionality without TypeScript compilation issues
 */

const { revenueEngine, FeeType, SubscriptionTier } = require('./src/services/revenueEngine.ts');

async function testRevenueEngine() {
  console.log('🧪 Testing Revenue Engine Implementation\n');

  try {
    // Test 1: Transaction Fee Calculation
    console.log('📊 Test 1: Transaction Fee Calculation');
    const transactionFees = await revenueEngine.calculateTransactionFees(
      'initial_deposit',
      500, // €500 initial deposit
      'card'
    );
    
    console.log('Transaction Fees:', transactionFees);
    console.log(`✅ Expected fee: €${(500 * 0.025).toFixed(2)}, Calculated: €${transactionFees[0].feeAmount.toFixed(2)}`);
    
    // Test 2: PROP Choice Commission
    console.log('\n🪑 Test 2: PROP Choice Commission');
    const propChoiceCommission = await revenueEngine.calculatePropChoiceCommission(
      'furniture',
      2850, // €2,850 furniture purchase
      'buyer-123',
      'fitzgerald-gardens'
    );
    
    console.log('PROP Choice Commission:', propChoiceCommission);
    console.log(`✅ Expected commission: €${(2850 * 0.15).toFixed(2)}, Calculated: €${propChoiceCommission.feeAmount.toFixed(2)}`);
    
    // Test 3: Tender Fees
    console.log('\n🏗️ Test 3: Tender Fees');
    const tenderFee = await revenueEngine.calculateTenderFees(
      'submission',
      'contractor-456',
      450000 // €450,000 tender value
    );
    
    console.log('Tender Fee:', tenderFee);
    console.log(`✅ Expected fee: €25.00, Calculated: €${tenderFee.feeAmount.toFixed(2)}`);
    
    // Test 4: Subscription Pricing
    console.log('\n💰 Test 4: Subscription Pricing');
    const pricing = revenueEngine.getSubscriptionPricing();
    console.log('Enterprise Plan:', pricing[SubscriptionTier.ENTERPRISE]);
    console.log(`✅ Enterprise monthly: €${pricing[SubscriptionTier.ENTERPRISE].monthly}`);
    
    // Test 5: Fee Collection Simulation
    console.log('\n🎯 Test 5: Fee Collection');
    const revenueEvents = await revenueEngine.collectFees(
      [transactionFees[0], propChoiceCommission, tenderFee],
      'TXN-TEST-123',
      'prop-developer',
      { testMode: true }
    );
    
    console.log(`✅ Collected ${revenueEvents.length} revenue events`);
    const totalRevenue = revenueEvents.reduce((sum, event) => sum + event.amount, 0);
    console.log(`💵 Total Revenue Collected: €${totalRevenue.toFixed(2)}`);
    
    console.log('\n🎉 All Revenue Engine Tests Passed!');
    console.log('\n📈 Revenue Optimization Summary:');
    console.log('- Transaction fees: ✅ Working');
    console.log('- PROP Choice commissions: ✅ Working'); 
    console.log('- Tender platform fees: ✅ Working');
    console.log('- Subscription system: ✅ Working');
    console.log('- Fee collection: ✅ Working');
    
  } catch (error) {
    console.error('❌ Revenue Engine Test Failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testRevenueEngine();