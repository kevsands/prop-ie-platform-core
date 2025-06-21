const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking customization options...');

  // Check unit customization options
  const options = await prisma.unitCustomizationOption.findMany({
    where: { unitId: 'cmc2ct24l000ky3pyhb829eac' }
  });

  console.log(`Found ${options.length} customization options:`);
  
  options.forEach(option => {
    console.log(`  • ${option.name} (${option.category}) - €${option.additionalCost.toLocaleString()}`);
    console.log(`    Description: ${option.description}`);
    console.log(`    Installation: ${option.installationTimeframe} weeks`);
    console.log('');
  });

  if (options.length > 0) {
    console.log('✅ Customization options are available for testing');
    console.log('🔗 Testing kitchen upgrade selection...');
    
    // Test creating a customization selection
    const selection = await prisma.customizationSelection.create({
      data: {
        unitId: 'cmc2ct24l000ky3pyhb829eac',
        buyer: 'test-buyer-id',
        status: 'DRAFT',
        totalCost: 0,
        notes: 'Test kitchen upgrade selection'
      }
    });
    
    console.log(`📝 Created selection: ${selection.id}`);
    
    // Add the premium kitchen package to the selection
    const premiumKitchen = options.find(opt => opt.name === 'Premium Kitchen Package');
    
    if (premiumKitchen) {
      const selectedOption = await prisma.selectedOption.create({
        data: {
          selectionId: selection.id,
          optionId: premiumKitchen.id,
          notes: 'Selected premium kitchen upgrade with granite worktops',
          quantity: 1
        }
      });
      
      // Update selection total cost
      await prisma.customizationSelection.update({
        where: { id: selection.id },
        data: { totalCost: premiumKitchen.additionalCost }
      });
      
      console.log(`✅ Selected: ${premiumKitchen.name} (+€${premiumKitchen.additionalCost})`);
      console.log(`💰 Selection total: €${premiumKitchen.additionalCost.toLocaleString()}`);
      
      // Fetch the complete selection with options
      const completeSelection = await prisma.customizationSelection.findUnique({
        where: { id: selection.id },
        include: {
          selections: {
            include: {
              option: true
            }
          }
        }
      });
      
      console.log('\n📋 Complete Selection Summary:');
      console.log(`   Selection ID: ${completeSelection.id}`);
      console.log(`   Status: ${completeSelection.status}`);
      console.log(`   Total Cost: €${completeSelection.totalCost.toLocaleString()}`);
      console.log(`   Selected Options: ${completeSelection.selections.length}`);
      
      completeSelection.selections.forEach(sel => {
        console.log(`     • ${sel.option.name} - €${sel.option.additionalCost.toLocaleString()}`);
      });
      
      console.log('\n🎉 Kitchen upgrade customization workflow test SUCCESSFUL!');
    }
  } else {
    console.log('❌ No customization options found');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });