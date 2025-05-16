// src/types/user.ts
export interface UserDetails {
    id: string;
    email: string;
    name?: string;
    // Other user properties
  }
  
  export interface User {
    id: string;
    email: string;
    role: string;
    user?: UserDetails; // This addresses the user.user error
  }