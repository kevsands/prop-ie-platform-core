/**
 * Beautiful Brochure Data for All Developments
 * Comprehensive development information with CGI renders, house types, and specifications
 * NOW UNIFIED: Uses live data from developer portal via BuyerDeveloperDataBridge
 */

// NOTE: Import removed to prevent circular dependency with BuyerDeveloperDataBridge
// import { buyerDeveloperDataBridge } from '@/services/BuyerDeveloperDataBridge';

// TypeScript interfaces
export interface HouseType {
  id: string;
  name: string;
  description: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  floorPlanImages: string[];
  cgiRender?: string;
  features?: string[];
}

export interface Amenity {
  name: string;
  distance: string;
}

export interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Unit {
  id: string;
  number: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  status: 'available' | 'reserved' | 'sold';
  price: number;
  coordinates: Coordinates;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface LegalInfo {
  developer: string;
  solicitor: string;
  contact: string;
  documents: string[];
}

export interface AmenityGroups {
  schools: Amenity[];
  shopping: Amenity[];
  transport: Amenity[];
  leisure: Amenity[];
}

export interface Development {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  heroImage: string;
  features: string[];
  propertyTypes: HouseType[];
  units: Unit[];
  galleryImages: GalleryImage[];
  amenities: AmenityGroups;
  legalInfo: LegalInfo;
  sitePlan?: string;
  brochureUrl?: string;
}

// FITZGERALD GARDENS DEVELOPMENT DATA
export const fitzgeraldGardens: Development = {
  id: 'fitzgerald-gardens',
  name: 'Fitzgerald Gardens',
  slug: 'fitzgerald-gardens',
  location: 'Drogheda, Ireland',
  description: 'Luxurious living with modern comforts in the heart of Drogheda. A perfect location with everything you need and want.',
  heroImage: '/images/developments/fitzgerald-gardens/hero.jpeg',
  features: [
    'Energy-efficient design',
    'Premium doors and ironmongery',
    'Contemporary fitted kitchens',
    'Sustainable energy solutions',
    'High-performance windows and ventilation',
    'Guaranteed quality and peace of mind'
  ],
  propertyTypes: [
    {
      id: 'type-a',
      name: 'Houses Type A',
      description: '3 Bedroom Semi-Detached',
      size: '107 SQM / 1151 SQFT',
      bedrooms: 3,
      bathrooms: 2,
      floorPlanImages: ['/images/developments/fitzgerald-gardens/House Type 1.png', '/images/developments/fitzgerald-gardens/House Type 2.png'],
      cgiRender: '/images/developments/fitzgerald-gardens/3bed-House.jpeg',
      features: ['Open plan kitchen/dining/living', 'Master bedroom with en-suite', 'Private rear garden', 'Downstairs WC']
    },
    {
      id: 'type-b',
      name: 'Houses Type B',
      description: '3 Bedroom Semi-Detached with Bay Window',
      size: '109.4 SQM / 1177 SQFT',
      bedrooms: 3,
      bathrooms: 2,
      floorPlanImages: ['/images/developments/fitzgerald-gardens/House Type 3.png', '/images/developments/fitzgerald-gardens/House Type 4.png'],
      cgiRender: '/images/developments/fitzgerald-gardens/3bed-duplex.jpeg',
      features: ['Bay window feature', 'Open plan living', 'Master bedroom with en-suite', 'Private garden']
    },
    {
      id: 'type-c',
      name: 'Apartments Type C',
      description: '2 Bedroom Apartment',
      size: '75 SQM / 807 SQFT',
      bedrooms: 2,
      bathrooms: 2,
      floorPlanImages: ['/images/developments/fitzgerald-gardens/Duplex D5.png', '/images/developments/fitzgerald-gardens/Duplex d6.png'],
      cgiRender: '/images/developments/fitzgerald-gardens/2bed-apartment.jpeg',
      features: ['Modern apartment living', 'Balcony/terrace', 'Master bedroom with en-suite', 'Open plan kitchen/living']
    }
  ],
  units: [
    { id: '1', number: '1', type: 'House Type A', bedrooms: 3, bathrooms: 2, sqm: 107, status: 'available', price: 395000, coordinates: { x: 10, y: 20, width: 5, height: 5 } },
    { id: '2', number: '2', type: 'House Type A', bedrooms: 3, bathrooms: 2, sqm: 107, status: 'available', price: 400000, coordinates: { x: 16, y: 20, width: 5, height: 5 } },
    { id: '3', number: '3', type: 'House Type B', bedrooms: 3, bathrooms: 2, sqm: 109, status: 'reserved', price: 420000, coordinates: { x: 22, y: 20, width: 5, height: 5 } },
    { id: '4', number: '4', type: 'Apartment Type C', bedrooms: 2, bathrooms: 2, sqm: 75, status: 'available', price: 320000, coordinates: { x: 28, y: 20, width: 5, height: 5 } }
  ],
  galleryImages: [
    { src: '/images/developments/fitzgerald-gardens/hero.jpeg', alt: 'Fitzgerald Gardens hero view' },
    { src: '/images/developments/fitzgerald-gardens/HouseTypes Header.jpeg', alt: 'House types at Fitzgerald Gardens' },
    { src: '/images/developments/fitzgerald-gardens/3bed-House.jpeg', alt: 'Three bedroom house exterior' },
    { src: '/images/developments/fitzgerald-gardens/2bed-apartment.jpeg', alt: 'Two bedroom apartment exterior' },
    { src: '/images/developments/fitzgerald-gardens/Vanity-unit.jpeg', alt: 'Modern bathroom vanity unit' }
  ],
  amenities: {
    schools: [
      { name: 'St. Mary\'s Primary School', distance: '0.5 km' },
      { name: 'Drogheda Grammar School', distance: '1.2 km' },
      { name: 'Sacred Heart Secondary School', distance: '1.5 km' }
    ],
    shopping: [
      { name: 'Drogheda Town Centre', distance: '1.8 km' },
      { name: 'Scotch Hall Shopping Centre', distance: '2 km' },
      { name: 'Southgate Shopping Centre', distance: '1.5 km' }
    ],
    transport: [
      { name: 'Drogheda Train Station', distance: '2.3 km' },
      { name: 'Dublin Airport', distance: '35 km' },
      { name: 'M1 Motorway', distance: '3 km' }
    ],
    leisure: [
      { name: 'Drogheda Leisure Park', distance: '2.1 km' },
      { name: 'County Louth Golf Club', distance: '5 km' },
      { name: 'Boyne River Greenway', distance: '1.2 km' }
    ]
  },
  legalInfo: {
    developer: 'Fitzgerald Developments Ltd',
    solicitor: 'Smith & Associates',
    contact: 'legal@fitzgeraldgardens.ie',
    documents: ['Contract for Sale', 'Building Agreement', 'Title Documents', 'Management Company Details']
  },
  sitePlan: '/images/developments/fitzgerald-gardens/site-plan.jpg'
};

// BALLYMAKENNY VIEW DEVELOPMENT DATA
export const ballymakennnyView: Development = {
  id: 'ballymakenny-view',
  name: 'Ballymakenny View',
  slug: 'ballymakenny-view',
  location: 'Drogheda, Ireland',
  description: 'Stunning new homes in a premium location with beautiful views and modern amenities. Choose from our carefully designed house types.',
  heroImage: '/images/developments/Ballymakenny-View/hero.jpg',
  features: [
    'Premium location with beautiful views',
    'Modern architectural design',
    'High-quality finishes throughout',
    'Energy-efficient construction',
    'Private gardens and parking',
    'Close to all amenities'
  ],
  propertyTypes: [
    {
      id: 'house-type-a',
      name: 'House Type A',
      description: '3 Bedroom Semi-Detached',
      size: '115 SQM / 1238 SQFT',
      bedrooms: 3,
      bathrooms: 2,
      floorPlanImages: ['/images/developments/Ballymakenny-View/HouseType A FP1.png', '/images/developments/Ballymakenny-View/HouseType A FP2.png'],
      cgiRender: '/images/developments/Ballymakenny-View/HouseType A.jpg',
      features: ['Open plan kitchen/living/dining', 'Master bedroom with en-suite', 'Family bathroom', 'Private rear garden', 'Front parking']
    },
    {
      id: 'house-type-b',
      name: 'House Type B',
      description: '4 Bedroom Detached',
      size: '140 SQM / 1507 SQFT',
      bedrooms: 4,
      bathrooms: 3,
      floorPlanImages: ['/images/developments/Ballymakenny-View/HouseTypeB FP1.html', '/images/developments/Ballymakenny-View/HouseTypeB FP2.png'],
      cgiRender: '/images/developments/Ballymakenny-View/House Type B.jpg',
      features: ['Spacious detached design', 'Master bedroom with en-suite', 'Additional en-suite', 'Large private garden', 'Double parking']
    }
  ],
  units: [
    { id: 'bmv-1', number: '1', type: 'House Type A', bedrooms: 3, bathrooms: 2, sqm: 115, status: 'available', price: 385000, coordinates: { x: 10, y: 25, width: 5, height: 5 } },
    { id: 'bmv-2', number: '2', type: 'House Type A', bedrooms: 3, bathrooms: 2, sqm: 115, status: 'available', price: 390000, coordinates: { x: 16, y: 25, width: 5, height: 5 } },
    { id: 'bmv-3', number: '3', type: 'House Type B', bedrooms: 4, bathrooms: 3, sqm: 140, status: 'available', price: 465000, coordinates: { x: 22, y: 25, width: 5, height: 5 } },
    { id: 'bmv-4', number: '4', type: 'House Type B', bedrooms: 4, bathrooms: 3, sqm: 140, status: 'sold', price: 470000, coordinates: { x: 28, y: 25, width: 5, height: 5 } }
  ],
  galleryImages: [
    { src: '/images/developments/Ballymakenny-View/hero.jpg', alt: 'Ballymakenny View development' },
    { src: '/images/developments/Ballymakenny-View/01-NoPeople.jpg', alt: 'External view of homes' },
    { src: '/images/developments/Ballymakenny-View/01-People.jpg', alt: 'Community living at Ballymakenny View' },
    { src: '/images/developments/Ballymakenny-View/02-NoPeople.jpg', alt: 'Street view of development' },
    { src: '/images/developments/Ballymakenny-View/BMV 1.jpg', alt: 'Interior view' },
    { src: '/images/developments/Ballymakenny-View/BMV 2.jpg', alt: 'Modern kitchen design' }
  ],
  amenities: {
    schools: [
      { name: 'Ballymakenny National School', distance: '0.3 km' },
      { name: 'Drogheda Institute', distance: '2.5 km' },
      { name: 'St. Oliver\'s Community College', distance: '3 km' }
    ],
    shopping: [
      { name: 'Local Shopping Centre', distance: '1 km' },
      { name: 'Drogheda Town Centre', distance: '3.5 km' },
      { name: 'Southgate Shopping Centre', distance: '4 km' }
    ],
    transport: [
      { name: 'Bus Route 101', distance: '0.2 km' },
      { name: 'Drogheda Train Station', distance: '4 km' },
      { name: 'M1 Motorway', distance: '2 km' }
    ],
    leisure: [
      { name: 'Ballymakenny Park', distance: '0.5 km' },
      { name: 'Boyne Valley Golf Club', distance: '3 km' },
      { name: 'Millmount Museum', distance: '3.5 km' }
    ]
  },
  legalInfo: {
    developer: 'Ballymakenny Developments Ltd',
    solicitor: 'O\'Brien Legal Services',
    contact: 'info@ballymakenny-view.ie',
    documents: ['Contract for Sale', 'Planning Permission', 'Title Documents', 'Building Regulations']
  },
  sitePlan: '/images/developments/Ballymakenny-View/BMV Site Plan.png',
  brochureUrl: '/images/brochures/Ballymakenny View Brochure.pdf'
};

// ELLWOOD DEVELOPMENT DATA
export const ellwood: Development = {
  id: 'ellwood',
  name: 'Ellwood',
  slug: 'ellwood',
  location: 'Premium Location, Ireland',
  description: 'Contemporary living in a beautiful setting. Ellwood offers sophisticated homes with modern design and premium finishes throughout.',
  heroImage: '/images/developments/Ellwood-Logos/hero.jpg',
  features: [
    'Contemporary architectural design',
    'Premium finishes throughout',
    'Beautiful natural setting',
    'Modern amenities',
    'Sustainable living solutions',
    'Exclusive community'
  ],
  propertyTypes: [
    {
      id: 'ellwood-type-1',
      name: 'Ellwood Homes',
      description: 'Contemporary Family Homes',
      size: 'Various Sizes Available',
      bedrooms: 3,
      bathrooms: 2,
      floorPlanImages: [],
      cgiRender: '/images/developments/Ellwood-Logos/EllwoodBloom-1.jpeg',
      features: ['Contemporary design', 'Open plan living', 'Private outdoor space', 'Modern kitchen and bathrooms']
    }
  ],
  units: [
    { id: 'ell-1', number: '1', type: 'Ellwood Home', bedrooms: 3, bathrooms: 2, sqm: 120, status: 'available', price: 425000, coordinates: { x: 10, y: 30, width: 5, height: 5 } },
    { id: 'ell-2', number: '2', type: 'Ellwood Home', bedrooms: 3, bathrooms: 2, sqm: 125, status: 'available', price: 435000, coordinates: { x: 16, y: 30, width: 5, height: 5 } },
    { id: 'ell-3', number: '3', type: 'Ellwood Home', bedrooms: 4, bathrooms: 3, sqm: 145, status: 'reserved', price: 485000, coordinates: { x: 22, y: 30, width: 5, height: 5 } }
  ],
  galleryImages: [
    { src: '/images/developments/Ellwood-Logos/EllwoodBloom-1.jpeg', alt: 'Ellwood exterior view' },
    { src: '/images/developments/Ellwood-Logos/EllwoodBloom-2.jpeg', alt: 'Contemporary design features' },
    { src: '/images/developments/Ellwood-Logos/EllwoodBloom-3.jpeg', alt: 'Modern living spaces' },
    { src: '/images/developments/Ellwood-Logos/EllwoodBloom-4.jpeg', alt: 'Premium finishes' },
    { src: '/images/developments/Ellwood-Logos/EllwoodBloom-5.jpeg', alt: 'Beautiful setting' }
  ],
  amenities: {
    schools: [
      { name: 'Local Primary School', distance: '1 km' },
      { name: 'Secondary School', distance: '2 km' }
    ],
    shopping: [
      { name: 'Village Centre', distance: '1.5 km' },
      { name: 'Shopping Centre', distance: '3 km' }
    ],
    transport: [
      { name: 'Bus Route', distance: '0.5 km' },
      { name: 'Train Station', distance: '5 km' }
    ],
    leisure: [
      { name: 'Local Park', distance: '0.8 km' },
      { name: 'Golf Club', distance: '4 km' }
    ]
  },
  legalInfo: {
    developer: 'Ellwood Developments Ltd',
    solicitor: 'Premium Legal Services',
    contact: 'info@ellwood.ie',
    documents: ['Contract for Sale', 'Development Plans', 'Title Documents']
  }
};

// Export development data lookup
export const DEVELOPMENT_DATA: Record<string, Development> = {
  'fitzgerald-gardens': fitzgeraldGardens,
  'ballymakenny-view': ballymakennnyView,
  'ellwood': ellwood
};

export const getAllDevelopments = (): Development[] => {
  return Object.values(DEVELOPMENT_DATA);
};

export const getDevelopmentById = (id: string): Development | null => {
  // Return static data to prevent circular dependency
  // The BuyerDeveloperDataBridge will handle live data merging separately
  console.log(`📄 Getting static brochure data for ${id}`);
  return DEVELOPMENT_DATA[id] || null;
};