// Transaction API Tests
import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PATCH } from '@/app/api/transactions/route';
import { PrismaClient } from '@prisma/client';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock dependencies
jest.mock('@prisma/client');

const mockPrisma = {
  transaction: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  transactionEvent: {
    create: jest.fn()
  },
  task: {
    create: jest.fn(),
    createMany: jest.fn()
  },
  unit: {
    update: jest.fn()
  },
  $transaction: jest.fn()
};

// Mock NextRequest
const createMockRequest = (options: {
  method: string;
  url: string;
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
    json: jest.fn().mockResolvedValue(options.body),
    nextUrl: url
  } as unknown as NextRequest;
};

describe('Transaction API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as any);
  });

  describe('GET /api/transactions', () => {
    it('should return all transactions', async () => {
      const mockTransactions = [
        {
          id: '1',
          referenceNumber: 'TX-001',
          status: 'ACTIVE',
          buyer: { name: 'John Doe' },
          unit: { unitNumber: '101', development: { name: 'Riverside Manor' } }
        },
        {
          id: '2',
          referenceNumber: 'TX-002',
          status: 'COMPLETED',
          buyer: { name: 'Jane Smith' },
          unit: { unitNumber: '202', development: { name: 'Fitzgerald Gardens' } }
        }
      ];

      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions);

      const request = createMockRequest({
        method: 'GET',
        url: '/api/transactions'
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.transactions).toHaveLength(2);
    });

    it('should return filtered transactions by status', async () => {
      const mockTransactions = [
        {
          id: '1',
          referenceNumber: 'TX-001',
          status: 'ACTIVE',
          buyer: { name: 'John Doe' }
        }
      ];

      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions);

      const request = createMockRequest({
        method: 'GET',
        url: '/api/transactions',
        searchParams: { status: 'ACTIVE' }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'ACTIVE' })
        })
      );
    });

    it('should return specific transaction by ID', async () => {
      const mockTransaction = {
        id: '123',
        referenceNumber: 'TX-123',
        status: 'ACTIVE',
        buyer: { name: 'John Doe' },
        unit: { unitNumber: '101' },
        events: [],
        documents: [],
        payments: []
      };

      mockPrisma.transaction.findUnique.mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: 'GET',
        url: '/api/transactions',
        searchParams: { id: '123' }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.transaction.id).toBe('123');
    });
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const mockTransactionData = {
        unitId: 'unit-123',
        buyerId: 'buyer-123',
        sellerId: 'seller-123',
        agentId: 'agent-123',
        solicitorId: 'solicitor-123',
        agreedPrice: 500000,
        stage: 'INITIAL',
        status: 'ACTIVE'
      };

      const mockCreatedTransaction = {
        id: 'tx-123',
        referenceNumber: 'TX-000001',
        ...mockTransactionData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });

      mockPrisma.transaction.create.mockResolvedValue(mockCreatedTransaction);
      mockPrisma.transactionEvent.create.mockResolvedValue({
        id: 'event-1',
        transactionId: 'tx-123',
        type: 'TRANSACTION_CREATED'
      });

      const request = createMockRequest({
        method: 'POST',
        url: '/api/transactions',
        body: mockTransactionData
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('tx-123');
      expect(mockPrisma.transaction.create).toHaveBeenCalled();
      expect(mockPrisma.transactionEvent.create).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const request = createMockRequest({
        method: 'POST',
        url: '/api/transactions',
        body: {
          // Missing required fields
          buyerId: 'buyer-123'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Validation error');
    });
  });

  describe('PATCH /api/transactions', () => {
    it('should update transaction status', async () => {
      const mockUpdatedTransaction = {
        id: 'tx-123',
        status: 'SALE_AGREED',
        stage: 'CONTRACT',
        updatedAt: new Date()
      };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });

      mockPrisma.transaction.update.mockResolvedValue(mockUpdatedTransaction);
      mockPrisma.transactionEvent.create.mockResolvedValue({
        id: 'event-2',
        transactionId: 'tx-123',
        type: 'STATUS_CHANGED'
      });

      const request = createMockRequest({
        method: 'PATCH',
        url: '/api/transactions',
        searchParams: { id: 'tx-123' },
        body: {
          status: 'SALE_AGREED',
          stage: 'CONTRACT'
        }
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('SALE_AGREED');
      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-123' },
        data: expect.objectContaining({
          status: 'SALE_AGREED',
          stage: 'CONTRACT'
        })
      });
    });

    it('should update financial information', async () => {
      const mockUpdatedTransaction = {
        id: 'tx-123',
        depositPaid: 50000,
        totalPaid: 50000,
        mortgageRequired: true,
        mortgageApproved: false
      };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });

      mockPrisma.transaction.update.mockResolvedValue(mockUpdatedTransaction);

      const request = createMockRequest({
        method: 'PATCH',
        url: '/api/transactions',
        searchParams: { id: 'tx-123' },
        body: {
          depositPaid: 50000,
          totalPaid: 50000,
          mortgageRequired: true,
          mortgageApproved: false
        }
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.depositPaid).toBe(50000);
    });

    it('should return 404 if transaction not found', async () => {
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });

      mockPrisma.transaction.update.mockRejectedValue(new Error('Record not found'));

      const request = createMockRequest({
        method: 'PATCH',
        url: '/api/transactions',
        searchParams: { id: 'non-existent' },
        body: { status: 'COMPLETED' }
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('Transaction Event Creation', () => {
    it('should create appropriate events for status changes', async () => {
      const mockUpdatedTransaction = {
        id: 'tx-123',
        status: 'CONTRACTS_SIGNED',
        stage: 'LEGAL'
      };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });

      mockPrisma.transaction.update.mockResolvedValue(mockUpdatedTransaction);
      mockPrisma.transactionEvent.create.mockResolvedValue({
        id: 'event-3',
        transactionId: 'tx-123',
        type: 'CONTRACT_SIGNED',
        description: 'Contracts have been signed by all parties'
      });

      const request = createMockRequest({
        method: 'PATCH',
        url: '/api/transactions',
        searchParams: { id: 'tx-123' },
        body: { status: 'CONTRACTS_SIGNED' }
      });

      await PATCH(request);

      expect(mockPrisma.transactionEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          transactionId: 'tx-123',
          type: 'CONTRACT_SIGNED',
          metadata: expect.objectContaining({
            previousStatus: expect.any(String),
            newStatus: 'CONTRACTS_SIGNED'
          })
        })
      });
    });
  });
});