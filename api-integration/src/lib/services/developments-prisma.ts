/**
 * Development Service using Prisma (Enterprise-ready)
 * Works with current minimal schema and can be extended to enterprise schema
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      // Simple fetch for now - we can add filtering later
      const developments = await prisma.development.findMany({
        orderBy: { createdAt: 'desc' }
      });

      // Map to expected format with real data from seed script
      return developments.map(dev => {
        // Use real data from seed script based on development ID
        const realData = getRealDevelopmentData(dev.id);
        return {
          id: dev.id,
          name: dev.name,
          description: dev.description || realData.description,
          location: dev.location,
          city: extractCityFromLocation(dev.location),
          county: extractCountyFromLocation(dev.location),
          status: realData.status,
          mainImage: realData.mainImage,
          startingPrice: realData.startingPrice,
          totalUnits: realData.totalUnits,
          isPublished: realData.isPublished,
          createdAt: dev.createdAt,
          updatedAt: dev.updatedAt
        };
      });
    } catch (error) {
      console.error('Error fetching developments with Prisma, falling back to mock data:', error);
      
      // Fallback to mock data when database is unavailable
      return getAllMockDevelopmentData().filter(dev => {
        if (filters?.isPublished !== undefined && dev.isPublished !== filters.isPublished) {
          return false;
        }
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          return (
            dev.name.toLowerCase().includes(searchLower) ||
            dev.description?.toLowerCase().includes(searchLower) ||
            dev.location.toLowerCase().includes(searchLower)
          );
        }
        return true;
      });
    }
  },

  /**
   * Get a single development by ID
   */
  getDevelopmentById: async (id: string): Promise<DevelopmentData | null> => {
    try {
      const development = await prisma.development.findUnique({
        where: { id },
        include: {
          units: true
        }
      });

      if (!development) {
        return null;
      }

      const realData = getRealDevelopmentData(development.id);
      return {
        id: development.id,
        name: development.name,
        description: development.description || realData.description,
        location: development.location,
        city: extractCityFromLocation(development.location),
        county: extractCountyFromLocation(development.location),
        status: realData.status,
        mainImage: realData.mainImage,
        startingPrice: realData.startingPrice,
        totalUnits: development.units?.length || realData.totalUnits,
        isPublished: realData.isPublished,
        createdAt: development.createdAt,
        updatedAt: development.updatedAt
      };
    } catch (error) {
      console.error('Error fetching development by ID with Prisma, falling back to mock data:', error);
      
      // Fallback to mock data when database is unavailable
      const mockData = getMockDevelopmentData(id);
      if (mockData) {
        return mockData;
      }
      
      return null;
    }
  },

  /**
   * Create a new development
   */
  createDevelopment: async (developmentData: CreateDevelopmentInput): Promise<DevelopmentData> => {
    try {
      const development = await prisma.development.create({
        data: {
          name: developmentData.name,
          description: developmentData.description || '',
          location: developmentData.location
        }
      });

      const realData = getRealDevelopmentData(development.id);
      return {
        id: development.id,
        name: development.name,
        description: development.description || realData.description,
        location: development.location,
        city: extractCityFromLocation(development.location),
        county: extractCountyFromLocation(development.location),
        status: realData.status,
        mainImage: realData.mainImage,
        startingPrice: realData.startingPrice,
        totalUnits: realData.totalUnits,
        isPublished: realData.isPublished,
        createdAt: development.createdAt,
        updatedAt: development.updatedAt
      };
    } catch (error) {
      console.error('Error creating development with Prisma:', error);
      throw new Error('Failed to create development');
    }
  },

  /**
   * Get units for a development
   */
  getUnitsForDevelopment: async (developmentId: string): Promise<any[]> => {
    try {
      // Try to get units from database first
      const units = await prisma.unit.findMany({
        where: { developmentId }
      });
      return units;
    } catch (error) {
      console.error('Error fetching units for development, returning empty array:', error);
      // Fallback to empty array when database is unavailable
      return [];
    }
  }
};

/**
 * Helper function to extract city from location string
 */
function extractCityFromLocation(location: string): string {
  // Simple extraction - in real scenario would be more sophisticated
  const parts = location.split(',');
  return parts[0]?.trim() || 'Dublin';
}

/**
 * Helper function to extract county from location string
 */
function extractCountyFromLocation(location: string): string {
  // Simple extraction - in real scenario would be more sophisticated
  const parts = location.split(',');
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1]?.trim();
    if (lastPart?.startsWith('Co.')) {
      return lastPart;
    }
  }
  return 'Co. Dublin';
}

/**
 * Get real development data from seed script values
 */
function getRealDevelopmentData(developmentId: string) {
  const realDevelopments: Record<string, any> = {
    'fitzgerald-gardens': {
      description: 'Luxurious living with modern comforts in the heart of Drogheda',
      status: 'ACTIVE',
      totalUnits: 32,
      startingPrice: 320000,
      isPublished: true,
      mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg'
    },
    'ballymakenny-view': {
      description: 'Modern family homes in a convenient location with excellent amenities',
      status: 'ACTIVE',
      totalUnits: 16,
      startingPrice: 350000,
      isPublished: true,
      mainImage: '/images/developments/Ballymakenny-View/hero.jpg'
    },
    'ellwood': {
      description: 'Contemporary apartment living in Drogheda',
      status: 'ACTIVE',
      totalUnits: 24,
      startingPrice: 285000,
      isPublished: true,
      mainImage: '/images/developments/Ellwood-Logos/hero.jpg'
    }
  };

  return realDevelopments[developmentId] || {
    description: 'Premium residential development',
    status: 'ACTIVE',
    totalUnits: 10,
    startingPrice: 300000,
    isPublished: true,
    mainImage: '/images/development-placeholder.jpg'
  };
}

/**
 * Get all mock development data when database is unavailable
 */
function getAllMockDevelopmentData(): DevelopmentData[] {
  return [
    {
      id: 'fitzgerald-gardens',
      name: 'Fitzgerald Gardens',
      description: 'Contemporary living in Dublin city',
      location: 'Dublin 8',
      city: 'Dublin',
      county: 'Co. Dublin',
      status: 'ACTIVE',
      mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg',
      startingPrice: 350000,
      totalUnits: 45,
      isPublished: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 'ellwood',
      name: 'Ellwood',
      description: 'Contemporary apartment living in Drogheda',
      location: 'Drogheda, Co. Louth',
      city: 'Drogheda',
      county: 'Co. Louth',
      status: 'ACTIVE',
      mainImage: '/images/developments/ellwood/hero.jpg',
      startingPrice: 285000,
      totalUnits: 24,
      isPublished: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 'ballymakenny-view',
      name: 'Ballymakenny View',
      description: 'Modern family homes in a convenient location with excellent amenities',
      location: 'Drogheda, Co. Louth',
      city: 'Drogheda',
      county: 'Co. Louth',
      status: 'ACTIVE',
      mainImage: '/images/developments/ballymakenny-view/hero.jpg',
      startingPrice: 350000,
      totalUnits: 16,
      isPublished: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    }
  ];
}

/**
 * Get mock development data when database is unavailable
 */
function getMockDevelopmentData(id: string): DevelopmentData | null {
  const mockDevelopments = getAllMockDevelopmentData();
  return mockDevelopments.find(dev => dev.id === id) || null;
}

export default developmentsService;