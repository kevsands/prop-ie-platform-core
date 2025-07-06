'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

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

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}; 