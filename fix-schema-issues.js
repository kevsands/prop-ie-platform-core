#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the schema file
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Remove the duplicate Unit model (the second one)
// Find the second Unit model and remove it
const firstUnitIndex = schema.indexOf('model Unit {');
const secondUnitIndex = schema.indexOf('model Unit {', firstUnitIndex + 1);

if (secondUnitIndex !== -1) {
  // Find the end of the second Unit model
  let braceCount = 0;
  let endIndex = secondUnitIndex;
  for (let i = secondUnitIndex; i < schema.length; i++) {
    if (schema[i] === '{') braceCount++;
    if (schema[i] === '}') braceCount--;
    if (braceCount === 0 && schema[i] === '}') {
      endIndex = i + 1;
      break;
    }
  }
  
  // Remove the second Unit model
  schema = schema.substring(0, secondUnitIndex) + schema.substring(endIndex);
  console.log('Removed duplicate Unit model');
}

// Update the first Unit model to include unitTypeId
const unitModelRegex = /model Unit \{[\s\S]*?\n\}/;
const unitModelMatch = schema.match(unitModelRegex);

if (unitModelMatch) {
  const updatedUnitModel = `model Unit {
  id                  String      @id @default(cuid())
  development         Development @relation(fields: [developmentId], references: [id])
  developmentId       String
  
  // Link to UnitType
  unitTypeId          String?
  unitType            UnitType?   @relation(fields: [unitTypeId], references: [id])
  
  // Basic info
  unitNumber          String?     // e.g., "A101", "B205"
  name                String
  type                UnitType
  
  // Basic specifications
  size                Float       // in square meters
  bedrooms            Int
  bathrooms           Float       // 2.5 for 2 and a half bathrooms
  floors              Int
  parkingSpaces       Int
  
  // Pricing and status
  basePrice           Float
  price               Float?
  status              UnitStatus
  
  // Features
  berRating           String
  features            String[]
  
  // Media
  primaryImage        String
  images              String[]
  floorplans          String[]
  virtualTourUrl      String?
  
  // Additional details
  block               String?
  floor               Int?
  aspect              String?
  availableFrom       DateTime?
  reservationEndDate  DateTime?
  lastViewed          DateTime?
  viewCount           Int         @default(0)
  updatedAt           DateTime    @updatedAt
  slug                String?
  
  // Relations
  outdoorSpaces           UnitOutdoorSpace[]
  rooms                   UnitRoom[]
  customizationOptions    UnitCustomizationOption[]
  customizationSelections CustomizationSelection[]
  customizations          Customization[]
  sales                   Sale[]
  viewings                Viewing[]
  investorWatchlists      InvestorWatchlistUnit[]
  documents               Document[]                @relation("UnitDocuments")
  reservations            Reservation[]
  snagLists               SnagList[]
  homePackItems           HomePackItem[]
}`;
  
  schema = schema.replace(unitModelRegex, updatedUnitModel);
  console.log('Updated Unit model to include unitTypeId');
}

// Fix the UnitType enum vs model issue
// First, rename the enum UnitType to PropertyType if it exists as an enum
const unitTypeEnumRegex = /enum UnitType \{[\s\S]*?\}/;
if (unitTypeEnumRegex.test(schema)) {
  schema = schema.replace(unitTypeEnumRegex, (match) => {
    return match.replace('enum UnitType', 'enum PropertyType');
  });
  console.log('Renamed UnitType enum to PropertyType');
}

// Fix references to UnitType enum
schema = schema.replace(/type\s+UnitType\s*$/gm, 'type PropertyType');

// Add missing models if they don't exist
if (!schema.includes('model ScheduleOfAccommodation')) {
  const scheduleModel = `
model ScheduleOfAccommodation {
  id          String   @id @default(cuid())
  unitTypeId  String
  unitType    UnitType @relation(fields: [unitTypeId], references: [id])
  roomType    String
  roomName    String
  area        Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
`;
  schema += scheduleModel;
  console.log('Added ScheduleOfAccommodation model');
}

if (!schema.includes('model FloorPlan')) {
  const floorPlanModel = `
model FloorPlan {
  id          String   @id @default(cuid())
  unitTypeId  String
  unitType    UnitType @relation(fields: [unitTypeId], references: [id])
  imageUrl    String
  title       String
  description String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
`;
  schema += floorPlanModel;
  console.log('Added FloorPlan model');
}

// Write the updated schema
fs.writeFileSync(schemaPath, schema);
console.log('Schema file updated successfully');