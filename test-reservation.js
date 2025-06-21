const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🏠 Testing Reservation Workflow...');

  // Get the unit we've been working with
  const unit = await prisma.unit.findUnique({
    where: { id: 'cmc2ct24l000ky3pyhb829eac' },
    include: {
      development: {
        include: {
          location: true,
          developer: true
        }
      },
      unitType: true
    }
  });

  if (!unit) {
    throw new Error('Unit not found');
  }

  console.log(`📍 Unit: ${unit.name} - ${unit.development.name}`);
  console.log(`💰 Base Price: €${unit.basePrice.toLocaleString()}`);
  console.log(`📊 Current Status: ${unit.status}`);

  // Get existing customization selection
  const customizationSelection = await prisma.customizationSelection.findFirst({
    where: { 
      unitId: unit.id,
      buyer: 'test-buyer-id'
    },
    include: {
      selections: {
        include: {
          option: true
        }
      }
    }
  });

  let totalPrice = unit.basePrice;
  if (customizationSelection) {
    totalPrice += customizationSelection.totalCost;
    console.log(`🔧 Customizations: €${customizationSelection.totalCost.toLocaleString()}`);
    customizationSelection.selections.forEach(sel => {
      console.log(`   • ${sel.option.name} (+€${sel.option.additionalCost.toLocaleString()})`);
    });
  }

  console.log(`💎 Total Property Value: €${totalPrice.toLocaleString()}`);

  // Create a transaction/reservation
  const depositAmount = Math.round(totalPrice * 0.10); // 10% deposit
  
  const reservationData = {
    referenceNumber: `RES-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    unitId: unit.id,
    buyerId: 'cmc2e9o600000y3teqi8fz16y', // Use the registered buyer ID from earlier
    developmentId: unit.developmentId,
    type: 'PURCHASE',
    status: 'RESERVED',
    stage: 'RESERVATION',
    agreedPrice: totalPrice,
    depositPaid: 0,
    totalPaid: 0,
    outstandingBalance: totalPrice,
    reservationDate: new Date(),
    mortgageRequired: true,
    mortgageApproved: false,
    contractsSent: false,
    contractsSigned: false,
    contractsExchanged: false,
    kycCompleted: false,
    amlCheckCompleted: false,
    sourceOfFundsVerified: false,
    customizationsLocked: false,
    preferredContactMethod: 'EMAIL',
    marketingOptIn: true,
    gdprConsent: true,
    referralSource: 'Direct Website',
    notes: `Test reservation with premium kitchen upgrade package. Total value: €${totalPrice.toLocaleString()}. Deposit required: €${depositAmount.toLocaleString()}.`,
    internalNotes: 'System-generated test reservation for demo purposes'
  };

  console.log('\n📝 Creating Reservation...');
  
  const transaction = await prisma.transaction.create({
    data: reservationData,
    include: {
      unit: true,
      buyer: true,
      development: true
    }
  });

  console.log(`✅ Reservation Created: ${transaction.id}`);
  console.log(`📅 Reserved: ${transaction.reservationDate.toLocaleDateString()}`);
  console.log(`💵 Deposit Required: €${depositAmount.toLocaleString()}`);
  console.log(`⏰ Sale Agreement Due: ${new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);

  // Update unit status to RESERVED
  await prisma.unit.update({
    where: { id: unit.id },
    data: { 
      status: 'RESERVED',
      reservationEndDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks
    }
  });

  // Link customization selection to transaction if it exists
  if (customizationSelection) {
    await prisma.customizationSelection.update({
      where: { id: customizationSelection.id },
      data: { 
        transactionId: transaction.id,
        status: 'APPROVED',
        approvedDate: new Date()
      }
    });
    console.log(`🔗 Linked customization selection to reservation`);
  }

  // Create payment records
  const depositPayment = await prisma.payment.create({
    data: {
      transactionId: transaction.id,
      amount: depositAmount,
      status: 'PENDING',
      method: 'BANK_TRANSFER',
      reference: `DEP-${transaction.referenceNumber}`
    }
  });

  const balancePayment = await prisma.payment.create({
    data: {
      transactionId: transaction.id,
      amount: totalPrice - depositAmount,
      status: 'PENDING',
      method: 'BANK_TRANSFER', 
      reference: `BAL-${transaction.referenceNumber}`
    }
  });

  console.log(`💳 Payment schedule created (2 payments)`);

  // Generate reservation summary
  console.log('\n📊 RESERVATION SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`🏠 Property: ${unit.development.name} - ${unit.name}`);
  console.log(`📍 Address: ${unit.development.location.address}, ${unit.development.location.city}`);
  console.log(`👤 Buyer: Registered Buyer (ID: ${transaction.buyerId})`);
  console.log('');
  console.log('💰 FINANCIAL BREAKDOWN:');
  console.log(`   Base Price:        €${unit.basePrice.toLocaleString()}`);
  if (customizationSelection?.totalCost > 0) {
    console.log(`   Customizations:    €${customizationSelection.totalCost.toLocaleString()}`);
  }
  console.log(`   Total Price:       €${totalPrice.toLocaleString()}`);
  console.log(`   Deposit (10%):     €${depositAmount.toLocaleString()}`);
  console.log(`   Stamp Duty:        €${Math.round(totalPrice * 0.01).toLocaleString()}`);
  console.log(`   Legal Fees:        €2,500`);
  console.log(`   TOTAL COST:        €${(totalPrice + Math.round(totalPrice * 0.01) + 2500).toLocaleString()}`);
  console.log('');
  console.log('📅 KEY DATES:');
  console.log(`   Reservation:       ${transaction.reservationDate.toLocaleDateString()}`);
  console.log(`   Sale Agreement:    ${new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
  console.log(`   Completion:        ${new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
  console.log(`   Key Handover:      ${new Date(Date.now() + 125 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
  
  if (customizationSelection) {
    console.log('');
    console.log('🔧 CUSTOMIZATIONS INCLUDED:');
    customizationSelection.selections.forEach(sel => {
      console.log(`   • ${sel.option.name} (+€${sel.option.additionalCost.toLocaleString()})`);
    });
  }

  console.log('\n🎉 RESERVATION WORKFLOW TEST SUCCESSFUL!');
  console.log(`📋 Transaction ID: ${transaction.id}`);
  console.log(`📧 Next Step: Send reservation confirmation to buyer`);
  
  return transaction;
}

main()
  .catch((e) => {
    console.error('❌ Reservation Test Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });