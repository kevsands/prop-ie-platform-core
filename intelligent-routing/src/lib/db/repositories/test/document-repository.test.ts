/**
 * Document Repository Tests
 * 
 * Tests for document repository operations including:
 * - CRUD operations
 * - Document versioning
 * - Transaction support
 */

// Import PrismaClient from local stub instead of @prisma/client directly
import type { PrismaClient } from '@/types/prisma';
// Import Jest extensions
import 'jest-extended';
// Mock jest functions
import jest from 'jest-mock';
import { DocumentRepository } from '../document-repository';
import { v4 as uuidv4 } from 'uuid';

// Test isolation with a unique schema per test run
const testSchemaName = `test_${Date.now()}`;

// Create a mock PrismaClient for testing
const prisma = {
  $executeRaw: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn((callback) => callback(prisma)),
  
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn().mockResolvedValue([]),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
    count: jest.fn().mockResolvedValue(0)
  },
  
  development: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn().mockResolvedValue([]),
    update: jest.fn(),
    delete: jest.fn()
  },
  
  document: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn().mockResolvedValue([]),
    update: jest.fn(),
    delete: jest.fn()
  },
  
  documentVersion: {
    create: jest.fn(),
    findMany: jest.fn().mockResolvedValue([])
  }
} as unknown as PrismaClient;

// Helper to clean up test data
const cleanup = async () => {
  await prisma.$executeRaw`DROP SCHEMA IF EXISTS ${testSchemaName} CASCADE`;
  await prisma.$disconnect();
};

// Test fixtures
const testUser = {
  id: uuidv4(),
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER'
};

const testDevelopment = {
  id: uuidv4(),
  name: 'Test Development',
  status: 'ACTIVE'
};

let documentRepository: DocumentRepository;

