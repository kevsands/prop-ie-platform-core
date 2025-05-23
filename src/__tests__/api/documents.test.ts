// Document API Tests
import { NextRequest } from 'next/server';
import { GET, POST, PATCH, DELETE } from '@/app/api/documents/route';
import { PrismaClient } from '@prisma/client';
import { S3Client } from '@aws-sdk/client-s3';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock dependencies
jest.mock('@prisma/client');
jest.mock('@aws-sdk/client-s3');

const mockPrisma = {
  document: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  transaction: {
    findUnique: jest.fn()
  },
  transactionEvent: {
    create: jest.fn()
  }
};

const mockS3 = {
  send: jest.fn()
};

// Mock file
const createMockFile = (name: string, content: string, type: string): File => {
  return new File([content], name, { type });
};

// Mock Request
const createMockRequest = (options: {
  method: string;
  url: string;
  formData?: FormData;
  body?: any;
  searchParams?: Record<string, string>\n  );
}) => {
  const url = new URL(options.url, 'http://localhost:3000');
  Object.entries(options.searchParams || {}).forEach(([keyvalue]) => {
    url.searchParams.append(keyvalue);
  });

  return {
    method: options.method,
    url: url.toString(),
    formData: jest.fn().mockResolvedValue(options.formData),
    json: jest.fn().mockResolvedValue(options.body),
    nextUrl: url
  } as unknown as NextRequest;
};

