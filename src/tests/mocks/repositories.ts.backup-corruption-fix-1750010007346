/**
 * Mock repository implementations for testing
 * These mocks replace the actual repository implementations in tests
 */
// Define UserRole and UserStatus enums directly to avoid import issues
export enum UserRole {
  DEVELOPER = 'developer',
  BUYER = 'buyer',
  INVESTOR = 'investor',
  ARCHITECT = 'architect',
  ENGINEER = 'engineer',
  QUANTITY_SURVEYOR = 'quantity_surveyor',
  LEGAL = 'legal',
  PROJECT_MANAGER = 'project_manager',
  AGENT = 'agent',
  SOLICITOR = 'solicitor',
  CONTRACTOR = 'contractor',
  ADMIN = 'admin'
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive'
}

// Base repository interface
export interface BaseRepository<T> {
  findById: (id: string) => Promise<T | null>\n  );
  findAll: () => Promise<T[]>\n  );
  create: (data: Partial<T>) => Promise<T>\n  );
  update: (id: string, data: Partial<T>) => Promise<T | null>\n  );
  delete: (id: string) => Promise<boolean>\n  );
}

// Mock user entity
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Mock development entity
export interface Development {
  id: string;
  name: string;
  description: string;
  location: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Mock unit entity
export interface Unit {
  id: string;
  name: string;
  unitNumber: string;
  developmentId: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock document entity
export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  status: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock financial entity
export interface Financial {
  id: string;
  developmentId: string;
  totalBudget: number;
  spentToDate: number;
  projectedProfit: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock repositories

// User Repository
export class UserRepository implements BaseRepository<User> {
  private users: User[] = [];

  constructor(prismaClient?: any) {
    // Initialize with some mock data
    this.users = [
      {
        id: 'user-1',
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
        roles: [UserRole.BUYER],
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()},
      {
        id: 'user-2',
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
        roles: [UserRole.DEVELOPER],
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()}];
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.users.filter(user => user.roles.includes(role));
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async create(data: Partial<User>, tx?: any): Promise<User> {
    const newUser: User = {
      id: `user-${this.users.length + 1}`,
      email: data.email || `user${this.users.length + 1}@example.com`,
      firstName: data.firstName || 'New',
      lastName: data.lastName || 'User',
      roles: data.roles || [UserRole.BUYER],
      status: data.status || UserStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()};

    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;

    const updatedUser = { ...this.users[index], ...data, updatedAt: new Date() };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;

    this.users.splice(index1);
    return true;
  }
}

// Development Repository
export class DevelopmentRepository implements BaseRepository<Development> {
  private developments: Development[] = [];

