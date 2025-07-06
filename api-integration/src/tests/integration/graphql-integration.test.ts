import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { setupGraphQLOperationMocks, mockGraphQLQuery, mockGraphQLQueryError } from '../utils/graphql-operation-mocker';
import { createTestContext, createUnauthenticatedContext } from '../utils/testContext';
import { GraphQLOperations, mockDocuments, mockUsers } from '../mocks/graphql-operations';
import { UserRole } from '@/types/core/user';

// Define simplified test schema for GraphQL integration testing
const typeDefs = `
  directive @auth(requires: [Role] = []) on FIELD_DEFINITION

  enum Role {
    ADMIN
    DEVELOPER
    BUYER
    AGENT
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    fullName: String!
    roles: [Role!]!
    status: String!
  }

  type Document {
    id: ID!
    name: String!
    fileType: String!
    fileSize: Int!
    downloadUrl: String!
    status: String!
    uploadedAt: String!
    uploadedBy: UploadedBy
    metadata: DocumentMetadata
  }

  type UploadedBy {
    id: ID!
    name: String!
    email: String
  }

  type DocumentMetadata {
    category: String
    tags: [String!]
    description: String
    version: String
  }

  type DocumentsResponse {
    items: [Document!]!
    totalCount: Int!
  }

  type Query {
    me: User @auth
    user(id: ID!): User @auth(requires: [ADMIN])
    documents(projectId: ID, filters: DocumentFilterInput): DocumentsResponse @auth
    document(id: ID!): Document @auth
  }

  input DocumentFilterInput {
    category: String
    status: String
    searchTerm: String
    tags: [String!]
  }

  input CreateDocumentInput {
    name: String!
    fileType: String!
    fileSize: Int!
    category: String
    description: String
    tags: [String!]
  }

  type Mutation {
    createDocument(input: CreateDocumentInput!): Document @auth
    updateUser(id: ID!, firstName: String, lastName: String): User @auth
  }
`;

