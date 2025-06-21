import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up customization packages for Fitzgerald Gardens...');

  // Get Fitzgerald Gardens development
  const fitzDev = await prisma.development.findFirst({
    where: { slug: 'fitzgerald-gardens' },
    include: { UnitType: true }
  });

  if (!fitzDev) {
    throw new Error('Fitzgerald Gardens development not found');
  }

  console.log(`Found development: ${fitzDev.name} with ${fitzDev.UnitType.length} unit types`);

  // Create customization options for each unit type
  const customizationOptions = [];

  // Kitchen Upgrade Packages
  const kitchenUpgrades = [
    {
      name: 'Premium Kitchen Package',
      category: 'KITCHEN',
      description: 'Upgrade to granite worktops, soft-close drawers, premium appliances, and under-cabinet LED lighting',
      price: 8500,
      orderByDate: new Date('2024-10-01'), // 5 months before completion
      features: [
        'Granite worktops throughout kitchen',
        'Soft-close doors and drawers',
        'Upgraded premium appliances (Bosch/Neff)',
        'Under-cabinet LED lighting strip',
        'Wine rack integration',
        'Pull-out pantry shelving'
      ],
      supplier: 'Nolan Kitchens, Drogheda',
      installationDuration: 3
    },
    {
      name: 'Smart Kitchen Package',
      category: 'KITCHEN',
      description: 'Smart appliances with app control, induction hob, and integrated tablet dock',
      price: 12000,
      orderByDate: new Date('2024-10-01'),
      features: [
        'Smart fridge with app connectivity',
        'Induction hob with smart controls',
        'Smart dishwasher with WiFi',
        'Integrated tablet dock for recipes',
        'Voice-controlled lighting',
        'Smart tap with filtered water'
      ],
      supplier: 'Smart Kitchen Solutions Ireland',
      installationDuration: 4
    }
  ];

  // Flooring Packages
  const flooringPackages = [
    {
      name: 'Engineered Hardwood Flooring',
      category: 'FLOORING',
      description: 'Premium engineered oak flooring throughout ground floor living areas',
      price: 4200,
      orderByDate: new Date('2024-11-01'),
      features: [
        'Engineered oak flooring (120mm wide planks)',
        'Professional installation with underlay',
        'Matching skirting board upgrade',
        '25-year manufacturer warranty',
        'Covers living room, dining room, and hallway'
      ],
      supplier: 'Irish Hardwood Flooring Co.',
      installationDuration: 2
    },
    {
      name: 'Luxury Vinyl Flooring',
      category: 'FLOORING',
      description: 'High-end luxury vinyl flooring with realistic wood grain texture',
      price: 2800,
      orderByDate: new Date('2024-11-15'),
      features: [
        'Luxury vinyl planks with authentic wood look',
        'Waterproof and scratch-resistant',
        'Suitable for all ground floor areas',
        '20-year warranty',
        'Quick installation process'
      ],
      supplier: 'FloorTech Ireland',
      installationDuration: 1
    }
  ];

  // Technology Packages
  const technologyPackages = [
    {
      name: 'Smart Home Complete Package',
      category: 'TECHNOLOGY',
      description: 'Full smart home system with app control, smart heating, security, and entertainment',
      price: 5500,
      orderByDate: new Date('2024-10-15'),
      features: [
        'Smart thermostat with zonal heating control',
        'Smart lighting throughout (Philips Hue)',
        'Video doorbell with intercom',
        'Smart security system with sensors',
        'Integrated sound system (ceiling speakers)',
        'Central control tablet',
        'Home automation app setup and training'
      ],
      supplier: 'Smart Home Ireland',
      installationDuration: 3
    },
    {
      name: 'Basic Smart Package',
      category: 'TECHNOLOGY',
      description: 'Essential smart home features for modern living',
      price: 2800,
      orderByDate: new Date('2024-11-01'),
      features: [
        'Smart thermostat',
        'Smart doorbell with video',
        'Smart lighting in main areas',
        'WiFi mesh network setup',
        'Basic home automation app'
      ],
      supplier: 'TechHome Solutions',
      installationDuration: 1
    }
  ];

  // Appliance Packages
  const appliancePackages = [
    {
      name: 'Complete White Goods Package',
      category: 'APPLIANCES',
      description: 'Full set of premium white goods including American-style fridge freezer',
      price: 4200,
      orderByDate: new Date('2024-12-01'),
      features: [
        'American-style fridge freezer (Samsung/LG)',
        'Washing machine and separate dryer',
        'Integrated dishwasher',
        'Built-in microwave',
        'All appliances with 5-year warranty',
        'Free delivery and installation'
      ],
      supplier: 'DID Electrical, Drogheda',
      installationDuration: 1
    },
    {
      name: 'Essential Appliances Package',
      category: 'APPLIANCES',
      description: 'Core appliances for immediate move-in convenience',
      price: 2400,
      orderByDate: new Date('2024-12-15'),
      features: [
        'Standard fridge freezer',
        'Washing machine',
        'Dishwasher',
        '2-year warranty on all items'
      ],
      supplier: 'PowerCity Drogheda',
      installationDuration: 1
    }
  ];

  // Furniture Packages
  const furniturePackages = [
    {
      name: 'Living Room Complete Package',
      category: 'FURNITURE',
      description: 'Complete living room furniture package with sofa, coffee table, and lighting',
      price: 6500,
      orderByDate: new Date('2025-01-15'), // Closer to completion
      features: [
        '3-seater and 2-seater sofas (choice of fabric)',
        'Coffee table and side tables',
        'Table lamps and floor lamp',
        'Curtains with fitting',
        'Cushions and throws',
        'Professional delivery and setup'
      ],
      supplier: 'DFS Ireland',
      installationDuration: 1
    },
    {
      name: 'Master Bedroom Package',
      category: 'FURNITURE',
      description: 'Complete master bedroom furniture including king-size bed and fitted wardrobes',
      price: 4800,
      orderByDate: new Date('2025-01-15'),
      features: [
        'King-size bed with premium mattress',
        'Fitted wardrobes (made to measure)',
        'Bedside lockers (pair)',
        'Dressing table with mirror',
        'Bedroom lighting package',
        'Blackout curtains'
      ],
      supplier: 'Harvey Norman Ireland',
      installationDuration: 2
    },
    {
      name: 'Kids Bedroom Package',
      category: 'FURNITURE',
      description: 'Child-friendly bedroom furniture for growing families',
      price: 2200,
      orderByDate: new Date('2025-01-15'),
      features: [
        'Single bed with storage drawers',
        'Study desk and chair',
        'Wardrobe with hanging and shelf space',
        'Bookshelf unit',
        'Fun lighting options'
      ],
      supplier: 'IKEA with professional assembly',
      installationDuration: 1
    }
  ];

  // Bathroom Upgrades
  const bathroomUpgrades = [
    {
      name: 'Luxury Bathroom Package',
      category: 'BATHROOM',
      description: 'Premium bathroom finishes with rainfall shower and luxury fittings',
      price: 3200,
      orderByDate: new Date('2024-09-15'), // Early - affects plumbing
      features: [
        'Rainfall shower head with thermostatic controls',
        'Premium tiles (large format porcelain)',
        'Heated towel rail',
        'Luxury vanity unit with LED mirror',
        'Quality chrome fixtures throughout',
        'Non-slip shower tray upgrade'
      ],
      supplier: 'Bathroom Specialists Drogheda',
      installationDuration: 3
    }
  ];

  // Garden/Outdoor Packages
  const gardenPackages = [
    {
      name: 'Garden Landscaping Package',
      category: 'GARDEN',
      description: 'Professional garden design and landscaping for your new home',
      price: 3800,
      orderByDate: new Date('2025-02-01'), // After completion
      features: [
        'Professional garden design',
        'Lawn preparation and seeding',
        'Patio area with quality paving',
        'Planting scheme with mature plants',
        'Garden shed installation',
        '12-month maintenance package'
      ],
      supplier: 'Green Spaces Landscaping',
      installationDuration: 5
    }
  ];

  // Combine all packages
  const allPackages = [
    ...kitchenUpgrades,
    ...flooringPackages,
    ...technologyPackages,
    ...appliancePackages,
    ...furniturePackages,
    ...bathroomUpgrades,
    ...gardenPackages
  ];

  // Create customization options for main unit types (3 Bed Semi and 4 Bed Semi)
  const mainUnitTypes = fitzDev.UnitType.filter(ut => 
    ut.name.includes('3 Bed Semi') || ut.name.includes('4 Bed Semi')
  );

  for (const unitType of mainUnitTypes) {
    console.log(`Creating customization options for ${unitType.name}...`);
    
    for (const pkg of allPackages) {
      const option = await prisma.unitCustomizationOption.create({
        data: {
          unitType: { connect: { id: unitType.id } },
          name: pkg.name,
          category: pkg.category,
          type: 'PACKAGE',
          description: pkg.description,
          price: pkg.price,
          additionalCost: pkg.price,
          isDefault: false,
          baseOption: false,
          orderByDate: pkg.orderByDate,
          installationDuration: pkg.installationDuration,
          supplier: pkg.supplier,
          features: pkg.features,
          images: [`/images/customizations/${pkg.category.toLowerCase()}/${pkg.name.toLowerCase().replace(/\s+/g, '-')}.jpg`]
        }
      });
      customizationOptions.push(option);
    }
  }

  // Create some sample individual add-on items
  const individualItems = [
    {
      name: 'Additional Kitchen Socket',
      category: 'ELECTRICAL',
      price: 150,
      description: 'Extra electrical socket in kitchen area'
    },
    {
      name: 'Ceiling Fan - Master Bedroom',
      category: 'ELECTRICAL',
      price: 320,
      description: 'Ceiling fan with light fitting in master bedroom'
    },
    {
      name: 'Electric Shower Upgrade',
      category: 'BATHROOM',
      price: 280,
      description: 'Upgrade to higher KW electric shower'
    },
    {
      name: 'Patio Door Upgrade',
      category: 'DOORS',
      price: 750,
      description: 'Upgrade to premium bi-fold patio doors'
    },
    {
      name: 'Attic Flooring',
      category: 'STORAGE',
      price: 890,
      description: 'Professional attic flooring for storage access'
    }
  ];

  // Create individual customization items
  for (const unitType of mainUnitTypes) {
    for (const item of individualItems) {
      await prisma.unitCustomizationOption.create({
        data: {
          unitType: { connect: { id: unitType.id } },
          name: item.name,
          category: item.category,
          type: 'INDIVIDUAL',
          description: item.description,
          price: item.price,
          additionalCost: item.price,
          isDefault: false,
          baseOption: false,
          orderByDate: new Date('2024-12-01'), // Most individual items can be done later
          installationDuration: 1,
          supplier: 'Various contractors',
          features: [item.description],
          images: []
        }
      });
    }
  }

  console.log('✅ Customization packages created successfully!');
  console.log(`   📦 Created ${allPackages.length} package types`);
  console.log(`   🔧 Created ${individualItems.length} individual add-on items`);
  console.log(`   🏠 Applied to ${mainUnitTypes.length} main unit types`);
  
  console.log('\n📋 Package Categories Available:');
  console.log('   🍳 Kitchen: Premium & Smart packages (€8,500 - €12,000)');
  console.log('   🪵 Flooring: Hardwood & Luxury Vinyl (€2,800 - €4,200)');
  console.log('   📱 Technology: Basic & Complete Smart Home (€2,800 - €5,500)');
  console.log('   🏠 Appliances: Essential & Complete packages (€2,400 - €4,200)');
  console.log('   🛋️ Furniture: Living Room, Bedrooms (€2,200 - €6,500)');
  console.log('   🛁 Bathroom: Luxury upgrade package (€3,200)');
  console.log('   🌿 Garden: Professional landscaping (€3,800)');
  
  console.log('\n⏰ Key Ordering Deadlines:');
  console.log('   🚨 Bathroom upgrades: September 15, 2024 (affects plumbing)');
  console.log('   🍳 Kitchen packages: October 1, 2024');
  console.log('   📱 Smart home: October 15, 2024');
  console.log('   🪵 Flooring: November 1-15, 2024');
  console.log('   🏠 Appliances: December 1-15, 2024');
  console.log('   🛋️ Furniture: January 15, 2025');
  console.log('   🌿 Garden: February 1, 2025 (after completion)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });