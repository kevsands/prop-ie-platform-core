'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

type Role = 'guest' | 'buyer' | 'agent' | 'solicitor' | 'developer' | 'admin';

interface UserRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const defaultContext: UserRoleContextType = {
  role: 'guest',
  setRole: () => {}
};

const UserRoleContext = createContext<UserRoleContextType>(defaultContext);

export const useUserRole = () => useContext(UserRoleContext);

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('guest');
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();

  useEffect(() => {
    if (!authIsLoading) {
      if (isAuthenticated && user && user.roles && user.roles.length > 0) {
        const authenticatedUserRole = user.roles[0].toLowerCase() as Role;
        if (['guest', 'buyer', 'agent', 'solicitor', 'developer', 'admin'].includes(authenticatedUserRole)) {
          setRole(authenticatedUserRole);
        } else {
          console.warn(`Unrecognized role: ${user.roles[0]}, defaulting to guest.`);
          setRole('guest');
        }
      } else {
        setRole('guest');
      }
    }
  }, [user, isAuthenticated, authIsLoading]);

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}; 