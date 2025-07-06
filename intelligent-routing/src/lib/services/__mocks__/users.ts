/**
 * Mock implementation of the User Service for testing
 */

export const mockUserService = {
  listUsers: jest.fn(),
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  changePassword: jest.fn(),
  updateUserRole: jest.fn(),
  updateUserStatus: jest.fn(),
};

export default mockUserService;