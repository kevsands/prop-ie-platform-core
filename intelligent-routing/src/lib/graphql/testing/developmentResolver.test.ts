/**
 * Development Resolver Tests
 * 
 * This file contains tests for the development-related GraphQL resolvers.
 */

import { createTestServer, createAuthContext, createDeveloperContext, createAdminContext } from './testServer';
import { ApolloServer } from '@apollo/server';
import { GraphQLContext } from '../server';

describe('Development Resolvers', () => {
  let testServer: ApolloServer<GraphQLContext>;

  // Sample development data
  const sampleDevelopment = {
    id: 'dev-123',
    name: 'Sample Development',
    slug: 'sample-development',
    developerId: 'developer-id',
    developer: {
      id: 'developer-id',
      firstName: 'Developer',
      lastName: 'User',
      email: 'developer@example.com',
      roles: ['DEVELOPER'],
    },
    location: {
      id: 'loc-123',
      address: '123 Main St',
      city: 'Dublin',
      county: 'Dublin',
      country: 'Ireland',
    },
    status: 'CONSTRUCTION',
    totalUnits: 50,
    units: [
      {
        id: 'unit-1',
        name: 'Apartment 1',
        status: 'AVAILABLE',
        basePrice: 350000,
      },
      {
        id: 'unit-2',
        name: 'Apartment 2',
        status: 'SOLD',
        basePrice: 375000,
      },
    ],
    mainImage: 'https://example.com/image.jpg',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    description: 'A beautiful development in Dublin',
    shortDescription: 'Dublin development',
    features: ['Feature 1', 'Feature 2'],
    amenities: ['Amenity 1', 'Amenity 2'],
    professionalTeam: [],
    documents: [],
    marketingStatus: {},
    salesStatus: {},
    constructionStatus: {},
    complianceStatus: {},
    created: new Date(),
    updated: new Date(),
    isPublished: true,
    tags: ['luxury', 'dublin'],
    availableUnits: 1,
  };

  // Mock the development db functions
  jest.mock('@/lib/db', () => ({
    developmentDb: {
      getById: jest.fn((id) => {
        if (id === 'dev-123') {
          return sampleDevelopment;
        }
        return null;
      }),
      getBySlug: jest.fn((slug) => {
        if (slug === 'sample-development') {
          return sampleDevelopment;
        }
        return null;
      }),
      list: jest.fn((options) => {
        const developerId = options?.developerId;
        const developments = developerId === 'developer-id' 
          ? [sampleDevelopment]
          : [sampleDevelopment, { ...sampleDevelopment, id: 'dev-456', name: 'Another Development' }];
        
        return {
          developments,
          totalCount: developments.length,
        };
      }),
      create: jest.fn((data) => ({
        id: 'new-dev-id',
        ...data,
        location: {
          id: 'new-loc-id',
          ...data.location,
        },
        created: new Date(),
        updated: new Date(),
        units: [],
        professionalTeam: [],
        documents: [],
        marketingStatus: {},
        salesStatus: {},
        constructionStatus: {},
        complianceStatus: {},
        isPublished: false,
        tags: [],
      })),
      getDevelopmentStatistics: jest.fn(() => ({
        totalUnits: 50,
        availableUnits: 25,
        reservedUnits: 10,
        soldUnits: 15,
        salesProgress: 50,
        constructionProgress: 75,
      })),
    },
    userDb: {
      getById: jest.fn((id) => {
        if (id === 'developer-id') {
          return {
            id: 'developer-id',
            firstName: 'Developer',
            lastName: 'User',
            email: 'developer@example.com',
            roles: ['DEVELOPER'],
          };
        }
        return null;
      }),
    },
  }));

  beforeEach(async () => {
    // Create a new test server for each test
    testServer = await createTestServer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.development', () => {
    const DEVELOPMENT_QUERY = `
      query GetDevelopment($id: ID!) {
        development(id: $id) {
          id
          name
          slug
          status
          developer {
            id
            fullName
            email
          }
          totalUnits
          availableUnits
          location {
            city
            county
          }
          description
          features
          amenities
        }
      }
    `;

    it('should return a development by ID', async () => {
      // Execute query
      const response = await testServer.executeOperation({
        query: DEVELOPMENT_QUERY,
        variables: { id: 'dev-123' },
      });
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.development).toMatchObject({
        id: 'dev-123',
        name: 'Sample Development',
        slug: 'sample-development',
        status: 'CONSTRUCTION',
        developer: {
          id: 'developer-id',
          fullName: 'Developer User',
          email: 'developer@example.com',
        },
        totalUnits: 50,
        availableUnits: 1,
        location: {
          city: 'Dublin',
          county: 'Dublin',
        },
        description: 'A beautiful development in Dublin',
        features: ['Feature 1', 'Feature 2'],
        amenities: ['Amenity 1', 'Amenity 2'],
      });
    });

    it('should return null if development does not exist', async () => {
      // Execute query
      const response = await testServer.executeOperation({
        query: DEVELOPMENT_QUERY,
        variables: { id: 'non-existent-id' },
      });
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeDefined();
      expect(response.body.singleResult.errors?.[0].extensions?.code).toBe('NOT_FOUND');
    });
  });

  describe('Query.myDevelopments', () => {
    const MY_DEVELOPMENTS_QUERY = `
      query {
        myDevelopments {
          developments {
            id
            name
            status
            totalUnits
            availableUnits
          }
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `;

    it('should return developments for the current developer', async () => {
      // Create developer context
      const contextValue = createDeveloperContext();
      
      // Execute query
      const response = await testServer.executeOperation(
        { query: MY_DEVELOPMENTS_QUERY },
        { contextValue }
      );
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.myDevelopments).toMatchObject({
        developments: [
          {
            id: 'dev-123',
            name: 'Sample Development',
            status: 'CONSTRUCTION',
            totalUnits: 50,
            availableUnits: 1,
          }
        ],
        totalCount: 1,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });

    it('should return an authentication error for non-developer users', async () => {
      // Create buyer context
      const contextValue = createAuthContext('buyer-id', ['BUYER']);
      
      // Execute query
      const response = await testServer.executeOperation(
        { query: MY_DEVELOPMENTS_QUERY },
        { contextValue }
      );
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeDefined();
      expect(response.body.singleResult.errors?.[0].extensions?.code).toBe('FORBIDDEN');
    });
  });

  describe('Mutation.createDevelopment', () => {
    const CREATE_DEVELOPMENT_MUTATION = `
      mutation CreateDevelopment($input: CreateDevelopmentInput!) {
        createDevelopment(input: $input) {
          id
          name
          description
          totalUnits
          status
          location {
            address
            city
            county
          }
        }
      }
    `;

    it('should create a new development for a developer user', async () => {
      // Create developer context
      const contextValue = createDeveloperContext();
      
      // Input data
      const input = {
        name: 'New Development',
        location: {
          address: '456 Main St',
          city: 'Cork',
          county: 'Cork',
        },
        description: 'A great new development',
        shortDescription: 'Cork development',
        mainImage: 'https://example.com/new-image.jpg',
        features: ['New Feature 1', 'New Feature 2'],
        amenities: ['New Amenity 1', 'New Amenity 2'],
        totalUnits: 30,
        status: 'PLANNING',
      };
      
      // Execute mutation
      const response = await testServer.executeOperation(
        {
          query: CREATE_DEVELOPMENT_MUTATION,
          variables: { input },
        },
        { contextValue }
      );
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.createDevelopment).toMatchObject({
        id: 'new-dev-id',
        name: 'New Development',
        description: 'A great new development',
        totalUnits: 30,
        status: 'PLANNING',
        location: {
          address: '456 Main St',
          city: 'Cork',
          county: 'Cork',
        },
      });
    });

    it('should return an authentication error for non-authenticated users', async () => {
      // Input data
      const input = {
        name: 'New Development',
        location: {
          address: '456 Main St',
          city: 'Cork',
          county: 'Cork',
        },
        description: 'A great new development',
        mainImage: 'https://example.com/new-image.jpg',
        features: ['New Feature 1', 'New Feature 2'],
        amenities: ['New Amenity 1', 'New Amenity 2'],
        totalUnits: 30,
        status: 'PLANNING',
      };
      
      // Execute mutation
      const response = await testServer.executeOperation({
        query: CREATE_DEVELOPMENT_MUTATION,
        variables: { input },
      });
      
      // Check response
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeDefined();
      expect(response.body.singleResult.errors?.[0].extensions?.code).toBe('UNAUTHENTICATED');
    });
  });

  // Add more tests for other development-related resolvers
  // Such as:
  // - Query.developmentBySlug
  // - Query.developments
  // - Query.developmentStatistics
  // - Mutation.updateDevelopment
  // - Mutation.updateDevelopmentLocation
  // - Mutation.addProfessionalTeamMember
  // - Mutation.updateTeamMemberStatus
  // - Mutation.addProjectMilestone
  // - Mutation.updateMilestoneStatus
});