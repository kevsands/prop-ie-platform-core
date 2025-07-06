/**
 * Server-only helpers for Next.js API routes
 * 
 * This file contains functions that use server-only APIs like cookies() and headers()
 * and should never be imported from client components.
 */

import { cookies, headers } from 'next/headers';

// Mark this file as server-only to prevent client imports
import 'server-only';

/**
 * Get all cookies from the request
 */
export async function getAllCookies() {
  const cookiesStore = await cookies();
  return Object.fromEntries(cookiesStore.getAll().map(cookie => [cookie.name, cookie.value]));
}

/**
 * Get all headers from the request
 */
export async function getAllHeaders() {
  const headersStore = await headers();
  return Object.fromEntries(headersStore.entries());
}

/**
 * Get CSRF token from headers
 */
export async function getCsrfToken() {
  const headersStore = await headers();
  return headersStore.get('x-csrf-token');
}

/**
 * Delete authentication cookies
 */
export async function deleteAuthCookies() {
  const cookiesStore = await cookies();
  cookiesStore.delete('next-auth.session-token');
  cookiesStore.delete('__Secure-next-auth.session-token');
}