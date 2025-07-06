// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extend the User type to include custom fields
   */
  interface User extends DefaultUser {
    role?: string;
    organisationId?: string;
    accessToken?: string;
  }

  /**
   * Extend the Session type to include custom fields
   */
  interface Session extends DefaultSession {
    user: User & DefaultSession['user'];
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extend the JWT type to include custom fields
   */
  interface JWT {
    id?: string;
    role?: string;
    organisationId?: string;
    accessToken?: string;
  }
}