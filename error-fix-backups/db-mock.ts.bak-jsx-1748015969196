/**
 * Mock Database Implementation
 * Provides in-memory data storage when database is not available
 */

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: Date;
}

interface Development {
  id: string;
  name: string;
  description: string;
  location: string;
  status: string;
  totalUnits: number;
  availableUnits: number;
  createdAt: Date;
}

interface Property {
  id: string;
  name: string;
  type: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  status: string;
  images: string[];
  createdAt: Date;
}

// Mock data store
class MockDatabase {
  private users: Map<string, User> = new Map();
  private developments: Map<string, Development> = new Map();
  private properties: Map<string, Property> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add mock users
    this.users.set('1', {
      id: '1',
      email: 'admin@prop.ie',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
    });

    // Add mock developments
    this.developments.set('fitzgerald-gardens', {
      id: 'fitzgerald-gardens',
      name: 'FitzGerald Gardens',
      description: 'Modern development in the heart of Dublin',
      location: 'Dublin City Centre',
      status: 'available',
      totalUnits: 24,
      availableUnits: 8,
      createdAt: new Date(),
    });

    this.developments.set('ballymakenny-view', {
      id: 'ballymakenny-view',
      name: 'Ballymakenny View',
      description: 'Luxury homes with stunning views',
      location: 'Drogheda, Co. Louth',
      status: 'available',
      totalUnits: 36,
      availableUnits: 12,
      createdAt: new Date(),
    });

    // Add mock properties
    for (let i = 1; i <= 10; i++) {
      this.properties.set(`property-${i}`, {
        id: `property-${i}`,
        name: `Property ${i}`,
        type: i % 2 === 0 ? 'House' : 'Apartment',
        price: 300000 + (i * 50000),
        location: i % 2 === 0 ? 'Dublin' : 'Cork',
        bedrooms: 2 + (i % 3),
        bathrooms: 1 + (i % 2),
        size: 1000 + (i * 100),
        status: 'available',
        images: [`/images/properties/property-${i}.jpg`],
        createdAt: new Date(),
      });
    }
  }

  // User operations
  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }

  async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const id = Date.now().toString();
    const user: User = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Development operations
  async getDevelopment(id: string): Promise<Development | null> {
    return this.developments.get(id) || null;
  }

  async getAllDevelopments(): Promise<Development[]> {
    return Array.from(this.developments.values());
  }

  // Property operations
  async getProperty(id: string): Promise<Property | null> {
    return this.properties.get(id) || null;
  }

  async getAllProperties(filters?: {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    if (filters) {
      if (filters.location) {
        properties = properties.filter(p => p.location.includes(filters.location!));
      }
      if (filters.type) {
        properties = properties.filter(p => p.type === filters.type);
      }
      if (filters.minPrice) {
        properties = properties.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        properties = properties.filter(p => p.price <= filters.maxPrice!);
      }
    }

    return properties;
  }
}

// Export singleton instance
const mockDb = new MockDatabase();
export default mockDb;