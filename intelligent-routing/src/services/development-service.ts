/**
 * Development Service
 * Business logic and data access for development projects
 */

import { developmentDb } from '@/lib/db';
import { mapDevelopment as mapPrismaDevelopmentToDevelopment, mapUnit as mapPrismaUnitToUnit } from '@/lib/db/mappers';
import { Development, DevelopmentStatus } from '@/types/core/development';
import { Location } from '@/types/core/location';
import { Unit, UnitType, UnitStatus } from '@/types/core/unit';

export class DevelopmentService {
  /**
   * Get a development by ID
   * @param id Development ID
   * @returns The development or null if not found
   */
  async getDevelopmentById(id: string): Promise<Development | null> {
    const prismaDevelopment = await developmentDb.getById(id);
    if (!prismaDevelopment) return null;
    return mapPrismaDevelopmentToDevelopment(prismaDevelopment);
  }
  
  /**
   * Get a development by slug
   * @param slug Development slug
   * @returns The development or null if not found
   */
  async getDevelopmentBySlug(slug: string): Promise<Development | null> {
    // Using getAll with filter for slug since getBySlug isn't available
    const developments = await developmentDb.getAll({ slug }, 1, 0);
    if (!developments || developments.length === 0) return null;
    return mapPrismaDevelopmentToDevelopment(developments[0]);
  }
  
  /**
   * List developments with filtering
   * @param options Filter options
   * @returns List of developments with pagination info
   */
  async listDevelopments(options?: {
    status?: DevelopmentStatus;
    developerId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    developments: Development[];
    totalCount: number;
    page: number;
    totalPages: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, ...filterOptions } = options || {};
    const offset = (page - 1) * limit;
    
    // Convert enum values to strings for the database
    const dbOptions = {
      ...filterOptions,
      status: filterOptions.status?.toString(),
      limit,
      offset
    };
    
    // Using getAll instead of list since list isn't available
    const developments = await developmentDb.getAll(dbOptions, limit, offset);
    // For total count, we need to get all without pagination
    const totalCountDevelopments = await developmentDb.getAll(dbOptions);
    const totalCount = totalCountDevelopments.length;
    
    return {
      developments: developments.map(mapPrismaDevelopmentToDevelopment),
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      limit
    };
  }
  
  /**
   * Create a new development
   * @param data Development creation data
   * @returns The created development
   */
  async createDevelopment(data: {
    name: string;
    developerId: string;
    location: {
      address: string;
      city: string;
      county: string;
      eircode?: string;
      longitude?: number;
      latitude?: number;
    };
    description: string;
    shortDescription?: string;
    mainImage: string;
    features: string[];
    amenities: string[];
    totalUnits: number;
    status: DevelopmentStatus;
  }): Promise<Development> {
    // Convert enum values to strings for the database
    const dbData = {
      ...data,
      status: data.status.toString()
    };
    
    const prismaDevelopment = await developmentDb.create(dbData);
    return mapPrismaDevelopmentToDevelopment(prismaDevelopment);
  }
  
  /**
   * Get units for a development
   * @param developmentId Development ID
   * @param options Filter options
   * @returns List of units with pagination info
   */
  async getDevelopmentUnits(developmentId: string, options?: {
    status?: UnitStatus;
    type?: UnitType;
    minBedrooms?: number;
    maxBedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    units: Unit[];
    totalCount: number;
    page: number;
    totalPages: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, ...filterOptions } = options || {};
    const offset = (page - 1) * limit;
    
    // Convert enum values to strings for the database
    const dbOptions = {
      ...filterOptions,
      developmentId,
      status: filterOptions.status?.toString(),
      type: filterOptions.type?.toString(),
      limit,
      offset
    };
    
    // Use the unitDb.list function we created
    const result = await unitDb.list(dbOptions);
    
    return {
      units: result.units.map(unit => mapPrismaUnitToUnit(unit)),
      totalCount: result.totalCount,
      page,
      totalPages: Math.ceil(result.totalCount / limit),
      limit
    };
  }
  
  /**
   * Add a unit to a development
   * @param developmentId Development ID
   * @param data Unit creation data
   * @returns The created unit
   */
  async addUnitToDevelopment(developmentId: string, data: {
    name: string;
    type: UnitType;
    size: number;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    parkingSpaces: number;
    basePrice: number;
    status: UnitStatus;
    berRating: string;
    features: string[];
    primaryImage: string;
    images: string[];
    floorplans: string[];
  }): Promise<Unit> {
    // Map from our API format to database format
    const dbData = {
      development_id: developmentId,
      name: data.name,
      unit_number: '', // Not provided in the input but required by schema
      description: '', // Not provided but might be required
      type: data.type.toString(),
      status: data.status.toString(),
      floor_number: data.floors,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      total_area: data.size,
      indoor_area: null, // Not provided in input
      outdoor_area: null, // Not provided in input
      parking_spaces: data.parkingSpaces,
      base_price: data.basePrice,
      current_price: data.basePrice, // Default to basePrice
      deposit_amount: null, // Not provided in input
      deposit_percentage: null, // Not provided in input
      floor_plan_url: data.floorplans[0] || null, // First floorplan as URL
      main_image_url: data.primaryImage,
      gallery_images: data.images,
      features: data.features,
      energy_rating: data.berRating,
      is_featured: false, // Default values
      is_customizable: false,
      customization_deadline: null
    };
    
    const prismaUnit = await unitDb.create(dbData);
    return mapPrismaUnitToUnit(prismaUnit);
  }
  
  /**
   * Update development status
   * @param id Development ID
   * @param status New development status
   * @returns The updated development
   */
  async updateDevelopmentStatus(id: string, status: DevelopmentStatus): Promise<Development> {
    const development = await this.getDevelopmentById(id);
    if (!development) {
      throw new Error(`Development with ID ${id} not found`);
    }
    
    // In a real implementation, this would update the database
    // This is a placeholder for demonstration purposes
    development.status = status;
    
    return development;
  }
  
  /**
   * Get development statistics
   * @param id Development ID
   * @returns Statistics for the development
   */
  async getDevelopmentStatistics(id: string): Promise<{
    totalUnits: number;
    availableUnits: number;
    reservedUnits: number;
    soldUnits: number;
    salesProgress: number;
    constructionProgress: number;
  }> {
    const development = await this.getDevelopmentById(id);
    if (!development) {
      throw new Error(`Development with ID ${id} not found`);
    }
    
    // In a real implementation, this would query the database
    // This is a placeholder for demonstration purposes
    return {
      totalUnits: development.totalUnits,
      availableUnits: 0, // Placeholder
      reservedUnits: 0, // Placeholder
      soldUnits: 0, // Placeholder
      salesProgress: 0, // Placeholder
      constructionProgress: 0 // Placeholder
    };
  }
}

export default new DevelopmentService();