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
      // Fetch from enterprise database with full relationships
      const developments = await prisma.development.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          shortDescription: true,
          mainImage: true,
          images: true,
          features: true,
          amenities: true,
          isPublished: true,
          created: true,
          updated: true,
          status: true,
          startDate: true,
          completionDate: true,
          Location: {
            select: {
              address: true,
              city: true,
              county: true,
              eircode: true,
              latitude: true,
              longitude: true
            }
          },
          Unit: {
            select: {
              id: true,
              name: true,
              unitNumber: true,
              type: true,
              bedrooms: true,
              bathrooms: true,
              size: true,
              basePrice: true,
              status: true,
              primaryImage: true,
              berRating: true
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
            Location: {
              city: { contains: filters.city, mode: 'insensitive' }
            }
          })
        },
        orderBy: { created: 'desc' }
      });

      // Map enterprise data to expected format
      return developments.map(dev => {
        const locationString = `${dev.Location?.address || ''}, ${dev.Location?.city || ''}, ${dev.Location?.county || ''}`.replace(/^,\s*|,\s*$/g, '');
        const units = dev.Unit || [];
        const prices = units.map(u => u.basePrice || 0).filter(p => p > 0);
        const startingPrice = prices.length > 0 ? Math.min(...prices) : 300000;
        
        return {
          id: dev.id,
          name: dev.name,
          description: dev.description,
          location: locationString,
          city: dev.Location?.city || 'Drogheda',
          county: dev.Location?.county || 'Co. Louth',
          status: dev.status.toLowerCase().replace('_', '-'),
          mainImage: dev.mainImage,
          startingPrice: startingPrice,
          totalUnits: units.length,
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
      // Fetch from enterprise database with full relationships
      const development = await prisma.development.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          shortDescription: true,
          mainImage: true,
          images: true,
          features: true,
          amenities: true,
          isPublished: true,
          created: true,
          updated: true,
          status: true,
          startDate: true,
          completionDate: true,
          Location: {
            select: {
              address: true,
              city: true,
              county: true,
              eircode: true,
              latitude: true,
              longitude: true
            }
          },
          Unit: {
            select: {
              id: true,
              name: true,
              unitNumber: true,
              type: true,
              bedrooms: true,
              bathrooms: true,
              size: true,
              basePrice: true,
              status: true,
              primaryImage: true,
              berRating: true
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
          city: development.Location?.city || 'Drogheda',
          county: development.Location?.county || 'Co. Louth',
          status: development.status.toLowerCase().replace('_', '-'),
          mainImage: development.mainImage,
          startingPrice: startingPrice,
          totalUnits: units.length,
          isPublished: development.isPublished,
          createdAt: development.created,
          updatedAt: development.updated
        };
      }
    } catch (dbError) {
      console.error('Database error fetching development:', id, dbError);
      throw new Error(`Failed to fetch development: ${id}`);
    }

    // Return null if development not found
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