describe('Document API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as any);
    (S3Client as jest.MockedClass<typeof S3Client>).mockImplementation(() => mockS3 as any);
  });

  describe('GET /api/documents', () => {
    it('should return all documents for a transaction', async () => {
      const mockDocuments = [
        {
          id: '1',
          name: 'Purchase Agreement',
          type: 'CONTRACT',
          status: 'DRAFT',
          size: 1024,
          createdAt: new Date(),
          uploadedBy: { name: 'John Doe' }
        },
        {
          id: '2',
          name: 'Property Survey',
          type: 'SURVEY',
          status: 'APPROVED',
          size: 2048,
          createdAt: new Date(),
          uploadedBy: { name: 'Jane Smith' }
        }
      ];

      mockPrisma.document.findMany.mockResolvedValue(mockDocuments);

      const request = createMockRequest({
        method: 'GET',
        url: '/api/documents',
        searchParams: { transactionId: 'tx-123' }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.documents).toHaveLength(2);
      expect(mockPrisma.document.findMany).toHaveBeenCalledWith({
        where: { transactionId: 'tx-123' },
        include: {
          uploadedBy: true,
          transaction: true
        },
        orderBy: { createdAt: 'desc' }
      });
    });

    it('should filter documents by type', async () => {
      const mockDocuments = [
        {
          id: '1',
          name: 'Purchase Agreement',
          type: 'CONTRACT',
          status: 'APPROVED'
        }
      ];

      mockPrisma.document.findMany.mockResolvedValue(mockDocuments);

      const request = createMockRequest({
        method: 'GET',
        url: '/api/documents',
        searchParams: {
          transactionId: 'tx-123',
          type: 'CONTRACT'
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.document.findMany).toHaveBeenCalledWith({
        where: {
          transactionId: 'tx-123',
          type: 'CONTRACT'
        },
        include: expect.any(Object),
        orderBy: expect.any(Object)
      });
    });
  });

  describe('POST /api/documents (Upload)', () => {
    it('should upload a new document', async () => {
      const mockFile = createMockFile('contract.pdf', 'PDF content', 'application/pdf');
      const formData = new FormData();
      formData.append('file', mockFile);
      formData.append('transactionId', 'tx-123');
      formData.append('type', 'CONTRACT');
      formData.append('uploadedBy', 'user-123');

      const mockDocument = {
        id: 'doc-123',
        name: 'contract.pdf',
        type: 'CONTRACT',
        status: 'PENDING',
        size: mockFile.size,
        mimeType: 'application/pdf',
        s3Key: 'documents/tx-123/contract.pdf',
        transactionId: 'tx-123',
        uploadedById: 'user-123',
        createdAt: new Date()
      };

      mockPrisma.document.create.mockResolvedValue(mockDocument);
      mockS3.send.mockResolvedValue({ ETag: 'etag123' });
      mockPrisma.transactionEvent.create.mockResolvedValue({
        id: 'event-1',
        type: 'DOCUMENT_UPLOADED'
      });

      const request = createMockRequest({
        method: 'POST',
        url: '/api/documents',
        formData
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.document.name).toBe('contract.pdf');
      expect(mockS3.send).toHaveBeenCalled();
      expect(mockPrisma.document.create).toHaveBeenCalled();
    });

    it('should validate file type', async () => {
      const mockFile = createMockFile('malware.exe', 'Executable content', 'application/x-msdownload');
      const formData = new FormData();
      formData.append('file', mockFile);
      formData.append('transactionId', 'tx-123');
      formData.append('type', 'CONTRACT');
      formData.append('uploadedBy', 'user-123');

      const request = createMockRequest({
        method: 'POST',
        url: '/api/documents',
        formData
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid file type');
    });

    it('should enforce file size limit', async () => {
      // Create a mock file that's too large
      const largeContent = 'x'.repeat(101 * 1024 * 1024); // 101MB
      const mockFile = createMockFile('large.pdf', largeContent, 'application/pdf');
      const formData = new FormData();
      formData.append('file', mockFile);
      formData.append('transactionId', 'tx-123');
      formData.append('type', 'CONTRACT');
      formData.append('uploadedBy', 'user-123');

      const request = createMockRequest({
        method: 'POST',
        url: '/api/documents',
        formData
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('File size exceeds limit');
    });
  });

  describe('PATCH /api/documents', () => {
    it('should update document metadata', async () => {
      const mockUpdatedDocument = {
        id: 'doc-123',
        name: 'Updated Contract',
        status: 'APPROVED',
        updatedAt: new Date()
      };

      mockPrisma.document.update.mockResolvedValue(mockUpdatedDocument);
      mockPrisma.transactionEvent.create.mockResolvedValue({
        id: 'event-2',
        type: 'DOCUMENT_UPDATED'
      });

      const request = createMockRequest({
        method: 'PATCH',
        url: '/api/documents',
        searchParams: { id: 'doc-123' },
        body: {
          name: 'Updated Contract',
          status: 'APPROVED'
        }
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Updated Contract');
      expect(mockPrisma.document.update).toHaveBeenCalledWith({
        where: { id: 'doc-123' },
        data: {
          name: 'Updated Contract',
          status: 'APPROVED',
          updatedAt: expect.any(Date)
        }
      });
    });

    it('should create new version when archived', async () => {
      mockPrisma.document.update.mockResolvedValue({
        id: 'doc-123',
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: 'user-123'
      });

      const request = createMockRequest({
        method: 'PATCH',
        url: '/api/documents',
        searchParams: { id: 'doc-123' },
        body: {
          isArchived: true,
          archivedBy: 'user-123'
        }
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.document.update).toHaveBeenCalledWith({
        where: { id: 'doc-123' },
        data: expect.objectContaining({
          isArchived: true,
          archivedAt: expect.any(Date),
          archivedBy: 'user-123'
        })
      });
    });
  });

  describe('DELETE /api/documents', () => {
    it('should soft delete a document', async () => {
      const mockDocument = {
        id: 'doc-123',
        name: 'Old Document',
        s3Key: 'documents/tx-123/old-doc.pdf'
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      mockPrisma.document.update.mockResolvedValue({
        ...mockDocument,
        isDeleted: true,
        deletedAt: new Date()
      });
      mockS3.send.mockResolvedValue({ DeleteMarker: true });

      const request = createMockRequest({
        method: 'DELETE',
        url: '/api/documents',
        searchParams: { id: 'doc-123' }
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.document.update).toHaveBeenCalledWith({
        where: { id: 'doc-123' },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date)
        }
      });
      expect(mockS3.send).toHaveBeenCalled(); // S3 delete
    });

    it('should return 404 for non-existent document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue(null);

      const request = createMockRequest({
        method: 'DELETE',
        url: '/api/documents',
        searchParams: { id: 'non-existent' }
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Document not found');
    });
  });

  describe('Document Security', () => {
    it('should check user permissions before download', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc-123',
        transaction: {
          buyerId: 'user-123',
          sellerId: 'user-456',
          solicitorId: 'user-789'
        }
      });

      const request = createMockRequest({
        method: 'GET',
        url: '/api/documents',
        searchParams: {
          action: 'download',
          id: 'doc-123',
          userId: 'user-999' // Not authorized
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Access denied');
    });

    it('should generate pre-signed URL for authorized users', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc-123',
        s3Key: 'documents/tx-123/contract.pdf',
        transaction: {
          buyerId: 'user-123',
          sellerId: 'user-456',
          solicitorId: 'user-789'
        }
      });

      mockS3.send.mockResolvedValue({});

      const request = createMockRequest({
        method: 'GET',
        url: '/api/documents',
        searchParams: {
          action: 'download',
          id: 'doc-123',
          userId: 'user-123' // Authorized buyer
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.downloadUrl).toBeDefined();
    });
  });
});