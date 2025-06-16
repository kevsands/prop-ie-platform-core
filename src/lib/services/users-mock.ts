/**
 * Mock User Service for development/testing
 * Provides user management operations without database dependency
 * 
 * ⚠️ SECURITY WARNING: This service is for development/testing only
 * It should NEVER be used in production environments
 */

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// Production safety check - allow staging for deployment testing
const isDevelopment = process.env.NODE_ENV === 'development';
const isStaging = process.env.NEXT_PUBLIC_APP_ENV === 'staging' || process.env.NODE_ENV === 'staging';
const allowMockAuth = process.env.ALLOW_MOCK_AUTH === 'true';

// Only block in true production environment
if (!isDevelopment && !isStaging && !allowMockAuth) {
  throw new Error(
    'SECURITY VIOLATION: Mock authentication service is disabled in production. ' +
    'Use real authentication providers instead.'
  );
}

/**
 * User type definition
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

// Mock in-memory user storage
const mockUsers: Array<User & { password: string }> = [
  {
    id: "buyer-1",
    name: "John Smith",
    email: "john.smith@example.com",
    password: "$2a$10$hashedpassword", // Mock hashed password
    role: "buyer",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "developer-1",
    name: "Sarah Connor",
    email: "sarah.connor@propdev.ie",
    password: "$2a$10$hashedpassword",
    role: "developer",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@prop.ie",
    password: "$2a$10$hashedpassword",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * Mock user service with in-memory operations
 */
export const userService = {
  /**
   * Get all users with optional filtering
   */
  getUsers: async (filters?: { role?: string; search?: string }): Promise<User[]> => {
    try {
      let filtered = [...mockUsers];

      // Apply filters if provided
      if (filters) {
        if (filters.role) {
          filtered = filtered.filter(user => user.role === filters.role);
        }

        if (filters.search) {
          filtered = filtered.filter(user => 
            user.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
            user.email.toLowerCase().includes(filters.search!.toLowerCase())
          );
        }
      }

      // Remove password from results
      return filtered.map(user => {
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
      const user = mockUsers.find(u => u.id === id);
      
      if (!user) {
        return null;
      }

      // Remove password from result
      const { password, ...userWithoutPassword } = user;
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
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        return null;
      }

      // Remove password from result
      const { password, ...userWithoutPassword } = user;
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
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password (in mock, just prefix it)
      const hashedPassword = `$2a$10$${userData.password}_hashed`;

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

      mockUsers.push(newUser);

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
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return null;
      }

      // Prepare update data
      const updateData: any = {
        ...userData,
        updatedAt: new Date(),
      };

      // Hash password if provided
      if (userData.password) {
        updateData.password = `$2a$10$${userData.password}_hashed`;
      }

      // Update user
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updateData };

      // Remove password from result
      const { password, ...userWithoutPassword } = mockUsers[userIndex];
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
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return false;
      }

      mockUsers.splice(userIndex, 1);
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
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        return null;
      }

      // Mock password verification (in real app, use bcrypt.compare)
      const passwordMatch = user.password.includes(password) || password === "password123";

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