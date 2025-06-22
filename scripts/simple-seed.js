const sqlite3 = require('sqlite3').verbose();
const { fitzgeraldGardensConfig } = require('../src/data/fitzgerald-gardens-config');

console.log('🌱 Starting simple data migration...');

// Open database
const db = new sqlite3.Database('./prisma/dev.db', (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database.');
});

// Clear existing data
console.log('🧹 Clearing existing data...');
db.serialize(() => {
  db.run("DELETE FROM Unit", (err) => {
    if (err) console.log('Unit table clear:', err.message);
    else console.log('✓ Cleared Unit table');
  });
  
  db.run("DELETE FROM Development", (err) => {
    if (err) console.log('Development table clear:', err.message);
    else console.log('✓ Cleared Development table');
  });

  // Insert Fitzgerald Gardens development
  console.log('🏗️ Creating Fitzgerald Gardens development...');
  
  const insertDev = `INSERT INTO Development (
    id, name, location, description, totalUnits, availableUnits, 
    startingPrice, completion, featured, status, phase,
    createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(insertDev, [
    'fitzgerald-gardens',
    fitzgeraldGardensConfig.projectName,
    fitzgeraldGardensConfig.location,
    fitzgeraldGardensConfig.description,
    fitzgeraldGardensConfig.totalUnits,
    fitzgeraldGardensConfig.availableForSale,
    fitzgeraldGardensConfig.unitTypes['1_bed_apartment'].basePrice,
    fitzgeraldGardensConfig.completionPercentage,
    1, // featured
    'ACTIVE',
    fitzgeraldGardensConfig.currentPhase,
    new Date().toISOString(),
    new Date().toISOString()
  ], (err) => {
    if (err) {
      console.error('❌ Error inserting Fitzgerald Gardens:', err.message);
    } else {
      console.log('✅ Created Fitzgerald Gardens development');
    }
  });

  // Insert Elizabeth Walk development
  console.log('🏗️ Creating Elizabeth Walk development...');
  
  db.run(insertDev, [
    'elizabeth-walk',
    'Elizabeth Walk',
    'Drogheda, Co. Louth',
    'Modern residential development featuring quality 2 and 3 bedroom units with excellent local amenities.',
    32,
    18,
    285000,
    75,
    1, // featured
    'ACTIVE',
    'Phase 1 Complete',
    new Date().toISOString(),
    new Date().toISOString()
  ], (err) => {
    if (err) {
      console.error('❌ Error inserting Elizabeth Walk:', err.message);
    } else {
      console.log('✅ Created Elizabeth Walk development');
    }
  });

  // Insert Ballymakenny View development
  console.log('🏗️ Creating Ballymakenny View development...');
  
  db.run(insertDev, [
    'ballymakenny-view',
    'Ballymakenny View',
    'Ballymakenny, Drogheda, Co. Louth',
    'Premium family homes with countryside views in a well-connected location',
    32,
    28,
    380000,
    60,
    1, // featured
    'ACTIVE',
    'Launching Soon',
    new Date().toISOString(),
    new Date().toISOString()
  ], (err) => {
    if (err) {
      console.error('❌ Error inserting Ballymakenny View:', err.message);
    } else {
      console.log('✅ Created Ballymakenny View development');
    }
  });

  // Create Fitzgerald Gardens Units
  console.log('🏠 Creating Fitzgerald Gardens units...');
  
  const insertUnit = `INSERT INTO Unit (
    id, unitNumber, developmentId, unitType, bedrooms, bathrooms, 
    size, price, floor, status, availability, completionDate,
    createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Willow Collection - 1 Bedroom Apartments (24 units)
  for (let i = 1; i <= 24; i++) {
    const unitNumber = `W-${i.toString().padStart(2, '0')}`;
    const unitId = `FG-${unitNumber}`;
    
    db.run(insertUnit, [
      unitId,
      unitNumber,
      'fitzgerald-gardens',
      '1_bed_apartment',
      1,
      1,
      58,
      295000,
      Math.ceil(i / 6),
      i <= 8 ? 'SOLD' : (i <= 12 ? 'RESERVED' : 'AVAILABLE'),
      i > 12 ? 'IMMEDIATE' : 'SOLD_OUT',
      '2025-08-15',
      new Date().toISOString(),
      new Date().toISOString()
    ], (err) => {
      if (err) console.error(`❌ Error inserting unit ${unitId}:`, err.message);
    });
  }

  // Birch Collection - 2 Bedroom Apartments (30 units)
  for (let i = 1; i <= 30; i++) {
    const unitNumber = `B-${i.toString().padStart(2, '0')}`;
    const unitId = `FG-${unitNumber}`;
    
    db.run(insertUnit, [
      unitId,
      unitNumber,
      'fitzgerald-gardens',
      '2_bed_apartment',
      2,
      2,
      85,
      350000,
      Math.ceil(i / 8),
      i <= 6 ? 'SOLD' : (i <= 10 ? 'RESERVED' : 'AVAILABLE'),
      i > 10 ? 'IMMEDIATE' : 'SOLD_OUT',
      '2025-08-15',
      new Date().toISOString(),
      new Date().toISOString()
    ], (err) => {
      if (err) console.error(`❌ Error inserting unit ${unitId}:`, err.message);
    });
  }

  // Hawthorne Collection - 3 Bedroom Apartments (24 units)
  for (let i = 1; i <= 24; i++) {
    const unitNumber = `H-${i.toString().padStart(2, '0')}`;
    const unitId = `FG-${unitNumber}`;
    
    db.run(insertUnit, [
      unitId,
      unitNumber,
      'fitzgerald-gardens',
      '3_bed_apartment',
      3,
      2,
      125,
      397500,
      Math.ceil(i / 6),
      i <= 4 ? 'SOLD' : (i <= 6 ? 'RESERVED' : 'AVAILABLE'),
      i > 6 ? 'IMMEDIATE' : 'SOLD_OUT',
      '2025-08-15',
      new Date().toISOString(),
      new Date().toISOString()
    ], (err) => {
      if (err) console.error(`❌ Error inserting unit ${unitId}:`, err.message);
    });
  }

  // Oak Collection - 4 Bedroom Apartments (18 units)
  for (let i = 1; i <= 18; i++) {
    const unitNumber = `O-${i.toString().padStart(2, '0')}`;
    const unitId = `FG-${unitNumber}`;
    
    db.run(insertUnit, [
      unitId,
      unitNumber,
      'fitzgerald-gardens',
      '4_bed_apartment',
      4,
      3,
      165,
      475000,
      Math.ceil(i / 4),
      i <= 2 ? 'SOLD' : (i <= 4 ? 'RESERVED' : 'AVAILABLE'),
      i > 4 ? 'IMMEDIATE' : 'SOLD_OUT',
      '2025-08-15',
      new Date().toISOString(),
      new Date().toISOString()
    ], (err) => {
      if (err) console.error(`❌ Error inserting unit ${unitId}:`, err.message);
    });
  }

  // Final summary
  setTimeout(() => {
    db.get("SELECT COUNT(*) as count FROM Development", (err, row) => {
      if (!err) console.log(`📊 Created ${row.count} developments`);
    });
    
    db.get("SELECT COUNT(*) as count FROM Unit", (err, row) => {
      if (!err) console.log(`📊 Created ${row.count} units`);
    });
    
    console.log('✅ Data migration completed successfully!');
    
    // Close database
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed.');
      }
    });
  }, 2000);
});