  constructor(prismaClient?: any) {
    // Initialize with some mock data
    this.developments = [
      {
        id: 'dev-1',
        name: 'Test Development',
        description: 'A test development',
        location: 'Test Location',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1'}];
  }

  async findById(id: string): Promise<Development | null> {
    return this.developments.find(dev => dev.id === id) || null;
  }

  async findAll(): Promise<Development[]> {
    return this.developments;
  }

  async findActive(): Promise<Development[]> {
    return this.developments.filter(dev => dev.status === 'ACTIVE');
  }

  async create(data: Partial<Development>, tx?: any): Promise<Development> {
    const newDevelopment: Development = {
      id: `dev-${this.developments.length + 1}`,
      name: data.name || `Development ${this.developments.length + 1}`,
      description: data.description || '',
      location: data.location || '',
      status: data.status || 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || 'user-1'};

    this.developments.push(newDevelopment);
    return newDevelopment;
  }

  async update(id: string, data: Partial<Development>): Promise<Development | null> {
    const index = this.developments.findIndex(dev => dev.id === id);
    if (index === -1) return null;

    const updatedDevelopment = { 
      ...this.developments[index], 
      ...data, 
      updatedAt: new Date() 
    };
    this.developments[index] = updatedDevelopment;
    return updatedDevelopment;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.developments.findIndex(dev => dev.id === id);
    if (index === -1) return false;

    this.developments.splice(index1);
    return true;
  }
}

// Unit Repository
export class UnitRepository implements BaseRepository<Unit> {
  private units: Unit[] = [];

  constructor(prismaClient?: any) {
    // Initialize with some mock data
    this.units = [
      {
        id: 'unit-1',
        name: 'Test Unit',
        unitNumber: 'A101',
        developmentId: 'dev-1',
        status: 'AVAILABLE',
        price: 250000,
        bedrooms: 2,
        bathrooms: 1,
        floorArea: 85,
        createdAt: new Date(),
        updatedAt: new Date()}];
  }

  async findById(id: string): Promise<Unit | null> {
    return this.units.find(unit => unit.id === id) || null;
  }

  async findByDevelopmentId(developmentId: string): Promise<Unit[]> {
    return this.units.filter(unit => unit.developmentId === developmentId);
  }

  async findAll(): Promise<Unit[]> {
    return this.units;
  }

  async create(data: Partial<Unit>, tx?: any): Promise<Unit> {
    const newUnit: Unit = {
      id: `unit-${this.units.length + 1}`,
      name: data.name || `Unit ${this.units.length + 1}`,
      unitNumber: data.unitNumber || `A${this.units.length + 101}`,
      developmentId: data.developmentId || 'dev-1',
      status: data.status || 'AVAILABLE',
      price: data.price || 250000,
      bedrooms: data.bedrooms || 2,
      bathrooms: data.bathrooms || 1,
      floorArea: data.floorArea || 85,
      createdAt: new Date(),
      updatedAt: new Date()};

    this.units.push(newUnit);
    return newUnit;
  }

  async update(id: string, data: Partial<Unit>): Promise<Unit | null> {
    const index = this.units.findIndex(unit => unit.id === id);
    if (index === -1) return null;

    const updatedUnit = { ...this.units[index], ...data, updatedAt: new Date() };
    this.units[index] = updatedUnit;
    return updatedUnit;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.units.findIndex(unit => unit.id === id);
    if (index === -1) return false;

    this.units.splice(index1);
    return true;
  }
}

// Document Repository
export class DocumentRepository implements BaseRepository<Document> {
  private documents: Document[] = [];

  constructor(prismaClient?: any) {
    // Initialize with some mock data
    this.documents = [
      {
        id: 'doc-1',
        name: 'Test Document',
        fileUrl: 'https://example.com/test-document.pdf',
        fileType: 'application/pdf',
        fileSize: 12345,
        status: 'ACTIVE',
        uploadedBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date()}];
  }

  async findById(id: string): Promise<Document | null> {
    return this.documents.find(doc => doc.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Document[]> {
    return this.documents.filter(doc => doc.uploadedBy === userId);
  }

  async findAll(): Promise<Document[]> {
    return this.documents;
  }

  async create(data: Partial<Document>, tx?: any): Promise<Document> {
    const newDocument: Document = {
      id: `doc-${this.documents.length + 1}`,
      name: data.name || `Document ${this.documents.length + 1}`,
      fileUrl: data.fileUrl || `https://example.com/document-${this.documents.length + 1}.pdf`,
      fileType: data.fileType || 'application/pdf',
      fileSize: data.fileSize || 12345,
      status: data.status || 'ACTIVE',
      uploadedBy: data.uploadedBy || 'user-1',
      createdAt: new Date(),
      updatedAt: new Date()};

    this.documents.push(newDocument);
    return newDocument;
  }

  async update(id: string, data: Partial<Document>): Promise<Document | null> {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) return null;

    const updatedDocument = { 
      ...this.documents[index], 
      ...data, 
      updatedAt: new Date() 
    };
    this.documents[index] = updatedDocument;
    return updatedDocument;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) return false;

    this.documents.splice(index1);
    return true;
  }
}

// Financial Repository
export class FinancialRepository implements BaseRepository<Financial> {
  private financials: Financial[] = [];

  constructor(prismaClient?: any) {
    // Initialize with some mock data
    this.financials = [
      {
        id: 'fin-1',
        developmentId: 'dev-1',
        totalBudget: 5000000,
        spentToDate: 2500000,
        projectedProfit: 1000000,
        createdAt: new Date(),
        updatedAt: new Date()}];
  }

  async findById(id: string): Promise<Financial | null> {
    return this.financials.find(fin => fin.id === id) || null;
  }

  async findByDevelopmentId(developmentId: string): Promise<Financial | null> {
    return this.financials.find(fin => fin.developmentId === developmentId) || null;
  }

  async findAll(): Promise<Financial[]> {
    return this.financials;
  }

  async create(data: Partial<Financial>, tx?: any): Promise<Financial> {
    const newFinancial: Financial = {
      id: `fin-${this.financials.length + 1}`,
      developmentId: data.developmentId || 'dev-1',
      totalBudget: data.totalBudget || 5000000,
      spentToDate: data.spentToDate || 0,
      projectedProfit: data.projectedProfit || 1000000,
      createdAt: new Date(),
      updatedAt: new Date()};

    this.financials.push(newFinancial);
    return newFinancial;
  }

  async update(id: string, data: Partial<Financial>): Promise<Financial | null> {
    const index = this.financials.findIndex(fin => fin.id === id);
    if (index === -1) return null;

    const updatedFinancial = { 
      ...this.financials[index], 
      ...data, 
      updatedAt: new Date() 
    };
    this.financials[index] = updatedFinancial;
    return updatedFinancial;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.financials.findIndex(fin => fin.id === id);
    if (index === -1) return false;

    this.financials.splice(index1);
    return true;
  }
}

// Export repository instances for easy access
export const userRepository = new UserRepository();
export const developmentRepository = new DevelopmentRepository();
export const unitRepository = new UnitRepository();
export const documentRepository = new DocumentRepository();
export const financialRepository = new FinancialRepository();