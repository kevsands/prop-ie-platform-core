#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fix the seed file
const seedFile = path.join(process.cwd(), 'prisma', 'seed-fitzgerald-gardens.ts');
let content = fs.readFileSync(seedFile, 'utf8');

// Replace the development creation to use location relation
const oldPattern = `const fitzgeraldGardens = await prisma.development.create({
    data: {
      name: 'Fitzgerald Gardens',
      slug: 'fitzgerald-gardens',
      description: 'Premium homes in Drogheda, Co. Louth',
      address: 'Mell Road',
      city: 'Drogheda',
      county: 'Louth',
      eircode: 'A92 XY34',
      totalUnits: 120,
      completedUnits: 0,
      soldUnits: 0,
      reservedUnits: 1,
      availableUnits: 119,
      status: 'SELLING',
      developer: {
        connect: { email: 'fitzgerald@developers.ie' }
      }
    }
  });`;

const newPattern = `// Create location first
  const location = await prisma.location.create({
    data: {
      address: 'Mell Road',
      city: 'Drogheda',
      county: 'Louth',
      eircode: 'A92 XY34',
      country: 'Ireland'
    }
  });

  const fitzgeraldGardens = await prisma.development.create({
    data: {
      name: 'Fitzgerald Gardens',
      slug: 'fitzgerald-gardens',
      status: 'SELLING',
      totalUnits: 120,
      developer: {
        connect: { email: 'fitzgerald@developers.ie' }
      },
      location: {
        connect: { id: location.id }
      },
      marketingStatus: {},
      salesStatus: {},
      constructionStatus: {},
      complianceStatus: {}
    }
  });`;

content = content.replace(oldPattern, newPattern);

// Fix unit creation - remove extra fields that don't exist
content = content.replace(/unitTypeId:/g, 'unitType: {connect: {id:');
content = content.replace(/unitTypeId: (.*?),/g, 'unitType: {connect: {id: $1}},');

// Fix unit creation missing required fields
const unitCreationRegex = /units: \[([\s\S]*?)\]/g;
content = content.replace(unitCreationRegex, (match, unitsContent) => {
  // Add missing required fields to each unit
  const updatedUnits = unitsContent.replace(/\{([^}]+)\}/g, (unitMatch, unitContent) => {
    let updatedUnit = unitContent;
    
    // Add missing required fields if not present
    if (!unitContent.includes('name:')) {
      updatedUnit += `,\n        name: unitNumber`;
    }
    if (!unitContent.includes('type:')) {
      updatedUnit += `,\n        type: 'APARTMENT'`;
    }
    if (!unitContent.includes('size:')) {
      updatedUnit += `,\n        size: 75`;
    }
    if (!unitContent.includes('bedrooms:')) {
      updatedUnit += `,\n        bedrooms: 2`;
    }
    if (!unitContent.includes('bathrooms:')) {
      updatedUnit += `,\n        bathrooms: 1`;
    }
    if (!unitContent.includes('floors:')) {
      updatedUnit += `,\n        floors: 1`;
    }
    if (!unitContent.includes('parkingSpaces:')) {
      updatedUnit += `,\n        parkingSpaces: 1`;
    }
    if (!unitContent.includes('basePrice:')) {
      updatedUnit += `,\n        basePrice: price`;
    }
    if (!unitContent.includes('berRating:')) {
      updatedUnit += `,\n        berRating: 'A2'`;
    }
    if (!unitContent.includes('features:')) {
      updatedUnit += `,\n        features: []`;
    }
    if (!unitContent.includes('primaryImage:')) {
      updatedUnit += `,\n        primaryImage: '/images/unit-placeholder.jpg'`;
    }
    if (!unitContent.includes('images:')) {
      updatedUnit += `,\n        images: []`;
    }
    if (!unitContent.includes('floorplans:')) {
      updatedUnit += `,\n        floorplans: []`;
    }
    
    return `{${updatedUnit}}`;
  });
  
  return `units: [${updatedUnits}]`;
});

// Fix user creation - 'name' should be 'firstName' and 'lastName'
content = content.replace(/name: '(.*?)'/g, (match, name) => {
  const parts = name.split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return `firstName: '${firstName}', lastName: '${lastName}'`;
});

// Fix viewings
content = content.replace(/name: 'John Smith'/g, "userId: users[0].id");
content = content.replace(/unitId:/g, "unit: { connect: { id:");
content = content.replace(/unitId: (.*?),/g, "unit: { connect: { id: $1 }},");

// Write the fixed content
fs.writeFileSync(seedFile, content);
console.log('Fixed seed file');