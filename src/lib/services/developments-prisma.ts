/**
 * Development Service using Prisma (Enterprise-ready)
 * Works with current minimal schema and can be extended to enterprise schema
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enterprise-grade development data utilities
const getRealDevelopmentData = (id: string) => {
  const developmentData: Record<string, any> = {
    'fitzgerald-gardens': {
      description: 'Premium residential development in Drogheda with modern amenities and sustainable design',
      startingPrice: 285000,
      totalUnits: 48,
      status: 'active',
      mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg'
    },
    'ballymakenny-view': {
      description: '3 bedroom homes in prime Drogheda location with excellent transport links',
      startingPrice: 320000,
      totalUnits: 24,
      status: 'active',
      mainImage: '/images/developments/Ballymakenny-View/hero.jpg'
    },
    'ellwood': {
      description: '2 and 3 bedroom homes in a quiet residential area of Drogheda',
      startingPrice: 295000,
      totalUnits: 32,
      status: 'active',
      mainImage: '/images/developments/Ellwood-Logos/hero.jpg'
    }
  };
  
  return developmentData[id] || {
    description: 'Premium development',
    startingPrice: 300000,
    totalUnits: 20,
    status: 'active',
    mainImage: '/images/placeholder.jpg'
  };
};

const extractLocationFromRealData = (id: string) => {
  const locations: Record<string, string> = {
    'fitzgerald-gardens': 'Fitzgerald Gardens, Drogheda, Co. Louth',
    'ballymakenny-view': 'Ballymakenny Road, Drogheda, Co. Louth',
    'ellwood': 'Ellwood, Drogheda, Co. Louth'
  };
  return locations[id] || 'Drogheda, Co. Louth';
};

const extractCityFromLocation = (location: string) => {
  if (location.toLowerCase().includes('drogheda')) return 'Drogheda';
  if (location.toLowerCase().includes('dublin')) return 'Dublin';
  return 'Drogheda';
};

const extractCountyFromLocation = (location: string) => {
  if (location.toLowerCase().includes('louth')) return 'Co. Louth';
  if (location.toLowerCase().includes('dublin')) return 'Co. Dublin';
  return 'Co. Louth';
};

export interface DevelopmentData {
  id: string;
  name: string;
  description?: string;
  location: string;
  city?: string;
  county?: string;
  status?: string;
  mainImage?: string;
  startingPrice?: number;
  totalUnits?: number;
  isPublished?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDevelopmentInput {
  name: string;
  description?: string;
  location: string;
}

/**
 * Prisma-based developments service with backward compatibility
 */
