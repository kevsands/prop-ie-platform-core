#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the schema file
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Track model and enum definitions
const modelNames = new Set();
const enumNames = new Set();
const modelDefinitions = [];
const enumDefinitions = [];

// Regular expressions to match models and enums
const modelRegex = /model\s+(\w+)\s*\{[\s\S]*?\n\}/g;
const enumRegex = /enum\s+(\w+)\s*\{[\s\S]*?\n\}/g;

// Find all models
let match;
while ((match = modelRegex.exec(schema)) !== null) {
  const modelName = match[1];
  if (!modelNames.has(modelName)) {
    modelNames.add(modelName);
    modelDefinitions.push({ name: modelName, definition: match[0], index: match.index });
  } else {
    console.log(`Found duplicate model: ${modelName} at index ${match.index}`);
  }
}

// Find all enums
while ((match = enumRegex.exec(schema)) !== null) {
  const enumName = match[1];
  if (!enumNames.has(enumName)) {
    enumNames.add(enumName);
    enumDefinitions.push({ name: enumName, definition: match[0], index: match.index });
  } else {
    console.log(`Found duplicate enum: ${enumName} at index ${match.index}`);
  }
}

// Remove duplicates (keep the first occurrence)
const duplicates = [
  'TaskComment', 'Development', 'Viewing', 'Reservation', 'Sale',
  'DevelopmentStatus', 'PropertyType', 'UnitStatus', 'SaleStatus'
];

duplicates.forEach(name => {
  // Find all occurrences
  const modelRegex = new RegExp(`model\\s+${name}\\s*\\{[\\s\\S]*?\\n\\}`, 'g');
  const enumRegex = new RegExp(`enum\\s+${name}\\s*\\{[\\s\\S]*?\\n\\}`, 'g');
  
  // For models
  const modelMatches = [];
  let match;
  while ((match = modelRegex.exec(schema)) !== null) {
    modelMatches.push({ index: match.index, length: match[0].length });
  }
  
  // For enums
  const enumMatches = [];
  while ((match = enumRegex.exec(schema)) !== null) {
    enumMatches.push({ index: match.index, length: match[0].length });
  }
  
  // Remove duplicates (keep first, remove rest)
  if (modelMatches.length > 1) {
    // Sort by index and remove all except the first
    modelMatches.sort((a, b) => b.index - a.index); // Sort descending to remove from end
    for (let i = 0; i < modelMatches.length - 1; i++) {
      const match = modelMatches[i];
      schema = schema.substring(0, match.index) + schema.substring(match.index + match.length);
      console.log(`Removed duplicate model ${name} at index ${match.index}`);
    }
  }
  
  if (enumMatches.length > 1) {
    // Sort by index and remove all except the first
    enumMatches.sort((a, b) => b.index - a.index); // Sort descending to remove from end
    for (let i = 0; i < enumMatches.length - 1; i++) {
      const match = enumMatches[i];
      schema = schema.substring(0, match.index) + schema.substring(match.index + match.length);
      console.log(`Removed duplicate enum ${name} at index ${match.index}`);
    }
  }
});

// Write the updated schema
fs.writeFileSync(schemaPath, schema);
console.log('Schema cleaned successfully');