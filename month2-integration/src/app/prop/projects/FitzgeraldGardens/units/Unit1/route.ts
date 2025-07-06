// src/app/prop/projects/FitzgeraldGardens/units/Unit1/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    id: 'unit1',
    unitNumber: '01',
    address: '1 Fitzgerald Gardens, Drogheda',
    description: 'Spacious 3-bedroom semi-detached house',
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 110,
    price: 350000,
    status: 'available',
    floorPlanUrl: '/images/floorplans/type-b.jpg',
    phase: {
      id: 'phase-id',
      name: 'Phase 1'
    },
    unitType: {
      id: 'unit-type-id',
      name: 'Type B - 3 Bed Semi-Detached'
    },
    images: [
      {
        id: 'image-id',
        url: '/images/units/type-b-1.jpg',
        caption: 'Living Room',
        isPrimary: true
      }
    ],
    customizations: [
      {
        id: 'customization-id',
        option: {
          id: 'option-id',
          name: 'Kitchen Cabinets',
          category: 'Kitchen'
        },
        selectedValue: 'Option 2 - Premium Finish',
        additionalCost: 2500,
        status: 'approved'
      }
    ],
    projectId: 'project-id',
    projectName: 'Fitzgerald Gardens',
    projectSlug: 'fitzgerald-gardens'
  });
}