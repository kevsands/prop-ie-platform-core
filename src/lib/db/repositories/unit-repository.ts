import { PrismaClient } from '@prisma/client';
import type { Unit } from '@prisma/client';
import { Prisma } from '.prisma/client';
import { BaseRepository } from './base-repository';
import { prisma } from '../index';

type UnitCreateInput = Prisma.UnitCreateInput;
type UnitUpdateInput = Prisma.UnitUpdateInput;

/**
 * Repository for managing Unit entities
 */
export class UnitRepository extends BaseRepository<Unit, UnitCreateInput, UnitUpdateInput> {
  protected model: any;

  constructor(prismaClient: PrismaClient = prisma) {
    super(prismaClient);
    this.model = this.prisma.unit;
  }

  /**
   * Find units by development ID
   */
  async findByDevelopmentId(developmentId: string): Promise<Unit[]> {
    return this.model.findMany({
      where: { developmentId });
  }

  /**
   * Find available units by development ID
   */
  async findAvailableByDevelopmentId(developmentId: string): Promise<Unit[]> {
    return this.model.findMany({
      where: { 
        developmentId,
        status: 'AVAILABLE'});
  }

  /**
   * Find unit with all details including rooms, outdoor spaces, and customization options
   */
  async findWithFullDetails(id: string): Promise<Unit | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        rooms: true,
        outdoorSpaces: true,
        customizationOptions: true,
        documents: true});
  }

  /**
   * Find units by type
   */
  async findByType(type: string): Promise<Unit[]> {
    return this.model.findMany({
      where: { type });
  }

  /**
   * Find units by status
   */
  async findByStatus(status: string): Promise<Unit[]> {
    return this.model.findMany({
      where: { status });
  }

  /**
   * Update unit status
   */
  async updateStatus(id: string, status: string): Promise<Unit> {
    return this.model.update({
      where: { id },
      data: {
        status});
  }

  /**
   * Find units with filter by bedrooms, size, etc.
   */
  async findWithFilter(params: {
    developmentId?: string;
    minBedrooms?: number;
    maxBedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    type?: string[];
    status?: string[];
    skip?: number;
    take?: number;
  }): Promise<Unit[]> {
    const { 
      developmentId, 
      minBedrooms, 
      maxBedrooms, 
      minPrice, 
      maxPrice, 
      minSize, 
      maxSize,
      type,
      status,
      skip,
      take
    } = params;

    const where: any = {};

    if (developmentId) where.developmentId = developmentId;
    if (minBedrooms !== undefined) where.bedrooms = { gte: minBedrooms };
    if (maxBedrooms !== undefined) where.bedrooms = { ...where.bedrooms, lte: maxBedrooms };
    if (minPrice !== undefined) where.basePrice = { gte: minPrice };
    if (maxPrice !== undefined) where.basePrice = { ...where.basePrice, lte: maxPrice };
    if (minSize !== undefined) where.size = { gte: minSize };
    if (maxSize !== undefined) where.size = { ...where.size, lte: maxSize };
    if (type && type.length> 0) where.type = { in: type };
    if (status && status.length> 0) where.status = { in: status };

    return this.model.findMany({
      where,
      skip,
      take,
      orderBy: {
        basePrice: 'asc'});
  }
}