// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extend the User type to include custom fields
   */
  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    roles: string[];
    role?: string; // For backward compatibility
    mfaEnabled?: boolean;
    mfaSecret?: string;
    organisationId?: string;
  }

  /**
   * Extend the Session type to include custom fields
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      roles: string[];
      role: string; // For backward compatibility
      mfaEnabled: boolean;
    } & DefaultSession['user'];
    accessToken: string;
    refreshToken: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extend the JWT type to include custom fields
   */
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    roles: string[];
    role: string; // For backward compatibility
    mfaEnabled: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    provider?: string;
    error?: string;
    organisationId?: string;
  }
}