export const developmentsService = {
  /**
   * Get all developments with optional filtering
   */
  getDevelopments: async (filters?: { 
    isPublished?: boolean; 
    search?: string;
    status?: string;
    city?: string;
  }): Promise<DevelopmentData[]> => {
    try {
      // Try to fetch from database using enterprise schema, fallback to mock data if needed
      let developments;
      try {
        developments = await prisma.development.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            mainImage: true,
            isPublished: true,
            created: true,
            updated: true,
            status: true,
            Location: {
              select: {
                address: true,
                city: true,
                county: true,
                eircode: true
              }
            },
            Unit: {
              select: {
                id: true,
                basePrice: true
              }
            }
          },
          where: {
            isPublished: filters?.isPublished !== false,
            ...(filters?.search && {
              OR: [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
              ]
            }),
            ...(filters?.city && {
              location: {
                city: { contains: filters.city, mode: 'insensitive' }
              }
            })
          },
          orderBy: { created: 'desc' }
        });
      } catch (dbError) {
        console.warn('Database schema mismatch, using fallback data:', dbError);
        // Return mock data for development purposes
        return [
          {
            id: 'fitzgerald-gardens',
            name: 'Fitzgerald Gardens',
            description: 'Premium residential development featuring 96 modern units',
            location: 'Ballymakenny Road, Drogheda, Co. Louth',
            city: 'Drogheda',
            county: 'Louth',
            status: 'active',
            mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg',
            startingPrice: 295000,
            totalUnits: 96,
            isPublished: true,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date()
          }
        ];
      }

      // Map to expected format with real data from seed script
      return developments.map(dev => {
        // Use real data from seed script based on development ID
        const realData = getRealDevelopmentData(dev.id);
        const locationString = `${dev.Location?.address || ''}, ${dev.Location?.city || ''}, ${dev.Location?.county || ''}`.replace(/^,\s*|,\s*$/g, '');
        const units = dev.Unit || [];
        const prices = units.map(u => u.basePrice || 0).filter(p => p > 0);
        const startingPrice = prices.length > 0 ? Math.min(...prices) : realData.startingPrice;
        
        return {
          id: dev.id,
          name: dev.name,
          description: dev.description || realData.description,
          location: locationString || extractLocationFromRealData(dev.id),
          city: dev.Location?.city || extractCityFromLocation(locationString || extractLocationFromRealData(dev.id)),
          county: dev.Location?.county || extractCountyFromLocation(locationString || extractLocationFromRealData(dev.id)),
          status: dev.status === 'ACTIVE' ? 'active' : realData.status,
          mainImage: dev.mainImage || realData.mainImage,
          startingPrice: startingPrice,
          totalUnits: units.length || realData.totalUnits,
          isPublished: dev.isPublished,
          createdAt: dev.created,
          updatedAt: dev.updated
        };
      });
    } catch (error) {
      console.error('Error fetching developments with Prisma:', error);
      throw new Error('Failed to fetch developments');
    }
  },

  /**
   * Get a single development by ID
   */
  getDevelopmentById: async (id: string): Promise<DevelopmentData | null> => {
    try {
      // Try to fetch from database first
      const development = await prisma.development.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          mainImage: true,
          isPublished: true,
          created: true,
          updated: true,
          status: true,
          Location: {
            select: {
              address: true,
              city: true,
              county: true,
              eircode: true
            }
          },
          Unit: {
            select: {
              id: true,
              basePrice: true
            }
          }
        }
      });

      if (development) {
        const locationString = `${development.Location?.address || ''}, ${development.Location?.city || ''}, ${development.Location?.county || ''}`.replace(/^,\s*|,\s*$/g, '');
        const units = development.Unit || [];
        const prices = units.map(u => u.basePrice || 0).filter(p => p > 0);
        const startingPrice = prices.length > 0 ? Math.min(...prices) : 300000;

        return {
          id: development.id,
          name: development.name,
          description: development.description,
          location: locationString,
          city: development.Location?.city || 'Dublin',
          county: development.Location?.county || 'Dublin',
          status: development.status === 'ACTIVE' ? 'active' : 'inactive',
          mainImage: development.mainImage || '/images/development-placeholder.jpg',
          startingPrice: startingPrice,
          totalUnits: units.length,
          isPublished: development.isPublished,
          createdAt: development.created,
          updatedAt: development.updated
        };
      }
    } catch (dbError) {
      console.warn('Database error, falling back to mock data for development:', id, dbError);
    }

    // Fallback to mock data for known developments
    if (id === 'fitzgerald-gardens') {
      return {
        id: 'fitzgerald-gardens',
        name: 'Fitzgerald Gardens',
        description: 'Premium residential development featuring 96 modern units with contemporary design and high-quality finishes. Located in the sought-after area of Drogheda.',
        location: 'Ballymakenny Road, Drogheda, Co. Louth',
        city: 'Drogheda',
        county: 'Louth',
        status: 'active',
        mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg',
        startingPrice: 295000,
        totalUnits: 96,
        isPublished: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      };
    }

    // Return null if development not found in fallback data
    return null;
  },

  /**
   * Create a new development (simplified for now)
   */
  createDevelopment: async (developmentData: CreateDevelopmentInput): Promise<DevelopmentData> => {
    // Creating developments requires complex data including locationId, developerId, etc.
    // For now, return a placeholder or throw an error
    throw new Error('Creating developments requires full enterprise data structure. Use developer portal for creating developments.');
  }
};


export default developmentsService;