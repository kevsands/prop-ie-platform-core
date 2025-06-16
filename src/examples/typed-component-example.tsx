/**
 * Typed Component Example
 * 
 * This file demonstrates how to properly use the centralized type system
 * in React components throughout the application.
 */

import React, { useEffect, useState } from 'react';
import { 
  User, 
  UserStatus, 
  UserRole, 
  Property, 
  Development, 
  isUser,
  assertUser
} from '../types/models';
import { 
  ApiResponse, 
  GraphQLResponse, 
  ApiError,
  isApiError, 
  ErrorCode 
} from '../types/api';
import { 
  AsyncState, 
  PaginatedResponse, 
  DeepPartial 
} from '../types/utils';

// Example of a typed component props
interface UserProfileProps {
  userId: string;
  showDetails?: boolean;
  onUserUpdated?: (user: User) => void;
}

// Example of a typed component state
interface UserProfileState {
  user: AsyncState<User>
  );
  properties: AsyncState<Property[]>
  );
  developments: AsyncState<Development[]>
  );
  isEditing: boolean;
  formData: DeepPartial<User>
  );
}

// Example of using the type system in a React component
const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  showDetails = true,
  onUserUpdated 
}) => {
  // Initialize state with proper typing
  const [statesetState] = useState<UserProfileState>({
    user: { data: null, isLoading: false, error: null },
    properties: { data: null, isLoading: false, error: null },
    developments: { data: null, isLoading: false, error: null },
    isEditing: false,
    formData: {}
  });

  // Fetch user data with proper types
  useEffect(() => {
    const fetchUser = async () => {
      setState(prev => ({ ...prev, user: { ...prev.user, isLoading: true } }));
      try {
        // Example of typed API response
        const response: ApiResponse<User> = await fetch(`/api/users/${userId}`)
          .then(res => res.json());
        
        if (!response.success || !response.data) {
          throw new ApiError({
            message: response.error?.message || 'Failed to fetch user',
            code: response.error?.code || ErrorCode.UNKNOWN_ERROR,
            statusCode: 400
          });
        }
        
        // Type guard usage example
        if (!isUser(response.data)) {
          throw new Error('Invalid user data received');
        }
        
        setState(prev => ({ 
          ...prev, 
          user: { 
            data: response.data, 
            isLoading: false, 
            error: null 
          },
          formData: response.data
        }));
      } catch (error) {
        // Proper error type handling
        const errorMessage = isApiError(error) 
          ? error.message 
          : 'Unknown error occurred';
        
        setState(prev => ({ 
          ...prev, 
          user: { 
            data: null, 
            isLoading: false, 
            error: error as Error 
          } 
        }));
        
        console.error('Error fetching user:', errorMessage);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Example of type-safe update function
  const updateUser = async (userData: DeepPartial<User>) => {
    setState(prev => ({ ...prev, user: { ...prev.user, isLoading: true } }));
    try {
      const response: ApiResponse<User> = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }).then(res => res.json());
      
      if (!response.success || !response.data) {
        throw new ApiError({
          message: response.error?.message || 'Failed to update user',
          code: response.error?.code || ErrorCode.UNKNOWN_ERROR,
          statusCode: 400
        });
      }
      
      setState(prev => ({ 
        ...prev, 
        user: { 
          data: response.data, 
          isLoading: false, 
          error: null 
        },
        isEditing: false
      }));
      
      // Type-safe callback
      if (onUserUpdated) {
        onUserUpdated(response.data);
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        user: { 
          ...prev.user,
          isLoading: false, 
          error: error as Error 
        } 
      }));
    }
  };

  // Type-safe handler example
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        roles: [role]
      }
    }));
  };

  // Type assertion for safety
  if (state.user.data) {
    try {
      assertUser(state.user.data);
    } catch (error) {
      console.error('Invalid user data:', error);
      return <div>Error: Invalid user data</div>\n  );
    }
  }

  // Loading state
  if (state.user.isLoading) {
    return <div>Loading user data...</div>\n  );
  }

  // Error state
  if (state.user.error) {
    return <div>Error: {state.user.error.message}</div>\n  );
  }

  // Empty state
  if (!state.user.data) {
    return <div>No user data available</div>\n  );
  }

  const user = state.user.data;

  // Render with type-safe access
  return (
    <div className="user-profile">
      <h2>{user.fullName}</h2>
      <p>Email: {user.email}</p>
      <p>Status: {user.status}</p>
      
      {showDetails && (
        <div className="user-details">
          <p>Roles: {user.roles.join(', ')}</p>
          <p>Created: {user.created.toLocaleDateString()}</p>
          <p>Last Active: {user.lastActive.toLocaleDateString()}</p>
        </div>
      )}
      
      {state.isEditing ? (
        <form onSubmit={(e: any) => {
          e.preventDefault();
          updateUser(state.formData);
        }>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              type="text"
              value={state.formData.firstName || ''}
              onChange={(e: any) => setState(prev => ({
                ...prev,
                formData: { ...prev.formData, firstName: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              type="text"
              value={state.formData.lastName || ''}
              onChange={(e: any) => setState(prev => ({
                ...prev,
                formData: { ...prev.formData, lastName: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={state.formData.roles?.[0] || ''}
              onChange={handleRoleChange}
            >
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={state.formData.status || ''}
              onChange={(e: any) => setState(prev => ({
                ...prev,
                formData: { ...prev.formData, status: e.target.value as UserStatus }
              }))}
            >
              {Object.values(UserStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setState(prev => ({
              ...prev,
              isEditing: false,
              formData: prev.user.data || {}
            }))}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setState(prev => ({
          ...prev,
          isEditing: true
        }))}>
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default UserProfile;