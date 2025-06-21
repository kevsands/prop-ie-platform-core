const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding kitchen customization options for testing...');

  // Get the available 4-bed semi-detached unit
  const unit = await prisma.unit.findUnique({
    where: { id: 'cmc2ct24l000ky3pyhb829eac' }
  });

  if (!unit) {
    throw new Error('Unit not found');
  }

  console.log(`Found unit: ${unit.name}`);

  // Create kitchen upgrade options
  const kitchenOptions = [
    {
      unitId: unit.id,
      category: 'KITCHEN',
      name: 'Premium Kitchen Package',
      description: 'Upgrade to granite worktops, soft-close drawers, premium appliances, and under-cabinet LED lighting',
      baseOption: false,
      additionalCost: 8500,
      images: ['/images/customizations/kitchen/premium-kitchen-package.jpg'],
      installationTimeframe: 3,
      supplierInfo: {
        name: 'Nolan Kitchens',
        location: 'Drogheda',
        phone: '041-9876543'
      },
      specificationDetails: 'Granite worktops throughout kitchen, Soft-close doors and drawers, Upgraded premium appliances (Bosch/Neff), Under-cabinet LED lighting strip, Wine rack integration, Pull-out pantry shelving',
      warrantyPeriod: 24
    },
    {
      unitId: unit.id,
      category: 'KITCHEN',
      name: 'Smart Kitchen Package',
      description: 'Smart appliances with app control, induction hob, and integrated tablet dock',
      baseOption: false,
      additionalCost: 12000,
      images: ['/images/customizations/kitchen/smart-kitchen-package.jpg'],
      installationTimeframe: 4,
      supplierInfo: {
        name: 'Smart Kitchen Solutions Ireland',
        location: 'Dublin',
        phone: '01-1234567'
      },
      specificationDetails: 'Smart fridge with app connectivity, Induction hob with smart controls, Smart dishwasher with WiFi, Integrated tablet dock for recipes, Voice-controlled lighting, Smart tap with filtered water',
      warrantyPeriod: 36
    },
    {
      unitId: unit.id,
      category: 'APPLIANCES',
      name: 'Complete White Goods Package',
      description: 'Full set of premium white goods including American-style fridge freezer',
      baseOption: false,
      additionalCost: 4200,
      images: ['/images/customizations/appliances/white-goods-package.jpg'],
      installationTimeframe: 1,
      supplierInfo: {
        name: 'DID Electrical',
        location: 'Drogheda',
        phone: '041-9876789'
      },
      specificationDetails: 'American-style fridge freezer (Samsung/LG), Washing machine and separate dryer, Integrated dishwasher, Built-in microwave, All appliances with 5-year warranty, Free delivery and installation',
      warrantyPeriod: 60
    }
  ];

  const createdOptions = [];
  for (const option of kitchenOptions) {
    const created = await prisma.unitCustomizationOption.create({
      data: option
    });
    createdOptions.push(created);
    console.log(`✅ Created: ${created.name} (+€${created.additionalCost})`);
  }

  console.log(`\n🎉 Successfully created ${createdOptions.length} customization options for unit ${unit.unitNumber}`);
  console.log('💰 Total additional cost available: €' + kitchenOptions.reduce((sum, opt) => sum + opt.additionalCost, 0).toLocaleString());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });