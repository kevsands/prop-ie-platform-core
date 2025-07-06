/**
 * User Service for Prop.ie platform
 * Handles user management operations
 */

import { eq, and, like } from "drizzle-orm";
import { initializeDb, users } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

/**
 * User type definition (matches schema)
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * User creation input type
 */
export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: string;
};

/**
 * User update input type
 */
export type UpdateUserInput = Partial<Omit<User, "id" | "createdAt" | "updatedAt">> & {
  password?: string;
};

/**
 * User service with database operations
 */
export const userService = {
  /**
   * Get all users with optional filtering
   */
  getUsers: async (filters?: { role?: string; search?: string }): Promise<User[]> => {
    try {
      const db = initializeDb();
      let query = db.select().from(users);

      // Apply filters if provided
      if (filters) {
        const conditions = [];
        if (filters.role) {
          conditions.push(eq(users.role, filters.role));
        }

        if (filters.search) {
          conditions.push(like(users.name, `%${filters.search}%`));
        }

        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
      }

      const result = await query;

      // Remove password from results
      return result.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  },

  /**
   * Get a single user by ID
   */
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const db = initializeDb();
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

      if (result.length === 0) {
        return null;
      }

      // Remove password from result
      const { password, ...userWithoutPassword } = result[0];
      return userWithoutPassword as User;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Failed to fetch user");
    }
  },

  /**
   * Get a single user by email
   */
  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const db = initializeDb();
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (result.length === 0) {
        return null;
      }

      // Remove password from result
      const { password, ...userWithoutPassword } = result[0];
      return userWithoutPassword as User;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Failed to fetch user");
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData: CreateUserInput): Promise<User> => {
    try {
      const db = initializeDb();

      // Check if email already exists
      const existingUser = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
      if (existingUser.length > 0) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Generate ID
      const userId = uuidv4();

      // Create user
      const now = new Date();
      const newUser = {
        id: userId,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(users).values(newUser);

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, userData: UpdateUserInput): Promise<User | null> => {
    try {
      const db = initializeDb();

      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (existingUser.length === 0) {
        return null;
      }

      // Prepare update data
      const updateData: any = {
        ...userData,
        updatedAt: new Date(),
      };

      // Hash password if provided
      if (userData.password) {
        updateData.password = await bcrypt.hash(userData.password, 10);
      }

      // Update user
      await db.update(users).set(updateData).where(eq(users.id, id));

      // Get updated user
      const updatedUser = await db.select().from(users).where(eq(users.id, id)).limit(1);

      // Remove password from result
      const { password, ...userWithoutPassword } = updatedUser[0];
      return userWithoutPassword as User;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const db = initializeDb();

      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (existingUser.length === 0) {
        return false;
      }

      // Delete user
      await db.delete(users).where(eq(users.id, id));

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  },

  /**
   * Verify if credentials are valid
   */
  verifyCredentials: async (email: string, password: string): Promise<User | null> => {
    try {
      const db = initializeDb();
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (result.length === 0) {
        return null;
      }

      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return null;
      }

      // Remove password from result
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error("Error verifying credentials:", error);
      throw new Error("Failed to verify credentials");
    }
  }
};

export default userService;