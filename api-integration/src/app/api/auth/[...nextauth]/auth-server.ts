/**
 * Server-only Auth Helpers
 * 
 * These helpers provide server-side authentication functionality
 * and should never be imported from client components.
 */

import { cookies } from 'next/headers';
import { signIn as amplifySignIn, getCurrentUser } from 'aws-amplify/auth';
import { serverCache } from '@/utils/server/serverCache';

// Mark this file as server-only to prevent client imports
import 'server-only';

// Import session type
import type { Session } from '@/types/next-route-handlers';

/**
 * Get current session (server-side only)
 */
// Use React's cache directly to avoid server action requirements
import { cache } from 'react';

export const getServerAuthSession = cache(async (): Promise<Session | null> => {
  try {
    // Try to get JWT from cookies
    const cookiesStore = await cookies();
    const sessionCookie = cookiesStore.get('next-auth.session-token');
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    // Use AWS Amplify getCurrentUser to validate session
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }
    
    // Build session object
    return {
      user: {
        id: user.userId,
        name: user.username,
        email: user.signInDetails?.loginId,
        role: user.roles?.[0] || 'USER',
      },
      expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(), // 30 days
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
});

/**
 * Server-side sign in
 */
export async function serverSignIn(
  username: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!username || !password) {
      return { ok: false, error: 'Username and password are required' };
    }
    
    // Sign in with AWS Cognito
    const signInResult = await amplifySignIn({ username, password });
    
    if (signInResult.isSignedIn) {
      return { ok: true };
    } else {
      return { ok: false, error: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Server sign in error:', error);
    return { 
      ok: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

/**
 * Delete session cookies (server-side only)
 */
export async function deleteSessionCookies(): Promise<void> {
  const cookiesStore = await cookies();
  cookiesStore.delete('next-auth.session-token');
  cookiesStore.delete('__Secure-next-auth.session-token');
}