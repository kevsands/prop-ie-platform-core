// Unit data for Fitzgerald Gardens
// In a real application, this would come from an API

export const unitTypes = {
  '1bed': {
    name: '1 Bed Apartment',
    price: 'From €285,000',
    area: '52 sq.m',
    bedrooms: 1,
    bathrooms: 1,
    available: 0,
    total: 24,
    floor_plans: '/images/fitzgerald-gardens/1bed-floorplan.jpg',
    features: ['Balcony', 'Fully Fitted Kitchen', 'Built-in Wardrobes', 'Parking Space Available'],
    schedule: {
      'Living/Kitchen/Dining': '25.5 sq.m',
      'Master Bedroom': '14.2 sq.m',
      'Bathroom': '4.8 sq.m',
      'Hall': '3.5 sq.m',
      'Balcony': '4.0 sq.m'
    }
  },
  '2bed': {
    name: '2 Bed Apartment',
    price: 'From €385,000',
    area: '75 sq.m',
    bedrooms: 2,
    bathrooms: 2,
    available: 4,
    total: 48,
    floor_plans: '/images/fitzgerald-gardens/2bed-floorplan.jpg',
    features: ['Balcony', 'Master En-suite', 'Fully Fitted Kitchen', 'Built-in Wardrobes', 'Parking Space'],
    schedule: {
      'Living/Kitchen/Dining': '32.5 sq.m',
      'Master Bedroom': '14.5 sq.m',
      'Bedroom 2': '11.8 sq.m',
      'Bathroom': '4.8 sq.m',
      'En-suite': '3.2 sq.m',
      'Hall': '5.2 sq.m',
      'Balcony': '5.0 sq.m'
    }
  },
  '3bed': {
    name: '3 Bed House',
    price: 'From €425,000',
    area: '110 sq.m',
    bedrooms: 3,
    bathrooms: 2.5,
    available: 20,
    total: 36,
    floor_plans: '/images/fitzgerald-gardens/3bed-floorplan.jpg',
    features: ['Private Garden', 'Master En-suite', 'Utility Room', 'Guest WC', 'Driveway Parking'],
    schedule: {
      'Living Room': '18.5 sq.m',
      'Kitchen/Dining': '24.2 sq.m',
      'Master Bedroom': '15.2 sq.m',
      'Bedroom 2': '12.5 sq.m',
      'Bedroom 3': '11.2 sq.m',
      'Bathroom': '5.2 sq.m',
      'En-suite': '3.8 sq.m',
      'Utility': '4.2 sq.m',
      'Hall': '8.5 sq.m',
      'Garden': '50 sq.m'
    }
  },
  '4bed': {
    name: '4 Bed House',
    price: 'From €495,000',
    area: '145 sq.m',
    bedrooms: 4,
    bathrooms: 3,
    available: 8,
    total: 12,
    floor_plans: '/images/fitzgerald-gardens/4bed-floorplan.jpg',
    features: ['Large Garden', 'Master En-suite', 'Utility Room', 'Guest WC', 'Double Driveway'],
    schedule: {
      'Living Room': '22.5 sq.m',
      'Kitchen/Dining': '28.5 sq.m',
      'Master Bedroom': '18.2 sq.m',
      'Bedroom 2': '14.5 sq.m',
      'Bedroom 3': '12.8 sq.m',
      'Bedroom 4': '11.5 sq.m',
      'Bathroom': '5.8 sq.m',
      'En-suite': '4.5 sq.m',
      'Utility': '5.2 sq.m',
      'Hall': '10.5 sq.m',
      'Garden': '75 sq.m'
    }
  }
};