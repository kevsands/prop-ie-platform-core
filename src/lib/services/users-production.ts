/**
 * Production User Service with PostgreSQL Integration
 * 
 * This service provides real user management operations using PostgreSQL
 * via Prisma for all user operations.
 * 
 * Features:
 * - PostgreSQL database integration via Prisma
 * - Role-based access control
 * - KYC status management
 * - User preferences and metadata
 * - Real database operations (no mock data)
 */

import { PrismaClient } from '@prisma/client';
import { User, UserRole, UserStatus, KYCStatus } from '@/types/core/user';

const prisma = new PrismaClient();

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  organization?: string;
  position?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  position?: string;
  status?: UserStatus;
  kycStatus?: KYCStatus;
}

export interface UserFilters {
  role?: string;
  search?: string;
  status?: UserStatus;
  kycStatus?: KYCStatus;
}

/**
 * Production User Service
 */
export class UserService {
  /**
   * Get all users with optional filtering
   */
  async getUsers(filters: UserFilters = {}) {
    try {
      const where: any = {};

      // Apply role filter
      if (filters.role) {
        where.role = filters.role as UserRole;
      }

      // Apply status filter
      if (filters.status) {
        where.status = filters.status;
      }

      // Apply KYC status filter
      if (filters.kycStatus) {
        where.kycStatus = filters.kycStatus;
      }

      // Apply search filter (search in name and email)
      if (filters.search) {
        where.OR = [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          kycStatus: true,
          organization: true,
          position: true,
          avatar: true,
          createdAt: true,
          lastActiveAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          buyerProfile: true,
          emergencyContacts: true,
          kycDocuments: true,
        }
      });

      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          buyerProfile: true,
          emergencyContacts: true,
        }
      });

      return user;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData) {
    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: userData.role,
          organization: userData.organization,
          position: userData.position,
          status: UserStatus.PENDING,
          kycStatus: KYCStatus.NOT_STARTED,
          createdAt: new Date(),
          lastActiveAt: new Date(),
        }
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Update user by ID
   */
  async updateUser(id: string, updateData: UpdateUserData) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...updateData,
          lastActiveAt: new Date(),
        }
      });

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string) {
    try {
      await prisma.user.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    try {
      const totalUsers = await prisma.user.count();
      
      const usersByRole = await prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      });

      const usersByStatus = await prisma.user.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      });

      const usersByKycStatus = await prisma.user.groupBy({
        by: ['kycStatus'],
        _count: {
          kycStatus: true
        }
      });

      return {
        total: totalUsers,
        byRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count.role;
          return acc;
        }, {} as Record<string, number>),
        byStatus: usersByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {} as Record<string, number>),
        byKycStatus: usersByKycStatus.reduce((acc, item) => {
          acc[item.kycStatus] = item._count.kycStatus;
          return acc;
        }, {} as Record<string, number>),
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }

  /**
   * Update user's last active timestamp
   */
  async updateLastActive(id: string) {
    try {
      await prisma.user.update({
        where: { id },
        data: {
          lastActiveAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating last active:', error);
      // Don't throw error for this operation as it's not critical
    }
  }

  /**
   * Search users by various criteria
   */
  async searchUsers(query: string, limit: number = 10) {
    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { organization: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          organization: true,
          avatar: true
        },
        take: limit,
        orderBy: {
          lastName: 'asc'
        }
      });

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Failed to search users');
    }
  }
}

// Export singleton instance
export const userService = new UserService();