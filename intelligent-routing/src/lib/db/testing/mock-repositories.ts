/**
 * Mock repository implementations for testing
 */

import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../src/lib/db/repositories/base-repository';

// Mock BaseRepository for testing
export class MockBaseRepository<T, CreateInput = any, UpdateInput = any> {
  protected model: any;
  protected prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique?.({
      where: { id },
      include: {}
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<T[]> {
    const { skip, take, where, orderBy } = params;
    
    return this.model.findMany?.({
      skip,
      take,
      where,
      orderBy: orderBy || { created: 'desc' },
      include: { 
        location: true,
        developer: true,
      },
    }) || [];
  }

  async count(where?: any): Promise<number> {
    return this.model.count({
      where,
    });
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async transaction<R>(callback: (tx: any) => Promise<R>): Promise<R> {
    return this.prisma.$transaction(callback);
  }
}

// Mock UserRepository
export class UserRepository extends MockBaseRepository<any> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
    this.model = this.prisma.user || {};
  }

  async findByEmail(email: string): Promise<any | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.model.findUnique({
      where: { id: userId },
      include: {
        permissions: true,
      },
    });

    return user?.permissions?.map((p: any) => p.name) || [];
  }

  invalidatePermissionsCache(userId: string): void {
    // Mock implementation
  }
}

// Mock DevelopmentRepository
export class DevelopmentRepository extends MockBaseRepository<any> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
    this.model = this.prisma.development || {};
  }

  async findByDeveloperId(developerId: string): Promise<any[]> {
    return this.model.findMany({
      where: { developerId },
    });
  }

  async findByFilters(filters: any, page: number = 1, pageSize: number = 20): Promise<any> {
    // This will be mocked in tests
    return this.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: { status: filters.status }
    });
  }

  async getTimelines(developmentId: string): Promise<any[]> {
    const development = await this.model.findUnique({
      where: { id: developmentId },
      include: {
        timeline: {
          include: {
            items: true,
          },
        },
      },
    });

    return development?.timeline?.items || [];
  }
}

// Mock UnitRepository
export class UnitRepository extends MockBaseRepository<any> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
    this.model = this.prisma.unit || {};
  }

  async findByDevelopment(developmentId: string, filters?: any): Promise<any[]> {
    const where: any = { developmentId };

    // Apply any additional filters
    if (filters) {
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.type) {
        where.type = filters.type;
      }
      if (filters.bedrooms) {
        where.bedrooms = parseInt(filters.bedrooms);
      }
    }

    return this.model.findMany({
      where,
    });
  }

  async getRooms(unitId: string): Promise<any[]> {
    const unit = await this.model.findUnique({
      where: { id: unitId },
      include: {
        rooms: true,
      },
    });

    return unit?.rooms || [];
  }

  async getCustomizationOptions(unitId: string, categoryFilter?: string): Promise<any[]> {
    // This would be mocked in tests
    return [];
  }
}

// Mock DocumentRepository
export class DocumentRepository extends MockBaseRepository<any> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
    this.model = this.prisma.document || {};
  }

  async findByUnitId(unitId: string): Promise<any[]> {
    return this.model.findMany({
      where: { unitId },
    });
  }

  async findByDevelopmentId(developmentId: string): Promise<any[]> {
    return this.model.findMany({
      where: { developmentId },
    });
  }

  async findWithDetails(id: string): Promise<any | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        previousVersions: true,
        workflow: true,
        signatures: true,
      },
    });
  }
}

// Mock FinancialRepository
export class FinancialRepository extends MockBaseRepository<any> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
    this.model = this.prisma.development || {};
  }

  async findByDevelopmentId(developmentId: string): Promise<any | null> {
    const development = await this.prisma.development.findUnique({
      where: { id: developmentId },
      include: {
        finances: true
      }
    });
    
    return development?.finances || null;
  }

  async calculateFinancialSummary(financeId: string): Promise<any> {
    // Mock implementation
    return {
      totalRevenue: 1000000,
      totalCost: 800000,
      profitMargin: 20
    };
  }
}