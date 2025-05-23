/**
 * Mock implementation of the Units Service for testing
 */

export const mockUnitsService = {
  listUnits: jest.fn(),
  getUnitById: jest.fn(),
  getUnitsByDevelopment: jest.fn(),
  createUnit: jest.fn(),
  updateUnit: jest.fn(),
  deleteUnit: jest.fn(),
  updateUnitStatus: jest.fn(),
  searchUnits: jest.fn()};

export default mockUnitsService;