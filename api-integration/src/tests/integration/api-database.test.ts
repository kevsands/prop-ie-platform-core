import { prismaMock } from '../mocks/prisma';
import { UserRepository } from '../../lib/db/repositories/user-repository';
import { createTestContext } from '../utils/testContext';
import userResolvers from '../../lib/graphql/resolvers/user';
import { UserRole } from '../../types/core/user';

// Import resolvers index
import resolvers from '../../lib/graphql/resolvers';

describe('API and Database Integration', () => {
  const userRepository = new UserRepository(prismaMock);
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('User query returns user from database', async () => {
    // Mock the database response
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: null,
      password: null,
      roles: [UserRole.BUYER],
      status: 'ACTIVE',
      kycStatus: 'NOT_STARTED',
      organization: null,
      position: null,
      avatar: null,
      preferences: null,
      created: new Date(),
      lastActive: new Date(),
      lastLogin: null,
      metadata: null,
    };
    
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    
    // Create test context
    const context = createTestContext();
    context.auth.userRoles = [UserRole.ADMIN]; // Ensure admin role for permission
    
    // Execute resolver
    const result = await userResolvers.Query.user(null, { id: '1' }, context);
    
    // Verify result
    expect(result).toEqual({
      ...mockUser,
      fullName: 'Test User',
      roles: [UserRole.BUYER],
    });
    
    // Verify that the database was called correctly
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
  
  test('Development query returns development from database', async () => {
    // Mock the database response
    const mockDevelopment = {
      id: '1',
      name: 'Test Development',
      slug: 'test-development',
      developerId: '1',
      locationId: '1',
      status: 'PLANNING',
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
      // Include necessary related fields for mock
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
      },
    };
    
    prismaMock.development.findUnique.mockResolvedValue(mockDevelopment);
    
    // Create test context
    const context = createTestContext();
    
    // Execute resolver through the main resolvers
    const result = await resolvers.Query.development(null, { id: '1' }, context);
    
    // Verify the resolver was called and returned the expected result
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.name).toBe('Test Development');
    
    // Verify that the database was called correctly
    expect(prismaMock.development.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: expect.any(Object), // The include object will contain relations
    });
  });
  
  test('Create user mutation adds user to database', async () => {
    // Mock the database response for checking existing user
    prismaMock.user.findUnique.mockResolvedValue(null);
    
    // Mock the created user
    const createdUser = {
      id: '1',
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      phone: '+1234567890',
      password: 'hashedPassword',
      roles: ['BUYER'],
      status: 'ACTIVE',
      kycStatus: 'NOT_STARTED',
      organization: 'Test Org',
      position: 'Test Position',
      avatar: null,
      preferences: null,
      created: new Date(),
      lastActive: new Date(),
      lastLogin: null,
      metadata: null,
    };
    
    // Mock the create user function
    prismaMock.user.create.mockResolvedValue(createdUser);
    
    // Create test context with admin role
    const context = createTestContext();
    context.auth.userRoles = [UserRole.ADMIN];
    
    // Input for creating a user with proper UserRole enum values
    const input = {
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      phone: '+1234567890',
      roles: [UserRole.BUYER],
      organization: 'Test Org',
      position: 'Test Position',
    };
    
    // Execute resolver
    const result = await userResolvers.Mutation.createUser(null, { input }, context);
    
    // Verify result
    expect(result).toEqual({
      ...createdUser,
      fullName: 'New User',
      roles: ['BUYER'],
    });
    
    // Verify the create function was called with correct data
    expect(prismaMock.user.create).toHaveBeenCalled();
  });
  
  test('Repository findById returns user from database', async () => {
    // Mock the database response
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: null,
      password: null,
      roles: [UserRole.BUYER],
      status: 'ACTIVE',
      kycStatus: 'NOT_STARTED',
      organization: null,
      position: null,
      avatar: null,
      preferences: null,
      created: new Date(),
      lastActive: new Date(),
      lastLogin: null,
      metadata: null,
    };
    
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    
    // Use the repository directly
    const result = await userRepository.findById('1');
    
    // Verify result
    expect(result).toEqual(mockUser);
    
    // Verify the database was called correctly
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
  
  test('Repository findByEmail returns user from database', async () => {
    // Mock the database response
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: null,
      password: null,
      roles: [UserRole.BUYER],
      status: 'ACTIVE',
      kycStatus: 'NOT_STARTED',
      organization: null,
      position: null,
      avatar: null,
      preferences: null,
      created: new Date(),
      lastActive: new Date(),
      lastLogin: null,
      metadata: null,
    };
    
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    
    // Use the repository directly
    const result = await userRepository.findByEmail('test@example.com');
    
    // Verify result
    expect(result).toEqual(mockUser);
    
    // Verify the database was called correctly
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });
  
  test('Repository create adds user to database', async () => {
    // Mock the created user
    const createdUser = {
      id: '1',
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      phone: '+1234567890',
      password: 'hashedPassword',
      roles: ['USER'],
      status: 'ACTIVE',
      kycStatus: 'NOT_STARTED',
      organization: 'Test Org',
      position: 'Test Position',
      avatar: null,
      preferences: null,
      created: new Date(),
      lastActive: new Date(),
      lastLogin: null,
      metadata: null,
    };
    
    // Mock the create user function
    prismaMock.user.create.mockResolvedValue(createdUser);
    
    // Input for creating a user
    const input = {
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      phone: '+1234567890',
      roles: ['USER'],
      organization: 'Test Org',
      position: 'Test Position',
    };
    
    // Use the repository directly
    const result = await userRepository.create(input);
    
    // Verify result
    expect(result).toEqual(createdUser);
    
    // Verify the create function was called with correct data
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
      }),
    });
  });
  
  test('Repository update modifies user in database', async () => {
    // Mock the updated user
    const updatedUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Updated',
      lastName: 'User',
      phone: null,
      password: null,
      roles: ['USER'],
      status: 'ACTIVE',
      kycStatus: 'NOT_STARTED',
      organization: null,
      position: null,
      avatar: null,
      preferences: null,
      created: new Date(),
      lastActive: new Date(),
      lastLogin: null,
      metadata: null,
    };
    
    // Mock the update user function
    prismaMock.user.update.mockResolvedValue(updatedUser);
    
    // Input for updating a user
    const updateData = {
      firstName: 'Updated',
    };
    
    // Use the repository directly
    const result = await userRepository.update('1', updateData);
    
    // Verify result
    expect(result).toEqual(updatedUser);
    
    // Verify the update function was called with correct data
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: updateData,
    });
  });
});