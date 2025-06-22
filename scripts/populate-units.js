const sqlite3 = require('sqlite3').verbose();

console.log('🌱 Populating units with all valuable mock data...');

// Open database
const db = new sqlite3.Database('./prisma/dev.db', (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database.');
});

db.serialize(() => {
  // Clear existing units
  console.log('🧹 Clearing existing units...');
  db.run("DELETE FROM Unit", (err) => {
    if (err) console.log('Unit table clear:', err.message);
    else console.log('✓ Cleared Unit table');
  });

  const insertUnit = `INSERT INTO Unit (id, developmentId, name, type, price, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const now = new Date().toISOString();

  // Fitzgerald Gardens Units - Preserving all valuable mock data
  console.log('🏠 Creating Fitzgerald Gardens units (96 total)...');

  // Willow Collection - 1 Bedroom Apartments (24 units) - €295,000
  for (let i = 1; i <= 24; i++) {
    const unitNumber = `W-${i.toString().padStart(2, '0')}`;
    const unitId = `FG-${unitNumber}`;
    const unitName = `1 Bedroom Apartment - Willow ${unitNumber}`;
    const status = i <= 8 ? 'sold' : (i <= 12 ? 'reserved' : 'available');
    
    db.run(insertUnit, [unitId, 'fitzgerald-gardens', unitName, '1_bed_apartment', 295000, status, now, now], 
      (err) => { if (err) console.error(`❌ Error inserting ${unitId}:`, err.message); });
  }

  // Birch Collection - 2 Bedroom Apartments (30 units) - €350,000
  for (let i = 1; i <= 30; i++) {
    const unitNumber = `B-${i.toString().padStart(2, '0')}`;
    const unitId = `FG-${unitNumber}`;
    const unitName = `2 Bedroom Apartment - Birch ${unitNumber}`;
    const status = i <= 6 ? 'sold' : (i <= 10 ? 'reserved' : 'available');
    
    db.run(insertUnit, [unitId, 'fitzgerald-gardens', unitName, '2_bed_apartment', 350000, status, now, now], 
      (err) => { if (err) console.error(`❌ Error inserting ${unitId}:`, err.message); });
  }

  // Hawthorne Collection - 3 Bedroom Apartments (24 units) - €397,500
  for (let i = 1; i <= 24; i++) {
    const unitNumber = `H-${i.toString().padStart(2, '0')}`;
    const unitId = `FG-${unitNumber}`;
    const unitName = `3 Bedroom Apartment - Hawthorne ${unitNumber}`;
    const status = i <= 4 ? 'sold' : (i <= 6 ? 'reserved' : 'available');
    
    db.run(insertUnit, [unitId, 'fitzgerald-gardens', unitName, '3_bed_apartment', 397500, status, now, now], 
      (err) => { if (err) console.error(`❌ Error inserting ${unitId}:`, err.message); });
  }

  // Oak Collection - 4 Bedroom Apartments (18 units) - €475,000
  for (let i = 1; i <= 18; i++) {
    const unitNumber = `O-${i.toString().padStart(2, '0')}`;
    const unitId = `FG-${unitNumber}`;
    const unitName = `4 Bedroom Apartment - Oak ${unitNumber}`;
    const status = i <= 2 ? 'sold' : (i <= 4 ? 'reserved' : 'available');
    
    db.run(insertUnit, [unitId, 'fitzgerald-gardens', unitName, '4_bed_apartment', 475000, status, now, now], 
      (err) => { if (err) console.error(`❌ Error inserting ${unitId}:`, err.message); });
  }

  // Additional mock units from mockDataService.ts (preserving exact data)
  console.log('🏠 Adding additional units from mock data...');

  // Additional Fitzgerald Gardens units
  const additionalFGUnits = [
    { id: 'prop-fg-101', name: '3 Bed Semi-Detached - Unit 101', type: '3_bed_semi_detached', price: 385000 },
    { id: 'prop-fg-105', name: '4 Bed Detached - Unit 105', type: '4_bed_detached', price: 450000 },
    { id: 'prop-fg-110', name: '3 Bed Semi-Detached - Unit 110', type: '3_bed_semi_detached', price: 380000 },
    { id: 'prop-fg-115', name: '4 Bed Detached - Unit 115', type: '4_bed_detached', price: 445000 }
  ];

  additionalFGUnits.forEach(unit => {
    db.run(insertUnit, [unit.id, 'fitzgerald-gardens', unit.name, unit.type, unit.price, 'available', now, now], 
      (err) => { if (err) console.error(`❌ Error inserting ${unit.id}:`, err.message); });
  });

  // Ellwood units (sold out development)
  const ellwoodUnits = [
    { id: 'prop-rm-203', name: '2 Bed Apartment - Unit 203', type: '2_bed_apartment', price: 295000, status: 'sold' },
    { id: 'prop-rm-208', name: '2 Bed Apartment - Unit 208', type: '2_bed_apartment', price: 300000, status: 'sold' }
  ];

  ellwoodUnits.forEach(unit => {
    db.run(insertUnit, [unit.id, 'ellwood', unit.name, unit.type, unit.price, unit.status, now, now], 
      (err) => { if (err) console.error(`❌ Error inserting ${unit.id}:`, err.message); });
  });

  // Ballymakenny View units
  const ballymakenny4BedHouse = {
    id: 'BMV-H3-05',
    name: '4 Bedroom House - Type A',
    type: '4_bed_house',
    price: 495000,
    status: 'available'
  };

  const ballymakenny3BedHouse = {
    id: 'BMV-H2-08', 
    name: '3 Bedroom House - Type B',
    type: '3_bed_house',
    price: 420000,
    status: 'available'
  };

  db.run(insertUnit, [ballymakenny4BedHouse.id, 'ballymakenny-view', ballymakenny4BedHouse.name, ballymakenny4BedHouse.type, ballymakenny4BedHouse.price, ballymakenny4BedHouse.status, now, now], 
    (err) => { if (err) console.error(`❌ Error inserting ${ballymakenny4BedHouse.id}:`, err.message); });

  db.run(insertUnit, [ballymakenny3BedHouse.id, 'ballymakenny-view', ballymakenny3BedHouse.name, ballymakenny3BedHouse.type, ballymakenny3BedHouse.price, ballymakenny3BedHouse.status, now, now], 
    (err) => { if (err) console.error(`❌ Error inserting ${ballymakenny3BedHouse.id}:`, err.message); });

  // Final summary
  setTimeout(() => {
    db.get("SELECT COUNT(*) as count FROM Development", (err, row) => {
      if (!err) console.log(`📊 Total developments: ${row.count}`);
    });
    
    db.get("SELECT COUNT(*) as count FROM Unit", (err, row) => {
      if (!err) console.log(`📊 Total units created: ${row.count}`);
    });

    db.get("SELECT COUNT(*) as available FROM Unit WHERE status = 'available'", (err, row) => {
      if (!err) console.log(`📊 Available units: ${row.available}`);
    });

    db.get("SELECT COUNT(*) as sold FROM Unit WHERE status = 'sold'", (err, row) => {
      if (!err) console.log(`📊 Sold units: ${row.sold}`);
    });

    db.get("SELECT COUNT(*) as reserved FROM Unit WHERE status = 'reserved'", (err, row) => {
      if (!err) console.log(`📊 Reserved units: ${row.reserved}`);
    });
    
    console.log('✅ All valuable mock data migrated successfully!');
    console.log('💰 Price range: €295,000 - €495,000');
    console.log('🏠 Unit types: 1-4 bedrooms, apartments, houses, duplexes');
    
    // Close database
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed.');
      }
    });
  }, 1000);
});