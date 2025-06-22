/**
 * Elizabeth Walk Development Data
 * Real project configuration for database seeding
 */

export const elizabethWalkData = {
  name: 'Elizabeth Walk',
  location: 'Drogheda, Co. Louth',
  description: 'Modern residential development featuring quality 2 and 3 bedroom units with excellent local amenities.',
  totalUnits: 32,
  availableUnits: 18,
  startingPrice: 285000,
  completion: 75,
  amenities: [
    'Modern Kitchen',
    'Private Garden/Balcony',
    'Parking Space',
    'Energy Efficient',
    'Storage',
    'Close to Schools',
    'Transport Links'
  ],
  images: [
    '/images/developments/elizabeth-walk/exterior-1.jpg',
    '/images/developments/elizabeth-walk/interior-1.jpg'
  ],
  brochureUrl: '/brochures/elizabeth-walk-brochure.pdf',
  virtualTourUrl: '/virtual-tours/elizabeth-walk',
  mapCoordinates: { lat: 53.7160, lng: -6.3450 },
  completionDate: '2025-06-30'
};