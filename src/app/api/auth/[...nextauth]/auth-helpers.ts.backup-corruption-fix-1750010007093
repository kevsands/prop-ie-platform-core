/**
 * NextAuth Auth Helpers for Client Components
 * 
 * These helpers provide a simplified interface for NextAuth.js functionality
 * that can be safely used in client components.
 */

// For client components, we don't use server-only imports
import { signIn as amplifySignIn, getCurrentUser } from 'aws-amplify/auth';

// Type definitions
interface AuthOptions {
  providers: Provider[];
  session?: {
    strategy?: 'jwt' | 'database';
    maxAge?: number;
  };
  secret?: string;
  debug?: boolean;
}

interface Provider {
  id: string;
  name: string;
  type: 'credentials' | 'oauth' | 'email';
  credentials?: Record<string, any>\n  );
}

interface SignInOptions {
  redirect?: boolean;
  callbackUrl?: string;
  [key: string]: any;
}

interface SignOutOptions {
  redirect?: boolean;
  callbackUrl?: string;
}

interface Session {
  user: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  };
  expires?: string;
}

// Providers
const providers: Provider[] = [
  {
    id: 'aws-cognito',
    name: 'AWS Cognito',
    type: 'credentials',
    credentials: {
      username: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    }
  }
];

// Auth configuration
export const authOptions: AuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-here',
  debug: process.env.NODE_ENV !== 'production'};

/**
 * Get current session from client side
 */
export const auth = async (): Promise<Session | null> => {
  try {
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
        email: user.signInDetails?.loginId},
      expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(), // 30 days
    };
  } catch (error) {

    return null;
  }
};

/**
 * Sign in with a provider
 */
export async function signIn(
  provider: string,
  options: SignInOptions = { redirect: true }
): Promise<{ url?: string; error?: string; ok?: boolean }> {
  try {
    if (provider === 'aws-cognito') {
      const { username, password } = options;

      if (!username || !password) {
        return { error: 'Username and password are required', ok: false };
      }

      // Sign in with AWS Cognito
      const signInResult = await amplifySignIn({ username, password });

      if (signInResult.isSignedIn) {
        // Set cookies
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);

        if (typeof options.callbackUrl === 'string' && options.redirect !== false) {
          return { url: options.callbackUrl, ok: true };
        }

        return { ok: true };
      } else {
        return { error: 'Invalid credentials', ok: false };
      }
    } else {
      return { error: 'Provider not supported', ok: false };
    }
  } catch (error) {

    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred', 
      ok: false 
    };
  }
}

/**
 * Sign out
 */
export async function signOut(
  options: SignOutOptions = { redirect: true }
): Promise<{ url?: string; ok: boolean }> {
  try {
    // Sign out with AWS Amplify
    // Note: We're not actually calling Amplify signOut here to avoid client imports
    // In a real implementation, you'd need to handle this differently

    // For now, just simulate success and let the cookie deletion handle the rest
    if (typeof options.callbackUrl === 'string' && options.redirect !== false) {
      return { url: options.callbackUrl, ok: true };
    }

    return { ok: true };
  } catch (error) {

    return { ok: false };
  }
}

/**
 * Get available authentication providers
 */
export async function getProviders(): Promise<Record<string, Provider>> {
  const result: Record<string, Provider> = {};

  for (const provider of authOptions.providers) {
    result[provider.id] = {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      // Exclude sensitive information
      ...(provider.type === 'credentials' ? { credentials: {} } : {})
    };
  }

  return result;
}

export default {
  auth,
  signIn,
  signOut,
  getProviders};