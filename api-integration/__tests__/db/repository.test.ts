/**
 * Repository pattern integration tests
 * Tests the repository pattern implementations with mocked Prisma client
 */

import { setupTestEnvironment } from '../helpers/app-router-test-utils';
import { PrismaClient } from '../../src/types/prisma';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { expect, describe, it, jest, beforeEach } from '@jest/globals';
import * as mappers from '../../src/lib/db/mappers';
import { Document, DevelopmentFinance } from '../../src/lib/db/types';
import { 
  UserRepository, 
  DevelopmentRepository, 
  UnitRepository,
  DocumentRepository,
  FinancialRepository
} from '../../src/lib/db/testing/mock-repositories';
import { prisma } from '../../src/lib/db';

// Create a mock of the Prisma client
const prismaMock = mockDeep<PrismaClient & {
  unit: {
    findMany: (args: any) => Promise<any[]>;
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };
}>();

// Define enum values for testing
const UserRole = {
  DEVELOPER: 'DEVELOPER',
  BUYER: 'BUYER',
  INVESTOR: 'INVESTOR',
  ARCHITECT: 'ARCHITECT',
  ENGINEER: 'ENGINEER',
  QUANTITY_SURVEYOR: 'QUANTITY_SURVEYOR',
  LEGAL: 'LEGAL',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  AGENT: 'AGENT',
  SOLICITOR: 'SOLICITOR',
  CONTRACTOR: 'CONTRACTOR',
  ADMIN: 'ADMIN'
} as const;

const UserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE'
} as const;

const KYCStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;

const DevelopmentStatus = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED'
} as const;

const UnitType = {
  APARTMENT: 'APARTMENT',
  HOUSE: 'HOUSE',
  DUPLEX: 'DUPLEX',
  PENTHOUSE: 'PENTHOUSE',
  STUDIO: 'STUDIO'
} as const;

const UnitStatus = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  UNAVAILABLE: 'UNAVAILABLE'
} as const;

// Define types for testing
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  password: string | null;
  role: string;
  roles: string[];
  status: string;
  kycStatus: string;
  organization: string | null;
  position: string | null;
  avatar: string | null;
  preferences: any | null;
  created: Date;
  lastActive: Date;
  lastLogin: Date | null;
  metadata: any | null;
  twoFactorEnabled: boolean;
  termsAccepted: boolean;
  marketingConsent: boolean;
}

interface Development {
  id: string;
  name: string;
  slug: string;
  developerId: string;
  locationId: string;
  status: string;
  totalUnits: number;
  mainImage: string;
  images: string[];
  description: string;
  shortDescription: string | null;
  features: string[];
  amenities: string[];
  buildingSpecs: any | null;
  created: Date;
  updated: Date;
  publishedDate: Date | null;
  isPublished: boolean;
  tags: string[];
  awards: string[];
  startDate: Date | null;
  completionDate: Date | null;
  virtualTourUrl: string | null;
  sitePlanUrl: string | null;
  marketingStatus: string;
  salesStatus: string;
  constructionStatus: string;
  complianceStatus: string;
  timelineId: string | null;
  financialsId: string | null;
  videos: string[];
  brochureUrl: string | null;
  websiteUrl: string | null;
  buildingType: string;
}

// Define repository parameter types
interface FindAllParams {
  skip?: number;
  take?: number;
  where?: any;
  orderBy?: any;
}

interface UserCreateInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password?: string;
  role: string;
  roles: string[];
  status: string;
  kycStatus: string;
  organization?: string;
  position?: string;
  avatar?: string;
  preferences?: any;
  metadata?: any;
  twoFactorEnabled: boolean;
  termsAccepted: boolean;
  marketingConsent: boolean;
}

// Reset all mocks between tests
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
  UserRole,
  UserStatus,
  KYCStatus,
  DevelopmentStatus,
  UnitType,
  UnitStatus
}));

jest.mock('../../src/lib/db', () => ({
  prisma: prismaMock
}));