// Mock resolvers
const resolvers = {
  Query: {
    me: (_, __, context) => {
      if (!context.isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      return mockUsers.find(user => user.id === context.user?.userId) || mockUsers[0];
    },
    
    user: (_, { id }, context) => {
      if (!context.isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      // Check for ADMIN role
      if (!context.userRoles.includes(UserRole.ADMIN)) {
        throw new Error('Forbidden');
      }
      
      return mockUsers.find(user => user.id === id) || mockUsers[0];
    },
    
    documents: (_, { projectId, filters }, context) => {
      if (!context.isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      let filteredDocs = [...mockDocuments];
      
      if (filters?.category) {
        filteredDocs = filteredDocs.filter(
          doc => doc.metadata?.category === filters.category
        );
      }
      
      if (filters?.status) {
        filteredDocs = filteredDocs.filter(
          doc => doc.status === filters.status
        );
      }
      
      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredDocs = filteredDocs.filter(
          doc => doc.name.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters?.tags?.length) {
        filteredDocs = filteredDocs.filter(
          doc => doc.metadata?.tags?.some(tag => 
            filters.tags?.includes(tag)
          )
        );
      }
      
      return {
        items: filteredDocs,
        totalCount: filteredDocs.length,
      };
    },
    
    document: (_, { id }, context) => {
      if (!context.isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      return mockDocuments.find(doc => doc.id === id) || mockDocuments[0];
    },
  },
  
  Mutation: {
    createDocument: (_, { input }, context) => {
      if (!context.isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      const newDocument = {
        id: 'doc-' + Date.now(),
        name: input.name,
        fileType: input.fileType,
        fileSize: input.fileSize,
        downloadUrl: `https://example.com/documents/new-doc-${Date.now()}.${input.fileType.split('/')[1]}`,
        uploadedBy: {
          id: context.user?.userId || 'user-1',
          name: 'Test User',
          email: 'test@example.com',
        },
        metadata: {
          category: input.category || 'other',
          tags: input.tags || [],
          description: input.description || '',
          version: '1.0',
        },
        status: 'active',
        uploadedAt: new Date().toISOString(),
      };
      
      return newDocument;
    },
    
    updateUser: (_, { id, firstName, lastName }, context) => {
      if (!context.isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      // Check if user is updating their own profile or is admin
      if (id !== context.user?.userId && !context.userRoles.includes(UserRole.ADMIN)) {
        throw new Error('You can only update your own profile');
      }
      
      const user = mockUsers.find(user => user.id === id) || mockUsers[0];
      
      return {
        ...user,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        fullName: `${firstName || user.firstName} ${lastName || user.lastName}`,
      };
    },
  },
};

describe('GraphQL Server Integration', () => {
  let server: ApolloServer;
  
  beforeAll(async () => {
    // Create schema and server
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });
    
    server = new ApolloServer({
      schema,
    });
    
    await server.start();
  });
  
  afterAll(async () => {
    await server.stop();
  });
  
  describe('Authentication and Authorization', () => {
    it('should allow authenticated users to fetch their own profile', async () => {
      // Create authenticated context with BUYER role
      const contextValue = createTestContext('user-2', [UserRole.BUYER]);
      
      // Execute query
      const response = await server.executeOperation(
        {
          query: `
            query {
              me {
                id
                email
                fullName
                roles
              }
            }
          `,
        },
        { contextValue }
      );
      
      // Verify response
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.me).toBeDefined();
      expect(result?.data?.me.id).toBe('user-2');
    });
    
    it('should deny unauthenticated users', async () => {
      // Create unauthenticated context
      const contextValue = createUnauthenticatedContext();
      
      // Execute query
      const response = await server.executeOperation(
        {
          query: `
            query {
              me {
                id
                email
                fullName
              }
            }
          `,
        },
        { contextValue }
      );
      
      // Verify response shows error
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeDefined();
    });
    
    it('should enforce role-based permissions', async () => {
      // Create authenticated context with BUYER role (not ADMIN)
      const contextValue = createTestContext('user-2', [UserRole.BUYER]);
      
      // Execute query that requires ADMIN role
      const response = await server.executeOperation(
        {
          query: `
            query GetUser($id: ID!) {
              user(id: $id) {
                id
                email
                fullName
              }
            }
          `,
          variables: { id: 'user-1' }
        },
        { contextValue }
      );
      
      // Verify response shows permission error
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeDefined();
      expect(result?.errors?.[0].message).toContain('Forbidden');
    });
  });
  
  describe('Document Queries', () => {
    it('should fetch documents with filters', async () => {
      // Create authenticated context
      const contextValue = createTestContext('user-1', [UserRole.DEVELOPER]);
      
      // Execute query with filters
      const response = await server.executeOperation(
        {
          query: `
            query GetDocuments($filters: DocumentFilterInput) {
              documents(filters: $filters) {
                items {
                  id
                  name
                  fileType
                  metadata {
                    category
                    tags
                  }
                }
                totalCount
              }
            }
          `,
          variables: { 
            filters: { 
              category: 'planning',
            } 
          }
        },
        { contextValue }
      );
      
      // Verify filtered response
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.documents.items).toBeDefined();
      expect(result?.data?.documents.items.length).toBeGreaterThan(0);
      expect(result?.data?.documents.items[0].metadata.category).toBe('planning');
    });
    
    it('should fetch a single document by ID', async () => {
      // Create authenticated context
      const contextValue = createTestContext('user-1', [UserRole.DEVELOPER]);
      
      // Execute query
      const response = await server.executeOperation(
        {
          query: `
            query GetDocument($id: ID!) {
              document(id: $id) {
                id
                name
                fileType
                downloadUrl
              }
            }
          `,
          variables: { id: 'doc-1' }
        },
        { contextValue }
      );
      
      // Verify response
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.document).toBeDefined();
      expect(result?.data?.document.id).toBe('doc-1');
    });
  });
  
  describe('Mutations', () => {
    it('should create a new document', async () => {
      // Create authenticated context
      const contextValue = createTestContext('user-1', [UserRole.DEVELOPER]);
      
      // Document input data
      const input = {
        name: 'Test Document',
        fileType: 'application/pdf',
        fileSize: 12345,
        category: 'testing',
        description: 'Test document for integration testing',
        tags: ['test', 'integration'],
      };
      
      // Execute mutation
      const response = await server.executeOperation(
        {
          query: `
            mutation CreateDocument($input: CreateDocumentInput!) {
              createDocument(input: $input) {
                id
                name
                fileType
                fileSize
                downloadUrl
                status
                metadata {
                  category
                  tags
                  description
                }
              }
            }
          `,
          variables: { input }
        },
        { contextValue }
      );
      
      // Verify response
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.createDocument).toBeDefined();
      expect(result?.data?.createDocument.name).toBe(input.name);
      expect(result?.data?.createDocument.metadata.category).toBe(input.category);
      expect(result?.data?.createDocument.metadata.tags).toEqual(input.tags);
    });
    
    it('should update a user profile', async () => {
      // Create authenticated context
      const contextValue = createTestContext('user-2', [UserRole.BUYER]);
      
      // User update data
      const updateData = {
        id: 'user-2', // The user's own ID
        firstName: 'Updated',
        lastName: 'Name',
      };
      
      // Execute mutation
      const response = await server.executeOperation(
        {
          query: `
            mutation UpdateUser($id: ID!, $firstName: String, $lastName: String) {
              updateUser(id: $id, firstName: $firstName, lastName: $lastName) {
                id
                fullName
                firstName
                lastName
              }
            }
          `,
          variables: updateData
        },
        { contextValue }
      );
      
      // Verify response
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeUndefined();
      expect(result?.data?.updateUser).toBeDefined();
      expect(result?.data?.updateUser.id).toBe(updateData.id);
      expect(result?.data?.updateUser.firstName).toBe(updateData.firstName);
      expect(result?.data?.updateUser.lastName).toBe(updateData.lastName);
      expect(result?.data?.updateUser.fullName).toBe(`${updateData.firstName} ${updateData.lastName}`);
    });
    
    it('should prevent updating another user\'s profile without admin rights', async () => {
      // Create authenticated context with BUYER role
      const contextValue = createTestContext('user-2', [UserRole.BUYER]);
      
      // User update data for a different user
      const updateData = {
        id: 'user-1', // A different user's ID
        firstName: 'Unauthorized',
        lastName: 'Change',
      };
      
      // Execute mutation
      const response = await server.executeOperation(
        {
          query: `
            mutation UpdateUser($id: ID!, $firstName: String, $lastName: String) {
              updateUser(id: $id, firstName: $firstName, lastName: $lastName) {
                id
                fullName
              }
            }
          `,
          variables: updateData
        },
        { contextValue }
      );
      
      // Verify response shows permission error
      expect(response.body.kind).toBe('single');
      const result = response.body.kind === 'single' ? response.body.singleResult : null;
      expect(result?.errors).toBeDefined();
      expect(result?.errors?.[0].message).toContain('You can only update your own profile');
    });
  });
});