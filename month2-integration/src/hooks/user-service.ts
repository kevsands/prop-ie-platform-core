/**
 * User Service
 * Business logic and data access for user management
 */

import { userDb } from '@/lib/db';
import { mapPrismaUserToUser } from '@/lib/db/mappers';
import { User, UserRole } from '@/types/core/user';
import { AuthResponse } from '@/types/api';

export class UserService {
  /**
   * Get a user by ID
   * @param id User ID
   * @returns The user or null if not found
   */
  async getUserById(id: string): Promise<User | null> {
    const prismaUser = await userDb.getById(id);
    if (!prismaUser) return null;
    return mapPrismaUserToUser(prismaUser);
  }
  
  /**
   * Get a user by email
   * @param email User email
   * @returns The user or null if not found
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const prismaUser = await userDb.getByEmail(email);
    if (!prismaUser) return null;
    return mapPrismaUserToUser(prismaUser);
  }
  
  /**
   * Create a new user
   * @param data User creation data
   * @returns The created user
   */
  async createUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone?: string;
    roles: UserRole[];
  }): Promise<User> {
    // Convert UserRole enum values to string values for storage
    const roleStrings = data.roles.map(role => role.toString());
    
    const prismaUser = await userDb.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password, // Note: password should be hashed before this point
      phone: data.phone,
      roles: roleStrings
    });
    
    return mapPrismaUserToUser(prismaUser);
  }
  
  /**
   * Update a user's profile
   * @param id User ID
   * @param data Update data
   * @returns The updated user
   */
  async updateUserProfile(id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }): Promise<User> {
    const prismaUser = await userDb.update(id, data);
    return mapPrismaUserToUser(prismaUser);
  }
  
  /**
   * Update a user's status
   * @param id User ID
   * @param status New status
   * @returns The updated user
   */
  async updateUserStatus(id: string, status: string): Promise<User> {
    const prismaUser = await userDb.update(id, { status });
    return mapPrismaUserToUser(prismaUser);
  }
  
  /**
   * List users with filtering
   * @param options Filter options
   * @returns List of users with pagination info
   */
  async listUsers(options?: {
    status?: string;
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    users: User[];
    totalCount: number;
    page: number;
    totalPages: number;
    limit: number;
  }> {
    const { page = 1, limit = 50, ...filterOptions } = options || {};
    const offset = (page - 1) * limit;
    
    const result = await userDb.list({
      ...filterOptions,
      limit,
      offset
    });
    
    return {
      users: result.users.map(mapPrismaUserToUser),
      totalCount: result.totalCount,
      page,
      totalPages: Math.ceil(result.totalCount / limit),
      limit
    };
  }
  
  /**
   * Authenticate a user with email and password
   * @param email User email
   * @param password User password
   * @returns Authentication result
   */
  async authenticate(email: string, password: string): Promise<AuthResponse> {
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    
    // In a real implementation, we would verify the password hash here
    // This is just a placeholder for demonstration purposes
    const passwordValid = true; // Replace with actual password verification
    
    if (!passwordValid) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    
    return {
      success: true,
      user,
      token: 'placeholder-jwt-token' // In a real implementation, generate a JWT
    };
  }
}

export default new UserService();