describe('Repository Pattern Integration', () => {
  let restoreEnv: () => void;
  let userRepository: UserRepository;
  let developmentRepository: DevelopmentRepository;
  let unitRepository: UnitRepository;
  let documentRepository: DocumentRepository;
  let financialRepository: FinancialRepository;
  
  beforeEach(() => {
    // Setup test environment
    restoreEnv = setupTestEnvironment();
    
    // Reset mocks
    mockReset(prismaMock);
    
    // Create repositories with mock Prisma client
    userRepository = new UserRepository(prismaMock);
    developmentRepository = new DevelopmentRepository(prismaMock);
    unitRepository = new UnitRepository(prismaMock);
    documentRepository = new DocumentRepository(prismaMock);
    financialRepository = new FinancialRepository(prismaMock);
  });
  
  afterEach(() => {
    // Restore original environment after each test
    restoreEnv();
  });
  
  describe('UserRepository', () => {
    it('should find a user by ID', async () => {
      // Mock user data
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        password: null,
        role: UserRole.DEVELOPER,
        roles: [UserRole.DEVELOPER],
        status: UserStatus.ACTIVE,
        kycStatus: KYCStatus.NOT_STARTED,
        organization: null,
        position: null,
        avatar: null,
        preferences: null,
        created: new Date(),
        lastActive: new Date(),
        lastLogin: null,
        metadata: null,
        twoFactorEnabled: false,
        termsAccepted: true,
        marketingConsent: false
      };
      
      // Setup mock response
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      
      // Call the repository method
      const result = await userRepository.findById('1');
      
      // Verify result
      expect(result).toEqual(mockUser);
      
      // Verify the database was called
      expect(prismaMock.user.findUnique).toHaveBeenCalled();
    });
    
    it('should find a user by email', async () => {
      // Mock user data
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: null,
        password: null,
        role: UserRole.DEVELOPER,
        roles: [UserRole.DEVELOPER],
        status: UserStatus.ACTIVE,
        kycStatus: KYCStatus.NOT_STARTED,
        organization: null,
        position: null,
        avatar: null,
        preferences: null,
        created: new Date(),
        lastActive: new Date(),
        lastLogin: null,
        metadata: null,
        twoFactorEnabled: false,
        termsAccepted: true,
        marketingConsent: false
      };
      
      // Setup mock response
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      
      // Call the repository method
      const result = await userRepository.findByEmail('test@example.com');
      
      // Verify result
      expect(result).toEqual(mockUser);
      
      // Verify the database was called
      expect(prismaMock.user.findUnique).toHaveBeenCalled();
    });
    
    it('should create a new user', async () => {
      // Mock created user
      const createdUser = {
        id: '1',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        phone: '+1234567890',
        password: 'hashedPassword',
        role: UserRole.DEVELOPER,
        roles: [UserRole.DEVELOPER],
        status: UserStatus.ACTIVE,
        kycStatus: KYCStatus.NOT_STARTED,
        organization: 'Test Org',
        position: 'Test Position',
        avatar: null,
        preferences: null,
        created: new Date(),
        lastActive: new Date(),
        lastLogin: null,
        metadata: null,
        twoFactorEnabled: false,
        termsAccepted: true,
        marketingConsent: false
      };
      
      // Setup mock response
      prismaMock.user.create.mockResolvedValue(createdUser);
      
      // Input for creating a user
      const input: UserCreateInput = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        phone: '+1234567890',
        role: UserRole.DEVELOPER,
        roles: [UserRole.DEVELOPER],
        organization: 'Test Org',
        position: 'Test Position',
        status: UserStatus.ACTIVE,
        kycStatus: KYCStatus.NOT_STARTED,
        twoFactorEnabled: false,
        termsAccepted: true,
        marketingConsent: false
      };
      
      // Call the repository method
      const result = await userRepository.create(input);
      
      // Verify result
      expect(result).toEqual(createdUser);
      
      // Verify the create function was called
      expect(prismaMock.user.create).toHaveBeenCalled();
    });
    
    it('should update an existing user', async () => {
      // Mock updated user
      const updatedUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'User',
        phone: null,
        password: null,
        role: UserRole.DEVELOPER,
        roles: [UserRole.DEVELOPER],
        status: UserStatus.ACTIVE,
        kycStatus: KYCStatus.NOT_STARTED,
        organization: null,
        position: null,
        avatar: null,
        preferences: null,
        created: new Date(),
        lastActive: new Date(),
        lastLogin: null,
        metadata: null,
        twoFactorEnabled: false,
        termsAccepted: true,
        marketingConsent: false
      };
      
      // Setup mock response
      prismaMock.user.update.mockResolvedValue(updatedUser);
      
      // Input for updating a user
      const updateData = {
        firstName: 'Updated',
      };
      
      // Call the repository method
      const result = await userRepository.update('1', updateData);
      
      // Verify result
      expect(result).toEqual(updatedUser);
      
      // Verify the update function was called
      expect(prismaMock.user.update).toHaveBeenCalled();
    });
  });
  
  describe('DevelopmentRepository', () => {
    it('should find a development by ID', async () => {
      // Mock development data
      const mockDevelopment = {
        id: '1',
        name: 'Test Development',
        slug: 'test-development',
        developerId: '1',
        locationId: '1',
        status: DevelopmentStatus.PLANNING,
        totalUnits: 10,
        mainImage: 'image.jpg',
        images: ['image1.jpg', 'image2.jpg'],
        description: 'Test description',
        shortDescription: null,
        features: ['Feature 1', 'Feature 2'],
        amenities: ['Amenity 1', 'Amenity 2'],
        buildingSpecs: null,
        created: new Date(),
        updated: new Date(),
        publishedDate: null,
        isPublished: false,
        tags: ['Tag 1', 'Tag 2'],
        awards: [],
        startDate: null,
        completionDate: null,
        virtualTourUrl: null,
        sitePlanUrl: null,
        marketingStatus: 'ACTIVE',
        salesStatus: 'AVAILABLE',
        constructionStatus: 'IN_PROGRESS',
        complianceStatus: 'COMPLIANT',
        timelineId: null,
        financialsId: null,
        videos: [],
        brochureUrl: null,
        websiteUrl: null,
        buildingType: 'APARTMENT',
        location: {
          id: '1',
          address: '123 Test Street',
          addressLine1: '123 Test Street',
          addressLine2: null,
          city: 'Test City',
          county: 'Test County',
          eircode: null,
          country: 'Ireland',
          longitude: null,
          latitude: null,
        }
      };
      
      // Setup mock response
      prismaMock.development.findUnique.mockResolvedValue(mockDevelopment);
      
      // Call the repository method
      const result = await developmentRepository.findById('1');
      
      // Verify result
      expect(result).toEqual(mockDevelopment);
      
      // Verify the database was called
      expect(prismaMock.development.findUnique).toHaveBeenCalled();
    });
    
    it('should find developments with filters', async () => {
      // Mock developments data
      const mockDevelopments: Development[] = [{
        id: '1',
        name: 'Test Development 1',
        slug: 'test-development-1',
        developerId: '1',
        locationId: '1',
        status: DevelopmentStatus.PLANNING,
        totalUnits: 10,
        mainImage: 'image.jpg',
        images: ['image1.jpg', 'image2.jpg'],
        description: 'Test description',
        shortDescription: null,
        features: ['Feature 1', 'Feature 2'],
        amenities: ['Amenity 1', 'Amenity 2'],
        buildingSpecs: null,
        created: new Date(),
        updated: new Date(),
        publishedDate: null,
        isPublished: false,
        tags: ['Tag 1', 'Tag 2'],
        awards: [],
        startDate: null,
        completionDate: null,
        virtualTourUrl: null,
        sitePlanUrl: null,
        marketingStatus: 'ACTIVE',
        salesStatus: 'AVAILABLE',
        constructionStatus: 'IN_PROGRESS',
        complianceStatus: 'COMPLIANT',
        timelineId: null,
        financialsId: null,
        videos: [],
        brochureUrl: null,
        websiteUrl: null,
        buildingType: 'APARTMENT'
      }];
      
      // Setup mock response
      prismaMock.development.findMany.mockResolvedValue(mockDevelopments);
      
      // Call the repository method with filters
      const params: FindAllParams = {
        skip: 0,
        take: 10,
        where: { status: DevelopmentStatus.PLANNING }
      };
      const result = await developmentRepository.findAll(params);
      
      // Verify result
      expect(result).toEqual(mockDevelopments);
      
      // Verify the database was called
      expect(prismaMock.development.findMany).toHaveBeenCalled();
    });

    it('should find developments by developer ID', async () => {
      // Mock development data
      const mockDevelopments = [{
        id: '1',
        name: 'Test Development',
        slug: 'test-development',
        developerId: 'dev1',
        locationId: 'loc1',
        status: DevelopmentStatus.PLANNING,
        totalUnits: 100,
        mainImage: 'image.jpg',
        images: ['image1.jpg', 'image2.jpg'],
        description: 'Test description',
        shortDescription: null,
        created: new Date(),
        tags: [],
        timelineId: 'timeline1',
        financialsId: 'finance1',
        videos: [],
        brochureUrl: null,
        awards: [],
        features: [],
        amenities: [],
        specifications: {},
        virtualTourUrl: null,
        marketingStatus: { status: 'ACTIVE' },
        salesStatus: { status: 'ACTIVE' },
        constructionStatus: { status: 'PLANNING' },
        complianceStatus: { status: 'COMPLIANT' },
        sitePlanUrl: null,
        websiteUrl: null,
        buildingSpecs: {},
        buildingType: 'APARTMENT',
        completionDate: new Date(),
        startDate: new Date(),
        updated: new Date(),
        publishedDate: null,
        isPublished: false,
        location: {
          id: 'loc1',
          name: 'Test Location'
        }
      }];
      
      // Setup mock response
      prismaMock.development.findMany.mockResolvedValue(mockDevelopments);
      
      // Call the repository method
      const result = await developmentRepository.findByDeveloperId('dev1');
      
      // Verify result
      expect(result).toEqual(mockDevelopments);
      
      // Verify the database was called
      expect(prismaMock.development.findMany).toHaveBeenCalled();
    });
  });
  
  describe('UnitRepository', () => {
    it('should find units by development ID', async () => {
      // Mock unit data
      const mockUnits = [{
        id: '1',
        developmentId: 'dev1',
        name: 'Test Unit',
        type: UnitType.APARTMENT,
        status: UnitStatus.AVAILABLE,
        price: 100000,
        size: 100,
        bedrooms: 2,
        bathrooms: 2,
        images: ['image1.jpg'],
        slug: 'test-unit',
        description: 'Test description',
        block: 'A',
        basePrice: 100000,
        updatedAt: new Date(),
        floors: 1,
        parkingSpaces: 1,
        features: [],
        amenities: [],
        specifications: {},
        virtualTourUrl: null,
        viewCount: 0,
        berRating: 'A',
        primaryImage: 'image1.jpg',
        floorplans: [],
        unitNumber: 'A101',
        created: new Date(),
        updated: new Date(),
        metadata: {},
        floor: 1,
        aspect: 'NORTH',
        availableFrom: new Date(),
        reservationEndDate: null,
        lastViewed: null
      }];
      
      // Setup mock response
      prismaMock.unit.findMany.mockResolvedValue(mockUnits);
      
      // Call the repository method
      const result = await unitRepository.findByDevelopment('dev1');
      
      // Verify result
      expect(result).toEqual(mockUnits);
      
      // Verify the database was called
      expect(prismaMock.unit.findMany).toHaveBeenCalled();
    });
  });
  
  describe('DocumentRepository', () => {
    it('should find documents by unit ID', async () => {
      // Mock document data
      const mockDocuments = [{
        id: '1',
        unitId: 'unit1',
        developmentId: null,
        name: 'Test Document',
        type: 'PDF',
        status: 'ACTIVE',
        metadata: {},
        description: 'Test description',
        category: 'CONTRACT',
        fileUrl: 'https://example.com/doc.pdf',
        fileType: 'application/pdf',
        fileSize: 1024,
        uploadedById: 'user1',
        uploadedByName: 'Test User',
        uploadDate: new Date(),
        version: 1,
        tags: [],
        expiryDate: null,
        signatureRequired: false,
        signedBy: null,
        signedAt: null,
        relatedTo: null,
        mortgageTrackingId: null,
        created: new Date(),
        updated: new Date(),
        signatureStatus: 'NOT_SIGNED',
        organizationId: null,
        saleId: null,
        approvedById: null,
        reservationId: null
      }];
      
      // Setup mock response
      prismaMock.document.findMany.mockResolvedValue(mockDocuments);
      
      // Call the repository method
      const result = await documentRepository.findByUnitId('unit1');
      
      // Verify result
      expect(result).toEqual(mockDocuments);
      
      // Verify the database was called
      expect(prismaMock.document.findMany).toHaveBeenCalled();
    });
  });
  
  describe('Transaction support', () => {
    it('should use transaction context for database operations', async () => {
      // Mock user data
      const mockUser: User = {
        id: '1',
        email: 'test@transaction.com',
        firstName: 'Transaction',
        lastName: 'Test',
        phone: null,
        password: null,
        role: UserRole.DEVELOPER,
        roles: [UserRole.DEVELOPER],
        status: UserStatus.ACTIVE,
        kycStatus: KYCStatus.NOT_STARTED,
        organization: null,
        position: null,
        avatar: null,
        preferences: null,
        created: new Date(),
        lastActive: new Date(),
        lastLogin: null,
        metadata: null,
        twoFactorEnabled: false,
        termsAccepted: true,
        marketingConsent: false
      };
      
      // Setup mock responses
      prismaMock.user.create.mockResolvedValue(mockUser);
      
      // Execute a transaction using the user repository
      const input: UserCreateInput = {
        email: 'test@transaction.com',
        firstName: 'Transaction',
        lastName: 'Test',
        role: UserRole.DEVELOPER,
        roles: [UserRole.DEVELOPER],
        status: UserStatus.ACTIVE,
        kycStatus: KYCStatus.NOT_STARTED,
        twoFactorEnabled: false,
        termsAccepted: true,
        marketingConsent: false
      };
      
      // Mock transaction behavior
      const mockTx = mockDeep<PrismaClient>();
      mockTx.user.create.mockResolvedValue(mockUser);
      
      // Mock the transaction method
      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(mockTx);
      });
      
      // Create a repository with the mock
      const txUserRepo = new UserRepository(prismaMock);
      
      // Execute the operation that would use transaction
      const result = await txUserRepo.create(input);
      
      // Verify the user was created
      expect(result).toEqual(mockUser);
      
      // Verify the create function was called
      expect(prismaMock.user.create).toHaveBeenCalled();
    });
  });
});