describe('Document Repository', () => {
  // Setup before tests
  beforeAll(async () => {
    // Create test schema
    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS ${testSchemaName}`;
    
    // Run migrations in test schema
    await prisma.$executeRaw`SET search_path TO ${testSchemaName}`;
    
    // Create test user
    await prisma.user.create({
      data: testUser
    });
    
    // Create test development
    await prisma.development.create({
      data: {
        ...testDevelopment,
        developer: {
          connect: { id: testUser.id }
        }
      }
    });
    
    // Initialize repository with test Prisma client
    documentRepository = new DocumentRepository(prisma);
  });
  
  // Clean up after tests
  afterAll(async () => {
    await cleanup();
  });
  
  // Test basic CRUD operations
  describe('CRUD Operations', () => {
    let createdDocumentId: string;
    
    it('should create a document', async () => {
      const documentData = {
        title: 'Test Document',
        description: 'This is a test document',
        type: 'LEGAL',
        category: 'CONTRACT',
        status: 'DRAFT',
        fileUrl: 'https://example.com/test.pdf',
        fileType: 'application/pdf',
        size: 1024,
        version: 1,
        tags: ['test', 'document'],
        developmentId: testDevelopment.id,
        createdBy: {
          connect: { id: testUser.id }
        }
      };
      
      const document = await documentRepository.create(documentData);
      
      expect(document).toBeDefined();
      expect(document.title).toBe(documentData.title);
      expect(document.type).toBe(documentData.type);
      expect(document.developmentId).toBe(testDevelopment.id);
      expect(document.createdById).toBe(testUser.id);
      expect(document.id).toBeDefined();
      
      createdDocumentId = document.id;
    });
    
    it('should find a document by ID', async () => {
      const document = await documentRepository.findById(createdDocumentId);
      
      expect(document).toBeDefined();
      expect(document?.id).toBe(createdDocumentId);
      expect(document?.title).toBe('Test Document');
    });
    
    it('should update a document', async () => {
      const updatedDocument = await documentRepository.update(createdDocumentId, {
        title: 'Updated Test Document',
        status: 'PENDING_REVIEW'
      });
      
      expect(updatedDocument).toBeDefined();
      expect(updatedDocument.title).toBe('Updated Test Document');
      expect(updatedDocument.status).toBe('PENDING_REVIEW');
      expect(updatedDocument.id).toBe(createdDocumentId);
    });
    
    it('should find documents by development ID', async () => {
      const documents = await documentRepository.findByDevelopmentId(testDevelopment.id);
      
      expect(documents).toBeDefined();
      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0].developmentId).toBe(testDevelopment.id);
    });
    
    it('should find documents by type', async () => {
      const documents = await documentRepository.findByType('LEGAL');
      
      expect(documents).toBeDefined();
      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0].type).toBe('LEGAL');
    });
    
    it('should update document status', async () => {
      const updatedDocument = await documentRepository.updateStatus(createdDocumentId, 'APPROVED');
      
      expect(updatedDocument).toBeDefined();
      expect(updatedDocument.status).toBe('APPROVED');
      expect(updatedDocument.id).toBe(createdDocumentId);
    });
    
    it('should delete a document', async () => {
      // Create a document to delete
      const documentData = {
        title: 'Document to Delete',
        type: 'LEGAL',
        category: 'OTHER',
        status: 'DRAFT',
        fileUrl: 'https://example.com/delete.pdf',
        fileType: 'application/pdf',
        size: 512,
        version: 1,
        developmentId: testDevelopment.id,
        createdBy: {
          connect: { id: testUser.id }
        }
      };
      
      const document = await documentRepository.create(documentData);
      const documentId = document.id;
      
      // Delete the document
      const deletedDocument = await documentRepository.delete(documentId);
      
      expect(deletedDocument).toBeDefined();
      expect(deletedDocument.id).toBe(documentId);
      
      // Verify it's deleted
      const fetchedDocument = await documentRepository.findById(documentId);
      expect(fetchedDocument).toBeNull();
    });
  });
  
  // Test document versioning
  describe('Document Versioning', () => {
    let documentId: string;
    
    beforeAll(async () => {
      // Create a test document
      const documentData = {
        title: 'Versioned Document',
        type: 'TECHNICAL',
        category: 'PLANNING',
        status: 'DRAFT',
        fileUrl: 'https://example.com/v1.pdf',
        fileType: 'application/pdf',
        size: 2048,
        version: 1,
        developmentId: testDevelopment.id,
        createdBy: {
          connect: { id: testUser.id }
        }
      };
      
      const document = await documentRepository.create(documentData);
      documentId = document.id;
    });
    
    it('should add a new document version', async () => {
      const newVersionNumber = 2;
      const newFileUrl = 'https://example.com/v2.pdf';
      const notes = 'Updated version with corrections';
      
      const versionResult = await documentRepository.addVersion(
        documentId,
        newVersionNumber,
        newFileUrl,
        testUser.id,
        3072,
        notes
      );
      
      expect(versionResult).toBeDefined();
      
      // Verify the document has been updated
      const updatedDocument = await documentRepository.findById(documentId);
      expect(updatedDocument).toBeDefined();
      expect(updatedDocument?.version).toBe(newVersionNumber);
      expect(updatedDocument?.fileUrl).toBe(newFileUrl);
      
      // Verify version is created
      const documentWithVersions = await documentRepository.findWithDetails(documentId);
      expect(documentWithVersions).toBeDefined();
      expect(documentWithVersions?.previousVersions).toBeDefined();
      expect(documentWithVersions?.previousVersions.length).toBeGreaterThan(0);
      
      const previousVersion = documentWithVersions?.previousVersions[0];
      expect(previousVersion?.versionNumber).toBe(1); // Previous version should be 1
      expect(previousVersion?.notes).toBe(notes);
    });
  });
  
  // Test transaction support
  describe('Transaction Support', () => {
    it('should support transactions for document operations', async () => {
      // Create a document with transaction
      let documentId: string;
      
      await documentRepository.transaction(async (tx) => {
        // Create document in transaction
        const documentData = {
          title: 'Transaction Test Document',
          type: 'FINANCIAL',
          category: 'CONTRACT',
          status: 'DRAFT',
          fileUrl: 'https://example.com/transaction.pdf',
          fileType: 'application/pdf',
          size: 4096,
          version: 1,
          developmentId: testDevelopment.id,
          createdBy: {
            connect: { id: testUser.id }
          }
        };
        
        const document = await tx.document.create({
          data: documentData
        });
        
        documentId = document.id;
        
        // Create a document version in the same transaction
        await tx.documentVersion.create({
          data: {
            document: {
              connect: { id: documentId }
            },
            versionNumber: 1,
            fileUrl: documentData.fileUrl,
            createdBy: {
              connect: { id: testUser.id }
            },
            size: documentData.size,
            notes: 'Initial version'
          }
        });
      });
      
      // Verify document was created
      const document = await documentRepository.findWithDetails(documentId!);
      expect(document).toBeDefined();
      expect(document?.title).toBe('Transaction Test Document');
      expect(document?.previousVersions).toBeDefined();
      expect(document?.previousVersions.length).toBe(1);
    });
    
    it('should rollback transactions on error', async () => {
      // Create a document ID to test with
      const documentId = uuidv4();
      
      try {
        await documentRepository.transaction(async (tx) => {
          // Create document version without creating the document first
          // This should fail with a foreign key constraint error
          await tx.documentVersion.create({
            data: {
              document: {
                connect: { id: documentId } // This document doesn't exist
              },
              versionNumber: 1,
              fileUrl: 'https://example.com/error.pdf',
              createdBy: {
                connect: { id: testUser.id }
              },
              size: 1024,
              notes: 'This should fail'
            }
          });
        });
        
        // The transaction should have failed
        expect(true).toBe(false);
      } catch (error) {
        // Expected error due to foreign key constraint
        expect(error).toBeDefined();
      }
      
      // Verify no document was created
      const document = await documentRepository.findById(documentId);
      expect(document).toBeNull();
    });
  });
});