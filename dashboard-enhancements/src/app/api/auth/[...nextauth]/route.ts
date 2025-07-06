/**
 * NextAuth API Route Handler for Next.js App Router
 * 
 * This implementation is compatible with Next.js 15.3.1 and AWS Amplify v6.
 * It avoids using React.cache directly which causes issues with the build process.
 * 
 * Based on the NextAuth.js App Router integration, but modified to work with AWS Amplify.
 */

import { NextRequest, NextResponse } from 'next/server';
import { signIn, signOut, getProviders } from './auth-helpers';
import { getAllHeaders, getCsrfToken, deleteAuthCookies } from './server-helpers';
import { getServerAuthSession } from './auth-server';

// Environment check to avoid client-side imports
if (typeof window !== 'undefined') {
  throw new Error('This file should not be imported on the client side');
}

/**
 * Handle NextAuth GET requests
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  // Get headers using server-only helper if needed
  // const headersList = getAllHeaders();
  
  try {
    switch (action) {
      case 'signin':
        // Handle sign-in request
        const provider = searchParams.get('provider');
        const callbackUrl = searchParams.get('callbackUrl') || '/';
        
        if (!provider) {
          return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
        }
        
        const result = await signIn(provider, {
          redirect: false,
          callbackUrl: callbackUrl,
        });
        
        if (result?.url) {
          return NextResponse.redirect(result.url);
        }
        
        return NextResponse.json(result);
        
      case 'signout':
        // Handle sign-out request
        await signOut({
          redirect: false,
          callbackUrl: searchParams.get('callbackUrl') || '/',
        });
        
        // Clear auth cookies using server-only helper
        deleteAuthCookies();
        
        if (searchParams.get('callbackUrl')) {
          return NextResponse.redirect(searchParams.get('callbackUrl') as string);
        }
        
        return NextResponse.json({ success: true });
        
      case 'providers':
        // Return list of providers
        const providers = await getProviders();
        return NextResponse.json(providers);
        
      case 'session':
        // Return current session
        const session = await getServerAuthSession();
        return NextResponse.json(session);
        
      default:
        // Default action
        return NextResponse.json({ 
          message: 'NextAuth API route',
          providers: await getProviders(),
          csrfToken: getCsrfToken()
        });
    }
  } catch (error) {
    console.error('NextAuth API error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred', 
        message: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}

/**
 * Handle NextAuth POST requests
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as { 
      action?: string; 
      provider?: string;
      credentials?: Record<string, unknown>;
    };
    const action = body.action;
    
    switch (action) {
      case 'signin':
        // Handle sign-in request
        const provider = body.provider;
        const credentials = body.credentials || {};
        
        if (!provider) {
          return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
        }
        
        const result = await signIn(provider, {
          redirect: false,
          ...credentials
        });
        
        return NextResponse.json(result);
        
      case 'callback':
        // This would normally handle OAuth callbacks
        return NextResponse.json({ 
          message: 'Auth callback should be handled by the appropriate auth provider' 
        });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('NextAuth API error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred', 
        message: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}

// Default GET handler
export const runtime = 'nodejs';