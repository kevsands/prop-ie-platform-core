// Define Property interface
export interface Property {
  id: string;
  name: string;
  projectName: string;
  projectSlug: string;
  price: number;
  status: 'available' | 'reserved' | 'sold' | 'under_offer';
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  parkingSpaces: number;
  type: string;
  images: string[];
}

// Hook for featured properties
export const useFeaturedProperties = () => {
  const mockProperties: Property[] = [
    {
      id: '1',
      name: 'Luxury Apartment 101',
      projectName: 'Oceanview Residences',
      projectSlug: 'oceanview-residences',
      price: 450000,
      status: 'available',
      address: 'Dublin, Ireland',
      description: 'Beautiful modern apartment with ocean views',
      bedrooms: 2,
      bathrooms: 2,
      floorArea: 95,
      parkingSpaces: 1,
      type: 'apartment',
      images: ['/images/properties/apartment1.jpg']
    },
    {
      id: '2',
      name: 'Penthouse 502',
      projectName: 'Downtown Heights',
      projectSlug: 'downtown-heights',
      price: 750000,
      status: 'under_offer',
      address: 'Cork, Ireland',
      description: 'Spacious penthouse with city views',
      bedrooms: 3,
      bathrooms: 2,
      floorArea: 140,
      parkingSpaces: 2,
      type: 'penthouse',
      images: ['/images/properties/penthouse1.jpg']
    },
    {
      id: '3',
      name: 'Garden Villa 12',
      projectName: 'Parkside Gardens',
      projectSlug: 'parkside-gardens',
      price: 550000,
      status: 'available',
      address: 'Galway, Ireland',
      description: 'Beautiful villa with private garden',
      bedrooms: 4,
      bathrooms: 3,
      floorArea: 180,
      parkingSpaces: 2,
      type: 'house',
      images: ['/images/properties/villa1.jpg']
    }
  ];

  return {
    properties: mockProperties,
    loading: false,
    error: null as Error | null
  };
};

// Hook for project specific properties
export const useProjectProperties = (projectSlug: string) => {
  const mockProperties: Property[] = [
    {
      id: '101',
      name: 'Unit 101',
      projectName: 'Oceanview Residences',
      projectSlug: 'oceanview-residences',
      price: 450000,
      status: 'available',
      address: 'Dublin, Ireland',
      description: 'Beautiful modern apartment with ocean views',
      bedrooms: 2,
      bathrooms: 2,
      floorArea: 95,
      parkingSpaces: 1,
      type: 'apartment',
      images: ['/images/properties/apartment1.jpg']
    },
    {
      id: '102',
      name: 'Unit 102',
      projectName: 'Oceanview Residences',
      projectSlug: 'oceanview-residences',
      price: 460000,
      status: 'available',
      address: 'Dublin, Ireland',
      description: 'Spacious apartment with balcony',
      bedrooms: 2,
      bathrooms: 2,
      floorArea: 98,
      parkingSpaces: 1,
      type: 'apartment',
      images: ['/images/properties/apartment2.jpg']
    }
  ];

  // Filter by project slug
  const filteredProperties = mockProperties.filter(p => p.projectSlug === projectSlug);

  return {
    properties: filteredProperties,
    loading: false,
    error: null as Error | null
  };
};

// Hook for property details
export const usePropertyDetails = (projectSlug: string, propertyId: string) => {
  const allProperties: Property[] = [
    {
      id: '101',
      name: 'Unit 101',
      projectName: 'Oceanview Residences',
      projectSlug: 'oceanview-residences',
      price: 450000,
      status: 'available',
      address: 'Dublin, Ireland',
      description: 'Beautiful modern apartment with ocean views',
      bedrooms: 2,
      bathrooms: 2,
      floorArea: 95,
      parkingSpaces: 1,
      type: 'apartment',
      images: ['/images/properties/apartment1.jpg']
    },
    // Add more properties here
  ];

  // Find specific property
  const property = allProperties.find(p => p.projectSlug === projectSlug && p.id === propertyId);

  return {
    property,
    loading: false,
    error: property ? null : new Error('Property not found') as Error | null
  };
};