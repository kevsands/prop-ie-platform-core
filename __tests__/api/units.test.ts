import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '../../src/app/api/units/route';
import { mockUnitsService } from '../../src/lib/services/__mocks__/units';
import '../../src/types/jest-extended';
import type { UnitData, UnitUpdateData, ApiResponse } from '../../src/types/api-test';
import type { MockUnitsService } from '../../src/types/test-mocks';

// Mock the unitsService
jest.mock('../../src/lib/services/units', () => ({
  __esModule: true,
  default: mockUnitsService,
}));

// Helper function to create a properly typed mock request
function createMockRequest<T>(data: T): NextRequest {
  return {
    json: () => Promise.resolve(data),
    url: 'http://localhost:3000/api/units',
    nextUrl: new URL('http://localhost:3000/api/units'),
  } as unknown as NextRequest;
}

describe('Units API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should get all units when no query parameters are provided', async () => {
      // Create a mock request
      const request = {
        url: 'http://localhost:3000/api/units',
        nextUrl: new URL('http://localhost:3000/api/units'),
      } as unknown as NextRequest;

      // Mock the service response
      mockUnitsService.listUnits.mockResolvedValueOnce({
        data: [
          {
            id: 'unit-1',
            name: 'Unit A1',
            developmentId: 'dev-1',
            type: 'APARTMENT',
            bedrooms: 2,
            price: 350000
          } as UnitData,
          {
            id: 'unit-2',
            name: 'Unit A2',
            developmentId: 'dev-1',
            type: 'APARTMENT',
            bedrooms: 3,
            price: 450000
          } as UnitData,
        ],
        pagination: { total: 2, page: 1, limit: 10, pages: 1 },
      });

      // Call the handler
      const response = await GET(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(200);
      expect(responseData.data).toBeDefined();
      expect(responseData.data!.length).toBe(2);
      expect(responseData.data![0].name).toBe('Unit A1');
      expect(mockUnitsService.listUnits).toHaveBeenCalledWith({});
    });

    it('should get a unit by ID when id is provided', async () => {
      // Create a mock request with ID
      const url = new URL('http://localhost:3000/api/units');
      url.searchParams.append('id', 'unit-1');
      const request = {
        url: url.toString(),
        nextUrl: url,
      } as unknown as NextRequest;

      // Mock the service response
      mockUnitsService.getUnitById.mockResolvedValueOnce({
        id: 'unit-1',
        name: 'Unit A1',
        developmentId: 'dev-1',
        type: 'APARTMENT',
        bedrooms: 2,
        price: 350000
      } as UnitData);

      // Call the handler
      const response = await GET(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(200);
      expect(responseData.data).toBeDefined();
      expect(responseData.data![0].id).toBe('unit-1');
      expect(responseData.data![0].name).toBe('Unit A1');
      expect(mockUnitsService.getUnitById).toHaveBeenCalledWith('unit-1');
    });

    it('should filter units by development ID', async () => {
      // Create a mock request with developmentId filter
      const url = new URL('http://localhost:3000/api/units');
      url.searchParams.append('developmentId', 'dev-1');
      const request = {
        url: url.toString(),
        nextUrl: url,
      } as unknown as NextRequest;

      // Mock the service response
      mockUnitsService.listUnits.mockResolvedValueOnce({
        data: [
          {
            id: 'unit-1',
            name: 'Unit A1',
            developmentId: 'dev-1',
            type: 'APARTMENT',
            bedrooms: 2,
            price: 350000
          } as UnitData,
          {
            id: 'unit-2',
            name: 'Unit A2',
            developmentId: 'dev-1',
            type: 'APARTMENT',
            bedrooms: 3,
            price: 450000
          } as UnitData,
        ],
        pagination: { total: 2, page: 1, limit: 10, pages: 1 },
      });

      // Call the handler
      const response = await GET(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(200);
      expect(responseData.data!.length).toBe(2);
      expect(mockUnitsService.listUnits).toHaveBeenCalledWith({ developmentId: 'dev-1' });
    });

    it('should handle errors', async () => {
      // Create a mock request
      const request = {
        url: 'http://localhost:3000/api/units',
        nextUrl: new URL('http://localhost:3000/api/units'),
      } as unknown as NextRequest;

      // Mock service error
      mockUnitsService.listUnits.mockRejectedValueOnce(new Error('Database error'));

      // Call the handler
      const response = await GET(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(500);
      expect(responseData.error.message).toBe('Database error');
    });
  });

  describe('POST', () => {
    it('should create a new unit with valid data', async () => {
      // Create mock unit data
      const unitData: UnitData = {
        developmentId: 'dev-1',
        name: 'Unit A3',
        type: 'APARTMENT',
        status: 'AVAILABLE',
        bedrooms: 2,
        bathrooms: 2,
        area: 95,
        price: 350000
      };

      // Create a mock request
      const request = createMockRequest(unitData);

      // Mock service response
      mockUnitsService.createUnit.mockResolvedValueOnce({
        id: 'unit-3',
        ...unitData
      } as UnitData);

      // Call the handler
      const response = await POST(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(201);
      expect(responseData.id).toBe('unit-3');
      expect(responseData.name).toBe('Unit A3');
      expect(mockUnitsService.createUnit).toHaveBeenCalledWith(unitData);
    });

    it('should return validation error with invalid data', async () => {
      // Create invalid unit data (missing required fields)
      const unitData: Partial<UnitData> = {
        name: 'Unit A3',
        price: 350000
      };

      // Create a mock request
      const request = createMockRequest(unitData);

      // Call the handler
      const response = await POST(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(400);
      expect(responseData.error.code).toBe('VALIDATION_ERROR');
      expect(mockUnitsService.createUnit).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Create mock unit data
      const unitData: UnitData = {
        developmentId: 'dev-1',
        name: 'Unit A3',
        type: 'APARTMENT',
        status: 'AVAILABLE',
        bedrooms: 2,
        bathrooms: 2,
        area: 95,
        price: 350000
      };

      // Create a mock request
      const request = createMockRequest(unitData);

      // Mock service error
      mockUnitsService.createUnit.mockRejectedValueOnce(new Error('Development not found'));

      // Call the handler
      const response = await POST(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(500);
      expect(responseData.error.message).toBe('Development not found');
    });
  });

  describe('PUT', () => {
    it('should update a unit with valid data', async () => {
      // Create mock update data
      const updateData: UnitUpdateData = {
        id: 'unit-1',
        price: 375000,
        status: 'RESERVED'
      };

      // Create a mock request
      const request = createMockRequest(updateData);

      // Mock service response
      mockUnitsService.updateUnit.mockResolvedValueOnce({
        id: 'unit-1',
        name: 'Unit A1',
        developmentId: 'dev-1',
        type: 'APARTMENT',
        status: 'RESERVED',
        bedrooms: 2,
        bathrooms: 2,
        area: 95,
        price: 375000
      } as UnitData);

      // Call the handler
      const response = await PUT(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(200);
      expect(responseData.id).toBe('unit-1');
      expect(responseData.price).toBe(375000);
      expect(responseData.status).toBe('RESERVED');
      expect(mockUnitsService.updateUnit).toHaveBeenCalledWith(updateData);
    });

    it('should return validation error when id is missing', async () => {
      // Create invalid update data (missing id)
      const updateData: Partial<UnitUpdateData> = {
        price: 375000,
        status: 'RESERVED'
      };

      // Create a mock request
      const request = createMockRequest(updateData);

      // Call the handler
      const response = await PUT(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(400);
      expect(responseData.error.code).toBe('VALIDATION_ERROR');
      expect(mockUnitsService.updateUnit).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Create mock update data
      const updateData: UnitUpdateData = {
        id: 'unit-1',
        price: 375000,
        status: 'RESERVED'
      };

      // Create a mock request
      const request = createMockRequest(updateData);

      // Mock service error
      mockUnitsService.updateUnit.mockRejectedValueOnce(new Error('Unit not found'));

      // Call the handler
      const response = await PUT(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(500);
      expect(responseData.error.message).toBe('Unit not found');
    });
  });

  describe('DELETE', () => {
    it('should delete a unit when id is provided', async () => {
      // Create a mock request with ID
      const url = new URL('http://localhost:3000/api/units');
      url.searchParams.append('id', 'unit-1');
      const request = {
        url: url.toString(),
        nextUrl: url,
      } as unknown as NextRequest;

      // Mock service response
      mockUnitsService.deleteUnit.mockResolvedValueOnce({
        success: true,
        message: 'Unit deleted successfully',
      } as ApiResponse);

      // Call the handler
      const response = await DELETE(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe('Unit deleted successfully');
      expect(mockUnitsService.deleteUnit).toHaveBeenCalledWith('unit-1');
    });

    it('should return validation error when id is missing', async () => {
      // Create a mock request without ID
      const request = {
        url: 'http://localhost:3000/api/units',
        nextUrl: new URL('http://localhost:3000/api/units'),
      } as unknown as NextRequest;

      // Call the handler
      const response = await DELETE(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(400);
      expect(responseData.error.code).toBe('VALIDATION_ERROR');
      expect(mockUnitsService.deleteUnit).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Create a mock request with ID
      const url = new URL('http://localhost:3000/api/units');
      url.searchParams.append('id', 'unit-1');
      const request = {
        url: url.toString(),
        nextUrl: url,
      } as unknown as NextRequest;

      // Mock service error
      mockUnitsService.deleteUnit.mockRejectedValueOnce(
        new Error('Cannot delete unit with active sales')
      );

      // Call the handler
      const response = await DELETE(request);
      const responseData = await response.json() as ApiResponse;

      // Assertions
      expect(response.status).toBe(500);
      expect(responseData.error.message).toBe('Cannot delete unit with active sales');
    });
  });
});