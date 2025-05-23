import { PrismaClient } from '@prisma/client';
import { prisma } from '../index';

/**
 * Base repository class that provides common CRUD operations
 * for all entities.
 */
export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected prisma: PrismaClient;
  protected abstract model: any;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
  }

  /**
   * Find a record by its unique ID
   */
  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id });
  }

  /**
   * Find all records with optional filtering and pagination
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<T[]> {
    const { skip, take, where, orderBy } = params;

    return this.model.findMany({
      skip,
      take,
      where,
      orderBy});
  }

  /**
   * Count records with optional filtering
   */
  async count(where?: any): Promise<number> {
    return this.model.count({
      where});
  }

  /**
   * Create a new record
   */
  async create(data: CreateInput): Promise<T> {
    return this.model.create({
      data});
  }

  /**
   * Update an existing record
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data});
  }

  /**
   * Delete a record
   */
  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id });
  }

  /**
   * Execute operations in a transaction
   */
  async transaction<R>(callback: (tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<R>): Promise<R> {
    return this.prisma.$transaction(callback);
  }
}