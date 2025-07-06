/**
 * Typed GraphQL Example
 * 
 * This file demonstrates how to properly use the centralized type system
 * with GraphQL operations throughout the application.
 */

import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';

// Import generated types (these would be automatically generated)
// This is a mock example of what would be generated
import { 
  GetUserQuery, 
  GetUserQueryVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UserFragment,
  UserStatus,
  UserRole
} from '../types/generated/graphql';

// Import domain models
import { 
  DeepPartial,
  FormErrors,
  ValidationError  
} from '../types/utils';

// Define GraphQL fragments with proper typing
const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    firstName
    lastName
    fullName
    phone
    roles
    status
    kycStatus
    organization
    position
    avatar
    created
    lastActive
    lastLogin
  }
`;

// Define GraphQL queries with proper typing
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

// Define GraphQL mutations with proper typing
const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

// Component props with proper typing
interface UserProfileProps {
  userId: string;
  onUserUpdated?: (user: UserFragment) => void;
}

// Example component using GraphQL with proper typing
const UserProfileGraphQL: React.FC<UserProfileProps> = ({ 
  userId, 
  onUserUpdated 
}) => {
  // State for edit mode and form data
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DeepPartial<UserFragment>>({});
  const [formErrors, setFormErrors] = useState<FormErrors<UserFragment>>({});

  // Type-safe GraphQL query
  const { data, loading, error, refetch } = useQuery<
    GetUserQuery, 
    GetUserQueryVariables
  >(GET_USER, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network'
  });

  // Type-safe GraphQL mutation
  const [updateUser, { loading: updating }] = useMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(UPDATE_USER);

  // Type-safe form handling
  const handleInputChange = (field: keyof UserFragment, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when value changes
    if (formErrors[field]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Type-safe form validation
  const validateForm = (): boolean => {
    const errors: FormErrors<UserFragment> = {};
    
    if (!formData.firstName || formData.firstName.trim() === '') {
      errors.firstName = ['First name is required'];
    }
    
    if (!formData.lastName || formData.lastName.trim() === '') {
      errors.lastName = ['Last name is required'];
    }
    
    if (!formData.email || !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
      errors.email = ['Valid email is required'];
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Type-safe form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await updateUser({
        variables: {
          id: userId,
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            roles: formData.roles as UserRole[],
            status: formData.status as UserStatus,
            organization: formData.organization,
            position: formData.position,
            avatar: formData.avatar
          }
        }
      });
      
      if (result.data?.updateUser) {
        setIsEditing(false);
        
        // Notify parent component
        if (onUserUpdated) {
          onUserUpdated(result.data.updateUser);
        }
        
        // Refresh data
        refetch();
      }
    } catch (error) {
      // Handle GraphQL error and extract validation errors if available
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const gqlError = error.graphQLErrors[0];
        
        if (gqlError.extensions?.validationErrors) {
          const validationErrors = gqlError.extensions.validationErrors as ValidationError[];
          const fieldErrors: FormErrors<UserFragment> = {};
          
          validationErrors.forEach(err => {
            const field = err.field as keyof UserFragment;
            if (!fieldErrors[field]) {
              fieldErrors[field] = [];
            }
            fieldErrors[field]!.push(err.message);
          });
          
          setFormErrors(fieldErrors);
        }
      }
      
      console.error('Error updating user:', error);
    }
  };

  // Enable edit mode
  const handleEdit = () => {
    setFormData(data?.user || {});
    setFormErrors({});
    setIsEditing(true);
  };

  // Cancel edit mode
  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
  };

  // Loading state
  if (loading && !data) {
    return <div>Loading user data...</div>;
  }

  // Error state
  if (error) {
    return <div>Error loading user: {error.message}</div>;
  }

  // No data state
  if (!data?.user) {
    return <div>User not found</div>;
  }

  const user = data.user;

  return (
    <div className="user-profile">
      {!isEditing ? (
        // Read-only view
        <div className="user-details">
          <h2>{user.fullName}</h2>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone || 'Not provided'}</p>
          <p>Status: {user.status}</p>
          <p>Roles: {user.roles.join(', ')}</p>
          <p>Organization: {user.organization || 'Not provided'}</p>
          <p>Position: {user.position || 'Not provided'}</p>
          <p>Last active: {new Date(user.lastActive).toLocaleString()}</p>
          
          <button 
            onClick={handleEdit} 
            disabled={updating}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        // Edit form
        <form onSubmit={handleSubmit} className="user-edit-form">
          <h2>Edit Profile</h2>
          
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={formErrors.firstName ? 'error' : ''}
            />
            {formErrors.firstName && (
              <div className="error-message">{formErrors.firstName[0]}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={formErrors.lastName ? 'error' : ''}
            />
            {formErrors.lastName && (
              <div className="error-message">{formErrors.lastName[0]}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={formErrors.email ? 'error' : ''}
            />
            {formErrors.email && (
              <div className="error-message">{formErrors.email[0]}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={formErrors.phone ? 'error' : ''}
            />
            {formErrors.phone && (
              <div className="error-message">{formErrors.phone[0]}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status || user.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className={formErrors.status ? 'error' : ''}
            >
              {Object.values(UserStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {formErrors.status && (
              <div className="error-message">{formErrors.status[0]}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="organization">Organization</label>
            <input
              id="organization"
              type="text"
              value={formData.organization || ''}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              className={formErrors.organization ? 'error' : ''}
            />
            {formErrors.organization && (
              <div className="error-message">{formErrors.organization[0]}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              id="position"
              type="text"
              value={formData.position || ''}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className={formErrors.position ? 'error' : ''}
            />
            {formErrors.position && (
              <div className="error-message">{formErrors.position[0]}</div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              disabled={updating}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfileGraphQL;