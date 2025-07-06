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
      where: { developmentId },
    });
  }

  /**
   * Find available units by development ID
   */
  async findAvailableByDevelopmentId(developmentId: string): Promise<Unit[]> {
    return this.model.findMany({
      where: { 
        developmentId,
        status: 'AVAILABLE',
      },
    });
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
        documents: true,
      },
    });
  }

  /**
   * Find units by type
   */
  async findByType(type: string): Promise<Unit[]> {
    return this.model.findMany({
      where: { type },
    });
  }

  /**
   * Find units by status
   */
  async findByStatus(status: string): Promise<Unit[]> {
    return this.model.findMany({
      where: { status },
    });
  }

  /**
   * Update unit status with audit trail
   */
  async updateStatus(id: string, status: string, auditData?: any): Promise<Unit & { previousStatus?: string }> {
    // Get current unit to store previous status
    const currentUnit = await this.model.findUnique({ where: { id } });
    if (!currentUnit) throw new Error('Unit not found');

    const updatedUnit = await this.model.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        ...(auditData && {
          statusHistory: {
            create: {
              previousStatus: currentUnit.status,
              newStatus: status,
              reason: auditData.reason,
              updatedBy: auditData.updatedBy,
              updatedAt: auditData.updatedAt
            }
          }
        })
      },
      include: {
        statusHistory: {
          orderBy: { updatedAt: 'desc' },
          take: 1
        }
      }
    });

    return { ...updatedUnit, previousStatus: currentUnit.status };
  }

  /**
   * Update unit price with audit trail
   */
  async updatePrice(id: string, newPrice: number, auditData?: any): Promise<Unit & { previousPrice?: number }> {
    // Get current unit to store previous price
    const currentUnit = await this.model.findUnique({ where: { id } });
    if (!currentUnit) throw new Error('Unit not found');

    const updatedUnit = await this.model.update({
      where: { id },
      data: {
        basePrice: newPrice,
        updatedAt: new Date(),
        ...(auditData && {
          priceHistory: {
            create: {
              previousPrice: currentUnit.basePrice,
              newPrice: newPrice,
              reason: auditData.reason,
              updatedBy: auditData.updatedBy,
              updatedAt: auditData.updatedAt
            }
          }
        })
      },
      include: {
        priceHistory: {
          orderBy: { updatedAt: 'desc' },
          take: 1
        }
      }
    });

    return { ...updatedUnit, previousPrice: currentUnit.basePrice };
  }

  /**
   * Bulk update unit status
   */
  async bulkUpdateStatus(unitIds: string[], status: string, auditData?: any): Promise<Unit[]> {
    // Update all units in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const updatedUnits = [];
      
      for (const unitId of unitIds) {
        const currentUnit = await tx.unit.findUnique({ where: { id: unitId } });
        if (currentUnit) {
          const updatedUnit = await tx.unit.update({
            where: { id: unitId },
            data: {
              status,
              updatedAt: new Date(),
              ...(auditData && {
                statusHistory: {
                  create: {
                    previousStatus: currentUnit.status,
                    newStatus: status,
                    reason: auditData.reason,
                    updatedBy: auditData.updatedBy,
                    updatedAt: auditData.updatedAt
                  }
                }
              })
            }
          });
          updatedUnits.push(updatedUnit);
        }
      }
      
      return updatedUnits;
    });

    return result;
  }

  /**
   * Bulk update unit price
   */
  async bulkUpdatePrice(unitIds: string[], adjustment: { type: 'amount' | 'percentage', value: number }, auditData?: any): Promise<Unit[]> {
    // Update all units in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const updatedUnits = [];
      
      for (const unitId of unitIds) {
        const currentUnit = await tx.unit.findUnique({ where: { id: unitId } });
        if (currentUnit) {
          let newPrice: number;
          
          if (adjustment.type === 'amount') {
            newPrice = currentUnit.basePrice + adjustment.value;
          } else {
            newPrice = currentUnit.basePrice * (1 + adjustment.value / 100);
          }
          
          const updatedUnit = await tx.unit.update({
            where: { id: unitId },
            data: {
              basePrice: newPrice,
              updatedAt: new Date(),
              ...(auditData && {
                priceHistory: {
                  create: {
                    previousPrice: currentUnit.basePrice,
                    newPrice: newPrice,
                    reason: auditData.reason,
                    updatedBy: auditData.updatedBy,
                    updatedAt: auditData.updatedAt
                  }
                }
              })
            }
          });
          updatedUnits.push(updatedUnit);
        }
      }
      
      return updatedUnits;
    });

    return result;
  }

  /**
   * Assign buyer to unit
   */
  async assignBuyer(unitId: string, buyerData: any, auditData?: any): Promise<Unit> {
    return this.model.update({
      where: { id: unitId },
      data: {
        buyerName: buyerData.name,
        buyerEmail: buyerData.email,
        buyerPhone: buyerData.phone,
        buyerSolicitor: buyerData.solicitor,
        status: 'RESERVED', // Automatically set to reserved when buyer assigned
        reservedAt: new Date(),
        updatedAt: new Date(),
        ...(auditData && {
          buyerHistory: {
            create: {
              buyerName: buyerData.name,
              buyerEmail: buyerData.email,
              assignedBy: auditData.assignedBy,
              assignedAt: auditData.assignedAt,
              action: 'ASSIGNED'
            }
          }
        })
      },
      include: {
        development: true,
        buyerHistory: {
          orderBy: { assignedAt: 'desc' },
          take: 1
        }
      }
    });
  }

  /**
   * Get units with buyer information
   */
  async findWithBuyerInfo(developmentId: string): Promise<Unit[]> {
    return this.model.findMany({
      where: { developmentId },
      include: {
        buyerHistory: {
          orderBy: { assignedAt: 'desc' },
          take: 1
        },
        statusHistory: {
          orderBy: { updatedAt: 'desc' },
          take: 1
        },
        priceHistory: {
          orderBy: { updatedAt: 'desc' },
          take: 1
        }
      }
    });
  }

  /**
   * Get unit statistics for a development
   */
  async getUnitStatistics(developmentId: string): Promise<{
    total: number;
    available: number;
    reserved: number;
    sold: number;
    averagePrice: number;
    totalValue: number;
  }> {
    const units = await this.model.findMany({
      where: { developmentId },
      select: {
        status: true,
        basePrice: true
      }
    });

    const total = units.length;
    const available = units.filter(u => u.status === 'AVAILABLE').length;
    const reserved = units.filter(u => u.status === 'RESERVED').length;
    const sold = units.filter(u => u.status === 'SOLD').length;
    const averagePrice = units.reduce((sum, u) => sum + u.basePrice, 0) / total;
    const totalValue = units.reduce((sum, u) => sum + u.basePrice, 0);

    return {
      total,
      available,
      reserved,
      sold,
      averagePrice,
      totalValue
    };
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
    if (type && type.length > 0) where.type = { in: type };
    if (status && status.length > 0) where.status = { in: status };

    return this.model.findMany({
      where,
      skip,
      take,
      orderBy: {
        basePrice: 'asc',
      },
    });
  }
}