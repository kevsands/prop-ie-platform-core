import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { GET, POST, PUT, DELETE } from '../../src/app/api/users/route';
import { mockUserService } from '../../src/lib/services/__mocks__/users';
// Mock the userService
jest.mock('../../src/lib/services/users', () => ({
    __esModule: true,
    default: mockUserService,
}));
describe('Users API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET', () => {
        it('should get all users when no query parameters are provided', async () => {
            // Create a mock request
            const request = {
                url: 'http://localhost:3000/api/users',
                nextUrl: new URL('http://localhost:3000/api/users'),
            };
            // Mock the service response
            mockUserService.listUsers.mockResolvedValueOnce({
                data: [
                    { id: 'user-1', email: 'user1@example.com', firstName: 'John', lastName: 'Doe' },
                    { id: 'user-2', email: 'user2@example.com', firstName: 'Jane', lastName: 'Smith' },
                ],
                pagination: { total: 2, page: 1, limit: 10, pages: 1 },
            });
            // Call the handler
            const response = await GET(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(200);
            expect(responseData.data.length).toBe(2);
            expect(responseData.data[0].email).toBe('user1@example.com');
            expect(mockUserService.listUsers).toHaveBeenCalledWith({});
        });
        it('should get a user by ID when id is provided', async () => {
            // Create a mock request with ID
            const url = new URL('http://localhost:3000/api/users');
            url.searchParams.append('id', 'user-1');
            const request = {
                url: url.toString(),
                nextUrl: url,
            };
            // Mock the service response
            mockUserService.getUserById.mockResolvedValueOnce({
                id: 'user-1',
                email: 'user1@example.com',
                firstName: 'John',
                lastName: 'Doe'
            });
            // Call the handler
            const response = await GET(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(200);
            expect(responseData.data[0].id).toBe('user-1');
            expect(responseData.data[0].email).toBe('user1@example.com');
            expect(mockUserService.getUserById).toHaveBeenCalledWith('user-1');
        });
        it('should handle errors', async () => {
            // Create a mock request
            const request = {
                url: 'http://localhost:3000/api/users',
                nextUrl: new URL('http://localhost:3000/api/users'),
            };
            // Mock service error
            mockUserService.listUsers.mockRejectedValueOnce(new Error('Database error'));
            // Call the handler
            const response = await GET(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(500);
            expect(responseData.error.message).toBe('Database error');
        });
    });
    describe('POST', () => {
        it('should create a new user with valid data', async () => {
            // Create mock user data
            const userData = {
                email: 'newuser@example.com',
                firstName: 'New',
                lastName: 'User',
                password: 'password123',
                roles: ['buyer'],
            };
            // Create a mock request
            const request = {
                json: jest.fn().mockResolvedValueOnce(userData),
            };
            // Mock service response
            mockUserService.createUser.mockResolvedValueOnce({
                id: 'new-user-id',
                ...userData,
                password: undefined, // Password should be hashed and not returned
            });
            // Call the handler
            const response = await POST(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(201);
            expect(responseData.id).toBe('new-user-id');
            expect(responseData.email).toBe('newuser@example.com');
            expect(responseData.password).toBeUndefined(); // Password should not be in response
            expect(mockUserService.createUser).toHaveBeenCalledWith(userData);
        });
        it('should return validation error with invalid data', async () => {
            // Create invalid user data (missing required fields)
            const userData = {
                firstName: 'New',
                lastName: 'User',
            };
            // Create a mock request
            const request = {
                json: jest.fn().mockResolvedValueOnce(userData),
            };
            // Call the handler
            const response = await POST(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(400);
            expect(responseData.error.code).toBe('VALIDATION_ERROR');
            expect(mockUserService.createUser).not.toHaveBeenCalled();
        });
        it('should handle service errors', async () => {
            // Create mock user data
            const userData = {
                email: 'newuser@example.com',
                firstName: 'New',
                lastName: 'User',
                password: 'password123',
                roles: ['buyer'],
            };
            // Create a mock request
            const request = {
                json: jest.fn().mockResolvedValueOnce(userData),
            };
            // Mock service error
            mockUserService.createUser.mockRejectedValueOnce(new Error('Email already exists'));
            // Call the handler
            const response = await POST(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(500);
            expect(responseData.error.message).toBe('Email already exists');
        });
    });
    describe('PUT', () => {
        it('should update a user with valid data', async () => {
            // Create mock update data
            const updateData = {
                id: 'user-1',
                firstName: 'Updated',
                lastName: 'Name',
            };
            // Create a mock request
            const request = {
                json: jest.fn().mockResolvedValueOnce(updateData),
            };
            // Mock service response
            mockUserService.updateUser.mockResolvedValueOnce({
                id: 'user-1',
                email: 'user1@example.com',
                firstName: 'Updated',
                lastName: 'Name',
                roles: ['buyer'],
            });
            // Call the handler
            const response = await PUT(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(200);
            expect(responseData.id).toBe('user-1');
            expect(responseData.firstName).toBe('Updated');
            expect(responseData.lastName).toBe('Name');
            expect(mockUserService.updateUser).toHaveBeenCalledWith(updateData);
        });
        it('should return validation error when id is missing', async () => {
            // Create invalid update data (missing id)
            const updateData = {
                firstName: 'Updated',
                lastName: 'Name',
            };
            // Create a mock request
            const request = {
                json: jest.fn().mockResolvedValueOnce(updateData),
            };
            // Call the handler
            const response = await PUT(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(400);
            expect(responseData.error.code).toBe('VALIDATION_ERROR');
            expect(mockUserService.updateUser).not.toHaveBeenCalled();
        });
        it('should handle service errors', async () => {
            // Create mock update data
            const updateData = {
                id: 'user-1',
                firstName: 'Updated',
                lastName: 'Name',
            };
            // Create a mock request
            const request = {
                json: jest.fn().mockResolvedValueOnce(updateData),
            };
            // Mock service error
            mockUserService.updateUser.mockRejectedValueOnce(new Error('User not found'));
            // Call the handler
            const response = await PUT(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(500);
            expect(responseData.error.message).toBe('User not found');
        });
    });
    describe('DELETE', () => {
        it('should delete a user when id is provided', async () => {
            // Create a mock request with ID
            const url = new URL('http://localhost:3000/api/users');
            url.searchParams.append('id', 'user-1');
            const request = {
                url: url.toString(),
                nextUrl: url,
            };
            // Mock service response
            mockUserService.deleteUser.mockResolvedValueOnce({
                success: true,
                message: 'User deleted successfully',
            });
            // Call the handler
            const response = await DELETE(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(200);
            expect(responseData.success).toBe(true);
            expect(responseData.message).toBe('User deleted successfully');
            expect(mockUserService.deleteUser).toHaveBeenCalledWith('user-1');
        });
        it('should return validation error when id is missing', async () => {
            // Create a mock request without ID
            const request = {
                url: 'http://localhost:3000/api/users',
                nextUrl: new URL('http://localhost:3000/api/users'),
            };
            // Call the handler
            const response = await DELETE(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(400);
            expect(responseData.error.code).toBe('VALIDATION_ERROR');
            expect(mockUserService.deleteUser).not.toHaveBeenCalled();
        });
        it('should handle service errors', async () => {
            // Create a mock request with ID
            const url = new URL('http://localhost:3000/api/users');
            url.searchParams.append('id', 'user-1');
            const request = {
                url: url.toString(),
                nextUrl: url,
            };
            // Mock service error
            mockUserService.deleteUser.mockRejectedValueOnce(new Error('Cannot delete user with active properties'));
            // Call the handler
            const response = await DELETE(request);
            const responseData = await response.json();
            // Assertions
            expect(response.status).toBe(500);
            expect(responseData.error.message).toBe('Cannot delete user with active properties');
        });
    });
});
