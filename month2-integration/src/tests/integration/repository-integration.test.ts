import { prismaMock } from '../mocks/prisma';
import { UserRepository } from '@/lib/db/repositories/user-repository';
import { DevelopmentRepository } from '@/lib/db/repositories/development-repository';
import { UnitRepository } from '@/lib/db/repositories/unit-repository';
import { DocumentRepository } from '@/lib/db/repositories/document-repository';
import { DevelopmentStatus } from '@/types/graphql';
import { UserRole, UserStatus } from '@/types/core/user';
import type { User, Development, Unit, Document } from '.prisma/client';
import type { Prisma } from '@prisma/client';
import { describe, expect, test, beforeEach, jest } from '@jest/globals';

describe('Repository Integration Tests', () => {
  // Test repositories
  let userRepository: UserRepository;
  let developmentRepository: DevelopmentRepository;
  let unitRepository: UnitRepository;
  let documentRepository: DocumentRepository;
  
  beforeEach(() => {
    // Initialize repositories with mock Prisma client
    userRepository = new UserRepository(prismaMock);
    developmentRepository = new DevelopmentRepository(prismaMock);
    unitRepository = new UnitRepository(prismaMock);
    documentRepository = new DocumentRepository(prismaMock);
    
    // Clear all mocks between tests
    jest.clearAllMocks();
  });
  
  describe('UserRepository', () => {
    test('findById should return user when found', async () => {
      // Mock data
      const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '123-456-7890',
        password: null,
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: null,
        position: null,
        avatar: null,
        preferences: null,
        created: new Date(),
        lastActive: new Date(),
        lastLogin: null,
        metadata: null
      };
      
      // Setup mock
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      
      // Execute repository method
      const result = await userRepository.findById('user-1');
      
      // Verify result
      expect(result).toEqual(expect.objectContaining({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }));
      
      // Verify mock was called correctly
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' }
      });
    });
    
    test('findById should return null when user not found', async () => {
      // Setup mock
      prismaMock.user.findUnique.mockResolvedValue(null);
      
      // Execute repository method
      const result = await userRepository.findById('non-existent');
      
      // Verify result
      expect(result).toBeNull();
      
      // Verify mock was called correctly
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent' }
      });
    });
    
    test('findByEmail should return user when found', async () => {
      // Mock data
      const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '123-456-7890',
        password: null,
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: null,
        position: null,
        avatar: null,
        preferences: null,
        created: new Date(),
        lastActive: new Date(),
        lastLogin: null,
        metadata: null
      };
      
      // Setup mock
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      
      // Execute repository method
      const result = await userRepository.findByEmail('test@example.com');
      
      // Verify result
      expect(result).toEqual(expect.objectContaining({
        id: 'user-1',
        email: 'test@example.com'
      }));
      
      // Verify mock was called correctly
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
    });
    
    test('create should create new user', async () => {
      // Mock data for creation
      const newUser: Prisma.UserCreateInput = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        phone: '555-123-4567',
        roles: ['BUYER'],
        status: 'PENDING',
        kycStatus: 'NOT_STARTED'
      };
      
      // Mock created user
      const createdUser: User = {
        id: 'new-user',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        phone: '555-123-4567',
        password: null,
        roles: ['BUYER'],
        status: 'PENDING',
        kycStatus: 'NOT_STARTED',
        organization: null,
        position: null,
        avatar: null,
        preferences: null,
        created: new Date(),
        lastActive: new Date(),
        lastLogin: null,
        metadata: null
      };
      
      // Setup mock
      prismaMock.user.create.mockResolvedValue(createdUser);
      
      // Execute repository method
      const result = await userRepository.create(newUser);
      
      // Verify result
      expect(result).toEqual(expect.objectContaining({
        id: 'new-user',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User'
      }));
      
      // Verify mock was called correctly
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining(newUser)
      });
    });
    
    test('update should update user data', async () => {
      // Mock data for update
      const updateData: Prisma.UserUpdateInput = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '555-987-6543'
      };
      
      // Mock updated user
      const updatedUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'Name',
        phone: '555-987-6543',
        password: null,
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: null,
        position: null,
        avatar: null,
        preferences: null,
        created: new Date(),
        lastActive: new Date(),
        lastLogin: null,
        metadata: null
      };
      
      // Setup mock
      prismaMock.user.update.mockResolvedValue(updatedUser);
      
      // Execute repository method
      const result = await userRepository.update('user-1', updateData);
      
      // Verify result
      expect(result).toEqual(expect.objectContaining({
        id: 'user-1',
        firstName: 'Updated',
        lastName: 'Name',
        phone: '555-987-6543'
      }));
      
      // Verify mock was called correctly
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: updateData
      });
    });
  });
  
  describe('DevelopmentRepository', () => {
    test('findById should return development when found', async () => {
      // Mock data
      const mockDevelopment: Development = {
        id: 'dev-1',
        name: 'Test Development',
        slug: 'test-development',
        status: 'CONSTRUCTION',
        description: 'A test development',
        shortDescription: 'Test dev',
        totalUnits: 10,
        developerId: 'dev-user',
        locationId: 'loc-1',
        isPublished: true,
        mainImage: '/images/test.jpg',
        created: new Date(),
        updated: new Date(),
        marketingStatus: {},
        salesStatus: {},
        constructionStatus: {},
        complianceStatus: {},
        timelineId: null,
        financialsId: null,
        images: [],
        videos: [],
        sitePlanUrl: null,
        brochureUrl: null,
        virtualTourUrl: null,
        websiteUrl: null,
        features: [],
        amenities: [],
        buildingSpecs: null,
        buildingType: null,
        completionDate: null,
        startDate: null,
        publishedDate: null,
        tags: [],
        awards: []
      };
      
      // Setup mock
      prismaMock.development.findUnique.mockResolvedValue(mockDevelopment);
      
      // Mock related location
      prismaMock.location.findUnique.mockResolvedValue({
        id: 'loc-1',
        address: '123 Test St',
        city: 'Dublin',
        county: 'Dublin',
        country: 'Ireland',
        created: new Date(),
        updated: new Date()
      });
      
      // Execute repository method
      const result = await developmentRepository.findById('dev-1');
      
      // Verify result
      expect(result).toEqual(expect.objectContaining({
        id: 'dev-1',
        name: 'Test Development',
        slug: 'test-development',
        status: 'CONSTRUCTION',
        totalUnits: 10
      }));
      
      // Verify mock was called correctly
      expect(prismaMock.development.findUnique).toHaveBeenCalledWith({
        where: { id: 'dev-1' },
        include: expect.any(Object)
      });
    });
    
    test('findByDeveloperId should return developments for a developer', async () => {
      // Mock data
      const mockDevelopments = [
        {
          id: 'dev-1',
          name: 'Development 1',
          status: DevelopmentStatus.CONSTRUCTION,
          totalUnits: 10,
          availableUnits: 5,
          developerId: 'dev-user',
          locationId: 'loc-1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'dev-2',
          name: 'Development 2',
          status: DevelopmentStatus.PLANNING,
          totalUnits: 20,
          availableUnits: 20,
          developerId: 'dev-user',
          locationId: 'loc-2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Setup mock
      prismaMock.development.findMany.mockResolvedValue(mockDevelopments);
      
      // Mock locations for each development
      prismaMock.location.findUnique.mockResolvedValueOnce({
        id: 'loc-1',
        city: 'Dublin',
        county: 'Dublin'
      }).mockResolvedValueOnce({
        id: 'loc-2',
        city: 'Cork',
        county: 'Cork'
      });
      
      // Execute repository method
      const result = await developmentRepository.findByDeveloperId('dev-user');
      
      // Verify result
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        id: 'dev-1',
        name: 'Development 1'
      }));
      expect(result[1]).toEqual(expect.objectContaining({
        id: 'dev-2',
        name: 'Development 2'
      }));
      
      // Verify mock was called correctly
      expect(prismaMock.development.findMany).toHaveBeenCalledWith({
        where: { developerId: 'dev-user' },
        include: expect.any(Object)
      });
    });
    
    test('create should create new development', async () => {
      // Mock data for creation
      const newDevelopmentData = {
        name: 'New Development',
        description: 'A brand new development',
        shortDescription: 'New dev',
        status: DevelopmentStatus.PLANNING,
        totalUnits: 50,
        availableUnits: 50,
        developerId: 'dev-user',
        location: {
          address: '456 New St',
          city: 'Dublin',
          county: 'Dublin',
          country: 'Ireland'
        }
      };
      
      // Mock created development
      const createdDevelopment = {
        id: 'new-dev',
        ...newDevelopmentData,
        locationId: 'new-loc',
        isPublished: false,
        mainImage: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Setup mocks
      prismaMock.location.create.mockResolvedValue({
        id: 'new-loc',
        ...newDevelopmentData.location,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      prismaMock.development.create.mockResolvedValue(createdDevelopment);
      
      // Execute repository method
      const result = await developmentRepository.create(newDevelopmentData);
      
      // Verify result
      expect(result).toEqual(expect.objectContaining({
        id: 'new-dev',
        name: 'New Development',
        status: DevelopmentStatus.PLANNING,
        totalUnits: 50,
        availableUnits: 50
      }));
      
      // Verify location was created
      expect(prismaMock.location.create).toHaveBeenCalled();
      
      // Verify development was created with location ID
      expect(prismaMock.development.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'New Development',
          locationId: 'new-loc'
        })
      });
    });
  });
  
  describe('UnitRepository', () => {
    test('findByDevelopmentId should return units for a development', async () => {
      // Mock data
      const mockUnits = [
        {
          id: 'unit-1',
          number: '101',
          type: 'APARTMENT',
          bedrooms: 2,
          bathrooms: 1,
          price: 350000,
          status: 'AVAILABLE',
          developmentId: 'dev-1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'unit-2',
          number: '102',
          type: 'APARTMENT',
          bedrooms: 3,
          bathrooms: 2,
          price: 450000,
          status: 'RESERVED',
          developmentId: 'dev-1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Setup mock
      prismaMock.unit.findMany.mockResolvedValue(mockUnits);
      
      // Execute repository method
      const result = await unitRepository.findByDevelopmentId('dev-1');
      
      // Verify result
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        id: 'unit-1',
        number: '101',
        type: 'APARTMENT',
        bedrooms: 2,
        price: 350000,
        status: 'AVAILABLE'
      }));
      
      // Verify mock was called correctly
      expect(prismaMock.unit.findMany).toHaveBeenCalledWith({
        where: { developmentId: 'dev-1' },
        include: expect.any(Object)
      });
    });
    
    test('findByDevelopmentId should apply filters correctly', async () => {
      // Mock data
      const mockUnits = [
        {
          id: 'unit-1',
          number: '101',
          type: 'APARTMENT',
          bedrooms: 2,
          bathrooms: 1,
          price: 350000,
          status: 'AVAILABLE',
          developmentId: 'dev-1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Setup mock
      prismaMock.unit.findMany.mockResolvedValue(mockUnits);
      
      // Execute repository method with filters
      const filters = { 
        status: 'AVAILABLE',
        bedrooms: 2,
        maxPrice: 400000
      };
      
      const result = await unitRepository.findByDevelopmentId('dev-1', filters);
      
      // Verify result
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({
        id: 'unit-1',
        status: 'AVAILABLE',
        bedrooms: 2,
        price: 350000
      }));
      
      // Verify mock was called correctly with filters
      expect(prismaMock.unit.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          developmentId: 'dev-1',
          status: 'AVAILABLE',
          bedrooms: 2,
          price: { lte: 400000 }
        }),
        include: expect.any(Object)
      });
    });
  });
  
  describe('DocumentRepository', () => {
    test('findByEntity should return documents for an entity', async () => {
      // Mock data
      const mockDocuments = [
        {
          id: 'doc-1',
          name: 'Floor Plan',
          description: 'Floor plan for unit 101',
          category: 'FLOOR_PLAN',
          url: '/documents/floor-plan-101.pdf',
          entityType: 'UNIT',
          entityId: 'unit-1',
          uploadedById: 'user-1',
          status: 'ACTIVE',
          fileType: 'application/pdf',
          size: 1024000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'doc-2',
          name: '3D Render',
          description: '3D render of unit 101',
          category: 'RENDER',
          url: '/documents/render-101.jpg',
          entityType: 'UNIT',
          entityId: 'unit-1',
          uploadedById: 'user-1',
          status: 'ACTIVE',
          fileType: 'image/jpeg',
          size: 2048000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Setup mock
      prismaMock.document.findMany.mockResolvedValue(mockDocuments);
      
      // Mock user data for each document
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      });
      
      // Execute repository method
      const result = await documentRepository.findByEntity('UNIT', 'unit-1');
      
      // Verify result
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        id: 'doc-1',
        name: 'Floor Plan',
        category: 'FLOOR_PLAN',
        url: '/documents/floor-plan-101.pdf'
      }));
      
      // Verify mock was called correctly
      expect(prismaMock.document.findMany).toHaveBeenCalledWith({
        where: {
          entityType: 'UNIT',
          entityId: 'unit-1'
        },
        include: expect.any(Object)
      });
    });
    
    test('findByEntity should apply filters correctly', async () => {
      // Mock data
      const mockDocuments = [
        {
          id: 'doc-1',
          name: 'Floor Plan',
          description: 'Floor plan for unit 101',
          category: 'FLOOR_PLAN',
          url: '/documents/floor-plan-101.pdf',
          entityType: 'UNIT',
          entityId: 'unit-1',
          uploadedById: 'user-1',
          status: 'ACTIVE',
          fileType: 'application/pdf',
          size: 1024000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Setup mock
      prismaMock.document.findMany.mockResolvedValue(mockDocuments);
      
      // Mock user data
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      });
      
      // Execute repository method with filters
      const filters = { 
        category: 'FLOOR_PLAN',
        status: 'ACTIVE'
      };
      
      const result = await documentRepository.findByEntity('UNIT', 'unit-1', filters);
      
      // Verify result
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({
        id: 'doc-1',
        name: 'Floor Plan',
        category: 'FLOOR_PLAN'
      }));
      
      // Verify mock was called correctly with filters
      expect(prismaMock.document.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          entityType: 'UNIT',
          entityId: 'unit-1',
          category: 'FLOOR_PLAN',
          status: 'ACTIVE'
        }),
        include: expect.any(Object)
      });
    });
  });
});