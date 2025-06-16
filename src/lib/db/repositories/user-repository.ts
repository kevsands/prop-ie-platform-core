import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import { Prisma } from '.prisma/client';
import { BaseRepository } from './base-repository';
import { prisma } from '../index';

type UserCreateInput = Prisma.UserCreateInput;
type UserUpdateInput = Prisma.UserUpdateInput;

/**
 * Repository for managing User entities
 */
export class UserRepository extends BaseRepository<User, UserCreateInput, UserUpdateInput> {
  protected model: any;

  constructor(prismaClient: PrismaClient = prisma) {
    super(prismaClient);
    this.model = this.prisma.user;
  }

  /**
   * Find a user by their email address
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email });
  }

  /**
   * Find a user with their permissions
   */
  async findWithPermissions(id: string): Promise<User | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        permissions: true});
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<User[]> {
    return this.model.findMany({
      where: {
        roles: {
          has: role});
  }

  /**
   * Add a permission to a user
   */
  async addPermission(userId: string, resource: string, action: string, conditions?: any): Promise<any> {
    return this.prisma.userPermission.create({
      data: {
        user: {
          connect: { id: userId },
        resource,
        action,
        conditions});
  }

  /**
   * Remove a permission from a user
   */
  async removePermission(permissionId: string): Promise<any> {
    return this.prisma.userPermission.delete({
      where: { id: permissionId });
  }

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(id: string): Promise<User> {
    return this.model.update({
      where: { id },
      data: {
        lastLogin: new Date()});
  }

  /**
   * Update user's KYC status
   */
  async updateKycStatus(id: string, status: string): Promise<User> {
    return this.model.update({
      where: { id },
      data: {
        kycStatus: status});
  }
}