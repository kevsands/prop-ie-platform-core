/**
 * Coverage Dashboard Example Test
 * 
 * This test demonstrates patterns for achieving high test coverage
 * that will be tracked by the coverage dashboard.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  testConditions,
  createTestCoverageData,
  testAsyncBranches,
  apiCoverageMocks
} from '../../src/test-utils';

// Component under test
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

function UserCard({ user, onEdit, onDelete, isLoading, error }: UserCardProps) {
  if (isLoading) {
    return <div data-testid="loading">Loading...</div>;
  }
  
  if (error) {
    return <div data-testid="error">Error: {error.message}</div>;
  }
  
  return (
    <div className="user-card" data-testid="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {user.role && <p>Role: {user.role}</p>}
      <div className="actions">
        {onEdit && (
          <button onClick={() => onEdit(user.id)}>Edit</button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(user.id)}>Delete</button>
        )}
      </div>
    </div>
  );
}

// Test suite
describe('UserCard', () => {
  // Test basic rendering
  it('renders user information correctly', () => {
    const user = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin'
    };
    
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Role: Admin')).toBeInTheDocument();
  });
  
  // Test conditional rendering of role
  it('does not render role if not provided', () => {
    const user = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    render(<UserCard user={user} />);
    
    expect(screen.queryByText(/Role:/)).not.toBeInTheDocument();
  });
  
  // Test loading state
  it('renders loading state when isLoading is true', () => {
    const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
    
    render(<UserCard user={user} isLoading={true} />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
  
  // Test error state
  it('renders error state when error is provided', () => {
    const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
    const error = new Error('Failed to load user');
    
    render(<UserCard user={user} error={error} />);
    
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to load user')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
  
  // Test event handlers
  it('calls onEdit when edit button is clicked', () => {
    const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
    const onEdit = jest.fn();
    
    render(<UserCard user={user} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith('123');
  });
  
  it('calls onDelete when delete button is clicked', () => {
    const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
    const onDelete = jest.fn();
    
    render(<UserCard user={user} onDelete={onDelete} />);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith('123');
  });
  
  // Test conditional rendering of buttons
  it('does not render edit button when onEdit is not provided', () => {
    const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
    
    render(<UserCard user={user} />);
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
  
  it('does not render delete button when onDelete is not provided', () => {
    const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
    
    render(<UserCard user={user} />);
    
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
  
  // Advanced test patterns for thorough coverage
  
  // Test multiple conditions with a single test
  it('renders correctly with different user types', () => {
    const userTypes = [
      { id: '1', name: 'Regular User', email: 'user@example.com' },
      { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
      { id: '3', name: 'Guest User', email: 'guest@example.com', role: 'Guest' }
    ];
    
    testConditions((user) => {
      const { unmount } = render(<UserCard user={user} />);
      expect(screen.getByText(user.name)).toBeInTheDocument();
      expect(screen.getByText(user.email)).toBeInTheDocument();
      
      if (user.role) {
        expect(screen.getByText(`Role: ${user.role}`)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(/Role:/)).not.toBeInTheDocument();
      }
      
      unmount();
    }, userTypes);
  });
  
  // Test all possible states with test data generator
  it('handles all possible data states correctly', () => {
    // Generate various test cases including edge cases and error states
    const testData = createTestCoverageData({
      includeEdgeCases: true,
      includeErrorStates: true
    });
    
    testData.forEach(item => {
      const user = { 
        id: String(item.id), 
        name: item.name, 
        email: `${item.name.toLowerCase().replace(/\s+/g, '.')}@example.com` 
      };
      
      const props: UserCardProps = {
        user,
        isLoading: item.value === 'loading',
        error: item.error
      };
      
      const { unmount } = render(<UserCard {...props} />);
      
      // Assert based on the test case
      if (props.isLoading) {
        expect(screen.getByTestId('loading')).toBeInTheDocument();
      } else if (props.error) {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      } else {
        expect(screen.getByText(user.name)).toBeInTheDocument();
      }
      
      unmount();
    });
  });
  
  // Async function to test
  async function fetchUserData(userId: string): Promise<any> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (userId === 'error') {
      throw new Error('Failed to fetch user');
    }
    
    return {
      id: userId,
      name: 'Fetched User',
      email: 'fetched@example.com'
    };
  }
  
  // Test async branches
  it('covers all branches of async function', async () => {
    await testAsyncBranches(
      fetchUserData,
      ['123', 'error', ''] // Valid ID, error ID, empty ID
    );
  });
});

// Simple API handler for testing
function userApiHandler(req, res) {
  const { method, query } = req;
  const { id } = query;
  
  if (method === 'GET') {
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    
    if (id === 'not-found') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({ 
      id, 
      name: 'API User', 
      email: 'api@example.com' 
    });
  }
  
  if (method === 'POST') {
    const { body } = req;
    
    if (!body.name || !body.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    return res.status(201).json({ 
      id: 'new-id', 
      ...body 
    });
  }
  
  if (method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    
    return res.status(200).json({ success: true });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

// Test API handler with coverage mocks
describe('userApiHandler', () => {
  it('returns user data for GET request with valid ID', () => {
    const req = { method: 'GET', query: { id: '123' } };
    const res = apiCoverageMocks.success;
    
    userApiHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
  
  it('returns 400 for GET request without ID', () => {
    const req = { method: 'GET', query: {} };
    const res = apiCoverageMocks.badRequest;
    
    userApiHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });
  
  it('returns 404 for GET request with non-existent ID', () => {
    const req = { method: 'GET', query: { id: 'not-found' } };
    const res = apiCoverageMocks.notFound;
    
    userApiHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
  });
  
  it('creates new user for POST request with valid data', () => {
    const req = { 
      method: 'POST', 
      body: { name: 'New User', email: 'new@example.com' } 
    };
    const res = apiCoverageMocks.created;
    
    userApiHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
  
  it('returns 400 for POST request with invalid data', () => {
    const req = { 
      method: 'POST', 
      body: { name: 'New User' } // Missing email
    };
    const res = apiCoverageMocks.badRequest;
    
    userApiHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });
  
  it('deletes user for DELETE request with valid ID', () => {
    const req = { method: 'DELETE', query: { id: '123' } };
    const res = apiCoverageMocks.success;
    
    userApiHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
  
  it('returns 400 for DELETE request without ID', () => {
    const req = { method: 'DELETE', query: {} };
    const res = apiCoverageMocks.badRequest;
    
    userApiHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });
  
  it('returns 405 for unsupported method', () => {
    const req = { method: 'PUT', query: { id: '123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    userApiHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalled();
  });
});