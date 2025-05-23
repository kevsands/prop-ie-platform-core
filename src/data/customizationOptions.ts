export const roomMaterials = {
    kitchen: {
      countertops: [
        { id: 'granite-black', name: 'Black Granite', image: '/materials/countertops/granite-black.jpg', price: 2500 },
        { id: 'quartz-white', name: 'White Quartz', image: '/materials/countertops/quartz-white.jpg', price: 3200 },
        // Add more options
      ],
      // Add more categories (cabinets, flooring, etc.)
    },
    // Add more rooms
  };

// Generate default model paths for each room in one go
const roomList = ['kitchen', 'bathroom', 'bedroom', 'livingRoom'] as const;

export const defaultRoomModels: Record<typeof roomList[number], string> = roomList.reduce((accroom: any) => {
  acc[room] = `/models/rooms/${room}/default.glb`;
  return acc;
}, {} as Record<typeof roomList[number], string>);

// Customization options for the UI
export const customizationOptions = {
  livingRoom: {
    flooring: [
      { 
        id: 'oak-flooring', 
        name: 'Oak Hardwood', 
        unit: 'per m²', 
        image: '/images/customization/flooring-oak.svg', 
        price: 85,
        category: 'flooring',
        room: 'livingRoom'
      },
      { 
        id: 'walnut-flooring', 
        name: 'Walnut Hardwood', 
        unit: 'per m²', 
        image: '/images/customization/flooring-walnut.svg', 
        price: 120,
        category: 'flooring',
        room: 'livingRoom'
      }
    ],
    paint: [
      { 
        id: 'sage-green', 
        name: 'Sage Green', 
        unit: 'per room', 
        image: '/images/customization/paint-sage.svg', 
        price: 450,
        category: 'paint',
        room: 'livingRoom'
      },
      { 
        id: 'navy-blue', 
        name: 'Navy Blue', 
        unit: 'per room', 
        image: '/images/customization/paint-navy.svg', 
        price: 450,
        category: 'paint',
        room: 'livingRoom'
      }
    ],
    fixtures: [
      { 
        id: 'standard-fixtures', 
        name: 'Standard Package', 
        unit: 'complete set', 
        image: '/images/customization/fixtures-standard.svg', 
        price: 1200,
        category: 'fixtures',
        room: 'livingRoom'
      },
      { 
        id: 'premium-fixtures', 
        name: 'Premium Package', 
        unit: 'complete set', 
        image: '/images/customization/fixtures-premium.svg', 
        price: 3500,
        category: 'fixtures',
        room: 'livingRoom'
      }
    ]
  },
  bedroom: {
    flooring: [
      { 
        id: 'oak-flooring-bedroom', 
        name: 'Oak Hardwood', 
        unit: 'per m²', 
        image: '/images/customization/flooring-oak.svg', 
        price: 85,
        category: 'flooring',
        room: 'bedroom'
      },
      { 
        id: 'walnut-flooring-bedroom', 
        name: 'Walnut Hardwood', 
        unit: 'per m²', 
        image: '/images/customization/flooring-walnut.svg', 
        price: 120,
        category: 'flooring',
        room: 'bedroom'
      }
    ],
    paint: [
      { 
        id: 'sage-green-bedroom', 
        name: 'Sage Green', 
        unit: 'per room', 
        image: '/images/customization/paint-sage.svg', 
        price: 350,
        category: 'paint',
        room: 'bedroom'
      },
      { 
        id: 'navy-blue-bedroom', 
        name: 'Navy Blue', 
        unit: 'per room', 
        image: '/images/customization/paint-navy.svg', 
        price: 350,
        category: 'paint',
        room: 'bedroom'
      }
    ],
    fixtures: [
      { 
        id: 'standard-fixtures-bedroom', 
        name: 'Standard Package', 
        unit: 'complete set', 
        image: '/images/customization/fixtures-standard.svg', 
        price: 800,
        category: 'fixtures',
        room: 'bedroom'
      },
      { 
        id: 'premium-fixtures-bedroom', 
        name: 'Premium Package', 
        unit: 'complete set', 
        image: '/images/customization/fixtures-premium.svg', 
        price: 2200,
        category: 'fixtures',
        room: 'bedroom'
      }
    ]
  }
};